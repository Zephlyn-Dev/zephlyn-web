/**
 * Zephlyn — Input
 * Single-line text input. Pairs with `<Label>` for forms.
 *
 * States: idle · hover · focus · invalid · disabled
 * Use `aria-invalid="true"` to surface a red border on validation failure.
 */

import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, type = "text", ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
          "type-body-sm text-foreground placeholder:text-muted-foreground",
          "transition-[border,box-shadow] duration-150 ease-out",
          "hover:border-purple-300 dark:hover:border-purple-700",
          "focus-visible:outline-none focus-visible:border-ring focus-visible:shadow-focus",
          "aria-invalid:border-destructive aria-invalid:focus-visible:shadow-[0_0_0_3px_rgba(220,38,38,0.3)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

/**
 * Use with Input to provide an accessible label.
 *   <div className="space-y-1.5">
 *     <Label htmlFor="email">Email</Label>
 *     <Input id="email" type="email" />
 *   </div>
 */
export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("type-label text-foreground", className)}
      {...props}
    />
  );
}
