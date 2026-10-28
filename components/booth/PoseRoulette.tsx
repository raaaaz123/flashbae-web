"use client";

import { useEffect, useState } from "react";
import type { Crowd } from "@/lib/poses";
import { CROWDS, POSES } from "@/lib/poses";

const FRAMES = 4;
const COUNT_FROM = 3;

const shuffle = <T,>(items: T[]) => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * The pose generator game: deal a random pose, or play a four-frame round with a 3-2-1 countdown and flash,
 * like a real booth. Deals from a shuffled deck so a pose doesn't come back until every other one has.
 */
export default function PoseRoulette() {
  const [crowd, setCrowd] = useState<Crowd>("couple");
  // The first pose is fixed so the server and browser render the same thing; shuffling starts on the first deal.
  const [deck, setDeck] = useState(POSES.couple);
  const [at, setAt] = useState(0);
  const [round, setRound] = useState<{ frame: number; count: number } | null>(null);
  const [flash, setFlash] = useState(false);

  const pose = deck[at % deck.length];

  function pick(c: Crowd) {
    setCrowd(c);
    setDeck(shuffle(POSES[c]));
    setAt(0);
    setRound(null);
  }

  function next() {
    if (at + 1 >= deck.length) {
      setDeck(shuffle(POSES[crowd]));
      setAt(0);
    } else setAt(at + 1);
  }

  function play() {
    if (at === 0 && deck === POSES[crowd]) setDeck(shuffle(POSES[crowd]));
    else next();
    setRound({ frame: 1, count: COUNT_FROM });
  }

  // The round's clock: count down, flash, then deal the next pose until the strip is full.
  useEffect(() => {
    if (!round) return;
    const t = setTimeout(() => {
      if (round.count > 1) return setRound({ ...round, count: round.count - 1 });
      setFlash(true);
      setTimeout(() => setFlash(false), 220);
      if (round.frame >= FRAMES) return setRound(null);
      next();
      setRound({ frame: round.frame + 1, count: COUNT_FROM });
    }, round.frame > 1 && round.count === COUNT_FROM ? 1800 : 1000);
    return () => clearTimeout(t);
  }, [round]);

  return (
    <div className="tool pose-game">
      <fieldset className="field">
        <legend>Who&apos;s in the booth?</legend>
        <div className="opts" role="radiogroup" aria-label="Who's in the booth">
          {CROWDS.map((c) => (
            <button key={c.id} type="button" role="radio" aria-checked={c.id === crowd} className="opt"
              disabled={!!round} onClick={() => pick(c.id)}>{c.label}</button>
          ))}
        </div>
      </fieldset>

      <div className={`pose-card${flash ? " pose-flash" : ""}`} aria-live="polite">
        {round && (
          <p className="pose-frame">Frame {round.frame} of {FRAMES}</p>
        )}
        <span className="pose-emoji" aria-hidden="true">{pose.emoji}</span>
        <h2 className="pose-name">{pose.name}</h2>
        <p className="pose-tip">{pose.tip}</p>
        {round && <span className="pose-count" aria-label={`${round.count}`}>{round.count}</span>}
      </div>

      <div className="studio-actions">
        <button type="button" className="btn btn-store" onClick={play} disabled={!!round}>
          {round ? "Strike the pose!" : `▶ Play a ${FRAMES}-frame round`}
        </button>
        <button type="button" className="btn btn-soft" onClick={next} disabled={!!round}>Next pose 🎲</button>
      </div>
      <p className="field-note">
        Prop your phone up and play with the <a href="/online-photo-booth/">free online photo booth</a> open in
        another tab, or call out the poses at a real booth.
      </p>
    </div>
  );
}
