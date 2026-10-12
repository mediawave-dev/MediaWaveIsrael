// Three ideas from pattern-breaker's idea-bank.md, built on direction B for MediaWave.
// Dev-only. Every page defaults to the quiet "paper" palette; ?palette= switches it.
//   /board/i1  I-01 the page builds itself (replaces "how we work")
//   /board/i2  I-02 your name in the headline
//   /board/i3  I-03 the letter + I-04 the reply builder
// Every new Hebrew line here is [קופי: נתי].

import { useMemo, useState, type ReactNode } from 'react'
import { useScene, useMotionEngine } from '../motion/ScrollEngineProvider'
import { HERO, NAV, BoardNav, useDocBackground } from './shared'
import { StampButton } from './BoardB'
import { PALETTES, usePalette, PaletteSwitch } from './palette'
import './fonts.css'
import './board-b.css'
import './ideas.css'

const WA = 'https://wa.me/972528731808'
const wa = (text: string) => `${WA}?text=${encodeURIComponent(text)}`

/** Direction B's chrome around an idea, on the static field path (each section paints its own). */
function IdeaShell({ children }: { children: ReactNode }) {
  const palette = usePalette('paper')
  useDocBackground(PALETTES[palette].doc)
  return (
    <div className="bd-b i-page" dir="rtl" lang="he" data-field="saffron" data-palette={palette}>
      <header className="b-head">
        <a href="/board" className="b-head__logo" aria-label="MediaWave">
          <img className="b-logo-ink" src="/logo-lockup-ink.svg" alt="MediaWave" width="150" height="30" />
          <img className="b-logo-white" src="/logo-lockup-white.svg" alt="" aria-hidden="true" width="150" height="30" />
        </a>
        <nav className="b-head__nav" aria-label="ראשי">
          {NAV.map((n) => <a key={n} href="#main">{n}</a>)}
        </nav>
        <StampButton href="#main" size="sm">{HERO.headerCta}</StampButton>
      </header>
      <main id="main">{children}</main>
      <PaletteSwitch current={palette} />
      <BoardNav />
    </div>
  )
}

/* ───────────────────────── I-01 the page builds itself ───────────────────────── */

const STAGES = [
  { t: 'שלד', d: 'קודם מחליטים מה נמצא איפה. בלי צבע ובלי פונט, רק סדר.' },
  { t: 'טקסט', d: 'התוכן האמיתי נכנס: מה אתם עושים, בשביל מי, ומה עושים עכשיו.' },
  { t: 'עיצוב', d: 'פונט, צבעים וכפתורים שמתאימים רק לכם.' },
  { t: 'תמונות וסרטון', d: 'חומר אמיתי מהעסק שלכם, לא תמונות מאגר.' },
  { t: 'טלפון', d: 'רוב הפניות יגיעו מהנייד, אז גם הוא מקבל עיצוב משלו.' },
  { t: 'באוויר', d: 'האתר עולה, נטען מהר, ומוכן שימצאו אותו.' },
]
const FLAGS = ['text', 'brand', 'media', 'phone', 'live'] // stage n turns on FLAGS[0..n-1]

export function IdeaBuild() {
  const engine = useMotionEngine()
  const holdRef = useScene<HTMLDivElement>((e, root) => {
    if (e.REDUCE) return
    const stage = root.querySelector<HTMLElement>('.i1-stage')!
    const browser = root.querySelector<HTMLElement>('.i1-browser')!
    const now = root.querySelector<HTMLElement>('.i1-now')
    let last = -1
    const set = (n: number) => {
      if (n === last) return
      last = n
      stage.dataset.step = String(n)
      if (now) now.textContent = String(n + 1)
      FLAGS.forEach((f, i) => browser.toggleAttribute(`data-${f}`, i < n))
    }
    const tl = e.holdTimeline(root, {
      id: 'i1',
      scrub: e.CALM ? true : 0.4,
      onUpdate: (self) => set(Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length))),
    })
    tl.to({}, { duration: 1 })
    set(0)
  })

  // The markup is the last frame (everything on): no JS, reduced motion and crawlers see it whole
  const still = !engine || engine.REDUCE
  return (
    <IdeaShell>
      <section className="i-intro" data-field-section="saffron">
        <p className="i-tag">רעיון 1 מתוך בנק הרעיונות</p>
        <h1>ככה נבנה האתר שלכם</h1>
        <p>גוללים, והאתר נבנה מול העיניים: מהשלד ועד שהוא באוויר. זה גם בדיוק התהליך שעובר על האתר שלכם.</p>
      </section>

      <section className={`i1${still ? ' i1--still' : ''}`} data-field-section="magenta" aria-label="שלבי הבנייה">
        <div className="i1-hold" ref={holdRef}>
          <div className="i1-stage" data-step={STAGES.length - 1}>
            <div className="i1-copy">
              <p className="i1-count" dir="ltr"><span className="i1-now">{STAGES.length}</span>/{STAGES.length}</p>
              <div className="i1-titles">
                {STAGES.map((s, i) => (
                  <div className="i1-title" data-i={i} key={s.t}>
                    <h2>{s.t}</h2>
                    <p>{s.d}</p>
                  </div>
                ))}
              </div>
              <ol className="i1-list">
                {STAGES.map((s, i) => <li key={s.t} data-i={i}>{s.t}</li>)}
              </ol>
            </div>

            <div className="i1-view">
              <div className="i1-browser" data-text data-brand data-media data-phone data-live aria-hidden="true">
                <div className="i1-bar">
                  <span className="i1-dots"><i /><i /><i /></span>
                  <span className="i1-url" dir="ltr">mediawave.co.il</span>
                  <span className="i1-live"><i />באוויר</span>
                </div>
                <div className="i1-page">
                  <div className="i1-nav"><b className="i1-logo">MediaWave</b><span>שירותים</span><span>בלוג</span></div>
                  <div className="i1-hero">
                    <div className="i1-text">
                      <span className="i1-h">{HERO.line1}<br />{HERO.line2}</span>
                      <span className="i1-p">בונים לכם אתר שמביא פניות.</span>
                      <span className="i1-btn">בואו נדבר</span>
                    </div>
                    <div className="i1-media"><img src="/images/hero-poster.webp" alt="" /></div>
                  </div>
                  <div className="i1-row"><span /><span /><span /></div>
                </div>
              </div>
              <p className="i1-note">המחשה: האתר הזה עצמו, בכל שלב</p>
            </div>
          </div>
        </div>
      </section>

      <section className="i-outro" data-field-section="saffron">
        <h2>רוצים לראות את שלך בשלב הראשון?</h2>
        <StampButton href={wa('היי נתי, אשמח לשמוע איך בונים אתר לעסק שלי.')}>{HERO.cta}</StampButton>
      </section>
    </IdeaShell>
  )
}

/* ───────────────────────── I-02 your name in the headline ───────────────────────── */

const TYPES = [
  { id: 'food', label: 'מסעדה או בית קפה', line: 'התפריט, הזמנת שולחן ואיך מגיעים. בלי לחפש.', act: 'להזמין שולחן', tone: 'a' },
  { id: 'clinic', label: 'קליניקה', line: 'תורים אונליין ותשובות לשאלות שחוזרות על עצמן.', act: 'לקבוע תור', tone: 'b' },
  { id: 'shop', label: 'חנות', line: 'המוצרים שלכם, עם הזמנה ישירה בוואטסאפ.', act: 'להזמין עכשיו', tone: 'c' },
  { id: 'studio', label: 'סטודיו או חוג', line: 'מערכת שעות, מחירים והרשמה בלחיצה.', act: 'להירשם', tone: 'd' },
  { id: 'office', label: 'משרד ושירותים', line: 'מי אתם, מה אתם עושים, ואיך פונים אליכם.', act: 'לדבר איתנו', tone: 'e' },
] as const

export function IdeaName() {
  // ?name= pre-fills the field, so a link can show the idea with a real name in it
  const [name, setName] = useState(() => (new URLSearchParams(location.search).get('name') ?? '').slice(0, 28))
  const [type, setType] = useState<(typeof TYPES)[number]['id']>('food')
  const shown = name.trim() || 'העסק שלכם'
  const t = TYPES.find((x) => x.id === type)!
  return (
    <IdeaShell>
      <section className="i2" data-field-section="magenta">
        <p className="i-tag">רעיון 2 מתוך בנק הרעיונות</p>
        <div className="i2-line">
          <h1>האתר של</h1>
          <input
            className="i2-input"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 28))}
            placeholder="העסק שלכם"
            aria-label="שם העסק שלכם"
            size={Math.max(7, name.length + 1)}
            autoComplete="organization"
          />
        </div>
        <fieldset className="i2-types">
          <legend>איזה עסק?</legend>
          {TYPES.map((x) => (
            <label key={x.id} className="i-chip">
              <input type="radio" name="i2-type" value={x.id} checked={type === x.id} onChange={() => setType(x.id)} />
              <span>{x.label}</span>
            </label>
          ))}
        </fieldset>

        <div className="i2-preview" aria-live="polite">
          <div className="i2-browser" data-tone={t.tone}>
            <div className="i1-bar"><span className="i1-dots"><i /><i /><i /></span><span className="i1-url">האתר של {shown}</span></div>
            <div className="i2-site">
              <b className="i2-logo">{shown}</b>
              <span className="i2-big">{shown}</span>
              <span className="i2-sub">{t.line}</span>
              <span className="i2-act">{t.act}</span>
            </div>
          </div>
          <p className="i1-note">המחשה. שום דבר לא נשלח עד שלוחצים על הכפתור.</p>
        </div>

        <div className="i2-cta">
          <StampButton href={wa(`היי נתי, אשמח לשמוע על אתר עבור ${shown}.`)}>בואו נבנה את האתר של {shown}</StampButton>
        </div>
      </section>
    </IdeaShell>
  )
}

/* ───────────────────── I-03 the letter + I-04 the reply builder ───────────────────── */

const NEEDS = [
  { id: 'new', label: 'אתר חדש', phrase: 'אתר חדש' },
  { id: 'redo', label: 'לשדרג אתר קיים', phrase: 'שדרוג לאתר הקיים' },
  { id: 'landing', label: 'דף נחיתה', phrase: 'דף נחיתה' },
  { id: 'video', label: 'עריכת וידאו', phrase: 'עריכת וידאו' },
  { id: 'tapes', label: 'המרת קלטות', phrase: 'המרת קלטות' },
  { id: 'memories', label: 'סרטון זיכרונות', phrase: 'סרטון זיכרונות' },
]
const WHEN = [
  { id: 'now', label: 'כמה שיותר מהר', phrase: 'זה די דחוף.' },
  { id: 'month', label: 'בחודש הקרוב', phrase: 'מתכננים לחודש הקרוב.' },
  { id: 'look', label: 'רק בודקים', phrase: 'בינתיים רק בודקים.' },
]

/** "א", "א וב", "א, ב וג" with the Hebrew conjunction attached (no hyphen) */
function joinHe(items: string[]) {
  if (items.length <= 1) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')} ו${items[items.length - 1]}`
}

export function IdeaLetter() {
  const [needs, setNeeds] = useState<string[]>(['new'])
  const [when, setWhen] = useState('month')
  const message = useMemo(() => {
    const list = joinHe(NEEDS.filter((n) => needs.includes(n.id)).map((n) => n.phrase))
    const w = WHEN.find((x) => x.id === when)!.phrase
    return list ? `היי נתי, אשמח לעזרה עם ${list}. ${w}` : `היי נתי, אשמח להתייעץ. ${w}`
  }, [needs, when])
  const toggle = (id: string) => setNeeds((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]))

  return (
    <IdeaShell>
      <section className="i3-letter" data-field-section="magenta">
        <p className="i-tag">רעיון 3 מתוך בנק הרעיונות</p>
        <article className="i3-paper">
          <h1>שלום, אני נתי.</h1>
          <p>אני בונה את האתרים של MediaWave בעצמי, מהשורה הראשונה של הקוד ועד הרגע שהאתר עולה לאוויר. כשאתם פונים, אתם מדברים איתי, לא עם נציג ולא עם מתווך.</p>
          <p>חוץ מאתרים אני גם עורך וידאו, ממיר קלטות ישנות לקבצים, והופך תמונות מהאלבום לסרטון.</p>
          <p>אם יש לכם עסק שמגיע לו אתר טוב יותר, תכתבו לי למטה מה אתם צריכים. אני חוזר לכל פנייה בעצמי.</p>
          <footer className="i3-sign">
            <span className="i3-name">נתי</span>
            <span>MediaWave</span>
          </footer>
        </article>
      </section>

      <section className="i3-reply" data-field-section="saffron" aria-labelledby="i3-reply-h">
        <h2 id="i3-reply-h">התשובה שלכם</h2>
        <form className="i3-form" action={WA} method="get" target="_blank" onSubmit={(e) => { e.preventDefault(); window.open(wa(message), '_blank', 'noopener') }}>
          <fieldset>
            <legend>במה אפשר לעזור?</legend>
            {NEEDS.map((n) => (
              <label key={n.id} className="i-chip">
                <input type="checkbox" checked={needs.includes(n.id)} onChange={() => toggle(n.id)} />
                <span>{n.label}</span>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>מתי?</legend>
            {WHEN.map((w) => (
              <label key={w.id} className="i-chip">
                <input type="radio" name="i3-when" checked={when === w.id} onChange={() => setWhen(w.id)} />
                <span>{w.label}</span>
              </label>
            ))}
          </fieldset>
          <div className="i3-card">
            <span className="i3-card-label">ההודעה שתישלח</span>
            <output aria-live="polite">{message}</output>
            <input type="hidden" name="text" value={message} />
          </div>
          <div className="i3-send">
            <StampButton onClick={() => window.open(wa(message), '_blank', 'noopener')}>לשלוח בוואטסאפ</StampButton>
            <a className="i3-mail" href={`mailto:mediawaveisrael@gmail.com?body=${encodeURIComponent(message)}`}>או במייל</a>
          </div>
        </form>
      </section>
    </IdeaShell>
  )
}
