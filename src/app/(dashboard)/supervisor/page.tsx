"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Camera,
  Clock3,
  TriangleAlert,
  Users,
} from "lucide-react";
import StatCard from "../../../components/admin/StatCard";
import DataGrid from "../../../components/admin/DataGrid";
import DailyProgressForm from "../../../components/supervisor/DailyProgressForm";
import LaborAttendanceTracker from "../../../components/supervisor/LaborAttendanceTracker";
import MaterialRequestList from "../../../components/supervisor/MaterialRequestList";
import { getSupervisorMetrics, type SupervisorMetrics } from "../../../lib/api/metrics";
import { getSupervisorProjects } from "../../../lib/api/projects";
import { getSupervisorWorkers, type Worker } from "../../../lib/api/labor";

type ProjectRow = Awaited<ReturnType<typeof getSupervisorProjects>>[number];

type SupervisorDashboardData = {
  assignedProjects: ProjectRow[];
  workers: Worker[];
  stats: SupervisorMetrics;
};

const projectColumns = [
  {
    key: "name",
    label: "Project",
    render: (row: ProjectRow) => (
      <div>
        <div className="font-semibold text-slate-900">{row.name}</div>
        <div className="text-xs text-slate-600">{row.type} · {row.location}</div>
      </div>
    ),
  },
  {
    key: "stage",
    label: "Stage",
    render: (row: ProjectRow) => <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{row.stage}</span>,
  },
  {
    key: "progress",
    label: "Progress",
    align: "right" as const,
    render: (row: ProjectRow) => <span className="font-semibold text-orange-400">{row.progress}%</span>,
  },
  {
    key: "status",
    label: "Status",
    align: "right" as const,
    render: (row: ProjectRow) => (
      <span
        className={[
          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
          row.status === "delayed"
            ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        ].join(" ")}
      >
        {row.status === "delayed" ? "⚠ Delayed" : "✓ On Track"}
      </span>
    ),
  },
];

export default function SupervisorPage() {
  const [dashboardData, setDashboardData] = useState<SupervisorDashboardData | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectRow | null>(null);

  useEffect(() => {
    let isMounted = true;

    void Promise.all([getSupervisorProjects(), getSupervisorWorkers(), getSupervisorMetrics()]).then(
      ([assignedProjects, workers, stats]) => {
        if (!isMounted) {
          return;
        }

        setDashboardData({
          assignedProjects,
          workers,
          stats,
        });
        setSelectedProject((current) => current ?? assignedProjects[0] ?? null);
      },
    );

    return () => {
      isMounted = false;
    };
  }, []);

  if (!dashboardData || !selectedProject) {
    return (
      <div className="space-y-6">
        <div className="h-24 rounded-3xl border border-slate-200 bg-white animate-pulse" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="h-28 rounded-2xl border border-slate-200 bg-white animate-pulse" />
          <div className="h-28 rounded-2xl border border-slate-200 bg-white animate-pulse" />
          <div className="h-28 rounded-2xl border border-slate-200 bg-white animate-pulse" />
          <div className="h-28 rounded-2xl border border-slate-200 bg-white animate-pulse" />
        </div>
        <div className="h-96 rounded-3xl border border-slate-200 bg-white animate-pulse" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-72 rounded-3xl border border-slate-200 bg-white animate-pulse" />
          <div className="h-72 rounded-3xl border border-slate-200 bg-white animate-pulse" />
        </div>
      </div>
    );
  }

  const { assignedProjects, workers, stats } = dashboardData;

  return (
    <div className="space-y-8">
      <section id="projects" className="scroll-mt-28 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
              <ClipboardList className="h-3.5 w-3.5" />
              Supervisor Workspace
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Daily operational control for site execution.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              This route is now driven by React state and modular form components instead of legacy DOM mutation.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
            <Users className="h-4 w-4 text-orange-600" />
            Arjun Singh · Site Supervisor
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Active Sites"
            value={String(stats.activeProjects)}
            change="All assigned projects loaded"
            helper="Projects currently under supervisory control."
            icon={<ClipboardList className="h-5 w-5" />}
            tone="orange"
          />
          <StatCard
            title="Labour Crew"
            value={String(stats.totalWorkers)}
            change="Attendance tracked live"
            helper="Crew members available for current shift management."
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
            change="Immediate follow-up needed"
            helper="Sites currently behind schedule."
            icon={<TriangleAlert className="h-5 w-5" />}
            tone="danger"
          />
        </div>

        <DataGrid<ProjectRow>
          title="Assigned Projects"
          description="The supervisor can update progress against this live project list."
          columns={projectColumns}
          rows={assignedProjects}
          rowKey={(row) => row.id}
        />
      </section>

      <section id="report" className="scroll-mt-28">
        <DailyProgressForm projectName={selectedProject.name} />
      </section>

      <section id="attendance" className="scroll-mt-28">
        <LaborAttendanceTracker workers={workers} />
      </section>

      <section id="materials" className="scroll-mt-28">
        <MaterialRequestList />
      </section>

      <section id="measurements" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Measurement Snapshot</h3>
            <p className="mt-1 text-sm text-slate-600">Responsive placeholder metrics for the currently selected site.</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
            {selectedProject.name}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <motion.button
            type="button"
            whileHover={{ y: -3 }}
            onClick={() => setSelectedProject(assignedProjects[0])}
            className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-left"
          >
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Slab Area</div>
            <div className="mt-2 text-2xl font-bold text-white">450 m²</div>
            <div className="mt-1 text-sm text-slate-400">Building measurement unit</div>
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ y: -3 }}
            onClick={() => setSelectedProject(assignedProjects[1])}
            className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-left"
          >
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Road Length</div>
            <div className="mt-2 text-2xl font-bold text-white">250 m</div>
            <div className="mt-1 text-sm text-slate-400">Road expansion segment</div>
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ y: -3 }}
            onClick={() => setSelectedProject(assignedProjects[2])}
            className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-left"
          >
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Bridge Piles</div>
            <div className="mt-2 text-2xl font-bold text-white">8 done</div>
            <div className="mt-1 text-sm text-slate-400">Bridge progress checkpoint</div>
          </motion.button>
        </div>
      </section>

      <section id="photos" className="scroll-mt-28 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/10 backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Site Photo Control</h3>
            <p className="mt-1 text-sm text-slate-400">Photos are part of the operational workflow and can be attached to the latest report.</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
            <Camera className="mr-1 inline h-3.5 w-3.5 text-orange-400" />
            Upload ready
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            "/images/downloaded/site-activity.jpg",
            "/images/downloaded/construction-team.avif",
            "/images/downloaded/bridge-project.jpg",
          ].map((src, index) => (
            <motion.div key={src} whileHover={{ y: -4 }} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
              <img src={src} alt={`Site photo ${index + 1}`} className="h-56 w-full object-cover" />
              <div className="p-4 text-sm text-slate-400">Latest upload {index + 1}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
