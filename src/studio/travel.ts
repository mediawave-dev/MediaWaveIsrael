// Opening a world from the main site (D192, shared by the guide's map and the moment after a send, D209):
// the wave covers the sea in the chosen world's colours, the studio and that world load under it, the route
// changes without a page load, and the studio opens the wave with the world's name (StylesPage reads
// window.__studioArrival). Without the wave (still, or no WebGL) it simply navigates.
import type { NavigateFunction } from 'react-router-dom'
import { getCurtain } from './curtain'
import type { Tier } from './motion'
import type { StyleDef } from './registry'
import { track } from '../utils/analytics'

declare global { interface Window { __studioArrival?: { id: string } } }

export async function travel(s: StyleDef, at: { x: number; y: number }, navigate: NavigateFunction, tier: Tier, placement: string) {
  track('cta_click', { placement: `${placement}_${s.id}` })
  const wave = tier === 'still' ? null : getCurtain()
  // the studio and the world load while the wave covers the sea
  const warm = Promise.all([import('./StylesPage'), s.load()]).catch(() => undefined)
  if (wave) {
    await wave.cover(at, { from: '#0f1011', to: s.ground, ink: s.ink }, 860)
    await warm
    window.__studioArrival = { id: s.id }
  }
  navigate(`/styles/?s=${s.id}`)
}
