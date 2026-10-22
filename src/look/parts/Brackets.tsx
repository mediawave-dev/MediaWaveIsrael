// The button's brackets (D202, Nati picked "Bracket"): [ the words ] in the site's mono, the language of
// its tags and of the cursor's label. Two spans at the button's inline edges; the CSS springs them apart
// when the button is hovered, focused or pressed (sea-site.css). In RTL the glyphs mirror by themselves.
import { useEffect } from 'react'
import { listenHaptics } from './haptics'

export default function Brackets() {
  useEffect(listenHaptics, [])
  return (
    <>
      <span className="btn-br btn-br--o" aria-hidden="true">[</span>
      <span className="btn-br btn-br--c" aria-hidden="true">]</span>
    </>
  )
}
