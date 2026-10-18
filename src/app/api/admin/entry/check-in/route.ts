import { NextRequest, NextResponse } from 'next/server';
import { verifyRegistrationStaff } from '@/lib/auth-server';
import { getSupabaseAsUser } from '@/lib/supabase';
import { createRateLimiter, isUuid, readJsonObject } from '@/lib/security';
import { parseDesk, parseScannedValue } from '@/lib/entry-pass';
import { badRequest, entryAuthFailure, entryRateLimited, entryRpcFailure } from '@/lib/entry-route';

export const runtime = 'nodejs';

const checkInLimiter = createRateLimiter({ limit: 60, windowMs: 60 * 1000 });

/**
 * POST /api/admin/entry/check-in  { token | registration, scanId, desk }
 * Registration team / admin: the scanner's "Approve". Checks the registration in, once ever. The database
 * re-validates everything (never trusting the earlier lookup), refuses self check-in, and its unique index makes
 * simultaneous Approves produce exactly one check-in. Retrying with the same scanId answers CHECKED_IN again.
 * `registration` (a registration uuid from a manual lookup) replaces `token` for damaged or missing QRs.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyRegistrationStaff(req);
    if ('error' in auth) {
      return entryAuthFailure(auth);
    }
    const limited = entryRateLimited(checkInLimiter, auth.user.id);
    if (limited) return limited;
    const db = getSupabaseAsUser(auth.token);

    const parsed = await readJsonObject(req);
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    const { token: rawToken, registration, scanId, desk: rawDesk } = parsed.value;

    if (!isUuid(scanId)) return badRequest('Invalid scanId.');
    const desk = parseDesk(rawDesk);
    if (!desk) return badRequest('Choose a desk name (letters, digits, up to 40 characters).');
    const token = rawToken === undefined ? null : parseScannedValue(rawToken);
    if ((token === null) === (registration === undefined)) return badRequest('Send either a scanned token or a registration.');
    if (registration !== undefined && !isUuid(registration)) return badRequest('Invalid registration.');

    const { data, error } = token
      ? await db.rpc('check_in_entry_pass', { p_token: token, p_scan_id: scanId, p_desk: desk })
      : await db.rpc('check_in_entry_registration', { p_registration: registration, p_scan_id: scanId, p_desk: desk });
    if (error) return entryRpcFailure(error, '/api/admin/entry/check-in');
    return NextResponse.json({ success: true, result: data });
  } catch (err: unknown) {
    console.error('/api/admin/entry/check-in error:', err);
    return NextResponse.json({ error: 'Check-in failed.' }, { status: 500 });
  }
}
