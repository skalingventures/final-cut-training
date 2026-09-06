/* ═══ .svd — Disclosure controller (optional) ═══════════════════════
   The primitive works with zero JS. This adds two conveniences:

     1. Expand/collapse all within a container.
     2. Deep links — #some-id on a closed <details> opens it and
        scrolls to it, so a link to a specific finding lands open.

   <script type="module" src="/ds/primitives/disclosure.js"></script>
   ══════════════════════════════════════════════════════════════════ */

/** Open (or close) every .svd inside `root`. */
export function setAll(root, open) {
  root.querySelectorAll('details.svd').forEach((d) => { d.open = open; });
}

/** Wire any [data-svd-toggle="<selector>"] button to setAll. */
function wireToggles(scope) {
  scope.querySelectorAll('[data-svd-toggle]').forEach((btn) => {
    if (btn.dataset.svdBound) return;
    btn.dataset.svdBound = '1';
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.svdToggle) || document;
      const opening = btn.getAttribute('aria-expanded') !== 'true';
      setAll(target, opening);
      btn.setAttribute('aria-expanded', String(opening));
      btn.textContent = opening ? 'Collapse all' : 'Expand all';
    });
  });
}

/** Open the <details> that contains the current hash target. */
function openHashTarget() {
  const id = location.hash.slice(1);
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  el.closest('details.svd')?.setAttribute('open', '');
  el.scrollIntoView({ block: 'start' });
}

if (typeof document !== 'undefined') {
  const init = () => { wireToggles(document); openHashTarget(); };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
  window.addEventListener('hashchange', openHashTarget);
}
