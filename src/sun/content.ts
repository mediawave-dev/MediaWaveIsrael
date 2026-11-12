// sun · the statement site (D237). Every line of the home page in one place.
// The speciality is stated first: landing pages, image sites and sites for mentoring programmes.
// Facts only, each traceable to src/data/services.ts, src/data/faqs.ts or the Terms; no invented proof.
// Lines that are new in this round are marked [קופי: נתי] until Nati approves them.
import { getWhatsAppUrl } from '../utils/whatsapp'
import { SITE_CONTACT } from '../data/site'
import { faqs } from '../data/faqs'
import workJson from '../data/work.json'

export interface Project {
  slug: string
  name: string
  url: string
  kind: string
  client: string
  goal: string
  /** false: the address no longer shows this version, so the row has no link */
  live: boolean
  /** 1: the wheel shows only the top of the page (default: the top and a part further down) */
  crops?: number
}
export const PROJECTS = workJson as Project[]

export const WA = {
  hero: getWhatsAppUrl('היי, אשמח לשמוע על דף נחיתה או אתר לעסק שלי.'),
  landing: getWhatsAppUrl('היי, אשמח לשמוע על דף נחיתה לעסק שלי.'),
  site: getWhatsAppUrl('היי, אשמח לשמוע על אתר תדמית לעסק שלי.'),
  program: getWhatsAppUrl('היי, אשמח לשמוע על אתר לתוכנית ליווי או לקורס.'),
}

export const NAV = [
  { href: '/#offer', label: 'מה אנחנו בונים' },
  { href: '/#work', label: 'עבודות' },
  { href: '/#anatomy', label: 'מה יש בדף' },
  { href: '/#process', label: 'איך זה עובד' },
  { href: '/#price', label: 'מחיר' },
  { href: '/#faq', label: 'שאלות' },
  { href: '/#contact', label: 'צרו קשר' },
]

export const HERO = {
  // [קופי: נתי]
  h1: ['דפי נחיתה ואתרים', 'שמביאים לכם פניות.'],
  // [קופי: נתי]
  lede: 'MediaWave בונה דפי נחיתה, אתרי תדמית ואתרים לתוכניות ליווי. כל דף נבנה סביב פעולה אחת: שמי שנכנס יכתוב לכם.',
  cta: 'כתבו לנו בוואטסאפ',
  second: 'לעבודות שלנו',
  note: SITE_CONTACT.responseTime,
  sticker: ['דף נחיתה', 'באוויר תוך', '5 עד 7', 'ימי עבודה'],
}

/** The numbers a written quote carries (services.ts: time, steps, features). */
export const FACTS = [
  { n: '5-7', unit: 'ימי עבודה', line: 'עד שדף נחיתה רגיל באוויר' },
  { n: '2-3', unit: 'שבועות', line: 'עד שאתר תדמית בסיסי באוויר' },
  { n: '2', unit: 'סבבי תיקונים', line: 'כלולים בעיצוב, לפני שבונים' },
  { n: '12', unit: 'חודשים', line: 'של אחסון ודומיין כלולים במחיר' },
]

export const OFFER = {
  h2: 'מה אתם צריכים?',
  cards: [
    {
      tone: 'sun',
      name: 'דף נחיתה',
      who: 'יש לכם הצעה אחת, וקמפיין שמביא אליה אנשים.', // [קופי: נתי]
      what: 'דף אחד עם מטרה אחת: שמי שנכנס יכתוב לכם בוואטסאפ.',
      points: ['כותרת שאומרת מה מקבלים ולמי זה מתאים', 'כפתור וואטסאפ עם הודעה מוכנה', 'מדידה של כמה פניות הגיעו מכל מודעה'],
      time: '5 עד 7 ימי עבודה',
      href: '/services/landing-pages/',
      more: 'עוד על דפי נחיתה',
      wa: WA.landing,
    },
    {
      tone: 'blue',
      name: 'אתר תדמית',
      who: 'מחפשים אתכם בגוגל, ורוצים לראות מי אתם לפני שמתקשרים.', // [קופי: נתי]
      what: 'כמה עמודים שמראים מה אתם עושים, למי, ואיך פונים אליכם.', // [קופי: נתי]
      points: ['עיצוב שנבנה בשביל העסק שלכם, בלי תבנית', 'בנוי כך שגוגל יכול למצוא אותו', 'מערכת פשוטה לעדכון טקסטים ותמונות'],
      time: '2 עד 3 שבועות',
      href: '/services/building-websites/',
      more: 'עוד על אתרי תדמית',
      wa: WA.site,
    },
    {
      tone: 'coral',
      name: 'אתר לתוכנית ליווי',
      who: 'אתם מוכרים ליווי, קורס או סדנה, ורוב המתעניינים מתלבטים.', // [קופי: נתי]
      what: 'עמוד שמציג את התוכנית, עונה על ההתלבטויות לפי הסדר, ומוביל לשיחת היכרות או להרשמה.', // [קופי: נתי]
      points: ['מה מקבלים בתוכנית, שלב אחרי שלב', 'תשובות לשאלות שחוזרות בשיחות המכירה שלכם', 'כפתור אחד שחוזר לאורך העמוד'], // [קופי: נתי]
      time: 'הזמן נקבע בהצעה, לפי אורך העמוד',
      href: '',
      more: '',
      wa: WA.program,
    },
  ],
}

export const WORK = {
  h2: 'אתרים שבנינו, ונמצאים באוויר', // [קופי: נתי]
  liveLabel: 'לאתר החי',
  // [קופי: נתי]
  next: { title: 'המקום הזה פנוי.', line: 'האתר הבא ברשימה יכול להיות שלכם.', cta: 'כתבו לנו בוואטסאפ' },
}

export const ANATOMY = {
  h2: 'מה יש בדף שמביא פניות?', // [קופי: נתי]
  lede: 'חמישה דברים שנמצאים בכל דף שאנחנו בונים. את כולם אפשר לבדוק בדף הזה עצמו.', // [קופי: נתי]
  items: [
    { name: 'כותרת שאומרת מה מקבלים', line: 'מי שנכנס מבין בשורה אחת מה מציעים לו, ולמי זה מתאים.' },
    { name: 'כפתור אחד', line: 'בכל הדף יש פעולה אחת, והיא חוזרת כל כמה גלילות. בדרך כלל זה וואטסאפ.' },
    { name: 'הוכחה', line: 'עבודות, מספרים והמלצות אמיתיות. את מה שעוד אין לכם, אנחנו לא ממציאים.' },
    { name: 'תשובות להתלבטויות', line: 'מחיר, זמן, ומה קורה אחרי ההשקה. הדף עונה לפני שהגולש עוזב.' },
    { name: 'טופס קצר', line: 'שם וטלפון. כל שדה נוסף הוא עוד סיבה לא למלא.' },
  ], // [קופי: נתי] all five
}

export const PROCESS = {
  h2: 'איך זה עובד?',
  steps: [
    { title: 'שיחה', line: 'מה ההצעה, למי היא מיועדת, ומאיפה יגיעו האנשים.' },
    { title: 'טקסט ועיצוב', line: 'כותבים יחד את הטקסט, ומקבלים עיצוב לאישור. עד שני סבבי תיקונים כלולים.' },
    { title: 'בנייה ובדיקה', line: 'מקבלים קישור, ובודקים יחד את הדף בטלפון ובמחשב.' },
    { title: 'באוויר', line: 'הדף עולה, ומחברים אותו למודעות ולמדידה. בחודש הראשון התמיכה עלינו.' },
  ],
}

export const PRICE = {
  h2: 'כמה זה עולה?',
  lede: 'מחיר מדויק מגיע בהצעה כתובה, אחרי שיחה קצרה. את אלה אפשר לדעת כבר עכשיו:', // [קופי: נתי]
  inTitle: 'בתוך המחיר',
  in: ['עיצוב, בנייה והדרכה', 'שנה ראשונה של אחסון ודומיין, עם גיבויים', 'חודש ראשון של תמיכה אחרי ההשקה', 'מע״מ'],
  outTitle: 'מחוץ למחיר',
  out: ['כתיבת תוכן מלאה וקידום חודשי בגוגל, בתשלום נפרד', 'אחסון מהשנה השנייה: 500 עד 800 ₪ לשנה', 'עבודה מעבר להצעה: 200 עד 300 ₪ לשעה'],
  pay: 'משלמים חצי כשמתחילים, ואת השאר לפני שהאתר עולה לאוויר.',
}

const FAQ_IDS = ['faq-3', 'faq-own', 'faq-4', 'faq-6', 'faq-9']
export const FAQ = {
  h2: 'שאלות שחוזרות',
  items: FAQ_IDS.map((id) => faqs.find((f) => f._id === id)!).filter(Boolean),
}

export const CONTACT = {
  h2: 'רוצים דף שמביא פניות?', // [קופי: נתי]
  lede: 'משאירים שם וטלפון, ואנחנו חוזרים אליכם תוך 24 שעות בימי עסקים.', // [קופי: נתי]
  needs: ['דף נחיתה', 'אתר תדמית', 'אתר לתוכנית ליווי או לקורס', 'עוד לא יודעים'],
  submit: 'שלחו לנו',
  viaWhatsApp: 'ההודעה מחכה לכם בוואטסאפ. נשאר רק לשלוח.',
  sent: 'קיבלנו. נחזור אליכם תוך 24 שעות בימי עסקים.',
  failed: 'השליחה לא הצליחה. אפשר לכתוב לנו בוואטסאפ או להתקשר.',
}

export const ALSO = [
  { href: '/services/seo-promotion/', label: 'קידום בגוגל' },
  { href: '/services/chatbots/', label: 'צ׳אטבוט לעסק' },
  { href: '/services/video-editing/', label: 'עריכת וידאו והמרת קלטות' },
  { href: '/portfolio/memory-videos/', label: 'סרטוני זיכרונות' },
]
