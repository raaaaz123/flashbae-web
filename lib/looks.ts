import raw from "./looks.json";

export type Look = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  kind: "effect" | "template";
  premium: boolean;
  trending: boolean;
  before: string;
  after: string;
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
    before: l.before,
    after: l.after,
  }));

export const lookBySlug = (slug: string) => LOOKS.find((l) => l.slug === slug);

/** The pairs the hero develops, in order: the most flattering transformations first. */
export const HERO_SLUGS = ["dreamlight", "sun-kissed", "dream-motion", "soft-flash", "y2k-flash", "disposable-flash", "cozy-flash"];
export const HERO_LOOKS = HERO_SLUGS.map(lookBySlug).filter((l): l is Look => !!l);
