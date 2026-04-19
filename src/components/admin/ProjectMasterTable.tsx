"use client";

import React, { useState } from "react";
export interface Project {
  [key: string]: any;
}
import { ChevronDown, Edit2, FileText } from "lucide-react";

interface ProjectMasterTableProps {
  projects: Project[];
  onStageChange?: (projectId: number, newStage: Project["currentStage"]) => void;
}

const STAGE_OPTIONS: Project["currentStage"][] = [
  "Foundation",
  "Slab",
  "Brickwork",
  "Plastering",
  "Finishing",
  "Railings",
  "Sub-base",
  "Handover",
];

export function ProjectMasterTable({ projects, onStageChange }: ProjectMasterTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingStage, setEditingStage] = useState<{ projectId: number; stage: Project["currentStage"] } | null>(null);

  const handleStageUpdate = (projectId: number, newStage: Project["currentStage"]) => {
    setEditingStage(null);
    onStageChange?.(projectId, newStage);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-900/50">
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Project</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Location</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Supervisor</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Progress</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Current Stage</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Status</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Budget</th>
            <th className="px-4 py-3 text-center font-semibold text-slate-200">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {projects.map((project) => (
            <tr
              key={project.id}
              className="hover:bg-slate-800/30 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-slate-100">{project.name}</td>
              <td className="px-4 py-3 text-slate-300">{project.location}</td>
              <td className="px-4 py-3 text-slate-300">{project.supervisor}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-slate-200 font-medium">{project.progress}%</span>
                </div>
              </td>
              <td className="px-4 py-3">
                {editingStage?.projectId === project.id ? (
                  <select
                    value={editingStage?.stage}
                    onChange={(e) => {
                      const newStage = e.target.value as Project["currentStage"];
                      handleStageUpdate(project.id, newStage);
                    }}
                    className="bg-slate-700 text-slate-100 px-2 py-1 rounded text-xs border border-slate-600 focus:outline-none focus:border-blue-500"
                  >
                    {STAGE_OPTIONS.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300">{project.currentStage}</span>
                    <button
                      onClick={() =>
                        setEditingStage({ projectId: project.id, stage: project.currentStage })
                      }
                      className="text-slate-500 hover:text-slate-300 p-1"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    project.status === "on-track"
                      ? "bg-emerald-900/30 text-emerald-300"
                      : "bg-red-900/30 text-red-300"
                  }`}
                >
                  {project.status === "on-track" ? "On Track" : "Delayed"}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-300">
                <div>
                  <div className="font-medium">₹{(project.budget / 100000).toFixed(1)}L</div>
                  <div className="text-xs text-slate-500">Spent: ₹{(project.spent / 100000).toFixed(1)}L</div>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                  className="text-slate-400 hover:text-slate-100 p-1 inline-flex"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${expandedId === project.id ? "rotate-180" : ""}`}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
