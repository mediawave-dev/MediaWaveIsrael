// Held scenes build their Lotties ahead of time: once the hold is about a screen and a half
// away, the rest of its items are built one per idle slot (building is the costliest script on
// a phone, and doing it as a step comes on stage blocked the scene mid-move). The on-stage
// item and its neighbours are still warmed immediately by the hold itself.

import { useEffect, type Dispatch, type RefObject, type SetStateAction } from 'react'

export function useIdleWarm(ref: RefObject<HTMLElement | null>, n: number, setWarm: Dispatch<SetStateAction<Set<number>>>) {
  useEffect(() => {
    const el = ref.current
    if (!el || n <= 1) return
    let next = 0
    let idle = 0
    let timer = 0
    let stopped = false
    const step = () => {
      idle = 0
      timer = 0
      if (stopped || next >= n) return
      const i = next++
      setWarm((w) => (w.has(i) ? w : new Set([...w, i])))
      schedule()
    }
    const schedule = () => {
      if (stopped || next >= n) return
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(step, { timeout: 2500 })
      else timer = setTimeout(step, 400) as unknown as number
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      schedule()
    }, { rootMargin: '150% 0px' })
    io.observe(el)
    return () => {
      stopped = true
      io.disconnect()
      if (idle) window.cancelIdleCallback(idle)
      clearTimeout(timer)
    }
  }, [ref, n, setWarm])
}
