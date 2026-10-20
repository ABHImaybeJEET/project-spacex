'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PRODUCTS, inr, type Product } from './data';
import type { V } from './types';

const BAG_KEY = 'innovisionCart';

type BagLine = { id: string; key: string; c: number; s: string; qty: number };
type Sel = { color?: number; size?: string };

const cleanBag = (raw: unknown): BagLine[] =>
  (Array.isArray(raw) ? raw : [])
    .filter(
      (l) =>
        l &&
        typeof l.id === 'string' &&
        typeof l.key === 'string' &&
        PRODUCTS.some((p) => p.id === l.key) &&
        Number.isFinite(l.qty) &&
        l.qty > 0
    )
    .map((l) => ({
      id: l.id,
      key: l.key,
      c: Number.isInteger(l.c) ? l.c : -1,
      s: typeof l.s === 'string' ? l.s : '',
      qty: Math.min(99, Math.floor(l.qty)),
    }));

const readBag = (): BagLine[] => {
  try {
    return cleanBag(JSON.parse(localStorage.getItem(BAG_KEY) || '[]'));
  } catch {
    return [];
  }
};

const bagTotal = (bag: BagLine[]) => bag.reduce((n, l) => n + l.qty, 0);

export function useMerchV(): V {
  const [sel, setSel] = useState<Record<string, Sel>>({});
  const [added, setAdded] = useState<string | null>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const pick = useCallback((id: string, patch: Sel) => {
    setSel((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), ...patch },
    }));
  }, []);

  const addToCart = useCallback((p: Product, size: string | null, color: number) => {
    const c = p.colors ? color : -1;
    const s = size || '';
    const id = `${p.id}|${c}|${s}`;

    const bag = readBag();

    const f = bag.find((l) => l.id === id);
    if (f) {
      f.qty += 1;
    } else {
      bag.push({ id, key: p.id, c, s, qty: 1 });
    }

    try {
      localStorage.setItem(BAG_KEY, JSON.stringify(bag));
    } catch {}

    setAdded(p.id);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(null), 1400);
  }, []);

  const products = PRODUCTS.map((p) => {
    const sl = sel[p.id] || {};
    const size = sl.size || (p.sizes ? 'M' : null);
    const color = sl.color || 0;

    return {
      ...p,
      slot: 'merch-' + p.id,
      ph: p.name + ' product photo',
      priceL: inr(p.price),
      hasTag: !!p.tag,
      tagU: (p.tag || '').toUpperCase(),
      hasSizes: !!p.sizes,
      hasColors: !!p.colors,
      colorName: p.colors ? p.colors[color][0] : '',
      sizes: (p.sizes || []).map((z) => ({
        z,
        on: z === size,
        bg: z === size ? '#141312' : 'transparent',
        fg: z === size ? '#ECE8DF' : '#141312',
        onClick: () => pick(p.id, { size: z }),
      })),
      colors: (p.colors || []).map(([n, c], k) => ({
        n,
        c,
        on: k === color,
        ring: k === color ? '#141312' : 'transparent',
        onClick: () => pick(p.id, { color: k }),
      })),
      add: () => addToCart(p, size, color),
      addLabel: added === p.id ? 'ADDED ✓' : 'ADD TO CART',
      addBg: added === p.id ? '#8a6a2a' : '#141312',
    };
  });

  return { products } as unknown as V;
}

/* ------------------------------------------------------------------ */
/* Merch 2 (orbit page): adds T-shirt / Hoodie / Zipper to the SAME   */
/* cart (localStorage "innovisionCart") that the rest of the site uses */
/* ------------------------------------------------------------------ */

// index 0 = T-shirt, 1 = Hoodie, 2 = Zipper: matched against PRODUCTS by id or name
const MERCH2_MATCH = [/\btee\b|t-?shirt/i, /hoodie/i, /zip/i];
const MERCH2_LABEL = ['T-shirt', 'Hoodie', 'Zipper'];
// index = colour order used on the orbit page
const MERCH2_COLORS = ['Red', 'Blue', 'Crimson', 'Green'];

export type Merch2Result = { ok: true } | { ok: false; reason: string };

export function useMerch2() {
  const [bagCount, setBagCount] = useState(0);

  useEffect(() => {
    const sync = () => setBagCount(bagTotal(readBag()));
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const addToCart = useCallback((item: number, colorIdx: number, size: string): Merch2Result => {
    const re = MERCH2_MATCH[item];
    const p = PRODUCTS.find((x) => re.test(x.id) || re.test(x.name));
    if (!p) return { ok: false, reason: `${MERCH2_LABEL[item]} isn't in the cart catalogue yet.` };

    const colorName = MERCH2_COLORS[colorIdx];
    let c = -1;
    if (p.colors) {
      c = p.colors.findIndex(([n]) => n.toLowerCase() === colorName.toLowerCase());
      if (c < 0) return { ok: false, reason: `${colorName} isn't set up for ${MERCH2_LABEL[item]} in the cart yet.` };
    }
    if (p.sizes && !p.sizes.includes(size)) {
      return { ok: false, reason: `Size ${size} isn't set up for ${MERCH2_LABEL[item]} in the cart yet.` };
    }

    const s = p.sizes ? size : '';
    const id = `${p.id}|${c}|${s}`;
    const bag = readBag();
    const f = bag.find((l) => l.id === id);
    if (f) f.qty += 1;
    else bag.push({ id, key: p.id, c, s, qty: 1 });

    try {
      localStorage.setItem(BAG_KEY, JSON.stringify(bag));
    } catch {
      return { ok: false, reason: "Couldn't save to your bag. Check your browser storage settings." };
    }
    setBagCount(bagTotal(bag));
    return { ok: true };
  }, []);

  return { bagCount, addToCart };
}