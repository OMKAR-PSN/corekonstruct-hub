"use client";

/**
 * src/app/(dashboard)/admin/page.tsx
 *
 * Admin Operations Dashboard — Client Component.
 * Faithful conversion of dashboard-admin.html panel-overview + project-modal.
 *
 * CSS classes:   dashboard.css (imported via layout.tsx)
 * Icons:         Lucide React (installed) — FontAwesome equivalents
 * Data:          Supabase browser client fetched on mount
 * Finance data:  Derived from progress_percentage until budget schema lands
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  LayoutDashboard, ClipboardList, TrendingUp, HardHat,
  Banknote, Scroll, Users, Bell, LogOut, Building2,
  X, MapPin, Calendar, ChevronRight, AlertTriangle,
  CheckCircle2, Menu, TrendingDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Project = {
  id: string;
  name: string;
  status: "active" | "delayed" | "completed" | "on-hold";
  progress_percentage: number;
  current_stage: string | null;
  created_at: string;
  client_id: string | null;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_MAIN = [
  { id: "overview",   label: "Overview",      Icon: LayoutDashboard },
  { id: "projects",   label: "Projects",      Icon: ClipboardList   },
  { id: "monitoring", label: "Monitoring",    Icon: TrendingUp      },
  { id: "attendance", label: "Attendance",    Icon: HardHat         },
  { id: "finance",    label: "Finance",       Icon: Banknote        },
  { id: "sanction",   label: "Sanction Plan", Icon: Scroll          },
  { id: "users",      label: "Users",         Icon: Users           },
];

const NAV_COMMS = [
  { id: "alerts", label: "Alerts & Messages", Icon: Bell },
];

const PANEL_TITLES: Record<string, string> = {
  overview:   "Dashboard Overview",
  projects:   "Project Management",
  monitoring: "Site Monitoring",
  attendance: "Attendance Records",
  finance:    "Finance Overview",
  sanction:   "Sanction Plan",
  users:      "Registered Users",
  alerts:     "Alerts & Messages",
};

// 7 standard construction stages — matches the stage tracker in the HTML modal
const STAGES = ["Foundation", "Structure", "Brickwork", "Plastering", "Finishing", "Services", "Handover"];

// Default cover for project cards (no cover column in schema yet)
const DEFAULT_COVER = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatINR(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

/** Derive mock financials from progress until budget schema migration lands. [MOCK] */
function deriveFinancials(progress: number) {
  const spent    = progress * 85_000;                        // [MOCK]
  const budget   = Math.round(spent / Math.max(progress / 100, 0.05)); // [MOCK]
  const labour   = Math.round(spent * 0.45);
  const material = Math.round(spent * 0.40);
  const misc     = Math.round(spent * 0.15);
  return { labour, material, misc, spent, budget };
}

function dateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function statusBadgeClass(status: Project["status"]): string {
  return ({
    active:    "badge-success",
    delayed:   "badge-danger",
    completed: "badge-blue",
    "on-hold": "badge-amber",
  } as Record<string, string>)[status] ?? "badge-blue";
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** SVG circular progress ring — matches circle-progress-wrap in the HTML */
function ProgressRing({ pct, size = 140 }: { pct: number; size?: number }) {
  const sw     = 9;
  const r      = (size - sw * 2) / 2;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  const cx     = size / 2;
  const color  =
    pct >= 80 ? "#22c55e" :
    pct >= 50 ? "#3b82f6" :
    pct >= 25 ? "#f59e0b" : "#ef4444";

  return (
    <div className="circle-progress-wrap" style={{ width: size, height: size }}>
      <svg
        width={size} height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
        aria-hidden="true"
      >
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#e2e8f0" strokeWidth={sw} />
        <circle
          cx={cx} cy={cx} r={r}
          fill="none" stroke={color} strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          strokeDashoffset={`${offset}`}
        />
      </svg>
      <div className="circle-label">
        <span className="pct" style={{ fontSize: size < 110 ? "1rem" : "1.8rem", color }}>
          {pct}%
        </span>
        <span className="sub">Overall</span>
      </div>
    </div>
  );
}

/** Horizontal stage progress tracker — matches .stage-tracker in the HTML */
function StageTracker({ currentStage }: { currentStage: string | null }) {
  const activeIdx = currentStage
    ? STAGES.findIndex(s => s.toLowerCase() === currentStage.toLowerCase())
    : -1;

  return (
    <div className="stage-tracker">
      {STAGES.map((stage, i) => {
        const done   = i < activeIdx;
        const active = i === activeIdx;
        return (
          <div key={stage} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.7rem", fontWeight: 700, flexShrink: 0,
                background: done ? "#22c55e" : active ? "#3b82f6" : "#f1f5f9",
                color: (done || active) ? "#fff" : "#94a3b8",
                border: active ? "2.5px solid #2563eb" : "2px solid transparent",
                boxSizing: "border-box",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: "0.62rem", textAlign: "center", fontWeight: active ? 700 : 400,
                color: active ? "#3b82f6" : "#94a3b8", lineHeight: 1.2,
              }}>
                {stage}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div style={{
                flex: 1, height: 2,
                background: done ? "#22c55e" : "#e2e8f0",
                margin: "0 3px", marginBottom: 20,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Project Detail Modal — matches <div id="project-modal"> in the HTML */
function ProjectDetailModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const { labour, material, misc, spent, budget } = deriveFinancials(
    project.progress_percentage
  );
  const utilisation  = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const utilColor    = utilisation > 90 ? "#ef4444" : utilisation > 75 ? "#f59e0b" : "#22c55e";

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-box" style={{ maxWidth: 720 }}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={14} />
        </button>

        {/* ── Project hero image */}
        <div className="pm-hero">
          <img src={DEFAULT_COVER} alt={project.name} />
        </div>

        {/* ── Header row: badge + name + ring */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 28, flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <span
              className={`badge ${statusBadgeClass(project.status)} mb-8`}
              style={{ display: "inline-flex" }}
            >
              {project.status.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())}
            </span>
            <h2 style={{ margin: "8px 0 4px", fontSize: "1.4rem", fontWeight: 800, color: "#0f172a" }}>
              {project.name}
            </h2>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: "0.85rem", color: "#94a3b8", marginTop: 6 }}>
              <span>
                <MapPin size={13} style={{ verticalAlign: "middle", marginRight: 4 }} />
                {project.current_stage ? `Stage: ${project.current_stage}` : "Stage TBD"}
              </span>
              <span>
                <Calendar size={13} style={{ verticalAlign: "middle", marginRight: 4 }} />
                Added {dateLabel(project.created_at)}
              </span>
            </div>
          </div>
          <ProgressRing pct={project.progress_percentage} size={96} />
        </div>

        {/* ── Stage tracker */}
        <h4 style={{
          marginBottom: 12, fontSize: "0.82rem", color: "#94a3b8",
          textTransform: "uppercase", letterSpacing: "0.08em",
        }}>
          Work Stages
        </h4>
        <StageTracker currentStage={project.current_stage} />

        {/* ── Finance breakdown */}
        <h4 style={{
          margin: "24px 0 16px", fontSize: "0.82rem", color: "#94a3b8",
          textTransform: "uppercase", letterSpacing: "0.08em",
        }}>
          Finance Breakdown{" "}
          <span style={{ fontSize: "0.7rem", color: "#cbd5e1", textTransform: "none" }}>
            (estimated)
          </span>
        </h4>

        <div style={{ display: "grid", gap: 10 }}>
          {[
            { label: "Labour Cost",  color: "#3B82F6", amount: labour   },
            { label: "Material Cost",color: "#F97316", amount: material  },
            { label: "Miscellaneous",color: "#10B981", amount: misc      },
          ].map(({ label, color, amount }) => {
            const sharePct = spent > 0 ? Math.round((amount / spent) * 100) : 0;
            return (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 4 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />
                    {label}
                  </span>
                  <strong>{formatINR(amount)}</strong>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${sharePct}%`, background: color }} />
                </div>
              </div>
            );
          })}

          {/* Total row */}
          <div style={{
            padding: "14px 18px",
            background: "#f8fafc",
            borderRadius: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
            border: "1px solid #e2e8f0",
          }}>
            <div>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Total Spent</div>
              <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "#0f172a" }}>{formatINR(spent)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Budget</div>
              <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "#0f172a" }}>{formatINR(budget)}</div>
            </div>
          </div>

          {/* Utilisation bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#94a3b8", marginBottom: 4 }}>
              <span>Budget utilisation</span>
              <span style={{ color: utilColor, fontWeight: 700 }}>{utilisation}%</span>
            </div>
            <div className="progress-bar-wrap" style={{ height: 12 }}>
              <div style={{
                height: "100%", borderRadius: 999,
                width: `${Math.min(utilisation, 100)}%`,
                background: utilColor,
                transition: "width 1s ease",
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Premium project card — matches .premium-card in renderProjectCards() */
function PremiumProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  const isDelayed = project.status === "delayed";

  return (
    <div className="premium-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick()}>
      {/* Cover image with gradient overlay */}
      <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
        <img
          src={DEFAULT_COVER}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt={project.name}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(11,31,58,0.78), transparent)",
          display: "flex", alignItems: "flex-end", padding: 16,
        }}>
          <div>
            <span
              className={`badge ${isDelayed ? "badge-danger" : "badge-success"}`}
              style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              {isDelayed
                ? <><AlertTriangle size={10} /> Delayed</>
                : <><CheckCircle2 size={10} /> On Track</>
              }
            </span>
            <div style={{ color: "#fff", fontWeight: 700, marginTop: 4, fontSize: "0.95rem" }}>
              {project.name}
            </div>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "16px 20px" }}>
        <span className="badge badge-navy mb-8" style={{ display: "inline-flex" }}>
          {project.current_stage ?? "Construction"}
        </span>
        <div style={{ fontSize: "0.8rem", color: "#94a3b8", margin: "6px 0 10px" }}>
          <Calendar size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />
          Added {dateLabel(project.created_at)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: "0.82rem", color: "#475569" }}>Progress</span>
          <strong style={{ color: "#3b82f6" }}>{project.progress_percentage}%</strong>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${project.progress_percentage}%` }} />
        </div>
      </div>
    </div>
  );
}

/** Stub panel for panels not yet implemented */
function StubPanel({ title, Icon, description }: {
  title: string;
  Icon: React.ElementType;
  description: string;
}) {
  return (
    <div className="dash-panel">
      <div className="dash-panel-body" style={{ padding: "64px 24px", textAlign: "center" }}>
        <Icon size={44} strokeWidth={1} style={{ color: "#cbd5e1", margin: "0 auto 16px" }} />
        <h3 style={{ color: "#475569", marginBottom: 8 }}>{title}</h3>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem", maxWidth: 360, margin: "0 auto" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();

  const [projects,       setProjects]       = useState<Project[]>([]);
  const [profile,        setProfile]        = useState<{ full_name: string | null } | null>(null);
  const [loading,        setLoading]        = useState(true);
  const [activePanel,    setActivePanel]    = useState("overview");
  const [selectedProject,setSelectedProject]= useState<Project | null>(null);
  const [mobileSidebar,  setMobileSidebar]  = useState(false);

  // ── Fetch data on mount ───────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }

      const [{ data: profileData }, { data: projectsData }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", user.id).single(),
        supabase.from("projects").select("*").order("created_at", { ascending: false }),
      ]);

      setProfile(profileData);
      setProjects((projectsData ?? []) as Project[]);
      setLoading(false);
    })();
  }, [router]);

  // ── Sign out ──────────────────────────────────────────────────────────────
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
  }

  // ── Computed KPIs ─────────────────────────────────────────────────────────
  const total   = projects.length;
  const delayed = projects.filter(p => p.status === "delayed").length;
  const avgProg = total
    ? Math.round(projects.reduce((s, p) => s + p.progress_percentage, 0) / total)
    : 0;
  const firstName = profile?.full_name?.split(" ")[0] ?? "Admin";

  // ── Panel switcher ────────────────────────────────────────────────────────
  function switchPanel(id: string) {
    setActivePanel(id);
    setMobileSidebar(false);
  }

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f1f5f9" }}>
        <div style={{ textAlign: "center" }}>
          <Building2 size={44} style={{ color: "#f97316", margin: "0 auto 16px" }} />
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Loading operations data…</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PANELS
  // ─────────────────────────────────────────────────────────────────────────

  /* ── Overview panel (panel-overview in HTML) ── */
  const overviewPanel = (
    <div>
      {/* Stats grid — 3 cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="stat-card orange">
          <div className="stat-icon orange"><ClipboardList size={20} /></div>
          <div className="stat-body">
            <div className="val">{total}</div>
            <div className="lbl">Active Projects</div>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon info"><TrendingUp size={20} /></div>
          <div className="stat-body">
            <div className="val">{avgProg}%</div>
            <div className="lbl">Avg Progress</div>
          </div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon danger"><AlertTriangle size={20} /></div>
          <div className="stat-body">
            <div className="val">{delayed}</div>
            <div className="lbl">Delayed Projects</div>
            {delayed > 0 && <div className="change down"><TrendingDown size={11} style={{ verticalAlign: "middle" }} /> Needs attention</div>}
          </div>
        </div>
      </div>

      {/* Two-col: ring + project list */}
      <div className="two-col-grid">

        {/* Overall Portfolio Progress ring */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3><TrendingUp size={15} style={{ verticalAlign: "middle" }} /> Overall Portfolio Progress</h3>
            <span className="badge badge-blue">Live</span>
          </div>
          <div className="dash-panel-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <div style={{ margin: "12px 0" }}>
              <ProgressRing pct={avgProg} size={160} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, width: "100%" }}>
              {[
                { label: "On Track", value: total - delayed, bg: "rgba(34,197,94,0.08)",  color: "#22c55e" },
                { label: "Delayed",  value: delayed,          bg: "rgba(239,68,68,0.08)",  color: "#ef4444" },
                { label: "Total",    value: total,            bg: "#f8fafc",               color: "#0f172a" },
              ].map(({ label, value, bg, color }) => (
                <div key={label} style={{ textAlign: "center", padding: 12, background: bg, borderRadius: 10 }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color }}>{value}</div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active projects list */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3><ClipboardList size={15} style={{ verticalAlign: "middle" }} /> Active Projects</h3>
            <button
              className="btn-primary"
              onClick={() => switchPanel("projects")}
              style={{ padding: "6px 14px", fontSize: "0.8rem" }}
            >
              View All →
            </button>
          </div>
          <div className="dash-panel-body">
            {projects.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>
                No projects found.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {projects.slice(0, 6).map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    style={{
                      cursor: "pointer", padding: "11px 14px",
                      borderRadius: 10, border: "1px solid #f1f5f9",
                      background: "#fafafa", transition: "background 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#fafafa")}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "#0f172a" }}>{p.name}</span>
                      <span className={`badge ${statusBadgeClass(p.status)}`} style={{ fontSize: "0.68rem" }}>
                        {p.status}
                      </span>
                    </div>
                    <div className="progress-bar-wrap" style={{ height: 5 }}>
                      <div className="progress-bar-fill" style={{ width: `${p.progress_percentage}%` }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: "0.72rem", color: "#94a3b8" }}>
                      <span>{p.current_stage ?? "—"}</span>
                      <span>{p.progress_percentage}%</span>
                    </div>
                  </div>
                ))}
                {projects.length > 6 && (
                  <button
                    className="btn-secondary"
                    onClick={() => switchPanel("projects")}
                    style={{ width: "100%", marginTop: 4 }}
                  >
                    +{projects.length - 6} more projects
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Projects panel (panel-projects in HTML) ── */
  const projectsPanel = (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0f172a" }}>Project Management</h2>
      </div>
      {projects.length === 0 ? (
        <div className="dash-panel">
          <div className="dash-panel-body" style={{ padding: "60px 24px", textAlign: "center" }}>
            <ClipboardList size={40} strokeWidth={1} style={{ color: "#cbd5e1", margin: "0 auto 16px" }} />
            <p style={{ color: "#94a3b8" }}>No projects yet.</p>
          </div>
        </div>
      ) : (
        <div className="three-col-grid">
          {projects.map(p => (
            <PremiumProjectCard
              key={p.id}
              project={p}
              onClick={() => setSelectedProject(p)}
            />
          ))}
        </div>
      )}
    </div>
  );

  /* ── Finance panel (panel-finance in HTML) ── */
  const financePanel = (() => {
    const totals = projects.reduce(
      (acc, p) => {
        const f = deriveFinancials(p.progress_percentage);
        return {
          labour:   acc.labour   + f.labour,
          material: acc.material + f.material,
          misc:     acc.misc     + f.misc,
          budget:   acc.budget   + f.budget,
          spent:    acc.spent    + f.spent,
        };
      },
      { labour: 0, material: 0, misc: 0, budget: 0, spent: 0 }
    );

    return (
      <div>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 24 }}>Finance Overview</h2>

        <div className="stats-grid">
          {[
            { label: "Total Labour",   value: formatINR(totals.labour),   cls: "info",    Icon: HardHat   },
            { label: "Total Material", value: formatINR(totals.material), cls: "orange",  Icon: ClipboardList },
            { label: "Total Spent",    value: formatINR(totals.spent),    cls: "success", Icon: Banknote  },
            { label: "Total Budget",   value: formatINR(totals.budget),   cls: "warning", Icon: Scroll    },
          ].map(({ label, value, cls, Icon }) => (
            <div key={label} className={`stat-card ${cls}`}>
              <div className={`stat-icon ${cls}`}><Icon size={20} /></div>
              <div className="stat-body">
                <div className="val" style={{ fontSize: "1.2rem" }}>{value}</div>
                <div className="lbl">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3><TrendingUp size={15} style={{ verticalAlign: "middle" }} /> Finance by Project</h3>
          </div>
          <div className="dash-panel-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Labour</th>
                  <th>Material</th>
                  <th>Misc</th>
                  <th>Total Spent</th>
                  <th>Budget</th>
                  <th>Utilisation</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => {
                  const f   = deriveFinancials(p.progress_percentage);
                  const sp  = f.labour + f.material + f.misc;
                  const ut  = f.budget > 0 ? Math.round((sp / f.budget) * 100) : 0;
                  const cls = ut > 90 ? "badge-danger" : ut > 75 ? "badge-amber" : "badge-success";
                  return (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.name}</strong><br />
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                          {p.current_stage ?? "—"}
                        </span>
                      </td>
                      <td>{formatINR(f.labour)}</td>
                      <td>{formatINR(f.material)}</td>
                      <td>{formatINR(f.misc)}</td>
                      <td><strong>{formatINR(sp)}</strong></td>
                      <td>{formatINR(f.budget)}</td>
                      <td><span className={`badge ${cls}`}>{ut}%</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  })();

  /* ── Panel map ── */
  const PANELS: Record<string, React.ReactNode> = {
    overview:   overviewPanel,
    projects:   projectsPanel,
    finance:    financePanel,
    monitoring: <StubPanel title="Site Monitoring"    Icon={TrendingUp} description="Live stage updates and supervisor field data — coming soon once daily_reports is wired." />,
    attendance: <StubPanel title="Attendance Records" Icon={HardHat}    description="Labour headcount logs from supervisors will appear here." />,
    sanction:   <StubPanel title="Sanction Plan"      Icon={Scroll}     description="Government approvals, NOCs, and project sanction documents." />,
    users:      <StubPanel title="Registered Users"   Icon={Users}      description="All supervisors, clients, and admins listed here." />,
    alerts:     <StubPanel title="Alerts & Messages"  Icon={Bell}       description="Supervisor alerts and contact form submissions from the website." />,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="admin-layout">

      {/* ── Mobile sidebar backdrop ── */}
      <div
        className={`sidebar-backdrop${mobileSidebar ? " show" : ""}`}
        onClick={() => setMobileSidebar(false)}
      />

      {/* ════ SIDEBAR ════ */}
      <aside className={`admin-sidebar${mobileSidebar ? " open" : ""}`}>

        {/* Logo */}
        <div style={{ padding: "26px 20px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Building2 size={20} color="#fff" />
          </div>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
            Core<span style={{ color: "#f97316" }}>Konstruct</span>
          </span>
        </div>

        {/* User */}
        <div style={{
          padding: "12px 20px 18px",
          display: "flex", alignItems: "center", gap: 10,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0,
          }}>
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ color: "#fff",    fontWeight: 600, fontSize: "0.88rem" }}>{profile?.full_name ?? "Admin"}</div>
            <div style={{ color: "#94a3b8", fontSize: "0.72rem" }}>Contractor / Admin</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
          <div className="admin-nav-section">Main</div>
          {NAV_MAIN.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`admin-nav-item${activePanel === id ? " active" : ""}`}
              onClick={() => switchPanel(id)}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              <span>{label}</span>
              {activePanel === id && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
            </button>
          ))}

          <div className="admin-nav-section" style={{ marginTop: 12 }}>Communication</div>
          {NAV_COMMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`admin-nav-item${activePanel === id ? " active" : ""}`}
              onClick={() => switchPanel(id)}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
              background: "rgba(239,68,68,0.1)", color: "#ef4444",
              fontSize: "0.88rem", fontWeight: 600, fontFamily: "inherit",
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
      <div className="admin-main">

        {/* ── Topbar ── */}
        <header className="admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileSidebar(true)}
              aria-label="Open sidebar"
              style={{
                border: "none", background: "transparent", cursor: "pointer",
                padding: 6, borderRadius: 8, display: "flex", alignItems: "center",
              }}
              suppressHydrationWarning
            >
              <Menu size={22} color="#475569" />
            </button>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
                {PANEL_TITLES[activePanel] ?? "Dashboard"}
              </h2>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>CoreKonstruct → Admin</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })}
            </span>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0f172a" }}>
              {profile?.full_name ?? "Admin"}
            </span>
          </div>
        </header>

        {/* ── Content ── */}
        <main style={{ flex: 1, padding: "28px 24px" }}>
          {PANELS[activePanel]}
        </main>
      </div>

      {/* ════ PROJECT DETAIL MODAL ════ */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
