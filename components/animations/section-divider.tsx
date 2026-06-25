"use client";

/**
 * SectionDivider — a tiny purple SVG glyph that sits between marketing
 * sections and draws in via stroke-dashoffset the first time it enters
 * the viewport.
 *
 * Purpose: punctuate the post-cinematic flow so the long marketing
 * scroll doesn't read as a flat stack of text blocks. Each variant is
 * a different shape — wave, arrow, asterisk, zigzag, ticks — so
 * adjacent sections feel like they're transitioning rather than just
 * stacking.
 *
 * No GSAP, no ScrollTrigger, no per-frame work. One IntersectionObserver,
 * one CSS transition. The animation only ever fires once per mount.
 */

import * as React from "react";

type Variant = "wave" | "arrow" | "asterisk" | "zigzag" | "ticks" | "compass";

const GLYPHS: Record<
  Variant,
  { d: string; viewBox: string; width: number; height: number }
> = {
  wave: {
    d: "M 2 12 Q 18 2 34 12 T 66 12 T 98 12 T 130 12",
    viewBox: "0 0 132 24",
    width: 132,
    height: 24,
  },
  arrow: {
    d: "M 4 12 H 96 M 86 5 L 96 12 L 86 19",
    viewBox: "0 0 100 24",
    width: 100,
    height: 24,
  },
  asterisk: {
    d: "M 24 12 H 76 M 50 -12 V 36 M 32 -4 L 68 28 M 32 28 L 68 -4",
    viewBox: "0 0 100 24",
    width: 100,
    height: 24,
  },
  zigzag: {
    d: "M 2 18 L 18 6 L 34 18 L 50 6 L 66 18 L 82 6 L 98 18 L 114 6 L 130 18",
    viewBox: "0 0 132 24",
    width: 132,
    height: 24,
  },
  ticks: {
    d: "M 10 4 V 20 M 30 4 V 20 M 50 4 V 20 M 70 4 V 20 M 90 4 V 20 M 110 4 V 20",
    viewBox: "0 0 120 24",
    width: 120,
    height: 24,
  },
  compass: {
    d: "M 60 4 V 20 M 52 12 H 68 M 60 4 L 56 8 M 60 4 L 64 8 M 60 20 L 56 16 M 60 20 L 64 16 M 52 12 L 56 8 M 52 12 L 56 16 M 68 12 L 64 8 M 68 12 L 64 16",
    viewBox: "0 0 120 24",
    width: 120,
    height: 24,
  },
};

type Props = {
  variant?: Variant;
  className?: string;
};

export function SectionDivider({ variant = "wave", className = "" }: Props) {
  const pathRef = React.useRef<SVGPathElement>(null);

  React.useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const length = path.getTotalLength();
    if (reduce) {
      path.style.strokeDashoffset = "0";
      return;
    }
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    // Tiny lift on entry as well — the stroke draws AND the whole glyph
    // settles 6px up, which adds depth.
    path.style.transition =
      "stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)";

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            path.style.strokeDashoffset = "0";
            io.disconnect();
            return;
          }
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(path);
    return () => io.disconnect();
  }, []);

  const g = GLYPHS[variant];

  return (
    <div
      aria-hidden
      className={`section-divider flex justify-center py-10 md:py-14 ${className}`}
    >
      <svg
        width={g.width}
        height={g.height}
        viewBox={g.viewBox}
        fill="none"
        className="text-primary/45"
        style={{ overflow: "visible" }}
      >
        <path
          ref={pathRef}
          d={g.d}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
