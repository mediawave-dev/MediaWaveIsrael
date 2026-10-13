// The header's phone trigger for the accessibility panel (DECISIONS #63). The widget loads
// late (Layout's widgetsReady); a tap before then is kept on window and honoured on mount.
export const A11Y_EVENT = 'mw:a11y-toggle'

export function openAccessibility(from: HTMLElement | null) {
  const w = window as unknown as { __mwA11yPending?: HTMLElement | null }
  if (!document.querySelector('[data-accessibility-widget]')) { w.__mwA11yPending = from; return }
  window.dispatchEvent(new CustomEvent(A11Y_EVENT, { detail: from }))
}
