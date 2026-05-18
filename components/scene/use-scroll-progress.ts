"use client";

import { useEffect, useRef } from "react";

export function useScrollProgress(
  proxyRef: React.RefObject<HTMLElement | null>,
  options: { smoothing?: number } = {}
) {
  // Lower factor = smoother / more easing (slightly laggier).
  // 0.055 cushions sudden scroll inputs so the 3D background never snaps —
  // it eases toward the new target over ~350ms, which keeps the camera
  // motion calm even on aggressive wheel ticks.
  const { smoothing = 0.055 } = options;
  const targetRef = useRef(0);
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const compute = () => {
      const el = proxyRef.current;
      if (!el) {
        targetRef.current = 0;
        return;
      }
      const top = el.offsetTop;
      const max = el.offsetHeight - window.innerHeight;
      if (max <= 0) {
        targetRef.current = 0;
        return;
      }
      const sy = window.scrollY - top;
      targetRef.current = Math.max(0, Math.min(1, sy / max));
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const tick = () => {
      if (reduceMotion) {
        progressRef.current = targetRef.current;
      } else {
        progressRef.current +=
          (targetRef.current - progressRef.current) * smoothing;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    compute();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [proxyRef, smoothing]);

  return { progressRef, targetRef };
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, a: number, b: number) =>
  Math.max(a, Math.min(b, v));
export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
export const subProgress = (start: number, end: number, p: number) =>
  clamp((p - start) / (end - start), 0, 1);
