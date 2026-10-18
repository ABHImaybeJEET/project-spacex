import { WORLDS, type World } from '@/components/innovision/data';
import { getSupabaseAdmin, isSupabaseConfigured, isSupabaseAdminConfigured, type EventItem } from '@/lib/supabase';

/** Columns anyone may read: no staff user ids or storage file ids. Shared by /api/events and the /events pages. */
export const PUBLIC_EVENT_COLUMNS = 'id, title, description, poster_url, brochure_url, category, format, duration, venue, created_at, updated_at';

export type PublicEvent = Pick<EventItem, 'id' | 'title' | 'description' | 'poster_url' | 'brochure_url' | 'category' | 'format' | 'duration' | 'venue' | 'created_at' | 'updated_at'>;

/**
 * Published events, newest first, for the server-rendered /events pages. Read-only. Never throws: if the database is
 * unreachable or not configured (e.g. a build without Supabase env), it returns null and the pages show their
 * announcement state until the next revalidation succeeds.
 */
export async function fetchPublicEvents(): Promise<PublicEvent[] | null> {
  if (!isSupabaseConfigured() && !isSupabaseAdminConfigured()) {
    return [];
  }
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('events')
      .select(PUBLIC_EVENT_COLUMNS)
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) {
      if (error.message?.includes('does not exist') || error.code === '42P01') return [];
      console.error('Events page query failed:', error);
      return null;
    }
    return (data as PublicEvent[]) || [];
  } catch (err) {
    console.error('Events page query failed:', err);
    return null;
  }
}

/** The world at /events/<slug>, or undefined. */
export const worldBySlug = (slug: string) => WORLDS.find((w) => w.slug === slug);

/**
 * The events a world lists, in the same way as the animated explorer (Innovision.tsx, `cw`): an event belongs to the
 * world whose `categories` include its category, and an event without a category shows in every world.
 */
export function eventsForWorld(world: World, events: PublicEvent[]): PublicEvent[] {
  return events.filter((ev) => !ev.category || world.categories.includes(ev.category.toLowerCase().trim()));
}

/** A smaller rendition of an ImageKit poster for list cards; other URLs are returned unchanged. */
export function posterThumb(url: string, width = 640): string {
  try {
    const u = new URL(url);
    if (u.hostname !== 'ik.imagekit.io' || u.searchParams.has('tr')) return url;
    u.searchParams.set('tr', `w-${width}`);
    return u.toString();
  } catch {
    return url;
  }
}
