import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  HardHat, LogOut, LayoutDashboard, Users, ClipboardList,
  Package, FileText, HelpCircle, Building2, MapPin, UserCheck
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type NavItem = { label: string; href: string; icon: React.ElementType };

const navByRole: Record<string, NavItem[]> = {
  admin: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/users", icon: Users },
    { label: "Projects", href: "/dashboard/projects", icon: Building2 },
    { label: "Attendance", href: "/dashboard/attendance", icon: UserCheck },
    { label: "Materials", href: "/dashboard/materials", icon: Package },
    { label: "Updates", href: "/dashboard/updates", icon: FileText },
    { label: "Blog", href: "/dashboard/blog", icon: FileText },
  ],
  supervisor: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Attendance", href: "/dashboard/attendance", icon: UserCheck },
    { label: "Materials", href: "/dashboard/materials", icon: Package },
    { label: "Daily Update", href: "/dashboard/updates", icon: FileText },
  ],
  contractor: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Projects", href: "/dashboard/projects", icon: Building2 },
    { label: "Workers", href: "/dashboard/workers", icon: Users },
    { label: "Attendance", href: "/dashboard/attendance", icon: ClipboardList },
  ],
  client: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Projects", href: "/dashboard/projects", icon: Building2 },
    { label: "Updates", href: "/dashboard/updates", icon: FileText },
  ],
  worker: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Check In", href: "/dashboard/checkin", icon: MapPin },
    { label: "Attendance", href: "/dashboard/attendance", icon: ClipboardList },
  ],
};

const DashboardLayout = ({ children, role }: { children: React.ReactNode; role: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const nav = navByRole[role] || navByRole.worker;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-sidebar">
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <HardHat className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold">Core<span className="text-primary">Konstruct</span></span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1 capitalize">{role} Dashboard</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {nav.map(item => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-1">
          <Link to="/faq" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50">
            <HelpCircle className="h-4 w-4" />
            Help & FAQ
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 w-full text-left">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <HardHat className="h-6 w-6 text-primary" />
            <span className="font-display font-bold">CK</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background flex justify-around py-2 z-30">
          {nav.slice(0, 4).map(item => {
            const active = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href} className={`flex flex-col items-center gap-1 text-xs ${active ? "text-primary" : "text-muted-foreground"}`}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
