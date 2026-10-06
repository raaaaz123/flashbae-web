import FlashHero from "@/components/FlashHero";
import BeforeAfter from "@/components/BeforeAfter";
import BoothStrip from "@/components/BoothStrip";
import Together from "@/components/Together";
import AppStoreButton from "@/components/AppStoreButton";
import Sticker from "@/components/Sticker";
import Ribbon from "@/components/Ribbon";
import Mascot from "@/components/Mascot";
import JsonLd from "@/components/JsonLd";
import { HERO_LOOKS, LOOKS, lookBySlug } from "@/lib/looks";
import { APP_STORE_URL, BOOTH, DESCRIPTION, FAQ, LEGAL, NAME, SITE_URL, STORE_NAME } from "@/lib/site";

const img = (slug: string, side: "before" | "after") => lookBySlug(slug)?.[side] ?? "";

export default function Home() {
  const compareLooks = HERO_LOOKS.slice(0, 6);
  const strip = ["subway-motion", "midnight-flash", "subway-still", "neon-collage"]
    .map((s) => lookBySlug(s))
    .filter((l) => !!l)
    .map((l) => ({ src: l!.after, alt: `Photo booth frame in the ${l!.title} look` }));

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
              description: DESCRIPTION,
              operatingSystem: "iOS 17 or later",
              applicationCategory: "PhotographyApplication",
              applicationSubCategory: "Photo booth",
              inLanguage: ["en", "ja", "de", "fr", "ko", "es", "pt-BR", "it", "zh-Hant", "zh-Hans", "nl", "ar", "tr", "id"],
              downloadUrl: APP_STORE_URL,
              image: `${SITE_URL}/og.jpg`,
              offers: { "@type": "Offer", name: "Free download", price: "0", priceCurrency: "USD" },
              featureList: [
                `Photo booth strips in ${BOOTH.layouts} layouts with a 3-2-1 countdown and pose prompts`,
                `${BOOTH.films} film looks, ${BOOTH.freeFilms} free`,
                "Booth together with a friend over live video, both phones flash at the same moment",
                "AI looks: digicam flash, night flash, golden hour, Y2K and scene templates",
                "Before/after reveal video",
                "Free on-device film editor with face retouch",
              ],
            },
            { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: NAME, url: SITE_URL, logo: `${SITE_URL}/icon.png` },
            { "@type": "WebSite", "@id": `${SITE_URL}/#site`, name: NAME, url: SITE_URL, publisher: { "@id": `${SITE_URL}/#org` } },
            {
              "@type": "FAQPage",
              mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ],
        }}
      />

      <section className="hero">
        <div className="hero-copy">
          <Sticker kind="sparkle" size={46} className="st-hero-1" spin={-8} />
          <Sticker kind="heart" size={38} className="st-hero-2" delay={1.2} spin={12} />
          <h1>The photo booth that lives in your phone</h1>
          <p className="lede">
            Shoot a four-frame strip with {BOOTH.films} film looks, booth with your bestie from across the world,
            or let AI re-shoot your selfie in digicam flash, golden hour or Y2K.
          </p>
          <div className="hero-actions">
            <AppStoreButton href={APP_STORE_URL} />
            <p className="fine">Free on iPhone and iPad</p>
          </div>
        </div>
        <FlashHero looks={HERO_LOOKS.concat(LOOKS.filter((l) => !HERO_LOOKS.includes(l) && l.kind === "template"))} />
      </section>

      <Ribbon />

      <section className="panel panel-milk" aria-labelledby="looks-title">
        <Sticker kind="star" size={50} className="st-tr" delay={0.4} spin={10} />
        <Sticker kind="flower" size={44} className="st-bl" delay={2} spin={-10} />
        <div className="section-head">
          <h2 id="looks-title">Same selfie, a whole new mood</h2>
          <p>
            Pick a look, add a photo, and AI re-shoots it in that light. Your face and pose stay yours.
            Drag across the photo to compare.
          </p>
        </div>
        <BeforeAfter looks={compareLooks} />
      </section>

      <section className="section section-booth" id="booth" aria-labelledby="booth-title">
        <div className="booth-art">
          <Sticker kind="sparkle" size={40} className="st-booth-1" delay={0.8} />
          <Sticker kind="flower" size={46} className="st-booth-2" delay={1.6} spin={14} />
          <BoothStrip frames={strip} caption="best night ever" />
        </div>
        <div className="booth-copy">
          <h2 id="booth-title">A real photo booth, minus the queue</h2>
          <ol className="steps">
            <li><strong>Pick a layout.</strong> Classic, 4-cut, Trio or 6-cut.</li>
            <li><strong>Strike the pose it suggests.</strong> 3, 2, 1, flash, four times over.</li>
            <li><strong>Make it yours.</strong> {BOOTH.films} films from 1930s booth to CCD cam, frames, stickers, a caption and the date.</li>
            <li><strong>Take it with you.</strong> Save the strip, post it as a Story, or print a sheet.</li>
          </ol>
          <p className="fine">The booth and {BOOTH.freeFilms} of its films are free, forever.</p>
        </div>
      </section>

      <section className="panel panel-lilac section-together" aria-labelledby="together-title">
        <Sticker kind="heart" size={46} className="st-tl" delay={0.3} spin={-12} />
        <Sticker kind="heart" size={30} className="st-tl-2" delay={1.4} spin={16} />
        <Sticker kind="sparkle" size={42} className="st-br" delay={2.2} />
        <div className="section-head section-head-center">
          <h2 id="together-title">Booth together when you&apos;re miles apart</h2>
          <p>
            Send your partner or best friend a link. You see and hear each other live, both phones count down
            together and flash at the same moment, and you get one strip with both of you in it.
          </p>
        </div>
        <Together
          a={{ name: "Mia", before: img("midnight-flash", "before"), after: img("midnight-flash", "after") }}
          b={{ name: "Lena", before: img("soft-flash", "before"), after: img("soft-flash", "after") }}
        />
      </section>

      <section className="section" aria-labelledby="gallery-title">
        <div className="section-head section-head-row">
          <h2 id="gallery-title">New looks drop every week</h2>
          <a className="text-link" href="/looks/">See all {LOOKS.length} looks</a>
        </div>
        <ul className="gallery">
          {LOOKS.slice(0, 10).map((l) => (
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

      <Ribbon tone="butter" tilt={2} />

      <section className="section section-faq" id="faq" aria-labelledby="faq-title">
        <div className="section-head">
          <h2 id="faq-title">Questions, answered</h2>
          <p>Something else on your mind? <a className="text-link" href={LEGAL.support}>Ask us</a> and we&apos;ll get back to you.</p>
        </div>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="panel panel-cherry outro" aria-labelledby="outro-title">
        <Sticker kind="sparkle" size={52} className="st-tl" delay={0.2} spin={-10} />
        <Sticker kind="heart" size={40} className="st-tr" delay={1.1} spin={14} />
        <Sticker kind="star" size={44} className="st-bl" delay={1.8} spin={-6} />
        <Sticker kind="flower" size={46} className="st-br" delay={0.6} spin={8} />
        <Mascot />
        <h2 id="outro-title">Say cheese</h2>
        <p>Tap the camera, then go take a real one.</p>
        <AppStoreButton href={APP_STORE_URL} light />
      </section>
    </>
  );
}
