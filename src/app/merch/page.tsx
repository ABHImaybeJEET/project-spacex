import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { MERCH_STORE_OPEN } from '@/config/launch';
import MerchDroppingSoon from '@/components/coming-soon/MerchDroppingSoon';

export const metadata: Metadata = {
  title: 'Exclusive Merch Dropping Soon · INNOVISION 2026',
  description: 'The official Innovision 2026 merch collection drops soon.',
};

/**
 * /merch page route.
 * While the store is closed (src/config/launch.ts) it shows the "dropping soon" teaser.
 * Once open, it sends visitors to the store view inside the main experience (#/merch, MerchView.tsx).
 */
export default function MerchPage() {
  if (!MERCH_STORE_OPEN) return <MerchDroppingSoon />;
  redirect('/#/merch');
}
