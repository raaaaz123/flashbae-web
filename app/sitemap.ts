import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";
import { HOME_ALTERNATES } from "@/lib/i18n";
import { LOOKS, LOOKS_UPDATED } from "@/lib/looks";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const abs = (path: string) => `${SITE_URL}${path}`;
const homeLanguages = Object.fromEntries(Object.entries(HOME_ALTERNATES).map(([k, v]) => [k, abs(v)]));

/** Feature pages, newest first. Bump a date when its page changes meaningfully. */
const PAGES = [
  { path: "/online-photo-booth/", updated: "2026-10-06", priority: 0.9 },
  { path: "/photo-strip-maker/", updated: "2026-10-06", priority: 0.9 },
  { path: "/photo-booth-app/", updated: "2026-10-06", priority: 0.9 },
  { path: "/long-distance-photo-booth/", updated: "2026-10-06", priority: 0.9 },
  { path: "/digicam-filter/", updated: "2026-10-06", priority: 0.8 },
  { path: "/films/", updated: "2026-10-06", priority: 0.7 },
  { path: "/guides/", updated: "2026-10-06", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["/", "/ja/", "/ko/"].map((path) => ({
      url: abs(path), lastModified: LOOKS_UPDATED, changeFrequency: "weekly" as const, priority: 1,
      alternates: { languages: homeLanguages },
    })),
    { url: abs("/looks/"), lastModified: LOOKS_UPDATED, changeFrequency: "weekly", priority: 0.8 },
    ...PAGES.map((p) => ({ url: abs(p.path), lastModified: p.updated, changeFrequency: "monthly" as const, priority: p.priority })),
    ...GUIDES.map((g) => ({ url: abs(`/guides/${g.slug}/`), lastModified: g.updated, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...LOOKS.map((l) => ({ url: abs(`/looks/${l.slug}/`), lastModified: l.added, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
