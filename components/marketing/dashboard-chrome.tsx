"use client";

/**
 * Browser-style chrome wrapping the 2D overlay scenes. Theme-aware.
 */

import * as React from "react";
import { cn } from "@/lib/cn";

type Props = {
  pill: string;
  /** Optional right-side mono label. Omit to hide. */
  label?: string;
  /** Show the pulsing green dot next to the pill. Defaults to false — only enable for true real-time surfaces. */
  live?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function DashboardChrome({ pill, label, live = false, children, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border overflow-hidden",
        "shadow-lg dark:shadow-[0_0_0_1px_rgba(155,107,255,0.08),0_30px_60px_-20px_rgba(0,0,0,0.6)]",
        "bg-card",
        "backdrop-blur-xl",
        "w-[min(94vw,1180px)]",
        className
      )}
    >
      <header className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
        <div className="hidden sm:flex items-center gap-2 type-overline">
          {live && (
            <span
              className="size-1.5 rounded-full bg-[var(--zeph-success-500)]"
              style={{ animation: "liveDot 1.6s ease-in-out infinite" }}
            />
          )}
          <span className="text-foreground/80">{pill}</span>
        </div>
        {label && (
          <span className="type-overline text-muted-foreground font-mono">{label}</span>
        )}
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}
