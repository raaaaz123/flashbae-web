import type { NextConfig } from "next";

// A static site: `npm run build` writes plain HTML to out/, which any host can serve.
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
