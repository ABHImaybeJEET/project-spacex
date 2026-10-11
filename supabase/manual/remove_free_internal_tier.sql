-- ==============================================================================
-- PROPOSED MIGRATION (for review, NOT applied): remove the free @nitrkl.ac.in registration tier from the database.
--
-- Why: public.enforce_registration_insert() still auto-confirms registrations from verified @nitrkl.ac.in accounts
-- at amount 0 when a row is inserted by an end user. End users already have no INSERT privilege on registrations
-- (REVOKE in supabase/schema.sql, section 11), so this trigger is defense in depth only, but it must not keep a free
-- path alive. This replaces the function body only: every directly inserted registration becomes 'pending' at 499,
-- and student_type stays a reporting label ('internal' = verified @nitrkl.ac.in), matching /api/register.
--
-- What it does NOT do: it touches no table, column, constraint, index, policy or existing row. Registrations already
-- stored as internal / amount 0 / confirmed are left exactly as they are (admin reports keep showing them).
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

  -- Same ITER - SOA email rule as /api/register (isIterSoaEmail); the college CHECK only covers the typed name.
  IF v_email LIKE '%@soa.%' OR v_email LIKE '%@iter.%' THEN
    RAISE EXCEPTION 'Registration is not allowed for students from ITER - SOA.' USING ERRCODE = '42501';
  END IF;

  NEW.user_id := auth.uid();
  NEW.email := COALESCE(v_email, '');
  NEW.registration_id := 'IV26-' || (1000 + (('x' || substr(md5(gen_random_uuid()::text), 1, 7))::bit(28)::int % 9000))::text;
  NEW.reviewed_by := NULL;
  NEW.reviewed_at := NULL;
  NEW.student_type := CASE WHEN v_email LIKE '%@nitrkl.ac.in' AND v_confirmed IS NOT NULL THEN 'internal' ELSE 'external' END;
  NEW.status := 'pending';
  NEW.amount := 499;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
