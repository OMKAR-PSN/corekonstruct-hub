"use client";

import React from "react";
import { ClientProjectSummary } from "@/lib/api/projects";
import { MapPin, Calendar, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

interface ProjectStatusBoardProps {
  projects: ClientProjectSummary[];
}

export function ProjectStatusBoard({ projects }: ProjectStatusBoardProps) {
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-600 uppercase">Total Projects</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{projects.length}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-600 uppercase">Completed</div>
          <div className="text-3xl font-bold text-emerald-600 mt-2">
            {projects.filter((p) => p.progress === 100).length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-600 uppercase">Average Progress</div>
          <div className="text-3xl font-bold text-orange-600 mt-2">
            {Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}%
          </div>
        </div>
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {projects.map((project) => {
          const statusColor =
            project.status === "Completed"
              ? "text-emerald-600"
              : project.status === "Delayed"
                ? "text-red-600"
                : "text-orange-600";

          const statusBg =
            project.status === "Completed"
              ? "bg-emerald-50 border-emerald-200"
              : project.status === "Delayed"
                ? "bg-red-50 border-red-200"
                : "bg-orange-50 border-orange-200";

          return (
            <div
              key={project.id}
              className={`border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition space-y-4 bg-white shadow-sm ${statusBg}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      {project.location}
                    </div>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs rounded-full px-2 py-1 bg-slate-100">{project.type}</span>
                  </div>
                </div>
                {project.progress === 100 ? (
                  <CheckCircle2 size={24} className="text-emerald-600" />
                ) : project.status === "Delayed" ? (
                  <AlertCircle size={24} className="text-red-600" />
                ) : (
                  <TrendingUp size={24} className="text-orange-600" />
                )}
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Progress</span>
                  <span className={`text-lg font-bold ${statusColor}`}>{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      project.progress === 100
                        ? "bg-emerald-500"
                        : project.status === "Delayed"
                          ? "bg-red-500"
                          : "bg-orange-500"
                    }`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Current Stage & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded p-3">
                  <div className="text-xs font-medium text-slate-500 uppercase mb-1">Current Stage</div>
                  <div className="text-sm font-semibold text-slate-100">{project.currentStage}</div>
                </div>
                <div className={`rounded p-3 text-center ${statusBg} border border-slate-600`}>
                  <div className="text-xs font-medium text-slate-400 uppercase mb-1">Status</div>
                  <div className={`text-sm font-semibold ${statusColor}`}>{project.status}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
