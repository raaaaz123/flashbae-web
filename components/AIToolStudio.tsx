"use client";

import { useEffect, useRef, useState } from "react";
import GoogleSignIn from "@/components/GoogleSignIn";
import type { AITool } from "@/lib/aiTools";
import {
  ACCOUNT_EVENT, type GeneratedPhoto, type UserMe, downloadPhotoFile, fetchMe, isUserSignedIn, loginWithGoogle, runTool,
} from "@/lib/flashbie-api";
import "./generator.css";
import "./aitool.css";

const FREE_CREDITS = 5;

const MESSAGES: Record<string, string> = {
  no_credits: "You've used your free photos. Get more credits in the Flashbae app.",
  could_not_render: "The AI couldn't make this one. Try a clearer photo, or another option.",
  image_too_large: "That photo is too large. Choose one under 15 MB.",
  ai_unavailable: "The AI is busy right now. Try again in a minute.",
  not_allowed: "That can't be removed with this tool.",
};

type Phase = "idle" | "working" | "done";

/** One AI tool: add a photo, pick a preset, sign in once, get the result back with a hold-to-compare. */
export default function AIToolStudio({ tool }: { tool: Pick<AITool, "tool" | "slug" | "optionLabel" | "options" | "custom" | "name" | "action"> }) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [option, setOption] = useState(tool.options[0].id);
  const [custom, setCustom] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<GeneratedPhoto | null>(null);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [me, setMe] = useState<UserMe | null>(null);
  const [storedSignIn, setStoredSignIn] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const signedIn = me ? Boolean(me.signed_in) : storedSignIn;

  useEffect(() => {
    setStoredSignIn(isUserSignedIn());
    const onAccount = (e: Event) => setMe((e as CustomEvent<UserMe | null>).detail);
    window.addEventListener(ACCOUNT_EVENT, onAccount);
    if (isUserSignedIn()) fetchMe().then(setMe).catch(() => {});
    return () => {
      window.removeEventListener(ACCOUNT_EVENT, onAccount);
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const pick = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/") && !/\.(heic|heif)$/i.test(file.name)) {
      setError("That file isn't a photo.");
      return;
    }
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setPhase("idle");
    setError(null);
  };

  const run = async () => {
    if (!photo) return;
    setPhase("working");
    setError(null);
    setProgress(6);
    // A steady crawl toward 92% over ~18 s, so the wait reads as progress; the real answer jumps it to 100.
    timer.current = setInterval(() => setProgress((p) => Math.min(92, p + (92 - p) * 0.09)), 400);
    try {
      const resp = await runTool(tool.tool, photo, option, tool.custom ? custom : undefined);
      setResult(resp.photo);
      setMe(resp.me);
      setPhase("done");
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setError(MESSAGES[code] ?? "Something went wrong. Please try again.");
      setPhase("idle");
      fetchMe().then(setMe).catch(() => {});
    } finally {
      if (timer.current) clearInterval(timer.current);
      setProgress(100);
    }
  };

  const start = () => {
    if (!photo) {
      input.current?.click();
      return;
    }
    if (!signedIn) {
      setSignInOpen(true);
      return;
    }
    if (me && me.credits <= 0) {
      setError(MESSAGES.no_credits);
      return;
    }
    run();
  };

  const onCredential = async (idToken: string) => {
    setSigningIn(true);
    try {
      const account = await loginWithGoogle(idToken);
      setMe(account);
      setSignInOpen(false);
      if (account.credits > 0) run();
      else setError(MESSAGES.no_credits);
    } catch {
      setError("Google sign-in didn't go through. Please try again.");
      setSignInOpen(false);
    } finally {
      setSigningIn(false);
    }
  };

  const download = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      await downloadPhotoFile(result.url, `flashbae-${tool.slug}-${Date.now()}.jpg`);
    } finally {
      setDownloading(false);
    }
  };

  const working = phase === "working";
  const shown = result && !comparing ? result.url : preview;

  return (
    <div className="ait">
      <div
        className={`ait-stage${dragOver ? " is-over" : ""}${preview ? " has-photo" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); pick(e.dataTransfer.files?.[0]); }}
      >
        {shown ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shown} alt={result && !comparing ? `Your photo after ${tool.name}` : "Your photo"} className={working ? "is-working" : ""} />
            {working && (
              <div className="ait-working" role="status">
                <span className="ait-scan" aria-hidden="true" />
                <span className="ait-working-text">Working on it… {Math.round(progress)}%</span>
              </div>
            )}
            {result && (
              <button
                type="button" className="ait-compare"
                onPointerDown={() => setComparing(true)} onPointerUp={() => setComparing(false)} onPointerLeave={() => setComparing(false)}
                onKeyDown={(e) => e.key === " " && setComparing(true)} onKeyUp={() => setComparing(false)}
              >
                {comparing ? "Original" : "Hold to compare"}
              </button>
            )}
            {!working && (
              <button type="button" className="ait-change" onClick={() => input.current?.click()}>Change photo</button>
            )}
          </>
        ) : (
          <button type="button" className="ait-drop" onClick={() => input.current?.click()}>
            <span className="ait-drop-icon" aria-hidden="true">＋</span>
            <strong>Add a photo</strong>
            <span>or drop it here · JPG, PNG or HEIC</span>
          </button>
        )}
        <input ref={input} type="file" accept="image/*,.heic,.heif" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
      </div>

      <div className="ait-panel">
        <fieldset className="ait-options" disabled={working}>
          <legend>{tool.optionLabel}</legend>
          <div className="ait-chips" role="radiogroup" aria-label={tool.optionLabel}>
            {tool.options.map((o) => (
              <button
                key={o.id} type="button" role="radio" aria-checked={option === o.id && !custom.trim()}
                className="ait-chip" onClick={() => { setOption(o.id); setCustom(""); }}
              >
                <span aria-hidden="true">{o.icon}</span> {o.label}
              </button>
            ))}
          </div>
          {tool.custom && (
            <label className="ait-custom">
              <span>{tool.custom.label}</span>
              <input type="text" maxLength={80} value={custom} placeholder={tool.custom.placeholder} onChange={(e) => setCustom(e.target.value)} />
            </label>
          )}
        </fieldset>

        {error && <p className="ait-error" role="alert">{error}</p>}

        <div className="ait-actions">
          {phase === "done" && result ? (
            <>
              <button type="button" className="ait-btn ait-btn-dark" onClick={download} disabled={downloading}>
                {downloading ? "Saving…" : "Download"}
              </button>
              <button type="button" className="ait-btn ait-btn-light" onClick={start}>Try another</button>
            </>
          ) : (
            <button type="button" className="ait-btn ait-btn-dark ait-btn-wide" onClick={start} disabled={working}>
              {working ? "Working…" : !photo ? "Add a photo" : signedIn ? `✨ ${tool.action}` : `✨ Sign in for ${FREE_CREDITS} free photos`}
            </button>
          )}
        </div>
        <p className="ait-meta">
          {signedIn && me ? `${me.credits} ${me.credits === 1 ? "credit" : "credits"} left · ` : `${FREE_CREDITS} free photos with Google sign-in · `}
          about 15 seconds · <a href="/my-photos/">My photos</a>
        </p>
      </div>

      {signInOpen && (
        <div className="gen-modal ait-modal" onClick={(e) => e.target === e.currentTarget && setSignInOpen(false)}>
          <div className="gen-modal-card" role="dialog" aria-modal="true" aria-labelledby="ait-signin-title">
            <button type="button" className="gen-modal-close" onClick={() => setSignInOpen(false)} aria-label="Close">✕</button>
            <h3 id="ait-signin-title">Sign in to use the AI tools</h3>
            <p>New accounts get <strong>{FREE_CREDITS} free photos</strong>. One photo, one credit.</p>
            <div className="gen-signin">{signingIn ? <p>Signing you in…</p> : <GoogleSignIn onCredential={onCredential} />}</div>
            <p className="gen-fine">We only use your name and email to keep your credits and photos.</p>
          </div>
        </div>
      )}
    </div>
  );
}
