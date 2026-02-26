import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Globe, Shield, Search, Palette, Settings, Monitor } from 'lucide-react'
import SEO from '../SEO'

const features = [
  { icon: Palette, title: 'עיצוב מותאם אישית', desc: 'עיצוב ייחודי שמשקף את הזהות המותגית של העסק שלכם' },
  { icon: Monitor, title: 'רספונסיבי 100%', desc: 'נראה מושלם בכל מכשיר — מובייל, טאבלט ומחשב' },
  { icon: Settings, title: 'ניהול תוכן עצמאי', desc: 'ממשק ניהול פשוט שמאפשר לעדכן תכנים בלי ידע טכני' },
  { icon: Search, title: 'SEO מובנה', desc: 'מבנה טכני נכון, מפת אתר, ואופטימיזציה למנועי חיפוש' },
  { icon: Shield, title: 'אבטחה ו-SSL', desc: 'תעודת אבטחה, הגנות בסיסיות ועמידה בתקני פרטיות' },
  { icon: Globe, title: 'אחסון ודומיין', desc: 'אחסון מהיר על CDN גלובלי, כולל דומיין ותעודת SSL' },
]

const siteTypes = [
  { title: 'אתר תדמית', desc: 'האתר הקלאסי לעסק — מציג את השירותים, הניסיון והערכים שלכם. מתאים לנותני שירות, יועצים, ובעלי מקצוע.' },
  { title: 'אתר תיק עבודות', desc: 'הצגת פרויקטים ועבודות קודמות בצורה ויזואלית ומרשימה. מתאים למעצבים, צלמים, אדריכלים ומפתחים.' },
  { title: 'אתר עסקי מורכב', desc: 'אתר עם מספר עמודים, בלוג, אזור לקוחות או פיצ\'רים מתקדמים. מתאים לעסקים שרוצים נוכחות דיגיטלית מלאה.' },
]

const faqs = [
  { q: 'מה ההבדל בין אתר תדמית לדף נחיתה?', a: 'דף נחיתה הוא עמוד בודד ממוקד המרה, בעוד אתר תדמית כולל מספר עמודים (ראשי, אודות, שירותים, בלוג, צור קשר) ומציג תמונה שלמה של העסק. אתר מתאים למי שרוצה נוכחות דיגיטלית מלאה ולא רק דף לקמפיין.' },
  { q: 'כמה זמן לוקח לבנות אתר לעסק?', a: 'אתר בסיסי (3-5 עמודים) מוכן תוך 2-3 שבועות. אתר מורכב יותר עם בלוג, CMS ופיצ\'רים מתקדמים — 4-6 שבועות.' },
  { q: 'האם האתר יהיה בבעלות שלי?', a: 'בהחלט. בניגוד לפלטפורמות כמו Wix או WordPress.com, האתר שלכם בנוי בקוד מותאם ונמצא בבעלות מלאה שלכם. אין מנוי חודשי חובה.' },
  { q: 'האם האתר יופיע בגוגל?', a: 'כן. כל אתר כולל אופטימיזציה טכנית ל-SEO, מפת אתר, מבנה נכון לסריקה, ורישום ב-Google Search Console. האתר גם מותאם לנראות במנועי AI כמו ChatGPT.' },
  { q: 'מה כולל המחיר?', a: 'המחיר כולל עיצוב מותאם, פיתוח, אחסון שנתי, דומיין, תעודת SSL, אופטימיזציית SEO בסיסית, והדרכה על ניהול האתר.' },
]

export default function BusinessWebsitesService() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen bg-cream pt-32 pb-20">
      <SEO
        title="בניית אתרים לעסקים"
        description="בניית אתרי תדמית מקצועיים לעסקים קטנים ובינוניים. עיצוב מותאם, ניהול תוכן עצמאי, SEO מובנה, רספונסיבי ומאובטח. MediaWave Israel — אתר שעובד בשבילכם 24/7."
        canonical="/services/business-websites"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ראשי', item: 'https://mediawaveisrael.com/' },
          { '@type': 'ListItem', position: 2, name: 'שירותים', item: 'https://mediawaveisrael.com/services' },
          { '@type': 'ListItem', position: 3, name: 'אתרים לעסקים', item: 'https://mediawaveisrael.com/services/business-websites' },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'בניית אתרים לעסקים',
        description: 'בניית אתרי תדמית מקצועיים לעסקים קטנים ובינוניים בישראל',
        provider: { '@type': 'Organization', name: 'MediaWave Israel', url: 'https://mediawaveisrael.com' },
        areaServed: { '@type': 'Country', name: 'Israel' },
        serviceType: 'Business Website Development',
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
          אתר תדמית לעסק כולל עיצוב מותאם אישית, מספר עמודים (ראשי, אודות, שירותים, צור קשר), ניהול תוכן עצמאי, אופטימיזציה ל-SEO, אבטחת SSL, ומותאם לכל מכשיר. ההבדל מדף נחיתה: אתר מציג תמונה שלמה של העסק ולא רק מטרה אחת.
        </motion.p>

        {/* Hero */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-headline text-brown-dark mb-4">
            בניית אתרים לעסקים
          </h1>
          <p className="text-lg text-brown-light max-w-xl mx-auto leading-relaxed">
            אתר מקצועי שעובד בשבילכם 24/7 — בונה אמינות, מייצר פניות ומחזק את הנוכחות הדיגיטלית
          </p>
        </motion.div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-headline text-brown-dark mb-8 text-center">מה מקבלים?</h2>
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

        {/* Site types */}
        <div className="mb-16">
          <h2 className="text-2xl font-headline text-brown-dark mb-8 text-center">סוגי אתרים שאנחנו בונים</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {siteTypes.map((type, i) => (
              <motion.div
                key={type.title}
                className="bg-white rounded-xl p-6 border border-cream-darker/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <h3 className="font-semibold text-brown-dark mb-2">{type.title}</h3>
                <p className="text-sm text-brown-light leading-relaxed">{type.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-headline text-brown-dark mb-8 text-center">שאלות נפוצות על בניית אתרים</h2>
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
          <Link to="/services/landing-pages" className="text-brown-light hover:text-orange transition-colors">דפי נחיתה</Link>
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
            מוכנים לבנות אתר לעסק?
          </h2>
          <p className="text-brown-light mb-6">ספרו לנו על העסק שלכם ונחזור עם הצעה מותאמת</p>
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
