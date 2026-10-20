import Link from 'next/link';
import EventsChrome from '@/components/events/EventsChrome';
import events from '@/components/events/EventsPage.module.css';
import SkipIntroOnReturn from '@/components/coming-soon/SkipIntroOnReturn';
import { MERCH } from '@/config/merch';
import { jsonLdScript, listPageJsonLd } from '@/lib/seo';
import MerchCard from './MerchCard';
import styles from './Merch.module.css';

export const MERCH_DESCRIPTION =
  'The official Innovision 2026 merch from NIT Rourkela: a T-shirt, a zipper and a hoodie, each in four colours. Book online and collect on campus during the fest.';

const TRAIL: [string, string][] = [['Home', '/'], ['Official Merch', '/merch']];

/** /merch while MERCH_STORE_OPEN is true (src/config/launch.ts): the pieces in src/config/merch.ts, booked through the order form. */
export default function MerchStore() {
  const jsonLd = listPageJsonLd({
    name: 'INNOVISION 2026 Official Merch', description: MERCH_DESCRIPTION, path: '/merch', trail: TRAIL,
    items: MERCH.map((m) => ({ name: m.name })),
  });

  return (
    <EventsChrome trail={TRAIL}>
      <SkipIntroOnReturn />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <section className={events.hero}>
        <p className={events.kicker}>OFFICIAL MERCH · INNOVISION 2026</p>
        <h1 className={events.title}>The Odyssey Store</h1>
        <p className={events.lead}>
          Limited-run gear for the crew: the official T-shirt, zipper and hoodie, each in four colours. Pick a colour, hit
          Book now and fill in the order form. Orders are collected at the merch desk on campus during the fest.
        </p>
        <div className={events.actions}>
          <a href="#collection" className={`${events.cta} ${events.ctaPrimary}`}>SEE THE COLLECTION</a>
          <Link href="/" className={`${events.cta} ${events.ctaGhost}`}>BACK TO INNOVISION</Link>
        </div>
      </section>

      <section id="collection" className={events.section} aria-labelledby="collection-heading" style={{ scrollMarginTop: '24px' }}>
        <div className={events.sectionHead}>
          <h2 id="collection-heading" className={events.h2}>The collection</h2>
          <p className={events.count}>{MERCH.length} PIECES · 4 COLOURS EACH</p>
        </div>
        <ul className={styles.grid}>
          {MERCH.map((m, k) => <li key={m.id}><MerchCard item={m} no={k + 1} /></li>)}
        </ul>
      </section>

      <section className={events.section} aria-labelledby="booking-heading">
        <div className={events.sectionHead}>
          <h2 id="booking-heading" className={events.h2}>How booking works</h2>
        </div>
        <ol className={styles.steps}>
          <li><h3>Pick your piece</h3><p>Choose the T-shirt, zipper or hoodie and the colour you want.</p></li>
          <li><h3>Fill in the form</h3><p>Book now opens the official order form in a new tab. Enter your size and details there.</p></li>
          <li><h3>Collect on campus</h3><p>Pick up your order at the merch desk at NIT Rourkela during the fest.</p></li>
        </ol>
      </section>
    </EventsChrome>
  );
}
