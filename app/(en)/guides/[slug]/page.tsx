import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import Faq, { faqSchema } from "@/components/Faq";
import GetApp from "@/components/GetApp";
import JsonLd from "@/components/JsonLd";
import { GUIDES, guideBySlug } from "@/lib/guides";
import { formatDate } from "@/lib/looks";
import { NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = guideBySlug((await params).slug);
  if (!g) return {};
  const path = `/guides/${g.slug}/`;
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: path },
    openGraph: { type: "article", title: g.title, description: g.description, url: path, publishedTime: g.published, modifiedTime: g.updated },
  };
}

export default async function GuidePage({ params }: Props) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();
  const path = `/guides/${g.slug}/`;
  const trail = [{ name: "Guides", path: "/guides/" }, { name: g.short, path }];
  const others = GUIDES.filter((o) => o.slug !== g.slug);

  return (
    <div className="article">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: g.title,
              description: g.description,
              datePublished: g.published,
              dateModified: g.updated,
              image: `${SITE_URL}/og.jpg`,
              mainEntityOfPage: `${SITE_URL}${path}`,
              author: { "@id": `${SITE_URL}/#org` },
              publisher: { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: NAME, logo: `${SITE_URL}/icon.png` },
            },
            ...(g.steps ? [{
              "@type": "HowTo",
              name: g.title,
              description: g.description,
              step: g.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
            }] : []),
            ...(g.faq ? [faqSchema(g.faq)] : []),
            crumbSchema(trail),
          ],
        }}
      />
      <Crumbs trail={trail} />
      <header className="article-head">
        <h1>{g.title}</h1>
        <p className="lede">{g.description}</p>
        <p className="meta">Updated <time dateTime={g.updated}>{formatDate(g.updated)}</time></p>
      </header>

      <div className="article-body">
        <article className="prose">
          {g.steps && (
            <>
              <h2 id="quick">The short version</h2>
              <ol className="steps">
                {g.steps.map((s) => <li key={s.name}><strong>{s.name}.</strong> {s.text}</li>)}
              </ol>
            </>
          )}
          {g.body}
        </article>
        <nav className="toc" aria-label="More guides">
          <h2>More guides</h2>
          {others.map((o) => <a key={o.slug} href={`/guides/${o.slug}/`}>{o.short}</a>)}
          <a href="/guides/">All guides</a>
        </nav>
      </div>

      {g.faq && <Faq items={g.faq} />}
      <GetApp title="Try it in the booth" text="Download Flashbae: the photo booth, the countdown and the flash are free." />
    </div>
  );
}
