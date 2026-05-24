/**
 * Star definitions registry.
 *
 * Each entry is a single star in the constellation system. Scenes
 * reference these by id via `SCENE_CONSTELLATIONS[i].activeStars`.
 *
 * This registry is intentionally empty in the foundation pass — the
 * SIGNAL hero scene rebuild will populate it. Add new stars here
 * rather than inline in scene configs so the same star can be
 * referenced across multiple scenes for continuity.
 */

import type { StarDefinition } from "./types";

export const STARS: Record<string, StarDefinition> = {};
