'use client';

import { useCallback, useRef, useState } from 'react';
import SkipIntroOnReturn from '@/components/coming-soon/SkipIntroOnReturn';
import Curtain from '@/components/innovision/Curtain';
import MerchOrbitView from '@/components/innovision/MerchOrbitView';
import { useMerchV } from '@/components/innovision/useMerchV';

/** The /merch page (src/app/merch/page.tsx) while the store is open: the orbit store in its own scroller. */
export default function MerchPage() {
  const v = useMerchV();
  const [revealed, setRevealed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleReveal = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.style.visibility = 'visible';
    }
    setRevealed(true);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, overflowX: 'hidden', overflowY: 'auto' }}>
      {/* BACK (or the logo) returns to the home page without its loader, as from the site's other pages. */}
      <SkipIntroOnReturn />
      <Curtain
        kicker="NOW ENTERING"
        label="The Merch"
        autoPlay
        holdSeconds={2}
        onReveal={handleReveal}
      />
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 1,
          visibility: revealed ? 'visible' : 'hidden',
        }}
      >
        <MerchOrbitView v={v} standalone />
      </div>
    </div>
  );
}
