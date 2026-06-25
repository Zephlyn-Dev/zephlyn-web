import { Section, Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { ZephlynMark } from "@/components/brand/logo";
import { CONTACT_EMAIL, CTA } from "@/components/landing/content";

export function FinalCta() {
  return (
    <Section id="contact" className="relative">
      <Container className="max-w-[1000px]">
        <div className="cta-band flex flex-col items-center gap-6 px-6 py-14 text-center md:px-12 md:py-20">
          {/* The constellation resolves into a calm cluster behind this mark.
              Logo-agnostic: we anchor the resolved field to the logo's
              position rather than tracing its geometry, so swapping the
              logo later doesn't break the section. The mark animates here (hub
              breathes, dots twinkle, soft glow) as the brand "resolve" beat. */}
          <ZephlynMark size={80} bold animated className="text-foreground" />

          <h2 className="type-h1 max-w-[18ch] text-balance text-foreground">
            {CTA.headline}
          </h2>
          <p className="type-body-lg max-w-[52ch] text-balance text-muted-foreground">
            {CTA.subhead}
          </p>

          <div className="mt-2 flex flex-col items-center gap-4">
            <ButtonLink href={`mailto:${CONTACT_EMAIL}`} size="lg">
              {CTA.primaryCta}
            </ButtonLink>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="type-body font-medium text-purple-700 link-underline dark:text-purple-400"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* Was ink-faint in the mockup (failed AA); uses muted-foreground
              here so the line stays legible in both themes. */}
          <p className="type-body-sm mt-6 max-w-[60ch] text-balance text-muted-foreground">
            {CTA.founders}
          </p>
        </div>
      </Container>
    </Section>
  );
}
