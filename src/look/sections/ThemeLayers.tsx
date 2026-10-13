// KM · launch night: the page alternates between the stage and the void (moves-recipes T-01).
// Two fixed layers crossfade (opacity only); text and the header flip instantly through
// body.t-dark / body.t-light. Sections declare data-theme. Never a colour transition on
// html or body.
import { useScene } from '../../motion/ScrollEngineProvider'
import { themeLayers } from '../../motion/motion-engine.js'

export default function ThemeLayers() {
  const ref = useScene<HTMLDivElement>((e) => {
    themeLayers(e)
    return () => document.body.classList.remove('t-dark', 't-light')
  })
  return (
    <div ref={ref} className="theme-bg" aria-hidden="true">
      <i data-t="dark" />
      <i data-t="light" />
    </div>
  )
}
