"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRightLeft, BriefcaseBusiness, ClipboardCheck, HardHat } from "lucide-react";

export default function ShowcaseSection() {
  return (
    <section id="showcase" className="px-6 py-20 sm:py-24">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, x: -26 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65 }}
          className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Supervisor to Executive Sync</p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            One narrative from the site floor to the boardroom
          </h2>
          <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
            CoreKonstruct bridges operational truth and strategic oversight by converting daily site actions into clean executive reporting, without manual handoff friction.
          </p>

          <div className="mt-8 space-y-3 text-sm text-slate-700">
            <div className="flex items-center gap-3">
              <HardHat className="h-4 w-4 text-orange-600" />
              <span>Supervisors log real progress in context.</span>
            </div>
            <div className="flex items-center gap-3">
              <ArrowRightLeft className="h-4 w-4 text-orange-600" />
              <span>Data pipelines into role-specific dashboards.</span>
            </div>
            <div className="flex items-center gap-3">
              <BriefcaseBusiness className="h-4 w-4 text-orange-600" />
              <span>Clients and leadership consume trusted signals instantly.</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 26 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, delay: 0.05 }}
          className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 sm:p-4"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-orange-200/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-14 -left-12 h-36 w-36 rounded-full bg-blue-200/10 blur-3xl" />

          <div className="relative aspect-[16/11] overflow-hidden rounded-[1.75rem] border border-slate-200">
            <Image
              src="/images/downloaded/construction-team.avif"
              alt="Executive review and construction oversight context"
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/30 via-transparent to-transparent" />
          </div>

          <div className="absolute bottom-6 left-6 right-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">Executive Snapshot</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Turn field complexity into board-ready clarity.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">Client Confidence</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Deliver transparent progress backed by a shared source of truth.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
