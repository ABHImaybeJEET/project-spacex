-- ==============================================================================
-- MIGRATION (run once in the Supabase SQL editor): registration fee 1200 -> 999 in the database insert trigger.
--
-- Why: the fee is now ₹999. /api/register records REGISTRATION_FEE_INR (src/lib/security.ts) itself; this updates
-- the defense-in-depth trigger public.enforce_registration_insert(), which fixes the amount of any registration an end
-- user inserts directly (they have no INSERT privilege, so it never fires in normal use), to the same value.
--
-- What it does NOT do: it replaces this one function body only. No table, column, policy or existing row changes:
-- registrations already stored at 1200 keep that amount.
--
-- Identical to the function in supabase/schema.sql, so re-running schema.sql has the same effect. Kept out of
-- supabase/migrations/ on purpose so the Supabase CLI never applies it automatically. Safe to re-run.
-- ==============================================================================

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
  NEW.amount := 999;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
