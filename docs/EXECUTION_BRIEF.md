# Final Cut — execution brief for the design rebuild

**For:** a coding model with write access to this repository, working alone.
**From:** [`DESIGN_AUDIT.md`](DESIGN_AUDIT.md) (the findings) and [`../ds/README.md`](../ds/README.md) (the brand system, vendored).
**Target:** Final Cut 2.0.0, deployed at https://skalingventures.github.io/final-cut-training/ via GitHub Pages from `main`.

Read this whole file before touching code. Then read `DESIGN_AUDIT.md` §3 and §5, `ds/README.md`, and every primitive header comment under `ds/primitives/`. Then read `CANON.md`: nothing in this brief changes the program; if a change would, stop.

---

## 0. Ground rules

These hold for every work package. A package that breaks one is not done.

1. **Everything stays in this repository.** No dependency on any other repo, service or package. The brand system is already vendored under `ds/`; do not edit those files. A brand change arrives as a fresh copy of `ds/`.
2. **The program does not change.** `program.js` content is the training block. The only permitted edit is WP6 (one data-shape fix). Every movement, dose, cue, pairing and guard renders exactly as it does today.
3. **The log format stays v3 and stays compatible.** `final-cut:v3` in `localStorage`, `core.js` `migrate()` and `validatePayload()`. You may add optional keys (see WP3). You may not rename or drop existing keys. A backup exported from 1.6.0 must restore into 2.0.0 with nothing lost.
4. **One phone, offline first.** The service worker keeps working. Every new file the page loads is added to `ASSETS` in `sw.js`, and `CACHE` is bumped in the same commit.
5. **The tests are the floor.** `node test/core.test.js`, `node test/persist.test.js`, `python3 validate.py` pass after every package. Extend them as each package says. Never delete an assertion to get green; change it only when this brief says the assertion encodes the old design (WP1 lists them).
6. **Tokens, not values.** No hex, no `rgba()`, no pixel font size in `styles.css` outside a component-local `--fc-*` alias that resolves to a `--sv-*` token. Component rules use semantic tokens (`--sv-text-muted`), never swatches (`--sv-graphite-300`).
7. **Never override a primitive's base rule.** Scope through a descendant: `.fc-mock .svb { … }` is fine; `.svb { … }` is not.
8. **Weights 300 / 400 / 500. Radius 0. Hairlines. One accent.** If a rule you are about to write needs a weight above 500, a radius, a gradient, a blur or a second accent, the design is wrong, not the rule.
9. **Type floor 16 / 14 / 12.** Body 16 px, labels and captions 14 px, mono meta 12 px. Nothing below 12 px anywhere.
10. **Copy is not yours to change** except where a package quotes the new string. Keep every existing sentence of user-facing copy.
11. **One package per commit, in order.** Each commit message names the package and the audit findings it closes (for example `WP2: header and phases — closes H1 H2 H3 H6`). Branch from `main`; open one pull request at the end; do not merge it.

## 1. Definition of done

Final Cut 2.0.0 is done when all of the following are true on the `390 × 844` viewport:

- [ ] Every finding in `DESIGN_AUDIT.md` §3 marked P0 or P1 is closed, and every P2 either closed or listed as deferred in the PR description with a reason.
- [ ] `styles.css` contains no `border-radius` other than `var(--sv-radius-sm)` on checkboxes, no `backdrop-filter`, no `linear-gradient`, no `color-mix`, no `font-weight` or `font:` weight above 500, no font size under 12 px, no hex, no `rgba(`.
- [ ] `index.html` sets `data-mode="graphite"`, loads `ds/tokens/index.css` and only the primitives used, does not load DM Sans, and contains the five-peak mark inline exactly once per placement (header, setup, colophon) with the typed "Skaling Ventures" gone from visible text. The SVG's `<title>` keeps the name for assistive tech and for `validate.py`.
- [ ] Day 1 with Tissue complete and Mobility open is under 2,400 px tall; with every phase closed, under 1,400 px.
- [ ] Every tappable control is at least 44 × 44 px.
- [ ] Typing an RPE then immediately tapping a set registers the set (WP3 regression test).
- [ ] Sunday shows no readiness card. Wednesday does.
- [ ] Week 2's prescription reads `4 × 6 · RPE 7.5`, not "slightly heavier".
- [ ] `reference.html` exists, is Bone mode, carries the whole reference text, and is linked from the colophon. `index.html` no longer contains that text.
- [ ] `APP_VERSION` is `2.0.0` in `core.js`, `<meta name="app-version">` matches, `CACHE` in `sw.js` is bumped, and `ASSETS` lists every `ds/` file the page loads plus `reference.html`.
- [ ] All three checks pass. `validate.py` has the new rules from WP1 and WP6.
- [ ] `docs/audit/after/` holds fresh screenshots of setup, Day 1 top, the squat card, Sunday, and the history drawer at 390 px, taken with the tooling in §4.

## 2. Work packages

Each package lists **files**, **changes**, **acceptance**, and **tests**. Do them in order. Do not start WP2 until WP1's acceptance holds.

### WP1 — Adopt the system  *(closes B1 B2 B3 B4 B5 B6 B7 T1 T2 H6)*

**Files:** `index.html`, `styles.css`, `app.js`, `validate.py`, `sw.js`.

**Changes**

1. `index.html` head:
   - `<html lang="en" data-mode="graphite">`.
   - Remove the DM Sans `<link>`. Keep the two `preconnect` lines (the system's `type.css` imports Inter and Plex Mono from Google Fonts).
   - Before `styles.css`, add in this order: `ds/tokens/index.css`, then `ds/primitives/a11y.css`, `rule.css`, `mark.css`, `button.css`, `card.css`, `tile.css`, `badge.css`, `table.css`, `disclosure.css`, `field.css`, `input.css`, `check.css`.
   - Replace `<a class="skip-link">` with `<a class="sv-skip">`.
2. The mark. In `app.js`, delete `mountain()`. Add `mark(size)` that returns the contents of `ds/assets/sv-mark.svg` inline inside `<span class="svm svm-sm">…</span>` (read it once from a string constant in `app.js`; do not fetch at runtime, the service worker must not need it). Use it in `#mark`, `#setup-mark`, and a new `#colophon-mark`. Delete the `.setup-brand` and `.colophon-brand` text elements; the mark replaces them. Keep `<title>Skaling Ventures</title>` inside the SVG.
3. `styles.css`. Delete the entire `:root` block. Replace it with a short alias block containing only what components genuinely need and cannot get from a semantic token:
   ```css
   :root {
     --fc-heat-easy:     var(--sv-status-success);
     --fc-heat-moderate: var(--sv-status-warning);
     --fc-heat-hard:     var(--sv-text-accent);
     --fc-heat-hardest:  var(--sv-status-danger);
     --fc-heat-off:      var(--sv-text-muted);
     --fc-sticky-h: 3.25rem;
   }
   ```
   Heat is used in exactly one place after WP2: the badge on the day title (`.svbg` with `style="--svbg-fg: var(--fc-heat-*)"`). Delete every `--phase-*` token and every use of `--seg` as a colour. Then, mechanically:
   - Every `border-radius` → delete, except `.fc-check` which uses `var(--sv-radius-sm)`.
   - Every `font-weight` above 500 and every `font:` shorthand weight above 500 → 500 for UI, 400 for body, 300 for the day title and setup heading.
   - Every `font-size` and `font:` size below 12 px → 12 px if mono meta, else 14 px. Every 13 / 13.5 / 15 / 15.5 px body → `var(--sv-text-base)`. Every label → `var(--sv-text-sm)`. Every mono eyebrow → `var(--sv-text-xs)`.
   - Every hex and `rgba()` → the nearest semantic token (`--sv-border-subtle` for the faint rules, `--sv-action-tint` for copper tints, `--sv-status-*-tint` for status tints).
   - Delete `backdrop-filter`, every `linear-gradient`, every `color-mix`, `.mast`, `.eyebrow`, `.strike` (dead), the `.mast::before` motif, the `.colophon::before` centred rule.
   - `body { font-family: var(--sv-font-sans); font-size: var(--sv-text-base); line-height: var(--sv-leading-normal); }`.
   - `.s-title` becomes a descendant rule on `.svr-section-title` (see WP2); delete the clamp.
   - `.primary` → delete; the buttons use `.svb svb-lg svb-primary`.
   - `.guard`, `.rx-card`, `.cut`, `.callout--*` → one rule: a `.svc svc-accent` with `--svc-pad: var(--sv-space-3)`; the `--coach` / `--warn` / `--cut` variants become the leading-edge colour only (`border-left-color: var(--sv-status-*)`), no tinted background.
4. `validate.py` `check_css()`: replace the needle list with:
   - required in `styles.css`: `min-height: 44px`, `.setup`, `--fc-heat-hard`;
   - required in `index.html`: `data-mode="graphite"`, `ds/tokens/index.css`, `class="sv-skip"`, `svm-glyph`;
   - forbidden in `styles.css`: `border-radius: 1`, `border-radius: 999`, `border-radius: 50%`, `backdrop-filter`, `linear-gradient`, `color-mix`, `font: 600`, `font: 700`, `font: 800`, `font-weight: 6`, `font-weight: 7`, `font-weight: 8`, `#` followed by six hex digits, `rgba(`, `DM Sans`;
   - forbidden in `index.html`: `fonts.googleapis.com/css2?family=DM+Sans`.
   - a `check_type_floor()` that regex-scans `styles.css` for `(\d+(?:\.\d+)?)px` inside any `font` or `font-size` declaration and fails on a value under 12.
   Keep every other check as is. `"Skaling Ventures"` stays satisfied by the SVG title.
5. `sw.js`: add every `ds/` file linked from `index.html` to `ASSETS`. Bump `CACHE` to `final-cut-v8`.

**Acceptance:** the page renders in Graphite with square corners, light display type, the real mark, and no blur. Nothing is functionally different yet.

**Tests:** `validate.py` as above. Add to `test/persist.test.js` nothing; to `validate.py` the new rules.

### WP2 — Header and phases  *(closes H1 H2 H3 U1-part U8-part)*

**Files:** `index.html`, `app.js`, `styles.css`.

**Changes**

1. Header (`<header class="sticky">`): solid `--sv-surface-page`, `border-bottom: 1px solid var(--sv-border-default)`, height `--fc-sticky-h`, no blur. Contents, left to right:
   - `#mark` as `.svm .svm-sm`.
   - `#week-btn` keeps its id and `aria-controls="nav-drawer"`; label is the mono `W1 · Mon` (`--sv-text-sm`, `--sv-text-strong`) with a trailing thin rule glyph (reuse `.svd-summary::before` style) to signal it opens.
   - `#today-btn` as `.svb svb-sm svb-ghost`, rendered only when off today (current logic).
   - A single progress figure `#prog-text`: mono `7 / 23` (`--sv-text-sm`, muted), or `✓` when the session is done, or `—` when idle. Delete the ring (`#prog-ring`, `#prog-fill`, `#prog-pct`) and the pips (`#phase-progress`) from HTML, CSS and `updateProgress()`.
   - Delete `#sticky-ready`. Readiness state is shown by the readiness card only.
   - `#save-chip` moves out of the header into a `.svbg svbg-bad` row directly under the header that renders only when `persistOk` is false. When saving works, nothing is shown. `updateStatus()` keeps writing the "Saved … · Exported …" line in the Setup drawer.
2. Phases. Rewrite `sec()` in `app.js` to return:
   ```html
   <details class="svd fc-phase" data-sec="tissue" open>
     <summary class="svd-summary">
       <span class="svd-title">Tissue</span>
       <span class="svd-meta">3 / 5 · 3–5 min</span>
     </summary>
     <div class="svd-body">…</div>
   </details>
   ```
   - `open` is present unless `se.collapsed[foldId]` is true. Listen for the native `toggle` event on `.fc-phase` and write `se.collapsed[id] = !details.open` then `save()`. Delete the `.fold` buttons and the `[data-fold]` click branch.
   - The current behaviour "auto-collapse a phase when it completes" stays: in `sec()`, if `done && se.collapsed[foldId] == null` set it to true, as now.
   - The `svd-title` is the phase name once. Delete `phaseSymbol()` from the section head, the `.phase-node`, `.phase-kicker`, `.sec::before`, `.sec-h::after`, the rail on `.session`, and the `--phase` / `--phase-dim` colouring. `.phase-module` and its `data-phase` variants go entirely.
   - `firstUnfinished()` skips `details:not([open])` instead of `.is-collapsed`.
3. Day title. The `.s-head` block becomes:
   ```html
   <div class="svr-section fc-day">
     <p class="sveb">Week 1 · Establish · Monday <span class="svbg" style="--svbg-fg: var(--fc-heat-hard)">Hard</span></p>
     <h1 class="svr-section-title">Ankles &amp; knees</h1>
     <p class="svlede">Squat strength + pull · 60–75 min</p>
   </div>
   ```
   Scope `.fc-day .svr-section-title { font-size: var(--sv-text-xl); }` and `.fc-day { margin-bottom: var(--sv-space-5); }`.
4. `.session` loses its left border and padding. Sections sit on the page ground; the disclosures supply the hairline boxes.

**Acceptance:** header shows mark, `W1 · Mon`, and `7 / 23` only. Each phase is one hairline box with its name once and its count in the meta slot. Completed phases are closed. No colour other than copper and status.

**Tests:** in `test/core.test.js` nothing changes (progress maths is unchanged). Add to `validate.py` `check_html()`: `id="prog-text"` present, `prog-ring` absent, `phase-progress` absent.

### WP3 — Rows, per-set logging, in-place updates  *(closes U2 U5 H4 T1-rows)*

**Files:** `app.js`, `core.js`, `styles.css`, `test/core.test.js`, `test/persist.test.js`.

**Changes**

1. Tissue and mobility rows. One row per item:
   ```html
   <div class="fc-row">
     <button type="button" class="fc-check" data-id="tissue" data-i="0" aria-pressed="false" aria-label="Calves"></button>
     <div class="fc-row-body">
       <div class="fc-row-name">Calves <span class="fc-row-meta">Roller · 60 sec / side</span></div>
       <div class="fc-row-cue">Roll from the Achilles up toward the back of the knee. Pause on dense spots.</div>
     </div>
   </div>
   ```
   - `.fc-check` is a 44 × 44 px hit area whose visible box is the `.svf-check-box` geometry (1.05 rem, hairline, `--sv-radius-sm`), copper fill and the two-rule checkmark when `aria-pressed="true"`. Keep the button + `aria-pressed` + `[data-id]` mechanism; the click handler and `chk()` do not change.
   - Rows are separated by `--sv-border-subtle` hairlines. Name at `--sv-text-base` strong; meta mono `--sv-text-xs` muted on the same line; cue `--sv-text-sm` muted.
   - Mobility levels: render `L1 · L2 · L3` as a single mono meta line after the name; the level texts go in the cue line joined by ` · `. Delete `.mob-levels`, `.mob-lvl`, `.move-index`.
2. Main lifts (`l.prog`) get a per-set table. Replace the `.sets` + `.log-fields` block for `l.prog` lifts with:
   ```html
   <table class="svdt fc-setlog" data-lift="squat">
     <thead><tr><th>Set</th><th class="svdt-num">Load</th><th class="svdt-num">Reps</th><th class="svdt-num">RPE</th></tr></thead>
     <tbody>
       <tr data-set="0">
         <td><button class="fc-set" data-id="squat" data-i="0" aria-pressed="false" aria-label="Set 1">1</button></td>
         <td class="svdt-num"><input class="svf-input svf-input-num" inputmode="decimal" data-setlog="squat:0:load" placeholder="lb"></td>
         <td class="svdt-num"><input class="svf-input svf-input-num" inputmode="decimal" data-setlog="squat:0:reps" placeholder="6"></td>
         <td class="svdt-num"><input class="svf-input svf-input-num" inputmode="decimal" data-setlog="squat:0:rpe" placeholder="7"></td>
       </tr>
       …one row per set from C.nSets()…
     </tbody>
   </table>
   ```
   - Rows 2..n show the row above's value as their placeholder when empty. Focusing an empty cell whose row-above has a value and pressing the `=` key, or tapping a small `.svb-ghost` "same" affordance in the row, copies it. Keep it simple: a ghost `=` button in the Set cell next to the number is enough.
   - Storage: add `LOG.setlog` as a map `"w1d1:squat" → [{load, reps, rpe}, …]`. In `core.js`: `emptyLog()` gains `setlog: {}`; `migrate()` and `cleanMap` pass it through; `validatePayload()` accepts it if present and an object. `VERSION` stays 3. `payloadObj()` in `app.js` includes it.
   - Compatibility: `LOG.loads[key]`, `reps[key]`, `rpe[key]` keep being written with **set 1's** values whenever set 1 is edited, so history, carry-forward, `priorLift`, and 1.6.0 backups keep working unchanged. When a backup has `loads` but no `setlog`, the table shows the legacy values in row 1 and empty rows below.
   - `C.repSpec()` and `C.metricValue()` for tonnage: when `setlog` has rows with load and reps, tonnage is the sum over completed sets of load × reps; otherwise the legacy formula. Add `C.tonnageFromSetlog(rows, checks)`.
   - Accessories (non-`prog`) keep the current set-counter row and the single Load / Reps inputs, restyled: `.fc-set` for the counters (44 px square, `.svb-secondary` look, copper fill when pressed), `.svf-input.svf-input-num` for the inputs. The `data-load` / `data-reps` handlers stay.
3. In-place updates (the lost-tap bug). In the `change` and `input` handlers:
   - `[data-rpe]` and `[data-setlog$=":rpe"]`: recompute `rpeWarn` for that lift and toggle `hidden` on a `[data-rpe-warn="<id>"]` element that is always rendered (hidden) under the table. **Do not call `renderSession()`.**
   - `[data-bw]`: update `#bw-note` text only. Do not call `renderChrome()`.
   - Flags (`[data-flag]`) are click-driven and may keep calling `render()`; there is no blur race on a click.
4. `.log-grid`, `.log-fields`, `.ll`, `.log-in`, `.set` CSS → delete; replaced by the above.

**Acceptance:** Day 1 with Tissue closed and Mobility open is under 2,400 px. Typing an RPE and tapping a set registers the set. A 1.6.0 backup restores and shows its loads in row 1. Tonnage reflects per-set values when present.

**Tests**
- `test/core.test.js`: `tonnageFromSetlog` with mixed complete/incomplete sets; `repSpec` unchanged for legacy data; `migrate()` of a v3 payload without `setlog` yields `setlog: {}`; `validatePayload` accepts `setlog` and rejects a non-object.
- `test/persist.test.js`: round-trip a payload with `setlog`.
- Add `test/dom.test.js` (Node, no browser): load `index.html` + `app.js` into `jsdom` if available; if not, add the regression as a documented manual check in `docs/audit/CHECKLIST.md`: "fill RPE, tap set 1, set 1 is pressed". Do not add a dependency to make this automatic; a manual check is acceptable here.

### WP4 — Finish, move, confirmations, rest days  *(closes H7 U1 U8 U9 U11)*

**Files:** `index.html`, `app.js`, `styles.css`.

**Changes**

1. Session footer, directly after `#session`:
   ```html
   <div class="fc-foot">
     <button type="button" class="svb svb-md svb-ghost" id="prev-day">‹ Sun</button>
     <button type="button" class="svb svb-lg svb-primary" id="finish-btn">Finish session</button>
     <button type="button" class="svb svb-md svb-ghost" id="next-day">Tue ›</button>
   </div>
   <p class="fc-recap" id="finish-recap" hidden></p>
   ```
   `#prev-day` / `#next-day` step `S.day` and wrap across weeks the same way `nextSession()` describes; disabled (`aria-disabled`) at W1 D1 and W6 D7. Labels are the adjacent weekday names.
2. Toast. Replace the sticky `#toast` with an inline `.svbg` row rendered inside the element that changed: for restore, inside the Backup drawer; for a swap, inside that lift card; for finish, the `#finish-recap` line. Each carries an Undo `.svb svb-sm svb-ghost` where the current code offers undo. Readiness gets **no** confirmation: the prescription card is the confirmation. Delete `.toast`, `.toast-undo`, and the 5-second timer; inline rows persist until the next render.
3. Readiness card (`#ready-card`) becomes `.svc .svc-accent` with `--svc-pad: var(--sv-space-4)`:
   - Eyebrow `.sveb` "Readiness" plus the chosen label, or "How do you feel?" when unset.
   - The prescription text (`#rx-card`) as the body, `--sv-text-strong`, visible as soon as readiness is set.
   - Buttons: three `.svb svb-sm` (the chosen one `svb-primary`, the others `svb-secondary`), then the four flags as `.svbg` toggles (`svbg-warn` when on). Delete `.rbtn`, `.flag`, `.ready-chip`, `.ready-note`; the note text moves into the prescription body's first sentence (it already is the same information).
   - Sunday (`D.heat === "off"`): do not render the readiness card at all. Wednesday keeps it.
4. Rest day (Day 7) and Follow-Me (Day 6) `exclusive` sections: one `.svc` titled with `D.restTitle` containing the options as `.svf-check` radios (`name="choice"`), each with its `rx` and `note` as the label's second line. Keep the `data-choice` mechanism by putting `data-id`/`data-choice` on the `<label>` and letting the existing click branch handle it; the radio is visual.
5. Delete `.finish`, `.finish-recap` old CSS, the old `#finish-wrap`.

**Acceptance:** Finish sits under the last phase with prev/next beside it. No overlay ever appears. Sunday is one card. Readiness shows its prescription immediately with no toast.

**Tests:** `validate.py`: `id="prev-day"`, `id="next-day"` present, `class="toast"` absent.

### WP5 — Reference out, drawers, history, backup  *(closes H5 U6 U7 U10 T-history)*

**Files:** `index.html`, new `reference.html`, `app.js`, `styles.css`, `sw.js`, `validate.py`.

**Changes**

1. `reference.html`: `data-mode="bone"`, loads the same `ds/` files plus `styles.css`, has the skip link and `main-content`, and carries verbatim the whole `<details class="ref">` reference block currently in `index.html` (Operating intent through Progression), as `.svr-section` heads and prose at `--sv-text-base`, `--sv-measure` width. The Progression list renders from `program.js` exactly as `#ref-prog` does now; include `program.js` and a ten-line inline script. Colophon with the mark and a link back to `./`.
2. `index.html`: delete the reference `<details>`. Keep three drawers as `.svd`: "Setup" (block start, bodyweight, status line), "History", "Backup". Add a fourth `.svd` "Week at a glance" holding `#ref-prog` (the six week rows as `.svdt` with `svdt-num` for the scheme) since that is the only reference an operator opens mid-session. Colophon: mark, "For the Love of the Game", version, and a `.svch`-style link "Reference ↗" to `reference.html`.
3. History: the two summary cells become `.svt` tiles in a `.svt-strip`; the metric buttons become a `.fc-seg` segmented control; the legend becomes three `.svbg` chips; bars keep their current DOM but use `--sv-status-success` / `--sv-status-warning` / `--sv-border-default` and square corners; the axis labels go to `--sv-text-xs` (12 px). Delete `.mbtn`, `.dash-cell`, `.hist-key i`.
4. Backup: Export as `.svb svb-md svb-primary`; Copy and Restore as `svb-secondary`; the JSON textarea moves inside a nested `.svd` "Raw log" closed by default, so the panel's face is the export button and the two-sentence note.
5. Inputs: every `input` and `select` gets `.svf-input` (dates and selects included); the blocked-lift substitution input is full width with placeholder "What you did instead"; `.zone-segments` becomes `.fc-seg`. Every button, including `.fc-check`, `.fc-set` and segmented buttons, is at least 44 px in both dimensions.
6. `sw.js`: add `./reference.html` to `ASSETS`; bump `CACHE` to `final-cut-v9`. `validate.py` `check_files()` adds `reference.html`; `check_html()` asserts `index.html` no longer contains "Operating intent" and `reference.html` does.

**Acceptance:** `index.html` with every drawer open is under 5,000 px. `reference.html` opens offline from the colophon link and reads as a Bone-mode document.

### WP6 — Data hygiene  *(closes U3)*

**Files:** `program.js`, `validate.py`, `app.js`.

**Changes**

1. `program.js` week 2: `rpe: "RPE 7.5"`, and append to `acc`: `"Add reps where clean · slightly heavier than W1"`. Nothing else in the file changes.
2. `validate.py` `check_program()`: every `weeks[*].rpe` matches `^RPE \d`.
3. `app.js` renders the prescription as `4 × 6 · RPE 7.5` (a middle dot, not `@`) in the lift title line and in the carry-forward note.

**Acceptance:** `C.rpeTarget()` returns 7.5 for week 2 (add the assertion to `test/core.test.js`).

### WP7 — Version, screenshots, PR

1. `core.js` `APP_VERSION = "2.0.0"`; `index.html` `<meta name="app-version" content="2.0.0">`.
2. Run §4 to capture `docs/audit/after/*.jpg`.
3. Update `README.md` "Daily use" step 3 to describe per-set logging and the prev/next buttons, and add a line under "Updates" that `ds/` is the brand system and is replaced wholesale, never edited.
4. Open one pull request against `main` titled `Final Cut 2.0 — rebuild on the Skaling Ventures system`. The body lists each work package, the findings it closes, any P2 deferred with a reason, and the before/after screenshots side by side. Do not merge. Deployment is the owner's merge; GitHub Pages serves `main`, and the phone picks it up on "Update now".

## 3. Things that look like they should change and must not

- `CANON.md` and the training content. Not a word.
- The `localStorage` key, the v3 payload shape, and the legacy `final-cut:v2` read path.
- The `aria-pressed` + `[data-id]` + `chk()` mechanism for checks. Restyle the buttons; do not replace them with native checkboxes (the handlers, `progress()` and the tests depend on it).
- `.nojekyll`, `manifest.webmanifest` (except `theme_color` stays `#1F1F1F`, already correct), the icons. Regenerating `icons/*` with the five-peak mark is a welcome P2 if `rsvg-convert` or similar is available; otherwise leave them.
- The Google Fonts `preconnect` lines. Offline, the fallback stack carries the brand.
- Anything under `ds/`.

## 4. Measuring, so "done" is a number

Playwright with Chromium is the tool. If it is not installed, `npm i -D playwright && npx playwright install chromium` in a scratch directory outside the repo; do not add it to the repo.

```js
// tools/measure.js — run with: node tools/measure.js  (serve the repo on :8123 first)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto('http://127.0.0.1:8123/index.html');
  await p.fill('#setup-start', '2026-08-31'); await p.click('#setup-go'); await p.waitForTimeout(400);
  await p.click('#week-btn'); await p.click('[data-d="1"]'); await p.waitForTimeout(400);
  const sizes = await p.evaluate(() => { const m = {}; document.querySelectorAll('#app *').forEach(el => { if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return; const fs = parseFloat(getComputedStyle(el).fontSize); m[fs] = (m[fs] || 0) + 1; }); return m; });
  const small = await p.evaluate(() => [...document.querySelectorAll('button,a,input,select,summary')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.height < 44 || r.width < 44); }).map(e => e.className || e.id));
  const radii = await p.evaluate(() => [...new Set([...document.querySelectorAll('*')].map(e => getComputedStyle(e).borderRadius).filter(r => r && r !== '0px'))]);
  console.log({ height: await p.evaluate(() => document.body.scrollHeight), sizes, small, radii });
  await b.close();
})();
```

Pass when: no size key under 12; `small` is empty; `radii` is `[]` or only `2px`; height under 2,400 with Tissue closed.

Screenshots for `docs/audit/after/`: the same script with `page.screenshot({ path, type: 'jpeg', quality: 80 })` at setup, Day 1 top, the squat card, Sunday, and the History drawer open. Commit them at 1× scale.

## 5. When you are unsure

- If a primitive header and this brief disagree on markup, the primitive header wins; adjust the brief's snippet, keep the intent.
- If a change would alter what the program prescribes, stop and leave a note in the PR instead.
- If a finding cannot be closed without a dependency, defer it in the PR body with the reason. Do not add the dependency.
- Prefer deleting CSS to writing it. The target stylesheet is a fraction of the current 1,100 lines.
