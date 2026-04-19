import { createBrowserClient } from "@supabase/ssr";

/**
 * createClient — Browser-side Supabase client.
 *
 * Use this in Client Components ("use client") only.
 * It reads the anon key from public env vars that are safe to expose in the browser.
 *
 * Usage:
 *   const supabase = createClient();
 *   const { data, error } = await supabase.from("projects").select("*");
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
