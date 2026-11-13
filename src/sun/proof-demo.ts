// sun · the proof places, shown with placeholders (13.11.2026). Loaded only when the address carries
// ?proof=demo (a dynamic import in Proof.tsx), so none of these lines is in the page's own script.
// Every placeholder says what will stand in its place and is marked "דוגמה". No invented client, sentence,
// rating or count: a placeholder describes, it does not pretend.
import type { ClientVoice } from '../data/proof'

/** the word that marks every placeholder */
const TAG = 'דוגמה'

const who = 'שם פרטי ומה הוא עושה'
const when = 'חודש ושנה'
const base = { who, where: 'מאיפה המשפט', when, approved: true } as const

/** a screenshot that is not there yet: the frame is drawn at this shape and says what will stand in it */
const shot = { src: '', width: 720, height: 400, alt: 'כאן יעמוד צילום המסך של ההודעה עצמה, כמו שהיא נשלחה.' }

const voices: ClientVoice[] = [
  { ...base, id: 'demo-hero', place: 'hero', quote: 'כאן יעמוד משפט אחד שלקוח אמר, והחלק החזק שלו מודגש.', strong: 'והחלק החזק שלו מודגש.' },
  { ...base, id: 'demo-steps', place: 'steps', quote: 'כאן יעמוד משפט של לקוח על העבודה איתנו, למשל תוך כמה ימים הדף שלו עלה.', strong: 'תוך כמה ימים הדף שלו עלה.', shot },
  { ...base, id: 'demo-price', place: 'price', quote: 'כאן יעמוד משפט של לקוח על המחיר, למשל מה הדף החזיר לו.', strong: 'מה הדף החזיר לו.' },
  { ...base, id: 'demo-form', place: 'form', quote: 'כאן יעמוד משפט של לקוח על מה שהשתנה אצלו, למשל כמה פניות מגיעות מאז.', strong: 'כמה פניות מגיעות מאז.' },
]

export const DEMO = {
  tag: TAG,
  voices,
  /** the Google line beside the form: no number is made up, the line says what it will hold */
  google: { text: 'כאן תעמוד שורה אחת עם הדירוג שלנו בגוגל ומספר הביקורות.', link: 'קישור לפרופיל בגוגל', href: '#contact' },
  /** the line under "נעים מאוד" */
  signature: 'כאן תעמוד שורה אחת על מי שעונה לכם בוואטסאפ ובונה את הדף.',
}
export type ProofDemo = typeof DEMO
