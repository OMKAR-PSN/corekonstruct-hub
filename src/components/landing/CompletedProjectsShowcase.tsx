"use client";

import React from "react";
import { CompletedWork } from "@/lib/api/projects";
import { Award, Clock, MapPin } from "lucide-react";
import Image from "next/image";

interface CompletedProjectsShowcaseProps {
  projects: CompletedWork[];
  onLeadCapture?: () => void;
}

// Mock data for showcase
const SHOWCASE_PROJECTS = [
  {
    title: "Green Valley Residency",
    description: "12-storey residential complex with premium amenities",
    year: "2024",
    image: "/images/downloaded/construction-team.avif",
    stats: {
      units: "240 Units",
      timeline: "Delivered 2 months early",
      location: "Bangalore",
    },
    testimonial: "Completed with exceptional quality and on-time delivery",
  },
  {
    title: "Nagpur Ring Road Stretch",
    description: "18km high-speed highway expansion project",
    year: "2024",
    image: "/images/downloaded/industrial-warehouse.jpg",
    stats: {
      length: "18 km",
      timeline: "15 months end-to-end",
      location: "Nagpur",
    },
    testimonial: "Outstanding execution under challenging terrain conditions",
  },
  {
    title: "Old Town Canal Bridge",
    description: "80m prestressed bridge over Kham river",
    year: "2023",
    image: "/images/downloaded/bridge-project.jpg",
    stats: {
      span: "80 meters",
      timeline: "Zero safety incidents",
      location: "Nashik",
    },
    testimonial: "Engineered perfection meeting strict riverine protocols",
  },
];

export function CompletedProjectsShowcase({ projects, onLeadCapture }: CompletedProjectsShowcaseProps) {
  return (
    <section className="py-16 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Delivered Excellence
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            From concept to completion—our track record speaks of precision, integrity, and client success
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {SHOWCASE_PROJECTS.map((project, idx) => (
            <div
              key={idx}
              className="group border border-slate-700 rounded-lg overflow-hidden bg-slate-900/40 hover:border-slate-600 transition-all hover:shadow-2xl hover:shadow-emerald-500/10"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-slate-800">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Year Badge */}
                <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {project.year}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{project.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{project.description}</p>
                </div>

                {/* Stats */}
                <div className="space-y-2 pb-4 border-b border-slate-700">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Award size={16} className="text-emerald-500" />
                    <span>{project.stats.units || project.stats.length || project.stats.span}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Clock size={16} className="text-blue-500" />
                    <span>{project.stats.timeline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <MapPin size={16} className="text-slate-500" />
                    <span>{project.stats.location}</span>
                  </div>
                </div>

                {/* Testimonial */}
                <p className="text-sm text-slate-300 italic">"{project.testimonial}"</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-900/40 to-blue-900/40 border border-slate-700 rounded-lg p-12 text-center space-y-6">
          <h3 className="text-3xl font-bold text-white">Ready to Build Your Vision?</h3>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Join hundreds of satisfied clients who trust us with their most important projects. Let's create something extraordinary together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={onLeadCapture}
              className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-lg font-semibold text-white transition shadow-lg shadow-emerald-500/50"
            >
              Start Your Project
            </button>
            <a
              href="#portfolio"
              className="border border-slate-400 text-slate-200 hover:text-white hover:border-slate-200 px-8 py-3 rounded-lg font-semibold transition"
            >
              View More Projects
            </a>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-6 justify-center pt-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              500+ Projects Delivered
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              98% Client Satisfaction
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              Zero Safety Incidents (3+ years)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
