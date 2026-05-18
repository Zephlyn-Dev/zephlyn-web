"use client";

/**
 * "Zephlyn vs. the alternatives" comparison matrix.
 *
 * The reader's actual decision is rarely "Zephlyn vs another automation
 * agency." It's "Zephlyn vs. hire a VA · DIY in Zapier · keep doing
 * nothing." This table puts those four side-by-side so a $32k year-1
 * spend reads as rational.
 *
 * Scroll animation: rows cascade in (y:30 opacity:0 → 0). After the
 * row cascade, the Zephlyn-column green checks pop in via scale:0→1
 * with back.out(2) — competitor red Xs revealed first, Zephlyn wins
 * last visually for the punchline.
 */

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Container, Section } from "@/components/ui/container";
import { cn } from "@/lib/cn";

type Cell = {
  label: string;
  tone: "good" | "ok" | "bad";
};

type Row = {
  question: string;
  cells: [Cell, Cell, Cell, Cell]; // [Zephlyn, VA, DIY Zapier, Nothing]
};

const COLUMNS = ["Zephlyn", "Hire a VA", "DIY Zapier / Make", "Do nothing"] as const;

const ROWS: Row[] = [
  {
    question: "Setup time",
    cells: [
      { label: "Live in 3 weeks",            tone: "good" },
      { label: "2-4 weeks hiring + onboarding", tone: "ok"   },
      { label: "Nights & weekends, ongoing",  tone: "bad"  },
      { label: "Instant — nothing changes",   tone: "bad"  },
    ],
  },
  {
    question: "Year-1 cost",
    cells: [
      { label: "~$33k (pilot + 11 mo operate)", tone: "ok"   },
      { label: "~$48k salary + benefits + tools", tone: "bad"  },
      { label: "~$6k tooling + your time × 80h", tone: "ok"   },
      { label: "Looks free — quietly leaks $$$", tone: "bad"  },
    ],
  },
  {
    question: "Recovers dropped leads automatically",
    cells: [
      { label: "Yes — that's the core workflow", tone: "good" },
      { label: "Only if they catch it in time",  tone: "ok"   },
      { label: "Yes, if you wire it right",      tone: "ok"   },
      { label: "No",                              tone: "bad"  },
    ],
  },
  {
    question: "Works inside ServiceTitan / Jobber / HCP",
    cells: [
      { label: "Native — we build on your stack", tone: "good" },
      { label: "Copy-paste between tabs",         tone: "bad"  },
      { label: "Possible — fragile",              tone: "ok"   },
      { label: "—",                                tone: "bad"  },
    ],
  },
  {
    question: "Who fixes it when something breaks",
    cells: [
      { label: "We do — on retainer",            tone: "good" },
      { label: "Re-train or re-hire",            tone: "bad"  },
      { label: "You. At 11pm.",                  tone: "bad"  },
      { label: "—",                               tone: "bad"  },
    ],
  },
  {
    question: "Scales with new lead sources",
    cells: [
      { label: "Yes — we add nodes monthly",     tone: "good" },
      { label: "Slow — head-count problem",      tone: "bad"  },
      { label: "More Zaps, more breakage",       tone: "ok"   },
      { label: "Volume just stays missed",       tone: "bad"  },
    ],
  },
];

function ToneIcon({ tone }: { tone: Cell["tone"] }) {
  if (tone === "good") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 mt-0.5 text-[var(--zeph-success-500)]"
        aria-hidden
      >
        <path d="M5 12.5l4.5 4.5L20 6.5" />
      </svg>
    );
  }
  if (tone === "bad") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 mt-0.5 text-[var(--zeph-danger-500)]"
        aria-hidden
      >
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    );
  }
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 mt-0.5 text-[var(--zeph-warning-500)]"
      aria-hidden
    >
      <path d="M5 12h14" />
    </svg>
  );
}

export function ComparisonMatrix() {
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
          if (reduce) return;

          const rows = root.querySelectorAll<HTMLElement>("[data-cmp-row]");
          if (!rows.length) return;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top 75%",
              once: true,
            },
          });

          // Rows cascade in
          tl.from(rows, {
            y: 30,
            opacity: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: "power3.out",
          });

          // The punchline: Zephlyn-column checks pop *last* with a satisfying
          // back.out — competitor red Xs are already visible by the time
          // green checks land.
          const zephCells = root.querySelectorAll<HTMLElement>(
            "[data-cmp-cell-zephlyn] svg"
          );
          tl.from(
            zephCells,
            {
              scale: 0,
              opacity: 0,
              transformOrigin: "center",
              duration: 0.5,
              stagger: 0.07,
              ease: "back.out(2)",
            },
            "-=0.2"
          );
        }
      );

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Section id="compare" className="border-t border-border">
      <Container>
        <p className="type-overline text-primary mb-4">Vs. the alternatives</p>
        <h2 className="type-h2 text-foreground max-w-[26ch]">
          You&apos;re not choosing between Zephlyn and another agency.
        </h2>
        <p className="type-body-lg text-muted-foreground mt-5 max-w-[60ch]">
          The real options are: hire someone, wire it yourself, or leave it
          alone. Here&apos;s how those four roads play out over a year.
        </p>

        {/* —— DESKTOP TABLE —— */}
        <div
          ref={ref}
          className="mt-12 hidden md:block rounded-2xl border border-border bg-card/80 overflow-hidden"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/40">
                <th className="text-left p-4 type-overline text-muted-foreground w-[26%]">
                  Compare on
                </th>
                {COLUMNS.map((c, i) => (
                  <th
                    key={c}
                    className={cn(
                      "text-left p-4 type-overline tracking-[0.12em]",
                      i === 0
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, ri) => (
                <tr
                  key={row.question}
                  data-cmp-row
                  className={cn(
                    "border-b border-border/70 last:border-b-0 transition-colors duration-200",
                    "hover:bg-[color-mix(in_srgb,var(--primary)_4%,transparent)]",
                    ri % 2 === 1 && "bg-background/20"
                  )}
                >
                  <th className="text-left align-top p-4 type-body-sm font-semibold text-foreground/90">
                    {row.question}
                  </th>
                  {row.cells.map((cell, ci) => (
                    <td
                      key={ci}
                      data-cmp-cell-zephlyn={ci === 0 ? "" : undefined}
                      className={cn(
                        "align-top p-4 type-body-sm",
                        ci === 0
                          ? "text-foreground"
                          : "text-foreground/75"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <ToneIcon tone={cell.tone} />
                        <span>{cell.label}</span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* —— MOBILE STACK —— */}
        <div className="mt-10 md:hidden flex flex-col gap-5">
          {COLUMNS.map((col, ci) => (
            <article
              key={col}
              className={cn(
                "rounded-2xl border p-5 flex flex-col gap-3",
                ci === 0
                  ? "border-primary/40 bg-card"
                  : "border-border bg-card/70"
              )}
            >
              <h3
                className={cn(
                  "font-display font-semibold text-[18px] tracking-[-0.02em]",
                  ci === 0 ? "text-primary" : "text-foreground/85"
                )}
              >
                {col}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {ROWS.map((row) => (
                  <li
                    key={row.question}
                    className="flex items-start gap-2 type-body-sm text-foreground/80"
                  >
                    <ToneIcon tone={row.cells[ci].tone} />
                    <span>
                      <span className="text-muted-foreground">{row.question}:</span>{" "}
                      {row.cells[ci].label}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
