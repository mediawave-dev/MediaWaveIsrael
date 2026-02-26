import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { Heart, Lightbulb, Eye, Users } from 'lucide-react'
import SEO from '../SEO'

// Animated counter component
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    if (isInView) {
      animate(count, target, { duration: 2, ease: 'easeOut' })
    }
  }, [isInView, count, target])

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => {
      if (ref.current) ref.current.textContent = `${v}${suffix}`
    })
    return unsubscribe
  }, [rounded, suffix])

  return <span ref={ref}>0{suffix}</span>
}

const counters = [
  { label: 'שנות ניסיון', target: 5, suffix: '+' },
  { label: 'פרויקטים שהושלמו', target: 30, suffix: '+' },
  { label: 'טכנולוגיות', target: 12, suffix: '' },
  { label: 'לקוחות מרוצים', target: 25, suffix: '+' },
]

const values = [
  { icon: Heart, title: 'איכות ללא פשרות', desc: 'כל שורת קוד, כל פיקסל, כל פרט — נבדק ומושלם. אנחנו לא מספקים עבודה שאנחנו לא גאים בה.' },
  { icon: Eye, title: 'שקיפות מלאה', desc: 'מחיר ברור מראש, לוח זמנים מוגדר, תקשורת פתוחה. בלי הפתעות ובלי אותיות קטנות.' },
  { icon: Lightbulb, title: 'חדשנות', desc: 'עובדים עם הטכנולוגיות המתקדמות ביותר. מה שמסתובב בשוק הוא לא מספיק טוב — אנחנו מחפשים את מה שהכי טוב.' },
  { icon: Users, title: 'ליווי אישי', desc: 'לא בוטים, לא מענה אוטומטי. אדם אמיתי שמלווה אתכם מהרגע הראשון ועד אחרי ההשקה.' },
]

const technologies = [
  'React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Node.js', 'Vite',
  'Framer Motion', 'Puppeteer', 'Directus CMS', 'Docker', 'Git', 'Figma',
]

export default function About() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen bg-cream pt-32 pb-20">
      <SEO
        title="אודות MediaWave | סטודיו לפיתוח אתרים"
        description="MediaWave Israel — סטודיו בוטיק לפיתוח אתרים ודפי נחיתה. ניסיון של שנים בבניית אתרים מקצועיים לעסקים קטנים ובינוניים בישראל עם טכנולוגיות מתקדמות."
        canonical="/about"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ראשי', item: 'https://mediawaveisrael.com/' },
          { '@type': 'ListItem', position: 2, name: 'אודות', item: 'https://mediawaveisrael.com/about' },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'MediaWave Israel',
        url: 'https://mediawaveisrael.com',
        logo: 'https://mediawaveisrael.com/og-image.png',
        description: 'סטודיו בוטיק לפיתוח אתרים ודפי נחיתה לעסקים קטנים ובינוניים בישראל',
        foundingDate: '2021',
        knowsAbout: ['React', 'TypeScript', 'Web Development', 'SEO', 'Landing Pages', 'Tailwind CSS', 'Node.js'],
        areaServed: { '@type': 'Country', name: 'Israel' },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+972-52-873-1808',
          email: 'mediawaveisrael@gmail.com',
          contactType: 'customer service',
          availableLanguage: ['Hebrew', 'English'],
        },
        sameAs: [
          'https://wa.me/972528731808',
          'https://www.instagram.com/mediawaveisrael',
        ],
      }) }} />

      <div className="container max-w-4xl">
        {/* Answer capsule */}
        <motion.p
          className="text-lg text-brown-light leading-relaxed max-w-3xl mx-auto text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          MediaWave Israel היא סטודיו בוטיק לפיתוח אתרים ודפי נחיתה לעסקים קטנים ובינוניים בישראל. אנחנו מתמחים בבניית אתרים מותאמים אישית עם טכנולוגיות מתקדמות כמו React ו-TypeScript, עם דגש על ביצועים גבוהים, עיצוב ייחודי וליווי אישי.
        </motion.p>

        {/* Hero */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-headline text-brown-dark mb-4">
            הסיפור שלנו
          </h1>
          <p className="text-lg text-brown-light max-w-2xl mx-auto leading-relaxed">
            התחלנו מתוך אמונה אחת פשוטה: לכל עסק בישראל מגיע אתר מקצועי שעובד. לא תבנית גנרית, לא פתרון מדף — אלא אתר שנבנה בדיוק בשביל העסק שלכם, עם הטכנולוגיות הכי מתקדמות בשוק.
          </p>
        </motion.div>

        {/* Trust counters */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {counters.map((c, i) => (
              <motion.div
                key={c.label}
                className="text-center bg-white rounded-xl p-6 border border-cream-darker/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="text-4xl font-headline text-orange mb-1">
                  <Counter target={c.target} suffix={c.suffix} />
                </div>
                <p className="text-sm text-brown-light">{c.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <motion.h2
            className="text-2xl font-headline text-brown-dark mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            מה מנחה אותנו
          </motion.h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <motion.div
                  key={v.title}
                  className="bg-white rounded-xl p-6 border border-cream-darker/30"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Icon size={24} className="text-orange mb-3" />
                  <h3 className="font-semibold text-brown-dark mb-2">{v.title}</h3>
                  <p className="text-sm text-brown-light leading-relaxed">{v.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mb-16">
          <motion.h2
            className="text-2xl font-headline text-brown-dark mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            הטכנולוגיות שלנו
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-3">
            {technologies.map((tech, i) => (
              <motion.span
                key={tech}
                className="bg-white border border-cream-darker/30 px-4 py-2 rounded-full text-sm text-brown font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Why choose us */}
        <div className="mb-16">
          <motion.h2
            className="text-2xl font-headline text-brown-dark mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            למה לבחור ב-MediaWave?
          </motion.h2>
          <motion.div
            className="bg-white rounded-xl p-8 border border-cream-darker/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ul className="space-y-4 text-brown leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-orange mt-2 flex-shrink-0" />
                <span><strong>קוד מותאם, לא תבניות:</strong> כל אתר נבנה מאפס בקוד — מהיר, מאובטח, וללא תלות בפלטפורמה</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-orange mt-2 flex-shrink-0" />
                <span><strong>בעלות מלאה:</strong> האתר שלכם — ב-100%. אין מנוי חודשי, אין אותיות קטנות</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-orange mt-2 flex-shrink-0" />
                <span><strong>ביצועים מוכחים:</strong> ציוני PageSpeed של 95-100, זמן טעינה של פחות מ-2 שניות</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-orange mt-2 flex-shrink-0" />
                <span><strong>SEO + GEO מובנה:</strong> מותאם לגוגל וגם למנועי AI כמו ChatGPT ו-Perplexity</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-orange mt-2 flex-shrink-0" />
                <span><strong>ליווי מקצועי:</strong> מהשיחה הראשונה ועד אחרי ההשקה — תמיד יש למי לפנות</span>
              </li>
            </ul>
          </motion.div>
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
            בואו נדבר על הפרויקט שלכם
          </h2>
          <p className="text-brown-light mb-6">שיחת אפיון קצרה ללא התחייבות — נשמח להכיר</p>
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
