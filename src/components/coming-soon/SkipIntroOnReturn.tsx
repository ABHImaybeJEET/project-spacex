"use client";
import { useEffect } from 'react';

/** sessionStorage flag: the next home page load in this tab opens straight on its view, without the loader. */
export const SKIP_INTRO_KEY = 'inv_skip_intro';

/**
 * Rendered by the teaser pages (/register, /merch): whichever way the visitor goes back home from here
 * (BACK, the logo, BACK TO INNOVISION, the browser's back button), they skip the landing animation.
 * Innovision#boot reads and clears the flag.
 */
export default function SkipIntroOnReturn() {
  useEffect(() => {
    try { sessionStorage.setItem(SKIP_INTRO_KEY, '1'); } catch {}
  }, []);
  return null;
}
