/**
 * 3D scene palette + quality tiers + starfield generation.
 *
 * The site is DARK-ONLY: warm-white emissive stars, additive blending, bloom.
 * Colors mirror the dark constellation tokens (--constellation-star #F8F4E8).
 * (SceneTheme keeps its blending/bloom knobs so an alternate palette stays a
 * data change, not a rebuild.)
 *
 * TUNING — the constants below control how busy / fast the flight reads.
 * Lower SPEED.idle / SPEED.gain to calm the travel; raise AMBIENT_LAYERS
 * opacity / STAR_SIZE to brighten the field.
 */

import { mulberry32 } from "../constellation-data";
import { isMobileLike } from "@/lib/webgl";

/** Camera is fixed near the origin; the WORLD travels past it. */
export const CAMERA = { z: 6, fov: 60 };

/** World units the corridor (shapes + plexus) advances over the full scroll. */
export const TRAVEL = 100;

/** Wrapping ambient starfield: stars recycle over `length`, wrapping `ahead`
 *  world units behind the camera so they exit the frustum before respawning. */
export const WRAP = { length: 130, ahead: 8 };

/** Forward-flight speed (world units/s): a constant idle drift plus a damped
 *  boost from scroll velocity — scrolling makes space stream faster, capped so
 *  it never turns into a nauseating warp. */
export const SPEED = { idle: 0.8, gain: 0.35, cap: 14, smooth: 2.5 };

/** Scroll fraction over which a star/line resolves — matches the SVG. */
export const REVEAL_BAND = 0.05;

/* Narrative diamond sizing (world units, at full reveal). */
export const STAR_SIZE = {
  base: 0.07,
  glow: 0.13,
  perR: 0.02, // × (r - 1.4) added on top
};

/* Per-narrative-star twinkle (opacity shimmer). Subtle and slow. */
export const STAR_TWINKLE = { amp: 0.26, speed: 0.65 };

/* Plexus field rendering. `band` = scroll fraction over which a link draws;
   `densify` ramps overall link visibility up across the page so connections
   read sparse at the top and woven by the end. */
export const PLEXUS = {
  band: 0.06,
  starSize: 0.1,
  starOpacity: 0.5,
  lineAlpha: 0.55,
  densifyFrom: 0.05,
  densifyTo: 0.75,
  densifyFloor: 0.35,
};

export type SceneTheme = {
  star: string;
  starBright: string;
  line: string;
  fog: string;
  fogNear: number;
  fogFar: number;
  /** additive (emissive, dark) vs normal alpha (ink, light) blending */
  additive: boolean;
  /** multiplies the tier's bloom intensity; 0 disables bloom entirely */
  bloom: number;
  /** line alpha multiplier (light mode lines sit quieter) */
  lineMul: number;
};

export const SCENE_THEME: SceneTheme = {
  star: "#F8F4E8",
  starBright: "#FBF8F0",
  line: "#7C3AED",
  fog: "#08080C",
  fogNear: 24,
  fogFar: 118,
  additive: true,
  bloom: 1,
  lineMul: 1,
};

/* Ambient wrapping field as 3 depth layers (far/tiny/faint → near/larger/
   brighter) so point sizes vary as they stream past. Each layer twinkles
   (whole-layer opacity shimmer) at its own phase, and drifts laterally on a
   slow elliptical path for life when the flight idles. */
export const AMBIENT_LAYERS = [
  { frac: 0.54, size: 0.045, opacity: 0.38, seed: 0xa1f3, twAmp: 0.14, twSpeed: 0.25, phase: 0.0, dx: 0.7, dy: 0.5, dSpeed: 0.14, dPhase: 0.0 },
  { frac: 0.32, size: 0.09, opacity: 0.5, seed: 0xb2e7, twAmp: 0.18, twSpeed: 0.36, phase: 1.9, dx: -1.0, dy: 0.7, dSpeed: 0.17, dPhase: 2.1 },
  { frac: 0.14, size: 0.15, opacity: 0.62, seed: 0xc35d, twAmp: 0.24, twSpeed: 0.47, phase: 3.4, dx: 1.4, dy: -0.9, dSpeed: 0.12, dPhase: 4.0 },
];

export type Tier = {
  ambient: number; // ambient point count
  plexus: number; // plexus star count
  dprMax: number; // pixel-ratio cap
  bloom: number; // bloom intensity
  aa: boolean; // canvas antialias
};

export const TIERS: Record<"high" | "mid" | "low", Tier> = {
  high: { ambient: 1300, plexus: 84, dprMax: 1.75, bloom: 0.55, aa: true },
  mid: { ambient: 750, plexus: 60, dprMax: 1.25, bloom: 0.4, aa: true },
  low: { ambient: 360, plexus: 36, dprMax: 1, bloom: 0, aa: false },
};

/** Upfront tier pick from coarse device signals. Phones/tablets get the `low`
 *  tier (few stars, dpr 1, no bloom); the runtime PerformanceMonitor falls all
 *  the way back to the SVG if even that sags. */
export function pickTier(): Tier {
  if (isMobileLike()) return TIERS.low;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory;
  const strong = cores >= 8 && (mem === undefined || mem >= 8);
  return strong ? TIERS.high : TIERS.mid;
}

/** Deterministic wrapping star cloud. Base z lives in [0, WRAP.length); the
 *  scene maps it to an effective z behind/ahead of the camera each frame as
 *  travel accumulates. `seed` lets each depth layer distribute independently. */
export function makeAmbient(count: number, seed: number): Float32Array {
  const rand = mulberry32(seed);
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rand() - 0.5) * 32; // x  ±16
    pos[i * 3 + 1] = (rand() - 0.5) * 20; // y  ±10
    pos[i * 3 + 2] = rand() * WRAP.length; // base z, wrapped at runtime
  }
  return pos;
}
