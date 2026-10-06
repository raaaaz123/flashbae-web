"use client";

import { useEffect, useRef, useState } from "react";
import type { Source, StampColor, StampCorner, StampFormat, WebFilm } from "@/lib/booth";
import { WEB_FILMS, drawDateStamp, filmCell, loadPhoto, photoDate, stampText } from "@/lib/booth";
import AppPitch from "./AppPitch";

const FORMATS: { id: StampFormat; label: string }[] = [
  { id: "ymd", label: "Year first" },
  { id: "mdy", label: "Month first" },
  { id: "dmy", label: "Day first" },
];
const COLORS: { id: StampColor; label: string; hex: string }[] = [
  { id: "orange", label: "Orange", hex: "#FF8A1F" },
  { id: "yellow", label: "Yellow", hex: "#FFC93C" },
  { id: "red", label: "Red", hex: "#FF4B2B" },
];

/** yyyy-mm-dd for <input type="date">, in local time. */
const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** The film is the slow part, so it's kept per photo and film; the stamp is redrawn on top in an instant. */
const filmed = new WeakMap<Source, Map<string, HTMLCanvasElement>>();

/**
 * One photo, a digicam colour grade and the orange date stamp of a 2000s camera. The photo is opened,
 * graded and saved on the visitor's device.
 */
export default function DateStamp() {
  const [photo, setPhoto] = useState<Source | null>(null);
  const [name, setName] = useState("photo");
  const [film, setFilm] = useState<WebFilm>(WEB_FILMS.find((f) => f.id === "ccd")!);
  const [day, setDay] = useState(isoDay(new Date()));
  const [fromPhoto, setFromPhoto] = useState(false);
  const [format, setFormat] = useState<StampFormat>("ymd");
  const [color, setColor] = useState<StampColor>("orange");
  const [corner, setCorner] = useState<StampCorner>("right");
  const [size, setSize] = useState(0.055);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const out = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setCanShare(!!navigator.canShare && navigator.canShare({ files: [new File([""], "p.jpg", { type: "image/jpeg" })] }));
  }, []);

  async function open(file: File | undefined) {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const [p, taken] = await Promise.all([loadPhoto(file, 2400), photoDate(file)]);
      setPhoto(p);
      setName(file.name.replace(/\.[^.]+$/, "") || "photo");
      setDay(isoDay(taken ?? new Date()));
      setFromPhoto(!!taken);
      setSaved(false);
    } catch {
      setError(`We couldn't open ${file.name}. Try a JPEG or PNG.`);
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!photo) return;
    let cancelled = false;
    setBusy(true);
    const id = window.setTimeout(() => {
      if (cancelled || !out.current) return;
      let byFilm = filmed.get(photo);
      if (!byFilm) filmed.set(photo, (byFilm = new Map()));
      let graded = byFilm.get(film.id);
      if (!graded) byFilm.set(film.id, (graded = filmCell(photo, photo.width, photo.height, film)));
      const c = out.current;
      c.width = graded.width; c.height = graded.height;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(graded, 0, 0);
      const [y, m, d] = day.split("-").map(Number);
      drawDateStamp(ctx, c.width, c.height, { text: stampText(new Date(y, m - 1, d), format), color, corner, size });
      setBusy(false);
    }, 30);
    return () => { cancelled = true; window.clearTimeout(id); };
  }, [photo, film, day, format, color, corner, size]);

  const fileName = () => `${name}-date-stamp.jpg`;
  const blob = () => new Promise<Blob>((res, rej) => out.current?.toBlob((b) => (b ? res(b) : rej()), "image/jpeg", 0.92));

  async function download() {
    const url = URL.createObjectURL(await blob());
    const a = document.createElement("a");
    a.href = url; a.download = fileName();
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    setSaved(true);
  }

  async function share() {
    try {
      await navigator.share({ files: [new File([await blob()], fileName(), { type: "image/jpeg" })] });
      setSaved(true);
    } catch { /* closed the sheet */ }
  }

  return (
    <div className="tool">
      {!photo ? (
        <div
          className={`drop drop-big${drag ? " drop-over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); open(e.dataTransfer.files[0]); }}
        >
          <span className="stamp-demo" aria-hidden="true">&apos;26 10 6</span>
          <button type="button" className="btn btn-store" onClick={() => input.current?.click()} disabled={busy}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" /></svg>
            {busy ? "Opening…" : "Choose a photo"}
          </button>
          <p className="fine">or drop it here · your photo stays on your device</p>
          {error && <p className="tool-error" role="alert">{error}</p>}
        </div>
      ) : (
        <div className="studio">
          <div className="studio-preview">
            <div className="studio-photo" aria-busy={busy}>
              <canvas ref={out} className="studio-canvas" role="img" aria-label={`Your photo with a date stamp, in the ${film.title} film`} />
              {busy && <span className="studio-developing">Developing…</span>}
            </div>
          </div>
          <div className="studio-controls">
            <fieldset className="field">
              <legend>Film</legend>
              <div className="opts opts-scroll" role="radiogroup" aria-label="Film">
                {WEB_FILMS.map((f) => (
                  <button key={f.id} type="button" role="radio" aria-checked={f.id === film.id} className="opt" onClick={() => setFilm(f)}>{f.title}</button>
                ))}
              </div>
            </fieldset>

            <div className="field">
              <label htmlFor="stamp-day">Date</label>
              <input id="stamp-day" type="date" className="input" value={day} onChange={(e) => { if (e.target.value) { setDay(e.target.value); setFromPhoto(false); } }} />
              {fromPhoto && <p className="field-note">The day this photo was taken, from the photo itself.</p>}
            </div>

            <fieldset className="field">
              <legend>Order</legend>
              <div className="opts" role="radiogroup" aria-label="Date order">
                {FORMATS.map((f) => (
                  <button key={f.id} type="button" role="radio" aria-checked={f.id === format} className="opt" onClick={() => setFormat(f.id)}>{f.label}</button>
                ))}
              </div>
            </fieldset>

            <div className="stamp-row">
              <fieldset className="field">
                <legend>Colour</legend>
                <div className="swatches" role="radiogroup" aria-label="Stamp colour">
                  {COLORS.map((c) => (
                    <button key={c.id} type="button" role="radio" aria-checked={c.id === color} aria-label={c.label}
                            className="swatch swatch-glow" style={{ background: c.hex, color: c.hex }} onClick={() => setColor(c.id)} />
                  ))}
                </div>
              </fieldset>
              <fieldset className="field">
                <legend>Corner</legend>
                <div className="opts" role="radiogroup" aria-label="Corner">
                  <button type="button" role="radio" aria-checked={corner === "left"} className="opt" onClick={() => setCorner("left")}>Left</button>
                  <button type="button" role="radio" aria-checked={corner === "right"} className="opt" onClick={() => setCorner("right")}>Right</button>
                </div>
              </fieldset>
            </div>

            <div className="field">
              <label htmlFor="stamp-size">Size</label>
              <input id="stamp-size" type="range" className="range" min={0.03} max={0.09} step={0.005} value={size}
                     onChange={(e) => setSize(Number(e.target.value))} />
            </div>

            <div className="studio-actions">
              <button type="button" className="btn btn-store" onClick={download} disabled={busy}>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M11 4h2v9.17l3.59-3.58L18 11l-6 6-6-6 1.41-1.41L11 13.17V4ZM5 19h14v2H5v-2Z" /></svg>
                Download photo
              </button>
              {canShare && <button type="button" className="btn btn-soft" onClick={share} disabled={busy}>Share</button>}
              <button type="button" className="text-link link-button" onClick={() => input.current?.click()}>Use another photo</button>
            </div>
          </div>
          <AppPitch saved={saved} kind="photo" />
        </div>
      )}
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { open(e.target.files?.[0]); e.target.value = ""; }} />
    </div>
  );
}
