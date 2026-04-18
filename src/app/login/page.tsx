import LoginShell from "../../components/auth/LoginShell";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B1120] px-6 py-20 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-8%] h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-[#FF6B00]/20 blur-[120px]" />
        <div className="absolute bottom-[-8%] left-[7%] h-[260px] w-[260px] rounded-full bg-cyan-300/10 blur-[110px]" />
        <div className="absolute right-[8%] top-[18%] h-[220px] w-[220px] rounded-full bg-white/5 blur-[95px]" />
      </div>

      <LoginShell />
    </main>
  );
}
