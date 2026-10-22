/** A text that changes every frame (a counter, a readout): written only when it differs, into the same text
    node. textContent replaces the node, which restyles and relayouts its parent every frame (D210). */
export function setText(el: HTMLElement | null, v: string): void {
  if (!el) return
  const n = el.firstChild
  if (n && n.nodeType === 3 && !n.nextSibling) { if (n.nodeValue !== v) n.nodeValue = v } else if (el.textContent !== v) el.textContent = v
}
