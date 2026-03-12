import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Check if demo user already exists
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
  const demoUser = existingUsers?.users?.find(u => u.email === "demo@corekonstruct.com");
  
  if (demoUser) {
    return new Response(JSON.stringify({ message: "Demo user already exists", id: demoUser.id }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: "demo@corekonstruct.com",
    password: "demo1234",
    email_confirm: true,
    user_metadata: { full_name: "Demo User", role: "admin" },
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ message: "Demo user created", id: data.user.id }), {
    headers: { "Content-Type": "application/json" },
  });
});
