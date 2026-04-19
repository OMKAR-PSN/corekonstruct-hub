import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication Error | CoreKonstruct",
};

/**
 * /auth/auth-code-error
 *
 * Shown when the OAuth code exchange in /auth/callback fails.
 * Common causes: expired code, already-used code, or misconfigured
 * Redirect URL in the Supabase Dashboard.
 */
export default function AuthCodeErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0B1120] px-6 text-center">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-400 text-2xl font-black">
        !
      </div>
      <h1 className="mt-6 text-2xl font-bold text-white">Authentication failed</h1>
      <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
        The sign-in link has expired or has already been used. Please try
        signing in again.
      </p>
      <Link
        href="/login"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-orange-400"
      >
        Back to Login
      </Link>
    </main>
  );
}
