"use client";

/**
 * Zephlyn — Theme toggle
 * Three-state segmented control: light · system · dark.
 * Keyboard accessible (arrow keys not required — just Tab + Enter/Space).
 */

import * as React from "react";
import { cn } from "@/lib/cn";
import { useTheme } from "./theme-provider";

function Sun(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
    </svg>
  );
}
function Moon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function Monitor(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const options = [
    { value: "light",  Icon: Sun,     label: "Light"  },
    { value: "system", Icon: Monitor, label: "System" },
    { value: "dark",   Icon: Moon,    label: "Dark"   },
  ] as const;
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card p-0.5",
        className
      )}
    >
      {options.map(({ value, Icon, label }) => {
        const selected = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            onClick={() => setTheme(value)}
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
