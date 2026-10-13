# motion-audit — http://localhost:4177/

Passes: map, smoothness, reduced · dead zone ≥ 3 vp · CLS budget 0.05 · smoothness runs auto (1, or 3 near a budget) · timing checks do not set the exit code

## desktop (1440×900)

Page 15833px · peaks 8 · held (pinned/sticky) 50% · theme switches 5 · animated elements 171 (scrub 83, trigger 88, scrub ratio 0.49) · early entrances 0 · idle-moving 6

Smoothness (1 run): 14933px in 22s · p95 16.9ms · jank 0.3% · long tasks 0ms · long-frame blocking 0ms

| ok | check | detail |
|---|---|---|
| PASS | page actually loaded and rendered text | 3292 chars of text, 15833px tall |
| FAIL | no page errors | console: wasm streaming compile failed: TypeError: Failed to execute 'compile' on 'WebAssembly': Incorrect response MIME type. Expected 'application/wasm'. // console: falling back to ArrayBuffer instantiation |
| PASS | page scrolled to the end | map 14933/14933px · smoothness 14933/14933px · reduced 14933/14933px |
| PASS | no content stuck invisible mid-screen | none (327 cued-later observations) |
| PASS | no horizontal overflow | 0px |
| PASS | reveals are not a monotone fade-up | fade share 0.15, 14 motion kinds |
| PASS | has at least one memorable moment (held scene or scrub-driven section) | 8 peaks: 2 held scenes, scrub ratio 0.49 |
| PASS | no monotone zone (6+ reveals, 80%+ plain fades) | none |
| PASS | no dead zone ≥ 3 viewports | none |
| PASS | p95 frame ≤ 34ms while scrolling (timing) | 16.9ms (p50 16.7) |
| PASS | janky frames ≤ 12% (timing) | 0.3% |
| PASS | CLS during scroll ≤ 0.05 (worst session window) | 0 (sum 0) · top sources: none |
| PASS | long tasks during scroll ≤ 400ms (timing) | 0ms (longest 0ms) |
| FAIL | reduced motion: all content visible | y=2700 h3: "דפי נחיתה" / y=2700 p: "דף אחד שהופך גולש לפנייה בוואטסאפ." / y=2700 p: "לפרטים" / y=2700 a: "לפרטים" |
| FAIL | reduced motion: nothing moves on its own | 8 elements moving while idle (normal mode: 6) |
| FAIL | reduced motion: nothing animates on scroll | 8 moving: div.kh__tilt in section#hero.kh@2, span.absolute.inset-0, g#947, g#949, g#951 · not counted: g in section#why-us.why@3 (aria-hidden) ×54, g in section#services.flight@4 (aria-hidden) ×31, g in section#process.launch@5 (aria-hidden) ×21 |
| FAIL | reduced motion: no page errors | console: wasm streaming compile failed: TypeError: Failed to execute 'compile' on 'WebAssembly': Incorrect response MIME type. Expected 'application/wasm'. // console: falling back to ArrayBuffer instantiation |

**Holds**: section#services.flight 2281→6845 (4564px) · section#process.launch 8140→11444 (3304px)

**Motion kinds** (seen): scale+rotate×1, fade×10, scale+horizontal×9, scale×3, other×62, clip×1, horizontal×15, masked-rise×10, rotate×29, scale+rotate+horizontal×1, fade-up×3, rotate+horizontal×15, morph×11, vertical-travel×1

**Per section** (scrub/trigger · fade share · kinds · early entrances · dead share):
- section#hero.kh@1: 1/0 · fade share 0 · scale+rotate×1 · dead 0
- section#why-us.why@2: 30/4 · fade share 0.75 · fade×3, horizontal×7, other×8, rotate×14, scale×1, scale+rotate+horizontal×1 · dead 0
- section#services.flight@3: 16/33 · fade share 0.03 · scale+horizontal×6, other×25, fade-up×1, rotate×10, masked-rise×3, horizontal×1, scale×1, morph×2 · dead 0
- section#process.launch@4: 15/40 · fade share 0.15 · scale×1, other×12, fade-up×2, fade×4, morph×9, vertical-travel×1, masked-rise×2, scale+horizontal×2, rotate+horizontal×13, horizontal×6, rotate×3
- div.bw@6: 1/0 · fade share 0 · clip×1
- footer.mw-foot@7: 0/8 · fade share 0.25 · horizontal×1, masked-rise×4, scale+horizontal×1, fade×2
- body: 8/0 · fade share 0 · other×8
- header#top.mw-head@8: 3/0 · fade share 0 · other×3
- div.lm@9: 9/0 · fade share 0 · other×5, rotate+horizontal×2, rotate×2 · dead 0
- section#contact.ct@10: 0/3 · fade share 0.33 · fade×1, other×1, masked-rise×1

**Theme timeline**: 0: rgb(0, 16, 64) → 1800: rgb(248, 248, 248) → 4500: rgb(112, 112, 112) → 7650: rgb(0, 8, 32) → 12150: rgb(112, 112, 112) → 13500: rgb(0, 8, 32)

**Long tasks by section**: none

**Longest tasks**: none

**Long-frame scripts**: react-vendor-CCN-2QgV.js Mn [MessagePort.onmessage] 42ms

**Reduced motion, changes not counted**: g in section#why-us.why@3 (aria-hidden) ×54, g in section#services.flight@4 (aria-hidden) ×31, g in section#process.launch@5 (aria-hidden) ×21, path in section#process.launch@5 (aria-hidden) ×10, g in div.lm@9 (aria-hidden) ×9, div.flight__fly in section#services.flight@4 (aria-hidden) ×6, path in section#why-us.why@3 (aria-hidden) ×6, div.flight__caption in section#services.flight@4 (opacity only) ×5, span.why__off in section#why-us.why@3 (opacity only) ×3, g in footer.mw-foot@8 (aria-hidden) ×3

## mobile (390×844)

Page 15514px · peaks 8 · held (pinned/sticky) 42% · theme switches 5 · animated elements 181 (scrub 61, trigger 120, scrub ratio 0.34) · early entrances 3 · idle-moving 3

Smoothness (3 runs, median): 14670px in 40.9s · p95 83.6ms · jank 15.4% · long tasks 12998ms · long-frame blocking 6170ms · per run: p95 83.6ms, long tasks 12998ms / p95 100.3ms, long tasks 13155ms / p95 83.6ms, long tasks 12404ms

| ok | check | detail |
|---|---|---|
| PASS | page actually loaded and rendered text | 3250 chars of text, 15514px tall |
| FAIL | no page errors | console: wasm streaming compile failed: TypeError: Failed to execute 'compile' on 'WebAssembly': Incorrect response MIME type. Expected 'application/wasm'. // console: falling back to ArrayBuffer instantiation |
| PASS | page scrolled to the end | map 14670/14670px · smoothness 14670/14670px · reduced 14670/14670px |
| PASS | no content stuck invisible mid-screen | none (295 cued-later observations) |
| PASS | no horizontal overflow | 0px |
| PASS | reveals are not a monotone fade-up | fade share 0.08, 14 motion kinds · 3 early entrances not counted |
| PASS | has at least one memorable moment (held scene or scrub-driven section) | 8 peaks: 2 held scenes, scrub ratio 0.34 |
| PASS | no monotone zone (6+ reveals, 80%+ plain fades) | none · 3 early entrances not counted |
| PASS | no dead zone ≥ 3 viewports | none |
| FAIL | p95 frame ≤ 50ms while scrolling (timing) | 83.6ms (p50 16.7) · median of 3 runs, range 83.6-100.3ms |
| PASS | janky frames ≤ 20% (timing) | 15.4% · median of 3 runs, range 14.1-15.5% |
| PASS | CLS during scroll ≤ 0.05 (worst session window) | 0 (sum 0) · top sources: none |
| FAIL | long tasks during scroll ≤ 1000ms (timing) | 12998ms (longest 269ms) · longest: 269ms at y=4800 (section#services.flight), 235ms at y=7920 (section#process.launch), 226ms at y=11040 (section#faq.faq), 183ms at y=8880 (section#process.launch), 171ms at y=12240 (div.bw) · median of 3 runs, range 12404-13155ms |
| FAIL | reduced motion: all content visible | y=2532 h3: "בניית אתרים" / y=2532 p: "אתר שנבנה בקוד, נטען מהר ושייך לכם." / y=2532 p: "לפרטים" / y=2532 a: "לפרטים" |
| FAIL | reduced motion: nothing moves on its own | 3 elements moving while idle (normal mode: 3) |
| FAIL | reduced motion: nothing animates on scroll | 10 moving: div.kh__tilt in section#hero.kh@2, span.absolute.inset-0, g#947, g#949, g#951 · not counted: g in div.lm@9 (aria-hidden) ×46, g in section#process.launch@5 (aria-hidden) ×44, g in section#why-us.why@3 (aria-hidden) ×30 |
| FAIL | reduced motion: no page errors | console: wasm streaming compile failed: TypeError: Failed to execute 'compile' on 'WebAssembly': Incorrect response MIME type. Expected 'application/wasm'. // console: falling back to ArrayBuffer instantiation |

**Holds**: section#services.flight 2464→6234 (3770px) · section#process.launch 7428→10185 (2757px)

**Motion kinds** (seen): scale+rotate×1, fade×7, scale×6, scale+horizontal×7, other×51, clip×1, scale+rotate+horizontal×1, masked-rise×17, horizontal×14, rotate×24, morph×18, fade-up×3, vertical-travel×4, rotate+horizontal×27

**Per section** (scrub/trigger · fade share · kinds · early entrances · dead share):
- section#hero.kh@1: 0/1 · fade share 0 · scale+rotate×1 · dead 0
- section#why-us.why@2: 24/13 · fade share 0.08 · fade×1, horizontal×8, other×13, rotate×10, scale×1, morph×4 · early 3 · dead 0
- section#services.flight@3: 6/42 · fade share 0.02 · scale×2, scale+horizontal×5, other×16, fade-up×1, rotate×9, vertical-travel×1, masked-rise×8, rotate+horizontal×2, morph×4 · dead 0
- section#process.launch@4: 12/48 · fade share 0.13 · scale×1, other×7, fade-up×2, fade×4, morph×10, vertical-travel×3, masked-rise×3, scale+horizontal×2, rotate×5, rotate+horizontal×17, horizontal×6
- div.bw@6: 0/1 · fade share 0 · clip×1
- footer.mw-foot@7: 0/8 · fade share 0.25 · scale+rotate+horizontal×1, masked-rise×4, scale×1, fade×2
- body: 5/2 · fade share 0 · scale×1, other×6
- header#top.mw-head@8: 3/0 · fade share 0 · other×3
- div.lm@9: 9/0 · fade share 0 · other×1, rotate+horizontal×8 · dead 0
- section#contact.ct@10: 2/5 · fade share 0 · other×5, masked-rise×2

**Theme timeline**: 0: rgb(0, 16, 64) → 2110: rgb(248, 248, 248) → 4642: rgb(104, 104, 104) → 7174: rgb(0, 8, 24) → 10972: rgb(104, 104, 104) → 12238: rgb(0, 8, 24)

**Long tasks by section** (median run): section#process.launch 4269ms · section#services.flight 3610ms · section#contact.ct 1501ms · section#faq.faq 1249ms · footer.mw-foot 1098ms · section#why-us.why 752ms · div.bw 376ms · section#hero.kh 143ms

**Longest tasks**: 269ms at y=4800 (section#services.flight) · 235ms at y=7920 (section#process.launch) · 226ms at y=11040 (section#faq.faq) · 183ms at y=8880 (section#process.launch) · 171ms at y=12240 (div.bw)

**Long-frame scripts**: motion-engine-BYF60otI.js [TimerHandler:setTimeout] 4954ms · motion-engine-BYF60otI.js [DOMWindow.onscroll] 4842ms · react-vendor-CCN-2QgV.js Mn [MessagePort.onmessage] 925ms · (inline) [FrameRequestCallback] 589ms · lottie-DxNXyiW4.js p [FrameRequestCallback] 221ms

**Reduced motion, changes not counted**: g in div.lm@9 (aria-hidden) ×46, g in section#process.launch@5 (aria-hidden) ×44, g in section#why-us.why@3 (aria-hidden) ×30, g in section#services.flight@4 (aria-hidden) ×29, div.flight__fly in section#services.flight@4 (aria-hidden) ×6, path in section#why-us.why@3 (aria-hidden) ×6, div.flight__caption in section#services.flight@4 (opacity only) ×4, span.why__off in section#why-us.why@3 (opacity only) ×3, g in footer.mw-foot@8 (aria-hidden) ×3, path in footer.mw-foot@8 (aria-hidden) ×3
