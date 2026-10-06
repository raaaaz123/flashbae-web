import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree } from "next/font/google";
import { APP_STORE_ID, META_DESCRIPTION, NAME, SITE_URL, STORE_NAME, TAGLINE } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

// Fraunces at full softness: round, bouncy serifs that suit a cute brand without going childish.
const display = Fraunces({ subsets: ["latin"], axes: ["SOFT", "WONK", "opsz"], variable: "--font-display", display: "swap" });
const body = Figtree({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${NAME} — ${TAGLINE}`, template: `%s · ${NAME}` },
  description: META_DESCRIPTION,
  applicationName: NAME,
  keywords: ["photo booth app", "AI photo booth", "AI photo editor", "digicam filter", "vintage film camera", "y2k filter",
             "photo strip", "couples photo booth", "disposable camera app", "flash filter", "aesthetic filter"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: NAME, title: STORE_NAME, description: META_DESCRIPTION, url: "/", images: ["/og.jpg"] },
  twitter: { card: "summary_large_image", title: STORE_NAME, description: META_DESCRIPTION, images: ["/og.jpg"] },
  // Safari shows a "Get the app" banner once the App Store id is known.
  ...(APP_STORE_ID ? { itunes: { appId: APP_STORE_ID } } : {}),
};

export const viewport: Viewport = { themeColor: "#FFE6EE" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
