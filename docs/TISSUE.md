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

### Day 1 — squat + knee travel

**Why.** Ankle range, knee-over-toe comfort, squat tolerance.

| Priority | Region | Why |
| --- | --- | --- |
| 1 | Calves | Achilles-to-knee line so the heel can stay |
| 2 | Front thigh / hip-flexor quad | Upper front thigh so the squat can sit down |
| 3 | Outer thigh / outer quad | Moderate only; do not smash the side of the knee |
| Overflow | Glutes, inner thighs | Side-glute pocket and adductors before Petersons |

Skip from the bottom if time is short.

### Day 2 — press + brace + carry

**Why.** Hips and chest so the press can brace, not shrug.

| Priority | Region | Why |
| --- | --- | --- |
| 1 | Glutes / side glutes | Hip that can extend and stay quiet under a brace |
| 2 | Hip crease / front of hip | Front pocket so the ribcage can stack |
| 3 | Chest | Broad chest so the press is a press |
| Overflow | Rib-side, lats | Overhead position and breathing |

### Day 3 — restore for Day 4

**Why.** Spine, shoulders, ribs. This day exists to make Thursday better. No strength after, so the list may be longer — still unlocked regions only, still no excavation.

Priority: chest → rib-side → lats → low-back side wall → T-spine → glutes. Gentle. Breathe into it.

### Day 4 — hinge + land

**Why.** Posterior chain and a quiet ankle before the deadlift and the elastic slot.

| Priority | Region | Why |
| --- | --- | --- |
| 1 | Calves | Soleus / lower calf before a hinge and a landing |
| 2 | Glute fold / high hamstring | Crease where glute meets hamstring — controlled |
| 3 | Hamstrings | Back of the thigh before the pull |
| Overflow | Inner thighs, front thigh, T-spine | Adductor rock-backs, hip, front rack |

Save the jump dose for after the deadlift. Tissue does not become the athletic slot.

### Day 5 — chassis maintenance

**Why.** Posture and joint-friendly durability, not a pre-max.

Priority: front thighs → outer quad (moderate) → glutes → chest → rib-side → light calves. Useful, not brutal.

### Day 6 — easy restore

Low-back side wall, glutes, rib-side, chest, optional calves or feet. Restorative pressure only.

### Day 7

None.

## Encoder

`day.tissue` keeps `{ dose, goal, items[{a, tool, d, cue}], note }`. The note is the why and the priority. If time is short, the athlete reads the note and does the first items. Do not hide the why in a comment the renderer never paints.
