import { LOOKS } from "@/lib/looks";

/** A tilted ribbon of look names scrolling past, like a sticker roll; it pauses under the pointer. */
export default function Ribbon({ tone = "cherry", tilt = -2.5 }: { tone?: "cherry" | "butter"; tilt?: number }) {
  const names = LOOKS.map((l) => l.title);
  const run = (
    <span className="ribbon-run">
      {names.map((n) => (
        <span key={n} className="ribbon-item">
          {n}
          <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
            <path fill="currentColor" d="M24 4c1.6 9.4 4.6 14.4 16 20-11.4 5.6-14.4 10.6-16 20-1.6-9.4-4.6-14.4-16-20 11.4-5.6 14.4-10.6 16-20z" />
          </svg>
        </span>
      ))}
    </span>
  );
  return (
    // The wrapper clips the tilted band so it never widens the page.
    <div className="ribbon-wrap" aria-hidden="true">
      <div className={`ribbon ribbon-${tone}`} style={{ ["--tilt" as string]: `${tilt}deg` }}>
        <div className="ribbon-track">
          {run}
          {run}
        </div>
      </div>
    </div>
  );
}
