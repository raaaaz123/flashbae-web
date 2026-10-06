import type { Metadata } from "next";
import AppStoreButton from "@/components/AppStoreButton";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import GetApp from "@/components/GetApp";
import JsonLd from "@/components/JsonLd";
import { FILM_GROUPS, FILMS } from "@/lib/films";
import { APP_STORE_URL, BOOTH, NAME, SITE_URL } from "@/lib/site";

const PATH = "/films/";
const TITLE = `All ${BOOTH.films} photo booth film looks`;
const DESCRIPTION =
  `Every film look in the ${NAME} photo booth: 1930s booth, black and white, CCD digicam flash, light leaks, expired film, ` +
  `dreamy glow and cinema film. ${BOOTH.freeFilms} are free.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `${TITLE} · ${NAME}`, description: DESCRIPTION, url: PATH },
};

export default function Films() {
  return (
    <div className="article">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            crumbSchema([{ name: "Film looks", path: PATH }]),
            {
              "@type": "ItemList",
              name: `${NAME} photo booth film looks`,
              numberOfItems: FILMS.length,
              itemListElement: FILMS.map((f, i) => ({
                "@type": "ListItem", position: i + 1, name: f.title, description: f.text, url: `${SITE_URL}${PATH}#${f.id}`,
              })),
            },
          ],
        }}
      />
      <Crumbs trail={[{ name: "Film looks", path: PATH }]} />

      <header className="article-head">
        <h1>{BOOTH.films} film looks for your photo strips</h1>
        <p className="lede">
          A film sets the mood of the whole strip: its colour, grain, flash, glow and vignette, with an intensity slider.
          {" "}{BOOTH.freeFilms} are free, including Natural, which keeps true colour with a touch of grain.
        </p>
        <AppStoreButton href={APP_STORE_URL} />
      </header>

      {FILM_GROUPS.map((g) => (
        <section key={g.id} className="section-tight" aria-labelledby={`g-${g.id}`}>
          <h2 id={`g-${g.id}`}>{g.title}</h2>
          <p className="lede" style={{ marginBottom: 20 }}>{g.intro}</p>
          <ul className="films">
            {FILMS.filter((f) => f.group === g.id).map((f) => (
              <li key={f.id} id={f.id} className="film">
                <h3>{f.title}{f.free && <span className="tag">Free</span>}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="prose" style={{ marginTop: 56 }}>
        <h2>Films, AI looks and the film editor</h2>
        <p>
          Films are for photo strips: one film covers every frame so the strip matches, and it&apos;s applied on your phone
          the moment you pick it. To change the light in a single photo, like adding a flash that wasn&apos;t there,
          use an <a href="/looks/">AI look</a>. To grade a photo you already have, the free film editor has its own
          filters with intensity, 17 adjustments and face retouch.
        </p>
        <p>
          Looking for a specific style? See <a href="/digicam-filter/">digicam and Y2K flash</a> or
          the <a href="/photo-booth-app/">photo booth</a>.
        </p>
        <p className="fine">
          Film names describe a style. {NAME} isn&apos;t affiliated with Kodak, Fujifilm, Polaroid, CineStill or Lomography;
          their names are trademarks of their owners.
        </p>
      </div>

      <GetApp title="Pick your film" text={`Download Flashbae and try all ${BOOTH.films} on your next strip.`} />
    </div>
  );
}
