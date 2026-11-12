// sun · the home page's words, version C: the business owner first.
// Each block opens with what happens on the owner's side (the manner of noamavikasis.co.il, none of his
// sentences and none of his proof) and only then says what we do. One person runs through it: whoever clicked
// the ad, enters the page, reads the heading and decides.
// After a reader's marks (13.11.2026): the heading no longer compliments the owner and it names the trade,
// the unmeasured "שתי שורות" became "את הכותרת", the steps carry plain names and whole sentences, and the form
// no longer asks a question it has no field for.
// Facts: src/sun/content.ts, src/data/services.ts, src/data/faqs.ts, the Terms. Nothing here is approved yet.
import type { CopyVersion } from './types'

const c: CopyVersion = {
  approach: 'בעל העסק קודם. כל חלק פותח במה שקורה אצלו, ורק אחר כך אומר מה אנחנו עושים.',

  HERO: {
    // no-break space: "דף הנחיתה" stays together
    h1: ['מישהו לחץ על המודעה שלכם.', 'אנחנו בונים את דף\u00A0הנחיתה שהוא מגיע אליו.'],
    lede: 'אנחנו בונים גם אתרים לעסקים ולקורסים.',
  },

  ABOUT: {
    h2: 'נעים מאוד, |MediaWave',
    // the question ends where Nati's closing line ("שיפנו אליכם") answers it
    lines: [
      'בטלפון אתם מסבירים את העסק שלכם בעצמכם. בדף, מי שנכנס קורא את הכותרת ומחליט אם להישאר.',
      'כשהכותרת לא ברורה, הכסף על הפרסום יוצא והפניות לא מגיעות.',
      'לכן אנחנו מתחילים כל דף באותה שאלה. מה צריך להבין מי שנכנס?',
    ],
  },

  OFFER: {
    h2: 'מה |אתם צריכים?',
    kinds: [
      { tone: 'sun', name: 'דף נחיתה', line: 'אתם משלמים על מודעות, ומי שלוחץ עליהן צריך מקום אחד להשאיר בו פרטים.' },
      { tone: 'blue', name: 'אתר תדמית', line: 'לקוחות מחפשים אתכם בגוגל, ורוצים לראות מי אתם לפני שהם מרימים טלפון.' },
      { tone: 'coral', name: 'אתר לתוכנית ליווי', line: 'אתם מוכרים קורס או ליווי, ורוב המתעניינים עוד מתלבטים.' },
    ],
  },

  PROCESS: {
    // the same words as the button and the menu item that lead here
    h2: 'איך זה |עובד?',
    steps: [
      { title: 'שיחה', line: 'אתם מספרים מה אתם מוכרים, ומה עוצר היום את הלקוחות שלכם מלפנות.' },
      // faq-9: writing together costs extra. "חומרים" is the word the slip under the steps counts from
      { title: 'חומרים', line: 'אתם שולחים את הטקסט ואת התמונות שיש לכם. אם אין טקסט, אנחנו כותבים אותו יחד איתכם בתשלום נוסף.' },
      // Terms 4.2: two rounds of changes
      { title: 'עיצוב', line: 'לפני שאנחנו בונים, אתם רואים את הדף מעוצב ומאשרים אותו. שני סבבי תיקונים כלולים במחיר.' },
      { title: 'בנייה', line: 'אנחנו בונים דף שנפתח מהר בטלפון, ומחברים אותו לוואטסאפ ולמודעות שלכם.' },
    ],
  },

  // the clock starts the day the owner sends the materials (step two), and the first line says so; it stays on
  // one line on a 360 px phone, which "החומרים שלכם אצלנו ב" did not
  LAUNCH: {
    start: 'שלחתם חומרים ב',
    end: 'דף נחיתה רגיל באוויר עד',
    note: 'אנחנו סופרים 7 ימי עבודה, ראשון עד חמישי. חג באמצע מזיז את התאריך.',
  },

  // what an owner wants settled before writing to us: the price, what it holds, whose site it is, and what happens afterwards
  FAQ: { h2: 'לפני שאתם |כותבים לנו', ids: ['faq-price', 'faq-8', 'faq-own', 'faq-5'] },

  // the first thing the call is about, said as a statement: the form has a name and a phone, nothing to answer in
  CONTACT: {
    h2: 'בשיחה נשאל אתכם |מה אתם מוכרים',
    lede: 'השאירו פרטים, ואנחנו חוזרים אליכם תוך 24\u00A0שעות בימי עסקים.',
  },
}

export default c
