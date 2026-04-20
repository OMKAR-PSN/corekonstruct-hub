"use client";

/**
 * CenterFocusCarousel
 * ─────────────────────────────────────────────────────────────────────────────
 * A Coverflow-style 3D carousel built with framer-motion + Tailwind CSS.
 *
 * Usage:
 *   import CenterFocusCarousel, { CarouselItem } from "@/components/ui/CenterFocusCarousel";
 *
 *   const items: CarouselItem[] = [
 *     { id: 1, title: "Alpha Towers", subtitle: "Residential · Pune", imageUrl: "/path/to/image.jpg" },
 *     ...
 *   ];
 *
 *   <CenterFocusCarousel items={items} autoPlayInterval={4000} />
 *
 * ⚠️  For external images, add the domain to next.config.js → images.domains.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CarouselItem {
  id: string | number;
  title: string;
  subtitle: string;
  imageUrl: string;
}

interface CenterFocusCarouselProps {
  items: CarouselItem[];
  /** Milliseconds between automatic advances. Default: 4000 */
  autoPlayInterval?: number;
  /** Card width in px. Default: 300 */
  cardWidth?: number;
  /** Pixel distance between consecutive card centres. Default: 260 */
  cardGap?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SPRING = {
  type: "spring" as const,
  stiffness: 280,
  damping: 28,
  mass: 0.9,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Wraps an integer into [0, total) */
function safeWrap(index: number, total: number): number {
  return ((index % total) + total) % total;
}

/**
 * Compute the shortest-path offset of `index` relative to `active`
 * on a circular number line of length `total`.
 */
function getOffset(index: number, active: number, total: number): number {
  let offset = index - active;
  if (offset >  Math.floor(total / 2)) offset -= total;
  if (offset < -Math.floor(total / 2)) offset += total;
  return offset;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CenterFocusCarousel({
  items,
  autoPlayInterval = 4000,
  cardWidth = 300,
  cardGap = 260,
}: CenterFocusCarouselProps) {
  const total = items.length;
  const [active, setActive] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const dragStartX   = useRef(0);

  // ── Navigation ─────────────────────────────────────────────────────────────
  // Use functional setState so these callbacks never depend on `active`,
  // meaning the auto-play timer is NOT recreated on every slide change.

  const go   = useCallback((i: number) => setActive(safeWrap(i, total)), [total]);
  const next = useCallback(() => setActive(p => safeWrap(p + 1, total)), [total]);
  const prev = useCallback(() => setActive(p => safeWrap(p - 1, total)), [total]);

  // ── Auto-play ───────────────────────────────────────────────────────────────

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, autoPlayInterval);
  }, [next, autoPlayInterval]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(intervalRef.current);
  }, [resetTimer]);

  // ── Swipe support (pointer events on the track wrapper) ────────────────────

  function handlePointerDown(e: React.PointerEvent) {
    dragStartX.current = e.clientX;
  }

  function handlePointerUp(e: React.PointerEvent) {
    const delta = e.clientX - dragStartX.current;
    if (delta < -60) { next(); resetTimer(); }
    if (delta >  60) { prev(); resetTimer(); }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  const cardHalf = cardWidth / 2;

  return (
    <div className="relative w-full flex flex-col items-center gap-5 select-none">

      {/* ── Track ─────────────────────────────────────────────────────────── */}
      <div
        className="relative w-full h-[400px]"
        style={{ perspective: "1400px" }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {items.map((item, i) => {
          const offset = getOffset(i, active, total);
          const absOff = Math.abs(offset);
          const isCenter = absOff === 0;
          const isSide   = absOff === 1;

          return (
            <motion.div
              key={item.id}
              onClick={() => {
                if (offset === -1) { prev(); resetTimer(); }
                if (offset ===  1) { next(); resetTimer(); }
              }}
              className="absolute"
              style={{
                top: 0,
                left: `calc(50% - ${cardHalf}px)`,
                width: cardWidth,
                height: 380,
                transformStyle: "preserve-3d",
                cursor: isCenter ? "default" : "pointer",
              }}
              animate={{
                x: offset * cardGap,
                scale: isCenter ? 1 : isSide ? 0.82 : 0.65,
                opacity: isCenter ? 1 : isSide ? 0.52 : 0,
                rotateY: isCenter ? 0 : Math.sign(offset) * -22,
                zIndex: isCenter ? 20 : isSide ? 10 : 0,
              }}
              whileHover={isSide ? { opacity: 0.72 } : undefined}
              transition={SPRING}
            >
              {/* ── Card surface ──────────────────────────────────────────── */}
              <div
                className={[
                  "relative w-full h-full rounded-2xl overflow-hidden",
                  // Active glow + ring
                  isCenter
                    ? "ring-2 ring-orange-500 shadow-[0_0_28px_rgba(249,115,22,0.55)] shadow-2xl"
                    : "shadow-xl",
                ].join(" ")}
              >
                {/* Background image */}
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 90vw, 300px"
                  className="object-cover"
                  priority={isCenter}
                />

                {/* Scrim gradient — darker at bottom for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* ── Caption (only shown on the active / center card) ─── */}
                <motion.div
                  animate={{
                    opacity: isCenter ? 1 : 0,
                    y: isCenter ? 0 : 14,
                  }}
                  transition={{ duration: 0.38, delay: isCenter ? 0.18 : 0 }}
                  className="absolute inset-x-0 bottom-0 p-5"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-400 mb-1.5">
                    {item.subtitle}
                  </p>
                  <h3 className="text-[1.15rem] font-extrabold leading-snug text-white">
                    {item.title}
                  </h3>
                </motion.div>

                {/* Subtle inner border on active card */}
                {isCenter && (
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Previous / Next arrows ────────────────────────────────────────── */}
      <button
        onClick={() => { prev(); resetTimer(); }}
        aria-label="Previous slide"
        className="
          absolute left-0 top-[190px] -translate-y-1/2 z-30
          h-10 w-10 rounded-full
          flex items-center justify-center
          bg-black/25 border border-white/15 backdrop-blur-sm text-white
          hover:bg-black/45 hover:scale-110
          transition-all duration-200
        "
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={() => { next(); resetTimer(); }}
        aria-label="Next slide"
        className="
          absolute right-0 top-[190px] -translate-y-1/2 z-30
          h-10 w-10 rounded-full
          flex items-center justify-center
          bg-black/25 border border-white/15 backdrop-blur-sm text-white
          hover:bg-black/45 hover:scale-110
          transition-all duration-200
        "
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* ── Dot navigation ────────────────────────────────────────────────── */}
      {/*
       * Active dot:   expands to a 28px wide orange pill (progress bar feel)
       * Inactive dot: shrinks to an 8px circle, muted slate
       * Both transitions are spring-driven for a satisfying snap
       */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {items.map((_, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => { go(i); resetTimer(); }}
            aria-label={`Go to slide ${i + 1}`}
            className="h-2 rounded-full focus:outline-none"
            animate={{
              width:           i === active ? 28  : 8,
              backgroundColor: i === active ? "#f97316" : "#475569",
              opacity:         i === active ? 1   : 0.45,
            }}
            whileHover={{ opacity: 0.8 }}
            transition={SPRING}
          />
        ))}
      </div>
    </div>
  );
}
