"use client";

import React, { useState } from "react";
import { SupervisorProject } from "@/lib/api/projects";
import { MapPin, Zap, CheckCircle2 } from "lucide-react";

interface StageUpdaterProps {
  project: SupervisorProject;
  onStageUpdate?: (projectId: number, newStage: string) => void;
  onProgressUpdate?: (projectId: number, newProgress: number) => void;
}

const STAGE_PROGRESSION = [
  "Foundation",
  "Slab",
  "Brickwork",
  "Plastering",
  "Finishing",
  "Railings",
  "Handover",
] as const;

export function StageUpdater({ project, onStageUpdate, onProgressUpdate }: StageUpdaterProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>(project.stage);
  const [progressValue, setProgressValue] = useState<number>(project.progress);

  const currentStageIndex = STAGE_PROGRESSION.indexOf(
    project.stage as (typeof STAGE_PROGRESSION)[number]
  );

  const handleStageAdvance = () => {
    if (currentStageIndex < STAGE_PROGRESSION.length - 1) {
      const nextStage = STAGE_PROGRESSION[currentStageIndex + 1];
      setSelectedStage(nextStage);
      onStageUpdate?.(project.id, nextStage);
      // Auto-increment progress
      const newProgress = Math.min(100, projectProgress + 15);
      setProgressValue(newProgress);
      onProgressUpdate?.(project.id, newProgress);
    }
  };

  const handleManualUpdate = () => {
    setIsUpdating(true);
    onStageUpdate?.(project.id, selectedStage);
    onProgressUpdate?.(project.id, progressValue);
    setTimeout(() => setIsUpdating(false), 500);
  };

  const projectProgress = progressValue;
  const nextStageIndex = currentStageIndex + 1;
  const canAdvance = nextStageIndex <= STAGE_PROGRESSION.length - 1;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-sm">
      {/* Project Header */}
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-semibold text-slate-900">{project.name}</h3>
        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            {project.location}
          </div>
          <div>{project.type}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Overall Progress</label>
          <span className="text-lg font-bold text-emerald-600">{projectProgress}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${projectProgress}%` }}
          />
        </div>
      </div>

      {/* Current Stage Display */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="text-xs font-medium text-slate-600 uppercase mb-3">Current Stage</div>
        <div className="text-2xl font-bold text-slate-900">{project.stage}</div>
        <div className="text-sm text-slate-600 mt-2">
          Position {currentStageIndex + 1} of {STAGE_PROGRESSION.length}
        </div>
      </div>

      {/* Stage Progression Timeline */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-600 uppercase mb-3">Stage Progression</div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STAGE_PROGRESSION.map((stage, idx) => {
            const isActive = idx === currentStageIndex;
            const isCompleted = idx < currentStageIndex;
            const isNext = idx === currentStageIndex + 1;

            return (
              <div key={stage} className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => {
                    setSelectedStage(stage);
                  }}
                  className={`px-3 py-2 rounded text-xs font-medium transition whitespace-nowrap ${
                    isActive
                      ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
                      : isCompleted
                        ? "bg-emerald-900/50 text-emerald-300"
                        : isNext
                          ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {isCompleted && <CheckCircle2 className="inline mr-1" size={14} />}
                  {stage}
                </button>
                {idx < STAGE_PROGRESSION.length - 1 && (
                  <div
                    className={`w-2 h-1 rounded-full ${isCompleted ? "bg-emerald-600" : "bg-slate-700"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Update Form */}
      <div className="bg-slate-700/20 border border-slate-700 rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Override Stage (Manual)
          </label>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full bg-slate-700 text-slate-100 px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500 text-sm"
          >
            {STAGE_PROGRESSION.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-300">Update Progress %</label>
            <span className="text-sm text-slate-400">{progressValue}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progressValue}
            onChange={(e) => setProgressValue(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <button
          onClick={handleManualUpdate}
          disabled={isUpdating}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 px-4 py-2 rounded text-sm font-medium text-white transition"
        >
          {isUpdating ? "Updating..." : "Save Changes"}
        </button>
      </div>

      {/* Quick Advance Button */}
      {canAdvance && (
        <button
          onClick={handleStageAdvance}
          className="w-full bg-emerald-600 hover:bg-emerald-700 px-4 py-3 rounded text-sm font-medium text-white transition flex items-center justify-center gap-2"
        >
          <Zap size={16} />
          Advance to {STAGE_PROGRESSION[nextStageIndex]} (+15%)
        </button>
      )}

      {!canAdvance && (
        <div className="bg-slate-700/30 px-4 py-3 rounded text-center">
          <p className="text-sm text-slate-400">Project progression complete</p>
        </div>
      )}
    </div>
  );
}
