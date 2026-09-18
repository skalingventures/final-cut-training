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
    if not burns[1] or not burns[1].get("achilles"):
        err("day 1 burnout missing achilles note")
    if not burns[2] or not burns[2].get("achilles"):
        err("day 2 burnout missing achilles note")
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


def check_app_js() -> None:
    js = read("app.js")
    for needle in [
        "FinalCutCore", "saveNow", "pagehide", "setupDone", "SESSIONS",
        "SKIP_WAITING", "resolveBurn", "prepPump", "fc-job", "fc-cousins",
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
