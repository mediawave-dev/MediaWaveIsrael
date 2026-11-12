// The work samples that have a page of their own (/portfolio/<address>). The prerender and the sitemap read
// every `slug` in this file, so the word is used for a sample's own address only.
export interface PortfolioExampleData {
  id: string
  slug: string
  serviceSlug: string
  serviceTitle: string
  title: string
  subtitle: string
  description: string
  videoUrl?: string // YouTube embed URL (e.g. https://www.youtube.com/embed/VIDEO_ID)
  localVideoPath?: string // Local video in /public (e.g. /videos/my-video.mp4)
  tags: string[]
  metaTitle: string
  metaDescription: string

  // ---- sun (D254): the sample's page in the hand of the service pages. All optional.
  /** the still shown before the film is played, a file in /public */
  poster?: string
  /** the film's length (ISO 8601) and the day it went up, for the page's VideoObject */
  duration?: string
  uploadDate?: string
  /** the page's name in two weights: "light|heavy" (default: title, all heavy) */
  h1?: string
  /** the line under the name (default: subtitle) */
  lede?: string
  /** how it was made, one paragraph per entry (default: description) */
  story?: string[]
}

export const portfolioExamples: PortfolioExampleData[] = [
  {
    id: 'memory-video-1',
    slug: 'memory-videos',
    serviceSlug: 'memory-videos',
    serviceTitle: 'סרטוני זיכרונות',
    title: 'סרטון זיכרונות משפחתי',
    subtitle: 'קטע מסרטון שהכנו ליום הולדת 60, מהילדות ועד היום.',
    description:
      'לקחנו תמונות ישנות מכמה אלבומים, ומיינו אותן לפי תקופות בחיים, מהילדות והנעורים ועד החתונה והאימהות. כל תמונה זזה בעזרת בינה מלאכותית, ולכל תקופה הוספנו מוזיקה וכיתוב קצר. בערב האירוע הסרטון הוקרן.',
    localVideoPath: '/videos/memory-video.mp4',
    tags: ['כל תמונה זזה', 'מוזיקה שנבחרה לסרטון', 'כיתוב לכל תקופה', 'אירוע משפחתי'],
    metaTitle: 'סרטון זיכרונות ליום הולדת 60 | דוגמה',
    metaDescription:
      'דוגמה לסרטון זיכרונות ליום הולדת 60. תמונות משפחתיות ישנות שזזות, עם מוזיקה וכיתוב לכל תקופה.',
    poster: '/videos/memory-video-poster.webp',
    // the same two values the earlier look's page carried (src/look/shot/pages/ShotPortfolio.tsx)
    duration: 'PT2M7S',
    uploadDate: '2026-01-01',
    h1: 'סרטון זיכרונות |ליום\u00A0הולדת\u00A060',
    lede: 'קטע מסרטון שהוקרן בערב האירוע.',
    story: [
      'לקחנו תמונות ישנות מכמה אלבומים, ומיינו אותן לפי תקופות בחיים, מהילדות והנעורים ועד החתונה והאימהות.',
      'כל תמונה זזה בעזרת בינה מלאכותית, ולכל תקופה הוספנו מוזיקה וכיתוב קצר.',
    ],
  },
]

export function getPortfolioExampleBySlug(slug: string): PortfolioExampleData | undefined {
  return portfolioExamples.find((e) => e.slug === slug)
}

/** The sample a service page shows as one of its answers (services.ts, ServiceAsk.sample). */
export function getPortfolioExampleByService(serviceSlug: string): PortfolioExampleData | undefined {
  return portfolioExamples.find((e) => e.serviceSlug === serviceSlug)
}
