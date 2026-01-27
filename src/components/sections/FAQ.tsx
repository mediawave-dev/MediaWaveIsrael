import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

// FAQ data - Hebrew only, from CONTENT.md
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
    question: 'האם אפשר לשלב חנות מקוונת?',
    answer: 'בהחלט! אנו מתמחים באינטגרציה של מערכות תשלום מאובטחות וחנויות מקוונות מלאות כחלק מהפרויקט.',
  },
  {
    question: 'מה כלול במחיר?',
    answer: 'המחיר כולל: עיצוב, פיתוח, אחסון שנתי, דומיין, תעודת SSL, אופטימיזציה למנועי חיפוש בסיסית, והדרכה.',
  },
  {
    question: 'האם אני צריך לספק תכנים ותמונות?',
    answer: 'אנחנו יכולים לעבוד עם התכנים והתמונות שלך, או לסייע בכתיבה מקצועית של תוכן לאתר. אנחנו גם יכולים לעזור בחירת תמונות איכותיות מבנקי תמונות.',
  },
  {
    question: 'האם האתר יופיע בגוגל?',
    answer: 'כן! כל אתר כולל אופטימיזציה בסיסית למנועי חיפוש (SEO), רישום ב-Google Search Console, ומפת אתר. לקידום מתקדם יותר, אנחנו מציעים חבילות SEO נפרדות.',
  },
  {
    question: 'מה ההבדל בין תבנית מוכנה לעיצוב מותאם אישית?',
    answer: 'תבנית מוכנה היא פתרון מהיר וחסכוני. עיצוב מותאם אישית נבנה במיוחד עבורך ומשקף את הזהות המותגית הייחודית שלך. שני הפתרונות רספונסיביים ומקצועיים.',
  },
  {
    question: 'האם אתם מציעים שירותי לוגו ומיתוג?',
    answer: 'כן! מלבד בניית אתרים, אנחנו מציעים עיצוב לוגו, פלטת צבעים, טיפוגרפיה ומדריך מותג שלם. אפשר לשלב את זה עם חבילת האתר.',
  },
  {
    question: 'מה התהליך מהפגישה הראשונה ועד השקת האתר?',
    answer: '1) פגישת היכרות וקבלת דרישות 2) הצעת מחיר 3) עיצוב ראשוני לאישור 4) פיתוח האתר 5) בדיקות ותיקונים 6) הדרכה והשקה. נשמור על קשר רציף בכל שלב.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Parallax for background elements
  const bgY1 = useTransform(scrollYProgress, [0, 1], [0, -60])
  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, 40])
  const lineProgress = useTransform(scrollYProgress, [0.1, 0.6], [0, 1])

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleItem(index)
    }
  }

  return (
    <section
      ref={containerRef}
      id="faq"
      aria-labelledby="faq-title"
      className="relative py-16 md:py-24 bg-gradient-to-b from-cream to-cream-dark overflow-hidden"
    >
      {/* Background decorative elements with parallax */}
      <motion.div
        className="absolute top-20 right-[8%] w-64 h-64 pointer-events-none"
        style={{ y: bgY1 }}
      >
        <div className="w-full h-full rounded-full bg-sage/10 blur-3xl" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-[5%] w-48 h-48 pointer-events-none"
        style={{ y: bgY2 }}
      >
        <div className="w-full h-full rounded-full bg-orange/8 blur-3xl" />
      </motion.div>

      <div className="container relative">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          {/* Badge - centered above title, matching "המלצות" badge style */}
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-orange/10 text-orange text-sm font-semibold px-5 py-2.5 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 bg-orange rounded-full animate-pulse" />
              שאלות נפוצות
            </span>
          </motion.div>

          {/* Hebrew Title - Reduced size: 32-36px */}
          <div className="relative inline-block mb-3">
            <motion.h2
              id="faq-title"
              className="text-[32px] md:text-[36px] font-headline font-bold text-brown-dark leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              שאלות ותשובות נפוצות
            </motion.h2>

            {/* Hand-drawn decorative underline */}
            <motion.svg
              className="absolute -bottom-1 right-1/2 translate-x-1/2 w-40 h-3"
              viewBox="0 0 160 10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <motion.path
                d="M2 6 Q40 2 80 5 T158 4"
                fill="none"
                stroke="var(--color-sage)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="opacity-50"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </motion.svg>
          </div>

          {/* Subtitle - Reduced size: 16-18px */}
          <motion.p
            className="text-brown-light mt-4 text-base md:text-[17px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            כל מה שרציתם לדעת על תהליך בניית האתר
          </motion.p>
        </div>

        {/* FAQ Accordion - max-width for readability */}
        <div className="max-w-[900px] mx-auto" role="list">
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => toggleItem(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        {/* CTA below FAQ - Fixed button with better contrast */}
        <motion.div
          className="max-w-2xl mx-auto text-center mt-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-brown-light mb-5 text-base">
            עדיין יש לכם שאלות? צרו איתנו קשר
          </p>
          <a
            href="#contact"
            className="relative overflow-hidden inline-flex items-center gap-2 bg-orange px-7 py-3.5 rounded-full font-semibold shadow-sm hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
            style={{ color: '#2A2A2A' }}
          >
            <span>צרו איתנו קשר</span>
            <ArrowLeftIcon />
          </a>
        </motion.div>
      </div>

      {/* Connecting curved line to next section - hidden on mobile */}
      <svg
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none overflow-visible hidden md:block"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,30 Q360,50 720,25 T1440,40"
          fill="none"
          stroke="var(--color-sage)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="8 12"
          className="opacity-25"
          style={{ pathLength: lineProgress }}
        />
      </svg>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-1/4 left-[6%] w-2.5 h-2.5 rounded-full bg-sage/40 hidden lg:block"
        animate={{ y: [0, -12, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 right-[10%] w-2 h-2 rounded-full bg-orange/30 hidden lg:block"
        animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </section>
  )
}

// Individual FAQ Item Component
interface FAQItemProps {
  item: {
    question: string
    answer: string
  }
  index: number
  isOpen: boolean
  onToggle: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

function FAQItem({ item, index, isOpen, onToggle, onKeyDown }: FAQItemProps) {
  return (
    <motion.div
      className="mb-2.5"
      role="listitem"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
    >
      <div
        className={`
          rounded-xl overflow-hidden
          bg-white/90 backdrop-blur-sm
          border transition-all duration-300
          ${isOpen
            ? 'border-sage/40 shadow-md'
            : 'border-cream-darker/40 shadow-sm hover:border-sage/30 hover:shadow hover:bg-white'
          }
        `}
      >
        {/* Question Button - Full width clickable area */}
        <button
          onClick={onToggle}
          onKeyDown={onKeyDown}
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${index}`}
          className="w-full text-right p-4 md:p-5 flex items-center justify-between gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-inset"
        >
          {/* Question Text - 16-18px bold */}
          <h3 className="text-[16px] md:text-[17px] font-semibold text-brown-dark leading-relaxed flex-1">
            {item.question}
          </h3>

          {/* Toggle Icon with rotation animation */}
          <motion.div
            className={`
              flex-shrink-0 w-8 h-8 rounded-full
              flex items-center justify-center
              transition-colors duration-300
              ${isOpen ? 'bg-sage/20 text-sage-dark' : 'bg-cream-dark text-brown-light'}
            `}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <ChevronIcon />
          </motion.div>
        </button>

        {/* Answer - Animated expand/collapse */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={`faq-answer-${index}`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 md:px-5 pb-4 md:pb-5 pt-0">
                <div className="pt-3 border-t border-cream-darker/30">
                  {/* Answer Text - 14-16px regular */}
                  <p className="text-brown-light leading-[1.7] font-body text-[14px] md:text-[15px]">
                    {item.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Icon Components
function ChevronIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="rtl-flip"
      aria-hidden="true"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}
