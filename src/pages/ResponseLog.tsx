import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logoMarketBetter from "@/assets/logo-market-better.webp";

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

const PRIORITY_FIELDS = [
  "name",
  "email",
  "phone",
  "company_name",
  "legal_name",
  "website",
  "payment_method",
  "submitted_at",
];

const HIDDEN_FIELDS = new Set(["form_type", "app_origin"]);

function humanize(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function isUrl(value: string) {
  return /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(value.trim());
}

function FieldValue({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground/50">—</span>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0)
      return <span className="text-muted-foreground/50">—</span>;
    return (
      <ul className="list-disc pl-5 space-y-1">
        {value.map((v, i) => (
          <li key={i}>
            <FieldValue value={v} />
          </li>
        ))}
      </ul>
    );
  }
  if (typeof value === "object") {
    return (
      <pre className="bg-muted rounded-md p-3 text-xs overflow-auto">
        {JSON.stringify(value, null, 2)}
      </pre>
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
        className="text-primary underline-offset-2 hover:underline break-words"
      >
        {str}
      </a>
    );
  }
  return <span className="whitespace-pre-wrap break-words">{str}</span>;
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
        const res = await fetch(`${VIEW_URL}?id=${id}`, {
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
  const orderedKeys: string[] = [];
  for (const k of PRIORITY_FIELDS) {
    if (k in payload && !HIDDEN_FIELDS.has(k)) orderedKeys.push(k);
  }
  for (const k of Object.keys(payload)) {
    if (!orderedKeys.includes(k) && !HIDDEN_FIELDS.has(k)) orderedKeys.push(k);
  }

  const formType = (payload.form_type as string) || "Client Onboarding Form";
  const name = (payload.name as string) || "Client response";
  const company = (payload.company_name as string) || "";
  const submittedAt = (payload.submitted_at as string) || log?.created_at;

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <img
            src={logoMarketBetter}
            alt="Market Better"
            className="w-1/2 max-w-[180px] h-auto"
          />
        </div>

        {loading && (
          <div className="text-center text-muted-foreground py-20">
            Loading response…
          </div>
        )}

        {!loading && error && (
          <div className="bg-card border border-border rounded-xl p-10 text-center">
            <h1 className="text-xl font-medium text-foreground mb-2">
              Response not available
            </h1>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && log && (
          <>
            <header className="bg-primary text-primary-foreground rounded-xl p-7 mb-6 shadow-lg">
              <div className="text-xs uppercase tracking-wider opacity-85 mb-1">
                {formType}
              </div>
              <h1 className="text-2xl font-bold">{name}</h1>
              {company && (
                <div className="mt-1 text-sm opacity-90">{company}</div>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    log.status === "success"
                      ? "bg-white/20"
                      : "bg-destructive/20"
                  }`}
                >
                  {log.status === "success" ? "Delivered" : log.status}
                </span>
                {submittedAt && (
                  <span className="text-xs opacity-90">
                    Submitted:{" "}
                    {new Date(submittedAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                )}
              </div>
            </header>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {orderedKeys.map((key, i) => (
                <div
                  key={key}
                  className={`grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 px-6 py-4 ${
                    i !== orderedKeys.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="text-sm font-medium text-muted-foreground">
                    {humanize(key)}
                  </div>
                  <div className="text-sm text-foreground">
                    <FieldValue value={payload[key]} />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              Client response log · ID {log.id}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResponseLog;
