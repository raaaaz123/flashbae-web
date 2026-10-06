import type { Look } from "@/lib/looks";

/** Looks as taped-on prints; hovering one shows the selfie it started from. `wrap` lays them out in a grid. */
export default function LookPrints({ looks, wrap = false }: { looks: Look[]; wrap?: boolean }) {
  return (
    <ul className={`gallery${wrap ? " gallery-wrap" : ""}`}>
      {looks.map((l) => (
        <li key={l.slug}>
          <a href={`/looks/${l.slug}/`} className="print">
            <span className="print-photo">
              <img src={l.after} alt={`${l.title} AI look`} loading="lazy" />
              <img src={l.before} alt="" loading="lazy" className="print-before" />
            </span>
            <span className="print-title">{l.title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
