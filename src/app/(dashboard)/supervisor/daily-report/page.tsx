"use client";

/**
 * src/app/(dashboard)/supervisor/daily-report/page.tsx
 *
 * Faithful JSX conversion of the `<div id="sp-report">` panel from
 * dashboard-supervisor.html.
 *
 * Styling:  Uses the existing dashboard CSS class names (dash-panel,
 *           form-group, btn-primary, etc.) — these classes must be present
 *           via the project's dashboard.css / globals.css.
 * Icons:    Lucide React equivalents (already installed) used in place of
 *           FontAwesome to keep the bundle lean in Next.js.
 * Data:     Projects fetched client-side from Supabase on mount.
 * Submit:   Direct Supabase browser-client INSERT (placeholder — wire the
 *           `submitDailyReport` Server Action when ready).
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  FilePen, ChevronLeft, CheckCircle2,
  TriangleAlert, Loader2, Camera,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Project = { id: string; name: string; current_stage: string | null };

type FormState = {
  projectId: string;
  date: string;
  weather: string;
  stage: string;
  workDone: string;
  issues: string;
  labourCost: string;
  materialCost: string;
  miscCost: string;
  expenseDesc: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split("T")[0];

const BLANK: FormState = {
  projectId:    "",
  date:         TODAY,
  weather:      "",
  stage:        "brickwork",
  workDone:     "",
  issues:       "",
  labourCost:   "0",
  materialCost: "0",
  miscCost:     "0",
  expenseDesc:  "",
};

const WEATHER_OPTIONS = [
  { value: "sunny",  label: "Sunny"  },
  { value: "cloudy", label: "Cloudy" },
  { value: "rainy",  label: "Rainy"  },
  { value: "windy",  label: "Windy"  },
  { value: "foggy",  label: "Foggy"  },
];

const STAGE_OPTIONS = [
  { value: "foundation", label: "Foundation" },
  { value: "structure",  label: "Structure"  },
  { value: "brickwork",  label: "Brickwork"  },
  { value: "plastering", label: "Plastering" },
  { value: "finishing",  label: "Finishing"  },
  { value: "earthwork",  label: "Earthwork"  },
  { value: "sub-base",   label: "Sub-base"   },
  { value: "surfacing",  label: "Surfacing"  },
  { value: "piling",     label: "Piling"     },
  { value: "deck-slab",  label: "Deck Slab"  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function DailyReportPage() {

  // ── Projects list ─────────────────────────────────────────────────────────
  const [projects, setProjects]             = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("projects")
        .select("id, name, current_stage")
        .order("created_at", { ascending: false });
      setProjects((data ?? []) as Project[]);
      setLoadingProjects(false);
    })();
  }, []);

  // ── Controlled form state ─────────────────────────────────────────────────
  const [form, setForm] = useState<FormState>(BLANK);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  // ── Submission state ──────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess,    setIsSuccess]    = useState(false);
  const [errorMsg,     setErrorMsg]     = useState<string | null>(null);

  // ── Submit handler ────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setIsSuccess(false);

    /* ── Placeholder INSERT — replace with Server Action when ready ───────
     *
     * import { submitDailyReport } from "@/app/actions/daily-report";
     * const result = await submitDailyReport(undefined, formData);
     *
     * For now we do a direct client-side insert so the form is fully
     * testable without any further server-action wiring.
     * ──────────────────────────────────────────────────────────────────── */
    try {
      const supabase = createClient();

      // Resolve the authenticated user's ID for supervisor_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Session expired — please log in again.");

      const { error: dbError } = await supabase.from("daily_reports").insert({
        project_id:       form.projectId || null,
        supervisor_id:    user.id,
        report_date:      form.date,
        weather:          form.weather   || "sunny",
        current_stage:    form.stage,
        work_done:        form.workDone,
        issues:           form.issues    || null,
        labour_expense:   parseFloat(form.labourCost)   || 0,
        material_expense: parseFloat(form.materialCost) || 0,
        misc_expense:     parseFloat(form.miscCost)     || 0,
        expense_desc:     form.expenseDesc              || null,
      });

      if (dbError) throw new Error(dbError.message);

      // ── Success ──────────────────────────────────────────────────────────
      setIsSuccess(true);
      setForm(BLANK);

    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Submission failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="dash-content" style={{ maxWidth: "860px", margin: "0 auto", padding: "24px 16px" }}>

      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <Link
        href="/supervisor"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          marginBottom: "20px",
          textDecoration: "none",
        }}
      >
        <ChevronLeft size={15} />
        Back to Dashboard
      </Link>

      {/* ── Success banner ───────────────────────────────────────────────── */}
      {isSuccess && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            background: "rgba(34,197,94,0.1)",
            border: "1.5px solid rgba(34,197,94,0.35)",
            borderRadius: "var(--radius-md, 12px)",
            padding: "16px 20px",
            marginBottom: "20px",
          }}
        >
          <CheckCircle2 size={20} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong style={{ color: "#22c55e" }}>Report submitted successfully!</strong>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Your daily site report and expenses have been saved to the database.
            </p>
          </div>
        </div>
      )}

      {/* ── Error banner ─────────────────────────────────────────────────── */}
      {errorMsg && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            background: "rgba(239,68,68,0.08)",
            border: "1.5px solid rgba(239,68,68,0.3)",
            borderRadius: "var(--radius-md, 12px)",
            padding: "16px 20px",
            marginBottom: "20px",
          }}
        >
          <TriangleAlert size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: "0.88rem", color: "var(--text-dark)" }}>{errorMsg}</p>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* DAILY REPORT PANEL                                               */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div className="dash-panel">

        {/* Header ───────────────────────────────────────────────────────── */}
        <div className="dash-panel-header">
          <h3>
            <FilePen size={17} style={{ verticalAlign: "middle", marginRight: "8px" }} />
            Daily Site Report
          </h3>
          <span className="badge badge-orange">Mandatory</span>
        </div>

        <div className="dash-panel-body">
          <form id="daily-report-form" onSubmit={handleSubmit} noValidate>

            {/* ── Project Selection (added per requirement) ─────────────── */}
            <div className="form-group">
              <label htmlFor="report-project">Select Project *</label>
              {loadingProjects ? (
                <div style={{ padding: "11px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                  Loading projects…
                </div>
              ) : (
                <select
                  id="report-project"
                  name="projectId"
                  value={form.projectId}
                  onChange={e => setField("projectId", e.target.value)}
                  disabled={isSubmitting}
                  suppressHydrationWarning
                >
                  <option value="">— Select a project —</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}{p.current_stage ? ` · ${p.current_stage}` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* ── Row 1: Date / Weather / Stage ─────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>

              <div className="form-group">
                <label htmlFor="report-date">Date *</label>
                <input
                  type="date"
                  id="report-date"
                  name="date"
                  required
                  max={TODAY}
                  value={form.date}
                  onChange={e => setField("date", e.target.value)}
                  disabled={isSubmitting}
                  suppressHydrationWarning
                />
              </div>

              <div className="form-group">
                <label htmlFor="report-weather">Weather *</label>
                <select
                  id="report-weather"
                  name="weather"
                  required
                  value={form.weather}
                  onChange={e => setField("weather", e.target.value)}
                  disabled={isSubmitting}
                  suppressHydrationWarning
                >
                  <option value="">Select weather</option>
                  {WEATHER_OPTIONS.map(w => (
                    <option key={w.value} value={w.value}>{w.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="report-stage">Current Stage *</label>
                <select
                  id="report-stage"
                  name="stage"
                  required
                  value={form.stage}
                  onChange={e => setField("stage", e.target.value)}
                  disabled={isSubmitting}
                  suppressHydrationWarning
                >
                  {STAGE_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Work Done ─────────────────────────────────────────────── */}
            <div className="form-group">
              <label htmlFor="report-work">Work Done Today *</label>
              <textarea
                id="report-work"
                name="work_done"
                rows={3}
                placeholder="Describe construction work completed today..."
                required
                value={form.workDone}
                onChange={e => setField("workDone", e.target.value)}
                disabled={isSubmitting}
                suppressHydrationWarning
              />
            </div>

            {/* ── Issues / Problems ─────────────────────────────────────── */}
            <div className="form-group">
              <label htmlFor="report-issues">Issues / Problems</label>
              <textarea
                id="report-issues"
                name="issues"
                rows={2}
                placeholder="Note any issues, delays, or safety concerns..."
                value={form.issues}
                onChange={e => setField("issues", e.target.value)}
                disabled={isSubmitting}
                suppressHydrationWarning
              />
            </div>

            {/* ════════════════════════════════════════════════════════════
                EXPENSE SECTION
                ════════════════════════════════════════════════════════════ */}
            <div
              style={{
                background: "rgba(59,130,246,0.06)",
                border: "1.5px solid rgba(59,130,246,0.15)",
                borderRadius: "var(--radius-md, 12px)",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h4 style={{ fontSize: "0.95rem", marginBottom: "8px", color: "var(--text-dark)" }}>
                💰 Today&apos;s Expenses
              </h4>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                Enter the expenses incurred today. These will be added to the
                project&apos;s finance tracker on the admin dashboard.
              </p>

              {/* Labour / Material / Misc — 3 column grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="expense-labour">Labour Cost (₹)</label>
                  <input
                    type="number"
                    id="expense-labour"
                    name="labourCost"
                    placeholder="e.g. 15000"
                    min="0"
                    step="100"
                    value={form.labourCost}
                    onChange={e => setField("labourCost", e.target.value)}
                    disabled={isSubmitting}
                    suppressHydrationWarning
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="expense-material">Material Cost (₹)</label>
                  <input
                    type="number"
                    id="expense-material"
                    name="materialCost"
                    placeholder="e.g. 25000"
                    min="0"
                    step="100"
                    value={form.materialCost}
                    onChange={e => setField("materialCost", e.target.value)}
                    disabled={isSubmitting}
                    suppressHydrationWarning
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="expense-misc">Misc / Other (₹)</label>
                  <input
                    type="number"
                    id="expense-misc"
                    name="miscCost"
                    placeholder="e.g. 5000"
                    min="0"
                    step="100"
                    value={form.miscCost}
                    onChange={e => setField("miscCost", e.target.value)}
                    disabled={isSubmitting}
                    suppressHydrationWarning
                  />
                </div>
              </div>

              {/* Expense Description */}
              <div className="form-group" style={{ marginTop: "12px", marginBottom: 0 }}>
                <label htmlFor="expense-desc">Expense Description</label>
                <input
                  type="text"
                  id="expense-desc"
                  name="expenseDesc"
                  placeholder="e.g. Paid 10 masons for brickwork + cement delivery"
                  value={form.expenseDesc}
                  onChange={e => setField("expenseDesc", e.target.value)}
                  disabled={isSubmitting}
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* ── Site photos reminder banner ───────────────────────────── */}
            <div
              style={{
                background: "rgba(249,115,22,0.06)",
                border: "1.5px solid rgba(249,115,22,0.2)",
                borderRadius: "var(--radius-md, 12px)",
                padding: "14px 18px",
                marginBottom: "20px",
                fontSize: "0.88rem",
                color: "var(--text-mid)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Camera size={16} color="var(--orange, #f97316)" style={{ flexShrink: 0 }} />
              <span>
                <strong style={{ color: "var(--orange, #f97316)" }}>Site photos are mandatory</strong>
                {" "}before submitting. Go to{" "}
                <Link href="/supervisor" style={{ color: "var(--orange, #f97316)", fontWeight: 600 }}>Site Photos</Link>
                {" "}and upload at least one.
              </span>
            </div>

            {/* ── Submit button ─────────────────────────────────────────── */}
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              suppressHydrationWarning
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  Submitting…
                </>
              ) : (
                "Submit Daily Report & Expenses ✓"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
