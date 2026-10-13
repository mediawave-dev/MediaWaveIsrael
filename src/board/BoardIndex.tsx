// /board index: the three directions side by side, with the decisions behind each.

import { Link } from 'react-router-dom'
import { useDocBackground } from './shared'
import './fonts.css'

interface Direction {
  key: 'a' | 'b' | 'c'
  name: string
  concept: string
  moment: string
  button: string
  face: { family: string; style: React.CSSProperties; name: string }
  palette: { hex: string; role: string }[]
  reflex: string
}

const DIRECTIONS: Direction[] = [
  {
    key: 'a',
    name: 'חדר העריכה',
    concept: 'האתר מתנהג כמו ציר עריכה: סרגל זמן עם סמן ניגון עוקב אחרי הגלילה, הסרטון מוקרן במוניטור, וכל אזור הוא קליפ.',
    moment: 'בשירותים המסך נעצר, הסמן עובר על שישה קליפים והמוניטור חותך ביניהם.',
    button: 'חיתוך: בריחוף סמן ניגון אדום עוקב אחרי העכבר, ובלחיצה הכפתור נחתך לשניים במקום הסמן.',
    face: { family: 'MW Slate', style: { fontStretch: '62.5%', fontWeight: 900 }, name: 'Noto Sans Hebrew, צר במיוחד ושחור' },
    palette: [
      { hex: '#18191B', role: 'רקע: גרפיט של תוכנת עריכה' },
      { hex: '#EDE9E2', role: 'טקסט ומסכים בהירים' },
      { hex: '#F0453A', role: 'נורת ההקלטה: סמן, REC, פוקוס' },
    ],
    reflex: 'כהה עם צבע אות אחד הוא ברירת מחדל מוכרת. כאן הסיבה היא החומר עצמו: ממשק עריכה ונורת REC.',
  },
  {
    key: 'b',
    name: 'פוסטר עברי',
    concept: 'טיפוגרפיה כתמונה: מילים עבריות ענקיות ממלאות את הרוחב, וכל מערכה היא שדה צבע שטוח, במסורת הפוסטר הישראלי.',
    moment: 'בכל גבול בין מערכות, שדה הצבע הבא מודבק על כל המסך מצד ימין, כמו פוסטר חדש על הישן.',
    button: 'חותמת: בלוק דיו מלא. בריחוף הצבע הבא מציף מהצד שממנו נכנס העכבר, ובלחיצה הבלוק נלחץ לתוך הנייר.',
    face: { family: 'MW Poster', style: { fontWeight: 700 }, name: 'Karantina Bold (הבחירה שלך לפוסטר)' },
    palette: [
      { hex: '#F5B700', role: 'שדה זעפרן' },
      { hex: '#D11F65', role: 'שדה מג׳נטה, והדפס הסרטון' },
      { hex: '#0A6B4A', role: 'שדה ירוק בקבוק' },
      { hex: '#141414', role: 'דיו' },
    ],
    reflex: 'קרנטינה מופיעה ברשימת פונטי הרפלקס. כאן היא נשארת כי זו הבחירה שלך לכותרות על פסי צבע.',
  },
  {
    key: 'c',
    name: 'גלריה',
    concept: 'קירות לבנים ומרווחים נדיבים. הסרטון תלוי כיצירה ממוסגרת עם שלט מוזיאון, והלוטים הם העבודות.',
    moment: 'בשירותים עוברים מהחדר הלבן לחדר האדום והולכים לאורך קיר של שש יצירות מוארות.',
    button: 'לוחית: מסגרת דקה. בריחוף המילוי נכנס מצד הקריאה, ובלחיצה הלוחית מתיישבת.',
    face: { family: 'MW Gallery', style: { fontWeight: 400 }, name: 'Bona Nova' },
    palette: [
      { hex: '#F4F5F2', role: 'קיר לבן ניטרלי (לא קרם)' },
      { hex: '#1B1A19', role: 'טקסט ומסגרות' },
      { hex: '#7B1E2C', role: 'אדום סלון: כפתורים וחדר השירותים' },
    ],
    reflex: 'סריף עם צבע עמוק אחד קרוב ל"יוקרה". הסיבה כאן: קירות הסלון האדומים של מוזיאונים קלאסיים.',
  },
]

export default function BoardIndex() {
  useDocBackground('#ECECE8')
  return (
    <div dir="rtl" lang="he" style={{ minHeight: '100vh', background: '#ECECE8', color: '#161616', fontFamily: 'Heebo, sans-serif', padding: 'clamp(20px, 4vw, 56px)' }}>
      <header style={{ maxWidth: 1400, margin: '0 auto 36px' }}>
        <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800 }}>לוח סגנון: שלושה כיוונים</h1>
        <p style={{ margin: 0, maxWidth: '70ch', lineHeight: 1.7, color: '#4a4a4a' }}>
          כל כיוון בנוי על ההירו האמיתי עם הסרטון, הכפתור בכל המצבים, ורצועת השירותים עם הלוטים האמיתיים.
          אפשר לערבב. טקסט חדש מסומן לאישורך. <Link to="/" style={{ color: '#161616', fontWeight: 700 }}>האתר הנוכחי להשוואה</Link>.
        </p>
        <p style={{ margin: '10px 0 0', fontSize: 14, color: '#4a4a4a' }}>
          הסרטון בהירו לא רץ כשבווינדוס מכובות האנימציות (כמו אצלך). כדי לראות אותו רץ, להוסיף ‎?motion=full לכתובת.
        </p>
      </header>
      <ul style={{ listStyle: 'none', margin: '0 auto', padding: 0, maxWidth: 1400, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {DIRECTIONS.map((d) => (
          <li key={d.key} style={{ background: '#fff', borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span dir="ltr" style={{ fontWeight: 800, fontSize: 15, color: '#666' }}>{d.key.toUpperCase()}</span>
              <h2 style={{ margin: 0, fontFamily: `'${d.face.family}', Heebo, sans-serif`, fontSize: '3.2rem', lineHeight: 1, ...d.face.style }}>{d.name}</h2>
            </div>
            <div style={{ display: 'flex', height: 44, borderRadius: 4, overflow: 'hidden', border: '1px solid #ddd' }}>
              {d.palette.map((p) => <span key={p.hex} title={p.hex} style={{ flex: 1, background: p.hex }} />)}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 13.5, lineHeight: 1.6, color: '#444' }}>
              {d.palette.map((p) => <li key={p.hex}><span dir="ltr" style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: '#161616' }}>{p.hex}</span> {p.role}</li>)}
            </ul>
            <dl style={{ margin: 0, display: 'grid', gap: 12, lineHeight: 1.65, fontSize: 15 }}>
              <div><dt style={{ fontWeight: 800 }}>הרעיון</dt><dd style={{ margin: 0 }}>{d.concept}</dd></div>
              <div><dt style={{ fontWeight: 800 }}>רגע הגלילה</dt><dd style={{ margin: 0 }}>{d.moment}</dd></div>
              <div><dt style={{ fontWeight: 800 }}>הכפתור</dt><dd style={{ margin: 0 }}>{d.button}</dd></div>
              <div><dt style={{ fontWeight: 800 }}>הפונט</dt><dd style={{ margin: 0 }}>{d.face.name}</dd></div>
              <div><dt style={{ fontWeight: 800 }}>בדיקת רפלקס</dt><dd style={{ margin: 0, color: '#555' }}>{d.reflex}</dd></div>
            </dl>
            <Link to={`/board/${d.key}`} style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '12px 20px', background: '#161616', color: '#fff', borderRadius: 4, fontWeight: 700, textDecoration: 'none' }}>
              לפתוח את כיוון {d.key.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
      <section style={{ maxWidth: 1400, margin: '40px auto 0' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '1.6rem', fontWeight: 800 }}>סבב שני: עשרה עולמות מבנק הכיוונים</h2>
        <p style={{ margin: '0 0 16px', color: '#4a4a4a', lineHeight: 1.7 }}>עשרה כיוונים מתוך 20 שנאספו מאתרים מיוחדים בעולם (pattern-breaker, direction-bank.md). אין שניים עם אותה משפחת צבעים, אותו פונט, אותה גלילה או אותו כפתור. בכל אחד: ההירו עם הסרטון, השירותים עם הלוטים, והכפתור בכל המצבים.</p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {[
            { to: '/board/d', k: 'D', t: 'המקלט', f: "'MW Dial', serif", s: { fontStretch: '75%', fontWeight: 600 }, sw: ['#241912', '#EADFC5', '#E0482F', '#79E07A'], d: 'מקלט רדיו משנות השישים. הגלילה מסובבת את החוגה: בין תחנות רעש, ועל תחנה העין הירוקה נסגרת. השראה: Radio Garden.' },
            { to: '/board/e', k: 'E', t: 'יום ולילה', f: "'MW Daylight', serif", s: { fontWeight: 400 }, sw: ['#EADBD0', '#F5F4EF', '#ECBE8C', '#4B3346', '#121620'], d: 'האתר מואר לפי שעת היום והגלילה מזיזה את השמש. בשירותים אור מהחלון עובר על הקיר. השראה: Daylight Computer.' },
            { to: '/board/f', k: 'F', t: 'שרטוט מפורק', f: "'MW Draft', sans-serif", s: { fontWeight: 700 }, sw: ['#F2F2EE', '#1E1F22', '#55575C', '#C8361F'], d: 'גיליון שרטוט טכני. בשירותים האתר מתפרק לשש שכבות איזומטריות ומתחבר בחזרה. השראה: Isoduct.' },
            { to: '/board/g', k: 'G', t: 'כוכב קטן', f: "'MW Planet', sans-serif", s: { fontWeight: 400 }, sw: ['#1F1530', '#B9D36B', '#FFD36E', '#F3EEDF'], d: 'כוכב פיסטוק בחלל סגול. הגלילה מסובבת את הכוכב, ושישה בניינים עולים לראשו בתורם. השראה: Messenger.' },
            { to: '/board/h', k: 'H', t: 'קומיקס', f: "'MW Comic', sans-serif", s: { fontWeight: 800 }, sw: ['#FFFFFF', '#111111', '#FFDD33'], d: 'חוברת קומיקס מצילומים אמיתיים של הסטודיו. העמוד מתמלא ריבוע אחרי ריבוע. השראה: Ponpon Mania.' },
            { to: '/board/i', k: 'I', t: 'האלבום', f: "'MW Album', serif", s: { fontWeight: 700 }, sw: ['#1E2B24', '#1A1917', '#EDE6D6', '#F1ECE2'], d: 'אלבום משפחתי פתוח. הגלילה מדפדפת, ותמונה שמחזיקים מתעוררת לווידאו האמיתי. השראה: David Whyte Experience.' },
            { to: '/board/j', k: 'J', t: 'הרחוב', f: "'MW Sign', serif", s: { fontWeight: 400 }, sw: ['#EFE3C2', '#E9E3D7', '#B8322A', '#2F6B45', '#3B3A38'], d: 'רחוב קניות ביום חמסין. ההירו הוא החנות שלנו, ובשירותים הולכים לאורך שש חנויות. השראה: Bruno Simon.' },
            { to: '/board/k', k: 'K', t: 'ההשקה', f: "'MW Keynote', sans-serif", s: { fontWeight: 200 }, sw: ['#000000', '#F5F5F7', '#A1A1A6'], d: 'במה של כנס השקה. מחשב נייד נפתח ומסתובב, ועל המסך מוכרז כל שירות. השראה: Oryzo AI.' },
            { to: '/board/l', k: 'L', t: 'בית הבובות', f: "'MW House', serif", s: { fontWeight: 700 }, sw: ['#E4E1DA', '#8F8B84', '#EAD9B8', '#2F2C3A', '#E6D3D9'], d: 'הסטודיו כבית חתוך לרוחבו. המצלמה נכנסת לחדר אחרי חדר. השראה: Hotel 1 Place Vendôme.' },
            { to: '/board/m', k: 'M', t: 'עצמים מרחפים', f: "'MW Void', sans-serif", s: { fontWeight: 700 }, sw: ['#E6E1F2', '#2B2833', '#FFFFFF'], d: 'כלים מרחפים בחלל לבנדר. טסים לתוך כל אחד, ובתוכו השירות. השראה: Igloo Inc.' },
          ].map((x) => (
            <li key={x.to} style={{ background: '#fff', borderRadius: 8, padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span dir="ltr" style={{ fontWeight: 800, fontSize: 15, color: '#666' }}>{x.k}</span>
                <h3 style={{ margin: 0, fontFamily: x.f, fontSize: '2.8rem', lineHeight: 1, ...(x.s as React.CSSProperties) }}>{x.t}</h3>
              </div>
              <div style={{ display: 'flex', height: 34, borderRadius: 4, overflow: 'hidden', border: '1px solid #ddd' }}>
                {x.sw.map((c) => <span key={c} title={c} style={{ flex: 1, background: c }} />)}
              </div>
              <p style={{ margin: 0, lineHeight: 1.65 }}>{x.d}</p>
              <Link to={x.to} style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '10px 18px', background: '#161616', color: '#fff', borderRadius: 4, fontWeight: 700, textDecoration: 'none' }}>לפתוח את כיוון {x.k}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section style={{ maxWidth: 1400, margin: '40px auto 0' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '1.6rem', fontWeight: 800 }}>שלושה רעיונות מבנק הרעיונות, על כיוון B</h2>
        <p style={{ margin: '0 0 16px', color: '#4a4a4a', lineHeight: 1.7 }}>כל רעיון הוא עמוד שלם לדוגמה. ברירת המחדל היא הפלטה השקטה "נייר ודיו", ואפשר להחליף בכפתורים למטה.</p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {[
            { to: '/board/i1', t: 'האתר נבנה מול העיניים', d: 'גוללים והאתר נבנה: שלד, טקסט, עיצוב, תמונות, טלפון, באוויר. מחליף את "איך זה עובד".' },
            { to: '/board/i2', t: 'השם שלכם בכותרת', d: 'הגולש כותב את שם העסק שלו, והכותרת ואתר לדוגמה מתעדכנים מולו. הכפתור שולח את השם לוואטסאפ.' },
            { to: '/board/i3', t: 'מכתב ותשובה', d: 'דף הבית נפתח במכתב חתום ממך. בסופו הגולש מרכיב תשובה בלחיצות, והיא נשלחת בוואטסאפ כמו שהיא.' },
          ].map((x) => (
            <li key={x.to} style={{ background: '#fff', borderRadius: 8, padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h3 style={{ margin: 0, fontFamily: "'MW Poster', Heebo, sans-serif", fontWeight: 700, fontSize: '2.4rem', lineHeight: 1 }}>{x.t}</h3>
              <p style={{ margin: 0, lineHeight: 1.65 }}>{x.d}</p>
              <Link to={x.to} style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '10px 18px', background: '#161616', color: '#fff', borderRadius: 4, fontWeight: 700, textDecoration: 'none' }}>לפתוח</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
