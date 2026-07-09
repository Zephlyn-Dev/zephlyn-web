"use client";

/**
 * Landing header — boxed logo (purple tile + wordmark) left; "Get in touch"
 * right. No other nav links, per the design; no theme toggle (site is
 * dark-only). Anchored with a stable view-transition name so it never slides
 * during route transitions.
 */

import { ZephlynLogo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/components/landing/content";

export function SiteHeader() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between px-5 md:px-10">
        <a href="#top" aria-label="Zephlyn home" className="rounded-md">
          <ZephlynLogo size={26} boxed />
        </a>
        <ButtonLink href={`mailto:${CONTACT_EMAIL}`} variant="primary" size="sm">
          Get in touch
        </ButtonLink>
      </div>
    </header>
  );
}
