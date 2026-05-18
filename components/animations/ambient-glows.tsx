"use client";

/**
 * AmbientGlows — drifting purple radial-gradient blobs behind the
 * post-cinematic content. Pure CSS keyframes (defined in globals.css)
 * for performance — no JS per-frame cost. Each blob has its own drift
 * path, breathe rate, and delay so the field never looks loop-locked.
 *
 * Pointer-events:none, aria-hidden, z-0 — purely decorative.
 *
 * Tuned for subtlety: max opacity ~0.16 (mix-blend screen on light,
 * lighten on dark). Long 24–52s periods. You should notice it only
 * if you stop and look — exactly the "subtle and professional" target.
 */

import * as React from "react";

type Blob = {
  /** % from left of container */
  x: number;
  /** % from top of container */
  y: number;
  /** Size in vmax */
  size: number;
  /** 0/1/2 — which drift path */
  drift: 0 | 1 | 2;
  /** Drift cycle seconds */
  driftDur: number;
  /** Breathe cycle seconds */
  breatheDur: number;
  /** Breathe start offset */
  delay: number;
  /** Min / max opacity */
  min: number;
  max: number;
  /** CSS variable name for the colour */
  color: string;
};

const BLOBS: Blob[] = [
  { x: 8,  y: 6,  size: 42, drift: 0, driftDur: 32, breatheDur: 24, delay: 0,   min: 0.06, max: 0.18, color: "var(--zeph-purple-500)" },
  { x: 78, y: 28, size: 36, drift: 1, driftDur: 38, breatheDur: 28, delay: -8,  min: 0.05, max: 0.15, color: "var(--zeph-purple-400)" },
  { x: 12, y: 64, size: 50, drift: 2, driftDur: 44, breatheDur: 33, delay: -14, min: 0.04, max: 0.14, color: "var(--zeph-purple-700)" },
  { x: 88, y: 78, size: 32, drift: 0, driftDur: 36, breatheDur: 26, delay: -4,  min: 0.05, max: 0.14, color: "var(--zeph-purple-300)" },
  { x: 50, y: 45, size: 60, drift: 1, driftDur: 52, breatheDur: 40, delay: -22, min: 0.03, max: 0.08, color: "var(--zeph-purple-500)" },
];

export function AmbientGlows({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`amb-field absolute inset-0 overflow-hidden pointer-events-none ${className ?? ""}`}
    >
      {BLOBS.map((b, i) => (
        <span
          key={i}
          className="amb-blob"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.size}vmax`,
            height: `${b.size}vmax`,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 65%)`,
            animation: `amb-drift-${b.drift} ${b.driftDur}s ease-in-out ${b.delay}s infinite, amb-breathe ${b.breatheDur}s ease-in-out ${b.delay}s infinite`,
            ["--amb-min" as string]: b.min,
            ["--amb-max" as string]: b.max,
          }}
        />
      ))}
    </div>
  );
}
