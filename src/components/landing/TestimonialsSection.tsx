"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "CoreKonstruct gives our operations team and leadership the same truth at the same time. That changed how quickly we made decisions.",
    name: "Aarav Mehta",
    role: "Project Director",
  },
  {
    quote:
      "The platform feels purpose-built for construction. The reporting clarity is exactly what clients expect from a modern SaaS layer.",
    name: "Sofia Ramirez",
    role: "Client Executive",
  },
  {
    quote:
      "We replaced scattered updates with a single operating view. The result is less friction and better accountability on site.",
    name: "Daniel Mercer",
    role: "Senior Site Supervisor",
  },
];

export default function TestimonialsSection() {
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Testimonials</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Trusted by teams that need clarity under pressure</h2>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <Quote className="h-5 w-5 text-orange-600" />
              <p className="mt-4 text-sm leading-7 text-slate-600">"{testimonial.quote}"</p>
              <div className="mt-6 border-t border-slate-200 pt-4">
                <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{testimonial.role}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
