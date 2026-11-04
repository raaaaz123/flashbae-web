import type { Metadata } from "next";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import Faq, { faqSchema } from "@/components/Faq";
import GetApp from "@/components/GetApp";
import JsonLd from "@/components/JsonLd";
import DateStamp from "@/components/booth/DateStamp";
import OnlineBooth from "@/components/booth/OnlineBooth";
import type { Landing } from "@/lib/landings";
import { LANDINGS } from "@/lib/landings";
import { NAME, SITE_URL, seoTitle } from "@/lib/site";

const landing = (slug: string) => LANDINGS.find((l) => l.slug === slug)!;

export function landingMetadata(slug: string): Metadata {
  const l = landing(slug);
  const path = `/${l.slug}/`;
  return {
    title: seoTitle(l.title),
    description: l.description,
    alternates: { canonical: path },
    openGraph: { title: l.title, description: l.description, url: path },
  };
}

/** A free tool, preset for one search, with the answers to what people ask about it. */
export default function ToolLanding({ slug }: { slug: string }) {
  const l: Landing = landing(slug);
  const path = `/${l.slug}/`;
  const booth = l.tool.kind === "booth";
  const steps = booth
    ? ["Allow the camera", "Strike a pose for each frame as the booth counts down 3, 2, 1 and flashes", "Pick a film, a frame and a caption", "Download your strip"]
    : ["Choose a photo from your device", "Pick a film and, if you like, the date stamp", "Download the photo"];
  return (
    <div className="article">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: `${NAME} ${l.name.toLowerCase()}`,
              url: `${SITE_URL}${path}`,
              description: l.description,
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Any",
              browserRequirements: booth ? "A modern browser with camera access" : "A modern browser",
              isAccessibleForFree: true,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              publisher: { "@id": `${SITE_URL}/#org` },
            },
            {
              "@type": "HowTo",
              name: l.h1,
              step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s, text: s })),
            },
            faqSchema(l.faq),
            crumbSchema([{ name: "Free tools", path: "/free-tools/" }, { name: l.name, path }]),
          ],
        }}
      />
      <Crumbs trail={[{ name: "Free tools", path: "/free-tools/" }, { name: l.name, path }]} />
      <header className="article-head">
        <h1>{l.h1}</h1>
        <p className="lede">{l.lede}</p>
      </header>

      {l.tool.kind === "booth"
        ? <OnlineBooth layoutId={l.tool.layoutId} filmId={l.tool.filmId} />
        : <DateStamp filmId={l.tool.filmId} stamp={l.tool.stamp} />}

      <div className="article-body">
        <div className="prose">
          <h2 id="how">How it works</h2>
          <ol className="steps">{steps.map((s) => <li key={s}>{s}.</li>)}</ol>
          {l.sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
            </section>
          ))}
          <p>
            More free tools: {l.related.map((r, i) => (
              <span key={r.href}>{i > 0 && ", "}<a href={r.href}>{r.label}</a></span>
            ))}, or see <a href="/free-tools/">every free tool</a>.
          </p>
        </div>
        <nav className="toc" aria-label="On this page">
          <h2>On this page</h2>
          <a href="#how">How it works</a>
          <a href="#faq">Questions</a>
          {l.related.map((r) => <a key={r.href} href={r.href}>{r.label}</a>)}
        </nav>
      </div>

      <Faq items={l.faq} title={`${l.name} questions`} />
      <GetApp title="The full booth is on iPhone" text="33 films, booth together over live video, and AI looks." />
    </div>
  );
}
