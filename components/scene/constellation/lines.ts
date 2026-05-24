/**
 * Constellation-line definitions registry.
 *
 * Each entry connects two stars. Scenes reference these by id via
 * `SCENE_CONSTELLATIONS[i].activeLines`. Empty in the foundation
 * pass — populated by per-scene briefs as the cinematic gets rebuilt.
 *
 * To draw a line, both `fromStarId` and `toStarId` must resolve in the
 * scene's active stars list. Lines whose endpoints aren't active
 * silently skip rendering (see ConstellationLine for the lookup).
 */

import type { LineDefinition } from "./types";

export const LINES: Record<string, LineDefinition> = {};
