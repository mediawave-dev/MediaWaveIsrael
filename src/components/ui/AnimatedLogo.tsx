import { useScene } from '../../motion/ScrollEngineProvider'
import Logo, { type LogoProps } from './Logo'
import { buildIdent, liveHorizon } from './logo-motion'

/**
 * The Horizon logo with its ident and its living horizon (DECISIONS #53, logo-motion.ts).
 *   mode "intro"   the header: plays once per visit, right after load. index.html decides
 *                  before first paint (html.logo-intro), so the logo never flashes and replays.
 *   mode "scroll"  the footer sign-off: the ident is scrubbed by the visitor's scroll (it
 *                  runs under the OS reduced-motion flag too, CALM: the scroll drives it).
 *   live           afterwards, scroll speed and the pointer slosh the horizon.
 * Reduced (the widget's stop, prerender, no JS): the exact static logo.
 */
export default function AnimatedLogo({ mode, live = false, ...logo }: LogoProps & { mode: 'intro' | 'scroll'; live?: boolean }) {
  const ref = useScene<HTMLSpanElement>((e, root) => {
    const html = document.documentElement
    const svg = root.querySelector('svg')
    if (!svg) return
    if (e.REDUCE) { if (mode === 'intro') html.classList.remove('logo-intro'); return }
    let tl: gsap.core.Timeline | null = null
    if (mode === 'intro') {
      if (html.classList.contains('logo-intro')) {
        tl = buildIdent(svg)
        tl.progress(0) // the "before" frame first, then reveal: nothing pops
        html.classList.remove('logo-intro')
        try { sessionStorage.setItem('mw-logo-ident', '1') } catch { /* private mode: it may replay */ }
        tl.play(0)
      }
    } else {
      tl = buildIdent(svg)
      tl.progress(0)
      // from the sign entering the lower screen to it sitting in the middle, but never past the
      // end of the page: the footer is the last thing there, and an end the page cannot reach
      // would leave the ident unfinished (positions are read on refresh only)
      const top = () => root.getBoundingClientRect().top + window.scrollY
      e.ScrollTrigger.create({
        trigger: root,
        start: () => top() - window.innerHeight * 0.98,
        end: () => Math.min(top() - window.innerHeight * 0.4, e.ScrollTrigger.maxScroll(window) - 12),
        scrub: e.CALM ? true : 0.6,
        animation: tl,
        invalidateOnRefresh: true,
      })
    }
    // dev only: QA steps the ident frame by frame (window.__mwIdent[mode].progress(p))
    if (import.meta.env.DEV && tl) ((window as unknown as { __mwIdent?: Record<string, unknown> }).__mwIdent ??= {})[mode] = tl
    const done = () => !tl || (tl.progress() === 1 && !tl.isActive())
    const stopLive = live ? liveHorizon(svg, e, { hover: root.closest('a') ?? root, ready: done }) : null
    return () => {
      stopLive?.()
      html.classList.remove('logo-intro')
    }
  }, [logo.variant, mode])
  return (
    <span ref={ref} className="mw-logo-motion">
      <Logo {...logo} motion />
    </span>
  )
}
