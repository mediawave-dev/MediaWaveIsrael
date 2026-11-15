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
  // [קופי: נתי] D245: he found the earlier heading machine-like ("X שמביא Y", a list of three, "הכול במקום אחד").
  // Now it is what a person would say: who we are and what we do, then what kind, then what else and whose
  // work is on the wheel. A subject in every sentence, no list, no slogan.
  // no-break space: "דפי נחיתה" stays together, so "נחיתה." never sits alone on a line
  h1: ['אנחנו בונים דפי\u00A0נחיתה.', 'כאלה שאנשים משאירים בהם פרטים.'],
  // [קופי: נתי]
  lede: 'וגם אתרי תדמית, ואתרים לקורסים ולתוכניות ליווי.',
  cta: 'כתבו לנו בוואטסאפ',
  second: 'איך זה עובד',
  note: SITE_CONTACT.responseTime,
  sticker: ['דף נחיתה', 'באוויר תוך', '5 עד 7', 'ימי עבודה'],
}

// D254 (Nati's picks from the morning board, 13.11.2026): about B, what we build C plus his line, steps C,
// slip C, form B. Writing the text is inside a landing page's price (his answer), so step two says so.
export const ABOUT = {
  h2: 'נעים מאוד, |MediaWave',
  lines: [
    'כל דף אצלנו מתחיל בשאלה אחת. מה צריך להבין מי שנכנס אליו? סביב התשובה אנחנו בונים את הטקסט ואת העיצוב.',
  ],
  // Nati's own wording (D246). No colon anywhere in the copy: he reads them as a machine's habit.
  close: ['דף אחד, עם מטרה אחת בלבד.', 'שיפנו אליכם.'],
}

export const OFFER = {
  h2: 'מה |אתם צריכים?',
  kinds: [
    { tone: 'sun', name: 'דף נחיתה', line: 'אתם משלמים על מודעות, ומי שלוחץ עליהן צריך מקום אחד להשאיר בו פרטים.' },
    { tone: 'blue', name: 'אתר תדמית', line: 'לקוחות מחפשים אתכם בגוגל, ורוצים לראות מי אתם לפני שהם מרימים טלפון.' },
    { tone: 'coral', name: 'אתר לתוכנית ליווי', line: 'אתם מוכרים קורס או ליווי, ורוב המתעניינים עוד מתלבטים.' },
  ],
  // Nati's line (D254), said after the three situations it answers
  close: ['אתם יודעים מה אתם רוצים שיקרה.', 'אנחנו נעזור לזה לקרות.'],
}

export const PROCESS = {
  h2: 'איך זה |עובד?',
  steps: [
    { title: 'שיחה', line: 'אתם מספרים מה אתם מוכרים, ומה עוצר היום את הלקוחות שלכם מלפנות.' },
    { title: 'חומרים', line: 'אתם שולחים את הטקסט ואת התמונות שיש לכם. אין טקסט? אנחנו כותבים אותו יחד איתכם, וזה כלול במחיר.' },
    { title: 'עיצוב', line: 'לפני שאנחנו בונים, אתם רואים את הדף מעוצב ומאשרים אותו. שני סבבי תיקונים כלולים במחיר.' },
    { title: 'בנייה', line: 'אנחנו בונים דף שנפתח מהר בטלפון, ומחברים אותו לוואטסאפ ולמודעות שלכם.' },
  ],
}

/** The date line under the steps. The dates are computed in the browser each day (Home.tsx, launchDates). */
export const LAUNCH = {
  start: 'שלחתם חומרים ב',
  end: 'דף נחיתה רגיל באוויר עד',
  note: 'אנחנו סופרים 7 ימי עבודה, ראשון עד חמישי. חג באמצע מזיז את התאריך.',
}

const FAQ_IDS = ['faq-price', 'faq-8', 'faq-own', 'faq-9']
export const FAQ = {
  h2: 'שאלות |שחוזרות',
  items: FAQ_IDS.map((id) => faqs.find((f) => f._id === id)!).filter(Boolean),
}

export const CONTACT = {
  h2: 'השאירו |פרטים',
  lede: 'אנחנו חוזרים אליכם תוך 24 שעות בימי עסקים.',
  submit: 'שליחה',
  submitWhatsApp: 'שליחה בוואטסאפ', // [קופי: נתי] the button says what it does: it opens WhatsApp with the message
  viaWhatsApp: 'ההודעה מחכה לכם בוואטסאפ. נשאר רק לשלוח.',
  sent: 'קיבלנו. נחזור אליכם תוך 24 שעות בימי עסקים.',
  failed: 'השליחה לא הצליחה. אפשר לכתוב לנו בוואטסאפ או להתקשר.',
}

export const ALSO = [
  { href: '/services/landing-pages/', label: 'דפי נחיתה' },
  { href: '/services/building-websites/', label: 'אתרי תדמית' },
  { href: '/services/program-sites/', label: 'אתרים לקורסים ולתוכניות ליווי' },
  { href: '/services/seo-promotion/', label: 'קידום בגוגל' },
  { href: '/services/chatbots/', label: 'צ׳אטבוט לעסק' },
  { href: '/services/video-editing/', label: 'עריכת וידאו והמרת קלטות' },
  { href: '/services/memory-videos/', label: 'סרטוני זיכרונות' },
]
