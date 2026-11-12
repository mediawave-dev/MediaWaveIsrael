// sun · the entry of the statement site (D237). Its own tree and its own stylesheet: none of the earlier
// looks' code or CSS is in this build (they boot from src/entry.legacy.tsx).
import { StrictMode, startTransition } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import '../look/shot/shot-fonts.css'
import './fonts.css'
import './sun.css'
import SunApp from './SunApp'
import { installStaleChunkReload } from '../utils/stale-chunk'

// a tab from before a deploy reloads once instead of failing on chunks that are gone
installStaleChunkReload()

// the accessibility statement's two addresses: ?reduce=1 stops all motion, ?calm=1 stops what moves by itself
if (/[?&]reduce=1(&|$)/.test(location.search)) document.documentElement.classList.add('disable-animations')

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
