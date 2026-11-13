// sun · proof (13.11.2026). Two kinds, both from src/data/proof.ts:
//   what a visitor checks alone, live today: the page's own speed in Google's tool (SpeedCheck);
//   what clients said: one sentence per place (VoiceAt), the Google line beside the form, the studio's
//   signature line. All three are empty today, and a place with nothing real in it renders nothing.
// With ?proof=demo each empty place shows a placeholder that describes itself, so the places can be judged
// before there is a single real sentence. The placeholders are another file (proof-demo.ts), fetched only
// when the address asks for them. How to fill the places: docs/PROOF.rtl.md.
import { useEffect, useState, type CSSProperties } from 'react'
import { SITE_URL } from '../data/site'
import { GOOGLE, SIGNATURE, VOICES, type ClientVoice, type ProofPlace } from '../data/proof'
import { track } from '../utils/analytics'
import { IconChevrons, IconWhatsApp } from './icons'
import { WA } from './content'
import type { ProofDemo } from './proof-demo'
import './proof.css'

// [קופי: נתי] the three lines this file says by itself; no number is written, the tool gives today's
const SPEED = { ask: 'כמה מהר הדף הזה נפתח בטלפון?', link: 'בדקו בכלי של גוגל' }
const SOURCE = 'לקריאה במקור'
const google = (rating: number, count: number) => ({
  text: `הדירוג שלנו בגוגל ${rating.toFixed(1)} מתוך 5, לפי ${count === 1 ? 'ביקורת אחת' : `${count} ביקורות`}.`,
  link: count === 1 ? 'קראו אותה בגוגל' : 'קראו אותן בגוגל',
})

const PRERENDER = typeof window !== 'undefined' && !!(window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__
const MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
/** "2026-10" is written "אוקטובר 2026" and marked up as a date; anything else is shown as it was typed */
function monthYear(w: string) {
  const m = /^(\d{4})-(\d{1,2})$/.exec(w.trim())
  const name = m && MONTHS[+m[2] - 1]
  return m && name ? <time dateTime={`${m[1]}-${m[2].padStart(2, '0')}`}>{name} {m[1]}</time> : w
}
/** the service whose page this is, from the address (/services/landing-pages/) */
const pageService = () => (typeof location === 'undefined' ? undefined : /^\/services\/([^/]+)/.exec(location.pathname)?.[1])
const outward = (href: string) => (/^https?:/.test(href) ? { target: '_blank', rel: 'noopener' } : {})

/** The placeholders, only for an address with ?proof=demo. One download serves every place on the page. */
let fetching: Promise<ProofDemo> | undefined
function useDemo(): ProofDemo | null {
  const [demo, setDemo] = useState<ProofDemo | null>(null)
  useEffect(() => {
    if (new URLSearchParams(location.search).get('proof') !== 'demo') return
    let live = true
    void (fetching ??= import('./proof-demo').then((m) => m.DEMO)).then((d) => { if (live) setDemo(d) })
    return () => { live = false }
  }, [])
  return demo
}

/** the word that marks a placeholder; a real line carries none */
const Tag = ({ word }: { word?: string }) => (word ? <b className="proof__tag">{word}</b> : null)

/** The one sentence a place shows: approved, written for this place, and for this service's page or for any. */
function pick(list: ClientVoice[], place: ProofPlace, service?: string) {
  const fit = list.filter((v) => v.approved && v.place === place && v.quote.trim() && (!v.service || v.service === service))
  return fit.find((v) => v.service) ?? fit[0]
}

/** A client's sentence in the two weights the site speaks in, its strong part heavy, and one quiet line
    under it with who said it and where. No card, no ornament, no picture of a person. A real screenshot
    stands beside it in the white frame the work wears. */
function Voice({ v, tag }: { v: ClientVoice; tag?: string }) {
  const at = v.strong ? v.quote.indexOf(v.strong) : -1
  const [before, strong, after] = at < 0 ? [v.quote, '', ''] : [v.quote.slice(0, at), v.strong, v.quote.slice(at + v.strong.length)]
  return (
    <figure className="voice" data-shot={v.shot ? '' : undefined}>
      <blockquote className="voice__q" cite={v.source}>
        <p>{before}{strong && <b>{strong}</b>}{after}</p>
      </blockquote>
      {v.shot && (
        <div className="voice__shot">
          {v.shot.src
            ? <img src={v.shot.src} alt={v.shot.alt} width={v.shot.width} height={v.shot.height} loading="lazy" decoding="async" />
            : <p className="voice__blank" style={{ aspectRatio: `${v.shot.width} / ${v.shot.height}` }}>{v.shot.alt}</p>}
        </div>
      )}
      <figcaption className="voice__by">
        <Tag word={tag} />
        <span className="voice__who">{v.who}</span>{' '}
        <span>{v.where}, {monthYear(v.when)}</span>{' '}
        {v.source && (
          <a className="more" href={v.source} target="_blank" rel="noopener" onClick={() => track('cta_click', { placement: `proof_source_${v.place}` })}>
            <span>{SOURCE}</span><IconChevrons />
          </a>
        )}
      </figcaption>
    </figure>
  )
}

/** A place for one client's sentence. Renders nothing until an approved sentence for it exists.
    "hero" and "form" stand between sections and bring the text column with them; "steps" and "price"
    stand inside a section's own column. */
export function VoiceAt({ place, service = pageService() }: { place: ProofPlace; service?: string }) {
  const demo = useDemo()
  const real = pick(VOICES, place, service)
  const v = real ?? (demo ? pick(demo.voices, place, service) : undefined)
  if (!v) return null
  const column = place === 'hero' || place === 'form' ? ' wrap wrap--narrow' : ''
  return (
    <div className={`proof proof--${place}${column}`}>
      <Voice v={v} tag={real ? undefined : demo?.tag} />
    </div>
  )
}

/** The page's own speed, for the visitor to measure: Google's tool, opened on this very address, on its
    phone test. The prerendered link carries the production address; the running page puts its own in
    (the preview's differs), without whatever the visitor's link carried after the question mark. */
export function SpeedCheck({ steps = 4 }: { steps?: number }) {
  const page = typeof location === 'undefined' || PRERENDER ? `${SITE_URL}/` : location.origin + location.pathname
  const href = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(page)}&form_factor=mobile`
  return (
    <p className="check check--route" style={{ '--n': steps } as CSSProperties}>
      <span>{SPEED.ask}</span>{' '}
      <a className="more" href={href} target="_blank" rel="noopener" onClick={() => track('cta_click', { placement: 'pagespeed' })}>
        <span>{SPEED.link}</span><IconChevrons />
      </a>
    </p>
  )
}

/** The Google reviews line beside the form: only when the profile's link, rating and count are all real. */
export function GoogleLine() {
  const demo = useDemo()
  // a link that is not a web address, a zero rating or a zero count is an unfilled line, and shows nothing
  const real = GOOGLE && /^https?:\/\//.test(GOOGLE.url) && GOOGLE.rating > 0 && GOOGLE.count > 0 ? { ...google(GOOGLE.rating, GOOGLE.count), href: GOOGLE.url } : null
  const g = real ?? demo?.google
  if (!g) return null
  return (
    <p className="check check--mid">
      <span><Tag word={real ? undefined : demo?.tag} />{g.text}</span>{' '}
      <a className="more" href={g.href} {...outward(g.href)} onClick={() => track('cta_click', { placement: 'google_reviews' })}>
        <span>{g.link}</span><IconChevrons />
      </a>
    </p>
  )
}

/** The people behind the studio, in one line under "נעים מאוד". No faces (Nati's rule), no line until he writes one. */
export function Signature() {
  const demo = useDemo()
  const real = SIGNATURE.trim()
  const text = real || demo?.signature
  if (!text) return null
  return (
    <p className="sign"><Tag word={real ? undefined : demo?.tag} />{text}{real && <>{" "}<a className="more" href={WA.hero} target="_blank" rel="noopener" onClick={() => track('whatsapp_click', { placement: 'signature' })}><IconWhatsApp /><span>לכתוב לה בוואטסאפ</span></a></>}</p>
  )
}
