# slop-scan — http://localhost:4177/

**Slop Index 25/100 — some template tells** · 1 file(s) scanned
Second-order signals: none

Rendered fonts — headings: MW Display, body: MW Text

| rule | hits | points | what it means |
|---|---|---|---|
| uniform-card-grid | 1 | 10 | ≥3 sibling cards with an identical recipe (same surface + heading + paragraph [+ icon]). |
| copy-faq-vendor-voice | 7 | 5 | FAQ in the seller's written register (3+ questions opening with "האם" / "Do you offer…") — write them as the customer says them. |
| faq-tail | 1 | 5 | ≥4 accordions in the last 40% of the page, ≥50% of them phrased in the seller's register (האם / Do you / Can I). |
| giant-footer-wordmark | 1 | 5 | Giant footer wordmark (≥10vw text or full-width SVG). |

## Evidence
### uniform-card-grid
- ul.why__list ×3
### copy-faq-vendor-voice
- text —  האם תומכים בתחזוקה שוטפת?
- text —  האם האתר יהיה ידידותי למובייל?
- text —  האם אוכל לעדכן תכנים בעצמי?
- text —  האם אפשר לשלב חנות מקוונת?
- text —  האם אני צריך לספק תכנים ותמונות?
- text —  האם האתר יופיע בגוגל?
### faq-tail
- 13 accordions in the last 40%, 7 in the vendor's voice
### giant-footer-wordmark
- svg 18px