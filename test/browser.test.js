/* The regression this package exists to close: on a phone, the blur that
   fires `change` is the same gesture as the tap that follows it. If the
   handler re-renders the session, that tap lands on a node that no longer
   exists and the set is silently lost.

   Not part of `npm test` — it needs a browser and a server. Run it with:

     python3 -m http.server 8123 --bind 127.0.0.1 &
     node test/browser.test.js

   If playwright is not installed, the same checks are the manual list in
   docs/audit/CHECKLIST.md. */
let chromium;
try { chromium = require('playwright').chromium; }
catch (e) {
  try { chromium = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright').chromium; }
  catch (e2) { console.log('SKIP browser tests — playwright not installed'); process.exit(0); }
}

(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  await p.goto('http://127.0.0.1:8123/index.html');
  await p.waitForTimeout(400);
  await p.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await p.reload(); await p.waitForTimeout(500);
  await p.fill('#setup-start', '2026-08-31'); await p.click('#setup-go'); await p.waitForTimeout(400);
  // Navigate explicitly rather than trusting where "today" lands: the block
  // start is fixed but the clock is not, and these assertions name W1 D1.
  await p.click('#week-btn'); await p.click('[data-w="1"]'); await p.waitForTimeout(400);
  await p.click('#week-btn'); await p.click('[data-d="1"]'); await p.waitForTimeout(500);

  const fail = [];
  const ok = (name, cond) => { console.log((cond ? 'PASS  ' : 'FAIL  ') + name); if (!cond) fail.push(name); };

  // 1. Type an RPE, then immediately tap set 1.
  await p.fill('[data-setlog="squat:0:rpe"]', '7.5');
  await p.click('[data-id="squat"][data-i="0"]');
  await p.waitForTimeout(300);
  ok('RPE then tap: set 1 registers',
    await p.evaluate(() => document.querySelector('[data-id="squat"][data-i="0"]').getAttribute('aria-pressed') === 'true'));

  // 2. Per-set values persist to storage under setlog, with set 1 mirrored.
  await p.fill('[data-setlog="squat:0:load"]', '225');
  await p.fill('[data-setlog="squat:0:reps"]', '6');
  await p.fill('[data-setlog="squat:1:load"]', '235');
  await p.waitForTimeout(300);
  const store = await p.evaluate(() => JSON.parse(localStorage.getItem('final-cut:v3')));
  ok('setlog row 0 stored', store.setlog['w1d1:squat'][0].load === '225');
  ok('setlog row 1 stored', store.setlog['w1d1:squat'][1].load === '235');
  ok('set 1 mirrored into legacy loads', store.loads['w1d1:squat'] === '225');
  ok('set 1 mirrored into legacy reps', store.reps['w1d1:squat'] === '6');
  ok('set 1 mirrored into legacy rpe', store.rpe['w1d1:squat'] === '7.5');

  // 3. "Same as above" copies the row above.
  await p.click('[data-same="squat:2"]');
  await p.waitForTimeout(300);
  ok('same-as-above copies load',
    await p.evaluate(() => document.querySelector('[data-setlog="squat:2:load"]').value === '235'));

  // 4. Tap every set, reload, and confirm the week reads it as clean.
  for (let i = 1; i < 4; i++) await p.click(`[data-id="squat"][data-i="${i}"]`);
  await p.waitForTimeout(300);
  await p.reload(); await p.waitForTimeout(600);
  await p.click('#week-btn'); await p.click('[data-w="2"]'); await p.waitForTimeout(400);
  await p.click('#week-btn'); await p.click('[data-d="1"]'); await p.waitForTimeout(500);
  ok('week 2 shows a real RPE number, not prose',
    !/slightly heavier/i.test(await p.evaluate(() => document.querySelector('[data-lift="squat"]').textContent)));
  const carry = await p.evaluate(() => {
    const el = document.querySelector('[data-last="squat"]');
    return el ? el.textContent : '';
  });
  ok('week 2 does not call a complete week incomplete', !/incomplete/i.test(carry));
  ok('week 2 offers the prior load', /225/.test(carry));

  // 5. A 1.6.0 backup restores and shows its load in row one.
  await p.evaluate(() => {
    const legacy = { v: 3, state: { week: 1, day: 1, metric: 'e1rm', start: '2026-08-31', setupDone: true },
      sessions: {}, checks: { w1d1: { squat: [true, true] } },
      loads: { 'w1d1:squat': '315' }, reps: { 'w1d1:squat': '5' }, rpe: {}, bw: {}, burn: {}, choice: {}, subs: {} };
    localStorage.setItem('final-cut:v3', JSON.stringify(legacy));
  });
  await p.reload(); await p.waitForTimeout(600);
  await p.click('#week-btn'); await p.click('[data-w="1"]'); await p.waitForTimeout(400);
  await p.click('#week-btn'); await p.click('[data-d="1"]'); await p.waitForTimeout(500);
  ok('1.6.0 backup shows its load in row one',
    await p.evaluate(() => document.querySelector('[data-setlog="squat:0:load"]').value === '315'));
  ok('1.6.0 backup keeps its set ticks',
    await p.evaluate(() => document.querySelector('[data-id="squat"][data-i="1"]').getAttribute('aria-pressed') === 'true'));

  ok('no page errors', errs.length === 0);
  if (errs.length) console.log(errs);
  await b.close();
  if (fail.length) { console.log('\n' + fail.length + ' FAILED'); process.exit(1); }
  console.log('\nall regression checks pass');
})().catch(e => { console.error(e); process.exit(1); });
