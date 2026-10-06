import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Compare } from "@/components/BeforeAfter";
import AppStoreButton from "@/components/AppStoreButton";
import JsonLd from "@/components/JsonLd";
import { LOOKS, lookBySlug } from "@/lib/looks";
import { APP_STORE_URL, NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return LOOKS.map((l) => ({ slug: l.slug }));
}

/** What the look is, in words a search engine (or an AI answer) can quote. */
function summary(l: NonNullable<ReturnType<typeof lookBySlug>>) {
  const what = l.kind === "template"
    ? `${l.title} is a ${NAME} AI template: it puts you, from your own selfie, into a new scene.`
    : `${l.title} is a ${NAME} AI photo effect: it restyles the light and colour of your own selfie.`;
  return `${what} ${l.tagline}`.trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = lookBySlug((await params).slug);
  if (!l) return {};
  return {
    title: `${l.title} — AI ${l.kind === "template" ? "photo template" : "photo filter"}`,
    description: summary(l),
    alternates: { canonical: `/looks/${l.slug}/` },
    openGraph: { title: `${l.title} on ${NAME}`, description: summary(l), images: [l.after] },
  };
}

export default async function LookPage({ params }: Props) {
  const l = lookBySlug((await params).slug);
  if (!l) notFound();
  const others = LOOKS.filter((o) => o.slug !== l.slug && o.kind === l.kind).slice(0, 6);

  return (
    <div className="page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "HowTo",
              name: `How to get the ${l.title} look on your photo`,
              description: summary(l),
              image: `${SITE_URL}${l.after}`,
              step: [
                { "@type": "HowToStep", position: 1, text: `Open ${NAME} on your iPhone and pick ${l.title} in Looks.` },
                { "@type": "HowToStep", position: 2, text: l.kind === "template" ? "Add a clear selfie of each person in the scene." : "Add a selfie from your camera or gallery." },
                { "@type": "HowToStep", position: 3, text: "Tap Make it. Your photo is ready in about 15 seconds; slide the intensity to taste, then save or share." },
              ],
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: NAME, item: SITE_URL },
                { "@type": "ListItem", position: 2, name: "Looks", item: `${SITE_URL}/looks/` },
                { "@type": "ListItem", position: 3, name: l.title, item: `${SITE_URL}/looks/${l.slug}/` },
              ],
            },
          ],
        }}
      />
      <nav aria-label="Breadcrumb" className="crumbs">
        <a href="/looks/">Looks</a> <span aria-hidden="true">/</span> <span>{l.title}</span>
      </nav>
      <div className="look">
        <div className="look-frame"><Compare look={l} priority /></div>
        <div className="look-copy">
          <p className="look-kind">{l.kind === "template" ? "Template" : "Effect"}{l.trending ? ", trending now" : ""}</p>
          <h1>{l.title}</h1>
          <p className="lede">{summary(l)}</p>
          <ol className="steps">
            <li>Open {NAME} and pick <strong>{l.title}</strong> in Looks.</li>
            <li>{l.kind === "template" ? "Add a clear selfie." : "Add a selfie from your camera or gallery."}</li>
            <li>Tap <strong>Make it</strong>. About 15 seconds later it&apos;s yours to save or share.</li>
          </ol>
          <AppStoreButton href={APP_STORE_URL} />
        </div>
      </div>
      {others.length > 0 && (
        <section className="section-tight" aria-labelledby="more-title">
          <h2 id="more-title">More {l.kind === "template" ? "templates" : "effects"}</h2>
          <ul className="gallery gallery-wrap">
            {others.map((o) => (
              <li key={o.slug}>
                <a href={`/looks/${o.slug}/`} className="print">
                  <span className="print-photo">
                    <img src={o.after} alt={`${o.title} AI look`} loading="lazy" />
                    <img src={o.before} alt="" loading="lazy" className="print-before" />
                  </span>
                  <span className="print-title">{o.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
