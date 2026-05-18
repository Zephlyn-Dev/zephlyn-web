/**
 * Zephlyn — Layout primitives
 *
 *   <Container>  — page max-width + horizontal padding
 *   <Section>    — vertical rhythm between page blocks
 *
 * Use Section > Container in marketing layouts.
 * In dashboards, use Container alone with tighter `py`.
 */

import * as React from "react";
import { cn } from "@/lib/cn";

export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--container-7xl,1280px)]",
        "px-[var(--zeph-page-padding-x)]",
        className
      )}
      {...props}
    />
  );
}

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  /** Visual density. `tight` for dashboards, `default` for marketing, `loose` for hero. */
  density?: "tight" | "default" | "loose";
};

export function Section({
  className,
  density = "default",
  ...props
}: SectionProps) {
  const py = {
    tight:   "py-8 md:py-12",
    default: "py-[var(--zeph-section-py)]",
    loose:   "py-20 md:py-32",
  }[density];
  return <section className={cn(py, className)} {...props} />;
}
