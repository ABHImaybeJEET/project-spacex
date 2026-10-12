import type { ReactNode } from 'react';
import Link from 'next/link';
import SkipIntroOnReturn from './SkipIntroOnReturn';
import styles from './ComingSoon.module.css';

type ComingSoonProps = {
  title: ReactNode;
  /** Optional second call to action, next to BACK TO INNOVISION. */
  secondary?: { label: string; href: string };
};

/**
 * Shared full-page teaser for flows that are built but not yet live (see src/config/launch.ts): a centred
 * headline, a BACK TO INNOVISION button and an optional second one. Used by RegistrationsOpeningSoon (/register) and MerchDroppingSoon (/merch).
 */
export default function ComingSoon({ title, secondary }: ComingSoonProps) {
  return (
    <main className={styles.page}>
      <SkipIntroOnReturn />
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>
        <Link href="/" className={`${styles.cta} ${styles.ctaPrimary}`}>BACK TO INNOVISION</Link>
        {secondary && <Link href={secondary.href} className={`${styles.cta} ${styles.ctaGhost}`}>{secondary.label}</Link>}
      </div>
    </main>
  );
}
