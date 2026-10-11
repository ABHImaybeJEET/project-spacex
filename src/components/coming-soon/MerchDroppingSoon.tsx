import ComingSoon from './ComingSoon';

/** /merch while MERCH_STORE_OPEN is false (src/config/launch.ts). */
export default function MerchDroppingSoon() {
  return (
    <ComingSoon
      eyebrow="OFFICIAL MERCH · INNOVISION 2026"
      title={<>Exclusive merch<br /><em>dropping soon.</em></>}
      lede="Limited-run tees, hoodies and keepsakes made for the crew of the Celestial Odyssey. The store opens shortly, and once a run is gone, it's gone."
      status="IN PRODUCTION"
      art="/assets/astronaut-flag.webp"
      secondary={{ label: 'VIEW THE SCHEDULE', href: '/#/schedule' }}
      notes={['Limited-run drop', 'Pre-order online', 'Collect on campus during the fest']}
    />
  );
}
