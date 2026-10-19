import Link from 'next/link';
import type { Metadata } from 'next';
import ErrorScreen, { GOLD, GhostFill, ghostAction, primaryAction } from '@/components/innovision/ErrorScreen';
import { WORLDS } from '@/components/innovision/data';
import { MERCH_PATH, REGISTRATIONS_SOON_PATH } from '@/config/launch';

// Overrides the layout's site-wide "index, follow", which would otherwise contradict the noindex Next adds to a 404.
export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

/** Places that always exist, offered as the way back: the four event worlds, merch and registration. */
const DESTINATIONS = [
  ...WORLDS.map((w) => ({ href: `/events/${w.slug}`, label: w.name, dot: w.accentL })),
  { href: MERCH_PATH, label: 'Merch', dot: GOLD },
  { href: REGISTRATIONS_SOON_PATH, label: 'Register', dot: GOLD },
];

/**
 * 404 for the whole site: any URL no route matches, and every notFound() (e.g. /events/<unknown world>, which
 * dynamicParams = false already turns away). Rendered inside the root layout, so fonts and globals.css apply.
 */
export default function NotFound() {
  return (
    <ErrorScreen
      code="404"
      eyebrow="ERROR 404 · OFF THE STAR MAP"
      title="This page drifted out of orbit."
      actions={
        <>
          <Link href="/" style={primaryAction}>BACK TO HOME</Link>
          <Link href="/events" style={ghostAction}>
            <GhostFill />
            EXPLORE EVENTS
          </Link>
        </>
      }
      after={
        <nav aria-label="Popular pages" style={{ marginTop: '40px', paddingTop: '28px', borderTop: '1px solid rgba(236,232,223,.14)' }}>
          <p style={{ margin: '0 0 16px', fontSize: '12px', fontWeight: 700, letterSpacing: '.24em', color: 'rgba(236,232,223,.6)' }}>OR JUMP STRAIGHT TO</p>
          <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', margin: 0, padding: 0, listStyle: 'none' }}>
            {DESTINATIONS.map((d) => (
              <li key={d.href}>
                <Link href={d.href} className="nf-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', minHeight: '44px', padding: '0 16px', border: '1px solid rgba(236,232,223,.22)', background: 'rgba(236,232,223,.04)', color: '#ECE8DF', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                  <span aria-hidden="true" style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.dot }}></span>
                  {d.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      }
    >
      The link may be old or mistyped, or the page has moved. Nothing is lost: head back to base, or pick a destination
      below.
    </ErrorScreen>
  );
}
