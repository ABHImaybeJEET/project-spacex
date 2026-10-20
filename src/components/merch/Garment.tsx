import type { GarmentKind } from '@/config/merch';

/** Seam and print lines: dark on light fabric, light on dark fabric. */
function lineColour(hex: string) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) return 'rgba(20,19,18,.4)';
  const [r, g, b] = m.slice(1).map((x) => parseInt(x, 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.5 ? 'rgba(20,19,18,.4)' : 'rgba(236,232,223,.38)';
}

const BODY: Record<GarmentKind, string> = {
  tee: 'M68 28C80 40 120 40 132 28L166 42L192 80L166 96L154 84L154 200L46 200L46 84L34 96L8 80L34 42Z',
  zipper: 'M76 32C76 6 124 6 124 32L160 44L186 176L162 182L150 102L150 204L50 204L50 102L38 182L14 176L40 44Z',
  hoodie: 'M76 32C76 6 124 6 124 32L160 44L186 176L162 182L150 102L150 204L50 204L50 102L38 182L14 176L40 44Z',
};

const DETAIL: Record<GarmentKind, string> = {
  tee: 'M68 28C82 48 118 48 132 28M12 73L38 89M188 73L162 89M46 192H154',
  zipper: 'M100 40V204M92 44L90 70M64 140L72 172M136 140L128 172M16 166L39 172M184 166L161 172M50 194H150',
  hoodie: 'M92 44L90 74M108 44L110 74M74 134H126L134 160V178H66V160ZM16 166L39 172M184 166L161 172M50 194H150',
};

/**
 * Drawn stand-in for a product photo: the garment's silhouette in the picked colour, until the colourway's photo
 * is set in src/config/merch.ts.
 */
export default function Garment({ kind, colour, label }: { kind: GarmentKind; colour: string; label: string }) {
  const line = lineColour(colour);
  return (
    <svg viewBox="0 0 200 220" role="img" aria-label={label} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <path d={BODY[kind]} fill={colour} stroke="rgba(20,19,18,.5)" strokeWidth="1.5" strokeLinejoin="round" style={{ transition: 'fill .45s cubic-bezier(.25,1,.1,1)' }} />
      {kind !== 'tee' && <path d="M84 32C88 48 112 48 116 32C110 22 90 22 84 32Z" fill="rgba(0,0,0,.24)" />}
      <path d={DETAIL[kind]} fill="none" stroke={line} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {kind === 'zipper' && <rect x="97" y="46" width="6" height="12" rx="1.5" fill={line} />}
      {kind !== 'zipper' && <circle cx="100" cy={kind === 'tee' ? 88 : 100} r="14" fill="none" stroke={line} strokeWidth="1.5" strokeDasharray="3 3" />}
    </svg>
  );
}
