import type { Locale } from "@/lib/i18n";
import { CHROME, LOCALES } from "@/lib/i18n";
import { LEGAL } from "@/lib/site";
import { LOOKS } from "@/lib/looks";

/** The pages every English page links to, so crawlers reach them from anywhere on the site. */
export const EXPLORE = [
  { href: "/photo-booth-app/", label: "Photo booth app" },
  { href: "/long-distance-photo-booth/", label: "Long-distance photo booth" },
  { href: "/digicam-filter/", label: "Digicam & Y2K flash" },
  { href: "/films/", label: "Film looks" },
  { href: "/looks/", label: "AI looks" },
  { href: "/guides/", label: "Guides" },
];

export default function Footer({ locale = "en" }: { locale?: Locale }) {
  const t = CHROME[locale];
  const en = locale === "en";
  const home = LOCALES.find((l) => l.id === locale)!.home;
  const cols = en ? 4 : 2;
  return (
    <footer className="footer" style={{ "--cols": cols } as React.CSSProperties}>
      <div className="footer-brand">
        <img src="/mascot.png" alt="" width={56} height={49} loading="lazy" />
        <p>
          <span className="wordmark">flashbae</span>
          <br />
          {t.tagline}
        </p>
      </div>
      {en && (
        <nav aria-label={t.footer.explore} className="footer-col">
          <h2>{t.footer.explore}</h2>
          {EXPLORE.map((e) => <a key={e.href} href={e.href}>{e.label}</a>)}
        </nav>
      )}
      {en && (
        <nav aria-label="Popular looks" className="footer-col">
          <h2>Popular looks</h2>
          {LOOKS.slice(0, 6).map((l) => (
            <a key={l.slug} href={`/looks/${l.slug}/`}>{l.title}</a>
          ))}
        </nav>
      )}
      <nav aria-label={t.footer.help} className="footer-col">
        <h2>{t.footer.help}</h2>
        <a href={`${home}#faq`}>{t.footer.faq}</a>
        <a href={LEGAL.support}>{t.footer.support}</a>
        <a href={LEGAL.privacy}>{t.footer.privacy}</a>
        <a href={LEGAL.terms}>{t.footer.terms}</a>
      </nav>
      <nav aria-label={t.footer.language} className="footer-col">
        <h2>{t.footer.language}</h2>
        {LOCALES.map((l) => (
          <a key={l.id} href={l.home} hrefLang={l.id} lang={l.id} aria-current={l.id === locale ? "page" : undefined}>{l.label}</a>
        ))}
      </nav>
      <p className="footer-fine">© {new Date().getFullYear()} Flashbae. iPhone and App Store are trademarks of Apple Inc.</p>
    </footer>
  );
}
