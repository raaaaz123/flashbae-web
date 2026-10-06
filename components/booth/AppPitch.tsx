import AppStoreButton from "@/components/AppStoreButton";
import { APP_STORE_URL, BOOTH } from "@/lib/site";

/** The install prompt under a finished strip: what the app adds on top of the free web booth. */
export default function AppPitch({ saved }: { saved: boolean }) {
  return (
    <section className={`pitch${saved ? " pitch-saved" : ""}`} aria-labelledby="pitch-title" aria-live="polite">
      <div className="pitch-copy">
        <p className="pitch-kicker">{saved ? "Saved! 🎉" : "Like your strip?"}</p>
        <h2 id="pitch-title">{saved ? "Now try the real booth on your iPhone" : "There's a lot more in the app"}</h2>
        <ul className="pitch-list">
          <li><strong>All {BOOTH.films} films</strong>: 800T cinema film, Y2K Digicam, Expired Film, Dreamy and more.</li>
          <li><strong>Booth together:</strong> shoot one strip with someone far away, both phones flashing at once.</li>
          <li><strong>AI looks:</strong> re-shoot a selfie in digicam flash, golden hour or a whole new scene.</li>
          <li><strong>Stickers, every frame colour and the 6-cut layout</strong>, plus Story and print-sheet exports.</li>
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
