/* Final Cut — pure logic. Usable in the browser and in Node tests. */
(function (root) {
  const Core = {};
  const KEY = "final-cut:v3";
  const SNAP_KEY = "final-cut:last-good";
  const VERSION = 3;
  const APP_VERSION = "1.4.0";

  Core.KEY = KEY;
  Core.SNAP_KEY = SNAP_KEY;
  Core.VERSION = VERSION;
  Core.APP_VERSION = APP_VERSION;

  Core.iso = function iso(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  };

  Core.parseISO = function parseISO(s) {
    if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
    const p = s.split("-").map(Number);
    const d = new Date(p[0], p[1] - 1, p[2]);
    if (d.getFullYear() !== p[0] || d.getMonth() !== p[1] - 1 || d.getDate() !== p[2]) return null;
    return d;
  };

  Core.defaultMonday = function defaultMonday(now) {
    const d = now ? new Date(now.getTime()) : new Date();
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return Core.iso(d);
  };

  Core.daysBetween = function daysBetween(start, now) {
    const a = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const b = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((b - a) / 86400000);
  };

  Core.suggested = function suggested(startISO, now) {
    const start = Core.parseISO(startISO);
    if (!start) return { week: 1, day: 1, unknown: true };
    const cur = now ? new Date(now.getTime()) : new Date();
    const diff = Core.daysBetween(start, cur);
    if (diff < 0) return { week: 1, day: 1, before: true };
    if (diff >= 42) return { week: 6, day: 7, after: true };
    return { week: Math.floor(diff / 7) + 1, day: (diff % 7) + 1 };
  };

  Core.wd = function wd(week, day) { return "w" + week + "d" + day; };
  Core.loadKey = function loadKey(id, week, day) { return Core.wd(week, day) + ":" + id; };

  Core.cleanMap = function cleanMap(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return {};
    return obj;
  };

  Core.emptyLog = function emptyLog() {
    return { checks: {}, loads: {}, reps: {}, rpe: {}, bw: {}, burn: {}, choice: {}, subs: {} };
  };

  Core.emptySession = function emptySession() {
    return { ready: null, flags: {}, overrides: {}, collapsed: {}, finished: false };
  };

  Core.defaultState = function defaultState(now) {
    return {
      week: 1,
      day: 1,
      metric: "e1rm",
      start: Core.defaultMonday(now),
      setupDone: false,
      lastSaved: null,
      lastExported: null
    };
  };

  Core.clampState = function clampState(next, now) {
    const s = Object.assign(Core.defaultState(now), next || {});
    s.week = Math.min(6, Math.max(1, +s.week || 1));
    s.day = Math.min(7, Math.max(1, +s.day || 1));
    if (["e1rm", "tonnage", "load"].indexOf(s.metric) === -1) s.metric = "e1rm";
    if (!Core.parseISO(s.start)) s.start = Core.defaultMonday(now);
    s.setupDone = !!s.setupDone;
    return s;
  };

  Core.defaultSession = function defaultSession(sess) {
    const base = Core.emptySession();
    const next = Object.assign(base, sess || {});
    next.flags = Core.cleanMap(next.flags);
    next.overrides = Core.cleanMap(next.overrides);
    next.collapsed = Core.cleanMap(next.collapsed);
    if (next.ready && ["green", "amber", "red"].indexOf(next.ready) === -1) next.ready = null;
    next.finished = !!next.finished;
    return next;
  };

  Core.migrate = function migrate(data) {
    if (!data || typeof data !== "object") throw new Error("empty");
    const v = data.v || 0;
    if (v > VERSION) throw new Error("This backup is from a newer app version.");
    let out = data;
    if (v < 2) throw new Error("Unrecognized log format.");
    if (v === 2) {
      const st = data.state || {};
      const sessions = {};
      const key = Core.wd(st.week || 1, st.day || 1);
      sessions[key] = Core.defaultSession({
        ready: st.ready || null,
        flags: st.flags || {},
        overrides: Object.keys(st.overrides || {}).reduce(function (acc, id) {
          acc[id] = { on: !!st.overrides[id], as: "" };
          return acc;
        }, {})
      });
      out = {
        v: 3,
        state: {
          week: st.week,
          day: st.day,
          metric: st.metric,
          start: st.start,
          setupDone: true,
          lastSaved: null,
          lastExported: null
        },
        sessions: sessions,
        checks: data.checks,
        loads: data.loads,
        reps: data.reps,
        rpe: data.rpe,
        bw: data.bw,
        burn: data.burn,
        choice: data.choice,
        subs: {}
      };
    }
    return {
      v: VERSION,
      state: Core.clampState(out.state),
      sessions: Core.cleanMap(out.sessions),
      checks: Core.cleanMap(out.checks),
      loads: Core.cleanMap(out.loads),
      reps: Core.cleanMap(out.reps),
      rpe: Core.cleanMap(out.rpe),
      bw: Core.cleanMap(out.bw),
      burn: Core.cleanMap(out.burn),
      choice: Core.cleanMap(out.choice),
      subs: Core.cleanMap(out.subs)
    };
  };

  Core.validatePayload = function validatePayload(data) {
    if (!data || typeof data !== "object") throw new Error("empty");
    if (data.v !== 2 && data.v !== 3) throw new Error("Missing or unknown version.");
    if (data.state && typeof data.state !== "object") throw new Error("state must be an object.");
    ["checks", "loads", "reps", "rpe", "bw", "burn", "choice"].forEach(function (k) {
      if (data[k] != null && (typeof data[k] !== "object" || Array.isArray(data[k]))) {
        throw new Error(k + " must be an object.");
      }
    });
    return true;
  };

  Core.nSets = function nSets(lift, week, program) {
    if (lift.prog) return program.sets[week];
    const base = lift.sets || 1;
    if (week === 6 && base > 1) return Math.max(1, Math.ceil(base * 0.65));
    return base;
  };

  Core.rpeTarget = function rpeTarget(weekObj) {
    const m = String(weekObj.rpe || "").match(/(\d+(?:\.\d+)?)/g);
    if (!m) return null;
    return Math.max.apply(null, m.map(Number));
  };

  Core.num = function num(v) {
    if (v == null || v === "") return null;
    const m = String(v).match(/\d+(\.\d+)?/g);
    return m ? Math.max.apply(null, m.map(Number)) : null;
  };

  Core.sessionItems = function sessionItems(day, week, sess, log, program) {
    const items = [];
    const key = Core.wd(week, day.n);
    const checks = log.checks[key] || {};
    const choice = log.choice[key] || "";
    const ready = sess.ready || "green";
    if (day.tissue) day.tissue.items.forEach(function (_, i) { items.push(["tissue", i]); });
    if (day.mob) day.mob.forEach(function (_, i) { items.push(["mob", i]); });
    if (day.exclusive) {
      items.push(["choice", 0]);
    } else {
      (day.lifts || []).forEach(function (l) {
        const blocked = Core.liftBlocked(l, sess);
        if (blocked) return;
        const n = Core.nSets(l, week, program);
        for (let i = 0; i < n; i++) items.push([l.id, i]);
      });
    }
    if (day.burn) {
      if (ready === "red") items.push(["walkOrEasy", 0]);
      else if (day.burn.optional && checks.burnskip && checks.burnskip[0]) items.push(["burnskip", 0]);
      else items.push(["burn", 0]);
    }
    if (day.down) items.push(["down", 0]);
    return { items: items, choice: choice };
  };

  Core.chk = function chk(checks, week, day, id, i) {
    const k = checks[Core.wd(week, day)];
    return !!(k && k[id] && k[id][i]);
  };

  Core.progress = function progress(day, week, sess, log, program) {
    const pack = Core.sessionItems(day, week, sess, log, program);
    const items = pack.items;
    const byPhase = {
      tissue: { done: 0, total: 0 },
      mobility: { done: 0, total: 0 },
      work: { done: 0, total: 0 },
      burnout: { done: 0, total: 0 },
      downshift: { done: 0, total: 0 }
    };
    function phaseFor(id) {
      if (id === "tissue") return "tissue";
      if (id === "mob") return "mobility";
      if (id === "burn" || id === "burnskip" || id === "burneasy" || id === "walk" || id === "walkOrEasy") return "burnout";
      if (id === "down") return "downshift";
      return "work";
    }
    if (!items.length) return { done: 0, total: 0, pct: 0, state: "idle", strength: false, byPhase: byPhase };
    items.forEach(function (pair) {
      const phase = phaseFor(pair[0]);
      byPhase[phase].total++;
      const isDone = pair[0] === "choice"
        ? !!pack.choice
        : pair[0] === "walkOrEasy"
          ? Core.chk(log.checks, week, day.n, "walk", 0) || Core.chk(log.checks, week, day.n, "burneasy", 0)
          : Core.chk(log.checks, week, day.n, pair[0], pair[1]);
      if (isDone) byPhase[phase].done++;
    });
    const done = items.filter(function (pair) {
      if (pair[0] === "choice") return !!pack.choice;
      if (pair[0] === "walkOrEasy") return Core.chk(log.checks, week, day.n, "walk", 0) || Core.chk(log.checks, week, day.n, "burneasy", 0);
      return Core.chk(log.checks, week, day.n, pair[0], pair[1]);
    }).length;
    let strength = false;
    if (day.exclusive) strength = !!pack.choice;
    else {
      (day.lifts || []).forEach(function (l) {
        const n = Core.nSets(l, week, program);
        for (let i = 0; i < n; i++) if (Core.chk(log.checks, week, day.n, l.id, i)) strength = true;
      });
    }
    const pct = Math.round((done / items.length) * 100);
    let state = "idle";
    if (done === 0) state = "idle";
    else if (strength && done >= items.length) state = "done";
    else state = "active";
    return { done: done, total: items.length, pct: pct, state: state, strength: strength, byPhase: byPhase };
  };

  Core.liftBlocked = function liftBlocked(lift, sess) {
    const ov = sess.overrides[lift.id];
    const overridden = ov && (ov.on === true || ov === true);
    if (sess.ready === "red" && lift.swapRed && !overridden) return true;
    if (sess.flags && sess.flags.back && lift.swapRed && !overridden) return true;
    if (sess.flags && sess.flags.shoulder && lift.swapPinch && !overridden) return true;
    return false;
  };

  Core.liftSwapNote = function liftSwapNote(lift, sess) {
    if (sess.ready === "red" && lift.swapRed) return lift.swapRed;
    if (sess.flags && sess.flags.back && lift.swapRed) return lift.swapRed;
    if (sess.flags && sess.flags.shoulder && lift.swapPinch) return lift.swapPinch;
    return "";
  };

  Core.repSpec = function repSpec(lift, week, dayN, log, program) {
    const logged = Core.num((log.reps || {})[Core.loadKey(lift.id, week, dayN)]);
    if (lift.prog) {
      return {
        reps: logged,
        sets: program.sets[week],
        timed: false,
        logged: logged != null,
        prescribed: program.progReps[week]
      };
    }
    const rx = lift.rx || "";
    if (/sec|min/i.test(rx) && rx.indexOf("×") === -1) return { reps: null, sets: Core.nSets(lift, week, program), timed: true, logged: false };
    if (/sec/i.test(rx)) return { reps: null, sets: Core.nSets(lift, week, program), timed: true, logged: false };
    if (logged != null) return { reps: logged, sets: Core.nSets(lift, week, program), timed: false, logged: true };
    const part = rx.indexOf("×") >= 0 ? rx.split("×")[1] : rx;
    const nums = (part.match(/\d+/g) || []).map(Number);
    if (!nums.length) return { reps: null, sets: Core.nSets(lift, week, program), timed: true, logged: false };
    return { reps: null, sets: Core.nSets(lift, week, program), timed: false, logged: false, prescribed: nums.length > 1 ? (nums[0] + nums[1]) / 2 : nums[0] };
  };

  Core.metricValue = function metricValue(mode, n, spec, setsDone) {
    if (n == null) return null;
    if (mode === "load") return n;
    if (spec.timed) return null;
    if (spec.reps == null) return null;
    if (mode === "e1rm") return n * (1 + spec.reps / 30);
    return n * spec.reps * (setsDone || spec.sets);
  };

  Core.weekSummary = function weekSummary(week, log, program, sessions) {
    let started = 0;
    let completed = 0;
    let hard = 0;
    let optional = 0;
    let scaled = 0;
    let z45 = 0;
    let skipped = 0;
    program.days.forEach(function (d) {
      const key = Core.wd(week, d.n);
      const sess = Core.defaultSession((sessions || {})[key]);
      const prog = Core.progress(d, week, sess, log, program);
      if (prog.done > 0 || sess.finished) started++;
      if (prog.state === "done" || sess.finished) completed++;
      const burn = (log.burn || {})[key] || {};
      const checks = (log.checks || {})[key] || {};
      if (d.burn && !d.burn.optional && checks.burn && checks.burn[0]) hard++;
      if (d.burn && d.burn.optional && checks.burn && checks.burn[0]) optional++;
      if (burn.scaled === "yes") scaled++;
      if (burn.zone === "Z4" || burn.zone === "Z5") z45++;
      if (checks.burnskip && checks.burnskip[0]) skipped++;
    });
    return { started: started, completed: completed, hard: hard, optional: optional, scaled: scaled, z45: z45, skipped: skipped };
  };

  Core.hasLogs = function hasLogs(log) {
    function nonempty(m) { return m && Object.keys(m).length > 0; }
    return nonempty(log.checks) || nonempty(log.loads) || nonempty(log.reps) || nonempty(log.bw) || nonempty(log.burn);
  };

  Core.priorLift = function priorLift(lift, week, day, log, program) {
    const prior = [];
    for (let w = 1; w < week; w++) {
      const v = ((log.loads || {})[Core.loadKey(lift.id, w, day)] || "").trim();
      if (!v) continue;
      const total = Core.nSets(lift, w, program);
      const arr = ((log.checks || {})[Core.wd(w, day)] || {})[lift.id] || [];
      const done = arr.slice(0, total).filter(Boolean).length;
      const reps = ((log.reps || {})[Core.loadKey(lift.id, w, day)] || "").trim();
      const rpe = ((log.rpe || {})[Core.loadKey(lift.id, w, day)] || "").trim();
      const scheme = lift.prog ? program.weeks[w - 1].main + " @ " + program.weeks[w - 1].rpe : (lift.rx || "");
      prior.push({ w: w, v: v, done: done, total: total, reps: reps, rpe: rpe, scheme: scheme, clean: done >= total });
    }
    return prior;
  };

  if (typeof module !== "undefined" && module.exports) module.exports = Core;
  root.FinalCutCore = Core;
})(typeof window !== "undefined" ? window : globalThis);
