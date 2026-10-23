// The questions of "האתר שלכם ב-60 שניות" (D217): the trade, the name, what to build. One question a
// screen, one tap each (the name is the one line typed); the wall of styles is Wall.tsx. [קופי: נתי]
import { useEffect, useRef, type FormEvent, type PointerEvent as RPointerEvent, type ReactNode } from 'react'
import DotGlyph from '../look/sea/DotGlyph'
import { BUILDS, FIELDS, LINE_MAX, NAME_MAX, type BuildId, type FieldId } from '../data/site-in-60'
import { formatRange, PRICE_HONEST, PRICING } from '../data/pricing'
import { FIELD_GLYPHS } from './glyphs'
import { showPrices } from './message'

/** The site's key: [ the words ], the brackets spring apart and a cream plate fills between them in square
    steps from where the finger came in (the D202 language, in this page's own CSS). */
export function Key({ children, href, onClick, disabled, wa, type = 'button', className = '' }: {
  children: ReactNode
  href?: string
  onClick?: () => void
  disabled?: boolean
  wa?: boolean
  type?: 'button' | 'submit'
  className?: string
}) {
  const from = (e: RPointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--kx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`)
  }
  const inner = (
    <>
      <span className="s60-key__br" aria-hidden="true">[</span>
      <span className="s60-key__in">{wa && <DotGlyph name="wa" className="s60-key__wa" />}{children}</span>
      <span className="s60-key__br" aria-hidden="true">]</span>
    </>
  )
  if (href) {
    return <a className={`s60-key ${className}`.trim()} href={href} target="_blank" rel="noopener noreferrer" onPointerEnter={from} onPointerDown={from} onClick={onClick}>{inner}</a>
  }
  return <button type={type} className={`s60-key ${className}`.trim()} onPointerEnter={from} onPointerDown={from} onClick={onClick} disabled={disabled}>{inner}</button>
}

export function FieldStep({ value, onPick, headingRef }: { value: FieldId | null; onPick: (f: FieldId) => void; headingRef: React.RefObject<HTMLHeadingElement> }) {
  return (
    <section className="s60-step s60-field" aria-labelledby="s60-q1">
      <header className="s60-head">
        <p className="s60-tag" lang="en" dir="ltr">YOUR SITE IN 60 SECONDS</p>
        <h1 className="s60-h1">האתר שלכם ב-60 שניות</h1>
        <h2 id="s60-q1" className="s60-q" ref={headingRef} tabIndex={-1}>באיזה תחום העסק?</h2>
      </header>
      <ul className="s60-cards">
        {FIELDS.map((f, i) => (
          <li key={f.id} style={{ ['--i' as string]: i }}>
            <button
              type="button"
              className="s60-card"
              aria-pressed={value === f.id}
              onPointerDown={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                e.currentTarget.style.setProperty('--kx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`)
              }}
              onClick={() => onPick(f.id)}
            >
              <DotGlyph name={`s60-${f.glyph}`} n={15} sdf={FIELD_GLYPHS[f.glyph]} className="s60-card__g" />
              <span className="s60-card__t">{f.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function NameStep({ name, line, onName, onLine, onNext, headingRef }: {
  name: string
  line: string
  onName: (v: string) => void
  onLine: (v: string) => void
  onNext: () => void
  headingRef: React.RefObject<HTMLHeadingElement>
}) {
  const input = useRef<HTMLInputElement>(null)
  // the keyboard comes up with the question (not on a phone's first paint: the step's entrance is done)
  useEffect(() => {
    const id = window.setTimeout(() => input.current?.focus({ preventScroll: true }), 380)
    return () => clearTimeout(id)
  }, [])
  const ok = name.trim().length > 0
  const submit = (e: FormEvent) => { e.preventDefault(); if (ok) onNext() }
  return (
    <section className="s60-step s60-name" aria-labelledby="s60-q2">
      <header className="s60-head">
        <h2 id="s60-q2" className="s60-q" ref={headingRef} tabIndex={-1}>איך קוראים לעסק?</h2>
      </header>
      <form className="s60-form" onSubmit={submit} noValidate>
        <label className="s60-in s60-in--big">
          <span className="s60-in__l">שם העסק</span>
          <input
            ref={input}
            type="text"
            dir="auto"
            value={name}
            maxLength={NAME_MAX}
            autoComplete="organization"
            enterKeyHint="next"
            onChange={(e) => onName(e.target.value)}
          />
        </label>
        <label className="s60-in">
          <span className="s60-in__l">משפט אחד על העסק <span className="s60-in__opt">(לא חובה)</span></span>
          <input
            type="text"
            dir="auto"
            value={line}
            maxLength={LINE_MAX}
            enterKeyHint="go"
            onChange={(e) => onLine(e.target.value)}
          />
        </label>
        <div className="s60-actions">
          <Key type="submit" disabled={!ok}>להמשך</Key>
        </div>
        <p className="s60-fine">השם נשאר אצלכם במסך. שום דבר לא נשלח, עד שתבחרו לשלוח לנו בוואטסאפ.</p>
      </form>
    </section>
  )
}

export function BuildStep({ value, onPick, waHref, onSend, headingRef, summary }: {
  value: BuildId | null
  onPick: (b: BuildId) => void
  waHref: string | null
  onSend: () => void
  headingRef: React.RefObject<HTMLHeadingElement>
  summary: { name: string; field: string; style: string }
}) {
  const prices = showPrices()
  return (
    <section className="s60-step s60-build" aria-labelledby="s60-q4">
      <header className="s60-head">
        <h2 id="s60-q4" className="s60-q" ref={headingRef} tabIndex={-1}>מה בונים?</h2>
      </header>
      <div className="s60-opts" role="radiogroup" aria-labelledby="s60-q4">
        {BUILDS.map((b) => (
          <button
            key={b.id}
            type="button"
            role="radio"
            aria-checked={value === b.id}
            className="s60-opt"
            onPointerDown={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              e.currentTarget.style.setProperty('--kx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`)
            }}
            onClick={() => onPick(b.id)}
          >
            <span className="s60-opt__dot" aria-hidden="true" />
            <span className="s60-opt__name">{b.name}</span>
            <span className="s60-opt__line">{b.line}</span>
            {prices && (
              <span className="s60-opt__price" dir="ltr">
                {formatRange(PRICING.ranges[b.id])}
                {!PRICING.approved && <span className="s60-draft" lang="en"> DRAFT</span>}
              </span>
            )}
          </button>
        ))}
      </div>
      {!prices && <p className="s60-honest">{PRICE_HONEST.join(' ')}</p>}
      {prices && !PRICING.approved && <p className="s60-honest">מחירי טיוטה לבדיקה, עדיין לא מאושרים.</p>}
      <div className="s60-send" data-on={!!waHref || undefined}>
        <p className="s60-sum" aria-live="polite">
          {waHref ? <>{summary.name}, {summary.field}, בסגנון {summary.style}.</> : 'בוחרים אחד, וההודעה מוכנה.'}
        </p>
        {waHref
          ? <Key href={waHref} onClick={onSend} wa className="s60-key--wa">שלחו לנו בוואטסאפ</Key>
          : <Key disabled wa className="s60-key--wa">שלחו לנו בוואטסאפ</Key>}
        <p className="s60-fine">ההודעה נפתחת אצלכם כתובה, ונשלחת רק כשתלחצו.</p>
      </div>
    </section>
  )
}
