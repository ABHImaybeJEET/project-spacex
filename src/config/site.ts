/**
 * The site's public identity: one canonical origin and the copy shared by metadata, robots.txt, sitemap.xml,
 * structured data and the Google sign-in return address.
 *
 * Canonical URLs are always built from SITE_URL, never from the request's Host header, so a preview deployment, a
 * per-deployment vercel.app URL or a spoofed Host never becomes the canonical address.
 */

// The current (temporary) production address. When the final domain is confirmed, set NEXT_PUBLIC_SITE_URL in Vercel
// (or change this one line): every canonical URL, og:url, robots.txt, sitemap.xml and JSON-LD URL follows it.
const DEFAULT_SITE_URL = 'https://project-spacex-seven.vercel.app';

/** Origin of NEXT_PUBLIC_SITE_URL (no trailing slash), or the default if it is unset or not an http(s) URL. */
function siteOrigin(value: string | undefined): string {
  try {
    const url = value ? new URL(value) : null;
    if (url && (url.protocol === 'https:' || url.protocol === 'http:')) return url.origin;
  } catch {}
  return DEFAULT_SITE_URL;
}

/**
 * Canonical origin. Set NEXT_PUBLIC_SITE_URL to the custom domain once it is live (and add it under Supabase ->
 * Authentication -> URL Configuration, since Google sign-in returns here too).
 */
export const SITE_URL = siteOrigin(process.env.NEXT_PUBLIC_SITE_URL);

/** The official brand name, exactly as it is written: og:site_name, the app name and the home page title. */
export const SITE_NAME = 'INNOVISION 2026 | NIT ROURKELA';

/** Home page title. Other pages use the "%s – INNOVISION 2026 | NIT ROURKELA" template from the root layout. */
export const SITE_TITLE = SITE_NAME;

export const SITE_DESCRIPTION =
  'Official website of INNOVISION 2026, the techno-management festival of NIT Rourkela, Odisha. Explore the Flagship, Standout, Main, and DTS and Fun Events.';

/**
 * Whether search engines may index this deployment. Only Vercel's production deployment is indexable: preview and
 * development deployments get `noindex` and a robots.txt that disallows everything, so they never compete with the
 * official site. Outside Vercel (VERCEL_ENV unset, e.g. a local `next start`) the build is treated as production.
 * Server-only: VERCEL_ENV is not exposed to the browser.
 */
export const INDEXABLE = (process.env.VERCEL_ENV ?? 'production') === 'production';
