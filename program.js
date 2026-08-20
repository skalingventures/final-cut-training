/* Final Cut — Block 01 program data. Source of truth for the six-week block. */
window.PROGRAM = {
  title: "Block 01",
  subtitle: "Strength, Mobility, Burnouts",
  identity: "Strong, mobile, athletic, durable, hard to break.",
  principle: "Mobility opens the pattern. Strength loads the pattern. Burnouts stress the system. Recovery lets the adaptation happen.",
  calendar: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

  weeks: [
    { n: 1, main: "4 × 6", rpe: "RPE 7", acc: "Accessories moderate", burn: "80%", intent: "Establish", heat: "easy" },
    { n: 2, main: "4 × 6", rpe: "slightly heavier than wk 1", acc: "Add reps where clean", burn: "85%", intent: "Build", heat: "moderate" },
    { n: 3, main: "5 × 5", rpe: "RPE 8", acc: "Accessories stable", burn: "90%", intent: "Build hard", heat: "hard" },
    { n: 4, main: "5 × 4", rpe: "RPE 8–8.5", acc: "Accessories slightly reduced", burn: "85–90%", intent: "Intensify", heat: "hard" },
    { n: 5, main: "5 × 3", rpe: "RPE 8.5–9", acc: "Minimal fluff", burn: "1–2 benchmark efforts", intent: "Peak", heat: "hardest" },
    { n: 6, main: "3 × 5", rpe: "RPE 6–7", acc: "Reduce accessories 30–40%", burn: "60–70%", intent: "Deload", heat: "easy" }
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
      theme: "Ankles & Knees", sub: "Lower strength + pull",
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
        note: "Don't try to destroy the IT band. Work the surrounding outer quad, hip, and glute instead."
      },
      mob: [
        "Knee-to-toe ankle rockers — dorsiflexion, knee-over-toe comfort",
        "Straight-leg calf raisers — gastroc and Achilles",
        "Bent-knee calf raisers — soleus capacity",
        "Tib raisers — ankle balance",
        "Slant-board squats — knee confidence, squat tolerance"
      ],
      lifts: [
        { id: "squat", nm: "Back squat or front squat", prog: true, note: "Main lower-body strength lift.", load: true },
        { id: "pullup", nm: "Weighted or strict pull-ups", rx: "4 × 4–8", sets: 4, note: "Add weight once 8 strict reps are easy.", load: true, bw: true },
        { id: "rdl", nm: "Romanian deadlift", rx: "3 × 6–8", sets: 3, note: "Posterior-chain support, not max hinge work.", load: true },
        { id: "peterson", nm: "Peterson step-ups", rx: "2–3 × 6–8 / side", sets: 3, note: "Controlled knee-over-toe work.", guard: "Mobility already covers knee-over-toe with slant-board squats — keep this volume low." },
        { id: "hkr", nm: "Hanging knee raises", rx: "3 × 8–12", sets: 3, note: "Strict trunk and grip." }
      ],
      burn: {
        nm: "Hinge + Pull Engine", fmt: "10-minute AMRAP", hard: true,
        items: ["Kettlebell swings × 15", "Push-ups × 12", "Goblet squats × 10", "Pull-ups × 3–4"],
        adj: "If knees feel heavily worked, swap goblet squats for 40 sec farmer carry or march.",
        achilles: "If Achilles is cranky, keep swings and carries. Swap goblet squats for a farmer march."
      },
      down: "2–5 min breathing or easy walk."
    },
    {
      n: 2, heat: "hard", tag: "Hard", weekday: "Tuesday",
      theme: "Hips & Glutes", sub: "Upper strength + carries",
      tissue: {
        dose: "3–5 min",
        goal: "Open hips, improve bracing, prep shoulders and chest for pressing and carries.",
        items: [
          { a: "Glutes / side glutes", tool: "Hard medicine ball", d: "60 sec / side", cue: "Work the meaty back pocket and slightly toward the side hip." },
          { a: "Hip crease / front of hip", tool: "Ball or roller", d: "45 sec / side", cue: "Gentle pressure near the front pocket, not directly on sensitive structures." },
          { a: "Chest", tool: "Hard ball against wall", d: "60 sec / side", cue: "Work across the broad chest from the sternum side toward the shoulder." },
          { a: "Rib-side / under armpit", tool: "Ball or roller", d: "45–60 sec / side", cue: "Just below the armpit and along the side ribs — helps overhead position and breathing." },
          { a: "Lats / side back", tool: "Roller", d: "60 sec / side", cue: "Roll from the armpit down the side of the back." }
        ]
      },
      mob: [
        "90/90 hip switches — hip rotation",
        "Hip CARs — active hip control",
        "Hip flexor lunge pulses — hip extension",
        "Glute bridge reps — glute activation",
        "Lateral band walks — side-glute stability"
      ],
      lifts: [
        { id: "bench", nm: "Bench press or weighted dips", prog: true, note: "Bench for raw strength, dips for athletic carryover.", load: true },
        { id: "row", nm: "Barbell row or chest-supported DB row", rx: "4 × 6–10", sets: 4, note: "Heavy, controlled pull.", load: true },
        { id: "ohp", nm: "Standing DB overhead press", rx: "3 × 6–8", sets: 3, note: "Strict reps, ribs down, glutes lightly engaged.", load: true },
        { id: "dips", nm: "Weighted dips or close-grip push-ups", rx: "3 × 8–12", sets: 3, note: "Secondary push. Skip dips if shoulders feel pinchy.", swapPinch: "Skip dips. Use push-ups or DB press and add scap work." },
        { id: "farmer", nm: "Farmer carry", rx: "4 × 40–60 sec", sets: 4, note: "Heavy, tall, braced. Make this a feature.", load: true }
      ],
      burn: {
        nm: "DB Fight Gone Mini", fmt: "40 sec work / 20 sec transition × 10 min", hard: true,
        items: ["1 · DB thrusters", "2 · Renegade rows or plank DB drag", "3 · Burpees or sprawls", "4 · Farmer march", "5 · Easy walk, nasal breathing", "6–10 · Repeat the sequence"],
        adj: "Load lighter than ego wants. Fast, clean, athletic.",
        achilles: "If Achilles is cranky, swap burpees/sprawls for farmer march or swings."
      },
      down: "2–5 min breathing or easy walk."
    },
    {
      n: 3, heat: "easy", tag: "Easy", weekday: "Wednesday",
      theme: "Spine & Shoulders", sub: "Recovery · Zone 2 · tissue",
      restTitle: "Recovery session",
      guardTop: "No heavy upper body today — the mobility block already loads the shoulders and scaps. This day exists to make Day 4 better.",
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
        "Cat cow — segmentation and nervous-system downshift",
        "Jefferson curl — controlled spinal flexion, stay conservative",
        "Quadruped thoracic rotations — T-spine rotation",
        "Shoulder CARs — shoulder control",
        "Shoulder dislocates — overhead range",
        "Scapular pull-ups — scap control and decompression"
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
      tissue: {
        dose: "3–5 min",
        goal: "Prep the hinge, deadlift, lunges, and athletic barbell work.",
        items: [
          { a: "Calves", tool: "Roller", d: "60 sec / side", cue: "Slow passes, especially the lower calf and soleus." },
          { a: "Glute fold / high hamstring", tool: "Ball", d: "45 sec / side", cue: "Sit near the crease where glute meets hamstring. Controlled pressure, not aggressive digging." },
          { a: "Hamstrings", tool: "Roller", d: "45–60 sec / side", cue: "Roll the back of the thigh before hinging." },
          { a: "Inner thighs", tool: "Roller", d: "45 sec / side", cue: "Helps before adductor rock-backs and lunges." },
          { a: "Front thigh / hip-flexor quad", tool: "Roller", d: "45 sec / side", cue: "Keep it moderate — enough to open the front of the hip." },
          { a: "T-spine / upper back", tool: "Roller", d: "60 sec", cue: "Helps the front rack, push press, and clean position." }
        ]
      },
      mob: [
        "Bent-knee calf raisers — soleus and Achilles prep",
        "Knee-to-toe ankle rockers — dorsiflexion",
        "Good mornings — hinge pattern",
        "Adductor rock-backs — adductor and hip control",
        "Long split lunge — hip extension, unilateral control"
      ],
      lifts: [
        { id: "dead", nm: "Deadlift", prog: true, note: "Heavy but clean. No grinders.", load: true, swapRed: "Swap for RDL or goblet work today." },
        { id: "pp", nm: "Push press", rx: "4 × 4–6", sets: 4, note: "Athletic overhead power.", load: true },
        { id: "chin", nm: "Chin-ups", rx: "4 × 5–8", sets: 4, note: "Add weight if strong.", load: true, bw: true },
        { id: "lunge", nm: "DB walking or front-rack reverse lunges", rx: "2–3 × 6–8 / side", sets: 3, guard: "Mobility already includes long split lunges — keep this reduced." },
        { id: "suit", nm: "Suitcase carry", rx: "3 × 40 sec / side", sets: 3, note: "Anti-rotation and chassis work.", load: true }
      ],
      burn: {
        nm: "Barbell + Burpee Couplet", fmt: "10-minute AMRAP", hard: true,
        items: ["Deadlift × 6", "Hang power clean × 6", "Push press × 6", "Burpees over bar × 6"],
        adj: "Usually 75–115 lb. This is conditioning with a barbell, not a second strength workout.",
        achilles: "If Achilles is cranky, drop burpees for farmer march or swings."
      },
      down: "2–5 min breathing or easy walk."
    },
    {
      n: 5, heat: "moderate", tag: "Moderate", weekday: "Friday",
      theme: "Full Body Light Reset", sub: "Chassis · durability · pump",
      restTitle: "Three controlled rounds — not for time",
      tissue: {
        dose: "3–5 min",
        goal: "Posture, tissue quality, joint-friendly durability.",
        items: [
          { a: "Front thighs", tool: "Roller", d: "45–60 sec / side", cue: "Smooth passes, especially if squats and lunges have accumulated." },
          { a: "Outer thigh / outer quad", tool: "Roller", d: "30–45 sec / side", cue: "Moderate pressure only. This should feel useful, not brutal." },
          { a: "Glutes / side glutes", tool: "Ball", d: "60 sec / side", cue: "Work the big glute and the side-glute pocket." },
          { a: "Chest", tool: "Ball against wall", d: "60 sec / side", cue: "Broad chest work before pressing." },
          { a: "Rib-side / serratus", tool: "Ball or roller", d: "45 sec / side", cue: "Just under the armpit and along the side ribs." },
          { a: "Calves", tool: "Roller", d: "45 sec / side", cue: "Light maintenance only." }
        ]
      },
      mob: [
        "Standing side bends — lateral spine",
        "Cobra press-ups — extension and chest opening",
        "Prone scap W + reach — upper-back activation",
        "Hammer grip wrist rockers — wrist prep",
        "Laying neck controlled rotations — neck mobility",
        "Laying neck double chins — deep neck flexors"
      ],
      lifts: [
        { id: "goblet", nm: "Goblet squat", rx: "10–12", sets: 3, note: "Moderate load, smooth range.", load: true },
        { id: "floor", nm: "DB floor press or incline press", rx: "10–12", sets: 3, note: "Controlled reps.", load: true },
        { id: "oarow", nm: "One-arm DB row", rx: "10–12 / side", sets: 3, note: "Pull the elbow toward the hip.", load: true },
        { id: "wallcalf", nm: "Wall-sit calf raises", rx: "2 × 15–20", sets: 2, note: "Soleus and Achilles capacity.", guard: "This is the only place extra calf work belongs — keep volume modest." },
        { id: "copen", nm: "Copenhagen or side plank", rx: "20–30 sec / side", sets: 3, note: "Trunk and adductors." },
        { id: "hang", nm: "Dead hang", rx: "30–45 sec", sets: 3, note: "Grip and shoulder decompression." }
      ],
      burn: {
        optional: true, nm: "Carry, Crawl, Swing", fmt: "Every 2 min for 10 min — 5 rounds",
        items: ["Farmer carry or march — 40 sec", "Kettlebell swings × 12–15", "Bear crawl × 20 steps", "Rest the remainder"],
        adj: "Optional. If fatigue has accumulated, replace it with a 10-minute easy incline walk or loaded carry."
      },
      down: "2–5 min breathing or easy walk."
    },
    {
      n: 6, heat: "easy", tag: "Easy", weekday: "Saturday",
      theme: "Follow-Me Flow", sub: "Walk · tissue · breath",
      restTitle: "Pick one",
      exclusive: true,
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
        { id: "f1", nm: "Flow only", rx: "5–15 min", sets: 1, note: "When you need true recovery." },
        { id: "f2", nm: "Flow + easy walk", rx: "30–60 min", sets: 1, note: "Best default." },
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
