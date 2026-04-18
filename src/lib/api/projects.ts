import { delay } from "./utils";

// ============================================================================
// CORE ENTITY TYPES - RBAC Data Model
// ============================================================================

/**
 * Project: Core project entity
 * - ClientID: Owner/client reference for access control
 * - CurrentStage: Enum from [Foundation, Slab, Brickwork, Plastering, Finishing, Railings, etc.]
 * - Status: on-track | delayed
 */
export type Project = {
  id: number;
  clientID: number; // RBAC: Clients see only projects matching their ID
  name: string;
  type: string;
  location: string;
  supervisor: string;
  progress: number; // Percentage: 0-100
  currentStage: "Foundation" | "Slab" | "Brickwork" | "Plastering" | "Finishing" | "Railings" | "Sub-base" | "Handover";
  status: "on-track" | "delayed";
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
};

/**
 * Document: Project-linked documents
 * - Type: Sanction Plan | Brochure | Invoice | Permit
 * - RBAC: Admin can upload/manage all; Client sees only their own project docs
 */
export type Document = {
  id: number;
  projectID: number;
  type: "Sanction Plan" | "Brochure" | "Invoice" | "Permit";
  name: string;
  url: string;
  uploadDate: string;
};

/**
 * MaterialLog: Material requisition and delivery tracking
 * - Status: Requested | Approved | Delivered
 * - RBAC: Supervisor creates requests; Admin approves
 */
export type MaterialLog = {
  id: number;
  projectID: number;
  materialName: string;
  quantity: number;
  unit: string;
  status: "Requested" | "Approved" | "Delivered";
  requestedBy: string;
  requestedDate: string;
};

/**
 * LaborLog: Contractor and headcount tracking per project
 * - RBAC: Supervisor logs entries; Admin audits
 */
export type LaborLog = {
  id: number;
  projectID: number;
  contractorName: string;
  headcount: number;
  date: string;
  stage: string;
};

// ============================================================================
// LEGACY/DERIVED TYPES (for backward compat)
// ============================================================================

export type AdminProject = Project; // Admin sees all projects with full metadata

export type SanctionRecord = {
  id: number;
  name: string;
  project: string;
  authority: string;
  issued: string;
  expiry: string;
  status: "approved" | "pending" | "expiring";
};

export type SupervisorProject = {
  id: number;
  clientID: number;
  name: string;
  type: string;
  location: string;
  progress: number;
  status: "on-track" | "delayed";
  stage: string;
};

export type ClientProjectSummary = {
  id: number;
  name: string;
  type: string;
  location: string;
  progress: number;
  status: string;
  currentStage: string;
};

export type ClientActiveProject = {
  name: string;
  type: string;
  location: string;
  progress: number;
  budget: number;
  spent: number;
  currentStage: string;
};

export type ClientMilestone = {
  id: number;
  label: string;
  date: string;
  description: string;
  done: boolean;
};

export type SitePhoto = {
  src: string;
  caption: string;
};

export type CompletedWork = {
  title: string;
  note: string;
  year: string;
};

export type BudgetHistoryPoint = {
  month: string;
  amount: number;
};

// ============================================================================
// MOCK DATA - Projects (Core)
// ============================================================================

const adminProjects: Project[] = [
  {
    id: 1,
    clientID: 101,
    name: "City Center Complex",
    type: "Building",
    location: "Mumbai, MH",
    supervisor: "Arjun Singh",
    progress: 68,
    currentStage: "Brickwork",
    status: "on-track",
    budget: 4200000,
    spent: 2870000,
    startDate: "2025-03-01",
    endDate: "2026-06-30",
  },
  {
    id: 2,
    clientID: 102,
    name: "NH-48 Road Expansion",
    type: "Road",
    location: "Pune – Nashik Highway",
    supervisor: "Arjun Singh",
    progress: 41,
    currentStage: "Sub-base",
    status: "on-track",
    budget: 7500000,
    spent: 3100000,
    startDate: "2025-06-01",
    endDate: "2026-12-31",
  },
  {
    id: 3,
    clientID: 103,
    name: "Residency Park Bridge",
    type: "Bridge",
    location: "Thane, MH",
    supervisor: "Arjun Singh",
    progress: 84,
    currentStage: "Railings",
    status: "delayed",
    budget: 9800000,
    spent: 8200000,
    startDate: "2024-09-01",
    endDate: "2026-03-31",
  },
];

// ============================================================================
// MOCK DATA - Documents (Sanction Plans, Brochures, Invoices, Permits)
// ============================================================================

const documents: Document[] = [
  // Project 1 documents
  {
    id: 101,
    projectID: 1,
    type: "Sanction Plan",
    name: "City Center - Environmental Clearance (MOEFCC)",
    url: "/docs/city-center-env-clearance.pdf",
    uploadDate: "2024-01-15",
  },
  {
    id: 102,
    projectID: 1,
    type: "Sanction Plan",
    name: "City Center - Building Plan Approval",
    url: "/docs/city-center-plan-approval.pdf",
    uploadDate: "2024-02-10",
  },
  {
    id: 103,
    projectID: 1,
    type: "Brochure",
    name: "City Center Complex - Marketing Brochure",
    url: "/docs/city-center-brochure.pdf",
    uploadDate: "2025-03-01",
  },
  {
    id: 104,
    projectID: 1,
    type: "Invoice",
    name: "Invoice - Milestone 1 (Foundation)",
    url: "/docs/city-center-invoice-m1.pdf",
    uploadDate: "2025-08-15",
  },
  // Project 2 documents
  {
    id: 201,
    projectID: 2,
    type: "Sanction Plan",
    name: "NH-48 - NHAI Approval",
    url: "/docs/nh48-nhai-approval.pdf",
    uploadDate: "2023-05-20",
  },
  {
    id: 202,
    projectID: 2,
    type: "Permit",
    name: "NH-48 - Tree Felling Permit",
    url: "/docs/nh48-tree-felling.pdf",
    uploadDate: "2023-06-15",
  },
  // Project 3 documents
  {
    id: 301,
    projectID: 3,
    type: "Sanction Plan",
    name: "Bridge - Irrigation Dept Clearance (Pending)",
    url: "/docs/bridge-irrigation-pending.pdf",
    uploadDate: "2024-04-01",
  },
  {
    id: 302,
    projectID: 3,
    type: "Brochure",
    name: "Residency Park Bridge - Project Overview",
    url: "/docs/bridge-brochure.pdf",
    uploadDate: "2024-09-01",
  },
];

// ============================================================================
// MOCK DATA - Material Logs (Requisitions & Delivery Tracking)
// ============================================================================

const materialLogs: MaterialLog[] = [
  // Project 1 Materials
  {
    id: 1001,
    projectID: 1,
    materialName: "Cement OPC 53",
    quantity: 120,
    unit: "bags",
    status: "Approved",
    requestedBy: "Arjun Singh",
    requestedDate: "2026-04-10",
  },
  {
    id: 1002,
    projectID: 1,
    materialName: "River Sand",
    quantity: 8,
    unit: "cu.m",
    status: "Requested",
    requestedBy: "Arjun Singh",
    requestedDate: "2026-04-12",
  },
  {
    id: 1003,
    projectID: 1,
    materialName: "TMT Steel 12mm",
    quantity: 2.5,
    unit: "MT",
    status: "Delivered",
    requestedBy: "Arjun Singh",
    requestedDate: "2026-03-28",
  },
  {
    id: 1004,
    projectID: 1,
    materialName: "Bricks (Red)",
    quantity: 50000,
    unit: "nos",
    status: "Delivered",
    requestedBy: "Arjun Singh",
    requestedDate: "2026-03-15",
  },
  // Project 2 Materials
  {
    id: 2001,
    projectID: 2,
    materialName: "Bitumen",
    quantity: 45,
    unit: "MT",
    status: "Approved",
    requestedBy: "Arjun Singh",
    requestedDate: "2026-04-08",
  },
  {
    id: 2002,
    projectID: 2,
    materialName: "Aggregate 20mm",
    quantity: 120,
    unit: "cu.m",
    status: "Requested",
    requestedBy: "Arjun Singh",
    requestedDate: "2026-04-13",
  },
  // Project 3 Materials
  {
    id: 3001,
    projectID: 3,
    materialName: "Steel Railings",
    quantity: 500,
    unit: "meter",
    status: "Approved",
    requestedBy: "Arjun Singh",
    requestedDate: "2026-04-05",
  },
];

// ============================================================================
// MOCK DATA - Labor Logs (Contractor & Headcount Tracking)
// ============================================================================

const laborLogs: LaborLog[] = [
  {
    id: 5001,
    projectID: 1,
    contractorName: "Ramesh K. - Site Supervisor",
    headcount: 45,
    date: "2026-04-12",
    stage: "Brickwork",
  },
  {
    id: 5002,
    projectID: 1,
    contractorName: "Suresh P. - Foreman",
    headcount: 32,
    date: "2026-04-12",
    stage: "Brickwork",
  },
  {
    id: 5003,
    projectID: 1,
    contractorName: "Mahesh B. - Mason",
    headcount: 28,
    date: "2026-04-12",
    stage: "Brickwork",
  },
  {
    id: 5004,
    projectID: 2,
    contractorName: "Pradeep N. - Road Contractor",
    headcount: 60,
    date: "2026-04-12",
    stage: "Sub-base",
  },
  {
    id: 5005,
    projectID: 3,
    contractorName: "Vijay S. - Bridge Specialist",
    headcount: 35,
    date: "2026-04-12",
    stage: "Railings",
  },
];

// ============================================================================
// LEGACY MOCK DATA (for UI compat)
// ============================================================================

const sanctions: SanctionRecord[] = [
  {
    id: 1,
    name: "Environmental Clearance",
    project: "City Center Complex",
    authority: "MOEFCC",
    issued: "2024-01-15",
    expiry: "2029-01-14",
    status: "approved",
  },
  {
    id: 2,
    name: "Building Plan Approval",
    project: "City Center Complex",
    authority: "Municipal Corp",
    issued: "2024-02-10",
    expiry: "2027-02-09",
    status: "approved",
  },
  {
    id: 3,
    name: "Fire Safety NOC",
    project: "City Center Complex",
    authority: "Fire Department",
    issued: "2024-03-05",
    expiry: "2025-03-04",
    status: "expiring",
  },
  {
    id: 4,
    name: "Highway Expansion NOC",
    project: "NH-48 Road Expansion",
    authority: "NHAI",
    issued: "2023-05-20",
    expiry: "2026-05-19",
    status: "approved",
  },
  {
    id: 5,
    name: "Tree Felling Permit",
    project: "NH-48 Road Expansion",
    authority: "Forest Dept",
    issued: "2023-06-15",
    expiry: "2024-06-14",
    status: "approved",
  },
  {
    id: 6,
    name: "Irrigation Dept Clearance",
    project: "Residency Park Bridge",
    authority: "Irrigation Dept",
    issued: "Pending",
    expiry: "Pending",
    status: "pending",
  },
];

const supervisorProjects: SupervisorProject[] = [
  { id: 1, clientID: 101, name: "City Center Complex", type: "Building", location: "Mumbai, MH", progress: 68, status: "on-track", stage: "Brickwork" },
  { id: 2, clientID: 102, name: "NH-48 Road Expansion", type: "Road", location: "Pune – Nashik Highway", progress: 41, status: "on-track", stage: "Sub-base" },
  { id: 3, clientID: 103, name: "Residency Park Bridge", type: "Bridge", location: "Thane, MH", progress: 84, status: "delayed", stage: "Railings" },
];

const clientActiveProject: ClientActiveProject = {
  name: "City Center Complex",
  type: "Building",
  location: "Mumbai, MH",
  progress: 68,
  budget: 4200000,
  spent: 2870000,
  currentStage: "Brickwork",
};

const clientProjectSummary: ClientProjectSummary[] = [
  { id: 1, name: "City Center Complex", type: "Building", location: "Mumbai, MH", progress: 68, status: "In Progress", currentStage: "Brickwork" },
  { id: 2, name: "Residency Park Bridge", type: "Bridge", location: "Thane, MH", progress: 84, status: "Delayed", currentStage: "Railings" },
  { id: 3, name: "Green Valley Residency", type: "Building", location: "Pune, MH", progress: 100, status: "Completed", currentStage: "Handover" },
];

const clientMilestones: ClientMilestone[] = [
  { id: 1, label: "Project Start", date: "Mar 2025", description: "Site mobilisation and initial survey completed.", done: true },
  { id: 2, label: "Foundation Complete", date: "May 2025", description: "Foundation and sub-structure completed ahead of target.", done: true },
  { id: 3, label: "Structure Complete", date: "Aug 2025", description: "Main structural frame completed and quality sign-off done.", done: true },
  { id: 4, label: "Brickwork", date: "Dec 2025", description: "Brickwork is progressing through the active floor stack.", done: false },
  { id: 5, label: "Plastering", date: "Mar 2026", description: "Pending mobilization after brickwork handoff.", done: false },
  { id: 6, label: "Handover", date: "Jun 2026", description: "Final delivery and closeout planned for the revised timeline.", done: false },
];

const clientSitePhotos: SitePhoto[] = [
  { src: "/images/downloaded/construction-team.avif", caption: "Foundation and structure review" },
  { src: "/images/downloaded/site-activity.jpg", caption: "Crew activity at the west wing" },
  { src: "/images/downloaded/industrial-warehouse.jpg", caption: "Equipment and material staging" },
  { src: "/images/downloaded/progress-capture.jpg", caption: "Live progress capture" },
];

const clientCompletedWorks: CompletedWork[] = [
  { title: "Green Valley Residency", note: "12-storey residential complex", year: "2024" },
  { title: "Nagpur Ring Road Stretch", note: "18km highway expansion", year: "2024" },
  { title: "Old Town Canal Bridge", note: "80m bridge over Kham river", year: "2023" },
];

const clientBudgetHistory: BudgetHistoryPoint[] = [
  { month: "Nov", amount: 420000 },
  { month: "Dec", amount: 530000 },
  { month: "Jan", amount: 610000 },
  { month: "Feb", amount: 400000 },
  { month: "Mar", amount: 480000 },
  { month: "Apr", amount: 430000 },
];

export async function getAdminProjects() {
  return delay(adminProjects);
}

export async function getAdminSanctions() {
  return delay(sanctions);
}

export async function getProjectDocuments(projectID?: number) {
  if (projectID) {
    return delay(documents.filter((d) => d.projectID === projectID));
  }
  return delay(documents);
}

export async function getMaterialLogs(projectID?: number) {
  if (projectID) {
    return delay(materialLogs.filter((m) => m.projectID === projectID));
  }
  return delay(materialLogs);
}

export async function getLaborLogs(projectID?: number) {
  if (projectID) {
    return delay(laborLogs.filter((l) => l.projectID === projectID));
  }
  return delay(laborLogs);
}

export async function getSupervisorProjects() {
  return delay(supervisorProjects);
}

export async function getClientProjectSnapshot() {
  return delay({
    activeProject: clientActiveProject,
    projectSummary: clientProjectSummary,
    milestoneTimeline: clientMilestones,
    sitePhotos: clientSitePhotos,
    completedWorks: clientCompletedWorks,
    budgetHistory: clientBudgetHistory,
  });
}

export {
  adminProjects,
  sanctions,
  supervisorProjects,
  documents,
  materialLogs,
  laborLogs,
  clientActiveProject,
  clientProjectSummary,
  clientMilestones,
  clientSitePhotos,
  clientCompletedWorks,
  clientBudgetHistory,
};
