"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GoogleSignIn from "@/components/GoogleSignIn";
import {
  ACCOUNT_EVENT, downloadPhotoFile, isUserSignedIn, listPhotos, loginWithGoogle,
  type GeneratedPhoto, type UserMe,
} from "@/lib/flashbie-api";

const PAGE = 60; // what the server returns per page

const fileName = (p: GeneratedPhoto) =>
  `flashbae-${p.look_title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${p.id.slice(0, 8)}.jpg`;

const when = (ms: number) =>
  new Date(ms).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

const DOWNLOAD_ICON = <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 4v12m0 0-5-5m5 5 5-5M4 20h16" /></svg>;

/** Every photo the account has made, with a download for each: the web side of the app's history. */
export default function MyPhotos() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null); // null until the browser has been checked
  const [photos, setPhotos] = useState<GeneratedPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [more, setMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<GeneratedPhoto | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [signInError, setSignInError] = useState<string | null>(null);

  const load = useCallback(async (before?: number) => {
    setLoading(true);
    setError(null);
    try {
      const page = await listPhotos(before);
      setPhotos((prev) => (before ? [...prev, ...page] : page));
      setMore(page.length >= PAGE);
    } catch (err: any) {
      setError(err.message || "Couldn't load your photos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const yes = isUserSignedIn();
    setSignedIn(yes);
    if (yes) load();
    // Signing in from the header shows the photos without a reload.
    const onAccount = (e: Event) => {
      const me = (e as CustomEvent<UserMe | null>).detail;
      setSignedIn((was) => {
        if (me?.signed_in && !was) load();
        return Boolean(me?.signed_in);
      });
    };
    window.addEventListener(ACCOUNT_EVENT, onAccount);
    return () => window.removeEventListener(ACCOUNT_EVENT, onAccount);
  }, [load]);

  useEffect(() => {
    if (!viewing) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setViewing(null);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [viewing]);

  const save = async (p: GeneratedPhoto) => {
    setSaving(p.id);
    try {
      await downloadPhotoFile(p.url, fileName(p));
    } finally {
      setSaving(null);
    }
  };

  const signIn = async (idToken: string) => {
    setSignInError(null);
    try {
      await loginWithGoogle(idToken); // ACCOUNT_EVENT loads the photos
    } catch (err: any) {
      setSignInError(err.message === "invalid_google_token" ? "Google couldn't confirm that sign-in. Please try again." : err.message || "Google sign-in failed.");
    }
  };

  if (signedIn === null) return <div className="mp-grid mp-skeleton" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <span key={i} />)}</div>;

  if (!signedIn) {
    return (
      <div className="mp-empty">
        <h2>Sign in to see your photos</h2>
        <p>Every photo you make with the AI studio is saved to your account, ready to download again.</p>
        <GoogleSignIn onCredential={signIn} width={280} />
        {signInError && <p className="gsi-error" role="alert">{signInError}</p>}
      </div>
    );
  }

  if (!loading && !error && photos.length === 0) {
    return (
      <div className="mp-empty">
        <h2>No photos yet</h2>
        <p>Pick a look, add a selfie, and your AI photos will show up here.</p>
        <a className="mp-btn mp-btn-dark" href="/ai-photo-generator/">✨ Make your first photo</a>
      </div>
    );
  }

  return (
    <>
      {photos.length > 0 && <p className="mp-count">{photos.length}{more ? "+" : ""} photo{photos.length === 1 ? "" : "s"}</p>}
      <ul className="mp-grid">
        {photos.map((p) => (
          <li key={p.id} className="mp-item">
            <button type="button" className="mp-thumb" onClick={() => setViewing(p)} aria-label={`View ${p.look_title} photo from ${when(p.created_at)}`}>
              <img src={p.url} alt="" loading="lazy" data-ph-block />
            </button>
            <div className="mp-meta">
              <span>
                <strong>{p.look_title}</strong>
                <small>{when(p.created_at)}</small>
              </span>
              <button type="button" className="mp-dl" onClick={() => save(p)} disabled={saving === p.id} aria-label={`Download ${p.look_title} photo`}>
                {saving === p.id ? "…" : DOWNLOAD_ICON}
              </button>
            </div>
          </li>
        ))}
        {loading && Array.from({ length: photos.length ? 4 : 8 }, (_, i) => <li key={`s${i}`} className="mp-item mp-ghost" aria-hidden="true" />)}
      </ul>

      {error && <p className="gsi-error" role="alert">{error} <button type="button" className="mp-retry" onClick={() => load()}>Try again</button></p>}
      {more && !loading && (
        <div className="mp-more">
          <button type="button" className="mp-btn mp-btn-ghost" onClick={() => load(photos[photos.length - 1].created_at)}>Load more</button>
        </div>
      )}

      <AnimatePresence>
        {viewing && (
          <motion.div className="mp-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onClick={(e) => e.target === e.currentTarget && setViewing(null)}>
            <motion.figure role="dialog" aria-modal="true" aria-label={`${viewing.look_title} photo`}
                           initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}>
              <img data-ph-block src={viewing.url} alt={`${viewing.look_title} photo`} />
              <figcaption>
                <span>
                  <strong>{viewing.look_title}</strong>
                  <small>{when(viewing.created_at)}</small>
                </span>
                <button type="button" className="mp-btn mp-btn-dark" onClick={() => save(viewing)} disabled={saving === viewing.id}>
                  {DOWNLOAD_ICON} {saving === viewing.id ? "Downloading…" : "Download"}
                </button>
              </figcaption>
              <button type="button" className="mp-close" onClick={() => setViewing(null)} aria-label="Close">✕</button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
