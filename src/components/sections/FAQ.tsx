import { useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// English text component - Playfair Display Italic
const En = ({ children }: { children: ReactNode }) => (
  <span className="font-english">{children}</span>
)

// FAQ data with styled English terms
const faqItems: { question: ReactNode; answer: ReactNode }[] = [
  {
    question: 'מה כוללת חבילת הפיתוח ובמה היא שונה מהשוק?',
    answer: <>אנחנו בונים עבורך תשתית עבודה מלאה, לא רק "דף באינטרנט". כל פרויקט מותאם אישית לצרכים שלכם, מדף נחיתה ועד אתר מורכב. כל פרויקט כולל עיצוב מותאם אישית, רספונסיביות מלאה, וחיבור ל-<En>WhatsApp</En> וטופסי לידים חכמים.</>,
  },
  {
    question: 'האם יש דמי מנוי חודשיים?',
    answer: 'בניגוד להרבה חברות בשוק, אצלנו האתר בבעלותכם המלאה. אין "שכירות" חודשית ואין אותיות קטנות. אתם משלמים פעם אחת על הפיתוח, וזהו. למי שרוצה ראש שקט באמת, אנחנו מציעים תחזוקה אופציונלית לעדכונים וגיבויים, אבל זו בחירה שלכם, לא חובה.',
  },
  {
    question: 'כמה זמן לוקח עד שהאתר באוויר?',
    answer: 'אנחנו לא מאמינים ב"למרוח" זמן. אתר בסיסי מוכן תוך 2-3 שבועות, ואתרים מורכבים יותר תוך 4-6 שבועות. אם כל החומרים מוכנים אצלכם, אנחנו יודעים לרוץ אפילו מהר יותר.',
  },
  {
    question: 'איך אני יכול להיות בטוח שאוהב את התוצאה?',
    answer: 'בדיוק בשביל זה אנחנו עובדים בשקיפות מלאה. לפני שנכנסים לפיתוח הקוד, אתם מקבלים סקיצה עיצובית לאישור. אהבתם? ממשיכים. יש הערות? מתקנים. אתם חלק מהתהליך כדי שלא יהיו הפתעות בסוף.',
  },
  {
    question: 'האם האתר יופיע בגוגל ובבינה מלאכותית?',
    answer: <>חד משמעית כן. כל אתר עובר אופטימיזציה למנועי חיפוש (<En>SEO</En>) וגם מותאם למנועי התשובות החדשים (<En>GEO</En>) כמו <En>ChatGPT</En> ו-<En>Perplexity</En>. אנחנו דואגים לסריקה תקינה של גוגל ומפת אתר, כדי שלא רק תהיו קיימים – אלא גם ימצאו אתכם.</>,
  },
  {
    question: 'אצטרך לשלם לכם על כל שינוי טקסט קטן בעתיד?',
    answer: 'ממש לא. אנחנו בונים את האתר על מערכת ניהול נוחה וידידותית. בסוף התהליך תקבלו הדרכה קצרה שתאפשר לכם לעדכן טקסטים, תמונות ובלוגים בעצמכם תוך שניות, בלי להיות תלויים באף מתכנת.',
  },
  {
    question: 'אתם כותבים עבורי את התוכן או שאני צריך להביא הכל?',
    answer: 'מה שנוח לכם. יש לכם טקסטים? נטמיע אותם בצורה חכמה. אין לכם? אנחנו מציעים שירותי כתיבת תוכן שיווקי וקריאייטיב שיודע למכור. אנחנו גם מסייעים בבחירת תמונות מקצועיות מבנקי תמונות כדי שהאתר ייראה ברמה הגבוהה ביותר.',
  },
  {
    question: 'האם האתר ייראה טוב בטלפון?',
    answer: <>היום בונים קודם כל למובייל. האתר שלכם יהיה רספונסיבי ב-100%, מה שאומר שהוא ייראה מדהים ויעבוד מושלם בכל מכשיר – מאייפון ועד מסכי <En>4K</En>.</>,
  },
  {
    question: 'מה לגבי אבטחה ופרטיות?',
    answer: <>אנחנו לא מתפשרים על זה. כל אתר מגיע עם תעודת <En>SSL</En> (המנעול הירוק), הגנות בסיסיות נגד פריצות ועמידה בתקני פרטיות, כדי שהגולשים שלכם ירגישו בטוחים להשאיר פרטים.</>,
  },
  {
    question: 'אתם עושים גם לוגו ומיתוג?',
    answer: <>כן, אנחנו מציעים מעטפת <En>360</En>. אם אין לכם זהות ויזואלית, נוכל לעצב עבורכם לוגו, לבחור שפה גרפית ולבנות מותג שלם שמתכתב עם האתר החדש שלכם.</>,
  },
  {
    question: 'איך מתחילים? מה השלב הראשון?',
    answer: 'זה פשוט: קובעים שיחת אפיון קצרה (ללא התחייבות). נבין מה המטרות שלכם, נתאים את הפתרון המדויק עבורכם, וברגע שיוצאים לדרך אנחנו לוקחים את המושכות ומובילים אתכם עד להשקה.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      id="faq"
      aria-label="שאלות נפוצות"
      className="py-16 md:py-24 bg-cream-dark"
    >
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-headline mb-4"
            initial={{ opacity: 0, transform: 'translateY(20px)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            שאלות נפוצות
          </motion.h2>
          <motion.p
            className="text-brown-light text-2xl"
            initial={{ opacity: 0, transform: 'translateY(20px)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            כל מה שרציתם לדעת על תהליך בניית האתר
          </motion.p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg overflow-hidden"
              initial={{ opacity: 0, transform: 'translateY(20px)' }}
              whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              {/* Question */}
              <button
                onClick={() => toggleItem(index)}
                className="w-full text-right p-5 flex items-center justify-between gap-4 hover:bg-cream-dark/30 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-headline font-semibold text-brown-dark text-xl">
                  {item.question}
                </span>
                <motion.span
                  className="text-orange flex-shrink-0"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </motion.span>
              </button>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5">
                      <p className="font-body text-brown-light text-xl leading-relaxed border-t border-cream-darker pt-4">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-brown-light text-2xl mb-4">עדיין יש שאלות?</p>
          <a
            href="#contact"
            className="inline-block bg-orange text-xl px-10 py-4 rounded-full font-semibold hover:bg-orange-dark transition-colors"
            style={{ color: '#FFFFFF' }}
          >
            צרו קשר
          </a>
        </motion.div>
      </div>
    </section>
  )
}
