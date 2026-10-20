import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { INDEXABLE, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/config/site";
import { TITLE_TEMPLATE } from "@/lib/seo";
import "./globals.css";

// Typography (roles and weights: globals.css, "typography"). Display: DM Serif Display, which has one weight.
const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

// Text: Manrope is a variable font, so every weight from 200 to 800 comes from one file.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

// Defaults for every page; each public page adds its own title, description and canonical URL (src/lib/seo.ts).
// No canonical here: a layout's would be inherited by every page that forgot its own, pointing them all at the home page.
export const metadata: Metadata = {
  // Relative URLs in metadata (canonical, og:url, og:image) resolve against the canonical origin, never the request's Host.
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: TITLE_TEMPLATE },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Preview deployments must not compete with the official site in search results (src/config/site.ts).
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_IN", title: SITE_TITLE, description: SITE_DESCRIPTION },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
  // Google Search Console HTML-tag verification: set GOOGLE_SITE_VERIFICATION to the token's content value.
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
