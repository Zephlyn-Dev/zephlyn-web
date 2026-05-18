"use client";

/**
 * Six pillars bento — flagship section showing the 6 categories of work
 * Zephlyn automates. Layout: 2 flagship-wide tiles + 4 supporting tiles.
 *
 * Scroll animation (signature moment): the cards assemble. On scroll-in
 * they tween from a tight clustered state (scale 0.6, opacity 0.3, y
 * offset, rotation) into their final bento positions in two waves.
 * The mega-numbers, icons, and copy stagger in after each card lands.
 * Disabled on mobile (`gsap.matchMedia` 768px branch) and reduced-motion.
 */

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Container, Section } from "@/components/ui/container";
import { cn } from "@/lib/cn";

/**
 * Briefly scrambles a number on hover (think old terminal / data-loading
 * effect). Scramble runs ~360ms cycling through random digits, then
 * resettles on the original. Subtle "alive" feel. Listens to the
 * NEAREST `.group` element so it triggers off the whole card.
 */
function ScrambleNumber({ value }: { value: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const original = React.useRef(value);

  React.useEffect(() => {
    original.current = value;
  }, [value]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const card = el.closest(".group") as HTMLElement | null;
    if (!card) return;

    let raf = 0;
    let stop = false;

    const scramble = () => {
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      stop = false;
      const start = performance.now();
      const duration = 360;
      const len = original.current.length;
      const step = (now: number) => {
        if (stop) {
          el.textContent = original.current;
          return;
        }
        const t = Math.min(1, (now - start) / duration);
        let out = "";
        for (let i = 0; i < len; i++) {
          if (t > i / len + 0.4 / len) {
            out += original.current[i];
          } else {
            out += Math.floor(Math.random() * 10).toString();
          }
        }
        el.textContent = out;
        if (t < 1) raf = requestAnimationFrame(step);
        else el.textContent = original.current;
      };
      raf = requestAnimationFrame(step);
    };
    const reset = () => {
      stop = true;
      if (raf) cancelAnimationFrame(raf);
      el.textContent = original.current;
    };

    card.addEventListener("pointerenter", scramble);
    card.addEventListener("pointerleave", reset);
    return () => {
      stop = true;
      if (raf) cancelAnimationFrame(raf);
      card.removeEventListener("pointerenter", scramble);
      card.removeEventListener("pointerleave", reset);
    };
  }, []);

  return <span ref={ref}>{value}</span>;
}

type PillarIconName =
  | "workflow"
  | "calendar"
  | "form"
  | "shield"
  | "boxes"
  | "megaphone";

const PILLARS: Array<{
  n: string;
  title: string;
  body: string;
  icon: PillarIconName;
}> = [
  {
    n: "01",
    title: "Workflow design",
    body: "Map how work moves through the business. Remove the bottlenecks between systems, people, and the next step.",
    icon: "workflow",
  },
  {
    n: "02",
    title: "Scheduling",
    body: "Booking, confirmations, reminders, dispatch coordination, internal scheduling handoffs — automated end-to-end.",
    icon: "calendar",
  },
  {
    n: "03",
    title: "Form submission",
    body: "Streamline intake from websites, forms, ads, and lead sources so the right info reaches the right system fast.",
    icon: "form",
  },
  {
    n: "04",
    title: "Data integrity",
    body: "Cut duplicate records, broken handoffs, missing fields, and stale updates across CRMs and ops tools.",
    icon: "shield",
  },
  {
    n: "05",
    title: "Inventory tracking",
    body: "Keep equipment, materials, and job-related stock visible across workflows — before the morning rush.",
    icon: "boxes",
  },
  {
    n: "06",
    title: "Marketing automation",
    body: "Follow-up sequences, campaign workflows, retargeting support, review requests, repetitive marketing tasks.",
    icon: "megaphone",
  },
];

function PillarIcon({ name }: { name: PillarIconName }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "workflow":
      return (
        <svg {...common}>
          <circle cx="5" cy="6" r="2" />
          <circle cx="5" cy="18" r="2" />
          <circle cx="19" cy="12" r="2" />
          <path d="M7 6h6a4 4 0 0 1 4 4v.5M7 18h6a4 4 0 0 0 4-4v-.5" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15" rx="2" />
          <path d="M3.5 10h17M8 3.5v3M16 3.5v3" />
        </svg>
      );
    case "form":
      return (
        <svg {...common}>
          <rect x="5" y="3.5" width="14" height="17" rx="2" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3.5l7 2.5v5.5c0 4-3 7.5-7 8.5-4-1-7-4.5-7-8.5V6l7-2.5z" />
          <path d="M9 12l2.2 2.2L15 10.5" />
        </svg>
      );
    case "boxes":
      return (
        <svg {...common}>
          <rect x="3.5" y="11" width="7" height="9" rx="1" />
          <rect x="13.5" y="11" width="7" height="9" rx="1" />
          <rect x="8.5" y="3.5" width="7" height="7.5" rx="1" />
        </svg>
      );
    case "megaphone":
      return (
        <svg {...common}>
          <path d="M4 10v4l11 5V5L4 10z" />
          <path d="M15 9a3 3 0 0 1 0 6" />
        </svg>
      );
  }
}

export function SixPillars() {
  const layout = [
    { ...PILLARS[0], span: 2 },
    { ...PILLARS[1], span: 1 },
    { ...PILLARS[2], span: 1 },
    { ...PILLARS[3], span: 1 },
    { ...PILLARS[4], span: 1 },
    { ...PILLARS[5], span: 2 },
  ];

  const rootRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop:
            "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
          tablet:
            "(prefers-reduced-motion: no-preference) and (max-width: 1023px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, tablet, reduce } = ctx.conditions as {
            desktop: boolean;
            tablet: boolean;
            reduce: boolean;
          };

          const cards = root.querySelectorAll<HTMLElement>("[data-pillar]");
          if (!cards.length) return;

          if (reduce) {
            gsap.set(cards, { opacity: 1, scale: 1, y: 0, rotate: 0 });
            return;
          }

          if (tablet) {
            // Simple staggered fade — no pin on smaller screens to keep
            // scroll snappy and avoid the bento jitter that 3-col → 1-col
            // reflow can cause.
            gsap.from(cards, {
              y: 40,
              opacity: 0,
              scale: 0.96,
              duration: 0.65,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: root,
                start: "top 75%",
                once: true,
              },
            });
            return;
          }

          if (!desktop) return;

          // —— Desktop: pin + scrubbed assembly ——
          // Two waves: top row (0-3) lands first, bottom row (3-5) lands
          // second. Each card scales from 0.65 → 1, opacity 0.25 → 1,
          // y 60 → 0, with a slight rotation.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top 70%",
              end: "+=600",
              scrub: 0.6,
            },
          });

          tl.from(
            Array.from(cards).slice(0, 3),
            {
              y: 70,
              scale: 0.7,
              opacity: 0.25,
              rotate: -3,
              ease: "power3.out",
              stagger: 0.08,
            },
            0
          ).from(
            Array.from(cards).slice(3),
            {
              y: 70,
              scale: 0.7,
              opacity: 0.25,
              rotate: 3,
              ease: "power3.out",
              stagger: 0.08,
            },
            0.25
          );

          // Mega-number + icon micro-pop as each card lands
          cards.forEach((card) => {
            const num = card.querySelector("[data-pillar-num]");
            const icon = card.querySelector("[data-pillar-icon]");
            if (num) {
              gsap.from(num, {
                scale: 0.5,
                opacity: 0,
                duration: 0.6,
                ease: "back.out(2)",
                scrollTrigger: {
                  trigger: card,
                  start: "top 75%",
                  once: true,
                },
              });
            }
            if (icon) {
              gsap.from(icon, {
                rotate: -25,
                scale: 0.6,
                opacity: 0,
                duration: 0.55,
                ease: "back.out(1.8)",
                scrollTrigger: {
                  trigger: card,
                  start: "top 80%",
                  once: true,
                },
              });
            }
          });
        }
      );

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <Section id="pillars" className="border-t border-border">
      <Container>
        <p className="type-overline text-primary mb-4">What we automate</p>
        <h2 className="type-h2 text-foreground max-w-[22ch]">
          Six pillars. One quietly running shop.
        </h2>
        <p className="type-body-lg text-muted-foreground mt-5 max-w-[64ch]">
          Every workflow we build slots into one of these six. Pick the
          three that hurt most today — that&apos;s where the pilot starts.
        </p>

        <div
          ref={rootRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12"
        >
          {layout.map((p) => {
            const wide = p.span === 2;
            return (
              <div
                key={p.n}
                data-pillar
                className={cn(
                  "group relative rounded-xl border border-border bg-card overflow-hidden",
                  "transition-all duration-300 ease-out",
                  "hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg",
                  wide ? "lg:col-span-2" : "lg:col-span-1",
                  "before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500",
                  "before:bg-[radial-gradient(circle_at_var(--mx,50%)_var(--my,50%),rgba(124,58,237,0.10),transparent_60%)]",
                  "hover:before:opacity-100"
                )}
              >
                <span
                  data-pillar-num
                  className={cn(
                    "absolute top-4 right-5 font-mono tabular-nums",
                    "text-muted-foreground/35 group-hover:text-primary/55 transition-colors",
                    wide
                      ? "text-[44px] leading-none tracking-[-0.03em]"
                      : "text-[32px] leading-none tracking-[-0.03em]"
                  )}
                >
                  <ScrambleNumber value={p.n} />
                </span>

                <div className={cn("relative", wide ? "p-7" : "p-6")}>
                  <div
                    data-pillar-icon
                    className={cn(
                      "rounded-[10px] grid place-items-center bg-accent text-accent-foreground mb-4",
                      "transition-transform duration-300 group-hover:scale-110",
                      wide ? "size-12" : "size-10"
                    )}
                  >
                    <PillarIcon name={p.icon} />
                  </div>
                  <h3
                    className={cn(
                      "font-display font-semibold text-foreground tracking-[-0.02em]",
                      wide ? "text-[22px] leading-[1.2]" : "text-[18px] leading-[1.25]"
                    )}
                  >
                    {p.title}
                  </h3>
                  <p
                    className={cn(
                      "text-muted-foreground mt-2 max-w-[44ch]",
                      wide ? "type-body" : "type-body-sm"
                    )}
                  >
                    {p.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
