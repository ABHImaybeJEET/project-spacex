'use client';

import ErrorScreen, { GhostFill, ghostAction, primaryAction } from './ErrorScreen';

/**
 * Branded crash screen shared by app/error.tsx and app/global-error.tsx. Three ways back in: retry re-renders the
 * failed part, reload starts the page afresh, and home is a full page load of the home page (a plain <a>, not a
 * client-side navigation through the app that just crashed).
 */
export default function ErrorFallback({ retry, digest }: { retry: () => void; digest?: string }) {
  return (
    <ErrorScreen
      role="alert"
      eyebrow="SIGNAL LOST"
      title="We drifted off course."
      actions={
        <>
          <button type="button" onClick={() => retry()} style={primaryAction}>TRY AGAIN</button>
          <button type="button" onClick={() => location.reload()} style={ghostAction}>
            <GhostFill />
            RELOAD PAGE
          </button>
        </>
      }
      after={
        <>
          <p style={{ margin: '24px 0 0', fontSize: '14px', color: 'rgba(236,232,223,.7)' }}>
            Still stuck?{' '}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full page load on purpose, not a client navigation through the app that just crashed */}
            <a href="/" style={{ color: '#ECE8DF', fontWeight: 700, textUnderlineOffset: '4px' }}>Go back to the home page</a>
          </p>
          {digest ? <p style={{ margin: '20px 0 0', fontSize: '12px', letterSpacing: '.12em', color: 'rgba(236,232,223,.5)' }}>REFERENCE {digest}</p> : null}
        </>
      }
    >
      Something went wrong while drawing this part of Innovision 2026. Try again, or reload the page if it keeps happening.
    </ErrorScreen>
  );
}
