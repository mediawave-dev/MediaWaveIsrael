// A blog post (D218): a place to read, in the home's language (D214): no slabs, a mono kicker, the
// title in the display face at the start, the short answer first (so Google and AI tools can quote
// it), a ruled index of the questions, hairlines between parts, and one clear next step at the end:
// the visitor's own site in 60 seconds for a trade post, the service page and WhatsApp otherwise.
// No heavy effects: the sea stays calm under the words (D174) and alive in the margins.
import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import { LookButton } from '@look/button'
import { SITE_URL } from '../data/site'
import { servicesData } from '../data/services'
import { track } from '../utils/analytics'
import { getWhatsAppUrl } from '../utils/whatsapp'
import { Trail } from '../look/shot/pages/kit'
import Prose from './Prose'
import { faqOf, ld, plain } from './text'
import { Helmet } from 'react-helmet-async'
import { getPost, relatedTo } from './posts'
import { dateHe, type Post } from './markdown'
import './blog.css'

const ORG = { '@type': 'Organization', name: 'MediaWave Israel', url: `${SITE_URL}/` }

function schema(post: Post, url: string) {
  const faq = faqOf(post.blocks)
  return [
    {
      '@context': 'https://schema.org', '@type': 'BlogPosting',
      headline: post.title, description: post.description, inLanguage: 'he-IL',
      datePublished: post.published, dateModified: post.updated,
      author: ORG, publisher: { ...ORG, logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` } },
      image: `${SITE_URL}/og/blog-${post.slug}.png`, mainEntityOfPage: { '@type': 'WebPage', '@id': url }, url,
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ראשי', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'בלוג', item: `${SITE_URL}/blog/` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
    ...(faq.length ? [{
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faq.map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: plain(q.a) } })),
    }] : []),
  ]
}

/** The ruled index of the post's questions (posts with four or more of them). */
function Toc({ post }: { post: Post }) {
  const heads = post.blocks.filter((b): b is Extract<Post['blocks'][number], { type: 'h2' }> => b.type === 'h2')
  if (heads.length < 4) return null
  return (
    <nav className="bp-toc" aria-labelledby="bp-toc-t">
      <p id="bp-toc-t" className="bp-toc__t" lang="en" dir="ltr">IN THIS POST</p>
      <ol>
        {heads.map((h, i) => (
          <li key={h.id}>
            <a href={`#${h.id}`} data-zone="text"><span className="bp-toc__n" aria-hidden="true">{`( ${String(i + 1).padStart(2, '0')} )`}</span><span>{h.text}</span></a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** The one next step: a trade post opens the reader's own site, the others the service and WhatsApp. */
function End({ post }: { post: Post }) {
  const service = servicesData.find((s) => s.slug === post.service)
  const wa = post.wa ?? service?.waText ?? 'היי, קראתי את הבלוג ואשמח לשאול שאלה.'
  const line = post.cta ?? service?.cta ?? 'רוצים לשאול משהו?'
  const waLink = (
    <a className="shot-link" href={getWhatsAppUrl(wa)} target="_blank" rel="noopener noreferrer" data-zone="text"
      onClick={() => track('whatsapp_click', { placement: 'blog_post' })}>כתבו לנו בוואטסאפ</a>
  )
  return (
    <section className="bp-end" aria-labelledby="bp-end-t">
      <h2 id="bp-end-t" className="bp-big" data-zone="text">{line}</h2>
      {post.field
        // [קופי: נתי]
        ? <p className="bp-end__line" data-zone="text">כותבים את שם העסק, בוחרים סגנון, ורואים את האתר שלכם על מסך של טלפון. בלי טופס.</p>
        : <p className="bp-end__line" data-zone="text">כותבים בוואטסאפ, ומי שעושה את העבודה עונה תוך 24 שעות בימי עסקים.</p>}
      <div className="bp-end__keys" data-dock-hide="">
        {post.field ? (
          <>
            <LookButton href={`/your-site/?field=${post.field}&src=blog-${post.slug}`} block zone="text"
              onClick={() => track('cta_click', { placement: 'blog_post_s60' })}>האתר שלכם ב-60 שניות</LookButton>
            {waLink}
          </>
        ) : (
          <>
            <LookButton href={getWhatsAppUrl(wa)} target="_blank" rel="noopener noreferrer" block zone="text"
              onClick={() => track('whatsapp_click', { placement: 'blog_post' })}>כתבו לנו בוואטסאפ</LookButton>
            {service && (
              <a className="shot-link" href={`/services/${service.slug}/`} data-zone="text"
                onClick={() => track('cta_click', { placement: 'blog_post_service' })}>{`על ${service.title}`}</a>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default function BlogPost() {
  const { slug = '' } = useParams<{ slug: string }>()
  const post = getPost(slug)
  // a post always opens at its top (the legal pages do the same)
  useEffect(() => { if (!window.location.hash) window.scrollTo(0, 0) }, [slug])
  if (!post) return <Navigate to="/404" replace />

  const url = `${SITE_URL}/blog/${post.slug}/`
  const more = relatedTo(post)
  return (
    <div className="sp bp">
      <SEO title={post.title} description={post.description} canonical={`/blog/${post.slug}`} ogType="article"
        ogImage={`${SITE_URL}/og/blog-${post.slug}.png`} article={{ publishedTime: post.published, author: 'MediaWave Israel', tags: [post.kicker] }}
        noindex={post.draft} />
      {schema(post, url).map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(s) }} />)}
      <Helmet><link rel="alternate" type="application/rss+xml" title="הבלוג של MediaWave" href={`${SITE_URL}/feed.xml`} /></Helmet>
      <div className="sp-top sp-top--hang">
        <Trail items={[{ label: 'דף הבית', href: '/' }, { label: 'בלוג', href: '/blog/' }, { label: post.title }]} />
      </div>

      <article className="bp-art" aria-labelledby="bp-title">
        <header className="bp-head" data-dock-hide="">
          <p className="bp-kicker" lang="en" dir="ltr" data-zone="text">{post.kicker}</p>
          <h1 id="bp-title" className="bp-h1" data-zone="text">{post.title}</h1>
          <p className="bp-meta" data-zone="text">
            <span>MediaWave</span>
            <span>{`${post.minutes} דקות קריאה`}</span>
            <span>עודכן <time dateTime={post.updated}>{dateHe(post.updated)}</time></span>
          </p>
        </header>
        <div className="bp-body">
          <Prose blocks={post.blocks} after={<Toc post={post} />} />
        </div>
      </article>

      <End post={post} />

      {more.length > 0 && (
        <nav className="bp-more" aria-labelledby="bp-more-t">
          <p id="bp-more-t" className="bp-kicker" lang="en" dir="ltr">MORE QUESTIONS</p>
          <ul>
            {more.map((p) => (
              <li key={p.slug}><a href={`/blog/${p.slug}/`} data-zone="text"><span className="bp-more__t">{p.title}</span><span className="bp-more__m">{`${p.minutes} דקות קריאה`}</span></a></li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
