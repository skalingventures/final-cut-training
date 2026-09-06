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


def check_app_js() -> None:
    js = read("app.js")
    for needle in ["FinalCutCore", "saveNow", "pagehide", "setupDone", "SESSIONS", "SKIP_WAITING"]:
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
