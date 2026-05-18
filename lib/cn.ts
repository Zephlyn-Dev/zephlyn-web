import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Concatenates conditional class names and de-duplicates Tailwind utilities.
 * Always use this when composing className strings in components.
 *
 * @example
 *   <div className={cn("p-4 text-foreground", isActive && "bg-primary")} />
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
