"use client";

/**
 * GsapProvider — single mount point that performs ScrollTrigger
 * housekeeping every other component depends on. Mount once near the
 * root of the App tree.
 *
 *   - Re-measures triggers on window resize (debounced).
 *   - Re-measures triggers after late image hydration.
 *   - No-ops when prefers-reduced-motion is on (the matchMedia branches
 *     inside individual components handle the actual disabling).
 */

import * as React from "react";
import { ScrollTrigger } from "@/lib/gsap";

export function GsapProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    let raf = 0;
    let resizeT: number | null = null;

    const refresh = () => {
      // batch all reflows into a single rAF — avoids running a costly
      // refresh on every resize/scroll-restoration tick during e.g. mobile
      // keyboard open/close.
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    const onResize = () => {
      if (resizeT) window.clearTimeout(resizeT);
      // 220ms — long enough to survive a window-resize drag without
      // re-measuring every trigger 30 times on the way.
      resizeT = window.setTimeout(refresh, 220) as unknown as number;
    };

    // Late-loading images can shift layout downstream of pinned sections,
    // but during the hero cinematic the boot screen + many images all
    // resolve in the first ~1.5s and previously caused a refresh storm
    // exactly when the WebGL canvas was initializing. Batch all of them
    // into a single refresh once the burst settles.
    const onImgLoad = () => refresh();
    document.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", onImgLoad, { once: true });
    });

    window.addEventListener("resize", onResize);
    // Push initial refresh past the boot screen's dismissal window so
    // it doesn't fight the hero cinematic's first paint.
    const tid = window.setTimeout(refresh, 900);

    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeT) window.clearTimeout(resizeT);
      window.clearTimeout(tid);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <>{children}</>;
}
