import type { Metadata } from "next";
import AIToolStudio from "@/components/AIToolStudio";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import Faq, { faqSchema } from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { AI_TOOLS, aiToolBySlug, type AITool } from "@/lib/aiTools";
import { NAME, SITE_URL, seoTitle } from "@/lib/site";

const tool = (slug: string): AITool => aiToolBySlug(slug)!;

export function aiToolMetadata(slug: string): Metadata {
  const t = tool(slug);
  const path = `/${t.slug}/`;
  return {
    title: seoTitle(t.title),
    description: t.description,
    alternates: { canonical: path },
    openGraph: { title: t.title, description: t.description, url: path },
  };
}

/** The h1 with its accent word set in the italic gradient, like the home page. */
function Headline({ t }: { t: AITool }) {
  const i = t.h1.toLowerCase().indexOf(t.accent.toLowerCase());
  if (i < 0) return <h1>{t.h1}</h1>;
  return <h1>{t.h1.slice(0, i)}<em>{t.h1.slice(i, i + t.accent.length)}</em>{t.h1.slice(i + t.accent.length)}</h1>;
}

/** An AI photo tool page: the studio up top, then the how-to, tips and answers for the search it's named after. */
export default function AIToolLanding({ slug }: { slug: string }) {
  const t = tool(slug);
  const path = `/${t.slug}/`;
  const trail = [{ name: "Free tools", path: "/free-tools/" }, { name: t.name, path }];
  const related = t.related.map((s) => AI_TOOLS.find((o) => o.slug === s)).filter((o): o is AITool => Boolean(o));
  return (
    <div className="article sp ait-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: `${NAME} ${t.name}`,
              url: `${SITE_URL}${path}`,
              description: t.description,
              applicationCategory: "PhotographyApplication",
              operatingSystem: "Any",
              browserRequirements: "A modern browser",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "5 free photos with Google sign-in" },
              publisher: { "@id": `${SITE_URL}/#org` },
            },
            {
              "@type": "HowTo",
              name: `How to use the ${t.name.toLowerCase()}`,
              step: t.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
            },
            faqSchema(t.faq),
            crumbSchema(trail),
          ],
        }}
      />
      <header className="sp-head">
        <div className="sp-glow" aria-hidden="true" />
        <Crumbs trail={trail} />
        <p className="sp-badge">AI · 5 free photos · about 15 seconds</p>
        <Headline t={t} />
        <p className="lede">{t.lede}</p>
      </header>

      <AIToolStudio tool={t} />

      <section className="section-tight" aria-labelledby="how">
        <div className="sp-section-head"><h2 id="how">How it works</h2></div>
        <ol className="ait-steps">
          {t.steps.map((s, i) => (
            <li key={s.name}><span className="ait-step-n">{i + 1}</span><h3>{s.name}</h3><p>{s.text}</p></li>
          ))}
        </ol>
      </section>

      <section className="section-tight" aria-labelledby="tips">
        <div className="sp-section-head"><h2 id="tips">Tips for the best result</h2></div>
        <ul className="cards">
          {t.tips.map((tip) => (
            <li key={tip.title} className="card"><h3>{tip.title}</h3><p>{tip.text}</p></li>
          ))}
        </ul>
      </section>

      <Faq items={t.faq} title={`${t.name} questions`} />

      <section className="section-tight" aria-labelledby="more">
        <div className="sp-section-head"><h2 id="more">More AI photo tools</h2></div>
        <ul className="cards cards-row">
          {related.map((r) => (
            <li key={r.slug}>
              <a className="card card-media" href={`/${r.slug}/`}>
                <span className="card-art" aria-hidden="true"><span className="card-art-icon">{r.icon}</span></span>
                <h3>{r.name}</h3>
                <p>{r.lede}</p>
                <span className="card-more">Open it</span>
              </a>
            </li>
          ))}
          <li>
            <a className="card card-media" href="/free-tools/">
              <span className="card-art" aria-hidden="true"><span className="card-art-icon">🎞️</span></span>
              <h3>Free photo booth tools</h3>
              <p>Online photo booth, strip maker, digicam filters and more. No sign-up, nothing uploaded.</p>
              <span className="card-more">See them all</span>
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
