"use client";

import React, { useState } from "react";
import { SupervisorProject, MaterialLog } from "@/lib/api/projects";
import { Plus, Send } from "lucide-react";

interface MaterialRequestFormProps {
  project: SupervisorProject;
  existingMaterials?: MaterialLog[];
  onRequestSubmit?: (material: Omit<MaterialLog, "id">) => void;
}

const COMMON_MATERIALS = [
  { name: "Cement OPC 53", unit: "bags" },
  { name: "River Sand", unit: "cu.m" },
  { name: "TMT Steel 12mm", unit: "MT" },
  { name: "Bricks (Red)", unit: "nos" },
  { name: "Blocks (AAC)", unit: "nos" },
  { name: "Tiles", unit: "sq.m" },
  { name: "Bitumen", unit: "MT" },
  { name: "Aggregate 20mm", unit: "cu.m" },
  { name: "Aggregate 40mm", unit: "cu.m" },
  { name: "POP", unit: "bags" },
  { name: "Paint", unit: "liters" },
  { name: "Steel Railings", unit: "meter" },
];

export function MaterialRequestForm({
  project,
  existingMaterials = [],
  onRequestSubmit,
}: MaterialRequestFormProps) {
  const [formData, setFormData] = useState({
    materialName: "",
    quantity: "",
    unit: "bags",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const projectMaterials = existingMaterials.filter((m) => m.projectID === project.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.materialName && formData.quantity) {
      setIsSubmitting(true);
      onRequestSubmit?.({
        projectID: project.id,
        materialName: formData.materialName,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        status: "Requested",
        requestedBy: "Current Supervisor", // In real app, use auth context
        requestedDate: new Date().toISOString().split("T")[0],
      });

      setSuccessMessage(`${formData.materialName} requested successfully!`);
      setFormData({ materialName: "", quantity: "", unit: "bags" });
      setTimeout(() => setSuccessMessage(""), 3000);
      setTimeout(() => setIsSubmitting(false), 500);
    }
  };

  const handleSelectMaterial = (material: (typeof COMMON_MATERIALS)[number]) => {
    setFormData((prev) => ({
      ...prev,
      materialName: material.name,
      unit: material.unit,
    }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-sm">
      {/* Project Info */}
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
        <p className="text-sm text-slate-600 mt-1">Current Stage: {project.stage}</p>
      </div>

      {/* Request Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Material Name *
          </label>
          <input
            type="text"
            value={formData.materialName}
            onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
            placeholder="Type material name or select from below"
            className="w-full bg-white text-slate-900 px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-orange-300 placeholder-slate-500"
          />
          {/* Quick Material Buttons */}
          <div className="mt-3 flex flex-wrap gap-2">
            {COMMON_MATERIALS.map((mat) => (
              <button
                key={mat.name}
                type="button"
                onClick={() => handleSelectMaterial(mat)}
                className={`px-2 py-1 rounded text-xs font-medium transition ${
                  formData.materialName === mat.name
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {mat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Quantity *
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="0"
              className="w-full bg-slate-700 text-slate-100 px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500 placeholder-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Unit
            </label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full bg-slate-700 text-slate-100 px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
            >
              <option>bags</option>
              <option>cu.m</option>
              <option>MT</option>
              <option>nos</option>
              <option>sq.m</option>
              <option>liters</option>
              <option>meter</option>
            </select>
          </div>
        </div>

        {successMessage && (
          <div className="bg-emerald-900/30 border border-emerald-700 text-emerald-300 px-3 py-2 rounded text-sm">
            ✓ {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !formData.materialName || !formData.quantity}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 px-4 py-2 rounded font-medium text-white transition flex items-center justify-center gap-2"
        >
          <Send size={16} />
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {/* Recent Requests */}
      {projectMaterials.length > 0 && (
        <div className="border-t border-slate-700 pt-4">
          <h4 className="text-sm font-semibold text-slate-200 mb-3">Recent Requests</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {projectMaterials.map((mat) => (
              <div
                key={mat.id}
                className={`p-3 rounded border flex items-start justify-between ${
                  mat.status === "Delivered"
                    ? "bg-emerald-900/20 border-emerald-700"
                    : mat.status === "Approved"
                      ? "bg-blue-900/20 border-blue-700"
                      : "bg-amber-900/20 border-amber-700"
                }`}
              >
                <div>
                  <div className="font-medium text-slate-100">{mat.materialName}</div>
                  <div className="text-xs text-slate-400">
                    {mat.quantity} {mat.unit} • Requested {mat.requestedDate}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                    mat.status === "Delivered"
                      ? "bg-emerald-900/40 text-emerald-300"
                      : mat.status === "Approved"
                        ? "bg-blue-900/40 text-blue-300"
                        : "bg-amber-900/40 text-amber-300"
                  }`}
                >
                  {mat.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
