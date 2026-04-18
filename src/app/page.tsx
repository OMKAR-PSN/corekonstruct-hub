import type { Metadata } from "next";
import FeaturesGrid from "../components/landing/FeaturesGrid";
import Footer from "../components/landing/Footer";
import HeroSection from "../components/landing/HeroSection";
import Navbar from "../components/landing/Navbar";
import PricingSection from "../components/landing/PricingSection";
import ShowcaseSection from "../components/landing/ShowcaseSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";

export const metadata: Metadata = {
  title: "CoreKonstruct - Construction Intelligence",
  description:
    "Discover CoreKonstruct, the premium construction intelligence platform for real-time progress, labor, budgets, and executive visibility.",
  openGraph: {
    title: "CoreKonstruct - Construction Intelligence",
    description:
      "Premium SaaS storefront for construction intelligence and executive oversight.",
    url: "https://corekonstruct.com",
    images: [
      {
        url: "/images/downloaded/construction-team.avif",
        width: 2000,
        height: 1333,
        alt: "CoreKonstruct construction intelligence preview",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <ShowcaseSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </main>
  );
}
