import type { ReactNode } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { BarChart3, CalendarRange, Camera, CircleDollarSign, Eye, UserRound } from "lucide-react";

const navItems = [
  { label: "Projects", href: "/client#ongoing", icon: <Eye className="h-4 w-4" /> },
  { label: "Details", href: "/client#detail", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Completed", href: "/client#completed", icon: <CalendarRange className="h-4 w-4" /> },
  { label: "Photos", href: "/client#photos", icon: <Camera className="h-4 w-4" /> },
  { label: "Admin", href: "/admin", icon: <CircleDollarSign className="h-4 w-4" /> },
  { label: "Supervisor", href: "/supervisor", icon: <UserRound className="h-4 w-4" /> },
];

export default function ClientDashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <DashboardLayout
      title="Core Konstruct"
      subtitle="Client Portal"
      navItems={navItems}
      userName="Priya Mehta"
      userRole="Client"
      logoutHref="/login"
    >
      {children}
    </DashboardLayout>
  );
}
