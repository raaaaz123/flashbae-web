import type { Metadata } from "next";
import AppStoreButton from "@/components/AppStoreButton";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import Faq, { faqSchema } from "@/components/Faq";
import GetApp from "@/components/GetApp";
import JsonLd from "@/components/JsonLd";
import Together from "@/components/Together";
import { lookBySlug } from "@/lib/looks";
import { APP_STORE_URL, NAME, SITE_URL } from "@/lib/site";

const PATH = "/long-distance-photo-booth/";
const TITLE = "Long-distance photo booth for couples and friends";
const DESCRIPTION =
  `Take photo booth strips together from anywhere. ${NAME} puts you on live video, counts down on both phones at once and ` +
  "flashes at the same moment, so you get one strip with both of you in it. Free on iPhone and iPad.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `${TITLE} · ${NAME}`, description: DESCRIPTION, url: PATH },
};

const STEPS = [
  { name: "Create an invite", text: "Open the Booth tab, choose With a friend, and pick a vibe: Couple (kisses, hearts, us) or Friends (silly, loud, besties)." },
  { name: "Pick how the strip is shared", text: "Side by side with two or three moments, or stacked with two frames each." },
  { name: "Send the link", text: "Share the invite link, or read out the six-letter code. They open it in Flashbae on their own iPhone or iPad." },
  { name: "Go live", text: "You see and hear each other on live video while you get ready." },
  { name: "Both tap I'm ready", text: "Your phones count down together, 3, 2, 1, and flash at the same moment." },
  { name: "Open your strip", text: "Each of you shoots your own frames; the strip puts them together, and you both keep a copy." },
];

const FAQ = [
  { q: "Does my partner need the app too?",
    a: `Yes. You both need ${NAME} on an iPhone or iPad (iOS 17 or later). They join with your link or the six-letter code.` },
  { q: "Is the long-distance photo booth free?", a: "Yes. Booth together is part of the free photo booth." },
  { q: "Is the video call recorded?",
    a: "No. The live video and voice are only there so you can see each other while you shoot. They are never recorded; only the photos you take go into the strip." },
  { q: "What if we're in different time zones and can't be live together?",
    a: "Each of you can shoot your frames on your own, or use photos you already have, and the strip comes together when both sides are in." },
  { q: "Can I do it with a friend instead of a partner?",
    a: "Yes. Pick the Friends vibe for silly, loud bestie poses, or Couple for kisses and hearts." },
  { q: "Does it work on Android?", a: `Not yet. ${NAME} is for iPhone and iPad.` },
];

export default function LongDistanceBooth() {
  const img = (slug: string, side: "before" | "after") => lookBySlug(slug)?.[side] ?? "";
  return (
    <div className="article">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            crumbSchema([{ name: "Long-distance photo booth", path: PATH }]),
            {
              "@type": "HowTo",
              name: "How to take a photo booth strip with someone far away",
              description: DESCRIPTION,
              image: `${SITE_URL}/og.jpg`,
              step: STEPS.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
            },
            faqSchema(FAQ),
          ],
        }}
      />
      <Crumbs trail={[{ name: "Long-distance photo booth", path: PATH }]} />

      <header className="article-head">
        <h1>A photo booth for two, miles apart</h1>
        <p className="lede">
          Long-distance couples and best friends can finally be in the same strip. {NAME} puts you on live video,
          counts down on both phones at once and flashes at the same moment. One strip, both of you in it.
        </p>
        <AppStoreButton href={APP_STORE_URL} />
        <p className="fine">Free on iPhone and iPad · both of you need the app</p>
      </header>

      <section className="panel panel-lilac section-together" aria-label="Try the countdown">
        <Together
          a={{ name: "Mia", before: img("midnight-flash", "before"), after: img("midnight-flash", "after") }}
          b={{ name: "Lena", before: img("soft-flash", "before"), after: img("soft-flash", "after") }}
        />
      </section>

      <div className="article-body">
        <div className="prose">
          <h2 id="how">How it works</h2>
          <ol className="steps">
            {STEPS.map((s) => <li key={s.name}><strong>{s.name}.</strong> {s.text}</li>)}
          </ol>

          <h2 id="poses">Poses that meet in the middle</h2>
          <p>
            Each frame shows the same pose prompt on both screens. With the Couple vibe the poses are made for two:
            do the pose at the same moment and it meets in the middle of the strip, so your two frames read as one photo.
          </p>
          <p>While you shoot you can send quick messages that pop up on their screen, like “Ready?”, “One more?” or “Miss you 🥺”.</p>

          <h2 id="ideas">When to use it</h2>
          <ul>
            <li><strong>Date night apart:</strong> dress up, pick a film together and make a strip to end the call.</li>
            <li><strong>Anniversaries and birthdays:</strong> a strip with both of you in it beats a screenshot of a video call.</li>
            <li><strong>Long-distance friends:</strong> a booth with your best friend from your old city.</li>
            <li><strong>Counting down to the next visit:</strong> one strip a week, and save them as a print sheet for when you meet.</li>
          </ul>

          <h2 id="privacy">Private by design</h2>
          <p>
            There&apos;s no account: no name, email or phone number. The live video and voice are never recorded.
            Only the frames you choose to shoot end up in the strip.
          </p>

          <h2 id="finish">Make the strip yours</h2>
          <p>
            Once both of you are in, finish the strip like any other: one of the <a href="/films/">film looks</a>,
            a frame colour, stickers, a caption and the date. Save it as a strip, a Story or a print sheet.
          </p>
          <p>Need ideas? See <a href="/guides/photo-booth-pose-ideas/">photo booth pose ideas</a>, with a section for couples.</p>
        </div>

        <nav className="toc" aria-label="On this page">
          <h2>On this page</h2>
          <a href="#how">How it works</a>
          <a href="#poses">Poses</a>
          <a href="#ideas">When to use it</a>
          <a href="#privacy">Privacy</a>
          <a href="#finish">Finish the strip</a>
          <a href="#faq">Questions</a>
        </nav>
      </div>

      <Faq items={FAQ} title="Long-distance booth questions" />
      <GetApp title="Miss them? Shoot a strip together" text="Download Flashbae, send them the link and count down together." />
    </div>
  );
}
