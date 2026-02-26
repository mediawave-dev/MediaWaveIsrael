import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Paintbrush, Smartphone, Zap, MousePointerClick, MessageCircle, BarChart3 } from 'lucide-react'
import SEO from '../SEO'

const features = [
  { icon: Paintbrush, title: 'עיצוב ממוקד המרה', desc: 'עיצוב מותאם אישית שבנוי להפוך מבקרים ללקוחות' },
  { icon: Smartphone, title: 'מותאם למובייל', desc: 'רספונסיבי 100% — נראה מושלם בכל מכשיר' },
  { icon: Zap, title: 'מהירות טעינה', desc: 'זמן טעינה של פחות מ-2 שניות לחוויית משתמש מעולה' },
  { icon: MousePointerClick, title: 'טופסי לידים חכמים', desc: 'טפסים מותאמים עם ולידציה ושליחה אוטומטית למייל' },
  { icon: MessageCircle, title: 'חיבור WhatsApp', desc: 'כפתור וואטסאפ מובנה ליצירת קשר מיידית' },
  { icon: BarChart3, title: 'SEO מובנה', desc: 'אופטימיזציה למנועי חיפוש כבר מהרגע הראשון' },
]

const steps = [
  { num: '01', title: 'שיחת אפיון', desc: 'מבינים את המטרות, קהל היעד והמסרים המרכזיים' },
  { num: '02', title: 'עיצוב', desc: 'מעצבים דף נחיתה שמדבר בשפה של הלקוחות שלכם' },
  { num: '03', title: 'פיתוח', desc: 'בונים בקוד נקי עם ביצועים גבוהים וחוויית משתמש חלקה' },
  { num: '04', title: 'השקה', desc: 'העלאה לאוויר, בדיקות סופיות והדרכה על ניהול הדף' },
]

const faqs = [
  { q: 'מה זה דף נחיתה ולמה צריך אחד?', a: 'דף נחיתה הוא עמוד אינטרנט ממוקד עם מטרה אחת ברורה — להמיר מבקרים ללקוחות. בניגוד לאתר מלא, דף נחיתה מכוון את הגולש לפעולה אחת: להשאיר פרטים, להתקשר, או לשלוח הודעה בוואטסאפ.' },
  { q: 'כמה זמן לוקח לבנות דף נחיתה?', a: 'דף נחיתה מקצועי מוכן תוך 5-10 ימי עבודה, תלוי במורכבות העיצוב ובזמינות התכנים מהלקוח.' },
  { q: 'האם אפשר לעדכן את הדף בעצמי?', a: 'כן, אנחנו יכולים לחבר את הדף למערכת ניהול תוכן (CMS) שמאפשרת לעדכן טקסטים ותמונות בקלות ללא ידע טכני.' },
  { q: 'האם דף הנחיתה יופיע בגוגל?', a: 'בהחלט. כל דף נחיתה כולל אופטימיזציה בסיסית ל-SEO, מפת אתר, ורישום בגוגל. הוא גם מותאם למנועי AI כמו ChatGPT ו-Perplexity.' },
]

export default function LandingPagesService() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen bg-cream pt-32 pb-20">
      <SEO
        title="בניית דפי נחיתה ממירים"
        description="בניית דפי נחיתה ממוקדי המרה לעסקים. עיצוב מותאם אישית, מהירות גבוהה, חיבור WhatsApp, SEO מובנה ומותאם למובייל. MediaWave Israel — דפי נחיתה שמייצרים לידים."
        canonical="/services/landing-pages"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ראשי', item: 'https://mediawaveisrael.com/' },
          { '@type': 'ListItem', position: 2, name: 'שירותים', item: 'https://mediawaveisrael.com/services' },
          { '@type': 'ListItem', position: 3, name: 'דפי נחיתה', item: 'https://mediawaveisrael.com/services/landing-pages' },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'בניית דפי נחיתה',
        description: 'בניית דפי נחיתה ממוקדי המרה לעסקים קטנים ובינוניים בישראל',
        provider: { '@type': 'Organization', name: 'MediaWave Israel', url: 'https://mediawaveisrael.com' },
        areaServed: { '@type': 'Country', name: 'Israel' },
        serviceType: 'Landing Page Development',
      }) }} />

      <div className="container max-w-4xl">
        {/* Back link */}
        <motion.div className="mb-8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link to="/services" className="inline-flex items-center gap-2 text-brown-light hover:text-orange transition-colors text-sm">
            <ArrowRight size={16} />
            חזרה לשירותים
          </Link>
        </motion.div>

        {/* Answer capsule */}
        <motion.p
          className="text-lg text-brown-light leading-relaxed mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          דף נחיתה הוא עמוד אינטרנט ממוקד שנבנה עם מטרה אחת: להפוך גולשים ללקוחות. הוא כולל עיצוב ממוקד המרה, טפסי לידים חכמים, חיבור ישיר לוואטסאפ, ואופטימיזציה למובייל ולמנועי חיפוש.
        </motion.p>

        {/* Hero */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-headline text-brown-dark mb-4">
            בניית דפי נחיתה ממירים
          </h1>
          <p className="text-lg text-brown-light max-w-xl mx-auto leading-relaxed">
            דפי נחיתה שמייצרים לידים ומובילים למכירות — עם עיצוב שמדבר בשפה של הלקוחות שלכם
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-headline text-brown-dark mb-8 text-center">מה כולל דף נחיתה שלנו?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat, i) => {
              const Icon = feat.icon
              return (
                <motion.div
                  key={feat.title}
                  className="bg-white rounded-xl p-6 border border-cream-darker/30"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Icon size={24} className="text-orange mb-3" />
                  <h3 className="font-semibold text-brown-dark mb-1">{feat.title}</h3>
                  <p className="text-sm text-brown-light leading-relaxed">{feat.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Process */}
        <div className="mb-16">
          <h2 className="text-2xl font-headline text-brown-dark mb-8 text-center">התהליך</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <span className="text-4xl font-headline text-orange/30">{step.num}</span>
                <h3 className="font-semibold text-brown-dark mt-2 mb-1">{step.title}</h3>
                <p className="text-sm text-brown-light leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-headline text-brown-dark mb-8 text-center">שאלות נפוצות על דפי נחיתה</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-lg p-5 border border-cream-darker/30"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <h3 className="font-semibold text-brown-dark mb-2">{faq.q}</h3>
                <p className="text-brown-light text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Internal links */}
        <div className="flex justify-center gap-6 mb-12 text-sm">
          <Link to="/services" className="text-brown-light hover:text-orange transition-colors">כל השירותים</Link>
          <Link to="/services/business-websites" className="text-brown-light hover:text-orange transition-colors">אתרים לעסקים</Link>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-headline text-brown-dark mb-4">
            רוצים דף נחיתה שממיר?
          </h2>
          <p className="text-brown-light mb-6">ספרו לנו על העסק שלכם ונבנה לכם דף שמביא תוצאות</p>
          <a
            href="/#contact"
            className="inline-block bg-orange text-xl px-10 py-4 rounded-full font-semibold hover:bg-orange-dark transition-colors"
            style={{ color: '#FFFFFF' }}
          >
            צרו קשר
          </a>
        </motion.div>
      </div>
    </div>
  )
}
