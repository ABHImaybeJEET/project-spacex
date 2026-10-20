'use client';
/* eslint-disable @next/next/no-img-element -- decorative starfield behind the menu, as in MenuOverlay */

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { REGISTRATIONS_OPEN, REGISTRATIONS_SOON_PATH, MERCH_PATH } from '@/config/launch';
import { LINKS, NAVBAR_HIDDEN, WORLDS } from './data';
import { Logo } from './icons';

/* The explorer's top bar (Hud.tsx) and phone menu (MenuOverlay.tsx) for the merch page, which lives outside the
   explorer: the same sizes, classes and blend, with plain links into it. Hash routes are full loads (as in
   EventsChrome), so the explorer reads them once it boots; the page's SkipIntroOnReturn skips its loader. */

const LABEL = 'clamp(13px,.95vw,16px)';
const INK = '#141312', PAPER = '#ECE8DF', GOLD = 'oklch(0.8 0.12 85)';
const FROST = 'rgba(236,232,223,.86)';
const EASE = 'cubic-bezier(.25,1,.1,1)';

const HREF: Record<string, string> = {
  home: '/', events: `/#/worlds/${WORLDS[0].slug}`, schedule: '/#/schedule', gallery: '/#/gallery', sponsors: '/#/sponsors', merch: MERCH_PATH,
};
const NAV = LINKS.filter(([, k]) => !NAVBAR_HIDDEN.includes(k)).map(([name, k]) => ({ name, label: name.toUpperCase(), href: HREF[k], cur: k === 'merch' }));
/** The explorer opens registration (or the pass, or log in first) for these, as for its own REGISTER buttons. */
const REGISTER_HREF = REGISTRATIONS_OPEN ? '/?open=register' : REGISTRATIONS_SOON_PATH;
const ACCOUNT_HREF = '/?open=login';
const INSTAGRAM = 'https://www.instagram.com/inno.nitr_official?psln=bWNqdmk1c3V4eWFl';

/**
 * Layout switches by CSS, so the server render is already right: the nav row from 1100px, LOG IN from 720px, MENU
 * below 1100px. The wordmark goes below 520px as on the explorer's world pages (globals.css .hud-wordmark-detail).
 */
const CSS = `
.mh-nav{display:none}
@media (min-width:1100px){.mh-nav{display:flex}.mh-menu{display:none !important}}
@media (max-width:719px){.mh-login{display:none !important}}
@media (min-width:720px){.mh-menu-login{display:none !important}}
@media (max-width:339px){.mh-back-label{display:none}}
`;

export default function MerchHud() {
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  // null until the cookie is read after mount: the account slot holds its place, as the explorer's does.
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  /* Frosted once the page scrolls under the bar. The page is its own scroller, so listen for every scroll. */
  useEffect(() => {
    const onScroll = (e: Event) => {
      const t = e.target as Element | Document;
      const top = t instanceof Element ? t.scrollTop : document.scrollingElement?.scrollTop ?? 0;
      setSolid(top > 8);
    };
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => document.removeEventListener('scroll', onScroll, { capture: true });
  }, []);

  /* A session cookie (set by the explorer's sign-in) means the visitor is signed in. */
  useEffect(() => {
    const id = requestAnimationFrame(() => setSignedIn(/(?:^|;\s*)inn_access_token=/.test(document.cookie)));
    return () => cancelAnimationFrame(id);
  }, []);

  /* The menu: Escape closes it, and focus moves into it and back to MENU. */
  useEffect(() => {
    if (!menu) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    addEventListener('keydown', onKey);
    const btn = menuBtn.current;
    return () => { removeEventListener('keydown', onKey); btn?.focus(); };
  }, [menu]);

  const fg = solid ? INK : '#fff';
  const ghost: CSSProperties = { position: 'relative', isolation: 'isolate', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px,.8vw,14px) clamp(20px,1.3vw,24px)', textDecoration: 'none', fontWeight: '700', fontSize: LABEL, letterSpacing: '.08em', color: 'inherit', background: 'currentColor', clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)' };
  const ghostFill: CSSProperties = { position: 'absolute', inset: '1.5px', zIndex: '-1', background: solid ? PAPER : '#000', clipPath: 'polygon(7.4px 0,100% 0,100% calc(100% - 7.4px),calc(100% - 7.4px) 100%,0 100%,0 7.4px)' };
  const accountLabel = signedIn ? 'PROFILE' : 'LOG IN';

  return (
    <>
      <style>{CSS}</style>
      <header data-hud="" data-hud-solid={solid ? '' : undefined} className="hud-bar" style={{ position: 'fixed', left: '0', right: '0', top: '0', zIndex: '50', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', padding: solid ? 'clamp(10px,1.05vw,16px) clamp(16px,2.6vw,44px)' : 'clamp(14px,1.8vw,26px) clamp(16px,2.6vw,44px)', pointerEvents: 'none', color: fg, mixBlendMode: solid ? 'normal' : 'difference', transition: `padding .5s ${EASE}` }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: '0', zIndex: '-1', background: FROST, backdropFilter: 'blur(14px) saturate(1.2)', WebkitBackdropFilter: 'blur(14px) saturate(1.2)', borderBottom: '1px solid rgba(20,19,18,.12)', boxShadow: '0 10px 30px -18px rgba(20,19,18,.35)', opacity: solid ? 1 : 0, visibility: solid ? 'visible' : 'hidden', transition: solid ? 'opacity .4s' : 'opacity .25s, visibility 0s .25s', pointerEvents: 'none' }}></div>

        <div className="hud-group" style={{ display: 'flex', alignItems: 'center', gap: '18px', pointerEvents: 'auto' }}>
          <Link href="/" aria-label="Back to the home page" className="hud-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minHeight: '44px', padding: '6px 0', textDecoration: 'none', fontWeight: '500', fontSize: LABEL, letterSpacing: '.04em', color: 'inherit' }}>
            <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true">
              <path d="M5 1 1 5l4 4M1 5h15" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
            </svg>
            {/* Kept down to 340px (the explorer drops it below 379px): here BACK is the main way home. */}
            <span className="mh-back-label">BACK</span>
          </Link>
          <span aria-hidden="true" style={{ width: '1px', height: '22px', background: 'currentColor', opacity: '.4' }}></span>
          <Link href="/" aria-label="Innovision home" className="hud-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'inherit', textDecoration: 'none' }}>
            <Logo style={{ width: 'clamp(24px,2vw,32px)' }} />
            <span className="hud-wordmark hud-wordmark-detail" style={{ fontFamily: 'var(--font-display)', fontWeight: '400', fontSize: 'clamp(17px,1.6vw,24px)', letterSpacing: '.04em' }}>INNOVISION</span>
          </Link>
        </div>

        <nav aria-label="Primary" className="mh-nav" style={{ alignItems: 'center', gap: 'clamp(14px,2.2vw,36px)', pointerEvents: 'auto' }}>
          {NAV.map((l) => (
            <a key={l.href} href={l.href} aria-current={l.cur ? 'page' : undefined} className="hud-link" style={{ position: 'relative', display: 'inline-block', padding: '8px 0', textDecoration: 'none', fontWeight: '500', fontSize: LABEL, letterSpacing: '.14em', color: 'inherit', opacity: l.cur ? 1 : 0.68, transition: 'opacity .4s' }}>
              <span>{l.label}</span>
              <span aria-hidden="true" style={{ position: 'absolute', left: '0', right: '0', bottom: '2px', height: '1.5px', background: 'currentColor', transform: `scaleX(${l.cur ? 1 : 0})`, transformOrigin: 'left' }}></span>
            </a>
          ))}
        </nav>

        <div className="hud-group" style={{ display: 'flex', alignItems: 'center', gap: '14px', pointerEvents: 'auto' }}>
          <a href={REGISTER_HREF} className="hud-register hud-cta" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px,.8vw,14px) clamp(20px,1.3vw,24px)', textDecoration: 'none', fontWeight: '700', fontSize: LABEL, letterSpacing: '.08em', color: solid ? PAPER : '#000', background: solid ? INK : '#fff', clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)' }}>
            <span>REGISTER</span>
          </a>
          {signedIn === null ? (
            <span aria-hidden="true" className="hud-register hud-ghost hud-auth-pending mh-login" style={ghost}>
              <span aria-hidden="true" style={ghostFill}></span>
              <span style={{ visibility: 'hidden' }}>LOG IN</span>
            </span>
          ) : (
            <a href={ACCOUNT_HREF} className="hud-register hud-ghost mh-login" style={ghost}>
              <span aria-hidden="true" style={ghostFill}></span>
              <span data-scr="" style={{ color: fg }}>{accountLabel}</span>
            </a>
          )}
          <button ref={menuBtn} type="button" onClick={() => setMenu(true)} aria-expanded={menu} aria-controls="merch-menu" className="hud-link mh-menu" style={{ display: 'inline-flex', alignItems: 'center', minHeight: '44px', padding: '6px 0', border: '0', background: 'none', cursor: 'pointer', fontWeight: '500', fontSize: LABEL, letterSpacing: '.14em', color: 'inherit' }}>
            MENU
          </button>
        </div>
      </header>

      <div id="merch-menu" aria-hidden={!menu} data-open={menu ? '' : undefined} className="menu" style={{ position: 'fixed', inset: '0', zIndex: '66', visibility: menu ? 'visible' : 'hidden', transition: `visibility 0s linear ${menu ? '0s' : '.9s'}` }}>
        <div className="menu-panel" style={{ clipPath: menu ? 'circle(150% at 100% 0%)' : 'circle(0% at 100% 0%)', transition: 'clip-path .9s cubic-bezier(.25,1,.1,1)' }}>
          <img decoding="async" src="/assets/starfield.svg" alt="" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover', opacity: '.45', pointerEvents: 'none' }} />
          <div className="menu-top">
            <Link href="/" aria-label="Innovision home" className="menu-brand">
              <Logo style={{ width: '24px' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: '400', fontSize: '17px', letterSpacing: '.04em' }}>INNOVISION</span>
            </Link>
            <button ref={closeBtn} type="button" onClick={() => setMenu(false)} className="menu-close">
              <span>CLOSE</span>
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M1 1l10 10M11 1 1 11" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
              </svg>
            </button>
          </div>
          <div className="menu-body">
            <nav aria-label="Menu">
              <ul className="menu-list">
                {NAV.map((l, i) => (
                  <li key={l.href} className="menu-item" style={{ '--i': i } as CSSProperties}>
                    <a href={l.href} onClick={l.cur ? () => setMenu(false) : undefined} aria-current={l.cur ? 'page' : undefined} className="menu-link" style={{ color: l.cur ? GOLD : PAPER }}>
                      <span className="menu-label">{l.name}</span>
                      <svg className="menu-arrow" width="18" height="10" viewBox="0 0 18 10" aria-hidden="true">
                        <path d="M13 1l4 4-4 4M17 5H0" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="menu-foot menu-item" style={{ '--i': NAV.length } as CSSProperties}>
              <div className="menu-meta">
                {/* Phones, where the bar has no LOG IN. */}
                {signedIn !== null && <a href={ACCOUNT_HREF} className="hv-sand mh-menu-login">{accountLabel}</a>}
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="hv-sand">INSTAGRAM</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
