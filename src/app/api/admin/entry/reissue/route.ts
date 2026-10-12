import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth-server';
import { getSupabaseAsUser } from '@/lib/supabase';
import { createRateLimiter, isUuid, readJsonObject } from '@/lib/security';
import { badRequest, entryAuthFailure, entryRateLimited, entryRpcFailure } from '@/lib/entry-route';

export const runtime = 'nodejs';

const reissueLimiter = createRateLimiter({ limit: 30, windowMs: 60 * 1000 });

/**
 * POST /api/admin/entry/reissue  { registration }
 * Admin only: a new QR for a lost or leaked pass. The old QR stops working immediately; the owner's profile shows the
 * new one. Refused (409) once the registration is checked in.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdmin(req);
    if ('error' in auth) {
      return entryAuthFailure(auth);
    }
    const limited = entryRateLimited(reissueLimiter, auth.user.id);
    if (limited) return limited;
    const db = getSupabaseAsUser(auth.token);

    const parsed = await readJsonObject(req);
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    const { registration } = parsed.value;
    if (!isUuid(registration)) return badRequest('Invalid registration.');

    const { data, error } = await db.rpc('reissue_entry_pass', { p_registration: registration });
    if (error) return entryRpcFailure(error, '/api/admin/entry/reissue');
    return NextResponse.json({ success: true, result: data });
  } catch (err: unknown) {
    console.error('/api/admin/entry/reissue error:', err);
    return NextResponse.json({ error: 'Could not reissue the pass.' }, { status: 500 });
  }
}
