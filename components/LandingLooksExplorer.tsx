"use client";

import { useEffect, useRef, useState } from "react";
import type { Look } from "@/lib/looks";
import { LOOKS, lookById } from "@/lib/looks";

type SubSectionConfig = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  lookIds: string[];
};

type MasterSectionConfig = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  subSections: SubSectionConfig[];
};

const MASTER_SECTIONS: MasterSectionConfig[] = [
  {
    id: "effects",
    emoji: "📸",
    title: "AI Effects",
    subtitle: "Re-shoot your selfie with vintage flash, golden hour beams, and nostalgic 2000s digicam lighting while preserving your pose.",
    subSections: [
      {
        id: "effects-golden-hour",
        emoji: "🌅",
        title: "Golden Hour & Glow",
        subtitle: "Warm daylight beams, sunset glow, and natural camera radiance.",
        lookIds: ["dreamlight", "sun-kissed", "adds-warm-cinematic-tones-and-soft-motio"],
      },
      {
        id: "effects-vintage-flash",
        emoji: "📸",
        title: "Vintage Digicam & Flash",
        subtitle: "Direct flash, punchy colors, and raw 2000s point-and-shoot analog grain.",
        lookIds: ["disposable-flash", "adds-warm-cinematic-tones-and-soft-motio", "retake"],
      },
      {
        id: "effects-retouch",
        emoji: "🪄",
        title: "Smart Retouch & Cleanup",
        subtitle: "Fix closed eyes and awkward poses, or erase background clutter.",
        lookIds: ["retake", "clear-scene", "dreamlight"],
      },
    ],
  },
  {
    id: "templates",
    emoji: "✨",
    title: "AI Templates",
    subtitle: "Transport your portrait into aesthetic night city streets, subway motion, and high-fashion editorial scenes.",
    subSections: [
      {
        id: "templates-night-out",
        emoji: "🌃",
        title: "Night Out & Urban Streets",
        subtitle: "Raw flash on dark city streets and cinematic subway motion energy.",
        lookIds: ["midnight-flash", "subway-motion", "subway-still", "soft-flash"],
      },
      {
        id: "templates-cozy-flash",
        emoji: "🕯️",
        title: "Warm & Cozy Moments",
        subtitle: "Warm, intimate indoor flash moments and dreamy portrait lighting.",
        lookIds: ["soft-flash", "cozy-flash", "midnight-flash"],
      },
      {
        id: "templates-photobooth",
        emoji: "🎞️",
        title: "Photo Booth & Creative Art",
        subtitle: "Black-and-white 4×4 booth grids and reimagined neon collages.",
        lookIds: ["face-roll", "neon-collage", "subway-motion"],
      },
    ],
  },
];

/**
 * Custom Visible Slider Control Bar.
 * Always renders a prominent, interactive track and colored thumb showing real-time scroll progress.
 */
function VisibleSliderBar({
  scrollRef,
  lookCount,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  lookCount: number;
}) {
  const [progress, setProgress] = useState(0);
  const [thumbRatio, setThumbRatio] = useState(0.4);

  const update = () => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setProgress(0);
      setThumbRatio(1);
      return;
    }
    const ratio = Math.max(0.2, Math.min(0.9, el.clientWidth / el.scrollWidth));
    setThumbRatio(ratio);
    setProgress(Math.max(0, Math.min(1, el.scrollLeft / maxScroll)));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [scrollRef]);

  const onTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: ratio * maxScroll, behavior: "smooth" });
  };

  return (
    <div className="visible-slider-bar-wrap">
      <div
        className="visible-slider-track"
        onClick={onTrackClick}
        role="scrollbar"
        aria-label="Horizontal scroll position"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
      >
        <div
          className="visible-slider-thumb"
          style={{
            left: `${progress * (100 - thumbRatio * 100)}%`,
            width: `${thumbRatio * 100}%`,
          }}
        />
      </div>

      <div className="visible-slider-meta">
        <span className="slider-hint">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          Slide or drag to explore
        </span>
        <span className="slider-count-badge">{lookCount} styles</span>
      </div>
    </div>
  );
}

/**
 * Single Sub-Section Horizontal Slider Row
 */
function SubSectionRow({
  sub,
  looks,
}: {
  sub: SubSectionConfig;
  looks: Look[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const distance = Math.min(scrollRef.current.clientWidth * 0.75, 560);
    scrollRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <div className="subsection-block" id={`sub-${sub.id}`}>
      {/* Sub-section Header */}
      <div className="subsection-header">
        <div className="subsection-header-info">
          <div className="subsection-title-row">
            <span className="subsection-emoji" aria-hidden="true">
              {sub.emoji}
            </span>
            <h4 className="subsection-title">{sub.title}</h4>
            <span className="subsection-count">{looks.length} styles</span>
          </div>
          <p className="subsection-subtitle">{sub.subtitle}</p>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="subsection-arrows">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="carousel-arrow carousel-arrow-prev"
            aria-label={`Scroll ${sub.title} left`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="carousel-arrow carousel-arrow-next"
            aria-label={`Scroll ${sub.title} right`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track Wrapper */}
      <div className="category-scroll-wrapper">
        <div
          className="category-scroll-track"
          ref={scrollRef}
          tabIndex={0}
          role="region"
          aria-label={`${sub.title} style cards`}
        >
          {looks.map((look) => {
            const isTemplate = look.kind === "template";
            return (
              <article key={`${sub.id}-${look.slug}`} className="style-card style-card-horizontal">
                {/* Photo Frame with hover flip */}
                <div className="style-photo-frame">
                  <a
                    href={`/ai-photo-generator/?look=${look.slug}`}
                    className="style-photo-link"
                    aria-label={`Select ${look.title} style and generate`}
                  >
                    <img
                      src={look.after}
                      alt={`${look.title} AI style`}
                      className="style-img style-img-after"
                      loading="lazy"
                    />
                    <img
                      src={look.before}
                      alt={`${look.title} original photo`}
                      className="style-img style-img-before"
                      loading="lazy"
                    />
                    <span className="style-hover-hint">Hover: original</span>
                  </a>

                  {/* Badges */}
                  <div className="style-badges">
                    {look.trending && <span className="style-badge badge-trend">★ Trending</span>}
                    <span className={`style-badge ${isTemplate ? "badge-template" : "badge-effect"}`}>
                      {isTemplate ? "Template" : "Effect"}
                    </span>
                  </div>
                </div>

                {/* Card Details & Action */}
                <div className="style-body">
                  <div className="style-header-row">
                    <h5 className="style-title">{look.title}</h5>
                  </div>
                  <p className="style-tagline">
                    {look.tagline || (isTemplate ? "Places your selfie in an aesthetic new scene." : "Re-shoots your photo with vintage flash lighting.")}
                  </p>

                  <a
                    href={`/ai-photo-generator/?look=${look.slug}`}
                    className="btn btn-store style-btn"
                  >
                    <span>Make Look</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Prominent Visible Slider Control Bar */}
      <VisibleSliderBar scrollRef={scrollRef} lookCount={looks.length} />
    </div>
  );
}

export default function LandingLooksExplorer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="landing-looks-explorer" id="looks-gallery">
      {/* Sticky Quick-Jump Navigation Bar */}
      <nav className="explorer-quickjump-bar" aria-label="Category navigation">
        <div className="explorer-quickjump-pills">
          {MASTER_SECTIONS.map((section) => (
            <div key={section.id} className="quickjump-group">
              <button
                type="button"
                className="quickjump-pill quickjump-pill-master"
                onClick={() => scrollTo(`section-${section.id}`)}
              >
                <span>{section.emoji}</span>
                <strong>{section.title}</strong>
              </button>
              {section.subSections.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  className="quickjump-pill quickjump-pill-sub"
                  onClick={() => scrollTo(`sub-${sub.id}`)}
                >
                  <span>{sub.emoji}</span>
                  <span>{sub.title}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </nav>

      {/* Master Sections: Effects First, Then Templates */}
      <div className="master-sections-stack">
        {MASTER_SECTIONS.map((section) => (
          <section
            key={section.id}
            id={`section-${section.id}`}
            className="master-section-card"
            aria-label={section.title}
          >
            {/* Master Section Header */}
            <div className="master-section-head">
              <div className="master-section-badge">
                <span>{section.emoji}</span>
                <span>{section.id === "effects" ? "Photo Enhancement" : "Full Scene Transport"}</span>
              </div>
              <h3 className="master-section-title">{section.title}</h3>
              <p className="master-section-subtitle">{section.subtitle}</p>
            </div>

            {/* Sub-Sections Stacked Vertically */}
            <div className="subsections-stack">
              {section.subSections.map((sub) => {
                const subLooks = sub.lookIds
                  .map(lookById)
                  .filter((l): l is Look => Boolean(l));

                return (
                  <SubSectionRow
                    key={sub.id}
                    sub={sub}
                    looks={subLooks}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
