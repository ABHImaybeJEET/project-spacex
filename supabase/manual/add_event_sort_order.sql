-- ==============================================================================
-- MIGRATION (run once in the Supabase SQL editor): let staff choose the order of events.
--
-- Why: events were always listed newest first. Admins and the IT team can now move events up and down within their
-- category from the admin Events tab, which stores each event's position in public.events.sort_order.
-- This adds the column and numbers the existing events 1, 2, 3... per category, newest first, so the site looks the
-- same until someone reorders. Nothing else changes: no other table, policy, trigger or column is touched.
--
-- Run this BEFORE deploying the code that orders by sort_order, or the events queries fail.
-- Matches supabase/schema.sql (except the one-time numbering). Kept out of supabase/migrations/ on purpose so the
-- Supabase CLI never applies it automatically. Safe to re-run: the numbering only happens while no event has been
-- given a position yet.
-- ==============================================================================

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_events_category_sort ON public.events(category, sort_order);

UPDATE public.events e
SET sort_order = r.rn
FROM (
  SELECT id, row_number() OVER (PARTITION BY category ORDER BY created_at DESC) AS rn
  FROM public.events
) r
WHERE e.id = r.id
  AND NOT EXISTS (SELECT 1 FROM public.events WHERE sort_order <> 0);
