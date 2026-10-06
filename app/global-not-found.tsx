import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";

// The 404 for any URL no route matches. With a root layout per language there's no single layout to
// render it in, so it brings its own document (SiteShell), in English.
export const metadata: Metadata = { title: "Page not found · Flashbae", robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <SiteShell locale="en">
      <div className="page page-center">
        <img src="/mascot.png" alt="" width={140} height={123} />
        <h1>This shot didn&apos;t develop</h1>
        <p>The page you followed doesn&apos;t exist. Try the <a href="/looks/">looks</a> or go back to the <a href="/">home page</a>.</p>
      </div>
    </SiteShell>
  );
}
