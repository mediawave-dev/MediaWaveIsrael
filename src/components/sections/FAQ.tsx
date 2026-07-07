import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { HtmlContent } from '../HtmlContent'
import { useRevealFactory } from '../../config/reveal'

interface Faq {
  _id: string
  question: string
  answer: string
}

const faqs: Faq[] = [
  { _id: 'faq-1', question: 'מה כולל חבילת הפיתוח הבסיסית?', answer: 'עד 5 עמודים, אתר שנראה מצוין בטלפון ובמחשב, כפתור וואטסאפ וטופס יצירת קשר. מוכן תוך 2-3 שבועות.' },
  { _id: 'faq-2', question: 'האם תומכים בתחזוקה שוטפת?', answer: 'כן. יש חבילות חודשיות עם עדכונים, גיבויים ותמיכה, ואפשר להתאים חבילה בדיוק לפי מה שצריך.' },
  { _id: 'faq-3', question: 'כמה זמן לוקח לבנות אתר?', answer: 'אתר בסיסי בערך 2-3 שבועות, אתר גדול יותר 4-6. הכל תלוי בכמה מהר מקבלים מכם את התכנים.' },
  { _id: 'faq-4', question: 'האם האתר יהיה ידידותי למובייל?', answer: 'בטוח. כל אתר שאנחנו בונים נראה ועובד מצוין בטלפון, בטאבלט ובמחשב.' },
  { _id: 'faq-5', question: 'מה קורה אחרי השקת האתר?', answer: 'מלמדים אתכם לנהל את האתר, נותנים תמיכה בחודש הראשון, ואם בא לכם המשך ליווי יש חבילות תחזוקה.' },
  { _id: 'faq-6', question: 'האם אוכל לעדכן תכנים בעצמי?', answer: 'כן. מקבלים מערכת פשוטה שבה אפשר לעדכן טקסטים ותמונות לבד, בלי שום ידע טכני.' },
  { _id: 'faq-7', question: 'האם אפשר לשלב חנות מקוונת?', answer: 'בהחלט. אפשר לחבר חנות מלאה עם תשלום מאובטח, כחלק מהאתר.' },
  { _id: 'faq-8', question: 'מה כלול במחיר?', answer: 'עיצוב, בנייה, שנה של אחסון ודומיין, אבטחה, הופעה בגוגל והדרכה. הכל בפנים.' },
  { _id: 'faq-9', question: 'האם אני צריך לספק תכנים ותמונות?', answer: 'אפשר לעבוד עם החומרים שלכם, ואם אין, נעזור בכתיבת התוכן ובבחירת תמונות איכותיות.' },
  { _id: 'faq-10', question: 'האם האתר יופיע בגוגל?', answer: 'כן. כל אתר נבנה כך שגוגל מוצא אותו ומציג אותו. רוצים לטפס גבוה יותר? יש חבילות קידום נפרדות.' },
  { _id: 'faq-11', question: 'מה ההבדל בין תבנית מוכנה לעיצוב מותאם אישית?', answer: 'תבנית מוכנה זולה ומהירה. עיצוב מותאם נבנה במיוחד בשבילכם ונראה כמו העסק שלכם ולא כמו כולם. שתי הדרכים נראות מצוין בכל מסך.' },
  { _id: 'faq-12', question: 'האם אתם מציעים שירותי לוגו ומיתוג?', answer: 'כן. חוץ מאתרים אנחנו מעצבים לוגו, צבעים וזהות מותג שלמה, ואפשר לשלב הכל יחד עם האתר.' },
  { _id: 'faq-13', question: 'מה התהליך מהפגישה הראשונה ועד השקת האתר?', answer: 'נפגשים ומבינים מה צריך, שולחים הצעת מחיר, מעצבים לאישור, בונים, בודקים יחד ומשיקים. לאורך כל הדרך אתם בקשר איתנו.' },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  // Header slides in from the left; rows assemble from the reading edge (right)
  const reveal = useRevealFactory()

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
            {...reveal('slideInLeft')}
          >
            שאלות <span style={{ color: '#0284C7' }}>נפוצות</span>
          </m.h2>
          <div className="section-title-accent" aria-hidden="true" />
          <m.p
            className="text-brown-light text-lg md:text-xl mt-4"
            {...reveal('slideInLeft', 0.1)}
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
              {...reveal('slideInRight')}
            >
              {/* Question */}
              <button
                onClick={() => toggleItem(index)}
                className="w-full text-right p-4 md:p-5 flex items-center justify-between gap-4 hover:bg-cream-dark/30 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-body font-semibold text-brown-dark text-lg md:text-xl">
                  {item.question}
                </span>
                <m.span
                  className="text-sky-ink flex-shrink-0"
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
