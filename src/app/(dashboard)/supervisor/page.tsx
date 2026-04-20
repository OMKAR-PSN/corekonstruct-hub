"use client";

/**
 * src/app/(dashboard)/supervisor/page.tsx
 *
 * Supervisor Field Operations Dashboard.
 * Same sidebar/topbar pattern as admin and client pages.
 *
 * Panels:
 *   overview   — Stats + project mini-cards + quick-links
 *   report     — Link to the full Daily Report form (/supervisor/daily-report)
 *   attendance — Stub (LaborAttendanceTracker component)
 *   materials  — Stub (MaterialRequestForm component)
 *   photos     — Stub (StageUpdater / photo upload)
 *   progress   — Stub (progress update)
 *
 * CSS: dashboard.css (loaded via (dashboard)/layout.tsx)
 */

import { useState, useEffect } from "react";
import { useRouter }           from "next/navigation";
import Link                    from "next/link";
import { createClient }        from "@/utils/supabase/client";
import {
  Building2, LayoutDashboard, FilePen, HardHat,
  Package, Camera, TrendingUp, LogOut, Menu,
  ChevronRight, AlertTriangle, CheckCircle2,
  ClipboardList, Ruler, ExternalLink,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────

type Project = {
  id:                  string;
  name:                string;
  status:              "active" | "delayed" | "completed" | "on-hold";
  progress_percentage: number;
  current_stage:       string | null;
  created_at:          string;
};

type PanelId =
  | "overview" | "report" | "attendance"
  | "materials" | "photos" | "progress";

// ─── Constants ──────────────────────────────────────────────────────────────

const NAV_FIELD = [
  { id: "overview"   as PanelId, label: "Overview",        Icon: LayoutDashboard },
  { id: "report"     as PanelId, label: "Daily Report",    Icon: FilePen         },
  { id: "attendance" as PanelId, label: "Attendance",      Icon: HardHat         },
  { id: "materials"  as PanelId, label: "Materials",       Icon: Package         },
  { id: "photos"     as PanelId, label: "Site Photos",     Icon: Camera          },
  { id: "progress"   as PanelId, label: "Progress Update", Icon: TrendingUp      },
  { id: "measurements" as PanelId, label: "Measurements",  Icon: Ruler           },
];

const PANEL_TITLES: Record<PanelId | string, string> = {
  overview:     "Field Overview",
  report:       "Daily Report",
  attendance:   "Attendance",
  materials:    "Materials",
  photos:       "Site Photos",
  progress:     "Progress Update",
  measurements: "Measurements",
};

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80";

// ─── Helpers ────────────────────────────────────────────────────────────────

function statusBadgeClass(status: Project["status"]): string {
  return ({
    active:    "badge-success",
    delayed:   "badge-danger",
    completed: "badge-blue",
    "on-hold": "badge-amber",
  } as Record<string, string>)[status] ?? "badge-blue";
}

function dateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// ─── ProgressRing ───────────────────────────────────────────────────────────

function ProgressRing({ pct, size = 120 }: { pct: number; size?: number }) {
  const sw     = 9;
  const r      = (size - sw * 2) / 2;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  const cx     = size / 2;
  const color  = pct >= 80 ? "#22c55e" : pct >= 50 ? "#3b82f6" : pct >= 25 ? "#f59e0b" : "#ef4444";

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
        <span className="pct" style={{ fontSize: "1.2rem", color }}>{pct}%</span>
        <span className="sub">done</span>
      </div>
    </div>
  );
}

// ─── QuickActionCard ────────────────────────────────────────────────────────

function QuickActionCard({
  icon: Icon, label, description, onClick, href, color = "#f97316",
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  onClick?: () => void;
  href?: string;
  color?: string;
}) {
  const inner = (
    <div
      style={{
        display: "flex", alignItems: "flex-start", gap: 14,
        padding: "18px 20px", background: "#fff",
        borderRadius: 14, border: "1px solid #e2e8f0",
        cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s",
        textDecoration: "none", color: "inherit",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
      onClick={onClick}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#0f172a", marginBottom: 3 }}>
          {label}
        </div>
        <div style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.4 }}>{description}</div>
      </div>
      <ChevronRight size={16} style={{ color: "#cbd5e1", flexShrink: 0, marginTop: 4 }} />
    </div>
  );

  if (href) return <Link href={href} style={{ textDecoration: "none" }}>{inner}</Link>;
  return inner;
}

// ─── ProjectMiniCard ────────────────────────────────────────────────────────

function ProjectMiniCard({ project }: { project: Project }) {
  const isDelayed = project.status === "delayed";
  return (
    <div style={{
      background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0",
      overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      {/* Mini image strip */}
      <div style={{ height: 100, overflow: "hidden", position: "relative" }}>
        <img src={DEFAULT_COVER} alt={project.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(11,31,58,0.75), transparent)",
          display: "flex", alignItems: "flex-end", padding: "10px 14px",
        }}>
          <span className={`badge ${isDelayed ? "badge-danger" : "badge-success"}`}
            style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: "0.65rem" }}>
            {isDelayed ? <><AlertTriangle size={9} /> Delayed</> : <><CheckCircle2 size={9} /> On Track</>}
          </span>
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0f172a", marginBottom: 4, lineHeight: 1.3 }}>
          {project.name}
        </div>
        {project.current_stage && (
          <span className="badge badge-navy mb-8" style={{ display: "inline-flex", fontSize: "0.65rem" }}>
            {project.current_stage}
          </span>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#94a3b8", marginBottom: 4 }}>
          <span>Progress</span>
          <strong style={{ color: "#3b82f6" }}>{project.progress_percentage}%</strong>
        </div>
        <div className="progress-bar-wrap" style={{ height: 5 }}>
          <div className="progress-bar-fill" style={{ width: `${project.progress_percentage}%` }} />
        </div>
      </div>
    </div>
  );
}

// ─── StubPanel ───────────────────────────────────────────────────────────────

function StubPanel({ title, Icon, description, actionLabel, actionHref, actionClick }: {
  title: string;
  Icon: React.ElementType;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  actionClick?: () => void;
}) {
  return (
    <div className="dash-panel">
      <div className="dash-panel-body" style={{ padding: "64px 24px", textAlign: "center" }}>
        <Icon size={44} strokeWidth={1} style={{ color: "#cbd5e1", margin: "0 auto 16px" }} />
        <h3 style={{ color: "#475569", marginBottom: 8 }}>{title}</h3>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem", maxWidth: 360, margin: "0 auto 20px" }}>
          {description}
        </p>
        {(actionLabel && actionHref) && (
          <Link href={actionHref} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            {actionLabel} <ExternalLink size={14} />
          </Link>
        )}
        {(actionLabel && actionClick && !actionHref) && (
          <button className="btn-primary" onClick={actionClick} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function SupervisorPage() {
  const router = useRouter();

  const [projects,     setProjects]     = useState<Project[]>([]);
  const [profile,      setProfile]      = useState<{ full_name: string | null } | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [activePanel,  setActivePanel]  = useState<PanelId>("overview");
  const [mobileSidebar,setMobileSidebar]= useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────
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

  // ── Sign out ────────────────────────────────────────────────────────────
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
  }

  function switchPanel(id: PanelId) {
    setActivePanel(id);
    setMobileSidebar(false);
  }

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f1f5f9" }}>
        <div style={{ textAlign: "center" }}>
          <Building2 size={44} style={{ color: "#f97316", margin: "0 auto 16px" }} />
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Loading field operations…</p>
        </div>
      </div>
    );
  }

  const firstName  = profile?.full_name?.split(" ")[0] ?? "Supervisor";
  const total      = projects.length;
  const delayed    = projects.filter(p => p.status === "delayed").length;
  const avgProg    = total
    ? Math.round(projects.reduce((s, p) => s + p.progress_percentage, 0) / total)
    : 0;

  // ─── PANELS ─────────────────────────────────────────────────────────────

  /* ── Overview ── */
  const overviewPanel = (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
          Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"},{" "}
          {firstName} 👷
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.88rem", marginTop: 4 }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* KPI stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 28 }}>
        <div className="stat-card orange">
          <div className="stat-icon orange"><ClipboardList size={20} /></div>
          <div className="stat-body">
            <div className="val">{total}</div>
            <div className="lbl">Assigned Projects</div>
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
            <div className="lbl">Delayed</div>
          </div>
        </div>
      </div>

      {/* Two-col: quick actions + project ring */}
      <div className="two-col-grid">

        {/* Quick Actions */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3><FilePen size={14} style={{ verticalAlign: "middle" }} /> Quick Actions</h3>
          </div>
          <div className="dash-panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <QuickActionCard
              icon={FilePen}
              label="Submit Daily Report"
              description="Log today's site work, weather, and expenses."
              href="/supervisor/daily-report"
              color="#f97316"
            />
            <QuickActionCard
              icon={HardHat}
              label="Mark Attendance"
              description="Record labour headcount for today's shift."
              onClick={() => switchPanel("attendance")}
              color="#3b82f6"
            />
            <QuickActionCard
              icon={Package}
              label="Log Materials"
              description="Submit material requests and usage logs."
              onClick={() => switchPanel("materials")}
              color="#10b981"
            />
            <QuickActionCard
              icon={Camera}
              label="Upload Site Photos"
              description="Attach daily site progress photos."
              onClick={() => switchPanel("photos")}
              color="#8b5cf6"
            />
            <QuickActionCard
              icon={TrendingUp}
              label="Update Progress"
              description="Update stage completion percentage."
              onClick={() => switchPanel("progress")}
              color="#f59e0b"
            />
            <QuickActionCard
              icon={Ruler}
              label="Measurements"
              description="Enter site measurement records."
              onClick={() => switchPanel("measurements" as PanelId)}
              color="#06b6d4"
            />
          </div>
        </div>

        {/* Assigned Projects */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3><ClipboardList size={14} style={{ verticalAlign: "middle" }} /> Assigned Projects</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ProgressRing pct={avgProg} size={52} />
            </div>
          </div>
          <div className="dash-panel-body">
            {projects.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>
                No projects assigned yet.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {projects.map(p => (
                  <div key={p.id} style={{
                    padding: "12px 14px", borderRadius: 10,
                    border: "1px solid #f1f5f9", background: "#fafafa",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "#0f172a" }}>{p.name}</span>
                      <span className={`badge ${statusBadgeClass(p.status)}`} style={{ fontSize: "0.68rem" }}>
                        {p.status}
                      </span>
                    </div>
                    {p.current_stage && (
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 6 }}>
                        Stage: <strong style={{ color: "#475569" }}>{p.current_stage}</strong>
                      </div>
                    )}
                    <div className="progress-bar-wrap" style={{ height: 5 }}>
                      <div className="progress-bar-fill" style={{ width: `${p.progress_percentage}%` }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4, fontSize: "0.72rem", color: "#3b82f6", fontWeight: 700 }}>
                      {p.progress_percentage}%
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Project mini-cards grid if multiple */}
            {projects.length >= 2 && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
                  Visual Overview
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {projects.slice(0, 4).map(p => (
                    <ProjectMiniCard key={p.id} project={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Daily Report redirect panel ── */
  const reportPanel = (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Daily Report</h2>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
          Submit your end-of-day field report including work done, blockers, and expenses.
        </p>
      </div>
      <div className="dash-panel">
        <div className="dash-panel-body" style={{ padding: "48px 24px", textAlign: "center" }}>
          <FilePen size={44} strokeWidth={1} style={{ color: "#f97316", margin: "0 auto 16px" }} />
          <h3 style={{ color: "#0f172a", marginBottom: 8 }}>Submit Today&apos;s Report</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", maxWidth: 380, margin: "0 auto 24px" }}>
            The daily report form captures site activity, weather conditions, labour &amp; material expenses, and issues for the day.
          </p>
          <Link href="/supervisor/daily-report" className="btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <FilePen size={16} /> Open Daily Report Form
          </Link>
        </div>
      </div>
    </div>
  );

  /* ── Panel map ── */
  const PANELS: Record<string, React.ReactNode> = {
    overview:     overviewPanel,
    report:       reportPanel,
    attendance:   <StubPanel title="Mark Attendance" Icon={HardHat}   description="Labour headcount tracker — log which workers were present on site today." actionLabel="Coming Soon" />,
    materials:    <StubPanel title="Material Logs"   Icon={Package}   description="Submit material requests and log daily material usage per project." />,
    photos:       <StubPanel title="Site Photos"     Icon={Camera}    description="Upload daily site progress photos — they'll be visible to the admin and client." />,
    progress:     <StubPanel title="Progress Update" Icon={TrendingUp} description="Update the completion percentage and current stage for your assigned projects." />,
    measurements: <StubPanel title="Measurements"   Icon={Ruler}     description="Record site measurements (RCC, excavation, plastering area, etc.)." />,
  };

  // ─── RENDER ────────────────────────────────────────────────────────────

  return (
    <div className="admin-layout">

      {/* Mobile backdrop */}
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

        {/* User pill */}
        <div style={{
          padding: "12px 20px 18px",
          display: "flex", alignItems: "center", gap: 10,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0,
          }}>
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ color: "#fff",    fontWeight: 600, fontSize: "0.88rem" }}>{profile?.full_name ?? "Supervisor"}</div>
            <div style={{ color: "#94a3b8", fontSize: "0.72rem" }}>Field Supervisor</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
          <div className="admin-nav-section">Field Operations</div>
          {NAV_FIELD.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`admin-nav-item${activePanel === id ? " active" : ""}`}
              onClick={() => switchPanel(id)}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              <span>{label}</span>
              {id === "report" && (
                <span style={{
                  marginLeft: "auto", background: "#f97316", color: "#fff",
                  borderRadius: 999, fontSize: "0.6rem", fontWeight: 800,
                  padding: "2px 7px",
                }}>
                  Today
                </span>
              )}
              {activePanel === id && id !== "report" && (
                <ChevronRight size={14} style={{ marginLeft: "auto" }} />
              )}
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

        {/* Topbar */}
        <header className="admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setMobileSidebar(true)} aria-label="Open sidebar"
              style={{ border: "none", background: "transparent", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex", alignItems: "center" }}>
              <Menu size={22} color="#475569" />
            </button>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
                {PANEL_TITLES[activePanel] ?? "Dashboard"}
              </h2>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                CoreKonstruct → Supervisor
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/supervisor/daily-report"
              className="btn-primary"
              style={{ padding: "8px 16px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <FilePen size={14} /> Daily Report
            </Link>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })}
            </span>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: "28px 24px" }}>
          {PANELS[activePanel]}
        </main>
      </div>
    </div>
  );
}
