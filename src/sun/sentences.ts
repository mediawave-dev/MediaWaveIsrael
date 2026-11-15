// sun · a new line after every sentence (D282, Nati 16.11.2026: "תדאג לרדת שורה אחרי נקודות").
// In running text, a period that ends a sentence and has more words after it ends the line: the next sentence starts
// on a new one. Done once on the page, not in the copy: the copy stays plain sentences in content.ts and the data
// files, and every text on the site (the legal pages' own markup too) gets the same rule.
//  · where: paragraphs, list items, definitions, captions and quotes in the page and the footer's line.
//  · never: headings, buttons, the sticker, and text that changes while the page is open (the form's status and its
//    field errors), so nothing React writes later is ever split.
//  · when: right after each render, inside the same task (a MutationObserver's microtask), so the browser never paints
//    a paragraph without its breaks; the prerender runs it too, so the HTML has the breaks without any script.
// It only adds a <br> and drops the space after the period; running it again finds nothing more to do.

const BLOCKS = 'main :is(p, li, dd, td, figcaption, blockquote), footer p'
const SKIP = 'h1, h2, h3, h4, h5, h6, .btn, .say, .sticker, [aria-live], [role="status"], .field__err, script, style'
const INSIDE = /\.[ \t\n\u00A0]+(?=\S)/ // a period, the space after it, and more words in the same text
const AT_END = /\.[ \t\n\u00A0]+$/ // a period and a space that end this text, with more after it in the same block

function breakText(t: Text) {
  let node: Text = t
  for (let m = INSIDE.exec(node.data); m; m = INSIDE.exec(node.data)) {
    const rest = node.splitText(m.index + 1)
    rest.data = rest.data.replace(/^[ \t\n\u00A0]+/, '')
    rest.parentNode?.insertBefore(document.createElement('br'), rest)
    node = rest
  }
  // the next sentence starts in the next element (a link, a bold word): the break goes between them
  const next = node.nextSibling
  if (AT_END.test(node.data) && next && !(next instanceof HTMLBRElement) && (next.textContent ?? '').trim()) {
    node.data = node.data.replace(/[ \t\n\u00A0]+$/, '')
    node.parentNode?.insertBefore(document.createElement('br'), next)
  }
}

export function breakSentences(root: ParentNode = document) {
  root.querySelectorAll(BLOCKS).forEach((block) => {
    if (block.closest(SKIP)) return
    const walk = document.createTreeWalker(block, NodeFilter.SHOW_TEXT)
    const texts: Text[] = []
    for (let n = walk.nextNode(); n; n = walk.nextNode()) texts.push(n as Text)
    for (const t of texts) if (!t.parentElement?.closest(SKIP)) breakText(t)
  })
}

/** Breaks the page's sentences now and after every render (route changes, late chunks, the consent note). */
export function startSentences() {
  if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') return
  const root = document.getElementById('root') ?? document.body
  let busy = false
  const run = () => {
    if (busy) return
    busy = true
    try { breakSentences(document) } finally { busy = false }
  }
  new MutationObserver(run).observe(root, { childList: true, subtree: true })
  run()
}
