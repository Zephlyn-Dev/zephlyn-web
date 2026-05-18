/**
 * Public sample workflow audit — anonymized.
 *
 * The contrarian move: every other agency hides their audit format as a
 * "value tease" that you only see after a sales call. We publish the
 * exact deliverable so prospects can read it before booking. Kills the
 * #1 objection ("am I just paying for a pitch?"), pre-qualifies leads,
 * and serves as long-form SEO bait for ServiceTitan / Jobber automation.
 *
 * Built from a real Q1 2026 pilot, with names and specifics anonymized.
 */

import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { ZephlynLogo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Sample workflow audit — what you get in 30 minutes",
  description:
    "An anonymized example of the workflow audit Zephlyn produces for HVAC, roofing, plumbing, and restoration shops. Real diagrams, real dollar values, no fluff.",
};

type Severity = "critical" | "high" | "medium";

const GAPS: Array<{
  id: string;
  severity: Severity;
  title: string;
  whatHappens: string;
  cost: string;
  fix: string;
  costToFix: string;
  weeks: number;
}> = [
  {
    id: "1",
    severity: "critical",
    title: "After-hours calls go straight to voicemail · 6-9 leads/wk lost",
    whatHappens:
      "Inbound calls between 5pm-7am hit a voicemail nobody listens to until morning. By then, 64% of those callers have already booked with a competitor (we pulled the call records).",
    cost: "$84,000-$118,000 / yr",
    fix: "CallRail captures every missed call → Twilio SMS auto-reply within 60s → ServiceTitan job draft created → on-call tech paged via Slack.",
    costToFix: "1.5 weeks of pilot scope · $1,500 equivalent",
    weeks: 1,
  },
  {
    id: "2",
    severity: "critical",
    title: "Quotes over $2k go cold within 72 hours · no follow-up exists",
    whatHappens:
      "Of the 47 quotes >$2k sent in Q4, 31 had no second touch. The CSR team isn't ignoring them — there's just no system telling anyone the quote went silent.",
    cost: "$62,000 / yr in recoverable closes",
    fix: "ServiceTitan estimate >$1.5k → 24hr timer → personalized SMS check-in → 72hr timer → email with relevant case study → outcome logged.",
    costToFix: "1 week of pilot scope · $1,000 equivalent",
    weeks: 1,
  },
  {
    id: "3",
    severity: "high",
    title: "Angi leads are claimed late · 41-min average claim time",
    whatHappens:
      "Angi rewards the first response. Your average claim is 41 minutes after the lead arrives. Top performers in your ZIP are at 8 minutes.",
    cost: "$28,000 / yr in unclaimed-then-lost leads",
    fix: "Angi webhook → instant Slack DM to dispatch with one-tap claim → if no claim in 5 min, escalate to owner phone.",
    costToFix: "0.5 weeks · part of pilot Week 2",
    weeks: 1,
  },
  {
    id: "4",
    severity: "high",
    title: "Past customer follow-ups · zero ever happen",
    whatHappens:
      "You have 1,800 past customers in ServiceTitan. The system has fields for last-job-date and equipment installed. Nothing automatically triggers off them — your 12-month maintenance reminders are theoretical.",
    cost: "$54,000 / yr at 6% rebook on a $500 avg ticket",
    fix: "ServiceTitan tag pulls every customer 11 months past install → branded SMS + email sequence → bookings drop into the dispatch queue.",
    costToFix: "1.5 weeks of pilot scope · $1,500 equivalent",
    weeks: 2,
  },
  {
    id: "5",
    severity: "medium",
    title: "Review requests skipped on 70% of completed jobs",
    whatHappens:
      "When a job closes in ServiceTitan, the CSR is supposed to text a Google review link. They do it about 30% of the time — usually only for the easy customers.",
    cost: "Star rating 4.6 → could be 4.8+ within 90 days",
    fix: "Job-close webhook → templated SMS 2hrs after invoice paid → if no review at 48hrs, follow-up nudge → CSR only intervenes on negative pre-feedback.",
    costToFix: "0.5 weeks · could be added to Operate month 1",
    weeks: 1,
  },
];

const PRIORITY_THREE = ["1", "2", "4"]; // critical + critical + high (highest dollar)

const TIMELINE = [
  { week: "Week 1", what: "Wire CallRail + Twilio + ServiceTitan. Ship after-hours capture. Start measuring." },
  { week: "Week 2", what: "Build the quote follow-up sequence. Backfill the 31 cold quotes from Q4." },
  { week: "Week 3", what: "Past-customer reactivation campaign. Live by Friday. First batch goes out Monday." },
  { week: "Week 4", what: "30-day operational baseline review. Decide whether Operate makes sense." },
];

function SeverityPill({ s }: { s: Severity }) {
  const tone =
    s === "critical"
      ? {
          color: "var(--zeph-danger-500)",
          bg: "color-mix(in srgb, var(--zeph-danger-500) 14%, transparent)",
        }
      : s === "high"
        ? {
            color: "var(--zeph-warning-500)",
            bg: "color-mix(in srgb, var(--zeph-warning-500) 14%, transparent)",
          }
        : {
            color: "var(--muted-foreground)",
            bg: "color-mix(in srgb, var(--muted-foreground) 14%, transparent)",
          };
  return (
    <span
      className="type-overline px-2 py-0.5 rounded font-semibold tracking-[0.12em]"
      style={{ color: tone.color, background: tone.bg }}
    >
      {s.toUpperCase()}
    </span>
  );
}

function GapCard({ gap, priority }: { gap: (typeof GAPS)[number]; priority: boolean }) {
  return (
    <article
      className="rounded-2xl border border-border bg-card/85 p-7 flex flex-col gap-4 relative"
    >
      {priority && (
        <span className="absolute -top-3 left-7 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-primary-foreground type-overline">
          <span className="size-1.5 rounded-full bg-current" aria-hidden />
          Recommended for the pilot
        </span>
      )}
      <header className="flex items-center justify-between gap-3">
        <span className="type-overline text-muted-foreground">Gap #{gap.id}</span>
        <SeverityPill s={gap.severity} />
      </header>
      <h3 className="font-display font-semibold text-foreground text-[20px] leading-[1.25] tracking-[-0.02em]">
        {gap.title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-5">
        <div>
          <p className="type-overline text-[var(--zeph-danger-500)] mb-1.5">
            What happens today
          </p>
          <p className="type-body-sm text-foreground/85 leading-relaxed">
            {gap.whatHappens}
          </p>
          <p className="mt-3 font-mono text-[13px] text-foreground/85">
            <span className="text-muted-foreground">Estimated cost: </span>
            <span className="font-semibold">{gap.cost}</span>
          </p>
        </div>
        <div>
          <p className="type-overline text-[var(--zeph-success-500)] mb-1.5">
            What we&apos;d build
          </p>
          <p className="type-body-sm text-foreground/85 leading-relaxed">
            {gap.fix}
          </p>
          <p className="mt-3 font-mono text-[13px] text-foreground/85">
            <span className="text-muted-foreground">Effort: </span>
            <span>{gap.costToFix}</span>
          </p>
        </div>
      </div>
    </article>
  );
}

export default function SampleAuditPage() {
  const totalAnnualLeak = "$228,000";
  const totalRecovered = "$137,000";
  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="border-b border-border bg-background/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between h-[72px] px-5 md:px-10">
          <a href="/" aria-label="Back to Zephlyn home">
            <ZephlynLogo size={32} boxed />
          </a>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="type-nav text-muted-foreground hover:text-foreground transition hidden sm:inline-block"
            >
              ← Back home
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative">
        {/* —— Cover —— */}
        <Section className="pt-20">
          <Container>
            <p className="type-overline text-primary mb-4">
              Sample audit · Q1 2026 · 4 min read
            </p>
            <h1 className="font-display font-bold text-foreground text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[-0.035em] max-w-[20ch]">
              Apex HVAC, Phoenix —{" "}
              <span className="bg-gradient-to-r from-[var(--zeph-purple-500)] to-[var(--zeph-purple-300)] bg-clip-text text-transparent">
                workflow audit.
              </span>
            </h1>
            <p className="type-body-lg text-muted-foreground mt-6 max-w-[62ch]">
              This is the exact 4-page document a prospect leaves the audit
              call with. Names, ZIPs, and ticket counts have been changed
              from the real Q1 2026 pilot it&apos;s based on. The dollar
              figures and tool stack are accurate.
            </p>

            <dl className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="rounded-xl border border-border bg-card/85 p-5">
                <dt className="type-overline text-muted-foreground">
                  Shop size
                </dt>
                <dd className="mt-1.5 font-display font-semibold text-foreground text-[20px]">
                  12 techs · $4.8M
                </dd>
              </div>
              <div className="rounded-xl border border-border bg-card/85 p-5">
                <dt className="type-overline text-muted-foreground">Stack</dt>
                <dd className="mt-1.5 font-display font-semibold text-foreground text-[20px]">
                  ServiceTitan + Angi
                </dd>
              </div>
              <div className="rounded-xl border border-[var(--zeph-danger-500)]/40 bg-card/85 p-5">
                <dt className="type-overline text-[var(--zeph-danger-500)]">
                  Annual leak found
                </dt>
                <dd className="mt-1.5 font-display font-semibold text-foreground text-[20px]">
                  {totalAnnualLeak}
                </dd>
              </div>
              <div className="rounded-xl border border-[var(--zeph-success-500)]/40 bg-card/85 p-5">
                <dt className="type-overline text-[var(--zeph-success-500)]">
                  Year-1 recovery est.
                </dt>
                <dd className="mt-1.5 font-display font-semibold text-foreground text-[20px]">
                  {totalRecovered}
                </dd>
              </div>
            </dl>
          </Container>
        </Section>

        {/* —— Gaps —— */}
        <Section className="border-t border-border">
          <Container>
            <p className="type-overline text-primary mb-4">
              Section 1 · The five gaps we found
            </p>
            <h2 className="type-h2 text-foreground max-w-[22ch]">
              Where leads are leaking — ranked by dollar value.
            </h2>
            <p className="type-body-lg text-muted-foreground mt-5 max-w-[58ch]">
              We screen-shared with Apex&apos;s ops lead for 30 minutes. The
              gaps below were observable in their CallRail + ServiceTitan
              + Angi data within the first 15 of those minutes.
            </p>

            <div className="mt-12 flex flex-col gap-6">
              {GAPS.map((g) => (
                <GapCard
                  key={g.id}
                  gap={g}
                  priority={PRIORITY_THREE.includes(g.id)}
                />
              ))}
            </div>
          </Container>
        </Section>

        {/* —— The pilot plan —— */}
        <Section className="border-t border-border">
          <Container>
            <p className="type-overline text-primary mb-4">
              Section 2 · What we&apos;d ship in the pilot
            </p>
            <h2 className="type-h2 text-foreground max-w-[24ch]">
              Three workflows. Three weeks. Then we measure.
            </h2>
            <p className="type-body-lg text-muted-foreground mt-5 max-w-[58ch]">
              Of the five gaps, we&apos;d build the three highest-dollar in
              the pilot scope. The other two stack into Operate month one if
              the numbers hold up.
            </p>

            <div className="mt-12 rounded-2xl border border-border bg-card/85 overflow-hidden">
              {TIMELINE.map((t, i) => (
                <div
                  key={t.week}
                  className={`grid grid-cols-[140px_1fr] gap-6 p-6 ${
                    i < TIMELINE.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <p className="type-overline text-primary">{t.week}</p>
                  <p className="type-body text-foreground/85 leading-relaxed">
                    {t.what}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* —— Cost & decision —— */}
        <Section className="border-t border-border">
          <Container>
            <p className="type-overline text-primary mb-4">
              Section 3 · The math
            </p>
            <h2 className="type-h2 text-foreground max-w-[26ch]">
              Pilot fee vs. what stays leaking if you wait.
            </h2>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
              <article className="rounded-2xl border border-border bg-card/85 p-7 flex flex-col gap-3">
                <p className="type-overline text-muted-foreground">
                  Pilot fee
                </p>
                <p className="font-display font-bold text-foreground text-[40px] leading-none tracking-[-0.025em]">
                  $4,500
                </p>
                <p className="type-body-sm text-muted-foreground">
                  Three workflows shipped. 30-day operational baseline. No
                  monthly fee yet.
                </p>
                <p className="type-overline text-muted-foreground mt-4">
                  + Operate (optional, month 5+)
                </p>
                <p className="font-display font-bold text-foreground text-[28px] leading-none tracking-[-0.025em]">
                  $2,400 / mo
                </p>
                <p className="type-body-sm text-muted-foreground">
                  Workflow maintenance + new automation added monthly.
                </p>
              </article>

              <article className="rounded-2xl border border-[var(--zeph-danger-500)]/40 bg-card/85 p-7 flex flex-col gap-3">
                <p className="type-overline text-[var(--zeph-danger-500)]">
                  If we don&apos;t ship the pilot
                </p>
                <p className="font-display font-bold text-foreground text-[40px] leading-none tracking-[-0.025em]">
                  $228k <span className="text-muted-foreground text-[24px]">/ year leaks</span>
                </p>
                <p className="type-body-sm text-muted-foreground">
                  At today&apos;s call-back rate, claim-time, and quote
                  follow-up gap. Every month is roughly{" "}
                  <span className="text-foreground font-semibold">$19,000</span>{" "}
                  walking to a competitor.
                </p>
                <p className="type-overline text-[var(--zeph-success-500)] mt-4">
                  Year-1 ROI (recovered / spent)
                </p>
                <p className="font-display font-bold text-foreground text-[40px] leading-none tracking-[-0.025em]">
                  ~4.1×
                </p>
                <p className="type-body-sm text-muted-foreground">
                  $137k recovered on $33k year-1 spend.
                </p>
              </article>
            </div>
          </Container>
        </Section>

        {/* —— CTA —— */}
        <Section className="border-t border-border">
          <Container>
            <div className="rounded-2xl border border-primary/40 bg-gradient-to-br from-[color-mix(in_srgb,var(--primary)_10%,var(--card))] to-[var(--card)] p-10 md:p-14 flex flex-col gap-6 items-start">
              <p className="type-overline text-primary">
                This is what you&apos;ll leave the call with
              </p>
              <h2 className="font-display font-bold text-foreground text-[clamp(28px,4.4vw,52px)] leading-[1.1] tracking-[-0.025em] max-w-[24ch]">
                Want yours? It&apos;s 30 minutes.
              </h2>
              <p className="type-body-lg text-muted-foreground max-w-[58ch]">
                We&apos;ll run the same screen-share, find your version of
                these gaps, and put real dollar values on each one. If we
                can&apos;t find three worth fixing — lunch&apos;s on us.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/#get-started"
                  className="type-button inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap select-none h-12 px-6 text-[15px] bg-primary text-primary-foreground hover:bg-purple-800 transition"
                >
                  Book the 30-min audit
                </a>
                <a
                  href="/"
                  className="type-button inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap select-none h-12 px-6 text-[15px] bg-transparent text-foreground border border-border hover:bg-muted transition"
                >
                  ← Back to homepage
                </a>
              </div>
            </div>
          </Container>
        </Section>
      </main>
    </div>
  );
}
