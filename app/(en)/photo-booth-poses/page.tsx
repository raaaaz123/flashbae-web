import type { Metadata } from "next";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import Faq, { faqSchema } from "@/components/Faq";
import GetApp from "@/components/GetApp";
import JsonLd from "@/components/JsonLd";
import PoseRoulette from "@/components/booth/PoseRoulette";
import { CROWDS, POSES } from "@/lib/poses";
import { NAME, SITE_URL } from "@/lib/site";

const PATH = "/photo-booth-poses/";
const TITLE = "Photo booth pose generator";
const COUNT = Object.values(POSES).reduce((n, p) => n + p.length, 0);
const DESCRIPTION =
  "Free random photo booth pose generator: spin for a pose or play a four-frame round with a 3-2-1 countdown, " +
  `like a real booth. ${COUNT} poses for solo, couples and friends.`;

export const metadata: Metadata = {
  title: `${TITLE}: random poses for solo, couples and friends`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `${TITLE} · ${NAME}`, description: DESCRIPTION, url: PATH },
};

const FAQ = [
  { q: "What are good photo booth poses?",
    a: "Mix it up across the strip: one normal smile, one silly face, one with props or hands (heart hands, peace signs, peekaboo) and one surprise, like a cheek kiss or a group scream. Four different poses make a strip worth keeping." },
  { q: "What poses should couples do in a photo booth?",
    a: "Classic couple poses are the cheek kiss, nose to nose, a shared heart with your hands, forehead touch and one silly face together. Save the real kiss for the last frame." },
  { q: "How do you pose in a photo booth with friends?",
    a: "Squeeze in so every face is at a different height, then go big: a group scream, everyone pointing at one friend, a totem pole of faces or an album-cover stare. Decide the four poses before the countdown starts." },
  { q: "How does the pose generator work?",
    a: "Pick who's in the booth and press Next pose for a random idea, or Play a round: you get four poses, each with a 3-2-1 countdown and a flash, like a real booth. It's free and runs in your browser." },
  { q: "Can I take the photos here too?",
    a: "Yes: open the free online photo booth to shoot a strip with your webcam or phone camera. The Flashbae app for iPhone adds pose prompts to every frame, 33 film looks and booths with someone far away over live video." },
];

export default function PhotoBoothPosesPage() {
  return (
    <div className="article">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: `${NAME} photo booth pose generator`,
              url: `${SITE_URL}${PATH}`,
              description: DESCRIPTION,
              applicationCategory: "GameApplication",
              operatingSystem: "Any",
              browserRequirements: "A modern browser",
              isAccessibleForFree: true,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              publisher: { "@id": `${SITE_URL}/#org` },
            },
            ...CROWDS.map((c) => ({
              "@type": "ItemList",
              name: c.title,
              itemListElement: POSES[c.id].map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, description: p.tip })),
            })),
            faqSchema(FAQ),
            crumbSchema([{ name: "Free tools", path: "/free-tools/" }, { name: "Photo booth poses", path: PATH }]),
          ],
        }}
      />
      <Crumbs trail={[{ name: "Free tools", path: "/free-tools/" }, { name: "Photo booth poses", path: PATH }]} />
      <header className="article-head">
        <h1>Photo booth pose <em>generator</em></h1>
        <p className="lede">
          Never freeze at the countdown again. Spin for a random pose, or play a four-frame round with a 3-2-1 countdown
          and a flash. {COUNT} poses for solo, couples and friends, all listed below; for how to plan a whole strip, read the{" "}
          <a href="/guides/photo-booth-pose-ideas/">photo booth pose ideas guide</a>.
        </p>
      </header>

      <PoseRoulette />

      <div className="article-body">
        <div className="prose">
          {CROWDS.map((c) => (
            <section key={c.id} aria-labelledby={`poses-${c.id}`}>
              <h2 id={`poses-${c.id}`}>{c.title}</h2>
              <ol className="steps">
                {POSES[c.id].map((p) => <li key={p.name}><strong>{p.emoji} {p.name}.</strong> {p.tip}</li>)}
              </ol>
            </section>
          ))}
          <h2 id="strip">Planning a four-frame strip</h2>
          <ul>
            <li><strong>Frame 1: warm up.</strong> A normal smile, so there&apos;s one photo for the grandparents.</li>
            <li><strong>Frame 2: hands.</strong> Heart hands, peace signs or peekaboo.</li>
            <li><strong>Frame 3: chaos.</strong> Silly faces, a scream or a dance break.</li>
            <li><strong>Frame 4: the finale.</strong> A kiss, a hug or everyone pointing at one friend.</li>
          </ul>
          <p>
            Then take it: the <a href="/online-photo-booth/">free online photo booth</a> shoots a strip with your webcam,
            and the <a href="/photo-strip-maker/">photo strip maker</a> turns photos you already have into one.
          </p>
        </div>
        <nav className="toc" aria-label="On this page">
          <h2>On this page</h2>
          {CROWDS.map((c) => <a key={c.id} href={`#poses-${c.id}`}>{c.title}</a>)}
          <a href="#strip">Planning a strip</a>
          <a href="#faq">Questions</a>
          <a href="/free-tools/">More free tools</a>
        </nav>
      </div>

      <Faq items={FAQ} title="Pose questions" />
      <GetApp title="Pose prompts on every frame" text="Flashbae's booth tells you what to do before each flash, with 33 film looks and booths over live video." />
    </div>
  );
}
