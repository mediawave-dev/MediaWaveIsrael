// shot · the legal pages (D90): one plain sheet of paper on the table, the same header and type, a
// readable measure, no camera move (research 02, Methods 12: no winner made legal theatrical). The
// legal text is the legacy page's own body (TermsBody, PrivacyBody, AccessibilityBody), unchanged;
// only its presentation is the shot's (shot-legal.css). Every track() call lives in those bodies.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import SEO from '../../../components/SEO'
import { SITE_URL } from '../../../data/site'
import { Trail } from './kit'
import './shot-legal.css'

export interface LegalProps {
  /** the page name: the H1, the breadcrumb and the SEO title */
  name: string
  description: string
  path: string
  updated: string
  children: ReactNode
}

export default function ShotLegal({ name, description, path, updated, children }: LegalProps) {
  // a legal page always opens at its top (the legacy pages did the same)
  useEffect(() => { window.scrollTo(0, 0) }, [])
  // the index: every section heading gets an id and a line in the ruled list at the top
  const body = useRef<HTMLDivElement>(null)
  const [toc, setToc] = useState<{ id: string; label: string }[]>([])
  useEffect(() => {
    const hs = [...(body.current?.querySelectorAll('section > h2') ?? [])] as HTMLElement[]
    setToc(hs.map((h, i) => { h.id ||= `s${i + 1}`; return { id: h.id, label: h.textContent?.trim() ?? '' } }))
  }, [])
  const crumbs = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ראשי', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path}/` },
    ],
  }
  return (
    <div className="sp sl">
      <SEO title={name} description={description} canonical={path} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <div className="sp-top sp-top--hang">
        <Trail items={[{ label: 'דף הבית', href: '/' }, { label: name }]} />
      </div>
      <article className="sl-sheet" aria-labelledby="sl-title">
        <header className="sl-head">
          <h1 id="sl-title" className="sp-h1" data-zone="text">{name}</h1>
          <p className="sl-updated" data-zone="text">עודכן לאחרונה: {updated}</p>
        </header>
        {toc.length > 2 && (
          <nav className="sl-toc" aria-label="בדף הזה">
            <ol>{toc.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.label}</a></li>)}</ol>
          </nav>
        )}
        <div className="sl-body" ref={body}>{children}</div>
      </article>
    </div>
  )
}
