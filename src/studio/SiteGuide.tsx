// The invitation on the main site (D192): after the opening has played and the page is idle, the little
// world comes by and offers the other worlds ("Explore 4 other worlds"); at most three times a visit, never
// closer than 40 s, once more at the letter. Its map opens a world through the wave, without a page load:
// the wave covers the sea in the chosen world's colours, the studio and that world load under it, the route
// changes, and the studio opens the wave with the world's name (StylesPage reads window.__studioArrival).
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Guide, { type GuidePlan } from './Guide'
import WorldMap from './WorldMap'
import { getCurtain } from './curtain'
import { tierNow } from './motion'
import type { StyleDef } from './registry'
import { track } from '../utils/analytics'

const SITE_PLAN: GuidePlan = { chapters: '[data-chapter]', cool: 40000, max: 3, stay: 8000, first: 2600, say: 'Explore 4 other worlds', last: 'contact' }

declare global { interface Window { __studioArrival?: { id: string } } }

export default function SiteGuide() {
  const [map, setMap] = useState(false)
  const navigate = useNavigate()
  const tier = tierNow()
  const go = async (s: StyleDef, at: { x: number; y: number }) => {
    setMap(false)
    track('cta_click', { placement: `site_guide_${s.id}` })
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
  return (
    <>
      <Guide color="#79a0c5" tier={tier} open={map} onOpen={() => setMap(true)} plan={SITE_PLAN} />
      {map && <WorldMap current={null} onClose={() => setMap(false)} onPick={(s, at) => void go(s, at)} />}
    </>
  )
}
