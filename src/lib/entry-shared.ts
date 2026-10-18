/**
 * Entry check-in rules shared by the scanner (browser) and the API routes (server). No imports: safe in both.
 * supabase/schema.sql enforces the same rules again.
 */

/** Desk / gate name, as entry_check_in() accepts it. */
export const DESK_RE = /^[A-Za-z0-9][A-Za-z0-9 ._#/()-]{0,39}$/;

/** Preset reasons for the scanner's "Reject" (values match reject_entry_attempt()). */
export const REJECT_REASONS = [
  { value: 'id_mismatch', label: 'ID mismatch' },
  { value: 'no_id', label: 'No ID' },
  { value: 'other', label: 'Other' },
] as const;
export type RejectReason = (typeof REJECT_REASONS)[number]['value'];

export const REJECT_REASON_LABELS: Record<string, string> = Object.fromEntries(
  REJECT_REASONS.map((r) => [r.value, r.label])
);
