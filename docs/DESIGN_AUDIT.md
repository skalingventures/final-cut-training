# Final Cut — design and UX audit

**Date:** 2026-09-06 · **App version audited:** 1.6.0 · **Reference:** Skaling Ventures Design System v1.0 (`agent-factory/standards/brand/skaling_ventures_ds`, 2026-09-05) and the factory design sensibility (`agent-factory/standards/design/`).

**Method.** Read the full DS package (tokens, thirteen primitives, MODES, SURFACES, NAMING, START-HERE) and the factory critique protocol. Read every Final Cut source file. Rendered the app in headless Chromium at 390 px (iPhone) and 1280 px through eleven real states: setup, each day type, readiness set, flags set, a blocked lift, week-2 carry-forward, every drawer open. Measured computed type sizes, corner radii, tap targets and contrast on the live DOM. Ran `validate_surface.py --surface operating_instrument` (passes). One caveat: Google Fonts is blocked at the sandbox egress, so the screenshots render in fallback faces. Every finding about weight and family below is taken from the stylesheet, not from pixels.

---

## 1. Verdict

Final Cut has the right bones and the wrong skin.

The bones are good: the palette values are the DS values to the hex, numbers are already mono, empties are honest, readiness genuinely rewrites the session, and the data model is careful about a single phone. That is more than most first builds get right.

The skin is the **superseded** Skaling spec — the v2.0 document the DS README explicitly retired. Ten- and fourteen-pixel radii, pill chips, DM Sans at 700–800, gradient tints, glass blur, and a hand-drawn mountain instead of the mark. The DS calls each of these out by name as the fastest ways to make a surface stop looking like Skaling Ventures. On top of that, the app runs its type at 10–13 px against a 16 px floor, and hands the reader a 5,000-pixel scroll for one training session with six competing objects pinned in the header.

The fix is not a restyle. It is (a) load the DS tokens and primitives instead of re-declaring them, (b) raise the type floor, (c) spend the accent once, and (d) split the daily instrument from the reference material. Sections 4–5 sequence that.

---

## 2. Surface classification

The DS asks that every surface be classified before any CSS is written.

| Question | Answer |
|---|---|
| Who reads it | One operator (you) who already knows the program |
| When | Phone in hand, between sets, in a garage gym |
| Job in the first minute | Know what to do next, log it in one thumb, see the RPE ceiling |
| Family | **Operating instrument** → Mode G, Graphite. Correct as built. |
| Register | Dense, judgement-first, evidence on demand |

One gap belongs to the DS, not the app. The four SV families are all *read* surfaces. Final Cut is *operated*: sticky chrome, 44 px targets, inline numeric entry, segmented controls. Nothing in `skaling_ventures_ds` speaks to those. Section 6 proposes a handheld addendum so the next SV app does not have to invent it again.

**Thesis for the rebuild, one sentence:** *A printed session card you can write on: the day's work in one column, the judgement at the top, the log inline, and nothing else on the page.*

---

## 3. Findings

Severity: **P0** breaks the brand contract or the legibility floor · **P1** hurts the daily job · **P2** polish.

### 3.1 Brand system conformance

| # | Finding | Evidence | Sev |
|---|---|---|---|
| B1 | **Rounded everything.** 45 `border-radius` declarations; 10 px on cards, inputs, set buttons; 14 px on panels; 999 px pills on flags, chips, Today, carry buttons. | `styles.css:30–31`, computed: 61 elements at 10 px, 16 at 999 px, 11 at 50 % | P0 |
| B2 | **Display weight 600–800.** Session title 700, setup h1 800, day number 700, reference h4 700, closer 700, primary button 700. The DS carries display at 300 and caps UI emphasis at 500; 700 is the wordmark's alone. | `font: 800 32px`, `font: 700 clamp(26px…)`, 17× `font: 600`, 5× `700`, 2× `800` | P0 |
| B3 | **Wrong typeface.** DM Sans is the retired spec's face. The DS stack is Neue Haas Grotesk → Helvetica Neue → Inter → DM Sans. | `--font-display: "DM Sans"` | P0 |
| B4 | **Gradients, glass and blur.** `backdrop-filter: blur(10px)` on the sticky header; `linear-gradient` tints on `.guard`, `.rx-card`, the mast rule; `color-mix()` on section rules (the DS avoids it for renderer parity). The brand's motion vocabulary is transparency and hairlines, not blur. | `styles.css:94, 178, 389, 553, 1034` | P0 |
| B5 | **The mark is not the mark.** A three-peak mountain drawn in `app.js` stands in for the five-peak `sv-mark.svg`. "Skaling Ventures" is typed as text in the setup card and the colophon; the DS forbids the typed wordmark. | `app.js:171–178`, `index.html:19, 268` | P0 |
| B6 | **Tokens re-declared, not consumed.** 47 local custom properties mirror DS values by hand (`--bg`, `--panel`, `--accent`…) plus 32 `rgba()` literals and 6 stray `#1F1F1F` outside `:root`. Any DS change will silently drift. | `styles.css:2–45`; `grep rgba` | P1 |
| B7 | **Status colour as decoration.** Six phase colours (sage, fog, copper, rust, green, muted) and five heat colours (ok/warn/accent/bad/muted) paint rails, nodes, pips, week bars and day dots. The DS rule: "Status carries state, never decoration." Green on a *tissue* node does not mean success; a red rail on burnout does not mean danger. | `styles.css:34–44, 519–524, 787–796` | P0 |
| B8 | **Hover-only information.** Phase pips in the header carry their `done/total` only in a `title` attribute. | `app.js:231` | P2 |
| B9 | **Motion guard present but partial.** `prefers-reduced-motion` is honoured for CSS; the `focusWork()` smooth scroll checks it too. Good. | — | ✓ |

### 3.2 Type and legibility

Computed font sizes across every text node on Day 1 (390 px viewport):

| Size | Nodes | What it is |
|---|---|---|
| 7.5 px | 7 | `.day-theme` (Ankles / Hips / Spine under each day) |
| 8.5 px | 5 | `.phase-kicker` ("TISSUE", "STRENGTH" above each section) |
| 9.5 px | 6 | `.wk em`, `.axis span` |
| 10 px | 56 | field labels, set labels, Today, carry, mbtn, week labels, ramp |
| 11 px | 32 | flags, tool chips, hist key, last-week chips, notes |
| 12–12.5 px | 20 | cues, `.why`, `.tool`, intent-sub |
| 13 px | 190 | body copy, readiness buttons, ref `<dl>` |
| 14–15.5 px | 25 | movement names, rx |
| 16 px+ | 19 | main lift name, section titles, day title |

About 85 % of readable text sits at 13 px or below. The DS floor is 16 px body, 14 px labels, 18 px titles, and its own note on the point: *"If a density problem appears, reduce redundancy or change the visualization. Do not shrink type first."* The app did the opposite: it kept every redundancy (see 3.3) and shrank the type to fit.

Contrast is the one place the numbers hold: every text pair measured passes 4.5:1 (muted on raised surface is the narrowest at 4.88:1). Because the palette is the DS palette, that is inherited, not earned; keep it.

### 3.3 Hierarchy and information architecture

| # | Finding | Sev |
|---|---|---|
| H1 | **Six objects compete in 65 px of sticky chrome:** mark, "Saved just now", "W1 · Mon", Ready chip, Today pill, five phase pips, progress ring. On a 390 px phone "SAVED JUST NOW" wraps to two lines and pushes the week label down. The header should carry three things: where you are, how far along, and one way to move. | P1 |
| H2 | **Every section says its name twice.** Kicker "TISSUE" at 8.5 px sits directly above the title "TISSUE"; "STRENGTH / STRENGTH"; "MOBILITY / MOBILITY". The kicker is the phase and the title is the phase. One of them is noise. | P1 |
| H3 | **Three parallel progress systems.** The timeline rail + circular phase node on the left, the coloured left border on each module, and the header pips all encode the same five-phase state. Plus the ring. Pick one. | P1 |
| H4 | **The page is 4,950 px tall for one session** (13,000 px with drawers open). Tissue alone is five 200 px rows because each cue is a paragraph and each tool/duration is a pill. On a rest day the same 250 px readiness card leads the page even though readiness does not change a rest day. | P1 |
| H5 | **The reference manual lives inside the daily instrument.** The "Reference" drawer is ~12,000 px of canon, rules, glossary and week-at-a-glance, rendered on every load and printed under every session. It is a second document and should be a second page (or the README). | P1 |
| H6 | **The session title is set like a poster.** `800` weight, uppercase, `clamp(26px, 7vw, 36px)`. On an operating instrument the day theme is a label, not a headline. The DS section head is weight 300 uppercase over a hairline. | P0 |
| H7 | **Finish session is below the fold of the fold.** After Downshift, before four drawers. Finishing is the one action every session ends with; it belongs where the thumb is. | P1 |
| H8 | **Primary button text is the same size as a chip.** "START THE BLOCK" and "FINISH SESSION" at 14 px 700 uppercase read as louder versions of the 10 px pills. A `.svb-lg` at 16 px 500 with square corners would read as the one primary action. | P2 |

### 3.4 Interaction and daily UX

| # | Finding | Evidence | Sev |
|---|---|---|---|
| U1 | **The toast steals taps.** It is `position: sticky` at the top of the content column, 5 s, and overlaps the section beneath it. During testing, set-button taps under an active toast were lost. "Readiness set for this session · UNDO" fires on every readiness tap, so the first thing a user does on every day triggers a 5 s overlay. | `styles.css:1042–1052`, `app.js:880` | P1 |
| U2 | **Sets are logged, loads are not.** Four set squares, then one Load / Reps / RPE for the whole lift. A 5 × 3 at RPE 8.5–9 in Week 5 is exactly the week where set 1 and set 5 differ. Per-set entry (or "same as last" defaulting) is the core logging job of a strength app. | `app.js:485–494` | P1 |
| U3 | **Week 2 prescription reads "4 × 6 @ slightly heavier."** The `rpe` field for week 2 is prose, and it is rendered in the numeric slot on every main lift and in the carry-forward shift note. | `program.js:374`, screenshot `w2-carry` | P1 |
| U4 | **Truncated placeholder.** "Did instead (RDL, goblet…)" renders as "Did inste" in an 88 px input. | `.log-in.wide`, `app.js:480` | P2 |
| U5 | **Typing an RPE, then tapping a set, loses the tap.** The `change` handler for RPE (and for bodyweight and flags) calls `renderSession()` / `render()`, which replaces the whole session DOM. On a phone the blur that fires `change` is the same gesture as the next tap, so the tap lands on a node that no longer exists. Reproduced in Chromium: fill RPE `7.5`, tap set 1 → set 1 stays unchecked, and Week 2 then reports "W1 was incomplete". The pure logic (`priorLift`) is correct; the DOM churn is the bug. Update the RPE warning in place instead of re-rendering. | `app.js:947`, `app.js:941`, `app.js:900`; probe log | P1 |
| U6 | **Native `<select>` and `<input type=date>` are unstyled** against the custom inputs beside them (the "Scaled?" select in the burnout log, the block-start date). The DS ships `select.svf-input` with its own arrow. | `index.html:83`, `app.js:560` | P2 |
| U7 | **Tap targets under 44 px:** ready chip 34 px, fold "Hide/Show" 28 px, checkboxes 40 px, metric buttons 40 px, undo 36 px. | measured | P2 |
| U8 | **Navigation is a top drawer.** Week/day live behind the header on a phone, the furthest point from the thumb. Previous/next day at the bottom of the session (where Finish is) covers 95 % of real navigation. | — | P2 |
| U9 | **"Pick once. It stays with this session only."** then a toast, then an undo, then an rx card, then the header chip changes colour. Four confirmations for one tap. The rx card is the only one that carries information. | — | P2 |
| U10 | **Backup exposes raw JSON by default.** The textarea prints the whole log on every render. Restore-by-paste is a fallback; it should be a disclosure under Export, not the face of the panel. | `index.html:112` | P2 |
| U11 | **The rest-day chrome is the training-day chrome.** Sunday shows the readiness card, four flags, a heat-coloured rail, a "RECOVERY / OPTIONS" section head with "0/1 · choose one", and three cards for "Full rest / Easy mobility / Walk with family". A rest day wants one line and a checkbox. | screenshot `d7-top` | P1 |

### 3.5 What is working — keep it

- Palette values are the DS values exactly. Mode G is the right mode.
- Numbers are already mono (IBM Plex Mono is the DS mono).
- Honest empties: "No prior weeks logged", "Nothing logged yet", "needs bodyweight".
- Readiness and flags rewrite the prescription and block lifts. This is the app's real intelligence; it should be *more* visible, not less.
- `aria-pressed`, `aria-live`, skip link, `main-content`, reduced-motion guard, visible `:focus-visible`. The floor sensor passes.
- Local-first, export-before-you-clear copy is plain and true.
- Week 6 deload maths and RPE-over-target warning are exactly the kind of judgement an operating instrument should surface.

---

## 4. Recommendations, sequenced

### P0 — Adopt the system (one PR, mostly deletion)

1. **Vendor `ds/tokens/` and the primitives you use** (`a11y`, `rule`, `mark`, `button`, `card`, `tile`, `badge`, `disclosure`, `field`, `input`, `check`) into `final-cut-training/ds/`. Delete the 47 local tokens; keep only Final Cut-specific component-local tokens (`--fc-*`) that scope through DS semantics.
2. **`data-mode="graphite"` on `<html>`.** Remove the `theme-color` duplication; it stays `#1F1F1F`.
3. **Radius to zero.** Delete `--radius`, `--radius-lg`, every `999px` and `50%`. Checkboxes may keep `--sv-radius-sm`. The one circle allowed is a radio.
4. **Weights.** Display 300, body 400, UI emphasis 500. Nothing above 500 anywhere. Session title becomes `.svr-section-title` (32 px, 300, uppercase, hairline).
5. **Faces.** `--sv-font-sans` and `--sv-font-mono`. Drop the DM Sans link; the DS `type.css` already pulls Inter + Plex Mono.
6. **Type floor.** Body 16 px, labels 14 px (mono, tracked, uppercase via `.svf-label` / `.sveb`), titles 18 px. Delete every size under 12 px outright; there are 106 such nodes and none of them carry anything the reader needs at that size.
7. **Remove blur, gradients and `color-mix`.** Sticky header: solid `--sv-surface-page` with a `--sv-border-default` hairline. Guards and rx cards: `.svc-accent` (2 px copper leading edge, no tint).
8. **The mark.** Inline `assets/sv-mark.svg` in `.svm`; delete `mountain()`. Setup card and colophon use `.svm-vertical`; the typed "Skaling Ventures" goes.
9. **One accent.** Copper is the action colour. Phase identity is carried by the *section head and its glyph*, not by five colours. Heat (easy / moderate / hard / hardest) is a `.svbg` badge on the day, not a rail colour. Status colours appear only for status: readiness green/amber/red, RPE-over-target, save failure.

### P1 — Rebuild the instrument's hierarchy

10. **Header = three things.** `.svm-sm` mark · `W1 · Mon` (mono, 14 px) · a single progress figure (`7/23` mono, or the ring alone). Save state moves to a one-line `.svbg` under the header that only appears when it is *not* saved. Today becomes a `.svb-ghost` that only renders when you are off today, as now.
11. **Phases as `.svd` disclosures.** Each phase is a native `<details class="svd">` with `.svd-title` = phase name, `.svd-meta` = `3/5 · 3–5 min`. Completed phases close themselves (the current `collapsed` logic). This deletes the rail, node, pip and kicker systems at once and gives the page one line vocabulary.
12. **Tissue and mobility rows as one line each.** `Calves · Roller · 60 s/side` on one line, cue as a 14 px muted second line, checkbox left. Five rows at ~64 px, not five at ~200 px.
13. **Per-set logging on main lifts.** A `.svdt` table: Set · Load · Reps · RPE, one row per set, `svdt-num` cells, "same as above" tap on each row. Accessories keep the single line. Fixes U2; pair it with the in-place update from U5.
14. **Finish and move.** Bottom of session: `.svb-lg .svb-primary` Finish, flanked by `.svb-ghost` ‹ Prev / Next ›. The week/day drawer stays but becomes secondary.
15. **Toast to inline.** Replace the sticky 5 s toast with an inline `.svbg` next to the thing that changed, and a single persistent Undo where undo matters (restore, swap). Readiness needs no toast at all: the rx card *is* the confirmation.
16. **Rest and recovery days get their own composition.** Sunday: one `.svc` with the three options as `.svf-check` radios and no readiness card. Wednesday: readiness stays (it gates Level 3), burnout section absent rather than rendered empty.
17. **Move Reference out.** `reference.html` (Mode B, prospect-facing register: it is a document you read once) linked from the colophon. Keep "Week at a glance" and "Progression" as a `.svd` on the session page; they are the only reference the operator opens mid-session.
18. **Week 2 rpe field.** Change `program.js` to `rpe: "RPE 7.5"` (or `"RPE 7–7.5"`) and put "slightly heavier than W1" in `acc` or a `note`. Add a `validate.py` rule: `weeks[*].rpe` must match `/RPE \d/`.

### P2 — Polish

19. Placeholder "What you did instead" with a full-width input. Style `select` and `date` with `.svf-input`. All targets ≥ 44 px. History: `.svt-strip` tiles for week summary, keep the bar plot but draw it as one SVG on the DS status tokens with the legend as `.svbg` chips. Backup: Export primary, JSON behind a `.svd`.

---

## 5. What the rebuilt Day 1 looks like

```
┌──────────────────────────────────────────────┐
│ ⛰  W1 · MON                          7 / 23  │  ← .svm-sm · mono · mono
├──────────────────────────────────────────────┤
│ ── WEEK 1 · ESTABLISH · HARD                  │  ← .sveb
│ ANKLES & KNEES                               │  ← .svr-section-title (300)
│ Squat strength + pull · 60–75 min            │  ← .svlede
│                                              │
│ ┃ Green · Full session + full burnout.       │  ← .svc-accent (rx card = readiness state)
│   [Green] [Average] [Red]   Achilles  Back … │  ← .svb-sm secondary / .svbg toggles
│                                              │
│ ▸ Tissue                     5/5 · 3–5 min   │  ← .svd (closed: complete)
│ ▾ Mobility                   2/5 · 6–15 min  │  ← .svd (open: in progress)
│   ☐ Knee-to-toe ankle rockers  L1 · L2 · L3  │
│     Dorsiflexion, knee-over-toe comfort.     │
│ ▾ Strength                   0/14            │
│   BACK SQUAT               4 × 6 · RPE 7     │  ← .svc-title + mono rx
│   Set  Load   Reps  RPE                      │  ← .svdt, per-set rows
│    1   [225]  [6]   [7.5]                    │
│    2   [ = ]  [ ]   [ ]                      │
│   Pair 2 · non-competing                     │  ← .sveb
│   2A Pull-ups   4 × 4–8   ☐☐☐☐  [+ added]    │
│ ▸ Burnout                    10-min AMRAP    │
│ ▸ Downshift                                  │
│                                              │
│ [ ‹ Sun ]   [    FINISH SESSION    ] [ Tue ›]│  ← .svb-ghost · .svb-lg primary · .svb-ghost
├──────────────────────────────────────────────┤
│ ▸ Week at a glance · ▸ History · ▸ Backup    │  ← three .svd, Reference is a link
│ ⛰ (vertical lockup)   v1.7.0                 │
└──────────────────────────────────────────────┘
```

Estimated length at 390 px with Tissue closed and Mobility open: ~2,100 px, down from ~4,950. Type sizes on the page: 12 (mono meta), 14 (labels, cues), 16 (body), 18 (lift titles), 32 (day title). Five sizes, not seventeen.

---

## 6. A gap to file against the design system

`skaling_ventures_ds` has no handheld or app surface. Final Cut is the first SV thing that is *operated* rather than *read*, and it had to invent: sticky header behaviour, 44 px targets, a segmented control (`.zone-segments`), a set-counter button, a numeric log input, and a toast. Each is reasonable and each is now off-system.

Proposed: `docs/SURFACES.md` gains a fifth row, **Operating instrument · handheld**, Mode G, with an addendum covering touch targets, sticky chrome, a segmented control primitive (`.svseg`), and a rule that toasts are inline `.svbg` rows rather than overlays. Final Cut becomes its reference consumer. This is an `agent-factory` change and is not made in this PR; it is noted so the next SV app does not re-derive it.

---

## 7. Sensor and critique record

- `validate_surface.py --surface operating_instrument index.html` → **PASS** (v1.6.0). Passing is a floor; this audit is the critique it cannot do.
- **Squint:** purpose reads (a workout list) but the primary path does not — the rail, the coloured borders, the pips and the chips all pull equally.
- **60-second scan:** the first decision (readiness) is clear; the next action (log set 1 of the squat) is a full screen below it, behind two 200 px sections.
- **Speak:** the copy is honest and in the right voice throughout. "No grinders." "Protect the next block." Keep every word; only the type it is set in needs to change.
- **Stress:** 390 px, 1280 px, keyboard, reduced-motion all hold. Grayscale fails: phase identity and heat are colour-only.
