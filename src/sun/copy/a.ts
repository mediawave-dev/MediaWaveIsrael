// sun · the home page's words, version A: the facts first.
// One speaker, "אנחנו", with a subject in every sentence. Each block opens with its answer, and a number
// stands wherever the repo holds one (two rounds, 7 working days, two weeks for a page with special
// animations, 24 hours). A heading is a question only where a business owner asks it aloud.
// After a reader's marks (13.11.2026) the staged questions left: the heading is today's, the steps are a
// sequence again, and the written quote has its own step, where the extra cost of writing is said.
// Facts: src/sun/content.ts, src/data/services.ts, src/data/faqs.ts, the Terms. Nothing here is approved yet.
import type { CopyVersion } from './types'

const a: CopyVersion = {
  approach: 'עובדות קודם. כל חלק פותח בתשובה, ויש מספר בכל מקום שיש לנו מספר.',

  HERO: {
    // today's heading, which every reading kept; the line under it gains its subject
    h1: ['אנחנו בונים דפי\u00A0נחיתה.', 'כאלה שאנשים משאירים בהם פרטים.'],
    lede: 'אנחנו בונים גם אתרי תדמית, ואתרים לקורסים ולתוכניות ליווי.',
  },

  ABOUT: {
    h2: 'נעים מאוד, |MediaWave',
    // what we do first, then what it costs the owner when it is missing
    lines: [
      'אנחנו מתחילים כל דף בשאלה אחת. מה צריך להבין מי שנכנס אליו, כדי לפנות אליכם?',
      'סביב התשובה אנחנו בונים את הטקסט ואת העיצוב. כשהיא חסרה בדף, הכסף על הפרסום יוצא והפניות לא מגיעות.',
    ],
  },

  OFFER: {
    h2: 'מה מתאים |לעסק שלי?',
    // services.ts: the landing page's "מתי צריך דף נחיתה?", the image site's first answer, the programme site's subtitle
    kinds: [
      { tone: 'sun', name: 'דף נחיתה', line: 'יש לכם הצעה אחת, ואנשים מגיעים אליה ממודעה בגוגל או בפייסבוק.' },
      { tone: 'blue', name: 'אתר תדמית', line: 'מי שמחפש אתכם בגוגל רוצה לראות מי אתם לפני שהוא מתקשר.' },
      { tone: 'coral', name: 'אתר לתוכנית ליווי', line: 'אתם מוכרים קורס או ליווי, ומי שמתעניין מתלבט לפני שהוא נרשם.' },
    ],
  },

  PROCESS: {
    h2: 'איך זה |עובד?',
    steps: [
      { title: 'שיחה', line: 'אנחנו שואלים מה אתם מוכרים, ומה עוצר היום את הלקוחות שלכם מלפנות.' },
      // faq-price: a written quote after the call; faq-9 and the landing page's quote: writing together costs extra
      { title: 'הצעה בכתב', line: 'אתם מקבלים בכתב מה נבנה וכמה זה עולה. אם אין לכם טקסט, אנחנו כותבים אותו יחד איתכם בתשלום נוסף.' },
      // Terms 4.2: two rounds of changes
      { title: 'עיצוב', line: 'אתם רואים את הדף מעוצב לפני שאנחנו בונים אותו. שני סבבי תיקונים כלולים במחיר.' },
      { title: 'באוויר', line: 'אנחנו בודקים את הדף איתכם בטלפון, ומחברים אותו לוואטסאפ ולמודעות שלכם.' },
    ],
  },

  // the first line and the count name the same day, the one the materials are with us (short enough for one
  // line on a 360 px phone); the note also says what "רגיל" leaves out (services.ts, the landing page's time)
  LAUNCH: {
    start: 'החומרים אצלנו ב',
    end: 'דף נחיתה רגיל באוויר עד',
    note: 'אנחנו סופרים 7 ימי עבודה, ראשון עד חמישי, וחג באמצע מזיז את התאריך. דף עם אנימציות מיוחדות לוקח עד שבועיים.',
  },

  // the four about money, the yearly cost after the first year among them (the one shekel figure on the page)
  FAQ: { h2: 'שאלות |על כסף', ids: ['faq-price', 'faq-8', 'faq-host', 'faq-own'] },

  // what an owner wonders in front of a form; the written quote is faq-price
  CONTACT: {
    h2: 'מה קורה |אחרי השליחה?',
    lede: 'אנחנו חוזרים אליכם תוך 24\u00A0שעות בימי\u00A0עסקים. אחרי\u00A0השיחה אתם מקבלים הצעה בכתב.',
  },
}

export default a
