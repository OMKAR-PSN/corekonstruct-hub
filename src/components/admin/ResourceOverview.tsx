"use client";

import React from "react";
import { Project, MaterialLog, LaborLog } from "@/lib/api/projects";
import { Users, Package, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface ResourceOverviewProps {
  projects: Project[];
  materials: MaterialLog[];
  laborLogs: LaborLog[];
}

export function ResourceOverview({ projects, materials, laborLogs }: ResourceOverviewProps) {
  // Aggregate statistics
  const totalProjectsWithMaterials = new Set(materials.map((m) => m.projectID)).size;
  const requestedMaterials = materials.filter((m) => m.status === "Requested").length;
  const approvedMaterials = materials.filter((m) => m.status === "Approved").length;
  const deliveredMaterials = materials.filter((m) => m.status === "Delivered").length;

  const uniqueContractors = new Set(laborLogs.map((l) => l.contractorName)).size;
  const totalHeadcount = laborLogs.reduce((sum, l) => sum + l.headcount, 0);

  // Group materials by status
  const materialsByStatus = {
    Requested: materials.filter((m) => m.status === "Requested"),
    Approved: materials.filter((m) => m.status === "Approved"),
    Delivered: materials.filter((m) => m.status === "Delivered"),
  };

  // Get contractors by project
  const contractorsByProject = projects.map((project) => {
    const projectLabor = laborLogs.filter((l) => l.projectID === project.id);
    const contractors = new Set(projectLabor.map((l) => l.contractorName));
    const headcount = projectLabor.reduce((sum, l) => sum + l.headcount, 0);
    return {
      projectId: project.id,
      projectName: project.name,
      contractorCount: contractors.size,
      headcount,
    };
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase">Active Projects</div>
              <div className="text-2xl font-bold text-slate-100 mt-2">{projects.length}</div>
            </div>
            <Package className="text-slate-600" size={24} />
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase">Total Contractors</div>
              <div className="text-2xl font-bold text-slate-100 mt-2">{uniqueContractors}</div>
            </div>
            <Users className="text-slate-600" size={24} />
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase">Active Headcount</div>
              <div className="text-2xl font-bold text-slate-100 mt-2">{totalHeadcount}</div>
            </div>
            <Users className="text-emerald-600" size={24} />
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase">Materials Tracked</div>
              <div className="text-2xl font-bold text-slate-100 mt-2">{materials.length}</div>
            </div>
            <Package className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Material Pipeline */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Material Pipeline</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="text-amber-500" size={18} />
                <span className="text-slate-300">Requested</span>
              </div>
              <span className="text-2xl font-bold text-amber-400">{requestedMaterials}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="text-blue-500" size={18} />
                <span className="text-slate-300">Approved</span>
              </div>
              <span className="text-2xl font-bold text-blue-400">{approvedMaterials}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" size={18} />
                <span className="text-slate-300">Delivered</span>
              </div>
              <span className="text-2xl font-bold text-emerald-400">{deliveredMaterials}</span>
            </div>
          </div>

          {/* Top Requested Materials */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h4 className="text-sm font-medium text-slate-300 mb-3">Pending Approval</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {materialsByStatus.Requested.length === 0 ? (
                <p className="text-slate-500 text-sm">No pending requests</p>
              ) : (
                materialsByStatus.Requested.slice(0, 5).map((mat) => {
                  const project = projects.find((p) => p.id === mat.projectID);
                  return (
                    <div key={mat.id} className="text-sm bg-slate-700/30 p-2 rounded">
                      <div className="text-slate-200">{mat.materialName}</div>
                      <div className="text-xs text-slate-500">
                        {mat.quantity} {mat.unit} • {project?.name}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Labor Distribution */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Labor Distribution</h3>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {contractorsByProject.map((pc) => (
              <div key={pc.projectId} className="bg-slate-700/30 p-3 rounded">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium text-slate-100">{pc.projectName}</div>
                    <div className="text-xs text-slate-500">{pc.contractorCount} contractors</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-400">{pc.headcount}</div>
                    <div className="text-xs text-slate-500">workers</div>
                  </div>
                </div>

                {/* Headcount bar */}
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min((pc.headcount / 100) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Critical Alerts */}
          {projects.some((p) => p.status === "delayed") && (
            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="flex items-start gap-3 bg-red-900/20 border border-red-800 rounded p-3">
                <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
                <div className="text-sm">
                  <div className="font-medium text-red-300">Delayed Projects</div>
                  <div className="text-xs text-red-200 mt-1">
                    {projects.filter((p) => p.status === "delayed").map((p) => p.name).join(", ")} require attention
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
