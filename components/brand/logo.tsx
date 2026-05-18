/**
 * Zephlyn — Logo / Mark / Wordmark
 *
 * One file, three primitives:
 *   <ZephlynMark />      — icon only (the Echo mark)
 *   <ZephlynWordmark />  — "Zephlyn" text only
 *   <ZephlynLogo />      — horizontal lockup (mark + wordmark), the default
 *
 * Color comes from currentColor (so it inherits from text-foreground,
 * text-primary, text-primary-foreground, etc.) — no hardcoded hex.
 * Only the center pulse uses `accent` so the brand glint stays purple
 * even when the rest of the mark goes mono.
 */

import * as React from "react";
import { cn } from "@/lib/cn";

type MarkProps = React.SVGProps<SVGSVGElement> & {
  /** Size in px. Square. */
  size?: number;
  /** Override the center hub color. Defaults to `var(--primary)`. */
  accent?: string;
  /** When true, render mark in pure currentColor (no accent). For mono prints. */
  mono?: boolean;
  /**
   * Thicker, higher-contrast variant — strokes are doubled and the top/
   * bottom rail opacity is dropped so the mark reads at small sizes and
   * against busy backgrounds (e.g. inside the boxed header tile).
   */
  bold?: boolean;
};

export function ZephlynMark({
  size = 32,
  accent,
  mono = false,
  bold = false,
  className,
  ...props
}: MarkProps) {
  const hubFill = mono ? "currentColor" : accent ?? "var(--primary)";
  const railWidth = bold ? 2.4 : 0.9;
  const railOpacity = bold ? 0.85 : 0.45;
  const waveWidth = bold ? 3.2 : 1.0;
  const dotR = bold ? 2.6 : 1.6;
  const hubOuterR = bold ? 7.5 : 6;
  const hubInnerR = bold ? 4.8 : 3.6;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label="Zephlyn"
      className={cn("inline-block shrink-0", className)}
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path
          d="M 16 32 C 30 32 36 32 50 32 C 64 32 70 32 84 32"
          strokeWidth={railWidth}
          opacity={railOpacity}
        />
        <path
          d="M 16 68 C 30 68 36 68 50 68 C 64 68 70 68 84 68"
          strokeWidth={railWidth}
          opacity={railOpacity}
        />
        <path
          d="M 14 50 C 26 36 38 64 50 50 C 62 36 74 64 86 50"
          strokeWidth={waveWidth}
        />
      </g>
      <g fill="currentColor">
        <circle cx="16" cy="32" r={dotR} />
        <circle cx="84" cy="32" r={dotR} />
        <circle cx="16" cy="68" r={dotR} />
        <circle cx="84" cy="68" r={dotR} />
      </g>
      <circle cx="50" cy="50" r={hubOuterR} fill={hubFill} opacity={bold ? 0.32 : 0.18} />
      <circle cx="50" cy="50" r={hubInnerR} fill={hubFill} />
    </svg>
  );
}

type WordmarkProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Pixel size of the wordmark. Default 28. */
  size?: number;
};

export function ZephlynWordmark({
  size = 28,
  className,
  ...props
}: WordmarkProps) {
  return (
    <span
      className={cn(
        "font-display font-bold leading-none tracking-[-0.035em]",
        className
      )}
      style={{ fontSize: size }}
      {...props}
    >
      Zephlyn
    </span>
  );
}

type LogoProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Pixel size of the mark. Wordmark scales to ~1.1×. Default 32. */
  size?: number;
  /** Hide the wordmark — useful for tight nav slots. */
  iconOnly?: boolean;
  /** Stack mark over wordmark instead of inline. */
  stacked?: boolean;
  /**
   * Render the mark inside a rounded purple tile (with the mark inverted to
   * primary-foreground). Increases legibility against busy backdrops and
   * gives the header a stronger anchor.
   */
  boxed?: boolean;
};

export function ZephlynLogo({
  size = 32,
  iconOnly = false,
  stacked = false,
  boxed = false,
  className,
  ...props
}: LogoProps) {
  const tileSize = Math.round(size * 1.5);
  const innerMarkSize = Math.round(size * 1.05);
  return (
    <div
      className={cn(
        "inline-flex items-center text-foreground",
        stacked ? "flex-col gap-3" : "flex-row gap-3",
        className
      )}
      role="img"
      aria-label="Zephlyn"
      {...props}
    >
      {boxed ? (
        <span
          aria-hidden
          className={cn(
            "inline-flex items-center justify-center shrink-0",
            "rounded-[12px] text-primary-foreground",
            "bg-gradient-to-br from-[var(--zeph-purple-500)] to-[var(--zeph-purple-700)]",
            "ring-1 ring-[var(--zeph-purple-300)]/30 ring-inset",
            "shadow-[0_6px_20px_-8px_var(--zeph-purple-500),inset_0_1px_0_0_rgba(255,255,255,0.18)]"
          )}
          style={{ width: tileSize, height: tileSize }}
        >
          <ZephlynMark size={innerMarkSize} mono bold />
        </span>
      ) : (
        <ZephlynMark size={size} />
      )}
      {!iconOnly && (
        <ZephlynWordmark
          size={Math.round(size * (boxed ? 1.1 : 1.05))}
        />
      )}
    </div>
  );
}
