"use client";

/**
 * Mobile-only sticky CTA bar.
 *
 * Long-scroll landing pages on mobile lose conversion to the CTA being
 * 4 viewports up. The fix every high-converting marketing site uses now
 * (Linear, Cal.com, Vercel) is a persistent bottom bar that hides while
 * the user is in the hero (so it doesn't double up with the primary
 * CTA), then locks in as soon as they scroll past it.
 *
 * Hides on md+ — desktop already has the floating Cmd+K palette and
 * scene navigator.
 */

import * as React from "react";
import { cn } from "@/lib/cn";

export function MobileStickyCta() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    // Show once the user has scrolled past ~1 viewport — clear of the hero.
    let raf = 0;
    const update = () => {
      raf = 0;
      setShow(window.scrollY > window.innerHeight * 0.6);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={cn(
        "md:hidden fixed inset-x-3 bottom-3 z-40",
        "transition-all duration-300 ease-out",
        show
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 rounded-full",
          "border border-primary/30 bg-card/95 backdrop-blur-xl",
          "shadow-[0_18px_40px_-12px_rgba(0,0,0,0.18),0_4px_12px_-4px_rgba(0,0,0,0.10)]",
          "pl-4 pr-2 py-2"
        )}
      >
        <div className="flex flex-col min-w-0 flex-1">
          <span className="type-overline text-primary leading-none">
            Free · 30 min
          </span>
          <span className="type-body-sm text-foreground font-medium leading-tight truncate">
            3 workflows · lunch&apos;s on us
          </span>
        </div>
        <a
          href="#get-started"
          className={cn(
            "inline-flex items-center justify-center shrink-0",
            "px-4 h-10 rounded-full",
            "bg-primary text-primary-foreground type-body-sm font-semibold",
            "active:scale-[0.97] transition-transform duration-100"
          )}
        >
          Book audit
        </a>
      </div>
    </div>
  );
}
