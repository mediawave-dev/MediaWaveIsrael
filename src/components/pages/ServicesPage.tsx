import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code, Layers, BarChart3, ArrowLeft } from 'lucide-react'
import SEO from '../SEO'

const services = [
  {
    icon: Layers,
    title: 'דפי נחיתה',
    description: 'דפי נחיתה ממוקדי המרה עם עיצוב מותאם אישית, טפסים חכמים וחיבור ל-WhatsApp. מותאמים למובייל ולביצועים גבוהים.',
    href: '/services/landing-pages',
    features: ['עיצוב ממוקד המרה', 'טופסי לידים חכמים', 'חיבור WhatsApp', 'מהירות טעינה גבוהה'],
  },
  {
    icon: Code,
    title: 'אתרים לעסקים',
    description: 'אתרי תדמית מקצועיים לעסקים קטנים ובינוניים. בנויים בקוד מותאם, מהירים, מאובטחים ומותאמים לגוגל.',
    href: '/services/business-websites',
    features: ['עיצוב מותאם אישית', 'ניהול תוכן עצמאי', 'SEO מובנה', 'רספונסיבי 100%'],
  },
  {
    icon: BarChart3,
    title: 'קידום וביצועים',
    description: 'אופטימיזציה למנועי חיפוש, שיפור ביצועים ונראות דיגיטלית. דואגים שהאתר שלכם יופיע בגוגל ובמנועי AI.',
    href: '/#contact',
    features: ['קידום אורגני (SEO)', 'אופטימיזציית מהירות', 'GEO — נראות ב-AI', 'ניתוח ביצועים'],
  },
]

export default function ServicesPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen bg-cream pt-32 pb-20">
      <SEO
        title="שירותי פיתוח אתרים"
        description="שירותי פיתוח אתרים מקצועיים: דפי נחיתה ממירים, אתרי תדמית לעסקים, קידום אורגני ואופטימיזציה. MediaWave Israel — בונים נוכחות דיגיטלית שמביאה תוצאות."
        canonical="/services"
      />
      {/* BreadcrumbList */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ראשי', item: 'https://mediawaveisrael.com/' },
          { '@type': 'ListItem', position: 2, name: 'שירותים', item: 'https://mediawaveisrael.com/services' },
        ],
      }) }} />
      {/* Service structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Web Development',
        provider: {
          '@type': 'Organization',
          name: 'MediaWave Israel',
          url: 'https://mediawaveisrael.com',
        },
        areaServed: { '@type': 'Country', name: 'Israel' },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'שירותי פיתוח אתרים',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'בניית דפי נחיתה' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'בניית אתרים לעסקים' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'קידום אורגני ואופטימיזציה' } },
          ],
        },
      }) }} />

      <div className="container max-w-5xl">
        {/* Answer capsule */}
        <motion.p
          className="text-lg text-brown-light leading-relaxed max-w-3xl mx-auto text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          שירות בניית אתרים של MediaWave Israel כולל עיצוב מותאם אישית, פיתוח בקוד מודרני (React, TypeScript), אופטימיזציה למהירות ו-SEO, התאמה מלאה למובייל, וליווי אישי מהרעיון ועד ההשקה.
        </motion.p>

        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-headline text-brown-dark mb-4">
            השירותים שלנו
          </h1>
          <p className="text-lg text-brown-light max-w-xl mx-auto leading-relaxed">
            מהרעיון הראשוני ועד לנוכחות דיגיטלית מנצחת — בונים אתרים שמביאים תוצאות
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon
            const isExternal = service.href.startsWith('/#')
            return (
              <motion.div
                key={service.title}
                className="bg-white rounded-2xl p-8 border border-cream-darker/30 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 rounded-xl bg-orange/10 flex items-center justify-center mb-5">
                  <Icon size={28} className="text-orange" />
                </div>
                <h2 className="text-2xl font-headline text-brown-dark mb-3">{service.title}</h2>
                <p className="text-brown-light leading-relaxed mb-5 flex-grow">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-brown">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isExternal ? (
                  <a
                    href={service.href}
                    className="inline-flex items-center gap-2 text-orange font-semibold hover:text-orange-dark transition-colors mt-auto"
                  >
                    לפרטים נוספים
                    <ArrowLeft size={16} />
                  </a>
                ) : (
                  <Link
                    to={service.href}
                    className="inline-flex items-center gap-2 text-orange font-semibold hover:text-orange-dark transition-colors mt-auto"
                  >
                    לפרטים נוספים
                    <ArrowLeft size={16} />
                  </Link>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-headline text-brown-dark mb-4">
            מוכנים להתחיל?
          </h2>
          <p className="text-brown-light mb-6">
            ספרו לנו על הפרויקט שלכם ונחזור אליכם עם הצעה מותאמת
          </p>
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
