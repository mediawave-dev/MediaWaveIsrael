import { useEffect } from 'react'

/**
 * Dynamic browser theme-color. Shifts <meta name="theme-color"> — the color of
 * the mobile browser address bar / installed-PWA chrome — to match each homepage
 * section as it scrolls through the viewport centre. Dark bands (hero, the navy
 * before/after) push the address bar to navy; light bands to a soft brand sky.
 *
 * HONESTY: this only visibly affects mobile Chrome/Android, Safari iOS 15+, and
 * installed PWA chrome — it is inert (but harmless) on desktop. Browsers SNAP
 * the color; there is no transition on browser chrome and we do not fake one.
 * The premium effect is the value MATCHING the section, sharpest when entering
 * or leaving a dark band.
 *
 * Implementation notes:
 * - ONE IntersectionObserver with a thin centre band (rootMargin -45%/-45%) so
 *   the section crossing the viewport centre wins — cheaper than a scroll
 *   listener, mirroring the useInView/IO pattern already used in the sections.
 * - Writes are rAF-batched and value-guarded (no redundant DOM writes).
 * - Homepage sections mount lazily (Suspense), so we re-scan for section[id]
 *   for a short window until the expected set is observed, then stop.
 */

// Bold-branded map: light sections read as brand sky, dark bands go navy.
const SECTION_THEME: Record<string, string> = {
  hero: '#1E293B',
  'why-us': '#7DD3FC',
  services: '#7DD3FC',
  'before-after': '#1E293B',
  process: '#7DD3FC',
  testimonials: '#7DD3FC',
  faq: '#7DD3FC',
  contact: '#7DD3FC',
}
const DEFAULT_THEME = '#7DD3FC'

function ensureMeta(): HTMLMetaElement {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.appendChild(meta)
  }
  return meta
}

export function useThemeColor(enabled: boolean): void {
  useEffect(() => {
    const meta = ensureMeta()

    // Non-home routes have no themed sections — hold the light default.
    if (!enabled) {
      if (meta.content !== DEFAULT_THEME) meta.content = DEFAULT_THEME
      return
    }

    let current = meta.content
    let writeRaf = 0
    const setColor = (color: string) => {
      if (color === current) return
      current = color
      cancelAnimationFrame(writeRaf)
      writeRaf = requestAnimationFrame(() => {
        meta.content = color
      })
    }

    // Sections currently crossing the centre band, in insertion order.
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id
          if (!(id in SECTION_THEME)) continue
          if (entry.isIntersecting) visible.add(id)
          else visible.delete(id)
        }
        // The thin band usually holds exactly one section; if a boundary is
        // mid-band, prefer the most recently entered (deeper in the scroll).
        const active = [...visible].pop()
        if (active) setColor(SECTION_THEME[active])
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    const scan = (): number => {
      let count = 0
      document.querySelectorAll<HTMLElement>('section[id]').forEach((el) => {
        if (el.id in SECTION_THEME) {
          count++
          if (!el.dataset.themeObserved) {
            el.dataset.themeObserved = '1'
            observer.observe(el)
          }
        }
      })
      return count
    }

    // Pick up lazily-mounted sections until the full set is present.
    const expected = Object.keys(SECTION_THEME).length
    let tries = 0
    let pollRaf = 0
    const poll = () => {
      if (scan() >= expected || tries++ > 90) return
      pollRaf = requestAnimationFrame(poll)
    }
    poll()

    return () => {
      cancelAnimationFrame(writeRaf)
      cancelAnimationFrame(pollRaf)
      observer.disconnect()
      document.querySelectorAll<HTMLElement>('section[id]').forEach((el) => {
        delete el.dataset.themeObserved
      })
    }
  }, [enabled])
}
