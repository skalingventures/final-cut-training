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

console.log("PASS persist tests");
