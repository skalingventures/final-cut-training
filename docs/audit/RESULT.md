# What the rebuild changed

Final Cut **1.6.0 → 2.0.0**. Measured at 390 × 844, Day 1, Week 1.

| | 1.6.0 | 2.0.0 |
|---|---|---|
| Text at or below 13 px | 85 % | none below 12 px |
| Distinct type sizes | 17 | 6 |
| Session height, all phases open | 4,950 px | 2,286 px |
| Session height, all phases closed | — | 1,500 px |
| Whole page, drawers open | 13,100 px | 7,176 px |
| Heaviest weight | 800 | 500 |
| Radius declarations | 45 | 0 |
| Corners rendered rounded | 88 elements | 0 |
| Accent colours in use | 6 | 1 (copper) plus status |
| Tap targets under 44 px | 11 | 0 |
| Local design tokens | 47 | 6 `--fc-*` aliases |
| Hex and rgba literals in components | 38 | 0 |
| Text contrast pairs failing | 0 | 0 |

## Findings closed

**P0 (brand contract and legibility floor)** — B1 rounded corners, B2 display
weights 600–800, B3 the retired typeface, B4 blur and gradients, B5 the drawn
mark and typed wordmark, B7 status colour as decoration, H6 the poster-weight
day title, T1 and T2 the type floor.

**P1 (the daily job)** — B6 re-declared tokens, H1 six objects in the header,
H2 sections named twice, H3 three parallel progress systems, H4 page length,
H5 the manual inside the instrument, H7 finish below the fold, U1 the toast,
U2 sets logged but not loads, U3 the prose RPE field, U5 the lost tap,
U8 navigation at the top of the phone, U9 four confirmations for one tap,
U11 rest-day chrome.

**P2** — U4 the truncated placeholder, U6 unstyled native inputs, U7 tap
targets, U10 raw JSON as the face of Backup, and the history panel rebuilt on
vital tiles and a segmented control. B8, hover-only phase counts, was closed by
deleting the pips in WP2.

## Deferred, with reasons

- **Regenerating `icons/*` from the five-peak mark.** No rasteriser is available
  in this environment, and the icons are PNGs. The in-app mark, the manifest and
  the favicon SVG are all correct; only the two PNG launcher icons still carry
  the three-peak drawing. One `rsvg-convert` run closes it.
- **Self-hosting Inter and IBM Plex Mono.** The app fetched fonts from Google
  before this change and still does, through the brand system's `type.css`.
  Offline the fallback stack carries it. Changing that is a separate decision
  about what the app is allowed to fetch.
