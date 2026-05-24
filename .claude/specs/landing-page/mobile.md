# Zephlyn landing page — mobile polish

**For:** Claude Code
**Scope:** `components/landing-experience.tsx` (router), `components/reduced-motion-landing.tsx` (mobile target), site header component, global styles in `app/globals.css` if needed for breakpoint-specific rules. Possibly `app/page.tsx` if section composition needs adjusting.
**Goal:** Mobile (< 768px) renders the reduced-motion fallback by default, not the cinematic. Polish that fallback so it's a deliberate mobile experience: simpler header, no floating contact bar, dropped wordmark, smaller hero type, no wayfinding chrome. Fix the bugs visible in the current mobile screenshots (missing cards in "Where we start", text overflow, header crowding).

---

## Context

The cinematic experience (R3F + scroll-driven 7-scene narrative) is desktop-only by design. On mobile, the 3D scenes overlap the headline and body text catastrophically (e.g. NETWORK scene platforms render directly through "Software tomorrow" glyphs; AUDIT scene platforms intrude into the body paragraph). Rather than rebuild the cinematic to work in portrait viewports, mobile should serve the existing reduced-motion fallback — but the fallback needs polish to feel deliberate rather than degraded.

This brief is NOT about making the cinematic work on mobile. The cinematic stays desktop-only. The mobile job is to make the reduced-motion fallback a proper mobile experience.

---

## 1. Route mobile viewports to the reduced-motion fallback

**Current behavior:** `components/landing-experience.tsx` routes between `CinematicScene` and `ReducedMotionLanding` based on the `prefers-reduced-motion` media query.

**Change to:** Route to `ReducedMotionLanding` when EITHER:

- The user prefers reduced motion, OR
- The viewport width is < 768px (the Tailwind `md` breakpoint)

**Implementation:**

The router should use a media query that matches either condition. The cleanest way:

```tsx
// In landing-experience.tsx, replace the prefers-reduced-motion check with:
const [useStaticLayout, setUseStaticLayout] = useState(false);

useEffect(() => {
  const mq = window.matchMedia(
    "(prefers-reduced-motion: reduce), (max-width: 767px)"
  );
  setUseStaticLayout(mq.matches);
  const handler = (e: MediaQueryListEvent) => setUseStaticLayout(e.matches);
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}, []);

return useStaticLayout ? <ReducedMotionLanding /> : <CinematicScene />;
```

**Important:**

- Server-side render the static layout by default (initial `useState(false)` becomes `useState(true)` if you can detect mobile from User-Agent on the server, otherwise the client-side flip is fine but causes a brief flash of the cinematic on small viewports — acceptable trade-off if it simplifies the code)
- Rename `ReducedMotionLanding` if the name now feels wrong — it's no longer just for reduced-motion users. `StaticLanding` or `LinearLanding` are better names. Update imports if you rename.
- The `prefers-reduced-motion` global CSS rule in `app/globals.css §7` still applies and should not be touched

---

## 2. Header — mobile pattern

**Current mobile header:** `[Logo icon] Zephlyn [Get in touch button] [theme toggle]` — four elements competing for narrow space.

**Change to (mobile only, < 768px):** `[Logo icon] ........... [theme toggle]`

Specifically:

- **Drop the wordmark "Zephlyn"** on mobile. Logo icon only on the left.
- **Remove the `Get in touch` button from the header** on mobile. (The hero CTA carries this — no need for a duplicate.)
- **Keep the theme toggle** (the pill switch we built recently) on the right.
- The empty horizontal space between is fine — clean signal, not crowding.

**Implementation:**

- The wordmark is likely a separate `<span>` next to the logo `<svg>` in the brand component (`components/brand/logo.tsx` per AGENTS.md). Wrap it in `hidden md:inline` (or equivalent) so it shows on desktop but not mobile.
- Wrap the header's `Get in touch` button in `hidden md:inline-flex` so it disappears on mobile.
- Header height stays the same. Don't shrink it just because there's less content; the breathing room reads as intentional.

---

## 3. Remove the floating bottom contact bar

**Problem:** A floating bar pinned to the bottom of the viewport on mobile (visible in screenshots 3-17) shows truncated content: `IN TOUCH ... us what's slowing your shop d…` next to an `Email us` button. The text is clipping because the container is too narrow for the message; the bar appears to have been designed for desktop width.

**Action: Remove this component entirely** from both mobile AND desktop.

Rationale:

- On mobile it's visually broken (the truncation is the worst-rendered element in any screenshot)
- On desktop the AUDIT scene already has a `Email us` CTA, and the hero has `Get in touch` — three duplicate contact actions on the same page is overkill
- The floating bar pattern is mostly used by SaaS pages that need persistent conversion mechanics. Zephlyn at this stage doesn't

**Implementation:**

- Find the component (likely in `components/marketing/` — possibly named `sticky-cta.tsx`, `floating-contact.tsx`, `bottom-bar.tsx`, or similar)
- Remove its import and render from wherever it's mounted (likely `app/page.tsx` or `landing-experience.tsx`)
- Delete the component file itself
- Search the codebase for any other references and clean them up

If the floating bar's behavior is intentional and the user expects it back later, ignore the deletion instruction and just hide it via `hidden` utility class everywhere. But per the user's stated direction, full removal is preferred.

---

## 4. Static layout polish — section-by-section

The reduced-motion fallback currently linearly stacks the same content from the cinematic. Each section needs mobile-specific spacing and type adjustments. Below are the section-level edits.

### 4.1 Hero

**Current:** Headline `Less admin. Faster jobs. Cleaner handoffs.` at full desktop type scale, takes up nearly the entire mobile viewport vertically.

**Change to:**

- **Type scale: one step down.** If the desktop hero uses `type-h1`, mobile should use `type-h2` or a custom scale roughly 75-80% of current size. Use a responsive class: e.g. `text-5xl md:text-7xl` if those tokens exist, or whatever the equivalent in the design system is.
- **Container padding:** ensure adequate horizontal padding (16-24px) on mobile so headline doesn't kiss the edges.
- **CTA button:** keep the `Get in touch` button but constrain its max-width on mobile — it should NOT stretch full-width edge-to-edge. Cap at ~280px and center it. Current full-width treatment reads as a banner, not a CTA.
- **Eyebrow `• AUTOMATION FOR HOME SERVICE BUSINESSES`:** keep but ensure it doesn't wrap awkwardly — if it wraps to 2 lines on small screens, drop the bullet and shorten if needed, or allow the wrap if it lands clean.

### 4.2 PROBLEM section (11 lead-source cards)

**Current:** Cards stack 1-column on mobile. Mostly working. The section header is being scrolled past in the user's screenshot, suggesting the cards start too close to the top of the section.

**Change to:**

- Ensure section header `Every shop has 11 lead sources. None of them talk.` and the eyebrow `• 02 · THE PROBLEM` have at least 48-64px breathing room above the first card on mobile
- Card grid: 1 column on mobile (likely already), 2 columns on tablet (>= 768px), 4 columns on desktop. Don't force 4 columns on mobile.
- Each card's internal padding should be reduced slightly on mobile (16px instead of 24px) to fit more content per card without horizontal overflow

### 4.3 OUTCOME section

**Current:** Wireframe sphere illustration overlaps the headline on mobile (screenshot 3).

**Change to:**

- On mobile, position the illustration **below** the headline + body text, not behind/beside them. A vertical stack: eyebrow → headline → body → illustration.
- Constrain the illustration's max-width to ~80% of viewport on mobile so it doesn't bleed off-canvas.
- If the illustration is positioned with `absolute` for desktop layout, swap to `static` or `relative` on mobile via responsive utilities.

### 4.4 WORKFLOWS section

**Current:** The `Lead → Booked Job` diagram with sources / workflows / CRM columns. On mobile this likely shrinks but the three columns become unreadable at narrow widths.

**Change to:**

- On mobile, stack the diagram's three column groups vertically (Sources stacked → Workflow stages stacked → CRM tools stacked) with connecting flow arrows between groups, or
- If the diagram is SVG-based and can't reflow, set a horizontal scroll on the diagram container with `overflow-x-auto` and a min-width that preserves readability. Add a subtle scroll-affordance hint (e.g. fade on the right edge).
- The headline `Your day, rebuilt as connected workflows.` should sit above with adequate spacing.

### 4.5 NETWORK section

**Current:** Catastrophic. The 3D platform illustrations render directly through the words "Software tomorrow" on mobile.

**Change to:**

- On mobile, **remove the 3D platforms illustration entirely** from this section. The headline + body paragraph carry the meaning fine without them.
- Or, if you want to keep the visual, move it below the text as a smaller hero image — but the cleaner answer is to skip it on mobile.
- Headline: ensure `A service today. Software tomorrow.` doesn't break mid-word. Apply `text-balance` or `text-wrap: balance` (CSS), or set a `max-w-[*ch]` to control line breaks.

### 4.6 TOOLS section

**Current:** 3D platform illustrations behind/around the integrations panel on mobile.

**Change to:**

- Remove the 3D platform illustrations on mobile (same reasoning as NETWORK)
- Integrations panel: keep the 3-group structure but ensure cards within each group stack cleanly at narrow widths (likely a 1-column or 2-column grid on mobile vs. 3-column on desktop)

### 4.7 AUDIT section

**Current:** Purple platforms intrude into the body paragraph (screenshot 7). Critical readability issue.

**Change to:**

- Remove the 3D platforms illustration on mobile
- Layout: eyebrow → headline → body → `Email us` button → `social@zephlyn.io` caption
- Button max-width capped (don't stretch full-width)

### 4.8 "Where we start" section (the three pillars)

**CRITICAL BUG (screenshot 8):** The section header `Where we start.` and intro paragraph render correctly, but the three pillar cards (Workflow design / Scheduling / Lead intake) are completely missing on mobile. Either they have a desktop-only display rule or they're rendering off-canvas.

**Change to:**

- Diagnose and fix. The cards probably use a grid with `grid-cols-3` and no mobile fallback, causing them to either collapse to zero width or render outside the viewport.
- On mobile: stack 1-column. On tablet: 2 or 3 columns. On desktop: 3 columns.
- Each card should have its number, icon, title, and description visible without truncation.

### 4.9 "Honest about who Zephlyn fits / Not the right fit"

**Current:** Two side-by-side cards on desktop, presumably stacking on mobile (the screenshots show them stacked).

**Change to:**

- Verify cards stack 1-column on mobile (likely already)
- Ensure adequate spacing between the two cards when stacked (32-48px gap)
- Card padding sufficient that the bullet-point lists don't kiss the card edges

### 4.10 "Not an agency. Not a SaaS tool. A productized service."

**Current:** Four sub-sections (Productized, Built on your stack, Recurring support, Outcome-driven) likely in a 2x2 grid on desktop.

**Change to:**

- Mobile: stack 1-column, full width
- The left-border accent (purple bar on left of each sub-section) reads fine on mobile, keep it

### 4.11 FAQ

**Current:** Working. Items are 1-column, full width, collapsible.

**Change to:** No structural change needed. Verify the tap targets for the `+` toggle are at least 44×44px (Apple HIG minimum). If smaller, expand the clickable area to include the full row, not just the icon.

### 4.12 Closer (`Less admin. Faster jobs. Cleaner handoffs.` mega-headline)

**Current (screenshot 14):** The word `handoffs` breaks across two lines as `hand / offs.` — looks unintentional.

**Change to:**

- Apply `text-wrap: balance` or set `word-break: keep-all` on this headline so it doesn't break mid-word
- If text-wrap balance doesn't prevent it, reduce the type scale on mobile until "Cleaner handoffs." fits on a single line, OR allow it to break between words by setting `white-space: normal` and constraining max-width so the natural break is between "Cleaner" and "handoffs"

### 4.13 "Want to talk?" / contact section

**Current (screenshot 15):** Working. `social@zephlyn.io` button is full width on mobile.

**Change to:**

- Cap the `social@zephlyn.io` button max-width at ~320px and center
- Otherwise leave alone — this section reads well on mobile

### 4.14 Footer

**Current (screenshots 16-17):** Footer link columns stack into 2x2-ish grid. The large `Zephlyn` wordmark below the columns gets cut off on the right edge.

**Change to:**

- Footer link columns: 2 columns on mobile (Index + Product, then Verticals + Company), or all 4 stacked if 2-column makes them too narrow. Test and pick whichever reads cleaner.
- The large `Zephlyn` wordmark below: scale down significantly on mobile or remove entirely. Right now it's set to fill desktop width and overflows mobile.
- Bottom row (`© 2026 Zephlyn · Productized automation for home service businesses.` + the verticals list): allow this to wrap to multiple lines on mobile. Center-align if it looks better stacked.

---

## 5. Things to NOT change

- Visual design system (tokens, fonts, colors)
- Cinematic experience on desktop (>= 768px) — leave it alone
- Component architecture beyond what's necessary for the routing change
- Copy / content — this is a layout pass, not a copy pass
- The previously-completed honesty pass, polish pass, OG metadata pass, or nav redesign pass

---

## 6. Testing checklist

Before claiming done, verify on these viewport widths in browser devtools:

- **375px** (iPhone SE / older iPhones)
- **390px** (iPhone 14 / 15 standard)
- **430px** (iPhone Pro Max)
- **768px** (the cutoff — should be JUST switching to cinematic at this width)
- **820px** (iPad portrait — should be cinematic)

At each width, scroll through the full page and confirm:

- No text is cut off or overlapping
- No illustrations bleed into text
- Tap targets are >= 44px tall
- No horizontal scroll appears (other than intentional ones like the workflows diagram, if you chose horizontal-scroll for 4.4)
- The `Where we start` cards are visible
- The closer headline doesn't break mid-word
- The floating contact bar is gone

---

## Order of operations

1. Route mobile to reduced-motion fallback (section 1)
2. Remove floating contact bar (section 3)
3. Header mobile pattern (section 2)
4. Fix the "Where we start" missing cards bug (section 4.8) — this is the highest-impact visible bug
5. Fix closer mid-word break (section 4.12)
6. NETWORK / TOOLS / AUDIT 3D illustration removal on mobile (sections 4.5, 4.6, 4.7)
7. OUTCOME illustration repositioning (section 4.3)
8. WORKFLOWS diagram reflow or horizontal scroll (section 4.4)
9. Hero type scale and CTA constraints (section 4.1)
10. Footer wordmark scaling (section 4.14)
11. Remaining minor section edits (4.2, 4.9, 4.10, 4.11, 4.13)
12. Test at all viewport widths from the checklist
13. Output a diff summary
14. Stop. Hand back for review.

After each major step, output a short note with what was changed and any unexpected findings so the user can review before continuing.
