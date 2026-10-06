import type { Metadata } from "next";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import Faq, { faqSchema } from "@/components/Faq";
import GetApp from "@/components/GetApp";
import JsonLd from "@/components/JsonLd";
import OnlineBooth from "@/components/booth/OnlineBooth";
import { WEB_FILMS } from "@/lib/booth";
import { NAME, SITE_URL } from "@/lib/site";

const PATH = "/online-photo-booth/";
const TITLE = "Free online photo booth";
const DESCRIPTION =
  "A free online photo booth that uses your webcam or phone camera: pose prompts, a 3-2-1 countdown and a flash for every frame, " +
  "then download your photo strip. No sign-up, nothing uploaded.";

export const metadata: Metadata = {
  title: `${TITLE}: take a photo strip with your webcam`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `${TITLE} · ${NAME}`, description: DESCRIPTION, url: PATH },
};

const STEPS = [
  { name: "Pick a layout", text: "Classic (four frames in a strip), 4-cut (a two-by-two grid) or Trio (three frames)." },
  { name: "Start the camera", text: "Allow camera access. The picture stays on your device; nothing is uploaded." },
  { name: "Strike the poses", text: "Each frame shows a pose prompt, counts down 3, 2, 1 and flashes the screen white to light your face." },
  { name: "Finish the strip", text: "Pick a film, a frame colour, a caption and the date." },
  { name: "Download", text: "Save the strip as a PNG, or share it straight from your phone." },
];

const FAQ = [
  { q: "Is the online photo booth free?", a: "Yes. No sign-up and no limit on strips. The strip carries a small flashbae mark in the corner." },
  { q: "Are my photos uploaded anywhere?",
    a: "No. The camera feed and your photos stay in your browser; the strip is made on your device and saved straight to it." },
  { q: "Does it work on my phone?",
    a: "Yes, in Safari on iPhone and in Chrome on Android, as well as on laptops with a webcam. Allow camera access when the browser asks." },
  { q: "Why does the screen flash white?",
    a: "Like a real booth, the flash lights your face. With the screen flash on, your screen turns white for a moment as each frame is taken. You can turn it off before you start." },
  { q: "The camera won't start. What can I do?",
    a: "Check that the browser is allowed to use the camera (in the site settings, next to the address bar) and that no other app is using it. Or make a strip from photos you already have with the photo strip maker." },
  { q: "How is this different from the Flashbae app?",
    a: `The web booth has ${WEB_FILMS.length} free films and three layouts. The iPhone app adds all 33 films, the 6-cut layout, stickers, every frame colour, booth together with someone far away, and AI looks.` },
];

export default function OnlinePhotoBooth() {
  return (
    <div className="article">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: `${NAME} online photo booth`,
              url: `${SITE_URL}${PATH}`,
              description: DESCRIPTION,
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Any",
              browserRequirements: "A modern browser with camera access",
              isAccessibleForFree: true,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              publisher: { "@id": `${SITE_URL}/#org` },
            },
            {
              "@type": "HowTo",
              name: "How to take a photo booth strip online",
              step: STEPS.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
            },
            faqSchema(FAQ),
            crumbSchema([{ name: "Online photo booth", path: PATH }]),
          ],
        }}
      />
      <Crumbs trail={[{ name: "Online photo booth", path: PATH }]} />
      <header className="article-head">
        <h1>Free online photo booth</h1>
        <p className="lede">
          Your webcam or phone camera, turned into a photo booth: a pose prompt, a 3, 2, 1 countdown and a flash for every frame.
          Then pick a film and download your strip. Free, no sign-up, and nothing is uploaded.
        </p>
      </header>

      <OnlineBooth />

      <div className="article-body">
        <div className="prose">
          <h2 id="how">How it works</h2>
          <ol className="steps">
            {STEPS.map((s) => <li key={s.name}><strong>{s.name}.</strong> {s.text}</li>)}
          </ol>
          <h2 id="films">{WEB_FILMS.length} free films</h2>
          <p>
            {WEB_FILMS.map((f) => f.title).join(", ")}. They&apos;re the same colour recipes, grain, flash and glow as the free
            films in the {NAME} app, made right in your browser. <a href="/films/">See every film</a>.
          </p>
          <h2 id="tips">Tips for a better strip</h2>
          <ul>
            <li>Face a window or a lamp; the screen flash adds sparkle, soft light does the flattering.</li>
            <li>Prop the phone or laptop at eye level and step back so you all fit.</li>
            <li>Change it up each frame. Stuck? Try these <a href="/guides/photo-booth-pose-ideas/">photo booth pose ideas</a>.</li>
          </ul>
          <p>Already have the photos? Use the <a href="/photo-strip-maker/">photo strip maker</a> instead.</p>
        </div>
        <nav className="toc" aria-label="On this page">
          <h2>On this page</h2>
          <a href="#how">How it works</a>
          <a href="#films">Free films</a>
          <a href="#tips">Tips</a>
          <a href="#faq">Questions</a>
          <a href="/photo-strip-maker/">Photo strip maker</a>
        </nav>
      </div>

      <Faq items={FAQ} title="Online photo booth questions" />
      <GetApp title="The full booth is on iPhone" text="33 films, booth together over live video, and AI looks. Free to download." />
    </div>
  );
}
