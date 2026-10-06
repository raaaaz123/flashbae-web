import type { Metadata } from "next";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import GetApp from "@/components/GetApp";
import JsonLd from "@/components/JsonLd";
import { NAME, SITE_URL } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

const PATH = "/free-tools/";
const DESCRIPTION =
  "Free photo booth tools that run in your browser: an online photo booth, a photo strip maker, a digicam date stamp and printable strip templates. No sign-up; nothing is uploaded.";

export const metadata: Metadata = {
  title: "Free photo booth tools",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `Free photo booth tools · ${NAME}`, description: DESCRIPTION, url: PATH },
};


export default function FreeTools() {
  return (
    <div className="article">
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
      <Crumbs trail={[{ name: "Free tools", path: PATH }]} />
      <header className="article-head">
        <h1>Free photo booth tools</h1>
        <p className="lede">{DESCRIPTION}</p>
      </header>
      <section className="section-tight" aria-labelledby="tools-title">
        <h2 id="tools-title" className="sr-only">Tools</h2>
        <ul className="cards">
          {TOOLS.map((t) => (
            <li key={t.href}>
              <a className="card" href={t.href}>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
                <span className="card-more">Open the tool</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <GetApp title="The whole booth, on iPhone" text="33 films, booth together over live video, and AI looks. Free to download." />
    </div>
  );
}
