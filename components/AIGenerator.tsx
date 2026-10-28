"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LOOKS, type Look, lookById, lookBySlug } from "@/lib/looks";
import { APP_STORE_URL } from "@/lib/site";
import GoogleSignIn from "@/components/GoogleSignIn";
import {
  ACCOUNT_EVENT,
  fetchMe,
  generateLookPhoto,
  downloadPhotoFile,
  loginWithGoogle,
  isUserSignedIn,
  type UserMe,
  type GeneratedPhoto,
} from "@/lib/flashbie-api";
import "./generator.css";

type Props = {
  initialLookSlug?: string;
  className?: string;
};

type Step = "style" | "photo" | "generating" | "result";
type Kind = Look["kind"];

/** The categories inside each kind. Looks a category doesn't name still show under "All". */
const CATEGORIES: Record<Kind, { id: string; label: string; ids: string[] }[]> = {
  effect: [
    { id: "golden", label: "Golden hour", ids: ["dreamlight", "sun-kissed", "adds-warm-cinematic-tones-and-soft-motio"] },
    { id: "flash", label: "Flash & film", ids: ["disposable-flash", "adds-warm-cinematic-tones-and-soft-motio"] },
    { id: "fix", label: "Fix & retouch", ids: ["retake", "clear-scene"] },
  ],
  template: [
    { id: "night", label: "Night out", ids: ["midnight-flash", "subway-motion", "subway-still"] },
    { id: "cozy", label: "Cozy flash", ids: ["soft-flash", "cozy-flash"] },
    { id: "art", label: "Booth & art", ids: ["face-roll", "neon-collage"] },
  ],
};

const KINDS: { id: Kind; label: string; blurb: string }[] = [
  { id: "effect", label: "Effects", blurb: "Keep your photo and its background, change the light: flash, golden hour, film and quick fixes." },
  { id: "template", label: "Templates", blurb: "Keep your face and pose, swap the whole scene: night streets, subway, cozy flash and booth art." },
];

/** What a new Google account starts with. Display only: the server decides the real grant. */
const FREE_CREDITS = 5;

const STEPS: { id: Step; label: string }[] = [
  { id: "style", label: "Style" },
  { id: "photo", label: "Photo" },
  { id: "generating", label: "Generate" },
  { id: "result", label: "Result" },
];

const ARROW = <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M5 10h10m-4-4 4 4-4 4" /></svg>;
const BACK = <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M15 10H5m4-4-4 4 4 4" /></svg>;
const CHECK = <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="m5 10.5 3 3 7-7" /></svg>;
const GOOGLE = (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="gen-google">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z" />
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
  </svg>
);

export default function AIGenerator({ initialLookSlug, className = "" }: Props) {
  const initial = initialLookSlug ? lookBySlug(initialLookSlug) ?? null : null;
  const [look, setLook] = useState<Look | null>(initial);
  const [kind, setKind] = useState<Kind>(initial?.kind ?? "effect");
  const [category, setCategory] = useState("all");
  const [step, setStep] = useState<Step>(initial ? "photo" : "style");
  const top = useRef<HTMLDivElement>(null);

  // User auth & credits
  const [userMe, setUserMe] = useState<UserMe | null>(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleSigningIn, setGoogleSigningIn] = useState(false);
  /** Whether signing in should carry straight on into generating. */
  const [generateAfterSignIn, setGenerateAfterSignIn] = useState(false);
  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);

  // Photos (a second one for duo templates)
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [preview1, setPreview1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  // Webcam
  const [webcamOpen, setWebcamOpen] = useState(false);
  const [webcamTargetSlot, setWebcamTargetSlot] = useState<1 | 2>(1);
  const [webcamCountdown, setWebcamCountdown] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Generation & result
  const [flash, setFlash] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genMessage, setGenMessage] = useState("Preparing photo...");
  const [generatedPhoto, setGeneratedPhoto] = useState<GeneratedPhoto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // localStorage only exists in the browser; reading it after mount keeps the server and client render identical.
  const [storedSignIn, setStoredSignIn] = useState(false);
  useEffect(() => setStoredSignIn(isUserSignedIn()), [userMe]);
  // Once the server has answered, it decides; until then, the remembered sign-in does.
  const signedIn = userMe ? Boolean(userMe.signed_in) : storedSignIn;
  const needsTwo = (look?.people ?? 1) > 1;
  const photosReady = Boolean(photo1 && (!needsTwo || photo2));

  // Only a signed-in visitor has an account to refresh; nobody else gets one until they sign in.
  // Signing in from the header (or anywhere else) updates the studio too.
  useEffect(() => {
    const onAccount = (e: Event) => setUserMe((e as CustomEvent<UserMe | null>).detail);
    window.addEventListener(ACCOUNT_EVENT, onAccount);
    return () => window.removeEventListener(ACCOUNT_EVENT, onAccount);
  }, []);

  useEffect(() => {
    if (!isUserSignedIn()) return;
    let active = true;
    fetchMe()
      .then((me) => active && setUserMe(me))
      .catch((err) => console.warn("Couldn't refresh credits:", err));
    return () => {
      active = false;
    };
  }, []);

  // ?look= on the generator page picks the look and skips straight to the photo.
  useEffect(() => {
    if (initialLookSlug) return;
    const param = new URLSearchParams(window.location.search).get("look");
    const match = param ? lookBySlug(param) || lookById(param) : null;
    if (match) {
      setLook(match);
      setKind(match.kind);
      setStep("photo");
    }
  }, [initialLookSlug]);

  useEffect(() => {
    if (webcamOpen) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } } })
        .then((s) => {
          streamRef.current = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch((err) => {
          console.error("Camera access denied or unavailable", err);
          setWebcamOpen(false);
          setError("Camera access is not permitted or unavailable in your browser.");
        });
    } else if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, [webcamOpen]);

  /** Moves to a step and brings the top of the wizard back into view. */
  const go = (next: Step) => {
    setStep(next);
    setError(null);
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFile1 = (file: File) => {
    setPhoto1(file);
    setPreview1(URL.createObjectURL(file));
    setError(null);
  };
  const handleFile2 = (file: File) => {
    setPhoto2(file);
    setPreview2(URL.createObjectURL(file));
    setError(null);
  };

  const triggerWebcamSnapshot = () => {
    setWebcamCountdown(3);
    const timer = setInterval(() => {
      setWebcamCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          captureWebcam();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const captureWebcam = () => {
    const v = videoRef.current;
    if (!v) return;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth || 1080;
    canvas.height = v.videoHeight || 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Mirror the front camera, like the preview.
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `flashbae-selfie-${Date.now()}.jpg`, { type: "image/jpeg" });
        if (webcamTargetSlot === 1) handleFile1(file);
        else handleFile2(file);
        setWebcamOpen(false);
        setFlash(true);
        setTimeout(() => setFlash(false), 200);
      },
      "image/jpeg",
      0.92
    );
  };

  /** The look's own sample selfie, for trying it without a photo to hand. */
  const useSamplePhoto = async () => {
    if (!look) return;
    try {
      const blob = await (await fetch(look.before)).blob();
      handleFile1(new File([blob], `${look.id}-sample.jpg`, { type: "image/jpeg" }));
    } catch {
      setError("Could not load the sample photo.");
    }
  };

  const executeGeneration = async () => {
    if (!photo1 || !look) return;
    go("generating");
    setFlash(true);
    setTimeout(() => setFlash(false), 250);

    // Staged messages while the model works, so the wait reads as progress.
    setGenProgress(12);
    setGenMessage("Uploading your photo...");
    const timers = [
      setTimeout(() => { setGenProgress(38); setGenMessage(`Reading the light for ${look.title}...`); }, 2000),
      setTimeout(() => { setGenProgress(66); setGenMessage("Re-shooting the scene..."); }, 5500),
      setTimeout(() => { setGenProgress(86); setGenMessage("Developing the final photo..."); }, 9500),
    ];

    try {
      const resp = await generateLookPhoto({ lookId: look.id, photo: photo1, photo2 });
      timers.forEach(clearTimeout);
      setGenProgress(100);
      setGenMessage("Done!");
      setGeneratedPhoto(resp.photo);
      setUserMe(resp.me);
      go("result");
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
    } catch (err: any) {
      timers.forEach(clearTimeout);
      go("photo");
      if (err.message === "no_credits") {
        setError("You've used all your free credits.");
      } else if (err.message === "could_not_render") {
        setError("The AI couldn't clearly find a face in this photo. Try a clear, front-facing selfie in good light.");
      } else if (err.message === "image_too_large") {
        setError("Your image is too large. Please choose a photo under 15MB.");
      } else if (err.message === "ai_unavailable") {
        setError("AI generation is busy right now. Please try again in a few moments.");
      } else {
        setError(err.message || "Something went wrong while generating. Please try again.");
      }
      fetchMe().then(setUserMe).catch(() => {});
    }
  };

  const handleGenerate = () => {
    if (!photosReady) {
      setError(needsTwo ? "This template needs two photos, one for each person." : "Please add a photo first.");
      return;
    }
    if (!signedIn) {
      openSignIn(true);
      return;
    }
    if (userMe && userMe.credits <= 0) {
      setError("You've used all your free credits.");
      return;
    }
    executeGeneration();
  };

  const openSignIn = (thenGenerate: boolean) => {
    setGoogleAuthError(null);
    setGenerateAfterSignIn(thenGenerate);
    setShowGoogleModal(true);
  };

  /** Google handed back an ID token: trade it for a Flashbae session. */
  const handleGoogleCredential = async (idToken: string) => {
    setGoogleSigningIn(true);
    setGoogleAuthError(null);
    try {
      const me = await loginWithGoogle(idToken);
      setUserMe(me);
      setShowGoogleModal(false);
      if (generateAfterSignIn && me.credits > 0) setTimeout(executeGeneration, 300);
      else if (generateAfterSignIn) setError("You've used all your free credits.");
    } catch (err: any) {
      setGoogleAuthError(err.message === "invalid_google_token" ? "Google couldn't confirm that sign-in. Please try again." : err.message || "Google sign-in failed.");
    } finally {
      setGoogleSigningIn(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedPhoto || !look) return;
    setDownloading(true);
    try {
      await downloadPhotoFile(generatedPhoto.url, `flashbae-${look.slug}-${Date.now()}.jpg`);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3500);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  const clearPhotos = () => {
    setPhoto1(null);
    setPreview1(null);
    setPhoto2(null);
    setPreview2(null);
  };

  // ---------- step 1: the looks on offer ----------
  const ofKind = LOOKS.filter((l) => l.kind === kind);
  const cats = CATEGORIES[kind].filter((c) => c.ids.some((id) => ofKind.some((l) => l.id === id)));
  const cat = cats.find((c) => c.id === category);
  const shown = cat ? ofKind.filter((l) => cat.ids.includes(l.id)) : ofKind;

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  /** Which earlier steps can be revisited from the stepper. */
  const reachable = (i: number) => step !== "generating" && i < stepIndex && STEPS[i].id !== "generating";

  const slot = (n: 1 | 2) => {
    const preview = n === 1 ? preview1 : preview2;
    const ref = n === 1 ? fileInputRef1 : fileInputRef2;
    const handle = n === 1 ? handleFile1 : handleFile2;
    const clear = () => (n === 1 ? (setPhoto1(null), setPreview1(null)) : (setPhoto2(null), setPreview2(null)));
    return (
      <div className="gen-slot">
        {needsTwo && <p className="gen-slot-label">{n === 1 ? "Person 1 · you" : "Person 2"}</p>}
        {preview ? (
          <div className="gen-slot-preview">
            <img data-ph-block src={preview} alt={n === 1 ? "Your photo" : "Second person's photo"} />
            <button type="button" className="gen-slot-swap" onClick={clear}>Replace</button>
            <span className="gen-slot-ok">{CHECK}</span>
          </div>
        ) : (
          <div
            className="gen-drop"
            role="button"
            tabIndex={0}
            onClick={() => ref.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), ref.current?.click())}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files[0]) handle(e.dataTransfer.files[0]);
            }}
          >
            <input
              ref={ref}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])}
            />
            <span className="gen-drop-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 16V4m0 0-5 5m5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
            </span>
            <span className="gen-drop-title">{n === 1 ? "Choose a photo" : "Add the second person"}</span>
            <span className="gen-drop-sub">or drag it here · JPG, PNG, WebP</span>
          </div>
        )}
        {!preview && (
          <div className="gen-slot-actions">
            <button type="button" className="gen-chip" onClick={() => { setWebcamTargetSlot(n); setWebcamOpen(true); }}>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M3 8a2 2 0 0 1 2-2h2.5l1.5-2h6l1.5 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" /></svg>
              Use camera
            </button>
            {n === 1 && <button type="button" className="gen-chip" onClick={useSamplePhoto}>Try a sample photo</button>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`gen ${className}`} ref={top}>
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="gen-flash"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ---------- stepper ---------- */}
      <ol className="gen-steps" aria-label="Progress">
        {STEPS.map((s, i) => {
          const state = i < stepIndex ? "done" : i === stepIndex ? "now" : "todo";
          const inner = (
            <>
              <span className="gen-step-dot">{state === "done" ? CHECK : i + 1}</span>
              <span className="gen-step-label">{s.label}</span>
            </>
          );
          return (
            <li key={s.id} className={`gen-step is-${state}`} aria-current={state === "now" ? "step" : undefined}>
              {reachable(i) ? (
                <button type="button" onClick={() => go(s.id)} aria-label={`Back to ${s.label}`}>{inner}</button>
              ) : (
                <span>{inner}</span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="gen-card">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ---------- 1: style ---------- */}
            {step === "style" && (
              <section aria-labelledby="gen-style-title">
                <div className="gen-head">
                  <div>
                    <p className="gen-eyebrow">Step 1 of 4</p>
                    <h2 id="gen-style-title">Choose a style</h2>
                  </div>
                  <div className="gen-seg" role="tablist" aria-label="Kind of look">
                    {KINDS.map((k) => (
                      <button
                        key={k.id}
                        type="button"
                        role="tab"
                        aria-selected={kind === k.id}
                        className="gen-seg-btn"
                        onClick={() => { setKind(k.id); setCategory("all"); }}
                      >
                        {kind === k.id && <motion.span layoutId="gen-seg" className="gen-seg-bg" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                        <span className="gen-seg-text">
                          {k.label}
                          <small>{LOOKS.filter((l) => l.kind === k.id).length}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <p className="gen-blurb">{KINDS.find((k) => k.id === kind)!.blurb}</p>

                <div className="gen-cats" role="radiogroup" aria-label="Category">
                  {[{ id: "all", label: "All" }, ...cats].map((c) => (
                    <button key={c.id} type="button" role="radio" aria-checked={category === c.id} className="gen-cat" onClick={() => setCategory(c.id)}>
                      {c.label}
                    </button>
                  ))}
                </div>

                <div className="gen-grid" role="radiogroup" aria-label="Looks">
                  {shown.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      role="radio"
                      aria-checked={look?.id === l.id}
                      className="gen-look"
                      onClick={() => setLook(l)}
                      onDoubleClick={() => { setLook(l); go("photo"); }}
                    >
                      <span className="gen-look-img">
                        <img src={l.after} alt="" loading="lazy" />
                        <img src={l.before} alt="" loading="lazy" className="gen-look-before" />
                        <span className="gen-look-check">{CHECK}</span>
                        {l.people > 1 && <span className="gen-look-tag">2 people</span>}
                      </span>
                      <span className="gen-look-title">{l.title}</span>
                      <span className="gen-look-sub">{l.tagline}</span>
                    </button>
                  ))}
                </div>

                <div className="gen-bar">
                  {look ? (
                    <div className="gen-bar-pick">
                      <img src={look.after} alt="" />
                      <span>
                        <small>Selected</small>
                        {look.title}
                      </span>
                    </div>
                  ) : (
                    <p className="gen-bar-hint">Pick a look to continue</p>
                  )}
                  <button type="button" className="gen-btn gen-btn-dark" disabled={!look} onClick={() => go("photo")}>
                    Next: add photo {ARROW}
                  </button>
                </div>
              </section>
            )}

            {/* ---------- 2: photo ---------- */}
            {step === "photo" && look && (
              <section aria-labelledby="gen-photo-title">
                <div className="gen-head">
                  <div>
                    <p className="gen-eyebrow">Step 2 of 4</p>
                    <h2 id="gen-photo-title">{needsTwo ? "Add two photos" : "Add your photo"}</h2>
                  </div>
                  <div className={`gen-credits${signedIn ? "" : " is-out"}`}>
                    {signedIn ? (
                      <>
                        <span className="gen-credits-dot" />
                        <strong>{userMe?.credits ?? 0}</strong> credits left
                      </>
                    ) : (
                      <button type="button" onClick={() => openSignIn(false)}>
                        {GOOGLE} Sign in for {FREE_CREDITS} free photos
                      </button>
                    )}
                  </div>
                </div>

                <div className="gen-photo">
                  <aside className="gen-chosen">
                    <div className="gen-chosen-img">
                      <img src={look.after} alt={`${look.title} example`} />
                      <span className="gen-kind">{look.kind === "template" ? "Template" : "Effect"}</span>
                    </div>
                    <div className="gen-chosen-text">
                      <h3>{look.title}</h3>
                      <p>{look.tagline}</p>
                      <button type="button" className="gen-link" onClick={() => go("style")}>Change style</button>
                    </div>
                  </aside>

                  <div className="gen-upload">
                    <div className={`gen-slots${needsTwo ? " is-two" : ""}`}>
                      {slot(1)}
                      {needsTwo && slot(2)}
                    </div>
                    <ul className="gen-tips">
                      <li>{CHECK} Face clearly visible</li>
                      <li>{CHECK} Good, even light</li>
                      <li>{CHECK} {needsTwo ? "One person per photo" : "Just you in the shot"}</li>
                    </ul>
                    {error && <p className="gen-error" role="alert">{error}</p>}
                  </div>
                </div>

                <div className="gen-bar">
                  <button type="button" className="gen-btn gen-btn-ghost" onClick={() => go("style")}>{BACK} Back</button>
                  <button type="button" className="gen-btn gen-btn-dark" disabled={!photosReady} onClick={handleGenerate}>
                    ✨ Generate {look.title}
                  </button>
                </div>
                <p className="gen-meta">About 15 seconds · 1 credit · free high-res download</p>
              </section>
            )}

            {/* ---------- 3: generating ---------- */}
            {step === "generating" && look && (
              <section className="gen-dev" aria-live="polite" aria-labelledby="gen-dev-title">
                <p className="gen-eyebrow">Step 3 of 4</p>
                <div className="gen-dev-print">
                  <div className="gen-dev-img">
                    {preview1 && <img data-ph-block src={preview1} alt="" />}
                    <span className="gen-dev-scan" />
                  </div>
                  <span className="gen-dev-caption">{look.title}</span>
                </div>
                <h2 id="gen-dev-title">Developing your photo</h2>
                <p className="gen-dev-msg">{genMessage}</p>
                <div className="gen-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={genProgress}>
                  <span style={{ width: `${genProgress}%` }} />
                </div>
                <p className="gen-meta">Usually about 15 seconds. Keep this tab open.</p>
              </section>
            )}

            {/* ---------- 4: result ---------- */}
            {step === "result" && look && generatedPhoto && (
              <section aria-labelledby="gen-result-title">
                <div className="gen-result">
                  <figure className="gen-result-photo">
                    <img data-ph-block src={generatedPhoto.url} alt={`Your photo with ${look.title}`} />
                    <span className="gen-result-tag">{look.title}</span>
                  </figure>
                  <div className="gen-result-side">
                    <p className="gen-eyebrow">Step 4 of 4 · done</p>
                    <h2 id="gen-result-title">Your <em>{look.title}</em> photo</h2>
                    <p className="gen-result-text">Saved to your account. Download it now, or find it any time in My photos.</p>
                    <button type="button" className="gen-btn gen-btn-dark gen-btn-wide" onClick={handleDownload} disabled={downloading}>
                      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 4v12m0 0-5-5m5 5 5-5M4 20h16" /></svg>
                      {downloaded ? "Saved!" : downloading ? "Downloading..." : "Download photo"}
                    </button>
                    <button type="button" className="gen-btn gen-btn-ghost gen-btn-wide" onClick={() => { setGeneratedPhoto(null); go("style"); }}>
                      Try another look with this photo
                    </button>
                    <button type="button" className="gen-link" onClick={() => { setGeneratedPhoto(null); clearPhotos(); go("photo"); }}>
                      Use a different photo
                    </button>
                    <a className="gen-link" href="/my-photos/">See all your photos</a>
                    {signedIn && <p className="gen-meta">{userMe?.credits ?? 0} credits left</p>}
                    <a className="gen-app" href={APP_STORE_URL}>
                      <span>📸</span>
                      <span><strong>Want photo strips too?</strong> Every look plus a real photo booth in the iPhone app.</span>
                    </a>
                  </div>
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ---------- sign in ---------- */}
      <AnimatePresence>
        {showGoogleModal && (
          <motion.div className="gen-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onClick={(e) => e.target === e.currentTarget && setShowGoogleModal(false)}>
            <motion.div className="gen-modal-card" role="dialog" aria-modal="true" aria-labelledby="gen-signin-title"
                        initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }}>
              <button type="button" className="gen-modal-close" onClick={() => setShowGoogleModal(false)} aria-label="Close">✕</button>
              <h3 id="gen-signin-title">Sign in to generate</h3>
              <p>New accounts get <strong>{FREE_CREDITS} free photos</strong>. One photo, one credit.</p>
              <div className="gen-signin">
                {googleSigningIn ? <p className="gen-meta">Signing you in…</p> : <GoogleSignIn onCredential={handleGoogleCredential} />}
              </div>
              {googleAuthError && <p className="gen-error" role="alert">{googleAuthError}</p>}
              <p className="gen-fine">We only use your name and email to keep your credits and photos.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- camera ---------- */}
      <AnimatePresence>
        {webcamOpen && (
          <motion.div className="gen-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="gen-modal-card gen-modal-cam" role="dialog" aria-modal="true" aria-labelledby="gen-cam-title"
                        initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }}>
              <button type="button" className="gen-modal-close" onClick={() => setWebcamOpen(false)} aria-label="Close camera">✕</button>
              <h3 id="gen-cam-title">Take a selfie</h3>
              <div className="gen-cam">
                <video ref={videoRef} autoPlay playsInline muted />
                {webcamCountdown !== null && <span className="gen-cam-count">{webcamCountdown}</span>}
              </div>
              <button type="button" className="gen-btn gen-btn-dark gen-btn-wide" onClick={triggerWebcamSnapshot} disabled={webcamCountdown !== null}>
                <span className="gen-shutter" /> Snap in 3 seconds
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
