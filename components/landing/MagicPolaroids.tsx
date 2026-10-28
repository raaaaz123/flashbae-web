"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { lookById } from "@/lib/looks";

const IDS = ["sun-kissed", "dreamlight", "adds-warm-cinematic-tones-and-soft-motio", "cozy-flash", "subway-motion", "neon-collage"];

/** The same selfie as two prints: the original on the left, the look on the right, with notes scribbled between. */
export default function MagicPolaroids() {
  const looks = IDS.map(lookById).filter((l) => !!l).map((l) => l!);
  const [i, setI] = useState(0);
  const look = looks[i];

  return (
    <div className="lp-magic">
      <div className="lp-polaroids">
        <span className="lp-note lp-note-top">
          Before → After with AI
          <svg viewBox="0 0 80 40" aria-hidden="true"><path d="M4 6c20 2 44 10 60 28m0 0-12-2m12 2 1-12" /></svg>
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.figure
            key={`b-${look.id}`}
            className="lp-polaroid lp-polaroid-before"
            initial={{ opacity: 0, x: -30, rotate: -14 }}
            animate={{ opacity: 1, x: 0, rotate: -7 }}
            exit={{ opacity: 0, x: -20, rotate: -2 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
          >
            <img src={look.before} alt={`Original selfie before ${look.title}`} />
            <figcaption>Before</figcaption>
          </motion.figure>
          <motion.figure
            key={`a-${look.id}`}
            className="lp-polaroid lp-polaroid-after"
            initial={{ opacity: 0, x: 30, rotate: 14 }}
            animate={{ opacity: 1, x: 0, rotate: 6 }}
            exit={{ opacity: 0, x: 20, rotate: 2 }}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.08 }}
          >
            <img src={look.after} alt={`The same selfie with ${look.title}`} />
            <figcaption>{look.title}</figcaption>
            <span className="lp-pin" aria-hidden="true" />
          </motion.figure>
        </AnimatePresence>
        <span className="lp-note lp-note-bottom">
          <svg viewBox="0 0 80 40" aria-hidden="true"><path d="M70 4C56 20 34 30 8 30m0 0 10-8M8 30l11 6" /></svg>
          seconds, same face &amp; pose
        </span>
      </div>

      <div className="lp-magic-side">
        <p className="lp-magic-tagline">{look.tagline}</p>
        <div className="lp-pills" role="radiogroup" aria-label="Pick a look">
          {looks.map((l, k) => (
            <button key={l.id} type="button" role="radio" aria-checked={k === i} className="lp-pill" onClick={() => setI(k)}>
              <img src={l.after} alt="" width={28} height={28} />
              {l.title}
            </button>
          ))}
        </div>
        <a className="lp-btn lp-btn-dark" href={`/ai-photo-generator/?look=${look.slug}`}>
          Try {look.title} on your selfie
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M5 10h10m-4-4 4 4-4 4" /></svg>
        </a>
      </div>
    </div>
  );
}
