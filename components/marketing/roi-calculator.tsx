"use client";

/**
 * ROI calculator — three sliders/inputs that convert the contractor's
 * gut numbers into an annualised "leaked revenue" figure and stack it
 * against Zephlyn's year-1 cost. Lives directly above the pricing tiers
 * so the prices land *after* the buyer has seen the math.
 *
 * Inputs: leads missed per week, average closed-job value, close rate %.
 * Output: leaked $/yr  ·  Zephlyn recovery (60% assumed)  ·  yr-1 ROI ×.
 */

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Container, Section } from "@/components/ui/container";

const ZEPHLYN_YEAR_ONE = 4500 + 2400 * 11; // pilot + 11 months operate
const RECOVERY_RATE = 0.6;
const WEEKS_PER_YEAR = 52;

type State = {
  leadsMissed: number; // per week
  jobValue: number;    // $ avg closed job
  closeRate: number;   // 0..1
};

const PRESETS: Array<{ id: string; label: string; v: State }> = [
  { id: "small",  label: "Small shop · 2-5 techs",  v: { leadsMissed: 5,  jobValue: 1200, closeRate: 0.40 } },
  { id: "mid",    label: "Mid shop · 8-15 techs",   v: { leadsMissed: 12, jobValue: 2200, closeRate: 0.35 } },
  { id: "large",  label: "Large shop · 20-40 techs", v: { leadsMissed: 25, jobValue: 3800, closeRate: 0.30 } },
];

function fmt$(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 10_000) return `$${Math.round(n / 1000)}k`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function Field({
  label,
  sub,
  value,
  min,
  max,
  step,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  sub: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label className="type-body-sm text-foreground font-medium">{label}</label>
        <span className="font-mono text-foreground/90 text-[15px] tabular-nums">
          {prefix}{value.toLocaleString("en-US")}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
        className="zeph-slider"
        style={{
          ["--slider-fill" as string]: `${((value - min) / (max - min)) * 100}%`,
        }}
        aria-label={label}
      />
      <p className="type-caption text-muted-foreground">{sub}</p>
    </div>
  );
}

export function RoiCalculator() {
  const [state, setStateRaw] = React.useState<State>(PRESETS[1].v);
  // Once the user touches a control, the React state owns the displayed
  // numbers permanently and we never animate again.
  const [interacted, setInteracted] = React.useState(false);

  const setState: typeof setStateRaw = React.useCallback((updater) => {
    setInteracted(true);
    setStateRaw(updater);
  }, []);

  const leakedPerYear =
    state.leadsMissed * WEEKS_PER_YEAR * state.jobValue * state.closeRate;

  // Scrub-animated display value — starts at 0 and animates up to
  // leakedPerYear as the user scrolls the section into view. After user
  // interacts, we snap to the live computed value.
  const [displayLeak, setDisplayLeak] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || interacted) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          normal: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { reduce } = ctx.conditions as { reduce: boolean };

          if (reduce) {
            setDisplayLeak(leakedPerYear);
            return;
          }

          const counter = { v: 0 };
          gsap.to(counter, {
            v: leakedPerYear,
            ease: "none",
            onUpdate: () => {
              setDisplayLeak(Math.round(counter.v));
            },
            scrollTrigger: {
              trigger: root,
              start: "top 80%",
              end: "top 25%",
              scrub: 0.7,
            },
          });

          // Output card lift-in
          const output = root.querySelector("[data-roi-output]");
          if (output) {
            gsap.from(output, {
              y: 40,
              opacity: 0,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: output,
                start: "top 85%",
                once: true,
              },
            });
          }
          // Input card lift-in (from left)
          const input = root.querySelector("[data-roi-input]");
          if (input) {
            gsap.from(input, {
              x: -40,
              opacity: 0,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: input,
                start: "top 85%",
                once: true,
              },
            });
          }
        }
      );

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [interacted, leakedPerYear] }
  );

  // Once user has interacted, mirror the displayed value to the live
  // computed value at all times (no animation).
  React.useEffect(() => {
    if (interacted) setDisplayLeak(leakedPerYear);
  }, [interacted, leakedPerYear]);

  const shownLeak = interacted ? leakedPerYear : displayLeak;
  const shownRecovered = shownLeak * RECOVERY_RATE;
  const shownRoi = shownRecovered / ZEPHLYN_YEAR_ONE;
  const shownMonthly = shownRecovered / 12;

  return (
    <Section id="roi" className="border-t border-border">
      <Container>
        <p className="type-overline text-primary mb-4">Run the math first</p>
        <h2 className="type-h2 text-foreground max-w-[22ch]">
          What slow follow-up is costing you.
        </h2>
        <p className="type-body-lg text-muted-foreground mt-5 max-w-[58ch]">
          The clearest dollar value in automation is the lead you didn&apos;t
          answer fast enough. Three honest numbers from your last 30 days —
          we&apos;ll show you what that single leak is worth annually, and
          whether Zephlyn&apos;s year-one fee pencils out against it. Admin
          time and handoff savings are on top.
        </p>

        <div
          ref={rootRef}
          className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-6"
        >
          {/* —— Inputs —— */}
          <div
            data-roi-input
            className="rounded-2xl border border-border bg-card/85 p-7 flex flex-col gap-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="type-overline text-muted-foreground">
                Quick preset
              </span>
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setState(p.v)}
                  className="text-[11.5px] font-mono uppercase tracking-[0.06em] px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <Field
              label="Leads dropped per week"
              sub="Missed calls, slow callbacks, web forms ignored over an hour."
              value={state.leadsMissed}
              min={1}
              max={60}
              step={1}
              suffix=" leads"
              onChange={(n) => setState((s) => ({ ...s, leadsMissed: n }))}
            />
            <Field
              label="Average closed-job value"
              sub="Take your last 30 days of completed jobs — divide revenue by jobs."
              value={state.jobValue}
              min={200}
              max={15000}
              step={100}
              prefix="$"
              onChange={(n) => setState((s) => ({ ...s, jobValue: n }))}
            />
            <Field
              label="Close rate on quoted leads"
              sub="Of the leads your team actually calls back, what percent book a job?"
              value={Math.round(state.closeRate * 100)}
              min={5}
              max={70}
              step={1}
              suffix="%"
              onChange={(n) => setState((s) => ({ ...s, closeRate: n / 100 }))}
            />
          </div>

          {/* —— Output —— */}
          <div
            data-roi-output
            className="rounded-2xl border border-primary/40 bg-gradient-to-br from-[color-mix(in_srgb,var(--primary)_8%,var(--card))] to-[var(--card)] p-7 flex flex-col gap-5 relative overflow-hidden"
          >
            <div
              aria-hidden
              className="absolute -top-24 -right-24 size-64 rounded-full opacity-30 blur-3xl"
              style={{ background: "var(--primary)" }}
            />

            <div className="relative">
              <p className="type-overline text-primary">Annual leak</p>
              <p className="mt-2 font-display font-bold text-foreground text-[clamp(40px,5.5vw,68px)] leading-none tracking-[-0.035em] tabular-nums">
                {fmt$(shownLeak)}
              </p>
              <p className="mt-2 type-body-sm text-muted-foreground">
                That&apos;s revenue your competitors are quoting on instead — at{" "}
                {fmt$(shownLeak / 12)} a month.
              </p>
            </div>

            <hr className="border-border/60" />

            <div className="grid grid-cols-2 gap-5 relative">
              <div>
                <p className="type-overline text-muted-foreground">
                  Zephlyn typically recovers
                </p>
                <p className="mt-1.5 font-display font-bold text-foreground text-[28px] leading-none tracking-[-0.025em] tabular-nums">
                  {fmt$(shownRecovered)}
                  <span className="text-muted-foreground text-[14px] font-mono font-medium ml-1">
                    /yr
                  </span>
                </p>
                <p className="mt-1.5 type-caption text-muted-foreground">
                  60% recovery · {fmt$(shownMonthly)}/mo
                </p>
              </div>
              <div>
                <p className="type-overline text-muted-foreground">
                  Year-1 ROI vs. our fee
                </p>
                <p className="mt-1.5 font-display font-bold text-foreground text-[28px] leading-none tracking-[-0.025em] tabular-nums">
                  {shownRoi >= 100
                    ? `${Math.round(shownRoi)}×`
                    : `${shownRoi.toFixed(1)}×`}
                </p>
                <p className="mt-1.5 type-caption text-muted-foreground">
                  Pilot + 11 mo operate = {fmt$(ZEPHLYN_YEAR_ONE)}
                </p>
              </div>
            </div>

            <p className="relative type-caption text-muted-foreground">
              Math: missed × 52 weeks × close rate × job value × 60% recovery.
              No magic. The 60% is the average across our first three pilots.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
