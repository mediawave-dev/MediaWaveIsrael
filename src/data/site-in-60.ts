// "האתר שלכם ב-60 שניות" (D217): the trades a visitor picks from, and the opening their own site shows in
// every style of the studio. The lines say what such a site holds and what it asks the customer to do;
// no fact about the visitor's business is claimed (no years, clients, numbers or awards). The page says
// the copy is a sample. [קופי: נתי] every line in this file.

export type FieldId = 'food' | 'clinic' | 'pro' | 'shop' | 'realty' | 'trades' | 'creative' | 'other'

export interface Field {
  id: FieldId
  /** the card's label */
  label: string
  /** the dot glyph on the card (site60/glyphs.ts) */
  glyph: FieldId
  /** the opening of the visitor's site: a short line above the name, the line under it, the button */
  kicker: string
  sub: string
  cta: string
  /** a world's small label row (Buzz's label line), English micro labels */
  tags: string
}

export const FIELDS: Field[] = [
  { id: 'food', label: 'מסעדה או בית קפה', glyph: 'food', kicker: 'בואו לשבת אצלנו', sub: 'התפריט, שעות הפתיחה והזמנת מקום. הכל כאן.', cta: 'הזמינו מקום', tags: 'MENU · HOURS · BOOKING' },
  { id: 'clinic', label: 'קליניקה או מטפל', glyph: 'clinic', kicker: 'נעים להכיר', sub: 'על הטיפול, למי הוא מתאים, ואיך קובעים פגישה ראשונה.', cta: 'קבעו פגישה', tags: 'ABOUT · CARE · BOOKING' },
  { id: 'pro', label: 'עורך דין או רואה חשבון', glyph: 'pro', kicker: 'תשובה ברורה לכל שאלה', sub: 'תחומי ההתמחות, איך עובדים יחד, ואיך פונים לפגישה.', cta: 'קבעו פגישת ייעוץ', tags: 'PRACTICE · ABOUT · CONTACT' },
  { id: 'shop', label: 'חנות ומוצרים', glyph: 'shop', kicker: 'כל המוצרים במקום אחד', sub: 'רואים את המוצרים, שואלים שאלה, ומזמינים בהודעה.', cta: 'לכל המוצרים', tags: 'SHOP · NEW · DELIVERY' },
  { id: 'realty', label: 'נדל"ן', glyph: 'realty', kicker: 'נכסים למכירה ולהשכרה', sub: 'הנכסים, האזורים, ושיחה קצרה כשמשהו מתאים.', cta: 'לכל הנכסים', tags: 'LISTINGS · AREAS · CONTACT' },
  { id: 'trades', label: 'בעל מקצוע ושירותים', glyph: 'trades', kicker: 'מה צריך לתקן?', sub: 'השירותים, האזורים ותמונות מעבודות. שולחים הודעה ומקבלים תשובה.', cta: 'שלחו הודעה', tags: 'SERVICES · AREAS · PHOTOS' },
  { id: 'creative', label: 'סטודיו או יוצר', glyph: 'creative', kicker: 'העבודות, מקרוב', sub: 'העבודות, הסיפור שמאחוריהן, ודרך פשוטה להזמין.', cta: 'לעבודות', tags: 'WORK · ABOUT · CONTACT' },
  { id: 'other', label: 'משהו אחר', glyph: 'other', kicker: 'ברוכים הבאים', sub: 'מה אנחנו עושים, למי זה מתאים, ואיך מתחילים.', cta: 'דברו איתנו', tags: 'ABOUT · SERVICES · CONTACT' },
]

export const fieldById = (id: string | null | undefined): Field | undefined => FIELDS.find((f) => f.id === id)

/** What to build: the two answers to the last question. */
export type BuildId = 'landing' | 'site'
export const BUILDS: { id: BuildId; name: string; line: string }[] = [
  { id: 'landing', name: 'דף נחיתה', line: 'עמוד אחד עם מטרה אחת: שיפנו אליכם.' },
  { id: 'site', name: 'אתר מלא', line: 'כמה עמודים: השירותים, עליכם, שאלות ודרך ליצור קשר.' },
]

/** The visitor's own words, made safe to show and to send: no control or direction characters, no tags'
    angle brackets, one line, a sane length. React prints it as text, so this is about layout and the
    message, not escaping. */
export function cleanText(raw: string, max: number): string {
  return raw
    // control characters and the bidi overrides / isolates that could flip the page's text around them
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f-\u009f‎‏‪-‮⁦-⁩]/g, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trimStart()
    .slice(0, max)
}

export const NAME_MAX = 40
export const LINE_MAX = 90
