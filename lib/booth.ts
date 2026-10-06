// The photo booth's strip renderer, in the browser. A port of the app's BoothRenderer
// (Flashbie/Features/Booth/BoothKit.swift) and FilmFilter.grade (Core/Imaging/FilmFilters.swift):
// same geometry, same colour recipes, the same light effects drawn with canvas instead of Core Image.
// Everything runs on the visitor's device; no photo is uploaded.

export type LayoutId = "classic4" | "grid4" | "strip3" | "grid6";

export type Layout = { id: LayoutId; title: string; count: number; columns: number; pro: boolean };

export const LAYOUTS: Layout[] = [
  { id: "classic4", title: "Classic", count: 4, columns: 1, pro: false },
  { id: "grid4", title: "4-cut", count: 4, columns: 2, pro: false },
  { id: "strip3", title: "Trio", count: 3, columns: 1, pro: false },
  { id: "grid6", title: "6-cut", count: 6, columns: 2, pro: true },
];

export const layoutById = (id: LayoutId) => LAYOUTS.find((l) => l.id === id)!;

export type Frame = { id: string; title: string; hex: string; dark: boolean; pro: boolean };

export const FRAMES: Frame[] = [
  { id: "white", title: "White", hex: "#FFFFFF", dark: false, pro: false },
  { id: "black", title: "Black", hex: "#141110", dark: true, pro: false },
  { id: "cream", title: "Cream", hex: "#F3EADB", dark: false, pro: false },
  { id: "blush", title: "Blush", hex: "#F6D3DC", dark: false, pro: true },
  { id: "butter", title: "Butter", hex: "#FBE3A0", dark: false, pro: true },
  { id: "sage", title: "Sage", hex: "#CFDCC6", dark: false, pro: true },
  { id: "sky", title: "Sky", hex: "#CFE0F2", dark: false, pro: true },
  { id: "cherry", title: "Cherry", hex: "#C9233B", dark: true, pro: true },
];

type Vec3 = [number, number, number];

type Recipe = {
  contrast?: number; fade?: number; highlightRoll?: number; saturation?: number; warmth?: number; tint?: number;
  shadowTint?: Vec3; highlightTint?: Vec3; gamma?: Vec3; mono?: boolean; monoTone?: Vec3;
};

export type WebFilm = {
  id: string; title: string; recipe: Recipe | null;
  grain: number; flash?: number; glow?: number; vignette?: number; leak?: number; dust?: number;
};

/** The app's free films, with the same recipes and effect strengths (BoothFilm.all). */
export const WEB_FILMS: WebFilm[] = [
  { id: "natural", title: "Natural", recipe: null, grain: 0.18 },
  { id: "photobooth", title: "Photobooth", recipe: { contrast: 0.8, highlightRoll: 0.06, mono: true, monoTone: [0.025, 0.012, -0.015] },
    grain: 0.22, flash: 0.3, vignette: 0.2 },
  { id: "flashglow", title: "Flash Glow", recipe: { contrast: 0.18, highlightRoll: 0.08, saturation: 1.05, warmth: 0.12 },
    grain: 0.14, flash: 0.55, glow: 0.45, vignette: 0.2 },
  { id: "ccd", title: "CCD Cam", recipe: { contrast: 0.22, highlightRoll: 0.04, saturation: 1.1, warmth: -0.2, tint: -0.03, shadowTint: [-0.01, 0, 0.025] },
    grain: 0.06, flash: 0.45, vignette: 0.1 },
  { id: "bw", title: "B&W", recipe: { contrast: 0.6, highlightRoll: 0.05, mono: true }, grain: 0.32 },
  { id: "booth30s", title: "1930s Booth", recipe: { contrast: 0.32, fade: 0.07, mono: true, monoTone: [0.035, 0.018, -0.012] },
    grain: 0.45, vignette: 0.6, dust: 0.55 },
  { id: "lightleak", title: "Light Leak", recipe: { contrast: 0.1, fade: 0.06, highlightRoll: 0.1, saturation: 1.0, warmth: 0.22 },
    grain: 0.2, leak: 0.8 },
  { id: "polaroid", title: "Polaroid", recipe: { contrast: 0.05, fade: 0.1, highlightRoll: 0.2, saturation: 0.85, warmth: 0.1, tint: -0.08 },
    grain: 0.2, vignette: 0.35 },
  { id: "sepia", title: "Sepia", recipe: { contrast: 0.15, fade: 0.05, mono: true, monoTone: [0.06, 0.03, -0.04] }, grain: 0.32, dust: 0.25 },
  { id: "faded70s", title: "Faded 70s", recipe: { contrast: -0.1, fade: 0.15, saturation: 0.75, warmth: 0.35, highlightTint: [0.03, 0.02, -0.02] },
    grain: 0.35, vignette: 0.3 },
  { id: "instax", title: "Instax", recipe: { contrast: 0.15, highlightRoll: 0.1, saturation: 1.05, warmth: 0.05 },
    grain: 0.12, flash: 0.25, glow: 0.2 },
];

export const POSES = [
  "Big smile 😁", "Laugh like you mean it 😂", "Look away, all mysterious 👀", "Blow a kiss 😘",
  "Peace sign ✌️", "Surprised face 😮", "Chin on hand, editorial 💅", "Squeeze in close 🫶",
  "Silly face 🤪", "Wink 😉", "Hands in a heart 🫰", "Serve a model pose 📸",
];

/** A fresh set of poses for one session: always opens calm, then mixes it up (BoothPoses.session). */
export function poseSession(n: number) {
  const rest = POSES.slice(1).sort(() => Math.random() - 0.5);
  return [POSES[0], ...rest.slice(0, Math.max(0, n - 1))];
}

// ---------- geometry (BoothRenderer.geometry) ----------

export type Rect = { x: number; y: number; w: number; h: number };

export function geometry(layout: Layout) {
  const rows = layout.count / layout.columns;
  const aspect = layout.columns === 1 ? 4 / 3 : 3 / 4;
  const cw = layout.columns === 1 ? 640 : 520;
  const ch = Math.round(cw / aspect);
  const pad = 40, gap = 22, footerH = layout.columns === 1 ? 170 : 190;
  const w = pad * 2 + cw * layout.columns + gap * (layout.columns - 1);
  const h = pad + ch * rows + gap * (rows - 1) + footerH;
  const cells: Rect[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < layout.columns; c++) cells.push({ x: pad + c * (cw + gap), y: pad + r * (ch + gap), w: cw, h: ch });
  }
  return { w, h, cells, footer: { x: pad, y: h - footerH, w: w - pad * 2, h: footerH }, cellW: cw, cellH: ch };
}

// ---------- colour (FilmFilter.grade, baked into a 3D lookup table) ----------

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function grade(r0: number, g0: number, b0: number, rc: Recipe): Vec3 {
  let r = r0, g = g0, b = b0;
  const l0 = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (rc.mono) {
    const m = 0.3 * r + 0.59 * g + 0.11 * b;
    const t = rc.monoTone ?? [0, 0, 0];
    const k = 1 - Math.abs(m - 0.5) * 2;
    r = m + t[0] * k; g = m + t[1] * k; b = m + t[2] * k;
  } else {
    const s = rc.saturation ?? 1;
    r = l0 + (r - l0) * s; g = l0 + (g - l0) * s; b = l0 + (b - l0) * s;
  }
  const warmth = rc.warmth ?? 0;
  r += warmth * 0.06; b -= warmth * 0.06; g += (rc.tint ?? 0) * 0.04;
  r = clamp01(r); g = clamp01(g); b = clamp01(b);
  if (rc.gamma) { r = Math.pow(r, rc.gamma[0]); g = Math.pow(g, rc.gamma[1]); b = Math.pow(b, rc.gamma[2]); }
  const ct = rc.contrast ?? 0;
  if (ct !== 0) {
    const s = (c: number) => c * c * (3 - 2 * c);
    const f = (c: number) => (ct > 0 ? c + (s(c) - c) * ct : c + (c - s(c)) * -ct);
    r = f(r); g = f(g); b = f(b);
  }
  const l = 0.2126 * clamp01(r) + 0.7152 * clamp01(g) + 0.0722 * clamp01(b);
  const st = rc.shadowTint, ht = rc.highlightTint;
  if (st) { const k = (1 - l) ** 2; r += st[0] * k; g += st[1] * k; b += st[2] * k; }
  if (ht) { const k = l ** 2; r += ht[0] * k; g += ht[1] * k; b += ht[2] * k; }
  const hr = rc.highlightRoll ?? 0;
  if (hr > 0) { r -= r ** 4 * hr; g -= g ** 4 * hr; b -= b ** 4 * hr; }
  const fade = rc.fade ?? 0;
  if (fade > 0) { r = fade + r * (1 - fade); g = fade + g * (1 - fade); b = fade + b * (1 - fade); }
  return [clamp01(r), clamp01(g), clamp01(b)];
}

const N = 33;
const luts = new Map<string, Float32Array>();

function lut(film: WebFilm) {
  let t = luts.get(film.id);
  if (t) return t;
  t = new Float32Array(N * N * N * 3);
  let i = 0;
  for (let b = 0; b < N; b++) for (let g = 0; g < N; g++) for (let r = 0; r < N; r++) {
    const c = grade(r / (N - 1), g / (N - 1), b / (N - 1), film.recipe!);
    t[i++] = c[0]; t[i++] = c[1]; t[i++] = c[2];
  }
  luts.set(film.id, t);
  return t;
}

/** The colour grade on every pixel: trilinear lookup in the film's table. */
function applyGrade(data: Uint8ClampedArray, film: WebFilm) {
  if (!film.recipe) return;
  const t = lut(film), s = (N - 1) / 255;
  for (let p = 0; p < data.length; p += 4) {
    const fr = data[p] * s, fg = data[p + 1] * s, fb = data[p + 2] * s;
    const r0 = Math.min(fr | 0, N - 2), g0 = Math.min(fg | 0, N - 2), b0 = Math.min(fb | 0, N - 2);
    const dr = fr - r0, dg = fg - g0, db = fb - b0;
    for (let c = 0; c < 3; c++) {
      const at = (r: number, g: number, b: number) => t[((b * N + g) * N + r) * 3 + c];
      const c00 = at(r0, g0, b0) * (1 - dr) + at(r0 + 1, g0, b0) * dr;
      const c10 = at(r0, g0 + 1, b0) * (1 - dr) + at(r0 + 1, g0 + 1, b0) * dr;
      const c01 = at(r0, g0, b0 + 1) * (1 - dr) + at(r0 + 1, g0, b0 + 1) * dr;
      const c11 = at(r0, g0 + 1, b0 + 1) * (1 - dr) + at(r0 + 1, g0 + 1, b0 + 1) * dr;
      data[p + c] = ((c00 * (1 - dg) + c10 * dg) * (1 - db) + (c01 * (1 - dg) + c11 * dg) * db) * 255;
    }
  }
}

// ---------- one frame (BoothRenderer.cell + filmed) ----------

export type Source = CanvasImageSource & { width: number; height: number };

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return c;
};

/** A deterministic random, so the dust and grain don't flicker as the strip re-renders. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** One frame: cropped to the cell (centred a little high, where faces are), then filmed. */
export function filmCell(src: Source, w: number, h: number, film: WebFilm, seed = 1) {
  const out = canvas(w, h);
  const ctx = out.getContext("2d", { willReadFrequently: true })!;
  // Crop: fill the cell, top of the crop 38% of the way down the spare height (BoothFraming.standard).
  const scale = Math.max(w / src.width, h / src.height);
  const cw = w / scale, ch = h / scale;
  const sx = (src.width - cw) / 2, sy = (src.height - ch) * 0.38;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, sx, sy, cw, ch, 0, 0, w, h);

  const img = ctx.getImageData(0, 0, w, h);
  applyGrade(img.data, film);
  // On-camera flash, part one: the subject lifts (an exposure push, like CIExposureAdjust).
  if (film.flash) {
    const ev = 2 ** (film.flash * 0.35), d = img.data;
    for (let p = 0; p < d.length; p += 4) { d[p] *= ev; d[p + 1] *= ev; d[p + 2] *= ev; }
  }
  ctx.putImageData(img, 0, 0);

  if (film.glow) {
    // Bloom: the bright parts, blurred and screened back on. The blur is a downscale and back up,
    // which every browser can do (canvas filters are missing from older Safari).
    const small = canvas(Math.max(8, Math.round(w / 14)), Math.max(8, Math.round(h / 14)));
    const sm = small.getContext("2d", { willReadFrequently: true })!;
    sm.imageSmoothingQuality = "high";
    sm.drawImage(out, 0, 0, small.width, small.height);
    const px = sm.getImageData(0, 0, small.width, small.height), d = px.data;
    for (let p = 0; p < d.length; p += 4) {
      const l = (0.3 * d[p] + 0.59 * d[p + 1] + 0.11 * d[p + 2]) / 255;
      const k = Math.max(0, (l - 0.45) / 0.55);
      d[p] *= k; d[p + 1] *= k; d[p + 2] *= k;
    }
    sm.putImageData(px, 0, 0);
    const mid = canvas(small.width * 3, small.height * 3), md = mid.getContext("2d")!;
    md.imageSmoothingQuality = "high";
    md.drawImage(small, 0, 0, mid.width, mid.height);
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = Math.min(1, film.glow * 1.1);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(mid, 0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }
  if (film.flash) {
    // Part two: a bright hot-spot a little above centre.
    const spot = ctx.createRadialGradient(w / 2, h / 2 - h * 0.08, w * 0.05, w / 2, h / 2 - h * 0.08, w * 0.7);
    spot.addColorStop(0, `rgba(255,255,255,${film.flash * 0.62})`);
    spot.addColorStop(1, "rgba(255,255,255,0)");
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
  }
  if (film.leak) {
    // Light leak: an orange-to-magenta flare washing in from the top-right corner, plus a warm edge.
    ctx.globalCompositeOperation = "screen";
    const flare = ctx.createRadialGradient(w - w * 0.05, h * 0.08, w * 0.02, w - w * 0.05, h * 0.08, w * 0.95);
    flare.addColorStop(0, `rgba(255,140,46,${film.leak * 0.85})`);
    flare.addColorStop(1, "rgba(242,51,115,0)");
    ctx.fillStyle = flare;
    ctx.fillRect(0, 0, w, h);
    const edge = ctx.createLinearGradient(w, 0, w - w * 0.35, 0);
    edge.addColorStop(0, `rgba(255,77,51,${film.leak * 0.45})`);
    edge.addColorStop(1, "rgba(255,77,51,0)");
    ctx.fillStyle = edge;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
  }
  const vignette = (film.vignette ?? 0) + (film.flash ?? 0) * 0.6;
  if (vignette > 0) {
    const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.hypot(w, h) * 0.62);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, `rgba(0,0,0,${Math.min(0.85, vignette * 0.55)})`);
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
  }
  const rand = seeded(seed * 7919 + w);
  if (film.grain > 0) {
    // Grain: mono noise, soft-lit over the frame.
    const noise = canvas(Math.ceil(w / 1.6), Math.ceil(h / 1.6));
    const n = noise.getContext("2d")!, nd = n.createImageData(noise.width, noise.height);
    for (let p = 0; p < nd.data.length; p += 4) {
      const v = rand() * 255;
      nd.data[p] = nd.data[p + 1] = nd.data[p + 2] = v;
      nd.data[p + 3] = 255;
    }
    n.putImageData(nd, 0, 0);
    ctx.globalCompositeOperation = "soft-light";
    ctx.globalAlpha = film.grain * 0.55;
    ctx.drawImage(noise, 0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }
  if (film.dust) {
    // Dust: a scatter of specks and a hair, laid on the print.
    ctx.globalAlpha = film.dust;
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = rand() < 0.6 ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.55)";
      ctx.beginPath();
      ctx.arc(rand() * w, rand() * h, 0.6 + rand() * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    const x = rand() * w, y = rand() * h;
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 30, y + 10, x + 10, y + 50, x + 45, y + 70);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  return out;
}

// ---------- the strip (BoothRenderer.strip + footer) ----------

export type StripOptions = {
  layout: Layout;
  frame: Frame;
  caption: string;
  date: Date | null;
  /** Fonts from the page, so the strip matches the site's type. */
  fonts: { display: string; mono: string };
};

function roundRect(ctx: CanvasRenderingContext2D, r: Rect, radius: number) {
  ctx.beginPath();
  if (ctx.roundRect) { ctx.roundRect(r.x, r.y, r.w, r.h, radius); return; }
  ctx.rect(r.x, r.y, r.w, r.h);
}

/** "06.10.26", the way the booth stamps the date. */
const stamp = (d: Date) =>
  [d.getDate(), d.getMonth() + 1, d.getFullYear() % 100].map((n) => String(n).padStart(2, "0")).join(".");

/** The whole strip on one canvas. `cells` are already filmed (null = an empty slot). */
export function drawStrip(out: HTMLCanvasElement, cells: (HTMLCanvasElement | null)[], o: StripOptions) {
  const g = geometry(o.layout);
  out.width = g.w; out.height = g.h;
  const ctx = out.getContext("2d")!;
  ctx.fillStyle = o.frame.hex;
  ctx.fillRect(0, 0, g.w, g.h);
  g.cells.forEach((r, i) => {
    ctx.save();
    roundRect(ctx, r, 6);
    ctx.clip();
    const cell = cells[i];
    if (cell) ctx.drawImage(cell, r.x, r.y, r.w, r.h);
    else {
      ctx.fillStyle = o.frame.dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
      ctx.fillRect(r.x, r.y, r.w, r.h);
    }
    ctx.restore();
  });

  // Footer: caption, date, and the flashbae mark in the corner.
  const f = g.footer, ink = o.frame.dark ? "#FFFFFF" : "#2B1A20", wide = o.layout.columns > 1;
  const logoH = 60;
  const cx = f.x + f.w / 2;
  const hasCaption = o.caption.trim().length > 0;
  const midY = f.y + (f.h - logoH * 0.6) / 2;
  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (hasCaption) {
    let size = wide ? 60 : 54;
    ctx.font = `600 ${size}px ${o.fonts.display}`;
    while (ctx.measureText(o.caption).width > f.w - 40 && size > 28) {
      size -= 2;
      ctx.font = `600 ${size}px ${o.fonts.display}`;
    }
    ctx.fillText(o.caption, cx, o.date ? midY - 20 : midY, f.w - 40);
  }
  if (o.date) {
    ctx.globalAlpha = 0.7;
    ctx.font = `600 30px ${o.fonts.mono}`;
    ctx.fillText(stamp(o.date), cx, hasCaption ? midY + 32 : midY);
    ctx.globalAlpha = 1;
  }
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.font = `700 34px ${o.fonts.display}`;
  ctx.fillText("flashbae", f.x + f.w - 20, f.y + f.h - 24);
}

/** Load a file (or a camera frame) as a bitmap, upright and no bigger than `max` on its long side. */
export async function loadPhoto(file: Blob, max = 1600): Promise<Source> {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  if (k === 1) return bmp;
  const c = canvas(Math.round(bmp.width * k), Math.round(bmp.height * k));
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close();
  return c;
}

/** The page's own fonts (next/font gives them generated family names), for drawing text on the strip. */
export function pageFonts() {
  const css = getComputedStyle(document.documentElement);
  const display = css.getPropertyValue("--font-display").trim() || "Georgia, serif";
  const body = css.getPropertyValue("--font-body").trim() || "-apple-system, sans-serif";
  return { display, body, mono: "ui-monospace, 'SF Mono', Menlo, monospace" };
}

// ---------- the date stamp: orange seven-segment digits, like a 2000s camera ----------

export type StampFormat = "ymd" | "mdy" | "dmy";
export type StampColor = "orange" | "yellow" | "red";
export type StampCorner = "right" | "left";

const STAMP_COLORS: Record<StampColor, { core: string; glow: string }> = {
  orange: { core: "#FFB04A", glow: "#FF6A00" },
  yellow: { core: "#FFE68A", glow: "#FFB300" },
  red: { core: "#FF7A5C", glow: "#FF1E00" },
};

/** The text a camera would print: '26 10 6, with the year marked by an apostrophe. */
export function stampText(d: Date, f: StampFormat) {
  const y = `'${String(d.getFullYear() % 100).padStart(2, "0")}`, m = String(d.getMonth() + 1), day = String(d.getDate());
  return f === "ymd" ? `${y} ${m} ${day}` : f === "mdy" ? `${m} ${day} ${y}` : `${day} ${m} ${y}`;
}

// Segments: a top, b upper right, c lower right, d bottom, e lower left, f upper left, g middle.
const DIGITS: Record<string, string> = {
  "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc", "5": "afgcd", "6": "afgedc", "7": "abc", "8": "abcdefg", "9": "abcdfg",
};

function segments(ctx: CanvasRenderingContext2D, ch: string, x: number, h: number) {
  const w = h * 0.52, t = h * 0.11, m = h / 2;
  const lines: Record<string, [number, number, number, number]> = {
    a: [t, 0, w - t, 0], b: [w, t, w, m - t], c: [w, m + t, w, h - t], d: [t, h, w - t, h],
    e: [0, m + t, 0, h - t], f: [0, t, 0, m - t], g: [t, m, w - t, m],
  };
  for (const seg of DIGITS[ch] ?? "") {
    const [x0, y0, x1, y1] = lines[seg];
    ctx.moveTo(x + x0, y0); ctx.lineTo(x + x1, y1);
  }
  return w;
}

/** Draw the stamp on a photo; `size` is the digit height as a share of the photo's short side. */
export function drawDateStamp(ctx: CanvasRenderingContext2D, w: number, h: number,
                              o: { text: string; color: StampColor; corner: StampCorner; size: number }) {
  const dh = Math.max(12, Math.min(w, h) * o.size);
  const gap = dh * 0.32, space = dh * 0.45, tick = dh * 0.22;
  // Measure first, so the stamp can sit in either corner.
  let width = 0;
  for (const ch of o.text) width += ch === " " ? space : ch === "'" ? tick + gap * 0.5 : dh * 0.52 + gap;
  const margin = Math.min(w, h) * 0.05;
  const x0 = o.corner === "right" ? w - margin - width : margin, y0 = h - margin - dh;
  const c = STAMP_COLORS[o.color];
  ctx.save();
  ctx.translate(x0, y0);
  ctx.transform(1, 0, -0.1, 1, dh * 0.1, 0); // the slight lean of LED digits
  ctx.lineCap = "round";
  ctx.lineWidth = dh * 0.11;
  ctx.beginPath();
  let x = 0;
  for (const ch of o.text) {
    if (ch === " ") { x += space; continue; }
    if (ch === "'") { ctx.moveTo(x + tick * 0.6, 0); ctx.lineTo(x + tick * 0.3, dh * 0.22); x += tick + gap * 0.5; continue; }
    x += segments(ctx, ch, x, dh) + gap;
  }
  // Two passes: a wide soft glow, then the bright core.
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = c.glow;
  ctx.shadowColor = c.glow;
  ctx.shadowBlur = dh * 0.5;
  ctx.globalAlpha = 0.85;
  ctx.stroke();
  // The core is drawn normally, so the digits stay readable on bright skies and skin.
  ctx.globalCompositeOperation = "source-over";
  ctx.shadowBlur = dh * 0.15;
  ctx.strokeStyle = c.core;
  ctx.globalAlpha = 1;
  ctx.stroke();
  ctx.restore();
}

/** When a JPEG was taken, from its EXIF data (DateTimeOriginal, else DateTime). Null if it has none. */
export async function photoDate(file: Blob): Promise<Date | null> {
  try {
    const v = new DataView(await file.slice(0, 256 * 1024).arrayBuffer());
    if (v.getUint16(0) !== 0xffd8) return null;
    let p = 2;
    while (p + 4 < v.byteLength) {
      const marker = v.getUint16(p), len = v.getUint16(p + 2);
      if (marker === 0xffe1 && v.getUint32(p + 4) === 0x45786966) {
        const tiff = p + 10, le = v.getUint16(tiff) === 0x4949;
        const u16 = (o: number) => v.getUint16(tiff + o, le), u32 = (o: number) => v.getUint32(tiff + o, le);
        const read = (ifd: number, tag: number) => {
          const n = u16(ifd);
          for (let i = 0; i < n; i++) {
            const e = ifd + 2 + i * 12;
            if (u16(e) === tag) return u32(e + 8);
          }
          return null;
        };
        const str = (o: number) => String.fromCharCode(...Array.from({ length: 19 }, (_, i) => v.getUint8(tiff + o + i)));
        const ifd0 = u32(4), exif = read(ifd0, 0x8769);
        const at = (exif !== null ? read(exif, 0x9003) : null) ?? read(ifd0, 0x0132);
        if (at === null) return null;
        const m = /^(\d{4}):(\d{2}):(\d{2})/.exec(str(at));
        return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
      }
      if ((marker & 0xff00) !== 0xff00) return null;
      p += 2 + len;
    }
  } catch { /* not a JPEG we can read */ }
  return null;
}
