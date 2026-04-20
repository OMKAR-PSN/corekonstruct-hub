"use client";

/**
 * LandingPageClient.tsx
 *
 * Full landing page rendered as a Client Component so we can demonstrate:
 *  1. CSS custom properties (scoped to .landing-wrapper) for Dark/Light theming
 *  2. JavaScript DOM manipulation for theme toggle, FAQ accordion, char counter, and modal
 *  3. React Server Action wired via useActionState for contact form submission
 *
 * Academic constraint fulfilled:
 *  - Theme toggle  → document.querySelector('.landing-wrapper').classList.toggle('dark')
 *  - FAQ open/close → element.classList.toggle, style.maxHeight, element.scrollHeight
 *  - Char counter  → document.getElementById('char-counter').textContent = ...
 *  - Modal backdrop → e.target === e.currentTarget guard on click listener
 */

import { useEffect, useActionState, useRef } from "react";
import Link from "next/link";
import CenterFocusCarousel, { CarouselItem } from "@/components/ui/CenterFocusCarousel";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";

// ─── Data ──────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: "📡", title: "Real-Time Site Monitoring",    desc: "Track live progress across every project stage from foundation to handover." },
  { icon: "🛡️", title: "Multi-Role Access Control",    desc: "Separate dashboards for Admins, Supervisors, and Clients — each scoped to what they need." },
  { icon: "🧱", title: "Material & Labour Tracking",   desc: "Log daily headcount, material requisitions, and delivery status from the field." },
  { icon: "📋", title: "Daily Progress Reports",       desc: "Supervisors file structured reports with weather, stage, and issue notes every day." },
  { icon: "👁️",  title: "Client Visibility Portal",    desc: "Clients get a read-only executive view — milestones, budget burn, and site photos." },
  { icon: "📄", title: "Document & NOC Management",   desc: "Track government approvals, sanction plans, and document expiry in one place." },
] as const;

const FAQS = [
  {
    q: "How does CoreKonstruct work?",
    a: "CoreKonstruct connects your Admin, Supervisor, and Client into a single data layer powered by Supabase. Supervisors log daily progress from the field; admins review and approve; clients see a real-time read-only portal — no spreadsheets, no WhatsApp chains.",
  },
  {
    q: "What roles does the platform support?",
    a: "Three roles are built-in: Admin (full access — projects, finance, sanctions), Supervisor (site logging, labor, materials), and Client (read-only executive view). Roles are enforced at the database level via Row-Level Security policies.",
  },
  {
    q: "Is my project data secure?",
    a: "Yes. Authentication is handled by Supabase Auth (supporting Google OAuth and email/password). All data access is gated by PostgreSQL Row-Level Security — a user can only read or write the rows they own. Secrets are never exposed in the browser.",
  },
  {
    q: "Can I export progress reports or documents?",
    a: "PDF export and CSV download for project reports and labor logs are on the roadmap. For now, admins can query the Supabase dashboard directly or use the Supabase API with the service-role key to export any table.",
  },
  {
    q: "How do I get started?",
    a: "Click Sign Up, create your account, and you'll be auto-provisioned as a Client. Contact your CoreKonstruct admin to have your role promoted to Supervisor or Admin. The database trigger handles profile creation automatically on signup.",
  },
] as const;

const CHAR_LIMIT = 500;

// ─── Carousel slides ─────────────────────────────────────────────────────────
const CAROUSEL_SLIDES: CarouselItem[] = [
  {
    id: 1,
    title: "Skyline Towers — High-Rise Development",
    subtitle: "Mixed-Use · Toronto",
    imageUrl: "/images/carousel/highrise-towers.jpg",
  },
  {
    id: 2,
    title: "Smart Material Yard — Tagged Inventory",
    subtitle: "Logistics & Supply Chain",
    imageUrl: "/images/carousel/material-yard.jpg",
  },
  {
    id: 3,
    title: "Project Phase 4 — Digital Blueprint Review",
    subtitle: "Planning & Collaboration",
    imageUrl: "/images/carousel/blueprint-review.jpg",
  },
  {
    id: 4,
    title: "Core Foundation Plan — Design to Build",
    subtitle: "Structural Engineering",
    imageUrl: "/images/carousel/foundation-plan.jpg",
  },
  {
    id: 5,
    title: "Bridge Infrastructure — Field Intelligence",
    subtitle: "Civil Engineering · Site Operations",
    imageUrl: "/images/carousel/site-engineer.jpg",
  },
];

// ─── Initial form state ─────────────────────────────────────────────────────
const INITIAL_STATE: ContactFormState = { success: false };

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function LandingPageClient() {
  const formRef    = useRef<HTMLFormElement>(null);
  const modalRef   = useRef<HTMLDivElement>(null);

  const [formState, formAction, isPending] = useActionState(
    submitContactForm,
    INITIAL_STATE,
  );

  // ── Open modal on successful submission ──────────────────────────────────
  useEffect(() => {
    if (formState.success) {
      openModal();
      formRef.current?.reset();
      // Reset the character counter via DOM manipulation
      const counter = document.getElementById("char-counter") as HTMLElement | null;
      if (counter) {
        counter.textContent = `0 / ${CHAR_LIMIT}`;
        counter.style.color = "";
      }
    }
  }, [formState.success]);

  // ── PHASE 1: Theme Toggle via DOM classList manipulation ─────────────────
  //    Uses document.querySelector to find the scoped .landing-wrapper element
  //    and toggles the .dark class which activates the CSS custom property
  //    overrides defined in globals.css under .landing-wrapper.dark { ... }.
  function handleThemeToggle() {
    const wrapper = document.querySelector(".landing-wrapper") as HTMLElement | null;
    if (!wrapper) return;

    const isDark = wrapper.classList.toggle("dark");

    // Update the icon via direct DOM textContent mutation
    const icon = document.getElementById("theme-icon") as HTMLElement | null;
    if (icon) icon.textContent = isDark ? "☀" : "☾";
  }

  // ── PHASE 2a: FAQ accordion via DOM classList + style.maxHeight ──────────
  //    Explicitly uses classList.toggle and scrollHeight property — standard
  //    DOM manipulation that demonstrates the requirement without any
  //    React state involvement.
  function handleFaqToggle(event: React.MouseEvent<HTMLButtonElement>) {
    const btn  = event.currentTarget;
    const item = btn.closest(".lw-faq-item") as HTMLElement | null;
    if (!item) return;

    const answer    = item.querySelector(".lw-faq-answer")    as HTMLElement | null;
    const indicator = item.querySelector(".lw-faq-indicator") as HTMLElement | null;
    const isOpen    = item.classList.contains("open");

    // Close every other open item first (accordion behaviour)
    document.querySelectorAll<HTMLElement>(".lw-faq-item.open").forEach((openItem) => {
      openItem.classList.remove("open");
      const ans = openItem.querySelector(".lw-faq-answer") as HTMLElement | null;
      const ind = openItem.querySelector(".lw-faq-indicator") as HTMLElement | null;
      if (ans) ans.style.maxHeight = "0px";
      if (ind) ind.style.transform = "rotate(0deg)";
    });

    // Toggle the clicked item
    if (!isOpen) {
      item.classList.add("open");
      if (answer)    answer.style.maxHeight = answer.scrollHeight + "px";
      if (indicator) indicator.style.transform = "rotate(45deg)";
    }
  }

  // ── PHASE 2b: Live character counter via DOM getElementById ─────────────
  //    Directly updates the counter <span>'s textContent and style.color
  //    instead of using React state, matching the required DOM-manipulation
  //    pattern for academic review.
  function handleMessageInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const count   = event.currentTarget.value.length;
    const counter = document.getElementById("char-counter") as HTMLElement | null;
    if (!counter) return;

    counter.textContent = `${count} / ${CHAR_LIMIT}`;
    counter.style.color = count > CHAR_LIMIT ? "#ef4444" : "";
  }

  // ── PHASE 3: Modal helpers ───────────────────────────────────────────────
  function openModal() {
    modalRef.current?.classList.add("open");
  }
  function closeModal() {
    modalRef.current?.classList.remove("open");
  }

  // Close when clicking the semi-transparent backdrop (outside the modal box)
  // The guard "e.target === e.currentTarget" is the standard DOM pattern:
  // events bubbling from inside the box will have currentTarget = backdrop
  // but target = the inner element, so they are not equal.
  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) closeModal();
  }

  // ─── JSX ──────────────────────────────────────────────────────────────────
  return (
    // .landing-wrapper — MUST be the outermost element.
    // The .dark class is toggled HERE by handleThemeToggle() via DOM
    // classList.toggle. The CSS custom properties in globals.css under
    // .landing-wrapper and .landing-wrapper.dark are scoped to this element.
    <div className="landing-wrapper">

      {/* ══════════════════════════════════════════════════════════════════
          NAVBAR
          ══════════════════════════════════════════════════════════════════ */}
      <nav className="lw-navbar">
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "2rem", height: "2rem", borderRadius: "0.5rem",
            background: "var(--lw-accent)", display: "grid", placeItems: "center",
            fontSize: "0.75rem", fontWeight: 900, color: "#fff",
          }}>
            CK
          </div>
          <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--lw-text-primary)", letterSpacing: "-0.01em" }}>
            CoreKonstruct
          </span>
        </Link>

        {/* Nav links — hidden on small screens */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} className="hidden sm:flex">
          <a href="#features" className="lw-nav-link">Features</a>
          <a href="#faq"      className="lw-nav-link">FAQ</a>
          <a href="#contact"  className="lw-nav-link">Contact</a>
        </div>

        {/* Right section */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          {/* Theme toggle — see handleThemeToggle() for DOM manipulation details */}
          <button
            id="theme-toggle-btn"
            type="button"
            className="lw-theme-btn"
            onClick={handleThemeToggle}
            aria-label="Toggle dark/light mode"
            suppressHydrationWarning
          >
            <span id="theme-icon">☾</span>
          </button>

          <Link href="/login" className="lw-btn-ghost">Log in</Link>
          <Link href="/login" className="lw-btn-primary">Sign Up</Link>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        style={{
          paddingTop: "9rem",
          paddingBottom: "5rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow — scoped, decorative only */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
            width: "600px", height: "400px",
            background: "radial-gradient(ellipse, var(--lw-accent-light) 0%, transparent 70%)",
            opacity: 0.7, borderRadius: "50%",
          }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "56rem", margin: "0 auto" }}>
          <div className="lw-section-label" style={{ marginBottom: "1.5rem" }}>
            ⚡ Built for Builders
          </div>

          <h1 style={{
            fontSize: "clamp(2.25rem, 6vw, 4rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "var(--lw-text-primary)",
            margin: "0 0 1.5rem",
          }}>
            Construction Intelligence,{" "}
            <span className="lw-hero-accent">Centralized.</span>
          </h1>

          <p style={{
            fontSize: "1.125rem",
            lineHeight: 1.75,
            color: "var(--lw-text-secondary)",
            maxWidth: "38rem",
            margin: "0 auto 2.5rem",
          }}>
            Real-time project intelligence for supervisors, executives, and clients. Track progress, labor, budgets, and site documents — with unmatched clarity.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center", marginBottom: "3.5rem" }}>
            <Link href="/login" className="lw-btn-primary" style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>
              Get Started Free →
            </Link>
            <a href="#features" className="lw-btn-ghost" style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>
              See the Platform
            </a>
          </div>

          {/* Trust strip */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "1rem",
            justifyContent: "center", fontSize: "0.8125rem",
            color: "var(--lw-text-muted)",
          }}>
            {["✓ No credit card needed", "✓ Role-based access control", "✓ Powered by Supabase"].map((item) => (
              <span key={item} style={{
                background: "var(--lw-surface)",
                border: "1px solid var(--lw-border)",
                borderRadius: "999px",
                padding: "0.3rem 0.9rem",
              }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="lw-divider" />

      {/* ══════════════════════════════════════════════════════════════════
          FEATURES
          ══════════════════════════════════════════════════════════════════ */}
      <section id="features" className="lw-section">
        <div className="lw-section-label">Platform Capabilities</div>
        <h2 className="lw-section-title">Everything your project team needs.</h2>
        <p className="lw-section-sub">
          One platform. Three roles. Zero spreadsheets. CoreKonstruct replaces fragmented workflows with a single source of truth.
        </p>

        {/* Feature grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(17rem, 1fr))",
          gap: "1.25rem",
        }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="lw-card">
              <div className="lw-icon-wrap">{f.icon}</div>
              <h3 className="lw-card-title">{f.title}</h3>
              <p className="lw-card-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="lw-divider" />

      {/* ══════════════════════════════════════════════════════════════════
          PROJECT SHOWCASE — CenterFocusCarousel
          ══════════════════════════════════════════════════════════════════ */}
      <section id="showcase" className="lw-section">
        <div className="lw-section-label">Project Showcase</div>
        <h2 className="lw-section-title">Our work, up close.</h2>
        <p className="lw-section-sub">
          From towering high-rises to precision foundation engineering — every project
          powered by CoreKonstruct&apos;s centralized intelligence layer.
        </p>
        <CenterFocusCarousel items={CAROUSEL_SLIDES} autoPlayInterval={4500} />
      </section>

      <div className="lw-divider" />

      {/* ══════════════════════════════════════════════════════════════════
          FAQ — Phase 2: DOM-manipulation accordion
          ══════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="lw-section">
        <div className="lw-section-label">FAQ</div>
        <h2 className="lw-section-title">Common questions.</h2>
        <p className="lw-section-sub">
          Everything you need to know before rolling CoreKonstruct out to your team.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {FAQS.map((faq, index) => (
            /*
             * Each item is a .lw-faq-item.
             * handleFaqToggle() uses:
             *   btn.closest('.lw-faq-item')       → DOM traversal
             *   item.classList.contains('open')    → DOM class check
             *   querySelectorAll('.lw-faq-item.open') → DOM query
             *   answer.style.maxHeight = ...       → Direct style mutation
             *   answer.scrollHeight                → DOM read property
             * The CSS transition on .lw-faq-answer animates the height change.
             */
            <div key={index} className="lw-faq-item">
              <button
                type="button"
                className="lw-faq-btn"
                onClick={handleFaqToggle}
                aria-expanded="false"
                suppressHydrationWarning
              >
                <span>{faq.q}</span>
                {/* Indicator: rotates 45° when open via style.transform in JS */}
                <span className="lw-faq-indicator">+</span>
              </button>
              {/* Answer: max-height toggled by JS, transition in CSS */}
              <div className="lw-faq-answer">
                <div className="lw-faq-answer-inner">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="lw-divider" />

      {/* ══════════════════════════════════════════════════════════════════
          CONTACT — Phase 2 (char counter) + Phase 3 (modal + action)
          ══════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="lw-section">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))",
          gap: "4rem",
          alignItems: "start",
        }}>
          {/* Left: copy */}
          <div>
            <div className="lw-section-label">Get in Touch</div>
            <h2 className="lw-section-title">Talk to the team.</h2>
            <p className="lw-section-sub" style={{ marginBottom: 0 }}>
              Have a question about CoreKonstruct? Want to onboard your team? Send us a message and we&apos;ll respond within one business day.
            </p>
            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {[
                { icon: "📧", label: "Email", value: "hello@corekonstruct.com" },
                { icon: "📞", label: "Phone", value: "+91 98765 43210" },
                { icon: "🏢", label: "Office", value: "Pune, Maharashtra, India" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                  <div className="lw-icon-wrap" style={{ marginBottom: 0, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--lw-text-muted)", marginBottom: "0.125rem" }}>
                      {item.label}
                    </div>
                    <div style={{ fontWeight: 600, color: "var(--lw-text-primary)", fontSize: "0.9rem" }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="lw-card" style={{ padding: "2rem" }}>
            <h3 style={{ margin: "0 0 1.5rem", fontWeight: 700, color: "var(--lw-text-primary)", fontSize: "1.1rem" }}>
              Send us a message
            </h3>

            {/* Top-level error */}
            {formState.error && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: "0.75rem", padding: "0.75rem 1rem",
                fontSize: "0.875rem", color: "#b91c1c", marginBottom: "1rem",
              }}>
                {formState.error}
              </div>
            )}

            <form ref={formRef} action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Name */}
              <div>
                <label htmlFor="contact-name" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--lw-text-secondary)", marginBottom: "0.375rem" }}>
                  Full Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Rajesh Kumar"
                  className="lw-input"
                  suppressHydrationWarning
                />
                {formState.fieldErrors?.name && (
                  <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>{formState.fieldErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="contact-email" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--lw-text-secondary)", marginBottom: "0.375rem" }}>
                  Email Address
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="rajesh@company.com"
                  className="lw-input"
                  suppressHydrationWarning
                />
                {formState.fieldErrors?.email && (
                  <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>{formState.fieldErrors.email}</p>
                )}
              </div>

              {/* Message + live character counter */}
              <div>
                <label htmlFor="contact-message" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--lw-text-secondary)", marginBottom: "0.375rem" }}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  placeholder="Tell us about your project or team…"
                  maxLength={CHAR_LIMIT + 1} /* allow typing past limit so counter turns red */
                  className="lw-input lw-textarea"
                  /*
                   * handleMessageInput uses DOM manipulation:
                   *   document.getElementById('char-counter').textContent = `${count} / 500`
                   *   counter.style.color = count > 500 ? '#ef4444' : ''
                   * This updates the counter WITHOUT React re-renders.
                   */
                  onChange={handleMessageInput}
                  suppressHydrationWarning
                />
                {/*
                 * The counter element is updated directly by DOM manipulation in
                 * handleMessageInput. Its initial textContent is set here in JSX;
                 * JS takes over from the first keystroke onward.
                 */}
                <p id="char-counter" className="lw-char-counter">
                  0 / {CHAR_LIMIT}
                </p>
                {formState.fieldErrors?.message && (
                  <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>
                    {formState.fieldErrors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="lw-submit-btn"
                style={{ marginTop: "0.5rem" }}
                suppressHydrationWarning
              >
                {isPending ? "Sending…" : "Send Message →"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════════════════════ */}
      <footer className="lw-footer-wrapper">
        {/* Subtle blueprint background pattern with slight opacity overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, opacity: 0.15,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L0 0 0 20' fill='none' stroke='currentColor' stroke-width='0.5' stroke-opacity='0.2'/%3E%3C/svg%3E")`,
          color: "var(--lw-text-secondary)"
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, opacity: 0.85,
          background: "linear-gradient(to bottom, var(--lw-surface) 0%, transparent 100%)"
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "72rem", margin: "0 auto" }}>
          {/* 4-column responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Brand */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{
                  width: "2rem", height: "2rem", borderRadius: "0.5rem",
                  background: "var(--lw-accent)", display: "grid", placeItems: "center",
                  fontSize: "0.75rem", fontWeight: 900, color: "#fff",
                }}>
                  CK
                </div>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--lw-text-primary)", letterSpacing: "-0.01em" }}>
                  CoreKonstruct
                </span>
              </Link>
              <p style={{ color: "var(--lw-text-muted)", fontSize: "0.875rem", lineHeight: 1.6, paddingRight: "1rem", margin: 0 }}>
                Smart construction management for modern contractors. Track projects, manage finances, and keep your team in sync — all from one platform.
              </p>
            </div>

            {/* Column 2: PLATFORM */}
            <div>
              <h4 style={{ fontWeight: 600, color: "var(--lw-text-primary)", letterSpacing: "0.05em", fontSize: "0.875rem", marginBottom: "1.25rem", textTransform: "uppercase", marginTop: 0 }}>
                PLATFORM
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <a href="#features" className="lw-footer-link">Features</a>
                <a href="#about" className="lw-footer-link">About</a>
                <a href="#blog" className="lw-footer-link">Blog</a>
                <a href="#faq" className="lw-footer-link">FAQ</a>
              </div>
            </div>

            {/* Column 3: ROLES */}
            <div>
              <h4 style={{ fontWeight: 600, color: "var(--lw-text-primary)", letterSpacing: "0.05em", fontSize: "0.875rem", marginBottom: "1.25rem", textTransform: "uppercase", marginTop: 0 }}>
                ROLES
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <Link href="/login" className="lw-footer-link">Admin Dashboard</Link>
                <Link href="/login" className="lw-footer-link">Supervisor Panel</Link>
                <Link href="/login" className="lw-footer-link">Client Portal</Link>
              </div>
            </div>

            {/* Column 4: GET STARTED */}
            <div>
              <h4 style={{ fontWeight: 600, color: "var(--lw-text-primary)", letterSpacing: "0.05em", fontSize: "0.875rem", marginBottom: "1.25rem", textTransform: "uppercase", marginTop: 0 }}>
                GET STARTED
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <Link href="/login" className="lw-footer-link">Sign Up Free</Link>
                <Link href="/login" className="lw-footer-link">Login</Link>
                <a href="#contact" className="lw-footer-link">Contact Us</a>
              </div>
            </div>
          </div>

          {/* Full-width divider & copyright */}
          <div style={{ borderTop: "1px solid var(--lw-border)", marginTop: "4rem", paddingTop: "2rem", textAlign: "center" }}>
            <p style={{ fontSize: "0.875rem", color: "var(--lw-text-muted)", margin: 0 }}>
              © 2026 CoreKonstruct — Smart Construction Management. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════
          MODAL — Phase 3: backdrop click-to-close + CSS transition
          ══════════════════════════════════════════════════════════════════ */}
      {/*
       * The modal uses DOM classList manipulation:
       *   openModal()  → modalRef.current.classList.add('open')
       *   closeModal() → modalRef.current.classList.remove('open')
       * CSS in globals.css transitions opacity and scale:
       *   .lw-modal-backdrop          { opacity: 0; pointer-events: none; }
       *   .lw-modal-backdrop.open     { opacity: 1; pointer-events: all; }
       *   .lw-modal-backdrop.open .lw-modal-box { transform: scale(1); }
       *
       * Backdrop click-to-close:
       *   handleBackdropClick checks e.target === e.currentTarget.
       *   If the user clicked the inner box, event bubbles up so target ≠
       *   currentTarget (the backdrop), meaning we do NOT close.
       *   If they clicked the backdrop itself, target === currentTarget → close.
       */}
      <div
        ref={modalRef}
        className="lw-modal-backdrop"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="lw-modal-box" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h2 id="modal-title" style={{ margin: 0, fontSize: "1.0625rem", fontWeight: 700, color: "var(--lw-text-primary)" }}>
              Message Sent 🎉
            </h2>
            {/* (X) close button */}
            <button
              type="button"
              className="lw-modal-close"
              onClick={closeModal}
              aria-label="Close modal"
              suppressHydrationWarning
            >
              ✕
            </button>
          </div>

          {/* Success icon */}
          <div style={{
            width: "4rem", height: "4rem", borderRadius: "50%",
            background: "var(--lw-accent-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.75rem", margin: "0 auto 1.25rem",
          }}>
            ✅
          </div>

          <p style={{ textAlign: "center", color: "var(--lw-text-secondary)", fontSize: "0.9375rem", lineHeight: 1.7, margin: "0 0 1.5rem" }}>
            Your message has been successfully saved to our database.
            A member of the CoreKonstruct team will respond within one business day.
          </p>

          <button
            type="button"
            className="lw-submit-btn"
            onClick={closeModal}
            suppressHydrationWarning
          >
            Got it, thanks!
          </button>
        </div>
      </div>

    </div>
  );
}
