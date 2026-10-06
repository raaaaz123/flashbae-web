import { Analytics } from "@vercel/analytics/next";
import { Fraunces, Figtree } from "next/font/google";
import type { Locale } from "@/lib/i18n";
import { CHROME } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/app/globals.css";

// Fraunces at full softness: round, bouncy serifs that suit a cute brand without going childish.
// Japanese and Korean text falls through to the system's own fonts (Hiragino, Apple SD Gothic Neo).
const display = Fraunces({ subsets: ["latin"], axes: ["SOFT", "WONK", "opsz"], variable: "--font-display", display: "swap" });
const body = Figtree({ subsets: ["latin"], variable: "--font-body", display: "swap" });

/** The document every root layout renders: one per language, so each page carries the right `lang`. */
export default function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={locale} className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip" href="#main">{CHROME[locale].skip}</a>
        <Header locale={locale} />
        <main id="main">{children}</main>
        <Footer locale={locale} />
        <Analytics />
      </body>
    </html>
  );
}
