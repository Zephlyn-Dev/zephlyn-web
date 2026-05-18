"use client";

/**
 * Three-tier engagement section. Range-only pricing (Mintlify / Clay model)
 * — closes the "what does it cost?" question buyers ask before booking.
 *
 * Tiers are ENGAGEMENT stages, not feature comparisons:
 *   1. Audit — paid mapping engagement
 *   2. Pilot — first three workflows shipped
 *   3. Full — recurring automation partnership
 */

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Container, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Tier = {
  name: string;
  tagline: string;
  priceFrom: string;
  cadence: string;
  bullets: string[];
  cta: string;
  emphasised?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Audit",
    tagline: "Map what you have. Find what to automate first.",
    priceFrom: "Free",
    cadence: "30 minutes",
    bullets: [
      "Live walk-through of your current workflows",
      "We name the three highest-leverage automations",
      "You leave with a written plan — no commitment",
    ],
    cta: "Book the audit",
  },
  {
    name: "Pilot",
    tagline: "Three workflows shipped in three weeks.",
    priceFrom: "From $4.5k",
    cadence: "One-time",
    bullets: [
      "Build & deploy the three audit-approved workflows",
      "Lives inside your existing tools — ServiceTitan, Jobber, CRM",
      "30-day operational baseline before any subscription",
    ],
    cta: "Start a pilot",
    emphasised: true,
  },
  {
    name: "Operate",
    tagline: "Recurring automation partnership.",
    priceFrom: "From $2.4k",
    cadence: "per month",
    bullets: [
      "We maintain and tune the workflows we built",
      "New automations layered in as the shop grows",
      "Monthly report: hours saved, leads recovered, revenue caught",
    ],
    cta: "See operate scope",
  },
];

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 mt-0.5 text-primary"
      aria-hidden
    >
      <path d="M5 12.5l4.5 4.5L20 6.5" />
    </svg>
  );
}

export function PricingTiers() {
  const gridRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = gridRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          normal: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { reduce } = ctx.conditions as { reduce: boolean };

          const cards = root.querySelectorAll<HTMLElement>("[data-pricing-card]");
          if (!cards.length) return;

          // Always restore to visible — defensive against any cached scrub
          // state from a prior session/route.
          gsap.set(cards, { clearProps: "transform,opacity" });

          if (reduce) return;

          // Simple stagger fade-up — no scrub, no perspective. A toggleActions
          // trigger means the cards lock at their final state once they enter
          // the viewport and never get stuck mid-tween from a measurement glitch.
          gsap.fromTo(
            cards,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: root,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      );

      return () => mm.revert();
    },
    { scope: gridRef }
  );

  return (
    <Section id="pricing" className="border-t border-border">
      <Container>
        <p className="type-overline text-primary mb-4">What it costs</p>
        <h2 className="type-h2 text-foreground max-w-[24ch]">
          Three engagements. Pick one and stop here.
        </h2>
        <p className="type-body-lg text-muted-foreground mt-5 max-w-[60ch]">
          Every shop starts with a free audit. You only continue past it if
          we&apos;ve named work that&apos;s worth more than it costs.
        </p>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12"
          style={{ perspective: "1200px" }}
        >
          {TIERS.map((t) => (
            <article
              key={t.name}
              data-pricing-card
              data-pricing-card-featured={t.emphasised ? "" : undefined}
              className={cn(
                "shimmer-border relative rounded-2xl border p-7 flex flex-col gap-5",
                "transition-all duration-300 ease-out",
                t.emphasised
                  ? "border-primary/60 bg-card shadow-[0_0_0_1px_rgba(124,58,237,0.20),0_22px_48px_-18px_rgba(124,58,237,0.30)]"
                  : "border-border bg-card/85 hover:border-primary/40 hover:-translate-y-0.5"
              )}
            >
              {t.emphasised && (
                <span className="absolute -top-3 left-7 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-primary-foreground type-overline">
                  <span className="size-1.5 rounded-full bg-current" aria-hidden />
                  Most pilots start here
                </span>
              )}

              <header>
                <p className="type-overline text-primary">{t.name}</p>
                <h3 className="font-display font-semibold text-foreground mt-2 text-[22px] leading-[1.2] tracking-[-0.02em] max-w-[24ch]">
                  {t.tagline}
                </h3>
              </header>

              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-foreground text-[36px] leading-none tracking-[-0.025em]">
                  {t.priceFrom}
                </span>
                <span className="type-body-sm text-muted-foreground">
                  · {t.cadence}
                </span>
              </div>

              <ul className="flex flex-col gap-2.5">
                {t.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2.5 type-body-sm text-foreground/85"
                  >
                    <CheckIcon />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-2">
                <Button
                  type="button"
                  variant={t.emphasised ? "default" : "outline"}
                  className="w-full"
                >
                  {t.cta}
                </Button>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center type-body-sm text-muted-foreground">
          No contracts past 90 days. Cancel any month. We never charge per
          seat or per workflow.
        </p>
      </Container>
    </Section>
  );
}
