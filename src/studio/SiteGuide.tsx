// The invitation on the main site (D192): after the opening has played and the page is idle, the little
// world comes by and offers the other worlds ("Explore 5 other worlds", D215); at most three times a visit, never
// closer than 40 s, once more at the letter. Its map opens a world through the wave, without a page load:
// the wave covers the sea in the chosen world's colours, the studio and that world load under it, the route
// changes, and the studio opens the wave with the world's name (StylesPage reads window.__studioArrival).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Guide, { type GuidePlan } from './Guide'
import WorldMap from './WorldMap'
import { prepareCurtain } from './curtain'
import { preloadSound } from './sound'
import SoundInvite, { type SoundSource } from './SoundInvite'
import * as sea from '../look/sea/sound'
import { tierNow } from './motion'
import type { StyleDef } from './registry'
import { travel } from './travel'

const SITE_PLAN: GuidePlan = { chapters: '[data-chapter]', cool: 40000, max: 3, stay: 8000, first: 2600, say: 'Explore 5 other worlds', last: 'contact', until: 'sg-seen' }

// the site's own music for the invitation (D199): offered only while it is armed and not yet playing
const SEA_SOUND: SoundSource = { isOn: () => sea.isRunning() || !sea.isOn(), turnOn: sea.startMusic, subscribe: sea.onChange }

export default function SiteGuide() {
  const [map, setMap] = useState(false)
  const navigate = useNavigate()
  const tier = tierNow()
  // the music's invitation comes first; the guide waits until it has gone (never both at once)
  const plan = useMemo(() => ({ ...SITE_PLAN, first: SEA_SOUND.isOn() ? SITE_PLAN.first : 13500 }), [])
  const go = (s: StyleDef, at: { x: number; y: number }) => {
    setMap(false)
    void travel(s, at, navigate, tier, 'site_guide')
  }
  return (
    <>
      <Guide color="#79a0c5" tier={tier} open={map} onOpen={() => { setMap(true); if (tier !== 'still') { prepareCurtain(); preloadSound() } }} plan={plan} />
      {map && <WorldMap current={null} onClose={() => setMap(false)} onPick={go} />}
      {tier !== 'still' && <SoundInvite track="Lo-fi · the sea" source={SEA_SOUND} cue="home" delay={900} />}
    </>
  )
}
