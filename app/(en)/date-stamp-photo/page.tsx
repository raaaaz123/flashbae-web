import type { Metadata } from "next";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import Faq, { faqSchema } from "@/components/Faq";
import GetApp from "@/components/GetApp";
import JsonLd from "@/components/JsonLd";
import DateStamp from "@/components/booth/DateStamp";
import { NAME, SITE_URL } from "@/lib/site";

const PATH = "/date-stamp-photo/";
const TITLE = "Add a date stamp to a photo";
const DESCRIPTION =
  "Add the orange date stamp of a 2000s digital camera to any photo, free, with a CCD digicam or flash colour grade. " +
  "Uses the date the photo was taken. Works on your phone; nothing is uploaded.";

export const metadata: Metadata = {
  title: `${TITLE}: free digicam date stamp and filter`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `${TITLE} · ${NAME}`, description: DESCRIPTION, url: PATH },
};

const STEPS = [
  { name: "Choose a photo", text: "From your phone or computer. It's opened on your device, not uploaded." },
  { name: "Pick a film", text: "CCD Cam for the cool 2000s digicam, Flash Glow for a warm flash, or Natural to keep the colours." },
  { name: "Set the date", text: "It starts on the day the photo was taken, when the photo has that information. Change it to any day." },
  { name: "Style the stamp", text: "Year, month or day first; orange, yellow or red; bottom right or left; and the size." },
  { name: "Download", text: "Save the photo as a JPEG, or share it from your phone." },
];

const FAQ = [
  { q: "How do I add a date stamp to a photo for free?",
    a: "Choose the photo above, set the date and the style, and download it. It's free, there's no sign-up, and the photo never leaves your device." },
  { q: "Does it use the date the photo was taken?",
    a: "Yes, when the photo carries it: most camera and phone JPEGs record the day they were taken, and the stamp starts on that day. Screenshots and some edited or shared photos don't, so the stamp starts on today; change it to any date." },
  { q: "What's the digicam date stamp style?",
    a: "Compact cameras of the late 1990s and 2000s printed the date in orange seven-segment digits in the bottom-right corner, often with the year first and an apostrophe: '04 7 18. The stamp here is drawn the same way, with the slight lean and glow of the LED." },
  { q: "Can I make a photo look like it was taken on a digicam?",
    a: "Partly. The CCD Cam film gives the cool, crisp colour and blown-out flash of a 2000s compact, and the date stamp finishes it. But a filter can only recolour light that's already there. To add a real direct flash, the AI looks in the Flashbae app re-shoot the photo." },
  { q: "Will the photo lose quality?",
    a: "Photos are saved as high-quality JPEGs up to 2,400 pixels on the long side, plenty for posting and for prints up to about 8 × 6 inches." },
];

export default function DateStampPage() {
  return (
    <div className="article">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: `${NAME} date stamp and digicam filter`,
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
              name: "How to add a vintage date stamp to a photo",
              step: STEPS.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
            },
            faqSchema(FAQ),
            crumbSchema([{ name: "Date stamp photo", path: PATH }]),
          ],
        }}
      />
      <Crumbs trail={[{ name: "Free tools", path: "/free-tools/" }, { name: "Date stamp photo", path: PATH }]} />
      <header className="article-head">
        <h1>Add a date stamp to your photo</h1>
        <p className="lede">
          The orange date in the corner of a 2000s digital camera, on any photo, with a CCD digicam or flash colour grade.
          It uses the day the photo was taken. Free, and your photo never leaves your device.
        </p>
      </header>

      <DateStamp />

      <div className="article-body">
        <div className="prose">
          <h2 id="how">How it works</h2>
          <ol className="steps">
            {STEPS.map((s) => <li key={s.name}><strong>{s.name}.</strong> {s.text}</li>)}
          </ol>
          <h2 id="look">Getting the full digicam look</h2>
          <ul>
            <li><strong>Start with a flash photo.</strong> The look comes from a hard, direct flash, bright faces and a darker background. A daytime photo with a stamp just looks dated.</li>
            <li><strong>Use CCD Cam.</strong> It&apos;s the cool, crisp colour of an early-2000s compact.</li>
            <li><strong>Keep the stamp small</strong> and in the bottom-right corner, where the cameras put it.</li>
          </ul>
          <p>More on the look: <a href="/guides/y2k-flash-photos/">how to get Y2K flash photos on iPhone</a> and <a href="/digicam-filter/">digicam and Y2K flash filters</a>.</p>
        </div>
        <nav className="toc" aria-label="On this page">
          <h2>On this page</h2>
          <a href="#how">How it works</a>
          <a href="#look">The digicam look</a>
          <a href="#faq">Questions</a>
          <a href="/free-tools/">More free tools</a>
        </nav>
      </div>

      <Faq items={FAQ} title="Date stamp questions" />
      <GetApp title="Add a real flash" text="Flashbae's AI looks re-shoot your photo with direct flash, golden hour or a whole new scene." />
    </div>
  );
}
