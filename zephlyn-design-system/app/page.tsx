import { Container, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ZephlynLogo, ZephlynMark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Zephlyn — Landing page (App Router demo)
 *
 * This is a starter skeleton, not a finished marketing site. It demonstrates
 * how to compose pages using only the design system primitives — every color
 * and spacing value flows from `app/globals.css` semantic tokens.
 */
export default function HomePage() {
  return (
    <>
      {/* ——— Top nav ——— */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
        <Container>
          <nav className="flex h-16 items-center justify-between gap-6">
            <ZephlynLogo size={26} />
            <ul className="hidden md:flex items-center gap-6 type-nav text-muted-foreground">
              <li><a href="#product"  className="hover:text-foreground transition-colors">Product</a></li>
              <li><a href="#workflows" className="hover:text-foreground transition-colors">Workflows</a></li>
              <li><a href="#pricing"  className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#docs"     className="hover:text-foreground transition-colors">Docs</a></li>
            </ul>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="ghost" size="sm">Sign in</Button>
              <Button size="sm">Start free</Button>
            </div>
          </nav>
        </Container>
      </header>

      {/* ——— Hero ——— */}
      <Section density="loose" className="relative overflow-hidden">
        <Container className="relative">
          <div className="max-w-3xl">
            <Badge variant="info" className="mb-6">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              New · Workflow Echo v4 is live
            </Badge>
            <h1 className="type-display text-foreground">
              Automation that actually{" "}
              <span className="text-primary">listens.</span>
            </h1>
            <p className="type-body-lg mt-6 max-w-2xl text-muted-foreground">
              Zephlyn watches every signal your team produces and quietly fires
              the right workflow — only when it's actually needed. Built for
              service businesses, not labs.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg">Start free →</Button>
              <Button size="lg" variant="outline">See a workflow run</Button>
            </div>
            <p className="type-overline mt-10">
              SOC 2 Type II · EU + US · 180+ integrations · v4.2 · May 2026
            </p>
          </div>
        </Container>
      </Section>

      {/* ——— Feature grid ——— */}
      <Section id="product" className="border-t border-border bg-muted/40">
        <Container>
          <div className="max-w-2xl">
            <p className="type-overline text-primary">PLATFORM</p>
            <h2 className="type-h2 mt-3">Three pieces. One quiet loop.</h2>
            <p className="type-body mt-4 text-muted-foreground">
              Every Zephlyn workflow follows the same shape — listen, decide,
              act — so what you build stays legible six months later.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                tag: "01 · Listen",
                title: "Signals from anywhere",
                copy: "Inbox, calendar, CRM, support tools, webhooks. If it makes noise, Zephlyn hears it.",
              },
              {
                tag: "02 · Decide",
                title: "A small, sharp brain",
                copy: "Rules first, models second. Decisions are explainable and easy to override.",
              },
              {
                tag: "03 · Act",
                title: "Run the right play",
                copy: "Fire a workflow, draft a reply, schedule the work — only if it should actually happen.",
              },
            ].map((f) => (
              <Card key={f.tag}>
                <CardHeader>
                  <p className="type-overline">{f.tag}</p>
                  <CardTitle className="mt-1">{f.title}</CardTitle>
                  <CardDescription>{f.copy}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="ghost" size="sm">
                    Learn more →
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* ——— Footer ——— */}
      <footer className="border-t border-border">
        <Container>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-10">
            <ZephlynLogo size={22} />
            <p className="type-caption">
              © 2026 Zephlyn. Automation, on autopilot.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ZephlynMark size={20} className="opacity-50" />
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}
