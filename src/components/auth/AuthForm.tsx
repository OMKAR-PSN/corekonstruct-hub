"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, LockKeyhole, AlertCircle, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// ---------------------------------------------------------------------------
// SVG icons (inlined – no extra network hop)
// ---------------------------------------------------------------------------
function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Divider  "Or continue with"
// ---------------------------------------------------------------------------
function OrDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-slate-200" />
      <span className="text-xs font-medium text-slate-400">
        Or continue with
      </span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function AuthForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const isLoading = isEmailLoading || isGoogleLoading;

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setIsGoogleLoading(false);
    }
    // On success, Supabase initiates the redirect — we never reach this line.
  };

  // ── Email / Password ──────────────────────────────────────────────────────
  const handleEmailSignIn = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (isLoading) return;

    setError(null);
    setIsEmailLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setError(error.message);
      setIsEmailLoading(false);
      return;
    }

    if (data.session) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.session.user.id)
        .single();

      const roleRoutes: Record<string, string> = {
        admin: "/admin",
        supervisor: "/supervisor",
        client: "/client",
      };

      const destination =
        (profile?.role && roleRoutes[profile.role]) ?? "/";

      router.refresh();
      router.push(destination);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md px-2"
    >
      {/* ── Brand Header ──────────────────────────────────────────────────── */}
      <div className="mb-8">
        {/* Logo mark */}
        <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-600 text-sm font-black text-white shadow-md shadow-orange-200">
          CK
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Welcome to CoreKonstruct
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Log in to access your operations console
        </p>
      </div>

      {/* ── SSO Buttons ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Google */}
        <motion.button
          id="btn-google-signin"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.02 } : undefined}
          whileTap={!isLoading ? { scale: 0.98 } : undefined}
          className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGoogleLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          ) : (
            <GoogleIcon />
          )}
          {isGoogleLoading ? "Redirecting…" : "Google"}
        </motion.button>

        {/* Apple */}
        <motion.button
          id="btn-apple-signin"
          type="button"
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.02 } : undefined}
          whileTap={!isLoading ? { scale: 0.98 } : undefined}
          className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          <AppleIcon />
          Apple
        </motion.button>
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="my-6">
        <OrDivider />
      </div>

      {/* ── Email / Password Form ─────────────────────────────────────────── */}
      <form onSubmit={handleEmailSignIn} className="space-y-4" noValidate>
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-500"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="you@company.com"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none ring-orange-600 placeholder:text-slate-400 focus:border-orange-600/60 focus:ring-2 focus:ring-orange-600/20 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Password + Forgot */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-widest text-slate-500"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-orange-600 transition-colors hover:text-orange-700"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none ring-orange-600 placeholder:text-slate-400 focus:border-orange-600/60 focus:ring-2 focus:ring-orange-600/20 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign In CTA */}
        <motion.button
          id="btn-email-signin"
          type="submit"
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.01 } : undefined}
          whileTap={!isLoading ? { scale: 0.99 } : undefined}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-all hover:bg-orange-700 hover:shadow-orange-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isEmailLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Signing in…
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </motion.button>
      </form>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <p className="mt-7 text-center text-xs text-slate-400">
        New to CoreKonstruct?{" "}
        <Link
          href="/"
          className="font-semibold text-orange-600 transition-colors hover:text-orange-700"
        >
          Learn more
        </Link>
      </p>
    </motion.div>
  );
}
