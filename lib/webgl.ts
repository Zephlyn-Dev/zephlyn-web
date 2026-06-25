/**
 * Zephlyn — WebGL capability + device gating for the 3D constellation.
 *
 * The 3D layer is a progressive enhancement; the SVG constellation is the
 * guaranteed baseline. This module answers ONE question — "should this device
 * attempt 3D?" — using upfront detection. Runtime failures (lost context, init
 * throw) are handled separately by the error boundary in constellation-layer.
 *
 * All checks are browser-only; call from a client effect, never during SSR.
 */

/** True if a WebGL (1 or 2) context can actually be created. */
export function hasWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

/** Coarse "is this a clearly low-powered machine" heuristic. Intentionally
 *  lenient — adaptive quality scales the scene down further at runtime; this
 *  only rules out the weakest devices up front. */
export function isLowPowerDevice(): boolean {
  if (typeof navigator === "undefined") return true;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return true;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2)
    return true;
  return false;
}

function mql(query: string): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.(query).matches;
}

export function prefersReducedMotion(): boolean {
  return mql("(prefers-reduced-motion: reduce)");
}

/** Phones and (by default) tablets: a full-page WebGL field is a battery / perf
 *  liability and the SVG already looks great there. Treat any narrow viewport
 *  or touch-primary device as "mobile". */
export function isMobileLike(): boolean {
  const narrow = mql("(max-width: 767px)");
  const touchPrimary = mql("(pointer: coarse)") && !mql("(pointer: fine)");
  return narrow || touchPrimary;
}

/**
 * The upfront gate. Returns true only for capable, non-reduced-motion,
 * desktop-class machines with working WebGL. Everything else gets the SVG.
 */
export function canRender3D(): boolean {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false; // the flying camera IS the 3D
  if (isMobileLike()) return false; // mobile/tablet → SVG
  if (isLowPowerDevice()) return false;
  if (!hasWebGL()) return false;
  return true;
}
