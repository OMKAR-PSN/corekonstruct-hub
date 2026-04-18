import type { ReactNode } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import {
  BarChart3,
  CircleDollarSign,
  ClipboardList,
  UserRound,
  Wrench,
  Camera,
  Ruler,
  CalendarDays,
} from "lucide-react";

const navItems = [
  { label: "Projects", href: "/supervisor#projects", icon: <ClipboardList className="h-4 w-4" /> },
  { label: "Report", href: "/supervisor#report", icon: <CalendarDays className="h-4 w-4" /> },
  { label: "Attendance", href: "/supervisor#attendance", icon: <UserRound className="h-4 w-4" /> },
  { label: "Materials", href: "/supervisor#materials", icon: <Wrench className="h-4 w-4" /> },
  { label: "Measurements", href: "/supervisor#measurements", icon: <Ruler className="h-4 w-4" /> },
  { label: "Photos", href: "/supervisor#photos", icon: <Camera className="h-4 w-4" /> },
  { label: "Progress", href: "/supervisor#progress", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Admin", href: "/admin", icon: <CircleDollarSign className="h-4 w-4" /> },
];

export default function SupervisorDashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <DashboardLayout
      title="Core Konstruct"
      subtitle="Supervisor Workspace"
      navItems={navItems}
      userName="Arjun Singh"
      userRole="Site Supervisor"
      logoutHref="/login"
    >
      {children}
    </DashboardLayout>
  );
}
