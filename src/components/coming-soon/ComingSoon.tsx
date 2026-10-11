/* eslint-disable @next/next/no-img-element -- decorative artwork, matches the rest of the site */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Logo, Sparkle } from '@/components/innovision/icons';
import SkipIntroOnReturn from './SkipIntroOnReturn';
import styles from './ComingSoon.module.css';

type ComingSoonProps = {
  /** Small gold label above the headline. */
  eyebrow: string;
  title: ReactNode;
  lede: string;
  /** Short status read-out next to the pulsing beacon, e.g. "PRE-LAUNCH". */
  status: string;
  /** Decorative artwork from /public/assets. */
  art: string;
  /** Second call to action, next to BACK TO INNOVISION. */
  secondary: { label: string; href: string };
  /** Extra notes below the actions. */
  notes: string[];
};

/**
 * Shared full-page teaser for flows that are built but not yet live (see src/config/launch.ts).
 * Used by RegistrationsOpeningSoon (/register) and MerchDroppingSoon (/merch).
 */
export default function ComingSoon({ eyebrow, title, lede, status, art, secondary, notes }: ComingSoonProps) {
  return (
    <div className={styles.page}>
      <SkipIntroOnReturn />
      <img decoding="async" src="/assets/starfield.svg" alt="" className={styles.stars} />
      <div aria-hidden="true" className={styles.rings} />

      <header className={styles.top}>
        <Link href="/" className={styles.brand} aria-label="Innovision home">
          <Logo style={{ width: '24px', height: 'auto' }} />
          <span>INNOVISION</span>
        </Link>
        <Link href="/" className={styles.back}>
          <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden="true">
            <path d="M5 1 1 5l4 4M1 5h17" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span>BACK</span>
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <Sparkle width={12} height={12} aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.lede}>{lede}</p>

          <p className={styles.status} role="status">
            <span className={styles.beacon} aria-hidden="true" />
            <span>STATUS · {status}</span>
          </p>

          <div className={styles.actions}>
            <Link href="/" className={`${styles.cta} ${styles.ctaPrimary}`}>BACK TO INNOVISION</Link>
            <Link href={secondary.href} className={`${styles.cta} ${styles.ctaGhost}`}>{secondary.label}</Link>
          </div>

          <ul className={styles.notes}>
            {notes.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </div>

        <div className={styles.art} aria-hidden="true">
          <div className={styles.orbit} />
          <img decoding="async" src={art} alt="" className={styles.artImg} />
        </div>
      </main>

      <footer className={styles.foot}>
        <span>INNOVISION 2026 · NIT ROURKELA</span>
        <span>THE CELESTIAL ODYSSEY</span>
      </footer>
    </div>
  );
}
