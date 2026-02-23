import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import SectionSkeleton from '../ui/SectionSkeleton'
import { useSanityQuery } from '../../sanity/hooks'
import { FAQ_QUERY } from '../../sanity/queries'
import { portableTextComponents } from '../../sanity/PortableTextComponents'

interface SanityFaq {
  _id: string
  question: string
  answer: PortableTextBlock[]
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { data, loading } = useSanityQuery<SanityFaq[]>(FAQ_QUERY)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  if (loading) {
    return <SectionSkeleton lines={3} />
  }

  if (!data || data.length === 0) return null

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
          {data.map((item, index) => (
            <motion.div
              key={item._id}
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
                      <div className="font-body text-brown-light text-xl leading-relaxed border-t border-cream-darker pt-4">
                        <PortableText value={item.answer} components={portableTextComponents} />
                      </div>
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
