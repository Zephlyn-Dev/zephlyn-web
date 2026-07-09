"use client";

/**
 * <LogoResolve> — the final-CTA brand payoff.
 *
 * One-shot, scroll-triggered draw-in that retells the page story in the mark
 * itself: the four corner dots pop in first (scattered), the rails and the
 * zephyr wave draw across to connect them (the same stroke-draw language as
 * the constellation edges), then the purple hub blooms with an overshoot and
 * a single glow flash (running). When the timeline finishes it hands off to
 * the gentle idle loop (globals.css §6.97) by adding `.zeph-mark--animated`.
 *
 * Deliberately NOT an infinite loop: perpetual motion this close to the
 * primary CTA competes with the button. One entrance, then quiet breathing.
 *
 * Reduced motion: no timeline; the mark renders complete and static.
 */

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ZephlynMark } from "@/components/brand/logo";

export function LogoResolve({
  size = 80,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const svg = root.querySelector("svg");
      if (!svg) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          normal: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { reduce } = ctx.conditions as { reduce: boolean };
          if (reduce) return; // complete, static mark

          const dots = gsap.utils.toArray<SVGCircleElement>(".zeph-dot", svg);
          const rails = gsap.utils.toArray<SVGPathElement>(".zeph-rail", svg);
          const wave = svg.querySelector<SVGPathElement>(".zeph-wave");
          const ring = svg.querySelector<SVGCircleElement>(".zeph-hub-ring");
          const core = svg.querySelector<SVGCircleElement>(".zeph-hub-core");
          if (!dots.length || !rails.length || !wave || !ring || !core) return;

          // The ring's resolved opacity differs by variant (bold vs regular);
          // read it back so the bloom lands exactly on the authored value.
          const ringOpacity = Number(ring.getAttribute("opacity") ?? 0.18);

          gsap.set(dots, { scale: 0, opacity: 0, transformOrigin: "center" });
          gsap.set([...rails, wave], { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.set([ring, core], { scale: 0, opacity: 0, transformOrigin: "center" });

          const tl = gsap.timeline({
            scrollTrigger: { trigger: root, start: "top 82%", once: true },
            onComplete: () => {
              // Release the inline filter so the idle loop owns the glow.
              gsap.set(svg, { clearProps: "filter" });
              svg.classList.add("zeph-mark--animated");
            },
          });

          tl.to(dots, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: "back.out(2.4)",
            stagger: 0.09,
          })
            .to(
              rails,
              { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut", stagger: 0.1 },
              "-=0.15"
            )
            .to(
              wave,
              { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" },
              "-=0.4"
            )
            .to(
              core,
              { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(3)" },
              "-=0.2"
            )
            .to(
              ring,
              { scale: 1, opacity: ringOpacity, duration: 0.5, ease: "back.out(2)" },
              "<0.05"
            )
            .fromTo(
              svg,
              { filter: "drop-shadow(0 0 0px rgba(124, 58, 237, 0))" },
              {
                filter: "drop-shadow(0 0 16px rgba(124, 58, 237, 0.5))",
                duration: 0.35,
                yoyo: true,
                repeat: 1,
                ease: "sine.inOut",
              },
              "<"
            );
        }
      );

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="inline-flex">
      <ZephlynMark size={size} bold className={className} />
    </div>
  );
}
