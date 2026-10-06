"use client";

import { useMemo, useRef, useState } from "react";
import type { Layout, Source } from "@/lib/booth";
import { LAYOUTS, loadPhoto } from "@/lib/booth";
import LayoutPicker from "./LayoutPicker";
import StripStudio from "./StripStudio";

type Slot = { photo: Source; thumb: string } | null;

function thumbOf(photo: Source) {
  const c = document.createElement("canvas");
  const k = 240 / Math.max(photo.width, photo.height);
  c.width = Math.round(photo.width * k); c.height = Math.round(photo.height * k);
  c.getContext("2d")!.drawImage(photo, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.7);
}

/** Photos you already have, into a booth strip: fill the frames, then the same editor as the booth. */
export default function StripMaker() {
  const [layout, setLayout] = useState<Layout>(LAYOUTS[0]);
  const [slots, setSlots] = useState<Slot[]>(Array(4).fill(null));
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const addInput = useRef<HTMLInputElement>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const replacing = useRef<number | null>(null);

  const used = slots.slice(0, layout.count);
  const filled = used.filter(Boolean).length;
  // A stable list, so the strip only re-renders when a photo actually changes.
  const photos = useMemo(() => slots.slice(0, layout.count).map((s) => s?.photo ?? null), [slots, layout.count]);

  function pickLayout(l: Layout) {
    setLayout(l);
    // Keep the photos; a 4-frame strip shrinking to Trio keeps the first three.
    setSlots((s) => Array.from({ length: Math.max(4, l.count) }, (_, i) => s[i] ?? null));
  }

  async function load(files: File[]) {
    const images = files.filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    if (!images.length) return [];
    setLoading(true);
    setError(null);
    const out: NonNullable<Slot>[] = [];
    for (const f of images) {
      try {
        const photo = await loadPhoto(f);
        out.push({ photo, thumb: thumbOf(photo) });
      } catch {
        setError(`We couldn't open ${f.name}. Try a JPEG or PNG.`);
      }
    }
    setLoading(false);
    return out;
  }

  async function add(files: File[]) {
    const loaded = await load(files);
    setSlots((s) => {
      const next = [...s];
      for (const item of loaded) {
        const i = next.findIndex((x, idx) => !x && idx < layout.count);
        if (i === -1) break;
        next[i] = item;
      }
      return next;
    });
  }

  async function replace(files: File[]) {
    const [item] = await load(files.slice(0, 1));
    const i = replacing.current;
    if (item && i !== null) setSlots((s) => s.map((x, idx) => (idx === i ? item : x)));
  }

  const move = (i: number, d: number) =>
    setSlots((s) => {
      const j = i + d;
      if (j < 0 || j >= layout.count) return s;
      const next = [...s];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const aspect = layout.columns === 1 ? "4 / 3" : "3 / 4";

  return (
    <div className="tool">
      <div className="maker">
        <div className="maker-inputs">
          <LayoutPicker value={layout.id} onChange={pickLayout} />

          <div
            className={`drop${drag ? " drop-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); add(Array.from(e.dataTransfer.files)); }}
          >
            <button type="button" className="btn btn-store" onClick={() => addInput.current?.click()}
                    disabled={filled >= layout.count || loading}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" /></svg>
              {loading ? "Adding…" : filled >= layout.count ? "All frames filled" : filled ? "Add more photos" : `Add ${layout.count} photos`}
            </button>
            <p className="fine">or drop them here · {filled} of {layout.count} frames filled · photos stay on your device</p>
            <input ref={addInput} type="file" accept="image/*" multiple hidden
                   onChange={(e) => { add(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
            <input ref={replaceInput} type="file" accept="image/*" hidden
                   onChange={(e) => { replace(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
          </div>
          {error && <p className="tool-error" role="alert">{error}</p>}

          <ol className="slots" aria-label="Frames">
            {used.map((s, i) => (
              <li key={i} className="slot" style={{ aspectRatio: aspect }}>
                {s ? (
                  <>
                    <img src={s.thumb} alt={`Frame ${i + 1}`} />
                    <div className="slot-tools">
                      <button type="button" aria-label={`Move frame ${i + 1} earlier`} onClick={() => move(i, -1)} disabled={i === 0}>‹</button>
                      <button type="button" aria-label={`Replace frame ${i + 1}`} onClick={() => { replacing.current = i; replaceInput.current?.click(); }}>↺</button>
                      <button type="button" aria-label={`Remove frame ${i + 1}`} onClick={() => setSlots((x) => x.map((y, idx) => (idx === i ? null : y)))}>✕</button>
                      <button type="button" aria-label={`Move frame ${i + 1} later`} onClick={() => move(i, 1)} disabled={i === layout.count - 1}>›</button>
                    </div>
                  </>
                ) : (
                  <button type="button" className="slot-empty" onClick={() => addInput.current?.click()} aria-label={`Add a photo to frame ${i + 1}`}>
                    <span>+</span>{i + 1}
                  </button>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {filled > 0 && (
        <StripStudio
          layout={layout}
          photos={photos}
          restartLabel="Start over"
          onRestart={() => setSlots(Array(4).fill(null))}
        />
      )}
    </div>
  );
}
