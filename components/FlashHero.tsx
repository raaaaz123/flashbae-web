"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import * as THREE from "three";
import type { Look } from "@/lib/looks";

/**
 * The hero: instant prints float in a loose pile. A camera flash "develops" them from the
 * plain selfie to the AI look. Hover (or tap) a print to peek at its before; the shutter
 * button takes another shot with the next looks. Reduced motion: no flash, no drift.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uBefore;
  uniform sampler2D uAfter;
  uniform vec2 uScaleBefore;
  uniform vec2 uScaleAfter;
  uniform float uDevelop;
  uniform float uPeek;
  uniform float uFlare;
  varying vec2 vUv;
  vec2 cover(vec2 uv, vec2 s) { return (uv - 0.5) * s + 0.5; }
  void main() {
    vec3 before = texture2D(uBefore, cover(vUv, uScaleBefore)).rgb;
    vec3 after = texture2D(uAfter, cover(vUv, uScaleAfter)).rgb;
    float d = clamp(uDevelop - uPeek, 0.0, 1.0);
    // Instant film develops from the edges in: the centre catches up last.
    float edge = length(vUv - 0.5) * 0.6;
    float t = smoothstep(0.0, 1.0, clamp(d * 1.35 - (0.3 - edge), 0.0, 1.0));
    vec3 col = mix(before, after, t);
    col = mix(col, vec3(1.0), uFlare * 0.85);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

const PHOTO_W = 1.6;
const PHOTO_H = 2.0;

/** Where the prints rest, around the centre of the canvas: x, y, z, tilt (degrees). */
const SPOTS: [number, number, number, number][] = [
  [0.1, 0.15, 0.6, -4],
  [-2.05, 0.75, -0.5, -11],
  [2.1, 1.0, -0.3, 9],
  [-1.55, -1.75, 0.1, 7],
  [1.85, -1.55, 0.3, -8],
  [-3.6, -0.55, -1.4, 13],
  [3.65, -0.2, -1.2, -13],
];

type Card = {
  group: THREE.Group;
  mat: THREE.ShaderMaterial;
  home: THREE.Vector3;
  tilt: number;
  phase: number;
  peek: number;
  peekTarget: number;
};

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 8, 64, 64, 62);
  r.addColorStop(0, "rgba(120,40,60,0.42)");
  r.addColorStop(1, "rgba(120,40,60,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function coverScale(tex: THREE.Texture) {
  const img = tex.image as { width: number; height: number } | undefined;
  if (!img?.width) return new THREE.Vector2(1, 1);
  const plane = PHOTO_W / PHOTO_H;
  const ta = img.width / img.height;
  return ta > plane ? new THREE.Vector2(plane / ta, 1) : new THREE.Vector2(1, ta / plane);
}

export default function FlashHero({ looks }: { looks: Look[] }) {
  const mount = useRef<HTMLDivElement>(null);
  const flash = useAnimationControls();
  const shootRef = useRef<() => void>(() => {});
  const [shot, setShot] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 13);

    const loader = new THREE.TextureLoader();
    const cache = new Map<string, THREE.Texture>();
    const load = (url: string, onLoad?: (t: THREE.Texture) => void) => {
      const hit = cache.get(url);
      if (hit) { onLoad?.(hit); return hit; }
      const t = loader.load(url, (tex) => onLoad?.(tex));
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      cache.set(url, t);
      return t;
    };

    const shadowTex = shadowTexture();
    const photoGeo = new THREE.PlaneGeometry(PHOTO_W, PHOTO_H);
    // Instant-film paper: a thin border, a deep chin.
    const paperGeo = new THREE.PlaneGeometry(PHOTO_W + 0.24, PHOTO_H + 0.62);
    const shadowGeo = new THREE.PlaneGeometry(PHOTO_W + 1.6, PHOTO_H + 1.9);
    const paperMat = new THREE.MeshBasicMaterial({ color: 0xfffbfc });
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });

    let offset = 0; // which look the first card shows; the shutter moves it on
    const lookFor = (i: number) => looks[(i + offset) % looks.length];

    const cards: Card[] = SPOTS.slice(0, Math.min(SPOTS.length, looks.length)).map(([x, y, z, tilt], i) => {
      const look = lookFor(i);
      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uBefore: { value: null },
          uAfter: { value: null },
          uScaleBefore: { value: new THREE.Vector2(1, 1) },
          uScaleAfter: { value: new THREE.Vector2(1, 1) },
          uDevelop: { value: reduce ? 1 : 0 },
          uPeek: { value: 0 },
          uFlare: { value: 0 },
        },
      });
      mat.uniforms.uBefore.value = load(look.before, (t) => (mat.uniforms.uScaleBefore.value = coverScale(t)));
      mat.uniforms.uAfter.value = load(look.after, (t) => (mat.uniforms.uScaleAfter.value = coverScale(t)));

      const group = new THREE.Group();
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.position.set(0.18, -0.42, -0.04);
      const paper = new THREE.Mesh(paperGeo, paperMat);
      paper.position.y = -0.19;
      const photo = new THREE.Mesh(photoGeo, mat);
      photo.position.z = 0.005;
      photo.userData.card = i;
      group.add(shadow, paper, photo);
      group.position.set(x, y - (reduce ? 0 : 6), z);
      group.rotation.z = THREE.MathUtils.degToRad(tilt);
      scene.add(group);
      return { group, mat, home: new THREE.Vector3(x, y, z), tilt, phase: i * 1.7, peek: 0, peekTarget: 0 };
    });

    // Fit the whole pile inside the canvas. Narrow canvases drop the two outer prints
    // rather than shrinking everything to thumbnails.
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const narrow = w / h < 1.0;
      cards.forEach((c, i) => (c.group.visible = !(narrow && i >= 5)));
      const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const visW = visH * camera.aspect;
      const pileW = narrow ? 6.7 : 9.8, pileH = 6.1;
      const k = Math.min(1.15, visW / pileW, visH / pileH);
      scene.scale.setScalar(k);
      scene.position.y = 0.45 * k; // the pile hangs a little low; lift it to the middle
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    // Pointer: gentle parallax, and the print under it shows its before.
    const pointer = new THREE.Vector2(9, 9);
    const parallax = new THREE.Vector2();
    const ray = new THREE.Raycaster();
    const photos = cards.map((c) => c.group.children[2]);
    const hit = () => {
      ray.setFromCamera(pointer, camera);
      const h = ray.intersectObjects(photos)[0];
      return h ? (h.object.userData.card as number) : -1;
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      if (e.pointerType === "mouse") {
        const i = hit();
        cards.forEach((c, k) => (c.peekTarget = k === i ? 1 : 0));
        el.style.cursor = i >= 0 ? "pointer" : "";
      }
    };
    const onLeave = () => { pointer.set(9, 9); cards.forEach((c) => (c.peekTarget = 0)); };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      onMove(e);
      const i = hit();
      cards.forEach((c, k) => (c.peekTarget = k === i ? 1 - c.peekTarget : 0));
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);

    // The develop: a flash, then the prints turn from the selfie into the look.
    let developFrom = -1;
    let flareAt = -1;
    const DEVELOP = 1.6;
    const develop = (now: number) => {
      developFrom = now + 0.12;
      flareAt = now;
      cards.forEach((c) => (c.mat.uniforms.uDevelop.value = 0));
      flash.start({ opacity: [0, 0.75, 0], transition: { duration: 0.65, times: [0, 0.12, 1], ease: "easeOut" } });
    };

    shootRef.current = () => {
      offset = (offset + cards.length) % looks.length;
      const now = performance.now() / 1000;
      cards.forEach((c, i) => {
        const look = lookFor(i);
        const u = c.mat.uniforms;
        u.uBefore.value = load(look.before, (t) => (u.uScaleBefore.value = coverScale(t)));
        u.uAfter.value = load(look.after, (t) => (u.uScaleAfter.value = coverScale(t)));
        if (reduce) { u.uDevelop.value = 1; return; }
        c.group.position.y -= 0.35; // a little jolt, as if the camera clicked
      });
      if (!reduce) develop(now);
    };

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const start = performance.now() / 1000;
    let entered = reduce;
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      const now = performance.now() / 1000;
      const t = now - start;

      if (!entered && t > 1.25) { entered = true; develop(now); setReady(true); }

      parallax.lerp(pointer.x > 2 ? new THREE.Vector2() : pointer, 0.05);
      cards.forEach((c, i) => {
        const g = c.group;
        const bob = reduce ? 0 : Math.sin(t * 0.7 + c.phase) * 0.07;
        const tx = c.home.x + parallax.x * 0.25 * (1 + c.home.z * 0.3);
        const ty = c.home.y + bob + parallax.y * 0.18 * (1 + c.home.z * 0.3);
        // Prints drop into place one after another, then settle.
        const k = reduce ? 1 : Math.min(1, Math.max(0, (t - i * 0.09) * 0.11 + 0.035));
        g.position.x += (tx - g.position.x) * k;
        g.position.y += (ty - g.position.y) * k;
        g.rotation.z = THREE.MathUtils.degToRad(c.tilt + (reduce ? 0 : Math.sin(t * 0.5 + c.phase) * 1.2));
        g.rotation.y = parallax.x * 0.12;
        g.rotation.x = -parallax.y * 0.08;

        c.peek += (c.peekTarget - c.peek) * 0.14;
        const u = c.mat.uniforms;
        u.uPeek.value = c.peek;
        g.position.z = c.home.z + c.peek * 0.5;
        if (developFrom >= 0) u.uDevelop.value = Math.min(1, Math.max(0, (now - developFrom - i * 0.06) / DEVELOP));
        u.uFlare.value = flareAt >= 0 ? Math.max(0, 1 - (now - flareAt) / 0.5) : 0;
      });
      renderer.render(scene, camera);
    };
    tick();
    if (reduce) setReady(true);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      cache.forEach((t) => t.dispose());
      [photoGeo, paperGeo, shadowGeo].forEach((g) => g.dispose());
      [paperMat, shadowMat, ...cards.map((c) => c.mat)].forEach((m) => m.dispose());
      shadowTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [looks, flash]);

  return (
    <div className="hero-stage">
      <div ref={mount} className="hero-canvas" />
      <motion.div className="hero-flash" initial={{ opacity: 0 }} animate={flash} aria-hidden="true" />
      <div className="hero-controls">
      <motion.button
        type="button"
        className="shutter"
        onClick={() => { shootRef.current(); setShot((s) => s + 1); }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={ready ? { opacity: 1, scale: 1 } : {}}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
      >
        <span className="shutter-dot" aria-hidden="true" />
        Take another shot
      </motion.button>
      <p className="hero-hint" aria-live="polite">
        {shot === 0 ? (
          <>
            <span className="only-mouse">Hover a print to see the photo it started as</span>
            <span className="only-touch">Tap a print to see the photo it started as</span>
          </>
        ) : (
          "New looks, same flash"
        )}
      </p>
      </div>
    </div>
  );
}
