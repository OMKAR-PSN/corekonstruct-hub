"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, CircleDollarSign, Eye, Gauge, TriangleAlert, Users } from "lucide-react";
import StatCard from "../../../components/admin/StatCard";
import DataGrid from "../../../components/admin/DataGrid";
import BudgetBurnRate from "../../../components/client/BudgetBurnRate";
import MilestoneTimeline from "../../../components/client/MilestoneTimeline";
import RecentSitePhotos from "../../../components/client/RecentSitePhotos";
import { getClientMetrics, type ClientMetrics } from "../../../lib/api/metrics";
import { getClientProjectSnapshot, type BudgetHistoryPoint, type ClientActiveProject, type ClientProjectSummary, type ClientMilestone, type SitePhoto, type CompletedWork } from "../../../lib/api/projects";

type ProjectSummary = ClientProjectSummary;

type ClientDashboardData = {
  activeProject: ClientActiveProject;
  projectSummary: ProjectSummary[];
  milestoneTimeline: ClientMilestone[];
  sitePhotos: SitePhoto[];
  completedWorks: CompletedWork[];
  budgetHistory: BudgetHistoryPoint[];
  metrics: ClientMetrics;
};

const projectColumns = [
  {
    key: "name",
    label: "Project",
    render: (row: ProjectSummary) => (
      <div>
        <div className="font-semibold text-slate-900">{row.name}</div>
        <div className="text-xs text-slate-600">{row.type} · {row.location}</div>
      </div>
    ),
  },
  {
    key: "currentStage",
    label: "Current Stage",
    render: (row: ProjectSummary) => <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{row.currentStage}</span>,
  },
  {
    key: "progress",
    label: "Progress",
    align: "right" as const,
    render: (row: ProjectSummary) => <span className="font-semibold text-orange-400">{row.progress}%</span>,
  },
  {
    key: "status",
    label: "Status",
    align: "right" as const,
    render: (row: ProjectSummary) => (
      <span
        className={[
          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
          row.status === "Completed"
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
            : row.status === "Delayed"
              ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
              : "border-sky-500/20 bg-sky-500/10 text-sky-300",
        ].join(" ")}
      >
        {row.status}
      </span>
    ),
  },
];

export default function ClientPage() {
  const [dashboardData, setDashboardData] = useState<ClientDashboardData | null>(null);

  useEffect(() => {
    let isMounted = true;

    void Promise.all([getClientProjectSnapshot(), getClientMetrics()]).then(([snapshot, metrics]) => {
      if (isMounted) {
        setDashboardData({ ...snapshot, metrics });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!dashboardData) {
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

  const { activeProject, projectSummary, milestoneTimeline, sitePhotos, completedWorks, budgetHistory, metrics: stats } = dashboardData;

  return (
    <div className="space-y-8">
      <section id="ongoing" className="scroll-mt-28 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
              <Eye className="h-3.5 w-3.5" />
              Client Portal
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Executive project visibility at a glance.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              This read-only view uses shared reusable components and a fetched project snapshot, without any localStorage auth or legacy DOM mutation.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
            <Users className="h-4 w-4 text-orange-600" />
            Priya Mehta · Client
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Current Progress"
            value={`${activeProject.progress}%`}
            change="Latest status from supervisor"
            helper="Overall completion of the active project."
            icon={<Gauge className="h-5 w-5" />}
            tone="orange"
          />
          <StatCard
            title="Budget Burn Rate"
            value={`₹${stats.burnRate.toLocaleString("en-IN")}`}
            change="Average monthly utilisation"
            helper="Rolling monthly spend based on the fetched project snapshot."
            icon={<CircleDollarSign className="h-5 w-5" />}
            tone="success"
          />
          <StatCard
            title="Milestones Remaining"
            value={String(stats.completionGap)}
            change="Open items until handover"
            helper="A simple executive measure of outstanding work."
            icon={<TriangleAlert className="h-5 w-5" />}
            tone="warning"
          />
          <StatCard
            title="Photo Updates"
            value={String(stats.activePhotoCount)}
            change="Site evidence visible"
            helper="Recent visual evidence uploaded by the field team."
            icon={<Camera className="h-5 w-5" />}
            tone="info"
          />
        </div>

        <DataGrid<ProjectSummary>
          title="Portfolio Snapshot"
          description="High-level summary of the client’s active and completed works."
          columns={projectColumns}
          rows={projectSummary}
          rowKey={(row) => row.id}
        />
      </section>

      <section id="detail" className="scroll-mt-28">
        <BudgetBurnRate budget={activeProject.budget} spent={activeProject.spent} history={budgetHistory} />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div id="completed" className="scroll-mt-28">
          <MilestoneTimeline milestones={milestoneTimeline} />
        </div>
        <div id="photos" className="scroll-mt-28">
          <RecentSitePhotos photos={sitePhotos} />
        </div>
      </section>

      <motion.section
        whileHover={{ y: -3 }}
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Completed Works</h3>
            <p className="mt-1 text-sm text-slate-600">Read-only delivery history for the client's portfolio.</p>
          </div>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            1 project delivered
          </span>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {completedWorks.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div className="text-sm font-semibold text-white">{item.title}</div>
              <div className="mt-1 text-xs text-slate-400">{item.note}</div>
              <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                Completed {item.year}
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
