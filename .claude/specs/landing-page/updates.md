# Zephlyn landing page — honesty pass

**For:** Claude Code
**Scope:** `app/page.tsx`, `components/landing-experience.tsx`, `components/reduced-motion-landing.tsx`, `components/scene/*`, `components/marketing/*`, `app/sample-audit/*`
**Goal:** Remove all fabricated proof (customers, metrics, pilots, prices, live system claims) from the landing page. Replace booking flow with a simple mailto contact. Delete the sample audit page entirely. Keep all visual polish, typography, motion, and component architecture intact — this is a copy/content pass, not a redesign.

---

## Context for this rewrite

Zephlyn is a pre-revenue, pre-product, two-founder company. The current site overclaims significantly: it shows fake customer dashboards, fabricated pilot metrics ("47% faster," "60% recovery across our first three pilots"), an undefined audit offer with a calendar booking, a fabricated sample workflow, and concrete pricing for services that haven't been productized.

The fix is to strip everything the company can't actually back, keep the narrative framing, and let visitors get in touch by email instead of booking a call for a service that doesn't exist yet.

**Visual treatment, fonts, colors, cinematic scroll, and component architecture all stay.** Only copy and section presence change.

**Tone:** Calm, direct, founder-voice. No marketing-isms. No "we help businesses…" boilerplate. Short sentences. Active voice. The current copy's rhythm is mostly fine — most rewrites are removing claims, not changing voice.

---

## Section-by-section changes

### 1. Hero (`SIGNAL` scene)

**Current:**

- Eyebrow: `• AUTOMATION FOR HOME SERVICE BUSINESSES`
- Headline: `Less admin. Faster jobs. Cleaner handoffs.`
- Subhead: `We build automation systems for HVAC, roofing, plumbing, electrical, restoration, and solar — so leads get answered, estimates move, and sold work hits ops without anyone retyping anything.`
- Primary CTA: `Book the 30-min audit — lunch's on us`
- Secondary CTA: `See a sample audit`
- Sub-CTA line: `If we can't find 3 workflows worth fixing in 30 minutes, we'll send you a $25 DoorDash credit. No catch.`
- `• LIVE` indicator
- `• CURRENTLY PILOTING WITH` + 5 fabricated company logos (Frontier Plumbing, BrightSpark Electric, Summit Solar, NorthStar Restoration, Mile-High [something])

**Change to:**

- Eyebrow: `• AUTOMATION FOR HOME SERVICE BUSINESSES` (unchanged)
- Headline: `Less admin. Faster jobs. Cleaner handoffs.` (unchanged)
- Subhead: `Automation for home service shops drowning in admin work — so leads get answered, estimates move, and sold jobs reach ops cleanly.`
- Primary CTA: `Get in touch` → `mailto:social@zephlyn.io`
- **Delete secondary CTA entirely** (the sample audit page is being removed)
- **Delete sub-CTA line entirely** (DoorDash guarantee)
- **Delete `LIVE` indicator entirely**
- **Delete `CURRENTLY PILOTING WITH` strip entirely** including all logos and any data file that backs them

---

### 2. PROBLEM scene

**Current:**

- Eyebrow: `• 02 · THE PROBLEM`
- Headline: `Every shop has 11 lead sources. None of them talk.`
- A fake live dashboard mockup labeled `• LIVE · APEX HVAC — YOUR OWNER'S PHONE` showing `11 UNREAD · 0 ROUTED · LOST REVENUE: $9,840 TODAY` with 11 fake notification cards (missed call, voicemail, Google Ads lead, Facebook lead, etc.) tagged LOST/SLIPPING/STALE, footer `11 NOTIFICATIONS · 0 ANSWERED · EVERY ONE WAS A JOB`.

**Change to:**

- Eyebrow: unchanged
- Headline: unchanged — this one's fine, it's a framing claim, not a measured claim
- **Replace the fake live dashboard** with a static, clearly-illustrative version:
  - Remove the `• LIVE · APEX HVAC — YOUR OWNER'S PHONE` header
  - Remove the `11 UNREAD · 0 ROUTED · LOST REVENUE: $9,840 TODAY` counter
  - Keep the 11 notification cards as a visual showing the variety of lead sources, but change the header label to something like `THE 11 PLACES A LEAD CAN LAND` or `SOURCES A TYPICAL SHOP JUGGLES`
  - Remove the LOST/SLIPPING/STALE status tags from each card (they imply real data)
  - Remove the footer line `11 NOTIFICATIONS · 0 ANSWERED · EVERY ONE WAS A JOB`
  - Cards should read as a visual taxonomy of lead sources, not a live dashboard of a real customer

**Why:** The headline ("11 lead sources, none of them talk") is a defensible industry framing. The dashboard mockup with a named customer and a specific dollar figure crosses into fabrication.

---

### 3. OUTCOME scene

**Current:**

- Eyebrow: `• THE OUTCOME`
- Headline: `Every channel watched. Every job moves.`
- Subhead: `Lead intake, scheduling, estimates, and ops handoffs running quietly in the background — on the tools you already use.`

**Change to:** No changes. This section is framing, not claims. Leave it alone.

---

### 4. WORKFLOWS scene

**Current:**

- Eyebrow: `• 04 · WHAT WE AUTOMATE`
- Headline: `Your day, rebuilt as connected workflows.`
- A diagram showing 11 sources flowing through 3 workflow steps (Lead capture / Route + tag / Schedule) into 5 CRM/ops tools (ServiceTitan, HubSpot, Jobber, Housecall Pro, QuickBooks)
- Diagram header: `• WORKFLOW · LEAD → BOOKED JOB` and `V4.2 · 38MS · LIVE`
- Footer: `ALL 11 SOURCES · 3 WORKFLOWS · 5 SYSTEMS · EVERY SIGNAL CONNECTED`

**Change to:**

- Eyebrow + headline: unchanged
- Diagram itself: unchanged (it's an illustrative architecture, not a claim of a running system — that's fine)
- **Remove `V4.2 · 38MS · LIVE`** from the diagram header (claims a real running system with versioning and latency metrics)
- Header should now just read: `WORKFLOW · LEAD → BOOKED JOB`
- Footer line `ALL 11 SOURCES · 3 WORKFLOWS · 5 SYSTEMS · EVERY SIGNAL CONNECTED` — keep, this reads as illustrative

---

### 5. NETWORK scene

**Current:**

- Eyebrow: `• HOW WE'RE BUILT`
- Headline: `A service today. Software tomorrow.`
- Subhead: `We start as a productized automation service with recurring support — fixing your workflows now, learning what repeats across shops, and turning the strongest pieces into software later. You get the wins on day one; you stop paying for the same lesson twice.`

**Change to:**

- Eyebrow + headline: unchanged
- Subhead: change `fixing your workflows now, learning what repeats across shops` to `fix workflows now, learn what repeats across shops` — the "ing" form implies an active ongoing practice; the bare verbs read as the plan, which is what's actually true
- Remove `You get the wins on day one; you stop paying for the same lesson twice.` — the "wins on day one" claim is unbacked and the second clause assumes prior agency burns the visitor may not have had

Final subhead: `We start as a productized automation service with recurring support — fix workflows, learn what repeats across shops, and turn the strongest pieces into software later.`

---

### 6. TOOLS scene

**Current:**

- Eyebrow: `• 06 · TOOLS WE CONNECT`
- Headline: `Built on what you already run.`
- Integrations panel: `INTEGRATIONS · 180+ CONNECTORS` header, three groups (Field Service & Dispatch, CRM Comms & Forms, Money Ops & Glue) with 18 named tools, footer `3 GROUPS · 18 TOOLS · 3 SERVICES`
- Three service cards at bottom: `AUDIT — Workflow audit — 30-min screen-share — Free · 30 minutes`, `BUILDOUT — Workflow buildout — 3-week sprint`, `SUPPORT — Ongoing support — Month-to-month`

**Change to:**

- Eyebrow + headline: unchanged
- Integrations panel:
  - Change `INTEGRATIONS · 180+ CONNECTORS` to `INTEGRATIONS · COMMON TOOLS` (the "180+ connectors" number is unbacked)
  - Keep the three groups and the 18 named tools — these are honest examples of what's in scope
  - Remove the footer line `3 GROUPS · 18 TOOLS · 3 SERVICES`
- **Delete the three service cards entirely** (audit/buildout/support with durations and "free"). These describe productized services that haven't been productized. Scope is one of the things we're trying to figure out on the call.

---

### 7. AUDIT scene (cinematic finale)

**Current:**

- Eyebrow: `• GET AUDIT`
- Headline: `Book the free workflow audit.`
- Subhead: `30 minutes, screen-share. We'll map the three workflows we'd build first — costed and ranked by ROI. If none of them are worth fixing, lunch's on us.`
- CTA: `Book the 30-min audit — lunch's on us`

**Change to:**

- Eyebrow: `• GET IN TOUCH`
- Headline: `Tell us what's broken.`
- Subhead: `We're working with our first shops now. If your admin work is slowing the business down, we want to hear about it — and we'll be straight about whether we can help.`
- CTA: `Email us` → `mailto:social@zephlyn.io`

**Why:** No audit offer until we've defined what an audit is. "Tell us what's broken" is honest about where the company is and filters for the right early conversation.

---

### 8. Stat strip (`11 sources / 47% / 6 hrs`)

**Action: DELETE ENTIRE SECTION.**

Every number is fabricated. There's no honest version of this without real data.

---

### 9. "One workflow we'd build for you next week" + HVAC/Roofing/Plumbing/Restoration tabs + 5-stage workflow card

**Action: DELETE ENTIRE SECTION.**

The 5-stage callback workflow (CallRail → Twilio → ServiceTitan → Slack → ServiceTitan) and the `Recovers ~$2,400/mo of after-hours emergency revenue` outcome are fabricated. The "Pick your trade · See a real workflow" framing claims real workflows that don't exist. No salvageable version.

---

### 10. Six pillars (`Six pillars. One quietly running shop.`)

**Current:** Six cards — Workflow design, Scheduling, Form submission, Data integrity, Inventory tracking, Marketing automation.

**Change to:** Trim to **three pillars**. The six-pillar list comes from the internal strategy doc and signals the company has scoped six service lines. It hasn't. Three is more honest at this stage and matches the "lead capture, estimates, sales-to-ops handoff" wedge the rest of the page (correctly) keeps coming back to.

- Eyebrow: unchanged (`WHAT WE AUTOMATE`)
- Headline change: `Six pillars. One quietly running shop.` → `Where we start.`
- Subhead change: `Every workflow we build slots into one of these six. Pick the three that hurt most today — that's where the pilot starts.` → `Three workflow families that show up in almost every shop we talk to. This is where we'd look first.`
- **Keep:** Workflow design (01), Scheduling (02), Form submission (03)
  - Note: rename `Form submission` to something clearer like `Lead intake` — "form submission" reads as a single channel, when the description is actually about routing intake from multiple sources
- **Delete:** Data integrity (04), Inventory tracking (05), Marketing automation (06)

Renumber the remaining three as 01/02/03. Keep the card descriptions for the three that survive — they're fine.

---

### 11. "Built for you if / Not the right fit if"

**Current:** Two cards with eligibility criteria. The "Built for you if" card includes `You run a $1M—$15M home-service business`, `You're already on ServiceTitan, Jobber, Housecall Pro, or a similar field-service / CRM stack`, and other specific criteria.

**Change to:** Keep the section — the "be honest about fit" framing is good and on-brand for the honesty pass. But soften the specifics, because the current criteria assume customer-profile validation that hasn't happened.

- Eyebrow: unchanged (`IS THIS FOR YOU?`)
- Headline: unchanged
- Subhead: unchanged

**Built for you if… — change to:**

- `You run a home-service shop and admin work is starting to slow the business down.` (replaces the `$1M–$15M` band — keep the band out until you've validated the buyer)
- `You're already on a CRM or field-service tool — ServiceTitan, Jobber, Housecall Pro, HubSpot, or similar.` (keep the examples, drop the requirement framing)
- `Leads are coming in faster than your team can answer them, and handoffs between sales, scheduling, and ops are getting messy.` (replaces the current "phone rings faster than people can pick up" line — same idea, less punchy-claim, more descriptive)
- `You want workflows that run on the tools you already pay for — not a new platform to learn.` (unchanged, this one's good)

**Not the right fit if… — keep as-is.** All four items are negative-space framings ("we don't do X") that are honest by construction. Don't change them.

---

### 12. "Not an agency. Not a SaaS tool. A productized service."

**Action: No changes.** This section is positioning/framing, not metric claims. It reads honestly given the stage. Leave it alone.

---

### 13. Comparison table (`You're not choosing between Zephlyn and another agency`)

**Current:** Table comparing Zephlyn vs. Hire a VA vs. DIY Zapier/Make vs. Do nothing across six rows (Setup time, Year-1 cost, Recovers dropped leads automatically, Works inside ServiceTitan/Jobber/HCP, Who fixes it when something breaks, Scales with new lead sources).

**Action: DELETE ENTIRE SECTION.**

The Zephlyn column makes specific claims that aren't backed: `Live in 3 weeks`, `~$33k (pilot + 11 mo operate)`, `Yes — that's the core workflow`, `Native — we build on your stack`, `We do — on retainer`, `Yes — we add nodes monthly`. Every cell is a productized claim. We can rebuild this once there's a defined offering and a real timeline. For now, it goes.

---

### 14. ROI calculator (`What slow follow-up is costing you`)

**Action: DELETE ENTIRE SECTION.**

The calculator's anchor — `60% recovery · The average across our first three pilots` — is explicitly fabricated. The output ("$341k annual leak", "$205k typically recovered", "6.6× year-1 ROI") all derive from that fabricated multiplier. The section can't be made honest without real pilot data. Delete entirely; rebuild post-pilot.

---

### 15. Pricing (`Three engagements. Pick one and stop here.`)

**Action: DELETE ENTIRE SECTION.**

Three tiers (Audit Free / Pilot From $4.5k / Operate From $2.4k/mo) describe services that haven't been productized. Pricing concrete services that don't exist is the load-bearing claim of the whole page. Delete entirely.

The "Get in touch" CTA in the AUDIT scene replaces it functionally — interested visitors email, the founders figure out scope live.

---

### 16. FAQ (`Questions we get a lot`)

**Action:** Keep the section, edit the answers.

**First, change the section title.** `Questions we get a lot` implies a body of past inquiries that doesn't exist. Change to `Common questions.`

Then audit each Q&A — most of the visible answers reference things being deleted (pilots, three workflows, the audit, the ROI multiplier). Specifically:

- `How long does a buildout take?` — if the answer mentions "3-week pilot" or specific timelines, soften to "depends on scope — we'll know after the first conversation."
- `What if our current process is a mess?` — likely fine, but check that the answer doesn't reference a pre-built audit deliverable.
- `Do we have to switch from ServiceTitan / Jobber / our CRM?` — likely fine, this is a real architectural answer.
- `What if our team isn't very technical?` — likely fine.
- `How is this different from hiring an admin or VA?` — check that it doesn't reference the comparison table being deleted.
- `What does ongoing support actually cover?` — soften — there's no defined "ongoing support" tier yet. Reframe as "what would happen month-to-month if we kept working together."
- `Do you work with small shops or only enterprise?` — answer should be honest: "We're early — we're talking to shops of a range of sizes right now to figure out where we add the most value."
- `Which trades do you work with?` — the visible answer is fine: HVAC, roofing, plumbing, electrical, restoration, solar.
- `Are you a SaaS product, an agency, or something else?` — likely fine, this maps to the "productized service" framing that's staying.

**General rule for FAQ edits:** if an answer references something this brief is deleting (pilots, audit, three workflows, the comparison table, pricing tiers, ROI multipliers, specific timeline claims), reword it to describe the _plan_ or the _approach_, not the _productized offering_.

---

### 17. Closer (`Less admin. Faster jobs. Cleaner handoffs.` mega-headline)

**Current:**

- Eyebrow: `• FROM THE ZEPHLYN TEAM`
- Big headline: `Less admin. Faster jobs. Cleaner handoffs.`
- Sub: `We help businesses simplify operations, save time, and grow through automation.`
- Tagline: `Starting with HVAC, roofing, plumbing, electrical, restoration, and solar shops.`

**Change to:** No changes. This section is brand reinforcement, not claims. Leave it.

---

### 18. Booking calendar (`Pick a time. We'll bring the audit.`)

**Action: DELETE ENTIRE SECTION.**

The whole calendar widget — day selector, time slot grid, "Pick a time to continue" button, "You'll get a calendar invite + Zoom link" sub-text — gets removed. The audit offer is not yet a thing the founders can deliver.

**Replace with a minimal contact block:**

- Eyebrow: `GET IN TOUCH`
- Headline: `Want to talk?`
- Subhead: `Email us with what's slowing your shop down. We'll write back the same day with whether we think we can help.`
- CTA: a single prominent `mailto:social@zephlyn.io` link styled as a button, label: `social@zephlyn.io`

Keep the surrounding visual treatment (the section card, the ambient glows, the section spacing) — just swap the calendar component for the contact block.

---

### 19. Footer

**Current sitemap:**

- INDEX: Home, Six pillars, Why Zephlyn
- PRODUCT: What we automate, Why Zephlyn, Pricing, FAQ
- VERTICALS: HVAC, Roofing, Plumbing, Electrical, Restoration, Solar
- COMPANY: Book an audit, Get in touch, Trust & security

**Change to:**

- INDEX: Home, Where we start, Why Zephlyn (renamed from "Six pillars" to match the new section name)
- PRODUCT: What we automate, Why Zephlyn, FAQ (**remove Pricing** — section is deleted)
- VERTICALS: keep all six unchanged
- COMPANY: Get in touch, Trust & security (**remove "Book an audit"** — no audit offer to book)

**If `Trust & security` links to a real page, leave it.** If it's a placeholder/404, remove it too. Check before editing.

Footer bottom line `© 2026 Zephlyn · Productized automation for home service businesses.` — unchanged.

---

### 20. Top nav

**Current:** `Product · Workflows · Pricing · FAQ · ⌘K · theme toggle`

**Change to:** `Product · Workflows · FAQ · ⌘K · theme toggle`

Remove `Pricing` from nav (section is deleted).

---

## /sample-audit page

**Action: DELETE THE ENTIRE PAGE AND ROUTE.**

- Delete `app/sample-audit/` directory and all files inside it
- Search the codebase for any internal links to `/sample-audit` and remove them — at minimum, the hero secondary CTA already covered above, plus any "See a sample audit" references in marketing components, footer links, or nav
- Remove from sitemap/metadata if explicitly listed
- The route should 404 after this, which is the intended behavior

---

## Reduced-motion fallback (`components/reduced-motion-landing.tsx`)

Apply **all of the above changes** to the reduced-motion fallback as well. Per AGENTS.md, parity between cinematic and reduced-motion is required. Any section deletion in the cinematic should mirror in the fallback. Any copy change should mirror. Don't let them drift.

---

## Things to NOT change (guardrails)

To prevent scope creep — these are explicitly out of scope for this pass:

- **Do not change the visual design system** (colors, fonts, tokens, spacing primitives, component library)
- **Do not change the cinematic scroll architecture** — keep the 7-scene structure even though scene content changes
- **Do not change the camera path** or `STAGE_RANGES` in `scene-config.ts` — copy edits don't require keyframe changes
- **Do not change the nav rail labels** (SIGNAL / PROBLEM / OUTCOME / WORKFLOWS / NETWORK / TOOLS / AUDIT) — they map to scene IDs, not user-facing copy
- **Do not introduce new components** — every change above is either deletion or copy edit on existing components
- **Do not run `lint`/`build` validation as part of this task** — the user wants to review copy diffs first, then build

---

## Order of operations (suggested)

1. Hero (`SIGNAL`) — smallest, most visible, good warm-up
2. Other cinematic scenes (PROBLEM, OUTCOME, WORKFLOWS, NETWORK, TOOLS, AUDIT) in order
3. Section deletions (stat strip, sample workflow, comparison table, ROI calculator, pricing, booking calendar)
4. Post-cinematic section edits (six pillars trim, "built for you" softening, FAQ)
5. Nav + footer link removals
6. Reduced-motion fallback parity pass
7. Delete `/sample-audit` page + route
8. Stop. Hand back to the user for review.

After each section, output a short diff summary so the user can review before continuing to the next.
