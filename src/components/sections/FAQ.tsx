import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// FAQ data from CONTENT.md
const faqItems = [
  {
    question: 'מה כולל חבילת הפיתוח הבסיסית?',
    answer: 'כולל עד 5 עמודים, עיצוב רספונסיבי, אופטימיזציה למובייל, אינטגרציה עם WhatsApp, וטופס יצירת קשר. זמן אספקה: 2-3 שבועות.',
  },
  {
    question: 'האם תומכים בתחזוקה שוטפת?',
    answer: 'כן, אנו מציעים חבילות תחזוקה חודשיות הכוללות עדכונים, גיבויים, ותמיכה טכנית. ניתן לבחור חבילה מותאמת אישית.',
  },
  {
    question: 'כמה זמן לוקח לבנות אתר?',
    answer: 'אתר בסיסי: 2-3 שבועות. אתר מורכב: 4-6 שבועות. התהליך תלוי במורכבות ובזמינות התכנים מהלקוח.',
  },
  {
    question: 'האם האתר יהיה ידידותי למובייל?',
    answer: 'בהחלט! כל אתר שאנו בונים הוא רספונסיבי ומותאם במיוחד לצפייה במכשירים ניידים, טאבלטים ומחשבים.',
  },
  {
    question: 'מה קורה אחרי השקת האתר?',
    answer: 'אנו מספקים הדרכה בסיסית, תמיכה טכנית לחודש הראשון, ואופציה לחבילות תחזוקה שוטפת לפי הצורך.',
  },
  {
    question: 'האם אוכל לעדכן תכנים בעצמי?',
    answer: 'כן, אנו בונים אתרים עם ממשק ניהול פשוט שמאפשר לך לעדכן טקסטים, תמונות ותכנים בקלות ללא ידע טכני.',
  },
  {
    question: 'מה כלול במחיר?',
    answer: 'המחיר כולל: עיצוב, פיתוח, אחסון שנתי, דומיין, תעודת SSL, אופטימיזציה למנועי חיפוש בסיסית, והדרכה.',
  },
  {
    question: 'האם האתר יופיע בגוגל?',
    answer: 'כן! כל אתר כולל אופטימיזציה בסיסית למנועי חיפוש (SEO), רישום ב-Google Search Console, ומפת אתר.',
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
      className="py-16 md:py-24 bg-cream-dark"
    >
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-h2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            שאלות נפוצות
          </motion.h2>
          <motion.p
            className="text-brown-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              {/* Question */}
              <button
                onClick={() => toggleItem(index)}
                className="w-full text-right p-5 flex items-center justify-between gap-4 hover:bg-cream-dark/30 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-brown-dark">
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
                      <p className="text-brown-light leading-relaxed border-t border-cream-darker pt-4">
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
          <p className="text-brown-light mb-4">עדיין יש שאלות?</p>
          <a
            href="#contact"
            className="inline-block bg-orange px-8 py-3 rounded-full font-semibold hover:bg-orange-dark transition-colors"
            style={{ color: '#FFFFFF' }}
          >
            צרו קשר
          </a>
        </motion.div>
      </div>
    </section>
  )
}
