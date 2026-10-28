"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Compare } from "@/components/BeforeAfter";
import { lookById } from "@/lib/looks";

const STUDIOS = [
  {
    id: "golden",
    label: "Golden hour",
    points: ["Sunset glow on any background", "Warm beams of window light", "Soft cinematic motion"],
    ids: ["dreamlight", "sun-kissed", "adds-warm-cinematic-tones-and-soft-motio"],
  },
  {
    id: "flash",
    label: "Flash & digicam",
    points: ["Direct 2000s point-and-shoot flash", "Punchy colour, real grain", "Warm, intimate indoor flash"],
    ids: ["disposable-flash", "soft-flash", "cozy-flash"],
  },
  {
    id: "night",
    label: "Night out",
    points: ["New scene, same face and pose", "Dark streets and subway motion", "Editorial, magazine-style framing"],
    ids: ["midnight-flash", "subway-motion", "subway-still"],
  },
  {
    id: "play",
    label: "Play",
    points: ["A 16-face black-and-white booth grid", "Neon doodles on a city collage", "Made to post and share"],
    ids: ["face-roll", "neon-collage"],
  },
  {
    id: "fix",
    label: "Fix the shot",
    points: ["Open closed eyes, fix the pose", "Erase strangers from the background", "Looks like you, only better"],
    ids: ["retake", "clear-scene"],
  },
];

/** The studio: pick a mood, then a look, and drag across the photo to see what it did. */
export default function StudioShowcase() {
  const [s, setS] = useState(0);
  const [k, setK] = useState(0);
  const studio = STUDIOS[s];
  const looks = studio.ids.map(lookById).filter((l) => !!l).map((l) => l!);
  const look = looks[Math.min(k, looks.length - 1)];

  return (
    <div className="lp-studio">
      <div className="lp-studio-tabs" role="tablist" aria-label="AI studios">
        {STUDIOS.map((st, i) => (
          <button
            key={st.id}
            type="button"
            role="tab"
            aria-selected={i === s}
            className="lp-studio-tab"
            onClick={() => { setS(i); setK(0); }}
          >
            {i === s && <motion.span layoutId="studio-tab" className="lp-studio-tab-bg" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            <span>{st.label}</span>
          </button>
        ))}
      </div>

      <div className="lp-studio-body" role="tabpanel" aria-label={studio.label}>
        <ul className="lp-studio-points">
          {studio.points.map((p) => (
            <li key={p}>
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="m5 10.5 3 3 7-7" /></svg>
              {p}
            </li>
          ))}
          <li className="lp-studio-cta">
            <a className="lp-link" href={`/looks/${look.slug}/`}>About {look.title} →</a>
          </li>
        </ul>

        <div className="lp-device">
          <div className="lp-device-bar">
            <span /><span /><span />
            <p>{look.title}</p>
          </div>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={look.id}
              className="lp-device-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Compare look={look} />
            </motion.div>
          </AnimatePresence>
          <p className="lp-device-hint">Drag the handle to compare</p>
        </div>

        <div className="lp-studio-thumbs" role="radiogroup" aria-label={`${studio.label} looks`}>
          {looks.map((l, i) => (
            <button key={l.id} type="button" role="radio" aria-checked={l.id === look.id} className="lp-thumb" onClick={() => setK(i)}>
              <img src={l.after} alt="" />
              <span>{l.title}</span>
            </button>
          ))}
          <a className="lp-thumb lp-thumb-try" href={`/ai-photo-generator/?look=${look.slug}`}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 16V4m0 0-5 5m5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
            <span>Try it with your selfie</span>
          </a>
        </div>
      </div>
    </div>
  );
}
