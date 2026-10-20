/* eslint-disable @next/next/no-img-element -- decorative star layer */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo, Sparkle } from './icons';
import merchImages from './merch-images.json';

const MERCH_ORDER_URL = 'https://forms.gle/E3HUhcp9nLoDCJGR9';
const PRODUCT_IMAGES = [
  ['tshirt-red', 'tshirt-blue', 'tshirt-crimson', 'tshirt-green'],
  ['hoodie-red', 'hoodie-blue', 'hoodie-crimson', 'hoodie-green'],
  ['zipper-red', 'zipper-blue', 'zipper-crimson', 'zipper-green'],
].map((product) => product.map((key) => merchImages[key as keyof typeof merchImages].url));

const COLORS = [
  { n: 'Red', c: '#d93a2f', k: 'Astral Furry' },
  { n: 'Blue', c: '#2f5fd0', k: 'Orion Drift' },
  { n: 'Crimson', c: '#8f1230', k: 'Rebel Halo' },
  { n: 'Green', c: '#1f8a4c', k: 'Plasma Rogue' },
];

const ITEMS = [
  { name: 'T-shirt', price: 399, desc: 'Heavyweight cotton tee with the celestial disc printed across the back.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { name: 'Hoodie', price: 679, desc: 'Brushed fleece hoodie with an embroidered Innovision wordmark.', sizes: ['S', 'M', 'L', 'XL'] },
  { name: 'Zipper', price: 699, desc: 'Full-zip fleece with a ribbed collar and a small orbit patch.', sizes: ['S', 'M', 'L', 'XL'] },
];

const N = ITEMS.length;
const TAU = Math.PI * 2;

const CSS = `
.m2-card{cursor:pointer;outline:none;-webkit-tap-highlight-color:transparent}
.m2-card:focus-visible .m2-photo{outline:2px solid #141312;outline-offset:4px}
.m2-tilt{transition:transform .25s ease-out;will-change:transform}
.m2-preview{width:min(1000px,94vw);max-width:94vw;max-height:92dvh;padding:0;border:1px solid rgba(236,232,223,.18);background:#141312;color:#ECE8DF}
.m2-preview::backdrop{background:rgba(9,8,7,.82);backdrop-filter:blur(4px)}
.m2-preview-image{position:relative;width:min(88vw,900px);height:min(70dvh,680px);background:#171614}
.m2-preview-image img{object-fit:contain!important}
.m2-preview-close{border:1px solid rgba(236,232,223,.35);background:transparent;color:#ECE8DF;width:38px;height:38px;font-size:22px;cursor:pointer}
.m2-dot{width:40px;height:40px;border-radius:50%;border:2px solid transparent;padding:0;cursor:pointer;box-shadow:inset 0 0 0 4px #ECE8DF;transition:border-color .2s,transform .2s}
.m2-dot:hover{transform:scale(1.08)}
.m2-sz{min-width:52px;height:44px;padding:0 12px;border:1.5px solid #141312;background:transparent;color:#141312;font-weight:700;font-size:14px;cursor:pointer;transition:background-color .2s,color .2s,transform .2s,box-shadow .2s}
.m2-sz:hover{background:rgba(20,19,18,.08)}
.m2-sz[aria-pressed="true"]{background:#141312;color:#ECE8DF;transform:translateY(-2px);box-shadow:0 5px 0 -2px oklch(0.8 0.12 85)}
@keyframes m2-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.m2-panel{animation:m2-in .5s cubic-bezier(.2,.8,.2,1) both}
@media (max-width:520px){.m2-dot{width:44px;height:44px}.m2-sz{min-width:48px}}
@media(max-width:640px){.m2-hero-layout{grid-template-columns:1fr!important;gap:12px!important}.m2-hero-description{max-width:340px!important;padding-left:11px!important;font-size:12px!important}.m2-preview-image{width:88vw;height:min(58dvh,520px)}}
@media (prefers-reduced-motion:reduce){.m2-panel{animation:none!important}.m2-tilt{transition:none}}
`;

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const wrapA = (a: number) => (((a + Math.PI) % TAU) + TAU) % TAU - Math.PI;

function metrics(W: number) {
  const narrow = W < 520;
  const cardW = narrow ? Math.max(170, Math.min(W * 0.72, 300)) : Math.min(380, Math.max(250, W * 0.36));
  const metaH = narrow ? 78 : 84;
  const hF = cardW * 0.67 + metaH;
  const ry = clamp(cardW * 0.42, 56, 112);
  const rx = clamp(W / 2 - cardW * 0.35 - 6, 60, cardW * 1.5);
  const cy = ry + hF * 0.25 + 14;
  const H = Math.round(2 * ry + hF * 0.75 + 36);
  return { cardW, metaH, hF, ry, rx, cy, H };
}

function PriceCount({
  value,
  active,
  delay,
  instant,
                   }: {
  value: number;
  active: boolean;
  delay: number;
  instant: boolean;
                     }) {
  const [n, setN] = useState(instant ? value : 0);

  useEffect(() => {
    if (instant || !active) {
      return;
    }

    let raf = 0;
    const start = performance.now() + delay;

    const tick = (now: number) => {
      if (now < start) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const t = Math.min(1, Math.max(0, (now - start) / 1000));

      setN(Math.round(value * (1 - Math.pow(1 - t, 3))));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [value, active, delay, instant]);

  const displayValue = instant ? value : active ? n : 0;

  return <>{displayValue.toLocaleString('en-IN')}</>;
}

/** The Odyssey Store (orbit version): T-shirt, Hoodie and Zipper orbit; click one to choose colour and size. */
export default function MerchOrbitView({ standalone = false }: { v?: unknown; standalone?: boolean }) {
  const [sel, setSel] = useState<number | null>(null);
  const [col, setCol] = useState<number[]>(ITEMS.map(() => -1));
  const [revealed, setRevealed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [W, setW] = useState(1000);
  const [preview, setPreview] = useState<number | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const posRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tiltRefs = useRef<(HTMLDivElement | null)[]>([]);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const indRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDialogElement>(null);
  const angleRef = useRef(Math.PI / 2);
  const speedRef = useRef(1);
  const selRef = useRef<number | null>(null);
  const reducedRef = useRef(false);
  const inViewRef = useRef(true);
  const frontRef = useRef(-1);

  const m = metrics(W);
  const mRef = useRef(m);
  useEffect(() => {
    mRef.current = m;
  }, [m]);
  const show = revealed || reduced;

  const nameOf = (i: number) => ITEMS[i].name + (col[i] >= 0 ? ' - ' + COLORS[col[i]].k : '');

  /* reduced motion */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const upd = () => {
      setReduced(mq.matches);
      reducedRef.current = mq.matches;
    };
    upd();
    mq.addEventListener('change', upd);
    return () => mq.removeEventListener('change', upd);
  }, []);

  /* responsive: measure the stage */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width);
      if (w > 0) setW(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* reveal on view, pause orbit when off screen */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      const id = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        inViewRef.current = e.isIntersecting;
        if (e.isIntersecting) setRevealed(true);
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* orbit placement */
  const place = useCallback(() => {
    const mm = mRef.current;
    const a = angleRef.current;
    const s0 = selRef.current;
    for (let i = 0; i < N; i++) {
      const el = posRefs.current[i];
      const tilt = tiltRefs.current[i];
      const photo = photoRefs.current[i];
      if (!el || !tilt) continue;
      const th = a + (i * TAU) / N;
      const d = (Math.sin(th) + 1) / 2;
      const s = 0.5 + 0.5 * Math.pow(d, 1.4);
      el.style.transform = `translate(${(Math.cos(th) * mm.rx).toFixed(1)}px, ${(mm.cy + Math.sin(th) * mm.ry).toFixed(1)}px) translate(-50%, -50%) scale(${s.toFixed(3)})`;
      el.style.zIndex = String(10 + Math.round(d * 20));
      tilt.style.opacity = s0 !== null && s0 !== i ? '0.35' : (0.4 + 0.6 * Math.pow(d, 1.6)).toFixed(2);
      if (photo) {
        const near = Math.abs(wrapA(th - Math.PI / 2)) < 0.45 || s0 === i;
        photo.style.boxShadow = near ? '0 24px 40px -18px rgba(20,19,18,.55)' : '0 12px 24px -18px rgba(20,19,18,.5)';
      }
    }
  }, []);

  /* orbit loop */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (inViewRef.current) {
        const a = angleRef.current;
        let front = 0;
        let minD = 9;
        for (let i = 0; i < N; i++) {
          const d = Math.abs(wrapA(a + (i * TAU) / N - Math.PI / 2));
          if (d < minD) {
            minD = d;
            front = i;
          }
        }
        const s0 = selRef.current;
        const slow = 0.22 + 0.78 * Math.min(1, minD / 0.55);
        const target = reducedRef.current || s0 !== null ? 0 : slow;
        speedRef.current += (target - speedRef.current) * Math.min(1, dt * 6);
        angleRef.current += dt * speedRef.current * (TAU / 22);
        if (s0 !== null) {
          const base = Math.PI / 2 - (s0 * TAU) / N;
          const k = Math.round((angleRef.current - base) / TAU);
          angleRef.current += (base + k * TAU - angleRef.current) * Math.min(1, dt * 5);
        }
        place();
        const f = s0 !== null ? s0 : minD < 0.7 ? front : frontRef.current;
        if (f !== frontRef.current && f >= 0) {
          frontRef.current = f;
          indRefs.current.forEach((u, k) => {
            if (!u) return;
            u.style.background = k === f ? '#141312' : 'rgba(20,19,18,.2)';
            u.style.width = k === f ? '34px' : '22px';
          });
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [place]);

  /* Selecting another garment brings its card to the front. */
  const select = (next: number | null) => {
    selRef.current = next;
    setSel(next);
  };

  const toggleProduct = (item: number) => {
    if (selRef.current === item) {
      setPreview(item);
      requestAnimationFrame(() => previewRef.current?.showModal());
      return;
    }
    select(item);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') select(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (sel === null) return;
    const id = requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
    });
    return () => cancelAnimationFrame(id);
  }, [sel, reduced]);

  /* rings */
  const cx = W / 2;
  const rings = [
    { f: 0.4, dash: '2 6', op: 0.3 },
    { f: 0.7, dash: undefined, op: 0.16 },
    { f: 1, dash: undefined, op: 0.28 },
    { f: 1.3, dash: '3 8', op: 0.3 },
    { f: 1.65, dash: undefined, op: 0.14 },
  ];

  const mainStyle: React.CSSProperties = standalone
    ? { position: 'relative', minHeight: '100vh', overflowX: 'hidden', background: '#ECE8DF' }
    : { position: 'absolute', inset: '0', overflowX: 'hidden', overflowY: 'auto', scrollbarWidth: 'none', visibility: 'hidden', background: '#ECE8DF' };

  const cardW = m.cardW;
  const nameSize = Math.round(clamp(cardW * 0.075, 16, 21));

  return (
    <main
      data-view="merch2"
      data-screen-label="Merch Store 2"
      style={mainStyle}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('[data-mcard],[data-mpanel],[data-mbag]')) return;
        select(null);
      }}
    >
      <style>{CSS}</style>



      <section style={{ position: 'relative', padding: 'clamp(64px,10vh,110px) clamp(20px,4vw,64px) 48px', background: '#141312', color: '#ECE8DF', overflow: 'hidden' }}>
        <img decoding="async" src="/assets/starfield.svg" alt="" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover', opacity: '.7', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: '1240px', margin: '0 auto' }}>
          <header style={{ minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', borderBottom: '1px solid rgba(236,232,223,.16)' }}>
            <Link href="/" aria-label="INNOVISION home" style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', color: '#ECE8DF', textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '.04em' }}>
              <Logo style={{ width: '24px' }} />INNOVISION
            </Link>
            <span style={{ fontSize: '9px', letterSpacing: '.14em', color: 'rgba(236,232,223,.68)' }}>OFFICIAL MERCH <span style={{ color: 'oklch(0.8 0.12 85)' }}>/</span> 2026</span>
          </header>
          <div className="m2-hero-layout" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', justifyContent: 'space-between', gap: '24px' }}>
            <div>
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 16px', fontSize: '13px', fontWeight: '700', letterSpacing: '.3em', color: 'oklch(0.8 0.12 85)' }}>
                <Sparkle style={{ width: '12px', height: '12px' }} />OFFICIAL MERCH · INNOVISION 2026
              </p>
              <h1 style={{ margin: '0', fontFamily: 'var(--font-display)', fontWeight: '400', fontSize: 'clamp(40px,8vw,140px)', lineHeight: '.95' }}>The Odyssey Store</h1>
            </div>
            <p className="m2-hero-description" style={{ maxWidth: '400px', margin: '0', fontSize: '17px', lineHeight: '1.6', color: 'rgba(236,232,223,.82)', textWrap: 'pretty' }}>Limited-run gear for the crew. Pre-order now, collect at the merch desk during the fest.</p>
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(32px,6vh,80px) clamp(16px,4vw,64px) 120px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div ref={stageRef} style={{ position: 'relative', width: '100%', height: `${m.H}px` }}>
            <svg
              aria-hidden="true"
              width={W}
              height={m.H}
              viewBox={`0 0 ${W} ${m.H}`}
              style={{ position: 'absolute', inset: '0', pointerEvents: 'none', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)', maskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)' }}
            >
              {rings.map((r, k) => (
                <ellipse key={k} cx={cx} cy={m.cy} rx={m.rx * r.f} ry={m.ry * r.f} fill="none" stroke={`rgba(20,19,18,${r.op})`} strokeWidth="1" strokeDasharray={r.dash} vectorEffect="non-scaling-stroke" />
              ))}
              <ellipse cx={cx} cy={m.cy + m.ry + m.hF / 2 - 6} rx={cardW * 0.55} ry={14} fill="rgba(20,19,18,.14)" />
            </svg>

            {ITEMS.map((it, i) => {
              const isSel = sel === i;
              return (
                <div
                  key={it.name}
                  ref={(el) => {
                    posRefs.current[i] = el;
                  }}
                  style={{ position: 'absolute', left: '50%', top: '0', width: `${cardW}px` }}
                >
                  <div
                    style={{
                      opacity: show ? 1 : 0,
                      transform: show || reduced ? 'none' : 'translateY(24px) scale(.94)',
                      transition: reduced ? 'none' : `opacity .7s ease ${i * 0.16}s, transform .8s cubic-bezier(.2,.8,.2,1) ${i * 0.16}s`,
                    }}
                  >
                    <div
                      data-mcard=""
                      className="m2-card"
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSel}
                      aria-label={`${nameOf(i)} – choose colour and size`}
                      onClick={() => toggleProduct(i)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleProduct(i);
                        }
                      }}
                    >
                      <div
                        className="m2-tilt"
                        ref={(el) => {
                          tiltRefs.current[i] = el;
                        }}
                      >
                        <div
                          className="m2-photo"
                          ref={(el) => {
                            photoRefs.current[i] = el;
                          }}
                          style={{ position: 'relative', aspectRatio: '3 / 2', background: '#171614', border: '1px solid rgba(20,19,18,.16)', overflow: 'hidden', transition: 'box-shadow .3s' }}
                        >
                          <Image
                            src={PRODUCT_IMAGES[i][col[i] >= 0 ? col[i] : 0]}
                            alt={`${it.name} with ${col[i] >= 0 ? COLORS[col[i]].n : COLORS[0].n} artwork, front and back`}
                            fill
                            sizes="(max-width: 520px) 72vw, (max-width: 900px) 40vw, 28vw"
                            unoptimized
                            style={{ objectFit: 'contain' }}
                          />
                          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '8px', background: col[i] >= 0 ? COLORS[col[i]].c : 'transparent', transition: 'background .4s', pointerEvents: 'none' }} />
                        </div>
                        <div style={{ marginTop: '10px', minHeight: `${m.metaH - 10}px` }}>
                          <h3 style={{ margin: '0', fontFamily: 'var(--font-display)', fontWeight: '400', fontSize: `${nameSize}px`, lineHeight: '1.15' }}>{nameOf(i)}</h3>
                          <span style={{ display: 'block', marginTop: '4px', fontWeight: '700', fontSize: cardW < 190 ? '15px' : '17px' }}>
                            <PriceCount value={it.price} active={show} delay={i * 160 + 300} instant={reduced} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '4px 0 8px' }} aria-hidden="true">
            {ITEMS.map((it, k) => (
              <span
                key={it.name}
                ref={(el) => {
                  indRefs.current[k] = el;
                }}
                style={{ display: 'block', height: '3px', width: '22px', background: 'rgba(20,19,18,.2)', transition: 'background .3s, width .3s' }}
              />
            ))}
          </div>
        </div>

        {sel === null && (
          <p style={{ maxWidth: '1240px', margin: '8px auto 0', textAlign: 'center', fontSize: '13px', color: '#5c574f' }}>Tap a product to choose its colour and order. </p>
        )}

        {sel !== null && (
          <div
            data-mpanel=""
            ref={panelRef}
            key={sel}
            className="m2-panel"
            style={{ maxWidth: '560px', margin: '24px auto 0', paddingTop: '24px', borderTop: '1px solid rgba(20,19,18,.18)', display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: '0', fontFamily: 'var(--font-display)', fontWeight: '400', fontSize: '26px', lineHeight: '1.1' }}>{nameOf(sel)}</h3>
              <span style={{ fontWeight: '700', fontSize: '20px' }}>₹{ITEMS[sel].price}/-</span>
            </div>
            <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.55', color: '#3a3733', textWrap: 'pretty' }}>{ITEMS[sel].desc}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ minWidth: '58px', fontSize: '12px', fontWeight: '700', letterSpacing: '.2em', color: '#5c574f' }}>COLOUR</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                {COLORS.map((c, k) => (
                  <button
                    key={c.n}
                    type="button"
                    className="m2-dot"
                    aria-label={c.n}
                    aria-pressed={col[sel] === k}
                    title={c.n}
                    onClick={() => {
                      setCol((s) => s.map((x, j) => (j === sel ? k : x)));
                    }}
                    style={{ background: c.c, borderColor: col[sel] === k ? '#141312' : 'transparent' }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '14px', color: '#3a3733' }}>{col[sel] >= 0 ? COLORS[col[sel]].n : ''}</span>
            </div>

            <div>
              <a href={MERCH_ORDER_URL} target="_blank" rel="noopener noreferrer" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 24px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', letterSpacing: '.08em', color: '#ECE8DF', background: '#141312', clipPath: 'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)' }}>
                ORDER VIA GOOGLE FORM &#8599;
              </a>
              <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#5c574f' }}>Choose your size in the order form.</p>
            </div>
          </div>
        )}

      </section>

      <dialog
        ref={previewRef}
        className="m2-preview"
        aria-label={preview === null ? 'Product image preview' : `${ITEMS[preview].name} image preview`}
        onClick={(event) => {
          if (event.target === previewRef.current) previewRef.current?.close();
        }}
        onClose={() => setPreview(null)}
      >
        {preview !== null && (
          <div style={{ padding: 'clamp(12px,2vw,22px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '10px', letterSpacing: '.18em', color: 'oklch(0.8 0.12 85)' }}>CELESTIAL ODYSSEY</div>
                <div style={{ marginTop: '4px', fontFamily: 'var(--font-display)', fontSize: '22px' }}>{nameOf(preview)}</div>
              </div>
              <button type="button" className="m2-preview-close" aria-label="Close image preview" onClick={() => previewRef.current?.close()}>×</button>
            </div>
            <div className="m2-preview-image">
              <Image src={PRODUCT_IMAGES[preview][col[preview] >= 0 ? col[preview] : 0]} alt={`${ITEMS[preview].name} product, enlarged`} fill sizes="94vw" unoptimized style={{ objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap', marginTop: '14px' }}>
              <span style={{ fontWeight: '700', fontSize: '17px' }}>₹{ITEMS[preview].price}/-</span>
              <a href={MERCH_ORDER_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', justifyContent: 'center', padding: '12px 20px', textDecoration: 'none', fontWeight: '700', fontSize: '12px', letterSpacing: '.08em', color: '#141312', background: 'oklch(0.8 0.12 85)' }}>ORDER VIA GOOGLE FORM ↗</a>
            </div>
          </div>
        )}
      </dialog>
    </main>
  );
}
