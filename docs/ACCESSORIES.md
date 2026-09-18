# Accessory cousins

One of five equal mid-block pillars. See [`MIDBLOCK_CALIBRATION.md`](MIDBLOCK_CALIBRATION.md).

The job stays. The implement may change. That is the whole rotation.

A cousin is not a second lift to log. It is the same slot, same pairing, same week-acc wave, different tool in the hands. The renderer prints `job` above the name and `cousins` as a cue line under it.

Mains are not in this file. Squat, bench, and deadlift stay continuous.

## Same job, varied implement

Write the job first. Then list implements that *are* that job.

- **Legal.** Horizontal pull: barbell row, chest-supported DB row, seal row, cable or band row.
- **Illegal.** Horizontal pull → another press, a hang, or a squat. That is a new job, not a cousin.
- **Illegal.** Farmer → a lighter farmer with the same handles and a pep talk. A cousin is a different implement (trap-bar, front-rack, sandbag), not a lighter ego.

If the athlete cannot name the job in four words, the card is not ready.

## Anti-ego guards

- Pick the cousin you can *own* for the prescribed reps. Do not chase the heaviest cousin on the list.
- Add load only when the reps are clean. No grinders disguised as variety.
- Pairings stay non-competing. Do not invent a cousin that recreates a spine-loaded pair (RDL + row, dead + heavy carry, heavy hinge + heavy trunk).
- Grip is a budget. Do not stack pull-up, RDL, hang, and carry cousins so the forearms fail first.
- Red / back / shoulder flags still swap or skip the lift. A cousin is not a way around a cooked joint.
- Dips stay an accessory. They never become the main, even if the cousin is a push-up.

## Week cadence — explore → own → ease

| Weeks | Acc string in `program.js` | What to do |
| --- | --- | --- |
| 1–4 | Cousin variety | Explore. Same job. Change implement when last week was clean and stale. |
| 5 | Owned only | No new cousins. No new levels. The implement you already own. |
| 6 | Easy cousins | Drop 30–40%. Stay on the owned implement. |

W1 may stay on the first cousin while the pattern beds in. Variety is *allowed* in W1–4, not mandatory every session. W5 and W6 are not explore weeks.

## Day 1 slot map — squat + pull

Main stays unpaired.

| Slot | Job | Default | Cousins |
| --- | --- | --- | --- |
| Main | Squat | Back squat or front squat | — (not a cousin slot) |
| 2A | Vertical pull | Pull-ups or weighted pull-ups | Chin-up, lat pulldown, band-assisted pull-up |
| 2B | Knee-over-toe | Peterson step-ups | Heels-elevated goblet squat, slant-board step-down |
| Separate | Hinge accessory | Romanian deadlift | DB RDL, good morning, single-leg RDL |

2A/2B are a pair. The RDL is separate — not supersetted with the squat, not paired with the pull. Straps if grip would fail first. Peterson volume stays low; mobility already covers slant-board squats.

## Day 2 slot map — upper + carries

Main stays unpaired.

| Slot | Job | Default | Cousins |
| --- | --- | --- | --- |
| Main | Horizontal press | Bench (floor press if no bench) | — (not a cousin slot) |
| 2A | Horizontal pull | Barbell row or chest-supported DB row | Chest-supported DB row, seal row, cable or band row |
| 2B | Strict vertical push | Standing DB overhead press | Landmine press, half-kneeling DB press, seated DB press |
| 3A | Secondary push | Dips or close-grip push-ups | Close-grip push-up, bench dip, decline push-up |
| 3B | Loaded carry | Farmer carry | Trap-bar carry, front-rack carry, sandbag carry |

Shoulder pinch skips dips; the cousin is a push-up or DB press plus scap work, not a heavier dip. Farmer cousins change the implement, not the job.

## Other days

Day 4 accessories may wear a `job` (elastic / land, athletic overhead, vertical pull, anti-rotation carry) so the card reads like a session sheet. They do not need a D1/D2-style cousin list. The elastic slot stays right after the deadlift.

Day 5 is chassis, not a cousin playground. Day 3 and Day 6 have no accessory rotation.

## Encoder

`lift.job` or `lift.role` for the headline. `lift.cousins` as a string list. Pair with `pair` + `slot` as today. If the renderer does not paint job and cousins, Pages drops the calibration — fix the renderer before adding more cousins.
