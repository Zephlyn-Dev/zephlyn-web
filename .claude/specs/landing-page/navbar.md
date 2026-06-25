# Zephlyn landing page — nav redesign

**For:** Claude Code
**Scope:** Top nav component (likely `components/site-header.tsx` or similar in `components/` — find the component rendered at the top of `app/layout.tsx`), theme toggle component, scene rail component (`components/scene/scene-overlay.tsx` or wherever the scroll-spy rail lives)
**Goal:** Strip the top nav to minimum essentials. Replace the two-button theme picker with a single pill toggle. Polish the scene rail's hover/active states.

---

## Context

The current nav has redundant wayfinding (top nav links + scene rail on the right both navigate the cinematic), a cargo-cult ⌘K command palette that doesn't serve this page's audience, and two separate buttons for theme switching that act like a radio group but read like buttons. The fix is to lean into the cinematic + scene rail as the primary navigation pattern, and reduce the top nav to brand + primary action + theme.

This is a single-page marketing site. There are no other routes (per AGENTS.md: "one cinematic landing page and one long-form sample-audit page" — and the sample-audit page is being removed separately). The top nav should reflect that.

---

## 1. Top nav structure

**Current:**

```
[Logo] Zephlyn        Product · Workflows · FAQ · ⌘K · [☼][☽]
```

**Change to:**

```
[Logo] Zephlyn                                  [Get in touch] [☼━○━☽]
```

**Specifically:**

- **Logo + wordmark:** unchanged, stays on the left
- **Remove `Product` nav link**
- **Remove `Workflows` nav link**
- **Remove `FAQ` nav link**
- **Remove `⌘K` button/affordance entirely** — including any associated keybind handler if it's not wired up to anything real. If it IS wired up to a command palette component, leave the keybind handler so power users can still trigger it via keyboard, but remove the visible button. (Check first — if there's no actual palette implementation, remove the handler too.)
- **Add `Get in touch` button on the right** — outline/ghost style, links to `mailto:social@zephlyn.io`
- **Replace the two theme buttons with a single pill toggle** (specified below)

**Layout:**

- Logo flex-start on the left
- `Get in touch` + theme toggle as a flex group on the right
- Empty space in the middle — don't fill it

---

## 2. `Get in touch` button styling

- **Variant:** outline / ghost button (not filled). Should be quieter than the hero's primary CTA.
- **Use existing Button primitive** from `components/ui/button.tsx` if it exposes an outline or ghost variant. If not, compose with `cn()` and Tailwind utilities matching the site's semantic tokens — border using `--border` or `--input` semantic, text in default foreground, no fill.
- **Size:** matches the nav's existing height. Smaller than a hero CTA — closer to a chip than a full button.
- **Hover:** subtle bg fill (`bg-muted` or similar muted semantic), no scale transform
- **Link:** `href="mailto:social@zephlyn.io"`
- **Label:** `Get in touch`

If there's a `Button` component variant called `outline` or `ghost` already, use it. Don't introduce a new variant just for this.

---

## 3. Theme toggle pill switch

**Current:** Two adjacent button-shaped elements, one with a sun icon and one with a moon icon. Clicking either sets the theme to that mode.

**Change to:** A single pill-shaped toggle with:

- **Track:** rounded-full container with two slots
- **Left slot:** sun icon
- **Right slot:** moon icon
- **Thumb / indicator:** a circular highlight that sits over the currently-active slot. Slides between the two when clicked.
- **Interaction:** clicking anywhere on the track toggles. Clicking the inactive slot also switches to that mode (don't make the inactive slot dead).

**Visual reference:** Similar to the macOS / iOS toggle pattern, but with the two destination states (sun, moon) visible inside the track rather than the track being binary on/off.

**Implementation guidance:**

- Look for the existing theme toggle in `components/` — probably `theme-toggle.tsx` or rendered inline in the site header
- The active theme comes from `useTheme()` provided by `components/theme-provider.tsx` (per AGENTS.md)
- Use the same `lucide-react` icons that are currently used for sun/moon
- The thumb's position can be CSS-driven: `data-theme="dark"` on the parent toggles `translate-x-*` on the thumb, or use a `before`/`after` pseudo-element
- Animate the thumb position with `transition-transform` — keep it under 200ms, no spring physics
- Respect `prefers-reduced-motion` — instant snap when reduce is active (per AGENTS.md the global `*` reduced-motion rule handles this, but verify the transition isn't fighting it)

**Accessibility:**

- The toggle must remain a `<button>` with `aria-label="Toggle theme"` or similar
- Currently-active state communicated via `aria-pressed` or `aria-checked` depending on which pattern fits the implementation
- Keyboard-operable: Space and Enter toggle. Arrow keys aren't required (this is binary, not a radio group of 3+).

---

## 4. Scene rail hover/active states

**Context:** The scene rail on the right side of the cinematic (`SIGNAL · PROBLEM · OUTCOME · WORKFLOWS · NETWORK · TOOLS · AUDIT`) is now the primary in-page wayfinding since the top nav lost its scroll-anchor links. Polish its states.

**Current behavior (per the screenshots):**

- Default: small dot + uppercase label, muted color
- Active (current scene): same treatment with a slightly faded underline or color shift — too subtle to read clearly
- Hover: underline appears — fighting with the active treatment

**Change to:**

| State                  | Label color                       | Dot                     | Underline |
| ---------------------- | --------------------------------- | ----------------------- | --------- |
| Default (other scenes) | `text-muted-foreground`           | small, muted            | none      |
| Hover (other scenes)   | `text-foreground`                 | small, foreground color | none      |
| Active (current scene) | `text-primary` (the brand purple) | filled, `bg-primary`    | none      |

**Key changes:**

- **No underlines in any state.** Underline on hover was redundant; underline on active was too subtle. Color shift carries the state communication.
- **Active uses the brand primary purple,** not the same muted color with a treatment. The dot becomes a filled primary-colored circle. The label becomes primary color.
- **Hover is just a color lift** from muted to foreground, no other change.
- **Transition:** color transitions should be subtle, ~150ms. Don't animate the dot's size or position.

**Implementation:**

- The styling lives in `globals.css` §6.10 (per AGENTS.md) on `data-active="true"` selectors — edit there, don't move it
- If there are CSS rules in the same selector that add underlines (`text-decoration-line: underline` or `border-bottom`), remove them
- Active state is set by `<SectionSpy>` writing `data-active="true"` to the relevant rail item — don't change that mechanism

---

## 5. Mobile

The current nav probably collapses to a hamburger or similar pattern on mobile. After these changes:

- **Mobile nav contains:** Logo on left, `Get in touch` button + theme toggle on right. Same as desktop, no hamburger needed since there are no nav links anymore.
- **If a hamburger menu exists,** remove it — it has nothing to open.
- **`Get in touch` button on mobile:** make sure the label still fits. If it doesn't, the button can shrink to just an icon (`Mail` from lucide) with `aria-label="Get in touch"`.
- **Theme toggle on mobile:** same pill switch, same dimensions. Don't shrink it below tappable size (~40px height minimum).

---

## 6. Reduced-motion fallback

The reduced-motion fallback (`components/reduced-motion-landing.tsx`) uses the same site header — these changes propagate automatically if the header is a shared component. **Verify** the header is shared, not duplicated. If it's duplicated, apply changes to both. Per AGENTS.md, parity is required.

The scene rail does NOT exist in the reduced-motion fallback (no cinematic to spy on), so section 4's edits only apply to the cinematic.

---

## Things to NOT change

- Logo design or wordmark
- Theme provider implementation or token system
- Scene rail structure (the dots-and-labels component itself, just its styling)
- `<SectionSpy>` mechanism for setting active state
- Any other component outside the nav, theme toggle, and scene-rail-styling rule

---

## Order of operations

1. Find the site header component and the theme toggle component
2. Remove ⌘K (and its keybind handler if not wired to a real palette)
3. Remove `Product`, `Workflows`, `FAQ` nav links
4. Add `Get in touch` outline button → `mailto:social@zephlyn.io`
5. Replace two-button theme picker with single pill toggle
6. Edit `globals.css` §6.10 to update scene rail hover/active styles (remove underlines, use primary color for active)
7. Verify mobile layout still works
8. Verify reduced-motion fallback parity
9. Output a diff summary
10. Stop. Hand back for review.

After each step, output a short note so the user can review before continuing.
