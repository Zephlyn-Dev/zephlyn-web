/**
 * Zephlyn — Constellation data (single source of truth)
 *
 * Star shapes + connection lists, shared by BOTH renderers:
 *   - components/landing/constellation.tsx        (SVG, the shipped baseline)
 *   - components/landing/constellation-3d/*       (WebGL space-flight enhancement)
 *
 * The narrative is authored as SHAPES — small curated constellations, each tied
 * to a stretch of the page story:
 *
 *   scatter  — a bright but UNCONNECTED cluster ("today — scattered")
 *   hub      — five nodes linked through one center (echoes the Connection
 *              section's diagram: everything routed through one flow)
 *   zephyr   — a "Z" glyph that resolves as the finale destination
 *
 * Each shape carries BOTH a 2D anchor (`center2`, SVG viewBox coords) and a 3D
 * anchor (`centerWorld`, corridor world units, z negative = deeper in space).
 * The SVG projects shapes flat; the 3D stages them along the flight path so the
 * camera travels toward each one as its section scrolls into view.
 *
 * No framework imports here — keep it portable.
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

/* ----------------------------------------------------------------------------
 * Authored shapes
 * -------------------------------------------------------------------------- */

export type ShapeStar = {
  /** local x (viewBox-scale units, ± ~110, y grows downward like SVG) */
  x: number;
  /** local y */
  y: number;
  /** glyph radius (viewBox units) */
  r: number;
  /** scroll fraction at which the star resolves (negative => visible from top) */
  rev: number;
  /** glow stars get a soft halo / brighter emissive */
  glow?: boolean;
};

export type Shape = {
  id: string;
  stars: ShapeStar[];
  /** [fromIndex, toIndex, drawThreshold] — indices local to this shape */
  edges: Array<[number, number, number]>;
  /** 2D anchor in the 0..1000 SVG viewBox */
  center2: [number, number];
  /** 3D anchor in corridor world units (z negative = deeper along the flight) */
  centerWorld: [number, number, number];
  /** scroll range [start, end] over which the shape resolves */
  reveal: [number, number];
};

export const SHAPES: Shape[] = [
  {
    // "Today — scattered": bright stars, deliberately NO connections.
    id: "scatter",
    stars: [
      { x: -105, y: -60, r: 2.4, rev: -0.2, glow: true },
      { x: -20, y: -95, r: 1.5, rev: 0.04 },
      { x: 80, y: -55, r: 2.0, rev: -0.2, glow: true },
      { x: -70, y: 30, r: 1.6, rev: 0.06 },
      { x: 35, y: 25, r: 2.2, rev: -0.2, glow: true },
      { x: 110, y: 75, r: 1.4, rev: 0.08 },
      { x: -15, y: 105, r: 1.7, rev: 0.1 },
    ],
    edges: [],
    center2: [280, 260],
    centerWorld: [-3.4, 1.6, -26],
    reveal: [0.0, 0.2],
  },
  {
    // "With Zephlyn — connected": five nodes through one hub, the same motif
    // as the ConnectedDiagram in the Connection section.
    id: "hub",
    stars: [
      { x: 0, y: 0, r: 2.6, rev: 0.28, glow: true },
      { x: -90, y: -51, r: 1.7, rev: 0.3 },
      { x: 27, y: -72, r: 1.6, rev: 0.32 },
      { x: 90, y: 12, r: 1.8, rev: 0.34 },
      { x: -51, y: 33, r: 1.5, rev: 0.36 },
      { x: 45, y: 69, r: 1.7, rev: 0.38 },
    ],
    edges: [
      [0, 1, 0.34], [0, 2, 0.37], [0, 3, 0.4], [0, 4, 0.43], [0, 5, 0.46],
      [1, 2, 0.48], [3, 5, 0.5],
    ],
    center2: [720, 430],
    centerWorld: [3.2, -0.4, -52],
    reveal: [0.28, 0.5],
  },
  {
    // Finale: the Zephlyn "Z", the destination the camera never quite passes —
    // it frames up exactly as the page bottoms out.
    id: "zephyr",
    stars: [
      { x: -85, y: -85, r: 1.8, rev: 0.6 },
      { x: 0, y: -92, r: 1.6, rev: 0.62 },
      { x: 88, y: -82, r: 2.2, rev: 0.6, glow: true },
      { x: 42, y: -42, r: 1.5, rev: 0.64 },
      { x: 0, y: 2, r: 2.0, rev: 0.6, glow: true },
      { x: -46, y: 44, r: 1.5, rev: 0.66 },
      { x: -90, y: 82, r: 2.2, rev: 0.62, glow: true },
      { x: 0, y: 90, r: 1.6, rev: 0.68 },
      { x: 86, y: 84, r: 1.8, rev: 0.7 },
    ],
    edges: [
      [0, 1, 0.66], [1, 2, 0.69], [2, 3, 0.72], [3, 4, 0.75], [4, 5, 0.78],
      [5, 6, 0.81], [6, 7, 0.84], [7, 8, 0.87],
    ],
    // Offset up-right so the final CTA card doesn't mask it when it frames up.
    center2: [680, 320],
    centerWorld: [3.4, 2.6, -114],
    reveal: [0.6, 0.92],
  },
];

/** local viewBox-scale units per world unit (shape span ±110 → ±~3.2 world). */
export const LOCAL_SCALE = 34;

/** Shape star → corridor world position. viewBox y grows down; world y grows
 *  up → flip. A tiny deterministic z jitter keeps shapes from being flat. */
export function shapeStarWorld(shape: Shape, i: number): [number, number, number] {
  const s = shape.stars[i];
  const zJit = (((i * 53) % 7) - 3) * 0.35;
  return [
    shape.centerWorld[0] + s.x / LOCAL_SCALE,
    shape.centerWorld[1] - s.y / LOCAL_SCALE,
    shape.centerWorld[2] + zJit,
  ];
}

/* ----------------------------------------------------------------------------
 * Plexus field (3D only) — loose stars threaded through the flight corridor.
 * Nearby pairs link up as the camera approaches: the "everything starts to
 * connect" layer between the authored shapes.
 * -------------------------------------------------------------------------- */

export type PlexusData = {
  /** xyz triplets in corridor world units */
  positions: Float32Array;
  /** [aIndex, bIndex, revealThreshold(scroll p)] */
  edges: Array<[number, number, number]>;
};

export function makePlexus(count: number, seed = 0x9e2f): PlexusData {
  const rand = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (rand() - 0.5) * 26;
    positions[i * 3 + 1] = (rand() - 0.5) * 15;
    positions[i * 3 + 2] = -14 - rand() * 104; // z ∈ [-118, -14]
  }

  // Candidate pairs within radius, closest first, capped at 2 links per star.
  const R2 = 7.5 * 7.5;
  const pairs: Array<{ a: number; b: number; d2: number }> = [];
  for (let a = 0; a < count; a++) {
    for (let b = a + 1; b < count; b++) {
      const dx = positions[a * 3] - positions[b * 3];
      const dy = positions[a * 3 + 1] - positions[b * 3 + 1];
      const dz = positions[a * 3 + 2] - positions[b * 3 + 2];
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < R2) pairs.push({ a, b, d2 });
    }
  }
  pairs.sort((p, q) => p.d2 - q.d2);

  const degree = new Uint8Array(count);
  const edges: Array<[number, number, number]> = [];
  for (const { a, b } of pairs) {
    if (degree[a] >= 2 || degree[b] >= 2) continue;
    degree[a]++;
    degree[b]++;
    // Link forms shortly before the camera reaches the pair's depth, so
    // connections visibly densify ahead of you as you travel.
    const depth = -(positions[a * 3 + 2] + positions[b * 3 + 2]) / 2;
    const rev = Math.min(0.88, Math.max(0.03, (depth - 26) / 100));
    edges.push([a, b, rev]);
  }
  return { positions, edges };
}

/* ----------------------------------------------------------------------------
 * Flat SVG projection — the SVG renderer consumes the same shapes as one flat
 * star/edge list in viewBox coordinates (its historical contract).
 * -------------------------------------------------------------------------- */

export type Star = {
  /** viewBox x (0..1000) */
  x: number;
  /** viewBox y (0..1000) */
  y: number;
  /** unused by the SVG (kept for shape compatibility) */
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

export const STARS: Star[] = SHAPES.flatMap((sh) =>
  sh.stars.map((s) => ({
    x: sh.center2[0] + s.x,
    y: sh.center2[1] + s.y,
    z: 0,
    r: s.r,
    op: s.glow ? 0.95 : 0.62,
    rev: s.rev,
    glow: !!s.glow,
  }))
);

/* Cross-shape links (SVG only — in 3D the plexus field plays this role).
   Indices are into the flat STARS list; they carry the story between shapes:
   the scattered cluster threads into the hub, the hub reaches toward the Z. */
const SHAPE_OFFSETS = SHAPES.reduce<number[]>((acc, sh) => {
  acc.push((acc[acc.length - 1] ?? 0) + sh.stars.length);
  return acc;
}, [0]).slice(0, -1);

const CROSS_EDGES: Array<[number, number, number]> = [
  [4, SHAPE_OFFSETS[1] + 0, 0.22],
  [2, SHAPE_OFFSETS[1] + 1, 0.25],
  [5, SHAPE_OFFSETS[1] + 2, 0.27],
  [6, SHAPE_OFFSETS[2] + 0, 0.5],
  [SHAPE_OFFSETS[1] + 5, SHAPE_OFFSETS[2] + 0, 0.54],
  [SHAPE_OFFSETS[1] + 3, SHAPE_OFFSETS[2] + 4, 0.57],
];

/* [fromIndex, toIndex, threshold] into the flat STARS list — shape-internal
   edges (offset to global indices) plus the cross-shape story links. */
export const EDGES: Array<[number, number, number]> = [
  ...SHAPES.flatMap((sh, si) =>
    sh.edges.map(
      ([a, b, th]): [number, number, number] => [
        SHAPE_OFFSETS[si] + a,
        SHAPE_OFFSETS[si] + b,
        th,
      ]
    )
  ),
  ...CROSS_EDGES,
];
