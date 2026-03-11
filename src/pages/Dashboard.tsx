import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, ClipboardList, Package, MapPin, UserCheck, FileText, BarChart3 } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color = "text-primary" }: { icon: React.ElementType; label: string; value: string; color?: string }) => (
  <Card className="border-border/50">
    <CardContent className="p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-display font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const AdminDashboard = () => (
  <>
    <h1 className="text-3xl font-bold mb-6">Admin Overview</h1>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard icon={Building2} label="Active Projects" value="12" />
      <StatCard icon={Users} label="Total Workers" value="148" />
      <StatCard icon={UserCheck} label="Present Today" value="132" />
      <StatCard icon={Package} label="Materials Logged" value="47" />
    </div>
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="border-border/50">
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Activity feed will appear here once data is connected.</p>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardHeader><CardTitle>Analytics</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Charts and reports will appear here.</p>
        </CardContent>
      </Card>
    </div>
  </>
);

const SupervisorDashboard = () => (
  <>
    <h1 className="text-3xl font-bold mb-6">Supervisor Dashboard</h1>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <StatCard icon={UserCheck} label="Workers Present" value="25" />
      <StatCard icon={Package} label="Materials Logged Today" value="8" />
      <StatCard icon={FileText} label="Pending Updates" value="2" />
    </div>
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="border-border/50">
        <CardHeader><CardTitle>Mark Attendance</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Navigate to Attendance to mark worker attendance with GPS.</p></CardContent>
      </Card>
      <Card className="border-border/50">
        <CardHeader><CardTitle>Log Materials</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Navigate to Materials to log received/used materials.</p></CardContent>
      </Card>
      <Card className="border-border/50">
        <CardHeader><CardTitle>Daily Update</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Navigate to Updates to submit your daily progress report.</p></CardContent>
      </Card>
    </div>
  </>
);

const ContractorDashboard = () => (
  <>
    <h1 className="text-3xl font-bold mb-6">Contractor Dashboard</h1>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <StatCard icon={Building2} label="My Projects" value="5" />
      <StatCard icon={Users} label="Workers Assigned" value="62" />
      <StatCard icon={BarChart3} label="Avg Progress" value="68%" />
    </div>
    <Card className="border-border/50">
      <CardHeader><CardTitle>Worker Allocations</CardTitle></CardHeader>
      <CardContent><p className="text-sm text-muted-foreground">View which workers are allocated to which sites.</p></CardContent>
    </Card>
  </>
);

const ClientDashboard = () => (
  <>
    <h1 className="text-3xl font-bold mb-6">Project Overview</h1>
    <div className="grid sm:grid-cols-2 gap-4 mb-8">
      <StatCard icon={Building2} label="Active Projects" value="3" />
      <StatCard icon={FileText} label="Recent Updates" value="12" />
    </div>
    <Card className="border-border/50">
      <CardHeader><CardTitle>Project Timeline</CardTitle></CardHeader>
      <CardContent><p className="text-sm text-muted-foreground">Project milestones and progress will appear here.</p></CardContent>
    </Card>
  </>
);

const WorkerDashboard = () => (
  <>
    <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
    <div className="grid sm:grid-cols-2 gap-4 mb-8">
      <StatCard icon={MapPin} label="Current Site" value="Site A" />
      <StatCard icon={ClipboardList} label="Days Present" value="22" />
    </div>
    <Card className="border-border/50">
      <CardHeader><CardTitle>Quick Check-In</CardTitle></CardHeader>
      <CardContent><p className="text-sm text-muted-foreground">Go to Check In to mark your presence with GPS verification.</p></CardContent>
    </Card>
  </>
);

const dashboardByRole: Record<string, React.FC> = {
  admin: AdminDashboard,
  supervisor: SupervisorDashboard,
  contractor: ContractorDashboard,
  client: ClientDashboard,
  worker: WorkerDashboard,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string>("worker");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      // Get role from user metadata (set during signup)
      const userRole = session.user.user_metadata?.role || "worker";
      setRole(userRole);
      setLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const DashboardContent = dashboardByRole[role] || WorkerDashboard;

  return (
    <DashboardLayout role={role}>
      <DashboardContent />
    </DashboardLayout>
  );
};

export default Dashboard;
