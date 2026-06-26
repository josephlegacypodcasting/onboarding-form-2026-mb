CREATE TABLE public.submission_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payload JSONB NOT NULL,
  status TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  webhook_status_code INTEGER,
  webhook_response TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.submission_logs TO service_role;

ALTER TABLE public.submission_logs ENABLE ROW LEVEL SECURITY;

-- No public/anon/authenticated policies: only the backend (service_role,
-- which bypasses RLS) reads and writes these logs. This keeps submission
-- data private.
