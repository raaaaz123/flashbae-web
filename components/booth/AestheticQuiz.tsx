"use client";

import { useState } from "react";
import { AESTHETICS, QUESTIONS } from "@/lib/aesthetics";
import type { FilmGroup } from "@/lib/films";

export type ResultExtras = Record<FilmGroup, { look?: { slug: string; title: string; after: string }; films: string[] }>;

/**
 * Six questions, five answers each; every answer is a vote for one of the booth's film groups. The page passes in the
 * matching look and films so the looks catalog stays out of the browser bundle.
 */
export default function AestheticQuiz({ extras }: { extras: ResultExtras }) {
  const [picks, setPicks] = useState<FilmGroup[]>([]);
  const [shared, setShared] = useState(false);
  const done = picks.length === QUESTIONS.length;

  // Most votes wins; a tie goes to whichever of the tied groups was picked last.
  const result = done
    ? [...picks].reverse().reduce((best, g) => (picks.filter((p) => p === g).length > picks.filter((p) => p === best).length ? g : best))
    : null;

  async function share(name: string) {
    const url = `${location.origin}/aesthetic-quiz/`;
    const text = `My photo aesthetic is ${name}. What's yours?`;
    try {
      if (navigator.share) await navigator.share({ title: "What's your photo aesthetic?", text, url });
      else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setShared(true);
      }
    } catch {
      // Closing the share sheet isn't an error worth showing.
    }
  }

  if (result) {
    const a = AESTHETICS[result];
    const { look, films } = extras[result];
    return (
      <div className="tool quiz quiz-result" aria-live="polite">
        <div className="quiz-result-copy">
          <p className="pitch-kicker">Your photo aesthetic is</p>
          <h2 className="quiz-result-name"><span aria-hidden="true">{a.emoji}</span> {a.name}</h2>
          <p>{a.text}</p>
          <p className="field-note">Your films in the Flashbae booth: {films.join(", ")}.</p>
          <div className="studio-actions">
            {look && <a className="btn btn-store" href={`/looks/${look.slug}/`}>Try the {look.title} AI look</a>}
            <button type="button" className="btn btn-soft" onClick={() => share(a.name)}>{shared ? "Link copied ✓" : "Share my result"}</button>
          </div>
          <button type="button" className="text-link link-button" onClick={() => { setPicks([]); setShared(false); }}>Take the quiz again</button>
        </div>
        {look && <img className="quiz-result-photo" src={look.after} alt={`A photo in the ${look.title} look`} />}
      </div>
    );
  }

  const step = picks.length;
  const { q, answers } = QUESTIONS[step];
  return (
    <div className="tool quiz">
      <div className="quiz-progress" role="progressbar" aria-valuemin={0} aria-valuemax={QUESTIONS.length} aria-valuenow={step}
        aria-label="Questions answered">
        <span style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
      </div>
      <p className="field-note">Question {step + 1} of {QUESTIONS.length}</p>
      <h2 className="quiz-q">{q}</h2>
      <div className="quiz-answers">
        {answers.map((ans) => (
          <button key={ans.text} type="button" className="quiz-answer" onClick={() => setPicks([...picks, ans.to])}>{ans.text}</button>
        ))}
      </div>
      {step > 0 && (
        <button type="button" className="text-link link-button" onClick={() => setPicks(picks.slice(0, -1))}>← Back</button>
      )}
    </div>
  );
}
