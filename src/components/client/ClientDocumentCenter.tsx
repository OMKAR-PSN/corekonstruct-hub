"use client";

import React, { useState } from "react";
import { Document } from "@/lib/api/projects";
import { Download, FileText, FolderOpen } from "lucide-react";

interface ClientDocumentCenterProps {
  projectName: string;
  documents: Document[];
}

export function ClientDocumentCenter({ projectName, documents }: ClientDocumentCenterProps) {
  const [filter, setFilter] = useState<Document["type"] | "All">("All");

  const filteredDocs = filter === "All" ? documents : documents.filter((d) => d.type === filter);

  const docTypes = Array.from(new Set(documents.map((d) => d.type)));

  const getDocumentIcon = (type: Document["type"]) => {
    const icons: Record<Document["type"], string> = {
      "Sanction Plan": "📋",
      Brochure: "📄",
      Invoice: "💰",
      Permit: "🔖",
    };
    return icons[type];
  };

  const getDocumentColor = (type: Document["type"]) => {
    const colors: Record<Document["type"], string> = {
      "Sanction Plan": "bg-blue-900/20 border-blue-800 hover:bg-blue-900/30",
      Brochure: "bg-purple-900/20 border-purple-800 hover:bg-purple-900/30",
      Invoice: "bg-amber-900/20 border-amber-800 hover:bg-amber-900/30",
      Permit: "bg-cyan-900/20 border-cyan-800 hover:bg-cyan-900/30",
    };
    return colors[type];
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <FolderOpen size={24} className="text-slate-600" />
          <h2 className="text-2xl font-bold text-slate-900">Document Center</h2>
        </div>
        <p className="text-sm text-slate-600">{projectName}</p>
      </div>

      {/* Filter Tabs */}
      {documents.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === "All"
                ? "bg-orange-100 text-orange-700"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All ({documents.length})
          </button>
          {docTypes.map((type) => {
            const count = documents.filter((d) => d.type === type).length;
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filter === type
                    ? "bg-orange-100 text-orange-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {type} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Document List */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-16">
          <FileText size={48} className="mx-auto text-slate-300 mb-4 opacity-50" />
          <p className="text-slate-600 text-lg">No documents available</p>
          <p className="text-slate-500 text-sm mt-2">
            Documents will appear here once your project manager uploads them
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className={`border rounded-lg p-4 transition cursor-pointer ${getDocumentColor(
                doc.type
              )}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="text-3xl flex-shrink-0">{getDocumentIcon(doc.type)}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-100 truncate">{doc.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 rounded bg-slate-700/60 text-slate-300">
                        {doc.type}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href={doc.url}
                download
                className="mt-4 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded font-medium text-white transition"
              >
                <Download size={16} />
                Download
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      {documents.length > 0 && (
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 text-sm text-blue-300">
          <div className="font-medium mb-1">💡 Note</div>
          <p>
            All documents are confidential and specific to your project. Keep them secure and do not
            share with unauthorized parties.
          </p>
        </div>
      )}
    </div>
  );
}
