# Zephlyn cinematic — constellation foundation

**For:** Claude Code
**Scope:** New components under `components/scene/constellation/`. Edits to `components/scene/cinematic-scene.tsx` and `components/scene/scene-config.ts` to integrate the new system. CSS variables in `app/globals.css` for constellation theming.
**Goal:** Build the foundational visual system for the new cinematic — a continuous, theme-aware starfield with constellation-line rendering primitives that all 7 scenes will be rebuilt on top of. This brief does NOT rebuild the scenes. It builds the toolkit the scene rebuilds will use.

---

## Context

The site is being redesigned around a constellation metaphor: home service businesses are scattered stars; Zephlyn connects them into navigable constellations. The previous cinematic had 7 unrelated visual systems (waves, wireframe sphere, flow chart, 3D platforms, etc.). The new cinematic uses ONE visual system — a starfield with constellation lines — and varies the scene-by-scene treatment by changing what stars exist and which lines connect them.

**The mood:** astronomy-app quiet. Patient, exact, considered. Reference: Stellarium app aesthetic, not three.js particle showcases. Stars are small and sparse. Movement is slow. Constellation lines draw deliberately, like someone tracing them by hand.

**Theme parity:** Both light and dark modes render the starfield. Dark mode: white/cream stars on near-black background. Light mode: dark navy/black stars on near-white background. Constellation lines are the brand purple in both modes — the one constant through-line.

This brief is foundation only. After it ships, a separate brief will rebuild the SIGNAL (hero) scene as a prototype using this foundation. The remaining 6 scenes are out of scope until the prototype validates the approach.

---

## 1. Architecture overview

Create a new directory: `components/scene/constellation/`

The system consists of three primitives that compose together:

### `StarField` (the canvas)

A continuous R3F Canvas that renders the starfield. Persistent across all scenes — does not unmount/remount between scenes. Theme-aware. Responds to scroll progress for camera movement and to scene state for star/line presence.

### `Star` (a single point)

A small textured point in 3D space. Has a position, a base color (driven by theme), and optional metadata (label, scene-membership, glow intensity). Renderable in light or dark mode.

### `ConstellationLine` (a connection)

A drawn line between two `Star` instances. Animated draw-on (svg-style path stroke animation, but in 3D). Brand purple. 1-2px effective thickness. Animation duration 400-800ms per line.

These primitives are composed by scene-specific configs that say _which_ stars and lines exist in _which_ scenes. The configs live in `scene-config.ts` (extended) — they don't live inside the primitive components.

---

## 2. The `StarField` component

**File:** `components/scene/constellation/star-field.tsx`

**Responsibilities:**

- Render the R3F Canvas
- Render the background gradient (theme-aware near-black or near-white)
- Render all `Star` instances based on the active scene's star list
- Render all `ConstellationLine` instances based on the active scene's line list
- Drive the camera along a scroll-progress-driven path
- Subscribe to theme changes and update colors accordingly

**Inputs (props):**

```typescript
type StarFieldProps = {
  scrollProgress: number; // 0 to 1, drives camera
  activeStars: StarDefinition[]; // which stars exist right now
  activeLines: LineDefinition[]; // which lines are drawn right now
  cameraKeyframes: CameraKeyframe[]; // scene-driven camera path
  theme: "light" | "dark";
};
```

**Behavior:**

- `activeStars` and `activeLines` change as the user scrolls through scenes. Stars/lines mount and unmount with smooth fade transitions (200-300ms), not abrupt pops.
- Camera position interpolates between keyframes based on `scrollProgress` using the existing camera-path interpolation from `cinematic-scene.tsx` — DO NOT rewrite that. Reuse it.
- The starfield itself (the background stars that aren't part of any constellation) is a single fixed `<Points>` mesh with ~120 stars. These DO NOT change between scenes. They are the visual continuity.
- Active stars (constellation stars) are rendered on top of the background field. They appear/disappear per scene.

**Performance:**

- Background stars: single `Points` instance with shared material. Do not create 120 individual meshes.
- Active stars: individual meshes only because they have labels and need to be hit-testable. Cap at ~30 active stars per scene.
- Constellation lines: use `Line2` from `three/examples/jsm/lines/Line2` for proper thickness, OR a custom shader. Do NOT use bare `THREE.Line` — it ignores linewidth on most platforms.
- Use `useMemo` for any geometry/material that doesn't change with theme. Theme changes should hot-swap materials, not regenerate geometry.

**Reduced motion:**

- If `prefers-reduced-motion: reduce`, the camera does NOT move with scroll. Camera stays at a fixed position per scene (use the _end_ keyframe of each scene's camera path).
- Star/line fade-in still happens but instantly (no transition).
- Constellation lines appear instantly rather than drawing themselves.
- Continue to respect this through the existing reduced-motion media query.

---

## 3. The `Star` primitive

**File:** `components/scene/constellation/star.tsx`

**Visual spec:**

- A single small textured plane (billboarded — always faces camera) with a radial gradient texture
- Size: 2-8 world units, varies per star definition for visual interest (real night sky has stars of varying brightness)
- Color in dark mode: warm white `#F8F4E8` to `#FFFFFF`. Slight color variance OK (some stars warmer, some cooler) but never saturated.
- Color in light mode: deep navy/near-black `#0F172A` to `#1E1B4B`. Same variance principle.
- Subtle glow effect: a secondary, larger plane at 30% opacity for halo. Don't use post-processing bloom — too expensive for this density. The texture itself handles glow.

**Props:**

```typescript
type StarProps = {
  id: string;
  position: [number, number, number];
  size?: number; // default 4
  label?: string; // optional, only for labeled scene stars
  glow?: number; // 0 to 1, default 0.3
  theme: "light" | "dark";
};
```

**Behavior:**

- If `label` is provided, render the label as HTML overlay (using `<Html>` from `@react-three/drei`) positioned next to the star. Label uses `type-overline` or similar small uppercase token from the design system, in the same theme-aware color as the star itself.
- Stars subtly twinkle — opacity oscillates between 0.85 and 1.0 on a slow random sine wave (5-12 second period per star, randomized per instance so they don't twinkle in sync). This is the _one_ exception to "no independent star animation."
- Reduced motion: no twinkle. Opacity locked at 1.0.

**Don't:**

- Make stars rotate, scale, or pulse aggressively
- Use neon/saturated colors
- Add particles, sparks, or "energy" effects
- Make labels appear inside the star itself — they're separate HTML elements positioned nearby

---

## 4. The `ConstellationLine` primitive

**File:** `components/scene/constellation/constellation-line.tsx`

**Visual spec:**

- A line connecting two stars
- Color: brand purple via `var(--primary)` or the equivalent token (`--zeph-purple-700` per AGENTS.md). Same color in both light and dark themes.
- Thickness: 1.5-2px effective width on screen. Use `Line2` to ensure consistent thickness regardless of camera distance.
- Opacity: 0.7-0.85, not fully opaque. Lines should feel drawn, not painted.

**Animation:**

- Lines draw themselves from one star to the other over 400-800ms (randomize per line within this range for organic feel)
- Use a shader-based dash offset animation or a `Line2` with `lineWidth` ramping and `dashScale` to achieve the draw-on effect. If shader work is out of scope, use `gsap` to animate a clipping plane or the `geometry.setDrawRange()` over time.
- Easing: `ease-out` cubic. Starts fast, decelerates as it reaches the destination star. Reads as confident, not mechanical.
- Lines fade out (not erase backward) when leaving a scene. 200-300ms fade.

**Props:**

```typescript
type ConstellationLineProps = {
  id: string;
  fromStarId: string;
  toStarId: string;
  delay?: number; // ms before draw begins, for staggering
  duration?: number; // override default 400-800ms
};
```

**Behavior:**

- Look up `from` and `to` star positions from the active stars registry (in the StarField parent). If either star doesn't exist, the line doesn't render.
- Stagger draws by passing `delay` from the scene config. A scene with 11 connecting lines might stagger them 100-150ms apart, so the constellation forms over ~1.5-2 seconds rather than all at once.

**Reduced motion:** lines appear instantly, no draw animation, no stagger.

---

## 5. Theme integration

The starfield must look intentional in both light and dark modes. Light mode is currently the weak point — the existing cinematic has invisible stars in light mode. Fix that here.

**Add CSS variables** to `app/globals.css` in the semantic tokens section:

```css
:root {
  --constellation-bg-from: #fafaf8; /* near-white, warm */
  --constellation-bg-to: #f0eeea;
  --constellation-star: #1e1b4b; /* deep navy */
  --constellation-star-glow: #4338ca;
  --constellation-line: var(--primary); /* brand purple */
}

.dark {
  --constellation-bg-from: #0a0a0f; /* near-black, slight blue */
  --constellation-bg-to: #050507;
  --constellation-star: #f8f4e8; /* warm white */
  --constellation-star-glow: #ffffff;
  --constellation-line: var(--primary); /* same brand purple */
}
```

The starfield reads these variables on each render. Use the existing `useTheme()` hook to know which to apply (per AGENTS.md, `ThemeProvider` provides this).

---

## 6. Camera and scroll integration

The existing `cinematic-scene.tsx` has a camera-path interpolation system driven by `useScrollProgress`. **Reuse it.** Do not rebuild scroll mechanics.

**What changes:**

- The camera path keyframes in `scene-config.ts` get redesigned for constellation framing (much wider Z-range, fewer dramatic rotation changes)
- The 360vh scroll proxy stays the same length
- The 7 scenes still map to STAGE_RANGES — the per-scene rebuilds will adjust these as needed

**For this foundation brief specifically:**

- Don't change `STAGE_RANGES` or `CAMERA_PATH` yet — those are scene-specific work
- Add a new field to `scene-config.ts` for each scene: `activeStars: string[]` and `activeLines: string[]` (arrays of IDs referencing definitions in a new `stars.ts` and `lines.ts` registry)
- Create stub registries in `components/scene/constellation/stars.ts` and `lines.ts` with empty exports — the SIGNAL scene brief will populate them

---

## 7. File structure

After this brief, the new files should be:

```
components/scene/constellation/
  star-field.tsx          # The R3F Canvas + camera + composition
  star.tsx                # Single star primitive
  constellation-line.tsx  # Line primitive with draw animation
  stars.ts                # Star definitions registry (initially empty)
  lines.ts                # Line definitions registry (initially empty)
  types.ts                # Shared type definitions
  README.md               # Brief explanation of the system for future devs
```

The README.md should be short — 1 page max — explaining:

- The metaphor and intent
- The primitive structure (StarField → Star → Line)
- How to add new stars/lines for a scene (point to the registry files)
- The performance budget (max stars, max lines per scene)

---

## 8. What NOT to do in this brief

- **Don't rebuild any of the 7 scenes.** That's the next brief.
- **Don't delete the existing scene components yet.** They stay in the codebase during the transition; the rebuild will replace them scene by scene.
- **Don't change the reduced-motion fallback.** It continues to render the static stacked layout. Only the cinematic gets the new starfield.
- **Don't introduce new dependencies** unless necessary. `@react-three/fiber`, `@react-three/drei`, `three`, and `gsap` are already in the stack — work within those. If `Line2` requires importing from `three/examples/jsm/lines/`, that's fine, it's part of three.js.
- **Don't add bloom, fog, or other postprocessing.** The mood is quiet, not cinematic-effects-heavy. Performance is also a concern given the cinematic's existing budget.
- **Don't redesign the cinematic-scene.tsx orchestration logic.** Plug the new StarField in where the old scene meshes lived. Keep the scene-progress mechanics, scroll proxy, and SectionSpy intact.

---

## 9. Acceptance criteria

The user can:

1. Load the site, see the existing 7 scenes still working (you haven't broken them by adding the foundation)
2. Toggle a feature flag (or temporarily replace one scene's content) to see the empty starfield rendering — sparse stars in both themes, slow camera drift on scroll, gradient background
3. Manually add a single `Star` definition to `stars.ts` and see it render with a label
4. Manually add a `ConstellationLine` between two stars and see it draw on
5. Toggle light/dark mode and see both render correctly

The foundation works without any scene-specific logic. When the next brief (SIGNAL hero) ships, it should be primarily a matter of populating the registries and configuring the SIGNAL scene's `activeStars` and `activeLines`.

---

## 10. Order of operations

1. Create the directory structure and stub files
2. Build `types.ts` with shared type definitions
3. Build `Star` primitive — get a single star rendering with a label, in both themes
4. Build `ConstellationLine` primitive — get a line drawing between two hardcoded points
5. Build `StarField` — compose stars + lines + background + camera into a single R3F Canvas
6. Integrate `StarField` into `cinematic-scene.tsx` as a parallel render target (don't replace the existing scenes yet — render side by side, hidden by default, toggled by a dev-only flag)
7. Wire up theme reactivity
8. Wire up reduced-motion handling
9. Test by manually populating a few stars and lines in the registries
10. Write the README.md
11. Output a diff summary listing every new file, every changed file, and any decisions Claude Code made that diverged from this brief

**After this lands and is reviewed, the next brief will be the SIGNAL hero scene rebuild — using this foundation.**

---

## A note on judgment calls

Several technical decisions in this brief are recommendations, not absolutes. Specifically:

- The choice between `Line2`, custom shader, or `setDrawRange` for the line-draw animation
- Whether stars use billboarded planes, sprites, or a single instanced points mesh
- How exactly to structure the camera/scroll subscription

If Claude Code's implementation experience suggests a better approach for any of these, take it — but flag the decision in the diff summary so the user can review. The intent is "astronomy-app quiet, theme-parity, performant" — implementation paths that serve those goals are all welcome.
