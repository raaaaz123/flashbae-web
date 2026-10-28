import type { Locale } from "@/lib/i18n";
import { CHROME, LOCALES } from "@/lib/i18n";
import HeaderAccount from "./HeaderAccount";

export default function Header({ locale = "en" }: { locale?: Locale }) {
  const t = CHROME[locale];
  const home = LOCALES.find((l) => l.id === locale)!.home;
  return (
    <header className="header">
      <a href={home} className="brand" aria-label={t.homeLabel}>
        <img src="/mascot.png" alt="" width={38} height={34} />
        <span className="wordmark">flashbae</span>
      </a>
      <nav aria-label="Main" className="nav">
        {t.nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
      </nav>
      <a href="/ai-photo-generator/" className="btn btn-store btn-small header-cta">
        ✨ Try AI Studio
      </a>
      {/* Sign-in only exists on the English site, where the AI studio lives. */}
      {locale === "en" && <HeaderAccount />}
      {/* Phones get the same links in a drop-down; <details> keeps it working without script. */}
      <details className="menu">
        <summary aria-label="Menu"><span /><span /></summary>
        <nav aria-label="Main menu" className="menu-panel">
          {t.nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>
      </details>
    </header>
  );
}
