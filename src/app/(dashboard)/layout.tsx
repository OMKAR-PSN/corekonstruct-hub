import type { ReactNode } from "react";
import "./dashboard.css";

export default function DashboardRouteLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
