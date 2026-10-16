// shot · the new lines (SPEC section 2, storyboard "[לבירור] לנתי" 7). Approved copy is imported
// from its own file verbatim; only the lines the shot introduces live here, each one marked
// [קופי: נתי] until Nati approves it. Three new lines in all, no meta lines, no 'Lighthouse'.

/**
 * [קופי: נתי] S2, the receipt under 'אתר מהיר שלא נתקע'. Shown only after the shot build is
 * re-measured (lh3.sh median + rum.mjs, 390). Never ship the 13.10 KM number on this page.
 * While null the receipt is absent from the DOM.
 */
export const SPEED_PROOF: { score: number; date: string } | null = null

/** [קופי: נתי] S2, the receipt line (the number and the date render in an LTR island). */
export const speedLine = (p: { score: number; date: string }) => `האתר הזה בטלפון: ציון מהירות ${p.score}. נמדד בתאריך ${p.date}`

/**
 * [לבירור: נתי] S3, the order of the tool row: websites last, so its laptop opens right after it
 * (S4). The approved order is SERVICES.map(s => s.id) (websites first); switching back changes
 * nothing else.
 */
export const SERVICE_ORDER: readonly string[] = ['landing', 'seo', 'chatbots', 'video-editing', 'memory-videos', 'websites']

/** [קופי: נתי] S3, under the chat bubble: its button's visible text and accessible name. */
export const BOT_HINT = 'נסו את הבוט'

/** [קופי: נתי] S9, the address bar of the phone the site ends in (art, aria-hidden, LTR). */
export const PHONE_URL = 'mediawave.co.il'
