// sun · the few glyphs the site needs, inline (no icon package in the first download).
import type { SVGProps } from 'react'

const base = (p: SVGProps<SVGSVGElement>) => ({ width: 20, height: 20, viewBox: '0 0 24 24', 'aria-hidden': true, focusable: false, ...p } as const)
const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const IconWhatsApp = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.400 7.400 0 0 1-1.400-1.700c-.100-.200 0-.400.100-.500l.400-.400.200-.400a.500.500 0 0 0 0-.400c0-.100-.600-1.400-.800-1.900s-.400-.400-.600-.400h-.500a1 1 0 0 0-.700.300 2.900 2.900 0 0 0-.900 2.200 5 5 0 0 0 1.100 2.700 11.500 11.500 0 0 0 4.400 3.900c.600.300 1.100.400 1.500.500a3.600 3.600 0 0 0 1.600.100 2.700 2.700 0 0 0 1.800-1.200 2.200 2.200 0 0 0 .100-1.200c0-.200-.200-.200-.400-.300Z" /></svg>
)
/** points with the reading direction's "onward" (left, in Hebrew) */
export const IconArrow = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)} {...line}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>)
export const IconOut = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)} {...line}><path d="M9 7h8v8M17 7 7 17" transform="matrix(-1 0 0 1 24 0)" /></svg>)
export const IconPhone = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)} {...line}><path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>)
export const IconMail = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)} {...line}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 8 8 6 8-6" /></svg>)
export const IconMenu = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)} {...line}><path d="M4 7h16M4 12h16M4 17h10" /></svg>)
export const IconClose = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)} {...line}><path d="m6 6 12 12M18 6 6 18" /></svg>)
export const IconCheck = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)} {...line}><path d="m5 12.500 4.500 4.500L19 7" /></svg>)
export const IconPlus = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)} {...line}><path d="M12 5v14M5 12h14" /></svg>)
export const IconA11y = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)} {...line}><circle cx="12" cy="4.500" r="1.700" fill="currentColor" stroke="none" /><path d="M5 8.500c2.300.700 4.600 1 7 1s4.700-.300 7-1M12 9.500v5m0 0-3 6m3-6 3 6" /></svg>
)
