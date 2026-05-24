"use client";

/**
 * Static landing — served to both mobile viewports (< 768px) and users with
 * `prefers-reduced-motion: reduce`. Skips the 360vh scroll-driven 3D
 * cinematic and renders the same narrative as plain stacked sections.
 *
 * Mirrors the cinematic's 7 scenes (Hero / Problem / Outcome / Workflow /
 * Network / Tools / Contact) with the same copy. Keep in sync with
 * components/scene/scene-overlay.tsx.
 */

import * as React from "react";
import { Container, Section } from "@/components/ui/container";
import { ProblemScene } from "@/components/marketing/problem-scene";
import { WorkflowScene } from "@/components/marketing/workflow-scene";
import { ToolsScene } from "@/components/marketing/tools-scene";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="type-overline text-primary mb-3">{children}</p>;
}
function Headline({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-semibold tracking-[-0.025em] text-foreground text-[clamp(30px,5vw,68px)] leading-[1.08] max-w-[20ch] [text-wrap:balance] [word-break:keep-all]">
      {children}
    </h2>
  );
}
function Sub({ children }: { children: React.ReactNode }) {
  return (
    <p className="type-body-lg text-muted-foreground mt-5 max-w-[58ch] [text-wrap:pretty]">
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

export function StaticLanding() {
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
            Automation for home service shops drowning in admin work —
            so leads get answered, estimates move, and sold jobs reach
            ops cleanly.
          </Sub>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="mailto:social@zephlyn.io"
              className="type-button inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap select-none h-12 px-6 text-[15px] bg-primary text-primary-foreground hover:bg-purple-800 transition"
            >
              Get in touch
            </a>
          </div>
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
            Every channel watched. <Grad>Every job moves.</Grad>
          </Headline>
          <Sub>
            Lead intake, scheduling, estimates, and ops handoffs running
            quietly in the background — on the tools you already use.
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
          <Eyebrow>How we&apos;re built</Eyebrow>
          <Headline>
            A service today. <Grad>Software tomorrow.</Grad>
          </Headline>
          <Sub>
            We start as a productized automation service with recurring
            support — fix workflows, learn what repeats across shops, and
            turn the strongest pieces into software later.
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

      {/* Scene 7 — Contact */}
      <Section id="get-started" className="border-t border-border">
        <Container>
          <Eyebrow>Get in touch</Eyebrow>
          <Headline>
            Tell us <Grad>what&apos;s broken.</Grad>
          </Headline>
          <Sub>
            We&apos;re working with our first shops now. If your admin work
            is slowing the business down, we want to hear about it — and
            we&apos;ll be straight about whether we can help.
          </Sub>
          <div className="mt-8 flex flex-col items-start gap-3">
            <a
              href="mailto:social@zephlyn.io"
              className="type-button inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap select-none h-12 px-7 text-[15px] bg-primary text-primary-foreground hover:bg-purple-800 transition"
            >
              Email us
            </a>
            <p className="type-caption text-muted-foreground font-mono">
              social@zephlyn.io
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
