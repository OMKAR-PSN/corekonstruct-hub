import LoginShell from "../../components/auth/LoginShell";
import Image from "next/image";

export const metadata = {
  title: "Sign In — CoreKonstruct",
  description:
    "Log in to your CoreKonstruct operations console to manage your entire construction portfolio.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full">
      {/* ── Left Panel : Form ─────────────────────────────────────────── */}
      <section className="relative flex w-full flex-col items-center justify-center bg-white px-6 py-12 lg:w-1/2">
        <LoginShell />
      </section>

      {/* ── Right Panel : Visual Hero (desktop only) ──────────────────── */}
      <section className="relative hidden lg:flex lg:w-1/2">
        {/* Background image */}
        <Image
          src="/images/login-bg.jpg"
          alt="Construction blueprints with a laptop, hard hat, and clipboard"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Dark overlay with premium gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/20" />

        {/* Hero content */}
        <div className="relative z-10 flex w-full flex-col justify-end p-14 pb-16">
          {/* Brand badge */}
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md shadow-lg">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            CoreKonstruct Platform
          </div>

          <h2 className="text-balance text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-xl">
            Operations Simplified.
            <br />
            <span className="text-orange-400 drop-shadow-lg">Insight Amplified.</span>
          </h2>

          <p className="mt-5 max-w-sm text-base leading-relaxed text-slate-200 drop-shadow-md">
            Manage your entire construction portfolio from one centralized
            command center.
          </p>

          {/* Subtle stat row */}
          <div className="mt-10 flex gap-10 border-t border-white/20 pt-8 drop-shadow-md">
            {[
              { label: "Active Projects", value: "2,400+" },
              { label: "Daily Reports", value: "18k" },
              { label: "Client Uptime", value: "99.9%" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white drop-shadow-lg">{value}</p>
                <p className="mt-0.5 text-xs text-slate-300 drop-shadow">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
