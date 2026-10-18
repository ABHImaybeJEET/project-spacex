-- ==============================================================================
-- MIGRATION (run once in the Supabase SQL editor): let ITER - SOA students register.
--
-- Why: ITER - SOA students are now allowed at Innovision 2026. Two database rules still refused them:
--   1. the registrations_no_iter_soa CHECK on public.registrations.college, which also binds /api/register's
--      service-role inserts, so it must go before the app stops refusing them;
--   2. the email-domain check (@soa. / @iter.) in public.enforce_registration_insert().
-- This drops the constraint and replaces the function body without that check. Nothing else changes: no other
-- table, column, policy, trigger or existing row is touched.
--
-- Identical to supabase/schema.sql, so re-running schema.sql has the same effect. Kept out of supabase/migrations/
-- on purpose so the Supabase CLI never applies it automatically. Safe to re-run.
-- ==============================================================================

ALTER TABLE IF EXISTS public.registrations DROP CONSTRAINT IF EXISTS registrations_no_iter_soa;

CREATE OR REPLACE FUNCTION public.enforce_registration_insert() RETURNS TRIGGER AS $$
DECLARE
  v_email TEXT;
  v_confirmed TIMESTAMPTZ;
BEGIN
  IF COALESCE(auth.role(), '') <> 'authenticated' THEN
    RETURN NEW;
  END IF;

  SELECT lower(email), email_confirmed_at INTO v_email, v_confirmed FROM auth.users WHERE id = auth.uid();

  NEW.user_id := auth.uid();
  NEW.email := COALESCE(v_email, '');
  NEW.registration_id := 'IV26-' || (1000 + (('x' || substr(md5(gen_random_uuid()::text), 1, 7))::bit(28)::int % 9000))::text;
  NEW.reviewed_by := NULL;
  NEW.reviewed_at := NULL;
  NEW.student_type := CASE WHEN v_email LIKE '%@nitrkl.ac.in' AND v_confirmed IS NOT NULL THEN 'internal' ELSE 'external' END;
  NEW.status := 'pending';
  NEW.amount := 1200;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
