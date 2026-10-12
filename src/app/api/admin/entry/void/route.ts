import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth-server';
import { getSupabaseAsUser } from '@/lib/supabase';
import { createRateLimiter, isUuid, readJsonObject } from '@/lib/security';
import { parseVoidReason } from '@/lib/entry-pass';
import { badRequest, entryAuthFailure, entryRateLimited, entryRpcFailure } from '@/lib/entry-route';

export const runtime = 'nodejs';

const voidLimiter = createRateLimiter({ limit: 30, windowMs: 60 * 1000 });

/**
 * POST /api/admin/entry/void  { checkinId, reason }
 * Admin only: marks a wrong check-in as voided (never deletes it), so the registration can be checked in again.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdmin(req);
    if ('error' in auth) {
      return entryAuthFailure(auth);
    }
    const limited = entryRateLimited(voidLimiter, auth.user.id);
    if (limited) return limited;
    const db = getSupabaseAsUser(auth.token);

    const parsed = await readJsonObject(req);
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    const { checkinId } = parsed.value;
    if (!isUuid(checkinId)) return badRequest('Invalid checkinId.');
    const reason = parseVoidReason(parsed.value.reason);
    if (!reason) return badRequest('A reason (up to 200 characters) is required.');

    const { data, error } = await db.rpc('void_entry_checkin', { p_checkin_id: checkinId, p_reason: reason });
    if (error) return entryRpcFailure(error, '/api/admin/entry/void');
    return NextResponse.json({ success: true, result: data });
  } catch (err: unknown) {
    console.error('/api/admin/entry/void error:', err);
    return NextResponse.json({ error: 'Could not void the check-in.' }, { status: 500 });
  }
}
