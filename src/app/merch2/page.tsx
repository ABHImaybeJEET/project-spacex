'use client';

import { useCallback, useRef, useState } from 'react';
import Curtain from '@/components/innovision/Curtain';
import MerchOrbitView from '@/components/innovision/MerchOrbitView';
import { useMerchV } from '@/components/innovision/useMerchV';

export default function Merch2Page() {
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
    <>
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
    </>
  );
}
