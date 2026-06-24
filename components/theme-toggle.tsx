"use client";

/**
 * Theme toggle — single pill switch with a sliding thumb over two visible
 * slots (sun · moon). Click anywhere on the track to toggle; click the
 * inactive slot to switch directly to that mode.
 *
 * Preserves the View Transitions circular-wipe (Chrome 2025 pattern) so the
 * theme swap stays cinematic. Falls back to an instant swap on browsers
 * without `startViewTransition` and on prefers-reduced-motion.
 */

import * as React from "react";
import { cn } from "@/lib/cn";
import { useTheme } from "./theme-provider";

function Sun(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
    </svg>
  );
}

function Moon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function startThemeTransition(
  apply: () => void,
  origin: { x: number; y: number }
) {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
  };
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!doc.startViewTransition || reduceMotion) {
    apply();
    return;
  }

  const transition = doc.startViewTransition(apply);
  const maxR = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y)
  );
  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${origin.x}px ${origin.y}px)`,
          `circle(${maxR}px at ${origin.x}px ${origin.y}px)`,
        ],
      },
      {
        duration: 520,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  });
}

const SLOT_PX = 28; // matches the size-7 thumb / icon slot

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const trackRef = React.useRef<HTMLButtonElement>(null);

  const toggle = React.useCallback(
    (next: "light" | "dark") => {
      const el = trackRef.current;
      if (!el) {
        setTheme(next);
        return;
      }
      const rect = el.getBoundingClientRect();
      // Origin the wipe over the slot we're moving toward, so the
      // transition reads as "expand outward from the destination."
      const x =
        next === "dark"
          ? rect.right - SLOT_PX / 2 - 4
          : rect.left + SLOT_PX / 2 + 4;
      const y = rect.top + rect.height / 2;
      startThemeTransition(() => setTheme(next), { x, y });
    },
    [setTheme]
  );

  return (
    <button
      ref={trackRef}
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => toggle(isDark ? "light" : "dark")}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          toggle(isDark ? "light" : "dark");
        }
      }}
      data-theme={isDark ? "dark" : "light"}
      className={cn(
        "relative inline-flex items-center rounded-full border border-border bg-card/60 p-1",
        "focus-visible:outline-none focus-visible:shadow-focus",
        "cursor-pointer select-none",
        className
      )}
    >
      {/* Thumb — slides between the two slots */}
      <span
        aria-hidden
        className={cn(
          "absolute top-1 size-7 rounded-full bg-primary",
          "transition-transform duration-150 ease-out",
          "motion-reduce:transition-none",
          isDark ? "translate-x-7" : "translate-x-0"
        )}
        style={{ left: "0.25rem" }}
      />
      {/* Sun slot */}
      <span
        aria-hidden
        className={cn(
          "relative z-10 inline-flex items-center justify-center size-7 rounded-full transition-colors duration-150",
          isDark ? "text-muted-foreground" : "text-primary-foreground"
        )}
      >
        <Sun />
      </span>
      {/* Moon slot */}
      <span
        aria-hidden
        className={cn(
          "relative z-10 inline-flex items-center justify-center size-7 rounded-full transition-colors duration-150",
          isDark ? "text-primary-foreground" : "text-muted-foreground"
        )}
      >
        <Moon />
      </span>
    </button>
  );
}
