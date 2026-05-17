/**
 * Zephlyn — Button
 *
 * Variants:  primary · secondary · outline · ghost · destructive · link
 * Sizes:     sm · md · lg · icon
 *
 * All variants share: hover · active · focus-visible · disabled · loading.
 * Loading state shows a spinner and disables the button without changing width.
 *
 * @example
 *   <Button>Get started</Button>
 *   <Button variant="outline" size="sm">Learn more</Button>
 *   <Button variant="primary" loading>Saving…</Button>
 */

import * as React from "react";
import { cn } from "@/lib/cn";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link";
type Size = "sm" | "md" | "lg" | "icon";

const base = [
  "type-button inline-flex items-center justify-center gap-2",
  "rounded-md whitespace-nowrap select-none",
  "transition-[background,color,box-shadow,transform] duration-150 ease-out",
  "focus-visible:outline-none focus-visible:shadow-focus",
  "disabled:opacity-50 disabled:pointer-events-none",
  "[&_svg]:size-4 [&_svg]:shrink-0",
].join(" ");

const variants: Record<Variant, string> = {
  primary: [
    "bg-primary text-primary-foreground",
    "hover:bg-purple-800",
    "active:bg-purple-900 active:scale-[0.98]",
  ].join(" "),
  secondary: [
    "bg-secondary text-secondary-foreground",
    "hover:bg-purple-100 dark:hover:bg-purple-900",
    "active:scale-[0.98]",
  ].join(" "),
  outline: [
    "bg-transparent text-foreground border border-border",
    "hover:bg-muted hover:border-purple-300 dark:hover:border-purple-700",
    "active:scale-[0.98]",
  ].join(" "),
  ghost: [
    "bg-transparent text-foreground",
    "hover:bg-muted",
    "active:scale-[0.98]",
  ].join(" "),
  destructive: [
    "bg-destructive text-destructive-foreground",
    "hover:opacity-90",
    "active:scale-[0.98]",
  ].join(" "),
  link: [
    "bg-transparent text-primary underline-offset-4 px-0",
    "hover:underline",
  ].join(" "),
};

const sizes: Record<Size, string> = {
  sm:   "h-8 px-3 text-[13px]",
  md:   "h-10 px-4",
  lg:   "h-12 px-6 text-[15px]",
  icon: "size-10 p-0",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? <Spinner /> : null}
        {children}
      </button>
    );
  }
);
