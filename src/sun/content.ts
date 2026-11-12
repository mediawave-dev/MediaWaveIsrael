// sun · the statement site (D237-D240). Every line of the home page in one place.
// D240 (Nati, 12.11.2026): fewer words and fewer sections, no client names, no links to the sites, and the
// copy in the manner of noamavikasis.co.il: a direct promise, "nice to meet you" with the client's own
// problem, and four steps named by the craft (אפיון, כתיבה שיווקית, עיצוב, פיתוח). The manner is his; the
// words and every fact are ours (src/data/services.ts, src/data/faqs.ts, the Terms). Nothing of his proof
// (page counts, client revenue, testimonials) is borrowed: we have none of our own to state yet.
// Lines new in this round are marked [קופי: נתי] until Nati approves them.
import { getWhatsAppUrl } from '../utils/whatsapp'
import { SITE_CONTACT } from '../data/site'
import { faqs } from '../data/faqs'
import workJson from '../data/work.json'

export interface Project {
  slug: string
  /** for whoever maintains the list; the site never shows a client's name (D240) */
  name: string
  /** where the shots are taken from (scripts/capture-work.mjs); the site never links to it (D238) */
  url: string
  /** Where the project's main card is cut: CSS px from the top of the 390 px wide page (default 0, the hero).
      Chosen so the card says something: a headline and an action, or a heading and text (D244). */
  top?: number
  /** Further cards of the same page, as offsets like `top`. The wheel shows the first two
      (cards -card-s1 and -card-s2, made by scripts/capture-work.mjs). */
  scenes?: number[]
}
export const PROJECTS = workJson as Project[]

export const WA = {
  hero: getWhatsAppUrl('היי, אשמח לשמוע על דף נחיתה או אתר לעסק שלי.'),
}

export const NAV = [
  { href: '/#about', label: 'מי אנחנו' },
  { href: '/#offer', label: 'מה אנחנו בונים' },
  { href: '/#process', label: 'איך זה עובד' },
  { href: '/#faq', label: 'שאלות' },
  { href: '/#contact', label: 'צרו קשר' },
]

export const HERO = {
  // [קופי: נתי]
  // no-break space: "שמביא פניות" stays together, so "פניות" never sits alone on a line
  h1: ['דף נחיתה שמביא\u00A0פניות', 'לעסק, לקורס או לתוכנית הליווי שלכם.'],
  // [קופי: נתי]
  lede: 'אפיון, כתיבה שיווקית, עיצוב ופיתוח. הכול במקום אחד, מהשיחה הראשונה ועד שהדף באוויר.',
  cta: 'כתבו לנו בוואטסאפ',
  second: 'איך זה עובד',
  note: SITE_CONTACT.responseTime,
  sticker: ['דף נחיתה', 'באוויר תוך', '5 עד 7', 'ימי עבודה'],
}

export const ABOUT = {
  h2: 'נעים מאוד, |MediaWave',
  // [קופי: נתי] all four
  lines: [
    'אנחנו בונים ומעצבים דפי נחיתה, אתרי תדמית ואתרים לקורסים ולתוכניות ליווי, לבעלי עסקים בישראל.',
    'אנחנו פוגשים הרבה בעלי עסקים שיש להם מה להציע, והדף שלהם לא מסביר את זה. הגולש נכנס, לא מבין מה מציעים לו, ויוצא. הכסף על הפרסום יוצא, והפניות לא מגיעות.',
    'לכן כל דף אצלנו מתחיל בשאלה אחת: מה הגולש צריך להבין כדי לפנות אליכם? סביב התשובה נבנים הטקסט, העיצוב והכפתור.',
  ],
  close: 'דף אחד, מטרה אחת: שיפנו אליכם.',
}

export const OFFER = {
  h2: 'מה אנחנו |בונים?',
  kinds: [
    { tone: 'sun', name: 'דף נחיתה', line: 'להצעה אחת ולקמפיין שמביא אליה אנשים.' }, // [קופי: נתי]
    { tone: 'blue', name: 'אתר תדמית', line: 'למי שמחפשים אותו בגוגל, ורוצים לראות מי הוא לפני שמתקשרים.' }, // [קופי: נתי]
    { tone: 'coral', name: 'אתר לתוכנית ליווי', line: 'לקורס, לליווי או לסדנה, כשרוב המתעניינים מתלבטים.' }, // [קופי: נתי]
  ],
}

export const PROCESS = {
  h2: 'איך זה |הולך לעבוד?',
  // [קופי: נתי] all four; the facts are from services.ts and faqs.ts (two rounds of changes; writing is extra, faq-9); the time is said once, by the slip below
  steps: [
    { title: 'אפיון', line: 'מתחילים בשיחה. מבינים מה אתם מוכרים, למי, ומה עוצר היום את הלקוחות שלכם מלפנות.' },
    { title: 'כתיבה שיווקית', line: 'כותרת שאומרת מה מקבלים, ותשובות לשאלות שעולות לפני שפונים. עובדים עם הטקסט שלכם, או כותבים אותו יחד בתשלום נוסף.' },
    { title: 'עיצוב', line: 'מקבלים עיצוב מלא לאישור, לפני שבונים. עד שני סבבי תיקונים כלולים.' },
    { title: 'פיתוח', line: 'בונים דף שנפתח מהר בטלפון, ומחברים אותו לוואטסאפ, למודעות ולמדידה.' },
  ],
}

/** The date line under the steps. The dates are computed in the browser (Home.tsx, launchDates). [קופי: נתי] */
export const LAUNCH = {
  start: 'מתחילים ב',
  end: 'דף נחיתה רגיל באוויר עד',
  note: 'לפי 7 ימי עבודה, ראשון עד חמישי, מהיום שהחומרים אצלנו. חגים מזיזים את התאריך.',
}

const FAQ_IDS = ['faq-price', 'faq-8', 'faq-own', 'faq-9']
export const FAQ = {
  h2: 'שאלות |שחוזרות',
  items: FAQ_IDS.map((id) => faqs.find((f) => f._id === id)!).filter(Boolean),
}

export const CONTACT = {
  h2: 'גם אתם רוצים דף |שמביא פניות?', // [קופי: נתי]
  lede: 'השאירו פרטים, ונחזור אליכם תוך 24 שעות בימי עסקים.', // [קופי: נתי]
  submit: 'שליחה',
  submitWhatsApp: 'שליחה בוואטסאפ', // [קופי: נתי] the button says what it does: it opens WhatsApp with the message
  previewWhatsApp: 'ההודעה שתיפתח אצלכם בוואטסאפ:', // [קופי: נתי]
  previewSent: 'זה מה שיגיע אלינו:', // [קופי: נתי]
  viaWhatsApp: 'ההודעה מחכה לכם בוואטסאפ. נשאר רק לשלוח.',
  sent: 'קיבלנו. נחזור אליכם תוך 24 שעות בימי עסקים.',
  failed: 'השליחה לא הצליחה. אפשר לכתוב לנו בוואטסאפ או להתקשר.',
}

export const ALSO = [
  { href: '/services/landing-pages/', label: 'דפי נחיתה' },
  { href: '/services/building-websites/', label: 'אתרי תדמית' },
  { href: '/services/seo-promotion/', label: 'קידום בגוגל' },
  { href: '/services/chatbots/', label: 'צ׳אטבוט לעסק' },
  { href: '/services/video-editing/', label: 'עריכת וידאו והמרת קלטות' },
  { href: '/services/memory-videos/', label: 'סרטוני זיכרונות' },
]
