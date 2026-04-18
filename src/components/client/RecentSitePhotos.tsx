"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ScanSearch } from "lucide-react";

type RecentSitePhotosProps = {
  photos: Array<{ src: string; caption: string }>;
};

export default function RecentSitePhotos({ photos }: RecentSitePhotosProps) {
  const [activePhoto, setActivePhoto] = useState(photos[0]);

  return (
    <motion.section
      whileHover={{ y: -3 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recent Site Photos</h3>
          <p className="mt-1 text-sm text-slate-600">Executive photo review for the latest site status.</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-100 text-orange-600 ring-1 ring-orange-200">
          <Camera className="h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="relative h-80">
            <AnimatePresence mode="wait">
              <motion.img
                key={activePhoto.src}
                src={activePhoto.src}
                alt={activePhoto.caption}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent p-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                <ScanSearch className="h-3.5 w-3.5 text-orange-400" />
                {activePhoto.caption}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo) => (
            <motion.button
              key={photo.src}
              type="button"
              onClick={() => setActivePhoto(photo)}
              whileHover={{ y: -3 }}
              className={[
                "overflow-hidden rounded-2xl border text-left transition-colors",
                activePhoto.src === photo.src
                  ? "border-orange-200 bg-orange-50"
                  : "border-slate-200 bg-white hover:bg-slate-50",
              ].join(" ")}
            >
              <img src={photo.src} alt={photo.caption} className="h-32 w-full object-cover" />
              <div className="p-3 text-xs text-slate-600">{photo.caption}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
