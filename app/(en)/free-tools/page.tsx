import type { Metadata } from "next";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import GetApp from "@/components/GetApp";
import JsonLd from "@/components/JsonLd";
import { NAME, SITE_URL } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

const PATH = "/free-tools/";
const DESCRIPTION =
  "Free photo booth tools and games that run in your browser: an online photo booth, a photo strip maker, a digicam date stamp, " +
  "a pose generator, an aesthetic quiz and printable strip templates. No sign-up; nothing is uploaded.";

export const metadata: Metadata = {
  title: "Free photo booth tools and games",
  description: DESCRIPTION,
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
              itemListElement: TOOLS.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.title, url: `${SITE_URL}${t.href}` })),
            },
          ],
        }}
      />
      <header className="sp-head">
        <div className="sp-glow" aria-hidden="true" />
        <Crumbs trail={[{ name: "Free tools", path: PATH }]} />
        <p className="sp-badge">Free · no sign-up · runs in your browser</p>
        <h1>Free photo booth <em>tools</em></h1>
        <p className="lede">{DESCRIPTION}</p>
      </header>
      <section className="section-tight" aria-labelledby="tools-title">
        <h2 id="tools-title" className="sr-only">Tools</h2>
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
                <img src="/looks/sun-kissed-after.jpg" alt="" loading="lazy" />
                <span className="card-art-tag">✨ AI</span>
              </span>
              <h3>AI photo studio</h3>
              <p>Re-shoot a selfie in digicam flash, golden hour or a whole new scene. 5 free photos when you sign in with Google.</p>
              <span className="card-more">Open the studio</span>
            </a>
          </li>
        </ul>
      </section>
      <GetApp title="The whole booth, on iPhone" text="33 films, booth together over live video, and AI looks. Free to download." />
    </div>
  );
}
