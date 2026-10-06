// Printable photo strip templates: blank strips and sheets at 300 dpi, drawn in the browser.
// The PNG carries its print size (a pHYs chunk), so it prints at 2×6 or 4×6 inches without resizing.

export const DPI = 300;

export type TemplateId = "strip4" | "strip3" | "sheet4" | "grid4";

export type Template = {
  id: TemplateId;
  title: string;
  size: string;
  note: string;
  /** Inches. */
  w: number;
  h: number;
  /** How many strips side by side on the sheet. */
  strips: number;
  frames: number;
  columns: number;
};

export const TEMPLATES: Template[] = [
  { id: "strip4", title: "Classic strip", size: "2 × 6 in", note: "Four frames, the coin-op booth strip", w: 2, h: 6, strips: 1, frames: 4, columns: 1 },
  { id: "strip3", title: "Trio strip", size: "2 × 6 in", note: "Three bigger frames", w: 2, h: 6, strips: 1, frames: 3, columns: 1 },
  { id: "sheet4", title: "Print sheet", size: "4 × 6 in", note: "Two Classic strips: print as a 4×6 photo, cut in half", w: 4, h: 6, strips: 2, frames: 4, columns: 1 },
  { id: "grid4", title: "4-cut grid", size: "4 × 6 in", note: "Four frames in a 2 × 2 grid", w: 4, h: 6, strips: 1, frames: 4, columns: 2 },
];

export type TemplateOptions = {
  template: Template;
  paper: string;
  ink: string;
  line1: string;
  line2: string;
  /** Photo windows: light grey to print and stick photos on, or see-through for photo booth software. */
  windows: "grey" | "clear";
  mark: boolean;
  fonts: { display: string; body: string };
};

/** One strip's layout, in pixels, inside a box `w` wide and `h` tall. */
function stripRects(t: Template, w: number, h: number) {
  const pad = Math.round(w * (t.columns === 1 ? 0.06 : 0.05)), gap = Math.round(w * 0.04);
  const footer = Math.round(h * (t.columns === 1 ? 0.16 : 0.17));
  const rows = t.frames / t.columns;
  const cw = (w - pad * 2 - gap * (t.columns - 1)) / t.columns;
  const ch = (h - pad - footer - gap * (rows - 1)) / rows;
  const frames = Array.from({ length: t.frames }, (_, i) => {
    const r = Math.floor(i / t.columns), c = i % t.columns;
    return { x: pad + c * (cw + gap), y: pad + r * (ch + gap), w: cw, h: ch };
  });
  return { frames, footer: { x: pad, y: h - footer, w: w - pad * 2, h: footer } };
}

export function drawTemplate(out: HTMLCanvasElement, o: TemplateOptions) {
  const t = o.template, W = t.w * DPI, H = t.h * DPI;
  out.width = W; out.height = H;
  const ctx = out.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  const sw = W / t.strips;
  for (let s = 0; s < t.strips; s++) {
    ctx.save();
    ctx.translate(s * sw, 0);
    ctx.fillStyle = o.paper;
    ctx.fillRect(0, 0, sw, H);
    const { frames, footer } = stripRects(t, sw, H);
    for (const f of frames) {
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(f.x, f.y, f.w, f.h, 10) : ctx.rect(f.x, f.y, f.w, f.h);
      if (o.windows === "clear") {
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = "#E9E4E1";
        ctx.fill();
        ctx.strokeStyle = "rgba(43,26,32,0.18)";
        ctx.lineWidth = 3;
        ctx.setLineDash([14, 10]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    // Footer: the two lines of text, and a small mark if wanted.
    const cx = footer.x + footer.w / 2;
    ctx.fillStyle = o.ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const big = t.columns === 1 && t.strips === 1 ? 0.13 : t.columns === 1 ? 0.12 : 0.085;
    let size = Math.round(sw * big);
    const fit = (font: (n: number) => string, text: string, max: number) => {
      ctx.font = font(size);
      while (ctx.measureText(text).width > max && size > 20) { size -= 2; ctx.font = font(size); }
    };
    const hasTwo = o.line1.trim() && o.line2.trim();
    const mid = footer.y + footer.h * (o.mark ? 0.42 : 0.5);
    if (o.line1.trim()) {
      fit((n) => `600 ${n}px ${o.fonts.display}`, o.line1, footer.w);
      ctx.fillText(o.line1, cx, hasTwo ? mid - size * 0.35 : mid, footer.w);
    }
    if (o.line2.trim()) {
      const s2 = Math.round(sw * (t.columns === 1 ? 0.055 : 0.04));
      ctx.font = `500 ${s2}px ${o.fonts.body}`;
      ctx.globalAlpha = 0.75;
      ctx.fillText(o.line2, cx, hasTwo ? mid + size * 0.55 : mid, footer.w);
      ctx.globalAlpha = 1;
    }
    if (o.mark) {
      ctx.globalAlpha = 0.55;
      ctx.font = `700 ${Math.round(sw * (t.columns === 1 ? 0.045 : 0.03))}px ${o.fonts.display}`;
      ctx.fillText("flashbae", cx, footer.y + footer.h - Math.round(sw * 0.06));
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }
  if (t.strips > 1) {
    // A cut line between the strips, in the margin only, so it doesn't mark the photos.
    ctx.strokeStyle = "rgba(43,26,32,0.35)";
    ctx.lineWidth = 2;
    for (let s = 1; s < t.strips; s++) {
      for (const [y0, y1] of [[0, 40], [H - 40, H]]) {
        ctx.beginPath(); ctx.moveTo(s * sw, y0); ctx.lineTo(s * sw, y1); ctx.stroke();
      }
    }
  }
}

// ---------- PNG print size ----------

const CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (bytes: Uint8Array) => {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

/** The PNG with a pHYs chunk saying 300 dpi, inserted right after the header chunk. */
export async function withDpi(png: Blob, dpi = DPI) {
  const src = new Uint8Array(await png.arrayBuffer());
  const ppm = Math.round(dpi / 0.0254);
  const chunk = new Uint8Array(21);
  const v = new DataView(chunk.buffer);
  v.setUint32(0, 9);
  chunk.set([0x70, 0x48, 0x59, 0x73], 4); // "pHYs"
  v.setUint32(8, ppm); v.setUint32(12, ppm); chunk[16] = 1;
  v.setUint32(17, crc32(chunk.subarray(4, 17)));
  const at = 8 + 25; // signature + IHDR
  const out = new Uint8Array(src.length + chunk.length);
  out.set(src.subarray(0, at), 0);
  out.set(chunk, at);
  out.set(src.subarray(at), at + chunk.length);
  return new Blob([out], { type: "image/png" });
}
