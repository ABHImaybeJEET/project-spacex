import { redirect } from 'next/navigation';
import { MERCH_STORE_OPEN } from '@/config/launch';
import MerchDroppingSoon from '@/components/coming-soon/MerchDroppingSoon';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Official Merch Dropping Soon',
  description:
    'The official Innovision 2026 merch collection from NIT Rourkela drops soon: limited-run tees, hoodies and keepsakes, pre-ordered online and collected on campus during the fest.',
  path: '/merch',
});

/**
 * /merch page route.
 * While the store is closed (src/config/launch.ts) it shows the "dropping soon" teaser.
 * Once open, it sends visitors to the store view inside the main experience (#/merch, MerchView.tsx).
 */
export default function MerchPage() {
  if (!MERCH_STORE_OPEN) return <MerchDroppingSoon />;
  redirect('/#/merch');
}
