'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { V } from './types';

/** A tiny seeded random generator (mulberry32), so every render draws the same clouds on server and client. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r1 = (n: number) => Math.round(n * 10) / 10;
const circle = (cx: number, cy: number, r: number) => `M${r1(cx - r)} ${r1(cy)}a${r1(r)} ${r1(r)} 0 1 1 ${r1(2 * r)} 0a${r1(r)} ${r1(r)} 0 1 1 ${r1(-2 * r)} 0`;

/**
 * A cumulus bank in a 2000x1125 box, drawn in code. `back` is the skyline: puffs of mixed sizes along a wandering
 * baseline, with the odd tower stacked on top, over a base block. `front` is a lower ridge of big puffs whose rims read
 * as inked folds inside the cloud. Every subpath winds clockwise, so with the default nonzero fill the circles merge
 * into one silhouette.
 */
function cloudBank(seed: number) {
  const rnd = seeded(seed), p1 = rnd() * 6.3, p2 = rnd() * 6.3;
  const base = (x: number) => 640 + 75 * Math.sin(x / 290 + p1) + 35 * Math.sin(x / 110 + p2);
  let back = 'M-100 780H2100V1125H-100Z', front = '';
  for (let x = -60; x < 2080; x += 45 + rnd() * 75) {
    const cy = base(x) + rnd() * 40, r = Math.max(55 + rnd() * 105, 800 - cy);
    back += circle(x, cy, r);
    if (rnd() < .1) {
      let ty = cy - r * .7, tr = r * .7;
      for (let k = 0; k < 2 + rnd() * 2; k++) { back += circle(x + (rnd() - .5) * tr * .6, ty, tr); ty -= tr * .6; tr *= .72; }
    }
  }
  for (let x = -40; x < 2080; x += 140 + rnd() * 180) {
    const r = 120 + rnd() * 110, cy = 1020 + rnd() * 110;
    front += circle(x, cy, r) + circle(x + r * .8, cy + 30 + rnd() * 40, r * (.6 + rnd() * .3));
  }
  return { back, front };
}

/** Back to front, in the site's own ink-to-paper tones; the front (paper) bank carries the "Now entering" label. */
const LAYERS = [
  { color: '#141312', ink: '#000000', ...cloudBank(11) },
  { color: '#3a3530', ink: '#1d1a17', ...cloudBank(23) },
  { color: '#6e665c', ink: '#3d3832', ...cloudBank(37) },
  { color: '#c9bfae', ink: '#857b6c', ...cloudBank(41) },
  { color: '#ECE8DF', ink: '#a39b8d', ...cloudBank(59) },
];

/**
 * One cloud bank, cropped like a cover image anchored to the bottom; flip mirrors it for the trailing edge.
 * Each shape is drawn twice, stroked and then filled on top, so only the outer silhouette keeps its ink line.
 */
function Clouds({ l, flip }: { l: (typeof LAYERS)[number]; flip?: boolean }) {
  return (
    <svg viewBox="0 0 2000 1125" preserveAspectRatio="xMidYMax slice" style={{ display: "block", width: "100%", height: "100vh", transform: flip ? "scaleY(-1)" : undefined }}>
      <path d={l.back} fill={l.color} stroke={l.ink} strokeWidth="5" vectorEffect="non-scaling-stroke" />
      <path d={l.back} fill={l.color} />
      <path d={l.front} fill={l.color} stroke={l.ink} strokeWidth="4" vectorEffect="non-scaling-stroke" />
      <path d={l.front} fill={l.color} />
    </svg>
  );
}

export interface CurtainProps {
  v?: Partial<V>;
  kicker?: string;
  label?: string;
  title?: string;
  autoPlay?: boolean;
  holdSeconds?: number;
  delay?: number;
  onCovered?: () => Promise<void> | void;
  onReveal?: () => void;
  onComplete?: () => void;
}

/**
 * Runs the curtain transition animation matching the Gallery transition:
 * 1. Clouds rise from the bottom to fully cover the screen (duration: 1.3s, stagger: 0.09s, ease: power3.inOut).
 * 2. Pauses at covered; executes `covered` callback.
 * 3. Clouds exit upward to reveal content (duration: 1.4s, stagger: 0.09s from end, ease: power3.inOut).
 * 4. Calls `reveal` right as exit starts (+0.35s / '<').
 */
export function runCurtainTransition(
  container?: HTMLElement | Document | null,
  options: {
    delay?: number;
    covered?: () => Promise<void> | void;
    reveal?: () => void;
  } = {}
): Promise<void> {
  const { delay = 0, covered, reveal } = options;
  const g = gsap;
  const doc = typeof document !== 'undefined' ? document : null;
  const root = container ?? doc;

  if (!root) {
    if (covered) covered();
    if (reveal) reveal();
    return Promise.resolve();
  }

  const target = (root as HTMLElement).matches?.('[data-curtain]')
    ? (root as HTMLElement)
    : (root as HTMLElement).querySelector?.<HTMLElement>('[data-curtain]') ||
      doc?.querySelector<HTMLElement>('[data-curtain]') || null;

  if (!target) {
    if (covered) covered();
    if (reveal) reveal();
    return Promise.resolve();
  }

  const L = target.querySelectorAll<HTMLElement>('[data-c-layer]');
  const c = target;

  return new Promise<void>((resolve) => {
    g.set(c, { pointerEvents: 'auto' });
    g.set(L, { y: 0, yPercent: 100 / 3, force3D: true, willChange: 'transform' });
    c.removeAttribute('data-idle');

    const preventScroll = (e: Event) => e.preventDefault();
    c.addEventListener('wheel', preventScroll, { passive: false });
    c.addEventListener('touchmove', preventScroll, { passive: false });

    const tl = g.timeline({
      delay,
      defaults: { force3D: true },
      onComplete: () => {
        c.removeEventListener('wheel', preventScroll);
        c.removeEventListener('touchmove', preventScroll);
        g.set(L, { willChange: 'auto' });
        g.set(c, { pointerEvents: 'none' });
        c.setAttribute('data-idle', '');
        resolve();
      },
    });

    tl.to(L, { yPercent: -100 / 3, duration: 1.3, ease: 'power3.inOut', stagger: 0.09 })
      .add(() => {
        tl.pause();
        Promise.resolve()
          .then(() => covered && covered())
          .catch((e) => console.warn('curtain', e))
          .then(() => {
            requestAnimationFrame(() => {
              if (tl && (tl.isActive() || tl.paused())) {
                tl.resume();
              }
            });
          });
      })
      .add(() => {
        if (reveal) reveal();
      }, '+=0.35')
      .to(L, { yPercent: -100, duration: 1.4, ease: 'power3.inOut', stagger: { each: 0.09, from: 'end' } }, '<');
  });
}

/** Layered cloud curtain used for view transitions. */
export default function Curtain({
  v,
  kicker,
  label,
  title,
  autoPlay = false,
  holdSeconds = 2,
  delay = 0,
  onCovered,
  onReveal,
  onComplete,
}: CurtainProps = {}) {
  const displayKicker = kicker ?? v?.curtainKicker ?? 'NOW ENTERING';
  const displayLabel = title ?? label ?? v?.curtainLabel ?? '';
  const curtainRef = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef({ onCovered, onReveal, onComplete });

  useEffect(() => {
    callbacksRef.current = { onCovered, onReveal, onComplete };
  });

  useEffect(() => {
    if (!autoPlay) return;

    const c = curtainRef.current;
    if (!c) return;

    let holdTimeout: ReturnType<typeof setTimeout> | null = null;

    const ctx = gsap.context(() => {
      runCurtainTransition(c, {
        delay,
        covered: async () => {
          if (callbacksRef.current.onCovered) await callbacksRef.current.onCovered();
          if (holdSeconds > 0) {
            await new Promise((r) => {
              holdTimeout = setTimeout(r, holdSeconds * 1000);
            });
          }
        },
        reveal: () => {
          if (callbacksRef.current.onReveal) callbacksRef.current.onReveal();
        },
      }).then(() => {
        if (callbacksRef.current.onComplete) callbacksRef.current.onComplete();
      });
    }, c);

    return () => {
      if (holdTimeout) clearTimeout(holdTimeout);
      ctx.revert();
    };
  }, [autoPlay, delay, holdSeconds]);

  return (
    <div
      ref={curtainRef}
      data-curtain=""
      aria-hidden="true"
      style={{ position: "fixed", inset: "0", zIndex: "40", overflow: "hidden", pointerEvents: "none" }}
    >
      {LAYERS.map((l, k) => (
        // Low-power mode drops two of the dark middle banks (globals.css [data-lp-skip]); the front one carries the label.
        <div
          key={k}
          data-c-layer=""
          data-lp-skip={k === 1 || k === 3 ? "" : undefined}
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "300vh",
            transform: "translateY(100%)",
            backfaceVisibility: "hidden",
          }}
        >
          <Clouds l={l} />
          {k === LAYERS.length - 1 ? (
            <div
              style={{
                position: "relative",
                height: "calc(100vh + 4px)",
                margin: "-2px 0",
                background: l.color,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "14px",
                textAlign: "center",
                color: "#141312",
                padding: "0 20px",
              }}
            >
              <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: ".34em", textTransform: "uppercase" }}>
                {displayKicker}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: "400",
                  fontSize: "clamp(34px,6vw,96px)",
                  lineHeight: "1",
                  letterSpacing: ".02em",
                }}
              >
                {displayLabel}
              </span>
            </div>
          ) : (
            <div style={{ height: "calc(100vh + 4px)", margin: "-2px 0", background: l.color }}></div>
          )}
          <Clouds l={l} flip />
        </div>
      ))}
    </div>
  );
}
