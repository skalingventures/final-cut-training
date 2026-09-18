# Final Cut — Block 01

Personal six-week home-gym program. Strength, daily mobility, tissue work, and 10-minute burnouts.

**Live:** https://skalingventures.github.io/final-cut-training/

This is a **one-phone app**. The log lives in that browser’s `localStorage`. There is no account and no cloud sync.

## Daily use

1. First open: confirm the **block start Monday**, then Start the block. Later visits open today’s session.
2. Set readiness for *this* session. Green / Average / Red and the soreness flags stay on that day only.
3. Work top to bottom. Each phase is a drawer that closes itself when you finish it. Main lifts log **set by set** — load, reps and RPE per row, with `=` to copy the row above. Accessories keep one entry for the lift.
4. Finish session sits under the last phase, with the previous and next day either side of it. Export a backup weekly.

## Backup and recovery

- **Export file** saves a JSON you can put in Files or iCloud.
- Copy/paste remains a fallback.
- Restore asks before it replaces the current log and can be undone from the toast.
- If the saved log is corrupt, the raw text is left in Backup so you can copy it out. Do not reload until you have it.

Clearing site data, switching browsers, or using a private window will look like an empty log. Export before you do any of those.

Logs are keyed by training week and day, not calendar date. Changing the block start does not move existing entries.

## Updates

The service worker loads a fresh `index.html` / `app.js` / `program.js` when you are online. If a new version is waiting, tap **Update now**. Offline, the last cached copy still opens.

```bash
cd ~/Desktop/Cursor/final-cut-training
git add -A && git commit -m "Update Final Cut" && git push origin main
```

After a deploy, bump is automatic via `CACHE` in `sw.js` when that file changes.

`ds/` is the Skaling Ventures brand system, vendored. It is never edited here —
a brand change arrives as a fresh copy of that folder. Everything Final Cut
styles for itself is `--fc-*` and `.fc-*` in `styles.css`, layered on top.

## Tests

```bash
node test/core.test.js
node test/persist.test.js
python3 validate.py
```

GitHub Actions runs these on push to `main`. There is also a browser suite that
drives the whole logging path, including the set-tap regression:

```bash
python3 -m http.server 8123 --bind 127.0.0.1 &
node test/browser.test.js
```

It skips cleanly when playwright is absent; `docs/audit/CHECKLIST.md` is the
same list to walk by hand.

## Reference

The canon, the programming rules and the week at a glance live on
[`reference.html`](reference.html), linked from the colophon. Editorial rules
for the block live in [`CANON.md`](CANON.md); finishers and mid-block intent
are in [`docs/FINISHERS.md`](docs/FINISHERS.md) and
[`docs/MIDBLOCK_01.md`](docs/MIDBLOCK_01.md). The session screen carries only
what you open mid-workout.

## Privacy

The repository is public and holds only the program and the app. Training data never leaves the device unless you export it. Do not commit a filled backup JSON.
