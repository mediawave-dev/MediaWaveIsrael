import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { HtmlContent } from '../HtmlContent'

interface Faq {
  _id: string
  question: string
  answer: string
}

const faqs: Faq[] = [
  { _id: 'faq-1', question: 'מה כולל חבילת הפיתוח הבסיסית?', answer: 'כולל עד 5 עמודים, עיצוב רספונסיבי, אופטימיזציה למובייל, אינטגרציה עם WhatsApp, וטופס יצירת קשר. זמן אספקה: 2-3 שבועות.' },
  { _id: 'faq-2', question: 'האם תומכים בתחזוקה שוטפת?', answer: 'כן, אנו מציעים חבילות תחזוקה חודשיות הכוללות עדכונים, גיבויים, ותמיכה טכנית. ניתן לבחור חבילה מותאמת אישית.' },
  { _id: 'faq-3', question: 'כמה זמן לוקח לבנות אתר?', answer: 'אתר בסיסי: 2-3 שבועות. אתר מורכב: 4-6 שבועות. התהליך תלוי במורכבות ובזמינות התכנים מהלקוח.' },
  { _id: 'faq-4', question: 'האם האתר יהיה ידידותי למובייל?', answer: 'בהחלט! כל אתר שאנו בונים הוא רספונסיבי ומותאם במיוחד לצפייה במכשירים ניידים, טאבלטים ומחשבים.' },
  { _id: 'faq-5', question: 'מה קורה אחרי השקת האתר?', answer: 'אנו מספקים הדרכה בסיסית, תמיכה טכנית לחודש הראשון, ואופציה לחבילות תחזוקה שוטפת לפי הצורך.' },
  { _id: 'faq-6', question: 'האם אוכל לעדכן תכנים בעצמי?', answer: 'כן, אנו בונים אתרים עם ממשק ניהול פשוט שמאפשר לך לעדכן טקסטים, תמונות ותכנים בקלות ללא ידע טכני.' },
  { _id: 'faq-7', question: 'האם אפשר לשלב חנות מקוונת?', answer: 'בהחלט! אנו מתמחים באינטגרציה של מערכות תשלום מאובטחות וחנויות מקוונות מלאות כחלק מהפרויקט.' },
  { _id: 'faq-8', question: 'מה כלול במחיר?', answer: 'המחיר כולל: עיצוב, פיתוח, אחסון שנתי, דומיין, תעודת SSL, אופטימיזציה למנועי חיפוש בסיסית, והדרכה.' },
  { _id: 'faq-9', question: 'האם אני צריך לספק תכנים ותמונות?', answer: 'אנחנו יכולים לעבוד עם התכנים והתמונות שלך, או לסייע בכתיבה מקצועית של תוכן לאתר. אנחנו גם יכולים לעזור בחירת תמונות איכותיות מבנקי תמונות.' },
  { _id: 'faq-10', question: 'האם האתר יופיע בגוגל?', answer: 'כן! כל אתר כולל אופטימיזציה בסיסית למנועי חיפוש (SEO), רישום ב-Google Search Console, ומפת אתר. לקידום מתקדם יותר, אנחנו מציעים חבילות SEO נפרדות.' },
  { _id: 'faq-11', question: 'מה ההבדל בין תבנית מוכנה לעיצוב מותאם אישית?', answer: 'תבנית מוכנה היא פתרון מהיר וחסכוני. עיצוב מותאם אישית נבנה במיוחד עבורך ומשקף את הזהות המותגית הייחודית שלך. שני הפתרונות רספונסיביים ומקצועיים.' },
  { _id: 'faq-12', question: 'האם אתם מציעים שירותי לוגו ומיתוג?', answer: 'כן! מלבד בניית אתרים, אנחנו מציעים עיצוב לוגו, פלטת צבעים, טיפוגרפיה ומדריך מותג שלם. אפשר לשלב את זה עם חבילת האתר.' },
  { _id: 'faq-13', question: 'מה התהליך מהפגישה הראשונה ועד השקת האתר?', answer: '1) פגישת היכרות וקבלת דרישות 2) הצעת מחיר 3) עיצוב ראשוני לאישור 4) פיתוח האתר 5) בדיקות ותיקונים 6) הדרכה והשקה. נשמור על קשר רציף בכל שלב.' },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replace(/<[^>]*>/g, ''),
      },
    })),
  }

  return (
    <section
      id="faq"
      aria-label="שאלות נפוצות"
      className="py-16 md:py-24 bg-cream-dark"
    >
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <m.h2
            className="text-4xl md:text-5xl font-headline mb-4"
            initial={{ opacity: 0, transform: 'translateY(20px)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            שאלות <span style={{ color: '#0284C7' }}>נפוצות</span>
          </m.h2>
          <div className="section-title-accent" aria-hidden="true" />
          <m.p
            className="text-brown-light text-lg md:text-xl mt-4"
            initial={{ opacity: 0, transform: 'translateY(20px)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            כל מה שרציתם לדעת על תהליך בניית האתר
          </m.p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((item, index) => (
            <m.div
              key={item._id}
              className="bg-white rounded-xl overflow-hidden border border-cream-darker/60 hover:border-orange-light transition-colors duration-300"
              initial={{ opacity: 0, transform: 'translateY(20px)' }}
              whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              {/* Question */}
              <button
                onClick={() => toggleItem(index)}
                className="w-full text-right p-4 md:p-5 flex items-center justify-between gap-4 hover:bg-cream-dark/30 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-headline font-semibold text-brown-dark text-lg md:text-xl">
                  {item.question}
                </span>
                <m.span
                  className="text-orange flex-shrink-0"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </m.span>
              </button>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 md:px-5 pb-4 md:pb-5">
                      <div className="font-body text-brown-light text-base md:text-lg leading-relaxed border-t border-cream-darker pt-4">
                        <HtmlContent html={item.answer} className="prose-hebrew" />
                      </div>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </m.div>
          ))}
        </div>

        {/* CTA */}
        <m.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-brown-light text-xl md:text-2xl mb-4">עדיין יש שאלות?</p>
          <a
            href="#contact"
            className="inline-block bg-orange text-xl px-10 py-4 rounded-full font-semibold hover:bg-orange-dark transition-all duration-300 shadow-md hover:shadow-glow"
            style={{ color: '#1e3a5f' }}
          >
            צרו קשר
          </a>
        </m.div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </section>
  )
}
