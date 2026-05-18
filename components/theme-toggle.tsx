"use client";

/**
 * Theme toggle — 2-state sun/moon pill matching the design references.
 * Active state has a purple circle background, inactive is just the icon.
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

/**
 * Theme switch with View Transitions API — circular wipe expands from the
 * clicked button's coordinates (Chrome 2025 pattern, used by Vercel Ship 26
 * and Arc). Gracefully falls back to instant switch on unsupported browsers
 * and respects prefers-reduced-motion.
 */
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

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const options = [
    { value: "light", Icon: Sun, label: "Light" },
    { value: "dark", Icon: Moon, label: "Dark" },
  ] as const;
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card/60 p-1",
        className
      )}
    >
      {options.map(({ value, Icon, label }) => {
        const selected = (value === "dark" && isDark) || (value === "light" && !isDark);
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            onClick={(e) => {
              const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
              startThemeTransition(
                () => setTheme(value),
                { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
              );
            }}
            className={cn(
              "inline-flex items-center justify-center size-7 rounded-full",
              "transition-colors duration-150 ease-out",
              "focus-visible:outline-none focus-visible:shadow-focus",
              selected
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
