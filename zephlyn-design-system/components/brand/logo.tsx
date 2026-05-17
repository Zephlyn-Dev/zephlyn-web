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
};

export function ZephlynMark({
  size = 32,
  accent,
  mono = false,
  className,
  ...props
}: MarkProps) {
  const hubFill = mono ? "currentColor" : accent ?? "var(--primary)";
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
          strokeWidth="0.9"
          opacity="0.45"
        />
        <path
          d="M 16 68 C 30 68 36 68 50 68 C 64 68 70 68 84 68"
          strokeWidth="0.9"
          opacity="0.45"
        />
        <path
          d="M 14 50 C 26 36 38 64 50 50 C 62 36 74 64 86 50"
          strokeWidth="1.0"
        />
      </g>
      <g fill="currentColor">
        <circle cx="16" cy="32" r="1.6" />
        <circle cx="84" cy="32" r="1.6" />
        <circle cx="16" cy="68" r="1.6" />
        <circle cx="84" cy="68" r="1.6" />
      </g>
      <circle cx="50" cy="50" r="6" fill={hubFill} opacity="0.18" />
      <circle cx="50" cy="50" r="3.6" fill={hubFill} />
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
};

export function ZephlynLogo({
  size = 32,
  iconOnly = false,
  stacked = false,
  className,
  ...props
}: LogoProps) {
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
      <ZephlynMark size={size} />
      {!iconOnly && <ZephlynWordmark size={Math.round(size * 1.05)} />}
    </div>
  );
}
