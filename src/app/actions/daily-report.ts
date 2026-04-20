"use server";

/**
 * src/app/actions/daily-report.ts
 *
 * Server Action: submitDailyReport
 *
 * Security contract:
 *   - supervisor_id is ALWAYS taken from auth.getUser() server-side.
 *   - The client form never sends a supervisor_id field; it cannot be forged.
 *   - RLS on daily_reports enforces auth.uid() = supervisor_id on INSERT too.
 */

import { createClient } from "@/utils/supabase/server";

export type DailyReportState = {
  success: boolean;
  error?: string;
  fieldErrors?: Partial<Record<
    "projectId" | "reportDate" | "weather" | "workDone" | "labourExpense" | "materialExpense" | "miscExpense",
    string
  >>;
};

export async function submitDailyReport(
  _prev: DailyReportState,
  formData: FormData,
): Promise<DailyReportState> {

  // ── 1. Authenticate ───────────────────────────────────────────────────────
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Session expired. Please log in again." };
  }

  // ── 2. Extract + coerce fields ────────────────────────────────────────────
  const projectId       = formData.get("projectId")?.toString().trim()       ?? "";
  const reportDate      = formData.get("reportDate")?.toString().trim()       ?? "";
  const weather         = formData.get("weather")?.toString().trim()          ?? "";
  const workDone        = formData.get("workDone")?.toString().trim()         ?? "";
  const issues          = formData.get("issues")?.toString().trim()           ?? "";
  const labourExpense   = parseFloat(formData.get("labourExpense")?.toString() ?? "0");
  const materialExpense = parseFloat(formData.get("materialExpense")?.toString() ?? "0");
  const miscExpense     = parseFloat(formData.get("miscExpense")?.toString()   ?? "0");

  const VALID_WEATHER = ["Sunny", "Cloudy", "Rainy", "Extreme"] as const;

  // ── 3. Validate ───────────────────────────────────────────────────────────
  const fieldErrors: DailyReportState["fieldErrors"] = {};

  if (!projectId)                                        fieldErrors.projectId   = "Please select a project.";
  if (!reportDate)                                       fieldErrors.reportDate  = "Report date is required.";
  if (!VALID_WEATHER.includes(weather as typeof VALID_WEATHER[number]))
                                                         fieldErrors.weather     = "Please select a valid weather condition.";
  if (!workDone || workDone.length < 10)                 fieldErrors.workDone    = "Please describe the work done (min 10 chars).";
  if (isNaN(labourExpense)   || labourExpense   < 0)     fieldErrors.labourExpense   = "Labour expense must be ≥ 0.";
  if (isNaN(materialExpense) || materialExpense < 0)     fieldErrors.materialExpense = "Material expense must be ≥ 0.";
  if (isNaN(miscExpense)     || miscExpense     < 0)     fieldErrors.miscExpense     = "Misc expense must be ≥ 0.";

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  // ── 4. INSERT ─────────────────────────────────────────────────────────────
  const { error: insertError } = await supabase.from("daily_reports").insert({
    project_id:       projectId,
    supervisor_id:    user.id,        // ← server-side only; never from the form
    report_date:      reportDate,
    weather,
    work_done:        workDone,
    issues:           issues || null, // store NULL when no issues
    labour_expense:   labourExpense,
    material_expense: materialExpense,
    misc_expense:     miscExpense,
  });

  if (insertError) {
    console.error("[submitDailyReport] Supabase error:", insertError.message);

    // Friendly message without leaking internals
    const friendly =
      insertError.code === "42P01"
        ? "The daily_reports table does not exist yet. Please run the SQL migration."
        : "Failed to save the report. Please try again.";

    return { success: false, error: friendly };
  }

  return { success: true };
}
