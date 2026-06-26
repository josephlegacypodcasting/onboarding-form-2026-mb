import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const WEBHOOK_URL =
  "https://sephar2447.app.n8n.cloud/webhook/6dbb80e4-545c-4f0b-9151-563a0bea6ac5";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

async function saveSubmissionLog(log: {
  payload: Record<string, unknown>;
  status: string;
  attempts: number;
  webhook_status_code?: number | null;
  webhook_response?: string | null;
  error_message?: string | null;
}) {
  try {
    const { error } = await supabaseAdmin.from("submission_logs").insert({
      payload: log.payload,
      status: log.status,
      attempts: log.attempts,
      webhook_status_code: log.webhook_status_code ?? null,
      webhook_response: log.webhook_response ?? null,
      error_message: log.error_message ?? null,
    });
    if (error) {
      console.error("Failed to save submission log:", error.message);
    } else {
      console.log(`Submission log saved (status: ${log.status})`);
    }
  } catch (err) {
    console.error("Error saving submission log:", err);
  }
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendSlackErrorNotification(errorMessage: string, payload: Record<string, unknown>) {
  const SLACK_BOT_TOKEN = Deno.env.get("SLACK_BOT_TOKEN");
  const SLACK_NOTIFY_USER_ID = Deno.env.get("SLACK_NOTIFY_USER_ID");

  if (!SLACK_BOT_TOKEN || !SLACK_NOTIFY_USER_ID) {
    console.warn("SLACK_BOT_TOKEN or SLACK_NOTIFY_USER_ID not configured, skipping Slack notification");
    return;
  }

  try {
    const email = (payload.email as string) || "unknown";
    const contentType = (payload.content_type as string) || "unknown";
    const submittedAt = (payload.submitted_at as string) || new Date().toISOString();

    const slackPayload = {
      channel: SLACK_NOTIFY_USER_ID,
      text: `🚨 Form submission failed`,
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: "🚨 Form Submission Error", emoji: true },
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Email:*\n${email}` },
            { type: "mrkdwn", text: `*Content Type:*\n${contentType}` },
          ],
        },
        {
          type: "section",
          fields: [{ type: "mrkdwn", text: `*Time:*\n${submittedAt}` }],
        },
        {
          type: "section",
          text: { type: "mrkdwn", text: `*Error:*\n\`\`\`${errorMessage}\`\`\`` },
        },
      ],
    };

    const res = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(slackPayload),
    });

    const data = await res.json();
    if (!data.ok) {
      console.error("Slack postMessage error:", data.error);
    } else {
      console.log("Slack DM notification sent successfully");
    }
  } catch (err) {
    console.error("Failed to send Slack notification:", err);
  }
}

async function callWebhook(body: Record<string, unknown>): Promise<{ response: Response; responseText: string }> {
  let response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let responseText = await response.text();
  console.log("n8n response status:", response.status);

  const indicatesGetOnly =
    response.status === 404 &&
    /not registered for POST requests/i.test(responseText);

  if (!response.ok && indicatesGetOnly) {
    const url = new URL(WEBHOOK_URL);
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(body ?? {})) {
      if (value === null || value === undefined) {
        params.set(key, "");
      } else if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        params.set(key, String(value));
      } else {
        params.set(key, JSON.stringify(value));
      }
    }

    url.search = params.toString();
    console.log("Retrying as GET (POST not registered)");

    response = await fetch(url.toString(), { method: "GET" });
    responseText = await response.text();
    console.log("n8n GET status:", response.status);
  }

  return { response, responseText };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Submitting to n8n webhook");

    let lastError: string = "";

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const { response, responseText } = await callWebhook(body);

        if (response.ok) {
          console.log(`Success on attempt ${attempt}`);
          return new Response(
            JSON.stringify({ success: true, message: "Form submitted successfully" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            }
          );
        }

        lastError = `Webhook returned ${response.status}: ${responseText}`;
        console.warn(`Attempt ${attempt}/${MAX_RETRIES} failed: ${lastError}`);
      } catch (fetchErr) {
        lastError = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
        console.warn(`Attempt ${attempt}/${MAX_RETRIES} error: ${lastError}`);
      }

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }

    console.error("All retries failed:", lastError);
    await sendSlackErrorNotification(lastError, body);

    return new Response(
      JSON.stringify({ success: false, error: lastError }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";

    await sendSlackErrorNotification(errorMsg, {});

    return new Response(
      JSON.stringify({ success: false, error: errorMsg }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
