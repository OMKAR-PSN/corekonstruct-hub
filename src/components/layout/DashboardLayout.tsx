"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, MoonStar } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type NavItem = {
  label: string;
  href: string;
  icon?: ReactNode;
};

type DashboardLayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  navItems: NavItem[];
  userName?: string;
  userRole?: string;
  logoutHref?: string;
  onThemeToggle?: () => void;
};

export default function DashboardLayout({
  children,
  title = "Dashboard",
  subtitle,
  navItems,
  userName = "User",
  userRole = "Member",
  logoutHref = "/api/auth/logout",
  onThemeToggle,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const reduceMotion = useReducedMotion() ?? false;
  const pathname = usePathname();

  useEffect(() => {
    const syncHash = () => setCurrentHash(window.location.hash);

    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => {
      window.removeEventListener("hashchange", syncHash);
    };
  }, []);

  const isActiveItem = (href: string) => {
    const [hrefPath, hrefAnchor] = href.split("#");
    if (pathname !== hrefPath) {
      return false;
    }

    if (!hrefAnchor) {
      return true;
    }

    if (!currentHash && hrefAnchor === "overview") {
      return true;
    }

    return currentHash === `#${hrefAnchor}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          ].join(" ")}
        >
          <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange-600 text-sm font-black text-white">
                CK
              </div>
              <div className="leading-tight">
                <div className="font-semibold tracking-wide text-slate-900">Core Konstruct</div>
                <div className="text-xs text-slate-500">Operations Console</div>
              </div>
            </Link>
          </div>

          <div className="border-b border-slate-200 px-6 py-5">
            <div className="text-sm font-semibold text-slate-900">{userName}</div>
            <div className="text-xs text-slate-500">{userRole}</div>
          </div>

          <nav className="space-y-1 px-3 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors",
                  isActiveItem(item.href)
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                ].join(" ")}
              >
                <span className="shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4">
            <Link
              href={logoutHref}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col lg:ml-0">
          <motion.header
            initial={false}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 220, damping: 24 }
            }
            className="sticky top-0 z-30 mx-2 mt-2 rounded-[32px] border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl sm:mx-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen((value) => !value)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <div>
                  <h1 className="text-lg font-semibold tracking-tight text-slate-900">
                    {title}
                  </h1>
                  {subtitle ? (
                    <p className="text-xs text-slate-500">{subtitle}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onThemeToggle}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100"
                  aria-label="Toggle theme"
                >
                  <MoonStar className="h-5 w-5" />
                </button>

                <div className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 sm:block">
                  {userName}
                </div>
              </div>
            </div>
          </motion.header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>

      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      ) : null}
    </div>
  );
}
