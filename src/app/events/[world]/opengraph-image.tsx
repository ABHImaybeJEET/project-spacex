import { notFound } from 'next/navigation';
import { WORLDS } from '@/components/innovision/data';
import { worldBySlug } from '@/lib/events';
import { OG_SIZE, ogCard } from '@/lib/og-card';

// The link-preview card for one world page, /events/<world> (Open Graph; twitter-image.tsx reuses it).

export const alt = 'An event world of INNOVISION 2026 | NIT ROURKELA';
export const size = OG_SIZE;
export const contentType = 'image/png';

// Drawn at build time for the four worlds; any other slug is a 404, as for the page.
export const dynamicParams = false;
export function generateStaticParams() {
  return WORLDS.map((w) => ({ world: w.slug }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ world: string }> }) {
  const w = worldBySlug((await params).world);
  if (!w) notFound();
  return ogCard({ kicker: 'INNOVISION 2026 · NIT ROURKELA', title: w.name, subtitle: w.category.toUpperCase() });
}
