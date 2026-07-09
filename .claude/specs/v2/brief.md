# Claude Code adapt brief — Zephlyn v2 landing page rebuild

## What this is

Rebuild the Zephlyn landing page from a Claude Design mockup into native, production code that matches this repo's existing conventions.

**Critical framing:** The file at `./Zephlyn.html` is a **visual reference — the source of truth for what the page should look like.** It is NOT code to copy, import, or embed. Do not drop the HTML into the app, do not reuse its inline styles or class names, do not point a route at it. Read it to understand layout, spacing, copy, color, the constellation behavior, and the section structure — then rebuild all of it natively as React components using this repo's tokens, helpers, and patterns. Delete `design-reference/` before the work is considered done.

## Branch

Work on `sh/rebuild-v2` (already created off `dev`). Never commit to `main`. Never commit directly to `dev`. All work stays on `sh/rebuild-v2` until I open a PR.

## The stack you're building into (respect these, don't reinvent)

- Next.js 16 App Router, React 19, TypeScript strict
- Tailwind v4, CSS-first via `@theme inline`
- Design tokens: `app/tokens.css` (primitives `--zeph-*`) → `app/globals.css` (semantic vars) → Tailwind utilities. Use existing semantic tokens; add new ones at the right layer if needed (primitive in tokens.css, semantic in globals.css). Do not hardcode hex values in components.
- `cn()` from `@/lib/cn` for class composition
- Existing theme provider for dark/light. Reuse it; don't build a new one.
- Bun, Vercel. AGENTS.md is the project map — read it first.

## Read before writing

1. `AGENTS.md` — project map and conventions
2. `app/tokens.css` and `app/globals.css` — the token system you must use
3. `lib/cn.ts` — the class helper
4. The existing theme provider / toggle implementation
5. The existing component directory structure (so new components match the established pattern)
6. `design-reference/Zephlyn.dc.html` — the visual target

## What to build

A single scrolling landing page replacing the current one, with these sections top to bottom (all visible in the reference file):

1. **Header / nav** — logo (mark + "Zephlyn" wordmark) left; "Get in touch" button + theme toggle right. No other links.
2. **Hero** — eyebrow "PRODUCTIZED AUTOMATION FOR SMALL BUSINESS"; headline "Your business, finally running itself."; subhead "For small businesses still running on memory, sticky notes, and missed calls. Zephlyn connects your scattered tools and tasks into one flow that runs without you."; primary "Get in touch" CTA + "See how it works" secondary.
3. **The Scatter (problem)** — headline "Right now, it all lives in your head."; four cards: Bookings in a notebook / Calls to voicemail / Inventory by hand / The system is you.
4. **What we build (three services, equal weight, no hero service)** — headline "Three systems. One connected flow."; three equal cards: Booking & scheduling / Call & email response / Inventory & insights, each with a short description and three bullets (copy is in the reference).
5. **The Connection (how it works)** — headline "We connect what you already do into one flow."; the "Today — scattered → With Zephlyn — connected" visual; three steps: We map how you work / We connect the dots / It runs itself.
6. **Honesty (fit)** — headline "Let's be honest about fit."; two columns "This is for you if…" and "Probably not yet if…" with the existing copy.
7. **FAQ** — headline "The things you're wondering."; collapsible items: How long does setup take? / Do I have to switch the tools I use? / What if I'm not technical? / What does it cost? / Is this a product or a service? / What if something breaks? (Write honest, pre-revenue-appropriate answers; keep them short. Flag any you want me to review.)
8. **Final CTA** — headline "Let's connect the dots."; subhead "You bring the scattered pieces. We'll turn them into one system that runs itself."; "Get in touch" + email (`social@zephlyn.io`); the "Two founders. Pre-revenue. Building this with our first customers — and we'd love for you to be one." line.
9. **Footer** — logo, links (The problem / Services / How it works / FAQ), email (`social@zephlyn.io`), copyright "© 2026 Zephlyn. We give small businesses systems."

## The constellation — SVG ONLY, this phase

This is the signature visual and the part most likely to go wrong, so read carefully.

- Build the constellation as **SVG** (vector circles for stars, vector lines for connections). **No WebGL, no React Three Fiber, no Three.js in this phase.** 3D is a deliberately separate later enhancement on its own branch; do not start it here, do not scaffold it, do not add the dependencies.
- It must work as a **static, correct layout first.** Before any scroll animation, the page must render a correct, good-looking constellation at rest in both themes. Get that solid, then add scroll behavior on top. The static version is the load-bearing baseline; the animation is an enhancement that must never break the static layout.
- **Scroll behavior:** the constellation builds as the user scrolls — scattered/unconnected near the top, progressively connecting through the middle, fully formed by the footer. One continuous constellation across the whole page, not separate per-section animations.
- **Layering is mandatory:** the constellation is a background layer; all content (headings, body, cards) sits above it in a clearly separated layer and stays fully legible. Where content overlaps the constellation, the content sits on a card/scrim that protects readability. Lines must never render on top of text. Cards must cleanly mask the constellation behind them — no lines poking through card edges.
- **Depth:** vary star size and opacity and use 2–3 parallax-ish layers so there's a sense of near/far. Keep it sparse and astronomy-quiet, not a particle storm.
- **Theme-aware line opacity:** in light mode the background constellation lines must be dimmed relative to dark mode (the reference lands around ~0.30 in light vs full in dark) so they recede behind content in both themes. Purple line color stays consistent across themes.
- **Reduced motion:** respect `prefers-reduced-motion` — fall back to the static constellation with no scroll animation.
- **Closing-section logo resolve (build defensively, logo-agnostic):** in the final CTA section, the constellation should settle into a resolved state near the logo. If the real logo mark is line/point-based, animate the points connecting into the logo shape. If the logo is a solid shape that can't be drawn as connected points, instead have the constellation settle into a calm resolved cluster adjacent to the logo. Implement it so swapping the logo later doesn't break the section. Don't hardcode an assumption about the logo's geometry.

## Hard requirements (these are not optional polish)

1. **WCAG AA contrast, enforced, both themes.** Every text/background pair must meet 4.5:1 for body text and 3:1 for large text, in BOTH light and dark mode. This specifically includes the spots that looked risky in the mockup: hero subhead gray-on-background, the "Two founders / pre-revenue" line, eyebrow labels (the purple "THE SCATTER" etc.), and footer text. Compute the actual ratios; adjust the token values until they pass. Tell me which pairs you had to change and their final ratios.
2. **One Button primitive.** Create a single `Button` component with variants (primary, secondary/outline, etc.). Every button on the page uses it — nav, hero, final CTA, footer. The mockup has visually inconsistent buttons (different glows, arrow vs no arrow); collapse them into consistent variants. No one-off button styles.
3. **Correct punctuation — no spaced punctuation.** The mockup renders artifacts like "business ," and "wondering ." with a space before the punctuation. Write all copy as clean literal strings: "Your business," "wondering." etc. No space before any comma or period anywhere.
4. **Plus Jakarta Sans via `next/font/google`**, self-hosted/optimized through next/font, no layout shift (no raw `<link>` to Google Fonts). Wire it as the page font through the existing font setup.
5. **Real logo, not the placeholder.** Use the actual Zephlyn logo from the repo — it's in the `intuit` directory (confirm exact path and filename when you read the repo). Do not reproduce the mockup's placeholder square. If the asset isn't where expected, stop and ask me rather than inventing one.
6. **Both themes fully polished.** Dark is the default, but light mode must get equal care (layering, depth, contrast). Keep the existing theme toggle working.
7. **Responsive / mobile.** The page must work on mobile. The constellation can be simplified on small screens (fewer stars, lighter or no scroll animation) but the page must look intentional and read cleanly at narrow widths.
8. **Use the correct email everywhere: `social@zephlyn.io`.** The mockup shows `hello@zephlyn.co` — that is wrong. Replace every instance with `social@zephlyn.io` (note: `.io`, not `.co`). This applies to the final CTA, the footer, and any `mailto:` links.

## Keep (don't rebuild)

The infrastructure is fine — reuse it: the token system, `cn()`, theme provider, Next/Tailwind/Bun setup, existing OG/metadata work, and any existing primitives you can reasonably reuse. This is a content + design + constellation rebuild, not an infrastructure rebuild.

## Definition of done

- New landing page renders correctly in both themes, desktop and mobile
- Constellation is SVG, builds on scroll, sits behind content, legible everywhere, theme-aware opacity, respects reduced-motion
- All hard requirements met; contrast ratios reported
- No spaced punctuation; single Button primitive; real logo; Plus Jakarta Sans via next/font
- `design-reference/` removed
- Everything committed to `v2-rebuild` only
- A short summary from you of: contrast pairs changed (with ratios), confirmation that `social@zephlyn.io` is used everywhere, the logo path you used, and anything in the reference you couldn't faithfully reproduce and why

## Explicitly out of scope (do NOT do in this pass)

- Any 3D / WebGL / React Three Fiber work — that's a separate later branch
- Merging to `dev` or `main` — I handle the PR
- Changing unrelated parts of the repo
