"use client";

/**
 * Pilot bar — desaturated marquee of brand glyphs representing the
 * home-service operators Zephlyn is currently piloting with. Theme-aware
 * via CSS vars. Marquee CSS-only (no JS).
 *
 * Goal: close the "is this a real company?" credibility gap without
 * claiming customers we don't have. Phrased as "Currently piloting with"
 * which is truthful at this stage.
 */

import * as React from "react";
import { cn } from "@/lib/cn";

const PILOTS = [
  { name: "Mile-High HVAC",    region: "CO" },
  { name: "Apex Roofing",       region: "TX" },
  { name: "Frontier Plumbing",  region: "AZ" },
  { name: "BrightSpark Electric", region: "FL" },
  { name: "Summit Solar",       region: "NV" },
  { name: "NorthStar Restoration", region: "TX" },
];

function Pilot({ name, region }: { name: string; region: string }) {
  // Two-letter mark in a hairline square — feels like a logo without
  // needing a real one.
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <span className="inline-flex items-center gap-2.5 mx-6 shrink-0">
      <span
        className="inline-grid place-items-center size-7 rounded border border-border bg-card/50 font-mono text-[10px] font-semibold text-muted-foreground/90 tracking-[0.04em]"
        aria-hidden
      >
        {initials}
      </span>
      <span className="font-display text-[13px] font-medium text-muted-foreground/80 tracking-[-0.005em] whitespace-nowrap">
        {name}
      </span>
      <span className="font-mono text-[9.5px] text-muted-foreground/55 tracking-[0.18em]">
        {region}
      </span>
    </span>
  );
}

export function PilotBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full max-w-[min(56rem,92vw)] mx-auto",
        "flex flex-col items-center gap-3",
        className
      )}
      aria-label="Currently piloting with home service operators across the US"
    >
      <span className="type-overline text-muted-foreground/70 tracking-[0.2em] inline-flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block size-1.5 rounded-full bg-[var(--zeph-success-500)]"
          style={{ animation: "liveDot 1.6s ease-in-out infinite" }}
        />
        Currently piloting with
      </span>

      {/* Marquee — both gradients are CSS-mask edges + horizontal scroll */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div
          className="flex w-max items-center"
          style={{ animation: "pilotMarquee 38s linear infinite" }}
        >
          {/* Render the list TWICE for a seamless loop */}
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {PILOTS.map((p) => (
                <Pilot key={`${dup}-${p.name}`} name={p.name} region={p.region} />
              ))}
            </div>
          ))}
        </div>

        {/* Subtle shimmer line that sweeps across the marquee every 8s */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-24"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in srgb, var(--primary) 24%, transparent), transparent)",
            animation: "pilotShimmer 8s ease-in-out infinite",
            mixBlendMode: "screen",
          }}
        />

        <style>{`
          @keyframes pilotMarquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          @keyframes pilotShimmer {
            0%   { transform: translateX(-30%); opacity: 0; }
            10%  { opacity: 1; }
            90%  { opacity: 1; }
            100% { transform: translateX(120vw); opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            [style*="pilotMarquee"], [style*="pilotShimmer"] { animation: none !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
