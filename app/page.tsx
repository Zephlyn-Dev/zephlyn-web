import { Container, Section } from "@/components/ui/container";
import { ZephlynLogo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LandingExperience } from "@/components/landing-experience";
import { Qualifier } from "@/components/marketing/qualifier";
import { SixPillars } from "@/components/marketing/six-pillars";
import { OversizedFooter } from "@/components/marketing/oversized-footer";
import { CommandPalette } from "@/components/marketing/command-palette";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";
import { AmbientGlows } from "@/components/animations/ambient-glows";
import { ScrollProgressBar } from "@/components/animations/scroll-progress-bar";
import { ScrollGuideLine } from "@/components/animations/scroll-guide-line";
import { SectionDivider } from "@/components/animations/section-divider";
import { PageTransition } from "@/components/transitions/page-transition";
import { SendOff } from "@/components/marketing/send-off";

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
    a: "Depends on scope — we'll know after the first conversation. The work starts with mapping what you have today and what's actually slowing the business down, then we agree on what's worth building first.",
  },
  {
    q: "What if our current process is a mess?",
    a: "That's a better starting point than you'd think. The first step is mapping what you have — phones, spreadsheets, half-built Zaps, the works — and finding what's worth automating first.",
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
    q: "What would month-to-month look like if we kept working together?",
    a: "Fixing workflows when something upstream changes (a CRM update, a new lead source, a new tech). Adding new automations as the shop grows. Checking in regularly on what's actually helping and what isn't.",
  },
  {
    q: "Do you work with small shops or only enterprise?",
    a: "We're early — we're talking to shops of a range of sizes right now to figure out where we add the most value. If admin work is slowing the business down, the conversation's worth having.",
  },
  {
    q: "Which trades do you work with?",
    a: "HVAC, roofing, plumbing, electrical, restoration, and solar installers. The common pattern is field-service work with office and admin bottlenecks — that's where automation has the clearest payoff.",
  },
  {
    q: "Are you a SaaS product, an agency, or something else?",
    a: "A productized automation service with recurring support. We're not selling you a dashboard, and we're not a fully bespoke agency — we fix workflows for one shop at a time, learn what repeats across shops, and plan to turn the strongest pieces into software later.",
  },
];

function SiteHeader() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-sm border-b border-border bg-background/85"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="max-w-[1320px] mx-auto flex items-center justify-between h-[72px] px-5 md:px-10">
        <ZephlynLogo size={32} boxed />
        <div className="flex items-center gap-2 md:gap-3">
          <a
            href="mailto:social@zephlyn.io"
            className="type-button hidden md:inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap select-none h-9 px-4 text-[13px] bg-transparent text-foreground border border-border hover:bg-muted hover:border-purple-300 dark:hover:border-purple-700 transition-[background,color,border-color] duration-150 ease-out"
          >
            Get in touch
          </a>
          <ThemeToggle />
        </div>
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
        <h2 className="type-h2 text-foreground">Common questions.</h2>

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
        <div className="cta-band p-8 md:p-12 flex flex-col gap-8 items-start">
          <div className="max-w-[640px]">
            <p className="type-overline text-primary mb-3">Get in touch</p>
            <h2 className="type-h2 text-foreground">Want to talk?</h2>
            <p className="type-body-lg text-muted-foreground mt-4">
              Email us with what&apos;s slowing your shop down. We&apos;ll
              write back the same day with whether we think we can help.
            </p>
          </div>

          <a
            href="mailto:social@zephlyn.io"
            className="type-button inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap select-none h-12 px-7 text-[15px] bg-primary text-primary-foreground hover:bg-purple-800 active:bg-purple-900 active:scale-[0.98] transition-[background,color,box-shadow,transform] duration-150 ease-out"
          >
            social@zephlyn.io
          </a>
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
      <PageTransition>
        <LandingExperience />

        {/* Post-journey content — opaque background, sits above the fixed canvas */}
        <main className="relative z-20 bg-background isolate">
          {/* Ambient purple glow blobs — slow drift behind all sections */}
          <AmbientGlows className="-z-10" />
          <RevealOnScroll><SixPillars /></RevealOnScroll>
          <SectionDivider variant="wave" />
          <RevealOnScroll><Qualifier /></RevealOnScroll>
          <RevealOnScroll><WhyZephlyn /></RevealOnScroll>
          <SectionDivider variant="ticks" />
          <RevealOnScroll><FaqSection /></RevealOnScroll>
          <SectionDivider variant="compass" />
          <SendOff />
          <RevealOnScroll><FinalCta /></RevealOnScroll>
        </main>
        <OversizedFooter />
      </PageTransition>

      {/* Cmd+K palette — global, listens for the keybinding everywhere */}
      <CommandPalette />
    </div>
  );
}
