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
          src="https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=2000&auto=format&fit=crop"
          alt="Modern construction site aerial view"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-900/50" />

        {/* Hero content */}
        <div className="relative z-10 flex w-full flex-col justify-end p-14 pb-16">
          {/* Brand badge */}
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-orange-400/40 bg-orange-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-300 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            CoreKonstruct Platform
          </div>

          <h2 className="text-balance text-5xl font-extrabold leading-tight tracking-tight text-white">
            Operations Simplified.
            <br />
            <span className="text-orange-400">Insight Amplified.</span>
          </h2>

          <p className="mt-5 max-w-sm text-base leading-relaxed text-slate-300">
            Manage your entire construction portfolio from one centralized
            command center.
          </p>

          {/* Subtle stat row */}
          <div className="mt-10 flex gap-10 border-t border-white/10 pt-8">
            {[
              { label: "Active Projects", value: "2,400+" },
              { label: "Daily Reports", value: "18k" },
              { label: "Client Uptime", value: "99.9%" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="mt-0.5 text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
