"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";

type DemoProfile = {
  label: string;
  email: string;
  password: string;
  route: "/admin" | "/supervisor" | "/client";
};

const demoProfiles: DemoProfile[] = [
  {
    label: "Admin",
    email: "admin@corekonstruct.com",
    password: "Admin#2026",
    route: "/admin",
  },
  {
    label: "Supervisor",
    email: "supervisor@corekonstruct.com",
    password: "Supervisor#2026",
    route: "/supervisor",
  },
  {
    label: "Client",
    email: "client@corekonstruct.com",
    password: "Client#2026",
    route: "/client",
  },
];

export default function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  const routeForEmail = (value: string) => {
    const normalizedEmail = value.trim().toLowerCase();
    const matchedProfile = demoProfiles.find((profile) => profile.email.toLowerCase() === normalizedEmail);

    return matchedProfile?.route ?? "/login";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const callbackUrl = routeForEmail(trimmedEmail);
    const result = await signIn("credentials", {
      redirect: false,
      email: trimmedEmail,
      password,
      callbackUrl,
    });

    if (!result?.ok) {
      setIsSubmitting(false);
      setError("Invalid credentials. Use a demo profile to continue.");
      return;
    }

    router.push(result.url ?? callbackUrl);
  };

  const quickFill = (profile: DemoProfile) => {
    setError("");
    setEmail(profile.email);
    setPassword(profile.password);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-7 shadow-[0_20px_80px_-30px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-8"
    >
      <div className="mb-7 text-center">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6B00] text-base font-black text-slate-950">
          CK
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Sign in to the CoreKonstruct command layer.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <motion.input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              whileFocus={{ scale: 1.01 }}
              className="w-full rounded-xl border border-white/15 bg-slate-950/70 py-3 pl-10 pr-3 text-sm text-white outline-none ring-[#FF6B00] placeholder:text-slate-500 focus:border-[#FF6B00]/70 focus:ring-2"
              placeholder="name@corekonstruct.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
            Password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <motion.input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              whileFocus={{ scale: 1.01 }}
              className="w-full rounded-xl border border-white/15 bg-slate-950/70 py-3 pl-10 pr-3 text-sm text-white outline-none ring-[#FF6B00] placeholder:text-slate-500 focus:border-[#FF6B00]/70 focus:ring-2"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {error ? (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
        ) : null}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ y: -1, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-80"
        >
          {isSubmitting ? "Authenticating..." : "Sign In"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </motion.button>
      </form>

      <div className="mt-6 border-t border-white/10 pt-5">
        <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
          Quick Fill Demo
        </p>
        <div className="grid grid-cols-3 gap-2">
          {demoProfiles.map((profile) => (
            <button
              key={profile.email}
              type="button"
              onClick={() => quickFill(profile)}
              className="rounded-lg border border-white/15 bg-white/5 px-2 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-[#FF6B00]/40 hover:bg-[#FF6B00]/10"
            >
              {profile.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Need the overview first?{" "}
        <Link href="/" className="text-orange-300 transition-colors hover:text-orange-200">
          Return to Landing
        </Link>
      </p>
    </motion.section>
  );
}
