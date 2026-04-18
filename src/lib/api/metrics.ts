import { delay } from "./utils";
import { adminProjects, clientActiveProject, clientProjectSummary, clientMilestones, clientSitePhotos, clientCompletedWorks, sanctions, supervisorProjects } from "./projects";
import { workers, materialRequests, progressSeed } from "./labor";

export type AdminMetrics = {
  activeProjects: number;
  totalBudget: number;
  totalSpent: number;
  averageProgress: number;
  delayedProjects: number;
};

export type SupervisorMetrics = {
  totalWorkers: number;
  activeProjects: number;
  delayedProjects: number;
  averageProgress: number;
};

export type ClientMetrics = {
  burnRate: number;
  completionGap: number;
  activePhotoCount: number;
};

export async function getAdminMetrics() {
  const totalBudget = adminProjects.reduce((sum, project) => sum + project.budget, 0);
  const totalSpent = adminProjects.reduce((sum, project) => sum + project.spent, 0);
  const averageProgress = Math.round(adminProjects.reduce((sum, project) => sum + project.progress, 0) / adminProjects.length);
  const delayedProjects = adminProjects.filter((project) => project.status === "delayed").length;

  return delay<AdminMetrics>({
    activeProjects: adminProjects.length,
    totalBudget,
    totalSpent,
    averageProgress,
    delayedProjects,
  });
}

export async function getSupervisorMetrics() {
  const delayedProjects = supervisorProjects.filter((project) => project.status === "delayed").length;
  const averageProgress = Math.round(supervisorProjects.reduce((sum, project) => sum + project.progress, 0) / supervisorProjects.length);

  return delay<SupervisorMetrics>({
    totalWorkers: workers.length,
    activeProjects: supervisorProjects.length,
    delayedProjects,
    averageProgress,
  });
}

export async function getClientMetrics() {
  const burnRate = Math.round(clientActiveProject.spent / 6);
  const completionGap = Math.max(0, 100 - clientActiveProject.progress);

  return delay<ClientMetrics>({
    burnRate,
    completionGap,
    activePhotoCount: clientSitePhotos.length,
  });
}

export async function getDashboardSeedSnapshot() {
  return delay({
    adminProjects,
    sanctions,
    supervisorProjects,
    workers,
    materialRequests,
    progressSeed,
    clientActiveProject,
    clientProjectSummary,
    clientMilestones,
    clientSitePhotos,
    clientCompletedWorks,
  });
}
