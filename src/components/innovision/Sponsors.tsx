/* eslint-disable @next/next/no-img-element -- logos keep their own proportions inside fixed cards */
import type { V } from './types';

/**
 * Past sponsors: a wall of logo cards, one per brand, in brochure order (PAST_SPONSORS in data.ts). Each card is
 * filled with its logo's own background colour; cards for brands with a known site open it in a new tab.
 */
export default function Sponsors({ v }: { v: V }) {
  return (
    <ul data-reveal="" className="ps-grid" aria-label="Past sponsors">
      {v.pastSponsors.map((s) => {
        const logo = <img decoding="async" loading="lazy" src={s.src} alt={s.name} width={s.width} height={s.height} draggable={false} className="ps-logo" style={{ width: s.w }} />;
        return (
          <li key={s.id} className="ps-card" style={{ background: s.bg }}>
            {s.url
              ? <a href={s.url} target="_blank" rel="noopener noreferrer" title={s.name} className="ps-in">{logo}</a>
              : <span title={s.name} className="ps-in">{logo}</span>}
          </li>
        );
      })}
    </ul>
  );
}
