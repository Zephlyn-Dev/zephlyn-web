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
    "shadow-[0_4px_12px_-4px_color-mix(in_srgb,var(--primary)_40%,transparent)]",
    "hover:bg-purple-800",
    "hover:-translate-y-[1px]",
    "hover:shadow-[0_10px_24px_-8px_color-mix(in_srgb,var(--primary)_55%,transparent)]",
    "active:bg-purple-900 active:translate-y-0 active:scale-[0.97]",
    "active:shadow-[0_2px_6px_-2px_color-mix(in_srgb,var(--primary)_45%,transparent)]",
  ].join(" "),
  secondary: [
    "bg-secondary text-secondary-foreground",
    "hover:bg-purple-100 dark:hover:bg-purple-900",
    "hover:-translate-y-[1px]",
    "active:translate-y-0 active:scale-[0.97]",
  ].join(" "),
  outline: [
    "bg-transparent text-foreground border border-border",
    "hover:bg-muted hover:border-purple-300 dark:hover:border-purple-700",
    "hover:-translate-y-[1px]",
    "active:translate-y-0 active:scale-[0.97]",
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

/**
 * The single source of truth for button styling. Use it when you need the
 * button look on a non-`<button>` element (e.g. an `<a>`), so every clickable
 * on the page resolves to the same variants instead of bespoke one-offs.
 */
export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

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
        className={buttonVariants({ variant, size, className })}
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

export interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
}

/**
 * Anchor styled as a button — for links that navigate (mailto:, in-page
 * anchors, routes). Shares the exact variants/sizes with <Button> so the
 * page has a single button primitive, not parallel styles.
 */
export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    { className, variant = "primary", size = "md", children, ...props },
    ref
  ) {
    return (
      <a
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      >
        {children}
      </a>
    );
  }
);
