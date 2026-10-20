"use client";
/* eslint-disable @next/next/no-img-element -- product photos come from public/ or ImageKit at their own sizes */
import { useState } from 'react';
import { bookingUrl, type MerchItem } from '@/config/merch';
import Garment from './Garment';
import styles from './Merch.module.css';

/** One piece of merch: its picture in the picked colour, the colour swatches, and BOOK NOW for the order form. */
export default function MerchCard({ item, no }: { item: MerchItem; no: number }) {
  const [pick, setPick] = useState(0);
  const colour = item.colours[pick];
  const href = bookingUrl(item, colour);
  const label = `${item.name} in ${colour.name}`;

  return (
    <article className={styles.card} aria-labelledby={`merch-${item.id}`}>
      <div className={styles.figure}>
        <span className={styles.no}>{String(no).padStart(2, '0')}</span>
        {colour.image
          ? <img className={styles.photo} src={colour.image} alt={label} loading="lazy" decoding="async" />
          : <div className={styles.drawing}><Garment kind={item.kind} colour={colour.swatch} label={label} /></div>}
      </div>

      <div className={styles.body}>
        <div className={styles.head}>
          <h3 id={`merch-${item.id}`} className={styles.name}>{item.name}</h3>
          {item.price !== undefined && <span className={styles.price}>₹{item.price.toLocaleString('en-IN')}</span>}
        </div>
        <p className={styles.desc}>{item.desc}</p>

        <div className={styles.row}>
          <span className={styles.label} id={`merch-${item.id}-colour`}>COLOUR</span>
          <div className={styles.swatches} role="group" aria-labelledby={`merch-${item.id}-colour`}>
            {item.colours.map((c, k) => (
              <button
                key={c.name}
                type="button"
                aria-pressed={k === pick}
                aria-label={c.name}
                title={c.name}
                className={styles.swatch}
                style={{ background: c.swatch }}
                onClick={() => setPick(k)}
              />
            ))}
          </div>
          <span className={styles.colourName} aria-live="polite">{colour.name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>SIZES</span>
          <span className={styles.sizes}>{item.sizes.join(' · ')}</span>
        </div>

        {href ? (
          <a className={styles.book} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Book now: ${label} (opens the order form in a new tab)`}>
            BOOK NOW <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span className={`${styles.book} ${styles.bookOff}`} aria-disabled="true">BOOKING OPENS SOON</span>
        )}
      </div>
    </article>
  );
}
