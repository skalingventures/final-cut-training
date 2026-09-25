/* Final Cut — Block 01 program data. Source of truth for the six-week block. */
window.PROGRAM = {
  title: "Block 01",
  subtitle: "Strength, Mobility, Burnouts",
  identity: "Strong, mobile, athletic, durable, hard to break.",
  principle: "Mobility opens the pattern. Main lifts drive strength. Accessory pairings create density. Burnouts add the edge. Recovery protects the adaptation.",
  calendar: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

  weeks: [
    { n: 1, main: "4 × 6", rpe: "RPE 7", acc: "Cousin variety — pick the implement you own today", burn: "80%", intent: "Establish", heat: "easy", mob: "Start at the level you can control 100%. Default Level 1." },
    { n: 2, main: "4 × 6", rpe: "RPE 7.5", acc: "Cousin variety — same job, different implement if last week was clean", burn: "85%", intent: "Build", heat: "moderate", mob: "Earn the next level only when today's level is clean. Do not skip." },
    { n: 3, main: "5 × 5", rpe: "RPE 8", acc: "Cousin variety — stay on the job; swap the cousin if the first pick is stale", burn: "90%", intent: "Build hard", heat: "hard", mob: "Earn the next level only when today's level is clean. Do not skip." },
    { n: 4, main: "5 × 4", rpe: "RPE 8–8.5", acc: "Cousin variety — slightly reduced volume; keep the job, pick the cleanest cousin", burn: "85–90%", intent: "Intensify", heat: "hard", mob: "Earn the next level only when today's level is clean. Do not skip." },
    { n: 5, main: "5 × 3", rpe: "RPE 8.5–9", acc: "Owned only — no new cousins, no new levels", burn: "85–90%", intent: "Peak", heat: "hardest", mob: "Stay on a level you own. No new level." },
    { n: 6, main: "3 × 5", rpe: "RPE 6–7", acc: "Easy cousins — drop 30–40%, stay on the implement you own", burn: "60–70%", intent: "Deload / absorb", heat: "easy", mob: "Drop one level or unload." }
  ],

  sets: { 1: 4, 2: 4, 3: 5, 4: 5, 5: 5, 6: 3 },
  progReps: { 1: 6, 2: 6, 3: 5, 4: 4, 5: 3, 6: 5 },

  ready: [
    { id: "green", lab: "Green", note: "Full session, full burnout. If the body feels great, add load or reps — not chaos." },
    { id: "amber", lab: "Average", note: "Full strength, moderate burnout. Cut a round or drop load before you cut form." },
    { id: "red", lab: "Red", note: "Strength only, or take this as a recovery day. Burnout is off. Heavy hinge is off." }
  ],
  flags: [
    { id: "achilles", lab: "Achilles cranky" },
    { id: "back", lab: "Back cooked" },
    { id: "shoulder", lab: "Shoulder pinchy" },
    { id: "motivation", lab: "Motivation low" }
  ],

  days: [
    {
      n: 1, heat: "hard", tag: "Hard", weekday: "Monday",
      theme: "Ankles & Knees", sub: "Squat strength + pull",
      mobNote: "Elastaboy opener for squat depth and knee-over-toe. Same drills. Own today's level before you climb.",
      tissue: {
        dose: "3–5 min",
        goal: "Prep squat ankle/knee travel and the pull-up hang.",
        items: [
          { a: "Calves", for: "squat", tool: "Roller", d: "60 sec / side", cue: "Roll from the Achilles up toward the back of the knee. Pause on dense spots." },
          { a: "Front thigh / hip-flexor quad", for: "Peterson step-ups", tool: "Roller or ball", d: "45–60 sec / side", cue: "Work the upper front thigh, especially where the quad meets the hip." },
          { a: "Lats / rib-side", for: "pull-ups", tool: "Roller", d: "60 sec / side", cue: "Roll from the armpit down the side-back and into the rib-side so the hang can sit." },
          { a: "Outer thigh / outer quad", for: "squat", optional: true, tool: "Roller", d: "30–45 sec / side", cue: "Moderate pressure along the outside of the thigh. Don't smash the side of the knee." },
          { a: "Glutes", for: "Romanian deadlift", optional: true, tool: "Hard medicine ball", d: "60 sec / side", cue: "Sit on the ball and search the big glute and side-glute pocket." },
          { a: "Inner thighs", for: "Peterson step-ups", optional: true, tool: "Roller", d: "45 sec / side", cue: "Gentle pressure before squats and Petersons." }
        ],
        note: "Priority: calves, front thigh/hip-flexor, then lats/rib-side for the pull-ups. Outer quad, glute, and inner thigh are optional overflow. Don't smash the IT band."
      },
      prepPump: {
        dose: "2–4 min",
        goal: "Light ankle/knee pattern pump before mobility. RPE ≤6.",
        items: [
          { a: "Goblet squat pulse", tool: "Light KB", d: "2 × 8", cue: "Heels down, knees track, no bounce." },
          { a: "Split-stance lean", d: "6 / side", cue: "Front knee over the toe, heel stays." }
        ],
        note: "Skip on Amber/Red or any flag. Then run the existing mob ladder. This is not a working set."
      },
      mob: [
        { nm: "Knee-to-toe ankle rockers", why: "Dorsiflexion, knee-over-toe comfort.", levels: ["Hands-guided, heel down.", "More knee travel.", "Light load on the knee."] },
        { nm: "Straight-leg calf raisers", why: "Gastroc and Achilles.", levels: ["Two-leg, slight lean.", "More lean.", "Single-leg."] },
        { nm: "Bent-knee calf raisers", why: "Soleus capacity.", levels: ["Two-leg, shallow bend.", "Deeper bend.", "Single-leg on a ledge."] },
        { nm: "Tib raisers", why: "Ankle balance, front-of-shin strength.", levels: ["Back to wall, feet close.", "Feet farther from the wall.", "Slant-board."] },
        { nm: "Slant-board squats", why: "Knee confidence, squat tolerance.", levels: ["Bodyweight, no bounce.", "Light load.", "Hindu / self-elevated heels only if Level 2 is owned."] }
      ],
      lifts: [
        { id: "squat", nm: "Back squat or front squat", prog: true, note: "Main lower-body strength lift. Straight sets, full rest, never supersetted.", load: true },
        { id: "pullup", nm: "Pull-ups or weighted pull-ups", job: "Vertical pull", cousins: ["Neutral-grip pull-up", "Lat pulldown", "Band-assisted pull-up"], rx: "4 × 4–8", sets: 4, pair: "2", slot: "A", note: "Upper pull. Pick a cousin you can own for 4–8 clean reps. Add weight if 8 strict are easy.", load: true, bw: true },
        { id: "peterson", nm: "Peterson step-ups", job: "Knee-over-toe", cousins: ["Heels-elevated goblet squat", "Slant-board step-down"], rx: "2–3 × 6–8 / side", sets: 3, pair: "2", slot: "B", note: "Controlled knee-over-toe strength. Low volume — mobility already covers slant-board squats." },
        { id: "rdl", nm: "Romanian deadlift", job: "Hinge accessory", cousins: ["DB RDL", "Good morning", "Single-leg RDL"], rx: "3 × 6–8", sets: 3, note: "Separate from the squat — not a superset. Use straps if grip would fail first.", load: true }
      ],
      burn: {
        nm: "Push / Crawl / March", fmt: "10-minute AMRAP", hard: true, effort: "80%",
        items: ["Push-ups × 8–12", "Bear crawl × 8–10 steps", "March or easy cyclical × 40 sec"],
        adj: "No squat, hang-pull, swing, or max farmer on squat day.",
        patterns: ["push-h", "crawl", "cyclical"],
        byWeek: {
          1: {
            nm: "Push / Crawl / March", fmt: "10-minute AMRAP", effort: "80%",
            items: ["Push-ups × 8–12", "Bear crawl × 8–10 steps", "March or easy cyclical × 40 sec"],
            adj: "Establish the family. Push, crawl, march. Same anti-echo: no squat, hang-pull, swing, or max farmer.",
            patterns: ["push-h", "crawl", "cyclical"]
          },
          2: {
            nm: "Ascending Push-Crawl Ladder", fmt: "10-min ascending ladder · start 2, +2/round", effort: "85%",
            items: ["Push-ups start 2, +2 / round", "Bear crawl steps start 2, +2 / round", "March 40 sec between rungs if you need it"],
            adj: "Ladder novelty. Start at 2, add 2 each rung. Same family, different clock.",
            patterns: ["push-h", "crawl", "cyclical"]
          },
          3: {
            nm: "Bike / Push / Slam Hybrid", fmt: "10-min cyclical hybrid", effort: "90%",
            items: ["Bike 40 s", "Push-ups × 8", "Med-ball slam × 8", "March as breaker"],
            adj: "Build-hard cyclical hybrid. Bike is the engine; push and slam stay crisp.",
            patterns: ["cyclical", "push-h", "slam"]
          },
          4: {
            nm: "Sprint Ten + Twist", fmt: "EMOM × 10 min", effort: "Sprints all-out · session RPE 7–8", zoneCue: false,
            items: [
              "Minutes 1–8: from a rolling start, 8 seconds all-out on the air bike, then spin easy for the rest of the minute.",
              "Minutes 9–10: rack-corner landmine rotations with the empty bar, 2 × 6 per side, smooth and controlled.",
              "Each sprint is 100% effort. The session should feel like RPE 7–8, not a blow-up."
            ],
            score: "Peak RPM or watts on your best sprint, and sprint 8 as a percentage of your best. Standard: sprint 8 at ≥90% of your best. Write it down — beat it next week.",
            scale: "6 sprints, and a band Pallof press instead of the landmine. Amber: 5 sprints at ~90%.",
            fallback: "Achilles flag: no change. Rower is the alternate implement — 8-second power strokes instead of the bike.",
            adj: "Wheels & Twist. Alactic bike sprints plus rotation. No squat, hang-pull, swing, or farmer.",
            patterns: ["cyclical", "core", "sprint", "rotation"]
          },
          5: {
            nm: "Row-Bike Relay", fmt: "9–10 min relay", effort: "Hard rows · RPE 8", zoneCue: false,
            items: [
              "Four rounds: 250 m row hard (the pace you could just barely hold for 500 m), straight into 15 seconds max on the air bike, then 75 seconds walking.",
              "About 9–10 minutes.",
              "Finish with 1 × 6 per side landmine rotation, empty bar, smooth."
            ],
            score: "Sum of the four row times plus total bike calories. Peak-week logbook number — write it down.",
            scale: "3 rounds, or 150 m rows.",
            fallback: "Achilles flag: no change. Stay on the bike and rower.",
            adj: "Wheels & Twist. Peak week. No new movements. Not a benchmark — that is Day 4 this week.",
            patterns: ["cyclical", "core", "sprint", "rotation"]
          },
          6: {
            nm: "Easy Spin & Pallof", fmt: "Soft 4 rounds · no redline", effort: "RPE 5–6",
            items: [
              "Four rounds: 60 seconds easy bike with a 5-second smooth pickup at the end, then 60 seconds walking.",
              "Finish with 2 × 8 per side band Pallof press."
            ],
            adj: "Deload. No redline. Pallof press is this week's easy preview.",
            patterns: ["cyclical", "core", "rotation"]
          }
        }
      },
      down: "2–5 min breathing or easy walk."
    },
    {
      n: 2, heat: "hard", tag: "Hard", weekday: "Tuesday",
      theme: "Hips & Glutes", sub: "Upper strength + carries",
      mobNote: "Elastaboy opener for hip rotation and a quiet press brace. Same drills. Own today's level before you climb.",
      tissue: {
        dose: "3–5 min",
        goal: "Prep pressing, overhead, and the row",
        items: [
          { a: "Chest", for: "bench press", tool: "Hard ball against wall", d: "60 sec / side", cue: "Work across the broad chest from the sternum side toward the shoulder." },
          { a: "Rib-side / under armpit", for: "Standing DB overhead press", tool: "Ball or roller", d: "45–60 sec / side", cue: "Just below the armpit and along the side ribs — helps overhead position and breathing." },
          { a: "Lats / side back", for: "barbell row", tool: "Roller", d: "60 sec / side", cue: "Roll from the armpit down the side of the back so the row can pull." },
          { a: "Glutes / side glutes", for: "farmer carry", optional: true, tool: "Hard medicine ball", d: "60 sec / side", cue: "Work the meaty back pocket and slightly toward the side hip — carry brace, optional." },
          { a: "Hip crease / front of hip", for: "farmer carry", optional: true, tool: "Ball or roller", d: "45 sec / side", cue: "Gentle pressure near the front pocket for carry bracing, not on sensitive structures." }
        ],
        note: "Priority: chest, rib-side, then lats for the row. Glutes and hip crease move to optional — they are for carry bracing, not the press."
      },
      prepPump: {
        dose: "2–4 min",
        goal: "Light upper + brace pump before hip mobility. RPE ≤6.",
        items: [
          { a: "Dead-bug brace", d: "2 × 6 / side", cue: "Ribs down, exhale, then reach." },
          { a: "Scap push-up", d: "2 × 8", cue: "Lock the elbows. Move the shoulder blades only." }
        ],
        note: "Skip on Amber/Red or any flag. Then run the existing mob ladder. This is not a working set."
      },
      mob: [
        { nm: "90/90 hip switches", why: "Hip rotation.", levels: ["Hands for support.", "No hands.", "Light weight held in front."] },
        { nm: "Hip CARs", why: "Active hip control.", levels: ["Tabletop.", "Standing, hold for balance.", "Kneeling, heel to bench."] },
        { nm: "Hip flexor lunge pulses", why: "Hip extension.", levels: ["Standard lunge pulse.", "Couch stretch.", "Couch stretch with overhead load, knee to wall."] },
        { nm: "Glute bridge reps", why: "Glute activation.", levels: ["Two-leg bodyweight, posterior tilt.", "Single-leg. Load optional.", "Feet elevated. Load optional."] },
        { nm: "Lateral band walks", why: "Side-glute stability.", levels: ["Band above the knees.", "Lower squat.", "Band at the ankles, stay low."] }
      ],
      lifts: [
        { id: "bench", nm: "Bench press", prog: true, note: "Floor press if no bench. Dips are the accessory, never the main. Straight sets, never supersetted.", load: true },
        { id: "row", nm: "Barbell row or chest-supported DB row", job: "Horizontal pull", cousins: ["Chest-supported DB row", "Seal row", "Cable or band row"], rx: "4 × 6–10", sets: 4, pair: "2", slot: "A", note: "Horizontal pull. Heavy but controlled. Swap the cousin if last week's implement is stale.", load: true },
        { id: "ohp", nm: "Standing DB overhead press", job: "Strict vertical push", cousins: ["Landmine press", "Half-kneeling DB press", "Seated DB press"], rx: "3–4 × 6–8", sets: 4, pair: "2", slot: "B", note: "Strict reps, ribs down. Pick a cousin you can own overhead.", load: true },
        { id: "dips", nm: "Dips or close-grip push-ups", job: "Secondary push", cousins: ["Close-grip push-up", "Bench dip", "Decline push-up"], rx: "2–3 × 8–12", sets: 3, pair: "3", slot: "A", note: "Secondary push. Shoulder-dependent.", swapPinch: "Skip dips. Use push-ups or DB press and add scap work." },
        { id: "farmer", nm: "Farmer carry", job: "Loaded carry", cousins: ["Trap-bar carry", "Front-rack carry", "Sandbag carry"], rx: "4 × 40–60 sec", sets: 4, pair: "3", slot: "B", note: "Heavy, tall, braced. Cousin is a different implement, not a lighter farmer.", load: true }
      ],
      burn: {
        nm: "Swing / Crawl / Sprawl", fmt: "40 sec work / 20 sec transition × 10 min", hard: true, effort: "80%",
        items: [
          "Kettlebell swings",
          "Bear crawl or plank shoulder taps",
          "Burpees or sprawls",
          "Bike or row",
          "Easy walk, nasal breathing",
          "Kettlebell swings",
          "Bear crawl or plank shoulder taps",
          "Burpees or sprawls",
          "Bike or row",
          "Easy walk, nasal breathing"
        ],
        adj: "Dense upper + carry day. Hinge / cyclical family — not a second press or farmer.",
        patterns: ["hinge", "crawl", "elastic", "cyclical"],
        byWeek: {
          1: {
            nm: "Swing / Crawl / Sprawl", fmt: "40 sec work / 20 sec transition × 10 min", effort: "80%",
            items: [
              "Kettlebell swings",
              "Bear crawl or plank shoulder taps",
              "Burpees or sprawls",
              "Bike or row",
              "Easy walk, nasal breathing",
              "Kettlebell swings",
              "Bear crawl or plank shoulder taps",
              "Burpees or sprawls",
              "Bike or row",
              "Easy walk, nasal breathing"
            ],
            adj: "Establish Menu A. Stations 4 and 9 are bike or row — not air squat.",
            patterns: ["hinge", "crawl", "elastic", "cyclical"]
          },
          2: {
            nm: "Swing-Crawl Ladder", fmt: "10-minute ascending ladder", effort: "85%",
            items: ["KB swings × 8", "Bear crawl × 6 steps", "Add 2 swings and 2 steps each rung", "Nasal walk 20 sec if you need it"],
            adj: "Ladder novelty on the same family. Still no press or farmer.",
            patterns: ["hinge", "crawl", "cyclical"]
          },
          3: {
            nm: "Swing / Crawl / Sprawl · Menu A", fmt: "40 sec work / 20 sec transition × 10 min", effort: "90%",
            items: [
              "Kettlebell swings",
              "Bear crawl or plank shoulder taps",
              "Burpees or sprawls",
              "Assault bike or easy row",
              "Easy walk, nasal breathing",
              "Kettlebell swings",
              "Bear crawl or plank shoulder taps",
              "Burpees or sprawls",
              "Assault bike or easy row",
              "Easy walk, nasal breathing"
            ],
            adj: "Build-hard Menu A. Stations 4 and 9 stay assault bike or easy row. Visibly not the Week 1 card.",
            patterns: ["hinge", "crawl", "elastic", "cyclical"]
          },
          4: {
            nm: "Hill Eights", fmt: "8–10 min hill sprints", effort: "Sprints 90–95%", zoneCue: false,
            items: [
              "Walk to the hill as the warm-up. Gentle sidewalk incline, about 4 city blocks of concrete — plenty of distance for 8–10 second efforts.",
              "2 build-up strides uphill at about 70% and 80%.",
              "8 × 8-second uphill sprints at 90–95%. Walk all the way back down between reps — about 60–90 seconds, more at altitude if the next rep would be slower.",
              "Put a rock or marker where rep 2 finishes.",
              "After the last rep, on flat ground: 3 × 15 m lateral shuffle each direction, then 1 × 20 m carioca each direction."
            ],
            score: "How many of the 8 reps reach the rep-2 mark. Standard: 6 of 8. Stop early if two reps in a row fall short. Write the mark down — beat it next week.",
            scale: "6 reps at 85–90%. Amber: 5 reps at ~85%.",
            fallback: "No hill, snow, or Achilles flag — Box & Bell EMOM 10: odd minutes 3 box jumps at 20–24 in, stepping down; even minutes 5 heavy swings with the 80 lb KB. Achilles flag: drop the box jumps and do 8 × 8-second rower power strokes on the odd minutes.",
            adj: "Hill & Field. Short uphill sprints on a gentle concrete grade, then lateral footwork. No press or farmer.",
            patterns: ["sprint", "elastic", "cyclical", "hinge"]
          },
          5: {
            nm: "Beat the Mark", fmt: "8–10 min hill sprints", effort: "Sprints ~90%", zoneCue: false,
            items: [
              "Walk to the hill as the warm-up. Same gentle sidewalk incline.",
              "2 build-up strides uphill at about 70% and 80%.",
              "8 × 10-second uphill sprints at about 90%. Keep your Week 4 mark in place. Run a little under max.",
              "Then 2 × 15 m lateral shuffle each way."
            ],
            score: "Reps that reach the Week 4 mark. Goal: at least 6 of 8. Stop early if two reps in a row fall short.",
            scale: "6 reps.",
            fallback: "No hill, snow, or Achilles flag — Box & Bell EMOM 10: odd minutes 3 box jumps at 20–24 in, stepping down; even minutes 5 heavy swings with the 80 lb KB. Achilles flag: drop the box jumps and do 8 × 8-second rower power strokes on the odd minutes.",
            adj: "Hill & Field. Peak week. Same family, a little under max. Not a benchmark — that is Day 4 this week.",
            patterns: ["sprint", "elastic", "cyclical", "hinge"]
          },
          6: {
            nm: "Hill Strides", fmt: "Easy hill strides · no redline", effort: "RPE 5–6",
            items: [
              "5 × 10-second relaxed strides uphill at about 70%, walking down.",
              "Then 3 minutes of easy backward walking uphill."
            ],
            fallback: "No hill or Achilles flag: 5 × 10-second easy walk-out strides on flat ground, then 3 minutes easy backward walk.",
            adj: "Deload. No redline. Backward hill walk is this week's easy preview.",
            patterns: ["sprint", "cyclical"]
          }
        }
      },
      down: "2–5 min breathing or easy walk."
    },
    {
      n: 3, heat: "easy", tag: "Easy", weekday: "Wednesday",
      theme: "Spine & Shoulders", sub: "Recovery · Zone 2 · tissue",
      restTitle: "Recovery session",
      guardTop: "No strength. No burnout. No heavy upper body — this day exists to make Day 4 better.",
      mobNote: "Recovery day. Default Level 1, Level 2 if owned. No Level 3 load.",
      tissue: {
        dose: "10–15 min",
        goal: "Restore spine, shoulders, ribs, and low-back tone.",
        items: [
          { a: "Chest", tool: "Ball against wall", d: "60 sec / side", cue: "Broad chest work, especially if pressing and carrying left you tight." },
          { a: "Rib-side / upper side abs", tool: "Ball or roller", d: "45–60 sec / side", cue: "Side-rib area below the armpit. Breathe slowly into it." },
          { a: "Lats", tool: "Roller", d: "60 sec / side", cue: "Slow passes along the side-back line." },
          { a: "Low-back side wall", tool: "Ball, wall or floor", d: "45 sec / side", cue: "The muscular area between the bottom rib and the top of the pelvis. Gentle — don't jam the spine." },
          { a: "T-spine / upper back", tool: "Roller", d: "60–90 sec", cue: "Extend over the roller and breathe." },
          { a: "Glutes", tool: "Ball", d: "60 sec / side", cue: "Easy pressure, especially if the low back feels grippy." }
        ],
        note: "Restore after press and carry so Day 4 can rack and hinge. Chest, rib-side, T-spine — gentle, no excavation."
      },
      mob: [
        { nm: "Cat cow", why: "Spinal segmentation and downshift.", levels: ["Short range.", "Full range.", "Add a slight circle / rotation."] },
        { nm: "Jefferson curl", why: "Controlled spinal flexion. Stay conservative.", levels: ["Seated spinal rolls.", "Standing bodyweight.", "Light KB or DBs — skip on this recovery day."] },
        { nm: "Quadruped thoracic rotations", why: "T-spine rotation.", levels: ["Small range, hips still.", "Elbow to the ceiling.", "Light DB — skip on this recovery day."] },
        { nm: "Shoulder CARs", why: "Shoulder control.", levels: ["Standing, bodyweight.", "Light DB — skip if the shoulder is pinchy.", "Sidelying — skip if the shoulder is pinchy."] },
        { nm: "Shoulder dislocates", why: "Overhead range.", levels: ["Wide grip.", "Closer grip.", "Add a rotation."] },
        { nm: "Scapular pull-ups", why: "Scap control and decompression.", levels: ["Feet supported.", "Hang, no feet.", "Assisted single-arm — skip on this recovery day."] }
      ],
      lifts: [
        { id: "z2", nm: "Zone 2 walk, incline walk, or easy ruck", rx: "30–45 min", sets: 1, note: "Conversational pace." },
        { id: "breath", nm: "Breath downshift", rx: "3–5 min", sets: 1, note: "Long exhales." }
      ],
      exclusive: false,
      burn: null,
      down: "Nothing further. Stop while you still feel good."
    },
    {
      n: 4, heat: "hardest", tag: "Hardest", weekday: "Thursday",
      theme: "Ankles & Posterior Chain", sub: "Athletic full body",
      mobNote: "Elastaboy opener for the hinge and the front rack. Same drills. Own today's level before you climb.",
      tissue: {
        dose: "3–5 min",
        goal: "Prep the deadlift hinge, landing, and the push-press rack.",
        items: [
          { a: "Glute fold / high hamstring", for: "deadlift", tool: "Ball", d: "45 sec / side", cue: "Sit near the crease where glute meets hamstring. Controlled pressure, not aggressive digging." },
          { a: "Calves", for: "deadlift", tool: "Roller", d: "60 sec / side", cue: "Slow passes, especially the lower calf and soleus." },
          { a: "T-spine / lats", for: "push press", tool: "Roller", d: "60 sec", cue: "Upper back and lat line so the front rack and push-press can sit." },
          { a: "Hamstrings", for: "deadlift", optional: true, tool: "Roller", d: "45–60 sec / side", cue: "Roll the back of the thigh before hinging. Optional if the glute fold already opened the line." },
          { a: "Inner thighs", for: "deadlift", optional: true, tool: "Roller", d: "45 sec / side", cue: "Helps before adductor rock-backs and the athletic slot." }
        ],
        note: "Priority: glute fold/high hamstring, calves, then T-spine/lats for the push-press. Front thigh drops. Hamstrings and inner thigh are optional overflow."
      },
      prepPump: {
        dose: "2–4 min",
        goal: "Light hinge/ankle pump before mobility. RPE ≤6.",
        items: [
          { a: "Bodyweight hinge reach", tool: "Bodyweight", d: "8–10", cue: "Pattern only — not a loaded hinge before the deadlift." },
          { a: "Easy calf raises", tool: "Bodyweight", d: "10–12", cue: "Short dose; full calf ladder is in mobility." }
        ],
        note: "Skip on Amber/Red or any flag. No loaded KB deadlift and no pogo here."
      },
      mob: [
        { nm: "Bent-knee calf raisers", why: "Soleus and Achilles prep.", levels: ["Two-leg, shallow bend.", "Deeper bend.", "Single-leg on a ledge."] },
        { nm: "Knee-to-toe ankle rockers", why: "Dorsiflexion.", levels: ["Hands-guided, heel down.", "More knee travel.", "Light load on the knee."] },
        { nm: "Good mornings", why: "Hinge pattern.", levels: ["Bodyweight, hands on hips.", "Wide stance, hands on head.", "Single-leg. Dumbbells optional."] },
        { nm: "Adductor rock-backs", why: "Inner-thigh and hip control.", levels: ["One side, press the straight-leg foot down.", "Elevate the straight leg.", "Frog rock-backs."] },
        { nm: "Long split lunge", why: "Hip extension, unilateral control.", levels: ["Front foot elevated, hold for balance. Hamstring covers the calf.", "Lower the box, less hand support.", "Floor. Dumbbells only if the calf-cover standard is met."] }
      ],
      lifts: [
        { id: "dead", nm: "Deadlift", prog: true, note: "Heavy but clean. No grinders. Straight sets, never supersetted.", load: true, swapRed: "Swap for RDL or goblet work today." },
        {
          id: "elastic", nm: "Broad jump", job: "Elastic / land", rx: "3 × 3–5 jumps", sets: 3,
          note: "Crisp landings, not a max-out. Right after the deadlift. If Achilles is cranky, swap for step-overs or skip jumps.",
          byWeek: {
            1: { nm: "Broad jump", rx: "3 × 3–5 jumps", note: "A. Broad jump. Crisp landings, not a max-out. Right after the deadlift. If Achilles is cranky, swap for step-overs or skip jumps." },
            2: { nm: "Pogo bounds", rx: "3 × 8–10 pogos", note: "B. Pogo bounds. Quiet feet. Right after the deadlift. If Achilles is cranky, swap for step-overs or skip." },
            3: { nm: "Med-ball slam", rx: "3 × 8–10 slams", note: "C. Med-ball slam. Athletic, not a max. Right after the deadlift. If Achilles is cranky, swap for step-overs or skip." },
            4: { nm: "Broad jump", rx: "3 × 3–5 jumps", note: "A again. Broad jump. Crisp landings. Right after the deadlift. If Achilles is cranky, swap for step-overs or skip jumps." },
            5: { nm: "Broad jumps, pogo bounds, or box jump with step-down", rx: "3 × 3–5 jumps or 3 × 8–10 pogos or 3 × 3 box jumps, step down", note: "Owned choice. Stay on the elastic you already own. If you take the broad jump, measure the best of three from the heel. Body-height standard is 5'11\" (71 in); elite is 83 in (height + 12 in). Right after the deadlift. If Achilles is cranky, swap for step-overs or skip jumps." },
            6: { nm: "Easy low box jumps or skip", rx: "2 × 3 low box jumps, step down — or skip", note: "Easy box jumps or skip. Deload. Step down. No max landings." }
          }
        },
        { id: "pp", nm: "Push press", job: "Athletic overhead", cousins: ["DB push press", "KB push press", "Landmine push press"], rx: "4 × 4–6", sets: 4, pair: "2", slot: "A", note: "Athletic overhead power.", load: true },
        { id: "chin", nm: "Chin-ups", job: "Vertical pull", cousins: ["Neutral-grip pull-up", "Band-assisted chin-up", "Weighted chin-up"], rx: "4 × 5–8", sets: 4, pair: "2", slot: "B", note: "Clean reps. Add weight only if crisp.", load: true, bw: true },
        { id: "suit", nm: "Suitcase carry", job: "Anti-rotation carry", cousins: ["Single-arm KB carry", "Offset rack carry"], rx: "3 × 40 sec / side", sets: 3, note: "Anti-rotation and chassis work.", load: true }
      ],
      burn: {
        nm: "Light Squat + Horizontal Push", fmt: "10-minute AMRAP", hard: true, effort: "90–95%",
        items: ["Goblet squat × 8–10", "Push-ups × 10–12", "Burpees or bar step-overs × 5"],
        adj: "Moderate goblet, not a strength set. Squat pattern after a hinge day; horizontal push after vertical press. No hinge, overhead press, chin, suitcase, or lunges here.",
        patterns: ["squat", "push-h", "elastic"],
        byWeek: {
          1: {
            nm: "Light Squat + Horizontal Push", fmt: "10-minute AMRAP", effort: "90–95%",
            items: ["Goblet squat × 8–10", "Push-ups × 10–12", "Burpees or bar step-overs × 5"],
            adj: "Establish the couplet. 90–95%.",
            patterns: ["squat", "push-h", "elastic"]
          },
          2: {
            nm: "Goblet / Push-up / Step-over", fmt: "10-minute AMRAP", effort: "90–95%",
            items: ["Goblet squat × 8", "Push-ups × 10", "Bar step-overs × 6"],
            adj: "Same family. Step-overs if you want less sprawl. 90–95%.",
            patterns: ["squat", "push-h", "elastic"]
          },
          3: {
            nm: "Wall-Ball + Push + Step-Over", fmt: "10-minute AMRAP", effort: "90–95%",
            items: ["Wall-ball or goblet-to-target × 10", "Push-ups × 10–12", "Burpee step-overs × 5"],
            adj: "Alt B. Learn the cousin package. Not a benchmark.",
            patterns: ["squat", "push-h", "elastic"]
          },
          4: {
            nm: "Ground School", fmt: "40 sec work / 20 sec transition × 8", effort: "RPE 7 · crisp", zoneCue: false,
            items: [
              "Crab travel forward 4 steps, back 4 steps, hips high.",
              "Technical stand-ups, alternating sides.",
              "Ring push-ups with the rings 10–20 cm off the floor.",
              "KB chest-hug get-to-stand with a 35 lb bell: lie back until the shoulder blades touch the floor, then stand fully, however you like, with the bell glued to the chest."
            ],
            score: "Total get-to-stands across both passes (two passes of the four stations). Write it down — this is next week's test movement at submax.",
            scale: "Rings higher. Get-to-stand bodyweight only. Crab as a hip-lift hold. Wrists cranky: crab on fists or on DB handles.",
            fallback: "Achilles flag: no change. No impact on this card.",
            adj: "Ground & Grapple. Two passes of four stations. Crisp positions, not survival. No hinge, overhead, chin, suitcase, or lunge.",
            patterns: ["ground", "crawl", "push-h"]
          },
          5: {
            nm: "Ground-to-Stand Test", fmt: "6-minute AMRAP", benchmark: true, effort: "Test · max honest reps",
            items: [
              "35 lb KB chest-hug get-to-stand.",
              "Both shoulder blades touch the floor. Stand fully — hips and knees locked. Bell never leaves the chest."
            ],
            score: "Total reps in 6 minutes. This is the block's sole benchmark. Your Week 4 Ground School get-to-stand total is a rough expectation.",
            scale: "Bodyweight get-to-stands.",
            fallback: "Achilles flag: no change. No impact on this card.",
            adj: "Week 5 sole chaotic benchmark. Log reps honestly.",
            patterns: ["ground", "crawl"]
          },
          6: {
            nm: "Ground Flow", fmt: "7-min easy · no redline", effort: "RPE 5–6",
            items: [
              "7 minutes continuous and nasal, moving slowly through: crab reach (from crab, reach one arm overhead and lift the hips), lateral ape travel, technical stand-up, 2 slow ring push-ups, and repeat."
            ],
            adj: "Deload. No redline. Lateral ape travel is this week's easy preview.",
            patterns: ["ground", "crawl", "push-h"]
          }
        }
      },
      down: "2–5 min breathing or easy walk."
    },
    {
      n: 5, heat: "moderate", tag: "Moderate", weekday: "Friday",
      theme: "Full Body Light Reset", sub: "Chassis · durability · pump",
      restTitle: "Three controlled rounds — not for time · RPE 7",
      restTitleByWeek: { 6: "Three controlled rounds — not for time · easy walk · RPE 5–6" },
      mobNote: "Elastaboy opener for chassis. Stay on Level 1–2. Day 5 does not climb to Level 3.",
      tissue: {
        dose: "3–5 min",
        goal: "Chassis texture for goblet, floor press, row, and the Copenhagen.",
        items: [
          { a: "Front thighs", for: "goblet squat", forId: "goblet", tool: "Roller", d: "45–60 sec / side", cue: "Smooth passes so the goblet can sit." },
          { a: "Chest", for: "DB floor press", forId: "floor", tool: "Ball against wall", d: "60 sec / side", cue: "Broad chest work before pressing." },
          { a: "Lats / rib-side", for: "one-arm DB row", forId: "oarow", tool: "Ball or roller", d: "45–60 sec / side", cue: "Side-back and rib-side so the row can pull." },
          { a: "Inner thighs", for: "Copenhagen plank", forId: "copen", tool: "Roller", d: "45 sec / side", cue: "Gentle adductor pressure before the Copenhagen." },
          { a: "Glutes / side glutes", for: "goblet squat", forId: "goblet", optional: true, tool: "Ball", d: "60 sec / side", cue: "Work the big glute and the side-glute pocket. Optional overflow." },
          { a: "Calves", for: "wall-sit calf raises", forId: "wallcalf", optional: true, tool: "Roller", d: "45 sec / side", cue: "Light maintenance only." }
        ],
        note: "Priority: front thigh, chest, lats/rib-side, plus inner thigh for the Copenhagen. Outer quad drops. Texture, not excavation."
      },
      mob: [
        { nm: "Standing side bends", why: "Lateral spine.", levels: ["Fingertips toward the knees.", "Wide stance, hands on head.", "Feet together, dumbbell in one hand, no twist."] },
        { nm: "Cobra press-ups", why: "Spinal extension and chest opening.", levels: ["Forearm sphinx.", "Full hand lockout.", "Shins to the wall."] },
        { nm: "Prone scap W + reach", why: "Upper-back activation.", levels: ["On a bench.", "On the floor.", "Light dumbbells or plates."] },
        { nm: "Hammer grip wrist rockers", why: "Wrist prep.", levels: ["Seated, gentle.", "More range and pressure."] },
        { nm: "Laying neck controlled rotations", why: "Neck mobility.", levels: ["Head lift, look side to side.", "Slightly more range, or a light plate on the forehead."] },
        { nm: "Laying neck double chins", why: "Deep neck flexors.", levels: ["Floor chin tuck.", "Head off a bench plus a light plate."] }
      ],
      lifts: [
        {
          id: "goblet", nm: "Goblet squat", job: "Chassis squat", rx: "10–12", sets: 3, note: "Moderate load, smooth range.", load: true,
          byWeek: {
            3: { nm: "Front-foot elevated split squat", note: "W3 rotation — FFE split squat. Same chassis squat job." },
            5: { note: "Owned. Stay on the goblet you already own." },
            6: { note: "Owned and easy. Drop 30–40% if you take it." }
          }
        },
        {
          id: "floor", nm: "DB floor press or incline press", job: "Horizontal press", rx: "10–12", sets: 3, note: "Controlled reps.", load: true,
          byWeek: {
            4: { nm: "Incline press", note: "W4 rotation — incline press. Same press job." },
            5: { note: "Owned. Stay on the press you already own." },
            6: { note: "Owned and easy. Drop 30–40% if you take it." }
          }
        },
        {
          id: "oarow", nm: "One-arm DB row", job: "Horizontal pull", rx: "10–12 / side", sets: 3, note: "Pull the elbow toward the hip.", load: true,
          byWeek: {
            2: { nm: "Chest-supported row", note: "W2 rotation — chest-supported row. Same pull job." },
            5: { note: "Owned. Stay on the row you already own." },
            6: { note: "Owned and easy. Drop 30–40% if you take it." }
          }
        },
        { id: "wallcalf", nm: "Wall-sit calf raises", job: "Soleus / Achilles", rx: "2 × 15–20", sets: 2, note: "Soleus and Achilles capacity. Keep modest.", guard: "This is the only place extra calf work belongs — keep volume modest." },
        { id: "copen", nm: "Copenhagen plank or side plank", job: "Adductor / trunk", rx: "20–30 sec / side", sets: 3, note: "Trunk and adductors." },
        { id: "hang", nm: "Dead hang", job: "Grip / decompression", rx: "30–45 sec", sets: 3, note: "Grip and shoulder decompression." }
      ],
      burn: {
        optional: true,
        nm: "Aerobic Pump Closer",
        fmt: "8-min continuous · RPE ~7",
        effort: "RPE ~7",
        items: [
          "Nasal incline walk or easy bike — continuous",
          "OR light DB complex: goblet × 8 → DB floor/press × 8 → one-arm row × 8 × 2–3 rounds, nasal, unbroken"
        ],
        adj: "Optional aerobic pump — leave better, not cooked. Carry / Crawl / Swing is a green option in Weeks 1–4 only.",
        menu: [
          {
            id: "ccs",
            label: "Carry / Crawl / Swing",
            weeks: [1, 2, 3],
            nm: "Carry / Crawl / Swing",
            fmt: "Every 2 min for 10 min — 5 rounds",
            items: ["Farmer carry or march — 40 sec", "Kettlebell swings × 12", "Bear crawl × 20 steps", "Rest the remainder"],
            adj: "Green-day option only. Skip if the week already cooked you."
          }
        ],
        byWeek: {
          1: {
            nm: "Aerobic Pump Closer", fmt: "8-min continuous · RPE ~7", effort: "RPE ~7",
            items: [
              "Nasal incline walk or easy bike — continuous",
              "OR light DB complex: goblet × 8 → DB floor/press × 8 → one-arm row × 8 × 2–3 rounds, nasal, unbroken"
            ],
            adj: "Establish the aerobic pump. Carry / Crawl / Swing is a green option only."
          },
          2: {
            nm: "Aerobic Pump Closer", fmt: "8-min continuous · RPE ~7", effort: "RPE ~7",
            items: [
              "Nasal incline walk or easy bike — continuous",
              "OR light DB complex: goblet × 8 → DB floor/press × 8 → one-arm row × 8 × 2–3 rounds, nasal, unbroken"
            ],
            adj: "Aerobic pump. Carry / Crawl / Swing remains a green option."
          },
          3: {
            nm: "Aerobic Pump Closer", fmt: "8-min continuous · RPE ~7", effort: "RPE ~7",
            items: [
              "Nasal incline walk or easy bike — continuous",
              "OR light DB complex: goblet × 8 → DB floor/press × 8 → one-arm row × 8 × 2–3 rounds, nasal, unbroken"
            ],
            adj: "Aerobic pump. Carry / Crawl / Swing remains a green option."
          },
          4: {
            nm: "Carry Walk Medley", fmt: "8-min continuous · RPE 6–7", effort: "RPE 6–7",
            items: [
              "8 minutes continuous at RPE 6–7, nasal breathing only.",
              "30 m carrying the 80 lb KB goblet / bear-hug style.",
              "20 m per side carrying one 35 lb KB overhead.",
              "30 m walking backward, then repeat."
            ],
            scale: "35 lb goblet instead of the 80. Rack position instead of overhead. Skip if the week cooked you.",
            fallback: "Cooked Friday: easy nasal incline walk. Do not add a second engine day. If the floor or driveway lets a plate slide, the backward leg can be a towel plate drag.",
            adj: "Carry Walk. Optional loaded locomotion. Skip if the week cooked you."
          },
          5: {
            nm: "Soft Walk", fmt: "8-min easy · RPE ~6", effort: "RPE ~6",
            items: [
              "8 minutes alternating 60 seconds backward walk and 60 seconds easy forward nasal walk.",
              "No loaded carries. Wheels stay on Monday."
            ],
            adj: "Peak week. Soft only. Protect the weekend and Monday. No Carry / Crawl / Swing."
          },
          6: {
            nm: "Walk or skip", fmt: "Easy walk · or skip", effort: "RPE 5–6",
            items: ["Nasal walk", "Or skip"],
            adj: "Deload. Walk or skip. No redline. No Carry / Crawl / Swing."
          }
        }
      },
      down: "2–5 min breathing or easy walk."
    },
    {
      n: 6, heat: "easy", tag: "Easy", weekday: "Saturday",
      theme: "Follow-Me Flow", sub: "Walk · tissue · breath",
      restTitle: "Pick one",
      exclusive: true,
      mobNote: "Follow-me flow. Level 1 default. Level 2 if owned. No Level 3.",
      tissue: {
        dose: "10–15 min",
        goal: "Low-intensity restoration.",
        items: [
          { a: "Low-back side wall", tool: "Ball against wall", d: "45 sec / side", cue: "Gentle pressure between the ribs and the pelvis." },
          { a: "Glutes", tool: "Ball", d: "60 sec / side", cue: "Easy, restorative pressure." },
          { a: "Rib-side / upper side abs", tool: "Roller or ball", d: "45 sec / side", cue: "Breathe slowly into the side ribs." },
          { a: "Chest", tool: "Ball", d: "45–60 sec / side", cue: "Light opening, not aggressive." },
          { a: "Calves or feet", tool: "Roller or ball", d: "60 sec / side", cue: "Optional if walking volume has been high." }
        ],
        note: "Restorative pressure after the week — low-back side wall, glutes, rib-side. Easy only. Makes next Monday possible."
      },
      mob: [
        "Cat cow — spine reset",
        "90/90 hip switches — hip rotation",
        "Kneeling toe sits — feet, ankles, knees",
        "Seated wall shoulder internal/external rotation",
        "Laying knee-tucked windmills — lumbar and trunk rotation"
      ],
      lifts: [
        { id: "f1", nm: "Flow only", rx: "3 rounds × 60 sec", sets: 1, note: "Five drills. About 15 minutes. When you need true recovery." },
        { id: "f2", nm: "Flow + easy walk", rx: "30–60 min", sets: 1, note: "Best default. Flow is 3 rounds × 60 sec, then walk." },
        { id: "f3", nm: "Flow + tissue work", rx: "10 min", sets: 1, note: "If stiff from the week." },
        { id: "f4", nm: "Flow + breathwork", rx: "3–5 min", sets: 1, note: "If stressed or under-recovered." }
      ],
      burn: null,
      down: "No strength. No burnout."
    },
    {
      n: 7, heat: "off", tag: "Off", weekday: "Sunday",
      theme: "Rest", sub: "Protect the next block",
      restTitle: "Options",
      exclusive: true,
      tissue: null,
      mob: [],
      lifts: [
        { id: "r1", nm: "Full rest", rx: "—", sets: 1, note: "Best if the week was hard." },
        { id: "r2", nm: "Easy mobility", rx: "—", sets: 1, note: "Fine if you feel stiff." },
        { id: "r3", nm: "Walk with family", rx: "—", sets: 1, note: "Great if genuinely easy." }
      ],
      guardTop: "No quick lift. Protect the next block of training.",
      burn: null,
      down: null
    }
  ]
};
