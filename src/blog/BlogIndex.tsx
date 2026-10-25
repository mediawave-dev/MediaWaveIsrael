// The blog's index (D218): reached from the menu only (Nati, 25.10: the blog is there for search, not
// a part of the home page). The posts as a ruled index in the home's language: a mono count, the
// question in the display face, one line, the reading time.
import { useEffect } from 'react'
import SEO from '../components/SEO'
import { SITE_URL } from '../data/site'
import { Trail } from '../look/shot/pages/kit'
import { posts } from './posts'
import { ld } from './text'
import { Helmet } from 'react-helmet-async'
import './blog.css'

const TITLE = 'תשובות ישרות על אתרים, דפי נחיתה ווידאו' // [קופי: נתי]
const LEDE = 'כמה זה עולה, כמה זמן זה לוקח, ומה באמת צריך. כל פוסט עונה על שאלה אחת עד הסוף.' // [קופי: נתי]

export default function BlogIndex() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const list = posts()
  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'Blog', name: 'הבלוג של MediaWave', url: `${SITE_URL}/blog/`, inLanguage: 'he-IL',
      blogPost: list.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE_URL}/blog/${p.slug}/`, datePublished: p.published, dateModified: p.updated })),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ראשי', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'בלוג', item: `${SITE_URL}/blog/` },
      ],
    },
  ]
  return (
    <div className="sp bp bp--index">
      <SEO title="בלוג: אתרים, דפי נחיתה ווידאו לעסקים" description="תשובות ישרות לשאלות של בעלי עסקים: כמה עולה אתר או דף נחיתה, מה חייב להיות בו, ואיך ממירים קלטות וידאו ישנות." canonical="/blog" />
      {schema.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(s) }} />)}
      <Helmet><link rel="alternate" type="application/rss+xml" title="הבלוג של MediaWave" href={`${SITE_URL}/feed.xml`} /></Helmet>
      <div className="sp-top sp-top--hang">
        <Trail items={[{ label: 'דף הבית', href: '/' }, { label: 'בלוג' }]} />
      </div>
      <header className="bp-head bp-head--index" data-dock-hide="">
        <p className="bp-kicker" lang="en" dir="ltr" data-zone="text">BLOG</p>
        <h1 className="bp-h1" data-zone="text">{TITLE}</h1>
        <p className="bp-lede" data-zone="text">{LEDE}</p>
      </header>
      <ol className="bp-index">
        {list.map((p, i) => (
          <li key={p.slug}>
            <a className="bp-row" href={`/blog/${p.slug}/`} data-zone="text">
              <span className="bp-row__n" lang="en" dir="ltr" aria-hidden="true">{`( ${String(i + 1).padStart(2, '0')} ) ${p.kicker}`}</span>
              <span className="bp-row__t">{p.title}</span>
              <span className="bp-row__d">{p.description}</span>
              <span className="bp-row__m">{`${p.minutes} דקות קריאה`}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}
