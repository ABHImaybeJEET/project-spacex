import type { MetadataRoute } from 'next';
import { REGISTRATIONS_OPEN } from '@/config/launch';
import { SITE_URL } from '@/config/site';
import { WORLDS } from '@/components/innovision/data';

/**
 * /sitemap.xml: the canonical, public, indexable pages only.
 *
 * /events and one page per event world (/events/<slug>) are the crawlable counterparts of the animated explorer,
 * whose #/ hash routes on the home page search engines treat as the home page itself; the gallery and schedule views
 * have no pages of their own. /merch is always listed: it is the merch's only page, the "dropping soon" teaser or the
 * store itself depending on its launch switch (src/config/launch.ts). /register is listed only while it renders its
 * public teaser page; once registrations open it redirects to sign-in instead and is left out. /privacy and /terms are
 * always listed. Staff pages (/admin) and the API never appear.
 *
 * No lastModified: nothing in the project records when a page's content last changed, and a build date is not that.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/events',
    ...WORLDS.map((w) => `/events/${w.slug}`),
    ...(REGISTRATIONS_OPEN ? [] : ['/register']),
    '/merch',
    '/privacy',
    '/terms',
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
