import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Official Merch',
    description:
      'Explore official Innovision 2026 hoodies, T-shirts and zippers from NIT Rourkela. View all four artwork colours and order online.',
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
