/* eslint-disable @next/next/no-img-element -- decorative layers are animated directly by GSAP */
import { createContext, useContext } from 'react';
import { CONTACTS } from './data';
import type { V } from './types';

/** The latest render values, for parts of memoised views that must track state. */
export const LiveV = createContext<V | null>(null);

/** The footer inside the (never re-rendering) home view: its Events link follows the current world. */
export function LiveFooter() {
  const v = useContext(LiveV);
  return v && <SiteFooter v={v} />;
}

/** Rounded starfield footer. */
export default function SiteFooter({ v }: { v: V }) {
  return (
    <footer data-sec="footer" style={{ position: "relative", zIndex: 10, overflow: "hidden", background: "#141312", color: "#ECE8DF", borderRadius: "50% 50% 0 0 / clamp(36px,12vw,140px) clamp(36px,12vw,140px) 0 0", padding: "clamp(72px,13vw,150px) clamp(20px,4vw,64px) calc(clamp(16px,2.6vw,44px) + 90px)" }}>
      <img decoding="async" src="/assets/starfield.svg" alt="" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", opacity: ".6", pointerEvents: "none" }} />
      <div style={{ position: "relative", maxWidth: "1240px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "48px 40px", paddingBottom: "56px", borderBottom: "1px solid rgba(236,232,223,.16)" }}>
          <div style={{ flex: "2 1 340px", minWidth: "0", maxWidth: "460px" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: "400", fontSize: "clamp(30px,3.2vw,48px)", letterSpacing: ".04em" }}>INNOVISION</div>
            <div style={{ marginTop: "8px", fontSize: "13px", letterSpacing: ".3em", color: "rgba(236,232,223,.75)" }}>THE CELESTIAL ODYSSEY · NIT ROURKELA</div>
          </div>
          <nav aria-label="Explore" style={{ flex: "1 1 140px" }}>
            <p style={{ margin: "0 0 18px", fontSize: "12px", fontWeight: "700", letterSpacing: ".3em", color: "oklch(0.8 0.12 85)" }}>EXPLORE</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {v.footLinks.map((l, lI) => (
                <a key={lI} href={l.href} onClick={l.onClick} style={{ textDecoration: "none", color: "#ECE8DF", fontSize: "15px", opacity: ".82", transition: "opacity .3s" }} className="hv-link-paper">{l.name}</a>
              ))}
            </div>
          </nav>
          <nav aria-label="Worlds" style={{ flex: "1 1 160px" }}>
            <p style={{ margin: "0 0 18px", fontSize: "12px", fontWeight: "700", letterSpacing: ".3em", color: "oklch(0.8 0.12 85)" }}>WORLDS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Real pages for search engines and new tabs (src/app/events); a plain click opens the world in the explorer. */}
              {v.worlds.map((w, wI) => (
                <a key={wI} href={w.pageHref} onClick={w.openPage} style={{ textDecoration: "none", color: "#ECE8DF", fontSize: "15px", opacity: ".82", transition: "opacity .3s" }} className="hv-link-paper">{w.name}</a>
              ))}
              <a href={v.eventsHref} onClick={v.openEvents} style={{ textDecoration: "none", color: "#ECE8DF", fontSize: "15px", opacity: ".82", transition: "opacity .3s" }} className="hv-link-paper">All events</a>
            </div>
          </nav>
          <nav aria-label="Connect" style={{ flex: "1 1 140px" }}>
            <p style={{ margin: "0 0 18px", fontSize: "12px", fontWeight: "700", letterSpacing: ".3em", color: "oklch(0.8 0.12 85)" }}>CONNECT</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <a href="https://www.instagram.com/inno.nitr_official?psln=bWNqdmk1c3V4eWFl" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#ECE8DF", fontSize: "15px", opacity: ".82", transition: "opacity .3s" }} className="hv-link-paper">Instagram</a>
              <a href="https://www.linkedin.com/company/innovision-nitrkl/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#ECE8DF", fontSize: "15px", opacity: ".82", transition: "opacity .3s" }} className="hv-link-paper">LinkedIn</a>
              <a href="#about" onClick={v.openAbout} style={{ textDecoration: "none", color: "#ECE8DF", fontSize: "15px", opacity: ".82", transition: "opacity .3s" }} className="hv-link-paper">About the fest</a>
            </div>
          </nav>
          <div aria-label="Contact us" role="group" style={{ flex: "1 1 180px" }}>
            <p style={{ margin: "0 0 18px", fontSize: "12px", fontWeight: "700", letterSpacing: ".3em", color: "oklch(0.8 0.12 85)" }}>CONTACT US</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {CONTACTS.map((c) => (
                <div key={c.phone} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "15px", color: "#ECE8DF" }}>{c.name}</span>
                  <a href={"tel:+91" + c.phone} style={{ textDecoration: "none", color: "#ECE8DF", fontSize: "15px", opacity: ".82", transition: "opacity .3s", letterSpacing: ".04em" }} className="hv-link-paper">+91 {c.phone.slice(0, 5)} {c.phone.slice(5)}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 32px", justifyContent: "space-between", alignItems: "center", paddingTop: "28px", fontSize: "14px", color: "rgba(236,232,223,.78)" }}>
          <span style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px" }}>
            <span>© 2026 Innovision · NIT Rourkela, Odisha</span>
            <a href="/privacy" style={{ color: "#ECE8DF", textDecoration: "none", opacity: ".82", transition: "opacity .3s" }} className="hv-link-paper">Privacy Policy</a>
            <a href="/terms" style={{ color: "#ECE8DF", textDecoration: "none", opacity: ".82", transition: "opacity .3s" }} className="hv-link-paper">Terms and Conditions</a>
          </span>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#ECE8DF", textShadow: "0 0 10px rgba(236, 232, 223, 0.4)" }}>Crafted with <span style={{ color: "oklch(0.72 0.13 25)" }}>♥</span> by <a href="https://opencodenitr.in/" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "none", textShadow: "0 0 15px rgba(255,255,255,0.7)" }}>OpenCode NIT Rourkela</a></span>
          <a href="#top" onClick={v.toTop} onMouseEnter={v.hover} style={{ display: "inline-block", color: "#ECE8DF", textDecoration: "none", fontWeight: "500", letterSpacing: ".06em" }}>
            <span data-scr="">BACK TO ORBIT ↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
