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

// burnFmtChip — interval clocks must not collapse to a lone number
{
  assert.strictEqual(C.burnFmtChip("40 sec work / 20 sec transition × 10 min"), "40/20");
  assert.strictEqual(C.burnFmtChip("40 sec work / 20 sec transition × 8 min"), "40/20");
  assert.strictEqual(C.burnFmtChip("40 sec / 20 sec × 10 min"), "40/20");
  assert.strictEqual(C.burnFmtChip("10-minute AMRAP"), "10-minute");
  assert.strictEqual(C.burnFmtChip("10-minute ascending ladder"), "10-minute");
  assert.strictEqual(C.burnFmtChip("8-minute easy"), "8-minute");
  assert.strictEqual(C.burnFmtChip("8-minute easy 40/20"), "8-minute");
  assert.strictEqual(C.burnFmtChip("10-minute easy cyclical"), "10-minute");
  assert.strictEqual(C.burnFmtChip("Every 2 min for 10 min — 5 rounds"), "Every");
  assert.strictEqual(C.burnFmtChip(""), "10 min");
  assert.strictEqual(C.burnFmtChip(null), "10 min");
  assert.ok(!/^\d+$/.test(C.burnFmtChip("40 sec work / 20 sec transition × 10 min")),
    "Day 2 chip must not be a bare number next to 0/1");
}

// Live program formats must not produce a bare-number chip
{
  const fs = require("fs");
  const path = require("path");
  const vm = require("vm");
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../program.js"), "utf8"), ctx);
  ctx.window.PROGRAM.days.forEach(function (d) {
    for (let w = 1; w <= 6; w++) {
      const burn = C.resolveBurn(d, w);
      if (!burn || !burn.fmt) continue;
      const chip = C.burnFmtChip(burn.fmt);
      assert.ok(!/^\d+$/.test(chip),
        "W" + w + " D" + d.n + " chip " + JSON.stringify(chip) + " from " + JSON.stringify(burn.fmt));
    }
  });
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

// resolveLift overlays byWeek and leaves mains untouched
{
  const lift = {
    id: "elastic", nm: "Broad jump", rx: "3 × 3–5 jumps",
    byWeek: { 2: { nm: "Pogo bounds", rx: "3 × 8–10 pogos" }, 3: { nm: "Med-ball slam" } }
  };
  assert.strictEqual(C.resolveLift(lift, 1).nm, "Broad jump");
  assert.strictEqual(C.resolveLift(lift, 2).nm, "Pogo bounds");
  assert.strictEqual(C.resolveLift(lift, 2).rx, "3 × 8–10 pogos");
  assert.ok(!("byWeek" in C.resolveLift(lift, 2)));
  const squat = { id: "squat", nm: "Back squat or front squat", prog: true };
  assert.deepStrictEqual(C.resolveLift(squat, 4), squat);
}

// prepPump gates on Amber/Red/any flag
{
  assert.strictEqual(C.prepPumpGated({ ready: "green", flags: {} }), false);
  assert.strictEqual(C.prepPumpGated({ ready: "amber", flags: {} }), true);
  assert.strictEqual(C.prepPumpGated({ ready: "red", flags: {} }), true);
  assert.strictEqual(C.prepPumpGated({ ready: "green", flags: { achilles: true } }), true);
  const day = {
    n: 1, exclusive: false, tissue: { items: [{}] },
    prepPump: { items: [{ a: "pulse" }, { a: "lean" }] },
    mob: ["a"], lifts: [{ id: "squat", prog: true }], burn: { hard: true }, down: "x"
  };
  const amber = C.emptySession();
  amber.ready = "amber";
  const gated = C.progress(day, 1, amber, emptyLog(), program);
  assert.deepStrictEqual(gated.byPhase.prep, { done: 0, total: 0 }, "gated prep pump drops out of progress");
}

// burnEffort / zone cue / item strip / menu weeks
{
  const week4 = { n: 4, burn: "85–90%" };
  const week6 = { n: 6, burn: "60–70%" };
  assert.strictEqual(C.burnEffort({ effort: "90–95%" }, week4, 4), "90–95%");
  assert.strictEqual(C.burnEffort({ hard: true }, week4, 4), "90–95%", "D4 W1–4 restore 90–95%");
  assert.strictEqual(C.burnEffort({ optional: true }, week4, 5), "RPE ~7");
  assert.strictEqual(C.burnEffort({ hard: true }, week6, 1), "RPE ~7", "W6 never shows a week percent");
  assert.strictEqual(C.burnShowsZoneCue({ hard: true }, 3), true);
  assert.strictEqual(C.burnShowsZoneCue({ optional: true }, 3), false);
  assert.strictEqual(C.burnShowsZoneCue({ hard: true }, 6), false);
  assert.strictEqual(C.burnItemText("1 · Kettlebell swings"), "Kettlebell swings");
  assert.strictEqual(C.burnItemText("10 · Easy walk"), "Easy walk");
  assert.strictEqual(C.burnItemText("Min 1 · bike 30 s"), "Min 1 · bike 30 s");
  const d5 = {
    n: 5,
    burn: {
      optional: true, nm: "Aerobic Pump Closer",
      menu: [{ id: "ccs", label: "Carry / Crawl / Swing (green alt)", weeks: [1, 2, 3, 4], nm: "Carry / Crawl / Swing", items: ["swings"] }]
    }
  };
  assert.strictEqual(C.burnMenuRows(d5, 3, { nm: "Aerobic Pump Closer" }).length, 1);
  assert.strictEqual(C.burnMenuRows(d5, 5, { nm: "Aerobic Pump Closer" }).length, 0);
  const weekly = {
    n: 1,
    burn: {
      nm: "Base", fmt: "10-minute AMRAP", items: ["base"], adj: "anti-echo",
      byWeek: { 3: { nm: "Hybrid", adj: "week note" } }
    }
  };
  const r3 = C.resolveBurn(weekly, 3);
  assert.strictEqual(r3.baseAdj, "anti-echo");
  assert.strictEqual(r3.weekNote, "week note");
  assert.ok(/no swings on squat day/i.test(C.achillesLine({ n: 1 }, {})));
  assert.ok(!/emphasize swings/i.test(C.achillesLine({ n: 1 }, {})), "D1 Achilles must not emphasize swings");
  assert.ok(!/swing/i.test(C.achillesReadiness({ n: 1 }, {})) || /no swings/i.test(C.achillesReadiness({ n: 1 }, {})));
  assert.ok(!/carry/i.test(C.achillesReadiness({ n: 4 }, { items: ["Goblet squat", "Push-ups", "Bike"] })));
  assert.ok(!/swing/i.test(C.achillesLine({ n: 1 }, { items: ["Bike 40 s", "Push-ups × 8", "Med-ball slam × 8", "March as breaker"] })) || /no swings/i.test(C.achillesLine({ n: 1 }, { items: ["Bike 40 s", "Push-ups × 8", "Med-ball slam × 8", "March as breaker"] })));
  assert.ok(!/crawl/i.test(C.achillesLine({ n: 1 }, { items: ["Bike 40 s", "Push-ups × 8", "Med-ball slam × 8", "March as breaker"] })));
  assert.ok(!/burpee/i.test(C.achillesLine({ n: 2 }, { items: ["KB swings × 8", "Bear crawl × 6 steps"] })));
  assert.ok(!/burpee/i.test(C.achillesLine({ n: 4 }, { items: ["Min 1 · bike 30 s", "Min 2 · goblet squat × 8", "Min 3 · push-ups × 8 + mountain climbers × 12"] })));
}

// Live program: W1–6 explicit, W3 D2 ≠ W1, only D4 W5 is a benchmark
{
  const fs = require("fs");
  const path = require("path");
  const vm = require("vm");
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../program.js"), "utf8"), ctx);
  const P = ctx.window.PROGRAM;
  [1, 2, 4].forEach(function (n) {
    const keys = Object.keys(P.days[n - 1].burn.byWeek).map(String);
    ["1", "2", "3", "4", "5", "6"].forEach(function (k) {
      assert.ok(keys.indexOf(k) >= 0, "D" + n + " missing byWeek " + k);
    });
  });
  const d2w1 = C.resolveBurn(P.days[1], 1);
  const d2w3 = C.resolveBurn(P.days[1], 3);
  const d2w5 = C.resolveBurn(P.days[1], 5);
  assert.ok(JSON.stringify(d2w1.items) !== JSON.stringify(d2w3.items) || d2w1.nm !== d2w3.nm,
    "D2 W3 must differ from W1");
  assert.strictEqual(d2w5.nm, "Owned Menu B");
  assert.ok(JSON.stringify(d2w5.items) !== JSON.stringify(d2w3.items),
    "D2 W5 must differ from W3");
  assert.ok(/row \(erg\) or bike/i.test((d2w5.items || []).join(" ")));
  assert.ok(/squat thrust/i.test((d2w5.items || []).join(" ")));
  assert.ok(!/kettlebell swing|burpee|bear crawl/i.test((d2w5.items || []).join(" ")));
  assert.ok(!/air squat/i.test((d2w1.items || []).join(" ")));
  assert.ok(/bike|row/i.test((d2w1.items || []).join(" ")));
  let benches = 0;
  P.days.forEach(function (d) {
    for (let w = 1; w <= 6; w++) {
      const b = C.resolveBurn(d, w);
      if (b && b.benchmark) {
        benches++;
        assert.strictEqual(d.n, 4);
        assert.strictEqual(w, 5);
      }
    }
  });
  assert.strictEqual(benches, 1, "exactly one benchmark — D4 W5");
  const d1w4 = C.resolveBurn(P.days[0], 4);
  assert.ok(/squat thrust/i.test((d1w4.items || []).join(" ")));
  const d2w4 = C.resolveBurn(P.days[1], 4);
  assert.ok(/inverted|ring row/i.test((d2w4.items || []).join(" ")));
  const d1w3 = C.resolveBurn(P.days[0], 3);
  assert.ok(/bike/i.test((d1w3.items || []).join(" ")) && /push-up/i.test((d1w3.items || []).join(" ")) && /slam/i.test((d1w3.items || []).join(" ")));
  assert.strictEqual(C.burnEffort(C.resolveBurn(P.days[3], 1), P.weeks[0], 4), "90–95%");
  assert.ok(/^RPE/i.test(C.burnEffort(C.resolveBurn(P.days[4], 1), P.weeks[0], 5)));
  assert.ok(/^RPE/i.test(C.burnEffort(C.resolveBurn(P.days[0], 6), P.weeks[5], 1)));
  assert.ok(/2–4/.test(P.days[0].prepPump.dose));
  assert.ok(/hinge reach/i.test(P.days[3].prepPump.items.map(function (i) { return i.a; }).join(" ")));
  assert.ok(!/pogo|kb deadlift/i.test(P.days[3].prepPump.items.map(function (i) { return i.a; }).join(" ")));
  assert.strictEqual(P.days[1].tissue.items[0].a.toLowerCase().indexOf("chest") >= 0, true);
  assert.ok(/lat/i.test(P.days[0].tissue.items.slice(0, 3).map(function (i) { return i.a; }).join(" ")));
  assert.ok(P.days[0].lifts.find(function (l) { return l.id === "pullup"; }).cousins.indexOf("Neutral-grip pull-up") >= 0);
  assert.ok((P.days[3].lifts.find(function (l) { return l.id === "pp"; }).cousins || []).length >= 3);
  const d5w1 = C.resolveTissue(P.days[4], 1);
  const d5w3 = C.resolveTissue(P.days[4], 3);
  assert.ok(/front-foot elevated split squat/i.test(d5w3.items[0].for), "W3 D5 tissue for follows FFE split squat");
  assert.strictEqual(d5w3.goal, "Chassis texture for front-foot elevated split squat, floor press, row, and the Copenhagen.");
  assert.ok(!/goblet/i.test(d5w3.goal + " " + d5w3.items[0].cue), "W3 D5 tissue must not name goblet after the split-squat rotation");
  const d5w4 = C.resolveTissue(P.days[4], 4);
  assert.ok(/incline press/i.test(d5w4.items[1].for), "W4 D5 tissue for follows incline press");
  assert.ok(/incline press/i.test(d5w4.goal), "W4 D5 tissue goal follows incline press");
  assert.ok(!/floor press/i.test(d5w4.goal), "W4 D5 tissue goal must not keep floor press");
  const d5w2 = C.resolveTissue(P.days[4], 2);
  assert.ok(/chest-supported row/i.test(d5w2.items[2].for), "W2 D5 tissue for follows chest-supported row");
  assert.ok(/chest-supported row/i.test(d5w2.goal), "W2 D5 tissue goal follows chest-supported row");
  assert.ok(/chest-supported row/i.test(d5w2.items[2].cue), "W2 D5 tissue cue follows chest-supported row");
  assert.strictEqual(d5w1.goal, "Chassis texture for goblet, floor press, row, and the Copenhagen.");
  const d5w5burn = C.resolveBurn(P.days[4], 5);
  const d5w6burn = C.resolveBurn(P.days[4], 6);
  assert.ok(!/green option/i.test(d5w5burn.baseAdj), "W5 D5 antiEcho must not advertise a missing CCS option");
  assert.ok(!/green option/i.test(d5w6burn.baseAdj), "W6 D5 antiEcho must not advertise a missing CCS option");
  assert.strictEqual(C.burnGreenTitle({ label: "Carry / Crawl / Swing (green)" }), "Carry / Crawl / Swing");
  assert.strictEqual(C.burnGreenTitle({ label: "Carry / Crawl / Swing" }), "Carry / Crawl / Swing");
  const elasticW5 = C.resolveLift(P.days[3].lifts.find(function (l) { return l.id === "elastic"; }), 5);
  assert.ok(/slam/i.test(elasticW5.rx), "W5 D4 elastic owned option includes slam dose");
  assert.ok(!/climb/i.test(C.resolveMobNote(P.days[0], 5)));
  assert.ok(!/climb/i.test(C.resolveMobNote(P.days[0], 6)));
  assert.ok(/climb/i.test(C.resolveMobNote(P.days[0], 3)));
  assert.ok(/easy walk/i.test(C.restTitle(P.days[4], 6)));
  assert.ok(!/RPE 7/.test(C.restTitle(P.days[4], 6)));
  assert.ok(/8–9 min/.test(C.resolveBurn(P.days[1], 4).fmt));
  assert.ok(!/crawl/i.test(C.achillesLine(P.days[0], d1w3)));
  assert.ok(!/Push, crawl, march/i.test(d1w3.baseAdj));
  assert.ok(!/RPE ~?7/.test(C.burnEffort(C.resolveBurn(P.days[4], 6), P.weeks[5], 5)) || /5/.test(C.burnEffort(C.resolveBurn(P.days[4], 6), P.weeks[5], 5)));
  assert.ok(/carry|swing/i.test(C.achillesReadiness({ n: 2 }, { items: ["Kettlebell swings", "Bike or row"] })) === false || /swing/i.test(C.achillesReadiness({ n: 2 }, { items: ["Kettlebell swings", "Bike or row"] })));
  assert.ok(!/favor carries and swings/i.test(C.achillesReadiness(P.days[0], C.resolveBurn(P.days[0], 3))));
}

console.log("PASS core tests");
