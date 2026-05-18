"use client";

/**
 * <Magnetic /> — wraps any interactive child (typically a button or CTA
 * link) and gently pulls it toward the cursor on hover. The pull is
 * deliberately small (max ~10px) so it reads as polish, not gimmick.
 * Returns to rest with an elastic ease.
 *
 * Disabled on touch devices and reduced-motion users — there's no
 * "cursor" on phones and the wobble adds zero value over a tap-target.
 */

import * as React from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  children: React.ReactNode;
  /** Pull strength multiplier vs. cursor offset (0..0.5). Default 0.28. */
  strength?: number;
  /** Maximum pixel offset before the magnet saturates. Default 12. */
  maxOffset?: number;
  className?: string;
};

export function Magnetic({
  children,
  strength = 0.28,
  maxOffset = 12,
  className,
}: Props) {
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Bail out for users who don't have a real cursor or asked for reduced
    // motion. The check is cheap and `matchMedia` exists in every modern
    // browser we care about.
    const noFinePointer = !window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (noFinePointer || reduceMotion) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      const clamp = (n: number) =>
        Math.max(-maxOffset, Math.min(maxOffset, n));
      gsap.to(el, {
        x: clamp(dx),
        y: clamp(dy),
        duration: 0.6,
        ease: "power3.out",
      });
    };
    const onLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.4)",
      });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength, maxOffset]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-block" }}>
      {children}
    </span>
  );
}
