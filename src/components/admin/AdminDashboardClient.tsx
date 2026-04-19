"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  BadgePlus,
  CircleDollarSign,
  FileText,
  FolderKanban,
  Layers3,
  PlusCircle,
  ScrollText,
  ShieldCheck,
  TriangleAlert,
  Users,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import QuickActionCard from "@/components/admin/QuickActionCard";
import DataGrid from "@/components/admin/DataGrid";
import type { Project, AdminStats } from "@/types/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SectionId = "overview" | "projects" | "monitoring" | "finance" | "sanction";

const sections: Array<{ id: SectionId; label: string; description: string }> = [
  { id: "overview",   label: "Overview",      description: "Live health of the project portfolio" },
  { id: "projects",   label: "Projects",       description: "Active projects and delivery status" },
  { id: "monitoring", label: "Monitoring",     description: "Stage-by-stage execution visibility" },
  { id: "finance",    label: "Finance",        description: "Cost distribution and utilisation" },
  { id: "sanction",   label: "Sanction Plan",  description: "Approvals, NOCs, and expiry tracking" },
];

type Props = {
  projects: Project[];
  stats: AdminStats;
  userName: string | null;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getStatusBadge(status: string) {
  if (status === "delayed")   return "border-rose-500/20 bg-rose-500/10 text-rose-300";
  if (status === "on-hold")   return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  if (status === "completed") return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  return "border-sky-500/20 bg-sky-500/10 text-sky-300";
}

function getStatusLabel(status: string) {
  if (status === "delayed")   return "⚠ Delayed";
  if (status === "on-hold")   return "⏸ On Hold";
  if (status === "completed") return "✓ Completed";
  return "✓ Active";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminDashboardClient({ projects, stats, userName }: Props) {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");

  // ── Column definitions based on real Supabase schema ────────────────────
  const projectColumns = [
    {
      key: "name",
      label: "Project",
      render: (row: Project) => (
        <div>
          <div className="font-semibold text-slate-900">{row.name}</div>
          <div className="text-xs text-slate-500">{row.current_stage ?? "No stage set"}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: Project) => (
        <span className={[
          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
          getStatusBadge(row.status),
        ].join(" ")}>
          {getStatusLabel(row.status)}
        </span>
      ),
    },
    {
      key: "progress_percentage",
      label: "Progress",
      align: "right" as const,
      render: (row: Project) => (
        <span className="font-semibold text-orange-600">{row.progress_percentage}%</span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (row: Project) =>
        new Intl.DateTimeFormat("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(row.created_at)),
    },
  ];

  const monitoringColumns = [
    {
      key: "name",
      label: "Project",
      render: (row: Project) => (
        <div>
          <div className="font-semibold text-slate-900">{row.name}</div>
          <div className="text-xs text-slate-500">Execution stream</div>
        </div>
      ),
    },
    {
      key: "current_stage",
      label: "Current Stage",
      render: (row: Project) => (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {row.current_stage ?? "—"}
        </span>
      ),
    },
    {
      key: "progress_percentage",
      label: "Completion",
      align: "right" as const,
      render: (row: Project) => (
        <span className="font-semibold text-slate-900">{row.progress_percentage}%</span>
      ),
    },
    {
      key: "status",
      label: "Risk",
      render: (row: Project) => (
        <span className={[
          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
          row.status === "delayed"
            ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        ].join(" ")}>
          {row.status === "delayed" ? "Attention Required" : "Stable"}
        </span>
      ),
    },
  ];

  const financeColumns = [
    {
      key: "name",
      label: "Project",
      render: (row: Project) => (
        <span className="font-semibold text-slate-900">{row.name}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: Project) => (
        <span className={[
          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
          getStatusBadge(row.status),
        ].join(" ")}>
          {getStatusLabel(row.status)}
        </span>
      ),
    },
    {
      key: "progress_percentage",
      label: "Progress",
      align: "right" as const,
      render: (row: Project) => (
        <span className="rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          {row.progress_percentage}%
        </span>
      ),
    },
  ];

  const quickActions = [
    { id: "projects"   as SectionId, title: "Create Project",      description: "Open the project pipeline and add a new site record.", icon: <PlusCircle className="h-5 w-5" /> },
    { id: "monitoring" as SectionId, title: "View Monitoring",     description: "Inspect stage execution and delivery status by project.", icon: <Activity className="h-5 w-5" /> },
    { id: "finance"    as SectionId, title: "Review Finance",      description: "Check budget utilisation and cost breakdowns.", icon: <CircleDollarSign className="h-5 w-5" /> },
    { id: "sanction"   as SectionId, title: "Manage Sanction Plan", description: "Track approvals, NOCs, and document expiry windows.", icon: <ScrollText className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-8">
      {/* ── Overview ──────────────────────────────────────────────────────── */}
      <section id="overview" className="scroll-mt-28 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Overview
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Operational control for the full project portfolio.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Live data fetched from Supabase. Projects, stages, and status reflect the current database state.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-600">
            <Users className="h-4 w-4 text-orange-600" />
            {userName ?? "Admin"} · Administrator
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Active Projects"
            value={String(stats.activeProjects)}
            change="Live count from database"
            helper="Projects currently monitored by the admin team."
            icon={<FolderKanban className="h-5 w-5" />}
            tone="orange"
          />
          <StatCard
            title="Portfolio Budget"
            value={stats.totalBudget > 0 ? `₹${stats.totalBudget.toLocaleString("en-IN")}` : "—"}
            change="Budget column coming soon"
            helper="Combined budget across active delivery streams."
            icon={<BarChart3 className="h-5 w-5" />}
            tone="success"
          />
          <StatCard
            title="Average Progress"
            value={`${stats.averageProgress}%`}
            change="Aggregated from all projects"
            helper="Mean completion across all tracked projects."
            icon={<Layers3 className="h-5 w-5" />}
            tone="info"
          />
          <StatCard
            title="Delayed Projects"
            value={String(stats.delayedProjects)}
            change={stats.delayedProjects > 0 ? "Requires attention" : "All on track"}
            helper="Projects requiring immediate operational attention."
            icon={<TriangleAlert className="h-5 w-5" />}
            tone="danger"
          />
        </div>

        {/* Quick actions + alerts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Quick Actions</h3>
                <p className="mt-1 text-sm text-slate-600">Jump directly to the primary admin workflows.</p>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Focus: {sections.find((s) => s.id === activeSection)?.label}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {quickActions.map((action) => (
                <QuickActionCard
                  key={action.id}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  active={activeSection === action.id}
                  onClick={() => setActiveSection(action.id)}
                />
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Recent Alerts</h3>
                <p className="mt-1 text-sm text-slate-600">High-signal operational notifications.</p>
              </div>
              <span className="rounded-full border border-rose-200 bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                {stats.delayedProjects} Active
              </span>
            </div>
            <div className="space-y-3">
              {stats.delayedProjects > 0 ? (
                projects
                  .filter((p) => p.status === "delayed")
                  .slice(0, 3)
                  .map((p) => (
                    <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700">
                          <TriangleAlert className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900">{p.name} — delay detected</div>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            Project is behind schedule at the {p.current_stage ?? "current"} stage.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                      <BadgePlus className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900">All projects on track</div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        No delays detected across the portfolio.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Projects ──────────────────────────────────────────────────────── */}
      <motion.section
        id="projects"
        className={[
          "scroll-mt-28 rounded-3xl border p-5 shadow-sm",
          activeSection === "projects" ? "border-orange-200 bg-white" : "border-slate-200 bg-white",
        ].join(" ")}
        layout
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Project Management</h3>
            <p className="mt-1 text-sm text-slate-500">Live project list from Supabase.</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection("projects")}
            className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
          >
            <PlusCircle className="h-4 w-4" />
            Create Project
          </button>
        </div>
        <DataGrid<Project>
          title="Active Projects"
          description="Current delivery pipeline with status and progress from the database."
          columns={projectColumns}
          rows={projects}
          rowKey={(row) => row.id}
          emptyMessage="No projects found. Create your first project to get started."
        />
      </motion.section>

      {/* ── Monitoring ────────────────────────────────────────────────────── */}
      <motion.section
        id="monitoring"
        className={[
          "scroll-mt-28 rounded-3xl border p-5 shadow-sm",
          activeSection === "monitoring" ? "border-orange-200 bg-white" : "border-slate-200 bg-white",
        ].join(" ")}
        layout
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Site Monitoring</h3>
            <p className="mt-1 text-sm text-slate-500">Stage visibility by project.</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            Live
          </span>
        </div>
        <DataGrid<Project>
          title="Execution Status"
          description="Monitoring snapshot by project and stage progression."
          columns={monitoringColumns}
          rows={projects}
          rowKey={(row) => row.id}
          emptyMessage="No projects to monitor yet."
        />
      </motion.section>

      {/* ── Finance ───────────────────────────────────────────────────────── */}
      <motion.section
        id="finance"
        className={[
          "scroll-mt-28 rounded-3xl border p-5 shadow-sm",
          activeSection === "finance" ? "border-orange-200 bg-white" : "border-slate-200 bg-white",
        ].join(" ")}
        layout
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Finance Overview</h3>
            <p className="mt-1 text-sm text-slate-500">
              Budget and spend columns will be added to the projects table in a future migration.
            </p>
          </div>
          <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Schema pending
          </span>
        </div>
        <DataGrid<Project>
          title="Portfolio Finance"
          description="Progress-based snapshot until budget columns are added to the schema."
          columns={financeColumns}
          rows={projects}
          rowKey={(row) => row.id}
          emptyMessage="No projects to display finance data for."
        />
      </motion.section>

      {/* ── Sanction Plan ─────────────────────────────────────────────────── */}
      <motion.section
        id="sanction"
        className={[
          "scroll-mt-28 rounded-3xl border p-5 shadow-sm",
          activeSection === "sanction" ? "border-orange-200 bg-white" : "border-slate-200 bg-white",
        ].join(" ")}
        layout
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Sanction Plan</h3>
            <p className="mt-1 text-sm text-slate-500">
              Government approvals and expiry tracking. A dedicated sanctions table will be added in a future migration.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
          >
            <FileText className="h-4 w-4 text-orange-600" />
            Add Document
          </button>
        </div>
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <ScrollText className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-3 text-sm font-semibold text-slate-600">Sanction documents table not yet in schema</p>
          <p className="mt-1 text-xs text-slate-500">
            Add a <code className="rounded bg-slate-200 px-1 py-0.5">sanctions</code> table to the Supabase schema to unlock this panel.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
