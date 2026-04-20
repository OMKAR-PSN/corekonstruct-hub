"use client";

/**
 * src/app/(dashboard)/supervisor/daily-report/page.tsx
 *
 * Supervisor Daily Report Form — Client Component.
 *
 * Data flow:
 *   1. On mount → fetch assigned projects via the Supabase browser client.
 *   2. Supervisor fills the form.
 *   3. On submit → calls the `submitDailyReport` Server Action.
 *      supervisor_id is injected server-side from auth.getUser(); the form
 *      never touches it directly.
 */

import { useState, useEffect, useActionState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  submitDailyReport,
  type DailyReportState,
} from "@/app/actions/daily-report";
import Link from "next/link";
import {
  Cloud, Sun, CloudRain, Wind,
  ClipboardList, AlertTriangle, IndianRupee,
  ChevronLeft, CheckCircle2, Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Project = { id: string; name: string; current_stage: string | null };

// ─── Constants ────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split("T")[0];

const WEATHER_OPTIONS = [
  { value: "Sunny",   label: "Sunny",   Icon: Sun,        color: "text-amber-400"   },
  { value: "Cloudy",  label: "Cloudy",  Icon: Cloud,      color: "text-slate-400"   },
  { value: "Rainy",   label: "Rainy",   Icon: CloudRain,  color: "text-blue-400"    },
  { value: "Extreme", label: "Extreme", Icon: Wind,       color: "text-red-400"     },
] as const;

type WeatherValue = typeof WEATHER_OPTIONS[number]["value"];

const INITIAL_STATE: DailyReportState = { success: false };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatINR(n: number): string {
  if (isNaN(n) || n === 0) return "₹0";
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

// ─── Small sub-components ─────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-400">
      <AlertTriangle className="h-3 w-3 shrink-0" />
      {msg}
    </p>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-md">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-600 bg-slate-700 px-4 py-3.5 " +
  "text-base text-slate-100 placeholder:text-slate-500 " +
  "focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 " +
  "disabled:opacity-50 transition-colors";

const labelCls = "mb-1.5 block text-sm font-semibold text-slate-300";

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function DailyReportPage() {
  // ── Projects list (fetched on mount via browser client) ──────────────────
  const [projects, setProjects]       = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const supabase = createClient();
      const { data } = await supabase
        .from("projects")
        .select("id, name, current_stage")
        .order("created_at", { ascending: false });
      setProjects((data ?? []) as Project[]);
      setLoadingProjects(false);
    }
    loadProjects();
  }, []);

  // ── Form state (controlled) ───────────────────────────────────────────────
  const [projectId, setProjectId]   = useState("");
  const [reportDate, setReportDate] = useState(TODAY);
  const [weather, setWeather]       = useState<WeatherValue>("Sunny");
  const [workDone, setWorkDone]     = useState("");
  const [issues, setIssues]         = useState("");
  const [labour, setLabour]         = useState("");
  const [material, setMaterial]     = useState("");
  const [misc, setMisc]             = useState("");

  // Running total (live preview)
  const total =
    (parseFloat(labour   || "0") || 0) +
    (parseFloat(material || "0") || 0) +
    (parseFloat(misc     || "0") || 0);

  // ── Server Action wired to useActionState ─────────────────────────────────
  const [state, action, isPending] = useActionState(
    submitDailyReport,
    INITIAL_STATE,
  );

  // Reset form after success
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setProjectId(""); setReportDate(TODAY); setWeather("Sunny");
      setWorkDone(""); setIssues("");
      setLabour(""); setMaterial(""); setMisc("");
    }
  }, [state.success]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">

        {/* ── Breadcrumb nav ───────────────────────────────────────────── */}
        <Link
          href="/supervisor"
          className="mb-6 flex items-center gap-1.5 text-sm text-slate-400 hover:text-orange-400 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* ── Page title ───────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/20">
              <ClipboardList className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                Daily Site Report
              </h1>
              <p className="text-xs text-slate-400">
                Submit your end-of-day field log
              </p>
            </div>
          </div>
        </div>

        {/* ── Success banner ────────────────────────────────────────────── */}
        {state.success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="font-bold text-emerald-300">Report submitted!</p>
              <p className="mt-0.5 text-sm text-emerald-400">
                Your daily log has been saved to the database. The admin can
                view it in the Reports panel.
              </p>
            </div>
          </div>
        )}

        {/* ── Global error banner ───────────────────────────────────────── */}
        {state.error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <p className="text-sm text-red-300">{state.error}</p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/*  FORM                                                          */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <form ref={formRef} action={action} className="space-y-5" noValidate>

          {/* ── Section 1: Report Details ──────────────────────────────── */}
          <SectionCard title="Report Details">

            {/* Project */}
            <div>
              <label htmlFor="projectId" className={labelCls}>
                Project <span className="text-orange-400">*</span>
              </label>
              {loadingProjects ? (
                <div className="flex h-14 items-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-4 text-sm text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading projects…
                </div>
              ) : (
                <select
                  id="projectId"
                  name="projectId"
                  required
                  value={projectId}
                  onChange={e => setProjectId(e.target.value)}
                  disabled={isPending}
                  className={`${inputCls} appearance-none`}
                  suppressHydrationWarning
                >
                  <option value="">— Select a project —</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}{p.current_stage ? ` (${p.current_stage})` : ""}
                    </option>
                  ))}
                </select>
              )}
              <FieldError msg={state.fieldErrors?.projectId} />
            </div>

            {/* Report Date */}
            <div>
              <label htmlFor="reportDate" className={labelCls}>
                Report Date <span className="text-orange-400">*</span>
              </label>
              <input
                id="reportDate"
                name="reportDate"
                type="date"
                required
                max={TODAY}
                value={reportDate}
                onChange={e => setReportDate(e.target.value)}
                disabled={isPending}
                className={inputCls}
                suppressHydrationWarning
              />
              <FieldError msg={state.fieldErrors?.reportDate} />
            </div>

            {/* Weather — visual pill selector */}
            <div>
              <label className={labelCls}>
                Weather Condition <span className="text-orange-400">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {WEATHER_OPTIONS.map(({ value, label, Icon, color }) => (
                  <label
                    key={value}
                    className={[
                      "flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all",
                      weather === value
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-slate-600 bg-slate-700 hover:border-slate-500",
                      isPending ? "pointer-events-none opacity-50" : "",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="weather"
                      value={value}
                      checked={weather === value}
                      onChange={() => setWeather(value)}
                      className="sr-only"
                    />
                    <Icon className={`h-5 w-5 ${weather === value ? "text-orange-400" : color}`} />
                    <span className={`text-[11px] font-semibold ${weather === value ? "text-orange-300" : "text-slate-400"}`}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
              <FieldError msg={state.fieldErrors?.weather} />
            </div>
          </SectionCard>

          {/* ── Section 2: Site Diary ──────────────────────────────────── */}
          <SectionCard title="Site Diary">

            {/* Work Done */}
            <div>
              <label htmlFor="workDone" className={labelCls}>
                Work Done Today <span className="text-orange-400">*</span>
              </label>
              <textarea
                id="workDone"
                name="workDone"
                rows={4}
                required
                placeholder="Describe the work completed on site today…"
                value={workDone}
                onChange={e => setWorkDone(e.target.value)}
                disabled={isPending}
                className={`${inputCls} resize-none leading-relaxed`}
                suppressHydrationWarning
              />
              <FieldError msg={state.fieldErrors?.workDone} />
            </div>

            {/* Issues / Blockers */}
            <div>
              <label htmlFor="issues" className={labelCls}>
                Issues / Blockers
                <span className="ml-1.5 text-[10px] font-normal text-slate-500">
                  (optional)
                </span>
              </label>
              <textarea
                id="issues"
                name="issues"
                rows={3}
                placeholder="Any delays, safety incidents, supply issues…"
                value={issues}
                onChange={e => setIssues(e.target.value)}
                disabled={isPending}
                className={`${inputCls} resize-none leading-relaxed`}
                suppressHydrationWarning
              />
            </div>
          </SectionCard>

          {/* ── Section 3: Daily Expenses ──────────────────────────────── */}
          <SectionCard title="Daily Expenses (₹)">

            {/* Three expense inputs in a responsive grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              {/* Labour */}
              <div>
                <label htmlFor="labourExpense" className={labelCls}>
                  Labour
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <IndianRupee className="h-4 w-4" />
                  </span>
                  <input
                    id="labourExpense"
                    name="labourExpense"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={labour}
                    onChange={e => setLabour(e.target.value)}
                    disabled={isPending}
                    className={`${inputCls} pl-9`}
                    suppressHydrationWarning
                  />
                </div>
                <FieldError msg={state.fieldErrors?.labourExpense} />
              </div>

              {/* Material */}
              <div>
                <label htmlFor="materialExpense" className={labelCls}>
                  Material
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <IndianRupee className="h-4 w-4" />
                  </span>
                  <input
                    id="materialExpense"
                    name="materialExpense"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={material}
                    onChange={e => setMaterial(e.target.value)}
                    disabled={isPending}
                    className={`${inputCls} pl-9`}
                    suppressHydrationWarning
                  />
                </div>
                <FieldError msg={state.fieldErrors?.materialExpense} />
              </div>

              {/* Misc */}
              <div>
                <label htmlFor="miscExpense" className={labelCls}>
                  Misc
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <IndianRupee className="h-4 w-4" />
                  </span>
                  <input
                    id="miscExpense"
                    name="miscExpense"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={misc}
                    onChange={e => setMisc(e.target.value)}
                    disabled={isPending}
                    className={`${inputCls} pl-9`}
                    suppressHydrationWarning
                  />
                </div>
                <FieldError msg={state.fieldErrors?.miscExpense} />
              </div>
            </div>

            {/* Running total */}
            <div className="flex items-center justify-between rounded-xl border border-slate-600/60 bg-slate-700/50 px-4 py-3">
              <span className="text-sm font-semibold text-slate-400">
                Total Daily Expense
              </span>
              <span className={`text-lg font-extrabold tracking-tight ${total > 0 ? "text-orange-400" : "text-slate-500"}`}>
                {formatINR(total)}
              </span>
            </div>
          </SectionCard>

          {/* ── Submit button ─────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={isPending || loadingProjects}
            suppressHydrationWarning
            className="
              flex w-full items-center justify-center gap-2.5 rounded-2xl
              bg-orange-500 px-6 py-4 text-base font-bold text-white shadow-lg
              shadow-orange-500/25 transition-all
              hover:bg-orange-600 hover:shadow-orange-500/40
              active:scale-[0.98]
              disabled:cursor-not-allowed disabled:opacity-60
              focus:outline-none focus:ring-4 focus:ring-orange-500/40
            "
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting Report…
              </>
            ) : (
              <>
                <ClipboardList className="h-5 w-5" />
                Submit Daily Report
              </>
            )}
          </button>

          {/* Small helper text */}
          <p className="text-center text-xs text-slate-500">
            Your supervisor ID is automatically attached on the server.
            Reports are saved to Supabase and visible to admins.
          </p>

        </form>
      </div>
    </div>
  );
}
