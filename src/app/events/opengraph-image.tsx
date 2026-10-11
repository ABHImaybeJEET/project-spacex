import { OG_SIZE, ogCard } from '@/lib/og-card';

// The link-preview card for /events (Open Graph; twitter-image.tsx reuses it). Rendered once at build time.

export const alt = 'INNOVISION 2026 | NIT ROURKELA: the events of The Celestial Odyssey';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OpengraphImage() {
  return ogCard({ kicker: 'INNOVISION · NIT ROURKELA', title: 'EVENTS', subtitle: '2026 · THE CELESTIAL ODYSSEY' });
}
