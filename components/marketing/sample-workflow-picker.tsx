"use client";

/**
 * Industry-specific "Sample Workflow" picker.
 *
 * Four tabs (HVAC · Roofing · Plumbing · Restoration). Click one and the
 * panel reveals one *real* workflow Zephlyn would build for that trade,
 * drawn as a 5-stage pipeline with named tools (ServiceTitan, CallRail,
 * Twilio, Slack, etc.).
 *
 * Goal: a skeptical contractor sees their own stack named in plain
 * language and immediately knows this is real, not agency-vapor.
 */

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Container, Section } from "@/components/ui/container";
import { cn } from "@/lib/cn";

type Stage = {
  tool: string;       // "ServiceTitan", "CallRail", etc.
  action: string;     // "Inbound call rings"
  detail?: string;    // optional one-liner
};

type Workflow = {
  id: string;
  industry: string;
  emoji?: string;     // not rendered, kept for ordering reference
  title: string;
  problem: string;    // what hurts in this trade
  outcome: string;    // dollar/time outcome — the metric
  stages: Stage[];
};

const WORKFLOWS: Workflow[] = [
  {
    id: "hvac",
    industry: "HVAC",
    title: "After-hours emergency callback in 60 seconds",
    problem:
      "Furnace dies at 9pm. They call your line, hit voicemail, then call the next HVAC shop on Google.",
    outcome: "Recovers ~$2,400/mo of after-hours emergency revenue.",
    stages: [
      { tool: "CallRail",     action: "Missed call detected", detail: "After 5pm, weekends, holidays" },
      { tool: "Twilio",       action: "SMS auto-reply sent", detail: '"We saw your call — texting back in 60s"' },
      { tool: "ServiceTitan", action: "Job draft created",   detail: "Customer matched or created" },
      { tool: "Slack",        action: "On-call tech paged",  detail: "#oncall channel + push" },
      { tool: "ServiceTitan", action: "Job booked",          detail: "Tech confirms, ETA texted to customer" },
    ],
  },
  {
    id: "roofing",
    industry: "Roofing",
    title: "Storm-claim lead → assigned in 5 minutes",
    problem:
      "Hailstorm rolls through. 40 leads flood in over 2 hours from Facebook, Angi, and your form. Three days later, 60% have already signed with someone else.",
    outcome: "Lifts storm-event close rate 22% → 38% in three pilots.",
    stages: [
      { tool: "Facebook · Angi · Web form", action: "Lead arrives" },
      { tool: "Internal scoring",  action: "ZIP + roof age + photo check", detail: "Hot / Warm / Cold" },
      { tool: "Twilio",            action: "Hot leads texted in <2 min",   detail: '"We can be there tomorrow"' },
      { tool: "Jobber",            action: "Estimate job auto-created",     detail: "Assigned to nearest crew lead" },
      { tool: "Slack + Email",     action: "Sales rep paged",               detail: "With photos + history pre-loaded" },
    ],
  },
  {
    id: "plumbing",
    industry: "Plumbing",
    title: "Same-day quote follow-up the customer actually reads",
    problem:
      "You quote a $4k repipe. Customer says 'I'll think about it.' Three days pass, no follow-up, they hire your competitor.",
    outcome: "Doubles quote-to-job rate on jobs over $2k.",
    stages: [
      { tool: "Housecall Pro", action: "Estimate sent over $1.5k", detail: "Auto-tagged 'large quote'" },
      { tool: "Internal timer", action: "+24 hr — no decision",     detail: "Trigger fires" },
      { tool: "Twilio",        action: "Personalized SMS check-in", detail: '"Did the quote make sense? Q?"' },
      { tool: "Email",         action: "+72 hr — case study sent",  detail: "Past job, same trade, same scope" },
      { tool: "Housecall Pro", action: "Outcome logged",            detail: "Won / Lost reason captured" },
    ],
  },
  {
    id: "restoration",
    industry: "Restoration",
    title: "Insurance-claim packet ready before the adjuster calls",
    problem:
      "Tech finishes the water-damage assessment. The packet (photos, moisture readings, scope, mitigation log) takes a day to assemble. Adjuster reaches out — you don't have it. Deal slips.",
    outcome: "Cuts packet-to-adjuster time from 26 hrs to 90 minutes.",
    stages: [
      { tool: "Field app", action: "Tech submits assessment", detail: "Photos + moisture readings + voice notes" },
      { tool: "AI summary", action: "Scope drafted",          detail: "Auto-categorized for Xactimate" },
      { tool: "Google Drive", action: "Packet PDF assembled", detail: "Photos, scope, mitigation log, signed forms" },
      { tool: "Twilio + Email", action: "Adjuster auto-notified", detail: "Packet link + claim # pre-filled" },
      { tool: "ServiceTitan", action: "Job advanced to billing", detail: "On adjuster sign-off" },
    ],
  },
];

function StageNode({ s, index, last }: { s: Stage; index: number; last: boolean }) {
  return (
    <li className="relative flex items-stretch" data-stage>
      <div className="flex flex-col items-center mr-4">
        <span
          data-stage-badge
          className="inline-flex items-center justify-center size-7 rounded-full bg-primary text-primary-foreground type-overline shrink-0"
        >
          {index + 1}
        </span>
        {!last && (
          <span
            aria-hidden
            data-stage-connector
            className="mt-1 w-px flex-1 bg-gradient-to-b from-primary/60 to-primary/10 origin-top"
          />
        )}
      </div>
      <div data-stage-body className={cn("pb-5", last && "pb-0")}>
        <p className="type-overline text-primary">{s.tool}</p>
        <p className="mt-1 type-body-sm text-foreground font-medium">
          {s.action}
        </p>
        {s.detail && (
          <p className="mt-0.5 type-caption text-muted-foreground">
            {s.detail}
          </p>
        )}
      </div>
    </li>
  );
}

export function SampleWorkflowPicker() {
  const [active, setActive] = React.useState<string>(WORKFLOWS[0].id);
  const wf = WORKFLOWS.find((w) => w.id === active) ?? WORKFLOWS[0];
  const stageListRef = React.useRef<HTMLOListElement>(null);

  // Re-run the staged reveal whenever the active tab changes — gives each
  // industry switch a fresh "pipeline assembling" feel.
  useGSAP(
    () => {
      const root = stageListRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          normal: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { reduce } = ctx.conditions as { reduce: boolean };

          const badges = root.querySelectorAll("[data-stage-badge]");
          const bodies = root.querySelectorAll("[data-stage-body]");
          const connectors = root.querySelectorAll("[data-stage-connector]");

          if (reduce) {
            gsap.set([badges, bodies], { opacity: 1, x: 0, scale: 1 });
            gsap.set(connectors, { scaleY: 1 });
            return;
          }

          gsap.set(connectors, { scaleY: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top 80%",
              once: true,
            },
          });

          // Stage-by-stage reveal — badge pops, body slides in, connector grows.
          badges.forEach((badge, i) => {
            tl.from(
              badge,
              {
                scale: 0,
                opacity: 0,
                duration: 0.4,
                ease: "back.out(2)",
              },
              i * 0.18
            );
            const body = bodies[i];
            if (body) {
              tl.from(
                body,
                { x: 24, opacity: 0, duration: 0.45, ease: "power3.out" },
                i * 0.18 + 0.05
              );
            }
            const connector = connectors[i];
            if (connector) {
              tl.to(
                connector,
                { scaleY: 1, duration: 0.35, ease: "power2.out" },
                i * 0.18 + 0.15
              );
            }
          });
        }
      );

      return () => mm.revert();
    },
    { scope: stageListRef, dependencies: [active] }
  );

  return (
    <Section id="sample-workflow" className="border-t border-border">
      <Container>
        <p className="type-overline text-primary mb-4">
          Pick your trade · see a real workflow
        </p>
        <h2 className="type-h2 text-foreground max-w-[22ch]">
          One workflow we&apos;d build for you next week.
        </h2>
        <p className="type-body-lg text-muted-foreground mt-5 max-w-[58ch]">
          We start with the three use cases that pay for themselves fastest:{" "}
          <span className="text-foreground font-semibold">lead capture &amp; routing</span>,{" "}
          <span className="text-foreground font-semibold">estimate &amp; proposal flow</span>, and{" "}
          <span className="text-foreground font-semibold">sales-to-ops handoff</span>.
          Wired into the tools you already pay for — no new dashboard for
          anyone to log into.
        </p>

        {/* —— Tabs —— */}
        <div
          role="tablist"
          aria-label="Sample workflow industries"
          className="mt-10 flex flex-wrap gap-2"
        >
          {WORKFLOWS.map((w) => {
            const selected = w.id === active;
            return (
              <button
                key={w.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(w.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-[13px] font-mono uppercase tracking-[0.08em] transition-all duration-200",
                  selected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                )}
              >
                {w.industry}
              </button>
            );
          })}
        </div>

        {/* —— Active workflow card —— */}
        <article
          role="tabpanel"
          aria-label={`Workflow for ${wf.industry}`}
          className="mt-8 rounded-2xl border border-border bg-card/85 p-7 md:p-9 grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-8"
        >
          {/* Left: narrative */}
          <div className="flex flex-col gap-5">
            <header>
              <p className="type-overline text-muted-foreground">
                {wf.industry} · Workflow #01
              </p>
              <h3 className="mt-2 font-display font-semibold text-foreground text-[clamp(22px,3.2vw,32px)] leading-[1.15] tracking-[-0.025em] max-w-[26ch]">
                {wf.title}
              </h3>
            </header>

            <div>
              <p className="type-overline text-[var(--zeph-danger-500)] mb-1.5">
                The problem
              </p>
              <p className="type-body text-foreground/85 leading-relaxed">
                {wf.problem}
              </p>
            </div>

            <div>
              <p className="type-overline text-[var(--zeph-success-500)] mb-1.5">
                The outcome
              </p>
              <p className="type-body text-foreground/85 leading-relaxed">
                {wf.outcome}
              </p>
            </div>
          </div>

          {/* Right: stage list */}
          <div className="rounded-xl border border-border bg-background/40 p-6">
            <p className="type-overline text-primary mb-4">
              How it runs · 5 stages
            </p>
            <ol ref={stageListRef} className="flex flex-col">
              {wf.stages.map((s, i) => (
                <StageNode
                  key={`${wf.id}-${i}`}
                  s={s}
                  index={i}
                  last={i === wf.stages.length - 1}
                />
              ))}
            </ol>
          </div>
        </article>
      </Container>
    </Section>
  );
}
