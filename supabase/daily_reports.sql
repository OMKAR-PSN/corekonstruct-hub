-- ============================================================================
-- CoreKonstruct Hub — Daily Reports Schema Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================================

-- ---------------------------------------------------------------------------
-- TABLE: daily_reports
--   One row per submitted daily report filed by a supervisor.
--   Linked to a project and the supervisor who filed it.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.daily_reports (
  id                UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id        UUID           NOT NULL REFERENCES public.projects(id)  ON DELETE CASCADE,
  supervisor_id     UUID           NOT NULL REFERENCES public.profiles(id)  ON DELETE CASCADE,
  report_date       DATE           NOT NULL DEFAULT CURRENT_DATE,
  weather           TEXT           NOT NULL DEFAULT 'Sunny'
                                   CHECK (weather IN ('Sunny', 'Cloudy', 'Rainy', 'Extreme')),
  work_done         TEXT           NOT NULL,
  issues            TEXT,                              -- nullable: no blockers is fine
  labour_expense    NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (labour_expense   >= 0),
  material_expense  NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (material_expense >= 0),
  misc_expense      NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (misc_expense     >= 0),
  created_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.daily_reports IS 'Daily site log filed by a supervisor: weather, work done, blockers, and expenses.';
COMMENT ON COLUMN public.daily_reports.weather          IS 'Site weather at time of report.';
COMMENT ON COLUMN public.daily_reports.labour_expense   IS 'Labour cost for the day in INR.';
COMMENT ON COLUMN public.daily_reports.material_expense IS 'Material procurement cost for the day in INR.';
COMMENT ON COLUMN public.daily_reports.misc_expense     IS 'Miscellaneous / sundry expenses for the day in INR.';

-- Useful composite index: look up all reports for a project ordered by date
CREATE INDEX IF NOT EXISTS idx_daily_reports_project_date
  ON public.daily_reports (project_id, report_date DESC);

-- Useful composite index: look up all reports filed by a supervisor
CREATE INDEX IF NOT EXISTS idx_daily_reports_supervisor_date
  ON public.daily_reports (supervisor_id, report_date DESC);


-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------

ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;

-- Supervisors can read their own reports
DROP POLICY IF EXISTS "daily_reports: supervisor can select own rows" ON public.daily_reports;
CREATE POLICY "daily_reports: supervisor can select own rows"
  ON public.daily_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = supervisor_id);

-- Admins can read every report
DROP POLICY IF EXISTS "daily_reports: admin can select all" ON public.daily_reports;
CREATE POLICY "daily_reports: admin can select all"
  ON public.daily_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Any authenticated user can insert their own report
DROP POLICY IF EXISTS "daily_reports: supervisor can insert" ON public.daily_reports;
CREATE POLICY "daily_reports: supervisor can insert"
  ON public.daily_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = supervisor_id);

-- Supervisor can update only their own reports
DROP POLICY IF EXISTS "daily_reports: supervisor can update own" ON public.daily_reports;
CREATE POLICY "daily_reports: supervisor can update own"
  ON public.daily_reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = supervisor_id);


-- ============================================================================
-- DONE.
-- Verify with: SELECT * FROM public.daily_reports LIMIT 5;
-- ============================================================================
