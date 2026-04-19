"use client";

import React, { useState } from "react";

export interface Project {
  id: any;
  name: string;
  [key: string]: any;
}

export interface Document {
  id: number;
  projectID: any;
  type: "Sanction Plan" | "Brochure" | "Invoice" | "Permit" | string;
  name: string;
  url: string;
  uploadDate: string;
}
import { Upload, Download, Trash2, Plus, FileText } from "lucide-react";

interface DocumentVaultProps {
  projects: Project[];
  documents: Document[];
  onUpload?: (projectId: number, doc: Omit<Document, "id" | "uploadDate">) => void;
  onDelete?: (docId: number) => void;
}

export function DocumentVault({ projects, documents, onUpload, onDelete }: DocumentVaultProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(projects[0]?.id || null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "Sanction Plan" as Document["type"],
    name: "",
    url: "",
  });

  const projectDocs = selectedProjectId ? documents.filter((d) => d.projectID === selectedProjectId) : [];
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProjectId && formData.name && formData.url) {
      onUpload?.(selectedProjectId, {
        projectID: selectedProjectId,
        type: formData.type,
        name: formData.name,
        url: formData.url,
      });
      setFormData({ type: "Sanction Plan", name: "", url: "" });
      setShowUploadForm(false);
    }
  };

  const getDocumentTypeColor = (type: Document["type"]) => {
    const colors: Record<Document["type"], string> = {
      "Sanction Plan": "bg-blue-900/30 text-blue-300",
      Brochure: "bg-purple-900/30 text-purple-300",
      Invoice: "bg-amber-900/30 text-amber-300",
      Permit: "bg-cyan-900/30 text-cyan-300",
    };
    return colors[type];
  };

  return (
    <div className="space-y-6">
      {/* Project Selector */}
      <div className="flex items-center gap-4">
        <label className="text-slate-300 font-medium">Select Project:</label>
        <select
          value={selectedProjectId || ""}
          onChange={(e) => setSelectedProjectId(Number(e.target.value))}
          className="bg-slate-700 text-slate-100 px-4 py-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Document List */}
      <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">
            Documents for {selectedProject?.name}
          </h3>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium text-white transition"
          >
            <Plus size={16} />
            Upload Document
          </button>
        </div>

        {showUploadForm && (
          <form onSubmit={handleSubmit} className="bg-slate-700/50 p-4 rounded mb-4 border border-slate-600">
            <div className="grid gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Document Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Document["type"] })}
                  className="w-full bg-slate-600 text-slate-100 px-3 py-2 rounded border border-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                >
                  <option>Sanction Plan</option>
                  <option>Brochure</option>
                  <option>Invoice</option>
                  <option>Permit</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Document Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Environmental Clearance"
                  className="w-full bg-slate-600 text-slate-100 px-3 py-2 rounded border border-slate-500 focus:outline-none focus:border-blue-500 text-sm placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Document URL</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="/docs/filename.pdf"
                  className="w-full bg-slate-600 text-slate-100 px-3 py-2 rounded border border-slate-500 focus:outline-none focus:border-blue-500 text-sm placeholder-slate-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded text-sm font-medium text-white transition"
                >
                  Save Document
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded text-sm font-medium text-slate-100 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {projectDocs.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No documents uploaded yet</p>
        ) : (
          <div className="grid gap-3">
            {projectDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between bg-slate-700/30 p-3 rounded border border-slate-600 hover:border-slate-500 transition"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText size={18} className="text-slate-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-100 truncate">{doc.name}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className={`px-2 py-1 rounded ${getDocumentTypeColor(doc.type)}`}>
                        {doc.type}
                      </span>
                      <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <a
                    href={doc.url}
                    download
                    className="text-slate-400 hover:text-slate-100 p-2 hover:bg-slate-600 rounded transition"
                    title="Download"
                  >
                    <Download size={16} />
                  </a>
                  <button
                    onClick={() => onDelete?.(doc.id)}
                    className="text-slate-400 hover:text-red-400 p-2 hover:bg-slate-600 rounded transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
