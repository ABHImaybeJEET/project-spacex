-- ==============================================================================
-- BACKFILL (run in the Supabase SQL editor): entry passes for registrations confirmed before section 13 of
-- supabase/schema.sql (entry passes and check-in) was applied.
--
-- Order:
--   1. Apply supabase/schema.sql (it creates the entry tables, functions and the approval trigger). From then on every
--      newly confirmed registration gets its pass automatically.
--   2. Run this file. It issues one active pass per confirmed registration that has none. It is idempotent: running it
--      again issues 0, because a partial unique index allows only one active pass per registration.
--   3. Run the checks below. Both "missing" counts must be 0.
-- Do it on the TEST project first, then on production.
--
-- Passes are created without a QR token: each participant's token is minted the first time they open their profile
-- (POST /api/pass), so nothing secret is generated or stored here. Touches no other table.
-- ==============================================================================

SELECT public.backfill_entry_passes() AS passes_issued;

-- Checks
SELECT
  (SELECT count(*) FROM public.registrations WHERE status = 'confirmed') AS confirmed_registrations,
  (SELECT count(*) FROM public.entry_passes WHERE status = 'active') AS active_passes,
  (SELECT count(*) FROM public.registrations r
    WHERE r.status = 'confirmed'
      AND NOT EXISTS (SELECT 1 FROM public.entry_passes p WHERE p.registration_id = r.id AND p.status = 'active')
  ) AS confirmed_missing_a_pass,
  (SELECT count(*) FROM public.entry_passes p JOIN public.registrations r ON r.id = p.registration_id
    WHERE p.status = 'active' AND r.status <> 'confirmed'
  ) AS active_pass_on_unconfirmed;
