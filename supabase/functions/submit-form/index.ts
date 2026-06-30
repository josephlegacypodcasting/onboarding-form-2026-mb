import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const WEBHOOK_URL =
  "https://sephar2447.app.n8n.cloud/webhook/6dbb80e4-545c-4f0b-9151-563a0bea6ac5";

const SLACK_NOTIFICATION_DESTINATION = Deno.env.get("SLACK_NOTIFICATION_DESTINATION") || "D09J1HN5KL5";
const SLACK_GATEWAY_URL = "https://connector-gateway.lovable.dev/slack/api";

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
}): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("submission_logs")
      .insert({
        payload: log.payload,
        status: log.status,
        attempts: log.attempts,
        webhook_status_code: log.webhook_status_code ?? null,
        webhook_response: log.webhook_response ?? null,
        error_message: log.error_message ?? null,
      })
      .select("id")
      .single();
    if (error) {
      console.error("Failed to save submission log:", error.message);
      return null;
    }
    console.log(`Submission log saved (status: ${log.status})`);
    return data?.id ?? null;
  } catch (err) {
    console.error("Error saving submission log:", err);
    return null;
  }
}

function buildLogViewUrl(logId: string | null): string | null {
  if (!logId) return null;
  const baseUrl = Deno.env.get("SUPABASE_URL");
  if (!baseUrl) return null;
  return `${baseUrl}/functions/v1/view-submission?id=${logId}`;
}

async function sendSlackSubmissionNotification(
  payload: Record<string, unknown>,
  logViewUrl: string | null
) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const SLACK_API_KEY = Deno.env.get("SLACK_API_KEY");

  if (!LOVABLE_API_KEY || !SLACK_API_KEY) {
    console.warn("LOVABLE_API_KEY or SLACK_API_KEY not configured, skipping Slack notification");
    return;
  }

  const name = (payload.name as string) || "N/A";
  const email = (payload.email as string) || "N/A";
  const companyName = (payload.company_name as string) || "N/A";
  const legalName = (payload.legal_name as string) || companyName;
  const website = (payload.website as string) || "N/A";
  const phone = (payload.phone as string) || "N/A";
  const paymentMethod = (payload.payment_method as string) || "N/A";
  const submittedAt = (payload.submitted_at as string) || new Date().toISOString();
  const formType = (payload.form_type as string) || "Client Onboarding Form";

  const lines = [
    `*New ${formType} submission*`,
    ``,
    `*Name:* ${name}`,
    `*Email:* ${email}`,
    `*Phone:* ${phone}`,
    `*Company:* ${companyName}`,
    `*Legal Name:* ${legalName}`,
    `*Website:* ${website}`,
    `*Payment Method:* ${paymentMethod}`,
    `*Submitted At:* ${submittedAt}`,
  ];

  const extraFields = [
    "core_problem",
    "decision_maker_titles",
    "icp_1",
    "icp_2",
    "offer_icp_1",
    "offer_icp_2",
    "target_company_size",
    "target_geography",
    "unique_expertise",
    "differentiator",
    "top_social_channels",
    "brand_voice",
    "key_topics",
    "has_blog",
    "has_newsletter",
    "sales_process",
    "additional_info",
  ];

  for (const key of extraFields) {
    const value = payload[key];
    if (value === undefined || value === null || value === "") continue;
    const label = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    const display = Array.isArray(value) ? value.join(", ") : String(value);
    lines.push(`*${label}:* ${display}`);
  }

  if (logViewUrl) {
    lines.push(``);
    lines.push(`📄 *View full responses:* <${logViewUrl}|Open response log>`);
  }

  const messageText = lines.join("\n");

  try {
    const res = await fetch(`${SLACK_GATEWAY_URL}/chat.postMessage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": SLACK_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: SLACK_NOTIFICATION_DESTINATION,
        text: messageText,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      console.error("Slack notification error:", data.error || res.statusText);
    } else {
      console.log("Slack submission notification sent successfully");
    }
  } catch (err) {
    console.error("Failed to send Slack submission notification:", err);
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
    let lastStatusCode: number | null = null;
    let lastResponseText: string | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const { response, responseText } = await callWebhook(body);
        lastStatusCode = response.status;
        lastResponseText = responseText;

        if (response.ok) {
          console.log(`Success on attempt ${attempt}`);
          const logId = await saveSubmissionLog({
            payload: body,
            status: "success",
            attempts: attempt,
            webhook_status_code: response.status,
            webhook_response: responseText,
          });
          await sendSlackSubmissionNotification(body, buildLogViewUrl(logId));
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
    await saveSubmissionLog({
      payload: body,
      status: "failed",
      attempts: MAX_RETRIES,
      webhook_status_code: lastStatusCode,
      webhook_response: lastResponseText,
      error_message: lastError,
    });
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
