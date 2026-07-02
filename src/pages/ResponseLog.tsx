import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MarketBetterLogoWhite from "@/components/form/MarketBetterLogoWhite";

interface SubmissionLog {
  id: string;
  payload: Record<string, unknown>;
  status: string;
  created_at: string;
}

const VIEW_URL = `${
  import.meta.env.VITE_SUPABASE_URL || ""
}/functions/v1/view-submission`;
const VIEW_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

// Mirrors the 8 steps of the onboarding form.
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
const HIDDEN_FIELDS = new Set(["form_type", "app_origin", "submitted_at", "name"]);

function humanize(key: string) {
  if (LABEL_OVERRIDES[key]) return LABEL_OVERRIDES[key];
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function isUrl(value: string) {
  return /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(value.trim());
}

function FieldValue({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === "") return null;
  if (Array.isArray(value)) {
    const items = value.filter((v) => v !== null && v !== undefined && v !== "");
    if (items.length === 0) return null;
    return (
      <ul className="list-disc pl-5 space-y-1">
        {items.map((v, i) => (
          <li key={i}>
            <FieldValue value={v} />
          </li>
        ))}
      </ul>
    );
  }
  const str = String(value);
  if (isUrl(str)) {
    const href = /^https?:\/\//i.test(str) ? str : `https://${str}`;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#F04E23] font-semibold underline-offset-2 hover:underline break-words"
      >
        {str}
      </a>
    );
  }
  return <span className="whitespace-pre-wrap break-words">{str}</span>;
}

function Section({
  title,
  fields,
  payload,
}: {
  title: string;
  fields: string[];
  payload: Record<string, unknown>;
}) {
  const visibleFields = fields.filter((key) => {
    const v = payload[key];
    if (v === null || v === undefined || v === "") return false;
    if (Array.isArray(v) && v.length === 0) return false;
    return true;
  });

  if (visibleFields.length === 0) return null;

  return (
    <section className="bg-white border border-[#E4DFEF] rounded-2xl px-6 py-6 sm:px-7 mt-5 print:break-inside-avoid print:shadow-none">
      <h2 className="text-xs uppercase tracking-wider font-bold text-[#5B3FA0] pb-3 mb-4 border-b-2 border-[#E9E6F8]">
        {title}
      </h2>
      <div>
        {visibleFields.map((key, i) => (
          <div
            key={key}
            className={`grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 py-2.5 ${
              i !== 0 ? "border-t border-[#F1EEFA]" : ""
            }`}
          >
            <div className="text-sm font-semibold text-[#6B647F]">
              {humanize(key)}
            </div>
            <div className="text-sm text-[#251C3D] leading-relaxed">
              <FieldValue value={payload[key]} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const ResponseLog = () => {
  const { id } = useParams<{ id: string }>();
  const [log, setLog] = useState<SubmissionLog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${VIEW_URL}?id=${id}&format=json`, {
          headers: { apikey: VIEW_KEY, Authorization: `Bearer ${VIEW_KEY}` },
        });
        const data = await res.json();
        if (!active) return;
        if (!res.ok || data.error) {
          setError(data.error || "Response not found");
        } else {
          setLog(data);
        }
      } catch {
        if (active) setError("Could not load this response.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const payload = log?.payload ?? {};
  const formType = (payload.form_type as string) || "Client Onboarding Form";
  const name = (payload.name as string) || "Client response";
  const company =
    (payload.company_name as string) || (payload.legal_name as string) || "";
  const submittedAtRaw = (payload.submitted_at as string) || log?.created_at;
  const submittedAt = submittedAtRaw
    ? new Date(submittedAtRaw).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";
  const isSuccess = log?.status === "success";

  const extraKeys = Object.keys(payload).filter(
    (k) => !ALL_KNOWN_FIELDS.has(k) && !HIDDEN_FIELDS.has(k)
  );

  return (
    <div className="min-h-screen bg-[#F5F1E6] py-8 px-4 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto">
        {!loading && log && (
          <div className="flex justify-end gap-2 mb-4 print:hidden">
            <button
              onClick={() => window.print()}
              className="text-sm font-semibold px-3.5 py-2 rounded-lg border border-[#E4DFEF] bg-white text-[#5B3FA0] hover:bg-[#E9E6F8] transition-colors"
            >
              Print / Save as PDF
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center text-muted-foreground py-20">
            Loading response…
          </div>
        )}

        {!loading && error && (
          <div className="bg-white border border-border rounded-xl p-10 text-center">
            <h1 className="text-xl font-medium text-foreground mb-2">
              Response not available
            </h1>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && log && (
          <>
            <div
              className="rounded-[20px] px-6 py-7 sm:px-8 sm:py-8 text-white shadow-lg print:shadow-none print:rounded-none"
              style={{
                background:
                  "linear-gradient(135deg, #5B3FA0 0%, #3E2A72 100%)",
              }}
            >
              <MarketBetterLogoWhite className="w-[130px] h-auto mb-6 block" />
              <p className="text-xs uppercase tracking-wider font-bold opacity-80 mb-1.5">
                {formType}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold">{name}</h1>
              {company && (
                <div className="text-sm opacity-90 mt-1">{company}</div>
              )}
              <div className="flex flex-wrap items-center gap-2.5 mt-5">
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                    isSuccess ? "bg-white/20" : "bg-[#F04E23]"
                  }`}
                >
                  {isSuccess ? "Delivered" : log.status}
                </span>
                {submittedAt && (
                  <span className="text-xs opacity-85">
                    Submitted {submittedAt}
                  </span>
                )}
              </div>
            </div>

            {SECTIONS.map((s) => (
              <Section key={s.title} title={s.title} fields={s.fields} payload={payload} />
            ))}
            {extraKeys.length > 0 && (
              <Section title="Other Details" fields={extraKeys} payload={payload} />
            )}

            <p className="text-center text-xs text-[#6B647F] mt-7 print:mt-4">
              Client onboarding response · Market Better · ID {log.id}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResponseLog;
