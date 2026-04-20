/**
 * src/app/(dashboard)/admin/page.tsx
 *
 * Admin Operations Command Center — async React Server Component.
 *
 * Data layer:
 *   • Fetches all projects via @supabase/ssr (RLS returns every row for admins).
 *   • Computes KPIs server-side (no client JS for aggregation).
 *
 * Finance columns (budget, labour_cost, material_cost, misc_cost) do not yet
 * exist in the schema. Until the migration lands, values are derived
 * deterministically from `progress_percentage` so the UI stays useful.
 * Every derived value is tagged with // [MOCK] for easy search-and-replace.
 */

import { redirect }   from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {
  LayoutGrid, TrendingUp, AlertTriangle, IndianRupee,
  CalendarDays, MapPin, CheckCircle2,
} from "lucide-react";
import type { Project } from "@/types/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function todayLabel(): string {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function formatINR(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function dateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// ── Derive mock financials until budget columns exist in schema ── [MOCK block]
function deriveFinancials(progress: number) {
  const spentBase  = progress * 85_000;                      // [MOCK] ₹85k / progress point
  const labour     = Math.round(spentBase * 0.45);           // [MOCK]
  const material   = Math.round(spentBase * 0.40);           // [MOCK]
  const misc       = Math.round(spentBase * 0.15);           // [MOCK]
  const spent      = labour + material + misc;
  const budget     = Math.round(spent / Math.max(progress / 100, 0.05)); // [MOCK]
  return { labour, material, misc, spent, budget };
}

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS: Record<
  Project["status"],
  { label: string; dot: string; badge: string }
> = {
  active:    { label: "Active",    dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"  },
  delayed:   { label: "Delayed",   dot: "bg-red-500",     badge: "bg-red-50 text-red-700 ring-1 ring-red-200"              },
  completed: { label: "Completed", dot: "bg-blue-500",    badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200"           },
  "on-hold": { label: "On Hold",   dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200"        },
};

// ─────────────────────────────────────────────────────────────────────────────
// MICRO-COMPONENTS  (pure server-renderable — no hooks, no browser APIs)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SVG circular progress indicator.
 * Stroke colour shifts green→blue→amber→red as completion decreases.
 * All math is resolved at React render time; no JS ships to the browser.
 */
function ProgressRing({ pct, size = 88 }: { pct: number; size?: number }) {
  const sw     = 7;
  const r      = (size - sw * 2) / 2;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  const cx     = size / 2;
  const color  =
    pct >= 80 ? "#22c55e" :
    pct >= 50 ? "#3b82f6" :
    pct >= 25 ? "#f59e0b" : "#ef4444";

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
        aria-hidden="true"
      >
        {/* Track ring */}
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={sw}
        />
        {/* Progress arc */}
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          strokeDashoffset={`${offset}`}
        />
      </svg>
      {/* Centred label */}
      <span className="absolute text-xs font-extrabold text-slate-700">
        {pct}%
      </span>
    </div>
  );
}

/**
 * Stacked horizontal cost-breakdown bar.
 * Segment widths are inline-style percentages computed server-side.
 */
function CostBar({
  labour, material, misc,
}: {
  labour: number; material: number; misc: number;
}) {
  const total = (labour + material + misc) || 1;
  const segs  = [
    { label: "Labour",   bg: "bg-blue-500",  pct: (labour   / total) * 100 },
    { label: "Material", bg: "bg-amber-400", pct: (material / total) * 100 },
    { label: "Misc",     bg: "bg-slate-200", pct: (misc     / total) * 100 },
  ];

  return (
    <div>
      {/* Bar */}
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        {segs.map(({ label, bg, pct }) => (
          <div
            key={label}
            className={bg}
            style={{ width: `${pct.toFixed(1)}%` }}
            title={`${label}: ${pct.toFixed(0)}%`}
          />
        ))}
      </div>
      {/* Legend */}
      <div className="mt-1.5 flex flex-wrap items-center gap-3">
        {segs.map(({ label, bg, pct }) => (
          <span key={label} className="flex items-center gap-1 text-[10px] text-slate-400">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${bg}`} />
            {label} {pct.toFixed(0)}%
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * 6-Stage Tracker for Project Overview Card
 */
function StageTracker({ currentStage }: { currentStage: string | null }) {
  const STAGES = ["Foundation", "Structure", "Brickwork", "Plastering", "Finishing", "Handover"];
  const activeIdx = currentStage
    ? STAGES.findIndex(s => s.toLowerCase() === currentStage.toLowerCase())
    : -1;

  return (
    <div className="flex w-full items-center justify-between gap-1 overflow-x-auto pb-1">
      {STAGES.map((stage, i) => {
        const done = activeIdx === -1 && currentStage === "Completed" ? true : i < activeIdx;
        const active = i === activeIdx;
        return (
          <div key={stage} className="flex min-w-0 flex-1 flex-col items-center gap-1.5 delay-150">
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] text-[9px] font-bold ${
                done
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : active
                  ? "border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-100"
                  : "border-slate-200 bg-slate-50 text-slate-400"
              }`}
            >
              {done ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
            </div>
            <span
              className={`truncate text-[9px] font-semibold tracking-wide ${
                active ? "text-blue-600" : "text-slate-400"
              }`}
            >
              {stage}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Top-level portfolio KPI card.
 */
function StatCard({
  icon, label, value, sub, valueClass = "text-slate-900",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          {icon}
        </div>
      </div>
      <p className={`text-3xl font-black leading-none tracking-tight ${valueClass}`}>
        {value}
      </p>
      {sub && (
        <p className="text-xs leading-relaxed text-slate-400">{sub}</p>
      )}
    </div>
  );
}

/**
 * Single project card — shows name, status badge, progress ring,
 * financial summary, and stacked cost bar.
 */
function ProjectOverviewCard({ project }: { project: Project }) {
  const cfg = STATUS[project.status] ?? STATUS.active;
  const { labour, material, misc, spent, budget } = deriveFinancials(
    project.progress_percentage
  );

  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-lg">
      {/* ── Card top: coloured accent strip */}
      <div
        className="h-1.5 w-full rounded-t-2xl"
        style={{
          background:
            project.status === "active"    ? "#22c55e" :
            project.status === "delayed"   ? "#ef4444" :
            project.status === "completed" ? "#3b82f6" : "#f59e0b",
        }}
      />

      <div className="flex flex-col gap-5 p-6">
        {/* ── Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-blue-600">
              {project.name}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {project.current_stage ? `Stage: ${project.current_stage}` : "Stage not set"}
              </span>
            </div>
          </div>
          {/* Status badge */}
          <span className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${cfg.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>

        {/* ── Progress ring + financial summary */}
        <div className="flex items-center gap-4">
          <ProgressRing pct={project.progress_percentage} />

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">Budget</span>
              <span className="text-xs font-bold text-slate-700">{formatINR(budget)}</span>
            </div>
            <div className="h-px bg-slate-100" />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">Spent</span>
              <span className="text-xs font-bold text-blue-600">{formatINR(spent)}</span>
            </div>
            <div className="h-px bg-slate-100" />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">Remaining</span>
              <span className={`text-xs font-bold ${budget - spent < 0 ? "text-red-500" : "text-emerald-600"}`}>
                {formatINR(Math.abs(budget - spent))}
              </span>
            </div>
          </div>
        </div>

        {/* ── Cost breakdown bar */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
            Cost Breakdown
          </p>
          <CostBar labour={labour} material={material} misc={misc} />
        </div>

        {/* ── Stage Tracker */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
            Stage Progress
          </p>
          <StageTracker currentStage={project.current_stage} />
        </div>

        {/* ── Footer */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
          <CalendarDays className="h-3 w-3" />
          Added {dateLabel(project.created_at)}
        </div>
      </div>
    </article>
  );
}

/** Empty state shown when no projects exist yet. */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
      <LayoutGrid className="h-10 w-10 text-slate-300" />
      <p className="mt-4 text-sm font-semibold text-slate-500">No projects found</p>
      <p className="mt-1 text-xs text-slate-400">
        Projects created in Supabase will appear here automatically.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE  — async Server Component
// ─────────────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  const supabase = await createClient();

  // 1. Auth guard ─────────────────────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Profile lookup ─────────────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // 3. Fetch all projects (RLS: admin role returns every row) ─────────────────
  const { data: rawProjects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[AdminPage] projects fetch error:", error.message);
  }

  const projects: Project[] = (rawProjects ?? []) as Project[];

  // 4. Compute KPIs ───────────────────────────────────────────────────────────
  const total     = projects.length;
  const delayed   = projects.filter(p => p.status === "delayed").length;
  const completed = projects.filter(p => p.status === "completed").length;
  const active    = projects.filter(p => p.status === "active").length;
  const avgProg   = total
    ? Math.round(projects.reduce((s, p) => s + p.progress_percentage, 0) / total)
    : 0;

  // Portfolio-level mock financials [MOCK] — replace when finance schema lands
  const portfolioBudget = projects.reduce(
    (s, p) => s + deriveFinancials(p.progress_percentage).budget, 0
  );
  const portfolioSpent = projects.reduce(
    (s, p) => s + deriveFinancials(p.progress_percentage).spent, 0
  );

  const firstName = profile?.full_name?.split(" ")[0] ?? "Admin";

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">{todayLabel()}</p>
            <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight text-slate-900">
              Operations Command Center
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Welcome back,{" "}
              <span className="font-semibold text-blue-600">{firstName}</span> —
              here&apos;s your portfolio at a glance.
            </p>
          </div>

          {/* Live indicator badge */}
          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700">Live Data</span>
          </div>
        </header>

        {/* ── KPI stat grid ────────────────────────────────────────────── */}
        <section aria-label="Portfolio metrics">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<LayoutGrid className="h-4 w-4" />}
              label="Total Projects"
              value={String(total)}
              sub={`${active} active · ${completed} completed · ${delayed} delayed`}
            />
            <StatCard
              icon={<IndianRupee className="h-4 w-4" />}
              label="Portfolio Budget"
              value={formatINR(portfolioBudget)}
              sub="Across all active projects (est.)"
              valueClass="text-slate-900"
            />
            <StatCard
              icon={<TrendingUp className="h-4 w-4" />}
              label="Portfolio Spent"
              value={formatINR(portfolioSpent)}
              sub={`${((portfolioSpent / (portfolioBudget || 1)) * 100).toFixed(0)}% of total budget utilised`}
              valueClass="text-blue-600"
            />
            <StatCard
              icon={<AlertTriangle className="h-4 w-4" />}
              label="Avg. Progress"
              value={`${avgProg}%`}
              sub={`${delayed} project${delayed !== 1 ? "s" : ""} behind schedule`}
              valueClass={delayed > 0 ? "text-amber-500" : "text-emerald-600"}
            />
          </div>
        </section>

        {/* ── Projects grid ────────────────────────────────────────────── */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              All Projects
            </h2>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
              {total} {total === 1 ? "project" : "projects"}
            </span>
          </div>

          {projects.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectOverviewCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </section>

        {/* ── Footer disclaimer ────────────────────────────────────────── */}
        <footer className="border-t border-slate-200 pt-6 text-center text-[11px] text-slate-400">
          Financial figures are estimates derived from progress data. Run the{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-500">
            budgets
          </code>{" "}
          schema migration to enable real-time cost tracking.
        </footer>

      </div>
    </div>
  );
}
