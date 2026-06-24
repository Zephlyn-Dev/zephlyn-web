"use client";

/**
 * ScrollProgressBar — 2px gradient hairline fixed at the very top of
 * the viewport. Fills from 0 → 100% as the user scrolls the entire
 * document. Distinct from the cinematic's bottom progress bar — that
 * one only tracks the 360vh cinematic proxy.
 *
 * Width is mutated via direct DOM access, not React state, so the bar
 * never triggers a React render during scroll. Critical: during the
 * cinematic hero, this would otherwise reconcile on every scroll tick
 * alongside the WebGL canvas and starve it of frame budget.
 */

import * as React from "react";

export function ScrollProgressBar() {
  const barRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const p =
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      // Direct GPU-bound transform — no React, no layout read on this side.
      bar.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none"
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-[var(--zeph-purple-500)] via-[var(--primary)] to-[var(--zeph-purple-300)]"
        style={{
          transform: "scaleX(0)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
