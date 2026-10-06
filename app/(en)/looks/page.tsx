import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import LookPrints from "@/components/LookPrints";
import { LOOKS, LOOKS_UPDATED, formatDate } from "@/lib/looks";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI photo looks and filters",
  description: `All ${LOOKS.length} Flashbae AI looks with before and after photos: digicam flash, golden hour, Y2K camera, night-out templates and more. New looks every week.`,
  alternates: { canonical: "/looks/" },
};

export default function LooksPage() {
  const effects = LOOKS.filter((l) => l.kind === "effect");
  const templates = LOOKS.filter((l) => l.kind === "template");
  return (
    <div className="page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Flashbae AI looks",
          itemListElement: LOOKS.map((l, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/looks/${l.slug}/`, name: l.title })),
        }}
      />
      <header className="page-head">
        <h1>Every look, before and after</h1>
        <p>
          Effects re-shoot your own photo and keep your scene. Templates put you in a new scene.
          Hover a look to see the photo it started from.
        </p>
        <p className="meta">Updated <time dateTime={LOOKS_UPDATED}>{formatDate(LOOKS_UPDATED)}</time> · {LOOKS.length} looks</p>
      </header>
      {[
        { title: "Effects", items: effects },
        { title: "Templates", items: templates },
      ].map((group) => (
        <section key={group.title} className="section-tight" aria-labelledby={`g-${group.title}`}>
          <h2 id={`g-${group.title}`}>{group.title}</h2>
          <LookPrints looks={group.items} wrap />
        </section>
      ))}
    </div>
  );
}
