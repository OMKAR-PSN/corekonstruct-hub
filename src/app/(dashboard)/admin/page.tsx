import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import type { Project, AdminStats } from "@/types/supabase";

export default async function AdminPage() {
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

  // 3. Fetch all projects
  const { data: projects = [], error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
  }

  // 4. Compute derived stats (since we don't have budget or labor tables robustly linked yet)
  const stats: AdminStats = {
    activeProjects: projects?.length || 0,
    delayedProjects: projects?.filter((p) => p.status === "delayed").length || 0,
    averageProgress: projects?.length
      ? Math.round(
          projects.reduce((acc, p) => acc + (p.progress_percentage || 0), 0) /
            projects.length
        )
      : 0,
    totalBudget: 0, // Pending schema update for finance
    totalSpent: 0,  // Pending schema update for finance
  };

  return (
    <AdminDashboardClient
      projects={projects as Project[]}
      stats={stats}
      userName={profile?.full_name}
    />
  );
}
