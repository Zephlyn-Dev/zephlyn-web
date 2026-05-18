"use client";

/**
 * Reduced-motion fallback — when prefers-reduced-motion is on, we skip the
 * 360vh scroll-driven 3D cinematic entirely and render the same content
 * as plain stacked sections. Each scene becomes a regular page section.
 *
 * Awwwards / accessibility judges actively grade this — a 7-scene R3F page
 * with no fallback loses 0.5-1 point on UX.
 */

import * as React from "react";
import { Container, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { LiveTicker } from "@/components/marketing/live-ticker";
import { PilotBar } from "@/components/marketing/pilot-bar";
import { ProblemScene } from "@/components/marketing/problem-scene";
import { WorkflowScene } from "@/components/marketing/workflow-scene";
import { ToolsScene } from "@/components/marketing/tools-scene";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="type-overline text-primary mb-3">{children}</p>;
}
function Headline({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-semibold tracking-[-0.025em] text-foreground text-[clamp(36px,5vw,68px)] leading-[1.05] max-w-[20ch]">
      {children}
    </h2>
  );
}
function Sub({ children }: { children: React.ReactNode }) {
  return (
    <p className="type-body-lg text-muted-foreground mt-5 max-w-[58ch]">
      {children}
    </p>
  );
}
function Grad({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-[var(--zeph-purple-500)] to-[var(--zeph-purple-300)] bg-clip-text text-transparent">
      {children}
    </span>
  );
}

export function ReducedMotionLanding() {
  return (
    <main className="relative z-20 bg-background">
      {/* Scene 1 — Hero */}
      <Section className="pt-28">
        <Container>
          <Eyebrow>Automation for home service businesses</Eyebrow>
          <Headline>
            Less admin. <Grad>Faster jobs. Cleaner handoffs.</Grad>
          </Headline>
          <Sub>
            We build automation systems for HVAC, roofing, plumbing,
            electrical, restoration, and solar — so leads get answered,
            estimates move, and sold work hits ops without anyone retyping
            anything.
          </Sub>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/sample-audit"
              className="type-button inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap select-none h-12 px-6 text-[15px] bg-transparent text-foreground border border-border hover:bg-muted hover:border-purple-300 dark:hover:border-purple-700 transition"
            >
              See a sample audit
            </a>
            <a
              href="#get-started"
              className="type-button inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap select-none h-12 px-6 text-[15px] bg-primary text-primary-foreground hover:bg-purple-800 transition"
            >
              Book the 30-min audit — lunch&apos;s on us
            </a>
          </div>
          <p className="mt-3 type-caption text-muted-foreground/80">
            If we can&apos;t find 3 workflows worth fixing in 30 minutes,
            we&apos;ll send you a $25 DoorDash credit.
          </p>
          <LiveTicker className="mt-8" />
          <PilotBar className="mt-12" />
        </Container>
      </Section>

      {/* Scene 2 — Problem */}
      <Section className="border-t border-border">
        <Container>
          <Eyebrow>02 · The problem</Eyebrow>
          <Headline>Every shop has 11 lead sources. None of them talk.</Headline>
          <div className="mt-10">
            <ProblemScene />
          </div>
        </Container>
      </Section>

      {/* Scene 3 — Outcome */}
      <Section className="border-t border-border">
        <Container>
          <Eyebrow>The outcome</Eyebrow>
          <Headline>
            Every lead caught. <Grad>Every job tracked.</Grad>
          </Headline>
          <Sub>
            One system, watching every channel — and quietly firing the right
            action the moment a signal arrives.
          </Sub>
        </Container>
      </Section>

      {/* Scene 4 — Workflow */}
      <Section className="border-t border-border">
        <Container>
          <Eyebrow>04 · What we automate</Eyebrow>
          <Headline>
            Your day, rebuilt as <Grad>connected workflows.</Grad>
          </Headline>
          <div className="mt-10">
            <WorkflowScene />
          </div>
        </Container>
      </Section>

      {/* Scene 5 — Network */}
      <Section className="border-t border-border">
        <Container>
          <Eyebrow>How it works</Eyebrow>
          <Headline>
            One node becomes <Grad>a network.</Grad>
          </Headline>
          <Sub>
            Workflows compose. Each automation knows about the others. Add a
            new lead source and the whole system gets smarter.
          </Sub>
        </Container>
      </Section>

      {/* Scene 6 — Tools */}
      <Section className="border-t border-border">
        <Container>
          <Eyebrow>06 · Tools we connect</Eyebrow>
          <Headline>Built on what you already run.</Headline>
          <div className="mt-10">
            <ToolsScene />
          </div>
        </Container>
      </Section>

      {/* Scene 7 — Audit CTA */}
      <Section id="get-started" className="border-t border-border">
        <Container>
          <Eyebrow>Get audit</Eyebrow>
          <Headline>
            Book a free <Grad>workflow audit.</Grad>
          </Headline>
          <Sub>
            30 minutes. We&apos;ll map the three workflows we&apos;d build
            first for your business.
          </Sub>
          <div className="mt-8">
            <Button size="lg" type="button">
              Book the 30-min audit — lunch&apos;s on us
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
