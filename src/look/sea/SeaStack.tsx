// sea · the corner stack (lamalama-deep.rtl.md §3 #13, translated; D155, gate `stack`): wide screens,
// home page. Under the contact card the stack collects what the visitor passed, only real things: the
// memories sample when the film chapter arrives, the bot when the services arrive. The newest opens
// with its picture and its action; the one before folds into a row with ( + ). A row opens on a click
// (and the other folds); an open card folds again after 800px of scroll. Buttons with aria-expanded,
// links with their own names. [קופי: נתי] the rows' titles and actions.
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { opt } from './lab'
import SeaImage from './SeaImage'
import { openChat } from '../../components/ui/chat-event'
import { track } from '../../utils/analytics'

interface Item { id: string; at: string; title: string; act: string; href?: string }
const ITEMS: Item[] = [
  { id: 'sample', at: 'film', title: 'דוגמה: סרטון זיכרונות', act: 'לצפייה', href: '/portfolio/memory-videos/' },
  { id: 'bot', at: 'services', title: 'שאלו את הבוט', act: 'לשאול עכשיו' },
]

export default function SeaStack() {
  const { pathname } = useLocation()
  const on = opt('stack') === 'on' && pathname === '/'
  const [got, setGot] = useState<string[]>([])
  const [open, setOpen] = useState<string | null>(null)
  const openedAt = useRef(0)

  useEffect(() => {
    if (!on || !window.matchMedia('(min-width: 1100px)').matches) return
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return
      const it = ITEMS.find((x) => x.at === (e.target as HTMLElement).dataset.chapter)
      if (!it) return
      io.unobserve(e.target)
      setGot((g) => (g.includes(it.id) ? g : [...g, it.id]))
      openedAt.current = window.scrollY
      setOpen(it.id)
    }), { rootMargin: '-45% 0px -45% 0px' })
    ITEMS.forEach((it) => { const el = document.querySelector(`main [data-chapter="${it.at}"]`); if (el) io.observe(el) })
    const onScroll = () => { if (Math.abs(window.scrollY - openedAt.current) > 800) setOpen(null) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [on])

  if (!on || !got.length) return null
  return (
    <div className="sea-stack" role="group" aria-label="מה שעברתם בדרך">
      {got.map((id) => {
        const it = ITEMS.find((x) => x.id === id)!
        const isOpen = open === id
        return (
          <div key={id} className={`sea-stack__item${isOpen ? ' is-open' : ''}`}>
            <button
              type="button"
              className="sea-stack__row"
              aria-expanded={isOpen}
              onClick={() => { openedAt.current = window.scrollY; setOpen(isOpen ? null : id) }}
            >
              <span className="sea-stack__sign" aria-hidden="true">( {isOpen ? '-' : '+'} )</span>
              {it.title}
            </button>
            {isOpen && (
              <div className="sea-stack__body">
                {id === 'sample'
                  ? <SeaImage src="/videos/memory-video-poster-640.webp" w={640} h={360} when="hover" className="sea-stack__pic" />
                  : <SeaImage src="/media/svc-chat-tile.webp" w={384} h={240} when="hover" className="sea-stack__pic" />}
                {it.href
                  ? <a className="sea-stack__act" href={it.href} onClick={() => track('cta_click', { placement: `stack_${id}` })}>{it.act}</a>
                  : <button type="button" className="sea-stack__act" onClick={() => openChat('stack_bot')}>{it.act}</button>}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
