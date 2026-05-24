@AGENTS.md

# Zephlyn — project map

Marketing site for **Zephlyn**, a productized automation service for HVAC, roofing, plumbing, electrical, restoration, and solar shops. The codebase is a single Next.js app with one cinematic landing page and one long-form sample-audit page.

## Stack

- **Next.js 16.2.6** (App Router) on **React 19.2** — read `node_modules/next/dist/docs/` before assuming API shapes (Next 16 ships breaking changes vs. training data; see `@AGENTS.md`).
- **TypeScript** strict, path alias `@/*` → repo root.
- **Tailwind v4** (CSS-first config). No `tailwind.config.*` — utilities are generated from `@theme inline` in `app/globals.css`.
- **GSAP 3.15** + ScrollTrigger + SplitText (the post-April-2024 free plugins) — always import via `@/lib/gsap`, never from `gsap` directly.
- **React Three Fiber 9** + drei + postprocessing — powers the scroll-driven 3D cinematic on the landing page.
- **Bun** is the package manager (`bun.lock` is committed). `npm run dev|build|start|lint` still works since scripts call `next` directly.

## Commands

```
bun install        # or: npm install
npm run dev        # next dev — http://localhost:3000
npm run build      # next build
npm run lint       # eslint (flat config in eslint.config.mjs)
```

There are **no tests**. Verify UI changes by running `next dev` and exercising the relevant section (hero cinematic, sample audit, Cmd+K palette, theme toggle).

## File layout

```
app/
  layout.tsx          # root layout: metadata, fonts, theme boot script, providers
  page.tsx            # landing — composes LandingExperience + post-journey sections
  sample-audit/       # /sample-audit — anonymized example deliverable (SEO + de-risk)
  tokens.css          # primitive design tokens (--zeph-*). NEVER reference in components.
  globals.css         # Tailwind v4 entry + semantic tokens + animations + view-transitions
components/
  landing-experience.tsx   # routes between cinematic and reduced-motion fallback
  static-landing.tsx
  theme-provider.tsx       # class="dark" on <html>, localStorage, SSR-safe boot
  gsap-provider.tsx        # debounced ScrollTrigger.refresh() on resize/img-load
  ui/                      # Container, Section, Button, Card, Alert, Badge, Input
  brand/logo.tsx
  marketing/               # all marketing sections (StatStrip, SixPillars, RoiCalculator, ...)
  scene/                   # R3F cinematic — see "Cinematic" below
  animations/              # RevealOnScroll, AmbientGlows, ScrollProgressBar, SectionSpy, ...
  transitions/page-transition.tsx   # React 19 <ViewTransition>
lib/
  cn.ts                    # clsx + tailwind-merge — use for every className compose
  gsap.ts                  # the only place GSAP plugins are registered
public/brand/              # logos, favicons, OG images (SVG)
```

## Design system — non-negotiable

- **Tokens layer cleanly**: primitives in `tokens.css` (`--zeph-purple-700`) → semantic in `globals.css` (`--primary`) → Tailwind utilities via `@theme inline`. Components MUST consume semantic tokens (`bg-primary`, `text-muted-foreground`) — do not reach for `--zeph-*` outside `globals.css`.
- **Type scale**: use the `.type-*` utility classes from `globals.css` §5 (`type-h1`, `type-body-lg`, `type-overline`, `type-button`, `type-caption`, etc.) rather than ad-hoc font sizes.
- **className composition**: always wrap with `cn(...)` from `@/lib/cn` — handles conditional classes and de-dupes conflicting Tailwind utilities via `tailwind-merge`.
- **Layout primitives**: marketing sections use `<Section><Container>…</Container></Section>` from `components/ui/container.tsx`. Don't reinvent max-widths.
- **Theme**: dark mode is `class="dark"` on `<html>`, driven by `ThemeProvider`. A boot script in `app/layout.tsx` (`themeBootScript`) sets the class before hydration to avoid FOUC — do not move that script.

## Cinematic landing (the load-bearing piece)

The hero is a **360vh scroll proxy** (`components/landing-experience.tsx`) that drives a fixed R3F canvas + HTML overlay through 7 scenes.

- `components/scene/cinematic-scene.tsx` — the Canvas, camera path interpolation, scene fades. Theme-aware: light vs. dark passes different `SceneTheme` presets down.
- `components/scene/scene-config.ts` — `CAMERA_PATH` keyframes, `STAGE_RANGES`, `UI_SCENES`, `SCENE_LABELS`. The camera path is **monotonic by design** (only the audit finale reverses) — preserve that invariant when editing keyframes or the cinematic will feel jerky.
- `components/scene/use-scroll-progress.ts` — smoothed scroll progress (`smoothing = 0.055`, ~350ms ease). Reduced-motion mode jumps straight to target.
- `components/scene/scene-overlay.tsx` — HTML scene panels, nav rail, bottom progress bar. The progress bar is mutated via **direct DOM**, not React state, to avoid reconciling the 7-scene tree at 60fps during the cinematic.
- `components/static-landing.tsx` — full content fallback served to both `prefers-reduced-motion: reduce` users AND any viewport under 768px (the cinematic is desktop-only by design). Keep parity with the cinematic narrative if you add/remove scenes.

Performance pitfalls already paid for (don't regress):
- `AmbientGlows` blur is **44px** not 80px (avoided huge offscreen GPU textures competing with the WebGL canvas).
- Ambient blob `mix-blend-mode` was removed (forced compositor layers per blob).
- `ScrollTrigger.refresh()` is debounced (220ms) and run inside `requestIdleCallback` so it doesn't stutter mid-scroll. See `lib/gsap.ts` and `components/gsap-provider.tsx`.

## Animations + scroll behavior

- Section reveals: wrap with `<RevealOnScroll>` (auto-discovers the first `<h2>` and lead `<p>` and animates via SplitText). Keeps inner sections as server components.
- Scroll-spy nav: `<SectionSpy sectionIds={…} />` on the home page sets `data-active="true"` on header anchors; styling lives in `globals.css` §6.10.
- Page-to-page motion: wrap routes in `<PageTransition>` and use Next 16's `<Link transitionTypes={['nav-forward' | 'nav-back']}>`. Keyframes in `globals.css` §6.9. The site header is anchored via `viewTransitionName: "site-header"` so it doesn't slide.
- View transitions are enabled by `experimental.viewTransition` in `next.config.ts` — required for React 19's `<ViewTransition>` to actually mount.

## Conventions for new work

- New marketing section → drop a `components/marketing/<name>.tsx`, compose with `<Section><Container>…`, import from `app/page.tsx` and (if it's part of the cinematic narrative) also from `components/static-landing.tsx`.
- New route → put a `<PageTransition>` around the main content and a header with `viewTransitionName: "site-header"` so the directional slide reads cleanly.
- New animation → if it touches scroll, gate it with `gsap.matchMedia({ reduce, normal })` and noop the `reduce` branch. The `*` reduced-motion rule in `globals.css` §7 also kills CSS transitions globally.
- Status colors: use `--zeph-success-500 / warning-500 / danger-500` via the `var(--…)` syntax (as in `app/sample-audit/page.tsx`) — they aren't currently aliased to Tailwind utilities.
- Email contact: `social@zephlyn.io` is the shared founder inbox (Shaan + Farhan both receive) and the only address used on public marketing surfaces. Founder addresses `shaan.hurley@zephlyn.io` and `farhan.begg@zephlyn.io` exist but are reserved for warm intros, post-call follow-ups, and signature blocks — never paste them into marketing copy. Marketing domain: `zephlyn.ai`.
