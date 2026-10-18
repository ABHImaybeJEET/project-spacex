import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Official Merch',
    description:
      'The official Innovision 2026 merch collection from NIT Rourkela: limited-run tees, hoodies and keepsakes, pre-ordered online and collected on campus during the fest.',
    path: '/merch2',
  }),
  robots: { index: false, follow: false },
};

export default function Merch2Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, overflowX: 'hidden', overflowY: 'auto' }}>
      {children}
    </div>
  );
}
