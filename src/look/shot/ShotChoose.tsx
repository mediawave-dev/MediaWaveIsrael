// shot · S3 choose, the tool row (SPEC S3, storyboard rows 3.29-7.06). The six services lie on the
// desk as the old site's Things, each doing its own action as the visitor scrolls past it: the
// phone stands up, the loupe slides in searching, the bubble is put down (and is the one real
// button: it opens the site's chat), the cassette's reels turn, the photo develops. Websites comes
// last as a paper label landing on its Lottie well, so the laptop of S4 opens right after it.
// Labels are text-first: they scroll flat under their object and never land or tilt (rule 1);
// only the websites label lands, because it opens with its art. One Lottie plays: the one whose
// tool sits in the eye band (useEyeLine).
import type { ReactNode } from 'react'
import { LookButton } from '@look/button'
import { useSceneNear } from './near'
import { openChat } from '../../components/ui/chat-event'
import { track } from '../../utils/analytics'
import { SERVICES, type ShowItem } from '../data'
import { Thing, type Kind } from '../parts/Things'
import { land } from './camera'
import { setDown, standUp, slideIn, reels, develop } from './moves'
import { useEyeLine, EyeArt, type EyeLine } from './eye-line'
import { SERVICE_ORDER, BOT_HINT } from './copy'
import './shot-choose.css'

/** Which Thing each service is on the desk; websites has none (its label carries a Lottie well). */
const OBJECT: Record<string, Kind | undefined> = {
  landing: 'phone',
  seo: 'loupe',
  chatbots: 'bubble',
  'video-editing': 'cassette',
  'memory-videos': 'frame',
}

/** The Art box at 390 in px (the CSS fits the real box; Art's own size only seeds the placeholder). */
const ART_PX: Record<string, number> = {
  landing: 220,
  seo: 160,
  chatbots: 180,
  'video-editing': 150,
  'memory-videos': 130,
  websites: 180,
}

/** SERVICE_ORDER first; a service it does not name still renders, after them (nothing is lost). */
const ITEMS: ShowItem[] = [
  ...SERVICE_ORDER.map((id) => SERVICES.find((s) => s.id === id)).filter((s): s is ShowItem => !!s),
  ...SERVICES.filter((s) => !SERVICE_ORDER.includes(s.id)),
]

function Label({ it, well }: { it: ShowItem; well?: ReactNode }) {
  return (
    <div className="shot-label shot-tool__label">
      {well}
      <h3 className="shot-tool__title" data-zone="text">{it.title}</h3>
      <p className="shot-tool__line" data-zone="text">{it.line}</p>
      <p className={`shot-label__links${it.portfolio ? ' shot-label__links--two' : ''}`}>
        {it.href && <a className="shot-link" href={it.href} aria-label={it.hrefLabel} data-zone="text">לפרטים</a>}
        {it.portfolio && (
          <a className="shot-link" href={it.portfolio} aria-label={`ראו דוגמה לפרויקט: ${it.title}`} data-zone="text">ראו דוגמה</a>
        )}
      </p>
    </div>
  )
}

/** The object itself: the moved layer (data-move) around a static rest angle around the Thing. */
function Obj({ it, kind, i, eye }: { it: ShowItem; kind: Kind; i: number; eye: EyeLine }) {
  return (
    <span className="shot-tool__rest">
      <Thing kind={kind}>
        <span className="thing__art"><EyeArt eye={eye} i={i} item={it} size={ART_PX[it.id] ?? 160} /></span>
        {kind === 'frame' && <i className="shot-wash" />}
      </Thing>
    </span>
  )
}

function Tool({ it, i, eye }: { it: ShowItem; i: number; eye: EyeLine }) {
  const kind = OBJECT[it.id]
  if (!kind) {
    // websites (or any service without an object): the label opens with its Lottie well
    const well = (
      <div className="shot-label__well" aria-hidden="true" data-zone="art">
        <EyeArt eye={eye} i={i} item={it} size={ART_PX[it.id] ?? 180} />
      </div>
    )
    return (
      <li className={`shot-tool shot-tool--${it.id} shot-tool--well`} data-id={it.id}>
        <Label it={it} well={well} />
      </li>
    )
  }
  if (kind === 'bubble') {
    // the one interactive object (SPEC 1.15): a real button named by its visible hint. The art
    // zone sits on the bubble, not the button, so the hint is never counted as text over art.
    return (
      <li className={`shot-tool shot-tool--${it.id}`} data-id={it.id}>
        <button type="button" className="shot-tool__obj shot-bubble" onClick={() => openChat('services_bubble')}>
          <span className="shot-bubble__thing" aria-hidden="true" data-zone="art" data-move>
            <Obj it={it} kind={kind} i={i} eye={eye} />
          </span>
          <span className="shot-bubble__hint" data-zone="text">{BOT_HINT}</span>
        </button>
        <Label it={it} />
      </li>
    )
  }
  return (
    <li className={`shot-tool shot-tool--${it.id}`} data-id={it.id}>
      <div className="shot-tool__obj" aria-hidden="true" data-zone="art" data-move>
        <Obj it={it} kind={kind} i={i} eye={eye} />
      </div>
      <Label it={it} />
    </li>
  )
}

export default function ShotChoose() {
  const ref = useSceneNear<HTMLElement>((t, root) => {
    const tools = [...root.querySelectorAll<HTMLElement>('.shot-tool')]
    eye.setup(t, root, tools)
    if (t.REDUCE) return // the CSS rest pose is every tool's last frame
    for (const li of tools) {
      const obj = li.querySelector<HTMLElement>('[data-move]')
      switch (li.dataset.id) {
        case 'landing':
          if (obj) standUp(t, obj, { from: 72 })
          break
        case 'seo':
          // the loupe's rest angle (6deg) is CSS on the inner wrapper, so the move's angles are
          // relative to it: 14 → 6 on screen is 8 → 0 here
          if (obj) slideIn(t, obj, { dx: 40, fromZ: 8, toZ: 0 })
          break
        case 'chatbots':
          // -9 → -3 on screen around the -3deg rest; done before the hint under it is read
          if (obj) setDown(t, obj, { fromZ: -6, toZ: 0, art: () => obj.offsetHeight + 8 })
          break
        case 'video-editing':
          if (obj) reels(t, [...obj.querySelectorAll('.thing__reel')], obj)
          break
        case 'memory-videos': {
          const wash = obj?.querySelector('.shot-wash')
          if (obj && wash) develop(t, wash, obj)
          break
        }
        default: {
          // the websites label lands on its well (art first, rule 2); its late exit stays on
          const label = li.querySelector<HTMLElement>('.shot-tool__label')
          const title = li.querySelector<HTMLElement>('.shot-tool__title')
          if (label && title && li.classList.contains('shot-tool--well')) land(t, label, { strength: 0.5, art: () => title.offsetTop })
        }
      }
    }
  })
  const eye = useEyeLine(ref, ITEMS.length)

  return (
    <section ref={ref} id="services" className="shot-choose" data-chapter="choose" data-dossier="W04 W13 W14" aria-labelledby="services-title">
      <header className="shot-table-head">
        <h2 id="services-title" data-zone="text">מה אנחנו עושים</h2>
      </header>
      <ul className="shot-tools">
        {ITEMS.map((it, i) => <Tool key={it.id} it={it} i={i} eye={eye} />)}
      </ul>
      <div className="shot-choose__cta">
        <LookButton href="#contact" block zone="text" onClick={() => track('cta_click', { placement: 'services' })}>מתחילים פרויקט</LookButton>
      </div>
    </section>
  )
}
