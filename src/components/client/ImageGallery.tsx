"use client";

import React, { useState } from "react";
export interface SitePhoto {
  [key: string]: any;
}
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import Image from "next/image";

interface ImageGalleryProps {
  projectName: string;
  images: SitePhoto[];
}

export function ImageGallery({ projectName, images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  if (images.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8 text-center shadow-sm">
        <p className="text-slate-600 text-lg">No site photos available yet</p>
        <p className="text-slate-500 text-sm mt-2">Photos will appear as your project progresses</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Site Photos</h2>
        <p className="text-sm text-slate-600 mt-1">{projectName}</p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((photo, idx) => (
          <div
            key={idx}
            className="relative group overflow-hidden rounded-lg border border-slate-200 hover:border-slate-400 transition cursor-pointer h-48"
            onClick={() => setSelectedIndex(idx)}
          >
            <Image
              src={photo.src}
              alt={photo.caption}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <div className="text-center">
                <Maximize2 size={32} className="text-white mb-2 mx-auto" />
                <p className="text-sm text-white font-medium">View</p>
              </div>
            </div>

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <p className="text-sm text-white">{photo.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 text-slate-900 hover:text-slate-600 transition"
          >
            <X size={24} />
          </button>

          <div className="relative w-full max-w-4xl aspect-video">
            <Image
              src={images[selectedIndex].src}
              alt={images[selectedIndex].caption}
              fill
              className="object-contain"
            />

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded transition"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-sm">
              {selectedIndex + 1} / {images.length}
            </div>

            {/* Caption */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-2 rounded text-sm max-w-xs text-right">
              {images[selectedIndex].caption}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
