"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it Works" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#pricing", label: "Pricing" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 py-3 sm:px-5"
    >
      <div
        className={[
          "flex w-full max-w-6xl items-center justify-between border bg-white px-4 py-3 text-slate-900 shadow-sm transition-all duration-500 sm:px-6",
          isScrolled
            ? "mt-2 w-[95%] rounded-2xl border-slate-200 shadow-md"
            : "mt-0 rounded-lg border-slate-100",
        ].join(" ")}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-sm font-black text-white">
            CK
          </span>
          <span className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
            CoreKonstruct
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-orange-600"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Link
          href="/login"
          className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-orange-700 hover:shadow-md"
        >
          Login
        </Link>
      </div>
    </motion.header>
  );
}
