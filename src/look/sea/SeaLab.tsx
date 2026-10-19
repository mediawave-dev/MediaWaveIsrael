// sea · the lab's panel (?lab=1): one row per gate, its options as buttons; a pick reloads the page
// in place with the choice (the field, the header and the turn read it at boot). Review only: never
// shown without ?lab=1, and gone once Nati has picked.
import { useEffect, useState } from 'react'
import { GATES, labOpen, opt, pick, type Gate } from './lab'

const NAMES: Record<Gate, string> = { head: 'הכותרת', film: 'הסרט', ground: 'צבע לפרק', turn: 'מעבר עמוד' }
const LABELS: Record<string, string> = {
  'head.island': 'אי שנפתח במגע', 'head.away': 'נעלמת, חוזרת למעלה', 'head.sticky': 'צמודה כמו היום',
  'film.touch': 'מתפתח במגע', 'film.scroll': 'מתפתח בגלילה', 'film.time': 'מתפתח לבד', 'film.off': 'בלי',
  'ground.deep': 'שירותים מתחת לאופק', 'ground.paper': 'מכתב על נייר', 'ground.both': 'שניהם', 'ground.none': 'הכל כהה',
  'turn.cream': 'שמנת', 'turn.blue': 'כחול', 'turn.off': 'בלי',
}

export default function SeaLab() {
  const [shown] = useState(labOpen)
  const [folded, setFolded] = useState(false)

  // back where the visitor was before the pick reloaded the page
  useEffect(() => {
    if (!shown) return
    const y = Number(sessionStorage.getItem('mw-sea-lab-y') ?? '')
    sessionStorage.removeItem('mw-sea-lab-y')
    if (y > 0) window.setTimeout(() => window.scrollTo({ top: y }), 900)
  }, [shown])

  if (!shown) return null
  return (
    <div className={`sea-lab${folded ? ' is-folded' : ''}`} role="group" aria-label="מעבדה: אפשרויות לבחירה">
      <button type="button" className="sea-lab__fold" onClick={() => setFolded((v) => !v)} aria-expanded={!folded}>
        {folded ? 'מעבדה' : 'לקפל'}
      </button>
      {!folded && (Object.keys(GATES) as Gate[]).map((g) => (
        <div key={g} className="sea-lab__row">
          <span className="sea-lab__name">{NAMES[g]}</span>
          <span className="sea-lab__opts">
            {(GATES[g] as readonly string[]).map((v) => (
              <button key={v} type="button" aria-pressed={opt(g) === v} onClick={() => pick(g, v)}>{LABELS[`${g}.${v}`] ?? v}</button>
            ))}
          </span>
        </div>
      ))}
    </div>
  )
}
