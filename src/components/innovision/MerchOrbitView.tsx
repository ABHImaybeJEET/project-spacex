/* eslint-disable @next/next/no-img-element -- decorative star layer */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Sparkle } from './icons';
import { useMerch2 } from './useMerchV';

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
.m2-glow{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .3s;background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,.45),rgba(255,255,255,0) 55%)}
.m2-card:hover .m2-glow{opacity:1}
.m2-dot{width:40px;height:40px;border-radius:50%;border:2px solid transparent;padding:0;cursor:pointer;box-shadow:inset 0 0 0 4px #ECE8DF;transition:border-color .2s,transform .2s}
.m2-dot:hover{transform:scale(1.08)}
.m2-sz{min-width:52px;height:44px;padding:0 12px;border:1.5px solid #141312;background:transparent;color:#141312;font-weight:700;font-size:14px;cursor:pointer;transition:background-color .2s,color .2s,transform .2s,box-shadow .2s}
.m2-sz:hover{background:rgba(20,19,18,.08)}
.m2-sz[aria-pressed="true"]{background:#141312;color:#ECE8DF;transform:translateY(-2px);box-shadow:0 5px 0 -2px oklch(0.8 0.12 85)}
@keyframes m2-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.m2-panel{animation:m2-in .5s cubic-bezier(.2,.8,.2,1) both}
@media (max-width:520px){.m2-dot{width:44px;height:44px}.m2-sz{min-width:48px}}
@media (prefers-reduced-motion:reduce){.m2-panel{animation:none!important}.m2-tilt{transition:none}}
`;

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const wrapA = (a: number) => (((a + Math.PI) % TAU) + TAU) % TAU - Math.PI;

function metrics(W: number) {
  const narrow = W < 520;
  const cardW = narrow ? Math.max(150, Math.min(W * 0.52, 230)) : Math.min(280, Math.max(210, W * 0.28));
  const metaH = narrow ? 78 : 84;
  const hF = cardW * 1.25 + metaH;
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
  const [sz, setSz] = useState<number[]>(ITEMS.map(() => -1));
  const [err, setErr] = useState('');
  const { bagCount: bag, addToCart } = useMerch2();
  const [revealed, setRevealed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [W, setW] = useState(1000);

  const stageRef = useRef<HTMLDivElement>(null);
  const posRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tiltRefs = useRef<(HTMLDivElement | null)[]>([]);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const indRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const awRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const bagRef = useRef<HTMLSpanElement>(null);
  const offRef = useRef({ x: 0, y: 0 });
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

  /* selection: deselecting resets that card's colour and size */
  const select = (next: number | null) => {
    const prev = selRef.current;
    if (prev !== null && prev !== next) {
      setCol((c) => c.map((x, k) => (k === prev ? -1 : x)));
      setSz((c) => c.map((x, k) => (k === prev ? -1 : x)));
    }
    selRef.current = next;
    setSel(next);
    setErr('');
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

  /* magnetic add button (mouse only) */
  useEffect(() => {
    if (sel === null || reduced) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const wrap = awRef.current;
    const onMove = (e: PointerEvent) => {
      const btn = btnRef.current;
      if (!btn || !wrap) return;
      const r = btn.getBoundingClientRect();
      const left = r.left - offRef.current.x;
      const top = r.top - offRef.current.y;
      const dx = Math.max(left - e.clientX, 0, e.clientX - (left + r.width));
      const dy = Math.max(top - e.clientY, 0, e.clientY - (top + r.height));
      let tx = 0;
      let ty = 0;
      if (Math.hypot(dx, dy) < 90) {
        tx = clamp((e.clientX - (left + r.width / 2)) * 0.05, -14, 14);
        ty = clamp((e.clientY - (top + r.height / 2)) * 0.18, -8, 8);
      }
      offRef.current = { x: tx, y: ty };
      wrap.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      offRef.current = { x: 0, y: 0 };
      if (wrap) wrap.style.transform = '';
    };
  }, [sel, reduced]);

  /* card tilt */
  const onCardMove = (e: React.PointerEvent<HTMLDivElement>, i: number) => {
    if (reduced || e.pointerType === 'touch') return;
    const tilt = tiltRefs.current[i];
    if (!tilt) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    tilt.style.transform = `perspective(800px) rotateX(${((0.5 - py) * 12).toFixed(2)}deg) rotateY(${((px - 0.5) * 14).toFixed(2)}deg) scale(1.03)`;
    tilt.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    tilt.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
  };
  const onCardLeave = (i: number) => {
    const tilt = tiltRefs.current[i];
    if (tilt) tilt.style.transform = '';
  };

  /* add to bag (writes to the shared innovisionCart) */
  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>, i: number) => {
    if (col[i] < 0) {
      setErr('Choose a colour first.');
      return;
    }
    if (sz[i] < 0) {
      setErr('Choose a size first.');
      return;
    }
    const res = addToCart(i, col[i], ITEMS[i].sizes[sz[i]]);
    if (!res.ok) {
      setErr(res.reason);
      return;
    }
    setErr('');
    if (reduced) return;
    e.currentTarget.animate(
      [
        { transform: 'scale(1,1)' },
        { transform: 'scale(1.06,.86)', offset: 0.25 },
        { transform: 'scale(.96,1.08)', offset: 0.55 },
        { transform: 'scale(1,1)' },
      ],
      { duration: 450, easing: 'ease-out' }
    );
    const wrap = awRef.current;
    if (wrap) {
      const wr = wrap.getBoundingClientRect();
      const ox = e.clientX - wr.left;
      const oy = e.clientY - wr.top;
      for (let k = 0; k < 12; k++) {
        const s = document.createElement('span');
        s.style.cssText = `position:absolute;left:${ox}px;top:${oy}px;width:5px;height:5px;margin:-2.5px 0 0 -2.5px;border-radius:50%;pointer-events:none;background:${k % 2 ? 'oklch(0.8 0.12 85)' : '#ECE8DF'};`;
        wrap.appendChild(s);
        const a = (TAU * k) / 12 + Math.random() * 0.5;
        const dist = 30 + Math.random() * 38;
        const an = s.animate(
          [
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: `translate(${Math.cos(a) * dist}px, ${Math.sin(a) * dist}px) scale(0)`, opacity: 0 },
          ],
          { duration: 600, easing: 'cubic-bezier(.2,.7,.3,1)' }
        );
        an.onfinish = () => s.remove();
      }
    }
    bagRef.current?.animate(
      [
        { transform: 'translateY(0) scale(1)' },
        { transform: 'translateY(-10px) scale(1.4)', offset: 0.35 },
        { transform: 'translateY(0) scale(.92)', offset: 0.7 },
        { transform: 'translateY(0) scale(1)' },
      ],
      { duration: 520, easing: 'cubic-bezier(.3,1.4,.5,1)' }
    );
  };

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

      <div data-mbag="" style={{ position: 'fixed', top: 14, right: 16, zIndex: 50, padding: '9px 14px', background: '#141312', color: '#ECE8DF', fontSize: 12, fontWeight: 700, letterSpacing: '.2em' }}>
        BAG{' '}
        <span ref={bagRef} data-bag-count="" style={{ display: 'inline-block' }}>
          {bag}
        </span>
      </div>

      <section style={{ position: 'relative', padding: 'clamp(64px,10vh,110px) clamp(20px,4vw,64px) 48px', background: '#141312', color: '#ECE8DF', overflow: 'hidden' }}>
        <img decoding="async" src="/assets/starfield.svg" alt="" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover', opacity: '.7', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: '1240px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'end', justifyContent: 'space-between', gap: '24px' }}>
          <div>
            <p style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 16px', fontSize: '13px', fontWeight: '700', letterSpacing: '.3em', color: 'oklch(0.8 0.12 85)' }}>
              <Sparkle style={{ width: '12px', height: '12px' }} />
              OFFICIAL MERCH · INNOVISION 2026
            </p>
            <h1 style={{ margin: '0', fontFamily: 'var(--font-display)', fontWeight: '400', fontSize: 'clamp(40px,8vw,140px)', lineHeight: '.95' }}>The Odyssey Store</h1>
          </div>
          <p style={{ maxWidth: '400px', margin: '0', fontSize: '17px', lineHeight: '1.6', color: 'rgba(236,232,223,.82)', textWrap: 'pretty' }}>Limited-run gear for the crew. Pre-order now, collect at the merch desk during the fest.</p>
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
                      onClick={() => select(isSel ? null : i)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          select(isSel ? null : i);
                        }
                      }}
                      onPointerMove={(e) => onCardMove(e, i)}
                      onPointerLeave={() => onCardLeave(i)}
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
                          style={{ position: 'relative', aspectRatio: '4 / 5', background: '#DCD7CB', border: '1px dashed rgba(20,19,18,.45)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#5c574f', transition: 'box-shadow .3s' }}
                        >
                          <span aria-hidden="true">Product photo</span>
                          <div className="m2-glow" />
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
          <p style={{ maxWidth: '1240px', margin: '8px auto 0', textAlign: 'center', fontSize: '13px', color: '#5c574f' }}>Tap a card to choose its colour and size. </p>
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
                      setErr('');
                    }}
                    style={{ background: c.c, borderColor: col[sel] === k ? '#141312' : 'transparent' }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '14px', color: '#3a3733' }}>{col[sel] >= 0 ? COLORS[col[sel]].n : ''}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ minWidth: '58px', fontSize: '12px', fontWeight: '700', letterSpacing: '.2em', color: '#5c574f' }}>SIZE</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {ITEMS[sel].sizes.map((z, k) => (
                  <button
                    key={z}
                    type="button"
                    className="m2-sz"
                    aria-pressed={sz[sel] === k}
                    onClick={() => {
                      setSz((s) => s.map((x, j) => (j === sel ? k : x)));
                      setErr('');
                    }}
                  >
                    {z}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: '14px', color: '#3a3733' }}>{sz[sel] >= 0 ? `Selected: ${ITEMS[sel].sizes[sz[sel]]}` : ''}</span>
            </div>

            <div>
              <div ref={awRef} style={{ position: 'relative', transition: 'transform .25s ease-out' }}>
                <button
                  ref={btnRef}
                  type="button"
                  onClick={(e) => handleAdd(e, sel)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 24px', border: '0', cursor: 'pointer', fontWeight: '700', fontSize: '14px', letterSpacing: '.08em', color: '#ECE8DF', background: '#141312', clipPath: 'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)' }}
                >
                  ADD TO CART
                </button>
              </div>
              <div role="alert" style={{ minHeight: '20px', marginTop: '8px', fontSize: '13px', color: '#b3261e' }}>{err}</div>
            </div>
          </div>
        )}

        <p style={{ maxWidth: '1240px', margin: '48px auto 0', fontSize: '14px', lineHeight: '1.6', color: '#5c574f' }}>Prices include GST. Pre-orders are collected at the merch desk on campus during the fest.</p>
      </section>
    </main>
  );
}