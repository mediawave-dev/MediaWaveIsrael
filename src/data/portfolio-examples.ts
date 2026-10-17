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
}

export const portfolioExamples: PortfolioExampleData[] = [
  {
    id: 'memory-video-1',
    slug: 'memory-videos',
    serviceSlug: 'memory-videos',
    serviceTitle: 'סרטוני זיכרונות',
    title: 'סרטון זיכרונות משפחתי',
    subtitle: 'קטע מסרטון שהכנו ליום הולדת 60: מהילדות ועד היום.',
    description:
      'לקחנו תמונות ישנות מכמה אלבומים, ומיינו אותן לפי תקופות בחיים: ילדות, נעורים, חתונה ואימהות. כל תמונה זזה בעזרת בינה מלאכותית, ולכל תקופה הוספנו מוזיקה וכיתוב קצר. בערב האירוע הסרטון הוקרן.',
    localVideoPath: '/videos/memory-video.mp4',
    tags: ['כל תמונה זזה', 'מוזיקה שנבחרה לסרטון', 'כיתוב לכל תקופה', 'אירוע משפחתי'],
    metaTitle: 'סרטון זיכרונות ליום הולדת 60 | דוגמה',
    metaDescription:
      'דוגמה לסרטון זיכרונות ליום הולדת 60: תמונות משפחתיות ישנות שזזות, עם מוזיקה וכיתוב לכל תקופה.',
  },
]

export function getPortfolioExampleBySlug(slug: string): PortfolioExampleData | undefined {
  return portfolioExamples.find((e) => e.slug === slug)
}
