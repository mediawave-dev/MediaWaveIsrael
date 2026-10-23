// The one message the visitor sends (D217): everything they chose, already written, opened in WhatsApp.
// Nothing leaves the page before that tap. [קופי: נתי] the lines.
import { getWhatsAppUrl } from '../utils/whatsapp'
import { BUILDS, cleanText, fieldById, LINE_MAX, NAME_MAX, type BuildId, type FieldId } from '../data/site-in-60'
import { STYLE_META, type StyleId } from '../studio/styles-meta'
import { formatRange, PRICING } from '../data/pricing'

export interface Choice {
  field: FieldId
  name: string
  line: string
  style: StyleId
  build: BuildId
}

/** Prices show only once Nati approved them; ?draft=1 shows the placeholders, labelled, for review. */
export const showPrices = () => PRICING.approved || (typeof window !== 'undefined' && /[?&]draft=1(&|$)/.test(window.location.search))

export function messageFor(c: Choice): string {
  const field = fieldById(c.field)
  const style = STYLE_META.find((s) => s.id === c.style)
  const build = BUILDS.find((b) => b.id === c.build)
  const line = cleanText(c.line, LINE_MAX).trim()
  return [
    'היי, בניתי באתר שלכם את הפתיחה של האתר שלי.',
    `שם העסק: ${cleanText(c.name, NAME_MAX).trim()}`,
    field && `תחום: ${field.label}`,
    line && `על העסק: ${line}`,
    style && `סגנון: ${style.name}`,
    build && `מה בונים: ${build.name}`,
    PRICING.approved && `טווח המחיר שראיתי: ${formatRange(PRICING.ranges[c.build])}`,
    'אשמח להצעת מחיר.',
  ].filter(Boolean).join('\n')
}

export const waFor = (c: Choice) => getWhatsAppUrl(messageFor(c))
