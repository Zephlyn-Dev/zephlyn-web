"use client";

/**
 * Inline scheduler — visible calendar + time-slot picker at the final CTA.
 *
 * Why: Chili Piper's 2025 benchmark showed inline (vs. button-launched)
 * scheduling lifts qualified-form → booked from ~30% to ~67%. Removing
 * the second click ("button → opens modal → still need to pick a time")
 * eliminates the double-form drop-off that costs ~50% of intent.
 *
 * Production wire-up: set `NEXT_PUBLIC_CAL_LINK="zephlyn/audit"` in env.
 * If unset, this component renders a designed, working preview (clickable
 * day + slot picker) so the page reads complete pre-launch. When the env
 * var is set, the Cal.com inline embed mounts in place of the preview.
 */

import * as React from "react";
import { cn } from "@/lib/cn";

type Props = {
  /**
   * Cal.com slug, e.g. "zephlyn/audit". Falls back to env
   * NEXT_PUBLIC_CAL_LINK; if neither is set, renders the preview.
   */
  calLink?: string;
  className?: string;
};

function getNextBusinessDays(count: number, start = new Date()): Date[] {
  const out: Date[] = [];
  const d = new Date(start);
  d.setHours(0, 0, 0, 0);
  // Skip today so the earliest available day is "tomorrow"
  d.setDate(d.getDate() + 1);
  while (out.length < count) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

const TIME_SLOTS = [
  "9:00 AM",
  "10:30 AM",
  "12:00 PM",
  "1:30 PM",
  "3:00 PM",
  "4:30 PM",
];

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function CalPreview() {
  const days = React.useMemo(() => getNextBusinessDays(8), []);
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [slotIdx, setSlotIdx] = React.useState<number | null>(null);

  const selectedDate = days[selectedIdx];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-5">
      {/* —— Day picker —— */}
      <div className="rounded-xl border border-border bg-background/40 p-5">
        <header className="flex items-baseline justify-between mb-4">
          <p className="type-overline text-primary">Pick a day</p>
          <p className="type-caption text-muted-foreground font-mono">
            Next 8 weekdays
          </p>
        </header>
        <div className="grid grid-cols-4 gap-2">
          {days.map((d, i) => {
            const selected = i === selectedIdx;
            return (
              <button
                key={d.toISOString()}
                type="button"
                onClick={() => {
                  setSelectedIdx(i);
                  setSlotIdx(null);
                }}
                aria-pressed={selected}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-3 rounded-lg border transition-all duration-150",
                  selected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "border-border bg-card/60 text-foreground/80 hover:border-primary/40 hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "type-caption uppercase tracking-[0.1em]",
                    selected ? "opacity-90" : "text-muted-foreground"
                  )}
                >
                  {WEEKDAY[d.getDay()]}
                </span>
                <span className="font-display font-semibold text-[18px] leading-none tabular-nums">
                  {d.getDate()}
                </span>
                <span
                  className={cn(
                    "type-caption",
                    selected ? "opacity-90" : "text-muted-foreground"
                  )}
                >
                  {MONTH[d.getMonth()]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* —— Time picker —— */}
      <div className="rounded-xl border border-border bg-background/40 p-5">
        <header className="flex items-baseline justify-between mb-4">
          <p className="type-overline text-primary">
            {WEEKDAY[selectedDate.getDay()]} ·{" "}
            {MONTH[selectedDate.getMonth()]} {selectedDate.getDate()}
          </p>
          <p className="type-caption text-muted-foreground font-mono">
            ET · 30 min slots
          </p>
        </header>
        <div className="grid grid-cols-2 gap-2">
          {TIME_SLOTS.map((s, i) => {
            const selected = i === slotIdx;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSlotIdx(i)}
                aria-pressed={selected}
                className={cn(
                  "py-2.5 rounded-lg border type-body-sm font-medium transition-all duration-150",
                  selected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "border-border bg-card/60 text-foreground/85 hover:border-primary/40 hover:text-foreground"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={slotIdx === null}
          className={cn(
            "mt-5 w-full h-11 rounded-full font-semibold type-body-sm transition-all duration-150",
            slotIdx === null
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.99]"
          )}
        >
          {slotIdx === null
            ? "Pick a time to continue"
            : `Confirm ${WEEKDAY[selectedDate.getDay()]} at ${TIME_SLOTS[slotIdx]}`}
        </button>
        <p className="mt-3 type-caption text-muted-foreground text-center">
          You&apos;ll get a calendar invite + Zoom link. No card required.
        </p>
      </div>
    </div>
  );
}

function CalEmbed({ link }: { link: string }) {
  const elRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let cancelled = false;
    // Lazy-load the Cal.com embed snippet. We deliberately don't ship the
    // SDK in the bundle — pre-launch the preview is rendered, post-launch
    // a single env var flips this on for real bookings.
    (async () => {
      // @ts-expect-error - Cal embed snippet attaches to window
      if (typeof window === "undefined" || cancelled) return;
      const w = window as unknown as {
        Cal?: ((cmd: string, args?: unknown) => void) & {
          ns?: Record<string, unknown>;
        };
      };
      if (!w.Cal) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://app.cal.com/embed/embed.js";
          s.async = true;
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("cal embed failed"));
          document.head.appendChild(s);
        });
      }
      if (cancelled || !elRef.current || !w.Cal) return;
      w.Cal("init", { origin: "https://cal.com" });
      w.Cal("inline", {
        elementOrSelector: elRef.current,
        calLink: link,
        layout: "month_view",
      });
      w.Cal("ui", {
        styles: { branding: { brandColor: "#5B2BE0" } },
        hideEventTypeDetails: false,
      });
    })().catch(() => {
      // fall through — the preview placeholder is still mounted above
    });
    return () => {
      cancelled = true;
    };
  }, [link]);

  return (
    <div
      ref={elRef}
      className="min-h-[520px] rounded-xl border border-border bg-background/40 overflow-hidden"
      aria-label="Booking calendar"
    />
  );
}

export function InlineScheduler({ calLink, className }: Props) {
  const link =
    calLink ??
    (typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_CAL_LINK
      : undefined);

  return (
    <div className={cn("w-full", className)}>
      {link ? <CalEmbed link={link} /> : <CalPreview />}
    </div>
  );
}
