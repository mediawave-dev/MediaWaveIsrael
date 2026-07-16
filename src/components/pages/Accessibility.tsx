import { useEffect } from 'react'
import { m } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SEO from '../SEO'
import { SITE_CONTACT } from '../../data/site'
import { track } from '../../utils/analytics'

export default function Accessibility() {
  const navigate = useNavigate()

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleBackClick = () => {
    navigate('/')
  }

  return (
    <main className="min-h-screen bg-cream pt-32 pb-16">
      <SEO
        title="הצהרת נגישות"
        description="הצהרת הנגישות של MediaWave Israel: התאמות הנגישות באתר, רמת התאימות ודרכי פנייה בנושאי נגישות."
        canonical="/accessibility"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ראשי', item: 'https://mediawave.co.il/' },
          { '@type': 'ListItem', position: 2, name: 'הצהרת נגישות', item: 'https://mediawave.co.il/accessibility' },
        ],
      }) }} />
      <div className="container max-w-[900px] mx-auto px-4 sm:px-6">
        {/* Back link */}
        <m.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 text-brown hover:text-sky-ink transition-colors py-2 cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            חזרה לעמוד הבית
          </button>
        </m.div>

        {/* Header */}
        <m.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-[32px] md:text-[40px] font-headline font-bold text-brown-dark mb-4">
            הצהרת נגישות | MediaWave Israel
          </h1>
          <p className="text-brown-light">
            <strong>עודכן לאחרונה:</strong> יולי 2026
          </p>
        </m.header>

        {/* Content */}
        <m.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          {/* Section 1 - מחויבות לנגישות */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              1. המחויבות שלנו לנגישות
            </h2>
            <p className="text-brown leading-relaxed mb-4">
              MediaWave Israel רואה חשיבות רבה במתן שירות שוויוני לכלל הגולשים, לרבות אנשים עם מוגבלות.
              אנו משקיעים משאבים ומאמצים כדי להנגיש את האתר בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות
              (התאמות נגישות לשירות), התשע"ג-2013, ולתקן הישראלי ת"י 5568 המבוסס על הנחיות
              WCAG 2.0 ברמה AA.
            </p>
          </section>

          {/* Section 2 - התאמות הנגישות באתר */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              2. התאמות הנגישות באתר
            </h2>
            <p className="text-brown leading-relaxed mb-3">
              באתר מוטמע רכיב נגישות ייעודי (נפתח בלחיצה על כפתור הנגישות), המאפשר:
            </p>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4 mb-6">
              <li><strong>הגדלת גודל הטקסט</strong> במספר רמות</li>
              <li><strong>מצב ניגודיות גבוהה</strong> לשיפור קריאות</li>
              <li><strong>עצירת אנימציות</strong> ותנועה באתר</li>
            </ul>
            <p className="text-brown leading-relaxed mb-3">
              בנוסף, האתר כולל התאמות מובנות:
            </p>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>ניווט מלא באמצעות מקלדת, כולל קישור "דלג לתוכן הראשי"</li>
              <li>תמיכה בקוראי מסך: תגיות ARIA ומבנה כותרות תקין</li>
              <li>כיבוד העדפת המערכת להפחתת תנועה (prefers-reduced-motion): אנימציות כניסה, וידאו ותנועות גדולות נעצרות, ואנימציות רקע עדינות מואטות. ניתן לכבות את כל האנימציות לחלוטין דרך ווידג'ט הנגישות באתר</li>
              <li>סימון פוקוס ברור בכל הרכיבים האינטראקטיביים</li>
              <li>אזורי לחיצה בגודל מספק במובייל</li>
              <li>טקסט חלופי לתמונות וניגודיות צבעים תקינה</li>
            </ul>
          </section>

          {/* Section 3 - סייגים */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              3. סייגים והבהרות
            </h2>
            <p className="text-brown leading-relaxed mb-4">
              אנו פועלים באופן שוטף לשיפור נגישות האתר. ייתכן שיתגלו רכיבים או עמודים שטרם הונגשו
              במלואם. אם נתקלתם בקושי או בבעיה, נשמח שתפנו אלינו ונטפל בכך בהקדם האפשרי.
            </p>
          </section>

          {/* Section 4 - יצירת קשר */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              4. פנייה בנושאי נגישות
            </h2>
            <p className="text-brown leading-relaxed mb-3">
              נתקלתם בבעיית נגישות באתר? יש לכם הצעה לשיפור? נשמח לשמוע:
            </p>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>
                <strong>טלפון:</strong>{' '}
                <a href={`tel:${SITE_CONTACT.phone.replace(/-/g, '')}`} className="text-sky-ink hover:underline" dir="ltr" onClick={() => track('tel_click', { placement: 'accessibility_page' })}>
                  {SITE_CONTACT.phone}
                </a>
              </li>
              <li>
                <strong>דוא"ל:</strong>{' '}
                <a href={`mailto:${SITE_CONTACT.email}`} className="text-sky-ink hover:underline" dir="ltr" onClick={() => track('mailto_click', { placement: 'accessibility_page' })}>
                  {SITE_CONTACT.email}
                </a>
              </li>
            </ul>
            <p className="text-brown leading-relaxed mt-4">
              אנו מתחייבים לטפל בכל פנייה בנושא נגישות בתוך פרק זמן סביר.
            </p>
          </section>
        </m.article>
      </div>
    </main>
  )
}
