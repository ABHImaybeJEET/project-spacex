import ComingSoon from './ComingSoon';

/** /merch while MERCH_STORE_OPEN is false (src/config/launch.ts). */
export default function MerchDroppingSoon() {
  return (
    <ComingSoon title={<>Exclusive merch<br /><em>dropping soon.</em></>} />
  );
}
