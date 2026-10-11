import type { MetadataRoute } from 'next';
import { MERCH_STORE_OPEN, REGISTRATIONS_OPEN } from '@/config/launch';
import { SITE_URL } from '@/config/site';
import { WORLDS } from '@/components/innovision/data';

/**
 * /sitemap.xml: the canonical, public, indexable pages only.
 *
 * /events and one page per event world (/events/<slug>) are the crawlable counterparts of the animated explorer,
 * whose #/ hash routes on the home page search engines treat as the home page itself; the gallery and schedule views
 * have no pages of their own. /register and /merch are listed only while they render their public teaser pages; once
 * their launch switch (src/config/launch.ts) is on, they redirect instead (to sign-in, or to the #/merch store view)
 * and are left out. Staff pages (/admin) and the API never appear.
 *
 * No lastModified: nothing in the project records when a page's content last changed, and a build date is not that.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/events',
    ...WORLDS.map((w) => `/events/${w.slug}`),
    ...(REGISTRATIONS_OPEN ? [] : ['/register']),
    ...(MERCH_STORE_OPEN ? [] : ['/merch']),
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
