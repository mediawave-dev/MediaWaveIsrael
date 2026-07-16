/**
 * True when the served HTML was prerendered (React mounts OVER existing
 * content) — false on the empty SPA shell (/studio, dev server).
 *
 * Evaluated once at module load, which runs before createRoot(), so the
 * prerendered children are still in the DOM at that moment. Components use
 * this to skip entrance animations: replaying a reveal over content the
 * visitor has already seen reads as a flash, and re-hiding the LCP text
 * after the static paint was the single biggest measured LCP cost.
 */
export const wasPrerendered =
  typeof document !== 'undefined' &&
  ((document.getElementById('root')?.childElementCount ?? 0) > 0)
