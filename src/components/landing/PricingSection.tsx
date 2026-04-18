"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Standard",
    price: "$49",
    description: "For lean project teams that need structured visibility.",
    features: ["Progress reporting", "Basic labor tracking", "Weekly budget summaries"],
    cta: "Start Standard",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$129",
    description: "For active delivery teams coordinating multiple stakeholders.",
    features: ["All Standard features", "Executive dashboards", "Priority support"],
    cta: "Choose Professional",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For larger organizations requiring governance and scale.",
    features: ["Custom roles", "Advanced reporting", "Dedicated onboarding"],
    cta: "Talk to Sales",
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
          className="mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Pricing</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Choose the operating tier that fits your project scale</h2>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className={[
                "rounded-3xl border p-7 shadow-sm",
                plan.highlighted
                  ? "border-orange-200 bg-gradient-to-b from-orange-50 to-orange-100/50"
                  : "border-slate-200 bg-white",
              ].join(" ")}
            >
              {plan.highlighted ? (
                <p className="mb-4 inline-flex rounded-full border border-orange-300 bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">
                  Most Popular
                </p>
              ) : null}
              <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                {plan.price !== "Custom" ? <span className="pb-1 text-sm text-slate-500">/month</span> : null}
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-slate-700">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className={[
                  "mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors",
                  plan.highlighted
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100",
                ].join(" ")}
              >
                {plan.cta}
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
