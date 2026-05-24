"use client";

/**
 * SendOff — the closing flourish between FinalCta and OversizedFooter.
 *
 * Three giant brand lines, each split into characters and revealed via
 * SplitText with an `expo.out` curve. Lines stagger, the final line is
 * primary-coloured so it lands as the punctuation mark on the page.
 *
 * Triggered once when the section enters the viewport. No scrub, no
 * pin — a single one-shot timeline per line. Honors reduced-motion.
 */

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";

const LINES = [
  { text: "Less admin.",       tone: "fg"  as const },
  { text: "Faster jobs.",      tone: "fg"  as const },
  { text: "Cleaner handoffs.", tone: "pri" as const },
];

export function SendOff() {
  const ref = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const lines = root.querySelectorAll<HTMLElement>("[data-sendoff-line]");
      if (!lines.length) return;

      if (reduce) {
        gsap.set(lines, { opacity: 1, y: 0 });
        return;
      }

      lines.forEach((line, i) => {
        SplitText.create(line, {
          type: "chars",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 105,
              opacity: 0,
              duration: 1.05,
              ease: "expo.out",
              stagger: 0.022,
              delay: i * 0.15,
              scrollTrigger: {
                trigger: root,
                start: "top 75%",
                once: true,
              },
            }),
        });
      });

      // Eyebrow + dot — subtle entrance just before the type
      const eyebrow = root.querySelector<HTMLElement>("[data-sendoff-eyebrow]");
      if (eyebrow) {
        gsap.from(eyebrow, {
          opacity: 0,
          y: 12,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            once: true,
          },
        });
      }
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      aria-labelledby="sendoff-heading"
      className="relative py-32 md:py-48 border-t border-border overflow-hidden bg-background"
    >
      {/* Soft purple radial behind the type — anchors the eye and gives
          the closing line a pedestal. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 100%, color-mix(in srgb, var(--primary) 22%, transparent), transparent 65%)",
        }}
      />

      <div className="relative max-w-[1320px] mx-auto px-5 md:px-10 text-center">
        <p
          data-sendoff-eyebrow
          className="type-overline text-primary mb-10 inline-flex items-center gap-2 justify-center"
        >
          <span
            className="inline-block size-1.5 rounded-full bg-primary"
            style={{ animation: "liveDot 1.8s ease-in-out infinite" }}
          />
          From the Zephlyn team
        </p>

        <h2
          id="sendoff-heading"
          // clamp min lowered from 54 → 36 so "Cleaner handoffs." fits a
          // single 375px viewport line without breaking mid-word.
          // text-balance does the rest — modern browsers split before "handoffs"
          // rather than inside it.
          className="font-display font-bold tracking-[-0.045em] leading-[0.95] text-[clamp(36px,10vw,160px)] [text-wrap:balance] [word-break:keep-all] [hyphens:none]"
        >
          {LINES.map((ln) => (
            <span
              key={ln.text}
              data-sendoff-line
              className={`block ${ln.tone === "pri" ? "text-primary" : "text-foreground"}`}
            >
              {ln.text}
            </span>
          ))}
        </h2>

        <p className="type-body-lg text-foreground/85 max-w-[48ch] mx-auto mt-12">
          We help businesses simplify operations, save time, and grow
          through automation.
        </p>
        <p className="type-caption text-muted-foreground/80 max-w-[44ch] mx-auto mt-3 tracking-[0.04em]">
          Starting with HVAC, roofing, plumbing, electrical, restoration,
          and solar shops.
        </p>
      </div>
    </section>
  );
}
