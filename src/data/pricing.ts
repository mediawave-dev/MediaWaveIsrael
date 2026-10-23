// The price ranges "האתר שלכם ב-60 שניות" shows (D217). [מחיר: נתי] Every number here is a placeholder:
// the site has never published a price (the FAQ and the Terms say a written quote follows a short call).
// Until Nati sets the numbers and turns `approved` on, the public page shows no number at all, only the
// honest lines from the Terms; ?draft=1 shows these placeholders, clearly labelled as a draft for review.
import type { BuildId } from './site-in-60'

export interface PriceRange { from: number; to: number }

export const PRICING: { approved: boolean; ranges: Record<BuildId, PriceRange> } = {
  approved: false,
  ranges: {
    landing: { from: 2500, to: 4500 }, // [מחיר: נתי]
    site: { from: 6000, to: 12000 }, // [מחיר: נתי]
  },
}

/** "2,500 - 4,500 ₪", the plain hyphen only (the site's rule). */
export const formatRange = (r: PriceRange) => `${r.from.toLocaleString('en-US')} - ${r.to.toLocaleString('en-US')} ₪`

/** The honest lines shown in place of a number while no price is approved (Terms 3.1, 3.2, 8.1). */
export const PRICE_HONEST = [
  'המחיר מגיע בהצעה כתובה, אחרי שיחה קצרה.',
  'המחיר כולל מע״מ, ושנה ראשונה של אחסון ודומיין.',
]
