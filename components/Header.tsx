import { APP_STORE_URL } from "@/lib/site";
import AppStoreButton from "./AppStoreButton";

export default function Header() {
  return (
    <header className="header">
      <a href="/" className="brand" aria-label="Flashbae home">
        <img src="/mascot.png" alt="" width={38} height={34} />
        <span className="wordmark">flashbae</span>
      </a>
      <nav aria-label="Main" className="nav">
        <a href="/looks/">Looks</a>
        <a href="/#booth">Photo booth</a>
        <a href="/#faq">FAQ</a>
      </nav>
      <AppStoreButton href={APP_STORE_URL} small />
    </header>
  );
}
