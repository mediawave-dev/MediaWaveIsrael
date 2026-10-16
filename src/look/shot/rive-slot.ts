// shot · one Rive renderer at a time (SPEC 1.9, storyboard rule 5). The Lens, HeroBuild and the
// Companion share one canvas-lite runtime; each claims the slot whenever it starts rendering and
// releases it when it stops (off screen, settled, unmount). A claim stops the previous holder, so
// only one canvas draws at any moment.

let holder: { id: string; stop: () => void } | null = null

/** Take the slot: the current holder (if another piece) is told to stop rendering first. */
export function claimRive(id: string, stop: () => void) {
  if (holder && holder.id !== id) holder.stop()
  holder = { id, stop }
}

/** Give the slot back (only the holder can). */
export function releaseRive(id: string) {
  if (holder?.id === id) holder = null
}

/** Who draws now (QA and debugging), or null. */
export function riveHolder(): string | null {
  return holder?.id ?? null
}
