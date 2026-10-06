import type { Metadata, Viewport } from "next";
import { APP_STORE_ID, META_DESCRIPTION, NAME, SITE_URL, STORE_NAME, TAGLINE } from "@/lib/site";
import SiteShell from "@/components/SiteShell";

// Each page sets its own canonical URL; a canonical here would leak "/" onto every page that forgot one.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${NAME} — ${TAGLINE}`, template: `%s · ${NAME}` },
  description: META_DESCRIPTION,
  applicationName: NAME,
  keywords: ["photo booth app", "AI photo booth", "AI photo editor", "digicam filter", "vintage film camera", "y2k filter",
             "photo strip", "couples photo booth", "long distance photo booth", "disposable camera app", "flash filter", "aesthetic filter"],
  openGraph: { type: "website", siteName: NAME, locale: "en_US", title: STORE_NAME, description: META_DESCRIPTION, url: "/", images: ["/og.jpg"] },
  twitter: { card: "summary_large_image", title: STORE_NAME, description: META_DESCRIPTION, images: ["/og.jpg"] },
  // Safari shows a "Get the app" banner once the App Store id is known.
  ...(APP_STORE_ID ? { itunes: { appId: APP_STORE_ID } } : {}),
};

export const viewport: Viewport = { themeColor: "#FFE6EE" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
