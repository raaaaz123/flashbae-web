import type { Metadata } from "next";
import AIGenerator from "@/components/AIGenerator";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import JsonLd from "@/components/JsonLd";
import { NAME, SITE_URL } from "@/lib/site";
import "./generator-page.css";

export const metadata: Metadata = {
  title: "AI Photo Generator",
  description:
    "Transform any selfie into digicam flash, golden hour, or aesthetic film with Flashbae AI. Upload your photo, generate in seconds, and download high-resolution photos.",
  alternates: { canonical: "/ai-photo-generator/" },
  openGraph: {
    title: `AI Photo Generator — ${NAME}`,
    description: "Re-shoot your selfies in vintage digicam flash, golden hour glow, and Y2K aesthetic with AI. Download instantly.",
    images: ["/looks/dreamlight-after.jpg"],
  },
};

export default function AIGeneratorPage() {
  const trail = [
    { name: "Looks", path: "/#looks-gallery" },
    { name: "AI Generator", path: "/ai-photo-generator/" },
  ];

  return (
    <div className="genpage">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "@id": `${SITE_URL}/ai-photo-generator/#app`,
              name: `${NAME} AI Photo Generator`,
              url: `${SITE_URL}/ai-photo-generator/`,
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Any",
              browserRequirements: "Requires modern web browser with HTML5 and WebRTC",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              featureList: [
                "AI selfie photo restyling with vintage digicam flash",
                "Golden hour lighting and camera glow synthesis",
                "Interactive before and after comparison slider",
                "Instant high-resolution photo download",
                "Single person and duo templates support",
              ],
            },
            crumbSchema(trail),
          ],
        }}
      />

      <div className="genpage-head">
        <div className="genpage-glow" aria-hidden="true" />
        <Crumbs trail={trail} />
        <p className="genpage-badge"><span />5 free photos when you sign in · no app needed</p>
        <h1>AI Photo <em>Studio</em></h1>
        <p className="genpage-lede">
          Pick a look, add your selfie and get it back re-shot in seconds: flash, golden hour or a whole new scene.
        </p>
      </div>

      <section className="genpage-studio" aria-label="AI photo studio">
        <AIGenerator />
      </section>

      <ul className="genpage-trust" aria-label="Good to know">
        <li><strong>Keeps you, you</strong>Your face and pose stay; the light and scene change.</li>
        <li><strong>Your photo, your call</strong>It&apos;s only used to make your result. No posting, no sharing.</li>
        <li><strong>Full-res download</strong>Save it, post it, print it. No watermark.</li>
      </ul>
    </div>
  );
}
