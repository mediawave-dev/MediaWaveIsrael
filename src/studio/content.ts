// The style studio's one source of copy: every style shows the same content, taken from the site's own
// data (look/data.ts, data/faqs.ts, data/site.ts, the sea home). Nothing here is new except the lines
// marked [קופי: נתי], and no fact, client or number is invented.
import { HERO, SERVICES, STEPS } from '../look/data'
import { faqs } from '../data/faqs'
import { SITE_CONTACT } from '../data/site'

export type ChapterId = 'hero' | 'services' | 'work' | 'process' | 'faq' | 'contact'

export const C = {
  hero: {
    line1: HERO.line1,
    line2: HERO.line2,
    sub: HERO.sub,
    sub2: HERO.sub2,
    pro: HERO.pro,
    cta: HERO.cta,
  },
  services: {
    title: 'מה אנחנו עושים',
    items: SERVICES.map((s) => ({ id: s.id, title: s.title, line: s.line, href: s.href ?? '/' })),
  },
  /** the one real sample on the site: the memories film for a 60th birthday (sea home, D164) */
  work: {
    /** labels in English (Nati, 21.10: "זה מוסיף מקצועיות ויופי") */
    title: 'Selected work',
    name: 'סרט זיכרונות ליום הולדת 60',
    line: 'תמונות מהאלבום שחוזרות לזוז.',
    href: '/portfolio/memory-videos/',
    linkLabel: 'Watch',
    clips: ['/media/work-life-1', '/media/work-life-2', '/media/work-life-3', '/media/work-life-4'],
  },
  process: {
    title: 'איך אנחנו עובדים',
    steps: STEPS.map((s) => ({ id: s.id, title: s.title, line: s.line })),
  },
  faq: {
    title: 'שאלות נפוצות',
    items: faqs.slice(0, 5).map((f) => ({ id: f._id, q: f.question, a: f.answer })),
  },
  contact: {
    title: 'ספרו לנו על העסק',
    /** [קופי: נתי] */
    lead: 'כתבו כמה מילים, והסגנון שבחרתם יצורף להודעה.',
    phone: SITE_CONTACT.phone,
    email: SITE_CONTACT.email,
    response: SITE_CONTACT.responseTime,
  },
}

/** The clip pool every style may use (the site's own encodes, public/media). */
export const CLIPS = {
  websites: '/media/svc-websites-2',
  landing: '/media/svc-landing-2',
  seo: '/media/svc-seo-2',
  chatbots: '/media/svc-chat-2',
  'video-editing': '/media/svc-video-2',
  'memory-videos': '/media/svc-memories-2',
} as Record<string, string>
