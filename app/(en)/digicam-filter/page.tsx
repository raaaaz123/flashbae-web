import type { Metadata } from "next";
import AppStoreButton from "@/components/AppStoreButton";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import Faq, { faqSchema } from "@/components/Faq";
import GetApp from "@/components/GetApp";
import JsonLd from "@/components/JsonLd";
import LookPrints from "@/components/LookPrints";
import DateStamp from "@/components/booth/DateStamp";
import { FILMS } from "@/lib/films";
import { lookBySlug } from "@/lib/looks";
import type { Look } from "@/lib/looks";
import { APP_STORE_URL, NAME, seoTitle } from "@/lib/site";

const PATH = "/digicam-filter/";
const TITLE = "Digicam filter online, free: Y2K digital camera effect";
const DESCRIPTION =
  "Free digicam filter online: give any photo the cool CCD colour, flash and date stamp of a 2000s digital camera. No app, no sign-up, nothing uploaded.";

export const metadata: Metadata = {
  title: seoTitle(TITLE),
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `${TITLE} · ${NAME}`, description: DESCRIPTION, url: PATH },
};

const FLASH_FILMS = ["ccd", "y2kdigi", "disposable", "flashglow", "noirflash", "instax"];
const FLASH_LOOKS = ["disposable-flash", "midnight-flash", "soft-flash", "cozy-flash"];

const FAQ = [
  { q: "Is there a digicam filter online for free?",
    a: "Yes, at the top of this page. Choose a photo, pick CCD Cam for the cool digicam colour or Flash Glow for a bright party flash, and download it. No sign-up and no upload: the photo is edited in your browser." },
  { q: "How do I get the digicam filter on iPhone?",
    a: "Open this page in Safari, tap Choose a photo and pick one from your library, then save the result to Photos. For live shooting with the look, use the CCD Cam and Y2K Digicam films in the Flashbae app." },
  { q: "What is the digicam look?",
    a: "It's the look of the compact digital cameras of the early 2000s: a hard direct flash, bright faces against a darker background, cool and slightly over-sharp colour, and highlights that blow out to white." },
  { q: "Is there a free digicam filter?",
    a: `Yes. In the photo booth, CCD Cam and Flash Glow are free films. The film editor, which is free and runs on your phone without AI, has Digicam and Flash Pop filters.` },
  { q: "What's the difference between a film and an AI look?",
    a: "A film is a colour grade with grain, flash and glow, applied on your phone in an instant. An AI look re-shoots your photo: it can relight your face as if a real flash had gone off, or put you in a new scene. It takes about 15 seconds." },
  { q: "Can I add the flash look to a photo I already took?",
    a: "Yes. AI looks and the film editor both work on photos from your gallery." },
];

export default function DigicamFilter() {
  const films = FLASH_FILMS.map((id) => FILMS.find((f) => f.id === id)!);
  const looks = FLASH_LOOKS.map(lookBySlug).filter((l): l is Look => !!l);

  return (
    <div className="article sp">
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [crumbSchema([{ name: "Digicam & Y2K flash", path: PATH }]), faqSchema(FAQ)] }} />
      <Crumbs trail={[{ name: "Digicam & Y2K flash", path: PATH }]} />

      <header className="article-head">
        <h1>Digicam filter, free and online</h1>
        <p className="lede">
          The cool, crisp colour and hard flash of a 2000s point-and-shoot (a &quot;digicam&quot;), on any photo. Pick a photo,
          choose CCD Cam or Flash Glow, add the date if you like, and download. It runs in your browser; nothing is uploaded.
        </p>
      </header>

      <DateStamp filmId="ccd" stamp={false} />

      <section className="section-tight" aria-labelledby="iphone-title">
        <h2 id="iphone-title">Digicam, disposable and Y2K flash, on your iPhone</h2>
        <p className="lede">
          Want the look while you shoot? {NAME} gets you there three ways, depending on whether you&apos;re shooting now or
          fixing a photo you already have.
        </p>
        <AppStoreButton href={APP_STORE_URL} />
      </section>

      <section className="section-tight" aria-labelledby="ai-title">
        <h2 id="ai-title">AI flash looks</h2>
        <p className="lede">Add a selfie and AI re-shoots it as if a real flash had gone off. Hover a look to see the photo it started from.</p>
        <LookPrints looks={looks} wrap />
      </section>

      <div className="article-body">
        <div className="prose">
          <h2 id="three-ways">Three ways to get the flash look</h2>
          <h3>1. Shoot it in the photo booth</h3>
          <p>
            The booth flashes the screen white for every frame, which lights your face like a small on-camera flash.
            Pick one of the flash films and the whole strip comes out like a night on a digicam:
          </p>
          <ul>
            {films.map((f) => (
              <li key={f.id}><strong>{f.title}</strong>{f.free ? " (free)" : ""}: {f.text}</li>
            ))}
          </ul>
          <h3>2. Re-shoot a selfie with an AI look</h3>
          <p>
            Already have the photo? AI looks relight it: <a href="/looks/disposable-flash/">Disposable Flash</a> adds direct
            flash, punchy colour and a raw Y2K feel, while templates like <a href="/looks/midnight-flash/">Midnight Flash</a>{" "}
            put you on a dark street lit by a flash. An intensity slider fades the result back toward your original.
          </p>
          <h3>3. Grade it in the film editor</h3>
          <p>
            The free film editor works on your phone without AI. The Digicam, Flash Pop and Disposable filters each have an
            intensity slider, and you can add light leaks, dust and a frame.
          </p>

          <h2 id="pick">Which one should I use?</h2>
          <ul>
            <li><strong>Shooting with friends right now:</strong> the booth with CCD Cam or Y2K Digicam.</li>
            <li><strong>A daylight selfie you want to look like a night out:</strong> an AI look. A colour filter can&apos;t add a flash that wasn&apos;t there.</li>
            <li><strong>A photo that already has flash:</strong> the film editor, to push the colour further.</li>
          </ul>
          <p>Step-by-step: <a href="/guides/y2k-flash-photos/">how to get the Y2K flash look on iPhone</a>.</p>
        </div>

        <nav className="toc" aria-label="On this page">
          <h2>On this page</h2>
          <a href="#ai-title">AI flash looks</a>
          <a href="#three-ways">Three ways</a>
          <a href="#pick">Which to use</a>
          <a href="#faq">Questions</a>
        </nav>
      </div>

      <Faq items={FAQ} title="Digicam filter questions" />
      <GetApp title="Bring back the flash" text="Download Flashbae and shoot your first digicam strip." />
    </div>
  );
}
