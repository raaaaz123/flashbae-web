import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { LOOKS } from "@/lib/looks";
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
          Effects restyle the light and colour of your own photo. Templates put you in a new scene.
          Hover a look to see the photo it started from.
        </p>
      </header>
      {[
        { title: "Effects", items: effects },
        { title: "Templates", items: templates },
      ].map((group) => (
        <section key={group.title} className="section-tight" aria-labelledby={`g-${group.title}`}>
          <h2 id={`g-${group.title}`}>{group.title}</h2>
          <ul className="gallery gallery-wrap">
            {group.items.map((l) => (
              <li key={l.slug}>
                <a href={`/looks/${l.slug}/`} className="print">
                  <span className="print-photo">
                    <img src={l.after} alt={`${l.title} AI look`} loading="lazy" />
                    <img src={l.before} alt="" loading="lazy" className="print-before" />
                  </span>
                  <span className="print-title">{l.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
