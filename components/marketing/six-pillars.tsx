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

type PillarIconName = "workflow" | "calendar" | "form";

const PILLARS: Array<{
  n: string;
  title: string;
  body: string;
  icon: PillarIconName;
}> = [
  {
    n: "01",
    title: "Workflow design",
    body: "Map how work moves through the business. Find the bottlenecks between systems, people, and the next step.",
    icon: "workflow",
  },
  {
    n: "02",
    title: "Scheduling",
    body: "Booking, confirmations, reminders, dispatch coordination, and the internal handoffs that come with them.",
    icon: "calendar",
  },
  {
    n: "03",
    title: "Lead intake",
    body: "Routing inbound leads from websites, forms, ads, calls, and marketplaces so each one lands somewhere a person owns.",
    icon: "form",
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
  }
}

export function SixPillars() {
  const layout = PILLARS.map((p) => ({ ...p, span: 1 }));

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
            "(prefers-reduced-motion: no-preference) and (min-width: 768px) and (max-width: 1023px)",
          mobile:
            "(prefers-reduced-motion: no-preference) and (max-width: 767px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, tablet, mobile, reduce } = ctx.conditions as {
            desktop: boolean;
            tablet: boolean;
            mobile: boolean;
            reduce: boolean;
          };

          const cards = root.querySelectorAll<HTMLElement>("[data-pillar]");
          if (!cards.length) return;

          // Mobile + reduced-motion: skip the scroll-triggered fade entirely.
          // Cards rely on the GSAP `from` to interpolate opacity:0 → 1, which
          // can leave them invisible on mobile if ScrollTrigger fires before
          // layout settles (the bug visible in the original mobile screenshots).
          // On the static-landing path the page is short enough that a fade
          // adds nothing — keep the cards visible from first paint.
          if (reduce || mobile) {
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

          // —— Desktop: two-wave assembly ——
          // Switched from a scrubbed gsap.from() to an explicit fromTo
          // with toggleActions. Two reasons:
          //  1) The scrub variant could leave cards stuck mid-animation
          //     (opacity 0.25, rotated, scaled down) if ScrollTrigger
          //     measured the start/end before layout settled — a
          //     common race after we deferred GsapProvider's initial
          //     refresh past the boot screen.
          //  2) fromTo is explicit about both endpoints so even a
          //     refresh-race lands cards at their final visible state.
          gsap.fromTo(
            cards,
            { y: 70, scale: 0.78, opacity: 0, rotate: -3 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              rotate: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.1,
              clearProps: "transform",
              scrollTrigger: {
                trigger: root,
                start: "top 80%",
                toggleActions: "play none none none",
                invalidateOnRefresh: true,
              },
            }
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
          Where we start.
        </h2>
        <p className="type-body-lg text-muted-foreground mt-5 max-w-[64ch]">
          Three workflow families that show up in almost every shop we
          talk to. This is where we&apos;d look first.
        </p>

        <div
          ref={rootRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12"
        >
          {layout.map((p) => {
            return (
              <div
                key={p.n}
                data-pillar
                className={cn(
                  "group relative rounded-xl border border-border bg-card overflow-hidden",
                  "transition-all duration-300 ease-out",
                  "hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg",
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
                    "text-[32px] leading-none tracking-[-0.03em]"
                  )}
                >
                  <ScrambleNumber value={p.n} />
                </span>

                <div className="relative p-6">
                  <div
                    data-pillar-icon
                    className={cn(
                      "rounded-[10px] grid place-items-center bg-accent text-accent-foreground mb-4",
                      "transition-transform duration-300 group-hover:scale-110",
                      "size-10"
                    )}
                  >
                    <PillarIcon name={p.icon} />
                  </div>
                  <h3 className="font-display font-semibold text-foreground tracking-[-0.02em] text-[18px] leading-[1.25]">
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-[44ch] type-body-sm">
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
