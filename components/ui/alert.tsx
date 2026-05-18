/**
 * Zephlyn — Alert
 * Inline message block for system feedback. Reads to screen readers via role.
 *
 * Variants: default · success · warning · destructive · info
 *
 * @example
 *   <Alert variant="success">
 *     <AlertTitle>Workflow saved</AlertTitle>
 *     <AlertDescription>You can run it from the dashboard now.</AlertDescription>
 *   </Alert>
 */

import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "default" | "success" | "warning" | "destructive" | "info";

const variants: Record<Variant, string> = {
  default:     "bg-card text-card-foreground border-border",
  success:     "bg-success/8 text-success-foreground border-success/30 [&_.alert-title]:text-success",
  warning:     "bg-warning/8 text-warning-foreground border-warning/30 [&_.alert-title]:text-warning",
  destructive: "bg-destructive/8 text-foreground border-destructive/30 [&_.alert-title]:text-destructive",
  info:        "bg-accent text-accent-foreground border-accent/60",
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

export function Alert({
  className,
  variant = "default",
  ...props
}: AlertProps) {
  // role="alert" announces immediately. Use role="status" if non-critical.
  const role = variant === "destructive" || variant === "warning" ? "alert" : "status";
  return (
    <div
      role={role}
      className={cn(
        "rounded-md border px-4 py-3 type-body-sm",
        "[&_.alert-title]:type-label [&_.alert-title]:mb-0.5",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("alert-title", className)} {...props} />;
}

export function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}
