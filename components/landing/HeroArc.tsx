import { lookById } from "@/lib/looks";

/** The finished looks fanned around the headline, tilted along the arc like prints spread on a table. */
const ARC = [
  "neon-collage", "cozy-flash", "dreamlight", "subway-motion", "sun-kissed",
  "midnight-flash", "adds-warm-cinematic-tones-and-soft-motio", "soft-flash", "disposable-flash",
];
const ANGLES = [-100, -75, -50, -25, 0, 25, 50, 75, 100];

export default function HeroArc() {
  const looks = ARC.map(lookById).filter((l) => !!l);
  return (
    <div className="lp-arc" aria-hidden="true">
      {looks.map((l, i) => (
        <div
          key={l!.id}
          className="lp-arc-card"
          style={{ "--a": `${ANGLES[i]}deg`, "--d": `${0.08 * Math.abs(i - 4)}s`, "--i": i } as React.CSSProperties}
        >
          <div className="lp-arc-bob">
            <img src={l!.after} alt="" width={160} height={200} fetchPriority={i === 4 ? "high" : "auto"} />
          </div>
        </div>
      ))}
    </div>
  );
}
