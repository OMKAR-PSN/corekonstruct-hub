"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, CircleDollarSign, Eye, Gauge, TriangleAlert, Users } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import DataGrid from "@/components/admin/DataGrid";
import BudgetBurnRate from "@/components/client/BudgetBurnRate";
import MilestoneTimeline from "@/components/client/MilestoneTimeline";
import RecentSitePhotos from "@/components/client/RecentSitePhotos";
import type { Project, ClientStats } from "@/types/supabase";

// Mocks to keep the contract intact
type ClientMilestone = {
  id: number;
  label: string;
  date: string;
  description: string;
  done: boolean;
};
type SitePhoto = { id: string; url: string; note: string; date: string; stage: string };
type CompletedWork = { title: string; year: string; note: string };
type BudgetHistoryPoint = { month: string; amount: number };

type Props = {
  activeProject: Project | null;
  projectSummary: Project[];
  milestoneTimeline: ClientMilestone[];
  sitePhotos: SitePhoto[];
  completedWorks: CompletedWork[];
  budgetHistory: BudgetHistoryPoint[];
  stats: ClientStats;
  userName: string | null;
};

export default function ClientDashboardClient({
  activeProject,
  projectSummary,
  milestoneTimeline,
  sitePhotos,
  completedWorks,
  budgetHistory,
  stats,
  userName,
}: Props) {
  const projectColumns = [
    {
      key: "name",
      label: "Project",
      render: (row: Project) => (
        <div>
          <div className="font-semibold text-slate-900">{row.name}</div>
        </div>
      ),
    },
    {
      key: "current_stage",
      label: "Current Stage",
      render: (row: Project) => (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {row.current_stage ?? "Not started"}
        </span>
      ),
    },
    {
      key: "progress_percentage",
      label: "Progress",
      align: "right" as const,
      render: (row: Project) => (
        <span className="font-semibold text-orange-400">{row.progress_percentage}%</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "right" as const,
      render: (row: Project) => (
        <span
          className={[
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
            row.status === "completed"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
              : row.status === "delayed"
                ? "border-rose-500/20 bg-rose-500/10 text-rose-700"
                : "border-sky-500/20 bg-sky-500/10 text-sky-700",
          ].join(" ")}
        >
          {row.status === "completed" ? "✓ Delivered" : row.status === "delayed" ? "⚠ Delayed" : "✓ Active"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <section id="ongoing" className="scroll-mt-28 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
              <Eye className="h-3.5 w-3.5" />
              Client Portal
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Executive project visibility at a glance.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              This read-only view uses fetched project metadata linked via Supabase relations.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
            <Users className="h-4 w-4 text-orange-600" />
            {userName ?? "Client"} · Client
          </div>
        </div>

        {activeProject ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Current Progress"
              value={`${activeProject.progress_percentage}%`}
              change="Latest status from supervisor"
              helper={`Overall completion of ${activeProject.name}.`}
              icon={<Gauge className="h-5 w-5" />}
              tone="orange"
            />
            <StatCard
              title="Budget Burn Rate"
              value={`₹${stats.burnRate.toLocaleString("en-IN")}`}
              change="Average monthly utilisation"
              helper="Rolling monthly spend."
              icon={<CircleDollarSign className="h-5 w-5" />}
              tone="success"
            />
            <StatCard
              title="Milestones Remaining"
              value={String(stats.milestonesRemaining)}
              change="Open items until handover"
              helper="A simple executive measure of outstanding work."
              icon={<TriangleAlert className="h-5 w-5" />}
              tone="warning"
            />
            <StatCard
              title="Photo Updates"
              value={String(stats.activePhotoCount)}
              change="Site evidence available"
              helper="Recent visual evidence uploaded by the field team."
              icon={<Camera className="h-5 w-5" />}
              tone="info"
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
            No active project found to generate metrics from.
          </div>
        )}

        <DataGrid<Project>
          title="Portfolio Snapshot"
          description="High-level summary of your active and completed projects."
          columns={projectColumns}
          rows={projectSummary}
          rowKey={(row) => row.id}
          emptyMessage="No projects associated with your profile yet."
        />
      </section>

      {/* Placeholder sections for the hardcoded mock components we kept for UI visual parity */}
      <section id="detail" className="scroll-mt-28">
        <BudgetBurnRate budget={12000000} spent={3450000} history={budgetHistory} />
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
            <p className="mt-1 text-sm text-slate-600">Read-only delivery history for your portfolio.</p>
          </div>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
            {completedWorks.length} project(s) delivered
          </span>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {completedWorks.length > 0 ? (
            completedWorks.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                <div className="mt-1 text-xs text-slate-600">{item.note}</div>
                <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
                  Completed {item.year}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500">
              No completed projects on record.
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
