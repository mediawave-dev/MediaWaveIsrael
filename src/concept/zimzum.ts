// Concept site (D271): "צוף הגבעה", a family apiary in the Galilee, set in the style זמזום (Buzz). A fictional
// business, built to show the style's motion in the work wheel (Nati, 14.11.2026). Here the swarm is bees that flee the
// pointer and gather at the order form. General facts only (raw honey crystallises, citrus and eucalyptus honey);
// no prices, no people, no reviews. A web search found no business by this name (14.11.2026).
import type { Site } from '../studio/site'

/** the clips and photographs (Pexels License, free to use, no credit required; ledger in src/concept/media/LEDGER.md).
    Served by the dev server from src/, so nothing of them ships with the site. */
const M = '/src/concept/media/'

export const ZIMZUM: Site = {
  concept: true,
  hero: {
    line1: 'מכוורת משפחתית בגליל',
    line2: 'צוף הגבעה',
    brand: 'צוף הגבעה',
    tags: 'RAW HONEY · FAMILY VISITS',
    sub: 'דבש שלא עבר חימום, ישר מהכוורת לצנצנת.',
    sub2: 'בימי שישי פותחים את המכוורת למשפחות.',
    cta: 'להזמנת דבש',
  },
  clips: { citrus: M + 'zimzum-citrus', eucalyptus: M + 'zimzum-eucalyptus', workshop: M + 'zimzum-workshop', gift: M + 'zimzum-gift' },
  buzz: {
    swarm: 'bee',
    endWord: 'דבש',
    lines: [
      'צוף הגבעה, מכוורת משפחתית בגליל',
      'דבש שלא עבר חימום, ישר מהכוורת לצנצנת.',
      'בימי שישי פותחים את המכוורת למשפחות.',
      'משלוח עד הבית תוך שלושה ימי עבודה.',
    ],
  },
  C: {
    services: {
      title: 'מה יש במכוורת',
      items: [
        { id: 'citrus', title: 'דבש הדרים', line: 'בהיר ועדין, מהפריחה של מרץ.', href: '' },
        { id: 'eucalyptus', title: 'דבש אקליפטוס', line: 'כהה, עם טעם עמוק וקצת מריר.', href: '' },
        { id: 'workshop', title: 'סדנת משפחות', line: 'לובשים חליפת כוורן ופותחים כוורת אמיתית. כל ילד יוצא עם צנצנת שמילא בעצמו.', href: '' },
        { id: 'gift', title: 'מארזי חג', line: 'צנצנות בקופסת עץ, עם כרטיס ברכה בכתב יד.', href: '' },
      ],
    },
    work: { title: 'From the hive', name: 'הקטיף של יולי', line: 'יום אחד במכוורת, מהכוורת ועד הצנצנת.', href: '', linkLabel: '', clips: [], film: M + 'zimzum-film.mp4', filmPoster: M + 'zimzum-film.webp' },
    process: {
      title: 'איך מזמינים',
      steps: [
        { id: 'pick', title: 'בוחרים דבש', line: 'כותבים לנו איזה דבש ובאיזו כמות. צנצנת אחת או ארגז למשרד.' },
        { id: 'fill', title: 'אנחנו ממלאים', line: 'כל צנצנת מתמלאת ביום ההזמנה ונסגרת עם תאריך הקטיף.' },
        { id: 'ship', title: 'הדבש מגיע', line: 'משלוח עד הבית תוך שלושה ימי עבודה, או איסוף מהמכוורת ביום שישי.' },
      ],
    },
    faq: {
      title: 'שאלות על הדבש',
      items: [
        { id: 'crystal', q: 'למה הדבש שלכם מתגבש?', a: 'כי הוא לא עבר חימום. דבש גולמי מתגבש עם הזמן, וזה סימן טוב. כמה דקות בכלי עם מים חמים מחזירות אותו לנוזל.' },
        { id: 'keep', q: 'כמה זמן הדבש נשמר?', a: 'שנים, אם הצנצנת סגורה ושומרים אותה מחוץ למקרר.' },
        { id: 'visit', q: 'אפשר לבקר בלי סדנה?', a: 'כן. החנות פתוחה בימי שישי בבוקר, ואפשר לטעום מכל הדבשים.' },
        { id: 'age', q: 'הסדנה מתאימה לילדים קטנים?', a: 'מגיל ארבע, עם הורה. יש לנו חליפות בכל המידות.' },
      ],
    },
    contact: {
      title: 'מה לשלוח לכם?',
      lead: 'כתבו איזה דבש וכמה, ונחזור אליכם עם מחיר ומועד משלוח.',
      phone: '',
      email: '',
      response: '',
      ask: 'איזה דבש וכמה',
      send: 'שליחה',
    },
  },
}
