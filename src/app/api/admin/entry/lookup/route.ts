import { NextRequest, NextResponse } from 'next/server';
import { verifyRegistrationStaff } from '@/lib/auth-server';
import { getSupabaseAsUser } from '@/lib/supabase';
import { createRateLimiter, readJsonObject } from '@/lib/security';
import { parseScannedValue } from '@/lib/entry-pass';
import { badRequest, entryAuthFailure, entryRateLimited, entryRpcFailure } from '@/lib/entry-route';

export const runtime = 'nodejs';

// Per user: a volunteer scanning steadily makes well under one lookup a second.
const lookupLimiter = createRateLimiter({ limit: 120, windowMs: 60 * 1000 });

/**
 * POST /api/admin/entry/lookup  { token }
 * Registration team / admin. What a scanned QR belongs to: VALID (details to compare with the college ID),
 * ALREADY_CHECKED_IN, or INVALID with no personal data. Changes nothing except the audit log.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyRegistrationStaff(req);
    if ('error' in auth) {
      return entryAuthFailure(auth);
    }
    const limited = entryRateLimited(lookupLimiter, auth.user.id);
    if (limited) return limited;
    const db = getSupabaseAsUser(auth.token);

    const parsed = await readJsonObject(req);
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    const token = parseScannedValue(parsed.value.token);
    if (!token) return badRequest('Missing scanned code.');

    const { data, error } = await db.rpc('lookup_entry_pass', { p_token: token });
    if (error) return entryRpcFailure(error, '/api/admin/entry/lookup');
    return NextResponse.json({ success: true, result: data });
  } catch (err: unknown) {
    console.error('/api/admin/entry/lookup error:', err);
    return NextResponse.json({ error: 'Lookup failed.' }, { status: 500 });
  }
}
