# QA scripts (2026-10-13)

Puppeteer scripts written during the launch-night redesign. They import puppeteer from this repo's `node_modules` by absolute path and write their screenshots and reports to `G:/tmp/mw-qa/` (outside the repo). Run them with temp on G: (the C: drive fills up):

```bash
TEMP='G:\tmp\temp' TMP='G:\tmp\temp' node scripts/qa/rum.mjs https://mediawave.co.il/ 3
```

| Script | Does |
|---|---|
| `rum.mjs <url> [runs]` | real-browser FCP / LCP (+ element) / CLS / blocking on a phone with 4x CPU and slow 4G. Trust it over Lighthouse's simulated numbers |
| `live-check.mjs` | production, desktop and phone: console and network errors, the wasm content type, the contact companion going live, the fonts in use |
| `page-shots.mjs <url> <outdir> [fractions...]` | viewport frames down the page, desktop and phone |
| `hero-build-film.mjs [url]` | frames of the K look's hero build (#60) over time; reports whether `reveal` fired and the film plays |
| `sea-film.mjs [url] [d\|p\|s\|both\|all]` | the KM opener (#62): the opening frame by frame, the pointer lifting and splashing the water, a click or tap, the flood on scroll; `s` is a phone with the browser bars showing (390 x 664) |
| `tide-states.mjs [origin]` | the tide buttons in every state on `/states`, and a real hover and press on the hero's button |
| `a11y-header.mjs [origin]` | the phone header's accessibility trigger (#63) from 320 to 1280: positions, overflow, the panel opening from it and focus coming back |
| `sheet.mjs out.png cols scale files...` | a contact sheet of screenshots |
| `companion-live.mjs <url> <outdir> [desktop\|phone] [ok\|fail] [no-preference\|reduce]` | every contact-companion state; the form request is intercepted, never sent (needs a build with `VITE_CONTACT_ENDPOINT=https://form.test.invalid/submit`) |
| `why-measure.mjs [url]` | sizes of the why-us Lottie frames and boxes (the cropping bug) |
| `trace-section.mjs <url> <selector> [seconds]` | trace one section's scroll on a throttled phone: what fills the long tasks |
| `profile-scroll.mjs <url> [seconds]` | CPU profile of a throttled phone scroll, by script and function |
| `layers.mjs <url>` | composited layer count and sources at scroll fractions |
| `contrast-klein.py` | WCAG ratios for the palette's pairs, writes `design/audit/klein-contrast.md` |
| `font-specimens.mjs`, `text-specimens.mjs` | render font options on the real page (dev server on 5180) for Nati to choose from |
| `lh3.sh <url> <tag>` | Lighthouse mobile x3 with the median (Lighthouse 13.5 installed in `G:\tmp\lh`) |
