import yaelevyScreenshot from '../assets/yaelevy-screenshot.png'

export interface Project {
  id: string
  title: string
  type: string
  description: string
  url: string
  image: string
  imageMobile?: string
  tags: string[]
  features?: string[]
  featured: boolean
  selfLink?: boolean
}

export const projects: Project[] = [
  {
    id: 'yaelevy',
    title: 'yaelevy.co.il',
    type: 'אתר תדמית',
    description:
      'אתר תדמית מקצועי למטפלת רגשית. עיצוב מותאם אישית עם דגש על אווירה חמה ומזמינה, ביצועים מהירים, והתאמה מלאה למובייל.',
    url: 'https://www.yaelevy.co.il',
    image: yaelevyScreenshot,
    tags: ['WordPress', 'עיצוב מותאם', 'רספונסיבי', 'SEO'],
    features: [
      'עיצוב רספונסיבי מלא',
      'אנימציות חלקות ומרשימות',
      'גלריית תמונות אינטראקטיבית',
      'טופס יצירת קשר מובנה',
    ],
    featured: true,
  },
]
