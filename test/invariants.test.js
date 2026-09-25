const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "program.js"), "utf8"), ctx);
const P = ctx.window.PROGRAM;

const mains = JSON.parse(fs.readFileSync(path.join(__dirname, "goldens/mains-frozen.json"), "utf8"));
const rest = JSON.parse(fs.readFileSync(path.join(__dirname, "goldens/rest-days-frozen.json"), "utf8"));

function clone(v) { return JSON.parse(JSON.stringify(v)); }

function stripNote(day) {
  const copy = clone(day);
  if (copy.tissue) delete copy.tissue.note;
  return copy;
}

["1:squat", "2:bench", "4:dead"].forEach(function (key) {
  const [n, id] = key.split(":");
  const live = (P.days[+n - 1].lifts || []).find(function (l) { return l.id === id; });
  assert.ok(live, "missing main " + key);
  assert.deepStrictEqual(clone(live), mains[key], "main lift " + key + " must stay byte-identical");
});

[3, 6, 7].forEach(function (n) {
  const live = stripNote(P.days[n - 1]);
  const frozen = rest[String(n)];
  assert.deepStrictEqual(live, frozen, "Day " + n + " must stay unchanged except tissue notes");
});

const beforeDir = path.join(__dirname, "goldens/before");
const afterDir = path.join(__dirname, "goldens/after");
const { dumpDay } = require(path.join(ROOT, "scripts/dump-week-days.js"));
for (let w = 1; w <= 6; w++) {
  for (let d = 1; d <= 7; d++) {
    const name = "W" + w + "D" + d + ".txt";
    assert.ok(fs.existsSync(path.join(beforeDir, name)), "missing before golden " + name);
    const after = fs.readFileSync(path.join(afterDir, name), "utf8");
    const fresh = dumpDay(P, w, d);
    assert.strictEqual(after, fresh, "after golden " + name + " is stale — rerun scripts/dump-week-days.js");
  }
}

console.log("PASS invariants — mains and D3/D6/D7 (besides tissue notes) unchanged");
