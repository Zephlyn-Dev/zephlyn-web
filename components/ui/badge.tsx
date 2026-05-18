/**
 * Zephlyn — Badge
 * Small inline status / category pill.
 *
 * Variants: default · secondary · outline · success · warning · destructive · info
 */

import * as React from "react";
import { cn } from "@/lib/cn";

type Variant =
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "destructive"
  | "info";

const variants: Record<Variant, string> = {
  default:     "bg-primary text-primary-foreground",
  secondary:   "bg-secondary text-secondary-foreground",
  outline:     "border border-border text-foreground",
  success:     "bg-success/12 text-success border border-success/25",
  warning:     "bg-warning/12 text-warning border border-warning/25",
  destructive: "bg-destructive/12 text-destructive border border-destructive/25",
  info:        "bg-accent text-accent-foreground",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
        "type-caption font-semibold",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
