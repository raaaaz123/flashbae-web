import type { Metadata } from "next";
import MyPhotos from "@/components/MyPhotos";
import "./my-photos.css";

// A personal page: nothing here for search engines.
export const metadata: Metadata = {
  title: "My photos",
  description: "Every photo you've made with the Flashbae AI studio, ready to download.",
  alternates: { canonical: "/my-photos/" },
  robots: { index: false, follow: true },
};

export default function MyPhotosPage() {
  return (
    <div className="article sp mp">
      <header className="sp-head">
        <div className="sp-glow" aria-hidden="true" />
        <p className="sp-badge">Saved to your account</p>
        <h1>My <em>photos</em></h1>
        <p className="lede">Everything you&apos;ve made with the AI studio. Tap a photo to see it full size, or download it again.</p>
        <a className="btn btn-store btn-small" href="/ai-photo-generator/">✨ Make a new photo</a>
      </header>
      <MyPhotos />
    </div>
  );
}
