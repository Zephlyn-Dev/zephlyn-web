import { Constellation } from "@/components/landing/constellation";
import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { Scatter } from "@/components/landing/scatter";
import { Services } from "@/components/landing/services";
import { Connection } from "@/components/landing/connection";
import { Honesty } from "@/components/landing/honesty";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { SiteFooter } from "@/components/landing/site-footer";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";

export default function HomePage() {
  return (
    <>
      {/* Background layer — one continuous SVG constellation behind everything. */}
      <Constellation />

      {/* Content layer — sits above the constellation; transparent so the
          starfield shows through except where cards / scrims protect text. */}
      <div className="relative z-10">
        <SiteHeader />
        <main className="pt-16">
          <Hero />
          <RevealOnScroll>
            <Scatter />
          </RevealOnScroll>
          <RevealOnScroll>
            <Services />
          </RevealOnScroll>
          <RevealOnScroll>
            <Connection />
          </RevealOnScroll>
          <RevealOnScroll>
            <Honesty />
          </RevealOnScroll>
          <RevealOnScroll>
            <Faq />
          </RevealOnScroll>
          <RevealOnScroll>
            <FinalCta />
          </RevealOnScroll>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
