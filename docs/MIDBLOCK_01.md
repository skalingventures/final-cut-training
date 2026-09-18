# Block 01 mid-block

Record of the mid-block calibration. The live day view is `program.js`. The rules that outlive any one week of numbers are here and in [`FINISHERS.md`](FINISHERS.md).

Identity stays the same: strong, mobile, athletic, durable, hard to break. Mid-block makes that substance *visible* — job headlines, cousins, prep pump, week-aware burns — instead of leaving it in fields the renderer ignored.

## Pillars

**Accessory cousins.** D1 and D2 accessories carry a `job` (or `role`) and a `cousins` list. The job is the headline above the lift. Cousins are implement swaps for that job, not a second logging lift. Mains (squat, bench, dead) stay continuous: straight sets, full rest, never supersetted, never paired.

Week acc strings follow the cousins, not a generic "add reps" wave: variety W1–4, owned W5, easy W6.

**Day-matched tissue.** Tissue is FP Phase 1 W1–2 regions only, ordered by what the next lift needs. First items are the ones you keep if time is short. Do not smash the IT band. Do not turn a barbell day into a gait clinic.

**Elastaboy openers.** Same drills, Level 1 → 2 → 3. Earn the next level when today's level is clean. Week 5 stays on a level you own. Week 6 drops a level or unloads. **No Level 3 on Day 3 or Day 6.**

**Prep pump.** Optional 4–6 min groove between tissue and mobility, D1 / D2 / D4 only. It primes the day's pattern. It is not a working set. Skip the section on recovery and chassis days.

**Finisher-library burns.** Burns come from [`FINISHERS.md`](FINISHERS.md): format rotation plus anti-echo, encoded as a base `burn` plus `byWeek` (and `menu` for Day 5's green alt). Lived shape:

- D1 — push / crawl / slam / march. No squat, hang-pull, swing, or max farmer.
- D2 — 40/20 swing / crawl / sprawl. Ladder novelty in W2. No press or farmer echo.
- D4 — light squat + horizontal push + burpee / step-over. Week 5 is the only chaotic benchmark.
- D5 — aerobic pump ~RPE 7 default. Old CCS is a green alt only.

## Non-goals

- **No standards-app object.** This stays a one-phone PWA. Mid-block does not add accounts, cloud sync, or a second product surface.
- **Mains stay continuous.** No squat / bench / dead supersets. No pairing a main with an accessory to save time.
- **No paid-day clones.** GBRS, Filly, Functional Patterns, and Elastaboy are a source stack, not a paste buffer. Principles only.
- **Day 5 stays chassis.** Submaximal durability. Leave better. Not a fourth hard day.
- **Recovery stays empty of sneak lifts.** Day 3 and Day 6 do not grow a burnout or a prep pump.

## Encoder

| Idea | Field |
| --- | --- |
| Job headline | `lift.job` or `lift.role` |
| Implement swaps | `lift.cousins` (string list) |
| Groove between tissue and mobility | `day.prepPump` `{ dose, goal, items[{a,tool?,d?,cue?}], note }` |
| Week-aware burnout | `burn.byWeek` overlay, else `burn.menu`, else base `burn` |
| Green alt | leftover `burn.menu` row (Day 5 CCS) |
| Sole chaotic | `benchmark: true` on Day 4 Week 5 only |

If a future edit needs a field the renderer does not paint, add the renderer first. That is how this calibration shipped, and why the day view now shows the substance.
