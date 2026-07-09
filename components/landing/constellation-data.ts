/**
 * Zephlyn — Constellation data (single source of truth)
 *
 * Star positions + the connection list, shared by BOTH renderers:
 *   - components/landing/constellation.tsx        (SVG, the shipped baseline)
 *   - components/landing/constellation-3d/*       (WebGL progressive enhancement)
 *
 * Because both consume this module, the 3D and SVG draw the *same* constellation
 * — same stars, same connections, same scroll beats — so a fallback at any
 * moment shows a visually consistent picture, just in 2D.
 *
 * Coordinates are authored in the SVG's 0..1000 viewBox (x, y). The SVG reads
 * x/y only; the added `z` (world units) is depth for the 3D camera fly-through
 * and is ignored by the SVG. No framework imports here — keep it portable.
 */

/* Deterministic PRNG so SSR and client render identical fields (no hydration
   mismatch). Shared by both renderers. */
export function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Star = {
  /** viewBox x (0..1000) */
  x: number;
  /** viewBox y (0..1000) */
  y: number;
  /** depth in world units (3D only; SVG ignores this) */
  z: number;
  /** glyph radius (viewBox units) */
  r: number;
  /** resolved opacity */
  op: number;
  /** scroll fraction at which the star resolves (negative => visible from top) */
  rev: number;
  /** glow stars get a soft halo / brighter emissive */
  glow: boolean;
};

/* The curated narrative constellation (x, y, r, op, rev, glow). z is appended
   below so the depth values live in one deterministic place. */
const RAW: Omit<Star, "z">[] = [
  { x: 140, y: 160, r: 2.4, op: 0.95, rev: -0.2, glow: true },
  { x: 300, y: 120, r: 1.5, op: 0.6, rev: 0.05, glow: false },
  { x: 470, y: 210, r: 2.0, op: 0.9, rev: -0.2, glow: true },
  { x: 250, y: 300, r: 1.4, op: 0.55, rev: 0.07, glow: false },
  { x: 120, y: 420, r: 1.8, op: 0.8, rev: 0.09, glow: false },
  { x: 380, y: 440, r: 2.6, op: 0.95, rev: -0.2, glow: true },
  { x: 560, y: 360, r: 1.5, op: 0.6, rev: 0.1, glow: false },
  { x: 700, y: 180, r: 2.2, op: 0.9, rev: -0.2, glow: true },
  { x: 840, y: 260, r: 1.5, op: 0.6, rev: 0.12, glow: false },
  { x: 660, y: 470, r: 2.0, op: 0.9, rev: -0.2, glow: true },
  { x: 820, y: 460, r: 1.4, op: 0.55, rev: 0.14, glow: false },
  { x: 200, y: 580, r: 1.7, op: 0.7, rev: 0.12, glow: false },
  { x: 420, y: 620, r: 2.3, op: 0.9, rev: -0.2, glow: true },
  { x: 600, y: 640, r: 1.6, op: 0.65, rev: 0.16, glow: false },
  { x: 770, y: 620, r: 2.0, op: 0.85, rev: 0.1, glow: false },
  { x: 300, y: 760, r: 1.5, op: 0.6, rev: 0.18, glow: false },
  { x: 500, y: 800, r: 2.4, op: 0.95, rev: -0.2, glow: true },
  { x: 690, y: 800, r: 1.6, op: 0.65, rev: 0.2, glow: false },
  { x: 880, y: 720, r: 1.7, op: 0.7, rev: 0.16, glow: false },
  { x: 150, y: 720, r: 1.4, op: 0.55, rev: 0.18, glow: false },
  { x: 470, y: 520, r: 1.6, op: 0.65, rev: 0.12, glow: false },
  { x: 920, y: 520, r: 1.5, op: 0.55, rev: 0.16, glow: false },
];

/* Bake a deterministic depth (world units) onto each star. A dedicated RNG seed
   keeps these stable and independent of any other random field. */
const rngZ = mulberry32(0x2ad53);
export const STARS: Star[] = RAW.map((s) => ({
  ...s,
  z: Math.round((-0.25 + rngZ()) * 16 * 100) / 100, // ≈ [-4, 12] world units
}));

/* [fromIndex, toIndex, threshold] — the connection draws when scroll passes
   `threshold` (0..1). Same list, same beats, in both renderers. */
export const EDGES: Array<[number, number, number]> = [
  [0, 1, 0.14], [1, 2, 0.18], [2, 6, 0.26], [6, 5, 0.3], [5, 3, 0.22], [3, 0, 0.16],
  [3, 4, 0.2], [4, 11, 0.34], [2, 7, 0.24], [7, 8, 0.3], [8, 10, 0.42], [6, 9, 0.32],
  [9, 10, 0.46], [9, 20, 0.38], [20, 5, 0.36], [20, 13, 0.5], [13, 12, 0.48],
  [12, 11, 0.46], [11, 19, 0.56], [12, 15, 0.58], [15, 16, 0.64], [16, 13, 0.6],
  [16, 17, 0.68], [17, 14, 0.66], [14, 18, 0.72], [18, 21, 0.78], [14, 21, 0.74],
  [13, 17, 0.7], [20, 6, 0.42], [9, 14, 0.62], [16, 19, 0.84], [21, 10, 0.88],
  [0, 4, 0.92],
];

/* ----------------------------------------------------------------------------
 * 2D viewBox → 3D world mapping. The SVG and the 3D scene therefore agree on
 * where each star is; the 3D just adds depth and a camera that travels through.
 * -------------------------------------------------------------------------- */
export const WORLD_SCALE = 42; // viewBox units per world unit (x/y span ≈ ±12)

export function starToWorld(s: Star): [number, number, number] {
  // viewBox y is top-down; world y is bottom-up → flip.
  return [(s.x - 500) / WORLD_SCALE, -(s.y - 500) / WORLD_SCALE, s.z];
}
