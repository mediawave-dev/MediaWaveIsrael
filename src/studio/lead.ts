// The lead carries the style the visitor chose: the WhatsApp message and the form both open with
// "אהבתי את הסגנון: <name>". [קופי: נתי]
import { getWhatsAppUrl } from '../utils/whatsapp'
import { track } from '../utils/analytics'
import type { StyleDef } from './registry'

export const styleLine = (s: StyleDef) => `אהבתי את הסגנון: ${s.name}, בהשראת ${s.credit}.`

export function waForStyle(s: StyleDef, extra = ''): string {
  const body = ['היי, הגעתי מסטודיו הסגנונות.', styleLine(s), extra.trim()].filter(Boolean).join('\n')
  return getWhatsAppUrl(body)
}

export interface LeadFields { name: string; phone: string; message: string }

/** The form's send: one WhatsApp message with the fields and the style (the site's honest fallback, no endpoint). */
export function sendLead(s: StyleDef, f: LeadFields): void {
  const lines = [
    f.name.trim() && `שם: ${f.name.trim()}`,
    f.phone.trim() && `טלפון: ${f.phone.trim()}`,
    f.message.trim(),
  ].filter(Boolean).join('\n')
  track('cta_click', { location: `styles_${s.id}_form` })
  window.open(waForStyle(s, lines), '_blank', 'noopener')
}
