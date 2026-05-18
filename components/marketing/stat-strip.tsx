"use client";

/**
 * Stat strip — three big numbers, scroll-bound. Numbers tick up as the
 * user scrolls past the section (not on enter), so the value feels
 * physically tied to their scroll wheel. Reduced-motion users get the
 * static final number.
 */

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Container, Section } from "@/components/ui/container";
import { cn } from "@/lib/cn";

type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  sub: string;
};

const STATS: Stat[] = [
  {
    prefix: "",
    value: 11,
    suffix: " sources",
    label: "Captured per shop",
    sub: "Google Ads, FB, Angi, voicemail, web, SMS, referrals — every channel reaches one queue.",
  },
  {
    prefix: "",
    value: 47,
    suffix: "%",
    label: "Faster first-touch",
    sub: "Average pilot reply time drops from 41 min to under 90 seconds.",
  },
  {
    prefix: "",
    value: 6,
    suffix: " hrs",
    label: "Saved per week, per dispatcher",
    sub: "Less retyping, fewer dropped leads, no spreadsheet babysitting.",
  },
];

export function StatStrip({ className }: { className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          normal: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { reduce } = ctx.conditions as { reduce: boolean };

          const numEls = root.querySelectorAll<HTMLElement>(
            "[data-stat-number]"
          );

          if (reduce) {
            numEls.forEach((el) => {
              const target = Number(el.dataset.statNumber ?? 0);
              el.textContent = `${target}`;
            });
            return;
          }

          numEls.forEach((el) => {
            const target = Number(el.dataset.statNumber ?? 0);
            const counter = { v: 0 };
            gsap.to(counter, {
              v: target,
              ease: "none",
              onUpdate: () => {
                el.textContent = `${Math.round(counter.v)}`;
              },
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                end: "top 35%",
                scrub: 0.6,
              },
            });

            // Subtle lift-in for the tile chrome (label + sub)
            const tile = el.closest("[data-stat-tile]");
            if (tile) {
              gsap.from(tile, {
                y: 30,
                opacity: 0,
                duration: 0.7,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: tile,
                  start: "top 88%",
                  once: true,
                },
              });
            }
          });
        }
      );

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref}>
      <Section
        className={cn(
          "border-t border-border bg-gradient-to-b from-background to-card/40",
          className
        )}
      >
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {STATS.map((s) => (
              <div
                key={s.label}
                data-stat-tile
                className="flex flex-col gap-3"
              >
                <div className="text-[64px] md:text-[72px] leading-none tracking-[-0.04em] text-foreground font-display font-semibold tabular-nums">
                  {s.prefix}
                  <span data-stat-number={s.value}>0</span>
                  {s.suffix}
                </div>
                <p className="type-overline text-primary">{s.label}</p>
                <p className="type-body-sm text-muted-foreground max-w-[40ch]">
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
