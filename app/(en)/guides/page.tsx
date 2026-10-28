import type { Metadata } from "next";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import GetApp from "@/components/GetApp";
import JsonLd from "@/components/JsonLd";
import { GUIDES } from "@/lib/guides";
import { NAME, SITE_URL } from "@/lib/site";

const PATH = "/guides/";
const DESCRIPTION = "How to make a photo strip on iPhone, get the Y2K flash look, and pose in a photo booth, from the makers of Flashbae.";

export const metadata: Metadata = {
  title: "Photo booth guides",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `Photo booth guides · ${NAME}`, description: DESCRIPTION, url: PATH },
};

/** The guides, plus the feature pages, which answer the same kinds of questions. */
/** A photo for each guide's card, from the look closest to its subject. */
const COVERS: Record<string, string> = {
  "y2k-flash-photos": "/looks/disposable-flash-after.jpg",
  "photo-strip-on-iphone": "/looks/face-roll-after.jpg",
  "photo-booth-pose-ideas": "/looks/cozy-flash-after.jpg",
};

const FEATURES = [
  { href: "/online-photo-booth/", title: "Free online photo booth", text: "Take a strip with your webcam or phone camera, right in the browser." },
  { href: "/photo-strip-maker/", title: "Free photo strip maker", text: "Turn photos you already have into a booth strip." },
  { href: "/long-distance-photo-booth/", title: "Long-distance photo booth", text: "Shoot one strip together on live video, both phones flashing at once." },
  { href: "/digicam-filter/", title: "Digicam and Y2K flash filters", text: "Three ways to get the 2000s point-and-shoot look on iPhone." },
  { href: "/films/", title: "All the film looks", text: "Every booth film, from 1930s booth to cinema film, and which are free." },
];

export default function Guides() {
  return (
    <div className="article sp">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            crumbSchema([{ name: "Guides", path: PATH }]),
            {
              "@type": "ItemList",
              name: `${NAME} guides`,
              itemListElement: GUIDES.map((g, i) => ({ "@type": "ListItem", position: i + 1, name: g.title, url: `${SITE_URL}/guides/${g.slug}/` })),
            },
          ],
        }}
      />
      <header className="sp-head">
        <div className="sp-glow" aria-hidden="true" />
        <Crumbs trail={[{ name: "Guides", path: PATH }]} />
        <p className="sp-badge">From the makers of {NAME}</p>
        <h1>Photo booth <em>guides</em></h1>
        <p className="lede">{DESCRIPTION}</p>
      </header>
      <section className="section-tight" aria-labelledby="guides-title">
        <h2 id="guides-title" className="sr-only">Guides</h2>
        <ul className="cards">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <a className="card card-media" href={`/guides/${g.slug}/`}>
                <span className="card-art" aria-hidden="true">
                  {COVERS[g.slug] ? <img src={COVERS[g.slug]} alt="" loading="lazy" /> : <span className="card-art-icon">📖</span>}
                  <span className="card-art-tag">Guide</span>
                </span>
                <h3>{g.title}</h3>
                <p>{g.description}</p>
                <span className="card-more">Read the guide</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section className="section-tight" aria-labelledby="features-title">
        <div className="sp-section-head">
          <div>
            <span className="sp-eyebrow">Keep exploring</span>
            <h2 id="features-title">More from the booth</h2>
          </div>
        </div>
        <ul className="cards">
          {FEATURES.map((f) => (
            <li key={f.href}>
              <a className="card" href={f.href}>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
                <span className="card-more">Open</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <GetApp title="Then try it yourself" text="Download Flashbae: the photo booth, the countdown and the flash are free." />
    </div>
  );
}
