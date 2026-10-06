import type { Metadata } from "next";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import Faq, { faqSchema } from "@/components/Faq";
import GetApp from "@/components/GetApp";
import JsonLd from "@/components/JsonLd";
import TemplateMaker from "@/components/booth/TemplateMaker";
import { NAME, SITE_URL } from "@/lib/site";

const PATH = "/photo-strip-templates/";
const TITLE = "Free printable photo strip templates";
const DESCRIPTION =
  "Free photo booth strip templates: 2×6 strips and 4×6 print sheets at 300 dpi, with your names and date. " +
  "Print them, or download a transparent overlay for photo booth software. For weddings, parties and DIY booths.";

export const metadata: Metadata = {
  title: `${TITLE} (2×6 and 4×6)`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `${TITLE} · ${NAME}`, description: DESCRIPTION, url: PATH },
};

const FAQ = [
  { q: "What size is a photo booth strip?",
    a: "The classic strip is 2 × 6 inches with four frames. Most printers can't print that size directly, so booths print a 4 × 6 inch photo with two strips side by side and cut it in half. That's the print sheet template." },
  { q: "How do I print a 2×6 photo strip at home?",
    a: "Download the print sheet (4 × 6 inches), print it on 4×6 photo paper at 100% (actual size), and cut it down the middle along the marks." },
  { q: "What does the see-through overlay do?",
    a: "It makes the photo windows transparent, so the PNG can sit on top of your photos in photo booth software, Canva, Photoshop or any app that layers images." },
  { q: "Are the templates free for weddings and events?",
    a: "Yes, for personal and event use. The small flashbae mark can be turned off; we'd love it if you kept it." },
  { q: "What resolution are the templates?",
    a: "300 dpi: 600 × 1,800 pixels for a 2×6 strip and 1,200 × 1,800 for a 4×6 sheet. The PNG carries its print size, so it prints at the right size without resizing." },
  { q: "Can I fill the template with my photos here?",
    a: "Yes: the photo strip maker turns your photos into a finished strip with a film, frame colour and caption. Or shoot a strip live in the online photo booth." },
];

export default function TemplatesPage() {
  return (
    <div className="article">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: `${NAME} photo strip templates`,
              url: `${SITE_URL}${PATH}`,
              description: DESCRIPTION,
              applicationCategory: "DesignApplication",
              operatingSystem: "Any",
              browserRequirements: "A modern browser",
              isAccessibleForFree: true,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              publisher: { "@id": `${SITE_URL}/#org` },
            },
            faqSchema(FAQ),
            crumbSchema([{ name: "Photo strip templates", path: PATH }]),
          ],
        }}
      />
      <Crumbs trail={[{ name: "Free tools", path: "/free-tools/" }, { name: "Photo strip templates", path: PATH }]} />
      <header className="article-head">
        <h1>Free printable photo strip templates</h1>
        <p className="lede">
          Blank 2×6 photo booth strips and 4×6 print sheets at 300 dpi, with your names and date. Print them for a wedding or
          party, or download a see-through overlay for photo booth software.
        </p>
      </header>

      <TemplateMaker />

      <div className="article-body">
        <div className="prose">
          <h2 id="which">Which template should I use?</h2>
          <ul>
            <li><strong>Classic strip (2 × 6):</strong> four frames, the coin-op booth strip. For overlays, or printers that take 2×6 paper.</li>
            <li><strong>Trio strip (2 × 6):</strong> three frames, so each photo is bigger.</li>
            <li><strong>Print sheet (4 × 6):</strong> two Classic strips side by side. Print on standard 4×6 photo paper and cut in half: one strip for the guest, one for the guest book.</li>
            <li><strong>4-cut grid (4 × 6):</strong> four portrait frames in a 2 × 2 grid, on one 4×6 photo.</li>
          </ul>
          <h2 id="diy">Ideas for a DIY photo booth</h2>
          <ul>
            <li><strong>Weddings:</strong> the couple&apos;s names and date on the strip, and a guest book where guests stick one copy and write a note.</li>
            <li><strong>Birthdays and parties:</strong> a hashtag on the second line, so the photos find each other online.</li>
            <li><strong>No printer?</strong> Let guests shoot strips on their own phones in the <a href="/online-photo-booth/">online photo booth</a> or the Flashbae app.</li>
          </ul>
          <p>Have the photos already? Turn them into a finished strip with the <a href="/photo-strip-maker/">photo strip maker</a>.</p>
        </div>
        <nav className="toc" aria-label="On this page">
          <h2>On this page</h2>
          <a href="#which">Which template</a>
          <a href="#diy">DIY booth ideas</a>
          <a href="#faq">Questions</a>
          <a href="/free-tools/">More free tools</a>
        </nav>
      </div>

      <Faq items={FAQ} title="Template questions" />
      <GetApp title="The booth in every guest's pocket" text="Pose prompts, a countdown and a flash, with 33 films. Free on iPhone and iPad." />
    </div>
  );
}
