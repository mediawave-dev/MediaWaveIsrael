// After a deploy, a tab opened on the previous build asks for chunks that no longer exist (404):
// its first client-side page change fails to import the route and lands on the error page (live
// check, 18.10.2026). The page reloads once instead and picks up the new build. A timestamp in
// sessionStorage stops a loop when a reload does not help; without storage it never reloads.

const KEY = 'mw-stale-chunk-reload'
const WINDOW_MS = 30_000

/** A failed dynamic import or chunk preload, in Chromium, WebKit or Firefox wording. */
export function isStaleChunkError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '')
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i.test(message)
}

/** Reload once to pick up the new build. Returns false when it did not (a loop, or no storage). */
export function reloadOnStaleChunk(): boolean {
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0)
    if (Date.now() - last < WINDOW_MS) return false
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch {
    return false
  }
  window.location.reload()
  return true
}

/** Vite reports a failed chunk preload on window; handle it before the import rejects. */
export function installStaleChunkReload(): void {
  window.addEventListener('vite:preloadError', (event) => {
    if (reloadOnStaleChunk()) event.preventDefault()
  })
}
