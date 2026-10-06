import type { MetadataRoute } from "next";
import { LOOKS } from "@/lib/looks";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/looks/`, changeFrequency: "weekly", priority: 0.8 },
    ...LOOKS.map((l) => ({ url: `${SITE_URL}/looks/${l.slug}/`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
