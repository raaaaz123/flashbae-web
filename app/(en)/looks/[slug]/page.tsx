import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Compare } from "@/components/BeforeAfter";
import AppStoreButton from "@/components/AppStoreButton";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import JsonLd from "@/components/JsonLd";
import LookPrints from "@/components/LookPrints";
import { LOOKS, formatDate, lookBySlug } from "@/lib/looks";
import { APP_STORE_URL, BOOTH, NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return LOOKS.map((l) => ({ slug: l.slug }));
}

/** What the look is, in words a search engine (or an AI answer) can quote. */
function summary(l: NonNullable<ReturnType<typeof lookBySlug>>) {
  const what = l.kind === "template"
    ? `${l.title} is a ${NAME} AI template: it puts you, from your own selfie, into a new scene.`
    : `${l.title} is a ${NAME} AI photo effect: it re-shoots your own selfie and keeps your scene.`;
  return `${what} ${l.tagline}`.trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = lookBySlug((await params).slug);
  if (!l) return {};
  return {
    title: `${l.title} — AI ${l.kind === "template" ? "photo template" : "photo filter"}`,
    description: summary(l),
    alternates: { canonical: `/looks/${l.slug}/` },
    openGraph: { title: `${l.title} on ${NAME}`, description: summary(l), images: [l.after] },
  };
}

export default async function LookPage({ params }: Props) {
  const l = lookBySlug((await params).slug);
  if (!l) notFound();
  const others = LOOKS.filter((o) => o.slug !== l.slug && o.kind === l.kind).slice(0, 6);
  const template = l.kind === "template";
  const flash = /flash|night/i.test(`${l.slug} ${l.category}`);
  const trail = [{ name: "Looks", path: "/looks/" }, { name: l.title, path: `/looks/${l.slug}/` }];

  return (
    <div className="page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "HowTo",
              name: `How to get the ${l.title} look on your photo`,
              description: summary(l),
              image: `${SITE_URL}${l.after}`,
              step: [
                { "@type": "HowToStep", position: 1, text: `Open ${NAME} on your iPhone and pick ${l.title} in Looks.` },
                { "@type": "HowToStep", position: 2, text: l.kind === "template" ? "Add a clear selfie of each person in the scene." : "Add a selfie from your camera or gallery." },
                { "@type": "HowToStep", position: 3, text: "Tap Make it. Your photo is ready in about 15 seconds; slide the intensity to taste, then save or share." },
              ],
            },
            {
              "@type": "WebPage",
              "@id": `${SITE_URL}/looks/${l.slug}/`,
              name: `${l.title} AI ${template ? "photo template" : "photo filter"}`,
              datePublished: l.added,
              primaryImageOfPage: `${SITE_URL}${l.after}`,
              isPartOf: { "@id": `${SITE_URL}/#site` },
            },
            crumbSchema(trail),
          ],
        }}
      />
      <Crumbs trail={trail} />
      <div className="look">
        <div className="look-frame"><Compare look={l} priority /></div>
        <div className="look-copy">
          <p className="look-kind">{l.kind === "template" ? "Template" : "Effect"}{l.trending ? ", trending now" : ""}</p>
          <h1>{l.title}</h1>
          <p className="lede">{summary(l)}</p>
          <ol className="steps">
            <li>Open {NAME} and pick <strong>{l.title}</strong> in Looks.</li>
            <li>{l.kind === "template" ? "Add a clear selfie." : "Add a selfie from your camera or gallery."}</li>
            <li>Tap <strong>Make it</strong>. About 15 seconds later it&apos;s yours to save or share.</li>
          </ol>
          <AppStoreButton href={APP_STORE_URL} />
          <ul className="facts" aria-label="About this look">
            <li><strong>{template ? "Template" : "Effect"}</strong>{template ? ": a new scene" : ": keeps your scene"}</li>
            <li>{l.people > 1 ? `${l.people} people` : "One person"}</li>
            <li>About 15 seconds</li>
            <li>Added <time dateTime={l.added}>{formatDate(l.added)}</time></li>
          </ul>
        </div>
      </div>

      <div className="prose" style={{ marginTop: 64 }}>
        <h2>Tips for the best {l.title} photo</h2>
        <ul>
          <li><strong>Use a clear, front-facing selfie.</strong> AI keeps your face and pose, so a sharp photo where your face fills a good part of the frame gives the best likeness.</li>
          <li><strong>Avoid heavy filters on the original.</strong> Start from the plain photo; the look brings its own light and colour.</li>
          {template
            ? <li><strong>Mind the pose.</strong> A template places you in a new scene, so a simple, upright pose fits most scenes best.</li>
            : <li><strong>Any background works.</strong> An effect keeps your scene, so the photo still looks like where you took it.</li>}
          <li><strong>Fine-tune afterwards.</strong> The intensity slider fades the result back toward your original until it looks right.</li>
        </ul>
        <h2>How {NAME} AI looks work</h2>
        <p>
          {template
            ? `A template re-creates your photo in a new setting: the ${l.title} scene, with you in it.`
            : `An effect re-shoots your photo and keeps your scene: ${l.tagline ? l.tagline.charAt(0).toLowerCase() + l.tagline.slice(1) : "a new mood."}`}
          {" "}Every look shows a before and after, and you can share a reveal video of the change.
          The photo you pick is sent to Google&apos;s Gemini image model to make the result; the upload isn&apos;t kept, and Google doesn&apos;t train on it.
        </p>
        <p>
          {flash
            ? <>Into the flash look? See <a href="/digicam-filter/">digicam and Y2K flash filters</a> and the guide to <a href="/guides/y2k-flash-photos/">Y2K flash photos</a>.</>
            : <>Want to shoot instead of edit? The <a href="/photo-booth-app/">photo booth</a> has {BOOTH.films} <a href="/films/">film looks</a> for strips.</>}
        </p>
      </div>
      {others.length > 0 && (
        <section className="section-tight" aria-labelledby="more-title">
          <h2 id="more-title">More {l.kind === "template" ? "templates" : "effects"}</h2>
          <LookPrints looks={others} wrap />
        </section>
      )}
    </div>
  );
}
