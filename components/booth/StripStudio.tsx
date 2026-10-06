"use client";

import { useEffect, useRef, useState } from "react";
import type { Layout, Source, WebFilm } from "@/lib/booth";
import { FRAMES, WEB_FILMS, drawStrip, filmCell, geometry, pageFonts } from "@/lib/booth";
import AppPitch from "./AppPitch";

type Props = {
  layout: Layout;
  /** One photo per slot; null slots show as empty frames. */
  photos: (Source | null)[];
  /** "Retake" in the booth, "Start over" in the maker. */
  restartLabel: string;
  onRestart: () => void;
};

/** Films stay cached per photo, so switching frame colour or typing a caption never refilms anything. */
const filmed = new WeakMap<Source, Map<string, HTMLCanvasElement>>();

function cellFor(photo: Source, film: WebFilm, w: number, h: number, seed: number) {
  let byFilm = filmed.get(photo);
  if (!byFilm) filmed.set(photo, (byFilm = new Map()));
  const key = `${film.id}:${w}x${h}`;
  let c = byFilm.get(key);
  if (!c) byFilm.set(key, (c = filmCell(photo, w, h, film, seed)));
  return c;
}

export default function StripStudio({ layout, photos, restartLabel, onRestart }: Props) {
  const [film, setFilm] = useState<WebFilm>(WEB_FILMS[1]);
  const [frame, setFrame] = useState(FRAMES[0]);
  const [caption, setCaption] = useState("");
  const [showDate, setShowDate] = useState(true);
  const [busy, setBusy] = useState(true);
  const [saved, setSaved] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [locked, setLocked] = useState<string | null>(null);
  const out = useRef<HTMLCanvasElement>(null);
  const complete = photos.length === layout.count && photos.every(Boolean);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.canShare &&
      navigator.canShare({ files: [new File([""], "strip.png", { type: "image/png" })] }));
  }, []);

  // Render after the browser has painted the "developing" state; filming four frames takes a beat.
  useEffect(() => {
    let cancelled = false;
    setBusy(true);
    const id = window.setTimeout(async () => {
      const fonts = pageFonts();
      try { await document.fonts.load(`600 40px ${fonts.display}`); } catch { /* fall back to the stack */ }
      if (cancelled || !out.current) return;
      const g = geometry(layout);
      const cells = g.cells.map((_, i) => {
        const p = photos[i];
        return p ? cellFor(p, film, g.cellW, g.cellH, i + 1) : null;
      });
      drawStrip(out.current, cells, { layout, frame, caption, date: showDate ? new Date() : null, fonts });
      setBusy(false);
    }, 30);
    return () => { cancelled = true; window.clearTimeout(id); };
  }, [layout, photos, film, frame, caption, showDate]);

  const fileName = `flashbae-photo-strip-${new Date().toISOString().slice(0, 10)}.png`;
  const blob = () => new Promise<Blob>((res, rej) => out.current?.toBlob((b) => (b ? res(b) : rej()), "image/png"));

  async function download() {
    const url = URL.createObjectURL(await blob());
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    setSaved(true);
  }

  async function share() {
    try {
      await navigator.share({ files: [new File([await blob()], fileName, { type: "image/png" })], title: "My photo strip" });
      setSaved(true);
    } catch { /* closed the sheet */ }
  }

  return (
    <div className="studio">
      <div className="studio-preview">
        <div className={`studio-paper${layout.columns > 1 ? " studio-paper-wide" : ""}`} aria-busy={busy}>
          <canvas ref={out} className="studio-canvas" role="img" aria-label={`Your photo strip in the ${film.title} film`} />
          {busy && <span className="studio-developing">Developing…</span>}
        </div>
      </div>

      <div className="studio-controls">
        <fieldset className="field">
          <legend>Film</legend>
          <div className="opts opts-scroll" role="radiogroup" aria-label="Film">
            {WEB_FILMS.map((f) => (
              <button key={f.id} type="button" role="radio" aria-checked={f.id === film.id} className="opt"
                      onClick={() => setFilm(f)}>{f.title}</button>
            ))}
            <a className="opt opt-more" href="/films/">+22 in the app</a>
          </div>
        </fieldset>

        <fieldset className="field">
          <legend>Frame</legend>
          <div className="swatches" role="radiogroup" aria-label="Frame colour">
            {FRAMES.map((f) => (
              <button key={f.id} type="button" role="radio" aria-checked={f.id === frame.id} aria-label={f.pro ? `${f.title}, in the app` : f.title}
                      className={`swatch${f.pro ? " swatch-pro" : ""}${f.dark ? " swatch-dark" : ""}`} style={{ background: f.hex }}
                      onClick={() => (f.pro ? setLocked(f.title) : (setFrame(f), setLocked(null)))}>
                {f.pro && <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M7 10V8a5 5 0 0 1 10 0v2h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h1Zm2 0h6V8a3 3 0 0 0-6 0v2Z" /></svg>}
              </button>
            ))}
          </div>
          {locked && <p className="field-note" role="status">{locked} is one of the frame colours in the Flashbae app.</p>}
        </fieldset>

        <div className="field">
          <label htmlFor="caption">Caption</label>
          <input id="caption" className="input" value={caption} maxLength={32} placeholder="best night ever"
                 onChange={(e) => setCaption(e.target.value)} />
        </div>

        <label className="toggle">
          <input type="checkbox" checked={showDate} onChange={(e) => setShowDate(e.target.checked)} />
          <span>Date stamp</span>
        </label>

        <div className="studio-actions">
          <button type="button" className="btn btn-store" onClick={download} disabled={busy || !complete}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M11 4h2v9.17l3.59-3.58L18 11l-6 6-6-6 1.41-1.41L11 13.17V4ZM5 19h14v2H5v-2Z" /></svg>
            Download strip
          </button>
          {canShare && (
            <button type="button" className="btn btn-soft" onClick={share} disabled={busy || !complete}>Share</button>
          )}
          <button type="button" className="text-link link-button" onClick={onRestart}>{restartLabel}</button>
        </div>
        {!complete && <p className="field-note">Add a photo to every frame to download the strip.</p>}
      </div>

      {complete && <AppPitch saved={saved} />}
    </div>
  );
}
