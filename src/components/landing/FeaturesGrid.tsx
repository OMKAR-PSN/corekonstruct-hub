"use client";

import { motion } from "framer-motion";
import { Activity, HardHat, WalletCards } from "lucide-react";

const features = [
  {
    title: "Real-Time Progress Engine",
    description:
      "Capture daily execution updates and convert field activity into decision-ready visibility for every stakeholder.",
    icon: Activity,
  },
  {
    title: "Labor Management",
    description:
      "Track attendance, crew productivity, and site deployment in one stream to remove blind spots from operations.",
    icon: HardHat,
  },
  {
    title: "Smart Budgets",
    description:
      "Monitor burn rate and forecast budget drift early with contextual project intelligence and milestone alignment.",
    icon: WalletCards,
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="px-6 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
          className="mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Core Modules</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Platform systems built for high-stakes execution</h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
