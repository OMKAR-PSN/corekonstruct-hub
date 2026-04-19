-- ============================================================================
-- CoreKonstruct Hub — contact_messages table
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT        NOT NULL CHECK (char_length(name)       BETWEEN 1 AND 120),
  email      TEXT        NOT NULL CHECK (email LIKE '%@%'),
  message    TEXT        NOT NULL CHECK (char_length(message)    BETWEEN 1 AND 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.contact_messages IS 'Inbound contact form submissions from the landing page.';

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone (including unauthenticated visitors) can INSERT.
DROP POLICY IF EXISTS "contact_messages: public can insert" ON public.contact_messages;
CREATE POLICY "contact_messages: public can insert"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read. Use the Supabase Dashboard or service-role key for this.
DROP POLICY IF EXISTS "contact_messages: admins can select" ON public.contact_messages;
CREATE POLICY "contact_messages: admins can select"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
