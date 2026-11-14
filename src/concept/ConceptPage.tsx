// /concept/:id (dev only, D271): a style of the studio dressed as a fictional business's site, for the work wheel's
// recordings (scripts/record-work.mjs --url). Nothing of the studio shows: no worlds, guide, music or our WhatsApp; the
// business's name is the bar's wordmark, as inside /your-site/. Never part of the public build (App.tsx, DEV).
import { useEffect, useLayoutEffect, useState, type ComponentType } from 'react'
import { useParams } from 'react-router-dom'
import { byId, type StyleProps } from '../studio/registry'
import { useTier } from '../studio/motion'
import { fitNames } from '../studio/preview'
import { SiteProvider, type Site } from '../studio/site'
import { MAOF } from './maof'
import { ZIMZUM } from './zimzum'
import '../studio/studio.css'

const SITES: Record<string, { style: string; site: Site }> = {
  maof: { style: 'flight', site: MAOF },
  zimzum: { style: 'buzz', site: ZIMZUM },
}

export default function ConceptPage() {
  const { id = '' } = useParams()
  const entry = SITES[id]
  const def = byId(entry?.style)
  const tier = useTier()
  const [Page, setPage] = useState<ComponentType<StyleProps> | null>(null)

  useEffect(() => {
    if (!entry) return
    let live = true
    void def.load().then(async (m) => {
      await Promise.race([(m.prepare?.() ?? Promise.resolve()).catch(() => undefined), new Promise((r) => setTimeout(r, 1600))])
      if (live) setPage(() => m.default)
    })
    const html = document.documentElement
    html.dataset.style = def.id
    document.title = entry.site.hero.brand ?? ''
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta) }
    meta.content = def.theme
    return () => { live = false; delete html.dataset.style }
  }, [def, entry])

  useLayoutEffect(() => { if (Page) fitNames() }, [Page])

  if (!entry) return <p style={{ padding: 40 }}>No concept site called "{id}". Try /concept/maof or /concept/zimzum.</p>

  return (
    <div className="st st--concept" data-tier={tier}>
      <header className="st-bar st-pv" aria-hidden="true">
        <bdi className="st-pv__brand" style={{ ['--pv-face' as string]: def.face }}>{entry.site.hero.brand}</bdi>
        <span className="st-pv__menu"><i /><i /><i /></span>
      </header>
      <main id="main-content" className="st-main">
        <SiteProvider value={entry.site}>
          {Page && <Page key={def.id} tier={tier} def={def} />}
        </SiteProvider>
      </main>
    </div>
  )
}
