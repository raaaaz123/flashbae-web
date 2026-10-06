"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * A four-frame strip sliding out of the booth's slot the first time it scrolls into view;
 * each frame develops from milky white as it comes out.
 *
 * Fails open: the server renders the finished strip. It is only tucked into the slot once
 * script has run, the strip is still below the fold, and an IntersectionObserver is watching
 * to bring it back — so a page that never hydrates still shows every frame.
 */
export default function BoothStrip({ frames, caption }: { frames: { src: string; alt: string }[]; caption: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"shown" | "tucked" | "printing">("shown");

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return; // already in view: leave it
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setPhase("printing");
      io.disconnect();
    }, { threshold: 0.35 });
    setPhase("tucked");
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const tucked = phase === "tucked";
  const printing = phase === "printing";

  return (
    <div className="booth" ref={ref}>
      <div className="booth-slot" aria-hidden="true" />
      <div className="booth-window">
        <motion.figure
          className="strip"
          initial={false}
          animate={{ y: tucked ? "-102%" : "0%" }}
          transition={printing ? { duration: 2.4, ease: [0.3, 0.1, 0.2, 1] } : { duration: 0 }}
        >
          {frames.map((f, i) => (
            <motion.img
              key={f.src}
              src={f.src}
              alt={f.alt}
              className="strip-frame"
              initial={false}
              animate={tucked ? { opacity: 0.15, filter: "saturate(0) brightness(1.6)" } : { opacity: 1, filter: "saturate(1) brightness(1)" }}
              transition={printing ? { duration: 1.2, delay: 1.9 - i * 0.45 } : { duration: 0 }}
            />
          ))}
          <figcaption className="strip-caption">{caption}</figcaption>
        </motion.figure>
      </div>
    </div>
  );
}
