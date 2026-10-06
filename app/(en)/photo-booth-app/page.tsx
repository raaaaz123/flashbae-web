import type { Metadata } from "next";
import AppStoreButton from "@/components/AppStoreButton";
import BoothStrip from "@/components/BoothStrip";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import Faq, { faqSchema } from "@/components/Faq";
import GetApp from "@/components/GetApp";
import JsonLd from "@/components/JsonLd";
import { FILMS } from "@/lib/films";
import { lookBySlug } from "@/lib/looks";
import { APP_STORE_URL, BOOTH, NAME } from "@/lib/site";

const PATH = "/photo-booth-app/";
const TITLE = "Photo booth app for iPhone";
const DESCRIPTION =
  `${NAME} is a photo booth app for iPhone and iPad: pose prompts, a 3-2-1 countdown and flash, ${BOOTH.layouts} strip layouts, ` +
  `${BOOTH.films} film looks, frames and stickers. Save a strip, a Story or a print sheet. Free to download.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `${TITLE} · ${NAME}`, description: DESCRIPTION, url: PATH },
};

const LAYOUTS = [
  { name: "Classic", text: "Four frames stacked in a tall strip, the shape of a coin-op booth." },
  { name: "4-cut", text: "Four portrait frames in a two-by-two grid." },
  { name: "Trio", text: "Three frames in a strip: quicker, with a little more room for each shot." },
  { name: "6-cut", text: "Six portrait frames in a two-by-three grid, for groups or a longer story (Pro)." },
];

const FAQ = [
  { q: "Is the photo booth free?",
    a: `Yes. The booth with the Classic, 4-cut and Trio layouts, the pose prompts and countdown, ${BOOTH.freeFilms} of the ${BOOTH.films} films and booth together with a friend are all free. The 6-cut layout and some films, frame colours and stickers are Pro.` },
  { q: "Does it work on iPad?", a: `Yes. ${NAME} runs on iPhone and iPad with iOS 17 or later.` },
  { q: "Can I print my photo strip?",
    a: "Yes. Save it as a print sheet, a page laid out for printing, or save the strip itself as an image." },
  { q: "Can two people in different places be in one strip?",
    a: "Yes. Booth together sends your friend or partner a link; you see each other on live video while both phones count down and flash at the same moment, and you both get one strip." },
  { q: "Do I need an account?", a: "No. There's no sign-up: no name, email or phone number." },
];

export default function PhotoBoothApp() {
  const strip = ["cozy-flash", "soft-flash", "sun-kissed", "dreamlight"]
    .map((s) => lookBySlug(s))
    .filter((l) => !!l)
    .map((l) => ({ src: l!.after, alt: `Photo booth frame in the ${l!.title} look` }));
  const free = FILMS.filter((f) => f.free).map((f) => f.title);

  return (
    <div className="article">
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [crumbSchema([{ name: TITLE, path: PATH }]), faqSchema(FAQ)] }} />
      <Crumbs trail={[{ name: "Photo booth app", path: PATH }]} />

      <div className="article-hero">
        <header className="article-head">
          <h1>A photo booth app that feels like the real thing</h1>
          <p className="lede">
            {NAME} turns your iPhone into a photo booth. It tells you how to pose, counts down 3, 2, 1, flashes,
            and builds the strip for you. Then you pick the film, the frame and the stickers.
          </p>
          <AppStoreButton href={APP_STORE_URL} />
          <p className="fine">Free on iPhone and iPad · iOS 17 or later · {BOOTH.languages} languages</p>
        </header>
        <div className="article-hero-art">
          <BoothStrip frames={strip} caption="photo booth night" />
        </div>
      </div>

      <div className="article-body">
        <div className="prose">
          <h2 id="how">How it works</h2>
          <ol className="steps">
            <li><strong>Pick a layout.</strong> Classic, 4-cut, Trio or 6-cut.</li>
            <li><strong>Follow the pose prompt.</strong> Each frame suggests a pose, from a big smile to a model pose.</li>
            <li><strong>3, 2, 1, flash.</strong> The screen lights up as a flash, and the booth moves on to the next frame by itself.</li>
            <li><strong>Make it yours.</strong> Choose a film, a frame colour, stickers, a caption and the date.</li>
            <li><strong>Save or share.</strong> As a strip, an Instagram Story, a print sheet or a behind-the-scenes video.</li>
          </ol>

          <h2 id="layouts">Four strip layouts</h2>
          <ul>
            {LAYOUTS.map((l) => <li key={l.name}><strong>{l.name}:</strong> {l.text}</li>)}
          </ul>

          <h2 id="films">{BOOTH.films} film looks</h2>
          <p>
            Every strip gets one film across all of its frames, so the photos match. The films run from a 1930s booth
            and silvery black and white to CCD digicam flash, light leaks, expired film and cinema film with a red halo.
            Each one has its own grain, flash, glow and vignette, and an intensity slider.
          </p>
          <p>
            Free films: {free.join(", ")}, plus Natural. <a href="/films/">See all {BOOTH.films} films</a>.
          </p>

          <h2 id="decorate">Frames, stickers and captions</h2>
          <p>
            Pick a paper colour for the frame (white, black, cream, blush, butter, sage, sky or cherry), add stickers,
            write a caption and stamp the date, like the booths that print the night on the strip.
          </p>

          <h2 id="share">Save, share and print</h2>
          <ul>
            <li><strong>Strip:</strong> the classic image, ready for your camera roll or a group chat.</li>
            <li><strong>Story:</strong> sized for Instagram Stories.</li>
            <li><strong>Print sheet:</strong> laid out for printing, so you can cut real strips.</li>
            <li><strong>Behind the scenes:</strong> a short video of the shoot.</li>
          </ul>

          <h2 id="together">Booth together, even miles apart</h2>
          <p>
            Invite a partner or friend with a link or a six-letter code. You see and hear each other on live video,
            both phones count down together and flash at the same moment, and you get one strip with both of you in it.
            {" "}<a href="/long-distance-photo-booth/">How the long-distance photo booth works</a>.
          </p>

          <h2 id="tips">Tips for a better strip</h2>
          <ul>
            <li>Face a window or a lamp: the flash adds sparkle, but soft light from the front does the flattering.</li>
            <li>Prop your phone up at eye level, an arm&apos;s length away, so everyone fits in the frame.</li>
            <li>Change it up each frame: calm, a big reaction, something silly, then a serious model pose.</li>
          </ul>
          <p>More ideas: <a href="/guides/photo-booth-pose-ideas/">photo booth pose ideas</a> and <a href="/guides/photo-strip-on-iphone/">how to make a photo strip on iPhone</a>.</p>
        </div>

        <nav className="toc" aria-label="On this page">
          <h2>On this page</h2>
          <a href="#how">How it works</a>
          <a href="#layouts">Layouts</a>
          <a href="#films">Film looks</a>
          <a href="#decorate">Frames and stickers</a>
          <a href="#share">Save and print</a>
          <a href="#together">Booth together</a>
          <a href="#tips">Tips</a>
          <a href="#faq">Questions</a>
        </nav>
      </div>

      <Faq items={FAQ} title="Photo booth questions" />
      <GetApp title="Your booth is ready" text="Download Flashbae, pick a layout and strike the first pose." />
    </div>
  );
}
