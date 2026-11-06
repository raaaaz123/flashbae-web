import type { Metadata } from "next";
import type { CSSProperties } from "react";
import JsonLd from "@/components/JsonLd";
import LookPrints from "@/components/LookPrints";
import { ALL_LOOKS, LOOKS, LOOKS_UPDATED, formatDate } from "@/lib/looks";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI photo looks and filters",
  description: `All ${ALL_LOOKS.length} Flashbae AI looks with before and after photos: digicam flash, golden hour, Y2K camera, night-out templates and more.`,
  alternates: { canonical: "/looks/" },
};

export default function LooksPage() {
  const effects = LOOKS.filter((l) => l.kind === "effect");
  const templates = LOOKS.filter((l) => l.kind === "template");
  // Live looks the admin hasn't given example photos (the AI booth styles): named, and one tap from the generator.
  const styles = ALL_LOOKS.filter((l) => !l.before || !l.after);
  return (
    <div className="page sp">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Flashbae AI looks",
          itemListElement: LOOKS.map((l, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/looks/${l.slug}/`, name: l.title })),
        }}
      />
      <header className="page-head">
        <h1>Every look, before and after</h1>
        <p>
          Effects re-shoot your own photo and keep your scene. Templates put you in a new scene.
          Hover a look to see the photo it started from.
        </p>
        <div style={{ marginTop: 16 }}>
          <a href="/ai-photo-generator/" className="btn btn-store btn-small">
            ✨ Open AI Generator Studio
          </a>
        </div>
        <p className="meta" style={{ marginTop: 14 }}>Updated <time dateTime={LOOKS_UPDATED}>{formatDate(LOOKS_UPDATED)}</time> · {ALL_LOOKS.length} looks</p>
      </header>
      {[
        { title: "Effects", items: effects },
        { title: "Templates", items: templates },
      ].map((group) => (
        <section key={group.title} className="section-tight" aria-labelledby={`g-${group.title}`}>
          <h2 id={`g-${group.title}`}>{group.title}</h2>
          <LookPrints looks={group.items} wrap />
        </section>
      ))}
      {styles.length > 0 && (
        <section className="section-tight" aria-labelledby="g-styles">
          <h2 id="g-styles">More styles</h2>
          <ul className="style-chips">
            {styles.map((l) => (
              <li key={l.id}>
                <a href={`/ai-photo-generator/?look=${l.id}`} style={{ "--chip": l.accent } as CSSProperties}>
                  <strong>{l.title}</strong>
                  {l.tagline && <span>{l.tagline}</span>}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="section-tight prose" aria-labelledby="how-looks-work">
        <h2 id="how-looks-work">How AI looks work</h2>
        <p>
          Pick a look and add a selfie. An <strong>effect</strong> keeps your photo as it is and re-shoots the light and colour:
          a direct digicam flash, golden-hour sun, warm film or a cool Y2K camera. A <strong>template</strong> keeps your face
          and pose and puts you in a new scene, like a subway platform at night or a neon collage.
        </p>
        <p>
          A result takes about 15 seconds. You can fade it back toward your original with the intensity slider, then save or
          share it. Try any look in the browser with the <a href="/ai-photo-generator/">AI photo generator</a>, or in the
          Flashbae app on iPhone.
        </p>
        <h3>Is my photo kept?</h3>
        <p>
          No. The photo you pick is sent to Google&apos;s Gemini image model only to make your result. The upload isn&apos;t
          kept, and Google doesn&apos;t train on it.
        </p>
        <h3>Want a film look without AI?</h3>
        <p>
          The <a href="/free-tools/">free tools</a> run entirely on your device: a <a href="/digicam-filter/">digicam filter</a>,
          a <a href="/y2k-filter/">Y2K filter</a>, a <a href="/disposable-camera-filter/">disposable camera filter</a> and
          an <a href="/online-photo-booth/">online photo booth</a>. Nothing is uploaded.
        </p>
      </section>
    </div>
  );
}
