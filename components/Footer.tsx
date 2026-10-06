import { LEGAL } from "@/lib/site";
import { LOOKS } from "@/lib/looks";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src="/mascot.png" alt="" width={56} height={49} loading="lazy" />
        <p>
          <span className="wordmark">flashbae</span>
          <br />
          The photo booth in your pocket, for iPhone and iPad.
        </p>
      </div>
      <nav aria-label="Looks" className="footer-col">
        <h2>Popular looks</h2>
        {LOOKS.slice(0, 6).map((l) => (
          <a key={l.slug} href={`/looks/${l.slug}/`}>{l.title}</a>
        ))}
      </nav>
      <nav aria-label="Help" className="footer-col">
        <h2>Help</h2>
        <a href="/#faq">Questions</a>
        <a href={LEGAL.support}>Support</a>
        <a href={LEGAL.privacy}>Privacy</a>
        <a href={LEGAL.terms}>Terms</a>
      </nav>
      <p className="footer-fine">© {new Date().getFullYear()} Flashbae. iPhone and App Store are trademarks of Apple Inc.</p>
    </footer>
  );
}
