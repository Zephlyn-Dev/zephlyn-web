/**
 * Single source of truth for GSAP — plugins are registered exactly once,
 * guarded for SSR. Everything else in the app imports from here so we
 * never accidentally double-register a plugin (which causes silent bugs
 * with ScrollTrigger pin start/end math).
 *
 * Public free plugins (post April 2024 GSAP-goes-free under Webflow):
 *   - ScrollTrigger (scroll-bound tweens, pin, scrub)
 *   - SplitText      (line/word/char splitting for headline reveals)
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  // Defensive: gsap.registerPlugin is idempotent but we still gate on window
  // so Next.js' build-time SSR pass never reaches the plugin internals.
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Default ease that matches Zephlyn's existing cinematic feel (the
  // smootherstep in scene-overlay). Sets the global so every tween
  // without an explicit ease uses this instead of the GSAP default "power1.out".
  gsap.defaults({ ease: "power3.out" });

  // Re-measure ScrollTrigger positions once web fonts have loaded —
  // otherwise the first paint uses fallback fonts and the start/end
  // markers land a few px off, which compounds in pinned sections.
  //
  // Critically: defer the refresh to an idle frame. If a user is mid-
  // scroll (very common during the hero cinematic) when the fonts
  // resolve, calling refresh() directly re-measures every trigger
  // synchronously and stutters the active scroll. requestIdleCallback
  // waits for a quiet frame.
  if (typeof document !== "undefined" && "fonts" in document) {
    document.fonts.ready.then(() => {
      const schedule =
        (window as unknown as {
          requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        }).requestIdleCallback;
      if (schedule) {
        schedule(() => ScrollTrigger.refresh(), { timeout: 1500 });
      } else {
        setTimeout(() => ScrollTrigger.refresh(), 250);
      }
    });
  }
}

export { gsap, ScrollTrigger, SplitText };
