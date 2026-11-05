import { useEffect } from 'react'
import { m } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SEO from '../SEO'
import { track } from '../../utils/analytics'
import { SITE_CONTACT } from '../../data/site'

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
    <div className="min-h-screen bg-cream pt-32 pb-16">
      <SEO
        title="מדיניות פרטיות"
        description="מדיניות הפרטיות של MediaWave Israel: כיצד אנו אוספים, משתמשים ומגנים על המידע שלכם."
        canonical="/privacy"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ראשי', item: 'https://mediawave.co.il/' },
          { '@type': 'ListItem', position: 2, name: 'מדיניות פרטיות', item: 'https://mediawave.co.il/privacy' },
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
            מדיניות פרטיות | MediaWave Israel
          </h1>
          <p className="text-brown-light">
            <strong>עודכן לאחרונה:</strong> נובמבר 2026
          </p>
        </m.header>

        {/* Content */}
        <m.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          <PrivacyBody />
        </m.article>
      </div>
    </div>
  )
}

const H2 = 'text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker'
const H3 = 'text-[18px] font-semibold text-brown-dark mt-6 mb-3'
const P = 'text-brown leading-relaxed mb-4'
const UL = 'list-disc list-inside space-y-2 text-brown leading-relaxed mr-4 mb-4'

/** The legal text itself, shared with the shot look's own frame (D90). Rewritten in November 2026 to
 * describe what the site does today: forms that hand off to WhatsApp, the AI chat, first-party events. */
export function PrivacyBody() {
  return (
    <>
          <section className="mb-10">
            <h2 className={H2}>1. מי אנחנו ועל מה המדיניות</h2>
            <p className={P}>
              MediaWave Israel (להלן: "אנחנו") בונה אתרים ודפי נחיתה, עורכת סרטונים וממירה קלטות. המדיניות הזו מתארת איזה מידע עובר אלינו דרך האתר mediawave.co.il, למה אנחנו צריכים אותו, למי הוא מועבר וכמה זמן הוא נשמר.
            </p>
            <p className={P}>
              אתם לא חייבים לפי חוק למסור לנו מידע כלשהו. אם לא תשאירו שם ודרך ליצור קשר, לא נוכל לחזור אליכם.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>2. מה אנחנו אוספים ואיך</h2>

            <h3 className={H3}>2.1 טפסים באתר</h3>
            <p className={P}>
              בטפסים באתר (יצירת קשר, "השאירו פרטים", הטופס בסטודיו הסגנונות ו"האתר שלכם") אפשר לכתוב שם, טלפון, אימייל, שם העסק וכמה מילים על מה שאתם צריכים. השדות משתנים מטופס לטופס.
            </p>
            <p className={P}>
              הטפסים לא שולחים את הפרטים לשרת שלנו. בלחיצה על השליחה נפתחת אצלכם הודעת וואטסאפ כתובה, והיא מגיעה אלינו רק אם תלחצו "שלח" בוואטסאפ. מאותו רגע ההודעה נשמרת אצלנו בוואטסאפ, כמו כל הודעה שתשלחו לנו ישירות.
            </p>

            <h3 className={H3}>2.2 הצ'אט באתר</h3>
            <p className={P}>
              את התשובות בצ'אט כותבת בינה מלאכותית (Claude של חברת Anthropic). מה שאתם כותבים בצ'אט עובר דרך השרת שלנו אל Anthropic כדי לייצר תשובה. אנחנו לא שומרים את השיחה, והיא נמחקת מהדפדפן כשסוגרים את הדף. לא לכתוב בצ'אט פרטים רגישים, כמו מידע רפואי, פרטי תשלום או סיסמאות.
            </p>

            <h3 className={H3}>2.3 פנייה ישירה</h3>
            <p className={P}>
              אם תפנו אלינו בוואטסאפ, בטלפון, באימייל או באינסטגרם, נקבל את מה ששלחתם באותו ערוץ.
            </p>

            <h3 className={H3}>2.4 מידע טכני</h3>
            <ul className={UL}>
              <li>
                אירועי שימוש: כשלוחצים על כפתור וואטסאפ, טלפון או אימייל, או שולחים טופס, נרשם אירוע עם סוג הלחיצה, העמוד והשעה. האירוע לא כולל כתובת IP, שם או פרט מזהה אחר, ואין בו עוגיות.
              </li>
              <li>
                האתר מאוחסן ב-Cloudflare. כמו כל שרת, Cloudflare מקבלת את כתובת ה-IP ופרטי הדפדפן של כל ביקור כדי להגיש את האתר ולהגן עליו מפני תקיפות. השרת שלנו משתמש בכתובת ה-IP גם כדי להגביל את מספר הודעות הצ'אט מכל כתובת, ולא שומר אותה.
              </li>
              <li>
                האתר לא משתמש בעוגיות מעקב או פרסום, ולא ב-Google Analytics. הדפדפן שלכם שומר אצלו כמה העדפות (למשל, הבחירה בהודעת העוגיות והאם המוזיקה פועלת). ההעדפות האלה לא נשלחות אלינו. הגדרות הנגישות לא נשמרות בכלל.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className={H2}>3. למה אנחנו משתמשים במידע</h2>
            <ul className={UL}>
              <li>לחזור אליכם, לענות על שאלות ולתת הצעת מחיר.</li>
              <li>לבצע את העבודה שהזמנתם וללוות אתכם אחריה.</li>
              <li>להבין אילו כפתורים ועמודים מביאים פניות, כדי לשפר את האתר. לשם כך אנחנו משתמשים רק באירועים שבסעיף 2.4.</li>
              <li>לעמוד בחובות לפי חוק, כמו הנהלת חשבונות.</li>
            </ul>
            <p className={P}>
              לא נשלח לכם דיוור או פרסומת בלי שתבקשו זאת במפורש. האישור של המדיניות הזו בטופס הוא לא הסכמה לדיוור.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>4. למי המידע מועבר</h2>
            <p className={P}>
              אנחנו לא מוכרים מידע ולא מעבירים אותו למטרות שיווק. המידע עובר רק לספקים שדרכם האתר והעסק פועלים:
            </p>
            <ul className={UL}>
              <li>Meta (וואטסאפ ואינסטגרם): ההודעות שאתם שולחים לנו שם.</li>
              <li>Anthropic: מה שכותבים בצ'אט, כדי לייצר תשובה.</li>
              <li>Cloudflare: אחסון האתר והשרת שמעביר את הצ'אט.</li>
              <li>Google (Gmail): אימיילים שאתם שולחים לנו.</li>
            </ul>
            <p className={P}>
              נמסור מידע גם אם חוק או צו של בית משפט יחייבו אותנו.
            </p>
            <p className={P}>
              הספקים האלה מעבדים מידע גם בשרתים מחוץ לישראל. כל ספק פועל לפי מדיניות הפרטיות ותנאי השימוש שלו.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>5. כמה זמן המידע נשמר</h2>
            <p className={P}>
              הודעות ופרטי קשר נשמרים כל עוד הם נחוצים לטיפול בפנייה ולעבודה המשותפת. מסמכים שהחוק מחייב לשמור, כמו חשבוניות, נשמרים לתקופה שהחוק קובע. אפשר לבקש מאיתנו למחוק פנייה בכל זמן (סעיף 7).
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>6. אבטחת מידע</h2>
            <p className={P}>
              האתר מוגש רק ב-HTTPS, והגישה לחשבונות שבהם נשמרות הפניות מוגבלת לנו בלבד. אין שיטה שמבטיחה אבטחה מלאה, אבל אנחנו נוקטים אמצעים סבירים כדי להגן על המידע.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>7. הזכויות שלכם</h2>
            <p className={P}>
              לפי חוק הגנת הפרטיות, התשמ"א-1981, אתם רשאים:
            </p>
            <ul className={UL}>
              <li>לעיין במידע שיש לנו עליכם.</li>
              <li>לבקש שנתקן מידע לא נכון או לא מעודכן, או שנמחק אותו.</li>
              <li>לבקש שנפסיק לפנות אליכם.</li>
            </ul>
            <p className={P}>
              כדי לממש את הזכויות, כתבו לנו ל-<a href={`mailto:${SITE_CONTACT.email}`} className="underline underline-offset-2" dir="ltr">{SITE_CONTACT.email}</a>. נענה תוך 30 יום.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>8. קטינים</h2>
            <p className={P}>
              השירותים שלנו מיועדים לבעלי עסקים מגיל 18. אם קטין השאיר אצלנו פרטים, כתבו לנו ונמחק אותם.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>9. קישורים לאתרים אחרים</h2>
            <p className={P}>
              באתר יש קישורים לאתרים אחרים, למשל וואטסאפ, אינסטגרם והאתרים שמוצגים כהשראה בסטודיו. מדיניות הפרטיות שלהם לא תלויה בנו.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>10. שינויים במדיניות</h2>
            <p className={P}>
              כשהאתר משתנה, נעדכן את המדיניות ואת התאריך שלה. אם נרצה להשתמש במידע שכבר מסרתם למטרה חדשה, נבקש את הסכמתכם קודם.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>11. יצירת קשר</h2>
            <p className={P}>
              לשאלות ולבקשות בנוגע לפרטיות:
            </p>
            <div className="bg-cream-dark rounded-xl p-6 space-y-3">
              <p className="text-brown-dark font-semibold text-lg">MediaWave Israel</p>
              <div className="space-y-2 text-brown">
                <p>
                  אימייל:{' '}
                  <a href={`mailto:${SITE_CONTACT.email}`} className="hover:text-sky-ink-strong transition-colors" dir="ltr" onClick={() => track('mailto_click', { placement: 'privacy_page' })}>
                    {SITE_CONTACT.email}
                  </a>
                </p>
                <p>
                  טלפון:{' '}
                  <a href={`tel:${SITE_CONTACT.phone.replace(/-/g, '')}`} className="hover:text-sky-ink-strong transition-colors" dir="ltr" onClick={() => track('tel_click', { placement: 'privacy_page' })}>
                    {SITE_CONTACT.phone}
                  </a>
                </p>
                <p>
                  <a
                    href="https://wa.me/972528731808"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sky-ink-strong transition-colors"
                    onClick={() => track('whatsapp_click', { placement: 'privacy_page' })}
                  >
                    WhatsApp
                  </a>
                </p>
              </div>
            </div>
          </section>

          <div className="mt-12 pt-6 border-t border-cream-darker text-brown-muted text-sm">
            <p><strong>תאריך עדכון אחרון:</strong> נובמבר 2026</p>
          </div>
    </>
  )
}
