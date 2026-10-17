// FAQ in the looks (step 3): the rest beat after the two holds, deliberately calm. Hairline
// rows, no cards, no entrance beyond the engine's early reveal. The answers stay mounted (the
// text is in the prerendered HTML for crawlers and no-JS readers); framer owns the height.
// In KM it sits in the void. The shot (SPEC S6) passes `chapter`, `dossier` and `decor` (its
// notepad's margin line); without them the markup is exactly the looks' own.

import { useState, type ReactNode } from 'react'
import { m } from 'framer-motion'
import { LookButton } from '@look/button'
import { HtmlContent } from '../../components/HtmlContent'
import { faqs } from '../../data/faqs'
import { WHATSAPP_URLS } from '../../utils/whatsapp'
import { track } from '../../utils/analytics'
import './faq.css'

interface FaqProps {
  /** data-chapter on the section (the shot's chapter id) */
  chapter?: string
  /** data-dossier on the section */
  dossier?: string
  /** rendered first inside .faq__in (the shot's margin line) */
  decor?: ReactNode
  /** a line above the heading (the shot's chapter verb) */
  kicker?: ReactNode
}

export default function Faq({ chapter, dossier, decor, kicker }: FaqProps = {}) {
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
    <section id="faq" className="faq" aria-labelledby="faq-title" data-theme="light" data-intent="interest" data-chapter={chapter} data-dossier={dossier}>
      <div className="faq__in">
        {decor}
        <div className="faq__head">
          {kicker}
          <h2 id="faq-title" data-zone="text">שאלות נפוצות</h2>
          <p data-zone="text">מה ששואלים אותנו לפני שמתחילים</p>
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
                    data-intent-signal
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
          <p>לא מצאתם תשובה?</p>
          <LookButton href={WHATSAPP_URLS.general} target="_blank" rel="noopener noreferrer" zone="text" onClick={() => track('whatsapp_click', { placement: 'faq' })}>שאלו אותנו בוואטסאפ</LookButton>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  )
}
