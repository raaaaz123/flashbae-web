import type { CSSProperties } from "react";

/**
 * Die-cut stickers (white outline, soft shadow) that float around the edges of a section.
 * Pure decoration: hidden from screen readers, never in the way of a tap, and still when the
 * viewer asks for reduced motion.
 */
export type StickerKind = "heart" | "sparkle" | "star" | "flower" | "crown" | "bolt";

const FILL: Record<StickerKind, string> = {
  heart: "var(--cherry)",
  sparkle: "var(--butter)",
  star: "var(--lilac-deep)",
  flower: "var(--strawberry)",
  crown: "var(--butter)",
  bolt: "var(--cherry)",
};

function Shape({ kind, fill }: { kind: StickerKind; fill: string }) {
  const outline = { fill, stroke: "#fff", strokeWidth: 5, strokeLinejoin: "round" as const, paintOrder: "stroke" as const };
  switch (kind) {
    case "heart":
      return <path {...outline} d="M24 41s-15-9.2-15-20.3C9 15 13 11 18 11c3 0 5 1.6 6 4 1-2.4 3-4 6-4 5 0 9 4 9 9.7C39 31.8 24 41 24 41z" />;
    case "sparkle":
      return <path {...outline} d="M24 4c1.6 9.4 4.6 14.4 16 20-11.4 5.6-14.4 10.6-16 20-1.6-9.4-4.6-14.4-16-20 11.4-5.6 14.4-10.6 16-20z" />;
    case "star":
      return <path {...outline} d="M24 6l5.4 11.6 12.7 1.5-9.4 8.7 2.5 12.6L24 34.1l-11.2 6.3 2.5-12.6-9.4-8.7 12.7-1.5z" />;
    case "crown":
      return <path {...outline} d="M8 36 6 15l10 8 8-13 8 13 10-8-2 21z" />;
    case "bolt":
      return <path {...outline} d="M27 4 10 27h11l-3 17 19-25H26z" />;
    case "flower":
      return (
        <g>
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={24 + 9.5 * Math.cos(((a - 90) * Math.PI) / 180)} cy={24 + 9.5 * Math.sin(((a - 90) * Math.PI) / 180)}
                    r="8" {...outline} />
          ))}
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={`f${a}`} cx={24 + 9.5 * Math.cos(((a - 90) * Math.PI) / 180)} cy={24 + 9.5 * Math.sin(((a - 90) * Math.PI) / 180)}
                    r="8" fill={fill} />
          ))}
          <circle cx="24" cy="24" r="6" fill="var(--butter)" />
        </g>
      );
  }
}

export default function Sticker({
  kind, size = 44, style, className = "", delay = 0, spin = 0,
}: { kind: StickerKind; size?: number; style?: CSSProperties; className?: string; delay?: number; spin?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={`sticker ${className}`}
      style={{ ...style, ["--delay" as string]: `${delay}s`, ["--spin" as string]: `${spin}deg` }}
    >
      <Shape kind={kind} fill={FILL[kind]} />
    </svg>
  );
}
