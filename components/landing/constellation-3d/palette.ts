/**
 * 3D scene palette + quality tiers + ambient cloud generation.
 *
 * The 3D enhancement runs in DARK MODE ONLY (light mode serves the SVG — the
 * sanctioned escape hatch, see constellation-layer.tsx). So these colors mirror
 * the dark constellation tokens from globals.css:
 *   star   #F8F4E8  (--constellation-star, warm white)
 *   line   #7C3AED  (--primary dark, the purple through-line)
 *
 * TUNING — the constants below control how busy / calm the field reads. Lower
 * STAR_SIZE / bloom / AMBIENT_LAYERS[].opacity to calm it; raise TWINKLE/DRIFT
 * amplitudes to liven it.
 */

import * as THREE from "three";
import { mulberry32 } from "../constellation-data";

export const COLORS = {
  star: new THREE.Color("#F8F4E8"),
  starBright: new THREE.Color("#FBF8F0"), // glow stars — warm, NOT pure white
  line: new THREE.Color("#7C3AED"),
};

/** Scroll fraction over which a star/line resolves — matches the SVG REVEAL_BAND. */
export const REVEAL_BAND = 0.05;

/* Narrative diamond sizing (world units, at full reveal). Glow stars read a bit
   larger; `perR` adds per-star variation from the star's radius so they aren't
   all the same size. Kept small so they're background accents, not blobs. */
export const STAR_SIZE = {
  base: 0.058, // regular star
  glow: 0.115, // glow star
  perR: 0.02, // × (r - 1.4) added on top
};

/* Per-narrative-star twinkle (opacity shimmer). Subtle and slow. */
export const STAR_TWINKLE = { amp: 0.26, speed: 0.65 };

/* Ambient field as 3 depth layers (far/tiny/faint → near/larger/brighter) so
   point sizes vary and there's a sense of depth. Each layer twinkles (whole-
   layer opacity shimmer) at its own phase so the field never pulses in unison.
   Each layer also DRIFTS: it slowly slides along its own elliptical path (dx/dy
   world units, dSpeed rad/s, dPhase). The near layer drifts most → parallax
   depth. This is the idle motion you see when not scrolling. Raise dx/dy
   (distance) or dSpeed (pace) to make it more obvious; lower them to calm it. */
export const AMBIENT_LAYERS = [
  { frac: 0.54, size: 0.05, opacity: 0.4, seed: 0xa1f3, twAmp: 0.14, twSpeed: 0.25, phase: 0.0, dx: 0.8, dy: 0.55, dSpeed: 0.14, dPhase: 0.0 },
  { frac: 0.32, size: 0.095, opacity: 0.52, seed: 0xb2e7, twAmp: 0.18, twSpeed: 0.36, phase: 1.9, dx: -1.2, dy: 0.85, dSpeed: 0.17, dPhase: 2.1 },
  { frac: 0.14, size: 0.155, opacity: 0.66, seed: 0xc35d, twAmp: 0.24, twSpeed: 0.47, phase: 3.4, dx: 1.7, dy: -1.1, dSpeed: 0.12, dPhase: 4.0 },
];

export type Tier = {
  ambient: number; // ambient point count
  dprMax: number; // pixel-ratio cap
  bloom: number; // bloom intensity
};

export const TIERS: Record<"high" | "mid", Tier> = {
  high: { ambient: 1200, dprMax: 1.75, bloom: 0.5 },
  mid: { ambient: 650, dprMax: 1.25, bloom: 0.35 },
};

/** Upfront tier pick from coarse device signals. Runtime PerformanceMonitor
 *  scales further down from here if frames sag. */
export function pickTier(): Tier {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory;
  const strong = cores >= 8 && (mem === undefined || mem >= 8);
  return strong ? TIERS.high : TIERS.mid;
}

/** Deterministic volumetric ambient star cloud the camera flies through.
 *  Spans wider than the narrative constellation, deeper in z. `seed` lets each
 *  depth layer have an independent distribution. */
export function makeAmbient(count: number, seed: number): Float32Array {
  const rand = mulberry32(seed);
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rand() - 0.5) * 64; // x  ±32
    pos[i * 3 + 1] = (rand() - 0.5) * 46; // y  ±23
    pos[i * 3 + 2] = -42 + rand() * 66; // z  [-42, 24]
  }
  return pos;
}
