import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, SITE_TITLE, SOCIAL_PROFILES } from '@/config/site';

/** Title template for every page except the home page, which uses SITE_TITLE as is. */
export const TITLE_TEMPLATE = '%s – INNOVISION 2026 | NIT ROURKELA';

/** The home page's link-preview card, drawn by src/app/opengraph-image.tsx (served at /opengraph-image and /twitter-image). */
export const OG_IMAGE = {
  alt: "INNOVISION 2026 | NIT ROURKELA: The Celestial Odyssey, Eastern India's largest techno-management fest, hosted by NIT Rourkela",
  width: 1200,
  height: 630,
  type: 'image/png',
};

/**
 * Metadata for one public page: title, description, canonical URL, Open Graph and Twitter card.
 * A page's `openGraph` and `twitter` replace the root layout's rather than merging with them, so each page sets all of
 * them here. Its share image is the home page's card, unless `ownImage` says the page's route segment draws its own
 * (opengraph-image.tsx and twitter-image.tsx next to the page, as under src/app/events): file-based images take
 * precedence over these, so then none is set here. (On the home page, too, the file-based image takes precedence.)
 *
 * @param title the page's own title (the template adds the site name), or null for the home page.
 * @param path the page's canonical path, e.g. '/merch'. Query strings and #/ hash routes are never canonical.
 */
export function pageMetadata({ title, description, path, ownImage = false }: { title: string | null; description: string; path: string; ownImage?: boolean }): Metadata {
  const fullTitle = title === null ? SITE_TITLE : TITLE_TEMPLATE.replace('%s', title);
  return {
    title: title === null ? { absolute: SITE_TITLE } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website', siteName: SITE_NAME, locale: 'en_IN', url: path, title: fullTitle, description,
      ...(ownImage ? {} : { images: [{ url: '/opengraph-image', ...OG_IMAGE }] }),
    },
    twitter: {
      card: 'summary_large_image', title: fullTitle, description,
      ...(ownImage ? {} : { images: [{ url: '/twitter-image', ...OG_IMAGE }] }),
    },
  };
}

const HOME = `${SITE_URL}/`;
const WEBSITE_ID = `${HOME}#website`;
const ORGANIZATION_ID = `${HOME}#organization`;

/**
 * Schema.org JSON-LD for the home page: the website and the fest's organising identity under NIT Rourkela.
 * Deliberately no Event entries: the events table has no dates (Event requires startDate) and the line-ups and
 * schedule in data.ts are placeholders. No logo (the only logo file is white on transparent, which search engines show
 * on white).
 */
export function homeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: HOME,
        // Google reads `name` as the site name shown in results; the brand as written, and the names people search
        // for, go in alternateName.
        name: 'Innovision 2026',
        alternateName: [SITE_NAME, 'Innovision', 'Innovision NIT Rourkela', 'Innovision NITR'],
        description: SITE_DESCRIPTION,
        inLanguage: 'en-IN',
        publisher: { '@id': ORGANIZATION_ID },
      },
      {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: 'Innovision, NIT Rourkela',
        alternateName: 'Innovision',
        url: HOME,
        description: "Innovision is Eastern India's largest techno-management fest, hosted by the National Institute of Technology Rourkela, Odisha.",
        sameAs: SOCIAL_PROFILES,
        parentOrganization: {
          '@type': 'CollegeOrUniversity',
          name: 'National Institute of Technology Rourkela',
          alternateName: 'NIT Rourkela',
          url: 'https://www.nitrkl.ac.in/',
          address: { '@type': 'PostalAddress', addressLocality: 'Rourkela', addressRegion: 'Odisha', addressCountry: 'IN' },
        },
      },
    ],
  };
}

/** A BreadcrumbList for the trail a page shows: [name, path] from the home page down to the page itself. */
export function breadcrumbJsonLd(trail: [string, string][]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE_URL}${path}` })),
  };
}

/**
 * JSON-LD for one page under /events: a WebPage (part of the website, about the fest), its breadcrumb trail, and an
 * ItemList of what the page lists, item for item. Items with a path are pages of their own (the worlds on /events);
 * items without one are named in place (the events on a world page, which have no pages of their own).
 */
export function listPageJsonLd({ name, description, path, trail, items }: {
  name: string; description: string; path: string; trail: [string, string][]; items: { name: string; path?: string }[];
}) {
  const url = `${SITE_URL}${path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: 'en-IN',
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': ORGANIZATION_ID },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        ...(items.length ? { mainEntity: { '@id': `${url}#list` } } : {}),
      },
      { '@id': `${url}#breadcrumb`, ...breadcrumbJsonLd(trail) },
      ...(items.length
        ? [{
          '@type': 'ItemList',
          '@id': `${url}#list`,
          numberOfItems: items.length,
          itemListElement: items.map((it, i) => (it.path
            ? { '@type': 'ListItem', position: i + 1, name: it.name, url: `${SITE_URL}${it.path}` }
            : { '@type': 'ListItem', position: i + 1, name: it.name })),
        }]
        : []),
    ],
  };
}

/** Serialises JSON-LD for a <script> tag: `<` is escaped so no string in the data can close the tag early. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
