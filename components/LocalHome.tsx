import AppStoreButton from "@/components/AppStoreButton";
import BoothStrip from "@/components/BoothStrip";
import Faq, { faqSchema } from "@/components/Faq";
import FlashHero from "@/components/FlashHero";
import GetApp from "@/components/GetApp";
import JsonLd from "@/components/JsonLd";
import LookPrints from "@/components/LookPrints";
import Ribbon from "@/components/Ribbon";
import Sticker from "@/components/Sticker";
import { CHROME } from "@/lib/i18n";
import { HOMES } from "@/lib/locales";
import { HERO_LOOKS, LOOKS, lookBySlug } from "@/lib/looks";
import { APP_STORE_URL, NAME, SITE_URL, STORE_NAME } from "@/lib/site";

/** The Japanese or Korean home page: the English home's story, told from the localized App Store copy. */
export default function LocalHome({ locale }: { locale: "ja" | "ko" }) {
  const t = HOMES[locale];
  const download = CHROME[locale].download;
  const strip = ["subway-motion", "midnight-flash", "subway-still", "neon-collage"]
    .map((s) => lookBySlug(s))
    .filter((l) => !!l)
    .map((l) => ({ src: l!.after, alt: l!.title }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "MobileApplication",
              "@id": `${SITE_URL}/#app`,
              name: STORE_NAME,
              alternateName: NAME,
              description: t.description,
              inLanguage: locale,
              operatingSystem: "iOS 17 or later",
              applicationCategory: "PhotographyApplication",
              downloadUrl: APP_STORE_URL,
              image: `${SITE_URL}/og.jpg`,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            },
            { "@type": "WebPage", "@id": `${SITE_URL}/${locale}/`, name: t.title, inLanguage: locale, about: { "@id": `${SITE_URL}/#app` } },
            faqSchema(t.faq.items),
          ],
        }}
      />

      <section className="hero">
        <div className="hero-copy">
          <Sticker kind="sparkle" size={46} className="st-hero-1" spin={-8} />
          <Sticker kind="heart" size={38} className="st-hero-2" delay={1.2} spin={12} />
          <h1>{t.hero.title}</h1>
          <p className="lede">{t.hero.lede}</p>
          <div className="hero-actions">
            <AppStoreButton href={APP_STORE_URL} label={download} />
            <p className="fine">{t.hero.fine}</p>
          </div>
        </div>
        <FlashHero looks={HERO_LOOKS.concat(LOOKS.filter((l) => !HERO_LOOKS.includes(l) && l.kind === "template"))} text={t.heroText} />
      </section>

      <Ribbon />

      <section className="panel panel-milk" id="looks" aria-labelledby="looks-title">
        <Sticker kind="star" size={50} className="st-tr" delay={0.4} spin={10} />
        <div className="section-head section-head-row">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <h2 id="looks-title">{t.looks.title}</h2>
            <p>{t.looks.text}</p>
          </div>
          <a className="text-link" href="/looks/" hrefLang="en">{t.looks.all}</a>
        </div>
        <LookPrints looks={LOOKS.slice(0, 10)} />
      </section>

      <section className="section section-booth" id="booth" aria-labelledby="booth-title">
        <div className="booth-art">
          <Sticker kind="sparkle" size={40} className="st-booth-1" delay={0.8} />
          <BoothStrip frames={strip} caption={t.booth.caption} />
        </div>
        <div className="booth-copy">
          <h2 id="booth-title">{t.booth.title}</h2>
          <ol className="steps">
            {t.booth.steps.map(([head, text]) => <li key={head}><strong>{head}</strong> {text}</li>)}
          </ol>
          <p className="fine">{t.booth.fine}</p>
        </div>
      </section>

      <section className="panel panel-lilac" id="together" aria-labelledby="together-title">
        <Sticker kind="heart" size={46} className="st-tl" delay={0.3} spin={-12} />
        <Sticker kind="sparkle" size={42} className="st-br" delay={2.2} />
        <div className="section-head section-head-center">
          <h2 id="together-title">{t.together.title}</h2>
          <p>{t.together.text}</p>
        </div>
        <ol className="steps" style={{ maxWidth: "36rem", margin: "0 auto" }}>
          {t.together.steps.map((s) => <li key={s}>{s}</li>)}
        </ol>
        <p className="fine" style={{ textAlign: "center", marginTop: 24 }}>{t.together.fine}</p>
      </section>

      <section className="section" aria-labelledby="films-title">
        <div className="section-head">
          <h2 id="films-title">{t.films.title}</h2>
          <p>{t.films.text}</p>
        </div>
        <ul className="facts">{t.films.names.map((n) => <li key={n}>{n}</li>)}</ul>
        <div className="section-head" style={{ marginTop: 64 }}>
          <h2>{t.editor.title}</h2>
        </div>
        <ul className="cards">
          {t.editor.points.map((p) => <li key={p}><div className="card"><p>{p}</p></div></li>)}
        </ul>
      </section>

      <Ribbon tone="butter" tilt={2} />

      <Faq items={t.faq.items} title={t.faq.title} />

      <GetApp title={t.outro.title} text={t.outro.text} label={download} mascot={t.mascot} />
    </>
  );
}
