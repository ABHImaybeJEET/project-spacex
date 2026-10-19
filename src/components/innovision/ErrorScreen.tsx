import type { CSSProperties, ReactNode } from 'react';

/*
 * The shared full-screen shell of the site's error pages (app/not-found.tsx, and ErrorFallback for app/error.tsx and
 * app/global-error.tsx): dark space theme, DM Serif Display heading, Manrope copy, the site's cut-corner buttons.
 * Inline styles and a starfield drawn with gradients only: an error page must not depend on any asset or stylesheet
 * that might be what failed. No hooks or handlers, so server and client pages can both use it.
 */

export const GOLD = 'oklch(0.8 0.12 85)';
export const PAPER = '#ECE8DF';

/** The site's cut-corner button shape. */
const CUT = 'polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)';
const action: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '168px', minHeight: '48px', padding: '0 28px',
  border: '0', cursor: 'pointer', font: 'inherit', fontWeight: 700, fontSize: '14px', letterSpacing: '.08em', clipPath: CUT,
  textDecoration: 'none',
};
/** Filled cream button (the main way out). */
export const primaryAction: CSSProperties = { ...action, background: PAPER, color: '#141312' };
/** Outlined twin: a ring of the outline colour around an inner fill (<GhostFill />), so the cut corners keep their edge. */
export const ghostAction: CSSProperties = { ...action, position: 'relative', isolation: 'isolate', background: 'rgba(236,232,223,.5)', color: PAPER };
export function GhostFill() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', inset: '1.5px', zIndex: -1, background: '#100f0d', clipPath: 'polygon(11.4px 0,100% 0,100% calc(100% - 11.4px),calc(100% - 11.4px) 100%,0 100%,0 11.4px)' }}></span>
  );
}

const STARS = [
  'radial-gradient(1.5px 1.5px at 12% 22%,rgba(236,232,223,.9),transparent)', 'radial-gradient(1px 1px at 28% 68%,rgba(236,232,223,.7),transparent)',
  'radial-gradient(1.5px 1.5px at 47% 14%,rgba(236,232,223,.8),transparent)', 'radial-gradient(1px 1px at 63% 82%,rgba(236,232,223,.6),transparent)',
  'radial-gradient(2px 2px at 78% 30%,rgba(236,232,223,.9),transparent)', 'radial-gradient(1px 1px at 89% 61%,rgba(236,232,223,.7),transparent)',
  'radial-gradient(1px 1px at 6% 84%,rgba(236,232,223,.6),transparent)', 'radial-gradient(1.5px 1.5px at 38% 44%,rgba(236,232,223,.5),transparent)',
].join(',');

interface ErrorScreenProps {
  /** Small gold line above the heading. */
  eyebrow: string;
  title: string;
  /** The explanation under the heading. */
  children: ReactNode;
  /** The buttons. */
  actions: ReactNode;
  /** Anything below the buttons (quick links, a reference code). */
  after?: ReactNode;
  /** Large faint numerals behind the text, e.g. "404". */
  code?: string;
  /** 'alert' for a crash (announced at once by screen readers); omitted for a plain missing page. */
  role?: 'alert';
}

export default function ErrorScreen({ eyebrow, title, children, actions, after, code, role }: ErrorScreenProps) {
  return (
    <main role={role} style={{ position: 'fixed', inset: 0, zIndex: 200, overflowY: 'auto', display: 'grid', placeItems: 'center', padding: '48px 16px', background: `${STARS},radial-gradient(ellipse at 50% 120%,#2a2620 0%,#0c0b0a 60%)`, color: PAPER, fontFamily: "var(--font-manrope),'Segoe UI',system-ui,sans-serif", textAlign: 'center' }}>
      <div aria-hidden="true" style={{ position: 'absolute', left: '50%', bottom: 'min(-60vw,-420px)', width: 'max(120vw,840px)', aspectRatio: '1', marginLeft: 'min(-60vw,-420px)', borderRadius: '50%', border: '1px dashed rgba(236,232,223,.14)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'relative', isolation: 'isolate', maxWidth: '600px', width: '100%' }}>
        {code ? (
          <p aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: '-0.42em', margin: 0, zIndex: -1, fontFamily: "var(--font-dm-serif),'Times New Roman',serif", fontSize: 'clamp(140px,34vw,300px)', lineHeight: 1, color: 'transparent', WebkitTextStroke: '1px rgba(236,232,223,.12)', userSelect: 'none', pointerEvents: 'none' }}>{code}</p>
        ) : null}
        <p style={{ margin: '0 0 18px', fontSize: '12px', fontWeight: 700, letterSpacing: '.34em', color: GOLD }}>{eyebrow}</p>
        <h1 style={{ margin: 0, fontFamily: "var(--font-dm-serif),'Times New Roman',serif", fontWeight: 400, fontSize: 'clamp(34px,7vw,64px)', lineHeight: 1.02, letterSpacing: '.01em', textWrap: 'balance' }}>{title}</h1>
        <p style={{ margin: '20px auto 0', maxWidth: '44ch', fontSize: '17px', lineHeight: 1.6, color: 'rgba(236,232,223,.8)', textWrap: 'pretty' }}>{children}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>{actions}</div>
        {after}
      </div>
    </main>
  );
}
