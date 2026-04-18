import Link from "next/link";

export default function Footer() {
  return (
    <footer id="footer" className="border-t border-slate-200 px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600 text-sm font-black text-white">
            CK
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.12em] text-slate-900">CoreKonstruct</p>
            <p className="text-xs text-slate-600">Construction Intelligence Platform</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <Link href="/login" className="transition-colors hover:text-slate-900">
            Login
          </Link>
          <a href="#features" className="transition-colors hover:text-slate-900">
            Features
          </a>
          <a href="#showcase" className="transition-colors hover:text-slate-900">
            Showcase
          </a>
          <a href="#" className="transition-colors hover:text-slate-900">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
