import type { ReactNode } from 'react';
import EventsChrome from '@/components/events/EventsChrome';
import eventStyles from '@/components/events/EventsPage.module.css';
import { CONTACTS } from '@/components/innovision/data';
import styles from './Legal.module.css';

/**
 * Shared frame for /privacy and /terms: the events-page chrome (wordmark, breadcrumb, footer) around a headline and
 * long-form text. Server-rendered, no client JS.
 */
export default function LegalPage({ title, path, updated, children }: { title: string; path: string; updated: string; children: ReactNode }) {
  return (
    <EventsChrome trail={[['Home', '/'], [title, path]]}>
      <section className={eventStyles.hero}>
        <p className={eventStyles.kicker}>INNOVISION 2026 · NIT ROURKELA</p>
        <h1 className={eventStyles.title}>{title}</h1>
        <p className={styles.updated}>LAST UPDATED {updated.toUpperCase()}</p>
      </section>
      <article className={styles.body}>{children}</article>
    </EventsChrome>
  );
}

/** The footer's "Contact us" people, as a list both pages point to for questions and requests. */
export function LegalContacts() {
  return (
    <ul className={styles.contacts}>
      {CONTACTS.map((c) => (
        <li key={c.phone}>
          <b>{c.name}</b>
          <a href={'tel:+91' + c.phone}>+91 {c.phone.slice(0, 5)} {c.phone.slice(5)}</a>
        </li>
      ))}
    </ul>
  );
}
