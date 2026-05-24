/**
 * "Who this is for · Who this isn't for" — two-column qualifier band.
 *
 * Built to do two jobs at once:
 *   1. Self-selection — bad-fit leads bounce, good-fit leads recognise
 *      themselves and double down. Conversions get cleaner.
 *   2. Trust — telling a contractor "we won't be useful if X" reads as
 *      respect for their time, which agency-land rarely earns.
 *
 * Pure static section. No client JS.
 */

import { Container, Section } from "@/components/ui/container";

const FOR_ITEMS: string[] = [
  "You run a home-service shop and admin work is starting to slow the business down.",
  "You're already on a CRM or field-service tool — ServiceTitan, Jobber, Housecall Pro, or similar.",
  "Leads are coming in faster than your team can answer them, and handoffs between sales, scheduling, and ops are getting messy.",
  "You want workflows that run on the tools you already pay for — not a new platform to learn.",
];

const NOT_FOR_ITEMS: string[] = [
  "You're under $500k revenue or haven't set up any kind of CRM yet — start there first, we'll be here when you're ready.",
  "You want a monthly retainer for ads, content, or paid acquisition. We don't do marketing services.",
  "You expect Zephlyn to replace dispatch, your CSRs, or your sales team. Automation makes them better, not redundant.",
  "You're pricing-shopping against a $79/mo SaaS subscription. We build custom workflows; we are not a self-serve tool.",
];

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 mt-0.5 text-[var(--zeph-success-500)]"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.6 2.6L16 9.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 mt-0.5 text-muted-foreground"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </svg>
  );
}

export function Qualifier() {
  return (
    <Section id="qualifier" className="border-t border-border">
      <Container>
        <p className="type-overline text-primary mb-4">Is this for you?</p>
        <h2 className="type-h2 text-foreground max-w-[22ch]">
          Honest about who Zephlyn fits — and who it doesn&apos;t.
        </h2>
        <p className="type-body-lg text-muted-foreground mt-5 max-w-[58ch]">
          A bad-fit pilot wastes everyone&apos;s time. So here&apos;s the
          line, drawn before the call.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-5">
          {/* —— FOR —— */}
          <article className="shimmer-border rounded-2xl border border-[var(--zeph-success-500)]/30 bg-card/85 p-7 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-0.5">
            <header className="flex items-center gap-2.5">
              <span
                className="inline-flex items-center justify-center size-7 rounded-full"
                style={{
                  background:
                    "color-mix(in srgb, var(--zeph-success-500) 18%, transparent)",
                  color: "var(--zeph-success-500)",
                }}
                aria-hidden
              >
                <CheckIcon />
              </span>
              <h3 className="font-display font-semibold text-foreground text-[20px] tracking-[-0.02em]">
                Built for you if…
              </h3>
            </header>
            <ul className="flex flex-col gap-3.5">
              {FOR_ITEMS.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-3 type-body-sm text-foreground/90 leading-snug"
                >
                  <CheckIcon />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* —— NOT FOR —— */}
          <article className="shimmer-border rounded-2xl border border-border bg-card/60 p-7 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-0.5">
            <header className="flex items-center gap-2.5">
              <span
                className="inline-flex items-center justify-center size-7 rounded-full bg-muted text-muted-foreground"
                aria-hidden
              >
                <XIcon />
              </span>
              <h3 className="font-display font-semibold text-foreground/85 text-[20px] tracking-[-0.02em]">
                Not the right fit if…
              </h3>
            </header>
            <ul className="flex flex-col gap-3.5">
              {NOT_FOR_ITEMS.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-3 type-body-sm text-muted-foreground leading-snug"
                >
                  <XIcon />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Container>
    </Section>
  );
}
