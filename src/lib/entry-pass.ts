/**
 * Entry pass (QR) tokens and the input rules of the check-in endpoints.
 *
 * Server only (node:crypto). Kept free of `@/` imports and framework APIs so it can be unit tested with `node --test`;
 * the rules the browser also needs live in ./entry-shared.
 *
 * The QR encodes only an opaque token: 16 bytes from the OS CSPRNG (128 bits), base64url, 22 characters. The
 * database keeps its SHA-256 (what a scan is matched against) and an AES-256-GCM ciphertext so the owner sees the
 * same QR on every device. The key (ENTRY_PASS_ENCRYPTION_KEY) never leaves the server, and the pass id is bound in
 * as associated data, so a ciphertext copied onto another pass row does not decrypt.
 */

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { DESK_RE, REJECT_REASONS, type RejectReason } from './entry-shared';

export const ENTRY_TOKEN_BYTES = 16;
export const ENTRY_TOKEN_RE = /^[A-Za-z0-9_-]{22}$/;

export function mintEntryToken(): { token: string; hash: string } {
  const token = randomBytes(ENTRY_TOKEN_BYTES).toString('base64url');
  return { token, hash: hashEntryToken(token) };
}

/** Hex SHA-256, exactly what supabase/schema.sql computes: encode(sha256(convert_to(token, 'UTF8')), 'hex'). */
export function hashEntryToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

/** The 32-byte key from ENTRY_PASS_ENCRYPTION_KEY (base64 or base64url), or null when it is missing or malformed. */
export function entryPassKey(raw: string | undefined = process.env.ENTRY_PASS_ENCRYPTION_KEY): Buffer | null {
  if (!raw) return null;
  const key = Buffer.from(raw.trim(), 'base64'); // Node's base64 decoder also accepts the base64url alphabet
  return key.length === 32 ? key : null;
}

const CIPHER_PREFIX = 'v1';

/** `v1.<iv>.<ciphertext>.<tag>` (base64url parts). */
export function encryptEntryToken(token: string, passId: string, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(passId, 'utf8'));
  const body = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  return [CIPHER_PREFIX, iv.toString('base64url'), body.toString('base64url'), cipher.getAuthTag().toString('base64url')].join('.');
}

/** The token, or null if the ciphertext is malformed, was made for another pass, or under another key. */
export function decryptEntryToken(ciphertext: string, passId: string, key: Buffer): string | null {
  const parts = typeof ciphertext === 'string' ? ciphertext.split('.') : [];
  if (parts.length !== 4 || parts[0] !== CIPHER_PREFIX) return null;
  try {
    const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(parts[1], 'base64url'));
    decipher.setAAD(Buffer.from(passId, 'utf8'));
    decipher.setAuthTag(Buffer.from(parts[3], 'base64url'));
    const token = Buffer.concat([decipher.update(Buffer.from(parts[2], 'base64url')), decipher.final()]).toString('utf8');
    return ENTRY_TOKEN_RE.test(token) ? token : null;
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------------------------------------------------------------
 * Input rules (the database functions re-check every one of them)
 * ------------------------------------------------------------------------------------------------------------- */

/**
 * Whatever the camera read, as sent to the database (which answers INVALID for anything that isn't a live token, and
 * logs the scan either way). Only the type and size are checked here.
 */
export function parseScannedValue(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  return text.length >= 1 && text.length <= 512 ? text : null;
}

export function parseDesk(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const desk = value.replace(/\s+/g, ' ').trim();
  return DESK_RE.test(desk) ? desk : null;
}

export function parseRejectReason(
  reason: unknown,
  note: unknown
): { ok: true; reason: RejectReason; note: string | null } | { ok: false; error: string } {
  if (!REJECT_REASONS.some((r) => r.value === reason)) return { ok: false, error: 'Choose a reason.' };
  if (note !== undefined && note !== null && typeof note !== 'string') return { ok: false, error: 'Invalid note.' };
  const text = typeof note === 'string' ? note.replace(/\s+/g, ' ').trim() : '';
  if (text.length > 200) return { ok: false, error: 'Keep the note under 200 characters.' };
  if (reason === 'other' && !text) return { ok: false, error: 'Describe the reason.' };
  return { ok: true, reason: reason as RejectReason, note: text || null };
}

/** Free-text reason for voiding a check-in: required, single line, at most 200 characters. */
export function parseVoidReason(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const text = value.replace(/\s+/g, ' ').trim();
  return text.length >= 1 && text.length <= 200 ? text : null;
}

/** Manual lookup: a registration ID (IV26-NNNN) or a roll number, same characters registration accepts. */
export function parseManualQuery(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const q = value.trim();
  return q.length >= 1 && q.length <= 50 && /^[A-Za-z0-9/_ -]+$/.test(q) ? q : null;
}

/** 1-based page number from a query string value; 1 when absent or invalid, capped at 10,000. */
export function parsePage(value: string | null): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? Math.min(n, 10_000) : 1;
}
