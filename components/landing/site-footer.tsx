import { Container } from "@/components/ui/container";
import { ZephlynLogo } from "@/components/brand/logo";
import { CONTACT_EMAIL, FOOTER } from "@/components/landing/content";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-background/80 backdrop-blur-md">
      <Container className="max-w-[1240px] py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <ZephlynLogo size={22} boxed />

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                /* -my/py enlarge the tap target to ~44px without moving text */
                className="type-nav -my-2 py-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="type-nav -my-2 py-2 text-muted-foreground link-underline transition-colors hover:text-foreground"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <p className="type-caption mt-8 border-t border-border pt-6 text-muted-foreground">
          {FOOTER.copyright}
        </p>
      </Container>
    </footer>
  );
}
