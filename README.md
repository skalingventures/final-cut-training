# Final Cut — Block 01

Personal six-week home-gym program for Skaling Ventures. Strength, daily mobility, tissue work, and 10-minute burnouts.

**Live:** https://skalingventures.github.io/final-cut-training/

## How to use it

1. Set the **block start Monday**. The Today button then opens the correct week and day.
2. Pick readiness before you train. Green runs the full session. Average keeps strength and scales the burnout. Red cuts the burnout and swaps the heavy hinge.
3. Work top to bottom: tissue → mobility → strength → burnout → downshift.
4. Log load, actual reps, and RPE on the main lifts. Charts use logged reps when present.

Nothing you log is uploaded. Sets, loads, bodyweight, and notes stay in this browser's `localStorage`. Copy the Backup JSON if you want the same log on another phone or after clearing site data.

## Update the site

This is a static GitHub Pages site from the `main` branch.

```bash
cd ~/Desktop/Cursor/final-cut-training
# edit files
git add -A
git commit -m "Update Final Cut"
git push origin main
```

Pages usually refreshes within a minute. If an old version sticks, bump the `CACHE` constant in `sw.js` so the service worker fetches a fresh copy.

## Privacy

The repository is public and contains only the program and the app. Training logs never leave the device unless you export them. Do not commit a filled Backup JSON.
