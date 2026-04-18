"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-36 sm:pb-24 sm:pt-40 lg:pb-28 lg:pt-48 bg-gradient-to-b from-slate-50 to-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-200/30 blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[8%] h-[280px] w-[280px] rounded-full bg-blue-200/20 blur-[110px]" />
        <div className="absolute right-[6%] top-[18%] h-[220px] w-[220px] rounded-full bg-slate-100/40 blur-[95px]" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Left: Content */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex rounded-full border border-orange-300 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700"
          >
            For Builders & Owners
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl text-balance text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl xl:text-6xl"
          >
            Construction Intelligence, Centralized
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="mt-6 max-w-2xl text-pretty text-base leading-7 text-slate-600 sm:text-lg"
          >
            Real-time project intelligence for supervisors, executives, and clients. Track progress, labor, budgets, and site documents with unmatched clarity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-10 flex flex-wrap items-center justify-start gap-3"
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-700 hover:shadow-lg"
            >
              Start Demo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="#features"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:border-slate-400 hover:shadow-sm"
            >
              Learn More
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-10 flex flex-wrap items-center justify-start gap-6 text-sm text-slate-600"
          >
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
              <ShieldCheck className="h-4 w-4 text-orange-600" />
              Role-based access
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
              <Sparkles className="h-4 w-4 text-orange-600" />
              Real-time updates
            </div>
          </motion.div>
        </div>

        {/* Right: Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="absolute -left-4 top-8 h-24 w-24 rounded-full bg-orange-300/20 blur-3xl" />
          <div className="absolute -right-6 bottom-10 h-28 w-28 rounded-full bg-blue-300/15 blur-3xl" />

          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop"
                alt="CoreKonstruct platform interface - construction intelligence dashboard"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg"
          >
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-lg font-bold text-orange-600">✓</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Trusted by 50+</p>
              <p className="text-xs text-slate-600">Top contractors</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
