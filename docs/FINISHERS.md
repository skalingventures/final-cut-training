# Finisher library

One of five equal mid-block pillars — complementary burns — not the whole memorial. Start at [`MIDBLOCK_CALIBRATION.md`](MIDBLOCK_CALIBRATION.md). Accessories, tissue, Elastaboy openers, and prep pump live in their own pages.

This page is clocks, movement-family tags, the anti-echo picker, and week rules. `program.js` encodes what this page already decided.

Do not copy paid GBRS, Filly, Functional Patterns, or Elastaboy daily workouts into this file or into the program. Take the spirit: short gritty finishes, built-not-burnt density, complementary patterns. Write original clocks.

## Thesis

Variety comes from **format rotation + anti-echo**, not from an infinite cousin list of stations.

A week that swaps kettlebell swing for dumbbell swing is the same burnout. A week that keeps the same *family* and changes the *clock* — AMRAP to an ascending ladder, 40/20 to a couplet — is a different burnout. The athlete feels novelty. The strength signal stays clean.

Pick the leftover patterns first. Then pick a format. Then, if the week needs a change, rotate the format before you rotate the movements.

## How this maps to the app

- Base `burn` is the default card (name, format, items, adj).
- `burn.byWeek` overlays a week. Missing week keys fall back to the base. Prefer this.
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
| `carry` | Loaded locomotion | Farmer, suitcase, march, sandbag |
| `cyclical` | Easy engine | Bike, row, incline walk, march |
| `elastic` | Jump / land / rebound | Pogo, broad jump, step-over |
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

Lived: AMRAP Push / Crawl / March. Week 2 rotates to an ascending push-crawl ladder. Week 3 can lean hybrid (slam / crawl / bike). Never a hang-pull or farmer engine on this day.

### Day 2 — upper strength + carries

Main bench (unpaired). Accessories: horizontal pull, strict vertical push, secondary push, farmer.

| Banned | Prefer |
| --- | --- |
| `push-h` / `push-v` as a working press, `carry` (farmer echo) | `hinge`, `crawl`, sprawl / `core`, `cyclical`, light `squat` |

Lived: 40/20 Swing / Crawl / Sprawl. Week 2 rotates to a swing-crawl ladder. Air squats and step-overs are legal here; another press or farmer is not.

### Day 4 — athletic full body

Main deadlift (unpaired). Elastic slot after the deadlift. Accessories: athletic overhead, chin-up, suitcase.

| Banned | Prefer |
| --- | --- |
| `hinge`, `push-v`, `pull-v`, suitcase `carry` | light `squat`, `push-h`, burpee / step-over (`elastic` + `core`) |

Lived: AMRAP goblet + push-up + burpee or bar step-over. Week 5 is the sole chaotic benchmark. Achilles swaps burpees for step-overs or a short march — still no hinge finish.

### Day 5 — chassis

No main. Submaximal pump. Durability, not a fourth hard day.

| Banned | Prefer |
| --- | --- |
| Another hard strength dose, a second benchmark, any redline | Aerobic pump continuous ~RPE 7 |

Green alt: Carry / Crawl / Swing on `burn.menu`. Skip is always legal.

### Days 3, 6, 7

No burnout. Do not sneak one in.

## Week rules

| Week | Intent | Finisher rule |
| --- | --- | --- |
| 1 | Establish | Base format. Teach the family. |
| 2 | Build | Rotate the *format* on the same family (ladder novelty). |
| 3 | Build hard | Same family, honest density. Hybrid or EMOM is fine. |
| 4 | Intensify | Slightly reduced clock or dose. Quality over chaos. |
| 5 | Peak | Owned only — except **Day 4**, the block's **sole chaotic benchmark**. Other Week 5 burns stay 85–90% and are not benchmarks. |
| 6 | Deload | No redline. 60–70%. Shorter clock. Iso / pulse or easy cyclical is correct. |

Three hard burnouts (D1, D2, D4) plus one optional moderate (D5). Red readiness cuts the hard burnout to a walk or a 60–70% easy version. That rule is older than this library and still wins.

## Writing a new card

1. List today's main and heaviest accessories. Those families are banned.
2. Pick 2–3 leftover families from Prefer.
3. Pick a format from the cards above. Rotate format before you invent a new station.
4. Write original items. Do not paste a paid daily.
5. Encode the default on `burn`, week overlays on `burn.byWeek`, green alts on `burn.menu`.
6. Keep Achilles and motivation notes on the base object so every week inherits them.
7. If Week 5 Day 4 is not the day you are writing, do not set `benchmark: true`.

Judge the card the same way [`CANON.md`](../CANON.md) judges every change: complementary, or it does not ship.
