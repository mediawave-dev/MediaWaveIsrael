// Copy and content shared by the three looks. Every new line is marked [קופי: נתי]
// until Nati approves it; the H1 is unchanged.

import { servicesData } from '../data/services'

export const HERO = {
  line1: 'אתר שמביא',
  line2: 'פניות לוואטסאפ',
  /** [קופי: נתי] replaces "עם גישה אישית וליווי צמוד" (slop-scan flagged both) */
  sub: 'נבנה מאפס בשביל העסק שלכם. אתר בסיסי עולה לאוויר תוך 2 עד 3 שבועות.',
  cta: 'ספרו לנו על העסק',
  secondary: 'מה אנחנו עושים',
}

/** One outcome line per service. [קופי: נתי] every line. */
const LINES: Record<string, string> = {
  websites: 'אתר שנבנה מאפס בשבילכם, ונשאר שלכם.',
  landing: 'דף אחד עם הצעה אחת, שמוביל ישר לוואטסאפ.',
  seo: 'עבודה חודשית על האתר, ודוח שמראה מה השתנה.',
  chatbots: 'עונה ללקוחות גם כשאתם בפגישה.',
  'video-editing': 'מהצילומים שלכם לסרטון גמור, ומקלטות ישנות לקובץ.',
  'memory-videos': 'תמונות מהאלבום שחוזרות לזוז.',
}

export interface ShowItem {
  id: string
  title: string
  line: string
  /** /services/<slug>, or none (process steps) */
  href?: string
  hrefLabel?: string
  /** a real work sample (the strongest proof on the card): /portfolio/<slug> */
  portfolio?: string
  lottie?: string
  image?: string
  renderer?: 'svg' | 'canvas'
}

export const SERVICES: ShowItem[] = servicesData.map((s) => ({
  id: s.id,
  title: s.title,
  line: LINES[s.id] ?? s.heroSubtitle,
  href: `/services/${s.slug}`,
  hrefLabel: `לפרטים על ${s.title}`,
  portfolio: s.portfolioLink,
  lottie: s.lottieAnimation,
  image: s.imageIcon,
  renderer: s.lottieRenderer,
}))

/** How we work: the four steps and their Lotties, unchanged from HowWeWork. */
export const STEPS: ShowItem[] = [
  { id: 'call', title: 'שיחת היכרות', line: 'מספרים לנו על העסק, ומבינים יחד מה האתר צריך לעשות.', lottie: '/animations/8 call/Call Center Support Lottie Animation.json' },
  { id: 'design', title: 'עיצוב לאישור', line: 'רואים את העיצוב ומאשרים אותו לפני שבונים. עד שני סבבי תיקונים כלולים.', lottie: '/animations/10 design/Web Design Illustration.json', renderer: 'canvas' },
  { id: 'build', title: 'בנייה', line: 'מקבלים קישור לטלפון, ורואים את האתר נבנה. בודקים אותו יחד.', lottie: '/animations/9 build/website build.json' },
  { id: 'launch', title: 'השקה', line: 'האתר עולה לאוויר. בחודש הראשון התמיכה עלינו.', lottie: '/animations/11 launch/web deployment - Isometric Concept Lottie Animations.json' },
]
