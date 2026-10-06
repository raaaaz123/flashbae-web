import AppStoreButton from "./AppStoreButton";
import Mascot from "./Mascot";
import Sticker from "./Sticker";
import { APP_STORE_URL } from "@/lib/site";

/** The closing download panel at the bottom of the feature pages and guides. */
export default function GetApp({ title, text, label, mascot }: { title: string; text: string; label?: string; mascot?: string }) {
  return (
    <section className="panel panel-cherry outro outro-sm" aria-labelledby="getapp-title">
      <Sticker kind="sparkle" size={52} className="st-tl" delay={0.2} spin={-10} />
      <Sticker kind="heart" size={40} className="st-tr" delay={1.1} spin={14} />
      <Sticker kind="flower" size={46} className="st-br" delay={0.6} spin={8} />
      <Mascot label={mascot} />
      <h2 id="getapp-title">{title}</h2>
      <p>{text}</p>
      <AppStoreButton href={APP_STORE_URL} light label={label} />
    </section>
  );
}
