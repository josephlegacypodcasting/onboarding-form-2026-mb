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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
      return json({ error: "Invalid or missing id" }, 400);
    }

    const { data, error } = await supabaseAdmin
      .from("submission_logs")
      .select("id, payload, status, created_at")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return json({ error: "Response not found" }, 404);
    }

    return json(data);
  } catch (err) {
    console.error("view-submission error:", err);
    return json({ error: "Internal error" }, 500);
  }
});
