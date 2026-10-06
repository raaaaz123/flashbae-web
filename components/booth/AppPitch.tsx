import AppStoreButton from "@/components/AppStoreButton";
import LookPrints from "@/components/LookPrints";
import { lookBySlug } from "@/lib/looks";
import type { Look } from "@/lib/looks";
import { APP_STORE_URL, BOOTH } from "@/lib/site";

const FLASH = ["disposable-flash", "midnight-flash", "soft-flash"].map(lookBySlug).filter((l): l is Look => !!l);

/**
 * The install prompt under a finished result: what the app adds on top of the free web tool.
 * `strip` after a photo strip; `photo` after a single photo, where the AI looks are the natural next step.
 */
export default function AppPitch({ saved, kind = "strip" }: { saved: boolean; kind?: "strip" | "photo" | "template" }) {
  const photo = kind === "photo";
  if (kind === "template") return <TemplatePitch saved={saved} />;
  return (
    <section className={`pitch${saved ? " pitch-saved" : ""}`} aria-labelledby="pitch-title" aria-live="polite">
      <div className="pitch-copy">
        <p className="pitch-kicker">{saved ? "Saved! 🎉" : photo ? "Like the look?" : "Like your strip?"}</p>
        <h2 id="pitch-title">
          {photo
            ? "Want a real flash, not just a filter?"
            : saved ? "Now try the real booth on your iPhone" : "There's a lot more in the app"}
        </h2>
        {photo ? (
          <ul className="pitch-list">
            <li><strong>AI looks re-shoot your photo</strong> with the light of a direct flash, keeping your face and pose. A colour filter can&apos;t add light that wasn&apos;t there.</li>
            <li><strong>All {BOOTH.films} films</strong> for photo strips, plus a free film editor with face retouch.</li>
            <li><strong>A real photo booth</strong> with pose prompts, a countdown and a flash, even with someone far away.</li>
          </ul>
        ) : (
          <ul className="pitch-list">
            <li><strong>All {BOOTH.films} films</strong>: 800T cinema film, Y2K Digicam, Expired Film, Dreamy and more.</li>
            <li><strong>Booth together:</strong> shoot one strip with someone far away, both phones flashing at once.</li>
            <li><strong>AI looks:</strong> re-shoot a selfie in digicam flash, golden hour or a whole new scene.</li>
            <li><strong>Stickers, every frame colour and the 6-cut layout</strong>, plus Story and print-sheet exports.</li>
          </ul>
        )}
      </div>
      <div className="pitch-cta">
        <img src="/mascot.png" alt="" width={120} height={106} loading="lazy" />
        <AppStoreButton href={APP_STORE_URL} />
        <p className="fine">Free on iPhone and iPad</p>
      </div>
      {photo && (
        <div className="pitch-looks">
          <p className="pitch-kicker">Flash looks in the app</p>
          <LookPrints looks={FLASH} />
        </div>
      )}
    </section>
  );
}

/** After a template: the booth that makes the strips for you, no printer or camera stand needed. */
function TemplatePitch({ saved }: { saved: boolean }) {
  return (
    <section className={`pitch${saved ? " pitch-saved" : ""}`} aria-labelledby="pitch-title" aria-live="polite">
      <div className="pitch-copy">
        <p className="pitch-kicker">{saved ? "Saved! 🎉" : "Planning a party?"}</p>
        <h2 id="pitch-title">Or let everyone&apos;s phone be the photo booth</h2>
        <ul className="pitch-list">
          <li><strong>Guests shoot their own strips</strong> with pose prompts, a 3-2-1 countdown and a flash. No booth to rent.</li>
          <li><strong>{BOOTH.films} films, frame colours and captions</strong>, saved as a strip, a Story or a print sheet.</li>
          <li><strong>Booth together</strong> for the friends who couldn&apos;t make it: one strip, two phones, miles apart.</li>
        </ul>
      </div>
      <div className="pitch-cta">
        <img src="/mascot.png" alt="" width={120} height={106} loading="lazy" />
        <AppStoreButton href={APP_STORE_URL} />
        <p className="fine">Free on iPhone and iPad</p>
      </div>
    </section>
  );
}
