import { Container, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ZephlynLogo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LandingExperience } from "@/components/landing-experience";
import { StatStrip } from "@/components/marketing/stat-strip";
import { RoiCalculator } from "@/components/marketing/roi-calculator";
import { Qualifier } from "@/components/marketing/qualifier";
import { ComparisonMatrix } from "@/components/marketing/comparison-matrix";
import { SampleWorkflowPicker } from "@/components/marketing/sample-workflow-picker";
import { SixPillars } from "@/components/marketing/six-pillars";
import { PricingTiers } from "@/components/marketing/pricing-tiers";
import { OversizedFooter } from "@/components/marketing/oversized-footer";
import { CommandPalette } from "@/components/marketing/command-palette";
import { MobileStickyCta } from "@/components/marketing/mobile-sticky-cta";
import { InlineScheduler } from "@/components/marketing/inline-scheduler";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";
import { AmbientGlows } from "@/components/animations/ambient-glows";
import { ScrollProgressBar } from "@/components/animations/scroll-progress-bar";
import { ScrollGuideLine } from "@/components/animations/scroll-guide-line";
import { cn } from "@/lib/cn";

const REASONS: Array<{ title: string; body: string }> = [
  {
    title: "Productized, not bespoke.",
    body: "We don't reinvent the wheel for every shop. The work is structured enough to ship in weeks — and structured enough that you actually know what you're paying for.",
  },
  {
    title: "Built on your stack.",
    body: "ServiceTitan, Jobber, Housecall Pro, your CRM, your forms, your phone system — we connect what you already use. No new platform to learn.",
  },
  {
    title: "Recurring support.",
    body: "Month-to-month. As your shop changes, workflows change with it. We maintain what we ship; no project-then-ghost.",
  },
  {
    title: "Outcome-driven.",
    body: "Every workflow has a number attached: hours saved, leads recovered, jobs moved through faster, revenue caught. We report on it monthly.",
  },
];

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "How long does a buildout take?",
    a: "Two-week audit, then a three-week buildout for the first three workflows. After that, we layer in additional automations as your shop needs them.",
  },
  {
    q: "What if our current process is a mess?",
    a: "That's actually the better starting point. The audit's whole job is to map what you have today — phones, spreadsheets, half-built Zaps, the works — and find what's worth automating first.",
  },
  {
    q: "Do we have to switch from ServiceTitan / Jobber / our CRM?",
    a: "No. Zephlyn connects to what you already run. We don't replace your field-service or CRM platform. We build the workflows between them.",
  },
  {
    q: "What if our team isn't very technical?",
    a: "Then this is for you. Workflows run quietly in the background. Your dispatcher sees a cleaner queue. Your techs see correct schedules. No new dashboards to learn.",
  },
  {
    q: "How is this different from hiring an admin or VA?",
    a: "An admin reads the form and types into the CRM. We build the system so the form never needs a human to retype it. Then the admin handles judgment calls, not data entry.",
  },
  {
    q: "What does ongoing support actually cover?",
    a: "Fixing workflows when something upstream changes (your CRM update, a new lead source, a new tech). Adding new automations as you grow. Monthly check-in on what's working.",
  },
  {
    q: "Do you work with small shops or only enterprise?",
    a: "Both. A two-truck plumbing shop benefits the same way a 40-tech HVAC company does — fewer dropped leads, less admin time, more bookings off the same inbound volume.",
  },
  {
    q: "Which trades do you work with?",
    a: "HVAC, roofing, plumbing, electrical, restoration, and solar installers. The common pattern is field-service work with office and admin bottlenecks — that's where automation has the clearest ROI.",
  },
  {
    q: "Are you a SaaS product, an agency, or something else?",
    a: "A productized automation service with recurring support. We're not selling you a dashboard, and we're not a fully bespoke agency — the work is structured enough to ship in weeks and repeat across shops. As patterns prove out, the strongest pieces will turn into software later.",
  },
];

function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-sm border-b border-border bg-background/85">
      <div className="max-w-[1320px] mx-auto flex items-center justify-between h-[72px] px-5 md:px-10">
        <ZephlynLogo size={32} boxed />
        <nav className="hidden md:flex items-center gap-7 type-nav">
          <a href="#pillars" className="link-underline text-muted-foreground hover:text-foreground transition-colors">Product</a>
          <a href="#why" className="link-underline text-muted-foreground hover:text-foreground transition-colors">Workflows</a>
          <a href="#pricing" className="link-underline text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="link-underline text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          {/* Cmd+K hint — discovery for the palette */}
          <span
            aria-hidden
            className="inline-flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.06em] text-muted-foreground/70 border border-border rounded-md px-2 py-1"
            title="Press Cmd/Ctrl + K to open the command palette"
          >
            <kbd className="text-foreground/80">⌘</kbd>
            <kbd className="text-foreground/80">K</kbd>
          </span>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}


function WhyZephlyn() {
  return (
    <Section id="why" className="border-t border-border">
      <Container>
        <p className="type-overline text-primary mb-4">Why Zephlyn</p>
        <h2 className="type-h2 text-foreground max-w-[26ch]">
          Not an agency. Not a SaaS tool. A productized service.
        </h2>
        <p className="type-body-lg text-muted-foreground mt-5 max-w-[64ch]">
          You don&apos;t need another dashboard. You need someone who owns the
          workflows between your existing tools — and keeps them running as
          your shop changes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
          {REASONS.map((r) => (
            <div
              key={r.title}
              className="pl-5 py-2 border-l-2 border-primary/70"
            >
              <h3 className="type-h4 text-foreground">{r.title}</h3>
              <p className="type-body text-muted-foreground mt-2 max-w-[52ch]">
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function FaqSection() {
  return (
    <Section id="faq" className="border-t border-border">
      <Container className="max-w-[760px]">
        <p className="type-overline text-primary mb-4">FAQ</p>
        <h2 className="type-h2 text-foreground">Questions we get a lot.</h2>

        <div className="mt-10">
          {FAQS.map((f) => (
            <details key={f.q} className="faq-item">
              <summary className="text-foreground">{f.q}</summary>
              <div className="faq-body">{f.a}</div>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function FinalCta() {
  return (
    <Section id="get-started" className="border-t border-border">
      <Container>
        <div className="cta-band p-8 md:p-12 flex flex-col gap-8">
          <div className="max-w-[640px]">
            <p className="type-overline text-primary mb-3">Get started</p>
            <h2 className="type-h2 text-foreground">
              Pick a time. We&apos;ll bring the audit.
            </h2>
            <p className="type-body-lg text-muted-foreground mt-4">
              30 minutes, screen-share. We map your highest-leverage
              workflows across lead capture, estimates, scheduling, and
              ops handoffs — cost each one, rank them, and tell you which
              three would pay back fastest. If none are worth building,
              lunch&apos;s on us.
            </p>
          </div>

          {/* Inline scheduler — reduces the booking flow to a single screen */}
          <InlineScheduler />

          <p className="type-caption text-muted-foreground text-center">
            Prefer email? We&apos;re at{" "}
            <a
              href="mailto:hi@zephlyn.co"
              className="text-primary hover:underline underline-offset-4"
            >
              hi@zephlyn.co
            </a>{" "}
            — same humans answer either way.
          </p>
        </div>
      </Container>
    </Section>
  );
}

export default function HomePage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <ScrollProgressBar />
      <ScrollGuideLine />
      <SiteHeader />
      <LandingExperience />

      {/* Post-journey content — opaque background, sits above the fixed canvas */}
      <main className="relative z-20 bg-background isolate">
        {/* Ambient purple glow blobs — slow drift behind all sections */}
        <AmbientGlows className="-z-10" />
        <RevealOnScroll><StatStrip /></RevealOnScroll>
        <RevealOnScroll><SampleWorkflowPicker /></RevealOnScroll>
        <RevealOnScroll><SixPillars /></RevealOnScroll>
        <RevealOnScroll><Qualifier /></RevealOnScroll>
        <RevealOnScroll><WhyZephlyn /></RevealOnScroll>
        <RevealOnScroll><ComparisonMatrix /></RevealOnScroll>
        <RevealOnScroll><RoiCalculator /></RevealOnScroll>
        <RevealOnScroll><PricingTiers /></RevealOnScroll>
        <RevealOnScroll><FaqSection /></RevealOnScroll>
        <RevealOnScroll><FinalCta /></RevealOnScroll>
      </main>
      <MobileStickyCta />

      <OversizedFooter />

      {/* Cmd+K palette — global, listens for the keybinding everywhere */}
      <CommandPalette />
    </div>
  );
}
