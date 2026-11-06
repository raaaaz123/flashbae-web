import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

const API = (process.env.NEXT_PUBLIC_FLASHBAE_API || "https://vocavoy.dietly.life/flashbie").replace(/\/$/, "");

/** The live looks catalog, the same /looks the iOS app reads. Fetched once per build (and per `next dev` start) and
 * inlined as FLASHBAE_CATALOG, so every page and the sitemap show exactly what is switched on in the admin. The
 * generator also re-reads /looks in the browser, so a look switched on later shows there before the next deploy. */
async function catalog(phase: string): Promise<string> {
  try {
    const res = await fetch(`${API}/looks`, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return JSON.stringify({ looks: body.looks ?? [], categories: body.categories ?? [], trending: body.trending ?? [] });
  } catch (err) {
    // A build without looks would ship empty pages: fail it so the host keeps the last good deploy.
    if (phase === PHASE_PRODUCTION_BUILD) throw new Error(`Could not load ${API}/looks: ${err}`);
    console.warn(`[looks] ${API}/looks failed (${err}); running with no looks`);
    return JSON.stringify({ looks: [], categories: [], trending: [] });
  }
}

// A static site: `npm run build` writes plain HTML to out/, which any host can serve.
export default async function config(phase: string): Promise<NextConfig> {
  return {
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
    // One root layout per language (app/(en), app/ja, app/ko) needs a 404 that brings its own document.
    experimental: { globalNotFound: true },
    env: { FLASHBAE_CATALOG: await catalog(phase) },
  };
}
