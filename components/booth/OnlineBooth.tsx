"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Layout, Source } from "@/lib/booth";
import { LAYOUTS, poseSession } from "@/lib/booth";
import LayoutPicker from "./LayoutPicker";
import StripStudio from "./StripStudio";

type Phase = "setup" | "starting" | "live" | "shooting" | "done";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function cameraError(e: unknown) {
  const name = e instanceof DOMException ? e.name : "";
  if (name === "NotAllowedError" || name === "SecurityError")
    return "Camera access is blocked. Allow the camera for this site in your browser settings, then try again.";
  if (name === "NotFoundError" || name === "OverconstrainedError") return "We couldn't find a camera on this device.";
  if (name === "NotReadableError") return "Your camera is busy in another app. Close it there and try again.";
  return "Your browser couldn't open the camera.";
}

/**
 * The web photo booth: the app's booth in miniature. A pose prompt, a 3-2-1 countdown and a white
 * screen flash for every frame, then the strip editor. The camera stream never leaves the page.
 */
export default function OnlineBooth() {
  const [layout, setLayout] = useState<Layout>(LAYOUTS[0]);
  const [phase, setPhase] = useState<Phase>("setup");
  const [error, setError] = useState<string | null>(null);
  const [useFlash, setUseFlash] = useState(true);
  const [shots, setShots] = useState<Source[]>([]);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [pose, setPose] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const run = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const cam = useRef<HTMLDivElement>(null);

  const stop = useCallback(() => {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
  }, []);

  useEffect(() => () => { run.current++; stop(); }, [stop]);

  async function start() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("This browser can't open a camera here. Try Safari or Chrome, or use photos instead.");
      return;
    }
    setPhase("starting");
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false,
      });
      stream.current = s;
      setShots([]); setThumbs([]); setPose(null); setCount(null);
      setPhase("live");
    } catch (e) {
      setError(cameraError(e));
      setPhase("setup");
    }
  }

  // Attach the stream once the video element is on screen.
  useEffect(() => {
    if ((phase === "live" || phase === "shooting") && video.current && stream.current && video.current.srcObject !== stream.current) {
      video.current.srcObject = stream.current;
      video.current.play().catch(() => {});
    }
  }, [phase]);

  // Keep the camera, the countdown and the pose prompt on screen while shooting.
  useEffect(() => {
    if (phase === "live" || phase === "shooting") cam.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [phase]);

  /** The current camera frame, mirrored like the preview (it's a selfie). */
  function grab(): HTMLCanvasElement | null {
    const v = video.current;
    if (!v || !v.videoWidth) return null;
    const c = document.createElement("canvas");
    c.width = v.videoWidth; c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    ctx.translate(c.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0);
    return c;
  }

  async function shoot() {
    const id = ++run.current;
    const poses = poseSession(layout.count);
    const taken: Source[] = [];
    setPhase("shooting");
    setShots([]); setThumbs([]);
    for (let i = 0; i < layout.count; i++) {
      setPose(poses[i]);
      await sleep(1600);
      for (const n of [3, 2, 1]) {
        if (run.current !== id) return;
        setCount(n);
        await sleep(800);
      }
      setCount(null);
      if (run.current !== id) return;
      // The flash: the screen goes white and lights the face, then the shot.
      setFlash(true);
      await sleep(useFlash ? 160 : 60);
      const shot = grab();
      await sleep(80);
      setFlash(false);
      if (!shot) continue;
      taken.push(shot);
      setShots([...taken]);
      setThumbs((t) => [...t, shot.toDataURL("image/jpeg", 0.6)]);
      if (i < layout.count - 1) {
        setPose("Next pose…");
        await sleep(900);
      }
    }
    if (run.current !== id) return;
    stop();
    setPose(null);
    setPhase("done");
    root.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cancel() {
    run.current++;
    stop();
    setPose(null); setCount(null); setFlash(false);
    setPhase("setup");
  }

  if (phase === "done") {
    return (
      <div ref={root} className="tool">
        <StripStudio layout={layout} photos={shots} restartLabel="Retake the strip" onRestart={start} />
      </div>
    );
  }

  const live = phase === "live" || phase === "shooting";
  const aspect = layout.columns === 1 ? "4 / 3" : "3 / 4";

  return (
    <div ref={root} className="tool">
      {!live ? (
        <div className="tool-setup">
          <LayoutPicker value={layout.id} onChange={setLayout} />
          <label className="toggle">
            <input type="checkbox" checked={useFlash} onChange={(e) => setUseFlash(e.target.checked)} />
            <span>Screen flash <span className="field-hint">(the screen turns white for each shot, to light your face)</span></span>
          </label>
          <div className="tool-start">
            <button type="button" className="btn btn-store" onClick={start} disabled={phase === "starting"}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M9 3 7.2 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.2L15 3H9Zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" /></svg>
              {phase === "starting" ? "Opening the camera…" : "Start the camera"}
            </button>
            <p className="fine">Your camera stays on your device. Nothing is uploaded.</p>
          </div>
          {error && (
            <p className="tool-error" role="alert">
              {error} <a href="/photo-strip-maker/">Make a strip from photos instead</a>.
            </p>
          )}
        </div>
      ) : (
        <div className="booth-live">
          <div ref={cam} className="cam" style={{ aspectRatio: aspect, ["--ar" as string]: layout.columns === 1 ? 4 / 3 : 3 / 4 }}>
            <video ref={video} className="cam-video" playsInline muted autoPlay />
            {pose && <p className="cam-pose" aria-live="polite">{pose}</p>}
            {count !== null && <span className="cam-count" aria-live="assertive">{count}</span>}
            <span className="cam-progress">{Math.min(shots.length + (phase === "shooting" ? 1 : 0), layout.count)} / {layout.count}</span>
            {flash && !useFlash && <span className="cam-shutter" aria-hidden="true" />}
          </div>
          <ol className="thumbs" aria-label="Frames taken">
            {Array.from({ length: layout.count }, (_, i) => (
              <li key={i} className="thumb" style={{ aspectRatio: aspect }}>
                {thumbs[i] ? <img src={thumbs[i]} alt={`Frame ${i + 1}`} /> : <span>{i + 1}</span>}
              </li>
            ))}
          </ol>
          <div className="booth-live-actions">
            {phase === "live" && (
              <button type="button" className="btn btn-store" onClick={shoot}>Start the countdown</button>
            )}
            <button type="button" className="btn btn-soft" onClick={cancel}>{phase === "shooting" ? "Stop" : "Cancel"}</button>
          </div>
          {phase === "live" && <p className="fine booth-live-tip">Prop your phone or laptop at eye level, step back a little, and face a light.</p>}
        </div>
      )}
      {flash && useFlash && <div className="screen-flash" aria-hidden="true" />}
    </div>
  );
}
