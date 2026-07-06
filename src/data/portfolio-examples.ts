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
    subtitle: 'חלק מסרטון שהפקנו לכבוד יום הולדת 60 הכולל זיכרונות מהילדות עד היום',
    description:
      'לקחנו תמונות ישנות מאלבומים מגוונים ומיינו אותן לפי תקופות שונות בחיים — ילדות, נעורים, חתונה ואימהות. כל תמונה עברה הנפשה בבינה מלאכותית, הוספנו מוזיקה מתאימה וכיתובים קצרים לכל שלב. בערב האירוע הוקרן הסרטון ויצר רגע שכולם יזכרו.',
    localVideoPath: '/videos/memory-video.mp4',
    tags: ['הנפשת AI', 'מוזיקה מותאמת', 'כתוביות אישיות', 'אירוע משפחתי'],
    metaTitle: 'סרטון זיכרונות ליום הולדת 60 | דוגמה לפרויקט | MediaWave Israel',
    metaDescription:
      'דוגמה לסרטון זיכרונות שהוכן ליום הולדת 60. תמונות משפחתיות ישנות שהונפשו עם מוזיקה מותאמת וכיתובים אישיים.',
  },
]

export function getPortfolioExampleBySlug(slug: string): PortfolioExampleData | undefined {
  return portfolioExamples.find((e) => e.slug === slug)
}
