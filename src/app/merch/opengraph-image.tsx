import { MERCH_STORE_OPEN } from '@/config/launch';
import { OG_SIZE, ogCard } from '@/lib/og-card';

// The link-preview card for /merch (Open Graph; twitter-image.tsx reuses it). Rendered once at build time.

export const alt = 'INNOVISION 2026 | NIT ROURKELA: the official merch of The Celestial Odyssey';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OpengraphImage() {
  return ogCard({
    kicker: 'INNOVISION 2026 · OFFICIAL',
    title: 'MERCH',
    subtitle: MERCH_STORE_OPEN ? 'T-SHIRT · HOODIE · ZIPPER' : 'DROPPING SOON',
  });
}
