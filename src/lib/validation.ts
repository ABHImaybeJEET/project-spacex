/**
 * Client & Server safe validation utilities for Innovision 2026.
 */

export const PHONE_IN_USE_ERROR_MESSAGE =
  'This phone number is already linked to another account. Please use a different number.';

/** True for a Postgres unique violation (23505) on a phone column, e.g. `profiles_phone_key`. */
export function isDuplicatePhoneError(
  err: { code?: string; message?: string; details?: string | null } | null | undefined
): boolean {
  return !!err && err.code === '23505' && /phone/i.test(`${err.message ?? ''} ${err.details ?? ''}`);
}

/** Gender options for registration (values must match the registrations.gender CHECK in supabase/schema.sql). */
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'others', label: 'Others' },
] as const;

export type Gender = (typeof GENDER_OPTIONS)[number]['value'];

export function isGender(value: unknown): value is Gender {
  return GENDER_OPTIONS.some((g) => g.value === value);
}

/**
 * Referral codes: 6 characters from an alphabet without look-alikes (no 0/O, no 1/I). The database generates them
 * (public.new_referral_code in supabase/schema.sql, section 14) and checks this same pattern.
 */
export const REFERRAL_CODE_PATTERN = /^[A-HJ-NP-Z2-9]{6}$/;

/** What a registrant typed as someone's referral code, upper-cased without spaces or dashes ('' when left empty). */
export function normalizeReferralCode(value: string): string {
  return value.replace(/[\s-]+/g, '').toUpperCase();
}

/**
 * Validates whether a given URL is a legitimate Google Drive or Google Docs link.
 */
export function isValidGoogleDriveUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const trimmed = url.trim();
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();

    const isGoogleDrive =
      host === 'drive.google.com' ||
      host.endsWith('.drive.google.com') ||
      host === 'docs.google.com' ||
      host.endsWith('.docs.google.com');

    return (
      (parsed.protocol === 'https:' || parsed.protocol === 'http:') &&
      isGoogleDrive &&
      parsed.pathname.length > 1
    );
  } catch {
    return false;
  }
}

/**
 * Returns `url` only if it is an absolute http(s) URL, otherwise null. Use before putting stored, user-supplied
 * URLs into `href`/`src` so `javascript:`/`data:` payloads can never execute.
 */
export function safeHttpUrl(url: unknown): string | null {
  if (typeof url !== 'string' || !url) return null;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : null;
  } catch {
    return null;
  }
}

/**
 * Quotes one CSV cell and neutralises spreadsheet formula injection (cells starting with = + - @ tab or CR).
 */
export function csvCell(value: unknown): string {
  let s = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}
