import { LOOKS } from "@/lib/looks";

/** Every look drifting past; hover a card (or focus it) to see the selfie it started from. */
export default function LooksMarquee() {
  const half = Math.ceil(LOOKS.length / 2);
  const rows = [LOOKS.slice(0, half), LOOKS.slice(half)];
  return (
    <div className="lp-marquee">
      {rows.map((row, r) => (
        <div key={r} className={`lp-marquee-row${r ? " lp-marquee-rev" : ""}`}>
          {/* The second copy makes the loop seamless; only the first is read out and focusable. */}
          {[0, 1].map((copy) => (
            <ul key={copy} className="lp-marquee-track" aria-hidden={copy === 1 || undefined}>
              {row.map((l) => (
                <li key={l.id}>
                  <a className="lp-look" href={`/looks/${l.slug}/`} tabIndex={copy ? -1 : undefined}>
                    <img className="lp-look-after" src={l.after} alt={copy ? "" : `${l.title} AI look`} loading="lazy" />
                    <img className="lp-look-before" src={l.before} alt="" loading="lazy" />
                    <span className="lp-look-label">{l.title}</span>
                    <span className="lp-look-peek">Before</span>
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      ))}
    </div>
  );
}
