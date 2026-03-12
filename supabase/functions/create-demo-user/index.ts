import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    "ee01d32a-f64a-4fb8-a882-5f0c078764aa",
    { email_confirm: true, password: "demo1234" }
  );

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ message: "Demo user confirmed", confirmed: data.user.email_confirmed_at }), {
    headers: { "Content-Type": "application/json" },
  });
});
