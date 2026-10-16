// shot · S9 deliver, the pull-back into one phone (SPEC S9; storyboard 16.05-18.05). All art, no
// heading, no anchor, no data-intent (lead-intent's "end" lives on the footer). The camera layer
// starts as close as the real letter (#contact .ct__form): the miniature letter inside the phone at
// the real letter's width, the phone's screen centred in the band above the dock line
// (pullBackMatched), then the camera pulls back until the whole site is one phone on the desk.
// Nothing fades: the phone body and the props enter the frame from outside it.
//   REDUCE   no hold (CSS), the phone and its miniature at their final size, the props around it.
//   short    (stage under 560px) no hold either, the last frame in the flow.
//   CALM     scale and y only (no rotateX bump), scrub true.
import { useEffect, useState } from 'react'
import { useSceneNear } from './near'
import { Thing } from '../parts/Things'
import { pullBackMatched } from './moves'
import { scrubbing } from './camera'
import { useShotPolicy } from './policy'
import { PHONE_URL } from './copy'
import Mini from './Mini'
import './shot-deliver.css'

const REAL_LETTER = '#contact .ct__form'

/**
 * The real letter lives in another lazy chunk (ShotStart), which may arrive after this one: the
 * scene waits for it, then rebuilds once (the flag is in its deps).
 */
function useRealLetter() {
  const [ready, setReady] = useState(() => typeof document !== 'undefined' && !!document.querySelector(REAL_LETTER))
  useEffect(() => {
    if (ready) return
    const main = document.getElementById('main-content') ?? document.body
    const check = () => { if (document.querySelector(REAL_LETTER)) setReady(true) }
    const mo = new MutationObserver(check)
    mo.observe(main, { childList: true, subtree: true })
    check()
    return () => mo.disconnect()
  }, [ready])
  return ready
}

export default function ShotDeliver() {
  const { short, textScaled } = useShotPolicy()
  const letterReady = useRealLetter()

  const ref = useSceneNear<HTMLElement>((t, root) => {
    if (t.REDUCE || short) return
    const hold = root.querySelector<HTMLElement>('.hold')
    const layer = root.querySelector<HTMLElement>('.shot-deliver__layer')
    const mini = root.querySelector<HTMLElement>('.shot-mini__letter')
    const real = document.querySelector<HTMLElement>(REAL_LETTER)
    if (!hold || !layer || !mini || !real) return
    pullBackMatched(t, { hold, layer, real, mini, id: 'pullback' })
    // will-change on the camera layer only while the hold scrubs
    t.ScrollTrigger.create({ trigger: hold, start: 'top bottom', end: 'bottom top', onToggle: scrubbing(layer) })
  }, [short, textScaled, letterReady])

  return (
    <section ref={ref} className="shot-deliver" data-chapter="deliver" data-dossier="W20 W04 W19" aria-hidden="true">
      <div className="hold" data-hold="pullback">
        <div className="hold__stage shot-deliver__stage" data-zone="art">
          <div className="shot-deliver__layer">
            <div className="shot-deliver__set">
              <div className="shot-desk shot-desk--end">
                <span className="shot-deliver__prop shot-deliver__prop--loupe"><span><Thing kind="loupe" /></span></span>
                <span className="shot-deliver__prop shot-deliver__prop--cassette"><span><Thing kind="cassette" /></span></span>
                <span className="shot-deliver__prop shot-deliver__prop--bubble"><span><Thing kind="bubble" /></span></span>
                <span className="shot-deliver__prop shot-deliver__prop--frame"><span><Thing kind="frame" /></span></span>
              </div>
              <div className="shot-phone">
                <Thing kind="phone">
                  <span className="shot-phone__url"><bdi dir="ltr">{PHONE_URL}</bdi></span>
                  <Mini />
                </Thing>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
