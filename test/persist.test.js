const assert = require("assert");
const C = require("../core.js");

const store = {};
function save(obj) { store[C.KEY] = JSON.stringify(obj); }
function load() { return C.migrate(JSON.parse(store[C.KEY])); }

const v2 = {
  v: 2,
  state: { week: 2, day: 2, ready: "amber", metric: "load", start: "2026-08-17", flags: { shoulder: true }, overrides: {} },
  checks: { w2d2: { bench: [true, true] } },
  loads: { "w2d2:bench": "185" },
  reps: { "w2d2:bench": "8" },
  rpe: {}, bw: { 2: "190" }, burn: {}, choice: {}
};

save(C.migrate(v2));
const again = load();
assert.strictEqual(again.v, 3);
assert.strictEqual(again.loads["w2d2:bench"], "185");
assert.strictEqual(again.reps["w2d2:bench"], "8");
assert.strictEqual(again.bw[2], "190");
assert.strictEqual(again.sessions.w2d2.ready, "amber");

// corrupt payload rejected
assert.throws(() => C.validatePayload({ v: 1 }), /Unrecognized|version/);

// hasLogs
assert.ok(C.hasLogs(again));
assert.ok(!C.hasLogs(C.emptyLog()));

// Per-set rows survive a save/load round trip.
{
  const withSets = {
    v: 3,
    state: { week: 1, day: 1, metric: "e1rm", start: "2026-08-31", setupDone: true },
    sessions: {}, checks: {}, loads: { "w1d1:squat": "225" }, reps: {}, rpe: {},
    bw: {}, burn: {}, choice: {}, subs: {},
    setlog: { "w1d1:squat": [{ load: "225", reps: "6", rpe: "7" }, { load: "235", reps: "5", rpe: "8" }] }
  };
  save(withSets);
  const back = load();
  assert.strictEqual(back.setlog["w1d1:squat"][1].load, "235");
  assert.strictEqual(back.setlog["w1d1:squat"][1].rpe, "8");
  assert.strictEqual(back.loads["w1d1:squat"], "225", "the legacy mirror is untouched");
}

console.log("PASS persist tests");
