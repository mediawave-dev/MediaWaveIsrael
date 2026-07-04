import { useEffect } from 'react'
import { m } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SEO from '../SEO'

export default function Privacy() {
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
        title="מדיניות פרטיות"
        description="מדיניות הפרטיות של MediaWave Israel: כיצד אנו אוספים, משתמשים ומגנים על המידע שלכם."
        canonical="/privacy"
      />
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
            className="inline-flex items-center gap-2 text-brown hover:text-orange transition-colors py-2 cursor-pointer"
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
            מדיניות פרטיות | MediaWave Israel
          </h1>
          <p className="text-brown-light">
            <strong>עודכן לאחרונה:</strong> ינואר 2026
          </p>
        </m.header>

        {/* Content */}
        <m.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          {/* Section 1 - מבוא */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              1. מבוא
            </h2>
            <p className="text-brown leading-relaxed mb-4">
              MediaWave Israel (להלן: "אנו", "שלנו", "החברה") מחויבת להגן על פרטיותך. מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים, ומגנים על המידע האישי שלך.
            </p>
            <p className="text-brown leading-relaxed">
              השימוש באתר שלנו מהווה הסכמה למדיניות פרטיות זו.
            </p>
          </section>

          {/* Section 2 - איזה מידע אנו אוספים */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              2. איזה מידע אנו אוספים?
            </h2>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">2.1 מידע שאתה מספק לנו</h3>
            <p className="text-brown leading-relaxed mb-3">
              כאשר אתה יוצר קשר איתנו או מזמין שירותים, אנו עשויים לאסוף:
            </p>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li><strong>שם מלא</strong></li>
              <li><strong>כתובת דואר אלקטרוני</strong></li>
              <li><strong>מספר טלפון</strong></li>
              <li><strong>פרטי העסק</strong> (שם עסק, תחום פעילות)</li>
              <li><strong>תוכן ההודעה</strong> שלך</li>
              <li><strong>כל מידע אחר</strong> שתבחר לשתף איתנו</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">2.2 מידע שנאסף אוטומטית</h3>
            <p className="text-brown leading-relaxed mb-3">
              כאשר אתה מבקר באתר שלנו, אנו עשויים לאסוף:
            </p>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li><strong>כתובת IP</strong></li>
              <li><strong>סוג דפדפן ומכשיר</strong></li>
              <li><strong>דפים שבהם ביקרת</strong></li>
              <li><strong>זמן ותאריך הביקור</strong></li>
              <li><strong>מקור ההפניה</strong> (מאיפה הגעת לאתר)</li>
            </ul>
            <p className="text-brown leading-relaxed mt-3">
              מידע זה נאסף באמצעות עוגיות (Cookies) וטכנולוגיות דומות.
            </p>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">2.3 מידע ממקורות חיצוניים</h3>
            <p className="text-brown leading-relaxed">
              אנו לא אוספים מידע עליך ממקורות חיצוניים.
            </p>
          </section>

          {/* Section 3 - כיצד אנו משתמשים במידע */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              3. כיצד אנו משתמשים במידע?
            </h2>
            <p className="text-brown leading-relaxed mb-4">
              אנו משתמשים במידע שלך למטרות הבאות:
            </p>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">3.1 מתן שירותים</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li><strong>תקשורת איתך:</strong> לענות על שאלות, לספק הצעות מחיר, ולתאם פרויקטים</li>
              <li><strong>ביצוע הפרויקט:</strong> פיתוח ועיצוב האתר שלך</li>
              <li><strong>תמיכה טכנית:</strong> לספק סיוע ותחזוקה</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">3.2 שיפור השירותים</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li><strong>ניתוח שימוש:</strong> להבין כיצד משתמשים מנווטים באתר שלנו</li>
              <li><strong>שיפור חווית משתמש:</strong> לשפר את העיצוב והתכונות של האתר</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">3.3 תקשורת שיווקית (רק באישורך)</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li><strong>ניוזלטר:</strong> עדכונים על שירותים חדשים, טיפים, ומבצעים (רק אם נרשמת)</li>
              <li><strong>הצעות מיוחדות:</strong> מידע על מבצעים רלוונטיים</li>
            </ul>
            <p className="text-brown leading-relaxed mt-4 bg-cream-dark p-4 rounded-lg">
              <strong>הערה חשובה:</strong> אנו לא נשלח לך תוכן שיווקי ללא הסכמתך המפורשת. תמיד תוכל להסיר עצמך מרשימת התפוצה.
            </p>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">3.4 דרישות חוקיות</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li><strong>עמידה בחוק:</strong> כאשר נדרש על פי חוק או צו שיפוטי</li>
            </ul>
          </section>

          {/* Section 4 - שיתוף מידע עם צדדים שלישיים */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              4. שיתוף מידע עם צדדים שלישיים
            </h2>
            <p className="text-brown leading-relaxed mb-4">
              אנו <strong>לא מוכרים, לא מחכירים, ולא משתפים</strong> את המידע האישי שלך עם צדדים שלישיים למטרות שיווקיות.
            </p>
            <p className="text-brown leading-relaxed mb-4">
              עם זאת, אנו עשויים לשתף מידע במקרים הבאים:
            </p>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">4.1 ספקי שירות</h3>
            <p className="text-brown leading-relaxed mb-3">
              אנו עשויים לשתף מידע עם ספקי שירות שעוזרים לנו להפעיל את העסק, כגון:
            </p>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li><strong>שירותי אחסון</strong> (Cloudflare Pages, Netlify)</li>
              <li><strong>שירותי אימייל</strong> (Gmail, SendGrid)</li>
              <li><strong>כלי ניתוח</strong> (Google Analytics, אם משתמשים)</li>
            </ul>
            <p className="text-brown leading-relaxed mt-3">
              כל ספקי השירות מחויבים לשמור על פרטיותך ואינם רשאים להשתמש במידע למטרות אחרות.
            </p>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">4.2 דרישות חוקיות</h3>
            <p className="text-brown leading-relaxed">
              במקרים בהם נדרש על פי חוק, צו שיפוטי, או כדי להגן על זכויותינו.
            </p>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">4.3 העברת עסק</h3>
            <p className="text-brown leading-relaxed">
              במקרה של מיזוג, רכישה, או מכירת נכסים, המידע שלך עשוי להיות מועבר לגוף החדש.
            </p>
          </section>

          {/* Section 5 - אבטחת מידע */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              5. אבטחת מידע
            </h2>
            <p className="text-brown leading-relaxed mb-4">
              אנו נוקטים באמצעי אבטחה סבירים כדי להגן על המידע שלך:
            </p>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li><strong>הצפנה:</strong> האתר שלנו משתמש בתעודת SSL (HTTPS) להצפנת נתונים</li>
              <li><strong>גישה מוגבלת:</strong> רק בעלי תפקידים מורשים יכולים לגשת למידע האישי</li>
              <li><strong>עדכוני אבטחה:</strong> אנו מעדכנים באופן שוטף את המערכות שלנו</li>
              <li><strong>גיבויים:</strong> מבוצעים גיבויים קבועים למניעת אובדן מידע</li>
            </ul>
            <p className="text-brown leading-relaxed mt-4">
              עם זאת, אף שיטת העברה או אחסון אינה מאובטחת ב-100%. אנו לא יכולים להבטיח אבטחה מוחלטת.
            </p>
          </section>

          {/* Section 6 - זכויותיך */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              6. זכויותיך
            </h2>
            <p className="text-brown leading-relaxed mb-4">
              בהתאם לחוק הגנת הפרטיות התשמ"א-1981, יש לך את הזכויות הבאות:
            </p>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">6.1 זכות עיון</h3>
            <p className="text-brown leading-relaxed">
              אתה רשאי לבקש לעיין במידע האישי המוחזק עליך.
            </p>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">6.2 זכות תיקון</h3>
            <p className="text-brown leading-relaxed">
              אתה רשאי לבקש לתקן מידע שגוי או לא מדויק.
            </p>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">6.3 זכות מחיקה</h3>
            <p className="text-brown leading-relaxed">
              אתה רשאי לבקש למחוק את המידע האישי שלך, בכפוף למגבלות חוקיות.
            </p>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">6.4 זכות להתנגד</h3>
            <p className="text-brown leading-relaxed">
              אתה רשאי להתנגד לשימוש במידע שלך למטרות שיווקיות.
            </p>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">6.5 זכות לניידות</h3>
            <p className="text-brown leading-relaxed">
              אתה רשאי לבקש להעביר את המידע שלך לספק אחר.
            </p>

            <div className="bg-cream-dark p-4 rounded-lg mt-6">
              <p className="text-brown leading-relaxed">
                <strong>כיצד לממש את זכויותיך?</strong><br />
                צור קשר איתנו בכתובת: mediawaveisrael@gmail.com
              </p>
            </div>
          </section>

          {/* Section 7 - עוגיות (Cookies) */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              7. עוגיות (Cookies)
            </h2>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">7.1 מה הן עוגיות?</h3>
            <p className="text-brown leading-relaxed">
              עוגיות הן קבצים קטנים הנשמרים במחשב או במכשיר הנייד שלך כאשר אתה מבקר באתר.
            </p>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">7.2 כיצד אנו משתמשים בעוגיות?</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li><strong>עוגיות חיוניות:</strong> נדרשות לתפקוד בסיסי של האתר</li>
              <li><strong>עוגיות ניתוח:</strong> עוזרות לנו להבין כיצד משתמשים מנווטים באתר (Google Analytics)</li>
              <li><strong>עוגיות פונקציונליות:</strong> זוכרות את ההעדפות שלך</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">7.3 ניהול עוגיות</h3>
            <p className="text-brown leading-relaxed">
              אתה יכול לחסום או למחוק עוגיות דרך הגדרות הדפדפן שלך. שים לב שחסימת עוגיות עלולה להשפיע על חווית השימוש באתר.
            </p>
          </section>

          {/* Section 8 - קישורים לאתרים חיצוניים */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              8. קישורים לאתרים חיצוניים
            </h2>
            <p className="text-brown leading-relaxed mb-4">
              האתר שלנו עשוי להכיל קישורים לאתרים חיצוניים. אנו לא אחראים למדיניות הפרטיות או לתוכן של אתרים אלה.
            </p>
            <p className="text-brown leading-relaxed">
              אנו ממליצים לקרוא את מדיניות הפרטיות של כל אתר שאתה מבקר בו.
            </p>
          </section>

          {/* Section 9 - פרטיות ילדים */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              9. פרטיות ילדים
            </h2>
            <p className="text-brown leading-relaxed mb-4">
              האתר שלנו אינו מיועד לילדים מתחת לגיל 18. אנו לא אוספים ביודעין מידע אישי מילדים.
            </p>
            <p className="text-brown leading-relaxed">
              אם אתה הורה וגילית שילדך סיפק לנו מידע אישי, אנא צור קשר ונמחק את המידע.
            </p>
          </section>

          {/* Section 10 - שמירת מידע */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              10. שמירת מידע
            </h2>
            <p className="text-brown leading-relaxed mb-4">
              אנו שומרים את המידע האישי שלך כל עוד:
            </p>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li><strong>אתה לקוח פעיל:</strong> לצורך מתן שירותים שוטפים</li>
              <li><strong>נדרש לפי חוק:</strong> לצורך תיעוד חשבונאי, דיווחי מס וכו' (בדרך כלל 7 שנים)</li>
              <li><strong>יש צורך עסקי לגיטימי:</strong> כגון פתרון סכסוכים</li>
            </ul>
            <p className="text-brown leading-relaxed mt-4">
              לאחר מכן, נמחק או נאנונם את המידע.
            </p>
          </section>

          {/* Section 11 - העברת מידע בינלאומית */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              11. העברת מידע בינלאומית
            </h2>
            <p className="text-brown leading-relaxed mb-4">
              המידע שלך עשוי להיות מאוחסן בשרתים הממוקמים מחוץ לישראל (למשל, שרתי Cloudflare).
            </p>
            <p className="text-brown leading-relaxed">
              אנו מוודאים שספקי השירות שלנו עומדים בתקני הגנת פרטיות מתאימים.
            </p>
          </section>

          {/* Section 12 - שינויים במדיניות הפרטיות */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              12. שינויים במדיניות הפרטיות
            </h2>
            <p className="text-brown leading-relaxed mb-4">
              אנו עשויים לעדכן מדיניות פרטיות זו מעת לעת. שינויים מהותיים יפורסמו באתר עם ציון התאריך העדכני.
            </p>
            <p className="text-brown leading-relaxed">
              המשך השימוש באתר לאחר שינויים מהווה הסכמה למדיניות המעודכנת.
            </p>
          </section>

          {/* Section 13 - יצירת קשר */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              13. יצירת קשר
            </h2>
            <p className="text-brown leading-relaxed mb-4">
              לשאלות, בקשות, או חששות בנוגע למדיניות הפרטיות, ניתן ליצור קשר:
            </p>
            <div className="bg-cream-dark rounded-xl p-6 space-y-3">
              <p className="text-brown-dark font-semibold text-lg">MediaWave Israel</p>
              <div className="space-y-2 text-brown">
                <p className="flex items-center gap-2">
                  <span>📧</span>
                  <a href="mailto:mediawaveisrael@gmail.com" className="hover:text-orange transition-colors" dir="ltr">
                    mediawaveisrael@gmail.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span>📱</span>
                  <a href="tel:052-8731808" className="hover:text-orange transition-colors" dir="ltr">
                    052-8731808
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span>💬</span>
                  <a
                    href="https://wa.me/972528731808"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange transition-colors"
                  >
                    WhatsApp
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Last updated */}
          <div className="mt-12 pt-6 border-t border-cream-darker text-brown-muted text-sm">
            <p><strong>תאריך עדכון אחרון:</strong> ינואר 2026</p>
            <p className="mt-2">אנו מחויבים להגן על פרטיותך ולספק שירות שקוף ואמין.</p>
          </div>
        </m.article>
      </div>
    </main>
  )
}
