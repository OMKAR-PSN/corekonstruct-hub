"use client";

/**
 * src/app/(dashboard)/client/page.tsx
 *
 * Client Dashboard — Read-Only project view.
 * Faithful conversion of dashboard-client.html:
 *   - cp-ongoing  : project cards grid
 *   - cp-detail   : progress ring + timeline + gallery stub
 *   - cp-completed: stub
 *   - cp-gallery  : stub
 *   - cp-converter: live currency converter (free exchange-rate API)
 *
 * SECURITY: NO financial data (budget / spent / cost) is fetched or displayed.
 * Only progress_percentage, current_stage, status, name.
 *
 * CSS: dashboard.css (loaded via (dashboard)/layout.tsx)
 * Icons: Lucide React
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Building2, HardHat, BarChart2, CheckCheck, Images,
  ArrowLeftRight, LogOut, Menu, ChevronRight, Lock,
  ArrowLeft, MapPin, Camera, RefreshCw,
  CheckCircle2, Circle, AlertTriangle,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────

type Project = {
  id: string;
  name: string;
  status: "active" | "delayed" | "completed" | "on-hold";
  progress_percentage: number;
  current_stage: string | null;
  created_at: string;
  client_id: string | null;
};

// ─── Constants ──────────────────────────────────────────────────────────────

type PanelId = "ongoing" | "detail" | "completed" | "gallery" | "converter";

const NAV_MY_PROJECTS = [
  { id: "ongoing"   as PanelId, label: "Ongoing Projects", Icon: HardHat       },
  { id: "detail"    as PanelId, label: "Project Details",  Icon: BarChart2     },
  { id: "completed" as PanelId, label: "Completed Works",  Icon: CheckCheck    },
];

const NAV_TOOLS = [
  { id: "gallery"   as PanelId, label: "Project Gallery",   Icon: Images        },
  { id: "converter" as PanelId, label: "Currency Converter",Icon: ArrowLeftRight},
];

const PANEL_TITLES: Record<PanelId, string> = {
  ongoing:   "My Projects",
  detail:    "Project Details",
  completed: "Completed Works",
  gallery:   "Project Gallery",
  converter: "Currency Converter",
};

// Simulated milestone timeline (will be replaced by DB table in a later phase)
const MOCK_TIMELINE = [
  { label: "Site Mobilisation", date: "Jan 12", description: "Clearance and temporary setups.", done: true  },
  { label: "Foundation",        date: "Mar 05", description: "Excavation and sub-base completion.", done: true  },
  { label: "Structure",         date: "Jul 20", description: "Pillars, slabs, and core shell done.", done: false },
  { label: "Handover",          date: "Dec 10", description: "Final inspections and key handover.", done: false },
];

// Cover image (no cover column in schema yet)
const DEFAULT_COVER = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80";

// Currency data
const CURRENCIES = [
  { code: "INR", flag: "🇮🇳", name: "Indian Rupee"     },
  { code: "USD", flag: "🇺🇸", name: "US Dollar"        },
  { code: "EUR", flag: "🇪🇺", name: "Euro"             },
  { code: "GBP", flag: "🇬🇧", name: "British Pound"    },
  { code: "AED", flag: "🇦🇪", name: "UAE Dirham"       },
  { code: "JPY", flag: "🇯🇵", name: "Japanese Yen"     },
  { code: "CAD", flag: "🇨🇦", name: "Canadian Dollar"  },
  { code: "AUD", flag: "🇦🇺", name: "Australian Dollar"},
  { code: "SGD", flag: "🇸🇬", name: "Singapore Dollar" },
  { code: "CNY", flag: "🇨🇳", name: "Chinese Yuan"     },
];

// Baseline INR→X rates (fallback if API unavailable)
const FALLBACK_RATES: Record<string, number> = {
  INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0094,
  AED: 0.044, JPY: 1.81, CAD: 0.016, AUD: 0.018, SGD: 0.016, CNY: 0.087,
};

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

function ProgressRing({ pct, size = 160 }: { pct: number; size?: number }) {
  const sw     = 10;
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
        <span style={{ fontFamily: "Outfit,sans-serif", fontSize: "2rem", fontWeight: 800, color, lineHeight: 1 }}>
          {pct}%
        </span>
        <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>complete</span>
      </div>
    </div>
  );
}

// ─── OngoingProjectCard ──────────────────────────────────────────────────────

function OngoingProjectCard({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: () => void;
}) {
  const isDelayed = project.status === "delayed";

  return (
    <div className="premium-card" onClick={onSelect} role="button" tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onSelect()}>
      {/* Cover with gradient overlay */}
      <div style={{ height: 175, overflow: "hidden", position: "relative" }}>
        <img
          src={DEFAULT_COVER}
          alt={project.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(11,31,58,0.78), transparent)",
          display: "flex", alignItems: "flex-end", padding: 16,
        }}>
          <div>
            <span className={`badge ${isDelayed ? "badge-danger" : "badge-success"}`}
              style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              {isDelayed
                ? <><AlertTriangle size={10} /> Delayed</>
                : <><CheckCircle2 size={10} /> On Track</>}
            </span>
            <div style={{ color: "#fff", fontWeight: 700, marginTop: 4, fontSize: "0.95rem" }}>
              {project.name}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 20px" }}>
        {project.current_stage && (
          <span className="badge badge-navy mb-8" style={{ display: "inline-flex" }}>
            {project.current_stage}
          </span>
        )}
        <div style={{ fontSize: "0.78rem", color: "#94a3b8", margin: "6px 0 10px" }}>
          Added {dateLabel(project.created_at)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: "0.82rem", color: "#475569" }}>Progress</span>
          <strong style={{ color: "#3b82f6" }}>{project.progress_percentage}%</strong>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${project.progress_percentage}%` }} />
        </div>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
          <span style={{ fontSize: "0.8rem", color: "#f97316", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            View Details <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── TimelineItem ────────────────────────────────────────────────────────────

function TimelineItem({ label, date, description, done, isLast }: {
  label: string; date: string; description: string; done: boolean; isLast: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 14, paddingBottom: isLast ? 0 : 24, position: "relative" }}>
      {/* Vertical line */}
      {!isLast && (
        <div style={{
          position: "absolute", left: 13, top: 28, bottom: 0,
          width: 2, background: done ? "#22c55e" : "#e2e8f0",
        }} />
      )}
      {/* Icon */}
      <div style={{ flexShrink: 0, zIndex: 1 }}>
        {done
          ? <CheckCircle2 size={28} style={{ color: "#22c55e" }} />
          : <Circle       size={28} style={{ color: "#e2e8f0" }} />
        }
      </div>
      {/* Text */}
      <div style={{ paddingTop: 4 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 3, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: done ? "#0f172a" : "#94a3b8" }}>
            {label}
          </span>
          <span className={`badge ${done ? "badge-success" : "badge-amber"}`} style={{ fontSize: "0.65rem" }}>
            {done ? "✓ Done" : date}
          </span>
        </div>
        <p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

// ─── CurrencyConverter ───────────────────────────────────────────────────────

function CurrencyConverter() {
  const [amount,   setAmount]   = useState(100000);
  const [fromCode, setFromCode] = useState("INR");
  const [toCode,   setToCode]   = useState("USD");
  const [rates,    setRates]    = useState<Record<string,number>>(FALLBACK_RATES);
  const [rateInfo, setRateInfo] = useState("");
  const [output,   setOutput]   = useState("—");
  const [loading,  setLoading]  = useState(false);

  // Fetch live rates from open.er-api.com (free, no key needed)
  const fetchRates = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("https://open.er-api.com/v6/latest/INR");
      const data = await res.json();
      if (data?.rates) {
        setRates(data.rates);
        setRateInfo(`Last updated: ${new Date(data.time_last_update_utc).toLocaleString("en-IN")}`);
      }
    } catch {
      setRateInfo("Using cached rates — live rates unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRates(); }, [fetchRates]);

  // Recalculate whenever inputs change
  useEffect(() => {
    if (!rates[fromCode] || !rates[toCode]) { setOutput("—"); return; }
    // Convert: amount (fromCode) → INR → toCode
    const inINR   = amount / rates[fromCode];
    const result  = inINR * rates[toCode];
    const fromFlag = CURRENCIES.find(c => c.code === fromCode)?.flag ?? "";
    const toFlag   = CURRENCIES.find(c => c.code === toCode  )?.flag ?? "";
    setOutput(`${toFlag} ${result.toLocaleString("en-IN", { maximumFractionDigits: 2 })} ${toCode}`);
    const rate = rates[toCode] / rates[fromCode];
    setRateInfo(`1 ${fromFlag} ${fromCode} = ${rate.toLocaleString("en-IN", { maximumFractionDigits: 4 })} ${toFlag} ${toCode}`);
  }, [amount, fromCode, toCode, rates]);

  function swapCurrencies() {
    setFromCode(toCode);
    setToCode(fromCode);
  }

  // Popular rates vs INR
  const popularPairs = ["USD","EUR","GBP","AED","SGD"];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: 4, fontWeight: 700 }}>
          <ArrowLeftRight size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />
          Currency Converter
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
          Convert project budgets and costs across currencies.
        </p>
      </div>

      <div className="two-col-grid">
        {/* Left — converter */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>Convert Currency</h3>
            <button onClick={fetchRates} title="Refresh rates" style={{
              border: "none", background: "transparent", cursor: "pointer",
              color: "#94a3b8", display: "flex", alignItems: "center", gap: 4,
              fontSize: "0.78rem",
            }}>
              <RefreshCw size={13} style={loading ? { animation: "spin 1s linear infinite" } : {}} />
              {loading ? "Fetching…" : "Refresh"}
            </button>
          </div>
          <div className="dash-panel-body">
            {/* Amount */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: "0.82rem", color: "#94a3b8", display: "block", marginBottom: 6 }}>
                Amount
              </label>
              <input
                type="number" min="0" value={amount}
                onChange={e => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                style={{
                  width: "100%", padding: "12px 14px", boxSizing: "border-box",
                  border: "1px solid #e2e8f0", borderRadius: 10,
                  background: "#f8fafc", fontSize: "1.1rem", fontWeight: 700,
                  fontFamily: "Outfit, Inter, sans-serif", color: "#0f172a", outline: "none",
                }}
              />
            </div>

            {/* From / Swap / To */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "end", marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: "0.82rem", color: "#94a3b8", display: "block", marginBottom: 6 }}>From</label>
                <select
                  value={fromCode}
                  onChange={e => setFromCode(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px",
                    border: "1px solid #e2e8f0", borderRadius: 10,
                    background: "#f8fafc", color: "#0f172a", fontSize: "0.95rem",
                    boxSizing: "border-box", outline: "none", cursor: "pointer",
                  }}
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={swapCurrencies}
                title="Swap currencies"
                style={{
                  background: "#3b82f6", color: "#fff", border: "none",
                  borderRadius: "50%", width: 40, height: 40, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "transform 0.3s", flexShrink: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "rotate(180deg)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "rotate(0deg)")}
              >
                <ArrowLeftRight size={16} />
              </button>

              <div>
                <label style={{ fontSize: "0.82rem", color: "#94a3b8", display: "block", marginBottom: 6 }}>To</label>
                <select
                  value={toCode}
                  onChange={e => setToCode(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px",
                    border: "1px solid #e2e8f0", borderRadius: 10,
                    background: "#f8fafc", color: "#0f172a", fontSize: "0.95rem",
                    boxSizing: "border-box", outline: "none", cursor: "pointer",
                  }}
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result box */}
            <div style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(45,212,191,0.06))",
              border: "1px solid #e2e8f0", borderRadius: 12,
              padding: "20px", textAlign: "center",
            }}>
              <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: 6 }}>Converted Amount</div>
              <div style={{ fontFamily: "Outfit,Inter,sans-serif", fontSize: "2rem", fontWeight: 800, color: "#3b82f6" }}>
                {output}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 8 }}>{rateInfo}</div>
            </div>
          </div>
        </div>

        {/* Right — popular rates vs INR */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3><BarChart2 size={15} style={{ verticalAlign: "middle" }} /> Popular Rates (vs INR)</h3>
            {loading && <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Updating…</span>}
          </div>
          <div className="dash-panel-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>1 INR =</th>
                  <th>1 Unit → INR</th>
                </tr>
              </thead>
              <tbody>
                {popularPairs.map(code => {
                  const curr    = CURRENCIES.find(c => c.code === code);
                  const rateOut = rates[code]   ?? 0;
                  const rateIn  = rateOut > 0 ? 1 / rateOut : 0;
                  return (
                    <tr key={code}>
                      <td>
                        <span style={{ fontSize: "1.1rem", marginRight: 8 }}>{curr?.flag}</span>
                        <strong>{code}</strong>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: 6 }}>{curr?.name}</span>
                      </td>
                      <td style={{ fontWeight: 700, color: "#3b82f6" }}>
                        {rateOut.toFixed(4)}
                      </td>
                      <td>₹ {rateIn.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── StubPanel ───────────────────────────────────────────────────────────────

function StubPanel({ title, Icon, description }: {
  title: string;
  Icon: React.ElementType;
  description: string;
}) {
  return (
    <div>
      <div className="dash-panel">
        <div className="dash-panel-body" style={{ padding: "64px 24px", textAlign: "center" }}>
          <Icon size={44} strokeWidth={1} style={{ color: "#cbd5e1", margin: "0 auto 16px" }} />
          <h3 style={{ color: "#475569", marginBottom: 8 }}>{title}</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", maxWidth: 360, margin: "0 auto" }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function ClientPage() {
  const router = useRouter();

  const [projects,      setProjects]      = useState<Project[]>([]);
  const [profile,       setProfile]       = useState<{ full_name: string | null } | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [activePanel,   setActivePanel]   = useState<PanelId>("ongoing");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }

      const [{ data: profileData }, { data: projectsData }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", user.id).single(),
        // RLS automatically filters to this client's projects
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

  // ── Panel switch ──────────────────────────────────────────────────────────
  function switchPanel(id: PanelId) {
    setActivePanel(id);
    setMobileSidebar(false);
  }

  function openDetail(project: Project) {
    setSelectedProject(project);
    setActivePanel("detail");
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f1f5f9" }}>
        <div style={{ textAlign: "center" }}>
          <Building2 size={44} style={{ color: "#f97316", margin: "0 auto 16px" }} />
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Loading your projects…</p>
        </div>
      </div>
    );
  }

  const firstName = profile?.full_name?.split(" ")[0] ?? "Client";

  // ─────────────────────────────────────────────────────────────────────────
  // PANEL CONTENT
  // ─────────────────────────────────────────────────────────────────────────

  /* ── cp-ongoing ── */
  const ongoingPanel = (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: 4, fontWeight: 700 }}>
          My Ongoing Projects
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
          Track the real-time progress of your active construction projects.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="dash-panel">
          <div className="dash-panel-body" style={{ padding: "60px 24px", textAlign: "center" }}>
            <HardHat size={40} strokeWidth={1} style={{ color: "#cbd5e1", margin: "0 auto 16px" }} />
            <p style={{ color: "#94a3b8" }}>No projects assigned to you yet.</p>
          </div>
        </div>
      ) : (
        <div className="three-col-grid">
          {projects.map(p => (
            <OngoingProjectCard
              key={p.id}
              project={p}
              onSelect={() => openDetail(p)}
            />
          ))}
        </div>
      )}
    </div>
  );

  /* ── cp-detail ── */
  const detailPanel = selectedProject ? (
    <div>
      {/* Cover banner */}
      <div style={{
        height: 220, overflow: "hidden", borderRadius: 16,
        marginBottom: 24, position: "relative",
      }}>
        <img
          src={DEFAULT_COVER}
          alt={selectedProject.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(11,31,58,0.82), transparent 60%)",
        }} />
        <div style={{ position: "absolute", bottom: 20, left: 24, color: "#fff" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0 }}>{selectedProject.name}</h2>
          <div style={{ fontSize: "0.85rem", opacity: 0.85, marginTop: 4 }}>
            <MapPin size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
            {selectedProject.current_stage ?? "Construction"}
          </div>
        </div>
      </div>

      {/* Back + badges row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <button
          onClick={() => switchPanel("ongoing")}
          className="btn-secondary"
          style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: 6 }}
        >
          <ArrowLeft size={14} /> Back to Projects
        </button>
        <div style={{ flex: 1 }} />
        {selectedProject.current_stage && (
          <span className="badge badge-blue">{selectedProject.current_stage}</span>
        )}
        <span className={`badge ${statusBadgeClass(selectedProject.status)}`}>
          {selectedProject.status.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())}
        </span>
      </div>

      {/* Two-col: ring + timeline */}
      <div className="two-col-grid" style={{ marginBottom: 24 }}>

        {/* Progress ring */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>
              <BarChart2 size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
              Overall Progress
            </h3>
          </div>
          <div className="dash-panel-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ margin: "12px 0" }}>
              <ProgressRing pct={selectedProject.progress_percentage} size={160} />
            </div>
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#94a3b8", marginBottom: 6 }}>
                <span>Progress</span>
                <span>{selectedProject.progress_percentage}%</span>
              </div>
              <div className="progress-bar-wrap" style={{ height: 10 }}>
                <div className="progress-bar-fill" style={{ width: `${selectedProject.progress_percentage}%` }} />
              </div>
            </div>
            <p style={{ fontSize: "0.82rem", color: "#94a3b8", textAlign: "center" }}>
              {selectedProject.progress_percentage >= 80
                ? "Project nearing completion. Handover soon."
                : selectedProject.progress_percentage >= 50
                ? "Major structural work underway. On schedule."
                : "Foundation and early-stage work in progress."}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>
              <CheckCheck size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
              Project Timeline
            </h3>
          </div>
          <div className="dash-panel-body">
            {MOCK_TIMELINE.map((item, i) => (
              <TimelineItem
                key={item.label}
                {...item}
                isLast={i === MOCK_TIMELINE.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Photo gallery stub */}
      <div className="dash-panel">
        <div className="dash-panel-header">
          <h3>
            <Camera size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
            Site Photo Gallery
          </h3>
          <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
            Supervisor uploads coming soon
          </span>
        </div>
        <div className="dash-panel-body" style={{ padding: "48px 24px", textAlign: "center" }}>
          <Camera size={36} strokeWidth={1} style={{ color: "#cbd5e1", margin: "0 auto 12px" }} />
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", maxWidth: 320, margin: "0 auto" }}>
            Site photos submitted by your supervisor will appear here once the photo upload feature is connected.
          </p>
        </div>
      </div>
    </div>
  ) : (
    /* No project selected — prompt user */
    <div className="dash-panel">
      <div className="dash-panel-body" style={{ padding: "60px 24px", textAlign: "center" }}>
        <BarChart2 size={40} strokeWidth={1} style={{ color: "#cbd5e1", margin: "0 auto 16px" }} />
        <p style={{ color: "#94a3b8" }}>
          Select a project from{" "}
          <button
            onClick={() => switchPanel("ongoing")}
            style={{ color: "#f97316", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
          >
            Ongoing Projects
          </button>{" "}
          to see details.
        </p>
      </div>
    </div>
  );

  /* ── Panel map ── */
  const PANELS: Record<PanelId, React.ReactNode> = {
    ongoing:   ongoingPanel,
    detail:    detailPanel,
    completed: <StubPanel title="Completed Works"  Icon={CheckCheck}    description="Portfolio of successfully delivered projects by Core Konstruct — coming soon." />,
    gallery:   <StubPanel title="Project Gallery"  Icon={Images}        description="Filterable photo gallery across all your projects — coming soon." />,
    converter: <CurrencyConverter />,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="admin-layout">

      {/* ── Mobile backdrop ── */}
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
            background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0,
          }}>
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ color: "#fff",    fontWeight: 600, fontSize: "0.88rem" }}>{profile?.full_name ?? "Client"}</div>
            <div style={{ color: "#94a3b8", fontSize: "0.72rem" }}>Client</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
          <div className="admin-nav-section">My Projects</div>
          {NAV_MY_PROJECTS.map(({ id, label, Icon }) => (
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

          <div className="admin-nav-section" style={{ marginTop: 12 }}>Tools</div>
          {NAV_TOOLS.map(({ id, label, Icon }) => (
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
            <button
              onClick={() => setMobileSidebar(true)}
              aria-label="Open sidebar"
              style={{
                border: "none", background: "transparent", cursor: "pointer",
                padding: 6, borderRadius: 8, display: "flex", alignItems: "center",
              }}
            >
              <Menu size={22} color="#475569" />
            </button>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
                {PANEL_TITLES[activePanel]}
              </h2>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                Welcome, {profile?.full_name ?? "Client"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })}
            </span>
            {/* Read-only badge */}
            <span className="badge badge-success" style={{ fontSize: "0.75rem", padding: "5px 12px" }}>
              <Lock size={10} style={{ verticalAlign: "middle", marginRight: 4 }} />
              Read Only View
            </span>
          </div>
        </header>

        {/* ── Content ── */}
        <main style={{ flex: 1, padding: "28px 24px" }}>
          {PANELS[activePanel]}
        </main>
      </div>
    </div>
  );
}
