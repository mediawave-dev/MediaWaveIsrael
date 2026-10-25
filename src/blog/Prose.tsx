// A post's body (D218): the parsed blocks as React elements. Every text block is its own overlap-audit
// zone and its own calm patch of the field (D174: the dots fade under words, never a box around them).
// Links inside the running text keep their underline (DECISIONS #30, the one exception).
import { Fragment, type ReactNode } from 'react'
import { inline, type Block } from './markdown'
import { PRICING } from '../data/pricing'
import { priced, safeHref } from './text'
import DotGlyph from '../look/sea/DotGlyph'

export function Text({ s }: { s: string }) {
  return (
    <>
      {inline(priced(s)).map((r, i) => {
        if (r.t === 'b') return <strong key={i}>{r.v}</strong>
        if (r.t === 'text' || !safeHref(r.href)) return <Fragment key={i}>{r.v}</Fragment>
        const away = /^https?:\/\//.test(r.href)
        return away
          ? <a key={i} className="bp-a" href={r.href} target="_blank" rel="noopener noreferrer">{r.v}</a>
          : <a key={i} className="bp-a" href={r.href}>{r.v}</a>
      })}
    </>
  )
}

function render(b: Block, key: string, lede: boolean): ReactNode {
  switch (b.type) {
    case 'h2': return <h2 key={key} id={b.id} className="bp-h2" data-zone="text">{b.text}</h2>
    case 'h3': return <h3 key={key} className="bp-h3" data-zone="text">{b.text}</h3>
    // the short answer keeps the dock (WhatsApp, AI) aside while it is on screen, as a hero's keys do
    case 'p': return <p key={key} className={lede ? 'bp-lede' : undefined} data-zone="text" data-dock-hide={lede ? '' : undefined}><Text s={b.text} /></p>
    case 'ul':
    case 'ol': {
      const List = b.type
      return <List key={key} className={`bp-list bp-list--${b.type}`}>{b.items.map((it, i) => <li key={i} data-zone="text"><Text s={it} /></li>)}</List>
    }
    case 'tip': return (
      <div key={key} className="bp-tip">
        <span className="bp-tip__k" lang="en" dir="ltr" aria-hidden="true">TIP</span>
        <p data-zone="text"><Text s={b.text} /></p>
      </div>
    )
    case 'faq': return (
      <ol key={key} className="bp-faq">
        {b.items.map((q) => (
          <li key={q.q}>
            <details>
              <summary data-zone="text"><span>{q.q}</span><i className="bp-faq__sign" aria-hidden="true"><DotGlyph name="plus" n={9} /></i></summary>
              <p data-zone="text"><Text s={q.a} /></p>
            </details>
          </li>
        ))}
      </ol>
    )
    case 'price': return <Fragment key={key}>{(PRICING.approved ? b.approved : b.pending).map((c, i) => render(c, `${key}-${i}`, false))}</Fragment>
  }
}

/** The post's blocks; `after` lands right after the opening paragraph (the table of contents). */
export default function Prose({ blocks, after }: { blocks: Block[]; after?: ReactNode }) {
  const [first, ...rest] = blocks
  const lede = first?.type === 'p'
  return (
    <>
      {first && render(first, 'b0', lede)}
      {after}
      {rest.map((b, i) => render(b, `b${i + 1}`, false))}
    </>
  )
}
