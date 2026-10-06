import type { NextConfig } from "next";

// A static site: `npm run build` writes plain HTML to out/, which any host can serve.
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // One root layout per language (app/(en), app/ja, app/ko) needs a 404 that brings its own document.
  experimental: { globalNotFound: true },
};

export default config;
