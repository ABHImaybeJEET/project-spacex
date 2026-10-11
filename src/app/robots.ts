import type { MetadataRoute } from 'next';
import { INDEXABLE, SITE_URL } from '@/config/site';

/**
 * /robots.txt. Crawl control only: it hides nothing. Private data stays behind server-side auth and Supabase RLS.
 *
 * /api/ is disallowed except the two public, anonymous endpoints the home page fetches as it renders (events and
 * gallery); blocking those would hide content from Google's renderer. The longer Allow rules win over Disallow /api/.
 * /admin is reserved by the request proxy for staff and has no public page.
 *
 * Preview deployments keep the same rules but list no sitemap: their pages carry `noindex` (root layout), and Google
 * can only see that tag on pages it is allowed to crawl.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/events', '/api/gallery'],
      disallow: ['/api/', '/admin'],
    },
    ...(INDEXABLE ? { sitemap: `${SITE_URL}/sitemap.xml` } : {}),
  };
}
