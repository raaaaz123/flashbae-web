"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Person = { name: string; before: string; after: string };

const HEARTS = [
  { x: -46, y: -120, s: 30, r: -14, c: "var(--cherry)" },
  { x: 38, y: -150, s: 24, r: 12, c: "var(--strawberry)" },
  { x: -8, y: -190, s: 36, r: -4, c: "var(--cherry)" },
  { x: 62, y: -96, s: 20, r: 20, c: "var(--lilac-deep)" },
  { x: -70, y: -70, s: 22, r: -22, c: "var(--strawberry)" },
];

/**
 * Two phones, two cities, one countdown: press the button and both count 3-2-1 and flash at
 * the same moment, the way a booth with a friend works in the app.
 */
export default function Together({ a, b }: { a: Person; b: Person }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState<number | null>(null);
  const [shot, setShot] = useState(false);
  const [burst, setBurst] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const start = () => {
    timers.current.forEach(clearTimeout);
    setShot(false);
    if (reduce) { setShot(true); return; }
    [3, 2, 1].forEach((n, i) => timers.current.push(window.setTimeout(() => setCount(n), i * 700)));
    timers.current.push(window.setTimeout(() => { setCount(null); setShot(true); setBurst((n) => n + 1); }, 2100));
  };

  return (
    <div className="together">
      <div className="phones">
        {[a, b].map((p, i) => (
          <div key={p.name} className={`phone phone-${i}`}>
            <div className="phone-screen">
              <img src={shot ? p.after : p.before} alt={shot ? `${p.name}'s frame after the flash` : `${p.name} on live video`} loading="lazy" />
              <span className="phone-live">{shot ? "Shot" : "Live"}</span>
              <span className="phone-name">{p.name}</span>
              <AnimatePresence>
                {count !== null && (
                  <motion.span
                    key={count}
                    className="phone-count"
                    initial={{ scale: 1.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    aria-hidden="true"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {shot && !reduce && (
                  <motion.span
                    className="phone-flash"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    aria-hidden="true"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
        <svg className="phones-link" viewBox="0 0 120 40" aria-hidden="true">
          <path d="M4 30 C 40 2, 80 2, 116 30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
        </svg>
        {/* After the flash: a little burst of hearts between the two of you. */}
        <AnimatePresence>
          {shot && !reduce && HEARTS.map((h, i) => (
            <motion.svg
              key={`${burst}-${i}`}
              viewBox="0 0 48 48"
              width={h.s}
              height={h.s}
              className="together-heart"
              initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
              animate={{ x: h.x, y: h.y, scale: 1, opacity: [0, 1, 1, 0], rotate: h.r }}
              transition={{ duration: 1.6, delay: i * 0.06, ease: "easeOut" }}
              aria-hidden="true"
            >
              <path fill={h.c} stroke="#fff" strokeWidth="5" paintOrder="stroke" strokeLinejoin="round"
                    d="M24 41s-15-9.2-15-20.3C9 15 13 11 18 11c3 0 5 1.6 6 4 1-2.4 3-4 6-4 5 0 9 4 9 9.7C39 31.8 24 41 24 41z" />
            </motion.svg>
          ))}
        </AnimatePresence>
      </div>
      <button type="button" className="btn btn-soft" onClick={start} disabled={count !== null}>
        {shot ? "Count down again" : "Count down together"}
      </button>
      <p className="sr-only" aria-live="polite">{count !== null ? `${count}` : shot ? "Both phones flashed at the same moment." : ""}</p>
    </div>
  );
}
