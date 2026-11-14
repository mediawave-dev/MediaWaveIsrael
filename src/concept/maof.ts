// Concept site (D271): "שחר עגורים", guided crane tours in the Hula Valley, set in the style מעוף (Flight).
// A fictional business, built to show the style's motion in the work wheel (Nati, 14.11.2026: "הרעיון הוא להציג
// יכולת בקרוסלה ולאו דווקא עסקים אמיתיים"). The glass bird crosses a sky that turns from day to dusk, night and dawn:
// the hours these tours go out. General facts only (cranes winter in the Hula, November to February); no prices,
// no people, no reviews. A web search found no business by this name (14.11.2026).
import type { Site } from '../studio/site'

/** the photographs and clips (Pexels License, free to use, no credit required; ledger in src/concept/media/LEDGER.md).
    Served by the dev server from src/, so nothing of them ships with the site. */
const M = '/src/concept/media/'

export const MAOF: Site = {
  concept: true,
  hero: {
    line1: 'סיורים מודרכים בעמק החולה',
    line2: 'שחר עגורים',
    brand: 'שחר עגורים',
    sub: 'יוצאים לפני הזריחה, כשעשרות אלפי עגורים קמים מהאגם בבת אחת.',
    sub2: 'סיור בוקר וסיור שקיעה, מאוקטובר עד מרץ.',
    cta: 'לתאם סיור',
  },
  clips: {},
  C: {
    services: {
      title: 'הסיורים',
      items: [
        { id: 'dawn', title: 'סיור זריחה', line: 'נפגשים בחמש וחצי בבוקר ורואים את הלהקות מתעוררות. חוזרים לארוחת בוקר בתשע.', href: '', img: M + 'maof-tour-dawn.webp', alt: 'להקת עגורים בשדה, בערפל של הבוקר' },
        { id: 'dusk', title: 'סיור שקיעה', line: 'יוצאים שעה וחצי לפני השקיעה, כשהעגורים חוזרים לישון במים. מתאים גם למי שלא קם מוקדם.', href: '', img: M + 'maof-tour-dusk.webp', alt: 'צלליות של עגורים מול שמי השקיעה' },
        { id: 'photo', title: 'סדנת צילום', line: 'שמונה צלמים לכל היותר, במסתור קרוב ללהקות. המדריך מכוון אתכם לאור ולזווית.', href: '', img: M + 'maof-tour-photo.webp', alt: 'עגור נוחת מעל להקה גדולה בשדה' },
        { id: 'family', title: 'סיור משפחות', line: 'שעתיים בקצב של ילדים. כל ילד מקבל משקפת ודף משימות שלוקחים הביתה.', href: '', img: M + 'maof-tour-family.webp', alt: 'משקפת על דק עץ ליד המים' },
      ],
    },
    work: { title: 'From the field', name: 'עונה אחת בעמק', line: 'מהערפל של הבוקר ועד השקיעה, כך נראה העמק בחורף.', href: '', linkLabel: '', clips: [1, 2, 3, 4].map((n) => `${M}maof-film-${n}`) },
    process: {
      title: 'איך יוצאים לסיור',
      steps: [
        { id: 'pick', title: 'בוחרים בוקר', line: 'כותבים לנו תאריך וכמה אתם. אנחנו מאשרים לפי מזג האוויר והמקומות שנשארו.' },
        { id: 'prep', title: 'מקבלים הכנה', line: 'יום לפני מגיעה הודעה עם נקודת המפגש ומה כדאי ללבוש.' },
        { id: 'go', title: 'יוצאים לשטח', line: 'המדריך מחכה עם משקפות ותה חם. הסיור נמשך כשלוש שעות.' },
        { id: 'keep', title: 'שומרים את הבוקר', line: 'אחרי הסיור מגיעות במייל התמונות שצילמנו בדרך.' },
      ],
    },
    faq: {
      title: 'שאלות לפני שיוצאים',
      items: [
        { id: 'when', q: 'מתי רואים הכי הרבה עגורים?', a: 'בין נובמבר לפברואר. בבוקר הם עפים לשדות ובערב חוזרים לאגם, ולכן הסיורים יוצאים בשעות האלה.' },
        { id: 'rain', q: 'מה קורה אם יורד גשם?', a: 'בגשם קל יוצאים כרגיל, והעגורים לא מתרגשים. בסערה אנחנו מזיזים את הסיור לתאריך אחר בלי תשלום.' },
        { id: 'kids', q: 'אפשר להגיע עם ילדים?', a: 'כן, מגיל שש. לילדים קטנים יותר מתאים סיור המשפחות, שהוא קצר יותר.' },
        { id: 'gear', q: 'צריך להביא ציוד?', a: 'לא. יש אצלנו משקפת לכל משתתף. כדאי להביא שכבה חמה, כי בבוקר העמק קר.' },
      ],
    },
    contact: {
      title: 'נשמור לכם מקום',
      lead: 'כתבו תאריך וכמה אתם, ונחזור אליכם עם אישור.',
      phone: '',
      email: '',
      response: '',
      ask: 'תאריך ומספר משתתפים',
      send: 'לבקש מקום',
    },
  },
}
