import { StrictMode, startTransition } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { PreviewProvider } from './sanity/PreviewContext'
import './styles/index.css'
import App from './App.tsx'

// The site is the portfolio — that includes whoever opens DevTools.
// Deliberate brand signature, not a stray debug log.
if (import.meta.env.PROD) {
  console.info(
    '%c🌊 MediaWave %c נבנה בעבודת יד, גל אחרי גל. רוצים אתר כזה? ',
    'background:#1E293B;color:#7DD3FC;font-weight:bold;padding:4px 8px;border-radius:4px 0 0 4px;',
    'background:#7DD3FC;color:#1E3A5F;padding:4px 8px;border-radius:0 4px 4px 0;'
  )
  console.info('https://wa.me/972528731808')
}

// startTransition marks the initial render non-urgent so React time-slices it
// into small tasks instead of one long block — measured TBT relief on 4x-CPU
// mobile, with identical output (the prerendered HTML covers the screen anyway).
const root = createRoot(document.getElementById('root')!)
startTransition(() => {
  root.render(
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <PreviewProvider>
            <App />
          </PreviewProvider>
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>,
  )
})
