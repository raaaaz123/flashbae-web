import type { Metadata } from "next";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import Faq, { faqSchema } from "@/components/Faq";
import GetApp from "@/components/GetApp";
import JsonLd from "@/components/JsonLd";
import AestheticQuiz from "@/components/booth/AestheticQuiz";
import type { ResultExtras } from "@/components/booth/AestheticQuiz";
import { AESTHETICS } from "@/lib/aesthetics";
import { FILMS } from "@/lib/films";
import type { FilmGroup } from "@/lib/films";
import { lookBySlug } from "@/lib/looks";
import { NAME, SITE_URL } from "@/lib/site";

const PATH = "/aesthetic-quiz/";
const TITLE = "What's your photo aesthetic? Quiz";
const DESCRIPTION =
  "Take the free photo aesthetic quiz: six quick questions to find out if you're Classic Booth, Digicam Flash, Golden Film, " +
  "Soft Dreamy or Cool Cinematic, and which filters and film looks match you.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `${TITLE} · ${NAME}`, description: DESCRIPTION, url: PATH },
};

const LIST = Object.values(AESTHETICS);

const EXTRAS = Object.fromEntries(LIST.map((a) => {
  const l = lookBySlug(a.look);
  return [a.id, {
    look: l && { slug: l.slug, title: l.title, after: l.after },
    films: FILMS.filter((f) => f.group === a.id).map((f) => f.title),
  }];
})) as ResultExtras;

const FAQ = [
  { q: "What is a photo aesthetic?",
    a: "It's the overall look and feeling of your photos: the colours, the light, the grain and the mood. Two photos of the same moment can feel completely different in black-and-white booth film and in a soft, glowing pastel." },
  { q: "How does the aesthetic quiz work?",
    a: "Answer six quick questions about your style and taste. Each answer points to one of five aesthetics, and the one you pick most is your result, with the film looks and AI looks that match it." },
  { q: "How do I get my aesthetic on my photos?",
    a: "Use a filter or film look that matches it. The free date stamp tool and online photo booth have a few film looks, and the Flashbae app for iPhone has 33 booth films plus AI looks that re-shoot a selfie in a whole new light." },
  { q: "Is the quiz free?",
    a: "Yes. No sign-up, nothing to download, and your answers stay in your browser." },
];

export default function AestheticQuizPage() {
  return (
    <div className="article">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Quiz",
              name: TITLE,
              url: `${SITE_URL}${PATH}`,
              description: DESCRIPTION,
              isAccessibleForFree: true,
              publisher: { "@id": `${SITE_URL}/#org` },
              about: LIST.map((a) => ({ "@type": "Thing", name: a.name, description: a.text })),
            },
            faqSchema(FAQ),
            crumbSchema([{ name: "Free tools", path: "/free-tools/" }, { name: "Aesthetic quiz", path: PATH }]),
          ],
        }}
      />
      <Crumbs trail={[{ name: "Free tools", path: "/free-tools/" }, { name: "Aesthetic quiz", path: PATH }]} />
      <header className="article-head">
        <h1>What&apos;s your photo aesthetic?</h1>
        <p className="lede">
          Six quick questions. Find out which of five photo aesthetics is yours, and the film looks and AI filters that
          match it. Free, no sign-up.
        </p>
      </header>

      <AestheticQuiz extras={EXTRAS} />

      <div className="article-body">
        <div className="prose">
          <h2 id="aesthetics">The five photo aesthetics</h2>
          {LIST.map((a) => (
            <section key={a.id} aria-labelledby={`a-${a.id}`}>
              <h3 id={`a-${a.id}`}>{a.emoji} {a.name}</h3>
              <p>{a.text}</p>
              <p><strong>Think:</strong> {a.vibe.join(", ")}. <strong>Films:</strong> {EXTRAS[a.id as FilmGroup].films.join(", ")}.</p>
            </section>
          ))}
          <p>
            See every film in <a href="/films/">the film looks</a>, or put your aesthetic on a strip with the{" "}
            <a href="/online-photo-booth/">free online photo booth</a>.
          </p>
        </div>
        <nav className="toc" aria-label="On this page">
          <h2>On this page</h2>
          <a href="#aesthetics">The five aesthetics</a>
          <a href="#faq">Questions</a>
          <a href="/photo-booth-poses/">Photo booth poses</a>
          <a href="/free-tools/">More free tools</a>
        </nav>
      </div>

      <Faq items={FAQ} title="Aesthetic questions" />
      <GetApp title="Shoot in your aesthetic" text="33 booth films and AI looks that re-shoot your selfie in digicam flash, golden hour or soft glow." />
    </div>
  );
}
