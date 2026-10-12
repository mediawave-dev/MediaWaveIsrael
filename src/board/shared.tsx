// Shared pieces for the dev-only style board (/board). Never built: App.tsx only
// imports this tree behind import.meta.env.DEV.

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LottieIcon } from '../components/ui'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useAmbientMotion, useReducedMotion } from '../hooks/useReducedMotion'
import { servicesData } from '../data/services'

/** One outcome line per service for the strip. [קופי: נתי] every line. */
const LINES: Record<string, string> = {
  websites: 'אתר שנבנה בקוד, נטען מהר ושייך לכם.',
  landing: 'דף אחד שהופך גולש לפנייה בוואטסאפ.',
  seo: 'שימצאו אתכם בגוגל כשמחפשים את מה שאתם עושים.',
  chatbots: 'עונה ללקוחות גם כשאתם בפגישה.',
  'video-editing': 'מחומר גלם לסרטון שרואים עד הסוף, וקלטות ישנות לקובץ.',
  'memory-videos': 'תמונות מהאלבום שחוזרות לזוז.',
}

export const SERVICES = servicesData.map((s) => ({
  id: s.id,
  slug: s.slug,
  title: s.title,
  line: LINES[s.id] ?? s.heroSubtitle,
  lottie: s.lottieAnimation,
  image: s.imageIcon,
  renderer: s.lottieRenderer,
}))

export type BoardService = (typeof SERVICES)[number]

/** The service's real artwork: its Lottie (unchanged) or its static SVG. */
export function ServiceArt({ service, size }: { service: BoardService; size: number }) {
  if (service.image) {
    return <img src={service.image} alt="" aria-hidden="true" width={size} height={size} style={{ width: size, height: size, objectFit: 'contain' }} />
  }
  if (!service.lottie) return null
  return <LottieIcon animationPath={service.lottie} size={size} renderer={service.renderer} playOnHover={false} loop />
}

export const HERO = {
  line1: 'העסק שלכם',
  line2: 'המומחיות שלנו',
  /** [קופי: נתי] replaces "עם גישה אישית וליווי צמוד" (slop-scan flagged both) */
  sub: 'בונים לכם אתר שמביא פניות. מדברים ישירות עם המפתח, בלי מתווכים.',
  cta: 'בואו נדבר על הפרויקט שלכם',
  headerCta: 'בואו נדבר',
}

export const NAV = ['שירותים', 'איך זה עובד', 'שאלות', 'בלוג']

/** ?motion=full lifts the OS reduced-motion gate (Nati's Windows reports reduce). */
function forceFull() {
  return typeof location !== 'undefined' && new URLSearchParams(location.search).get('motion') === 'full'
}

/** The production rules for the hero video: desktop only, mounted after idle, never under
    reduced motion (unless ?motion=full for review) and never with the widget's stop. */
export function useHeroVideo(): boolean {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const reduced = useReducedMotion()
  const ambient = useAmbientMotion()
  const [idle, setIdle] = useState(false)
  useEffect(() => {
    if (!isDesktop) return
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout: 1500 })
      return () => window.cancelIdleCallback(id)
    }
    const t = setTimeout(() => setIdle(true), 300)
    return () => clearTimeout(t)
  }, [isDesktop])
  return isDesktop && idle && ambient && (!reduced || forceFull())
}

/** Poster always (it is the first frame), video on top once allowed. */
export function HeroMedia({ className = '', style }: { className?: string; style?: CSSProperties }) {
  const play = useHeroVideo()
  return (
    <>
      <img src="/images/hero-poster.webp" alt="" aria-hidden="true" decoding="async" className={className} style={style} />
      {play && (
        <video autoPlay muted loop playsInline aria-hidden="true" poster="/images/hero-poster.webp" className={className} style={style}>
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
      )}
    </>
  )
}

export type BtnState = 'idle' | 'loading' | 'sent' | 'error'
export type BtnForce = 'hover' | 'pressed' | 'focus' | undefined

export const STATE_LABEL: Record<BtnState, string> = {
  idle: HERO.cta,
  loading: 'שולחים',
  sent: 'נשלח. נחזור אליכם היום', // [קופי: נתי] promise needs his OK
  error: 'לא נשלח. נסו שוב',
}

/** Clickable stand-in for the Rive state machine: idle → loading → sent | error → idle. */
export function useButtonMachine() {
  const [state, setState] = useState<BtnState>('idle')
  const timers = useRef<number[]>([])
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => clear, [])
  const run = (fail = false) => {
    clear()
    setState('loading')
    timers.current.push(window.setTimeout(() => setState(fail ? 'error' : 'sent'), 1500))
    timers.current.push(window.setTimeout(() => setState('idle'), 4600))
  }
  return { state, run }
}

/** The seven states laid out for screenshots; hover, press and focus are forced by attribute. */
export const STRIP: { label: string; state: BtnState; force?: BtnForce }[] = [
  { label: 'מנוחה', state: 'idle' },
  { label: 'ריחוף', state: 'idle', force: 'hover' },
  { label: 'לחיצה', state: 'idle', force: 'pressed' },
  { label: 'פוקוס מקלדת', state: 'idle', force: 'focus' },
  { label: 'שולח', state: 'loading' },
  { label: 'נשלח', state: 'sent' },
  { label: 'שגיאה', state: 'error' },
]

/** Board chrome: switch directions. Hidden with ?clean for captures. */
export function BoardNav({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const { search, pathname } = useLocation()
  if (new URLSearchParams(search).has('clean')) return null
  const items = [
    { to: '/board', label: 'לוח' },
    { to: '/board/a', label: 'A' },
    { to: '/board/b', label: 'B' },
    { to: '/board/c', label: 'C' },
  ]
  const fg = tone === 'dark' ? '#fff' : '#111'
  const bg = tone === 'dark' ? 'rgba(17,17,17,.88)' : 'rgba(255,255,255,.92)'
  return (
    <nav aria-label="כיוונים" style={{ position: 'fixed', insetInlineEnd: 12, bottom: 12, zIndex: 90, display: 'flex', gap: 2, padding: 4, background: bg, borderRadius: 8, font: '600 13px/1 Heebo, sans-serif', boxShadow: '0 2px 10px rgba(0,0,0,.2)' }}>
      {items.map((it) => (
        <Link key={it.to} to={it.to + search} style={{ color: fg, padding: '8px 10px', borderRadius: 6, textDecoration: 'none', background: pathname === it.to ? (tone === 'dark' ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.1)') : 'transparent' }}>
          {it.label}
        </Link>
      ))}
    </nav>
  )
}

/** Paint the document behind the board, so overscroll and the gaps match the direction.
    Also drops index.html's static paint-first header: the real <Header> removes it on
    mount, and the board renders without Layout. */
export function useDocBackground(color: string) {
  useEffect(() => {
    document.getElementById('static-header')?.remove()
    const html = document.documentElement
    const prev = [html.style.background, document.body.style.background]
    html.style.background = color
    document.body.style.background = color
    return () => { html.style.background = prev[0]; document.body.style.background = prev[1] }
  }, [color])
}
