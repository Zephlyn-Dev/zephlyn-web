"use client";

/**
 * <RevealOnScroll>
 *   <SixPillars />
 * </RevealOnScroll>
 *
 * Drop-in client wrapper. Automatically discovers the first <h2> inside
 * and animates it via SplitText line-mask reveal on scroll-in. Animates
 * the leading paragraph (type-body-lg or type-body) too.
 *
 * Why this shape: lets the inner section stay a server component so we
 * don't bloat each marketing section with a 'use client' boundary.
 * Honors prefers-reduced-motion via gsap.matchMedia.
 */

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function RevealOnScroll({ children, className }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const headline = root.querySelector<HTMLElement>("h2");
      // First leading paragraph after the headline — typically the lead
      // copy. We deliberately do NOT animate every <p> on the page;
      // doing that turns into noise.
      const sub = headline
        ? (headline.parentElement?.querySelector<HTMLElement>(
            "p.type-body-lg, p.type-body"
          ) ?? null)
        : null;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          normal: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { reduce } = ctx.conditions as { reduce: boolean };
          if (reduce) return;

          if (headline) {
            SplitText.create(headline, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              linesClass: "reveal-line",
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 110,
                  duration: 0.9,
                  ease: "expo.out",
                  stagger: 0.07,
                  scrollTrigger: {
                    trigger: headline,
                    start: "top 85%",
                    once: true,
                  },
                }),
            });
          }

          if (sub) {
            gsap.from(sub, {
              y: 22,
              opacity: 0,
              duration: 0.75,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sub,
                start: "top 88%",
                once: true,
              },
            });
          }
        }
      );

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
