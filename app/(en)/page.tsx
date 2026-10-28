import JsonLd from "@/components/JsonLd";
import AppStoreButton from "@/components/AppStoreButton";
import HeroArc from "@/components/landing/HeroArc";
import MagicPolaroids from "@/components/landing/MagicPolaroids";
import StudioShowcase from "@/components/landing/StudioShowcase";
import LooksMarquee from "@/components/landing/LooksMarquee";
import type { Metadata } from "next";
import { ALT_NAMES, APP_STORE_ID, APP_STORE_URL, BOOTH, DESCRIPTION, FAQ, LEGAL, NAME, SITE_URL, STORE_NAME } from "@/lib/site";
import { GUIDES } from "@/lib/guides";
import { HOME_ALTERNATES } from "@/lib/i18n";
import { LOOKS } from "@/lib/looks";
import "./landing.css";

export const metadata: Metadata = { alternates: { canonical: "/", languages: HOME_ALTERNATES } };

const UPLOAD_ICON = (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 16V4m0 0-5 5m5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
);

/** The booth strip on the phone: four frames from the same night. */
const STRIP = ["soft-flash", "cozy-flash", "sun-kissed", "dreamlight"].map((id) => `/looks/${id}-after.jpg`);

export default function Home() {
  return (
    <div className="lp">
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
            // name + alternateName is what Google uses for the site name in results and for brand searches, misspellings included.
            {
              "@type": "Organization", "@id": `${SITE_URL}/#org`, name: NAME, alternateName: ALT_NAMES, url: SITE_URL,
              logo: `${SITE_URL}/icon.png`, ...(APP_STORE_ID ? { sameAs: [APP_STORE_URL] } : {}),
            },
            {
              "@type": "WebSite", "@id": `${SITE_URL}/#site`, name: NAME, alternateName: [STORE_NAME, ...ALT_NAMES], url: SITE_URL,
              inLanguage: "en", publisher: { "@id": `${SITE_URL}/#org` },
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ],
        }}
      />

      {/* ---------- hero ---------- */}
      <section className="lp-hero" aria-labelledby="hero-title">
        <div className="lp-glow" aria-hidden="true" />
        <HeroArc />
        <div className="lp-hero-copy">
          <p className="lp-badge"><span className="lp-badge-dot" />{LOOKS.length} AI looks · free to try</p>
          <h1 id="hero-title">
            Your selfie, <em>re-shot</em> by AI
          </h1>
          <p className="lp-lede">
            Digicam flash, golden hour, night-out scenes. Keep your face and pose, change the whole mood in seconds.
          </p>
          <a className="lp-drop" href="/ai-photo-generator/">
            <span className="lp-drop-icon">{UPLOAD_ICON}</span>
            <span className="lp-drop-title">Upload a selfie to start</span>
            <span className="lp-drop-sub">JPG, PNG or HEIC · 5 free photos with Google sign-in</span>
          </a>
          <div className="lp-hero-alt">
            <span>Already made some?</span>
            <a className="btn btn-store btn-small" href="/my-photos/">My photos</a>
          </div>
        </div>
      </section>

      <ul className="lp-stats" aria-label="Flashbae in numbers">
        <li><strong>{LOOKS.length}</strong><span>AI looks &amp; scenes</span></li>
        <li><strong>{BOOTH.films}</strong><span>film looks in the booth</span></li>
        <li><strong>{BOOTH.layouts}</strong><span>photo strip layouts</span></li>
        <li><strong>{BOOTH.languages}</strong><span>languages</span></li>
      </ul>

      {/* ---------- before / after ---------- */}
      <section className="lp-section" id="looks" aria-labelledby="magic-title">
        <div className="lp-head">
          <p className="lp-eyebrow">Before &amp; after</p>
          <h2 id="magic-title">See the <em>magic</em> of an AI look</h2>
          <p>Same selfie, same face, same pose. Pick a look and watch the light, the colour and the whole scene change.</p>
        </div>
        <MagicPolaroids />
      </section>

      {/* ---------- studio ---------- */}
      <section className="lp-section lp-section-tint" id="looks-gallery" aria-labelledby="studio-title">
        <div className="lp-head">
          <p className="lp-eyebrow">The AI studio</p>
          <h2 id="studio-title">One selfie, <em>every</em> mood</h2>
          <p>Five studios, one photo. Switch the mood, pick a look and drag across the shot to see exactly what changed.</p>
        </div>
        <StudioShowcase />
      </section>

      {/* ---------- all looks ---------- */}
      <section className="lp-section lp-section-bleed" aria-labelledby="all-title">
        <div className="lp-head lp-head-row">
          <div>
            <p className="lp-eyebrow">The look book</p>
            <h2 id="all-title">Every look, one tap away</h2>
          </div>
          <a className="lp-btn lp-btn-ghost" href="/looks/">Browse all looks</a>
        </div>
        <LooksMarquee />
      </section>

      {/* ---------- steps ---------- */}
      <section className="lp-section" aria-labelledby="steps-title">
        <div className="lp-head">
          <p className="lp-eyebrow">How it works</p>
          <h2 id="steps-title">A new photo in <em>three</em> steps</h2>
          <p>No studio, no presets, no editing skills. Just the selfie you already have.</p>
        </div>
        <ol className="lp-steps">
          <li className="lp-step">
            <span className="lp-step-no">Step 1</span>
            <div className="lp-step-art lp-step-upload">
              <span className="lp-drop-icon">{UPLOAD_ICON}</span>
              <span className="lp-step-btn">Upload photo</span>
            </div>
            <h3>Add your selfie</h3>
            <p>Any clear photo of your face works: front camera, mirror shot or an old favourite.</p>
          </li>
          <li className="lp-step">
            <span className="lp-step-no">Step 2</span>
            <div className="lp-step-art lp-step-pick">
              {["sun-kissed", "cozy-flash", "midnight-flash", "dreamlight", "disposable-flash", "subway-still"].map((id, i) => (
                <img key={id} src={`/looks/${id}-after.jpg`} alt="" loading="lazy" className={i === 1 ? "is-on" : undefined} />
              ))}
            </div>
            <h3>Pick a look</h3>
            <p>Golden hour, digicam flash, a night-out scene or a quick fix for closed eyes.</p>
          </li>
          <li className="lp-step">
            <span className="lp-step-no">Step 3</span>
            <div className="lp-step-art lp-step-done">
              <img src="/looks/sun-kissed-before.jpg" alt="" loading="lazy" />
              <img src="/looks/sun-kissed-after.jpg" alt="" loading="lazy" />
              <span className="lp-step-check" aria-hidden="true">
                <svg viewBox="0 0 20 20" width="16" height="16"><path d="m5 10.5 3 3 7-7" /></svg>
              </span>
            </div>
            <h3>Download &amp; share</h3>
            <p>Your new photo is ready in seconds. Save it, post it, or fade it back with the intensity slider.</p>
          </li>
        </ol>
        <div className="lp-center">
          <a className="lp-btn lp-btn-dark" href="/ai-photo-generator/">Try it free in your browser</a>
        </div>
      </section>

      {/* ---------- the iPhone booth ---------- */}
      <section className="lp-section" id="booth" aria-labelledby="booth-title">
        <div className="lp-booth">
          <div className="lp-booth-copy">
            <p className="lp-eyebrow">On iPhone</p>
            <h2 id="booth-title">The photo booth <em>in your pocket</em></h2>
            <p>
              The app is a real photo booth: a 3-2-1 countdown, pose prompts and a flash, then a strip you can dress up
              with film looks, frames, stickers and the date.
            </p>
            <ul className="lp-checks">
              <li><strong>{BOOTH.layouts} strip layouts</strong> Classic, 4-cut, Trio and 6-cut</li>
              <li><strong>{BOOTH.films} film looks</strong> {BOOTH.freeFilms} of them free</li>
              <li><strong>Booth together</strong> over live video; both phones flash at once</li>
              <li><strong>Every AI look</strong> plus a before/after reveal video</li>
            </ul>
            <div className="lp-booth-actions">
              <AppStoreButton href={APP_STORE_URL} />
              <a className="lp-link" href="/photo-booth-app/">How the booth works →</a>
            </div>
          </div>
          <div className="lp-booth-art" aria-hidden="true">
            <div className="lp-booth-glow" />
            <div className="lp-phone">
              <div className="lp-phone-notch" />
              <div className="lp-phone-screen">
                <div className="lp-strip">
                  {STRIP.map((src) => <img key={src} src={src} alt="" loading="lazy" />)}
                  <span>flashbae · {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>
            <span className="lp-float lp-float-1">🎞️ {BOOTH.films} films</span>
            <span className="lp-float lp-float-2">📹 Live together</span>
            <span className="lp-float lp-float-3">⏱ 3 · 2 · 1</span>
          </div>
        </div>
      </section>

      {/* ---------- guides ---------- */}
      <section className="lp-section" aria-labelledby="guides-title">
        <div className="lp-head lp-head-row">
          <div>
            <p className="lp-eyebrow">Guides</p>
            <h2 id="guides-title">Tips from the booth</h2>
          </div>
          <a className="lp-btn lp-btn-ghost" href="/guides/">All guides</a>
        </div>
        <ul className="lp-guides">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <a className="lp-guide" href={`/guides/${g.slug}/`}>
                <h3>{g.title}</h3>
                <p>{g.description}</p>
                <span className="lp-link">Read the guide →</span>
              </a>
            </li>
          ))}
          <li>
            <a className="lp-guide" href="/digicam-filter/">
              <h3>Digicam, disposable and Y2K flash filters</h3>
              <p>Three ways to get the 2000s point-and-shoot flash on iPhone: booth films, AI looks and the film editor.</p>
              <span className="lp-link">See the flash looks →</span>
            </a>
          </li>
        </ul>
      </section>

      {/* ---------- faq ---------- */}
      <section className="lp-section" id="faq" aria-labelledby="faq-title">
        <div className="lp-faq">
          <div className="lp-faq-head">
            <p className="lp-eyebrow">FAQ</p>
            <h2 id="faq-title">Questions, answered</h2>
            <p>Something else on your mind? <a className="lp-link" href={LEGAL.support}>Ask us</a> and we&apos;ll get back to you.</p>
          </div>
          <div className="lp-faq-list">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- outro ---------- */}
      <section className="lp-outro" aria-labelledby="outro-title">
        <div className="lp-outro-card">
          <div className="lp-glow" aria-hidden="true" />
          <div className="lp-outro-fan" aria-hidden="true">
            {["dreamlight", "cozy-flash", "sun-kissed", "midnight-flash", "soft-flash"].map((id) => (
              <img key={id} src={`/looks/${id}-after.jpg`} alt="" loading="lazy" />
            ))}
          </div>
          <h2 id="outro-title">Say <em>cheese</em></h2>
          <p>Pick a look and re-shoot your selfie in seconds. Free to try, nothing to install.</p>
          <div className="lp-outro-actions">
            <a className="lp-btn lp-btn-dark" href="/ai-photo-generator/">✨ Generate your photo</a>
            <AppStoreButton href={APP_STORE_URL} light />
          </div>
        </div>
      </section>
    </div>
  );
}
