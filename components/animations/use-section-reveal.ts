"use client";

/**
 * useSectionReveal — drop-in hook that animates the section's H2 headline
 * + body copy into view via SplitText line-mask reveal as the user scrolls
 * the section into the viewport.
 *
 *   const ref = useSectionReveal();
 *   <section ref={ref}>
 *     <h2 className="reveal-h2">…</h2>
 *     <p className="reveal-sub">…</p>
 *   </section>
 *
 * Honors `prefers-reduced-motion` — sets final state without animation.
 */

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

export function useSectionReveal<T extends HTMLElement = HTMLElement>() {
  const ref = React.useRef<T>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const headlines = root.querySelectorAll<HTMLElement>(".reveal-h2");
      const subs = root.querySelectorAll<HTMLElement>(".reveal-sub");
      if (!headlines.length && !subs.length) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          normal: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { reduce } = ctx.conditions as {
            reduce: boolean;
            normal: boolean;
          };

          if (reduce) {
            // Make sure nothing's hidden if motion is off — splits never run.
            gsap.set([headlines, subs], { opacity: 1, y: 0 });
            return;
          }

          // Each headline animates independently so the start/end is tied
          // to that headline's viewport position, not the whole section.
          headlines.forEach((h) => {
            SplitText.create(h, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              linesClass: "reveal-line",
              onSplit: (self) => {
                return gsap.from(self.lines, {
                  yPercent: 110,
                  duration: 0.85,
                  ease: "expo.out",
                  stagger: 0.06,
                  scrollTrigger: {
                    trigger: h,
                    start: "top 85%",
                    once: true,
                  },
                });
              },
            });
          });

          // Body copy / lead paragraphs — softer, plain y-translate.
          subs.forEach((s) => {
            gsap.from(s, {
              y: 20,
              opacity: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: s,
                start: "top 88%",
                once: true,
              },
            });
          });
        }
      );

      return () => mm.revert();
    },
    { scope: ref }
  );

  // Also refresh ScrollTrigger after late mount so the start position is
  // measured against the final layout.
  React.useEffect(() => {
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(id);
  }, []);

  return ref;
}
