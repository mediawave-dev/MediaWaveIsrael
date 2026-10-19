// shot · the inner pages' kit (D90): the same desk as the home page, quieter. Every inner page is
// the table with paper on it: a path printed on the table, a hero sheet, and below it the surfaces
// a studio really hands over (a checklist, a quote slip, a notepad), each one a different object
// so no two surfaces read as the same card (critic #12). Motion is the home page's vocabulary at
// half strength: sheets land (camera.land), the ink line draws (moves.inkLine); REDUCE, the
// prerender and no JS show the last frame. All text is in the DOM.
import type { ReactNode } from 'react'
import { LookButton } from '@look/button'
import { getWhatsAppUrl } from '../../../utils/whatsapp'
import { track } from '../../../utils/analytics'
import { Thing, type Kind } from '../../parts/Things'
import { Art } from '../../parts/Art'
import { posterFor } from '../eye-line'
import type { ShowItem } from '../../data'
import { vt } from '../vt'
import DotGlyph from '../../sea/DotGlyph'
import './shot-pages.css'

export { vt }

/** Which object from the desk stands for each service (the same Things as the home page's tool row). */
export const OBJECT: Record<string, Kind> = {
  websites: 'laptop',
  landing: 'phone',
  seo: 'loupe',
  chatbots: 'bubble',
  'video-editing': 'cassette',
  'memory-videos': 'frame',
}


export interface Crumb { label: string; href?: string }

/** The path, printed on the table above the sheet (BreadcrumbList JSON-LD lives with the page). */
export function Trail({ items }: { items: Crumb[] }) {
  return (
    <nav className="sp-trail" aria-label="מסלול ניווט">
      <ol>
        {items.map((c, i) => (
          <li key={c.label}>
            {c.href && i < items.length - 1
              ? <a href={c.href}>{c.label}</a>
              : <span aria-current="page">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** The page's verb, printed small above a heading (the home page's chapter kickers). */
export function Kicker({ children }: { children: ReactNode }) {
  return <p className="sp-kicker" data-zone="text">{children}</p>
}

/** The one primary action: a key that opens WhatsApp with this page's own message. */
export function WaKey({ text, placement, children = 'כתבו לנו בוואטסאפ', block = true }: { text: string; placement: string; children?: ReactNode; block?: boolean }) {
  return (
    <LookButton
      href={getWhatsAppUrl(text)}
      target="_blank"
      rel="noopener noreferrer"
      block={block}
      zone="text"
      onClick={() => track('whatsapp_click', { placement })}
    >
      {children}
    </LookButton>
  )
}

/** A service's object from the desk with its artwork on the face (Lottie at rest on its poster). */
export function DeskObject({ id, item, size, name = true }: { id: string; item: ShowItem; size: number; name?: boolean }) {
  const kind = OBJECT[id] ?? 'frame'
  return (
    <span className={`sp-obj sp-obj--${kind}`} style={name ? vt.obj(id) : undefined} aria-hidden="true" data-zone="art">
      <Thing kind={kind}>
        <span className="thing__art"><Art item={item} size={size} rest="last" poster={posterFor(item.lottie)} /></span>
      </Thing>
    </span>
  )
}

/** A ruled checklist on a sheet: each line an outcome with an ink tick. */
export function Checklist({ title, kicker, items }: { title: string; kicker?: string; items: string[] }) {
  return (
    <section className="sp-sheet sp-check sp-land" aria-labelledby="sp-check-title">
      {kicker && <Kicker>{kicker}</Kicker>}
      <h2 id="sp-check-title" className="sp-h2" data-zone="text">{title}</h2>
      <ul>
        {items.map((it) => (
          <li key={it} data-zone="text">
            <DotGlyph name="check" className="sp-tick" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** The notepad: questions that open in place (details/summary: keyboard, no JS, text in the DOM). */
export function Pad({ title, kicker, items, id = 'sp-faq' }: { title: string; kicker?: string; items: { question: string; answer: string }[]; id?: string }) {
  return (
    <section id={id} className="sp-padwrap" aria-labelledby={`${id}-title`}>
      <header className="sp-head">
        {kicker && <Kicker>{kicker}</Kicker>}
        <h2 id={`${id}-title`} className="sp-h2" data-zone="text">{title}</h2>
      </header>
      <ol className="sp-pad sp-land">
        {items.map((q) => (
          <li key={q.question}>
            <details>
              <summary data-zone="text"><span>{q.question}</span><i className="sp-pad__sign" aria-hidden="true"><DotGlyph name="plus" n={9} /></i></summary>
              <p data-zone="text">{q.answer}</p>
            </details>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** The ink line through the steps (moves.inkLine draws it; without the engine it is drawn). */
export function Steps({ title, kicker, steps, time, id = 'how' }: { title: string; kicker?: string; steps: { title: string; line: string }[]; time?: string; id?: string }) {
  return (
    <section id={id} className="sp-steps" aria-labelledby={`${id}-title`}>
      <header className="sp-head">
        {kicker && <Kicker>{kicker}</Kicker>}
        <h2 id={`${id}-title`} className="sp-h2" data-zone="text">{title}</h2>
      </header>
      <div className="sp-steps__track">
        <i className="shot-line" aria-hidden="true"><i className="shot-line__fill" /></i>
        <ol>
          {steps.map((s, i) => (
            <li key={s.title} className="sp-step">
              <span className="sp-step__node" aria-hidden="true">{i + 1}</span>
              <h3 className="sp-h3" data-zone="text">{s.title}</h3>
              <p data-zone="text">{s.line}</p>
            </li>
          ))}
        </ol>
      </div>
      {time && <p className="sp-time" data-zone="text"><b>כמה זמן:</b> {time}</p>}
    </section>
  )
}

/** The quote slip: how the price is set, on a narrow perforated slip of paper. */
export function Slip({ title, kicker, lines }: { title: string; kicker?: string; lines: readonly string[] }) {
  return (
    <section className="sp-slip sp-land" aria-labelledby="sp-slip-title">
      <div className="sp-slip__paper">
        {kicker && <Kicker>{kicker}</Kicker>}
        <h2 id="sp-slip-title" className="sp-h2" data-zone="text">{title}</h2>
        <ul>
          {lines.map((l) => <li key={l} data-zone="text">{l}</li>)}
        </ul>
      </div>
    </section>
  )
}
