import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ClientDashboardClient from "@/components/client/ClientDashboardClient";
import type { Project, ClientStats } from "@/types/supabase";

export default async function ClientPage() {
  const supabase = await createClient();

  // 1. Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Get profile for the name
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // 3. Fetch projects owned by this client
  const { data: projects = [], error } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching client projects:", error);
  }

  // Determine active project (the most recently active one, or first derived)
  const safeProjects = projects || [];
  const activeProject = safeProjects.length > 0 ? safeProjects[0] : null;

  // 4. Mocks for deep child arrays pending full database normalization  
  // (Milestones, Photos, Costs, etc. will get their own tables in Phase 5+)
  const milestoneTimeline = [
    { id: 1, label: "Site Mobilisation", date: "Jan 12", description: "Clearance and temporary setups.", done: true },
    { id: 2, label: "Foundation", date: "Mar 05", description: "Excavation and sub-base completion.", done: true },
    { id: 3, label: "Structure", date: "Jul 20", description: "Pillars, slabs, and core shell.", done: false },
    { id: 4, label: "Handover", date: "Dec 10", description: "Final inspections and key handover.", done: false },
  ];

  const sitePhotos = [
    { id: "p1", url: "/images/downloaded/site-activity.jpg", note: "Slab work", date: "Oct 15", stage: "Structure" },
    { id: "p2", url: "/images/downloaded/construction-team.avif", note: "Safety briefing", date: "Oct 12", stage: "Admin" },
    { id: "p3", url: "/images/downloaded/bridge-project.jpg", note: "Foundation", date: "Sep 28", stage: "Sub-base" },
  ];

  const completedWorks = [
    { title: "Alpha Tech Park", year: "2024", note: "IT SEZ · 450,000 sq ft" },
  ];


  const stats: ClientStats = {
    activePhotoCount: sitePhotos.length,
    milestonesRemaining: milestoneTimeline.filter((m) => !m.done).length,
    burnRate: 0, // No financial data exposed to client
  };

  return (
    <ClientDashboardClient
      activeProject={activeProject as Project | null}
      projectSummary={safeProjects as Project[]}
      milestoneTimeline={milestoneTimeline}
      sitePhotos={sitePhotos}
      completedWorks={completedWorks}

      stats={stats}
      userName={profile?.full_name}
    />
  );
}
