import { useState, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import {
  HardHat, Users, ClipboardList, MapPin, BarChart3,
  Shield, ArrowRight, CheckCircle2, Building2, Clock,
  Package, FileText, TrendingUp, Zap, Globe, Phone,
  Star, Quote, Camera, CalendarDays, Layers, Wrench
} from "lucide-react";

import heroImg from "@/assets/project-hero.jpg";
import residentialImg from "@/assets/project-residential.jpg";
import bridgeImg from "@/assets/project-bridge.jpg";
import mallImg from "@/assets/project-mall.jpg";
import dashboardImg from "@/assets/dashboard-preview.jpg";

const features = [
  { icon: Users, title: "Role-Based Access", desc: "Admin, Supervisor, Contractor, Client & Worker — each sees only what they need. Fine-grained permissions keep data secure." },
  { icon: ClipboardList, title: "Attendance & Logs", desc: "Mark attendance with GPS verification. Track materials in real-time with photo evidence." },
  { icon: MapPin, title: "GPS Tracking", desc: "Auto-capture worker location on check-in. Verify on-site presence with geo-fencing." },
  { icon: BarChart3, title: "Live Analytics", desc: "Real-time dashboards with attendance trends, material usage & project progress charts." },
  { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade security with row-level policies. Your data stays yours, always encrypted." },
  { icon: Building2, title: "Project Management", desc: "Assign workers to sites, track daily updates, and monitor completion percentages." },
  { icon: Camera, title: "Photo Documentation", desc: "Attach site photos to daily updates. Visual progress tracking for clients and stakeholders." },
  { icon: CalendarDays, title: "Scheduling & Shifts", desc: "Plan worker shifts, set schedules, and manage leave requests all in one place." },
  { icon: Wrench, title: "Equipment Tracking", desc: "Log equipment usage, maintenance schedules, and availability across all project sites." },
];

const steps = [
  { num: "01", title: "Sign Up & Get Assigned", desc: "Create your account, select your role, and get assigned to your project by an admin." },
  { num: "02", title: "Access Your Dashboard", desc: "Each role gets a personalized dashboard with the tools and data they need." },
  { num: "03", title: "Execute & Track", desc: "Mark attendance, log materials, write updates, capture photos — all from one place." },
  { num: "04", title: "Review & Analyze", desc: "Clients and admins see progress in real-time with charts, reports, and timelines." },
];

const demoProjects = [
  {
    img: residentialImg,
    name: "Skyline Residences",
    type: "Residential",
    location: "Mumbai, Maharashtra",
    progress: 78,
    status: "On Track",
    workers: 42,
    budget: "₹24.5 Cr",
    contractor: "Mehta Builders Pvt. Ltd.",
    startDate: "Jan 2025",
    endDate: "Dec 2026",
  },
  {
    img: bridgeImg,
    name: "NH-48 Overpass Bridge",
    type: "Infrastructure",
    location: "Pune, Maharashtra",
    progress: 55,
    status: "In Progress",
    workers: 86,
    budget: "₹112 Cr",
    contractor: "National Infra Corp.",
    startDate: "Mar 2024",
    endDate: "Jun 2026",
  },
  {
    img: mallImg,
    name: "Phoenix Mall Extension",
    type: "Commercial",
    location: "Bangalore, Karnataka",
    progress: 34,
    status: "On Track",
    workers: 120,
    budget: "₹68 Cr",
    contractor: "Prestige Group",
    startDate: "Sep 2025",
    endDate: "Mar 2028",
  },
];

const stats = [
  { value: "500+", label: "Projects Managed" },
  { value: "12,000+", label: "Workers Tracked" },
  { value: "₹2,400 Cr", label: "Budget Managed" },
  { value: "99.8%", label: "Uptime" },
];

const testimonials = [
  {
    name: "Rajesh Sharma",
    role: "Project Manager, Mehta Builders",
    text: "CoreKonstruct transformed how we manage our 40+ active sites. Attendance tracking alone saved us 15% on ghost worker costs.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    role: "Client, Skyline Residences",
    text: "I can see my home being built in real-time. The daily photo updates and progress percentages give me complete peace of mind.",
    rating: 5,
  },
  {
    name: "Arun Patil",
    role: "Site Supervisor",
    text: "Marking attendance with GPS takes 2 minutes now. Material logging is a breeze. My daily reports go out before I leave the site.",
    rating: 5,
  },
];

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(24_100%_50%/0.08),transparent_60%)]" />
          <div className="container relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6 animate-slide-up">
                  <HardHat className="h-3.5 w-3.5" />
                  Construction Management Reimagined
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] animate-slide-up stagger-1">
                  Build Smarter with{" "}
                  <span className="text-primary">CoreKonstruct</span>
                </h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-xl animate-slide-up stagger-2">
                  The all-in-one platform for supervisors, contractors, clients, and workers.
                  Track attendance, manage materials, and monitor projects — from the field to the office.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-start gap-4 animate-slide-up stagger-3">
                  <Link to="/signup">
                    <Button size="lg" className="gap-2 text-base px-8">
                      Get Started Free <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="text-base px-8 gap-2">
                      🚀 Try Demo
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground animate-slide-up stagger-3">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Free to start</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> No credit card</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> 5 roles built-in</span>
                </div>
              </div>
              <div className="relative animate-slide-up stagger-2">
                <div className="rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/10">
                  <img src={heroImg} alt="Construction site with workers and cranes" className="w-full h-auto object-cover" loading="lazy" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-card border border-border/50 rounded-xl p-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Projects Active</p>
                      <p className="text-lg font-bold">24</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-card border border-border/50 rounded-xl p-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Workers On-Site</p>
                      <p className="text-lg font-bold">342</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-12 bg-primary/5 border-y border-primary/10">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 md:py-28 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">Features</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Everything You Need On-Site</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Purpose-built tools for the construction industry — no fluff, no bloat. From attendance to analytics.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <Card key={i} className="group border-border/50 bg-card/50 backdrop-blur hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Projects Showcase */}
        <section id="projects" className="py-20 md:py-28">
          <div className="container">
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">Portfolio</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Demo Projects</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Explore real-world project examples managed through CoreKonstruct — from residential towers to infrastructure.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {demoProjects.map((p, i) => (
                <Card key={i} className="overflow-hidden border-border/50 bg-card/50 hover:border-primary/40 transition-all hover:shadow-xl group">
                  <div className="relative overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-primary/90 text-primary-foreground text-xs">{p.type}</Badge>
                      <Badge variant="outline" className="bg-card/80 backdrop-blur text-xs border-border/50">
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3.5 w-3.5" /> {p.location}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold text-primary">{p.progress}%</span>
                      </div>
                      <Progress value={p.progress} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>{p.workers} Workers</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Package className="h-3.5 w-3.5" />
                        <span>{p.budget}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{p.startDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>{p.endDate}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground">Contractor</p>
                      <p className="text-sm font-medium">{p.contractor}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="py-20 md:py-28 bg-secondary/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4 text-primary border-primary/30">Platform</Badge>
                <h2 className="text-3xl md:text-4xl font-bold">Powerful Dashboards for Every Role</h2>
                <p className="mt-4 text-muted-foreground">
                  Each user gets a personalized view tailored to their responsibilities. No clutter, no confusion — just the data you need.
                </p>
                <div className="mt-8 space-y-4">
                  {[
                    { icon: Zap, title: "Real-time Updates", desc: "See attendance, materials, and progress update as they happen." },
                    { icon: Layers, title: "Multi-Site Management", desc: "Handle multiple construction sites from a single dashboard." },
                    { icon: Globe, title: "Access Anywhere", desc: "Works on tablets, phones, and desktops — perfect for on-site use." },
                    { icon: Phone, title: "Mobile Optimized", desc: "Supervisors can mark attendance and log materials from their phone." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/10">
                <img src={dashboardImg} alt="Supervisor using CoreKonstruct on tablet at construction site" className="w-full h-auto object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 md:py-28">
          <div className="container">
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">Process</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
              <p className="mt-3 text-muted-foreground">Four simple steps to streamline your construction workflow.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((s, i) => (
                <div key={i} className="relative group">
                  <span className="font-display text-5xl font-bold text-primary/15 group-hover:text-primary/25 transition-colors">{s.num}</span>
                  <h3 className="font-display text-lg font-semibold mt-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
                  {i < steps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-8 -right-4 h-5 w-5 text-muted-foreground/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 md:py-28 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">Testimonials</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Trusted by Construction Teams</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Hear from supervisors, contractors, and clients who use CoreKonstruct daily.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <Card key={i} className="border-border/50 bg-card/50">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground italic leading-relaxed">"{t.text}"</p>
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Roles overview */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">Roles</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Built for Every Role</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Each role gets exactly the tools they need — nothing more, nothing less.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { role: "Admin", color: "text-primary", perks: ["Full system control & user management", "Create projects & assign teams", "Organization-wide analytics & reports", "Manage roles & permissions", "View all sites, attendance & materials"] },
                { role: "Supervisor", color: "text-primary", perks: ["Mark worker attendance with GPS", "Log materials received & used", "Submit daily progress updates with photos", "View site-specific dashboards", "Real-time worker count on site"] },
                { role: "Contractor", color: "text-primary", perks: ["Track all assigned projects", "Worker allocation across sites", "Attendance & material summaries", "Add/remove worker assignments", "Project completion overview"] },
                { role: "Client", color: "text-primary", perks: ["Monitor project progress in real-time", "View daily updates & site photos", "Track milestones & timelines", "Filter projects by contractor", "Read-only secure access"] },
                { role: "Worker", color: "text-primary", perks: ["Simple personal dashboard", "Self check-in with GPS verification", "View own attendance history", "See current & upcoming assignments", "Mobile-friendly interface"] },
              ].map((r, i) => (
                <Card key={i} className="border-border/50 bg-card/50 hover:border-primary/40 transition-colors">
                  <CardContent className="p-6">
                    <h3 className={`font-display text-lg font-semibold ${r.color} mb-4`}>{r.role}</h3>
                    <ul className="space-y-2.5">
                      {r.perks.map((p, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-primary/5 border-y border-primary/10">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Build Smarter?</h2>
              <p className="mt-4 text-muted-foreground">
                Join CoreKonstruct today and bring your construction management into the digital age. Start free, scale as you grow.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="gap-2 text-base px-8">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="text-base px-8 gap-2">
                    🚀 Try Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-10">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <HardHat className="h-5 w-5 text-primary" />
                  <span className="font-display font-bold text-lg text-foreground">Core<span className="text-primary">Konstruct</span></span>
                </div>
                <p className="text-sm text-muted-foreground">The all-in-one construction management platform for modern teams.</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-3">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="#projects" className="hover:text-foreground transition-colors">Demo Projects</a></li>
                  <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                  <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-3">Get Started</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/signup" className="hover:text-foreground transition-colors">Sign Up</Link></li>
                  <li><Link to="/login" className="hover:text-foreground transition-colors">Login</Link></li>
                  <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                </ul>
              </div>
            </div>
            <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} CoreKonstruct. All rights reserved.</p>
              <p>Built for the construction industry 🏗️</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
