import { Section, Container } from "@/components/ui/container";
import { HONESTY } from "@/components/landing/content";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14" />
    </svg>
  );
}

export function Honesty() {
  return (
    <Section id="fit" className="relative">
      <Container className="max-w-[1000px]">
        <div className="max-w-[40ch] text-scrim">
          <p className="eyebrow">{HONESTY.eyebrow}</p>
          <h2 className="type-h2 mt-4 text-balance text-foreground">
            {HONESTY.headline}
          </h2>
        </div>
        <p className="type-body-lg mt-5 max-w-[60ch] text-muted-foreground">
          {HONESTY.lead}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* For you */}
          <div className="landing-card p-7 md:p-8">
            <h3 className="type-h4 text-foreground">{HONESTY.forYou.title}</h3>
            <ul className="mt-5 flex flex-col gap-4">
              {HONESTY.forYou.items.map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="text-[var(--zeph-success-500)] dark:text-[var(--zeph-success-300)]">
                    <CheckIcon />
                  </span>
                  <span className="type-body text-foreground/90">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not yet */}
          <div className="landing-card p-7 md:p-8">
            <h3 className="type-h4 text-foreground">{HONESTY.notYet.title}</h3>
            <ul className="mt-5 flex flex-col gap-4">
              {HONESTY.notYet.items.map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="text-muted-foreground">
                    <DashIcon />
                  </span>
                  <span className="type-body text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
