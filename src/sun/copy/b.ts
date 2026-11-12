// sun · the home page's words, version B: the least a page can say.
// About 150 words where today's page has about 240. Short sentences, each with its subject, plain
// names for the steps, three questions instead of four. Whatever the wheel, the sticker and the slip already
// show is not said.
// After a reader's marks (13.11.2026): the heading is today's and the line under it is gone (the three kinds
// two screens down say the rest), and the three kinds are whole sentences again.
// Facts: src/sun/content.ts, src/data/services.ts, src/data/faqs.ts, the Terms. Nothing here is approved yet.
import type { CopyVersion } from './types'

const b: CopyVersion = {
  approach: 'הכי מעט מילים. משפטים קצרים, ומה שכבר רואים בדף לא נאמר שוב.',

  HERO: {
    h1: ['אנחנו בונים דפי\u00A0נחיתה.', 'כאלה שאנשים משאירים בהם פרטים.'],
    // no line under the heading: the wheel comes straight after it (Home.tsx still renders an empty paragraph)
    lede: '',
  },

  ABOUT: {
    h2: 'נעים מאוד, |MediaWave',
    // the hero has said who we are and what we build; this keeps only the question every page starts with
    lines: [
      'כל דף אצלנו מתחיל בשאלה אחת. מה צריך להבין מי שנכנס אליו? סביב התשובה אנחנו בונים את הטקסט ואת העיצוב.',
    ],
  },

  OFFER: {
    h2: 'דף |או אתר?',
    kinds: [
      { tone: 'sun', name: 'דף נחיתה', line: 'אתם מפרסמים הצעה אחת.' },
      { tone: 'blue', name: 'אתר תדמית', line: 'לקוחות מחפשים אתכם בגוגל.' },
      { tone: 'coral', name: 'אתר לתוכנית ליווי', line: 'אתם מוכרים קורס או ליווי.' },
    ],
  },

  PROCESS: {
    h2: 'איך זה |עובד?',
    // the names are the ones a business owner uses (services.ts, the landing page's own steps)
    steps: [
      { title: 'שיחה', line: 'אתם מספרים מה אתם מוכרים, ומה עוצר את הלקוחות שלכם מלפנות.' },
      { title: 'טקסט', line: 'אנחנו עובדים עם הטקסט שלכם. כתיבה יחד היא בתשלום נוסף.' },
      { title: 'עיצוב', line: 'אתם מאשרים אותו לפני הבנייה. שני סבבי תיקונים כלולים.' },
      { title: 'באוויר', line: 'הדף מחובר לוואטסאפ ולמודעות שלכם.' },
    ],
  },

  // the first line and the count name the same day, the one the materials arrive
  LAUNCH: {
    start: 'החומרים אצלנו ב',
    end: 'דף נחיתה רגיל באוויר עד',
    note: 'אנחנו סופרים 7 ימי עבודה. חג מזיז את התאריך.',
  },

  FAQ: { h2: 'שאלות |שחוזרות', ids: ['faq-price', 'faq-8', 'faq-own'] },

  CONTACT: {
    h2: 'השאירו |פרטים',
    lede: 'אנחנו חוזרים אליכם תוך 24\u00A0שעות בימי עסקים.',
  },
}

export default b
