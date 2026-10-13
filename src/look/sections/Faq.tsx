// FAQ in the looks (step 3): the rest beat after the two holds, deliberately calm. Hairline
// rows, no cards, no entrance beyond the engine's early reveal. The answers stay mounted (the
// text is in the prerendered HTML for crawlers and no-JS readers); framer owns the height.
// In KM it sits in the void.

import { useState } from 'react'
import { m } from 'framer-motion'
import { LookButton } from '@look/button'
import { HtmlContent } from '../../components/HtmlContent'
import { faqs } from '../../data/faqs'
import './faq.css'

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer.replace(/<[^>]*>/g, '') },
    })),
  }
  return (
    <section id="faq" className="faq" aria-labelledby="faq-title" data-theme="light">
      <div className="faq__in">
        <div className="faq__head">
          <h2 id="faq-title" data-zone="text">שאלות נפוצות</h2>
          <p data-zone="text">כל מה שרציתם לדעת על תהליך בניית האתר</p>
        </div>
        <ul className="faq__list">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <li key={item._id} className="faq__row" data-open={isOpen ? '' : undefined}>
                <h3>
                  <button
                    type="button"
                    className="faq__q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item._id}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.question}</span>
                    <span className="faq__sign" aria-hidden="true"><i /><i /></span>
                  </button>
                </h3>
                <m.div
                  id={`faq-answer-${item._id}`}
                  className="faq__a"
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.22 }}
                  aria-hidden={!isOpen}
                >
                  <div className="faq__a-in"><HtmlContent html={item.answer} className="prose-hebrew" /></div>
                </m.div>
              </li>
            )
          })}
        </ul>
        <div className="faq__more">
          <p>עדיין יש שאלות?</p>
          <LookButton href="#contact" zone="text">צרו קשר</LookButton>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  )
}
