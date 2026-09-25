/* Final Cut — pure logic. Usable in the browser and in Node tests. */
(function (root) {
  const Core = {};
  const KEY = "final-cut:v3";
  const SNAP_KEY = "final-cut:last-good";
  const VERSION = 3;
  const APP_VERSION = "2.2.2";

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
    return { checks: {}, loads: {}, reps: {}, rpe: {}, bw: {}, burn: {}, choice: {}, subs: {}, setlog: {} };
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
      subs: Core.cleanMap(out.subs),
      setlog: Core.cleanMap(out.setlog)
    };
  };

  Core.validatePayload = function validatePayload(data) {
    if (!data || typeof data !== "object") throw new Error("empty");
    if (data.v !== 2 && data.v !== 3) throw new Error("Missing or unknown version.");
    if (data.state && typeof data.state !== "object") throw new Error("state must be an object.");
    ["checks", "loads", "reps", "rpe", "bw", "burn", "choice", "setlog"].forEach(function (k) {
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

  /* Week-aware burnout. Prefer burn.byWeek[week], else a menu row whose
     weeks include this week, else the base burn object. Old days with a
     single burn object keep rendering as they always have. */
  Core.resolveBurn = function resolveBurn(day, week) {
    const raw = day && day.burn;
    if (!raw) return null;
    const w = +week;
    let overlay = null;
    const byWeek = raw.byWeek;
    if (byWeek && typeof byWeek === "object" && !Array.isArray(byWeek)) {
      overlay = byWeek[w] || byWeek[String(w)] || null;
    } else if (Array.isArray(raw.menu) && raw.menu.length) {
      overlay = raw.menu.find(function (m) {
        return m && Array.isArray(m.weeks) && m.weeks.indexOf(w) >= 0;
      }) || null;
      if (!overlay && !raw.nm) {
        overlay = raw.menu.find(function (m) {
          return m && (!m.weeks || !m.weeks.length);
        }) || raw.menu[0];
      }
    }
    const resolved = Object.assign({}, raw, overlay || {});
    resolved.baseAdj = raw.adj || "";
    const menuThisWeek = Array.isArray(raw.menu) && raw.menu.some(function (m) {
      if (!m) return false;
      if (!Array.isArray(m.weeks) || !m.weeks.length) return true;
      return m.weeks.indexOf(w) >= 0;
    });
    if (!menuThisWeek && resolved.baseAdj) {
      resolved.baseAdj = resolved.baseAdj
        .replace(/(?:^|\s)[^.]*\bgreen option\b[^.]*\./gi, "")
        .replace(/\s{2,}/g, " ")
        .trim();
    }
    if (overlay && overlay.adj && overlay.adj !== raw.adj) {
      resolved.weekNote = overlay.adj;
    } else {
      resolved.weekNote = overlay && overlay.weekNote ? overlay.weekNote : "";
    }
    delete resolved.byWeek;
    delete resolved.menu;
    delete resolved.id;
    delete resolved.label;
    delete resolved.weeks;
    return resolved;
  };

  /* Green-option label. The renderer already says "Green option ·";
     strip a second "(green)" / "(green alt)" / "(alt)" on the name. */
  Core.burnGreenTitle = function burnGreenTitle(row) {
    return String((row && (row.label || row.nm)) || "")
      .replace(/\s*\((?:green(?:\s+alt)?|alt)\)\s*/gi, "")
      .trim();
  };

  /* Week-aware lift / accessory. Overlay lift.byWeek[week] on the base
     card so elastic rotations and chassis flips resolve the same way
     burns do. Days without byWeek stay byte-identical. */
  Core.resolveLift = function resolveLift(lift, week) {
    if (!lift) return lift;
    const w = +week;
    const byWeek = lift.byWeek;
    let overlay = null;
    if (byWeek && typeof byWeek === "object" && !Array.isArray(byWeek)) {
      overlay = byWeek[w] || byWeek[String(w)] || null;
    }
    const resolved = Object.assign({}, lift, overlay || {});
    delete resolved.byWeek;
    return resolved;
  };

  Core.resolveLifts = function resolveLifts(day, week) {
    return ((day && day.lifts) || []).map(function (l) {
      return Core.resolveLift(l, week);
    });
  };

  /* Prep pump hides (and drops out of progress) on Amber/Red or any flag. */
  Core.prepPumpGated = function prepPumpGated(sess) {
    if (!sess) return false;
    if (sess.ready === "red" || sess.ready === "amber") return true;
    const flags = sess.flags || {};
    return Object.keys(flags).some(function (k) { return !!flags[k]; });
  };

  /* Effort chip. Burn.effort wins. Optional and Week 6 never show a week
     percent — they show RPE. Day 4 Weeks 1–4 restore 90–95% unless the
     resolved card sets a different effort. */
  Core.burnEffort = function burnEffort(burn, weekObj, dayN) {
    if (!burn) return "";
    if (burn.effort) return burn.effort;
    const week = weekObj && weekObj.n != null ? +weekObj.n : null;
    if (burn.optional || week === 6) return burn.rpe || "RPE ~7";
    if (dayN === 5) return burn.rpe || "RPE ~7";
    if (dayN === 4 && week != null && week <= 4) return "90–95%";
    return (weekObj && weekObj.burn) || "";
  };

  Core.burnShowsZoneCue = function burnShowsZoneCue(burn, week) {
    if (!burn) return false;
    if (burn.optional) return false;
    if (+week === 6) return false;
    return true;
  };

  /* Manual "1 · " inside an <ol> doubles the number. Strip it. */
  Core.burnItemText = function burnItemText(item) {
    return String(item == null ? "" : item).replace(/^\s*\d+\s*[·.]\s*/, "");
  };

  Core.burnMenuRows = function burnMenuRows(day, week, resolved) {
    const raw = day && day.burn;
    if (!raw || !Array.isArray(raw.menu) || !raw.menu.length) return [];
    const w = +week;
    return raw.menu.filter(function (m) {
      if (!m || !(m.nm || m.label)) return false;
      if (Array.isArray(m.weeks) && m.weeks.length && m.weeks.indexOf(w) < 0) return false;
      if (resolved && m.nm && resolved.nm && m.nm === resolved.nm) return false;
      return true;
    });
  };

  /* Movements actually written on this week's resolved card. */
  Core.cardMoves = function cardMoves(burn) {
    const t = ((burn && burn.items) || []).map(Core.burnItemText).join(" ").toLowerCase();
    function has(rx) { return rx.test(t); }
    return {
      crawl: has(/crawl/),
      march: has(/\bmarch\b/),
      bike: has(/\bbike\b/),
      walk: has(/\bwalk\b/),
      push: has(/push-up|push up|pushup/),
      slam: has(/\bslam/),
      swing: has(/\bswing/),
      burpee: has(/burpee/),
      jump: has(/\bjump|pogo|bound/),
      stepover: has(/step-over|step over/),
      tap: has(/\btap/),
      row: has(/inverted|ring row|bike or row|easy row|assault bike/),
      carry: has(/\bcarry|farmer/),
      squatThrust: has(/squat thrust/),
      climber: has(/climber/)
    };
  };

  function oxford(arr) {
    if (!arr.length) return "";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr[0] + " or " + arr[1];
    return arr.slice(0, -1).join(", ") + ", or " + arr[arr.length - 1];
  }

  function achillesDropsAndPrefers(day, burn) {
    const n = day && day.n;
    const m = Core.cardMoves(burn);
    const hasCard = !!(burn && (burn.items || []).length);
    const drops = [];
    const prefer = [];
    if (hasCard) {
      if (m.jump) drops.push("drop jumps");
      if (m.burpee) drops.push("swap burpees for a low-impact station");
      if (m.crawl) drops.push("shorten the crawl");
      if (m.slam) drops.push("ease slams");
      if (m.squatThrust) drops.push("slow the squat thrusts");
      if (m.march) prefer.push("easy march");
      if (m.bike) prefer.push("bike");
      if (m.walk) prefer.push("walk");
      if (m.stepover) prefer.push("step-overs");
      if (m.tap) prefer.push("slow taps");
      if (m.push && n !== 2) prefer.push("push-ups");
      if (m.row) prefer.push("easy row");
      if (m.swing && n !== 1) prefer.push("easy swings");
      if (m.carry && n !== 1 && n !== 4) prefer.push("easy carries");
    } else {
      if (n === 1) {
        drops.push("drop jumps");
        prefer.push("march or bike");
      } else if (n === 2) {
        drops.push("drop jumps/burpees");
        prefer.push("bike or walk");
      } else if (n === 4) {
        drops.push("drop jumps/burpees");
        prefer.push("step-overs or bike");
      } else {
        drops.push("drop jumps");
        prefer.push("easy walk");
      }
    }
    return { drops: drops, prefer: prefer, n: n };
  }

  /* Burnout Achilles note — only names movements on this week's card.
     Never suggests swings on D1 or carries on D4. */
  Core.achillesLine = function achillesLine(day, burn) {
    const pack = achillesDropsAndPrefers(day, burn);
    let s = "If Achilles is cranky, keep strength";
    if (pack.drops.length) s += ", " + pack.drops.join(", ");
    if (pack.prefer.length) s += ", and prefer " + oxford(pack.prefer);
    s += ".";
    if (pack.n === 1) s += " No swings on squat day.";
    return s;
  };

  /* Readiness-card summary. Same movement rules as the burnout line. */
  Core.achillesReadiness = function achillesReadiness(day, burn) {
    const pack = achillesDropsAndPrefers(day, burn);
    const bits = ["Achilles: keep strength"];
    if (pack.drops.length) bits.push(pack.drops.join(", "));
    if (pack.prefer.length) bits.push("prefer " + oxford(pack.prefer));
    if (pack.n === 1) bits.push("no swings");
    return bits.join(", ") + ".";
  };

  /* Strip climb language on W5/W6 so no view tells the athlete to climb. */
  Core.resolveMobNote = function resolveMobNote(day, week) {
    let note = (day && day.mobNote) || "";
    if (+week >= 5) {
      note = note.replace(/\s*Own today's level before you climb\.?/gi, "").trim();
      note = note.replace(/\s*before you climb\.?/gi, "").trim();
    }
    return note;
  };

  Core.restTitle = function restTitle(day, week) {
    if (!day) return "";
    const by = day.restTitleByWeek;
    if (by) {
      const ov = by[+week] || by[String(week)];
      if (ov) return ov;
    }
    return day.restTitle || "";
  };

  function escapeRe(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function compactName(s) {
    return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function tissueNamesRelated(baseFor, liftNm) {
    const a = compactName(baseFor);
    const b = compactName(liftNm);
    if (!a || !b) return false;
    return a === b || b.indexOf(a) >= 0 || a.indexOf(b) >= 0;
  }

  function tissueGoalLabel(liftNm) {
    const nm = String(liftNm || "");
    if (/front-foot elevated split squat/i.test(nm)) return "front-foot elevated split squat";
    if (/chest-supported row/i.test(nm)) return "chest-supported row";
    if (/incline press/i.test(nm) && !/floor press/i.test(nm)) return "incline press";
    if (/goblet/i.test(nm)) return "goblet";
    if (/floor press/i.test(nm)) return "floor press";
    if (/\brow\b/i.test(nm)) return "row";
    return nm;
  }

  function tissueNameBits(baseFor) {
    const raw = String(baseFor || "").trim();
    if (!raw) return [];
    const words = raw.split(/\s+/);
    const bits = [raw];
    if (words.length >= 2) bits.push(words.slice(-2).join(" "));
    const first = words[0];
    if (first && first.length > 3) bits.push(first);
    const last = words[words.length - 1];
    if (last && /^(squat|press|row|lunge)$/i.test(last)) bits.push(last);
    bits.sort(function (a, b) { return b.length - a.length; });
    return bits.filter(function (b, i, arr) { return b && arr.indexOf(b) === i; });
  }

  function replaceFirstBit(text, bits, label) {
    if (!text) return text;
    for (let i = 0; i < bits.length; i++) {
      const rx = new RegExp("\\b" + escapeRe(bits[i]) + "\\b", "i");
      if (rx.test(text)) return text.replace(rx, label);
    }
    return text;
  }

  Core.resolveTissue = function resolveTissue(day, week) {
    const tissue = day && day.tissue;
    if (!tissue) return null;
    const byId = {};
    Core.resolveLifts(day, week).forEach(function (l) { byId[l.id] = l; });
    let goal = tissue.goal || "";
    const goalDone = {};
    const items = (tissue.items || []).map(function (it) {
      const out = Object.assign({}, it);
      const lift = it.forId ? byId[it.forId] : null;
      const baseFor = it.for || "";
      if (lift && lift.nm) {
        out.for = lift.nm;
        if (!tissueNamesRelated(baseFor, lift.nm)) {
          const label = tissueGoalLabel(lift.nm);
          const bits = tissueNameBits(baseFor);
          out.cue = replaceFirstBit(out.cue, bits, label);
          if (!goalDone[it.forId]) {
            goal = replaceFirstBit(goal, bits, label);
            goalDone[it.forId] = true;
          }
        }
      }
      return out;
    });
    return Object.assign({}, tissue, { items: items, goal: goal });
  };

  /* Short burnout header chip. First-word split is fine for
     "10-minute AMRAP" but turns "40 sec / 20 sec × 10 min" into a
     lone "40" next to the 0/1 progress count. */
  Core.burnFmtChip = function burnFmtChip(fmt) {
    if (fmt == null || String(fmt).trim() === "") return "10 min";
    const raw = String(fmt).trim();
    const interval = raw.match(/(\d+)\s*s(?:ec(?:onds?)?)?\b[^/]*\/\s*(\d+)\s*s(?:ec(?:onds?)?)?/i);
    if (interval) return interval[1] + "/" + interval[2];
    const minLead = raw.match(/^(\d+(?:[–-]\d+)?)\s+min\b/i);
    if (minLead) return minLead[1] + "-min";
    const first = raw.split(/\s+/)[0];
    if (first && !/^\d+$/.test(first)) return first;
    return raw;
  };

  Core.sessionItems = function sessionItems(day, week, sess, log, program) {
    const items = [];
    const key = Core.wd(week, day.n);
    const checks = log.checks[key] || {};
    const choice = log.choice[key] || "";
    const ready = sess.ready || "green";
    if (day.tissue) day.tissue.items.forEach(function (_, i) { items.push(["tissue", i]); });
    if (day.prepPump && day.prepPump.items && !Core.prepPumpGated(sess)) {
      day.prepPump.items.forEach(function (_, i) { items.push(["preppump", i]); });
    }
    if (day.mob) day.mob.forEach(function (_, i) { items.push(["mob", i]); });
    if (day.exclusive) {
      items.push(["choice", 0]);
    } else {
      Core.resolveLifts(day, week).forEach(function (l) {
        const blocked = Core.liftBlocked(l, sess);
        if (blocked) return;
        const n = Core.nSets(l, week, program);
        for (let i = 0; i < n; i++) items.push([l.id, i]);
      });
    }
    const burn = Core.resolveBurn(day, week);
    if (burn) {
      if (ready === "red") items.push(["walkOrEasy", 0]);
      else if (burn.optional && checks.burnskip && checks.burnskip[0]) items.push(["burnskip", 0]);
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
      prep: { done: 0, total: 0 },
      mobility: { done: 0, total: 0 },
      work: { done: 0, total: 0 },
      burnout: { done: 0, total: 0 },
      downshift: { done: 0, total: 0 }
    };
    function phaseFor(id) {
      if (id === "tissue") return "tissue";
      if (id === "preppump") return "prep";
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
      Core.resolveLifts(day, week).forEach(function (l) {
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

  /* Rows a lift logged set by set. Absent for legacy data and for
     accessories, which still carry one value for the whole lift. */
  Core.setRows = function setRows(log, id, week, day, n) {
    const key = Core.loadKey(id, week, day);
    const raw = (log.setlog || {})[key] || [];
    const out = [];
    for (let i = 0; i < n; i++) {
      const r = raw[i] && typeof raw[i] === "object" ? raw[i] : {};
      out.push({ load: r.load == null ? "" : String(r.load),
                 reps: r.reps == null ? "" : String(r.reps),
                 rpe: r.rpe == null ? "" : String(r.rpe) });
    }
    /* A log written before 2.0 carried one value for the whole lift. Show it
       where it belongs — set one — instead of losing it. */
    if (out.length && !raw.length) {
      const legacy = { load: (log.loads || {})[key], reps: (log.reps || {})[key], rpe: (log.rpe || {})[key] };
      ["load", "reps", "rpe"].forEach(function (f) {
        if (!out[0][f] && legacy[f] != null) out[0][f] = String(legacy[f]);
      });
    }
    return out;
  };

  /* Tonnage from what was actually lifted, set by set, counting only sets
     ticked off. Falls back to the single-value estimate when a lift has no
     per-set rows — which is every lift logged before 2.0. */
  Core.tonnageFromSetlog = function tonnageFromSetlog(rows, checks) {
    let total = 0;
    let any = false;
    (rows || []).forEach(function (r, i) {
      if (checks && !checks[i]) return;
      const load = Core.num(r && r.load);
      const reps = Core.num(r && r.reps);
      if (load == null || reps == null) return;
      any = true;
      total += load * reps;
    });
    return any ? total : null;
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
      const burnLog = (log.burn || {})[key] || {};
      const checks = (log.checks || {})[key] || {};
      const burn = Core.resolveBurn(d, week);
      if (burn && !burn.optional && checks.burn && checks.burn[0]) hard++;
      if (burn && burn.optional && checks.burn && checks.burn[0]) optional++;
      if (burnLog.scaled === "yes") scaled++;
      if (burnLog.zone === "Z4" || burnLog.zone === "Z5") z45++;
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
      const scheme = lift.prog ? program.weeks[w - 1].main + " \u00b7 " + program.weeks[w - 1].rpe : (lift.rx || "");
      prior.push({ w: w, v: v, done: done, total: total, reps: reps, rpe: rpe, scheme: scheme, clean: done >= total });
    }
    return prior;
  };

  if (typeof module !== "undefined" && module.exports) module.exports = Core;
  root.FinalCutCore = Core;
})(typeof window !== "undefined" ? window : globalThis);
