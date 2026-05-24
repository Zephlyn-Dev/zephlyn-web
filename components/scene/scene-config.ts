"use client";

export const BRAND = {
  ink:    0x0A0517,
  paper:  0xFBFAFE,
  p100:   0xEDE6FF,
  p200:   0xD4C2FF,
  p300:   0xB69AFF,
  p400:   0x9B6BFF,
  p500:   0x7C3AED,
  p600:   0x5B2BE0,
  p700:   0x4F1DD0,
  p800:   0x3F1DA8,
  p900:   0x2C1271,
  p950:   0x1B0B3A,
} as const;

/**
 * Camera path — globe (at world z=-86, y=-1.8 to give top-half framing)
 * arrives close by scroll 2 (p≈0.28), camera pans during scroll 3
 * (p≈0.42), then holds steady for the workflow/tools dashboards.
 * Stage D (cube network) was removed — journey ends at the globe.
 */
export const CAMERA_PATH: Array<{
  p: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
}> = [
  // Hero
  // STRICTLY MONOTONIC story-driven camera:
  //   FOV   : 55 → 53 → 52 → 50 → 36 (valley, tight zoom)
  //                              → 42 → 46 → 48 → 50 → 54 → 60 → 64 (widen)
  //   X     : 0 (centered) → -2.8 → +2.8 (the pan)
  //                       → +3.5 → +4 → +4.5 → +5 → +5.5 (drift right only)
  //                       → +4 → +2 → 0 (audit finale, single direction back)
  //   Y     : 0 → 0 → 3 → 4 → 5 → 6 → 8 → 11 → 14 (continuous rise)
  //   Z     : 8 → -10 → -77 → -90 → -110 → -120 (continuous forward)
  //                                       → -115 → -90 (controlled pullback at finale)
  // Camera never reverses any axis except for the deliberate audit pullback.

  { p: 0.00, pos: [0, 0.2, 8],      look: [0, 0, 0],         fov: 55 },
  { p: 0.10, pos: [0, 0.1, 5.5],    look: [0, 0, 0],         fov: 53 },
  // Scroll 2 — Problem dashboard. Camera now begins LIFTING and re-aiming
  // gradually toward the globe so the entry into Outcome has no "hop".
  { p: 0.18, pos: [0, 0,   2],      look: [0, 0,    -30],    fov: 53 },
  { p: 0.24, pos: [0, 0.2, -10],    look: [0, -0.1, -50],    fov: 52 },
  // Scroll 3 — Outcome: a single-direction ORBIT around the globe.
  //   • Look-at locks at the globe center, but it ARRIVES there gradually
  //     (no sudden snap from z=-30 to z=-86)
  //   • Camera Y rises continuously through every keyframe — no step
  //   • Orbit easing: 0 → -0.6 → -1.6 → -2.6 (gentle ramp-in to the L pan)
  { p: 0.28, pos: [0,    0.6, -25], look: [0, -0.3, -68],    fov: 51 },
  { p: 0.31, pos: [0,    1.1, -42], look: [0, -0.5, -82],    fov: 49 },
  { p: 0.33, pos: [-0.6, 1.6, -55], look: [0, -0.6, -86],    fov: 47 },
  { p: 0.35, pos: [-1.6, 2.0, -65], look: [0, -0.6, -86],    fov: 44 },
  { p: 0.37, pos: [-2.6, 2.4, -72], look: [0, -0.6, -86],    fov: 42 },
  { p: 0.40, pos: [-1.0, 2.8, -78], look: [0, -0.6, -86],    fov: 41 },
  { p: 0.43, pos: [ 1.2, 3.0, -80], look: [0, -0.6, -86],    fov: 42 },
  // Scroll 4 — Workflow (camera lifts + drifts RIGHT and FORWARD, never back)
  { p: 0.44, pos: [3.5, 3, -80],    look: [0.5, -0.8, -100], fov: 42 },
  { p: 0.50, pos: [4, 4, -90],      look: [0.3, -0.6, -115], fov: 46 },
  { p: 0.57, pos: [4.5, 5, -100],   look: [0.2, -0.5, -125], fov: 48 },
  // Scroll 5 — Network (continue forward + right, monotonic)
  { p: 0.61, pos: [5, 5.5, -112],   look: [0, -0.4, -130],   fov: 50 },
  { p: 0.66, pos: [5.5, 6, -118],   look: [0, -0.4, -130],   fov: 50 },
  { p: 0.71, pos: [5.5, 6, -120],   look: [0, -0.4, -130],   fov: 50 },
  // Scroll 6 — Tools (hold; only a tiny y-lift, no x or z reversal)
  { p: 0.74, pos: [5.5, 6, -120],   look: [0, -0.4, -130],   fov: 50 },
  { p: 0.86, pos: [5.5, 6.5, -120], look: [0, -0.4, -130],   fov: 50 },
  // Scroll 7 — Audit (camera pulls back + recenters in a SINGLE motion)
  { p: 0.90, pos: [4, 8, -115],     look: [0, -0.6, -130],   fov: 54 },
  { p: 0.95, pos: [2, 11, -100],    look: [0, -1, -130],     fov: 60 },
  { p: 1.00, pos: [0, 14, -90],     look: [0, -1, -130],     fov: 64 },
];

/** Stage A → globe (Stage B) → block network (Stage D) → block network stays.
 *  Globe does NOT return after blocks. The remaining scenes (Workflow,
 *  Tools, Finale) all live in the network area. */
export const STAGE_RANGES = {
  A: { in: [0.00, 0.00], out: [0.10, 0.20] },
  // Globe + tunnel visible during scenes 1-3 (Problem, Outcome, Workflow).
  // Fades out as we transition to Network at scene 4 start (p=0.57).
  B: { in: [0.10, 0.20], out: [0.57, 0.62] },
  // Block network visible from scene 4 onward.
  D: { in: [0.57, 0.62], out: [1.00, 1.00] },
} as const;

/** 7 scenes — strict 3D · 2D · 3D · 2D · 3D · 2D · 3D pattern.
 *  Uniform pacing: each scene = ~1 scroll-height of progress. */
export const UI_SCENES: Array<[number, number]> = [
  [0.00, 0.18],   // Scroll 1 · 3D — Hero (longer so user can register it)
  [0.18, 0.30],   // Scroll 2 · 2D — Problem (lead sources)
  [0.29, 0.43],   // Scroll 3 · 3D — Outcome (globe arrives + zoom + pan)
  [0.43, 0.55],   // Scroll 4 · 2D — Workflow dashboard
  [0.55, 0.66],   // Scroll 5 · 3D — Network (blocks spread)
  [0.66, 0.88],   // Scroll 6 · 2D — Tools dashboard (extended — 22% range so the integrations card lingers; the dense tool list needs reading time)
  [0.88, 1.00],   // Scroll 7 · 3D — Audit (finale)
];

export const SCENE_LABELS = [
  "Signal",
  "Problem",
  "Outcome",
  "Workflows",
  "Network",
  "Tools",
  "Audit",
] as const;

/**
 * Constellation cinematic — per-scene star + line registries.
 *
 * Each scene declares which stars and lines are visible while it's
 * active. The actual definitions live in
 * `components/scene/constellation/stars.ts` and `lines.ts`.
 *
 * Empty by default in the foundation pass — the SIGNAL hero brief
 * will populate index 0 first, then subsequent scene briefs fill
 * in 1–6. Adding ids that don't exist in the registries silently
 * skips rendering; line endpoints not in `activeStars` are dropped.
 */
export type SceneConstellation = {
  activeStars: string[];
  activeLines: string[];
};

export const SCENE_CONSTELLATIONS: SceneConstellation[] = SCENE_LABELS.map(
  () => ({ activeStars: [], activeLines: [] })
);
