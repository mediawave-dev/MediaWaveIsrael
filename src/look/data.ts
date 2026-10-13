// Copy and content shared by the three looks. Every new line is marked [קופי: נתי]
// until Nati approves it; the H1 is unchanged.

import { servicesData } from '../data/services'

export const HERO = {
  line1: 'העסק שלכם',
  line2: 'המומחיות שלנו',
  /** [קופי: נתי] replaces "עם גישה אישית וליווי צמוד" (slop-scan flagged both) */
  sub: 'בונים לכם אתר שמביא פניות. מדברים ישירות עם המפתח, בלי מתווכים.',
  cta: 'בואו נדבר על הפרויקט שלכם',
  secondary: 'לשירותים שלנו',
}

/** One outcome line per service. [קופי: נתי] every line. */
const LINES: Record<string, string> = {
  websites: 'אתר שנבנה בקוד, נטען מהר ושייך לכם.',
  landing: 'דף אחד שהופך גולש לפנייה בוואטסאפ.',
  seo: 'שימצאו אתכם בגוגל כשמחפשים את מה שאתם עושים.',
  chatbots: 'עונה ללקוחות גם כשאתם בפגישה.',
  'video-editing': 'מחומר גלם לסרטון שרואים עד הסוף, וקלטות ישנות לקובץ.',
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
  { id: 'call', title: 'שיחת היכרות', line: 'מבינים את העסק, היעדים והקהל שלכם', lottie: '/animations/8 call/Call Center Support Lottie Animation.json' },
  { id: 'design', title: 'תכנון ועיצוב', line: 'מתכננים איך האתר ייראה ואיך יהיה נוח לגלוש בו', lottie: '/animations/10 design/Web Design Illustration.json', renderer: 'canvas' },
  { id: 'build', title: 'פיתוח ובנייה', line: 'בונים אתר מהיר ובטוח, מוכן לעבודה', lottie: '/animations/9 build/website build.json' },
  { id: 'launch', title: 'השקה וליווי', line: 'משיקים, עוקבים אחרי ביצועים ומלווים לאורך זמן', lottie: '/animations/11 launch/web deployment - Isometric Concept Lottie Animations.json' },
]
