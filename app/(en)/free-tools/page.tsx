import type { Metadata } from "next";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import GetApp from "@/components/GetApp";
import JsonLd from "@/components/JsonLd";
import { NAME, SITE_URL, seoTitle } from "@/lib/site";
import { LANDINGS } from "@/lib/landings";
import { TOOLS } from "@/lib/tools";
import { AI_TOOLS } from "@/lib/aiTools";

const PATH = "/free-tools/";
const DESCRIPTION =
  "Free AI photo tools (background changer, object remover, old photo restorer, headshots, hairstyles) and photo booth tools " +
  "that run in your browser: an online photo booth, a photo strip maker, a digicam date stamp and printable strip templates.";

/** The search-result snippet: under 155 characters, so it isn't cut. */
const META =
  "Free AI photo tools and photo booth tools: background changer, object remover, photo restorer, AI headshots, online photo booth and strip maker.";

export const metadata: Metadata = {
  title: seoTitle("Free AI photo tools and photo booth tools"),
  description: META,
  alternates: { canonical: PATH },
  openGraph: { title: `Free photo booth tools · ${NAME}`, description: DESCRIPTION, url: PATH },
};


export default function FreeTools() {
  return (
    <div className="article sp">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            crumbSchema([{ name: "Free tools", path: PATH }]),
            {
              "@type": "ItemList",
              name: `${NAME} free tools`,
              itemListElement: [...AI_TOOLS.map((t) => ({ name: t.name, href: `/${t.slug}/` })), ...TOOLS.map((t) => ({ name: t.title, href: t.href })), ...LANDINGS.map((l) => ({ name: l.name, href: `/${l.slug}/` }))]
                .map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: `${SITE_URL}${t.href}` })),
            },
          ],
        }}
      />
      <header className="sp-head">
        <div className="sp-glow" aria-hidden="true" />
        <Crumbs trail={[{ name: "Free tools", path: PATH }]} />
        <p className="sp-badge">AI tools · photo booth tools · free</p>
        <h1>Free AI photo <em>tools</em></h1>
        <p className="lede">{DESCRIPTION}</p>
      </header>
      <section className="section-tight" aria-labelledby="ai-title">
        <div className="sp-section-head">
          <div>
            <h2 id="ai-title">AI photo tools</h2>
            <p>Change a background, remove people, restore an old photo, try a haircut. 5 free photos when you sign in with Google.</p>
          </div>
        </div>
        <ul className="cards cards-row">
          {AI_TOOLS.map((t) => (
            <li key={t.slug}>
              <a className="card card-media" href={`/${t.slug}/`}>
                <span className="card-art" aria-hidden="true"><span className="card-art-icon">{t.icon}</span><span className="card-art-tag">✨ AI</span></span>
                <h3>{t.name}</h3>
                <p>{t.lede}</p>
                <span className="card-more">Open it</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section className="section-tight" aria-labelledby="tools-title">
        <div className="sp-section-head"><h2 id="tools-title">Photo booth tools</h2></div>
        <ul className="cards cards-row">
          {TOOLS.map((t) => (
            <li key={t.href}>
              <a className="card card-media" href={t.href}>
                <span className="card-art" aria-hidden="true"><span className="card-art-icon">{t.icon}</span></span>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
                <span className="card-more">Open the tool</span>
              </a>
            </li>
          ))}
          <li>
            <a className="card card-media" href="/ai-photo-generator/">
              <span className="card-art" aria-hidden="true">
                <img src="/looks/sun-kissed-after.webp" alt="" loading="lazy" />
                <span className="card-art-tag">✨ AI</span>
              </span>
              <h3>AI photo studio</h3>
              <p>Re-shoot a selfie in digicam flash, golden hour or a whole new scene. 5 free photos when you sign in with Google.</p>
              <span className="card-more">Open the studio</span>
            </a>
          </li>
        </ul>
      </section>
      <section className="section-tight" aria-labelledby="presets-title">
        <h2 id="presets-title">Filters and booths, ready to go</h2>
        <ul className="cards cards-row">
          {LANDINGS.map((l) => (
            <li key={l.slug}>
              <a className="card card-media" href={`/${l.slug}/`}>
                <span className="card-art" aria-hidden="true"><span className="card-art-icon">{l.icon}</span></span>
                <h3>{l.name}</h3>
                <p>{l.description}</p>
                <span className="card-more">Open it</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <GetApp title="The whole booth, on iPhone" text="33 films, booth together over live video, and AI looks. Free to download." />
    </div>
  );
}
