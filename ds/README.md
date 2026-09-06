# ds/ — Skaling Ventures tokens and primitives, vendored

A snapshot of the Skaling Ventures brand system (v1.0, 2026-09-05) copied into
this repo so Final Cut is self-contained. Nothing here is edited locally; a
brand change arrives as a fresh copy of this folder.

**Load order:** `tokens/index.css` first (it imports the eight token files in
the right order), then only the primitives the page uses. Set the mode on the
root element: `<html data-mode="graphite">`. Final Cut is always Graphite.

```
tokens/      color · type · space · radius · shadow · motion · semantic · index
primitives/  a11y · rule · mark · button · card · tile · badge · chip · table ·
             disclosure (+ disclosure.js) · field · input · check
assets/      sv-mark.svg — the five-peak mark. Inline it; never type the name.
```

Each primitive file's header comment is its documentation: the rule it
enforces, the markup, the variants.

## The contract in one screen

- Four brand colours: Graphite `#1F1F1F`, Bone `#FFFAF4`, Nevada `#89523B`,
  Blue Fog `#A3B1C0`. Everything else is a tonal step of one of them.
- One typeface: Neue Haas Grotesk Display Pro, falling back to Helvetica Neue,
  Inter, DM Sans. One mono: IBM Plex Mono. `type.css` pulls Inter and Plex Mono
  from Google Fonts; offline, the fallback stack carries it.
- Weights: 300 display, 400 body, 500 UI emphasis. 700 is the wordmark's alone.
- Square. Radius 0 everywhere; 2 px on a checkbox, 4 px is the ceiling.
- Hairlines, not shadows. Hover changes ink and tint, never position.
- Every number is mono and tabular.
- Status colour carries state only. It is never decoration.
- Component code uses semantic tokens (`--sv-text-accent`), never swatches
  (`--sv-nevada-400`). Hex lives in `tokens/color.css` and nowhere else.
- Classes are `.sv*`. Never override a primitive's base rule; scope through a
  descendant (`.fc-header .svb { height: 2rem }`).

## Mode decision, for completeness

Final Cut is an operating instrument read by one person on a phone, so it is
Graphite. A reference page you read once could be Bone. Nevada is display-only
and carries no status colour. Blue Fog is a panel inside another mode, never a
page.
