"use client";

import { useEffect, useState } from "react";
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
import StatCard from "../../../components/admin/StatCard";
import QuickActionCard from "../../../components/admin/QuickActionCard";
import DataGrid from "../../../components/admin/DataGrid";
import { getAdminMetrics, type AdminMetrics } from "../../../lib/api/metrics";
import { getAdminProjects, getAdminSanctions, type AdminProject, type SanctionRecord } from "../../../lib/api/projects";

type ProjectRow = AdminProject;
type SanctionRow = SanctionRecord;

type SectionId = "overview" | "projects" | "monitoring" | "finance" | "sanction";

const sections: Array<{ id: SectionId; label: string; description: string }> = [
  { id: "overview", label: "Overview", description: "Live health of the project portfolio" },
  { id: "projects", label: "Projects", description: "Active projects and delivery status" },
  { id: "monitoring", label: "Monitoring", description: "Stage-by-stage execution visibility" },
  { id: "finance", label: "Finance", description: "Cost distribution and utilisation" },
  { id: "sanction", label: "Sanction Plan", description: "Approvals, NOCs, and expiry tracking" },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function getStatusBadge(status: string) {
  if (status === "delayed") return "border-rose-500/20 bg-rose-500/10 text-rose-300";
  if (status === "pending") return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  if (status === "expiring") return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
  return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
}

type AdminDashboardData = {
  projects: AdminProject[];
  sanctions: SanctionRecord[];
  stats: AdminMetrics;
};

export default function AdminPage() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("overview");

  useEffect(() => {
    let isMounted = true;

    void Promise.all([getAdminProjects(), getAdminSanctions(), getAdminMetrics()]).then(
      ([projects, sanctions, stats]) => {
        if (isMounted) {
          setDashboardData({ projects, sanctions, stats });
        }
      },
    );

    return () => {
      isMounted = false;
    };
  }, []);

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <div className="h-24 rounded-3xl border border-slate-200 bg-slate-100 animate-pulse" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="h-28 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
          <div className="h-28 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
          <div className="h-28 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
          <div className="h-28 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
        </div>
        <div className="h-96 rounded-3xl border border-slate-200 bg-slate-100 animate-pulse" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-72 rounded-3xl border border-slate-200 bg-slate-100 animate-pulse" />
          <div className="h-72 rounded-3xl border border-slate-200 bg-slate-100 animate-pulse" />
        </div>
      </div>
    );
  }

  const { projects, sanctions, stats } = dashboardData;

  const financeRows = projects.map((project) => ({
    id: project.id,
    project: project.name,
    labour: Math.round(project.spent * 0.34),
    material: Math.round(project.spent * 0.56),
    misc: Math.round(project.spent * 0.1),
    spent: project.spent,
    budget: project.budget,
    utilization: Math.round((project.spent / project.budget) * 100),
  }));

  const projectColumns = [
    {
      key: "project",
      label: "Project",
      render: (row: ProjectRow) => (
        <div>
          <div className="font-semibold text-slate-900">{row.name}</div>
          <div className="text-xs text-slate-500">{row.type} · {row.location}</div>
        </div>
      ),
    },
    {
      key: "supervisor",
      label: "Supervisor",
      render: (row: ProjectRow) => <span className="text-slate-600">{row.supervisor}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (row: ProjectRow) => (
        <span className={[
          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
          getStatusBadge(row.status),
        ].join(" ")}>
          {row.status === "delayed" ? "⚠ Delayed" : "✓ On Track"}
        </span>
      ),
    },
    {
      key: "progress",
      label: "Progress",
      align: "right" as const,
      render: (row: ProjectRow) => <span className="font-semibold text-orange-600">{row.progress}%</span>,
    },
    {
      key: "budget",
      label: "Budget",
      align: "right" as const,
      render: (row: ProjectRow) => <span className="text-slate-600">{formatCurrency(row.budget)}</span>,
    },
    {
      key: "schedule",
      label: "Schedule",
      render: (row: ProjectRow) => (
        <span className="text-slate-500">{formatDate(row.startDate)} → {formatDate(row.endDate)}</span>
      ),
    },
  ];

  const monitoringColumns = [
    {
      key: "project",
      label: "Project",
      render: (row: ProjectRow) => (
        <div>
          <div className="font-semibold text-slate-900">{row.name}</div>
          <div className="text-xs text-slate-500">Execution stream</div>
        </div>
      ),
    },
    {
      key: "stage",
      label: "Current Stage",
      render: (row: ProjectRow) => (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {row.progress >= 80 ? "Finishing" : row.progress >= 60 ? "Brickwork" : row.progress >= 40 ? "Sub-base" : "Survey"}
        </span>
      ),
    },
    {
      key: "completion",
      label: "Completion",
      align: "right" as const,
      render: (row: ProjectRow) => <span className="font-semibold text-slate-900">{row.progress}%</span>,
    },
    {
      key: "risk",
      label: "Risk",
      render: (row: ProjectRow) => (
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
    {
      key: "team",
      label: "Team",
      render: () => <span className="text-slate-500">24 workers active</span>,
    },
  ];

  const financeColumns = [
    {
      key: "project",
      label: "Project",
      render: (row: { project: string }) => <span className="font-semibold text-slate-900">{row.project}</span>,
    },
    {
      key: "labour",
      label: "Labour",
      render: (row: { labour: number }) => <span>{formatCurrency(row.labour)}</span>,
    },
    {
      key: "material",
      label: "Material",
      render: (row: { material: number }) => <span>{formatCurrency(row.material)}</span>,
    },
    {
      key: "misc",
      label: "Misc",
      render: (row: { misc: number }) => <span>{formatCurrency(row.misc)}</span>,
    },
    {
      key: "spent",
      label: "Spent",
      align: "right" as const,
      render: (row: { spent: number }) => <span className="font-semibold text-slate-900">{formatCurrency(row.spent)}</span>,
    },
    {
      key: "utilization",
      label: "Utilisation",
      align: "right" as const,
      render: (row: { utilization: number }) => (
        <span className="rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          {row.utilization}%
        </span>
      ),
    },
  ];

  const sanctionColumns = [
    {
      key: "name",
      label: "Document",
      render: (row: SanctionRow) => <span className="font-semibold text-slate-900">{row.name}</span>,
    },
    {
      key: "project",
      label: "Project",
      render: (row: SanctionRow) => <span>{row.project}</span>,
    },
    {
      key: "authority",
      label: "Authority",
      render: (row: SanctionRow) => <span>{row.authority}</span>,
    },
    {
      key: "issued",
      label: "Issued",
      render: (row: SanctionRow) => <span>{row.issued}</span>,
    },
    {
      key: "expiry",
      label: "Expiry",
      render: (row: SanctionRow) => <span>{row.expiry}</span>,
    },
    {
      key: "status",
      label: "Status",
      align: "right" as const,
      render: (row: SanctionRow) => (
        <span className={[
          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
          getStatusBadge(row.status),
        ].join(" ")}>
          {row.status === "approved" ? "✅ Approved" : row.status === "pending" ? "⏳ Pending" : "⚠ Expiring"}
        </span>
      ),
    },
  ];

  const quickActions = [
    {
      id: "projects" as SectionId,
      title: "Create Project",
      description: "Open the project pipeline and add a new site record.",
      icon: <PlusCircle className="h-5 w-5" />,
    },
    {
      id: "monitoring" as SectionId,
      title: "View Monitoring",
      description: "Inspect stage execution and delivery status by project.",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      id: "finance" as SectionId,
      title: "Review Finance",
      description: "Check budget utilisation and cost breakdowns.",
      icon: <CircleDollarSign className="h-5 w-5" />,
    },
    {
      id: "sanction" as SectionId,
      title: "Manage Sanction Plan",
      description: "Track approvals, NOCs, and document expiry windows.",
      icon: <ScrollText className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-8">
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
              Legacy DOM-driven panels are now replaced with React state, reusable components, and a single source of truth for dashboard data.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-600">
            <Users className="h-4 w-4 text-orange-600" />
            Rajesh Kumar · Contractor / Admin
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Active Projects"
            value={String(stats.activeProjects)}
            change="1 added this month"
            helper="Live projects currently monitored by the admin team."
            icon={<FolderKanban className="h-5 w-5" />}
            tone="orange"
          />
          <StatCard
            title="Total Portfolio"
            value={formatCurrency(stats.totalBudget)}
            change="₹98L new value"
            helper="Combined budget across active delivery streams."
            icon={<BarChart3 className="h-5 w-5" />}
            tone="success"
          />
          <StatCard
            title="Average Progress"
            value={`${stats.averageProgress}%`}
            change="8% this week"
            helper="Aggregated completion across all tracked projects."
            icon={<Layers3 className="h-5 w-5" />}
            tone="info"
          />
          <StatCard
            title="Delayed Projects"
            value={String(stats.delayedProjects)}
            change="Bridge project flagged"
            helper="Projects requiring immediate operational attention."
            icon={<TriangleAlert className="h-5 w-5" />}
            tone="danger"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Quick Actions</h3>
                <p className="mt-1 text-sm text-slate-600">Jump directly to the primary admin workflows.</p>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Focus: {sections.find((section) => section.id === activeSection)?.label}
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

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Recent Alerts</h3>
                <p className="mt-1 text-sm text-slate-600">High-signal operational notifications pulled from the portfolio.</p>
              </div>
              <span className="rounded-full border border-rose-200 bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                1 Active
              </span>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700">
                    <TriangleAlert className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900">Residency Park Bridge delay detected</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Project is running behind schedule at the Railings stage. Expected handover has moved from Mar 2026 to Jun 2026.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                    <BadgePlus className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900">City Center foundation marked complete</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Foundation and structure stages are complete and brickwork is now the active workstream.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <motion.section
        id="projects"
        className={[
          "scroll-mt-28 rounded-3xl border p-5 shadow-sm backdrop-blur-xl",
          activeSection === "projects"
            ? "border-orange-200 bg-white"
            : "border-slate-200 bg-white",
        ].join(" ")}
        layout
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Project Management</h3>
            <p className="mt-1 text-sm text-slate-500">Reusable project table replacing the old inline-rendered list.</p>
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
        <DataGrid<ProjectRow>
          title="Active Projects"
          description="Current delivery pipeline with status, budget, and schedule context."
          columns={projectColumns}
          rows={projects}
          rowKey={(row) => row.id}
        />
      </motion.section>

      <motion.section
        id="monitoring"
        className={[
          "scroll-mt-28 rounded-3xl border p-5 shadow-sm backdrop-blur-xl",
          activeSection === "monitoring"
            ? "border-orange-200 bg-white"
            : "border-slate-200 bg-white",
        ].join(" ")}
        layout
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Site Monitoring</h3>
            <p className="mt-1 text-sm text-slate-500">Stage visibility is now state-driven instead of DOM mutation driven.</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            Live stream
          </span>
        </div>
        <DataGrid<ProjectRow>
          title="Execution Status"
          description="Monitoring snapshot by project and stage progression."
          columns={monitoringColumns}
          rows={projects}
          rowKey={(row) => row.id}
        />
      </motion.section>

      <motion.section
        id="finance"
        className={[
          "scroll-mt-28 rounded-3xl border p-5 shadow-sm backdrop-blur-xl",
          activeSection === "finance"
            ? "border-orange-200 bg-white"
            : "border-slate-200 bg-white",
        ].join(" ")}
        layout
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Finance Overview</h3>
            <p className="mt-1 text-sm text-slate-500">Budget breakdown is calculated from the fetched project snapshot with React state, not via DOM lookup.</p>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {formatCurrency(stats.totalSpent)} spent
          </span>
        </div>
        <DataGrid<{ id: number; project: string; labour: number; material: number; misc: number; spent: number; utilization: number }>
          title="Portfolio Finance"
          description="Category-wise cost distribution and utilisation by project."
          columns={financeColumns}
          rows={financeRows}
          rowKey={(row) => row.id}
        />
      </motion.section>

      <motion.section
        id="sanction"
        className={[
          "scroll-mt-28 rounded-3xl border p-5 shadow-sm backdrop-blur-xl",
          activeSection === "sanction"
            ? "border-orange-200 bg-white"
            : "border-slate-200 bg-white",
        ].join(" ")}
        layout
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Sanction Plan</h3>
            <p className="mt-1 text-sm text-slate-500">Government approvals and expiry tracking for project documentation.</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection("sanction")}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
          >
            <FileText className="h-4 w-4 text-orange-600" />
            Add Document
          </button>
        </div>
        <DataGrid<SanctionRow>
          title="Sanction Documents"
          description="Approval lifecycle view without the legacy inline table rendering."
          columns={sanctionColumns}
          rows={sanctions}
          rowKey={(row) => row.id}
        />
      </motion.section>
    </div>
  );
}
