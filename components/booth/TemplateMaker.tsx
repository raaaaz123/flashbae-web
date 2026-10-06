"use client";

import { useEffect, useRef, useState } from "react";
import { FRAMES, pageFonts } from "@/lib/booth";
import type { Template } from "@/lib/templates";
import { TEMPLATES, drawTemplate, withDpi } from "@/lib/templates";
import AppPitch from "./AppPitch";

const PAPERS = [...FRAMES.map((f) => ({ id: f.id, title: f.title, hex: f.hex, dark: f.dark })),
  { id: "lilac", title: "Lilac", hex: "#ECE4FF", dark: false }];

/** Blank strips and sheets to print or to load into photo booth software, with your own text. */
export default function TemplateMaker() {
  const [template, setTemplate] = useState<Template>(TEMPLATES[0]);
  const [paper, setPaper] = useState(PAPERS[0]);
  const [line1, setLine1] = useState("Emma & Jake");
  const [line2, setLine2] = useState("06.10.2026");
  const [windows, setWindows] = useState<"grey" | "clear">("grey");
  const [mark, setMark] = useState(true);
  const [saved, setSaved] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const out = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const fonts = pageFonts();
      try { await Promise.all([document.fonts.load(`600 60px ${fonts.display}`), document.fonts.load(`500 30px ${fonts.body}`)]); } catch { /* stack */ }
      if (cancelled || !out.current) return;
      drawTemplate(out.current, {
        template, paper: paper.hex, ink: paper.dark ? "#FFFFFF" : "#2B1A20", line1, line2, windows, mark,
        fonts: { display: fonts.display, body: fonts.body },
      });
      setUrl(null);
    })();
    return () => { cancelled = true; };
  }, [template, paper, line1, line2, windows, mark]);

  const fileName = `photo-strip-template-${template.id}-${template.w}x${template.h}in.png`;

  async function download() {
    const png = await new Promise<Blob>((res, rej) => out.current?.toBlob((b) => (b ? res(b) : rej()), "image/png"));
    const href = URL.createObjectURL(await withDpi(png));
    const a = document.createElement("a");
    a.href = href; a.download = fileName;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 4000);
    setSaved(true);
  }

  // The print image is made only when asked: encoding a 300 dpi PNG on every keystroke would lag typing.
  async function print() {
    if (!out.current) return;
    const src = out.current.toDataURL("image/png");
    setUrl(src);
    const img = new Image();
    img.src = src;
    await img.decode().catch(() => {});
    await new Promise((r) => setTimeout(r, 60));
    window.print();
    setSaved(true);
  }

  return (
    <div className="tool">
      <div className="studio">
        <div className="studio-preview">
          <div className={`template-paper${template.w > 2 ? " template-paper-wide" : ""}${windows === "clear" ? " template-clear" : ""}`}>
            <canvas ref={out} className="studio-canvas" role="img" aria-label={`${template.title} template, ${template.size}`} />
          </div>
          <p className="fine template-size">{template.size} · {template.w * 300} × {template.h * 300} px at 300 dpi</p>
        </div>

        <div className="studio-controls">
          <fieldset className="field">
            <legend>Template</legend>
            <div className="template-opts" role="radiogroup" aria-label="Template">
              {TEMPLATES.map((t) => (
                <button key={t.id} type="button" role="radio" aria-checked={t.id === template.id} className="template-opt" onClick={() => setTemplate(t)}>
                  <strong>{t.title}</strong>
                  <span>{t.size}</span>
                  <span className="template-note">{t.note}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="line1">Names or title</label>
            <input id="line1" className="input" value={line1} maxLength={40} placeholder="Emma & Jake" onChange={(e) => setLine1(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="line2">Date or hashtag</label>
            <input id="line2" className="input" value={line2} maxLength={48} placeholder="06.10.2026 · #EmmaAndJake" onChange={(e) => setLine2(e.target.value)} />
          </div>

          <fieldset className="field">
            <legend>Paper</legend>
            <div className="swatches" role="radiogroup" aria-label="Paper colour">
              {PAPERS.map((p) => (
                <button key={p.id} type="button" role="radio" aria-checked={p.id === paper.id} aria-label={p.title}
                        className="swatch" style={{ background: p.hex }} onClick={() => setPaper(p)} />
              ))}
            </div>
          </fieldset>

          <fieldset className="field">
            <legend>Photo windows</legend>
            <div className="opts" role="radiogroup" aria-label="Photo windows">
              <button type="button" role="radio" aria-checked={windows === "grey"} className="opt" onClick={() => setWindows("grey")}>Grey, to print</button>
              <button type="button" role="radio" aria-checked={windows === "clear"} className="opt" onClick={() => setWindows("clear")}>See-through overlay</button>
            </div>
            <p className="field-note">
              {windows === "grey"
                ? "Print it and stick or slot your photos into the frames."
                : "A transparent PNG: the frames are see-through, ready for photo booth software or a design app."}
            </p>
          </fieldset>

          <label className="toggle">
            <input type="checkbox" checked={mark} onChange={(e) => setMark(e.target.checked)} />
            <span>Small flashbae mark <span className="field-hint">(thanks for keeping it!)</span></span>
          </label>

          <div className="studio-actions">
            <button type="button" className="btn btn-store" onClick={download}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M11 4h2v9.17l3.59-3.58L18 11l-6 6-6-6 1.41-1.41L11 13.17V4ZM5 19h14v2H5v-2Z" /></svg>
              Download PNG
            </button>
            <button type="button" className="btn btn-soft" onClick={print}>Print</button>
          </div>
          <p className="field-note">Print at 100% (actual size), on {template.w > 2 ? "4×6 photo paper" : "photo paper, then trim to 2×6 inches"}.</p>
        </div>
        <AppPitch saved={saved} kind="template" />
      </div>

      {/* What the printer sees: only the template, at its real size. */}
      {url && (
        <div className="print-only" aria-hidden="true">
          <style>{`@page { size: ${template.w}in ${template.h}in; margin: 0; }`}</style>
          <img src={url} alt="" style={{ width: `${template.w}in`, height: `${template.h}in` }} />
        </div>
      )}
    </div>
  );
}
