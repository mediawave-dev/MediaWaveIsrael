// shot · the page policy (SPEC 1.6). Two conditions change how the held scenes are built:
//   short       the stage is under 560px (100svh - 56px header): matchMedia('(max-height: 615px)').
//               The dive and the pull-back drop their holds; the sheet only tilts as it leaves.
//   textScaled  the accessibility widget scaled the text above 1 (html.text-scaled, never
//               persisted): the dive's hold goes to auto height so large text is never clipped.
// Both are React state, so a scene that lists them in its useScene deps rebuilds when they change.
// The CSS mirrors them with the same media query and class (shot-base.css).
import { useEffect, useState } from 'react'

export interface ShotPolicy {
  short: boolean
  textScaled: boolean
}

const SHORT = '(max-height: 615px)'

function read(): ShotPolicy {
  if (typeof window === 'undefined') return { short: false, textScaled: false }
  return {
    short: window.matchMedia(SHORT).matches,
    textScaled: document.documentElement.classList.contains('text-scaled'),
  }
}

export function useShotPolicy(): ShotPolicy {
  const [policy, setPolicy] = useState<ShotPolicy>(read)

  useEffect(() => {
    const update = () => setPolicy((p) => {
      const next = read()
      return next.short === p.short && next.textScaled === p.textScaled ? p : next
    })
    update()
    const mq = window.matchMedia(SHORT)
    mq.addEventListener('change', update)
    const mo = new MutationObserver(update)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => {
      mq.removeEventListener('change', update)
      mo.disconnect()
    }
  }, [])

  return policy
}
