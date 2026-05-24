/**
 * Shared type definitions for the constellation cinematic.
 *
 * These types are the contract between scene configs (which declare
 * which stars/lines exist) and the rendering primitives (Star, Line,
 * StarField). Keep them small and serializable — the registries in
 * `stars.ts` and `lines.ts` are plain data, no functions or refs.
 */

export type ConstellationTheme = "light" | "dark";

export type Vec3 = [number, number, number];

export type StarDefinition = {
  /** Stable identifier — referenced by line definitions and scene configs. */
  id: string;
  /** World-space position. The camera path is built around the origin. */
  position: Vec3;
  /** Visual size in world units. Real night sky has stars of varying
   *  brightness — keep some variance for visual interest. Default 4. */
  size?: number;
  /** Optional label rendered as an HTML overlay next to the star. */
  label?: string;
  /** Halo intensity (0–1). Default 0.3. Use higher values sparingly —
   *  too many bright stars and the constellation noise floor goes up. */
  glow?: number;
};

export type LineDefinition = {
  /** Stable identifier. */
  id: string;
  /** Origin star id (must exist in the active stars list). */
  fromStarId: string;
  /** Destination star id (must exist in the active stars list). */
  toStarId: string;
  /** Milliseconds before the draw-on starts — used to stagger a
   *  multi-line constellation. Default 0. */
  delay?: number;
  /** Milliseconds for the draw-on animation. Default randomized 400–800. */
  duration?: number;
};
