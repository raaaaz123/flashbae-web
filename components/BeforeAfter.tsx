"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionTemplate, useTransform } from "framer-motion";
import type { Look } from "@/lib/looks";

/** One before/after: the look over the original, split by a handle you drag (or arrow-key). */
export function Compare({ look, priority = false }: { look: Look; priority?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const split = useMotionValue(50);
  // The before covers the left part: clip off everything right of the handle.
  const right = useTransform(split, (v) => 100 - v);
  const clip = useMotionTemplate`inset(0 ${right}% 0 0)`;
  const left = useMotionTemplate`${split}%`;
  const [value, setValue] = useState(50);

  const set = (v: number) => {
    const c = Math.min(100, Math.max(0, v));
    split.set(c);
    setValue(Math.round(c));
  };
  const fromPointer = (e: PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    set(((e.clientX - r.left) / r.width) * 100);
  };
  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 20 : 5;
    if (e.key === "ArrowLeft") set(value - step);
    else if (e.key === "ArrowRight") set(value + step);
    else if (e.key === "Home") set(0);
    else if (e.key === "End") set(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={box}
      className="compare"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        fromPointer(e);
      }}
      onPointerMove={(e) => e.buttons === 1 && fromPointer(e)}
    >
      <img src={look.after} alt={`${look.title} look applied to the selfie`} className="compare-img" draggable={false}
           fetchPriority={priority ? "high" : "auto"} />
      <motion.img src={look.before} alt={`The original selfie before ${look.title}`} className="compare-img"
                  style={{ clipPath: clip }} draggable={false} />
      <span className="compare-tag compare-tag-before">Before</span>
      <span className="compare-tag compare-tag-after">{look.title}</span>
      <motion.div className="compare-line" style={{ left }} aria-hidden="true" />
      <motion.div
        className="compare-handle"
        style={{ left }}
        role="slider"
        tabIndex={0}
        aria-label={`Compare before and after ${look.title}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${value}% original`}
        onKeyDown={onKey}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          <path d="M8 6 3 11l5 5M14 6l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </div>
  );
}

/** The compare plus a row of looks to switch between. */
export default function BeforeAfter({ looks }: { looks: Look[] }) {
  const [i, setI] = useState(0);
  const look = looks[i];
  return (
    <div className="ba">
      <div className="ba-stage">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={look.slug}
            className="ba-frame"
            initial={{ opacity: 0, rotate: -2, scale: 0.97 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 2, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <Compare look={look} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="ba-side">
        <p className="ba-tagline">{look.tagline}</p>
        <div className="chips" role="radiogroup" aria-label="Pick a look">
          {looks.map((l, k) => (
            <button
              key={l.slug}
              type="button"
              role="radio"
              aria-checked={k === i}
              className="chip"
              onClick={() => setI(k)}
            >
              {k === i && <motion.span layoutId="chip-bg" className="chip-bg" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="chip-label">{l.title}</span>
            </button>
          ))}
        </div>
        <a className="text-link" href={`/looks/${look.slug}/`}>More about {look.title}</a>
      </div>
    </div>
  );
}
