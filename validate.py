#!/usr/bin/env python3
"""Static checks for the Final Cut training app."""
from __future__ import annotations

import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent
errors: list[str] = []


def err(msg: str) -> None:
    errors.append(msg)


def read(name: str) -> str:
    return (ROOT / name).read_text(encoding="utf-8")


def check_files() -> None:
    required = [
        "index.html", "styles.css", "app.js", "core.js", "program.js",
        "sw.js", "manifest.webmanifest", "README.md", "CANON.md", ".nojekyll",
        "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png",
        "icons/apple-touch-icon.png", "test/core.test.js", "test/persist.test.js",
        ".github/workflows/ci.yml",
    ]
    for name in required:
        if not (ROOT / name).exists():
            err(f"missing {name}")


def check_html() -> None:
    html = read("index.html")
    for needle in [
        'href="#main-content"',
        "Skip to content",
        "Skaling Ventures",
        "For the Love of the Game",
        "./core.js",
        "./app.js",
        "How do you feel",
        "nav-drawer",
        'id="prog-text"',
        'id="prev-day"',
        'id="next-day"',
        "Finish session",
        "Export file",
        "Block start Monday",
        "safe-area",
    ]:
        if needle not in html and needle != "safe-area":
            if needle == "safe-area" and "viewport-fit=cover" not in html:
                err("index.html missing viewport-fit=cover")
            elif needle != "safe-area":
                err(f"index.html missing {needle!r}")


def check_html_absences() -> None:
    """Chrome deleted in the 2.0 rebuild must not creep back."""
    html = read("index.html")
    for gone in ["prog-ring", "phase-progress", "sticky-ready", 'class="toast"']:
        if gone in html:
            err(f"index.html still contains {gone!r}")
    # The manual is its own page; the instrument does not carry it.
    if "Operating intent" in html:
        err("index.html still carries the reference text; it belongs in reference.html")
    ref = read("reference.html")
    if "Operating intent" not in ref:
        err("reference.html is missing the reference text")
    if 'data-mode="bone"' not in ref:
        err("reference.html should be Bone mode")


def check_css() -> None:
    css = read("styles.css")
    html = read("index.html")
    for t in ["min-height: 44px", ".setup", "--fc-heat-hard"]:
        if t not in css:
            err(f"styles.css missing {t!r}")
    for t in ['data-mode="graphite"', "ds/tokens/index.css", 'class="sv-skip"']:
        if t not in html:
            err(f"index.html missing {t!r}")
    # The brand contract, enforced. Each of these is an anti-pattern the
    # design system names by hand; see docs/DESIGN_AUDIT.md section 3.1.
    banned = [
        "border-radius: 1", "border-radius: 999", "border-radius: 50%",
        "backdrop-filter", "linear-gradient", "color-mix",
        "font: 600", "font: 700", "font: 800",
        "font-weight: 6", "font-weight: 7", "font-weight: 8",
        "rgba(", "DM Sans",
    ]
    for t in banned:
        if t in css:
            err(f"styles.css must not contain {t!r}")
    if re.search(r"#[0-9A-Fa-f]{6}\b", css):
        err("styles.css must not contain a hex colour; use a semantic token")
    if "family=DM+Sans" in html:
        err("index.html still loads DM Sans")


def check_app_tokens() -> None:
    """Inline styles in app.js reach for the same semantic tokens as the CSS."""
    js = read("app.js")
    stale = re.findall(r"var\(--(?!sv-|fc-|svb-|svc-|svt-|svd-|svf-|svbg-|svm-|bc\b)[a-z-]+\)", js)
    if stale:
        err(f"app.js uses retired tokens: {sorted(set(stale))}")
    if re.search(r"#[0-9A-Fa-f]{6}\b", js):
        err("app.js must not contain a hex colour; use a semantic token")


def check_type_floor() -> None:
    """Body 16, labels 14, mono meta 12. Nothing smaller, anywhere."""
    css = read("styles.css")
    for decl in re.findall(r"font(?:-size)?\s*:\s*([^;{}]+)", css):
        for raw in re.findall(r"([\d.]+)px", decl):
            if float(raw) < 12:
                err(f"styles.css font size {raw}px is below the 12px floor")


def check_js_syntax() -> None:
    for name in ("app.js", "core.js", "program.js", "sw.js"):
        r = subprocess.run(["node", "--check", str(ROOT / name)], capture_output=True, text=True)
        if r.returncode != 0:
            err(f"{name} syntax: {r.stderr.strip()}")


def load_program() -> dict:
    src = read("program.js")
    r = subprocess.run(
        ["node", "-e", "const window = {};\n" + src + "\nconsole.log(JSON.stringify(window.PROGRAM))"],
        capture_output=True, text=True
    )
    if r.returncode != 0:
        err(f"program.js eval failed: {r.stderr.strip()}")
        return {}
    return json.loads(r.stdout)


def resolve_burn(day: dict, week: int) -> dict | None:
    """Mirror Core.resolveBurn — byWeek, else week-matched menu, else base."""
    raw = day.get("burn")
    if not raw:
        return None
    overlay = None
    by_week = raw.get("byWeek")
    if isinstance(by_week, dict):
        overlay = by_week.get(week) or by_week.get(str(week))
    elif isinstance(raw.get("menu"), list) and raw["menu"]:
        overlay = next(
            (m for m in raw["menu"] if isinstance(m, dict) and week in (m.get("weeks") or [])),
            None,
        )
        if overlay is None and not raw.get("nm"):
            overlay = next(
                (m for m in raw["menu"] if isinstance(m, dict) and not m.get("weeks")),
                raw["menu"][0],
            )
    resolved = dict(raw)
    if overlay:
        resolved.update(overlay)
    for k in ("byWeek", "menu", "id", "label", "weeks"):
        resolved.pop(k, None)
    return resolved


def check_optional_shapes(day: dict) -> None:
    n = day.get("n")
    for lift in day.get("lifts") or []:
        job = lift.get("job") or lift.get("role")
        if job is not None and not isinstance(job, str):
            err(f"day {n} lift {lift.get('id')} job/role must be a string")
        cousins = lift.get("cousins")
        if cousins is not None:
            if not isinstance(cousins, list) or not all(isinstance(c, str) for c in cousins):
                err(f"day {n} lift {lift.get('id')} cousins must be a string list")
    pp = day.get("prepPump")
    if pp is not None:
        if not isinstance(pp, dict):
            err(f"day {n} prepPump must be an object")
        else:
            items = pp.get("items") or []
            if not isinstance(items, list):
                err(f"day {n} prepPump.items must be a list")
            for i, item in enumerate(items):
                if not isinstance(item, dict) or not item.get("a"):
                    err(f"day {n} prepPump item {i} needs an action name")
    burn = day.get("burn")
    if not burn:
        return
    if burn.get("byWeek") is not None and not isinstance(burn["byWeek"], dict):
        err(f"day {n} burn.byWeek must be an object")
    if burn.get("menu") is not None:
        if not isinstance(burn["menu"], list):
            err(f"day {n} burn.menu must be a list")
        else:
            for i, row in enumerate(burn["menu"]):
                if not isinstance(row, dict):
                    err(f"day {n} burn.menu[{i}] must be an object")
                elif row.get("weeks") is not None and not isinstance(row["weeks"], list):
                    err(f"day {n} burn.menu[{i}].weeks must be a list")


def check_program(p: dict) -> None:
    if not p:
        return
    if len(p.get("weeks", [])) != 6:
        err("expected 6 weeks")
    if len(p.get("days", [])) != 7:
        err("expected 7 days")
    burns = {d["n"]: d.get("burn") for d in p["days"]}
    if not burns.get(1):
        err("day 1 missing burnout")
    if not burns.get(2):
        err("day 2 missing burnout")
    if p["days"][5].get("exclusive") is not True:
        err("day 6 should be exclusive")
    # The RPE field is rendered in a numeric slot on every main lift. Prose
    # there reads as "4 x 6 @ slightly heavier", which is not a prescription.
    for w in p.get("weeks", []):
        if not re.match(r"^RPE \d", str(w.get("rpe", ""))):
            err(f"week {w.get('n')} rpe must start with an RPE number, got {w.get('rpe')!r}")
    for day in p.get("days", []):
        check_optional_shapes(day)
        if not day.get("burn"):
            continue
        for week in range(1, 7):
            resolved = resolve_burn(day, week)
            if not resolved or not resolved.get("nm") or not resolved.get("fmt"):
                err(f"day {day.get('n')} week {week} resolved burn needs nm and fmt")
            elif not resolved.get("items"):
                err(f"day {day.get('n')} week {week} resolved burn needs items")
    check_midblock_content(p)


DAY_BANS = {
    1: {"squat", "pull-v", "hinge", "carry"},
    2: {"push-h", "push-v", "carry"},
    4: {"hinge", "push-v", "pull-v", "carry", "lunge"},
}

# Legal exception: squat thrust is an elastic sprawl, not a squat pattern.
PATTERN_ALIASES = {
    "push-h": "push-h",
    "push-v": "push-v",
    "pull-h": "pull-h",
    "pull-v": "pull-v",
    "hinge": "hinge",
    "squat": "squat",
    "lunge": "lunge",
    "crawl": "crawl",
    "carry": "carry",
    "cyclical": "cyclical",
    "elastic": "elastic",
    "slam": "slam",
    "core": "core",
    "iso": "iso",
}

# Prefer deriving tags from movement names. Order: more specific first.
# "squat thrust" is stripped before the squat pattern runs.
MOVEMENT_PATTERNS = [
    (re.compile(r"burpee|sprawl", re.I), "elastic"),
    (re.compile(r"pogo|broad jump|\bjump|bound", re.I), "elastic"),
    (re.compile(r"step-over|step over", re.I), "elastic"),
    (re.compile(r"wall[- ]?ball|goblet|air squat", re.I), "squat"),
    (re.compile(r"\blunge", re.I), "lunge"),
    (re.compile(r"push-up|push up|pushup", re.I), "push-h"),
    (re.compile(r"push press|overhead press|\bohp\b|(?<!floor/)(?<!floor )\bpress\b", re.I), "push-v"),
    (re.compile(r"pull-up|pullup|chin-up|chinup", re.I), "pull-v"),
    (re.compile(r"inverted|ring row", re.I), "pull-h"),
    (re.compile(r"farmer|suitcase|rack carry|\bcarry\b", re.I), "carry"),
    (re.compile(r"swing|deadlift|\brdl\b|good morning|\bhinge\b", re.I), "hinge"),
    (re.compile(r"bear crawl|\bcrawl", re.I), "crawl"),
    (re.compile(r"med-ball slam|med ball slam|\bslam", re.I), "slam"),
    (re.compile(r"bike or row|easy row|assault bike|\bbike\b|\bmarch\b|\bwalk\b", re.I), "cyclical"),
    (re.compile(r"mountain climber|plank|shoulder tap", re.I), "core"),
]


def tags_from_items(items: list) -> set[str]:
    """Derive pattern tags from the written stations. Do not trust hand-written tags alone."""
    tags: set[str] = set()
    for raw in items or []:
        text = str(raw)
        if re.search(r"squat thrust", text, re.I):
            tags.add("elastic")
            text = re.sub(r"squat thrusts?", "", text, flags=re.I)
        for rx, tag in MOVEMENT_PATTERNS:
            if rx.search(text):
                tags.add(tag)
    return tags


ABSENT_MENTION = [
    ("crawl", re.compile(r"\bcrawl", re.I), re.compile(r"crawl", re.I)),
    ("burpee", re.compile(r"burpee", re.I), re.compile(r"burpee", re.I)),
    ("march", re.compile(r"\bmarch", re.I), re.compile(r"\bmarch", re.I)),
    ("swing", re.compile(r"\bswing", re.I), re.compile(r"\bswing", re.I)),
    ("push-up", re.compile(r"push-up|push up|pushup", re.I), re.compile(r"push-up|push up|pushup", re.I)),
]


def is_prohibition(note: str, word: str) -> bool:
    return bool(re.search(rf"\b(?:no|not|never)\b[^.]*\b{word}", note, re.I))


def notes_mention_absent(note: str, items_blob: str) -> list[str]:
    hits = []
    if re.search(r"push,\s*crawl,\s*march", note, re.I) and not (
        re.search(r"crawl", items_blob, re.I) and re.search(r"\bmarch", items_blob, re.I)
    ):
        hits.append("push/crawl/march closer")
    for label, in_note, in_items in ABSENT_MENTION:
        if in_note.search(note) and not in_items.search(items_blob) and not is_prohibition(note, label):
            hits.append(label)
    return hits


def lift_names(day: dict, week: int | None = None) -> list[str]:
    names: list[str] = []
    for lift in day.get("lifts") or []:
        names.append(str(lift.get("id") or ""))
        names.append(str(lift.get("nm") or ""))
        by_week = lift.get("byWeek") or {}
        if week is not None:
            overlay = by_week.get(week) or by_week.get(str(week)) or {}
            if overlay.get("nm"):
                names.append(str(overlay["nm"]))
        else:
            for ov in by_week.values():
                if isinstance(ov, dict) and ov.get("nm"):
                    names.append(str(ov["nm"]))
    return [n for n in names if n]


def for_matches_lift(for_line: str, day: dict) -> bool:
    needle = (for_line or "").strip().lower()
    if not needle:
        return False
    for name in lift_names(day):
        hay = name.lower().replace("_", " ")
        if needle in hay or hay in needle:
            return True
        # allow "pull-ups" to match lift id "pullup"
        compact_n = re.sub(r"[^a-z0-9]", "", needle)
        compact_h = re.sub(r"[^a-z0-9]", "", hay)
        if compact_n and compact_n in compact_h:
            return True
    return False


def check_midblock_content(p: dict) -> None:
    """Block 01 mid-block musts — optional fields become required on the days that use them."""
    days = {d["n"]: d for d in p.get("days", [])}

    for n, day in days.items():
        has = bool(day.get("prepPump"))
        if n in (1, 2, 4) and not has:
            err(f"day {n} must have prepPump")
        if n not in (1, 2, 4) and has:
            err(f"day {n} must not have prepPump")

    for n in (1, 2, 4):
        for lift in days.get(n, {}).get("lifts") or []:
            if lift.get("prog") and lift.get("pair"):
                err(f"day {n} main {lift.get('id')} must not be paired")

    for n in (1, 2, 4):
        for lift in days.get(n, {}).get("lifts") or []:
            if lift.get("prog"):
                continue
            if not (lift.get("job") or lift.get("role")):
                err(f"day {n} accessory {lift.get('id')} missing job")
            if lift.get("id") != "elastic" and not lift.get("cousins"):
                err(f"day {n} accessory {lift.get('id')} missing cousins")

    for lift in days.get(5, {}).get("lifts") or []:
        if not (lift.get("job") or lift.get("role")):
            err(f"day 5 chassis {lift.get('id')} missing job")

    elastic = next((l for l in (days.get(4) or {}).get("lifts") or [] if l.get("id") == "elastic"), None)
    if not elastic or not isinstance(elastic.get("byWeek"), dict):
        err("day 4 elastic must rotate by week")
    else:
        keys = {str(k) for k in elastic["byWeek"]}
        if not {"1", "2", "3", "4", "5", "6"} <= keys:
            err("day 4 elastic byWeek must have weeks 1–6")

    d5_lifts = {l.get("id"): l for l in (days.get(5) or {}).get("lifts") or []}
    if "chest-supported" not in str((d5_lifts.get("oarow") or {}).get("byWeek") or {}).lower():
        err("day 5 W2 row rotation should become chest-supported row")
    if "split squat" not in str((d5_lifts.get("goblet") or {}).get("byWeek") or {}).lower():
        err("day 5 W3 goblet rotation should become FFE split squat")
    if "incline" not in str((d5_lifts.get("floor") or {}).get("byWeek") or {}).lower():
        err("day 5 W4 floor rotation should become incline press")

    for n in (3, 6):
        note = days.get(n, {}).get("mobNote") or ""
        if not note:
            err(f"day {n} missing mobNote")
        elif not re.search(r"no level 3", note, re.I):
            err(f"day {n} mobNote must forbid Level 3")
        tissue_note = ((days.get(n) or {}).get("tissue") or {}).get("note") or ""
        if not tissue_note:
            err(f"day {n} tissue must have a why note")

    d5_mob = days.get(5, {}).get("mobNote") or ""
    if not re.search(r"level 1.?–.?2|l1.?–.?l2|stay on level 1", d5_mob, re.I):
        err("day 5 mobNote must keep the athlete on L1–L2")
    for n in (1, 2, 4, 5):
        note = days.get(n, {}).get("mobNote") or ""
        if re.search(r"earn level 3", note, re.I):
            err(f"day {n} mobNote must not tell the athlete to earn L3")
    for w in p.get("weeks", []):
        if w.get("n") in (2, 3, 4) and "Earn the next level only when today's level is clean" not in (w.get("mob") or ""):
            err(f"week {w.get('n')} mob must keep the original W2–W4 line (D3/D6 may only add tissue notes)")
        if w.get("n") in (5, 6) and re.search(r"climb", w.get("mob") or "", re.I):
            err(f"week {w.get('n')} mob must not tell the athlete to climb")

    mob_notes = [days.get(n, {}).get("mobNote") or "" for n in (1, 2, 4, 5)]
    if len(set(mob_notes)) < 4:
        err("D1/D2/D4/D5 mobNotes must be distinct")

    d4 = days.get(4) or {}
    for week in range(1, 7):
        resolved = resolve_burn(d4, week) or {}
        if week == 5 and not resolved.get("benchmark"):
            err("day 4 week 5 must be the sole chaotic benchmark")
        if week != 5 and resolved.get("benchmark"):
            err(f"day 4 week {week} must not be a benchmark")
        if week == 6 and re.search(r"redline|benchmark|chaos", (resolved.get("nm") or "") + " " + (resolved.get("adj") or ""), re.I) and "no redline" not in (resolved.get("adj") or "").lower():
            err("day 4 week 6 must not redline")

    for n in (1, 2, 4):
        burn = (days.get(n) or {}).get("burn") or {}
        by_week = burn.get("byWeek") or {}
        keys = {str(k) for k in by_week}
        if not {"1", "2", "3", "4", "5", "6"} <= keys:
            err(f"day {n} burn.byWeek must have explicit W1–6 entries")
        prev = None
        for week in range(1, 7):
            resolved = resolve_burn(days.get(n) or {}, week) or {}
            blob = " | ".join([
                resolved.get("nm") or "",
                resolved.get("fmt") or "",
                " ".join(resolved.get("items") or []),
            ])
            if prev is not None and blob == prev:
                err(f"day {n} week {week} burn must differ from week {week - 1}")
            prev = blob
            handwritten = {PATTERN_ALIASES.get(str(tag), str(tag)) for tag in (resolved.get("patterns") or [])}
            derived = tags_from_items(resolved.get("items") or [])
            tags = derived | handwritten
            if not derived:
                err(f"day {n} week {week} burn: could not derive pattern tags from items")
            banned = DAY_BANS[n]
            hit = tags & banned
            if hit:
                err(f"day {n} week {week} burn has banned pattern(s) {sorted(hit)}")
            blob = " ".join(resolved.get("items") or [])
            note = " ".join([
                resolved.get("adj") or "",
                resolved.get("achilles") or "",
                (days.get(n) or {}).get("burn", {}).get("adj") or "",
                (days.get(n) or {}).get("burn", {}).get("achilles") or "",
            ])
            absent = notes_mention_absent(note, blob)
            if absent:
                err(f"day {n} week {week} burnout note names {absent} missing from this week's card")

    formats = set()
    for n in (1, 2, 4):
        for week in range(1, 7):
            resolved = resolve_burn(days.get(n) or {}, week) or {}
            fmt = (resolved.get("fmt") or "").lower()
            if "ladder" in fmt:
                formats.add("ladder")
            elif "40" in fmt and "20" in fmt:
                formats.add("40/20")
            elif "30" in fmt and re.search(r"30", fmt):
                formats.add("30/30")
            elif "emom" in fmt:
                formats.add("emom")
            elif "hybrid" in fmt:
                formats.add("hybrid")
            elif "amrap" in fmt:
                formats.add("amrap")
            elif "easy" in fmt or "soft" in fmt:
                formats.add("soft")
            else:
                formats.add(fmt or "other")
    if len(formats) < 4:
        err(f"need ≥4 burnout formats across D1/D2/D4, got {sorted(formats)}")

    d1_all = " ".join(
        " ".join((resolve_burn(days.get(1) or {}, w) or {}).get("items") or [])
        for w in range(1, 7)
    ).lower()
    if "squat thrust" not in d1_all or "push-up" not in d1_all or "slam" not in d1_all:
        err("Kjael ladder B remap (push-ups / squat thrusts / slams) must appear on Day 1")

    d2_all = " ".join(
        " ".join((resolve_burn(days.get(2) or {}, w) or {}).get("items") or [])
        for w in range(1, 7)
    ).lower()
    if not re.search(r"inverted|ring row", d2_all) or "air squat" not in d2_all or "lunge" not in d2_all or "mountain climber" not in d2_all:
        err("Kjael ladder A remap (row / air squat / lunge / climber) must appear on Day 2")

    d2w3 = " ".join((resolve_burn(days.get(2) or {}, 3) or {}).get("items") or []).lower()
    d2w1 = " ".join((resolve_burn(days.get(2) or {}, 1) or {}).get("items") or []).lower()
    if "air squat" in d2w1 or "air squat" in d2w3:
        err("Day 2 Menu A must use bike or row at stations 4/9, not air squat")
    if d2w1 == d2w3:
        err("Day 2 Week 3 must visibly differ from Week 1")

    d5 = days.get(5, {}).get("burn") or {}
    r5 = resolve_burn(days.get(5) or {}, 1) or {}
    if not r5.get("optional"):
        err("day 5 burn must stay optional")
    if not re.search(r"aerobic|pump|cyclical|walk|bike|row", (r5.get("nm") or "") + " " + (r5.get("fmt") or ""), re.I):
        err("day 5 default burn should be an aerobic pump")
    menu = d5.get("menu") or []
    ccs = next((m for m in menu if isinstance(m, dict) and re.search(r"carry|ccs|swing", str(m.get("nm", "") + m.get("label", "")), re.I)), None)
    if not ccs:
        err("day 5 should keep CCS as a green option in burn.menu")
    elif set(ccs.get("weeks") or []) != {1, 2, 3, 4}:
        err("day 5 CCS green option must be offered W1–W4 only")
    elif not ccs.get("items"):
        err("day 5 CCS green option must list its stations")

    for week in (5, 6):
        resolved = resolve_burn(days.get(5) or {}, week) or {}
        if re.search(r"z4|redline|chaos", (resolved.get("nm") or "") + " " + (resolved.get("fmt") or "") + " " + (resolved.get("adj") or ""), re.I):
            if "no redline" not in (resolved.get("adj") or "").lower():
                err(f"day 5 week {week} must stay soft / skip")
    for week in (5, 6):
        overlay_adj = ((d5.get("byWeek") or {}).get(week) or (d5.get("byWeek") or {}).get(str(week)) or {}).get("adj") or ""
        if re.search(r"green option in Weeks?\s*1", overlay_adj, re.I):
            err(f"day 5 week {week} must not advertise CCS as a green option")
    d5w6 = resolve_burn(days.get(5) or {}, 6) or {}
    d5w6_effort = (d5w6.get("effort") or "").strip()
    if re.fullmatch(r"RPE\s*~?\s*7", d5w6_effort):
        err("day 5 week 6 must not show RPE 7 — use an easy/walk RPE")
    if re.search(r"RPE\s*~?\s*7", (days.get(5) or {}).get("restTitleByWeek", {}).get(6) or (days.get(5) or {}).get("restTitleByWeek", {}).get("6") or ""):
        err("day 5 week 6 restTitle must not show RPE 7")

    accs = [w.get("acc", "") for w in p.get("weeks", [])]
    if len(accs) == 6:
        if not all(re.search(r"cousin", accs[i], re.I) for i in range(4)):
            err("weeks 1–4 acc should mention cousin variety")
        if not re.search(r"own", accs[4], re.I):
            err("week 5 acc should stay on owned cousins")
        if not re.search(r"easy|drop|reduce|30", accs[5], re.I):
            err("week 6 acc should be easy / reduced")

    for n in (1, 2, 4, 5):
        tissue = (days.get(n) or {}).get("tissue") or {}
        items = tissue.get("items") or []
        if not items:
            err(f"day {n} missing tissue items")
            continue
        top = [it for it in items if not it.get("optional")]
        if n == 2:
            if not re.search(r"pressing, overhead, and the row", tissue.get("goal") or "", re.I):
                err("day 2 tissue goal must read 'Prep pressing, overhead, and the row'")
            if not top or not re.search(r"chest", (top[0].get("a") or ""), re.I):
                err("day 2 tissue must list chest first")
        if n == 1:
            top_names = " ".join(it.get("a") or "" for it in top[:3]).lower()
            if "lat" not in top_names:
                err("day 1 top 3 tissue must include lats")
        for it in items:
            for_id = it.get("forId")
            for_line = it.get("for") or ""
            if for_id:
                if not any(l.get("id") == for_id for l in (days[n].get("lifts") or [])):
                    err(f"day {n} tissue {it.get('a')!r} forId={for_id!r} is not a lift on this day")
            elif not it.get("optional"):
                if not for_line:
                    err(f"day {n} tissue {it.get('a')!r} missing for-line")
                elif not for_matches_lift(for_line, days[n]):
                    err(f"day {n} tissue {it.get('a')!r} for={for_line!r} does not name a real lift")
        if n == 5:
            for it in items:
                if it.get("for") and not it.get("forId"):
                    err(f"day 5 tissue {it.get('a')!r} must set forId so the for-line follows the weekly chassis swap")

    for n in (1, 2, 4):
        pp = (days.get(n) or {}).get("prepPump") or {}
        dose = str(pp.get("dose") or "")
        nums = [int(x) for x in re.findall(r"\d+", dose)]
        if not nums or max(nums) > 4:
            err(f"day {n} prepPump dose must be ≤4 min, got {dose!r}")
        if not re.search(r"rpe\s*≤\s*6|rpe <= 6|rpe ≤6", str(pp.get("goal") or ""), re.I):
            err(f"day {n} prepPump goal must state RPE ≤6")
        if not re.search(r"skip", str(pp.get("note") or ""), re.I):
            err(f"day {n} prepPump must display a skip rule")
    d4pp = " ".join(
        [((days.get(4) or {}).get("prepPump") or {}).get("goal") or ""]
        + [str(it.get("a") or "") for it in ((days.get(4) or {}).get("prepPump") or {}).get("items") or []]
    ).lower()
    if re.search(r"kb deadlift|kettlebell deadlift|pogo", d4pp):
        err("day 4 prepPump must not use a loaded hinge or pogo")
    if "hinge reach" not in d4pp and "calf" not in d4pp:
        err("day 4 prepPump should be bodyweight hinge reach + easy calf raises")


def check_app_js() -> None:
    js = read("app.js")
    for needle in [
        "FinalCutCore", "saveNow", "pagehide", "setupDone", "SESSIONS",
        "SKIP_WAITING", "resolveBurn", "resolveLift", "prepPump", "prepPumpGated",
        "burnEffort", "burnItemText", "fc-job", "fc-cousins", "fc-for",
        "achillesReadiness", "resolveTissue", "resolveMobNote",
        "burnGreenTitle",
    ]:
        if needle not in js:
            err(f"app.js missing {needle!r}")
    if "window.storage" in js:
        err("app.js still depends on window.storage")
    if "final-cut:v2" not in js:
        err("app.js should still read legacy v2 keys")


def check_sw() -> None:
    sw = read("sw.js")
    if "core.js" not in sw:
        err("sw.js does not cache core.js")
    if "SKIP_WAITING" not in sw:
        err("sw.js missing skip waiting")
    if "cached || fetched" in sw and "networkFirst" not in sw:
        err("sw.js still cache-first for documents")


def main() -> int:
    check_files()
    check_html()
    check_html_absences()
    check_css()
    check_type_floor()
    check_app_tokens()
    check_js_syntax()
    program = load_program()
    check_program(program)
    check_app_js()
    check_sw()
    print(f"program days={len(program.get('days', []))} weeks={len(program.get('weeks', []))}")
    if errors:
        print(f"FAIL {len(errors)} errors")
        for e in errors:
            print(" -", e)
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
