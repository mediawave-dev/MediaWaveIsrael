// The blog's text helpers (D218): the approved prices in a post, and plain text for the JSON-LD.
import { inline, type Block } from './markdown'
import { PRICING, formatRange } from '../data/pricing'

/** {site} and {landing} in a price block become the approved ranges */
export const priced = (s: string) => s
  .replace(/\{site\}/g, formatRange(PRICING.ranges.site))
  .replace(/\{landing\}/g, formatRange(PRICING.ranges.landing))

/** The questions a post answers, for its FAQPage JSON-LD (only when it really has some). */
export function faqOf(blocks: Block[]): { q: string; a: string }[] {
  return blocks.flatMap((b) => (b.type === 'faq' ? b.items : b.type === 'price' ? faqOf(PRICING.approved ? b.approved : b.pending) : []))
}

/** a link a post may carry: the site's own paths and anchors, web pages, mail and phone (never javascript:) */
export const safeHref = (href: string) => /^(\/|#|https?:\/\/|mailto:|tel:)/i.test(href)

/** JSON-LD for a <script> tag: "<" escaped, so no text inside it can close the tag */
export const ld = (o: unknown) => JSON.stringify(o).replace(/</g, String.fromCharCode(92) + 'u003c')

/** Plain text of a run string (for JSON-LD answers: no markup) */
export const plain = (s: string) => inline(priced(s)).map((r) => r.v).join('')
