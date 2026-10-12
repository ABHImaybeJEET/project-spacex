import { NextResponse } from 'next/server';
import type { StaffAuthFailure } from '@/lib/auth-server';
import type { RateLimiter } from '@/lib/security';

/**
 * Shared plumbing for the /api/admin/entry/* route handlers.
 *
 * Each handler first awaits verifyRegistrationStaff / verifyAdmin (fail fast, same convention as every admin route),
 * then calls the database as the caller (getSupabaseAsUser): the entry functions authorize auth.uid() themselves.
 */

export function entryAuthFailure(auth: StaffAuthFailure): NextResponse {
  // 401 is what the scanner turns into "Session expired, log in again".
  const error = auth.status === 401 ? 'Your session has expired. Please log in again.' : auth.error;
  return NextResponse.json({ error }, { status: auth.status });
}

/** Per user, not per IP: several scanner phones share one campus address (see src/proxy.ts). */
export function entryRateLimited(limiter: RateLimiter, userId: string): NextResponse | null {
  if (limiter.hit(userId)) return null;
  return NextResponse.json(
    { error: 'Too many requests. Wait a moment and try again.' },
    { status: 429, headers: { 'Retry-After': String(limiter.retryAfterSeconds(userId)) } }
  );
}

/** Maps an error raised by an entry database function to an HTTP response. Messages are written for staff. */
export function entryRpcFailure(
  error: { code?: string; message?: string } | null,
  route: string
): NextResponse {
  const code = error?.code ?? '';
  const message = error?.message || 'Request failed.';
  if (code === '42501') return NextResponse.json({ error: message }, { status: 403 });
  if (code === '22023' || code === '22P02') return NextResponse.json({ error: message }, { status: 400 });
  if (code === 'P0002') return NextResponse.json({ error: message }, { status: 404 });
  if (code === '55000') return NextResponse.json({ error: message }, { status: 409 });
  if (code === '40001') return NextResponse.json({ error: 'Busy, please retry.' }, { status: 503 });
  console.error(`${route} database error:`, error);
  return NextResponse.json({ error: 'Database operation failed.' }, { status: 500 });
}

export const badRequest = (error: string) => NextResponse.json({ error }, { status: 400 });
