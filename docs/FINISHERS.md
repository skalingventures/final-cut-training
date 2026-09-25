# Finisher library

One of five equal mid-block pillars — complementary burns — not the whole memorial. Start at [`MIDBLOCK_CALIBRATION.md`](MIDBLOCK_CALIBRATION.md). Accessories, tissue, Elastaboy openers, and prep pump live in their own pages.

This page is clocks, movement-family tags, the anti-echo picker, and week rules. `program.js` encodes what this page already decided.

Do not copy paid GBRS, Filly, Functional Patterns, or Elastaboy daily workouts into this file or into the program. Take the spirit: short gritty finishes, built-not-burnt density, complementary patterns. Write original clocks.

## Thesis

**Keep familiar clocks. Change the movements and the kind of stimulus.**

Rotating the format while keeping the same stations just reprints the same workout on a new score sheet. That is why Weeks 1–3 felt like an echo. From Week 4 on, the clock can stay one the athlete already knows (EMOM, 40/20, AMRAP, easy continuous). The movement surface and the energy system have to change.

Each hard day owns one stimulus family, and no other day borrows it:

| Day | Family | Stimulus |
| --- | --- | --- |
| D1 Mon | Wheels & Twist | Alactic air-bike / rower sprints plus rotation |
| D2 Tue | Hill & Field | Short uphill speed plus lateral footwork |
| D4 Thu | Ground & Grapple | Ground locomotion, get-to-stand, rings |
| D5 Fri | Carry Walk | Loaded locomotion at RPE 6–7, optional |

The per-day bans still sit on top of the family rule. D1: no squat, vertical pull, hinge, or heavy carry. D2: no press, no farmer. D4: no hinge, vertical push, vertical pull, carry, or lunge.

This replaces the old house rule "rotate the format before you rotate the movements."

## How this maps to the app

- Base `burn` is the default card (name, format, items, adj).
- `burn.byWeek` overlays a week. Missing week keys fall back to the base. Prefer this.
- Optional overlay fields `score`, `fallback`, and `scale` render under the station list. `zoneCue: false` hides the old Z4-by-minute-4–6 line on alactic / speed cards.
- `burn.menu` holds green alts or week-tagged rows. A complete base is not stolen by an untagged menu item.
- `Core.resolveBurn(day, week)` is the picker. Logging, skip, and red-day easy options stay on the resolved card.

A cousin on a *lift* is an implement swap for the same job. A cousin on a *finisher* is a last-resort station swap (Achilles, missing gear). Do not build the library out of station cousins.

## Movement families

Tag every station. The anti-echo picker below bans families, not brand names.

| Tag | Means | Home-gym examples |
| --- | --- | --- |
| `hinge` | Hip hinge, swing, RDL pattern | KB swing, DB RDL, good morning |
| `squat` | Knee-dominant squat or lunge | Goblet, air squat, step-up |
| `push-h` | Horizontal push | Push-up, floor press, slam-to-chest |
| `push-v` | Vertical / overhead push | Push press, OHP, handstand walk |
| `pull-h` | Horizontal pull | Row, seal row |
| `pull-v` | Vertical / hang pull | Pull-up, chin-up, dead hang |
| `crawl` | Ground locomotion | Bear crawl, lizard, shoulder-tap plank |
| `ground` | Ground-to-stand / animal travel | Crab, ape, technical stand-up, KB get-to-stand |
| `carry` | Loaded locomotion | Farmer, suitcase, march, sandbag |
| `cyclical` | Easy engine | Bike, row, incline walk, march |
| `sprint` | Alactic or max-speed effort | Air-bike sprint, hill sprint, hill stride |
| `rotation` | Transverse / anti-rotation | Landmine rainbow, Pallof, band chop |
| `elastic` | Jump / land / rebound | Pogo, broad jump, step-over, box jump |
| `slam` | Ball or bag to the floor | Med-ball slam, sandbag throw-down |
| `core` | Trunk that is not a carry | Dead bug, hollow, sprawl, sit-up |

A station can wear two tags (`elastic` + `squat` for a jump squat). Ban either tag and the station is out.

## Format cards

Ten clocks. Each card is a *shape*. Fill it with leftover families, not with yesterday's main.

### 1. Ascending multi ladder

**Clock.** 8–10 min. Start at a small set (1 / 2 / 2). Add the same increment each rung. Climb until the clock dies.

**Use when.** You want novelty on a known family without adding stations. Lived Block 01: Day 1 Week 2, Day 2 Week 2.

**Fill.** Two or three leftover families. One cyclical or march breaker between rungs if the climb gets sloppy.

**Not.** A max-out. If the first three rungs are already ugly, you picked the wrong increment.

### 2. Ascending couplet / triplet ladder

**Clock.** 8–10 min. Two or three movements, same increment, no extra breaker.

**Use when.** The day already has a lot of decision-making and you want one simple climb. Close cousin of the multi ladder; drop the march if the athlete does not need a breath station.

**Fill.** Couplet preferred. Triplet only when all three families are clearly leftover.

### 3. AMRAP couplet / triplet

**Clock.** 8–10 min, as many rounds as clean. The Block 01 default hard finish.

**Use when.** Establishing a family (W1) or owning it (W5, except Day 4). Lived: Day 1 Push / Crawl / March; Day 4 goblet + push-up + burpee / step-over.

**Fill.** 2–3 stations. Moderate loads. Count rounds. This is the only format allowed to wear `benchmark: true`, and only on Day 4 Week 5.

### 4. Density 40/20

**Clock.** 40 sec work / 20 sec transition × 8–10 min. Stations are a playlist, not a round count.

**Use when.** The strength session was dense and you want a clock that thinks for the athlete. Lived: Day 2 Swing / Crawl / Sprawl.

**Fill.** Rotate leftover families. Put an easy cyclical or nasal walk on the even recoveries so it does not become a second strength session.

**Not.** A second press or farmer on Day 2. The 40/20 is not permission to echo.

### 5. Alternating EMOM

**Clock.** Every minute on the minute, 8–10 min. Odd minutes family A, even minutes family B. Rest is whatever is left in the minute.

**Use when.** You want honest pacing and a built-in ceiling. Good Week 3–4 option if AMRAP is getting sloppy.

**Fill.** Two leftover families. The minute must finish with 10–20 sec left at the prescribed effort. If it does not, the dose is too big.

### 6. Carry engine

**Clock.** 8–10 min AMRAP or E2MOM. Carry or march is the spine; one other leftover family fills the rest.

**Use when.** The day did *not* already own a heavy carry (so not Day 2, not Day 4 suitcase). Fine as a Day 5 green alt, not as the Day 5 default.

**Fill.** `carry` + `cyclical` or `carry` + `crawl`. No max farmer after a squat day. March is the polite cousin of farmer.

### 7. Cyclical + strength hybrid

**Clock.** 8–10 min. Easy bike / row / walk for 40–60 sec, then a small leftover strength dose, repeat.

**Use when.** You need Zone 4 without another skill-heavy playlist. Lived flavor: Day 1 Week 3 Slam / Crawl / Bike.

**Fill.** One `cyclical`, one `slam` or `push-h` or `crawl`. Keep the strength dose small enough that the bike stays the engine.

### 8. Crawl / ground engine

**Clock.** 8–10 min AMRAP or 40/20. Crawl or sprawl is the spine.

**Use when.** Upper-body pressing or hanging already cooked the hands. Ground work does not steal the barbell signal.

**Fill.** `crawl` + `elastic` or `crawl` + `cyclical`. Shoulder-tap planks are a legal crawl cousin when the floor is unkind.

### 9. Iso / pulse soft

**Clock.** 6–8 min, not for time. Pulses, carries at a walk, or easy positional work.

**Use when.** Amber days, Week 6, or a session that already did its job. This is a finish, not a test.

**Fill.** Light `core`, easy `cyclical`, or an owned iso. No clock-chasing.

### 10. Aerobic pump continuous (Day 5 default)

**Clock.** 8–10 min easy cyclical, nasal, about RPE 7. Not for score.

**Use when.** Always the Day 5 default. Leave-better is the standard, not optional flavor text.

**Fill.** Bike, row, or incline walk. Stand up if you need. Do not chase heart rate.

**Green alt only.** The old Carry / Crawl / Swing E2MOM lives on Day 5 `burn.menu`. It is not the default. Skip it if the week already cooked you.

## Anti-echo picker

Banned means the family already got a main or a heavy accessory today. Prefer is the leftover set. Fill a format card from Prefer only.

### Day 1 — squat strength + pull

Main squat (unpaired). Accessories: vertical pull, knee-over-toe, hinge.

| Banned | Prefer |
| --- | --- |
| `squat`, `pull-v`, `hinge` (including swings), max `carry` | `push-h`, `crawl`, `slam`, `cyclical`, march |

Lived W1–W3: AMRAP Push / Crawl / March. Week 2 is an ascending push-crawl ladder **start 2, +2**. Week 3 is a cyclical hybrid: bike 40 s → push-ups ×8 → med-ball slam ×8, march as breaker. W4–W6 switch to **Wheels & Twist**: Sprint Ten + Twist (EMOM bike sprints + landmine), Row-Bike Relay, Easy Spin & Pallof. Never a hang-pull or farmer engine on this day. `squat thrust` (W1–W3 history) is tagged `elastic`, not `squat`.

### Day 2 — upper strength + carries

Main bench (unpaired). Accessories: horizontal pull, strict vertical push, secondary push, farmer.

| Banned | Prefer |
| --- | --- |
| `push-h` / `push-v` as a working press, `carry` (farmer echo) | `hinge`, `crawl`, sprawl / `core`, `cyclical`, light `squat` |

Lived W1–W3: 40/20 Menu A — swing / crawl / sprawl / **bike or row at stations 4 and 9**. Week 2 rotates to a swing-crawl ladder. Week 3 is Menu A again but must visibly differ from Week 1 (assault bike / easy row wording + week note). W4–W6 switch to **Hill & Field**: Hill Eights, Beat the Mark, Hill Strides. Indoor fallback stays on the card: Box & Bell (box jump step-down + 80 lb swings), rower strokes if Achilles. Another press or farmer is not legal.

### Day 4 — athletic full body

Main deadlift (unpaired). Elastic slot after the deadlift. Accessories: athletic overhead, chin-up, suitcase.

| Banned | Prefer |
| --- | --- |
| `hinge`, `push-v`, `pull-v`, suitcase `carry` | light `squat`, `push-h`, burpee / step-over (`elastic` + `core`) |

Lived W1–W3: light-squat + horizontal-push couplet. Week 3 is Alt B: wall-ball (or goblet-to-target) / push-ups / burpee step-overs. W4–W6 switch to **Ground & Grapple**: Ground School (40/20), the Ground-to-Stand Test (sole chaotic benchmark), Ground Flow. Effort W1–W4 displays 90–95%. Still no hinge finish.

### Day 5 — chassis

No main. Submaximal pump. Durability, not a fourth hard day.

| Banned | Prefer |
| --- | --- |
| Another hard strength dose, a second benchmark, any redline | Aerobic pump continuous ~RPE 7 |

Green alt: Carry / Crawl / Swing on `burn.menu`, **W1–W3 only**. W4 is the Carry Walk Medley. Skip is always legal.

### Days 3, 6, 7

No burnout. Do not sneak one in.

## Week rules

| Week | Intent | Finisher rule |
| --- | --- | --- |
| 1 | Establish | Base format. Teach the family. D2 Menu A already uses bike/row at 4/9. D4 effort 90–95%. |
| 2 | Build | Rotate the *format* on the same family (ladder novelty). D1 ladder starts at 2, +2. |
| 3 | Build hard | D1 cyclical hybrid. D2 Menu A (must differ from W1). D4 Alt B wall-ball package. One new format this week (hybrid). |
| 4 | Intensify | Day-owned families begin. D1 Sprint Ten + Twist. D2 Hill Eights. D4 Ground School. D5 Carry Walk Medley. Every hard card sets a number to beat next week. |
| 5 | Peak | **No new movements.** D1 Row-Bike Relay. D2 Beat the Mark (vs the W4 hill mark). D4 Ground-to-Stand Test — the block's **sole chaotic benchmark**. D5 Soft Walk, no carries. Other Week 5 burns stay 85–90% and are not benchmarks. |
| 6 | Deload | No redline anywhere. One easy preview movement per hard day: Pallof (D1), backward hill walk (D2), lateral ape (D4). D5 walk or skip. Show RPE, not a week percent. |

### W4–W6 hard rules (encode, do not wink at)

1. **Day-owned families.** D1 Wheels & Twist, D2 Hill & Field, D4 Ground & Grapple, D5 Carry Walk. No other day borrows the family.
2. **Retired for W4–W6:** burpees, sprawls, squat thrusts, mountain climbers, bar step-overs, floor push-ups, bear crawls, plank shoulder taps, 35 lb conditioning swings, goblet squats and air squats as burnout stations, walking lunges, and bike/row/march used as a "breaker" or "easy engine" inside a hard card. The bike and rower return only as D1 sprint implements (or the D5 cooked-Friday walk). Swings return only as the heavy 80 lb power set on D2's no-hill fallback.
3. **Max reuse.** No movement appears in more than 3 of the 12 W4–W6 cards, and no movement appears on two different days in the same week. Walking to recover is exempt.
4. **Novelty cadence.** Every build week introduces at least one movement never seen in a burnout. The peak week introduces **zero** new movements — anything tested in W5 was exposed in W4. The deload introduces one easy skill movement as a preview.
5. **Format is the constant, movement is the variable.** Keep clocks the athlete already understands. Change what fills them.
6. **Every hard card carries a number** (watts, hill mark, get-up count), compared with the same day last week, never across days. Only W5 D4 is labelled a benchmark. The other numbers are private logbook marks.
7. **Sprints and power stop when quality drops**, not when the clock runs out. Cap hill reps at 90–95% with build-up strides. Stop if a sprint drops below ~90% of the day's best, or if the hill mark is missed twice in a row.
8. **Readiness still wins.** Red means the burnout is off. Amber cuts rep count by about a third and caps effort at ~85%. The Achilles flag swaps every hill or box item to the rower or bike version shown on that card.

Hill cards assume a gentle sidewalk grade, about four city blocks of concrete — enough distance for 8–10 s efforts. The Box & Bell indoor fallback stays visible on the D2 cards.

### D2 menus

- **Menu A (W1, W3):** swing / crawl / sprawl / bike or row / nasal walk, twice through. W3 wording is assault bike / easy row so the card is not a W1 copy.
- **Ladder week (W2):** swing-crawl ascending ladder on the same family.
- **Hill & Field (W4–W6):** Hill Eights → Beat the Mark → Hill Strides. Box & Bell fallback on the card.

### D4 alternates

- **Alt A (W1 identity):** goblet / push-ups / burpees over bar. Retired as the W5 test.
- **Alt B (W3):** wall-ball or goblet-to-target / push-ups / burpee step-overs.
- **Ground & Grapple (W4–W6):** Ground School → Ground-to-Stand Test (benchmark) → Ground Flow.

### Modifiers

- Achilles: each card names its swap. Hill / box → rower power strokes or easy walk. D1 sprints do not need a change.
- Grip: no max farmer after D1 pull-ups + RDL; no farmer on D2; no suitcase echo on D4. D5 hugs the 80 lb bell instead of crush-gripping it.
- W6 / optional: RPE, no Z4-by-minute-4–6 cue. Alactic D1/D2 cards set `zoneCue: false`.

Day 5 default in W1–W3 is the 8-min aerobic pump at ~RPE 7 plus a light DB complex option. Carry / Crawl / Swing is a green option **W1–W3 only**, and its stations must render. W4 is the Carry Walk Medley (CCS dropped). W5 Soft Walk. W6 walk or skip.

Three hard burnouts (D1, D2, D4) plus one optional moderate (D5). Red readiness cuts the hard burnout to a walk or a 60–70% easy version. That rule is older than this library and still wins.

## Writing a new card

1. List today's main and heaviest accessories. Those families are banned.
2. Stay inside the day's owned stimulus family. Do not borrow another day's family.
3. Pick a familiar clock. Change the movements and the stimulus, not the score-sheet shape.
4. Write original athlete-facing items: dose, rest, effort cap, and the number to beat. Do not paste a paid daily. Do not paste research prose or citations into the app.
5. Encode the default on `burn`, week overlays on `burn.byWeek`, green alts on `burn.menu`. Put the mark on `score`, the indoor / Achilles swap on `fallback`, and amber / scale-down on `scale`.
6. Keep Achilles and motivation notes on the base object so every week inherits them.
7. If Week 5 Day 4 is not the day you are writing, do not set `benchmark: true`.
8. Check the max-reuse rule across the twelve W4–W6 cards before you ship.

Judge the card the same way [`CANON.md`](../CANON.md) judges every change: complementary, or it does not ship.

## Principle-level attribution

App cards stay session instructions. Sources live here only.

- Concurrent training / modality: Wilson et al. 2012; later compatibility metas. Sprint-interval work shows little interference with strength.
- Alactic dosing: Joel Jamieson, 6–10 s efforts with long rest.
- Hill sprints for strength athletes: short reps, gentle grade, full walk-down rest; quality-over-clock stop rule (Haugen, Athletics Australia, ALTIS intensity model).
- Ground-to-stand test principle: MTI sandbag get-up challenge (10-min AMRAP). The Block 01 test is original — 6 min, 35 lb chest-hug, not a copied workout.
- Broad jump standard: GBRS Performance Standard, measured from the heel, reported vs body height (elite = height + 12 in). Athlete is 5'11" (71 in).
- Carries: StrongFirst kettlebell-carry progressions (goblet / bear-hug, overhead). Backward walk as a low-cost concentric quad option.
- Ground travel: Animal Flow / Original Strength as pattern families, not copied flows.

Do not copy paid GBRS, Filly, Functional Patterns, or Elastaboy dailies into cards.
