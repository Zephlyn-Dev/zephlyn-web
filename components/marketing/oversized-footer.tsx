"use client";

/**
 * Oversized animated footer (Awwwards 2025 staple). Giant brand wordmark,
 * ambient gradient backdrop, time-of-day greeting, sitemap columns, and
 * a hairline meta row. Theme-aware.
 */

import * as React from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

function useGreeting() {
  const [greeting, setGreeting] = React.useState("Good day");
  React.useEffect(() => {
    const h = new Date().getHours();
    if (h < 5) setGreeting("Working late");
    else if (h < 12) setGreeting("Good morning");
    else if (h < 17) setGreeting("Good afternoon");
    else if (h < 22) setGreeting("Good evening");
    else setGreeting("Working late");
  }, []);
  return greeting;
}

const COLS: Array<{ heading: string; links: Array<{ label: string; href: string }> }> = [
  {
    heading: "Product",
    links: [
      { label: "What we automate", href: "#pillars" },
      { label: "Why Zephlyn",       href: "#why" },
      { label: "FAQ",               href: "#faq" },
    ],
  },
  {
    heading: "Verticals",
    links: [
      { label: "HVAC",              href: "#pillars" },
      { label: "Roofing",           href: "#pillars" },
      { label: "Plumbing",          href: "#pillars" },
      { label: "Electrical",        href: "#pillars" },
      { label: "Restoration",       href: "#pillars" },
      { label: "Solar",             href: "#pillars" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Get in touch",      href: "mailto:social@zephlyn.io" },
    ],
  },
];

export function OversizedFooter() {
  const greeting = useGreeting();

  return (
    <footer
      className={cn(
        "relative z-20 border-t border-border bg-background overflow-hidden",
        "pt-20 pb-10"
      )}
    >
      {/* Ambient purple radial — anchored to bottom-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 15% 100%, color-mix(in srgb, var(--primary) 18%, transparent), transparent 70%)",
        }}
      />

      <Container className="relative">
        {/* Top row — greeting + book audit */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-border/70">
          <div>
            <p className="type-overline text-primary mb-3">
              {greeting} — let&apos;s build it
            </p>
            <h2 className="font-display font-semibold tracking-[-0.025em] text-foreground text-[clamp(28px,4vw,44px)] leading-[1.05] max-w-[22ch]">
              Less admin. Faster jobs. Cleaner handoffs.
            </h2>
          </div>
          <a
            href="mailto:social@zephlyn.io"
            className="inline-flex items-center gap-2 self-start md:self-end font-mono text-[12px] uppercase tracking-[0.18em] text-foreground hover:text-primary transition-colors"
          >
            Get in touch
            <span aria-hidden>↗</span>
          </a>
        </div>

        {/* Sitemap columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 py-12">
          <div>
            <p className="type-overline text-muted-foreground/70 mb-4">Index</p>
            <ul className="flex flex-col gap-2.5 type-body-sm">
              <li>
                <a href="#" className="link-underline text-foreground hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#pillars" className="link-underline text-muted-foreground hover:text-foreground transition-colors">
                  Where we start
                </a>
              </li>
              <li>
                <a href="#why" className="link-underline text-muted-foreground hover:text-foreground transition-colors">
                  Why Zephlyn
                </a>
              </li>
            </ul>
          </div>

          {COLS.map((col) => (
            <div key={col.heading}>
              <p className="type-overline text-muted-foreground/70 mb-4">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-2.5 type-body-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="link-underline text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Giant wordmark — anchors the footer, fades up from bottom */}
        <div
          aria-hidden
          className="select-none pointer-events-none mt-4 mb-10 overflow-hidden"
        >
          <h2
            // clamp min dropped from 80 → 48 so the wordmark stays within
            // a 375px viewport. At ~60px (16vw of 375px) "Zephlyn." fits
            // comfortably; at desktop widths the 260px max still anchors
            // the footer.
            className={cn(
              "font-display font-bold tracking-[-0.06em]",
              "text-[clamp(48px,16vw,260px)] leading-[0.85]",
              "bg-clip-text text-transparent",
              "bg-gradient-to-b from-foreground/85 to-foreground/15"
            )}
          >
            Zephlyn.
          </h2>
        </div>

        {/* Hairline meta row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6 border-t border-border/70 type-caption font-mono text-muted-foreground/70 tracking-[0.04em]">
          <span>© 2026 Zephlyn · Productized automation for home service businesses.</span>
          <span className="flex items-center gap-3">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <span aria-hidden>·</span>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <span aria-hidden>·</span>
            <span>HVAC · Roofing · Plumbing · Electrical · Restoration · Solar</span>
          </span>
        </div>
      </Container>
    </footer>
  );
}
