import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function reply(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return reply({ success: false, error: "Only POST requests are allowed." }, 405);

  try {
    let body: { mobile?: unknown; password?: unknown; invite_code?: unknown };
    try {
      body = await req.json();
    } catch {
      return reply({ success: false, error: "Request data is invalid. Please refresh and try again." }, 400);
    }

    const phone = String(body.mobile ?? "").replace(/\D/g, "");
    const password = body.password;

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return reply({ success: false, error: "Please enter a valid 10-digit Indian mobile number." }, 400);
    }
    if (typeof password !== "string" || password.length < 6) {
      return reply({ success: false, error: "Password must contain at least 6 characters." }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    // Supports the custom secret name already used in this project and Supabase's standard name.
    const serviceKey =
      Deno.env.get("SUP_SERVICE_ROLE_KEY") ||
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      console.error("mobile-register: missing SUPABASE_URL or service-role secret.");
      return reply({
        success: false,
        error: "Supabase server key is missing. Admin must add SUP_SERVICE_ROLE_KEY in Edge Function Secrets."
      }, 200);
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    const email = `${phone}@members.instantpay.in`;
    const inviteCode = body.invite_code
      ? String(body.invite_code).replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 20)
      : null;

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        mobile: phone,
        full_name: "Member",
        invite_code: inviteCode,
      },
    });

    if (error) {
      console.error("mobile-register createUser failed:", error.message);
      const duplicate = /already|registered|exists|duplicate/i.test(error.message);
      return reply({
        success: false,
        error: duplicate
          ? "This mobile number is already registered. Please log in instead."
          : `Account could not be created: ${error.message}`
      }, 200);
    }

    return reply({ success: true, userId: data.user.id }, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    console.error("mobile-register unexpected error:", message);
    // Return JSON with HTTP 200 for handled app errors so the website can show the real reason,
    // rather than the generic "Edge Function returned a non-2xx status code".
    return reply({ success: false, error: `Registration server error: ${message}` }, 200);
  }
});
