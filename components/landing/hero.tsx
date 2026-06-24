import { Section, Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { CONTACT_EMAIL, HERO } from "@/components/landing/content";

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Hero() {
  return (
    <Section id="top" density="loose" className="relative">
      <Container className="max-w-[920px]">
        <div className="text-scrim flex flex-col items-center pt-10 text-center md:pt-16">
          <p className="eyebrow inline-flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-1.5 rounded-full bg-primary shadow-[0_0_10px_1px_var(--primary)]"
            />
            {HERO.eyebrow}
          </p>

          <h1 className="type-display mt-6 max-w-[16ch] text-balance text-foreground">
            {HERO.headline}
          </h1>

          <p className="type-body-lg mt-6 max-w-[56ch] text-balance text-muted-foreground">
            {HERO.subhead}
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <ButtonLink href={`mailto:${CONTACT_EMAIL}`} size="lg">
              {HERO.primaryCta}
              <ArrowRight />
            </ButtonLink>
            <ButtonLink href="#how" variant="outline" size="lg">
              {HERO.secondaryCta}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
