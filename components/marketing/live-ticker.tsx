"use client";

/**
 * Live ticker pill: pulsing green dot + LIVE label + rotating message.
 * 6 messages cycle every 3.2s. Enter from translateY(8px) opacity:0,
 * exit to translateY(-8px) opacity:0. 380ms ease.
 */

import * as React from "react";
import { cn } from "@/lib/cn";

const MESSAGES = [
  "Mile-High HVAC · lead → estimate · 7 min ago",
  "Apex Roofing · storm damage form → site visit booked · 12 min ago",
  "Frontier Plumbing · voicemail → callback fired · 18 min ago",
  "BrightSpark Electric · job complete → review request sent · 22 min ago",
  "Summit Solar · past customer → maintenance scheduled · 29 min ago",
  "NorthStar HVAC · Google Ads lead → SMS reply in 47s · 34 min ago",
];

export function LiveTicker({ className }: { className?: string }) {
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % MESSAGES.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 px-4 py-2 rounded-full",
        "border border-white/10 bg-white/[0.03]",
        "font-mono text-[12px] tracking-wide",
        "min-h-9 overflow-hidden",
        className
      )}
      aria-live="polite"
    >
      <span
        className="inline-block size-2 rounded-full bg-[var(--zeph-success-500)] shrink-0"
        style={{ animation: "liveDot 1.6s ease-in-out infinite" }}
      />
      <span className="text-[var(--zeph-success-500)] tracking-[0.18em] shrink-0">
        LIVE
      </span>
      <span className="relative h-4 flex-1 min-w-0 overflow-hidden">
        <span
          key={idx}
          className="absolute inset-0 flex items-center text-paper/65 whitespace-nowrap"
          style={{ animation: "tickerSlot 380ms ease forwards" }}
        >
          {MESSAGES[idx]}
        </span>
      </span>

      <style>{`
        @keyframes tickerSlot {
          0%   { transform: translateY(8px);  opacity: 0; }
          15%  { transform: translateY(0);    opacity: 1; }
          85%  { transform: translateY(0);    opacity: 1; }
          100% { transform: translateY(-8px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
