import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WEBHOOK_URL =
  "https://sephar2447.app.n8n.cloud/webhook/9724150f-acda-4c57-a463-b04964d628a4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

async function checkSubmitForm(): Promise<{ ok: boolean; detail: string }> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-form`, {
      method: "OPTIONS",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
    });
    return {
      ok: res.ok || res.status === 204,
      detail: `HTTP ${res.status}`,
    };
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : String(err) };
  }
}

async function checkN8nWebhook(): Promise<{ ok: boolean; detail: string }> {
  try {
    const res = await fetch(WEBHOOK_URL, { method: "GET" });
    const text = await res.text();
    // n8n returns 404 "not registered for GET" when webhook is alive but only accepts POST.
    // We treat anything < 500 (including that 404) as "reachable".
    const reachable = res.status < 500;
    return {
      ok: reachable,
      detail: `HTTP ${res.status}${text ? ` — ${text.slice(0, 120)}` : ""}`,
    };
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : String(err) };
  }
}

async function sendSlack(allOk: boolean, lines: string[]) {
  const SLACK_BOT_TOKEN = Deno.env.get("SLACK_BOT_TOKEN");
  const SLACK_NOTIFY_USER_ID = Deno.env.get("SLACK_NOTIFY_USER_ID");
  if (!SLACK_BOT_TOKEN || !SLACK_NOTIFY_USER_ID) {
    console.warn("Slack secrets missing");
    return;
  }

  const bogota = new Date().toLocaleString("es-CO", {
    timeZone: "America/Bogota",
    dateStyle: "full",
    timeStyle: "short",
  });

  const header = allOk
    ? "✅ Health check OK — la app está funcionando"
    : "🚨 Health check FALLÓ — revisa la app";

  const text = `${header}\n*Fecha (Bogotá):* ${bogota}\n\n${lines.join("\n")}`;

  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ channel: SLACK_NOTIFY_USER_ID, text }),
  });
  const data = await res.json();
  if (!data.ok) console.error("Slack error:", data.error);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const [submitForm, n8n] = await Promise.all([checkSubmitForm(), checkN8nWebhook()]);
  const allOk = submitForm.ok && n8n.ok;

  const lines = [
    `${submitForm.ok ? "✅" : "❌"} *Edge Function (submit-form):* ${submitForm.detail}`,
    `${n8n.ok ? "✅" : "❌"} *Webhook n8n:* ${n8n.detail}`,
  ];

  await sendSlack(allOk, lines);

  return new Response(
    JSON.stringify({ ok: allOk, checks: { submitForm, n8n } }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
  );
});
