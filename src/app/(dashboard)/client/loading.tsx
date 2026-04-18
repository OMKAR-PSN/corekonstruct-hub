export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-24 rounded-3xl border border-slate-200 bg-white animate-pulse" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="h-28 rounded-2xl border border-slate-200 bg-white animate-pulse" />
        <div className="h-28 rounded-2xl border border-slate-200 bg-white animate-pulse" />
        <div className="h-28 rounded-2xl border border-slate-200 bg-white animate-pulse" />
        <div className="h-28 rounded-2xl border border-slate-200 bg-white animate-pulse" />
      </div>
      <div className="h-80 rounded-3xl border border-slate-200 bg-white animate-pulse" />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="h-96 rounded-3xl border border-slate-200 bg-white animate-pulse" />
        <div className="h-96 rounded-3xl border border-slate-200 bg-white animate-pulse" />
      </div>
    </div>
  );
}
