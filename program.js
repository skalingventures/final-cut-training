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
      mobNote: "Elastaboy ladder. Start at Level 1. Earn Level 2, then Level 3 only when today's level is clean. Do not skip.",
      tissue: {
        dose: "3–5 min",
        goal: "Prep squatting, knee travel, ankle range.",
        items: [
          { a: "Calves", tool: "Roller", d: "60 sec / side", cue: "Roll from the Achilles up toward the back of the knee. Pause on dense spots." },
          { a: "Front thigh / hip-flexor quad", tool: "Roller or ball", d: "45–60 sec / side", cue: "Work the upper front thigh, especially where the quad meets the hip." },
          { a: "Outer thigh / outer quad", tool: "Roller", d: "30–45 sec / side", cue: "Moderate pressure along the outside of the thigh. Don't smash the side of the knee." },
          { a: "Glutes", tool: "Hard medicine ball", d: "60 sec / side", cue: "Sit on the ball and search the big glute and side-glute pocket." },
          { a: "Inner thighs", tool: "Roller", d: "45 sec / side", cue: "Gentle pressure before squats and Petersons." }
        ],
        note: "Priority order for squat day: calves and front thigh first, then outer quad and glute. Skip the last item if time is short. Don't smash the IT band — work outer quad, hip, and glute instead."
      },
      prepPump: {
        dose: "4–6 min",
        goal: "Prime squat and knee-over-toe without stealing the main.",
        items: [
          { a: "Goblet squat pulse", tool: "Light KB", d: "2 × 8", cue: "Heels down, knees track, no bounce." },
          { a: "Split-stance lean", d: "6 / side", cue: "Front knee over the toe, heel stays." }
        ],
        note: "Warm the pattern. This is not a working set."
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
        { id: "pullup", nm: "Pull-ups or weighted pull-ups", job: "Vertical pull", cousins: ["Chin-up", "Lat pulldown", "Band-assisted pull-up"], rx: "4 × 4–8", sets: 4, pair: "2", slot: "A", note: "Upper pull. Pick a cousin you can own for 4–8 clean reps. Add weight if 8 strict are easy.", load: true, bw: true },
        { id: "peterson", nm: "Peterson step-ups", job: "Knee-over-toe", cousins: ["Heels-elevated goblet squat", "Slant-board step-down"], rx: "2–3 × 6–8 / side", sets: 3, pair: "2", slot: "B", note: "Controlled knee-over-toe strength. Low volume — mobility already covers slant-board squats." },
        { id: "rdl", nm: "Romanian deadlift", job: "Hinge accessory", cousins: ["DB RDL", "Good morning", "Single-leg RDL"], rx: "3 × 6–8", sets: 3, note: "Separate from the squat — not a superset. Use straps if grip would fail first.", load: true }
      ],
      burn: {
        nm: "Push / Crawl / March", fmt: "10-minute AMRAP", hard: true,
        items: ["Push-ups × 8–12", "Bear crawl × 8–10 steps", "March or easy cyclical × 40 sec"],
        adj: "No squat, hang-pull, swing, or max farmer on squat day. Push, crawl, march.",
        achilles: "If Achilles is cranky, keep the march easy and shorten the crawl. Push-ups stay.",
        byWeek: {
          2: { nm: "Ascending Push-Crawl Ladder", fmt: "10-minute ascending ladder", items: ["1 push-up + 2 crawl steps", "2 + 4, 3 + 6 — climb", "March 40 sec between rungs if you need it"], adj: "Ladder novelty. Same family, different clock." },
          3: { nm: "Slam / Crawl / Bike", fmt: "10-minute AMRAP", items: ["Med-ball slam × 8", "Bear crawl × 8 steps", "Easy bike or march × 40 sec"], adj: "Build-hard week. Slams stay athletic, not a max." },
          4: { nm: "Push / Crawl / March", fmt: "10-minute AMRAP", items: ["Push-ups × 8–10", "Bear crawl × 6–8 steps", "March × 40 sec"], adj: "Slightly reduced. Keep the quality." },
          5: { nm: "Owned Push-Crawl", fmt: "10-minute AMRAP", items: ["Push-ups × 8–10", "Bear crawl × 6–8 steps", "March × 40 sec"], adj: "Owned only. Not the chaotic expression — that is Day 4 this week." },
          6: { nm: "Easy Push-March", fmt: "8-minute easy", items: ["Push-ups × 6–8", "Easy march or bike × 45 sec"], adj: "Deload. 60–70%. Leave some in the tank." }
        }
      },
      down: "2–5 min breathing or easy walk."
    },
    {
      n: 2, heat: "hard", tag: "Hard", weekday: "Tuesday",
      theme: "Hips & Glutes", sub: "Upper strength + carries",
      mobNote: "Elastaboy ladder. Start at Level 1. Earn Level 2, then Level 3 only when today's level is clean. Do not skip.",
      tissue: {
        dose: "3–5 min",
        goal: "Open hips, improve bracing, prep shoulders and chest for pressing and carries.",
        items: [
          { a: "Glutes / side glutes", tool: "Hard medicine ball", d: "60 sec / side", cue: "Work the meaty back pocket and slightly toward the side hip." },
          { a: "Hip crease / front of hip", tool: "Ball or roller", d: "45 sec / side", cue: "Gentle pressure near the front pocket, not directly on sensitive structures." },
          { a: "Chest", tool: "Hard ball against wall", d: "60 sec / side", cue: "Work across the broad chest from the sternum side toward the shoulder." },
          { a: "Rib-side / under armpit", tool: "Ball or roller", d: "45–60 sec / side", cue: "Just below the armpit and along the side ribs — helps overhead position and breathing." },
          { a: "Lats / side back", tool: "Roller", d: "60 sec / side", cue: "Roll from the armpit down the side of the back." }
        ],
        note: "Priority order for press day: glutes and hip crease first, then chest and rib-side. Skip the last item if time is short."
      },
      prepPump: {
        dose: "4–6 min",
        goal: "Brace and groove the press without a second press session.",
        items: [
          { a: "Dead-bug brace", d: "2 × 6 / side", cue: "Ribs down, exhale, then reach." },
          { a: "Scap push-up", d: "2 × 8", cue: "Lock the elbows. Move the shoulder blades only." }
        ],
        note: "Warm the press. This is not a working set."
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
        nm: "Swing / Crawl / Sprawl", fmt: "40 sec work / 20 sec transition × 10 min", hard: true,
        items: [
          "1 · Kettlebell swings",
          "2 · Bear crawl or plank shoulder taps",
          "3 · Burpees or sprawls",
          "4 · Air squats or step-overs",
          "5 · Easy walk, nasal breathing",
          "6 · Kettlebell swings",
          "7 · Bear crawl or plank shoulder taps",
          "8 · Burpees or sprawls",
          "9 · Air squats or step-overs",
          "10 · Easy walk, nasal breathing"
        ],
        adj: "Dense upper + carry day. Hinge / crawl / cyclical — not a second press or farmer.",
        achilles: "If Achilles is cranky, swap burpees for extra walk or step-overs. Keep air squats.",
        byWeek: {
          2: { nm: "Swing-Crawl Ladder", fmt: "10-minute ascending ladder", items: ["KB swings × 8", "Bear crawl × 6 steps", "Add 2 swings and 2 steps each rung", "Nasal walk 20 sec if you need it"], adj: "Ladder novelty on the same family. Still no press or farmer." },
          4: { nm: "Swing / Crawl / Sprawl", fmt: "40 sec work / 20 sec transition × 8 min", items: ["1 · Kettlebell swings", "2 · Bear crawl or plank shoulder taps", "3 · Burpees or sprawls", "4 · Air squats or step-overs", "5 · Easy walk, nasal breathing", "6 · Kettlebell swings", "7 · Bear crawl", "8 · Easy walk"], adj: "Slightly reduced clock. Keep the quality." },
          5: { nm: "Owned Swing-Crawl", fmt: "40 sec work / 20 sec transition × 10 min", items: ["1 · Kettlebell swings", "2 · Bear crawl", "3 · Step-overs or sprawls", "4 · Air squats", "5 · Easy walk", "6 · Kettlebell swings", "7 · Bear crawl", "8 · Step-overs", "9 · Air squats", "10 · Easy walk"], adj: "Owned only. Not the chaotic expression — that is Day 4 this week." },
          6: { nm: "Easy Swing-Walk", fmt: "8-minute easy 40/20", items: ["1 · Easy KB swings", "2 · Plank shoulder taps", "3 · Step-overs", "4 · Easy walk", "5 · Easy walk", "6 · Easy KB swings", "7 · Easy walk", "8 · Easy walk"], adj: "Deload. 60–70%. Nasal if you can." }
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
        ]
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
      mobNote: "Elastaboy ladder. Start at Level 1. Earn Level 2, then Level 3 only when today's level is clean. Do not skip.",
      tissue: {
        dose: "3–5 min",
        goal: "Prep the hinge, deadlift, and a small athletic landing dose.",
        items: [
          { a: "Calves", tool: "Roller", d: "60 sec / side", cue: "Slow passes, especially the lower calf and soleus." },
          { a: "Glute fold / high hamstring", tool: "Ball", d: "45 sec / side", cue: "Sit near the crease where glute meets hamstring. Controlled pressure, not aggressive digging." },
          { a: "Hamstrings", tool: "Roller", d: "45–60 sec / side", cue: "Roll the back of the thigh before hinging." },
          { a: "Inner thighs", tool: "Roller", d: "45 sec / side", cue: "Helps before adductor rock-backs and the athletic slot." },
          { a: "Front thigh / hip-flexor quad", tool: "Roller", d: "45 sec / side", cue: "Keep it moderate — enough to open the front of the hip." },
          { a: "T-spine / upper back", tool: "Roller", d: "60 sec", cue: "Helps the front rack and push-press position." }
        ],
        note: "Priority for hinge and land: calves and glute-fold first, then hamstrings. T-spine last if time is short."
      },
      prepPump: {
        dose: "4–6 min",
        goal: "Groove the hinge and a light landing before the deadlift.",
        items: [
          { a: "KB deadlift groove", tool: "Light KB", d: "2 × 5", cue: "Wedge, brace, stand tall. Not a set." },
          { a: "Pogo or step-over", d: "2 × 6", cue: "Quiet feet. Skip jumps if Achilles is cranky." }
        ],
        note: "Prime the hinge and land. Save the jump dose for after the deadlift."
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
        { id: "elastic", nm: "Broad jumps, pogo bounds, or med-ball slam", job: "Elastic / land", rx: "3 × 3–5 jumps or 3 × 8–10 pogos", sets: 3, note: "Crisp landings, not a max-out. Right after the deadlift. If Achilles is cranky, swap for step-overs or skip jumps." },
        { id: "pp", nm: "Push press", job: "Athletic overhead", rx: "4 × 4–6", sets: 4, pair: "2", slot: "A", note: "Athletic overhead power.", load: true },
        { id: "chin", nm: "Chin-ups", job: "Vertical pull", rx: "4 × 5–8", sets: 4, pair: "2", slot: "B", note: "Clean reps. Add weight only if crisp.", load: true, bw: true },
        { id: "suit", nm: "Suitcase carry", job: "Anti-rotation carry", rx: "3 × 40 sec / side", sets: 3, note: "Anti-rotation and chassis work.", load: true }
      ],
      burn: {
        nm: "Light Squat + Horizontal Push", fmt: "10-minute AMRAP", hard: true,
        items: ["Goblet squat × 8–10", "Push-ups × 10–12", "Burpees or bar step-overs × 5"],
        adj: "Moderate goblet, not a strength set. Squat pattern after a hinge day; horizontal push after vertical press. No hinge, overhead press, chin, or suitcase here.",
        achilles: "If Achilles is cranky, drop burpees for step-overs or a short march.",
        byWeek: {
          2: { nm: "Goblet / Push-up / Step-over", fmt: "10-minute AMRAP", items: ["Goblet squat × 8", "Push-ups × 10", "Bar step-overs × 6"], adj: "Same family. Step-overs if you want less sprawl." },
          4: { nm: "Light Squat + Horizontal Push", fmt: "10-minute AMRAP", items: ["Goblet squat × 8", "Push-ups × 8–10", "Burpees or bar step-overs × 4"], adj: "Slightly reduced. Keep landings quiet." },
          5: { nm: "Chaotic Light Squat Couplet", fmt: "10-minute AMRAP", benchmark: true, items: ["Goblet squat × 10", "Push-ups × 10–12", "Burpees over bar × 5"], adj: "Week 5 sole chaotic benchmark. Log rounds honestly." },
          6: { nm: "Easy Goblet + Push-up", fmt: "8-minute easy", items: ["Goblet squat × 6–8", "Push-ups × 6–8", "Step-overs × 4"], adj: "Deload. 60–70%. No redline." }
        }
      },
      down: "2–5 min breathing or easy walk."
    },
    {
      n: 5, heat: "moderate", tag: "Moderate", weekday: "Friday",
      theme: "Full Body Light Reset", sub: "Chassis · durability · pump",
      restTitle: "Three controlled rounds — not for time · RPE 7",
      mobNote: "Elastaboy ladder. Chassis day. Start at Level 1; Level 3 only if you already own it.",
      tissue: {
        dose: "3–5 min",
        goal: "Posture, tissue quality, joint-friendly durability.",
        items: [
          { a: "Front thighs", tool: "Roller", d: "45–60 sec / side", cue: "Smooth passes, especially if squats and the athletic slot have accumulated." },
          { a: "Outer thigh / outer quad", tool: "Roller", d: "30–45 sec / side", cue: "Moderate pressure only. This should feel useful, not brutal." },
          { a: "Glutes / side glutes", tool: "Ball", d: "60 sec / side", cue: "Work the big glute and the side-glute pocket." },
          { a: "Chest", tool: "Ball against wall", d: "60 sec / side", cue: "Broad chest work before pressing." },
          { a: "Rib-side / serratus", tool: "Ball or roller", d: "45 sec / side", cue: "Just under the armpit and along the side ribs." },
          { a: "Calves", tool: "Roller", d: "45 sec / side", cue: "Light maintenance only." }
        ]
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
        { id: "goblet", nm: "Goblet squat", rx: "10–12", sets: 3, note: "Moderate load, smooth range.", load: true },
        { id: "floor", nm: "DB floor press or incline press", rx: "10–12", sets: 3, note: "Controlled reps.", load: true },
        { id: "oarow", nm: "One-arm DB row", rx: "10–12 / side", sets: 3, note: "Pull the elbow toward the hip.", load: true },
        { id: "wallcalf", nm: "Wall-sit calf raises", rx: "2 × 15–20", sets: 2, note: "Soleus and Achilles capacity. Keep modest.", guard: "This is the only place extra calf work belongs — keep volume modest." },
        { id: "copen", nm: "Copenhagen plank or side plank", rx: "20–30 sec / side", sets: 3, note: "Trunk and adductors." },
        { id: "hang", nm: "Dead hang", rx: "30–45 sec", sets: 3, note: "Grip and shoulder decompression." }
      ],
      burn: {
        optional: true,
        nm: "Aerobic pump",
        fmt: "10-minute easy cyclical",
        items: [
          "Bike, row, or incline walk — nasal, conversational",
          "Stay about RPE 7",
          "Stand up if you need; do not chase heart rate"
        ],
        adj: "Day 5 should leave you better, not depleted. Default is an aerobic pump. Old CCS is a green-day alt only.",
        menu: [
          {
            id: "ccs",
            label: "Carry / Crawl / Swing (green alt)",
            nm: "Carry / Crawl / Swing",
            fmt: "Every 2 min for 10 min — 5 rounds",
            items: ["Farmer carry or march — 40 sec", "Kettlebell swings × 12", "Bear crawl × 20 steps", "Rest the remainder"],
            adj: "Green-day alt only. Skip if the week already cooked you."
          }
        ]
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
        ]
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
