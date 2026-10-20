import { MERCH_STORE_OPEN } from '@/config/launch';
import MerchDroppingSoon from '@/components/coming-soon/MerchDroppingSoon';
import MerchPage from '@/components/innovision/MerchPage';
import { pageMetadata } from '@/lib/seo';

// The share card is this segment's own (opengraph-image.tsx, twitter-image.tsx).
export const metadata = pageMetadata(
  MERCH_STORE_OPEN
    ? {
        title: 'Official Merch',
        description:
          'Explore official Innovision 2026 hoodies, T-shirts and zippers from NIT Rourkela. View all four artwork colours and order online.',
        path: '/merch',
        ownImage: true,
      }
    : {
        title: 'Official Merch Dropping Soon',
        description:
          'The official Innovision 2026 merch from NIT Rourkela drops soon: a T-shirt, a zipper and a hoodie in four colours each, booked online and collected on campus during the fest.',
        path: '/merch',
        ownImage: true,
      }
);

/**
 * /merch page route: the merch's only page (the home page's MERCH links and #/merch all lead here).
 * While the store is closed (src/config/launch.ts) it shows the "dropping soon" teaser; once open, the orbit store
 * (MerchPage).
 */
export default function MerchRoute() {
  return MERCH_STORE_OPEN ? <MerchPage /> : <MerchDroppingSoon />;
}
