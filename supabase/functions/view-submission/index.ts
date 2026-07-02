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

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ---------- Branded HTML rendering ----------

const MARKET_BETTER_LOGO_SVG = `<svg viewBox="0 0 387 221" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Market Better">
<g fill="#FFFFFF">
<path d="M215.6,26.76h-16.17c-5.89,0-10.68,4.79-10.68,10.68v70.55h15.18V40.16h11.67V26.76z"/>
<path d="M346.84,69.89c2.06-2.15,3.12-4.96,2.99-7.93c-0.14-3.21-0.37-5.76-0.71-7.6c-1.09-5.6-3.1-10.51-5.96-14.58 c-2.89-4.12-6.87-7.37-11.81-9.65c-4.9-2.26-10.21-3.41-15.77-3.41c-10.11,0-18.73,3.74-25.63,11.11 c-6.87,7.34-10.35,17.45-10.35,30.04c0,7.57,1.39,14.53,4.12,20.68c2.78,6.25,7,11.1,12.57,14.43c5.53,3.32,11.88,5,18.87,5 c6.23,0,11.89-1.33,16.84-3.96c4.94-2.62,8.92-6.06,11.86-10.25c2.11-3.11,3.87-7.39,5.23-12.72l0.45-1.76h-15.07l-0.35,0.9 c-1.96,5.05-4.44,8.66-7.36,10.74c-2.91,2.07-6.77,3.12-11.46,3.12c-3.86,0-7.33-0.92-10.31-2.73c-2.95-1.79-5.16-4.37-6.57-7.66 c-1.3-3.03-2.09-6.54-2.34-10.45h42.95C342.01,73.22,344.78,72.04,346.84,69.89z M334.37,60.26h-38.19 c0.75-6.06,2.84-10.83,6.23-14.18c3.69-3.65,8.05-5.42,13.32-5.42c5.45,0,9.75,1.7,13.17,5.2 C332.04,49.09,333.88,53.92,334.37,60.26z"/>
<path d="M127.88,103.53c5.02,2.96,10.45,4.46,16.14,4.46c5.42,0,10.31-1.29,14.52-3.82c2.04-1.24,4-2.92,5.85-5.05 v8.87h15.25V27.55h-14.22v8.57c-1.61-1.94-3.38-3.51-5.28-4.67c-4.12-2.59-9.11-3.9-14.81-3.9c-9.12,0-16.76,3.45-22.7,10.24 c-6.8,7.79-10.25,18.39-10.25,31.51c0,7.94,1.32,14.93,3.91,20.78C118.91,96.02,122.82,100.55,127.88,103.53z M127.82,68.69 c0-9.58,1.82-16.63,5.41-20.94c3.57-4.3,7.91-6.39,13.25-6.39c5.67,0,10.16,2.07,13.73,6.32c3.59,4.27,5.4,11.06,5.4,20.19 c0,8.94-1.9,15.64-5.66,19.93c-3.76,4.29-8.39,6.38-14.16,6.38c-5.26,0-9.46-1.95-12.85-5.95 C129.55,84.21,127.82,77.63,127.82,68.69z"/>
<g>
<path d="M306.69,139.76h-16.17c-5.89,0-10.68,4.79-10.68,10.68v70.55h15.18v-67.83h11.67V139.76z"/>
<path d="M52.57,145.01c-5.02-2.96-10.45-4.46-16.14-4.46c-5.42,0-10.31,1.29-14.52,3.82c-2.04,1.24-4,2.92-5.85,5.05 v-27.03H0.81v98.57h14.22v-8.54c1.61,1.94,3.38,3.51,5.28,4.67c4.12,2.59,9.11,3.9,14.81,3.9c9.12,0,16.76-3.45,22.7-10.24 c6.8-7.79,10.25-18.39,10.25-31.51c0-7.94-1.32-14.93-3.91-20.78C61.53,152.52,57.63,147.99,52.57,145.01z M52.62,179.85 c0,9.58-1.82,16.63-5.41,20.94c-3.57,4.3-7.91,6.39-13.25,6.39c-5.67,0-10.16-2.07-13.73-6.32c-3.59-4.27-5.4-11.06-5.4-20.19 c0-8.94,1.9-15.64,5.66-19.93c3.76-4.29,8.39-6.38,14.16-6.38c5.26,0,9.46,1.95,12.85,5.95C50.9,164.33,52.62,170.91,52.62,179.85 z"/>
<path d="M137.5,182.92c2.05-2.15,3.12-4.96,2.99-7.92c-0.14-3.2-0.37-5.76-0.71-7.6c-1.09-5.6-3.09-10.5-5.95-14.57 c-2.89-4.12-6.86-7.36-11.8-9.64c-4.9-2.26-10.2-3.4-15.76-3.4c-10.11,0-18.72,3.73-25.61,11.1 c-6.86,7.34-10.34,17.44-10.34,30.03c0,7.57,1.39,14.52,4.12,20.67c2.77,6.24,7,11.09,12.56,14.43 c5.53,3.31,11.88,4.99,18.86,4.99c6.23,0,11.89-1.33,16.83-3.96c4.93-2.62,8.91-6.06,11.85-10.25c2.1-3.11,3.87-7.39,5.23-12.71 l0.45-1.76h-15.06l-0.35,0.9c-1.96,5.05-4.43,8.66-7.36,10.74c-2.91,2.07-6.77,3.12-11.45,3.12c-3.86,0-7.32-0.92-10.3-2.72 c-2.95-1.79-5.16-4.37-6.57-7.66c-1.3-3.03-2.09-6.54-2.34-10.44h42.93C132.68,186.24,135.44,185.06,137.5,182.92z M125.03,173.28 H86.87c0.75-6.06,2.84-10.82,6.22-14.17c3.69-3.65,8.04-5.42,13.31-5.42c5.44,0,9.75,1.7,13.16,5.19 C122.71,162.12,124.55,166.96,125.03,173.28z"/>
<path d="M273.06,182.92c2.05-2.15,3.12-4.96,2.99-7.92c-0.14-3.21-0.38-5.76-0.71-7.6c-1.09-5.6-3.09-10.5-5.95-14.57 c-2.89-4.12-6.86-7.36-11.8-9.64c-4.9-2.26-10.2-3.4-15.76-3.4c-10.11,0-18.72,3.73-25.61,11.1 c-6.86,7.34-10.34,17.44-10.34,30.03c0,7.56,1.39,14.52,4.12,20.67c2.77,6.24,7,11.09,12.56,14.43 c5.53,3.31,11.88,4.99,18.86,4.99c6.23,0,11.89-1.33,16.83-3.96c4.93-2.62,8.91-6.06,11.85-10.25c2.1-3.11,3.86-7.39,5.23-12.71 l0.45-1.76h-15.06l-0.35,0.9c-1.96,5.05-4.43,8.66-7.36,10.74c-2.91,2.07-6.77,3.12-11.46,3.12c-3.86,0-7.32-0.92-10.3-2.72 c-2.95-1.79-5.16-4.37-6.57-7.66c-1.3-3.03-2.09-6.54-2.34-10.44h42.93C268.24,186.24,271.01,185.06,273.06,182.92z M260.6,173.28 h-38.17c0.75-6.06,2.83-10.82,6.22-14.17c3.69-3.65,8.04-5.42,13.31-5.42c5.44,0,9.75,1.7,13.16,5.19 C258.28,162.12,260.11,166.96,260.6,173.28z"/>
<path d="M196.87,152.9h11.67v-12.86h-11.67v-17.67h-4.49c-5.9,0-10.69,4.8-10.69,10.69v6.97h-18.71v-17.67h-4.49 c-5.9,0-10.69,4.8-10.69,10.69v6.97h-9.9v12.86h9.93v57.41c0,5.89,4.79,10.68,10.68,10.68h16.17v-13.41H163V152.9h18.69v57.41 c0,5.89,4.79,10.68,10.68,10.68h16.17v-13.41h-11.67V152.9z"/>
<path d="M311.91,202.66c-5.05,0-9.16,4.11-9.16,9.17s4.11,9.16,9.16,9.16s9.17-4.11,9.17-9.16 S316.96,202.66,311.91,202.66z"/>
</g>
<path d="M102.05,35.18c-1.97-2.48-4.81-4.62-8.45-6.38c-3.64-1.76-7.86-2.65-12.54-2.65c-4.95,0-9.34,1.06-13.03,3.16 c-3.15,1.79-6.3,4.65-9.39,8.5c-1.28-2.22-2.66-4.05-4.1-5.45c-1.9-1.85-4.39-3.37-7.41-4.51c-2.99-1.13-6.19-1.7-9.49-1.7 c-3.42,0-6.65,0.61-9.61,1.83c-2.93,1.2-5.61,2.88-7.98,4.99c-0.92,0.84-1.91,1.89-2.98,3.18V28.5H1.07v79.49h16.01V61.43 c0-5.78,1.8-10.76,5.34-14.79c3.54-4.03,7.7-5.99,12.72-5.99c3.55,0,6.16,0.96,8,2.95c1.84,1.99,2.78,5.32,2.78,9.9v54.49h16.01 V60.71c0-6.38,1.65-11.38,4.91-14.86c3.28-3.5,7.2-5.2,12-5.2c3.76,0,6.6,1.02,8.68,3.12c2.06,2.08,3.1,5.13,3.1,9.08v55.13h16.37 V55.57c0-5.4-0.32-9.41-0.97-12.26C105.35,40.39,104.02,37.65,102.05,35.18z"/>
<path d="M256.75,58.79L287.8,28.5h-20.74l-30.87,30.4V0.01h0c-8.49,0-15.37,6.88-15.37,15.37v92.62h15.37V78.38 l9.02-8.13l23.63,37.75h19.74L256.75,58.79z"/>
<path d="M374.29,39.9h11.9l0-12.86h-11.92V9.37h-4.49c-5.9,0-10.69,4.8-10.69,10.69v6.97h-9.9V39.9h9.93v57.41 c0,5.89,4.79,10.68,10.68,10.68h16.17V94.59h-11.67V39.9z"/>
</g>
</svg>`;

// Field groups mirror the 8 steps of the onboarding form.
const SECTIONS: { title: string; fields: string[] }[] = [
  {
    title: "Company Info",
    fields: ["name", "email", "phone", "address", "website", "social_links"],
  },
  {
    title: "Invoicing",
    fields: [
      "legal_name",
      "invoice_emails",
      "billing_email",
      "billing_company_name",
      "billing_address",
      "payment_method",
    ],
  },
  {
    title: "Business Summary",
    fields: [
      "icp_1",
      "icp_2",
      "offer_icp_1",
      "offer_icp_2",
      "differentiator",
      "core_problem",
      "sales_process",
    ],
  },
  {
    title: "Video Content",
    fields: ["camera_people", "unique_expertise", "key_topics", "topics_to_avoid"],
  },
  {
    title: "Socials & Content",
    fields: [
      "top_social_channels",
      "missing_channels",
      "has_blog",
      "blog_link",
      "has_newsletter",
      "newsletter_details",
      "brand_voice",
      "brand_voice_other",
    ],
  },
  {
    title: "Inbound Marketing",
    fields: ["traffic_destination", "lead_magnet", "existing_inbound_assets"],
  },
  {
    title: "Outbound Marketing",
    fields: [
      "testimonials",
      "case_studies",
      "target_company_size",
      "decision_maker_titles",
      "target_geography",
    ],
  },
  {
    title: "Additional Info",
    fields: ["additional_info"],
  },
];

const LABEL_OVERRIDES: Record<string, string> = {
  icp_1: "Primary ICP",
  icp_2: "Secondary ICP",
  offer_icp_1: "Offer for Primary ICP",
  offer_icp_2: "Offer for Secondary ICP",
  camera_people: "Who Will Be On Camera",
  key_topics: "Key Topics to Cover",
  topics_to_avoid: "Topics to Avoid",
  top_social_channels: "Top Social Channels",
  missing_channels: "Channels Not Currently Used",
  has_blog: "Has a Blog",
  has_newsletter: "Has a Newsletter",
  brand_voice: "Brand Voice",
  brand_voice_other: "Brand Voice (Other)",
  traffic_destination: "Where Traffic Should Go",
  lead_magnet: "Lead Magnet",
  existing_inbound_assets: "Existing Inbound Assets",
  target_company_size: "Target Company Size",
  decision_maker_titles: "Decision-Maker Titles",
  target_geography: "Target Geography",
  invoice_emails: "Invoice Emails",
  legal_name: "Full Legal Name",
  billing_company_name: "Billing Company Name (if different)",
};

const ALL_KNOWN_FIELDS = new Set(SECTIONS.flatMap((s) => s.fields));

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function humanize(key: string): string {
  if (LABEL_OVERRIDES[key]) return LABEL_OVERRIDES[key];
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function isUrl(value: string): boolean {
  return /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(value.trim());
}

function renderValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }
  if (Array.isArray(value)) {
    const items = value.filter((v) => v !== null && v !== undefined && v !== "");
    if (items.length === 0) return "";
    return `<ul class="value-list">${items
      .map((v) => `<li>${renderValue(v)}</li>`)
      .join("")}</ul>`;
  }
  const str = escapeHtml(String(value));
  if (isUrl(String(value))) {
    const href = /^https?:\/\//i.test(String(value))
      ? String(value)
      : `https://${value}`;
    return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${str}</a>`;
  }
  return str.replace(/\n/g, "<br/>");
}

function renderSection(
  title: string,
  fields: string[],
  payload: Record<string, unknown>
): string {
  const rows = fields
    .map((key) => {
      const rendered = renderValue(payload[key]);
      if (!rendered) return "";
      return `<div class="field-row">
        <div class="field-label">${escapeHtml(humanize(key))}</div>
        <div class="field-value">${rendered}</div>
      </div>`;
    })
    .filter(Boolean)
    .join("");

  if (!rows) return "";

  return `<section class="card">
    <h2>${escapeHtml(title)}</h2>
    ${rows}
  </section>`;
}

function renderHtmlDocument(log: {
  id: string;
  payload: Record<string, unknown>;
  status: string;
  created_at: string;
}): string {
  const payload = log.payload ?? {};
  const formType = (payload.form_type as string) || "Client Onboarding Form";
  const name = (payload.name as string) || "Client response";
  const company = (payload.company_name as string) || (payload.legal_name as string) || "";
  const submittedAtRaw = (payload.submitted_at as string) || log.created_at;
  const submittedAt = submittedAtRaw
    ? new Date(submittedAtRaw).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";
  const isSuccess = log.status === "success";

  const knownSections = SECTIONS.map((s) => renderSection(s.title, s.fields, payload)).join("");

  const extraKeys = Object.keys(payload).filter(
    (k) => !ALL_KNOWN_FIELDS.has(k) && !["form_type", "app_origin", "submitted_at", "name"].includes(k)
  );
  const extraSection = extraKeys.length ? renderSection("Other Details", extraKeys, payload) : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>${escapeHtml(name)} — ${escapeHtml(formType)}</title>
<style>
  :root {
    --mb-purple: #5B3FA0;
    --mb-purple-dark: #3E2A72;
    --mb-orange: #F04E23;
    --mb-cream: #F5F1E6;
    --mb-lavender: #E9E6F8;
    --mb-ink: #251C3D;
    --mb-muted: #6B647F;
    --mb-border: #E4DFEF;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--mb-cream);
    color: var(--mb-ink);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    max-width: 760px;
    margin: 0 auto;
    padding: 32px 20px 64px;
  }
  .toolbar {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-bottom: 16px;
  }
  .toolbar button {
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid var(--mb-border);
    background: #fff;
    color: var(--mb-purple);
    cursor: pointer;
  }
  .toolbar button:hover { background: var(--mb-lavender); }
  .hero {
    background: linear-gradient(135deg, var(--mb-purple) 0%, var(--mb-purple-dark) 100%);
    border-radius: 20px;
    padding: 32px 32px 28px;
    color: #fff;
    box-shadow: 0 12px 30px rgba(62, 42, 114, 0.25);
  }
  .hero .logo { width: 130px; height: auto; margin-bottom: 24px; display: block; }
  .hero .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 12px;
    font-weight: 700;
    opacity: 0.8;
    margin: 0 0 6px;
  }
  .hero h1 { font-size: 26px; margin: 0; font-weight: 700; }
  .hero .company { font-size: 15px; opacity: 0.9; margin-top: 4px; }
  .hero .meta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; align-items: center; }
  .badge {
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.18);
  }
  .badge.ok { background: rgba(255,255,255,0.22); }
  .badge.warn { background: var(--mb-orange); }
  .meta .timestamp { font-size: 13px; opacity: 0.85; }
  .card {
    background: #fff;
    border: 1px solid var(--mb-border);
    border-radius: 16px;
    padding: 24px 28px;
    margin-top: 20px;
  }
  .card h2 {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--mb-purple);
    margin: 0 0 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--mb-lavender);
  }
  .field-row {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 16px;
    padding: 10px 0;
  }
  .field-row + .field-row { border-top: 1px solid #F1EEFA; }
  .field-label { font-size: 13px; font-weight: 600; color: var(--mb-muted); }
  .field-value { font-size: 14px; line-height: 1.5; color: var(--mb-ink); word-wrap: break-word; }
  .field-value a { color: var(--mb-orange); font-weight: 600; text-decoration: none; }
  .field-value a:hover { text-decoration: underline; }
  .value-list { margin: 0; padding-left: 18px; }
  .value-list li { margin-bottom: 4px; }
  .footer {
    text-align: center;
    color: var(--mb-muted);
    font-size: 12px;
    margin-top: 28px;
  }
  @media (max-width: 560px) {
    .field-row { grid-template-columns: 1fr; gap: 4px; }
    .hero { padding: 24px 20px; }
  }
  @media print {
    body { background: #fff; }
    .toolbar { display: none; }
    .page { padding: 0; max-width: 100%; }
    .hero { box-shadow: none; border-radius: 0; }
    .card { break-inside: avoid; box-shadow: none; }
  }
</style>
</head>
<body>
  <div class="page">
    <div class="toolbar">
      <button onclick="window.print()">Print / Save as PDF</button>
    </div>

    <div class="hero">
      ${MARKET_BETTER_LOGO_SVG.replace("<svg ", '<svg class="logo" ')}
      <p class="eyebrow">${escapeHtml(formType)}</p>
      <h1>${escapeHtml(name)}</h1>
      ${company ? `<div class="company">${escapeHtml(company)}</div>` : ""}
      <div class="meta">
        <span class="badge ${isSuccess ? "ok" : "warn"}">${isSuccess ? "Delivered" : escapeHtml(log.status)}</span>
        ${submittedAt ? `<span class="timestamp">Submitted ${escapeHtml(submittedAt)}</span>` : ""}
      </div>
    </div>

    ${knownSections}
    ${extraSection}

    <p class="footer">Client onboarding response · Market Better · ID ${escapeHtml(log.id)}</p>
  </div>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const format = url.searchParams.get("format");

    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
      return format === "json"
        ? json({ error: "Invalid or missing id" }, 400)
        : new Response("Invalid or missing id", { status: 400, headers: corsHeaders });
    }

    const { data, error } = await supabaseAdmin
      .from("submission_logs")
      .select("id, payload, status, created_at")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      if (format === "json") return json({ error: "Response not found" }, 404);
      return new Response("<h1>Response not available</h1><p>This link may be invalid or expired.</p>", {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (format === "json") {
      return json(data);
    }

    const html = renderHtmlDocument(data);
    return new Response(html, {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("view-submission error:", err);
    return new Response("Internal error", { status: 500, headers: corsHeaders });
  }
});
