(() => {
  const P = window.PROGRAM;
  const KEY = "final-cut:v2";
  const WEEKDAYS = P.calendar;

  const defaultState = () => ({
    week: 1,
    day: 1,
    ready: "green",
    metric: "e1rm",
    start: defaultMonday(),
    flags: {},
    overrides: {}
  });

  const emptyLog = () => ({
    checks: {},
    loads: {},
    reps: {},
    rpe: {},
    bw: {},
    burn: {},
    choice: {}
  });

  let S = defaultState();
  let LOG = emptyLog();
  let saveTimer = null;
  let persistOk = true;
  let persistMsg = "";

  function defaultMonday() {
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return iso(d);
  }

  function iso(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function parseISO(s) {
    if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
    const d = new Date(s + "T00:00:00");
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function suggested() {
    const start = parseISO(S.start);
    if (!start) return { week: S.week, day: S.day, unknown: true };
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = Math.round((now - start) / 86400000);
    if (diff < 0) return { week: 1, day: 1, before: true };
    if (diff >= 42) return { week: 6, day: 7, after: true };
    return { week: Math.floor(diff / 7) + 1, day: (diff % 7) + 1 };
  }

  function isTodayView() {
    const t = suggested();
    return t.week === S.week && t.day === S.day && !t.unknown;
  }

  function wd(w = S.week, d = S.day) { return `w${w}d${d}`; }
  function loadKey(id, w = S.week, d = S.day) { return `w${w}d${d}:${id}`; }
  function heatVar(h) { return `var(--${h})`; }
  function dayObj() { return P.days[S.day - 1]; }
  function weekObj() { return P.weeks[S.week - 1]; }
  function liftById(id) { return (dayObj().lifts || []).find(l => l.id === id); }

  function clampState(next) {
    const s = { ...defaultState(), ...(next || {}) };
    s.week = Math.min(6, Math.max(1, +s.week || 1));
    s.day = Math.min(7, Math.max(1, +s.day || 1));
    if (!["green", "amber", "red"].includes(s.ready)) s.ready = "green";
    if (!["e1rm", "tonnage", "load"].includes(s.metric)) s.metric = "e1rm";
    if (!parseISO(s.start)) s.start = defaultMonday();
    if (!s.flags || typeof s.flags !== "object") s.flags = {};
    if (!s.overrides || typeof s.overrides !== "object") s.overrides = {};
    return s;
  }

  function cleanMap(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return {};
    return obj;
  }

  function payload() {
    return JSON.stringify({
      v: 2,
      state: S,
      checks: LOG.checks,
      loads: LOG.loads,
      reps: LOG.reps,
      rpe: LOG.rpe,
      bw: LOG.bw,
      burn: LOG.burn,
      choice: LOG.choice
    });
  }

  function applyPayload(data) {
    if (!data || typeof data !== "object") throw new Error("empty");
    S = clampState(data.state);
    LOG = {
      checks: cleanMap(data.checks),
      loads: cleanMap(data.loads),
      reps: cleanMap(data.reps),
      rpe: cleanMap(data.rpe),
      bw: cleanMap(data.bw),
      burn: cleanMap(data.burn),
      choice: cleanMap(data.choice)
    };
  }

  function readStore() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      throw new Error("Saved log is unreadable on this device.");
    }
  }

  function writeStore(text) {
    localStorage.setItem(KEY, text);
  }

  function flagSave(ok, msg) {
    persistOk = ok;
    persistMsg = msg || "";
    const el = document.getElementById("savestate");
    const live = document.getElementById("save-live");
    if (!ok) {
      el.className = "save-banner show";
      el.dataset.ok = "false";
      el.innerHTML = `<b>Not saving on this device.</b> ${esc(msg)}. Use Backup before you close the tab.`;
      document.getElementById("backup-wrap").open = true;
      if (live) live.textContent = "Training log is not saving.";
    } else {
      el.className = "save-banner";
      el.dataset.ok = "true";
      el.innerHTML = "";
      if (live) live.textContent = "Training log saved on this device.";
    }
  }

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        writeStore(payload());
        flagSave(true);
      } catch (e) {
        flagSave(false, e && e.message ? e.message : "storage unavailable");
      }
      syncBackup();
    }, 250);
  }

  function load() {
    let first = false;
    try {
      const data = readStore();
      if (data) applyPayload(data);
      else first = true;
      flagSave(true);
    } catch (e) {
      S = defaultState();
      LOG = emptyLog();
      first = true;
      flagSave(false, e.message || "Saved log was corrupt and was not loaded.");
    }
    if (first) {
      const t = suggested();
      S.week = t.week;
      S.day = t.day;
    }
    render();
  }

  function num(v) {
    if (v == null || v === "") return null;
    const m = String(v).match(/\d+(\.\d+)?/g);
    return m ? Math.max(...m.map(Number)) : null;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function chk(id, i) {
    const k = LOG.checks[wd()];
    return !!(k && k[id] && k[id][i]);
  }

  function setChk(id, i, on) {
    const k = wd();
    LOG.checks[k] = LOG.checks[k] || {};
    LOG.checks[k][id] = LOG.checks[k][id] || [];
    LOG.checks[k][id][i] = !!on;
  }

  function nSets(l) {
    if (l.prog) return P.sets[S.week];
    return l.sets || 1;
  }

  function sessionItems() {
    const D = dayObj();
    const items = [];
    if (D.tissue) D.tissue.items.forEach((_, i) => items.push(["tissue", i]));
    if (D.mob) D.mob.forEach((_, i) => items.push(["mob", i]));
    (D.lifts || []).forEach(l => {
      if (D.exclusive) items.push([l.id, 0]);
      else if (!(S.ready === "red" && l.swapRed && !S.overrides[l.id])) {
        for (let i = 0; i < nSets(l); i++) items.push([l.id, i]);
      }
    });
    if (D.burn && S.ready !== "red") {
      items.push(D.burn.optional && chk("burnskip", 0) ? ["burnskip", 0] : ["burn", 0]);
    } else if (D.burn && S.ready === "red") items.push(["walk", 0]);
    if (D.down) items.push(["down", 0]);
    return items;
  }

  function progress() {
    const items = sessionItems();
    if (!items.length) return { done: 0, total: 0, pct: 0 };
    const done = items.filter(([id, i]) => chk(id, i)).length;
    return { done, total: items.length, pct: Math.round((done / items.length) * 100) };
  }

  function bwFor(w) {
    const own = num(LOG.bw[w]);
    if (own != null) return { v: own, exact: true };
    for (let i = w - 1; i >= 1; i--) {
      const v = num(LOG.bw[i]);
      if (v != null) return { v, exact: false, from: i };
    }
    for (let i = w + 1; i <= 6; i++) {
      const v = num(LOG.bw[i]);
      if (v != null) return { v, exact: false, from: i };
    }
    return null;
  }

  function lastLine(l) {
    const prior = [];
    for (let w = 1; w < S.week; w++) {
      const v = (LOG.loads[loadKey(l.id, w, S.day)] || "").trim();
      if (!v) continue;
      const total = l.prog ? P.sets[w] : (l.sets || 1);
      const arr = (LOG.checks[`w${w}d${S.day}`] || {})[l.id] || [];
      const done = arr.slice(0, total).filter(Boolean).length;
      const reps = (LOG.reps[loadKey(l.id, w, S.day)] || "").trim();
      const rpe = (LOG.rpe[loadKey(l.id, w, S.day)] || "").trim();
      const scheme = l.prog ? `${P.weeks[w - 1].main} @ ${P.weeks[w - 1].rpe}` : (l.rx || "");
      prior.push({ w, v, done, total, reps, rpe, scheme });
    }
    if (!prior.length) return `<div class="last" data-last="${esc(l.id)}">No prior weeks logged for this movement.</div>`;
    const recent = prior[prior.length - 1];
    const nowScheme = l.prog ? `${weekObj().main} @ ${weekObj().rpe}` : (l.rx || "");
    const shifted = recent.scheme && nowScheme && recent.scheme !== nowScheme;
    return `<div class="last" data-last="${esc(l.id)}">
      ${prior.map(p => `<span class="wk ${p.done >= p.total ? "clean" : (p.done ? "part" : "")}" title="Week ${p.w}">
        <em>W${p.w}</em>${esc(p.v)}${p.reps ? ` × ${esc(p.reps)}` : ""}${p.rpe ? ` @ ${esc(p.rpe)}` : ""}</span>`).join("")}
      <button class="carry" data-carry="${esc(l.id)}" data-val="${esc(recent.v)}">use ${esc(recent.v)}</button>
      ${shifted ? `<span class="shift">W${recent.w} was ${esc(recent.scheme)} — today is ${esc(nowScheme)}</span>` : ""}
    </div>`;
  }

  function updateProgress() {
    const { pct } = progress();
    const circ = 2 * Math.PI * 15;
    const fill = document.getElementById("prog-fill");
    const label = document.getElementById("prog-pct");
    if (fill) fill.setAttribute("stroke-dasharray", `${(pct / 100) * circ} ${circ}`);
    if (label) label.textContent = `${pct}`;
    const today = document.getElementById("today-btn");
    if (today) today.hidden = isTodayView();
    const stickyWeek = document.getElementById("sticky-week");
    if (stickyWeek) stickyWeek.textContent = `W${S.week} · ${WEEKDAYS[S.day - 1]}`;
  }

  function updateToggle(btn) {
    if (!btn) return;
    const on = chk(btn.dataset.id, +btn.dataset.i);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  }

  function mountain() {
    return `<svg class="brand-mark" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5 38 L30 6 L55 38" stroke="var(--accent)" stroke-width="1.2" fill="none" opacity="0.5"/>
      <path d="M12 38 L30 14 L48 38" stroke="var(--accent)" stroke-width="1.2" fill="none" opacity="0.7"/>
      <path d="M19 38 L30 22 L41 38" stroke="var(--accent)" stroke-width="1.2" fill="none" opacity="0.9"/>
      <line x1="5" y1="38" x2="55" y2="38" stroke="var(--accent)" stroke-width="1" opacity="0.3"/>
    </svg>`;
  }

  function renderChrome() {
    const W = weekObj();
    const D = dayObj();
    const t = suggested();
    document.documentElement.style.setProperty("--seg", heatVar(D.heat));
    document.getElementById("wk-lab").textContent = `Week ${W.n} of 6`;
    document.getElementById("intent").textContent = W.intent;
    document.getElementById("intent-sub").textContent = `Main lifts ${W.main} · ${W.rpe} · ${W.acc} · burnouts at ${W.burn}`;
    document.getElementById("ramp").innerHTML = P.weeks.map(w =>
      `<button type="button" data-w="${w.n}" aria-pressed="${w.n === S.week}" style="--seg:${heatVar(w.heat)}">
         <span class="bar"></span><span class="lbl">W${w.n}</span></button>`).join("");
    document.getElementById("days").innerHTML = P.days.map(d =>
      `<button type="button" class="day${t.week === S.week && t.day === d.n && !t.unknown ? " is-today" : ""}" data-d="${d.n}" aria-pressed="${d.n === S.day}" style="--seg:${heatVar(d.heat)}">
         <span class="dot"></span><span class="wd">${WEEKDAYS[d.n - 1]}</span><span class="n">${d.n}</span></button>`).join("");
    document.getElementById("ready").innerHTML = P.ready.map(r =>
      `<button type="button" class="rbtn" data-r="${r.id}" aria-pressed="${r.id === S.ready}">${r.lab}</button>`).join("");
    document.getElementById("ready-note").textContent = P.ready.find(r => r.id === S.ready).note;
    document.getElementById("start-in").value = S.start;
    document.getElementById("bw-in").value = LOG.bw[S.week] || "";
    document.getElementById("bw-wk").textContent = S.week;
    const bwf = bwFor(S.week);
    document.getElementById("bw-note").textContent =
      !bwf ? "needed for pull-up and chin-up strength math"
      : (bwf.exact ? "" : `carried from W${bwf.from} — ${bwf.v}`);
    document.getElementById("flags").innerHTML = [
      ["achilles", "Achilles cranky"],
      ["back", "Back cooked"],
      ["shoulder", "Shoulder pinchy"]
    ].map(([id, lab]) =>
      `<button type="button" class="flag" data-flag="${id}" aria-pressed="${S.flags[id] ? "true" : "false"}">${lab}</button>`
    ).join("");
    const startNote = document.getElementById("start-note");
    if (t.before) startNote.textContent = "Block has not started — Today opens Week 1, Day 1.";
    else if (t.after) startNote.textContent = "Block window has passed — Today opens Week 6, Day 7.";
    else startNote.textContent = `Today is Week ${t.week}, ${WEEKDAYS[t.day - 1]}.`;
  }

  function sec(title, dose, inner) {
    return `<section class="sec"><div class="sec-h"><h3>${esc(title)}</h3>${dose ? `<span class="dose">${esc(dose)}</span>` : ""}</div>${inner}</section>`;
  }

  function liftBlocked(l) {
    if (S.ready === "red" && l.swapRed && !S.overrides[l.id]) return true;
    if (S.flags.back && l.swapRed && !S.overrides[l.id]) return true;
    return false;
  }

  function liftSwapNote(l) {
    if (S.ready === "red" && l.swapRed) return l.swapRed;
    if (S.flags.back && l.swapRed) return l.swapRed;
    if (S.flags.shoulder && l.swapPinch) return l.swapPinch;
    return "";
  }

  function renderSession() {
    const W = weekObj();
    const D = dayObj();
    const red = S.ready === "red";
    const amber = S.ready === "amber";
    let h = `<div class="s-head">
      <div class="s-tag">Day ${D.n} · ${D.weekday} · ${D.tag}</div>
      <h2 class="s-title">${esc(D.theme)}</h2>
      <div class="s-sub">${esc(D.sub)}</div>
    </div>`;
    if (D.guardTop) h += `<div class="sec"><div class="guard"><span>${esc(D.guardTop)}</span></div></div>`;

    if (D.tissue) {
      h += sec("Tissue", D.tissue.dose, `
        ${D.tissue.goal ? `<div class="sec-goal">${esc(D.tissue.goal)}</div>` : ""}
        ${D.tissue.items.map((t, i) => `
          <div class="line">
            <button type="button" class="box" data-id="tissue" data-i="${i}" aria-pressed="${chk("tissue", i)}" aria-label="${esc(t.a)}"></button>
            <div class="body">
              <div class="nm">${esc(t.a)}</div>
              <div class="tool">${esc(t.tool)} · ${esc(t.d)}</div>
              <div class="why">${esc(t.cue)}</div>
            </div>
          </div>`).join("")}
        ${D.tissue.note ? `<div class="guard"><span>${esc(D.tissue.note)}</span></div>` : ""}`);
    }

    if (D.mob && D.mob.length) {
      h += sec("Mobility", "6–15 min", D.mob.map((m, i) => {
        const [nm, why] = m.split(" — ");
        return `<div class="line">
          <button type="button" class="box" data-id="mob" data-i="${i}" aria-pressed="${chk("mob", i)}" aria-label="${esc(nm)}"></button>
          <div class="body"><div class="nm">${esc(nm)}</div>${why ? `<div class="why">${esc(why)}</div>` : ""}</div>
        </div>`;
      }).join(""));
    }

    const strengthTitle = D.restTitle || "Strength";
    const strengthDose = (D.n === 3 || D.n >= 6) ? "" : (red ? "strength only" : "30–40 min");
    if (D.exclusive) {
      const chosen = LOG.choice[wd()] || "";
      h += sec(strengthTitle, "choose one", D.lifts.map(l => `
        <div class="line">
          <button type="button" class="box" data-choice="${esc(l.id)}" data-id="${esc(l.id)}" data-i="0" aria-pressed="${chosen === l.id}" aria-label="${esc(l.nm)}"></button>
          <div class="body">
            <div class="nm">${esc(l.nm)}</div>
            <div class="rx">${esc(l.rx)}</div>
            ${l.note ? `<div class="note">${esc(l.note)}</div>` : ""}
            ${chosen === l.id ? `<div class="choice-note">Today's pick.</div>` : ""}
          </div>
        </div>`).join(""));
    } else {
      h += sec(strengthTitle, strengthDose, D.lifts.map(l => {
        const blocked = liftBlocked(l);
        const swap = liftSwapNote(l);
        const rx = l.prog ? `${W.main} <em>@ ${W.rpe}</em>` : esc(l.rx || "");
        const prescribed = l.prog ? P.progReps[S.week] : "";
        return `<div class="line ${blocked ? "strike killed" : ""}" data-lift="${esc(l.id)}">
          <div class="body">
            <div class="nm">${esc(l.nm)}</div>
            <div class="rx">${rx}</div>
            ${l.note ? `<div class="note">${esc(l.note)}</div>` : ""}
            ${swap ? `<div class="guard"><span>${esc(swap)}</span></div>` : ""}
            ${l.guard ? `<div class="guard"><span>${esc(l.guard)}</span></div>` : ""}
            ${amber && !l.prog && l.sets > 2 ? `<div class="note">${esc(W.acc)}.</div>` : ""}
            ${blocked ? `<button type="button" class="override" data-override="${esc(l.id)}" aria-pressed="${S.overrides[l.id] ? "true" : "false"}">Log the swap / override</button>` : ""}
            ${l.load && !blocked ? lastLine(l) : ""}
            ${blocked ? "" : `<div class="sets">
              ${Array.from({ length: nSets(l) }, (_, i) =>
                `<button type="button" class="set" data-id="${esc(l.id)}" data-i="${i}" aria-pressed="${chk(l.id, i)}" aria-label="Set ${i + 1}">${i + 1}</button>`
              ).join("")}
              ${l.load ? `<input class="log-in wide" data-load="${esc(l.id)}" value="${esc(LOG.loads[loadKey(l.id)] || "")}" placeholder="${l.bw ? "+ added" : "load"}" inputmode="text" aria-label="Load for ${esc(l.nm)}">` : ""}
              ${l.prog || l.load ? `<input class="log-in" data-reps="${esc(l.id)}" value="${esc(LOG.reps[loadKey(l.id)] || "")}" placeholder="${prescribed ? prescribed + " r" : "reps"}" inputmode="decimal" aria-label="Reps for ${esc(l.nm)}">` : ""}
              ${l.prog ? `<input class="log-in rpe-in" data-rpe="${esc(l.id)}" value="${esc(LOG.rpe[loadKey(l.id)] || "")}" placeholder="RPE" inputmode="decimal" aria-label="RPE for ${esc(l.nm)}">` : ""}
            </div>`}
          </div>
        </div>`;
      }).join(""));
    }

    if (D.burn) {
      if (red) {
        h += sec("Burnout", "cut", `<div class="cut"><b>No burnout today.</b> Red readiness. If you want a little air, do a 10-minute easy incline walk instead.</div>
          <div class="line">
            <button type="button" class="box" data-id="walk" data-i="0" aria-pressed="${chk("walk", 0)}" aria-label="Easy walk instead"></button>
            <div class="body"><div class="nm">10-minute easy incline walk</div><div class="why">Optional downshift. Does not count as a hard burnout.</div></div>
          </div>`);
      } else {
        const b = LOG.burn[wd()] || {};
        const pct = amber ? "moderate effort" : `at ${W.burn}`;
        const achillesNote = S.flags.achilles && D.burn.achilles ? `<div class="guard"><span>${esc(D.burn.achilles)}</span></div>` : "";
        h += sec(`Burnout${D.burn.optional ? " — optional" : ""}`, `${D.burn.fmt.split(" ")[0]} · ${pct}`,
          `<div class="line"><div class="body">
            <div class="nm">${esc(D.burn.nm)}</div>
            <div class="rx">${esc(D.burn.fmt)}</div>
            <div class="note">${D.burn.items.map(esc).join("<br>")}</div>
            <div class="guard"><span>${esc(D.burn.adj)}</span></div>
            ${achillesNote}
            <div class="sets">
              <button type="button" class="set" data-id="burn" data-i="0" aria-pressed="${chk("burn", 0)}" aria-label="Burnout done" style="width:auto;padding:0 14px">done</button>
              ${D.burn.optional ? `<button type="button" class="set" data-id="burnskip" data-i="0" aria-pressed="${chk("burnskip", 0)}" aria-label="Skip optional burnout" style="width:auto;padding:0 14px">skip</button>` : ""}
            </div>
            <div class="burn-log">
              <div class="field"><label for="burn-rounds">Rounds / score</label><input id="burn-rounds" data-burn="rounds" value="${esc(b.rounds || "")}" placeholder="e.g. 4+8"></div>
              <div class="field"><label for="burn-zone">WHOOP zone</label>
                <select id="burn-zone" data-burn="zone">
                  ${["", "Z3", "Z4", "Z5"].map(z => `<option value="${z}" ${b.zone === z ? "selected" : ""}>${z || "—"}</option>`).join("")}
                </select>
              </div>
              <div class="field"><label for="burn-scaled">Scaled?</label>
                <select id="burn-scaled" data-burn="scaled">
                  <option value="" ${!b.scaled ? "selected" : ""}>As written</option>
                  <option value="yes" ${b.scaled === "yes" ? "selected" : ""}>Scaled</option>
                </select>
              </div>
              <div class="field"><label for="burn-note">Note</label><input id="burn-note" data-burn="note" value="${esc(b.note || "")}" placeholder="load, swap, feel"></div>
            </div>
          </div></div>`);
      }
    }

    if (D.down) {
      h += sec("Downshift", "2–5 min", `<div class="line">
        <button type="button" class="box" data-id="down" data-i="0" aria-pressed="${chk("down", 0)}" aria-label="Downshift done"></button>
        <div class="body"><div class="nm">${esc(D.down)}</div></div>
      </div>`);
    }

    document.getElementById("session").innerHTML = h;
    document.getElementById("ref-prog").innerHTML = P.weeks.map(w =>
      `<dt>Week ${w.n} — ${esc(w.intent)}</dt><dd>${esc(w.main)} @ ${esc(w.rpe)}. ${esc(w.acc)}. Burnouts ${esc(w.burn)}.</dd>`
    ).join("");
  }

  const METRICS = {
    e1rm: { lab: "Est 1RM", note: "Uses the reps you logged, or the prescribed scheme if reps are blank. Load × (1 + reps ÷ 30).", fmt: v => Math.round(v) },
    tonnage: { lab: "Tonnage", note: "Load × logged (or prescribed) reps × sets completed. Volume falls as the block peaks — that is by design.", fmt: v => v >= 1000 ? (v / 1000).toFixed(1) + "k" : Math.round(v) },
    load: { lab: "Load", note: "The number you put on the bar, unadjusted.", fmt: v => Math.round(v) }
  };

  function repSpec(l, w) {
    const logged = num(LOG.reps[loadKey(l.id, w, l.day)]);
    if (l.prog) return { reps: logged != null ? logged : P.progReps[w], sets: P.sets[w], timed: false, logged: logged != null };
    const rx = l.rx || "";
    if (/sec|min/i.test(rx) && !/×/.test(rx)) return { reps: null, sets: l.sets || 1, timed: true };
    if (/sec/i.test(rx)) return { reps: null, sets: l.sets || 1, timed: true };
    if (logged != null) return { reps: logged, sets: l.sets || 1, timed: false, logged: true };
    const part = rx.includes("×") ? rx.split("×")[1] : rx;
    const nums = (part.match(/\d+/g) || []).map(Number);
    if (!nums.length) return { reps: null, sets: l.sets || 1, timed: true };
    return { reps: nums.length > 1 ? (nums[0] + nums[1]) / 2 : nums[0], sets: l.sets || 1, timed: false };
  }

  function metricValue(mode, n, spec, setsDone) {
    if (n == null) return null;
    if (mode === "load") return n;
    if (spec.timed || spec.reps == null) return null;
    if (mode === "e1rm") return n * (1 + spec.reps / 30);
    return n * spec.reps * (setsDone || spec.sets);
  }

  function weekSummary() {
    let sessions = 0;
    let hard = 0;
    let optional = 0;
    P.days.forEach(d => {
      const items = [];
      (d.lifts || []).forEach(l => items.push(l.id));
      if (d.mob && d.mob.length) items.push("mob");
      if (d.tissue) items.push("tissue");
      const k = LOG.checks[`w${S.week}d${d.n}`] || {};
      const any = items.some(id => (k[id] || []).some(Boolean)) || k.burn && k.burn[0] || k.down && k.down[0];
      if (any) sessions++;
      if (d.burn && !d.burn.optional && k.burn && k.burn[0]) hard++;
      if (d.burn && d.burn.optional && k.burn && k.burn[0]) optional++;
    });
    return { sessions, hard, optional };
  }

  function renderHistory() {
    const mode = S.metric || "e1rm";
    const M = METRICS[mode];
    const sum = weekSummary();
    document.getElementById("week-sum").innerHTML = `
      <div class="dash-cell"><div class="label">Week ${S.week} sessions touched</div><div class="value">${sum.sessions} / 7</div></div>
      <div class="dash-cell"><div class="label">Burnouts vs 3 + 1</div><div class="value">${sum.hard} hard · ${sum.optional} optional</div></div>`;
    document.getElementById("metrics").innerHTML = Object.keys(METRICS).map(k =>
      `<button type="button" class="mbtn" data-m="${k}" aria-pressed="${k === mode}">${METRICS[k].lab}</button>`
    ).join("");
    document.getElementById("hist-key").innerHTML =
      `<span class="mnote" style="display:block">${M.note}</span>
       <i style="background:var(--ok)"></i>all sets completed &nbsp;
       <i style="background:var(--warn)"></i>sets missed &nbsp;
       <i style="background:var(--muted)"></i>no sets logged`;

    const tracked = P.days.flatMap(d => (d.lifts || []).filter(l => l.load).map(l => ({ ...l, day: d.n, heat: d.heat })));
    const rows = tracked.map(l => {
      const series = P.weeks.map(w => {
        const raw = (LOG.loads[loadKey(l.id, w.n, l.day)] || "").trim();
        const spec = repSpec(l, w.n);
        const arr = (LOG.checks[`w${w.n}d${l.day}`] || {})[l.id] || [];
        const done = arr.slice(0, spec.sets).filter(Boolean).length;
        const added = num(raw);
        const bw = l.bw ? bwFor(w.n) : null;
        const eff = l.bw ? (bw ? bw.v + (added || 0) : null) : added;
        return { w: w.n, raw, n: eff, spec, done, total: spec.sets, v: metricValue(mode, eff, spec, done) };
      });
      const bwMissing = l.bw && !bwFor(S.week) && series.some(s => s.raw);
      return { l, series, any: series.some(s => s.raw), timed: series[0].spec.timed, bwMissing };
    }).filter(r => r.any);

    const el = document.getElementById("hist");
    if (!rows.length) {
      el.innerHTML = `<p class="hist-empty">Nothing logged yet. Enter a load on any main lift and it starts plotting here — one row per lift, one bar per week.</p>`;
      return;
    }

    el.innerHTML = rows.map(({ l, series, timed, bwMissing }) => {
      const plotted = timed && mode !== "load";
      const vals = series.filter(s => s.v != null);
      if (bwMissing) {
        return `<div class="lift timed">
          <div class="lift-h"><span class="ln">${esc(l.nm)}</span><span class="dl"><i>needs bodyweight</i></span></div>
          <div class="timed-note">Enter your bodyweight up top — these reps move body + added weight.</div></div>`;
      }
      const max = Math.max(...vals.map(s => s.v), 1);
      const first = vals[0], last = vals[vals.length - 1];
      let delta = "";
      if (vals.length > 1 && first.v !== last.v) {
        const d = last.v - first.v;
        delta = ` <b style="color:${d > 0 ? "var(--ok)" : "var(--muted)"}">${d > 0 ? "+" : ""}${M.fmt(d)}</b>`;
      } else if (vals.length === 1) {
        delta = ` <i>first entry</i>`;
      }
      const head = plotted
        ? `<span class="dl"><i>time-based</i></span>`
        : `<span class="dl">${first ? M.fmt(first.v) : "—"} → ${last ? M.fmt(last.v) : "—"}${delta}</span>`;
      if (plotted) {
        return `<div class="lift timed">
          <div class="lift-h"><span class="ln">${esc(l.nm)}</span>${head}</div>
          <div class="timed-note">Carries are held for time, not reps — switch to Load to see the weight.</div></div>`;
      }
      const plot = series.map(s => {
        if (s.v == null) return `<div class="col empty"><div class="bar2"></div></div>`;
        const ht = Math.round(6 + (s.v / max) * 38);
        const c = s.done === 0 ? "var(--muted)" : (s.done >= s.total ? "var(--ok)" : "var(--warn)");
        return `<div class="col ${s.w === 6 ? "deload" : ""}" title="Week ${s.w}">
          <div class="bar2" style="height:${ht}px;--bc:${c}"></div></div>`;
      }).join("");
      const axis = series.map(s =>
        `<span class="${s.w === S.week ? "now" : ""}">${s.v != null ? `<b>${M.fmt(s.v)}</b>` : "<b>·</b>"}W${s.w}</span>`
      ).join("");
      return `<div class="lift">
        <div class="lift-h"><span class="ln">${esc(l.nm)}${l.bw ? ` <span class="bwtag">+ bodyweight</span>` : ""}</span>${head}</div>
        <div class="plot">${plot}</div>
        <div class="axis">${axis}</div>
      </div>`;
    }).join("");
  }

  function syncBackup() {
    const t = document.getElementById("backup-json");
    if (t && document.activeElement !== t) t.value = payload();
  }

  function render() {
    renderChrome();
    renderSession();
    updateProgress();
    renderHistory();
    syncBackup();
  }

  function goToday() {
    const t = suggested();
    S.week = t.week;
    S.day = t.day;
    save();
    render();
    document.getElementById("main-content").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  function toggle(id, i, btn) {
    const D = dayObj();
    if (D.exclusive && liftById(id)) {
      const key = wd();
      const already = LOG.choice[key] === id && chk(id, 0);
      D.lifts.forEach(l => {
        setChk(l.id, 0, false);
      });
      if (!already) {
        LOG.choice[key] = id;
        setChk(id, 0, true);
      } else {
        delete LOG.choice[key];
      }
      save();
      renderSession();
      updateProgress();
      return;
    }
    if (id === "burn" && !chk("burn", 0)) setChk("burnskip", 0, false);
    if (id === "burnskip" && !chk("burnskip", 0)) setChk("burn", 0, false);
    setChk(id, i, !chk(id, i));
    save();
    if (btn && !D.exclusive) {
      updateToggle(btn);
      if (id === "burn" || id === "burnskip") {
        const other = document.querySelector(`[data-id="${id === "burn" ? "burnskip" : "burn"}"]`);
        if (other) updateToggle(other);
      }
      updateProgress();
      renderHistory();
    } else {
      renderSession();
      updateProgress();
    }
  }

  document.getElementById("mark").innerHTML = mountain();

  document.addEventListener("click", e => {
    const today = e.target.closest("#today-btn");
    if (today) { goToday(); return; }

    const bkc = e.target.closest("#bk-copy");
    if (bkc) {
      const t = document.getElementById("backup-json");
      const m = document.getElementById("bk-msg");
      t.value = payload();
      t.select();
      const done = () => { m.className = "bk-msg ok"; m.textContent = "Copied."; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t.value).then(done, () => {
          m.className = "bk-msg"; m.textContent = "Select the text above and copy manually.";
        });
      } else {
        try { document.execCommand("copy"); done(); }
        catch (_) { m.className = "bk-msg"; m.textContent = "Select the text above and copy manually."; }
      }
      return;
    }

    const bkr = e.target.closest("#bk-restore");
    if (bkr) {
      const t = document.getElementById("backup-json");
      const m = document.getElementById("bk-msg");
      try {
        applyPayload(JSON.parse(t.value));
        m.className = "bk-msg ok";
        m.textContent = "Restored.";
        save();
        render();
      } catch (err) {
        m.className = "bk-msg err";
        m.textContent = "That isn't valid log data — paste the whole block, braces included.";
      }
      return;
    }

    const w = e.target.closest("[data-w]");
    if (w) { S.week = +w.dataset.w; save(); render(); return; }
    const d = e.target.closest("[data-d]");
    if (d) { S.day = +d.dataset.d; save(); render(); return; }
    const r = e.target.closest("[data-r]");
    if (r) { S.ready = r.dataset.r; save(); render(); return; }
    const mt = e.target.closest("[data-m]");
    if (mt) { S.metric = mt.dataset.m; save(); renderHistory(); return; }
    const fl = e.target.closest("[data-flag]");
    if (fl) {
      S.flags[fl.dataset.flag] = !S.flags[fl.dataset.flag];
      save(); render(); return;
    }
    const ov = e.target.closest("[data-override]");
    if (ov) {
      S.overrides[ov.dataset.override] = !S.overrides[ov.dataset.override];
      save(); render(); return;
    }
    const c = e.target.closest("[data-carry]");
    if (c) {
      LOG.loads[loadKey(c.dataset.carry)] = c.dataset.val;
      const inp = document.querySelector(`[data-load="${c.dataset.carry}"]`);
      if (inp) inp.value = c.dataset.val;
      save();
      const host = document.querySelector(`[data-last="${c.dataset.carry}"]`);
      const lift = liftById(c.dataset.carry);
      if (host && lift) host.outerHTML = lastLine(lift);
      renderHistory();
      return;
    }
    const b = e.target.closest("[data-id]");
    if (b) toggle(b.dataset.id, +b.dataset.i, b);
  });

  document.addEventListener("change", e => {
    const start = e.target.closest("#start-in");
    if (start) { S.start = start.value; save(); renderChrome(); updateProgress(); return; }
    const bw = e.target.closest("[data-bw]");
    if (bw) { LOG.bw[S.week] = bw.value; save(); renderChrome(); renderHistory(); return; }
    const loadEl = e.target.closest("[data-load]");
    if (loadEl) { LOG.loads[loadKey(loadEl.dataset.load)] = loadEl.value; save(); renderHistory(); return; }
    const reps = e.target.closest("[data-reps]");
    if (reps) { LOG.reps[loadKey(reps.dataset.reps)] = reps.value; save(); renderHistory(); return; }
    const rpe = e.target.closest("[data-rpe]");
    if (rpe) { LOG.rpe[loadKey(rpe.dataset.rpe)] = rpe.value; save(); return; }
    const burn = e.target.closest("[data-burn]");
    if (burn) {
      const rec = LOG.burn[wd()] || {};
      rec[burn.dataset.burn] = burn.value;
      LOG.burn[wd()] = rec;
      save();
    }
  });

  document.addEventListener("input", e => {
    const loadEl = e.target.closest("[data-load]");
    if (loadEl) { LOG.loads[loadKey(loadEl.dataset.load)] = loadEl.value; save(); }
    const reps = e.target.closest("[data-reps]");
    if (reps) { LOG.reps[loadKey(reps.dataset.reps)] = reps.value; save(); }
    const rpe = e.target.closest("[data-rpe]");
    if (rpe) { LOG.rpe[loadKey(rpe.dataset.rpe)] = rpe.value; save(); }
    const burn = e.target.closest("[data-burn]");
    if (burn && burn.tagName === "INPUT") {
      const rec = LOG.burn[wd()] || {};
      rec[burn.dataset.burn] = burn.value;
      LOG.burn[wd()] = rec;
      save();
    }
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }

  load();
})();
