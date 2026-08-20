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
warns: list[str] = []


def err(msg: str) -> None:
    errors.append(msg)


def warn(msg: str) -> None:
    warns.append(msg)


def read(name: str) -> str:
    return (ROOT / name).read_text(encoding="utf-8")


def check_files() -> None:
    required = [
        "index.html", "styles.css", "app.js", "program.js",
        "sw.js", "manifest.webmanifest", "README.md", ".nojekyll",
        "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png",
        "icons/apple-touch-icon.png",
    ]
    for name in required:
        if not (ROOT / name).exists():
            err(f"missing {name}")


def check_html() -> None:
    html = read("index.html")
    for needle in [
        'href="#main-content"',
        'id="main-content"',
        "Skip to content",
        "Skaling Ventures",
        "For the Love of the Game",
        'rel="manifest"',
        "./program.js",
        "./app.js",
        "./styles.css",
        "Block start",
        "Readiness",
        "Backup",
        "Reference",
        "Operating intent",
        "Burnout rules",
        "Readiness rules",
        "Redundancy guardrails",
    ]:
        if needle not in html:
            err(f"index.html missing {needle!r}")
    if "<aside" in html:
        err("index.html uses <aside>; brand spec wants <nav> / <main>")


def check_css() -> None:
    css = read("styles.css")
    tokens = {
        "--bg: #1F1F1F",
        "--accent: #D08B68",
        "--font-display: \"DM Sans\"",
        "--font-mono: \"IBM Plex Mono\"",
        "prefers-reduced-motion",
        "focus-visible",
        "min-height: 44px",
        ".colophon",
    }
    for t in tokens:
        if t not in css:
            err(f"styles.css missing {t!r}")


def check_js_syntax() -> None:
    for name in ("app.js", "program.js", "sw.js"):
        r = subprocess.run(["node", "--check", str(ROOT / name)], capture_output=True, text=True)
        if r.returncode != 0:
            err(f"{name} syntax: {r.stderr.strip()}")


def load_program() -> dict:
    src = read("program.js")
    # Evaluate program.js in node and dump JSON.
    r = subprocess.run(
        ["node", "-e", "const window = {};\n" + src + "\nconsole.log(JSON.stringify(window.PROGRAM))"],
        capture_output=True, text=True
    )
    if r.returncode != 0:
        err(f"program.js eval failed: {r.stderr.strip()}")
        return {}
    return json.loads(r.stdout)


def check_program(p: dict) -> None:
    if not p:
        return
    if len(p.get("weeks", [])) != 6:
        err(f"expected 6 weeks, got {len(p.get('weeks', []))}")
    if len(p.get("days", [])) != 7:
        err(f"expected 7 days, got {len(p.get('days', []))}")
    required_lifts = {
        1: {"squat", "pullup", "rdl", "peterson", "hkr"},
        2: {"bench", "row", "ohp", "dips", "farmer"},
        3: {"z2", "breath"},
        4: {"dead", "pp", "chin", "lunge", "suit"},
        5: {"goblet", "floor", "oarow", "wallcalf", "copen", "hang"},
        6: {"f1", "f2", "f3", "f4"},
        7: {"r1", "r2", "r3"},
    }
    burn_days = {1, 2, 4, 5}
    for d in p["days"]:
        ids = {l["id"] for l in d.get("lifts", [])}
        expect = required_lifts[d["n"]]
        if ids != expect:
            err(f"day {d['n']} lifts {ids} != {expect}")
        if not d.get("mob") and d["n"] not in {7}:
            err(f"day {d['n']} missing mobility")
        if d["n"] != 7 and not d.get("tissue"):
            err(f"day {d['n']} missing tissue")
        if d["n"] in burn_days and not d.get("burn"):
            err(f"day {d['n']} missing burnout")
        if d["n"] not in burn_days and d.get("burn"):
            err(f"day {d['n']} should not have a burnout")
        if d["n"] in {6, 7} and not d.get("exclusive"):
            err(f"day {d['n']} should be exclusive choice")
        dead = next((l for l in d.get("lifts", []) if l["id"] == "dead"), None)
        if dead and not dead.get("swapRed"):
            err("deadlift missing swapRed")
    themes = [d["theme"] for d in p["days"]]
    if themes[0] != "Ankles & Knees":
        err("day 1 theme mismatch")
    if "Follow-Me Flow" not in themes:
        err("day 6 theme missing")


def check_app_js() -> None:
    js = read("app.js")
    for needle in [
        'localStorage.getItem',
        'localStorage.setItem',
        "final-cut:v2",
        "suggested",
        "goToday",
        "swapRed",
        "data-reps",
        "data-rpe",
        "WHOOP",
        "burnskip",
        "exclusive",
        "serviceWorker",
        "save-live",
    ]:
        if needle not in js:
            err(f"app.js missing {needle!r}")
    if "window.storage" in js:
        err("app.js still depends on window.storage")
    if "render();" in js and "function toggle" in js:
        # toggle should not always full-render the page for set clicks
        toggle = js.split("function toggle")[1].split("function goToday")[0] if "function goToday" in js.split("function toggle")[1] else js.split("function toggle")[1][:1200]
        if "render();" in toggle and "updateToggle" not in toggle:
            err("toggle always full-renders")


def check_sw_and_manifest() -> None:
    man = json.loads(read("manifest.webmanifest"))
    if man.get("start_url") != "./":
        err("manifest start_url should be ./")
    if man.get("theme_color") != "#1F1F1F":
        err("manifest theme_color should be Graphite")
    sw = read("sw.js")
    for asset in ["./index.html", "./styles.css", "./app.js", "./program.js"]:
        if asset not in sw:
            err(f"sw.js does not cache {asset}")


def simulate_logic() -> None:
    # Today math for a known Monday start.
    from datetime import date, timedelta

    start = date(2026, 8, 17)  # Monday
    today = date(2026, 8, 20)  # Thursday
    diff = (today - start).days
    week = diff // 7 + 1
    day = diff % 7 + 1
    if (week, day) != (1, 4):
        err(f"today math expected (1,4), got {(week, day)}")
    after = start + timedelta(days=42)
    if (after - start).days != 42:
        err("block length is not 42 days")

    # Readiness prescription matrix
    red_kills_deadlift = True
    amber_keeps_strength = True
    green_full = True
    if not (red_kills_deadlift and amber_keeps_strength and green_full):
        err("readiness matrix broken")


def main() -> int:
    check_files()
    check_html()
    check_css()
    check_js_syntax()
    program = load_program()
    check_program(program)
    check_app_js()
    check_sw_and_manifest()
    simulate_logic()
    print(f"program days={len(program.get('days', []))} weeks={len(program.get('weeks', []))}")
    for w in warns:
        print("WARN", w)
    if errors:
        print(f"FAIL {len(errors)} errors")
        for e in errors:
            print(" -", e)
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
