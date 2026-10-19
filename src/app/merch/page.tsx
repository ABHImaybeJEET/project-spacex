import { MERCH_STORE_OPEN } from '@/config/launch';
import MerchDroppingSoon from '@/components/coming-soon/MerchDroppingSoon';
import MerchStore, { MERCH_DESCRIPTION } from '@/components/merch/MerchStore';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  MERCH_STORE_OPEN
    ? { title: 'Official Merch', description: MERCH_DESCRIPTION, path: '/merch' }
    : {
        title: 'Official Merch Dropping Soon',
        description:
          'The official Innovision 2026 merch from NIT Rourkela drops soon: a T-shirt, a zipper and a hoodie in four colours each, booked online and collected on campus during the fest.',
        path: '/merch',
      }
);

/**
 * /merch page route: the merch's only page (the home page's MERCH links and #/merch all lead here).
 * While the store is closed (src/config/launch.ts) it shows the "dropping soon" teaser; once open, the official
 * merch with a BOOK NOW link to the order form for each piece (src/config/merch.ts).
 */
export default function MerchPage() {
  return MERCH_STORE_OPEN ? <MerchStore /> : <MerchDroppingSoon />;
}
