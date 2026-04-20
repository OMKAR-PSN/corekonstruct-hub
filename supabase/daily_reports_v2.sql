-- ============================================================================
-- CoreKonstruct Hub — Daily Reports Schema Migration (v2)
-- Adds current_stage and expense_desc columns.
-- Run after the initial daily_reports.sql migration.
-- ============================================================================

ALTER TABLE public.daily_reports
  ADD COLUMN IF NOT EXISTS current_stage TEXT
    CHECK (current_stage IN (
      'foundation','structure','brickwork','plastering','finishing',
      'earthwork','sub-base','surfacing','piling','deck-slab'
    )),
  ADD COLUMN IF NOT EXISTS expense_desc  TEXT;

COMMENT ON COLUMN public.daily_reports.current_stage IS 'The construction stage active on the report date.';
COMMENT ON COLUMN public.daily_reports.expense_desc  IS 'Free-text description of the expenses for the day.';
