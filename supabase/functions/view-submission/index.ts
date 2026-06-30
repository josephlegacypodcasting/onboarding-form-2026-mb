import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function humanizeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function isUrl(value: string): boolean {
  return /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(value.trim());
}

function renderValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return `<span class="empty">—</span>`;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return `<span class="empty">—</span>`;
    return `<ul class="list">${value
      .map((v) => `<li>${renderValue(v)}</li>`)
      .join("")}</ul>`;
  }
  if (typeof value === "object") {
    return `<pre class="json">${escapeHtml(
      JSON.stringify(value, null, 2)
    )}</pre>`;
  }
  const str = String(value);
  if (isUrl(str)) {
    const href = /^https?:\/\//i.test(str) ? str : `https://${str}`;
    return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
      str
    )}</a>`;
  }
  return escapeHtml(str).replace(/\n/g, "<br/>");
}

const PRIORITY_FIELDS = [
  "form_type",
  "name",
  "email",
  "phone",
  "company_name",
  "legal_name",
  "website",
  "payment_method",
  "submitted_at",
];

const HIDDEN_FIELDS = new Set(["form_type"]);

function buildHtml(row: any): string {
  const payload: Record<string, unknown> = row.payload ?? {};
  const formType = (payload.form_type as string) || "Client Onboarding Form";
  const name = (payload.name as string) || "Unknown";
  const company = (payload.company_name as string) || "";
  const submittedAt =
    (payload.submitted_at as string) || row.created_at || "";

  const orderedKeys: string[] = [];
  for (const key of PRIORITY_FIELDS) {
    if (key in payload && !HIDDEN_FIELDS.has(key)) orderedKeys.push(key);
  }
  for (const key of Object.keys(payload)) {
    if (!orderedKeys.includes(key) && !HIDDEN_FIELDS.has(key)) {
      orderedKeys.push(key);
    }
  }

  const rows = orderedKeys
    .map(
      (key) => `
      <div class="row">
        <div class="label">${escapeHtml(humanizeKey(key))}</div>
        <div class="value">${renderValue(payload[key])}</div>
      </div>`
    )
    .join("");

  const statusBadge =
    row.status === "success"
      ? `<span class="badge ok">Delivered</span>`
      : `<span class="badge fail">${escapeHtml(row.status || "unknown")}</span>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex, nofollow"/>
<title>${escapeHtml(formType)} — ${escapeHtml(name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet"/>
<style>
  :root{
    --primary:#2755EB; --text:#32475D; --bg:#F9FBFC; --card:#FFFFFF;
    --border:#E3E8EF; --muted:#7A8AA0;
  }
  *{box-sizing:border-box;}
  body{margin:0;font-family:'Roboto',-apple-system,Segoe UI,sans-serif;background:var(--bg);color:var(--text);line-height:1.5;}
  .wrap{max-width:780px;margin:0 auto;padding:32px 20px 64px;}
  header{background:var(--primary);color:#fff;border-radius:14px;padding:28px 28px;margin-bottom:24px;box-shadow:0 8px 24px rgba(39,85,235,.18);}
  header .type{font-size:13px;letter-spacing:.06em;text-transform:uppercase;opacity:.85;margin-bottom:6px;}
  header h1{margin:0;font-size:26px;font-weight:700;}
  header .sub{margin-top:8px;font-size:15px;opacity:.92;}
  .meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px;align-items:center;}
  .badge{display:inline-block;font-size:12px;font-weight:500;padding:4px 10px;border-radius:999px;}
  .badge.ok{background:rgba(255,255,255,.2);color:#fff;}
  .badge.fail{background:#FDECEC;color:#C0392B;}
  .meta .stamp{font-size:13px;opacity:.9;}
  .card{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;}
  .row{display:grid;grid-template-columns:220px 1fr;gap:16px;padding:16px 24px;border-bottom:1px solid var(--border);}
  .row:last-child{border-bottom:none;}
  .row:nth-child(odd){background:#FCFDFE;}
  .label{font-weight:500;color:var(--muted);font-size:14px;}
  .value{font-size:15px;word-break:break-word;}
  .value a{color:var(--primary);text-decoration:none;}
  .value a:hover{text-decoration:underline;}
  .empty{color:#BBC4D0;}
  .list{margin:0;padding-left:18px;}
  .json{background:#F4F6FA;border-radius:8px;padding:12px;font-size:13px;overflow:auto;margin:0;}
  footer{text-align:center;margin-top:28px;font-size:13px;color:var(--muted);}
  @media(max-width:560px){.row{grid-template-columns:1fr;gap:4px;}}
</style>
</head>
<body>
  <div class="wrap">
    <header>
      <div class="type">${escapeHtml(formType)}</div>
      <h1>${escapeHtml(name)}</h1>
      ${company ? `<div class="sub">${escapeHtml(company)}</div>` : ""}
      <div class="meta">
        ${statusBadge}
        ${submittedAt ? `<span class="stamp">Submitted: ${escapeHtml(
          new Date(submittedAt).toLocaleString("en-US", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" })
        )} UTC</span>` : ""}
      </div>
    </header>
    <div class="card">
      ${rows}
    </div>
    <footer>Client response log · ID ${escapeHtml(row.id)}</footer>
  </div>
</body>
</html>`;
}

function errorHtml(message: string, status: number): Response {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Not available</title>
<style>body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#F9FBFC;color:#32475D;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;}
.box{text-align:center;max-width:420px;padding:32px;}h1{color:#2755EB;font-size:22px;}</style>
</head><body><div class="box"><h1>Response not found</h1><p>${escapeHtml(message)}</p></div></body></html>`;
  return new Response(html, {
    status,
    headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
      return errorHtml("This link is invalid or incomplete.", 400);
    }

    const { data, error } = await supabaseAdmin
      .from("submission_logs")
      .select("id, payload, status, created_at")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return errorHtml("This response may have been removed or the link is incorrect.", 404);
    }

    return new Response(buildHtml(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("view-submission error:", err);
    return errorHtml("Something went wrong while loading this response.", 500);
  }
});
