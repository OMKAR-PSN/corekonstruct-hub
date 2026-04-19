import type { Metadata } from "next";
import LandingPageClient from "@/components/landing/LandingPageClient";

export const metadata: Metadata = {
  title: "CoreKonstruct — Construction Intelligence Platform",
  description:
    "Real-time project intelligence for supervisors, executives, and clients. Track progress, labor, budgets, and site documents with unmatched clarity.",
  openGraph: {
    title: "CoreKonstruct — Construction Intelligence Platform",
    description:
      "One platform. Three roles. Zero spreadsheets. The command-layer for modern construction project management.",
    url: "https://corekonstruct.com",
    siteName: "CoreKonstruct",
    images: [
      {
        url: "/images/downloaded/construction-team.avif",
        width: 2000,
        height: 1333,
        alt: "CoreKonstruct construction intelligence preview",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CoreKonstruct — Construction Intelligence Platform",
    description: "Real-time construction project intelligence for admins, supervisors, and clients.",
  },
};

/**
 * Root landing page — Server Component.
 *
 * Stays as a Server Component so Next.js can export metadata to <head>
 * at build time. All interactivity (theme toggle, FAQ accordion, contact
 * form, modal) lives in the "use client" LandingPageClient component.
 *
 * The .landing-wrapper class in LandingPageClient is the ONLY element
 * that uses the scoped CSS custom properties defined in globals.css.
 * Dashboard routes (/admin, /supervisor, /client) never render this
 * class and are completely unaffected.
 */
export default function HomePage() {
  return <LandingPageClient />;
}
