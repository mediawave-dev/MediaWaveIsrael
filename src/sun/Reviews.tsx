// sun · the Google reviews (D299). What clients wrote on the studio's Google profile, read live from Google
// (functions/api/reviews.ts, kept a day at the edge): the rating and the reviews Google hands out (five at most, in
// Google's order). A new review on Google reaches the page within a day, with no hand in between.
// It reads as Google's: Google's mark, the stars, "Google Maps", each author's name linking to their Google profile, the
// text as they wrote it, and a link to every review on Google Maps (Google's terms ask for all of these).
// No count of reviews and no "write us a review" (Moria, 24.11: a small number works against us).
// No faces (docs/PROOF.rtl.md): the author's initial in a disc stands where Google shows a photo.
// The prerendered page has no section; it loads when the visitor comes near it, and stays away if Google has nothing.
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { REVIEWS } from './content'
import { IconChevrons } from './icons'
import { track } from '../utils/analytics'
import './reviews.css'

/** the answer of /api/reviews (functions/api/reviews.ts, ReviewsAnswer) */
interface Review { author: string; authorUrl?: string; rating: number; when: string; time?: string; text: string; url?: string }
interface Answer { rating: number; count: number; url: string; reviews: Review[] }

const PRERENDER = typeof window !== 'undefined' && (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__

/** Google's "G", in Google's own colours */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

/** Five stars, filled to the rating (Google's yellow); the number is said for a screen reader */
function Stars({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <span className="stars" role="img" aria-label={`דירוג ${rating} מתוך 5`} style={{ '--fill': `${(rating / 5) * 100}%`, '--s': `${size}px` } as CSSProperties}>
      <span className="stars__on" aria-hidden="true">★★★★★</span>
      <span className="stars__off" aria-hidden="true">★★★★★</span>
    </span>
  )
}

/** The answer, once the visitor is within a screen or so of the section. Nothing in the prerender. */
function useReviews() {
  const ref = useRef<HTMLDivElement>(null)
  const [answer, setAnswer] = useState<Answer | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || PRERENDER) return
    let live = true
    const load = () => fetch('/api/reviews')
      .then((r) => (r.ok ? r.json() as Promise<Answer> : null))
      .then((a) => { if (live && a && a.count > 0 && a.reviews.length) setAnswer(a) })
      .catch(() => {})
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      io.disconnect()
      void load()
    }, { rootMargin: '900px 0px' })
    io.observe(el)
    return () => { live = false; io.disconnect() }
  }, [])
  return { ref, answer }
}

function Card({ r }: { r: Review }) {
  const out = { target: '_blank', rel: 'noopener' }
  return (
    <li className="rev">
      <div className="rev__by">
        <span className="rev__face" aria-hidden="true">{Array.from(r.author)[0]}</span>
        <span className="rev__who">
          {r.authorUrl ? <a className="rev__name" href={r.authorUrl} {...out}>{r.author}</a> : <span className="rev__name">{r.author}</span>}
          <span className="rev__when">{r.time ? <time dateTime={r.time}>{r.when}</time> : r.when}</span>
        </span>
        <GoogleG className="rev__g" />
      </div>
      <Stars rating={r.rating} size={16} />
      <p className="rev__text" dir="auto">{r.text}</p>
      {r.url && (
        <a className="more rev__more" href={r.url} {...out} onClick={() => track('cta_click', { placement: 'google_review' })}>
          <span>{REVIEWS.one}</span><IconChevrons />
        </a>
      )}
    </li>
  )
}

export default function Reviews() {
  const { ref, answer } = useReviews()
  if (!answer) return <div ref={ref} aria-hidden="true" />
  const out = { target: '_blank', rel: 'noopener' }
  // the house heading in two weights (Home.tsx, H2), written here so this file does not import the page that imports it
  const [lead, bold] = REVIEWS.h2.split('|')
  return (
    <section id="reviews" className="band band--cream reviews" aria-labelledby="reviews-h">
      <div className="wrap">
        <h2 id="reviews-h" className="h2">{lead}<b>{bold}</b></h2>
        <div className="reviews__sum">
          <GoogleG className="reviews__g" />
          <b className="reviews__score">{answer.rating.toFixed(1)}</b>
          <span className="reviews__of">
            <Stars rating={answer.rating} size={22} />
            {/* Google's terms: Places data shown without a map carries "Google Maps", in English, unchanged and on one line */}
            <a className="reviews__maps" href={answer.url} {...out} lang="en" dir="ltr" onClick={() => track('cta_click', { placement: 'google_reviews_maps' })}>Google Maps</a>
          </span>
        </div>
        <ul className="reviews__list">
          {answer.reviews.map((r) => <Card key={`${r.author}-${r.time ?? r.when}`} r={r} />)}
        </ul>
        <div className="reviews__go">
          <a className="more" href={answer.url} {...out} onClick={() => track('cta_click', { placement: 'google_reviews_all' })}>
            <span>{REVIEWS.all}</span><IconChevrons />
          </a>
        </div>
      </div>
    </section>
  )
}
