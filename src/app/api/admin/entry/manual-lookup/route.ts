import { NextRequest, NextResponse } from 'next/server';
import { verifyRegistrationStaff } from '@/lib/auth-server';
import { getSupabaseAsUser } from '@/lib/supabase';
import { createRateLimiter, readJsonObject } from '@/lib/security';
import { parseManualQuery } from '@/lib/entry-pass';
import { badRequest, entryAuthFailure, entryRateLimited, entryRpcFailure } from '@/lib/entry-route';

export const runtime = 'nodejs';

const manualLookupLimiter = createRateLimiter({ limit: 60, windowMs: 60 * 1000 });

/**
 * POST /api/admin/entry/manual-lookup  { query }
 * Registration team / admin, for a damaged or missing QR: exact registration ID (IV26-NNNN) or roll number.
 * Same answer shape as a scan (plus AMBIGUOUS when a roll number matches several registrations). Logged.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyRegistrationStaff(req);
    if ('error' in auth) {
      return entryAuthFailure(auth);
    }
    const limited = entryRateLimited(manualLookupLimiter, auth.user.id);
    if (limited) return limited;
    const db = getSupabaseAsUser(auth.token);

    const parsed = await readJsonObject(req);
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    const query = parseManualQuery(parsed.value.query);
    if (!query) return badRequest('Enter a registration ID (IV26-1234) or a roll number.');

    const { data, error } = await db.rpc('lookup_entry_manual', { p_query: query });
    if (error) return entryRpcFailure(error, '/api/admin/entry/manual-lookup');
    return NextResponse.json({ success: true, result: data });
  } catch (err: unknown) {
    console.error('/api/admin/entry/manual-lookup error:', err);
    return NextResponse.json({ error: 'Lookup failed.' }, { status: 500 });
  }
}
