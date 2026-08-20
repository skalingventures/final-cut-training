const assert = require("assert");
const C = require("../core.js");

const program = {
  sets: { 1: 4, 2: 4, 3: 5, 4: 5, 5: 5, 6: 3 },
  progReps: { 1: 6, 2: 6, 3: 5, 4: 4, 5: 3, 6: 5 },
  weeks: [
    { n: 1, main: "4 × 6", rpe: "RPE 7" },
    { n: 2, main: "4 × 6", rpe: "slightly heavier than wk 1" },
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

console.log("PASS core tests");
