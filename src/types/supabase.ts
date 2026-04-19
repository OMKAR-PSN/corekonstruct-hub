/**
 * src/types/supabase.ts
 *
 * Canonical TypeScript types derived from the Supabase PostgreSQL schema
 * (supabase/schema.sql). Every dashboard component and server page imports
 * from here to stay in sync with the real database shape.
 *
 * When you add columns to the schema, update these types and the compiler
 * will surface every callsite that needs updating.
 */

// ---------------------------------------------------------------------------
// Row types — one type per table, mapping column names → TS types
// ---------------------------------------------------------------------------

export type Profile = {
  id: string;                          // uuid — references auth.users
  role: "admin" | "supervisor" | "client";
  full_name: string | null;
  created_at: string;                  // ISO 8601 timestamptz
};

export type Project = {
  id: string;                          // uuid
  client_id: string | null;            // uuid → profiles.id
  name: string;
  status: "active" | "delayed" | "completed" | "on-hold";
  progress_percentage: number;         // 0–100
  current_stage: string | null;
  created_at: string;
};

export type Material = {
  id: string;                          // uuid
  project_id: string;                  // uuid → projects.id
  name: string;
  quantity: string | null;             // e.g. "120 bags", "45 MT"
  status: "Requested" | "Approved" | "Delivered";
  created_at: string;
};

export type LaborLog = {
  id: string;                          // uuid
  project_id: string;                  // uuid → projects.id
  contractor_id: string | null;        // uuid → profiles.id
  headcount: number;
  date: string;                        // ISO 8601 date
  created_at: string;
};

// ---------------------------------------------------------------------------
// Derived / computed types used by UI components
// ---------------------------------------------------------------------------

/** Aggregated metrics computed from project rows server-side */
export type AdminStats = {
  activeProjects: number;
  delayedProjects: number;
  averageProgress: number;
  /** Placeholder: add a budget column to projects in a future migration */
  totalBudget: number;
  totalSpent: number;
};

export type SupervisorStats = {
  activeProjects: number;
  delayedProjects: number;
  averageProgress: number;
  totalWorkersOnRecord: number;
};

export type ClientStats = {
  activePhotoCount: number;
  milestonesRemaining: number;
  burnRate: number;
};

/**
 * Worker shape expected by LaborAttendanceTracker.
 * Derived from Profile: initials are computed from full_name on the server
 * so the client component stays dumb.
 */
export type WorkerRow = {
  id: string;
  name: string;
  initials: string;
};
