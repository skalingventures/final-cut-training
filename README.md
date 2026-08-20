# Final Cut — Block 01

Personal six-week home-gym program. Strength, daily mobility, tissue work, and 10-minute burnouts.

**Live:** https://skalingventures.github.io/final-cut-training/

This is a **one-phone app**. The log lives in that browser’s `localStorage`. There is no account and no cloud sync.

## Daily use

1. First open: confirm the **block start Monday**, then Start the block. Later visits open today’s session.
2. Set readiness for *this* session. Green / Average / Red and the soreness flags stay on that day only.
3. Work top to bottom. Log load, actual reps, and RPE. Hide finished tissue/mobility if you want a shorter screen.
4. Finish session when you are done. Export a backup weekly.

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

## Tests

```bash
node test/core.test.js
python3 validate.py
```

GitHub Actions runs both on push to `main`.

## Privacy

The repository is public and holds only the program and the app. Training data never leaves the device unless you export it. Do not commit a filled backup JSON.
