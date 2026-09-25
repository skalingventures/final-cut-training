#!/usr/bin/env node
/* Resolve every Block 01 week × day through Core and dump golden text.
   Usage:
     node scripts/dump-week-days.js test/goldens/before
     node scripts/dump-week-days.js test/goldens/after
*/
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const Core = require(path.join(ROOT, "core.js"));

function loadProgram() {
  const ctx = { window: {}, console };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, "program.js"), "utf8"), ctx);
  if (!ctx.window.PROGRAM) throw new Error("program.js did not set window.PROGRAM");
  return ctx.window.PROGRAM;
}

function line(s) { return String(s == null ? "" : s); }

function dumpDay(program, week, dayN) {
  const day = program.days[dayN - 1];
  const weekObj = program.weeks[week - 1];
  const sess = Core.emptySession();
  sess.ready = "green";
  const lifts = Core.resolveLifts(day, week);
  const burn = Core.resolveBurn(day, week);
  const effort = burn ? Core.burnEffort(burn, weekObj, day.n) : "";
  const zoneCue = Core.burnShowsZoneCue(burn, week);
  const menu = Core.burnMenuRows(day, week, burn);
  const out = [];

  out.push("WEEK " + week + " DAY " + dayN);
  out.push("intent: " + weekObj.intent);
  out.push("weekday: " + day.weekday);
  out.push("theme: " + day.theme);
  out.push("sub: " + day.sub);
  out.push("heat: " + day.heat);
  if (day.guardTop) out.push("guardTop: " + day.guardTop);
  const restTitle = Core.restTitle(day, week);
  if (restTitle) out.push("restTitle: " + restTitle);
  out.push("");

  const tissue = Core.resolveTissue(day, week);
  if (tissue) {
    out.push("== TISSUE ==");
    out.push("dose: " + line(tissue.dose));
    out.push("goal: " + line(tissue.goal));
    (tissue.items || []).forEach(function (t, i) {
      const bits = [t.a];
      if (t.for) bits.push("for " + t.for);
      if (t.optional) bits.push("optional");
      if (t.tool) bits.push(t.tool);
      if (t.d) bits.push(t.d);
      out.push((i + 1) + ". " + bits.join(" · "));
      if (t.cue) out.push("   cue: " + t.cue);
    });
    if (tissue.note) out.push("note: " + tissue.note);
    out.push("");
  }

  if (day.prepPump) {
    out.push("== PREP PUMP ==");
    out.push("dose: " + line(day.prepPump.dose));
    out.push("goal: " + line(day.prepPump.goal));
    out.push("gatedOnAmberRedOrFlag: " + (Core.prepPumpGated({ ready: "amber", flags: {} }) ? "yes" : "no"));
    (day.prepPump.items || []).forEach(function (t, i) {
      const bits = [t.a];
      if (t.tool) bits.push(t.tool);
      if (t.d) bits.push(t.d);
      out.push((i + 1) + ". " + bits.join(" · "));
      if (t.cue) out.push("   cue: " + t.cue);
    });
    if (day.prepPump.note) out.push("note: " + day.prepPump.note);
    out.push("");
  }

  if (day.mob && day.mob.length) {
    out.push("== MOBILITY ==");
    const mobNote = Core.resolveMobNote(day, week);
    if (mobNote) out.push("mobNote: " + mobNote);
    if (weekObj.mob) out.push("weekMob: " + weekObj.mob);
    day.mob.forEach(function (m) {
      if (typeof m === "string") out.push("- " + m);
      else {
        out.push("- " + m.nm + (m.why ? " — " + m.why : ""));
        if (m.levels && m.levels.length) out.push("  levels: " + m.levels.join(" | "));
      }
    });
    out.push("");
  }

  out.push("== LIFTS ==");
  lifts.forEach(function (l) {
    out.push("id: " + l.id);
    if (l.job || l.role) out.push("job: " + (l.job || l.role));
    out.push("nm: " + l.nm);
    if (l.prog) out.push("main: " + weekObj.main + " · " + weekObj.rpe);
    if (l.rx) out.push("rx: " + l.rx);
    if (l.note) out.push("note: " + l.note);
    if (l.cousins && l.cousins.length) out.push("cousins: " + l.cousins.join(" · "));
    if (l.guard) out.push("guard: " + l.guard);
    if (!l.prog && l.cousins && l.cousins.length && weekObj.acc) out.push("accWave: " + weekObj.acc);
    out.push("");
  });

  if (burn) {
    out.push("== BURNOUT ==");
    out.push("nm: " + line(burn.nm));
    out.push("fmt: " + line(burn.fmt));
    out.push("chip: " + Core.burnFmtChip(burn.fmt));
    out.push("effort: " + effort);
    out.push("optional: " + (burn.optional ? "yes" : "no"));
    out.push("benchmark: " + (burn.benchmark ? "yes" : "no"));
    out.push("hard: " + (burn.hard ? "yes" : "no"));
    out.push("zoneCue: " + (zoneCue ? "Z4 by minute 4–6" : "none"));
    if (burn.patterns) out.push("patterns: " + burn.patterns.join(", "));
    (burn.items || []).forEach(function (item) {
      out.push("- " + Core.burnItemText(item));
    });
    if (burn.baseAdj) out.push("antiEcho: " + burn.baseAdj);
    if (burn.weekNote) out.push("weekNote: " + burn.weekNote);
    out.push("achilles: " + Core.achillesLine(day, burn));
    out.push("achillesReady: " + Core.achillesReadiness(day, burn));
    if (burn.adj && burn.adj !== burn.baseAdj && burn.adj !== burn.weekNote) {
      out.push("adj: " + burn.adj);
    }
    menu.forEach(function (m) {
      const title = Core.burnGreenTitle(m);
      out.push("greenOption: " + title);
      (m.items || []).forEach(function (item) {
        out.push("  - " + Core.burnItemText(item));
      });
    });
    out.push("");
  } else {
    out.push("== BURNOUT ==");
    out.push("none");
    out.push("");
  }

  if (day.down) {
    out.push("== DOWNSHIFT ==");
    out.push(day.down);
    out.push("");
  }

  const log = Core.emptyLog();
  const prog = Core.progress(day, week, sess, log, program);
  out.push("== PROGRESS ==");
  out.push("total: " + prog.total);
  out.push("phases: tissue " + prog.byPhase.tissue.total +
    " · prep " + prog.byPhase.prep.total +
    " · mobility " + prog.byPhase.mobility.total +
    " · work " + prog.byPhase.work.total +
    " · burnout " + prog.byPhase.burnout.total +
    " · downshift " + prog.byPhase.downshift.total);

  return out.join("\n") + "\n";
}

function main() {
  const dest = path.resolve(process.argv[2] || path.join(ROOT, "test/goldens/after"));
  fs.mkdirSync(dest, { recursive: true });
  const program = loadProgram();
  for (let w = 1; w <= 6; w++) {
    for (let d = 1; d <= 7; d++) {
      const text = dumpDay(program, w, d);
      const name = "W" + w + "D" + d + ".txt";
      fs.writeFileSync(path.join(dest, name), text);
    }
  }
  console.log("wrote 42 views to " + dest);
}

if (require.main === module) main();

module.exports = { loadProgram, dumpDay };
