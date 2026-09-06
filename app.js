(() => {
  const C = window.FinalCutCore;
  const P = window.PROGRAM;
  const WEEKDAYS = P.calendar;

  let S = C.defaultState();
  let LOG = C.emptyLog();
  let SESSIONS = {};
  let saveTimer = null;
  let persistOk = true;
  let undo = null;
  let backupDirty = false;
  let lastGoodRaw = null;

  function sess() {
    const k = C.wd(S.week, S.day);
    SESSIONS[k] = C.defaultSession(SESSIONS[k]);
    return SESSIONS[k];
  }

  function payloadObj() {
    return {
      v: C.VERSION,
      state: S,
      sessions: SESSIONS,
      checks: LOG.checks,
      loads: LOG.loads,
      reps: LOG.reps,
      rpe: LOG.rpe,
      bw: LOG.bw,
      burn: LOG.burn,
      choice: LOG.choice,
      subs: LOG.subs
    };
  }

  function payload() { return JSON.stringify(payloadObj()); }

  function applyMigrated(data) {
    const m = C.migrate(data);
    S = m.state;
    SESSIONS = m.sessions;
    LOG = {
      checks: m.checks, loads: m.loads, reps: m.reps, rpe: m.rpe,
      bw: m.bw, burn: m.burn, choice: m.choice, subs: m.subs
    };
  }

  function snapshot() {
    try { lastGoodRaw = payload(); localStorage.setItem(C.SNAP_KEY, lastGoodRaw); } catch (e) { /* ignore */ }
  }

  function writeStore(text) {
    localStorage.setItem(C.KEY, text);
    try { localStorage.removeItem("final-cut:v2"); } catch (e) { /* ignore */ }
  }

  function flagSave(ok, msg) {
    persistOk = ok;
    const el = document.getElementById("savestate");
    const live = document.getElementById("save-live");
    const chip = document.getElementById("save-chip");
    if (!ok) {
      el.className = "save-banner show";
      el.innerHTML = `<b>Not saving on this device.</b> ${esc(msg)}. Export a backup before you close.`;
      document.getElementById("backup-wrap").open = true;
      if (live) live.textContent = "Training log is not saving.";
      if (chip) { chip.hidden = false; chip.className = "fc-savewarn svbg svbg-bad"; chip.textContent = "Not saving on this device"; }
    } else {
      el.className = "save-banner";
      el.innerHTML = "";
      if (live) live.textContent = "Training log saved on this device.";
      if (chip) chip.hidden = true;
    }
  }

  function saveNow() {
    clearTimeout(saveTimer);
    saveTimer = null;
    try {
      S.lastSaved = new Date().toISOString();
      const text = payload();
      writeStore(text);
      snapshot();
      flagSave(true);
    } catch (e) {
      flagSave(false, e && e.message ? e.message : "storage unavailable");
    }
    syncBackup();
    updateStatus();
  }

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 250);
  }

  function flush() { if (saveTimer) saveNow(); }

  function load() {
    let raw = null;
    try { raw = localStorage.getItem(C.KEY) || localStorage.getItem("final-cut:v2"); } catch (e) {
      flagSave(false, "This browser will not keep data.");
      showSetup(true);
      render();
      return;
    }
    if (!raw) {
      showSetup(true);
      render();
      return;
    }
    try {
      const data = JSON.parse(raw);
      C.validatePayload(data);
      applyMigrated(data);
      flagSave(true);
    } catch (e) {
      const box = document.getElementById("backup-json");
      if (box) box.value = raw;
      document.getElementById("backup-wrap").open = true;
      flagSave(false, e.message || "Saved log was corrupt. Copy the text in Backup before resetting.");
      showSetup(!S.setupDone);
      render();
      return;
    }
    if (!S.setupDone) {
      showSetup(true);
      render();
    } else {
      showSetup(false);
      const t = C.suggested(S.start);
      S.week = t.week;
      S.day = t.day;
      render({ focus: true });
    }
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function relTime(iso) {
    if (!iso) return "—";
    const t = Date.parse(iso);
    if (!t) return "—";
    const m = Math.round((Date.now() - t) / 60000);
    if (m < 1) return "just now";
    if (m < 60) return m + "m ago";
    const h = Math.round(m / 60);
    if (h < 24) return h + "h ago";
    return Math.round(h / 24) + "d ago";
  }

  function chk(id, i) { return C.chk(LOG.checks, S.week, S.day, id, i); }

  function setChk(id, i, on) {
    const k = C.wd(S.week, S.day);
    LOG.checks[k] = LOG.checks[k] || {};
    LOG.checks[k][id] = LOG.checks[k][id] || [];
    LOG.checks[k][id][i] = !!on;
  }

  function heatVar(h) { return `var(--fc-heat-${h})`; }
  function dayObj() { return P.days[S.day - 1]; }
  function weekObj() { return P.weeks[S.week - 1]; }
  function liftById(id) { return (dayObj().lifts || []).find(l => l.id === id); }

  /* The brand mark, inline. Five peaks sharing a baseline and a right-hand
     vertex. Kept as a constant so the service worker never has to fetch it.
     Source of truth: ds/assets/sv-mark.svg — replace both together. */
  const MARK = `<svg class="svm-glyph" viewBox="0 0 324.44 162.22" role="img"
      fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke">
      <title>Skaling Ventures</title>
      <path d="M0 162.22L60 112.48L324.44 162.22Z"/>
      <path d="M38.32 162.22L104.38 84.06L324.44 162.22Z"/>
      <path d="M76.64 162.22L148.75 55.62L324.44 162.22Z"/>
      <path d="M114.96 162.22L193.12 27.2L324.44 162.22Z"/>
      <path d="M150.63 162.22L237.5 0L324.44 162.22Z"/>
    </svg>`;

  function mark(size) {
    return `<span class="svm ${size ? "svm-" + size : ""}">${MARK}</span>`;
  }

  function phaseSymbol(phase) {
    const paths = {
      readiness: `<path d="M12 3v18M3 12h18M7 7l10 10M17 7L7 17"/>`,
      tissue: `<ellipse cx="12" cy="12" rx="8" ry="5"/><ellipse cx="12" cy="12" rx="5" ry="8"/><circle cx="12" cy="12" r="2.5"/>`,
      mobility: `<path d="M5 3v18M9 6v12M14 4v16M19 8v8"/>`,
      strength: `<rect x="4" y="5" width="16" height="14"/><rect x="8" y="8" width="8" height="8"/>`,
      burnout: `<path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19M8 3l8 18M16 3L8 21"/>`,
      downshift: `<path d="M12 4l8 15H4L12 4z"/><path d="M8 15h8"/>`,
      recovery: `<circle cx="12" cy="12" r="8"/><ellipse cx="12" cy="12" rx="3" ry="8"/>`
    };
    return `<svg class="phase-symbol" viewBox="0 0 24 24" fill="none" aria-hidden="true">${paths[phase] || paths.downshift}</svg>`;
  }

  function showSetup(on) {
    document.getElementById("setup").hidden = !on;
    document.getElementById("app").hidden = on;
    if (on) {
      document.getElementById("setup-start").value = S.start;
      document.getElementById("setup-mark").innerHTML = mark("lg");
    }
  }

  function toast(msg, undoFn) {
    const el = document.getElementById("toast");
    undo = undoFn || null;
    el.hidden = false;
    el.innerHTML = undo
      ? `${esc(msg)} <button type="button" class="toast-undo" id="toast-undo">Undo</button>`
      : esc(msg);
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.hidden = true; undo = null; }, 5000);
  }

  function updateProgress() {
    const se = sess();
    const p = C.progress(dayObj(), S.week, se, LOG, P);
    const label = document.getElementById("prog-text");
    if (label) {
      label.textContent = p.state === "idle" ? "—" : (p.state === "done" ? "\u2713" : `${p.done} / ${p.total}`);
      label.setAttribute("aria-label", p.state === "done" ? "Session complete"
        : p.state === "active" ? `${p.done} of ${p.total} done` : "Session not started");
    }
    const today = document.getElementById("today-btn");
    const t = C.suggested(S.start);
    if (today) today.hidden = t.week === S.week && t.day === S.day && !t.unknown && S.setupDone;
    document.getElementById("sticky-week").textContent = `W${S.week} \u00b7 ${WEEKDAYS[S.day - 1]}`;
    const recap = document.getElementById("finish-recap");
    const btn = document.getElementById("finish-btn");
    if (se.finished) {
      recap.hidden = false;
      recap.textContent = finishCopy(p);
      btn.textContent = "Session finished";
    } else {
      recap.hidden = true;
      btn.textContent = "Finish session";
    }
  }

  function finishCopy(p) {
    const nxt = nextSession();
    return `Done · ${p.done}/${p.total} checks. Next: ${nxt}.`;
  }

  function nextSession() {
    if (S.day < 7) return `W${S.week} ${WEEKDAYS[S.day]}`;
    if (S.week < 6) return `W${S.week + 1} Mon`;
    return "Block complete";
  }

  function updateStatus() {
    const line = document.getElementById("status-line");
    if (!line) return;
    const bits = [];
    bits.push("Saved " + relTime(S.lastSaved));
    bits.push("Exported " + relTime(S.lastExported));
    try {
      if (matchMedia("(display-mode: standalone)").matches) bits.push("Home screen");
    } catch (e) { /* ignore */ }
    line.textContent = bits.join(" · ");
  }

  function prescription() {
    const se = sess();
    const D = dayObj();
    const W = weekObj();
    if (!se.ready) return "";
    const bits = [];
    if (se.ready === "green") bits.push("Full session + full burnout.");
    if (se.ready === "amber") bits.push("Full strength. Moderate / scaled burnout.");
    if (se.ready === "red") bits.push("Strength only. Heavy hinge off. Burnout cut or easy 60–70%.");
    if (se.flags.back) bits.push("Back: swap deadlift for RDL or goblet.");
    if (se.flags.shoulder) bits.push("Shoulder: skip dips, use push-ups or DB press.");
    if (se.flags.achilles) bits.push("Achilles: keep strength, drop jumps/burpees, favor carries and swings.");
    if (se.flags.motivation) bits.push("Motivation low: start strength, cut burnout if needed.");
    if (W.n === 6 && D.n <= 5 && !D.exclusive) bits.push("Deload week — accessories reduced 30–40%. No redline conditioning.");
    return bits.join(" ");
  }

  function lastLine(l) {
    const prior = C.priorLift(l, S.week, S.day, LOG, P);
    if (!prior.length) return `<div class="last" data-last="${esc(l.id)}">No prior weeks logged.</div>`;
    const recent = prior[prior.length - 1];
    const nowScheme = l.prog ? `${weekObj().main} @ ${weekObj().rpe}` : (l.rx || "");
    const shifted = recent.scheme && nowScheme && recent.scheme !== nowScheme;
    const warnCarry = !recent.clean;
    return `<div class="last" data-last="${esc(l.id)}">
      ${prior.map(p => `<span class="wk ${p.clean ? "clean" : (p.done ? "part" : "")}">
        <em>W${p.w}</em>${esc(p.v)}${p.reps ? ` × ${esc(p.reps)}` : ""}${p.rpe ? ` @ ${esc(p.rpe)}` : ""}</span>`).join("")}
      <button class="carry" data-carry="${esc(l.id)}" data-val="${esc(recent.v)}" data-partial="${warnCarry ? "1" : "0"}">use ${esc(recent.v)}</button>
      ${warnCarry ? `<span class="shift">W${recent.w} was incomplete — confirm before carrying.</span>` : ""}
      ${shifted ? `<span class="shift">W${recent.w} was ${esc(recent.scheme)} — today is ${esc(nowScheme)}</span>` : ""}
    </div>`;
  }

  function renderChrome() {
    const W = weekObj();
    const D = dayObj();
    const t = C.suggested(S.start);
    const se = sess();
    document.getElementById("intent-sub").textContent = `Week ${W.n} · ${W.intent} · ${W.main} @ ${W.rpe} · ${W.acc}`;
    const card = document.getElementById("ready-card");
    if (card) card.classList.toggle("is-set", !!se.ready);
    document.getElementById("ramp").innerHTML = P.weeks.map(w =>
      `<button type="button" data-w="${w.n}" aria-pressed="${w.n === S.week}">
         <span class="bar"></span><span class="lbl">W${w.n}</span></button>`).join("");
    document.getElementById("days").innerHTML = P.days.map(d => {
      const ds = C.defaultSession(SESSIONS[C.wd(S.week, d.n)]);
      const dp = C.progress(d, S.week, ds, LOG, P);
      return `<button type="button" class="day${t.week === S.week && t.day === d.n && !t.unknown ? " is-today" : ""}${dp.state === "done" || ds.finished ? " is-complete" : ""}" data-d="${d.n}" aria-pressed="${d.n === S.day}">
         <span class="dot"></span><span class="wd">${WEEKDAYS[d.n - 1]}</span><span class="n">${d.n}</span><span class="day-theme">${esc(d.theme.split(" ")[0])}</span></button>`;
    }).join("");
    document.getElementById("ready-h").innerHTML = `${phaseSymbol("readiness")}<span>Today</span>`;
    document.getElementById("ready").innerHTML = P.ready.map(r =>
      `<button type="button" class="rbtn" data-r="${r.id}" aria-pressed="${r.id === se.ready}">${r.lab}</button>`).join("");
    document.getElementById("ready-note").textContent = se.ready ? P.ready.find(r => r.id === se.ready).note : "Pick once. It stays with this session only.";
    document.getElementById("ready-lead").textContent = se.ready ? P.ready.find(r => r.id === se.ready).lab : "How do you feel?";
    document.getElementById("start-in").value = S.start;
    document.getElementById("bw-in").value = LOG.bw[S.week] || "";
    document.getElementById("bw-wk").textContent = S.week;
    const own = C.num(LOG.bw[S.week]);
    let bwNote = "needed for pull-up and chin-up strength math";
    if (own != null) bwNote = "";
    else {
      for (let i = S.week - 1; i >= 1; i--) {
        const v = C.num(LOG.bw[i]);
        if (v != null) { bwNote = `carried from W${i} — ${v}`; break; }
      }
    }
    document.getElementById("bw-note").textContent = bwNote;
    document.getElementById("flags").innerHTML = (P.flags || []).map(f =>
      `<button type="button" class="flag" data-flag="${f.id}" aria-pressed="${se.flags[f.id] ? "true" : "false"}">${f.lab}</button>`
    ).join("");
    const startNote = document.getElementById("start-note");
    if (t.before) startNote.textContent = "Block has not started — Today opens Week 1, Day 1.";
    else if (t.after) startNote.textContent = "Block window has passed — Today opens Week 6, Day 7.";
    else startNote.textContent = `Today is Week ${t.week}, ${WEEKDAYS[t.day - 1]}. Logs stay on week/day numbers if you change this date.`;
    const rx = document.getElementById("rx-card");
    const text = prescription();
    rx.hidden = !text;
    rx.textContent = text;
    document.getElementById("app-ver").textContent = "v" + C.APP_VERSION;
  }

  function sec(title, dose, inner, foldId, done, phase, phaseProgress) {
    const se = sess();
    const key = foldId || phase || "phase";
    if (done && se.collapsed[key] == null) se.collapsed[key] = true;
    const open = !se.collapsed[key];
    const count = phaseProgress && phaseProgress.total ? `${phaseProgress.done}/${phaseProgress.total}` : "";
    const meta = [count, dose].filter(Boolean).join(" \u00b7 ");
    return `<details class="svd fc-phase" data-sec="${esc(key)}"${open ? " open" : ""}>
      <summary class="svd-summary">
        <span class="svd-title">${esc(title)}</span>
        <span class="svd-meta">${esc(meta)}</span>
      </summary>
      <div class="svd-body">${inner}</div>
    </details>`;
  }

  function phaseStatus(phase) {
    const p = C.progress(dayObj(), S.week, sess(), LOG, P).byPhase[phase];
    return { progress: p, done: !!p && p.total > 0 && p.done >= p.total };
  }

  function renderSession() {
    const W = weekObj();
    const D = dayObj();
    const se = sess();
    const red = se.ready === "red";
    const amber = se.ready === "amber";
    const rpeMax = C.rpeTarget(W);
    const tissuePhase = phaseStatus("tissue");
    const mobilityPhase = phaseStatus("mobility");
    const workPhase = phaseStatus("work");
    const burnPhase = phaseStatus("burnout");
    const downPhase = phaseStatus("downshift");
    let h = `<div class="svr-section fc-day">
      <p class="sveb">W${W.n} ${esc(W.intent)} \u00b7 ${esc(D.weekday)}
        <span class="svbg" style="--svbg-fg: var(--fc-heat-${esc(D.heat)})">${esc(D.tag)}</span></p>
      <h1 class="svr-section-title">${esc(D.theme)}</h1>
      <p class="svlede">${esc(D.sub)} \u00b7 ${esc(D.n === 3 || D.n >= 6 ? "easy day" : "60–75 min")}</p>
    </div>`;
    if (D.guardTop) h += `<div class="session-callout guard callout callout--warn"><span>${esc(D.guardTop)}</span></div>`;

    if (D.tissue) {
      h += sec("Tissue", D.tissue.dose, `
        ${D.tissue.goal ? `<div class="sec-goal">${esc(D.tissue.goal)}</div>` : ""}
        ${D.tissue.items.map((t, i) => `
          <div class="line release-row">
            <button type="button" class="box phase-check" data-kind="release" data-id="tissue" data-i="${i}" aria-pressed="${chk("tissue", i)}" aria-label="${esc(t.a)}"></button>
            <div class="body">
              <div class="nm">${esc(t.a)}</div>
              <div class="tool"><span>${esc(t.tool)}</span><span>${esc(t.d)}</span></div>
              <div class="why">${esc(t.cue)}</div>
            </div>
          </div>`).join("")}
        ${D.tissue.note ? `<div class="guard callout callout--coach"><span>${esc(D.tissue.note)}</span></div>` : ""}`,
        "tissue", tissuePhase.done, "tissue", tissuePhase.progress);
    }

    if (D.mob && D.mob.length) {
      const showWave = D.n === 1 || D.n === 2 || D.n === 4 || D.n === 5;
      const mobLead = [
        D.mobNote ? `<div class="sec-goal">${esc(D.mobNote)}</div>` : "",
        showWave && W.mob ? `<div class="sec-goal">${esc(W.mob)}</div>` : ""
      ].join("");
      h += sec("Mobility", D.n === 6 ? "5–15 min" : "6–15 min", mobLead + D.mob.map((m, i) => {
        const item = typeof m === "string" ? (function () {
          const parts = m.split(" — ");
          return { nm: parts[0], why: parts[1] || "", levels: [] };
        }()) : m;
        const levels = item.levels || [];
        return `<div class="line move-row${levels.length ? " move-row--levels" : ""}">
          <span class="move-index">${String(i + 1).padStart(2, "0")}</span>
          <button type="button" class="box phase-check" data-kind="move" data-id="mob" data-i="${i}" aria-pressed="${chk("mob", i)}" aria-label="${esc(item.nm)}"></button>
          <div class="body">
            <div class="nm">${esc(item.nm)}</div>
            ${item.why ? `<div class="why">${esc(item.why)}</div>` : ""}
            ${levels.length ? `<ol class="mob-levels">${levels.map((lv, li) => `<li><span class="mob-lvl">L${li + 1}</span> ${esc(lv)}</li>`).join("")}</ol>` : ""}
          </div>
        </div>`;
      }).join(""), "mob", mobilityPhase.done, "mobility", mobilityPhase.progress);
    }

    const strengthTitle = D.restTitle || "Strength";
    const strengthDose = (D.n === 3 || D.n >= 6)
      ? ""
      : (red ? "strength only" : (D.n === 5 ? "RPE 7" : "main 15–25 · pairings 15–25"));
    if (D.exclusive) {
      const chosen = LOG.choice[C.wd(S.week, S.day)] || "";
      h += sec(strengthTitle, "choose one", D.lifts.map(l => `
        <div class="line choice-card">
          <button type="button" class="box phase-check" data-kind="choice" data-choice="${esc(l.id)}" data-id="${esc(l.id)}" data-i="0" aria-pressed="${chosen === l.id}" aria-label="${esc(l.nm)}"></button>
          <div class="body">
            <div class="nm">${esc(l.nm)}</div>
            <div class="rx">${esc(l.rx)}</div>
            ${l.note ? `<div class="note">${esc(l.note)}</div>` : ""}
            ${chosen === l.id ? `<div class="choice-note">Today's pick.</div>` : ""}
          </div>
        </div>`).join(""), "", workPhase.done, "recovery", workPhase.progress);
    } else {
      const liftCard = (l) => {
        const blocked = C.liftBlocked(l, se);
        const swap = C.liftSwapNote(l, se);
        const ov = se.overrides[l.id] || {};
        const rx = l.prog ? `${W.main} <em>@ ${W.rpe}</em>` : esc(l.rx || "");
        const prescribed = l.prog ? P.progReps[S.week] : "";
        const loggedRpe = C.num(LOG.rpe[C.loadKey(l.id, S.week, S.day)]);
        const rpeWarn = l.prog && rpeMax != null && loggedRpe != null && loggedRpe > rpeMax + 0.5;
        const n = C.nSets(l, S.week, P);
        const accNote = !l.prog && W.n >= 2 && n > 1 ? W.acc : "";
        const slot = l.pair && l.slot ? `<span class="pair-slot">${esc(l.pair + l.slot)}</span>` : "";
        return `<div class="line lift-card${l.prog ? " lift-card--primary" : ""}${blocked ? " killed" : ""}" data-lift="${esc(l.id)}">
          <div class="body">
            <div class="nm">${slot}${esc(l.nm)}</div>
            ${l.prog ? `<div class="lift-meta">Straight sets · full rest · never supersetted</div>` : ""}
            <div class="rx">${rx}${W.n === 6 && !l.prog && (l.sets || 1) > 1 ? ` <em>· deload ${n} sets</em>` : ""}</div>
            ${l.note ? `<div class="note">${esc(l.note)}</div>` : ""}
            ${swap && blocked ? `<div class="guard"><span>${esc(swap)}</span></div>` : ""}
            ${swap && !blocked ? `<div class="note">Substitution active: ${esc((LOG.subs[C.loadKey(l.id, S.week, S.day)] || ov.as || swap))}</div>` : ""}
            ${l.guard ? `<div class="guard"><span>${esc(l.guard)}</span></div>` : ""}
            ${accNote ? `<div class="note">${esc(accNote)}.</div>` : ""}
            ${blocked ? `<div class="swap-row">
              <input class="log-in wide" data-sub="${esc(l.id)}" value="${esc(LOG.subs[C.loadKey(l.id, S.week, S.day)] || "")}" placeholder="Did instead (RDL, goblet…)" aria-label="Substitution for ${esc(l.nm)}">
              <button type="button" class="override" data-override="${esc(l.id)}" aria-pressed="${ov.on ? "true" : "false"}">Log the swap</button>
            </div>` : ""}
            ${!blocked && l.load ? lastLine(l) : ""}
            ${blocked ? "" : `<div class="log-grid">
              <div class="sets">
                ${Array.from({ length: n }, (_, i) =>
                  `<button type="button" class="set" data-id="${esc(l.id)}" data-i="${i}" aria-pressed="${chk(l.id, i)}" aria-label="Set ${i + 1}">${i + 1}</button>`
                ).join("")}
              </div>
              <div class="log-fields">
                ${l.load ? `<label class="ll">Load<input class="log-in wide" data-load="${esc(l.id)}" value="${esc(LOG.loads[C.loadKey(l.id, S.week, S.day)] || "")}" placeholder="${l.bw ? "+ added" : "lb"}" inputmode="text"></label>` : ""}
                ${l.prog || l.load ? `<label class="ll">Reps<input class="log-in" data-reps="${esc(l.id)}" value="${esc(LOG.reps[C.loadKey(l.id, S.week, S.day)] || "")}" placeholder="${prescribed || "reps"}" inputmode="decimal"></label>` : ""}
                ${l.prog ? `<label class="ll">RPE<input class="log-in rpe-in" data-rpe="${esc(l.id)}" value="${esc(LOG.rpe[C.loadKey(l.id, S.week, S.day)] || "")}" placeholder="${rpeMax || "RPE"}" inputmode="decimal"></label>` : ""}
              </div>
              ${rpeWarn ? `<div class="guard"><span>Logged RPE is above this week's target. Keep it if it was clean — otherwise drop load.</span></div>` : ""}
            </div>`}
          </div>
        </div>`;
      };
      const liftGroups = [];
      (D.lifts || []).forEach(l => {
        const last = liftGroups[liftGroups.length - 1];
        if (l.pair && last && last.pair === l.pair) last.lifts.push(l);
        else liftGroups.push({ pair: l.pair || null, lifts: [l] });
      });
      h += sec(strengthTitle, strengthDose, liftGroups.map(g => {
        const cards = g.lifts.map(liftCard).join("");
        if (!g.pair || g.lifts.length < 2) return cards;
        return `<div class="pair-block">
          <div class="pair-head">Pair ${esc(g.pair)} · non-competing</div>
          ${cards}
        </div>`;
      }).join(""), "", workPhase.done, "strength", workPhase.progress);
    }

    if (D.burn) {
      if (red) {
        const b = LOG.burn[C.wd(S.week, S.day)] || {};
        h += sec("Burnout", "cut or easy", `<div class="cut callout callout--cut"><b>Hard burnout is off.</b> Walk, or run a 60–70% easy version.</div>
          <div class="line conditioning-option">
            <button type="button" class="box phase-check" data-kind="burn" data-id="walk" data-i="0" aria-pressed="${chk("walk", 0)}" aria-label="Easy walk"></button>
            <div class="body"><div class="nm">10-minute easy incline walk</div><div class="why">Does not count as a hard burnout.</div></div>
          </div>
          <div class="line conditioning-option">
            <button type="button" class="box phase-check" data-kind="burn" data-id="burneasy" data-i="0" aria-pressed="${chk("burneasy", 0)}" aria-label="Easy burnout"></button>
            <div class="body">
              <div class="nm">Easy burnout · 60–70%</div>
              <div class="why">Same movements, slower and lighter. Distinct from a hard effort.</div>
              <div class="log-fields">
                <label class="ll">Note<input class="log-in wide" data-burn="note" value="${esc(b.note || "")}" placeholder="what you did"></label>
              </div>
            </div>
          </div>`, "", burnPhase.done, "burnout", burnPhase.progress);
      } else {
        const b = LOG.burn[C.wd(S.week, S.day)] || {};
        const effort = D.n === 4 && D.burn.benchmark && W.n <= 4 ? "90–95%" : W.burn;
        const pct = amber ? "moderate / scaled" : `at ${effort}`;
        const bench = W.n === 5 && D.burn.benchmark ? `<div class="guard"><span>Week 5 benchmark. Log rounds honestly.</span></div>` : "";
        const achillesNote = se.flags.achilles && D.burn.achilles ? `<div class="guard"><span>${esc(D.burn.achilles)}</span></div>` : "";
        const motNote = se.flags.motivation ? `<div class="guard"><span>Motivation is low — skipping the burnout is allowed.</span></div>` : "";
        h += sec(`Burnout${D.burn.optional ? " — optional" : ""}`, `${D.burn.fmt.split(" ")[0]} · ${pct}`,
          `<div class="conditioning-deck"><div class="body">
            <div class="burn-meta"><span>${esc(D.burn.fmt)}</span><span>Z4 by minute 4–6</span></div>
            <div class="nm">${esc(D.burn.nm)}${W.n === 5 && D.burn.benchmark ? " · benchmark" : ""}</div>
            <ol class="burn-stack">${D.burn.items.map(item => `<li>${esc(item)}</li>`).join("")}</ol>
            <div class="guard callout callout--coach"><span>${esc(D.burn.adj)}</span></div>
            ${achillesNote}${motNote}${bench}
            <div class="sets">
              <button type="button" class="set" data-id="burn" data-i="0" aria-pressed="${chk("burn", 0)}" aria-label="Burnout done" style="width:auto;padding:0 14px">done</button>
              ${D.burn.optional || se.flags.motivation ? `<button type="button" class="set" data-id="burnskip" data-i="0" aria-pressed="${chk("burnskip", 0)}" aria-label="Skip burnout" style="width:auto;padding:0 14px">skip</button>` : ""}
            </div>
            <div class="burn-log">
              <div class="field"><label for="burn-rounds">Rounds / score</label><input id="burn-rounds" data-burn="rounds" value="${esc(b.rounds || "")}" placeholder="e.g. 4+8"></div>
              <div class="field"><label>WHOOP zone</label>
                <div class="zone-segments" role="group" aria-label="WHOOP zone">
                  ${["Z3", "Z4", "Z5"].map(z => `<button type="button" data-zone="${z}" aria-pressed="${b.zone === z}">${z}</button>`).join("")}
                </div>
              </div>
              <div class="field"><label for="burn-scaled">Scaled?</label>
                <select id="burn-scaled" data-burn="scaled">
                  <option value="" ${!b.scaled ? "selected" : ""}>As written</option>
                  <option value="yes" ${b.scaled === "yes" || (amber && !b.scaled && b.scaled !== "") ? "selected" : ""}>Scaled</option>
                </select>
              </div>
              <div class="field"><label for="burn-note">Note</label><input id="burn-note" data-burn="note" value="${esc(b.note || "")}" placeholder="load, swap, feel"></div>
            </div>
          </div></div>`, "", burnPhase.done, "burnout", burnPhase.progress);
      }
    }

    if (D.down) {
      h += sec("Downshift", "2–5 min", `<div class="line downshift-cap">
        <button type="button" class="box phase-check" data-kind="down" data-id="down" data-i="0" aria-pressed="${chk("down", 0)}" aria-label="Downshift done"></button>
        <div class="body"><div class="nm">${esc(D.down)}</div></div>
      </div>${D.heat === "easy" || D.heat === "off" ? `<blockquote>${esc(P.principle)}</blockquote>` : ""}`,
      "", downPhase.done, "downshift", downPhase.progress);
    }

    document.getElementById("session").innerHTML = h;
    document.getElementById("ref-prog").innerHTML = P.weeks.map(w =>
      `<div class="block-stage${w.n === S.week ? " is-current" : ""}">
        <dt><span>0${w.n}</span> ${esc(w.intent)}</dt>
        <dd>${esc(w.main)} @ ${esc(w.rpe)}. ${esc(w.acc)}. Burnouts ${esc(w.burn)}.</dd>
      </div>`
    ).join("");
  }

  const METRICS = {
    e1rm: { lab: "Est 1RM", note: "Only weeks with logged reps. Load × (1 + reps ÷ 30).", fmt: v => Math.round(v) },
    tonnage: { lab: "Tonnage", note: "Only weeks with logged reps. Load × reps × sets completed.", fmt: v => v >= 1000 ? (v / 1000).toFixed(1) + "k" : Math.round(v) },
    load: { lab: "Load", note: "The number you put on the bar, unadjusted.", fmt: v => Math.round(v) }
  };

  function bwFor(w) {
    const own = C.num(LOG.bw[w]);
    if (own != null) return { v: own, exact: true };
    for (let i = w - 1; i >= 1; i--) {
      const v = C.num(LOG.bw[i]);
      if (v != null) return { v: v, exact: false, from: i };
    }
    return null;
  }

  function renderHistory() {
    const mode = S.metric || "e1rm";
    const M = METRICS[mode];
    const sum = C.weekSummary(S.week, LOG, P, SESSIONS);
    document.getElementById("week-sum").innerHTML = `
      <div class="dash-cell"><div class="label">Week ${S.week} started / complete</div><div class="value">${sum.started} / ${sum.completed}</div></div>
      <div class="dash-cell"><div class="label">Burnouts · Z4/5</div><div class="value">${sum.hard} hard · ${sum.optional} opt · ${sum.scaled} scaled · ${sum.z45} Z4/5</div></div>`;
    document.getElementById("metrics").innerHTML = Object.keys(METRICS).map(k =>
      `<button type="button" class="mbtn" data-m="${k}" aria-pressed="${k === mode}">${METRICS[k].lab}</button>`
    ).join("");
    document.getElementById("hist-key").innerHTML =
      `<span class="mnote" style="display:block">${M.note}</span>
       <i style="background:var(--ok)"></i>logged reps &amp; sets &nbsp;
       <i style="background:var(--warn)"></i>load only &nbsp;
       <i style="background:var(--muted)"></i>empty`;

    const tracked = P.days.flatMap(d => (d.lifts || []).filter(l => l.load).map(l => Object.assign({}, l, { day: d.n })));
    const rows = tracked.map(l => {
      const series = P.weeks.map(w => {
        const raw = (LOG.loads[C.loadKey(l.id, w.n, l.day)] || "").trim();
        const spec = C.repSpec(l, w.n, l.day, LOG, P);
        const arr = (LOG.checks[C.wd(w.n, l.day)] || {})[l.id] || [];
        const done = arr.slice(0, spec.sets).filter(Boolean).length;
        const added = C.num(raw);
        const bw = l.bw ? bwFor(w.n) : null;
        const eff = l.bw ? (bw ? bw.v + (added || 0) : null) : added;
        const v = mode === "load" ? C.metricValue(mode, eff, spec, done) : (spec.logged ? C.metricValue(mode, eff, spec, done) : null);
        return { w: w.n, raw: raw, n: eff, spec: spec, done: done, total: spec.sets, v: v };
      });
      const bwMissing = l.bw && !bwFor(S.week) && series.some(s => s.raw);
      return { l: l, series: series, any: series.some(s => s.raw), timed: series[0].spec.timed, bwMissing: bwMissing };
    }).filter(r => r.any);

    const el = document.getElementById("hist");
    if (!rows.length) {
      el.innerHTML = `<p class="hist-empty">Nothing logged yet. Enter a load on any main lift and it starts plotting here.</p>`;
      return;
    }
    el.innerHTML = rows.map(({ l, series, timed, bwMissing }) => {
      const plotted = timed && mode !== "load";
      const vals = series.filter(s => s.v != null);
      if (bwMissing) {
        return `<div class="lift timed"><div class="lift-h"><span class="ln">${esc(l.nm)}</span><span class="dl"><i>needs bodyweight</i></span></div>
          <div class="timed-note">Enter bodyweight in Setup — these reps move body + added weight.</div></div>`;
      }
      const max = Math.max.apply(null, vals.map(s => s.v).concat([1]));
      const first = vals[0], last = vals[vals.length - 1];
      let delta = "";
      if (vals.length > 1 && first.v !== last.v) {
        const d = last.v - first.v;
        delta = ` <b style="color:${d > 0 ? "var(--ok)" : "var(--muted)"}">${d > 0 ? "+" : ""}${M.fmt(d)}</b>`;
      } else if (vals.length === 1) delta = ` <i>first entry</i>`;
      if (plotted) return `<div class="lift timed"><div class="lift-h"><span class="ln">${esc(l.nm)}</span><span class="dl"><i>time-based</i></span></div>
        <div class="timed-note">Carries are held for time — switch to Load to see the weight.</div></div>`;
      const plot = series.map(s => {
        if (s.v == null) return `<div class="col empty"><div class="bar2"></div></div>`;
        const ht = Math.round(6 + (s.v / max) * 38);
        const c = !s.spec.logged && mode !== "load" ? "var(--warn)" : (s.done >= s.total ? "var(--ok)" : "var(--warn)");
        return `<div class="col ${s.w === 6 ? "deload" : ""}"><div class="bar2" style="height:${ht}px;--bc:${c}"></div></div>`;
      }).join("");
      const axis = series.map(s =>
        `<span class="${s.w === S.week ? "now" : ""}">${s.v != null ? `<b>${M.fmt(s.v)}</b>` : "<b>·</b>"}W${s.w}</span>`
      ).join("");
      return `<div class="lift">
        <div class="lift-h"><span class="ln">${esc(l.nm)}${l.bw ? ` <span class="bwtag">+ bodyweight</span>` : ""}</span>
          <span class="dl">${first ? M.fmt(first.v) : "—"} → ${last ? M.fmt(last.v) : "—"}${delta}</span></div>
        <div class="plot">${plot}</div><div class="axis">${axis}</div></div>`;
    }).join("");
  }

  function syncBackup() {
    const t = document.getElementById("backup-json");
    if (!t) return;
    if (document.activeElement === t || backupDirty) return;
    t.value = payload();
  }

  function setNavOpen(on) {
    const drawer = document.getElementById("nav-drawer");
    const btn = document.getElementById("week-btn");
    drawer.hidden = !on;
    btn.setAttribute("aria-expanded", on ? "true" : "false");
  }

  function firstUnfinished() {
    const se = sess();
    if (!se.ready) return document.getElementById("ready-card");
    const secs = document.querySelectorAll("#session .fc-phase");
    for (const el of secs) {
      if (!el.open) continue;
      const unchecked = el.querySelector(".box[aria-pressed='false'], .set[aria-pressed='false']");
      if (unchecked) return el;
    }
    return document.getElementById("main-content");
  }

  function focusWork() {
    const el = firstUnfinished();
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  function render(opts) {
    renderChrome();
    renderSession();
    updateProgress();
    renderHistory();
    syncBackup();
    updateStatus();
    if (opts && opts.focus) {
      requestAnimationFrame(() => requestAnimationFrame(focusWork));
    }
  }

  function goToday() {
    const t = C.suggested(S.start);
    S.week = t.week;
    S.day = t.day;
    setNavOpen(false);
    save();
    render({ focus: true });
  }

  function toggle(id, i, btn) {
    const D = dayObj();
    if (D.exclusive && liftById(id)) {
      const key = C.wd(S.week, S.day);
      const already = LOG.choice[key] === id && chk(id, 0);
      D.lifts.forEach(l => setChk(l.id, 0, false));
      if (!already) { LOG.choice[key] = id; setChk(id, 0, true); }
      else delete LOG.choice[key];
      save();
      renderSession();
      updateProgress();
      return;
    }
    if (id === "burn" && !chk("burn", 0)) setChk("burnskip", 0, false);
    if (id === "burnskip" && !chk("burnskip", 0)) {
      const prev = { burn: chk("burn", 0) };
      setChk("burn", 0, false);
      toast("Burnout skipped.", () => { setChk("burnskip", 0, false); if (prev.burn) setChk("burn", 0, true); save(); render(); });
    }
    setChk(id, i, !chk(id, i));
    save();
    if (btn && document.getElementById("session").contains(btn)) {
      btn.setAttribute("aria-pressed", chk(id, i) ? "true" : "false");
      if (id === "burn" || id === "burnskip") {
        const other = document.querySelector(`[data-id="${id === "burn" ? "burnskip" : "burn"}"]`);
        if (other) other.setAttribute("aria-pressed", chk(other.dataset.id, 0) ? "true" : "false");
      }
      updateProgress();
      renderHistory();
    } else {
      renderSession();
      updateProgress();
    }
  }

  function exportFile() {
    const text = payload();
    const name = `final-cut-backup-${C.iso(new Date())}.json`;
    const blob = new Blob([text], { type: "application/json" });
    const file = new File([blob], name, { type: "application/json" });
    const done = () => {
      S.lastExported = new Date().toISOString();
      saveNow();
      document.getElementById("bk-msg").className = "bk-msg ok";
      document.getElementById("bk-msg").textContent = "Exported.";
    };
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: "Final Cut backup" }).then(done).catch(() => downloadBlob(blob, name, done));
    } else downloadBlob(blob, name, done);
  }

  function downloadBlob(blob, name, done) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    done();
  }

  function restoreFromBox() {
    const t = document.getElementById("backup-json");
    const m = document.getElementById("bk-msg");
    let data;
    try { data = JSON.parse(t.value); C.validatePayload(data); } catch (err) {
      m.className = "bk-msg err";
      m.textContent = err.message || "That isn't valid log data.";
      return;
    }
    if (!confirm("Replace the log on this phone with the pasted backup?")) return;
    const prev = payloadObj();
    try {
      snapshot();
      applyMigrated(data);
      backupDirty = false;
      m.className = "bk-msg ok";
      m.textContent = "Restored.";
      saveNow();
      render();
      toast("Backup restored.", () => { applyMigrated(prev); saveNow(); render(); });
    } catch (err) {
      m.className = "bk-msg err";
      m.textContent = err.message || "Restore failed.";
    }
  }

  document.getElementById("mark").innerHTML = mark("sm");
  const colo = document.getElementById("colophon-mark");
  if (colo) colo.innerHTML = mark("sm");

  document.addEventListener("click", e => {
    if (e.target.closest("#toast-undo") && undo) { const fn = undo; undo = null; document.getElementById("toast").hidden = true; fn(); return; }
    if (e.target.closest("#setup-go")) {
      S.start = document.getElementById("setup-start").value || S.start;
      S.setupDone = true;
      const t = C.suggested(S.start);
      S.week = t.week; S.day = t.day;
      showSetup(false);
      saveNow();
      render({ focus: true });
      return;
    }
    if (e.target.closest("#week-btn")) {
      const drawer = document.getElementById("nav-drawer");
      setNavOpen(drawer.hidden);
      return;
    }
    if (e.target.closest("#today-btn")) { goToday(); return; }
    if (e.target.closest("#finish-btn")) {
      const se = sess();
      const prev = se.finished;
      se.finished = !se.finished;
      save();
      updateProgress();
      toast(se.finished ? "Session marked finished." : "Session reopened.", () => { se.finished = prev; save(); updateProgress(); });
      return;
    }
    if (e.target.closest("#bk-export")) { exportFile(); return; }
    if (e.target.closest("#bk-copy")) {
      const t = document.getElementById("backup-json");
      const m = document.getElementById("bk-msg");
      t.value = payload();
      t.select();
      const done = () => { m.className = "bk-msg ok"; m.textContent = "Copied."; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t.value).then(done, () => { m.textContent = "Copy manually."; });
      else try { document.execCommand("copy"); done(); } catch (_) { m.textContent = "Copy manually."; }
      return;
    }
    if (e.target.closest("#bk-restore")) { restoreFromBox(); return; }
    const w = e.target.closest("[data-w]");
    if (w) { S.week = +w.dataset.w; setNavOpen(false); save(); render({ focus: true }); return; }
    const d = e.target.closest("[data-d]");
    if (d) { S.day = +d.dataset.d; setNavOpen(false); save(); render({ focus: true }); return; }
    const r = e.target.closest("[data-r]");
    if (r) {
      const se = sess();
      const prev = se.ready;
      se.ready = r.dataset.r;
      if (se.ready === "amber") {
        const rec = LOG.burn[C.wd(S.week, S.day)] || {};
        if (!rec.scaled) { rec.scaled = "yes"; LOG.burn[C.wd(S.week, S.day)] = rec; }
      }
      save();
      setNavOpen(false);
      render({ focus: true });
      toast("Readiness set for this session.", () => { se.ready = prev; save(); render({ focus: true }); });
      return;
    }
    const mt = e.target.closest("[data-m]");
    if (mt) { S.metric = mt.dataset.m; save(); renderHistory(); return; }
    const zone = e.target.closest("[data-zone]");
    if (zone) {
      const key = C.wd(S.week, S.day);
      const rec = LOG.burn[key] || {};
      rec.zone = rec.zone === zone.dataset.zone ? "" : zone.dataset.zone;
      LOG.burn[key] = rec;
      save();
      renderSession();
      renderHistory();
      return;
    }
    const fl = e.target.closest("[data-flag]");
    if (fl) {
      const se = sess();
      se.flags[fl.dataset.flag] = !se.flags[fl.dataset.flag];
      save(); render(); return;
    }
    const ov = e.target.closest("[data-override]");
    if (ov) {
      const se = sess();
      const prev = JSON.parse(JSON.stringify(se.overrides[ov.dataset.override] || {}));
      se.overrides[ov.dataset.override] = { on: true, as: LOG.subs[C.loadKey(ov.dataset.override, S.week, S.day)] || "" };
      save(); render();
      toast("Swap logged for this session.", () => { se.overrides[ov.dataset.override] = prev; save(); render(); });
      return;
    }
    const c = e.target.closest("[data-carry]");
    if (c) {
      if (c.dataset.partial === "1" && !confirm("Prior week was incomplete. Carry that load anyway?")) return;
      LOG.loads[C.loadKey(c.dataset.carry, S.week, S.day)] = c.dataset.val;
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

  document.addEventListener("toggle", e => {
    const d = e.target.closest(".fc-phase");
    if (!d) return;
    sess().collapsed[d.dataset.sec] = !d.open;
    save();
  }, true);

  document.addEventListener("change", e => {
    const start = e.target.closest("#start-in");
    if (start) {
      if (C.hasLogs(LOG) && !confirm("Logs stay on week/day numbers. They will not move with this date. Continue?")) {
        start.value = S.start; return;
      }
      const prev = S.start;
      S.start = start.value;
      save(); renderChrome(); updateProgress();
      toast("Block start updated.", () => { S.start = prev; save(); renderChrome(); updateProgress(); });
      return;
    }
    const bw = e.target.closest("[data-bw]");
    if (bw) { LOG.bw[S.week] = bw.value; save(); renderChrome(); renderHistory(); return; }
    const loadEl = e.target.closest("[data-load]");
    if (loadEl) { LOG.loads[C.loadKey(loadEl.dataset.load, S.week, S.day)] = loadEl.value; save(); renderHistory(); return; }
    const reps = e.target.closest("[data-reps]");
    if (reps) { LOG.reps[C.loadKey(reps.dataset.reps, S.week, S.day)] = reps.value; save(); renderHistory(); return; }
    const rpe = e.target.closest("[data-rpe]");
    if (rpe) { LOG.rpe[C.loadKey(rpe.dataset.rpe, S.week, S.day)] = rpe.value; save(); renderSession(); return; }
    const sub = e.target.closest("[data-sub]");
    if (sub) { LOG.subs[C.loadKey(sub.dataset.sub, S.week, S.day)] = sub.value; save(); return; }
    const burn = e.target.closest("[data-burn]");
    if (burn) {
      const rec = LOG.burn[C.wd(S.week, S.day)] || {};
      rec[burn.dataset.burn] = burn.value;
      LOG.burn[C.wd(S.week, S.day)] = rec;
      save();
    }
  });

  document.addEventListener("input", e => {
    if (e.target.id === "backup-json") { backupDirty = true; return; }
    const bw = e.target.closest("[data-bw]");
    if (bw) { LOG.bw[S.week] = bw.value; save(); return; }
    const loadEl = e.target.closest("[data-load]");
    if (loadEl) { LOG.loads[C.loadKey(loadEl.dataset.load, S.week, S.day)] = loadEl.value; save(); }
    const reps = e.target.closest("[data-reps]");
    if (reps) { LOG.reps[C.loadKey(reps.dataset.reps, S.week, S.day)] = reps.value; save(); }
    const rpe = e.target.closest("[data-rpe]");
    if (rpe) { LOG.rpe[C.loadKey(rpe.dataset.rpe, S.week, S.day)] = rpe.value; save(); }
    const sub = e.target.closest("[data-sub]");
    if (sub) { LOG.subs[C.loadKey(sub.dataset.sub, S.week, S.day)] = sub.value; save(); }
    const burn = e.target.closest("[data-burn]");
    if (burn && burn.tagName === "INPUT") {
      const rec = LOG.burn[C.wd(S.week, S.day)] || {};
      rec[burn.dataset.burn] = burn.value;
      LOG.burn[C.wd(S.week, S.day)] = rec;
      save();
    }
  });

  document.getElementById("backup-json").addEventListener("blur", () => {
    if (!backupDirty) syncBackup();
  });

  document.addEventListener("visibilitychange", () => { if (document.hidden) flush(); });
  window.addEventListener("pagehide", flush);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").then(reg => {
        if (reg.waiting) offerUpdate(reg.waiting);
        reg.addEventListener("updatefound", () => {
          const sw = reg.installing;
          if (!sw) return;
          sw.addEventListener("statechange", () => { if (sw.state === "installed" && navigator.serviceWorker.controller) offerUpdate(sw); });
        });
      }).catch(() => {
        const el = document.getElementById("update-banner");
        el.hidden = false;
        el.className = "save-banner show";
        el.textContent = "Offline copy unavailable in this browser. The live page still works.";
      });
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        location.reload();
      });
    });
  }

  function offerUpdate(worker) {
    const el = document.getElementById("update-banner");
    el.hidden = false;
    el.className = "save-banner show";
    el.innerHTML = `A newer Final Cut is ready. <button type="button" class="mbtn" id="reload-app">Update now</button>`;
    document.getElementById("reload-app").onclick = () => { worker.postMessage({ type: "SKIP_WAITING" }); };
  }

  load();
})();
