// The contact card's ways: a glyph in place of each label (Nati, 18.10.2026). Decorative: the
// label word stays beside it for screen readers (sr-only). Ink line icons; the WhatsApp mark filled.
const L = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const box = { viewBox: '0 0 24 24', width: 22, height: 22, 'aria-hidden': true, focusable: false } as const

export const WaIcon = () => (
  <svg {...box}><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.3 14.8L2.4 21.6l4.7-1.2A9.7 9.7 0 1 0 12 2.2Zm0 17.6c-1.5 0-2.9-.4-4.2-1.1l-.3-.2-2.8.7.8-2.7-.2-.3A7.9 7.9 0 1 1 12 19.8Zm4.4-5.9c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.6-.2Z" /></svg>
)
export const PhoneIcon = () => (
  <svg {...box}><path {...L} d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" /></svg>
)
export const MailIcon = () => (
  <svg {...box}><rect {...L} x="3" y="5" width="18" height="14" rx="2" /><path {...L} d="m3.5 6.5 8.5 6.5 8.5-6.5" /></svg>
)
export const InstagramIcon = () => (
  <svg {...box}><rect {...L} x="3" y="3" width="18" height="18" rx="5" /><circle {...L} cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" /></svg>
)
