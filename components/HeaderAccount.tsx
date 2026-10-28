"use client";

import { useEffect, useRef, useState } from "react";
import GoogleSignIn from "@/components/GoogleSignIn";
import { ACCOUNT_EVENT, fetchMe, getCachedProfile, isUserSignedIn, loginWithGoogle, logoutUser, type UserMe } from "@/lib/flashbie-api";

/** The account corner of the header: who's signed in and their credits, or a Sign in button. */
export default function HeaderAccount() {
  const [me, setMe] = useState<UserMe | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);

  // localStorage is browser-only, so the account is read after mount; the server renders the placeholder.
  useEffect(() => {
    const onAccount = (e: Event) => setMe((e as CustomEvent<UserMe | null>).detail);
    window.addEventListener(ACCOUNT_EVENT, onAccount);
    if (isUserSignedIn()) {
      setMe(getCachedProfile());
      fetchMe().catch(() => {}); // fresh credits arrive through ACCOUNT_EVENT
    }
    setReady(true);
    return () => window.removeEventListener(ACCOUNT_EVENT, onAccount);
  }, []);

  // Close on a click outside or Escape.
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const signIn = async (idToken: string) => {
    setBusy(true);
    setError(null);
    try {
      await loginWithGoogle(idToken); // the header updates through ACCOUNT_EVENT
      setOpen(false);
    } catch (err: any) {
      setError(err.message === "invalid_google_token" ? "Google couldn't confirm that sign-in. Please try again." : err.message || "Google sign-in failed.");
    } finally {
      setBusy(false);
    }
  };

  const signOut = () => {
    logoutUser();
    window.dispatchEvent(new CustomEvent(ACCOUNT_EVENT, { detail: null })); // the studio and My photos drop the account too
    setOpen(false);
  };

  if (!ready) return <div className="acct acct-placeholder" aria-hidden="true" />;

  const signedIn = Boolean(me?.signed_in);
  const name = me?.name || me?.email?.split("@")[0] || "You";
  const first = name.split(" ")[0];
  const credits = me?.credits ?? 0;
  const avatar = me?.picture
    ? <img src={me.picture} alt="" referrerPolicy="no-referrer" />
    : <span>{first.charAt(0).toUpperCase()}</span>;

  return (
    <div className="acct" ref={root}>
      {signedIn ? (
        <button type="button" className="acct-chip" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(!open)}
                aria-label={`Account: ${name}, ${credits} credits`}>
          <span className="acct-avatar">{avatar}</span>
          <span className="acct-name">{first}</span>
          <span className="acct-credits">{credits}</span>
        </button>
      ) : (
        <button type="button" className="acct-signin" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(!open)}>
          Sign in
        </button>
      )}

      {open && (
        <div className="acct-pop" role="dialog" aria-label={signedIn ? "Your account" : "Sign in"}>
          {signedIn ? (
            <>
              <div className="acct-who">
                <span className="acct-avatar acct-avatar-lg">{avatar}</span>
                <span>
                  <strong>{name}</strong>
                  {me?.email && <small>{me.email}</small>}
                </span>
              </div>
              <div className="acct-stat">
                <span>Credits left</span>
                <strong>{credits}</strong>
              </div>
              <div className="acct-stat">
                <span>Photos made</span>
                <strong>{me?.made ?? 0}</strong>
              </div>
              <a className="acct-link" href="/my-photos/">🖼️ My photos</a>
              <a className="acct-go" href="/ai-photo-generator/">✨ Open AI Studio</a>
              <button type="button" className="acct-out" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <>
              <strong className="acct-title">Sign in to Flashbae</strong>
              <p>New accounts get <b>5 free AI photos</b>.</p>
              {busy ? <p className="acct-busy">Signing you in…</p> : <GoogleSignIn onCredential={signIn} width={260} />}
              {error && <p className="gsi-error" role="alert">{error}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
