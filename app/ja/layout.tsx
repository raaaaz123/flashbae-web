import type { Metadata, Viewport } from "next";
import SiteShell from "@/components/SiteShell";
import { HOMES } from "@/lib/locales";
import { APP_STORE_ID, NAME, SITE_URL } from "@/lib/site";

const t = HOMES.ja;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: t.title, template: `%s · ${NAME}` },
  description: t.description,
  applicationName: NAME,
  openGraph: { type: "website", siteName: NAME, locale: t.ogLocale, title: t.title, description: t.description, url: "/ja/", images: ["/og.jpg"] },
  twitter: { card: "summary_large_image", title: t.title, description: t.description, images: ["/og.jpg"] },
  ...(APP_STORE_ID ? { itunes: { appId: APP_STORE_ID } } : {}),
};

export const viewport: Viewport = { themeColor: "#FFE6EE" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="ja">{children}</SiteShell>;
}
