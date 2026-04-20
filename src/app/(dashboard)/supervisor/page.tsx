import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import SupervisorDashboardClient from "@/components/supervisor/SupervisorDashboardClient";
import type { Project, SupervisorStats, WorkerRow } from "@/types/supabase";

export default async function SupervisorPage() {
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

  // 3. Fetch projects assigned to this supervisor
  // Since our schema doesn't currently link supervisor to projects directly 
  // (client_id links to the client), we'll simulate assigned projects by fetching all active ones for now.
  // In a future migration, we'd add `supervisor_id` to `projects` and filter by it.
  const { data: projects = [], error: projectsError } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (projectsError) {
    console.error("Error fetching supervisor projects:", projectsError);
  }

  // 4. Fetch workers (For now, we fetch 'client' and 'admin' as mock crew members since we lack a worker table)
  const { data: allProfiles = [] } = await supabase
    .from("profiles")
    .select("id, full_name")
    .limit(8);

  const workers: WorkerRow[] = (allProfiles ?? []).map((p) => {
    const nameStr = p.full_name || "Unknown Worker";
    const initials = nameStr
      .split(" ")
      .map((n: string) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return {
      id: p.id,
      name: nameStr,
      initials: initials || "W",
    };
  });

  // 5. Compute supervisor stats
  const stats: SupervisorStats = {
    activeProjects: projects?.length || 0,
    delayedProjects: projects?.filter((p) => p.status === "delayed").length || 0,
    averageProgress: projects?.length
      ? Math.round(
          projects.reduce((acc, p) => acc + (p.progress_percentage || 0), 0) /
            projects.length
        )
      : 0,
    totalWorkersOnRecord: workers.length,
  };

  return (
    <SupervisorDashboardClient
      assignedProjects={projects as Project[]}
      workers={workers}
      stats={stats}
      userName={profile?.full_name}
    />
  );
}
