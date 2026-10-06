import type { Locale } from "@/lib/i18n";
import { CHROME, LOCALES } from "@/lib/i18n";
import { APP_STORE_URL } from "@/lib/site";
import AppStoreButton from "./AppStoreButton";

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
      <AppStoreButton href={APP_STORE_URL} small label={t.getApp} />
    </header>
  );
}
