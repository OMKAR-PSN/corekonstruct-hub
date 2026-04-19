import type { ReactNode } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { BarChart3, BriefcaseBusiness, CircleDollarSign, LayoutDashboard, ScrollText, UserRound, Users } from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin#overview", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Projects", href: "/admin#projects", icon: <BriefcaseBusiness className="h-4 w-4" /> },
  { label: "Monitoring", href: "/admin#monitoring", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Finance", href: "/admin#finance", icon: <CircleDollarSign className="h-4 w-4" /> },
  { label: "Sanction", href: "/admin#sanction", icon: <ScrollText className="h-4 w-4" /> },
  { label: "Team", href: "/admin/team", icon: <Users className="h-4 w-4" /> },
  { label: "Supervisor", href: "/supervisor", icon: <UserRound className="h-4 w-4" /> },
  { label: "Client", href: "/client", icon: <UserRound className="h-4 w-4" /> },
];

export default function AdminDashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <DashboardLayout
      title="Core Konstruct"
      subtitle="Admin Command Center"
      navItems={navItems}
      userName="Rajesh Kumar"
      userRole="Contractor / Admin"
      logoutHref="/login"
    >
      {children}
    </DashboardLayout>
  );
}
