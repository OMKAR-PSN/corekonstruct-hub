import { useState, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  HardHat, Users, ClipboardList, MapPin, BarChart3,
  Shield, ArrowRight, CheckCircle2, Building2
} from "lucide-react";

const features = [
  { icon: Users, title: "Role-Based Access", desc: "Admin, Supervisor, Contractor, Client & Worker — each sees only what they need." },
  { icon: ClipboardList, title: "Attendance & Logs", desc: "Mark attendance with GPS verification. Track materials in real-time." },
  { icon: MapPin, title: "GPS Tracking", desc: "Auto-capture worker location on check-in. Verify on-site presence." },
  { icon: BarChart3, title: "Live Analytics", desc: "Real-time dashboards with attendance trends, material usage & project progress." },
  { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade security with row-level policies. Your data stays yours." },
  { icon: Building2, title: "Project Management", desc: "Assign workers to sites, track daily updates, and monitor completion." },
];

const steps = [
  { num: "01", title: "Sign Up & Get Assigned", desc: "Create your account, select your role, and get assigned to your project." },
  { num: "02", title: "Access Your Dashboard", desc: "Each role gets a personalized dashboard with the tools they need." },
  { num: "03", title: "Execute & Track", desc: "Mark attendance, log materials, write updates — all from one place." },
  { num: "04", title: "Review & Analyze", desc: "Clients and admins see progress in real-time with charts and reports." },
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
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6 animate-slide-up">
                <HardHat className="h-3.5 w-3.5" />
                Construction Management Reimagined
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] animate-slide-up stagger-1">
                Build Smarter with{" "}
                <span className="text-primary">CoreKonstruct</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up stagger-2">
                The all-in-one platform for supervisors, contractors, clients, and workers.
                Track attendance, manage materials, and monitor projects — from the field to the office.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-3">
                <Link to="/signup">
                  <Button size="lg" className="gap-2 text-base px-8">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg" className="text-base px-8">
                    Explore Features
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 md:py-28 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold">Everything You Need On-Site</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Purpose-built tools for the construction industry — no fluff, no bloat.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <Card key={i} className="group border-border/50 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors">
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

        {/* How It Works */}
        <section id="how-it-works" className="py-20 md:py-28">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
              <p className="mt-3 text-muted-foreground">Four simple steps to streamline your construction workflow.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((s, i) => (
                <div key={i} className="relative">
                  <span className="font-display text-5xl font-bold text-primary/15">{s.num}</span>
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

        {/* Roles overview */}
        <section className="py-20 md:py-28 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold">Built for Every Role</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { role: "Admin", perks: ["Full system control", "User management", "Analytics & reports"] },
                { role: "Supervisor", perks: ["Mark attendance", "Log materials", "Daily site updates"] },
                { role: "Contractor", perks: ["Track worker allocation", "View site progress", "Manage assignments"] },
                { role: "Client", perks: ["Monitor project progress", "View updates & photos", "Track milestones"] },
                { role: "Worker", perks: ["Self check-in with GPS", "View attendance history", "See assignments"] },
              ].map((r, i) => (
                <Card key={i} className="border-border/50 bg-card/50">
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-semibold text-primary mb-3">{r.role}</h3>
                    <ul className="space-y-2">
                      {r.perks.map((p, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
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
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Build Smarter?</h2>
              <p className="mt-4 text-muted-foreground">
                Join CoreKonstruct today and bring your construction management into the digital age.
              </p>
              <Link to="/signup">
                <Button size="lg" className="mt-8 gap-2 text-base px-8">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <HardHat className="h-4 w-4 text-primary" />
              <span className="font-display font-semibold text-foreground">CoreKonstruct</span>
            </div>
            <p>© {new Date().getFullYear()} CoreKonstruct. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
