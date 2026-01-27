import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Terms() {
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
      <div className="container max-w-[900px] mx-auto px-4 sm:px-6">
        {/* Back link */}
        <motion.div
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
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-[32px] md:text-[40px] font-headline font-bold text-brown-dark mb-4">
            תקנון שימוש - MediaWave Israel
          </h1>
          <p className="text-brown-light">
            <strong>עודכן לאחרונה:</strong> ינואר 2026
          </p>
        </motion.header>

        {/* Content */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              1. כללי
            </h2>
            <div className="space-y-4 text-brown leading-relaxed">
              <p>
                <strong>1.1</strong> תקנון זה מסדיר את תנאי השימוש באתר MediaWave Israel (להלן: "האתר") ואת מתן השירותים על ידי MediaWave Israel (להלן: "החברה").
              </p>
              <p>
                <strong>1.2</strong> השימוש באתר ו/או רכישת שירותים מהחברה מהווים הסכמה מלאה לתנאי תקנון זה.
              </p>
              <p>
                <strong>1.3</strong> החברה שומרת לעצמה את הזכות לעדכן את התקנון מעת לעת. השימוש באתר לאחר עדכון התקנון מהווה הסכמה לתנאים המעודכנים.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              2. הגדרות
            </h2>
            <div className="space-y-4 text-brown leading-relaxed">
              <p>
                <strong>"הלקוח"</strong> - כל אדם או תאגיד המזמין שירותים מהחברה.
              </p>
              <p>
                <strong>"פרויקט"</strong> - עבודת פיתוח אתר או שירות דיגיטלי אחר שהוזמן על ידי הלקוח.
              </p>
              <p>
                <strong>"השירותים"</strong> - כל השירותים המוצעים על ידי החברה, לרבות פיתוח אתרים, עיצוב, תחזוקה, אחסון, ושירותים נלווים.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              3. תהליך ההזמנה והתשלום
            </h2>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">3.1 הזמנת שירותים</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>ההזמנה מתבצעת באמצעות פגישה או תקשורת כתובה (אימייל/WhatsApp).</li>
              <li>הלקוח יקבל הצעת מחיר מפורטת הכוללת את היקף העבודה, לוחות זמנים ועלויות.</li>
              <li>הפרויקט מתחיל רק לאחר אישור ההצעה וקבלת תשלום המקדמה.</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">3.2 תנאי תשלום</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>מקדמה של 50% מסך העלות תשולם בעת אישור ההצעה ותחילת העבודה.</li>
              <li>יתרת התשלום (50%) תשולם עם השלמת הפרויקט ולפני העלאת האתר לאוויר.</li>
              <li>לפרויקטים מעל 10,000 ₪ ניתן לבצע תשלום בשלושה שלבים: 40% מקדמה, 30% באמצע הפרויקט, 30% בסיום.</li>
              <li>התשלומים יתבצעו באמצעות העברה בנקאית, PayBox, או אמצעי תשלום מקוון אחר.</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">3.3 איחור בתשלום</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>איחור בתשלום של מעל 14 יום עשוי להוביל להקפאת העבודה על הפרויקט.</li>
              <li>לאחר 30 יום של איחור, החברה שומרת לעצמה את הזכות לבטל את הפרויקט ללא החזר כספי.</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">3.4 מחירים</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>המחירים המצוינים בהצעת המחיר בתוקף ל-30 יום מיום ההצעה.</li>
              <li>כל המחירים כוללים מע"מ אלא אם צוין אחרת.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              4. היקף העבודה ושינויים
            </h2>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">4.1 היקף עבודה מוגדר</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>היקף העבודה יוגדר בהצעת המחיר ויכלול את מספר העמודים, התכונות, והשירותים הנלווים.</li>
              <li>כל עבודה מעבר להיקף המוסכם תחויב בנפרד לפי מחירון השעתי של החברה (200-300 ₪ לשעה).</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">4.2 שינויים ותיקונים</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>הלקוח זכאי לעד שני סבבי תיקונים במהלך תהליך העיצוב והפיתוח ללא עלות נוספת.</li>
              <li>שינויים מהותיים שאינם כלולים בהיקף המקורי יחויבו בנפרד.</li>
              <li>לאחר אישור סופי ועליית האתר לאוויר, חודש התמיכה הראשון כולל תיקונים קלים בלבד.</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">4.3 ספקת תכנים</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>הלקוח אחראי לספק את כל התכנים הדרושים: טקסטים, תמונות, לוגו, וחומרים נוספים.</li>
              <li>איחור בספקת תכנים עלול להאריך את לוח הזמנים של הפרויקט.</li>
              <li>החברה יכולה לסייע בכתיבה מקצועית של תוכן או בחירת תמונות בתשלום נוסף.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              5. זכויות יוצרים וקניין רוחני
            </h2>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">5.1 זכויות בעיצוב ובקוד</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>כל זכויות הקניין הרוחני בעיצוב, בקוד, ובתכנים שנוצרו על ידי החברה עוברות ללקוח לאחר תשלום מלא של כל הסכומים המגיעים.</li>
              <li>עד לתשלום מלא, כל הזכויות נשארות בבעלות החברה.</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">5.2 תכנים שסופקו על ידי הלקוח</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>הלקוח מצהיר שיש לו את כל הזכויות הדרושות לשימוש בתכנים שהוא מספק (תמונות, טקסטים, וידאו וכו').</li>
              <li>הלקוח פוטר את החברה מכל אחריות הנוגעת להפרת זכויות יוצרים בתכנים שסופקו על ידו.</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">5.3 שימוש בפורטפוליו</h3>
            <p className="text-brown leading-relaxed">
              החברה רשאית להציג את הפרויקט המוגמר בתיק העבודות שלה ובחומרים שיווקיים, אלא אם הלקוח ביקש אחרת בכתב.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              6. לוחות זמנים ואספקה
            </h2>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">6.1 זמני אספקה משוערים</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>לוחות הזמנים המוצעים הם הערכה ואינם מהווים התחייבות מוחלטת.</li>
              <li>עיכובים עקב נסיבות שאינן בשליטת החברה (כגון איחור בספקת תכנים מהלקוח, בעיות טכניות בספקי שירות חיצוניים) לא יחשבו כהפרת התחייבות.</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">6.2 אישורים ומשוב</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>הלקוח מתחייב לספק משוב ואישורים תוך 7 ימי עסקים מקבלת עדכון/תצוגה מקדימה.</li>
              <li>איחור במתן משוב עלול להאריך את לוח הזמנים של הפרויקט.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              7. אחסון ותחזוקה
            </h2>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">7.1 אחסון שנה ראשונה</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>אחסון האתר לשנה הראשונה כלול במחיר הפרויקט.</li>
              <li>האחסון כולל: שרת, דומיין, תעודת SSL, וגיבויים אוטומטיים.</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">7.2 חידוש שנתי</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>מהשנה השנייה ואילך, דמי אחסון שנתיים יהיו בין 500-800 ₪ בהתאם לחבילת האחסון.</li>
              <li>הלקוח יקבל תזכורת 30 יום לפני פקיעת האחסון.</li>
              <li>אי-חידוש האחסון עלול להוביל להורדת האתר מהרשת.</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">7.3 חבילות תחזוקה</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>החברה מציעה חבילות תחזוקה חודשיות הכוללות עדכונים, גיבויים, ותמיכה טכנית.</li>
              <li>תמיכה בחודש הראשון לאחר ההשקה כלולה בעלות הפרויקט.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              8. אחריות והגבלת אחריות
            </h2>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">8.1 אחריות לעבודה</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>החברה מתחייבת לספק שירותים באיכות מקצועית ולתקן באגים וליקויים טכניים שיתגלו תוך 30 יום מהשקת האתר.</li>
              <li>אחריות זו אינה חלה על בעיות שנגרמו עקב שימוש לא נכון, שינויים שביצע הלקוח, או גורמים חיצוניים.</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">8.2 הגבלת אחריות</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>החברה אינה אחראית לנזקים עקיפים, אובדן רווחים, או נזקים תוצאתיים הנובעים מהשימוש באתר או מאי-יכולת להשתמש בו.</li>
              <li>אחריות החברה מוגבלת לסכום ששולם עבור השירות הספציפי.</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">8.3 זמינות האתר</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>החברה תעשה מאמצים סבירים להבטיח זמינות גבוהה של האתר, אך אינה יכולה להבטיח זמינות של 100%.</li>
              <li>החברה אינה אחראית להפסקות שירות הנגרמות עקב תחזוקה מתוכננת, כשלים בספקי שירות חיצוניים, או כוח עליון.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              9. ביטול והחזרים
            </h2>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">9.1 ביטול על ידי הלקוח</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li><strong>לפני תחילת העבודה:</strong> החזר מלא של המקדמה בניכוי 10% דמי ביטול.</li>
              <li><strong>לאחר תחילת העבודה:</strong> לא יינתן החזר כספי על עבודה שכבר בוצעה. הלקוח ישלם עבור השעות שהושקעו בפרויקט.</li>
              <li><strong>לאחר אישור עיצוב סופי:</strong> לא יינתן החזר כספי.</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">9.2 ביטול על ידי החברה</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>החברה רשאית לבטל פרויקט במקרים של אי-שיתוף פעולה מצד הלקוח, איחור משמעותי בתשלומים, או חוסר אפשרות טכנית.</li>
              <li>במקרה כזה, הלקוח יקבל החזר יחסי בניכוי עלות העבודה שכבר בוצעה.</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              10. סודיות ופרטיות
            </h2>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">10.1 סודיות מידע</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>החברה מתחייבת לשמור בסודיות את כל המידע שהתקבל מהלקוח במהלך הפרויקט.</li>
              <li>סודיות זו תישמר גם לאחר סיום הפרויקט.</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">10.2 מדיניות פרטיות</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>השימוש באתר כפוף למדיניות הפרטיות של החברה.</li>
              <li>החברה אוספת מידע מינימלי הדרוש למתן השירות בלבד.</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              11. שונות
            </h2>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">11.1 דין וסמכות שיפוט</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>תקנון זה כפוף לדיני מדינת ישראל.</li>
              <li>סמכות השיפוט הייחודית נתונה לבתי המשפט המוסמכים בישראל.</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">11.2 תקשורת</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>כל תקשורת רשמית בין הצדדים תתבצע באמצעות דואר אלקטרוני או WhatsApp.</li>
              <li>הודעות שנשלחו בדוא"ל ייחשבו כאילו התקבלו תוך 24 שעות.</li>
            </ul>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">11.3 ניתוק הוראות</h3>
            <p className="text-brown leading-relaxed">
              אם הוראה כלשהי בתקנון זה תימצא בלתי חוקית או בלתי אכיפה, שאר ההוראות יישארו בתוקפן.
            </p>

            <h3 className="text-[18px] font-semibold text-brown-dark mt-6 mb-3">11.4 שינויי תקנון</h3>
            <ul className="list-disc list-inside space-y-2 text-brown leading-relaxed mr-4">
              <li>החברה רשאית לעדכן תקנון זה מעת לעת.</li>
              <li>שינויים מהותיים יפורסמו באתר והלקוחות הקיימים יקבלו הודעה.</li>
            </ul>
          </section>

          {/* Section 12 */}
          <section className="mb-10">
            <h2 className="text-[24px] font-headline font-bold text-brown-dark mb-4 pb-2 border-b border-cream-darker">
              12. יצירת קשר
            </h2>
            <p className="text-brown leading-relaxed mb-4">
              לשאלות או הבהרות בנוגע לתקנון זה, ניתן ליצור קשר:
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
          </div>
        </motion.article>
      </div>
    </main>
  )
}
