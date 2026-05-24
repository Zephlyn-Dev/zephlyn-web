# Zephlyn landing page — polish pass

**For:** Claude Code
**Scope:** `components/scene/*`, `components/marketing/*`, `components/reduced-motion-landing.tsx`
**Goal:** Fix the small issues remaining after the honesty pass — text overflows in cinematic scenes, voice inconsistencies in PROBLEM cards, CTA clarity in AUDIT scene, FAQ default state. No structural changes; this is precision work on what's already there.

---

## Context

The honesty pass landed cleanly. This brief is about the rough edges that remain: text wrapping awkwardly under 3D scenes, mismatched copy voice across the PROBLEM grid, an opaque email CTA, and an FAQ that defaults with one item open. Treat each fix as scoped — do not refactor surrounding code.

**Tone for any new/edited copy:** Same as the rest of the page. Calm, direct, founder-voice. Short sentences. No marketing-isms.

---

## 1. Text overflow: OUTCOME and NETWORK scenes

**Problem:** In both `OUTCOME` and `NETWORK` scenes, the headline text is wrapping awkwardly and overlapping the 3D scene behind it. Specifically:

- OUTCOME: `Every channel watched. Every / job moves.` — "Every" sits orphaned at the end of the first visual line before the second sentence
- NETWORK: `A service today. Soft­ware / tomor­row.` — "Software" breaks across two lines and the 3D platforms render through the text

Both reproduce in the user's actual browser, not just at screenshot viewports.

**Investigate in this order:**

1. **z-index / stacking context** — the 3D canvas (R3F) should be visually behind the HTML scene overlay panels. If `cinematic-scene.tsx` is rendering the Canvas above the overlay, or if the overlay panel doesn't have a background/backdrop, the text reads as overlapping. Check `components/scene/scene-overlay.tsx` for the panel's z-index and any backdrop blur or background-color tokens.

2. **Headline container width constraints** — open the OUTCOME and NETWORK scene panel components. The headline likely uses a `type-h1` utility and no explicit `max-w-*`. On certain viewport widths between the lg and xl breakpoints, the line wraps at a word that orphans a fragment. Adding `max-w-[*ch]` or `text-balance` (CSS `text-wrap: balance`) to the headline should fix the orphan.

3. **3D scene positioning** — if the 3D illustration in NETWORK / AUDIT is positioned `absolute` without a `pointer-events: none` and a z-index below the overlay, it can sit visually on top. Confirm the canvas layer is `pointer-events: none` and z-indexed below the HTML overlay.

**Acceptance criteria:**

- At all viewports from 1280px to 1920px wide, both headlines render without orphaned words and without 3D geometry visibly intersecting glyph shapes.
- Reduced-motion fallback should not have this issue since the 3D scene is replaced by static content — but verify, since the headline width constraints might apply there too.

**Do not:**

- Change the headline copy
- Restructure the scene component hierarchy
- Touch the camera path or scene config

---

## 2. PROBLEM scene — card description voice consistency

**Problem:** The 11 lead-source cards in the PROBLEM scene mostly describe _what the source is and why it slips_, but two cards editorialize:

- `REVIEWS — Post-job review asks` description currently reads: `The single biggest lever on local SEO, easiest to forget.` — this is a marketing claim about SEO, not a description of the source.
- `ESTIMATE SENT — Open estimates` description currently reads: `Quote sent, no follow-up cadence — gets cold in a week.` — this describes a workflow problem rather than what the source is.

Other cards (e.g. `PHONE — Missed calls — Voicemail, after-hours rings, the line nobody picked up`) follow the pattern: short noun phrase describing the source + a fragment explaining how it gets lost.

**Action:** Rewrite all 11 card descriptions for consistent voice. The pattern is:

> `[CHANNEL/SOURCE] — [Short noun phrase] — [Fragment describing how it slips through the cracks. 8–14 words. No claims. No outcome promises.]`

**Replacement copy:**

| Channel       | Title                    | Description                                                  |
| ------------- | ------------------------ | ------------------------------------------------------------ |
| PHONE         | Missed calls             | Voicemail, after-hours rings, the line nobody picked up.     |
| VOICEMAIL     | Voicemails               | Played late or never. The lead has already moved on.         |
| GOOGLE ADS    | Google Ads leads         | Lead-form drops that arrive at an inbox nobody owns.         |
| FACEBOOK      | Meta lead ads            | Sit inside Facebook Business Manager until somebody logs in. |
| MESSAGES      | Text replies             | Customer texts to the business line — and back to who?       |
| WEBSITE       | Website forms            | Quote requests routed to a shared inbox, then forgotten.     |
| ANGI          | Angi / marketplace leads | Claim windows, lead-share fees, a separate dashboard.        |
| PAST CUSTOMER | Past-customer follow-ups | Annual checkups, warranty calls, repeat-job reminders.       |
| REVIEWS       | Post-job review asks     | A reminder somebody has to remember to send.                 |
| REFERRAL      | Word-of-mouth referrals  | Neighbor flags the truck; the lead lives in a tech's head.   |
| ESTIMATE SENT | Open estimates           | Quote sent, then nothing — until the customer goes cold.     |

Changes from current:

- `REVIEWS` description rewritten — was a claim about SEO, now describes the source
- `ESTIMATE SENT` description tightened — same idea, less prescriptive about timing
- All others preserved as-is (they already match the pattern)

If the cards are driven by a data file (likely `components/scene/scene-config.ts` or a sibling `problem-cards.ts`), edit the data file rather than the JSX.

---

## 3. AUDIT scene CTA — show the email address

**Current:**

- CTA button label: `Email us`
- The mailto link is on the button but the email address itself isn't visible to the user

**Change to:**

- Button label: `Email us` (unchanged)
- Add a small caption directly below the button: `social@zephlyn.io`

**Implementation guidance:**

- The caption sits below the button, centered to match the button, with `type-caption` utility (or whatever the small-text token is in the design system)
- Token color: `text-muted-foreground` (or the equivalent semantic muted token used elsewhere on the page)
- Spacing: `mt-3` or `mt-4` from the button, whatever matches the section's existing vertical rhythm
- Not a link itself — the button already links to `mailto:social@zephlyn.io`. The caption is informational.

**Why:** Visitors hovering over a generic "Email us" button can't see where the click goes. Showing the address builds trust and lets people copy it directly into their own client if they prefer.

---

## 4. FAQ — default state collapsed

**Current:** When the FAQ section renders, one question (`Which trades do you work with?`) is open by default.

**Change to:** All FAQ items collapsed by default.

**Implementation:**

- Find the FAQ accordion component in `components/marketing/` (likely `faq.tsx` or similar)
- The default open state is probably set in a `defaultValue` prop, an initial `useState`, or a hardcoded `open` attribute on the relevant accordion item
- Remove whatever's pinning that item open
- Leave the accordion's interaction behavior unchanged — clicking still toggles items open/closed

---

## 5. "Where we start" — card voice consistency

**Problem:** The three pillar cards survived the previous trim but the voice across them isn't fully aligned.

- `Workflow design` description: `Map how work moves through the business. Remove the bottlenecks between systems, people, and the next step.` — descriptive, no claims. Good.
- `Scheduling` description: `Booking, confirmations, reminders, dispatch coordination, internal scheduling handoffs — automated end-to-end.` — the `automated end-to-end` tail is a leftover productized claim. Strip it.
- `Lead intake` description: `Routing intake from websites, forms, ads, calls, and marketplace leads so the right info reaches the right system fast.` — `so the right info reaches the right system fast` is a mild claim. Soften.

**Replacement copy:**

| #   | Title           | Description                                                                                                         |
| --- | --------------- | ------------------------------------------------------------------------------------------------------------------- |
| 01  | Workflow design | Map how work moves through the business. Find the bottlenecks between systems, people, and the next step.           |
| 02  | Scheduling      | Booking, confirmations, reminders, dispatch coordination, and the internal handoffs that come with them.            |
| 03  | Lead intake     | Routing inbound leads from websites, forms, ads, calls, and marketplaces so each one lands somewhere a person owns. |

Minor change to `Workflow design` — `Remove` → `Find`. The previous wording promised removal; "find" is honest about what mapping does in the first conversation.

---

## 6. "Honest about who Zephlyn fits" — small wording fix

**Problem:** In the "Built for you if…" card, the line `You're already on a CRM or field-service tool — ServiceTitan, Jobber, Housecall Pro, HubSpot, or similar.` lumps HubSpot in with field-service tools. HubSpot is a CRM but not a field-service tool, which makes the example list confusing for the audience that knows the difference (the audience you want).

**Change to:** `You're already on a CRM or field-service tool — ServiceTitan, Jobber, Housecall Pro, or similar.`

Just remove HubSpot from this list. The line still reads accurately and the examples now all sit in the same category.

---

## 7. Reduced-motion fallback parity

Apply changes 1, 2, 3, 5, and 6 to the reduced-motion fallback (`components/reduced-motion-landing.tsx`) as well, where the corresponding content exists. Change 4 (FAQ default state) applies regardless of motion preference and only needs editing in one place if the FAQ component is shared.

Per AGENTS.md, parity between cinematic and reduced-motion is required. Don't let them drift.

---

## Things to NOT change

- Visual design system (colors, fonts, tokens, spacing)
- Cinematic scroll architecture
- Camera path or scene-config keyframes
- Component file structure or imports
- The previously-completed honesty-pass edits (don't accidentally re-introduce a deleted section while editing nearby code)

---

## Order of operations

1. Text overflow investigation (OUTCOME + NETWORK) — biggest visual impact, do first
2. PROBLEM card data file edits
3. "Where we start" card descriptions
4. AUDIT CTA caption
5. FAQ default collapsed
6. "Built for you" HubSpot removal
7. Reduced-motion parity pass
8. Stop. Hand back for review.

After each step, output a one-line diff summary so the user can review before continuing.
