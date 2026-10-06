"use client";

import { useState } from "react";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";

const BURST = [
  { x: -78, y: -54, r: -20, c: "var(--butter)" },
  { x: 82, y: -62, r: 18, c: "var(--cherry)" },
  { x: -96, y: 18, r: 30, c: "var(--lilac-deep)" },
  { x: 100, y: 10, r: -26, c: "var(--butter)" },
  { x: -40, y: -96, r: 8, c: "var(--strawberry)" },
  { x: 46, y: -100, r: -8, c: "var(--lilac-deep)" },
];

/** The camera mascot: idles with a little bounce; press it and it takes your picture. */
export default function Mascot({ size = 170 }: { size?: number }) {
  const reduce = useReducedMotion();
  const body = useAnimationControls();
  const [shots, setShots] = useState(0);
  const [talking, setTalking] = useState(false);

  const snap = () => {
    setShots((n) => n + 1);
    setTalking(true);
    window.setTimeout(() => setTalking(false), 1400);
    if (!reduce) body.start({ scaleX: [1, 1.12, 0.96, 1], scaleY: [1, 0.86, 1.06, 1], transition: { duration: 0.5 } });
  };

  return (
    <div className="mascot" style={{ width: size }}>
      <AnimatePresence>
        {talking && (
          <motion.span
            className="mascot-bubble"
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
          >
            cheese!
          </motion.span>
        )}
      </AnimatePresence>
      <motion.button type="button" className="mascot-btn" onClick={snap} animate={body} whileHover={reduce ? {} : { rotate: -4, y: -4 }}
                     whileTap={{ scale: 0.94 }} aria-label="Take a photo with the Flashbae camera">
        <img src="/mascot.png" alt="" width={size} height={Math.round(size * 0.88)} className="mascot-img" />
        <AnimatePresence>
          {shots > 0 && !reduce && (
            <motion.span key={`flash-${shots}`} className="mascot-flash" initial={{ opacity: 0.95, scale: 0.4 }}
                         animate={{ opacity: 0, scale: 2.4 }} transition={{ duration: 0.6, ease: "easeOut" }} />
          )}
        </AnimatePresence>
      </motion.button>
      <AnimatePresence>
        {shots > 0 && !reduce &&
          BURST.map((b, i) => (
            <motion.svg
              key={`${shots}-${i}`}
              viewBox="0 0 48 48"
              width="26"
              height="26"
              className="mascot-spark"
              initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
              animate={{ x: b.x, y: b.y, scale: 1, rotate: b.r, opacity: [1, 1, 0] }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              aria-hidden="true"
            >
              <path fill={b.c} stroke="#fff" strokeWidth="5" paintOrder="stroke" strokeLinejoin="round"
                    d="M24 4c1.6 9.4 4.6 14.4 16 20-11.4 5.6-14.4 10.6-16 20-1.6-9.4-4.6-14.4-16-20 11.4-5.6 14.4-10.6 16-20z" />
            </motion.svg>
          ))}
      </AnimatePresence>
    </div>
  );
}
