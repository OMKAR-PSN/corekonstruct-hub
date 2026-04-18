"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CircleDot, Clock3 } from "lucide-react";

type Milestone = {
  id: number;
  label: string;
  date: string;
  description: string;
  done: boolean;
};

type MilestoneTimelineProps = {
  milestones: Milestone[];
};

export default function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  const [activeId, setActiveId] = useState(milestones.find((milestone) => milestone.done)?.id ?? milestones[0]?.id);
  const activeMilestone = milestones.find((milestone) => milestone.id === activeId) ?? milestones[0];

  return (
    <motion.section
      whileHover={{ y: -3 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Milestone Timeline</h3>
          <p className="mt-1 text-sm text-slate-600">Executive milestone visibility across the project lifecycle.</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-600 ring-1 ring-emerald-200">
          <Clock3 className="h-5 w-5" />
        </div>
      </div>

      <div className="space-y-3">
        {milestones.map((milestone) => {
          const active = milestone.id === activeId;
          return (
            <button
              key={milestone.id}
              type="button"
              onClick={() => setActiveId(milestone.id)}
              className={[
                "w-full rounded-2xl border p-4 text-left transition-colors",
                active ? "border-orange-200 bg-orange-50" : "border-slate-200 bg-white hover:bg-slate-50",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div className={[
                  "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full",
                  milestone.done ? "bg-emerald-100 text-emerald-600" : active ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-600",
                ].join(" ")}>
                  {milestone.done ? <CheckCircle2 className="h-4 w-4" /> : <CircleDot className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-slate-900">{milestone.label}</div>
                    <div className="text-xs text-slate-600">{milestone.date}</div>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{milestone.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-xs uppercase tracking-[0.16em] text-slate-600">Active Milestone</div>
        <div className="mt-1 text-base font-semibold text-slate-900">{activeMilestone?.label}</div>
        <p className="mt-2 text-sm leading-6 text-slate-600">{activeMilestone?.description}</p>
      </div>
    </motion.section>
  );
}
