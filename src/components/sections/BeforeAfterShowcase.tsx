import { m } from 'framer-motion'
import { WaveDivider } from '../ui/WaveDivider'
import { BeforeAfterSlider } from '../ui/BeforeAfterSlider'
import { useRevealFactory } from '../../config/reveal'

/**
 * BeforeAfterShowcase — the interactive before/after on the single dark
 * navy band. (The measured-stats "proof band" and the load-time badge were
 * removed at Nati's request, 04/07/2026 — the slider stayed.)
 *
 * HONESTY: the demo images are self-made (an intentionally outdated mock
 * vs. this site's live hero), clearly labeled. Never a fake client.
 */
export default function BeforeAfterShowcase() {
  // On the dark band: heading slides in cleanly, slider wipes in from the right.
  // (No blur on Hebrew text — it reads as broken during the reveal.)
  const reveal = useRevealFactory()

  return (
    <section
      id="before-after"
      aria-label="לפני ואחרי"
      className="grain-surface relative overflow-clip py-16 md:py-24"
      style={{ background: '#1E293B' }}
    >
      {/* Subtle cyan mesh on the navy */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 80% 10%, rgba(125, 211, 252, 0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 45% at 15% 90%, rgba(94, 234, 212, 0.07) 0%, transparent 60%)',
        }}
      />

      <div className="container relative max-w-3xl">
        <m.div className="text-center mb-8 md:mb-10" {...reveal('slideInRight')}>
          <h2 className="text-4xl md:text-5xl font-headline text-white mb-4">
            {/* [קופי: נתי] */}
            לפני <span style={{ color: '#7DD3FC' }}>ואחרי</span>
          </h2>
          <div className="section-title-accent" aria-hidden="true" />
          <p className="text-lg md:text-xl text-white/70 mt-4">
            {/* [קופי: נתי] */}
            גררו את הידית וראו איך מרגישה קפיצת דור באתר
          </p>
        </m.div>

        <m.div {...reveal('scaleIn', 0.1, { from: 0.96 })}>
          <BeforeAfterSlider
            beforeSrc="/images/demo-before.webp"
            afterSrc="/images/demo-after.webp"
            className="border border-white/15 shadow-2xl"
          />
          <p className="text-center text-white/45 text-xs md:text-sm mt-3">
            {/* [קופי: נתי] */}
            הדגמה להמחשה בלבד, לא אתר של לקוח
          </p>
        </m.div>
      </div>

      {/* Exit wave into HowWeWork (cream) */}
      <WaveDivider variant="c" fill="#F8FAFC" className="absolute bottom-0 inset-x-0" />
    </section>
  )
}
