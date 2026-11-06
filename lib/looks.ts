// Looks come from the backend's /looks (the same catalog the iOS app shows); nothing is listed by hand.
// next.config.ts fetches it at build time into FLASHBAE_CATALOG; useLiveLooks() re-reads it in the browser.

export type Look = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  /** Category title from the admin, e.g. "Flash". */
  category: string;
  categoryId: string;
  kind: "effect" | "template";
  premium: boolean;
  trending: boolean;
  /** People the look puts in the photo (templates can take two). */
  people: number;
  /** Example photos from the admin; empty for looks without any (the AI booth styles). */
  before: string;
  after: string;
  /** The after photo, for social previews and structured data. */
  afterJpg: string;
  /** A colour for looks without photos. */
  accent: string;
  /** YYYY-MM-DD the look was added. */
  added: string;
};

export type Category = { id: string; title: string };

type ApiLook = {
  id: string; title: string; tagline?: string; kind?: string; category?: string; premium?: boolean; trending?: boolean;
  people?: number; accent?: string; before_url?: string | null; after_url?: string | null; preview_url?: string | null;
  added_at?: number | null; dropped_at?: number | null;
};
export type ApiCatalog = { looks: ApiLook[]; categories: { id: string; title: string; order?: number }[]; trending: string[] };

export const API = (process.env.NEXT_PUBLIC_FLASHBAE_API || "https://vocavoy.dietly.life/flashbie").replace(/\/$/, "");
const BUILT = new Date().toISOString().slice(0, 10);

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const day = (secs?: number | null) => {
  if (!secs) return "";
  return new Date((secs > 1e12 ? secs : secs * 1000)).toISOString().slice(0, 10);
};

export function toLooks(cat: ApiCatalog): { looks: Look[]; categories: Category[] } {
  const categories = [...(cat.categories ?? [])]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((c) => ({ id: c.id, title: c.title }));
  const titles = Object.fromEntries(categories.map((c) => [c.id, c.title]));
  const trending = new Set(cat.trending ?? []);
  const seen = new Set<string>();
  const looks = (cat.looks ?? []).map((l) => {
    let slug = slugify(l.title) || l.id;
    if (seen.has(slug)) slug = l.id;       // two looks with the same title still get their own page
    seen.add(slug);
    const after = l.after_url || l.preview_url || "";
    return {
      id: l.id,
      slug,
      title: l.title.charAt(0).toUpperCase() + l.title.slice(1),
      // The admin sometimes wraps taglines in quotes.
      tagline: (l.tagline || "").replace(/^[“"]|[”"]$/g, "").trim(),
      category: titles[l.category ?? ""] ?? l.category ?? "",
      categoryId: l.category ?? "",
      kind: l.kind === "template" ? "template" : "effect",
      premium: !!l.premium,
      trending: !!l.trending || trending.has(l.id),
      people: l.people ?? 1,
      before: l.before_url || "",
      after,
      afterJpg: after,
      accent: l.accent || "#2B2238",
      added: day(l.added_at) || day(l.dropped_at) || BUILT,
    } satisfies Look;
  });
  return { looks, categories };
}

export const built = toLooks(JSON.parse(process.env.FLASHBAE_CATALOG || '{"looks":[],"categories":[],"trending":[]}'));

/** Every live look in the admin, including ones without example photos (the AI booth styles). */
export const ALL_LOOKS: Look[] = built.looks;
export const CATEGORIES: Category[] = built.categories;
/** Looks with a before/after pair: the galleries and the /looks/<slug>/ pages. */
export const LOOKS: Look[] = ALL_LOOKS.filter((l) => l.before && l.after);

export const lookBySlug = (slug: string) => ALL_LOOKS.find((l) => l.slug === slug);
export const lookById = (id: string) => ALL_LOOKS.find((l) => l.id === id);

/** The pairs the hero develops, in order: the most flattering transformations first. */
export const HERO_SLUGS = ["dreamlight", "sun-kissed", "dream-motion", "soft-flash", "y2k-flash", "disposable-flash", "cozy-flash"];
export const HERO_LOOKS = HERO_SLUGS.map(lookBySlug).filter((l): l is Look => !!l && !!l.before && !!l.after);

/** The newest look's date: when the catalog last changed. */
export const LOOKS_UPDATED = ALL_LOOKS.reduce((d, l) => (l.added > d ? l.added : d), "") || BUILT;

/** An image URL as an absolute URL (API images already are; files in public/ are not). */
export const absImage = (url: string, site: string) => (/^https?:/.test(url) ? url : `${site}${url}`);

/** A look's photo through the API, which sends CORS headers (the media host doesn't): for WebGL and for fetch(). */
export const corsImage = (look: Look, which: "before" | "after", w = 900) =>
  `${API}/looks/${encodeURIComponent(look.id)}/image/${which}?w=${w}`;

/** "October 5, 2026", for the pages. */
export const formatDate = (iso: string, locale = "en-US") =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
