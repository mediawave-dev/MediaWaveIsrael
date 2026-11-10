// The copy proposal of 11.11.2026 (D236). [קופי: נתי] every line here waits for his approval. It shows only behind
// ?copy=new (the lab's `copy` gate), in the real design, so he reads each line where it would live; the approved
// words stay where they are (data.ts, the chapters) and are what the site serves and prerenders.
// Nati: "all our content sounds like generic AI slop... unique, human". What reads as a machine in the approved
// copy, what other small studios do instead, and the reason for every line here: design/copy/proposal-20261111.rtl.md
// and design/copy/research-20261110.rtl.md. The rules these lines keep:
//   only facts the site already states (the terms, the FAQ): no client, number or quote we do not have
//   one speaker: the developer does, you get. No "we", no name, no face
//   a headline is a fact or the visitor's own question, never a slogan; a number where an adjective was
//   no two neighbours in the same mould (the approved copy has "..., and ..." in forty lines)
import { opt } from './lab'

const NEW = {
  // the opening: who and what, as a fact. The sheet under it is drawn by one hand
  'hero.line1': 'מפתח אחד',
  'hero.line2': 'בונה לכם אתר.',
  'hero.sub': 'הוא גם מי שעונה לכם בוואטסאפ.',
  'hero.cta': 'כתבו לו בוואטסאפ',
  // 01 websites: the question people ask last, answered first
  'web.line1': 'של מי האתר בסוף?',
  'web.line2': 'שלכם.',
  'web.sub': 'אחרי התשלום העיצוב, הקוד והתכנים עוברים אליכם. גם אם תעברו למישהו אחר, האתר נשאר אצלכם.',
  // the film chapter
  'film.line1': 'סרטון מהצילומים,',
  'film.line2': 'והקלטות שבמגירה.',
  // in place of "why us": the three real catches, each with its number
  'why.title': 'ומה הקאץ׳?',
  'why.tech.t': 'זה לא מוכן מחר',
  'why.tech.l': 'אתר בסיסי לוקח שבועיים עד שלושה. הוא נבנה מאפס, לא על תבנית.',
  'why.ai.t': 'אין מוקד שירות',
  'why.ai.l': 'יש מפתח אחד. הוא עונה תוך 24 שעות בימי עסקים, לא ב-2 בלילה.',
  'why.personal.t': 'מהשנה השנייה משלמים אחסון',
  'why.personal.l': '500 עד 800 ₪ לשנה. השנה הראשונה כלולה, ותזכורת מגיעה חודש לפני.',
  // the services: what can be ordered
  'svc.title': 'מה אפשר להזמין',
  'svc.websites': 'נבנה מאפס. גוגל יודע לקרוא אותו, וגם ChatGPT.',
  'svc.landing': 'דף אחד עם הצעה אחת, שמוביל ישר לוואטסאפ.',
  'svc.seo': 'עבודה חודשית על האתר, ודוח שמראה מה השתנה.',
  'svc.chatbots': 'עונה ללקוחות גם כשאתם בפגישה.',
  'svc.video-editing': 'מהצילומים שלכם לסרטון גמור. גם הקלטות שבמגירה, לקובץ.',
  'svc.memory-videos': 'תמונות מהאלבום שחוזרות לזוז.',
  // the process, as what happens to the client
  'proc.line1': 'מה קורה אחרי',
  'proc.line2': 'שכותבים?',
  'step.call.t': 'קודם מדברים',
  'step.call.l': 'מספרים למפתח על העסק. אחר כך מגיעה הצעה בכתב: מה נבנה, עד מתי וכמה.',
  'step.design.t': 'העיצוב מגיע קודם',
  'step.design.l': 'שום דבר לא נבנה לפני שאישרתם אותו. שני סבבי תיקונים כבר בתוך המחיר.',
  'step.build.t': 'קישור לטלפון',
  'step.build.l': 'האתר נבנה מול העיניים שלכם. פותחים את הקישור מתי שרוצים, ורואים מה התקדם.',
  'step.launch.t': 'עולים לאוויר',
  'step.launch.l': 'המפתח מלמד אתכם לעדכן לבד. ב-30 הימים הראשונים כל תיקון עליו.',
  // the questions, and the letter
  'faq.title': 'לפני שסוגרים',
  'contact.title': 'כתבו שתי שורות',
  'contact.lead': 'מה העסק ומה חסר לו. ההודעה מגיעה ישר למפתח, והוא עונה תוך יום עסקים.',
} as const

export type CopyKey = keyof typeof NEW

/** The approved words, or the proposal where the lab asks for it (?copy=new). */
export const say = (key: CopyKey, now: string): string => (opt('copy') === 'new' ? NEW[key] : now)
