import type { Metadata } from "next";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import Faq, { faqSchema } from "@/components/Faq";
import GetApp from "@/components/GetApp";
import JsonLd from "@/components/JsonLd";
import StripMaker from "@/components/booth/StripMaker";
import { WEB_FILMS } from "@/lib/booth";
import { NAME, SITE_URL } from "@/lib/site";

const PATH = "/photo-strip-maker/";
const TITLE = "Free photo strip maker";
const DESCRIPTION =
  "Turn three or four of your photos into a photo booth strip, free. Pick a layout, a film and a frame colour, add a caption and the date, " +
  "and download it. Works on your phone; nothing is uploaded.";

export const metadata: Metadata = {
  title: `${TITLE}: make a photo booth strip from your photos`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `${TITLE} · ${NAME}`, description: DESCRIPTION, url: PATH },
};

const STEPS = [
  { name: "Pick a layout", text: "Classic (four frames in a strip), 4-cut (a two-by-two grid) or Trio (three frames)." },
  { name: "Add your photos", text: "Choose them from your phone or computer, or drop them in. Each one is cropped to its frame." },
  { name: "Arrange them", text: "Move frames earlier or later, or replace one." },
  { name: "Style the strip", text: "Pick a film, a frame colour, a caption and the date stamp." },
  { name: "Download", text: "Save the strip as a PNG, or share it from your phone." },
];

const FAQ = [
  { q: "Is the photo strip maker free?", a: "Yes. No sign-up and no limit. The strip carries a small flashbae mark in the corner." },
  { q: "Are my photos uploaded?", a: "No. Your photos are opened and the strip is made in your browser, on your device." },
  { q: "What size is the downloaded strip?",
    a: "A Classic strip is 720 × 2,196 pixels, a 4-cut grid is 1,142 × 1,638 and a Trio is 720 × 1,694: sharp enough to post or to print small." },
  { q: "Can I print it?", a: "Yes. Print the PNG at home or at a photo kiosk. The Flashbae app also makes a print sheet laid out for cutting real strips." },
  { q: "Can I use iPhone photos (HEIC)?",
    a: "Usually, yes: Safari on iPhone converts them as you pick. If a photo won't open on a computer, export it as a JPEG first." },
  { q: "How is this different from the Flashbae app?",
    a: `The web maker has ${WEB_FILMS.length} free films and three layouts. The app adds all 33 films, the 6-cut layout, stickers, every frame colour, the live photo booth with a countdown, booth together with someone far away, and AI looks.` },
];

export default function PhotoStripMaker() {
  return (
    <div className="article">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: `${NAME} photo strip maker`,
              url: `${SITE_URL}${PATH}`,
              description: DESCRIPTION,
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Any",
              browserRequirements: "A modern browser",
              isAccessibleForFree: true,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              publisher: { "@id": `${SITE_URL}/#org` },
            },
            {
              "@type": "HowTo",
              name: "How to make a photo booth strip from your photos",
              step: STEPS.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
            },
            faqSchema(FAQ),
            crumbSchema([{ name: "Photo strip maker", path: PATH }]),
          ],
        }}
      />
      <Crumbs trail={[{ name: "Photo strip maker", path: PATH }]} />
      <header className="article-head">
        <h1>Free photo strip maker</h1>
        <p className="lede">
          Turn the photos you already have into a photo booth strip. Pick a layout, add three or four photos, choose a film and a frame,
          and download it. Free, no sign-up, and your photos never leave your device.
        </p>
      </header>

      <StripMaker />

      <div className="article-body">
        <div className="prose">
          <h2 id="how">How it works</h2>
          <ol className="steps">
            {STEPS.map((s) => <li key={s.name}><strong>{s.name}.</strong> {s.text}</li>)}
          </ol>
          <h2 id="pick">Picking photos that make a good strip</h2>
          <ul>
            <li>Choose photos from the same moment: the same night, the same people, the same light.</li>
            <li>Vary the expressions: a smile, a laugh, something silly, something serious.</li>
            <li>Faces near the top of the photo crop best; each frame is centred a little high, where faces usually are.</li>
          </ul>
          <h2 id="films">{WEB_FILMS.length} free films</h2>
          <p>
            One film covers the whole strip so the photos match, even if they came from different cameras:
            {" "}{WEB_FILMS.map((f) => f.title).join(", ")}. <a href="/films/">See every film</a>.
          </p>
          <p>Want the countdown and the flash? Take a strip live in the <a href="/online-photo-booth/">online photo booth</a>.</p>
        </div>
        <nav className="toc" aria-label="On this page">
          <h2>On this page</h2>
          <a href="#how">How it works</a>
          <a href="#pick">Picking photos</a>
          <a href="#films">Free films</a>
          <a href="#faq">Questions</a>
          <a href="/online-photo-booth/">Online photo booth</a>
        </nav>
      </div>

      <Faq items={FAQ} title="Photo strip maker questions" />
      <GetApp title="Make strips on your iPhone" text="33 films, stickers, a live booth with a countdown, and AI looks. Free to download." />
    </div>
  );
}
