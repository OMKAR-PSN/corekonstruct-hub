-- ============================================================================
-- CoreKonstruct Hub — Supabase PostgreSQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. EXTENSIONS
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ---------------------------------------------------------------------------
-- 1. PROFILES
--    Mirrors auth.users 1-to-1. The trigger below populates it automatically
--    on every new signup so you never query auth.users directly from the app.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role         TEXT        NOT NULL DEFAULT 'client'
                           CHECK (role IN ('admin', 'supervisor', 'client')),
  full_name    TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.profiles           IS 'One row per authenticated user. Created automatically by the handle_new_user trigger.';
COMMENT ON COLUMN public.profiles.role      IS 'RBAC role: admin | supervisor | client';
COMMENT ON COLUMN public.profiles.full_name IS 'Pulled from OAuth metadata on signup; editable after.';


-- ---------------------------------------------------------------------------
-- 2. PROJECTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id           UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  name                TEXT        NOT NULL,
  status              TEXT        NOT NULL DEFAULT 'active'
                                  CHECK (status IN ('active', 'delayed', 'completed', 'on-hold')),
  progress_percentage INT         NOT NULL DEFAULT 0
                                  CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  current_stage       TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.projects                      IS 'Construction projects owned by a client profile.';
COMMENT ON COLUMN public.projects.progress_percentage  IS '0–100 integer representing overall completion.';
COMMENT ON COLUMN public.projects.current_stage        IS 'E.g. Foundation | Slab | Brickwork | Plastering | Finishing | Handover';


-- ---------------------------------------------------------------------------
-- 3. MATERIALS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.materials (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  quantity    TEXT,                             -- stored as text; unit is embedded (e.g. "120 bags")
  status      TEXT        NOT NULL DEFAULT 'Requested'
                          CHECK (status IN ('Requested', 'Approved', 'Delivered')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.materials          IS 'Material requisition and delivery log per project.';
COMMENT ON COLUMN public.materials.quantity IS 'Free-form quantity string including unit, e.g. "45 MT" or "50000 nos".';


-- ---------------------------------------------------------------------------
-- 4. LABOR_LOGS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.labor_logs (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  contractor_id   UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  headcount       INT         NOT NULL CHECK (headcount > 0),
  date            DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.labor_logs              IS 'Daily contractor headcount log per project.';
COMMENT ON COLUMN public.labor_logs.headcount    IS 'Number of workers present on site that day.';
COMMENT ON COLUMN public.labor_logs.contractor_id IS 'Profile of the supervisor who filed this entry.';


-- ---------------------------------------------------------------------------
-- 5. TRIGGER — Auto-create profile on new signup
--    Security: SECURITY DEFINER runs with the privileges of the function owner
--    (postgres), not the calling user. search_path is pinned to prevent
--    search-path injection attacks.
-- ---------------------------------------------------------------------------
-- ─────────────────────────────────────────────────────────────────────────────
-- SECURITY CONTRACT (Invite-Only RBAC)
--
--   Self-signup via the public login form  →  role is ALWAYS forced to 'client'.
--   No amount of client-side metadata manipulation can override this.
--
--   Admin invite via supabase.auth.admin.inviteUserByEmail()  →  the server
--   action (which holds SUPABASE_SERVICE_ROLE_KEY) embeds the desired role in
--   raw_user_meta_data server-side.  We accept it ONLY if it is 'admin' or
--   'supervisor'.  A client browser can never reach inviteUserByEmail because
--   that API requires the service-role key, which never leaves the server.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _requested_role TEXT;
  _safe_role      TEXT;
BEGIN
  -- Only admin-sent invites carry a role in raw_user_meta_data.
  _requested_role := NEW.raw_user_meta_data ->>'role';

  -- Whitelist: accept only legitimate privileged roles from server-side invites.
  -- Nulls, 'client', and any injected strings all fall back to 'client'.
  IF _requested_role IN ('admin', 'supervisor') THEN
    _safe_role := _requested_role;
  ELSE
    _safe_role := 'client';
  END IF;

  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->>'full_name',   -- set by admin invite / Google OAuth
      NEW.raw_user_meta_data ->>'name',         -- GitHub OAuth fallback
      NEW.email                                 -- final fallback
    ),
    _safe_role
  )
  ON CONFLICT (id) DO NOTHING;                 -- Idempotent: safe to replay
  RETURN NEW;
END;
$$;

-- Drop then recreate to avoid duplicate trigger errors on re-runs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();


-- ---------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
--    Enable RLS on every table before activating any policies.
--    Phase 3 RLS: permissive for authenticated users (any logged-in user
--    can read/write all rows). Tighten per-role in Phase 4.
-- ---------------------------------------------------------------------------

ALTER TABLE public.profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labor_logs ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------------
-- 6a. PROFILES policies
--    • Any authenticated user can read all profiles (needed to resolve names).
--    • A user can only INSERT, UPDATE, DELETE their own row.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "profiles: authenticated users can select" ON public.profiles;
CREATE POLICY "profiles: authenticated users can select"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "profiles: user can insert own row" ON public.profiles;
CREATE POLICY "profiles: user can insert own row"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles: user can update own row" ON public.profiles;
CREATE POLICY "profiles: user can update own row"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles: user can delete own row" ON public.profiles;
CREATE POLICY "profiles: user can delete own row"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);


-- ---------------------------------------------------------------------------
-- 6b. PROJECTS policies (permissive for now — tighten in Phase 4)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "projects: authenticated can select" ON public.projects;
CREATE POLICY "projects: authenticated can select"
  ON public.projects FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "projects: authenticated can insert" ON public.projects;
CREATE POLICY "projects: authenticated can insert"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "projects: authenticated can update" ON public.projects;
CREATE POLICY "projects: authenticated can update"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "projects: authenticated can delete" ON public.projects;
CREATE POLICY "projects: authenticated can delete"
  ON public.projects FOR DELETE
  TO authenticated
  USING (true);


-- ---------------------------------------------------------------------------
-- 6c. MATERIALS policies
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "materials: authenticated can select" ON public.materials;
CREATE POLICY "materials: authenticated can select"
  ON public.materials FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "materials: authenticated can insert" ON public.materials;
CREATE POLICY "materials: authenticated can insert"
  ON public.materials FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "materials: authenticated can update" ON public.materials;
CREATE POLICY "materials: authenticated can update"
  ON public.materials FOR UPDATE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "materials: authenticated can delete" ON public.materials;
CREATE POLICY "materials: authenticated can delete"
  ON public.materials FOR DELETE
  TO authenticated
  USING (true);


-- ---------------------------------------------------------------------------
-- 6d. LABOR_LOGS policies
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "labor_logs: authenticated can select" ON public.labor_logs;
CREATE POLICY "labor_logs: authenticated can select"
  ON public.labor_logs FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "labor_logs: authenticated can insert" ON public.labor_logs;
CREATE POLICY "labor_logs: authenticated can insert"
  ON public.labor_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "labor_logs: authenticated can update" ON public.labor_logs;
CREATE POLICY "labor_logs: authenticated can update"
  ON public.labor_logs FOR UPDATE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "labor_logs: authenticated can delete" ON public.labor_logs;
CREATE POLICY "labor_logs: authenticated can delete"
  ON public.labor_logs FOR DELETE
  TO authenticated
  USING (true);


-- ============================================================================
-- DONE. Run `SELECT * FROM public.profiles;` to verify the trigger is active.
-- To promote a user to admin: UPDATE public.profiles SET role = 'admin'
--   WHERE id = '<paste-user-uuid-from-auth-dashboard>';
-- ============================================================================
