export interface Package {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  idealFor: string
  cta: string
  ctaLink: string
  popular?: boolean
}

// NOTE: Prices are suggestions — Nati must approve final pricing before launch
export const packages: Package[] = [
  {
    id: 'landing',
    name: 'דף נחיתה',
    price: 'החל מ-₪1,500',
    description: 'נוכחות דיגיטלית מהירה ואפקטיבית',
    features: [
      'עמוד אחד רספונסיבי',
      'עיצוב מותאם אישית',
      'טופס יצירת קשר',
      'אופטימיזציית מהירות',
      'SEO בסיסי',
    ],
    idealFor: 'לעסקים שרוצים נוכחות דיגיטלית מהירה',
    cta: 'בואו נדבר',
    ctaLink: '#contact',
  },
  {
    id: 'business',
    name: 'אתר תדמית',
    price: 'החל מ-₪3,500',
    description: 'אתר מקצועי ומרשים לעסק שלך',
    features: [
      'עד 5 עמודים',
      'עיצוב מותאם אישית',
      'רספונסיבי מלא',
      'SEO מובנה',
      'אינטגרציית Google Analytics',
      'טופס יצירת קשר מתקדם',
      'ליווי עד להשקה',
    ],
    idealFor: 'לעסקים שרוצים אתר מקצועי ומרשים',
    cta: 'בואו נדבר',
    ctaLink: '#contact',
    popular: true,
  },
  {
    id: 'custom',
    name: 'פרויקט מותאם',
    price: 'לפי הצעת מחיר',
    description: 'פתרון מותאם לצרכים ייחודיים',
    features: [
      'אתר מורכב / חנות / אפליקציה',
      'פיצ׳רים מתקדמים (צ׳אטבוט AI, אינטגרציות, CMS)',
      'עיצוב פרימיום',
      'תמיכה שוטפת',
    ],
    idealFor: 'לעסקים עם צרכים ייחודיים ושאפתניים',
    cta: 'בואו נדבר',
    ctaLink: '#contact',
  },
]
