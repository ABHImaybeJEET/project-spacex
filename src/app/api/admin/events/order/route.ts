import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyEventStaff } from '@/lib/auth-server';
import { isUuid, readJsonObject } from '@/lib/security';
import { ALLOWED_EVENT_CATEGORIES, type AllowedEventCategory } from '@/lib/events';

export const runtime = 'nodejs';

/**
 * POST { category, ids }: set the order of every event in one category (Authorized IT Team & Admin).
 * `ids` must list each event of that category exactly once, top first; it becomes sort_order 1, 2, 3...
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyEventStaff(req);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const parsed = await readJsonObject(req);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }
    const { category: rawCategory, ids } = parsed.value;
    const category = typeof rawCategory === 'string' ? rawCategory.trim().toLowerCase() : '';
    if (!ALLOWED_EVENT_CATEGORIES.includes(category as AllowedEventCategory)) {
      return NextResponse.json({ error: 'Invalid event category.' }, { status: 400 });
    }
    if (!Array.isArray(ids) || ids.length === 0 || ids.length > 500 || !ids.every(isUuid)) {
      return NextResponse.json({ error: 'Invalid event order.' }, { status: 400 });
    }

    const { supabase, user } = auth;
    const { data: current, error: fetchErr } = await supabase
      .from('events')
      .select('id')
      .eq('category', category);
    if (fetchErr) {
      console.error('/api/admin/events/order database error:', fetchErr);
      return NextResponse.json({ error: 'Database operation failed.' }, { status: 500 });
    }

    // Only a complete order of the category as it is now: a stale list (an event added, moved or deleted since the
    // page loaded) would otherwise leave events with clashing positions.
    const known = new Set((current || []).map((ev) => ev.id as string));
    if (new Set(ids).size !== ids.length || ids.length !== known.size || !ids.every((id) => known.has(id))) {
      return NextResponse.json(
        { error: 'The events in this category changed. Refresh and try again.' },
        { status: 409 }
      );
    }

    const results = await Promise.all(
      ids.map((id, i) =>
        supabase.from('events').update({ sort_order: i + 1, updated_by: user.id }).eq('id', id)
      )
    );
    const updateErr = results.find((r) => r.error)?.error;
    if (updateErr) {
      console.error('/api/admin/events/order database error:', updateErr);
      return NextResponse.json({ error: 'Database operation failed.' }, { status: 500 });
    }

    revalidatePath('/events');
    revalidatePath('/events/[world]', 'page');

    return NextResponse.json({ success: true, message: 'Event order saved.' });
  } catch (err: unknown) {
    console.error('/api/admin/events/order error:', err);
    return NextResponse.json({ error: 'Failed to save event order' }, { status: 500 });
  }
}
