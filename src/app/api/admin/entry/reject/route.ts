import { NextRequest, NextResponse } from 'next/server';
import { verifyRegistrationStaff } from '@/lib/auth-server';
import { getSupabaseAsUser } from '@/lib/supabase';
import { createRateLimiter, isUuid, readJsonObject } from '@/lib/security';
import { parseRejectReason, parseScannedValue } from '@/lib/entry-pass';
import { badRequest, entryAuthFailure, entryRateLimited, entryRpcFailure } from '@/lib/entry-route';

export const runtime = 'nodejs';

const rejectLimiter = createRateLimiter({ limit: 60, windowMs: 60 * 1000 });

/**
 * POST /api/admin/entry/reject  { token | registration, reason: 'id_mismatch' | 'no_id' | 'other', note? }
 * Registration team / admin: the scanner's "Reject". Changes nothing on the pass (it stays usable so the case can be
 * resolved later); only logs the attempt with who, when and why.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyRegistrationStaff(req);
    if ('error' in auth) {
      return entryAuthFailure(auth);
    }
    const limited = entryRateLimited(rejectLimiter, auth.user.id);
    if (limited) return limited;
    const db = getSupabaseAsUser(auth.token);

    const parsed = await readJsonObject(req);
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    const { token: rawToken, registration } = parsed.value;

    const reason = parseRejectReason(parsed.value.reason, parsed.value.note);
    if (!reason.ok) return badRequest(reason.error);
    const token = rawToken === undefined ? null : parseScannedValue(rawToken);
    if ((token === null) === (registration === undefined)) return badRequest('Send either a scanned token or a registration.');
    if (registration !== undefined && !isUuid(registration)) return badRequest('Invalid registration.');

    const { data, error } = await db.rpc('reject_entry_attempt', {
      p_token: token,
      p_registration: token ? null : registration,
      p_reason: reason.reason,
      p_note: reason.note,
    });
    if (error) return entryRpcFailure(error, '/api/admin/entry/reject');
    return NextResponse.json({ success: true, result: data });
  } catch (err: unknown) {
    console.error('/api/admin/entry/reject error:', err);
    return NextResponse.json({ error: 'Could not log the rejection.' }, { status: 500 });
  }
}
