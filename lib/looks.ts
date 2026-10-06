import raw from "./looks.json";

export type Look = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  kind: "effect" | "template";
  premium: boolean;
  trending: boolean;
  /** People the look puts in the photo (templates can take two). */
  people: number;
  before: string;
  after: string;
  /** YYYY-MM-DD the look first appeared on the site. */
  added: string;
};

/** Kept off the website: people who look like celebrities, or a trademark or film poster in the shot. */
const HIDDEN = new Set(["red-after-dark", "motion-rush", "cover-girl", "y2k-flash"]);

/** Looks whose admin tagline is empty. */
const TAGLINES: Record<string, string> = {
  dreamlight: "A soft sunset glow that makes any selfie look like golden hour.",
};

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const LOOKS: Look[] = raw
  .filter((l) => !HIDDEN.has(l.id))
  .map((l) => ({
    slug: slugify(l.title),
    title: l.title.charAt(0).toUpperCase() + l.title.slice(1),
    // The admin sometimes wraps taglines in quotes.
    tagline: (l.tagline || TAGLINES[l.id] || "").replace(/^[“"]|[”"]$/g, "").trim(),
    category: l.category,
    kind: l.kind === "template" ? "template" : "effect",
    premium: l.premium,
    trending: l.trending,
    people: l.people ?? 1,
    before: l.before,
    after: l.after,
    added: l.added,
  }));

export const lookBySlug = (slug: string) => LOOKS.find((l) => l.slug === slug);

/** The pairs the hero develops, in order: the most flattering transformations first. */
export const HERO_SLUGS = ["dreamlight", "sun-kissed", "dream-motion", "soft-flash", "y2k-flash", "disposable-flash", "cozy-flash"];
export const HERO_LOOKS = HERO_SLUGS.map(lookBySlug).filter((l): l is Look => !!l);

/** The newest look's date: when the catalog last changed. */
export const LOOKS_UPDATED = LOOKS.reduce((d, l) => (l.added > d ? l.added : d), "");

/** "October 5, 2026", for the pages. */
export const formatDate = (iso: string, locale = "en-US") =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
