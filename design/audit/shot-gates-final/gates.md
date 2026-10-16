# Gates

2026-10-16T12:09:46.932Z · http://localhost:4181/

**FAIL: 3 of 11 checks**

| | gate | scope | page | detail |
|---|---|---|---|---|
| PASS | axe | 390 | / | 0 violations (axe 4.12.1) |
| PASS | axe | 1440 | / | 0 violations (axe 4.12.1) |
| FAIL | anchors | 1440 | / | #main-content: lands 32 px apart with motion on and reduced (top 308 vs 276; two offsets adding up?) |
| FAIL | anchors | 390 | / | #main-content: lands 5 px apart with motion on and reduced (top 337 vs 332; two offsets adding up?) |
| PASS | overflow | 320 | / | 0 px (html/body clip these, which phones do not always honour: ul.shot-sheet.shot-meet__sheet (-41..361)) |
| PASS | overflow | 390 | / | 0 px (html/body clip these, which phones do not always honour: ul.shot-sheet.shot-meet__sheet (-59..449)) |
| PASS | overflow | 768 | / | 0 px (html/body clip these, which phones do not always honour: ul.shot-sheet.shot-meet__sheet (-138..906)) |
| PASS | overflow | 1440 | / | 0 px (html/body clip these, which phones do not always honour: ul.shot-sheet.shot-meet__sheet (-51..1491)) |
| PASS | nojs |  | / | JavaScript off shows 595 of 397 words (150 %); H1 visible without JavaScript |
| PASS | forms |  | / | 1 form, 3 fields: every form has a receiver, every field a label. Note: form 1 (form.ct__form) is handled only by a listener on an div#root (React registers one for every form): submit it once by hand |
| FAIL | console |  | / | 1 error(s): console: Failed to load resource: the server responded with a status of 404 (Not Found) (http://localhost:4181/api/event) |