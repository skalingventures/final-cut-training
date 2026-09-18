# Mid-block calibration

Primary memorial of the Block 01 mid-block. `program.js` is the live day view. This page is the mission and the judgment. The five pillars are equal; none of them *is* the calibration.

Identity stays: **strong, mobile, athletic, durable, hard to break.** Mid-block exists so the day view shows that substance — not data fields a renderer ignores.

## Mission

Acceptable variety without cooking.

The block already has protected mains, paired accessories, complementary burns, and a chassis Friday. Mid-block does not add a second program. It decides, in writing, what may change week to week and what must stay the same, then makes that decision visible on the phone.

**Mains stay continuous.** Squat, bench (floor press if no bench), and deadlift are straight sets, full rest, never supersetted, never paired. Variety does not land on the barbell.

## Same vs varied

Say it out loud before you edit a day.

| Stay the same | May vary |
| --- | --- |
| The day's main and its job | Accessory *implement* for the same job |
| Pairing logic (non-competing 2A/2B) | Which cousin you pick this week |
| Tissue *serves the next pattern* | Which 2–3 unlocked regions you actually roll |
| Burn *families leftover* after the day's strength | Finisher *format* (AMRAP → ladder → 40/20) |
| Elastaboy drill list and L1 → L3 earn rule | The level you own today |
| Day 5 as chassis | Whether the optional aerobic pump is skipped |

A change that only lengthens time-under-tension on a frozen pair is not variety. A change that swaps the job (row becomes another press; farmer becomes another squat) is not variety. A change that copies a paid daily is not variety.

## Five pillars (equal weight)

1. **Accessories** — same job, varied implement. [`ACCESSORIES.md`](ACCESSORIES.md)
2. **Day-matched tissue** — 2–3 unlocked regions, why they serve today's pattern. [`TISSUE.md`](TISSUE.md)
3. **Complementary finishers** — format rotation + anti-echo, not station cousins. [`FINISHERS.md`](FINISHERS.md)
4. **Elastaboy openers** — same drills, Level 1 → 2 → 3, no L3 on Day 3 or Day 6. See [`CANON.md`](../CANON.md)
5. **Optional prep pump** — 4–6 min groove on D1 / D2 / D4 only. Not a set. Absent on recovery and chassis days.

Finishers are one pillar. Do not treat the library as the whole memorial.

## Rejected anti-patterns

- **TUT-only on frozen pairs.** More seconds on the same 2A/2B is not a mid-block. If the pair never changes implement, the athlete is not exploring.
- **Accessories-only package.** Shipping cousins without tissue, openers, finishers, and prep pump is an incomplete calibration. All five pillars, or it is not mid-block.
- **Burnout echoing the day's strength.** A squat-day swing/farmer, a press-day press, a hinge-day hinge. Banned. See the picker in [`FINISHERS.md`](FINISHERS.md).
- **Hard Friday.** Day 5 stays chassis / ~RPE 7 / leave-better. A fourth hard strength day or a chaotic Friday benchmark cooks the block.
- **Copying paid dailies.** GBRS, Filly, Functional Patterns, and Elastaboy are a source stack. Never republish a paid day's stations, doses, or film. Write original clocks and cues.

## Quality bar

Lived Day 1 and Day 2 session-sheet density is the bar. A calibrated day looks like this on the phone, not only in a spreadsheet:

- Tissue note names *this* day's priority and why
- Prep pump (D1/D2/D4) sits between tissue and mobility
- Each accessory shows a job headline and a cousins line
- The main has no pair and no superset copy
- The burnout is leftover families, with a week-aware format when the week calls for novelty

If a day is only a list of lift names and a generic "accessories moderate," it is not calibrated.

## Renderer contract

Pages will drop the substance if the renderer does not paint it. Mid-block requires, and this PR added:

- `lift.job` or `lift.role` — headline above the name
- `lift.cousins` — compact cue list, not a second log
- `day.prepPump` — optional phase between tissue and mobility
- week-aware burns — `burn.byWeek` (preferred), else `burn.menu`, else base `burn`

If a future edit needs a field `renderSession` ignores, add the renderer first. Old days without these fields must still render.

## Standards

GBRS-style 90-day events and tiers stay a **coach reminder**, not an in-app object. Retest on the order of ~90 days, off the phone. Mid-block does not add a standards screen, a score object, or a second product surface. This remains a one-phone PWA.

## Encoder

| Idea | Field |
| --- | --- |
| Job headline | `lift.job` or `lift.role` |
| Implement swaps | `lift.cousins` |
| Groove between tissue and mobility | `day.prepPump` |
| Week-aware burnout | `burn.byWeek`, else `burn.menu`, else base |
| Green alt | leftover `burn.menu` row |
| Sole chaotic | `benchmark: true` on Day 4 Week 5 only |

Judge every change against [`CANON.md`](../CANON.md). Accept it if it protects a main, varies an accessory *job* without cooking the week, matches tissue to the next pattern, and keeps the burnout complementary. Reject it if it freezes the pairs, echoes the day's strength, hardens Friday, or pastes a paid daily.
