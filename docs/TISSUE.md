# Day-matched tissue

One of five equal mid-block pillars. See [`MIDBLOCK_CALIBRATION.md`](MIDBLOCK_CALIBRATION.md).

Tissue serves the *next* pattern. It is not a recovery hobby and not a second workout.

Two or three regions, named, with a why. First items on the list are the ones you keep if time is short. The rest of the day's list is optional overflow, not an excavation.

## Unlocked menu only

Functional Patterns is a source, not a paste buffer. Mid-block uses **Phase 1, weeks 1–2 regions only** — the areas already legal on these session sheets. Do not unlock later-phase targets. Do not replace a barbell day with gait drills.

Unlocked menu (regions, not protocols):

- Calves / soleus / Achilles line
- Front thigh / hip-flexor quad
- Outer thigh / outer quad (the meat around the IT band — not the band)
- Inner thighs
- Glutes / side-glute pocket
- Glute fold / high hamstring
- Hamstrings
- Hip crease / front of hip
- Chest
- Rib-side / under armpit
- Lats / side back
- T-spine / upper back
- Low-back *side wall* (muscle between bottom rib and pelvis — never the spine)

If a region is not on this list, it is not mid-block tissue.

## How to pick

1. Name today's main pattern (squat, press, hinge, chassis, restore).
2. Pick **2–3** unlocked regions that actually change that pattern.
3. Write a why in the day's tissue note. Priority order is the list order.
4. Stop. Do not add a fourth "while we're here."

Dose on training days is 3–5 min. Recovery days may run longer because there is no barbell after.

## No excavation / no IT smash

- Do not try to destroy the IT band. Work outer quad, hip, and glute instead.
- Do not jam the spine. Low-back work is the side wall, gentle.
- Hip crease is pressure near the front pocket, not on sensitive structures.
- Glute-fold work is controlled. No aggressive digging before a hinge.
- If it does not change the next lift, skip it.

## Per-day priority

Tissue is lift-paired. Every priority item carries a `for` line naming the lift it preps. Mobility-theme order is wrong.

### Day 1 — squat + pull

**Goal.** Prep squat ankle/knee travel and the pull-up hang.

| Priority | Region | For |
| --- | --- | --- |
| 1 | Calves | squat |
| 2 | Front thigh / hip-flexor quad | Peterson step-ups |
| 3 | Lats / rib-side | pull-ups |
| Overflow | Outer thigh, glutes, inner thighs | optional |

### Day 2 — press + overhead + row

**Goal.** Prep pressing, overhead, and the row.

| Priority | Region | For |
| --- | --- | --- |
| 1 | Chest | bench press |
| 2 | Rib-side / under armpit | Standing DB overhead press |
| 3 | Lats / side back | barbell row |
| Overflow | Glutes, hip crease | farmer carry (optional brace) |

### Day 3 — restore for Day 4

**Why.** Restore after press and carry so Day 4 can rack and hinge. Chest, rib-side, T-spine — gentle, no excavation.

Priority stays: chest → rib-side → lats → low-back side wall → T-spine → glutes.

### Day 4 — hinge + rack

**Goal.** Prep the deadlift hinge, landing, and the push-press rack.

| Priority | Region | For |
| --- | --- | --- |
| 1 | Glute fold / high hamstring | deadlift |
| 2 | Calves | deadlift |
| 3 | T-spine / lats | push press |
| Overflow | Hamstrings, inner thighs | optional |

Front thigh drops. Save the jump dose for after the deadlift.

### Day 5 — chassis

**Goal.** Chassis texture for goblet, floor press, row, and the Copenhagen.

| Priority | Region | For |
| --- | --- | --- |
| 1 | Front thighs | goblet squat |
| 2 | Chest | DB floor press |
| 3 | Lats / rib-side | one-arm DB row |
| 4 | Inner thighs | Copenhagen plank |
| Overflow | Glutes, calves | optional |

Outer quad drops.

### Day 6 — easy restore

Restorative pressure after the week — low-back side wall, glutes, rib-side. Easy only. Makes next Monday possible.

### Day 7

None.

## Encoder

`day.tissue` keeps `{ dose, goal, items[{a, tool, d, cue, for, optional}], note }`. The renderer paints `for` as its own line. Overflow items set `optional: true`. If time is short, do the first items. Do not hide the why in a comment the renderer never paints.
