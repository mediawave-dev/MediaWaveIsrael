# Gates

2026-10-13T11:25:53.223Z · http://localhost:4177/

**FAIL: 2 of 11 checks**

| | gate | scope | page | detail |
|---|---|---|---|---|
| PASS | axe | 390 | / | 0 violations (axe 4.12.1) |
| PASS | axe | 1440 | / | 0 violations (axe 4.12.1) |
| PASS | anchors | 1440 | / | 5 links land below the header (the target 117 px below it), same spot with motion on and reduced, focus follows |
| FAIL | anchors | 390 | / | #contact reduced: focus did not move (stayed on button.lm__close; next Tab went to input#lead-name, expected a[href="tel:0528731808"]); #main-content: lands 75 px apart with motion on and reduced (top 167 vs 92; two offsets adding up?) |
| PASS | overflow | 320 | / | 0 px |
| PASS | overflow | 390 | / | 0 px |
| PASS | overflow | 768 | / | 0 px |
| PASS | overflow | 1440 | / | 0 px |
| PASS | nojs |  | / | JavaScript off shows 548 of 279 words (196 %); H1 visible without JavaScript |
| PASS | forms |  | / | 2 forms, 6 fields: every form has a receiver, every field a label. Note: form 1 (form.lm__form) is handled only by a listener on an div#root (React registers one for every form): submit it once by hand; form 2 (form.ct__form) is handled only by a listener on an div#root (React registers one for every form): submit it once by hand |
| FAIL | console |  | / | 2 error(s): console: wasm streaming compile failed: TypeError: Failed to execute 'compile' on 'WebAssembly': Incorrect response MIME type. Expected 'application/wasm'. (http://localhost:4177/assets/rive-Bf94lQ9W.js) \| console: falling back to ArrayBuffer instantiation (http://localhost:4177/assets/rive-Bf94lQ9W.js) |
| NOTE | lighthouse |  | / | skipped: no lighthouse binary on PATH (npm i -g lighthouse; 13.x needs Node 22.19 or newer, use lighthouse@12.8.2 on older Node, foundations.md §2) |