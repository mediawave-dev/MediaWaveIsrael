// sun · the entry of the statement site (D237). Its own tree and its own stylesheet: none of the earlier
// looks' code or CSS is in this build (they boot from src/entry.legacy.tsx).
import { StrictMode, startTransition } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './fonts.css'
import './sun.css'
import './btn.css'
import SunApp from './SunApp'
// D282: everything centred; last, so it outranks the sections' own CSS wherever it lands
import './center.css'
import { startButtons } from './btn'
import { startSentences } from './sentences'
import { showWhy, startOpener } from './opener/opener'
import { installStaleChunkReload } from '../utils/stale-chunk'

// a tab from before a deploy reloads once instead of failing on chunks that are gone
installStaleChunkReload()

// the accessibility statement's two addresses: ?reduce=1 stops all motion, ?calm=1 stops what moves by itself
if (/[?&]reduce=1(&|$)/.test(location.search)) document.documentElement.classList.add('disable-animations')
// ?calm=1 also has to reach the CSS loops (the buoys, the water, the logo's colour walk): they read this class
if (/[?&]calm=1(&|$)/.test(location.search)) document.documentElement.classList.add('calm')
// D296: the opener, only when index.html asked for it, and before anything else here: its shader compiles in the
// GPU process while React boots. It rides in the first download (8 KB gzipped): as a chunk of its own it cost a
// first visit one more round trip under the cover, measured half a second on this machine.
if (document.documentElement.classList.contains('mw-intro')) {
  try { startOpener() } catch (err) { document.documentElement.classList.remove('mw-intro', 'mw-intro-cover'); showWhy([`opener: it threw at start: ${String(err).slice(0, 300)}`]) }
} else if ((window as unknown as { __mwLate?: number }).__mwLate) {
  // the page's code arrived after the head had already lifted the cover (five seconds): no opener on this visit
  showWhy([`opener: not started, the code arrived ${Math.round(performance.now())} ms after the page, after the cover was lifted`])
}
// D275: the buttons' beats (and the lens filter where the browser can draw it)
startButtons()
// D282: a new line after every sentence in the running text (sentences.ts)
startSentences()

const root = createRoot(document.getElementById('root')!)
startTransition(() => {
  root.render(
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <SunApp />
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>,
  )
})
