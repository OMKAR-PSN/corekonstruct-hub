"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CircleSlash, Save } from "lucide-react";

type Worker = {
  id: string;   // UUID — matches WorkerRow from @/types/supabase
  name: string;
  initials: string;
};

type LaborAttendanceTrackerProps = {
  workers: Worker[];
};

export default function LaborAttendanceTracker({ workers }: LaborAttendanceTrackerProps) {
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent">>(() =>
    Object.fromEntries(workers.map((worker) => [worker.id, "present"])),
  );
  const [savedMessage, setSavedMessage] = useState("Attendance not yet saved.");

  const totals = useMemo(() => {
    const present = Object.values(attendance).filter((status) => status === "present").length;
    const absent = workers.length - present;
    return { present, absent, total: workers.length };
  }, [attendance, workers.length]);

  const toggleWorker = (workerId: string) => {
    setAttendance((current) => ({
      ...current,
      [workerId]: current[workerId] === "present" ? "absent" : "present",
    }));
  };

  return (
    <motion.section
      whileHover={{ y: -3 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Labour Attendance</h3>
          <p className="mt-1 text-sm text-slate-600">Tap a worker card to toggle present/absent state.</p>
        </div>
        <div className="flex gap-3 text-sm text-slate-700">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {totals.present} Present
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1">
            <CircleSlash className="h-4 w-4 text-rose-600" />
            {totals.absent} Absent
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {workers.map((worker) => {
          const status = attendance[worker.id];
          return (
            <motion.button
              key={worker.id}
              type="button"
              onClick={() => toggleWorker(worker.id)}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={[
                "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                status === "present"
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-rose-200 bg-rose-50",
              ].join(" ")}
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-200 text-sm font-bold text-slate-900 ring-1 ring-slate-300">
                {worker.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-900">{worker.name}</div>
                <div className="text-xs text-slate-600">{status === "present" ? "Present" : "Absent"}</div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div>
          <div className="text-xs uppercase tracking-[0.16em] text-slate-600">Status</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">{savedMessage}</div>
        </div>
        <button
          type="button"
          onClick={() => setSavedMessage(`Attendance saved: ${totals.present}/${totals.total} present.`)}
          className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
        >
          <Save className="h-4 w-4" />
          Save Attendance
        </button>
      </div>
    </motion.section>
  );
}
