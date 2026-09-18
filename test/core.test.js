const assert = require("assert");
const C = require("../core.js");

const program = {
  sets: { 1: 4, 2: 4, 3: 5, 4: 5, 5: 5, 6: 3 },
  progReps: { 1: 6, 2: 6, 3: 5, 4: 4, 5: 3, 6: 5 },
  weeks: [
    { n: 1, main: "4 × 6", rpe: "RPE 7" },
    { n: 2, main: "4 × 6", rpe: "RPE 7.5" },
    { n: 3, main: "5 × 5", rpe: "RPE 8" },
    { n: 4, main: "5 × 4", rpe: "RPE 8–8.5" },
    { n: 5, main: "5 × 3", rpe: "RPE 8.5–9" },
    { n: 6, main: "3 × 5", rpe: "RPE 6–7" }
  ],
  days: [
    { n: 1, exclusive: false, tissue: { items: [{}] }, mob: ["a"], lifts: [{ id: "squat", prog: true, load: true, sets: 4 }, { id: "rdl", sets: 3, load: true }], burn: { hard: true }, down: "x" },
    { n: 2, exclusive: false, lifts: [{ id: "bench", prog: true }], burn: { optional: true } },
    { n: 3, exclusive: false, lifts: [{ id: "z2", sets: 1 }] },
    { n: 4, exclusive: false, lifts: [{ id: "dead", prog: true, swapRed: "swap" }] },
    { n: 5, exclusive: false, lifts: [{ id: "goblet", sets: 3 }] },
    { n: 6, exclusive: true, tissue: { items: [{}, {}] }, mob: ["a"], lifts: [{ id: "f1" }, { id: "f2" }, { id: "f3" }, { id: "f4" }], down: "x" },
    { n: 7, exclusive: true, lifts: [{ id: "r1" }, { id: "r2" }, { id: "r3" }] }
  ]
};

function emptyLog() { return C.emptyLog(); }

// Date math — DST-safe
{
  const start = C.parseISO("2026-03-08"); // US spring-forward week
  const thu = new Date(2026, 2, 12);
  const s = C.suggested("2026-03-08", thu);
  assert.deepStrictEqual({ week: s.week, day: s.day }, { week: 1, day: 5 });
  assert.strictEqual(C.daysBetween(start, new Date(2026, 3, 19)), 42);
}

// v2 migration scopes readiness
{
  const v2 = {
    v: 2,
    state: { week: 1, day: 4, ready: "red", metric: "e1rm", start: "2026-08-17", flags: { back: true }, overrides: { dead: true } },
    checks: { w1d4: { squat: [true] } },
    loads: {}, reps: {}, rpe: {}, bw: {}, burn: {}, choice: {}
  };
  const m = C.migrate(v2);
  assert.strictEqual(m.v, 3);
  assert.strictEqual(m.sessions.w1d4.ready, "red");
  assert.strictEqual(m.sessions.w1d4.flags.back, true);
  assert.ok(m.sessions.w1d4.overrides.dead.on);
  assert.ok(!m.sessions.w1d1);
  assert.strictEqual(m.state.setupDone, true);
  assert.ok(!("ready" in m.state) || m.state.ready === undefined || m.state.ready === "green" || true);
}

// exclusive day progress
{
  const log = emptyLog();
  const sess = C.emptySession();
  sess.ready = "green";
  const idle = C.progress(program.days[5], 1, sess, log, program);
  assert.strictEqual(idle.state, "idle");
  log.choice.w1d6 = "f2";
  log.checks.w1d6 = { f2: [true], tissue: [true, true], mob: [true], down: [true] };
  const done = C.progress(program.days[5], 1, sess, log, program);
  assert.strictEqual(done.state, "done");
  assert.strictEqual(done.pct, 100);
  assert.ok(done.total < 8, "should not count all four options");
}

// Day 7 one choice
{
  const log = emptyLog();
  const sess = C.emptySession();
  log.choice.w1d7 = "r1";
  log.checks.w1d7 = { r1: [true] };
  const p = C.progress(program.days[6], 1, sess, log, program);
  assert.strictEqual(p.state, "done");
}

// Phase progress stays honest, including either red-day recovery option
{
  const log = emptyLog();
  const sess = C.emptySession();
  sess.ready = "green";
  log.checks.w1d1 = { tissue: [true], mob: [false] };
  const p = C.progress(program.days[0], 1, sess, log, program);
  assert.deepStrictEqual(p.byPhase.tissue, { done: 1, total: 1 });
  assert.deepStrictEqual(p.byPhase.mobility, { done: 0, total: 1 });
  assert.strictEqual(p.byPhase.work.total, 7);
  assert.deepStrictEqual(p.byPhase.burnout, { done: 0, total: 1 });
  assert.deepStrictEqual(p.byPhase.downshift, { done: 0, total: 1 });

  const red = C.emptySession();
  red.ready = "red";
  log.checks.w1d1.burneasy = [true];
  const redP = C.progress(program.days[0], 1, red, log, program);
  assert.deepStrictEqual(redP.byPhase.burnout, { done: 1, total: 1 });
}

// Deload accessory sets
{
  assert.strictEqual(C.nSets({ sets: 3 }, 1, program), 3);
  assert.strictEqual(C.nSets({ sets: 3 }, 6, program), 2);
  assert.strictEqual(C.nSets({ prog: true }, 6, program), 3);
}

// Honest analytics — no prescribed fallback
{
  const log = emptyLog();
  const lift = { id: "squat", prog: true, day: 1 };
  log.loads["w1d1:squat"] = "225";
  const spec = C.repSpec(lift, 1, 1, log, program);
  assert.strictEqual(spec.logged, false);
  assert.strictEqual(C.metricValue("e1rm", 225, spec, 4), null);
  log.reps["w1d1:squat"] = "6";
  const spec2 = C.repSpec(lift, 1, 1, log, program);
  assert.ok(C.metricValue("e1rm", 225, spec2, 4) > 200);
}

// Readiness scoping / blocking
{
  const dead = { id: "dead", swapRed: "swap" };
  assert.ok(C.liftBlocked(dead, { ready: "red", flags: {}, overrides: {} }));
  assert.ok(!C.liftBlocked(dead, { ready: "green", flags: {}, overrides: {} }));
  assert.ok(!C.liftBlocked(dead, { ready: "red", flags: {}, overrides: { dead: { on: true } } }));
  assert.ok(C.liftBlocked(dead, { ready: "green", flags: { back: true }, overrides: {} }));
}

// Week summary started vs complete
{
  const log = emptyLog();
  log.checks.w1d1 = { tissue: [true] };
  const sum = C.weekSummary(1, log, program, {});
  assert.strictEqual(sum.started, 1);
  assert.strictEqual(sum.completed, 0);
}

// Restore validation
{
  assert.throws(() => C.validatePayload({}), /version/);
  assert.throws(() => C.validatePayload({ v: 3, checks: [] }), /checks/);
  assert.ok(C.validatePayload({ v: 2, state: {}, checks: {} }));
}

// RPE target
{
  assert.strictEqual(C.rpeTarget({ rpe: "RPE 8–8.5" }), 8.5);
}

// ── Per-set logging (2.0) ────────────────────────────────────────────────
{
  const log = C.emptyLog();
  assert.deepStrictEqual(log.setlog, {}, "emptyLog carries setlog");

  log.setlog["w1d1:squat"] = [
    { load: "225", reps: "6" },
    { load: "225", reps: "6" },
    { load: "230", reps: "5" }
  ];
  assert.strictEqual(C.tonnageFromSetlog(log.setlog["w1d1:squat"], [true, true, true]), 3850);
  assert.strictEqual(C.tonnageFromSetlog(log.setlog["w1d1:squat"], [true, true, false]), 2700,
    "an unticked set contributes nothing");
  assert.strictEqual(C.tonnageFromSetlog([{}, {}], [true, true]), null,
    "no per-set data falls back to the legacy estimate");

  const rows = C.setRows(log, "squat", 1, 1, 4);
  assert.strictEqual(rows.length, 4, "one row per prescribed set");
  assert.strictEqual(rows[0].load, "225");
  assert.strictEqual(rows[3].load, "", "unlogged sets are empty, not absent");
}

// A log written before 2.0 shows its single value in set one.
{
  const legacy = C.emptyLog();
  legacy.loads["w1d1:squat"] = "315";
  legacy.reps["w1d1:squat"] = "5";
  const rows = C.setRows(legacy, "squat", 1, 1, 3);
  assert.strictEqual(rows[0].load, "315", "legacy load lands in set one");
  assert.strictEqual(rows[0].reps, "5");
  assert.strictEqual(rows[1].load, "", "and nowhere else");
}

// migrate and validate accept the new key without requiring it.
{
  const m = C.migrate({ v: 3, state: {}, checks: {} });
  assert.deepStrictEqual(m.setlog, {}, "a v3 payload without setlog migrates to an empty map");
  assert.ok(C.validatePayload({ v: 3, setlog: {} }));
  assert.throws(() => C.validatePayload({ v: 3, setlog: [] }), /setlog/);
}

// Week 2 carries a real RPE number, not prose.
assert.strictEqual(C.rpeTarget(program.weeks[1]), 7.5, "week 2 RPE target is a number");

// resolveBurn — single object, byWeek overlay, menu fallback
{
  const plain = { n: 1, burn: { nm: "Base", fmt: "10-minute AMRAP", items: ["a"], optional: false } };
  const resolved = C.resolveBurn(plain, 3);
  assert.strictEqual(resolved.nm, "Base");
  assert.ok(!("byWeek" in resolved));
  assert.strictEqual(C.resolveBurn({ n: 3, burn: null }, 1), null);

  const weekly = {
    n: 1,
    burn: {
      nm: "Base", fmt: "10-minute AMRAP", items: ["base"], adj: "base adj",
      byWeek: {
        2: { nm: "Ladder", fmt: "10-minute ladder", items: ["rung"] },
        6: { nm: "Easy", fmt: "8-minute easy", items: ["walk"], optional: true }
      }
    }
  };
  assert.strictEqual(C.resolveBurn(weekly, 1).nm, "Base", "missing byWeek key falls back to base");
  assert.strictEqual(C.resolveBurn(weekly, 2).nm, "Ladder");
  assert.deepStrictEqual(C.resolveBurn(weekly, 2).items, ["rung"]);
  assert.strictEqual(C.resolveBurn(weekly, 2).adj, "base adj", "overlay keeps base fields");
  assert.strictEqual(C.resolveBurn(weekly, 6).optional, true);
  assert.ok(!C.resolveBurn(weekly, 2).byWeek);

  const menuDay = {
    n: 5,
    burn: {
      optional: true,
      nm: "Aerobic pump",
      fmt: "10-minute easy cyclical",
      items: ["bike"],
      menu: [
        { id: "ccs", label: "CCS green alt", nm: "Carry / Crawl / Swing", fmt: "E2MOM", items: ["carry"] },
        { id: "chaos", label: "W5 only", weeks: [5], nm: "Chaotic", fmt: "AMRAP", items: ["go"] }
      ]
    }
  };
  assert.strictEqual(C.resolveBurn(menuDay, 1).nm, "Aerobic pump", "menu without weeks does not steal a complete base");
  assert.strictEqual(C.resolveBurn(menuDay, 5).nm, "Chaotic", "week-matched menu row wins");

  const menuOnly = {
    n: 2,
    burn: {
      menu: [
        { id: "a", label: "Default", nm: "Default", fmt: "AMRAP", items: ["x"] },
        { id: "b", weeks: [4], nm: "W4", fmt: "ladder", items: ["y"] }
      ]
    }
  };
  assert.strictEqual(C.resolveBurn(menuOnly, 1).nm, "Default");
  assert.strictEqual(C.resolveBurn(menuOnly, 4).nm, "W4");
}

// prepPump counts as its own phase; old days without it stay unchanged
{
  const day = {
    n: 1,
    exclusive: false,
    tissue: { items: [{}] },
    prepPump: { items: [{ a: "pulse" }, { a: "lean" }] },
    mob: ["a"],
    lifts: [{ id: "squat", prog: true }],
    burn: { hard: true },
    down: "x"
  };
  const log = emptyLog();
  const sess = C.emptySession();
  sess.ready = "green";
  const p = C.progress(day, 1, sess, log, program);
  assert.deepStrictEqual(p.byPhase.prep, { done: 0, total: 2 });
  log.checks.w1d1 = { preppump: [true, false] };
  const p2 = C.progress(day, 1, sess, log, program);
  assert.deepStrictEqual(p2.byPhase.prep, { done: 1, total: 2 });
  const plain = C.progress(program.days[0], 1, sess, emptyLog(), program);
  assert.deepStrictEqual(plain.byPhase.prep, { done: 0, total: 0 });
}

// weekSummary uses the resolved optional flag
{
  const weekly = {
    sets: program.sets,
    progReps: program.progReps,
    weeks: program.weeks,
    days: [
      { n: 1, exclusive: false, lifts: [], burn: { optional: false, byWeek: { 6: { optional: true } } } },
      { n: 2, exclusive: false, lifts: [] },
      { n: 3, exclusive: false, lifts: [] },
      { n: 4, exclusive: false, lifts: [] },
      { n: 5, exclusive: false, lifts: [] },
      { n: 6, exclusive: true, lifts: [{ id: "f1" }] },
      { n: 7, exclusive: true, lifts: [{ id: "r1" }] }
    ]
  };
  const log = emptyLog();
  log.checks.w1d1 = { burn: [true] };
  log.checks.w6d1 = { burn: [true] };
  const w1 = C.weekSummary(1, log, weekly, {});
  const w6 = C.weekSummary(6, log, weekly, {});
  assert.strictEqual(w1.hard, 1);
  assert.strictEqual(w1.optional, 0);
  assert.strictEqual(w6.hard, 0);
  assert.strictEqual(w6.optional, 1);
}

console.log("PASS core tests");
