"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Camera,
  Clock3,
  TriangleAlert,
  Users,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import DataGrid from "@/components/admin/DataGrid";
import DailyProgressForm from "@/components/supervisor/DailyProgressForm";
import LaborAttendanceTracker from "@/components/supervisor/LaborAttendanceTracker";
import MaterialRequestList from "@/components/supervisor/MaterialRequestList";
import type { Project, SupervisorStats, WorkerRow } from "@/types/supabase";

type Props = {
  assignedProjects: Project[];
  workers: WorkerRow[];
  stats: SupervisorStats;
  userName: string | null;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getStatusBadge(status: string) {
  if (status === "delayed") return "border-rose-500/20 bg-rose-500/10 text-rose-300";
  if (status === "on-hold") return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  if (status === "completed") return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
}

function getStatusLabel(status: string) {
  if (status === "delayed") return "⚠ Delayed";
  if (status === "on-hold") return "⏸ On Hold";
  if (status === "completed") return "✓ Completed";
  return "✓ Active";
}

export default function SupervisorDashboardClient({ assignedProjects, workers, stats, userName }: Props) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(assignedProjects[0] ?? null);

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
      label: "Stage",
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
      render: (row: Project) => <span className="font-semibold text-orange-600">{row.progress_percentage}%</span>,
    },
    {
      key: "status",
      label: "Status",
      align: "right" as const,
      render: (row: Project) => (
        <span className={["inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold", getStatusBadge(row.status)].join(" ")}>
          {getStatusLabel(row.status)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <section id="projects" className="scroll-mt-28 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
              <ClipboardList className="h-3.5 w-3.5" />
              Supervisor Workspace
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Daily operational control for site execution.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              This route is now driven by React Server Components fetching live data from Supabase.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-600">
            <Users className="h-4 w-4 text-orange-600" />
            {userName ?? "Supervisor"} · Site Supervisor
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Active Sites"
            value={String(stats.activeProjects)}
            change="Live from database"
            helper="Projects currently under your control."
            icon={<ClipboardList className="h-5 w-5" />}
            tone="orange"
          />
          <StatCard
            title="Labour Crew"
            value={String(stats.totalWorkersOnRecord)}
            change="Registered personnel"
            helper="Total workers assigned to your projects."
            icon={<Users className="h-5 w-5" />}
            tone="success"
          />
          <StatCard
            title="Average Progress"
            value={`${stats.averageProgress}%`}
            change="Project progress updated daily"
            helper="Aggregate completion across assigned sites."
            icon={<Clock3 className="h-5 w-5" />}
            tone="info"
          />
          <StatCard
            title="Delayed Projects"
            value={String(stats.delayedProjects)}
            change={stats.delayedProjects > 0 ? "Immediate follow-up needed" : "All sites on track"}
            helper="Sites currently behind schedule."
            icon={<TriangleAlert className="h-5 w-5" />}
            tone="danger"
          />
        </div>

        <DataGrid<Project>
          title="Assigned Projects"
          description="Update progress against this live project list."
          columns={projectColumns}
          rows={assignedProjects}
          rowKey={(row) => row.id}
          emptyMessage="No assigned projects found in Supabase."
        />
      </section>

      {selectedProject ? (
        <>
          <section id="report" className="scroll-mt-28">
            <DailyProgressForm projectName={selectedProject.name} />
          </section>

          <section id="attendance" className="scroll-mt-28">
            <LaborAttendanceTracker workers={workers} />
          </section>

          <section id="materials" className="scroll-mt-28">
            <MaterialRequestList />
          </section>

          {/* Measurements snippet */}
          <section id="measurements" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Measurement Snapshot</h3>
                <p className="mt-1 text-sm text-slate-600">Responsive placeholder metrics for the currently selected site.</p>
              </div>
              <span className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                {selectedProject.name}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <motion.button
                type="button"
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left"
              >
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Slab Area</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">450 m²</div>
                <div className="mt-1 text-sm text-slate-500">Building measurement unit</div>
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left"
              >
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Road Length</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">250 m</div>
                <div className="mt-1 text-sm text-slate-500">Road expansion segment</div>
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left"
              >
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Bridge Piles</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">8 done</div>
                <div className="mt-1 text-sm text-slate-500">Bridge progress checkpoint</div>
              </motion.button>
            </div>
          </section>
        </>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Please assign a project to this supervisor in Supabase to unlock forms and trackers.</p>
        </div>
      )}

      <section id="photos" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Site Photo Control</h3>
            <p className="mt-1 text-sm text-slate-600">Photos attached to the latest report.</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
            <Camera className="mr-1 inline h-3.5 w-3.5 text-orange-600" />
            Upload ready
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            "/images/downloaded/site-activity.jpg",
            "/images/downloaded/construction-team.avif",
            "/images/downloaded/bridge-project.jpg",
          ].map((src, index) => (
            <motion.div key={src} whileHover={{ y: -4 }} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Note: Still using img tag here to maintain exact visual parity until Phase 4 fixes Performance */}
              <img src={src} alt={`Site photo ${index + 1}`} className="h-56 w-full object-cover" />
              <div className="p-4 text-sm text-slate-600">Latest upload {index + 1}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
