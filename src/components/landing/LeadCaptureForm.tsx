"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";

interface LeadCaptureFormProps {
  isOpen: boolean;
  onClose?: () => void;
  onSubmit?: (data: LeadFormData) => void;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  location: string;
  description: string;
}

const PROJECT_TYPES = ["Residential", "Commercial", "Infrastructure", "Industrial", "Other"];
const BUDGET_RANGES = ["< ₹50L", "₹50L - 1Cr", "₹1Cr - 5Cr", "₹5Cr - 10Cr", "10Cr+"];
const TIMELINE_OPTIONS = ["Immediate", "1-3 months", "3-6 months", "6-12 months", "12+ months"];

export function LeadCaptureForm({ isOpen, onClose, onSubmit }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    email: "",
    phone: "",
    projectType: "Residential",
    budget: "",
    timeline: "3-6 months",
    location: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onSubmit?.(formData);
    setSubmitted(true);

    // Reset form after showing success
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        projectType: "Residential",
        budget: "",
        timeline: "3-6 months",
        location: "",
        description: "",
      });
      setSubmitted(false);
      onClose?.();
    }, 2000);

    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Start Your Project</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {submitted ? (
            // Success State
            <div className="space-y-4 text-center py-12">
              <div className="flex justify-center">
                <div className="bg-emerald-900/30 p-4 rounded-full">
                  <CheckCircle2 size={48} className="text-emerald-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white">Thank You!</h3>
              <p className="text-slate-400">
                We've received your project inquiry. Our team will contact you within 24 hours.
              </p>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-emerald-500 placeholder-slate-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@company.com"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-emerald-500 placeholder-slate-600"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-emerald-500 placeholder-slate-600"
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Project Type *
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-emerald-500"
                >
                  {PROJECT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Estimated Budget *
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select budget range</option>
                  {BUDGET_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Timeline
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-emerald-500"
                >
                  {TIMELINE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Project Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-emerald-500 placeholder-slate-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Brief Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your project vision..."
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-emerald-500 placeholder-slate-600 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white font-semibold py-2 rounded transition flex items-center justify-center gap-2 mt-6"
              >
                <Send size={16} />
                {isSubmitting ? "Submitting..." : "Get Started"}
              </button>

              {/* Note */}
              <p className="text-xs text-slate-500 text-center mt-4">
                By submitting, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
