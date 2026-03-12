import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users, Building2, ClipboardList, Package, MapPin, UserCheck,
  FileText, BarChart3, TrendingUp, Clock, AlertTriangle,
  CheckCircle2, Calendar, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from "recharts";

const StatCard = ({
  icon: Icon, label, value, trend, trendUp, color = "text-primary"
}: {
  icon: React.ElementType; label: string; value: string; trend?: string; trendUp?: boolean; color?: string;
}) => (
  <Card className="border-border/50">
    <CardContent className="p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-display font-bold">{value}</p>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
          {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend}
        </div>
      )}
    </CardContent>
  </Card>
);

// Demo data
const attendanceData = [
  { day: "Mon", present: 128, absent: 14 },
  { day: "Tue", present: 132, absent: 10 },
  { day: "Wed", present: 125, absent: 17 },
  { day: "Thu", present: 138, absent: 4 },
  { day: "Fri", present: 130, absent: 12 },
  { day: "Sat", present: 95, absent: 47 },
];

const materialData = [
  { name: "Cement", used: 450, received: 500 },
  { name: "Steel", used: 280, received: 300 },
  { name: "Bricks", used: 12000, received: 15000 },
  { name: "Sand", used: 180, received: 200 },
];

const progressData = [
  { week: "W1", progress: 12 },
  { week: "W2", progress: 18 },
  { week: "W3", progress: 25 },
  { week: "W4", progress: 34 },
  { week: "W5", progress: 42 },
  { week: "W6", progress: 55 },
  { week: "W7", progress: 62 },
  { week: "W8", progress: 68 },
];

const pieColors = ["hsl(24, 100%, 50%)", "hsl(24, 100%, 70%)", "hsl(24, 100%, 85%)", "hsl(220, 15%, 50%)"];

const recentActivity = [
  { action: "Attendance marked", site: "Skyline Residences", by: "Arun Patil", time: "10 min ago", icon: UserCheck },
  { action: "Material logged: 50 bags cement", site: "NH-48 Bridge", by: "Suresh Kumar", time: "25 min ago", icon: Package },
  { action: "Daily update submitted", site: "Phoenix Mall", by: "Rahul Verma", time: "1 hr ago", icon: FileText },
  { action: "Worker assigned", site: "Skyline Residences", by: "Admin", time: "2 hrs ago", icon: Users },
  { action: "Progress updated to 78%", site: "Skyline Residences", by: "Arun Patil", time: "3 hrs ago", icon: TrendingUp },
];

const demoProjects = [
  { name: "Skyline Residences", progress: 78, status: "On Track", workers: 42, location: "Mumbai" },
  { name: "NH-48 Overpass Bridge", progress: 55, status: "In Progress", workers: 86, location: "Pune" },
  { name: "Phoenix Mall Extension", progress: 34, status: "On Track", workers: 120, location: "Bangalore" },
  { name: "Green Valley Villas", progress: 91, status: "Ahead", workers: 28, location: "Hyderabad" },
];

const workerAssignments = [
  { worker: "Rajesh K.", site: "Skyline Residences", role: "Mason", since: "Jan 15" },
  { worker: "Sunil M.", site: "NH-48 Bridge", role: "Welder", since: "Feb 01" },
  { worker: "Deepak S.", site: "Phoenix Mall", role: "Electrician", since: "Mar 01" },
  { worker: "Vikram T.", site: "Skyline Residences", role: "Carpenter", since: "Jan 20" },
];

const dailyUpdates = [
  { site: "Skyline Residences", date: "Today", summary: "Completed 3rd floor slab casting. Plumbing work ongoing on 2nd floor.", progress: 78 },
  { site: "NH-48 Bridge", date: "Today", summary: "Pier cap construction in progress. Steel reinforcement for span 4 completed.", progress: 55 },
  { site: "Phoenix Mall", date: "Yesterday", summary: "Glass curtain wall installation started on east wing. Foundation work for parking complete.", progress: 34 },
];

const AdminDashboard = () => (
  <>
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Admin Overview</h1>
      <Badge variant="outline" className="text-primary border-primary/30">Live Dashboard</Badge>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard icon={Building2} label="Active Projects" value="12" trend="+2 this month" trendUp />
      <StatCard icon={Users} label="Total Workers" value="276" trend="+18 this week" trendUp />
      <StatCard icon={UserCheck} label="Present Today" value="248" trend="89.8%" trendUp />
      <StatCard icon={Package} label="Materials Logged" value="₹4.2 Cr" trend="+12%" trendUp />
    </div>

    <div className="grid lg:grid-cols-2 gap-6 mb-6">
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-lg">Weekly Attendance</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 25%)" />
              <XAxis dataKey="day" stroke="hsl(220, 15%, 50%)" fontSize={12} />
              <YAxis stroke="hsl(220, 15%, 50%)" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(220, 20%, 12%)", border: "1px solid hsl(220, 15%, 25%)", borderRadius: 8 }} />
              <Bar dataKey="present" fill="hsl(24, 100%, 50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="hsl(0, 70%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-lg">Project Progress</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 25%)" />
              <XAxis dataKey="week" stroke="hsl(220, 15%, 50%)" fontSize={12} />
              <YAxis stroke="hsl(220, 15%, 50%)" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(220, 20%, 12%)", border: "1px solid hsl(220, 15%, 25%)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="progress" stroke="hsl(24, 100%, 50%)" strokeWidth={2} dot={{ fill: "hsl(24, 100%, 50%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>

    <div className="grid lg:grid-cols-3 gap-6 mb-6">
      <Card className="border-border/50 lg:col-span-2">
        <CardHeader><CardTitle className="text-lg">All Projects</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {demoProjects.map((p, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{p.name}</p>
                  <Badge variant="outline" className="text-xs">{p.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{p.location} · {p.workers} workers</p>
              </div>
              <div className="w-32">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-primary">{p.progress}%</span>
                </div>
                <Progress value={p.progress} className="h-1.5" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-lg">Recent Activity</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.slice(0, 4).map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <a.icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium">{a.action}</p>
                <p className="text-xs text-muted-foreground">{a.site} · {a.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </>
);

const SupervisorDashboard = () => (
  <>
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Supervisor Dashboard</h1>
      <Badge variant="outline" className="text-primary border-primary/30">Skyline Residences</Badge>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard icon={UserCheck} label="Workers Present" value="38" trend="out of 42" trendUp />
      <StatCard icon={Package} label="Materials Today" value="12 items" trend="+3 vs yesterday" trendUp />
      <StatCard icon={FileText} label="Updates Pending" value="1" />
      <StatCard icon={Clock} label="Hours On-Site" value="6.5h" />
    </div>

    <div className="grid lg:grid-cols-2 gap-6 mb-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" /> Today's Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { name: "Rajesh K.", status: "Present", time: "8:02 AM", gps: true },
              { name: "Vikram T.", status: "Present", time: "8:15 AM", gps: true },
              { name: "Sunil P.", status: "Present", time: "8:22 AM", gps: true },
              { name: "Deepak M.", status: "Late", time: "9:45 AM", gps: true },
              { name: "Ramesh S.", status: "Absent", time: "—", gps: false },
            ].map((w, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${w.status === 'Present' ? 'bg-green-500' : w.status === 'Late' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  <span className="text-sm font-medium">{w.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {w.gps && <MapPin className="h-3 w-3 text-green-500" />}
                  <span>{w.time}</span>
                  <Badge variant="outline" className={`text-xs ${w.status === 'Present' ? 'border-green-500/30 text-green-500' : w.status === 'Late' ? 'border-yellow-500/30 text-yellow-500' : 'border-red-500/30 text-red-500'}`}>
                    {w.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Materials Logged Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { material: "Cement (OPC 53)", qty: "50 bags", type: "Received" },
              { material: "TMT Steel 12mm", qty: "2 tons", type: "Received" },
              { material: "River Sand", qty: "10 cu.m", type: "Used" },
              { material: "Bricks (Red)", qty: "2000 pcs", type: "Used" },
              { material: "PVC Pipes 4\"", qty: "50 pcs", type: "Received" },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30">
                <div>
                  <p className="text-sm font-medium">{m.material}</p>
                  <p className="text-xs text-muted-foreground">{m.qty}</p>
                </div>
                <Badge variant="outline" className={`text-xs ${m.type === 'Received' ? 'border-green-500/30 text-green-500' : 'border-primary/30 text-primary'}`}>
                  {m.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    <Card className="border-border/50">
      <CardHeader><CardTitle className="text-lg">Daily Updates</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {dailyUpdates.slice(0, 1).map((u, i) => (
          <div key={i} className="p-4 rounded-lg bg-secondary/30">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-sm">{u.site}</p>
              <Badge variant="outline" className="text-xs">{u.date}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{u.summary}</p>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Completion</span>
                <span className="text-primary font-medium">{u.progress}%</span>
              </div>
              <Progress value={u.progress} className="h-1.5" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </>
);

const ContractorDashboard = () => (
  <>
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Contractor Dashboard</h1>
      <Badge variant="outline" className="text-primary border-primary/30">Mehta Builders</Badge>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard icon={Building2} label="My Projects" value="5" />
      <StatCard icon={Users} label="Workers Assigned" value="276" trend="+18" trendUp />
      <StatCard icon={BarChart3} label="Avg Progress" value="64.5%" trend="+4.2%" trendUp />
      <StatCard icon={Package} label="Material Cost" value="₹1.8 Cr" />
    </div>

    <div className="grid lg:grid-cols-2 gap-6 mb-6">
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-lg">Project Overview</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {demoProjects.map((p, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{p.name}</p>
                  <Badge variant="outline" className={`text-xs ${p.status === 'Ahead' ? 'text-green-500 border-green-500/30' : ''}`}>{p.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{p.location} · {p.workers} workers</p>
              </div>
              <div className="w-28">
                <Progress value={p.progress} className="h-1.5" />
                <p className="text-xs text-primary font-medium text-right mt-1">{p.progress}%</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-lg">Worker Assignments</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {workerAssignments.map((w, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30">
              <div>
                <p className="text-sm font-medium">{w.worker}</p>
                <p className="text-xs text-muted-foreground">{w.role}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium">{w.site}</p>
                <p className="text-xs text-muted-foreground">Since {w.since}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>

    <Card className="border-border/50">
      <CardHeader><CardTitle className="text-lg">Attendance Summary (This Week)</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 25%)" />
            <XAxis dataKey="day" stroke="hsl(220, 15%, 50%)" fontSize={12} />
            <YAxis stroke="hsl(220, 15%, 50%)" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(220, 20%, 12%)", border: "1px solid hsl(220, 15%, 25%)", borderRadius: 8 }} />
            <Bar dataKey="present" fill="hsl(24, 100%, 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </>
);

const ClientDashboard = () => (
  <>
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Project Overview</h1>
      <Badge variant="outline" className="text-primary border-primary/30">Client View</Badge>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <StatCard icon={Building2} label="Active Projects" value="3" />
      <StatCard icon={FileText} label="Recent Updates" value="12" trend="this week" trendUp />
      <StatCard icon={TrendingUp} label="Avg Progress" value="55.6%" trend="+8.3%" trendUp />
    </div>

    <div className="grid lg:grid-cols-2 gap-6 mb-6">
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-lg">My Projects</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {demoProjects.slice(0, 3).map((p, i) => (
            <div key={i} className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.location}</p>
                </div>
                <Badge variant="outline" className="text-xs">{p.status}</Badge>
              </div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Completion</span>
                <span className="text-primary font-medium">{p.progress}%</span>
              </div>
              <Progress value={p.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-lg">Latest Site Updates</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {dailyUpdates.map((u, i) => (
            <div key={i} className="p-3 rounded-lg bg-secondary/30">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-sm">{u.site}</p>
                <span className="text-xs text-muted-foreground">{u.date}</span>
              </div>
              <p className="text-xs text-muted-foreground">{u.summary}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>

    <Card className="border-border/50">
      <CardHeader><CardTitle className="text-lg">Progress Timeline</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 25%)" />
            <XAxis dataKey="week" stroke="hsl(220, 15%, 50%)" fontSize={12} />
            <YAxis stroke="hsl(220, 15%, 50%)" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(220, 20%, 12%)", border: "1px solid hsl(220, 15%, 25%)", borderRadius: 8 }} />
            <Line type="monotone" dataKey="progress" stroke="hsl(24, 100%, 50%)" strokeWidth={2} dot={{ fill: "hsl(24, 100%, 50%)" }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </>
);

const WorkerDashboard = () => (
  <>
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">My Dashboard</h1>
      <Badge variant="outline" className="text-primary border-primary/30">Worker</Badge>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard icon={MapPin} label="Current Site" value="Skyline Res." />
      <StatCard icon={ClipboardList} label="Days Present" value="22" trend="this month" trendUp />
      <StatCard icon={Clock} label="Avg Check-In" value="8:12 AM" />
      <StatCard icon={Calendar} label="Next Leave" value="Mar 20" />
    </div>

    <div className="grid lg:grid-cols-2 gap-6 mb-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" /> Quick Check-In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <p className="font-semibold text-lg">Checked In Today</p>
            <p className="text-sm text-muted-foreground mt-1">8:02 AM · GPS Verified ✓</p>
            <p className="text-xs text-muted-foreground mt-1">Skyline Residences, Mumbai</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-lg">Attendance History</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { date: "Mar 12", status: "Present", time: "8:02 AM" },
              { date: "Mar 11", status: "Present", time: "7:55 AM" },
              { date: "Mar 10", status: "Present", time: "8:10 AM" },
              { date: "Mar 9", status: "Absent", time: "—" },
              { date: "Mar 8", status: "Present", time: "8:05 AM" },
              { date: "Mar 7", status: "Present", time: "7:58 AM" },
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${a.status === 'Present' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">{a.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{a.time}</span>
                  <Badge variant="outline" className={`text-xs ${a.status === 'Present' ? 'border-green-500/30 text-green-500' : 'border-red-500/30 text-red-500'}`}>
                    {a.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    <Card className="border-border/50">
      <CardHeader><CardTitle className="text-lg">Current Assignment</CardTitle></CardHeader>
      <CardContent>
        <div className="p-4 rounded-lg bg-secondary/30">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Project</p>
              <p className="font-semibold">Skyline Residences</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="font-semibold">Mumbai, Maharashtra</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="font-semibold">Mason</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Assigned Since</p>
              <p className="font-semibold">Jan 15, 2025</p>
            </div>
          </div>
        </div>
      </CardContent>
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
