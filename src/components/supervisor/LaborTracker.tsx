"use client";

import React, { useState } from "react";
import { SupervisorProject, LaborLog } from "@/lib/api/projects";
import { Users, Plus } from "lucide-react";

interface LaborTrackerProps {
  project: SupervisorProject;
  laborLogs?: LaborLog[];
  onEntryAdd?: (entry: Omit<LaborLog, "id">) => void;
}

export function LaborTracker({ project, laborLogs = [], onEntryAdd }: LaborTrackerProps) {
  const [formData, setFormData] = useState({
    contractorName: "",
    headcount: "",
    stage: project.stage,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectLaborLogs = laborLogs.filter((l) => l.projectID === project.id);
  const uniqueContractors = new Set(projectLaborLogs.map((l) => l.contractorName));
  const totalHeadcount = projectLaborLogs.reduce((sum, l) => sum + l.headcount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.contractorName && formData.headcount) {
      setIsSubmitting(true);
      onEntryAdd?.({
        projectID: project.id,
        contractorName: formData.contractorName,
        headcount: Number(formData.headcount),
        date: new Date().toISOString().split("T")[0],
        stage: formData.stage,
      });

      setFormData({ contractorName: "", headcount: "", stage: project.stage });
      setTimeout(() => setIsSubmitting(false), 500);
    }
  };

  // Get today's and yesterday's data
  const today = new Date().toISOString().split("T")[0];
  const todayLogs = projectLaborLogs.filter((l) => l.date === today);
  const otherLogs = projectLaborLogs.filter((l) => l.date !== today).slice(0, 10);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
        <p className="text-sm text-slate-600 mt-1">Current Stage: {project.stage}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="text-xs font-medium text-slate-600 uppercase">Active Contractors</div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{uniqueContractors.size}</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="text-xs font-medium text-slate-600 uppercase">Total Workers (Latest)</div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">{totalHeadcount}</div>
        </div>
      </div>

      {/* Entry Form */}
      <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
        <h4 className="text-sm font-semibold text-slate-900">Log Daily Entry</h4>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Contractor/Team Lead *
          </label>
          <input
            type="text"
            value={formData.contractorName}
            onChange={(e) => setFormData({ ...formData, contractorName: e.target.value })}
            placeholder="e.g., Ramesh K. - Site Supervisor"
            className="w-full bg-white text-slate-900 px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-orange-300 text-sm placeholder-slate-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Headcount *
            </label>
            <input
              type="number"
              value={formData.headcount}
              onChange={(e) => setFormData({ ...formData, headcount: e.target.value })}
              placeholder="0"
              className="w-full bg-white text-slate-900 px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-orange-300 text-sm placeholder-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Stage
            </label>
            <input
              type="text"
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              className="w-full bg-white text-slate-900 px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-orange-300 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !formData.contractorName || !formData.headcount}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 px-4 py-2 rounded font-medium text-white transition flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          {isSubmitting ? "Logging..." : "Log Entry"}
        </button>
      </form>

      {/* Labor Logs */}
      {projectLaborLogs.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-900">Labor History</h4>

          {todayLogs.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="text-xs font-medium text-orange-600 uppercase mb-3">Today</div>
              <div className="space-y-2">
                {todayLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{log.contractorName}</div>
                      <div className="text-xs text-slate-600">{log.stage}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-600">{log.headcount}</div>
                      <div className="text-xs text-slate-600">workers</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {otherLogs.length > 0 && (
            <div>
              <div className="text-xs font-medium text-slate-600 uppercase mb-2">Previous Entries</div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {otherLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between bg-slate-50 p-2 rounded text-xs border border-slate-200">
                    <div>
                      <span className="text-slate-700">{log.contractorName}</span>
                      <span className="text-slate-400 mx-2">•</span>
                      <span className="text-slate-600">{log.date}</span>
                    </div>
                    <span className="text-slate-600">{log.headcount} workers</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {projectLaborLogs.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <Users size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No labor entries logged yet</p>
        </div>
      )}
    </div>
  );
}
