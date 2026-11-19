# HANDOFF: the statement site (look `sun`), state on 18.11.2026: D296 and D297 (the opener, its sound) live

Older handoffs, including the round-by-round notes D237 to D253, are in `.context/handoff-archive/HANDOFF-until-D253.md`.
Every ruling is in `DECISIONS.rtl.md` (D237 to D300). The next decision number is **D301**.

## Open right now (19.11, later): D300 (an example site per kind) is LOCAL ONLY, not on the previews
- After seeing D299 on the preview he wrote: "במקום לחזור על עבודות, תבנה דוגמאות איכותיות עבור דף נחיתה, אתר תדמית ותוכנית ליווי. שייראה אמין". The work band and the client recordings in the rings are gone; "מה אתם צריכים?" now shows three example sites of fictional businesses, each in a phone under the word "דוגמה" (`Offer` in `src/sun/Home.tsx`, `src/sun/work.css`).
- The examples: `design/examples/{kav,snunit,kvasim}/index.html` (standalone pages, code only, no photographs): a solar landing page, a carpentry workshop's image site, a sleep consultant's programme site. He rejected the first round (generic names, the same skeleton three times, a marker under a heading as on our own site) and then asked for another business instead of an architects' office: each example now has its own name placement, hero alignment and emphasis. Their pictures: `node design/examples/shot.mjs <name>`. Their recordings in `public/work/`: `node scripts/record-work.mjs kav snunit kvasim --url=kav:file:///<worktree>/design/examples/kav/index.html ...`, then the still is the recording's first frame (ffmpeg to webp, 528 wide).
- Not pushed: his rule is that a new design goes to a preview only after he saw it and approved. The previews still carry D299 (commit 5994587).
- Waiting for him: his look at the pictures; whether to add free licensed photographs to the examples (as in D271); then the preview, then production (D298, D299, D300 together).

## 19.11: D299 (five design upgrades) is on both previews and NOT in production (its work band and rings were replaced by D300)
- He asked for five design proposals after a web check, then "תממש הכל... ותעלה בסוף את העבודה לתצוגה מקדימה". All five are built (details in D299): the work band "דפים ואתרים שבנינו" (a fan of three phones, `Work` in `src/sun/Home.tsx`, `src/sun/Phone.tsx`), real recordings in the rings of "מה אתם צריכים?", one leading colour (`src/sun/walk.ts`: the contact circle and the closing bars take a tint of the logo disc's colour; the opener's marker is #12CCBC), a slim cookie note with two equal choices, and desk layouts from 1100 px (`src/sun/work.css`).
- Waiting for him: his look at the preview on his phone and on a computer; the new copy in `WORK` (`src/sun/content.ts`); then his yes for production, which would also carry D298.
- Not checked: a real iPhone; how the walking tint of the contact circle looks to him over a whole 28 s round.
- Pictures of every changed part: `node design/audit/sun/qa/d299-shots.mjs [base] [phone|desk] [query]` (writes to `design/audit/sun/qa/out/d299/`).

## 18.11: D298 is on both previews and NOT in production (it goes out with D299)
- "מה כלול במחיר?" on the home page said writing is paid for separately, against the steps on the same page (D254: it is inside a landing page's price). Fixed in `src/data/faqs.ts`; picture `design/audit/sun/opener/faq-included.png` (`design/audit/sun/qa/faq-shot.mjs`). Waiting for his yes to push `main`.
- After the opener he asked for ideas and got ten (in the conversation of 18.11): 1 real client proof, 2 form mail and the numbers page (Cloudflare keys), 3 a lighter site on phones (pause the page's loops off screen, pin the LCP to the H1, a real iPhone check), 4 AI crawlers and robots, 5 one project told start to end, 6 this fix, 7 price and time beside each kind of site, 8 a landing page of our own for ads, 9 a small step ("send us your page, three notes in 24 hours"), 10 the accessibility statement and the share picture after the opener (the statement was NOT checked at the release). He picked 6 so far.

## Latest (18.11): D296 and D297, the opener "a wave of customers" with its sound, IN PRODUCTION
- Live since 18.11.2026: main 8f151a3, bundle index-ee_iyK-8.js. Rollback: tag `prod-before-opener` (b59afc6), or the Cloudflare Pages dashboard. Both previews are on the same code.
- His words: an opening screen that says "היי אנחנו MediaWave, ואנחנו טובים בלהביא לכם לקוחות.", code only; then the sound of waves on a tap and "super smooth" motion; then, after it played on his phone, "תעלה את זה לפרודקשן, שיהיה סופר איכותי".
- What it is: the page as a beach seen from above. Wave 1 leaves the greeting, wave 2 the statement and message bubbles (the customers), wave 3 covers everything and uncovers the site. About 9 s. A touch on the water turns the sound on and makes a ring; "Skip", Escape, Tab, the scrolling keys or a scroll send the last wave.
- Code: `src/sun/opener/` (`opener.ts` score, bubbles, sharp text, probe, readout; `shader.ts` the sea; `sound.ts` WebAudio; `opener.css`). Wiring: the second inline script in `index.html` (`html.mw-intro`, the cover), `entry.tsx` (starts it first), `sun.css` (the cover, the page's loops paused), `Shell.tsx` (cookie note at once, `useOneColourClock` holds the colour walks), `Wheel.tsx` (videos and drift wait), `btn.ts` (beats rest, one early beat), `content.ts` (`OPENER`).
- Plays once per visit on the home page. Never: prerender, a driven browser (the gates), ?calm=1, ?reduce=1, a software renderer, a GPU that cannot hold 30 frames at the lowest resolution, the sea not up within 4.5 s. `?intro=1` replays; `?why=1` shows a box at the end with what it did on that device and why.
- What the field taught (all fixed, each with a check): on a real network the GPU probe ran while pictures were still loading and read "too slow" (found on the preview); on his phone `document.fonts.load()` rejected (the fallback face is `local("Arial Bold")`, Android has no Arial) and the wait listened only for success (found from his screenshot of the ?why=1 box); the page's own endless loops cost 19 ms of main thread a frame at a phone's CPU speed. Details: D296, D297 and the project memory `smooth-motion-gpu-stalls`.
- One independent review before release: 12 findings, each checked. Fixed: no safety net once live (now an error or 30 s gives the page), a 30 Hz screen read as late, sound in a hidden tab, focus on the page under the cover, buttons reachable while invisible, label-in-name, GPU memory, a resize read as a surge, Skip starting the sound. Left on purpose: `prefers-reduced-motion` is not a gate (D160, his rule for this site; the opener has Skip, ?calm=1 and the accessibility panel), the wheel's videos start 1.5 s after the opener (at once, their decoding cost its fade-out frames).
- Checks (`design/audit/sun/qa/opener/`): `modes.mjs <base>` 20 checks; `perf.mjs` frame pacing; `readout.mjs` the ?why=1 report under three device shapes; `why.mjs` a first visit's timeline; `frame-trace.mjs`, `boot-trace.mjs`, `trace.mjs` Chrome traces; `sound.mjs` + `analyse.py` the sound as a file. Run `modes.mjs` and `readout.mjs` against the DEPLOYED address after every push: localhost showed neither field bug.
- Measured on production: gates clean on 12 pages, 404 answers 404, 20 mode checks passed, the opener plays in a phone's shape with 0 late frames (7 of 519 at CPU x4). His phone (Galaxy, Adreno 750, Chrome 157, DPR 3.75): played to the end, 0 late frames, worst 25 ms (at resolution 1.5; the release raises a strong phone to 2, which his phone has not shown yet).
- Lighthouse mobile on `/`, this PC: 63 to 74 when its Chrome plays the opener (it has the real GPU; the cost is making the AudioContext ahead, 230 to 370 ms, x4 simulated); 98 to 99 with `--chrome-flags="--headless=new --disable-gpu"` (the opener gives up at once); 86 to 98 with `--enable-automation` (no opener; the low runs are the wheel's picture becoming the LCP at 3.5 s, which happens without the opener too). Inner pages 94 to 95.
- Open: the sound was judged by measurement only on this side; on his phone it was on when the opener played, and he has given no verdict on how it sounds; once per visit or every visit (now once); the yellow marker; the labels in English ("Skip", "Tap for sound"); whether the sound engine is made ahead (now) or at the first touch (better local Lighthouse, a possible 0.1 to 0.25 s freeze under the first click on a cold Windows browser).

## Latest (15.11 night)
- **D293 live** (main f23d1da): the colour walk is seven vivid colours (turquoise to lime, OKLCH 0.76, 28 s, 28 OKLCH stops so nothing goes olive) on the disc's lower half, the footer sea, the footer W and the marker. Production gates clean, footer modes 0 errors.
- **D294 live** (main b59afc6): running text Assistant Bold (`public/fonts/assistant`, OFL), picked "A" from the usual content faces board. font7 files removed from the site.
- **D295 live** (main b59afc6): the chat that answers (`useChat` in `Home.tsx`, `CHAT` in `content.ts`, styles in `stage.css`): two quick replies, MediaWave answers, four kinds, then the WhatsApp message is written in the input. The box holds its height at the first tap; section height 561 before and after. Recorder: scratch `chat/chat-video.mjs <base> yes|no <kind>`.
- Both checked on the build and again live (bundle index-BJNXEOIX.js): gates 12 pages clean, footer and calm modes 0 errors, the chat run end to end on production with the section at 561 before and after and `/api/event` accepting the clicks.

## D292 in production (his "Yes, to production", 15.11 evening; main 0f7424e, both previews on the same commit)
- The running text is **mediawave-font7 Bold** (our Kriti-spirited face), picked from numbered boards of every weight of font5, font6 and font7. Headings, buttons and labels stay Artzisraeli; Latin Saira; the chat the system face.
- `src/sun/fonts.css`: font7 Bold answers 100-800, Black 801-900, size-adjust 97%; Saira declared once per weight range (one Saira at 100-900 beside split ranges steals a weight in Chrome and drops the Hebrew to Arial Bold). Files in `public/fonts/mw7/`; preload in `scripts/prerender.mjs`.
- Text keeps the soft ink (`--ink-text`), emphasis the full ink, as with OffSet Bold (D281).
- On the way, font5 Regular and a new font5 Medium were tried (Medium added to `G:\Projects\fonts\mediawave-font5\build.py` and `gate.json`, gate PASS, copy in OneDrive). Not shipped.
- Live check: the home page preloads `mw7/mediawave-font7-Bold.woff2` (200, font/woff2), bundle index-06Ic1sTD.js; production gates clean on 12 pages; calm/stop and footer modes 0 errors.
- Board tooling (scratch, not project files): `weights2.mjs <base> <font> <size%>` injects a face over `--text` as a data URL; `fontboard.mjs <font> <label>` builds the numbered board.

## D289 to D291 in production (his "Yes, to production", 15.11; main 7777111, both previews on the same commit)
- **D289:** the footer's sea walks with the disc's colours, read from the disc's own animation clock (`useHorizon` in `Shell.tsx`).
- **D290:** the happier walk (seven colours; the clear half = the disc's water and now the footer's sea with ink text, 4.98:1 or more; the deep half turns back through fuchsia and purple so it never goes olive or brown), plus two sections that enter with the scroll: `Custom` (a WhatsApp thread, after Offer) and `Pitch` ("אנחנו MediaWave", before Contact) in `Home.tsx`, the motion hook `src/sun/stage.ts`, styles `src/sun/stage.css`, copy `PITCH` and `CUSTOM` in `content.ts` (his wording turned to the plural).
- **D291:** the walk is the pastel spectrum (eight shades, `mark-clear` and the Shell `PASTEL` list) on the disc's lower half, the footer sea, the footer W and the marker only; the disc's upper half and "Wave" stand still. The chat is drawn as WhatsApp's light screen in the system face (`stage.css`, `Custom` in `Home.tsx`).
- Checked on the build: 12 pages clean at 390 and 1440, axe 0, no layout jump; the two sections stand finished with ?calm=1 and the stop switch; the footer in its four modes. Scripts: `C:/tmp/night/fonts/stage-still.mjs`, `foot-modes.mjs`, `walk-contrast.mjs`, recorders `stage-video.mjs`, `sea-walk.mjs`.
- Live since 15.11 (bundle index-DTEUnd7r.js): production gates clean on 12 pages (axe 0, no overflow, no jump), garbage URL 404, footer in four modes, both sections finished under calm and stop.
- Records fixed in D290: D279 to D289 were logged as 16.11 by mistake; everything, the release included, happened on 15.11.

## IN PRODUCTION since 15.11.2026 (main 8da3de1 after D288; rollback tag `prod-before-sun` = 50a31eb)
- Checked on https://mediawave.co.il after the deploy: the new bundle, 12 pages clean at 390 and 1440 (axe 0, no overflow, no layout jump), a garbage URL answers 404, /your-site 302 to home, /api/event rejects an empty POST with 400 (no fake event sent), /api/lead 200.
- Lighthouse mobile, median of 3: / 95, /services/landing-pages/ 98, /privacy/ 97; a11y and best practices 100; CLS 0; LCP 2.6 / 1.9 / 2.4 s (lab, the same level as D274 before the day's work). SEO 92 only because Cloudflare's managed robots.txt adds a `Content-Signal` line Lighthouse does not know (not in the repo; there before the release too); his call in the Cloudflare dashboard.
- GPTBot and ClaudeBot still get 403 from the Cloudflare zone; the search and user agents get 200 (his call, unchanged).
- Open: real-iPhone check; whether Fontype's free licence covers web embedding (flagged to him, D283); the main checkout's CLAUDE.md "Current state" was updated in its working copy, not committed.
- D285-D287 (live, checked): the menu glyph is three waves (the disc's horizon), no bubble in the folded corner; the corner is one module, the disc's diameter: waves the same size, half a diameter between them, above them and to the screen's side, a full one of white under the disc (measured live at 320, 375, 390, 768, 1440). The folded corner's size per breakpoint follows from it (`--h1`, desktop `--w1: 190`). Measuring script: `C:/tmp/night/fonts/corner-measure.mjs`.
- Cloudflare builds production for `main` minutes after the branch preview of the same commit: wait for the production bundle name to change before judging a deploy.

## Latest (15.11 night): D275 to D278 on both previews
- **Buttons (D275, D277):** every button is a capsule of lens glass (`src/sun/btn.css`; the refraction filter is injected by `btn.ts` only in Chromium, the iPhone shows frosted glass). One conductor in `btn.ts` plays one beat at a time; every WhatsApp button plays the relay he described, as amended in D278 (chevrons from the middle out to the left, the MediaWave disc rolling in on its horizon in the header disc's colours, chevrons again, label back; the message line is gone; the ink glass is 84%); "איך זה עובד" dives in every turn (D280). Parts in `ButtonParts.tsx` (Glyph, Go, Say, Stage).
- **Phones (D276, D279):** only switchon, mediawave-2026 and maof keep the status strip (`STEADY_TOP` in `Wheel.tsx`); the rest run full screen under the island. iPhone 17 look in `sun.css` (`.wheel__card`, `--bz`, `--rad`, `--sb`, the island, the status strip from `--shot` set in `Wheel.tsx` and the service shots in `pages.tsx`).
- **Body text (D281):** EFT OffSet Bold (`public/fonts/eft/offset-bold.woff2`, "MW Text" in `fonts.css`, preloaded); headings, buttons and labels stay Artzisraeli. D282: everything centred (`src/sun/center.css`, loaded last) and a new line after every sentence (`src/sun/sentences.ts`, a DOM pass after each render, prerendered too). D281 and D282 are committed locally; push only after Nati approves the images.
- Not checked on a real iPhone. Production untouched; still blocked by the EFT web licence and his go.
- Scratch scripts in `C:/tmp/night/fonts/`: `beats-video.mjs relay` (slow-motion recorder, dev hook `window.__mwBeat`), `conductor-check.mjs`, `lens-scroll.mjs`, `phones-shot.mjs`.

## Goal
Nati (12.11): the site "says nothing", it only shows impressive design.
He wants a happy, audience-led site that makes a visitor contact MediaWave: landing pages, image sites, sites for courses and mentoring programmes.
Minimal, intuitive, premium, phone first, nothing that reads as AI slop. Previews only; production (`main`) is untouched.

## Where
- Worktree `.claude/worktrees/statement-20261112` (node_modules is a junction to the font1 worktree's).
- Branches `night/statement-20261113` and `redesign/statement-20261112` point at the same commit and are both pushed.
- Preview Nati looks at: https://redesign-statement-20261112.mediawaveisrael.pages.dev
- Dev servers: launch configs `sun` (5188) and `sun-dist` (5189, the built site) in the main checkout's `.claude/launch.json`.
- Push (only the account `mediawave-dev` can):
  `git -c credential.helper= -c 'credential.helper=!f() { echo username=mediawave-dev; echo "password=$(gh auth token -u mediawave-dev)"; }; f' push origin <branch>`,
  then fast-forward the other branch to the same commit and push it too.

## The site as it stands
- `src/sun/`: Shell (pinned folding logo corner, footer), Home, Wheel, pages (services, legal, 404), Proof, Tide, content.ts (every line of copy), sun.css with tokens at the top, fonts.css.
- Colours: mint field `#C9E8E2`, ink `#13241F`, logo ink over turquoise `#14A390` / `#0F8478`, contact circle sky blue `#BFE0F5`.
- Type (D249, D264): headings, buttons, labels and in-text emphasis in EFT Artzisraeli ("MW Head"); all running text in EFT Tirosh ("MW Text"); Latin in mediawave-font1 Bold. Each face is one cut declared 100 to 900.
- Hero: the promise, then the work wheel, then the buttons. The wheel has 16 slots: seven sites plus the "next site is yours" card, each twice on opposite sides, never two copies on screen (D261).
- Every wheel card is a looping 60 fps recording of the real site inside a phone frame (`public/work/<slug>-card-top.mp4` and `.webp` poster), made by `scripts/record-work.mjs` from `src/data/work.json` (D259, D260). Only on-screen phones play.
- The logo mark walks slowly through colours (D262). The same mark is a buoy button on the section waves and the water level in the step rings (`src/sun/Tide.tsx`, D263).
- Contact: the form in a sky-blue circle with an envelope animation. It opens WhatsApp today; mail through `/api/lead` is built and dormant until the Cloudflare keys exist (`docs/SETUP-MEASUREMENT-AND-FORM.rtl.md`).
- Service pages are built as the customer's questions (`src/data/services.ts`), with a new `program-sites` page. Proof places exist and are empty until real approved quotes arrive (`src/data/proof.ts`, `docs/PROOF.rtl.md`).
- Copy: Nati's picks from the morning board are folded into `content.ts` (D254). Landing pages start at 1,999 ₪ and writing the text is included.

## Tonight (13 to 14.11, D266): the logo on the site, the pre-production audit
- **Branches.** `redesign/statement-20261112` (the main preview Nati looks at) has everything up to the MW mark in the footer, which he approved (735fda8). Tonight's work is on `night/statement-20261114`, pushed with its own preview https://night-statement-20261114.mediawaveisrael.pages.dev and **not merged** into the main preview: he decides on the board.
- **His instruction (13.11 evening):** option 1 of the letters; an animation where the logo with the whole word contracts to MW; minimal, the icon stays wherever it already is, the other logos in smart places; perfect quality before production; work autonomously.
- **Built.** Header: the disc and MediaWave in option 1 (`src/sun/Brand.tsx`, path data `src/sun/brand-art.ts` from `design/logo/mediawave-v2/letters/brand.mjs`); the corner still folds to the disc alone at the same size (19 / 25 / 30 px). Footer: the MW mark (`src/sun/Emblem.tsx`) starts as the full logo and folds into MW once when it comes into view (rAF, about 1.9 s; end state is the prerendered markup). Kit: `logos/mediawave-v2` (12 SVG files from the site's own data, `kit.mjs`); `public/logo.png` for schema.org drawn from it; share image regenerated and its URL version bumped to v=20261114. `logos/horizon` stays the source of the disc and the favicons.
- **The board:** https://claude.ai/artifact/AJrdm6w7Tgf6kUH6AnWRx1 (db collection `picks`: `merge`, `steps`, `crawlers`, `production`, and `facts` with his notes on the EFT licence and his phone). Read it first.
- **Audit (site-gate-audit), all on the deployed night preview unless noted.** Lighthouse mobile, 3 runs per page, median: all 12 pages perf 99 to 100, accessibility 100, best practices 100, LCP 0.9 to 1.6 s, CLS 0, TBT at most 70 ms. SEO 66 only because pages.dev sends x-robots-tag noindex (the single failing audit is is-crawlable). axe 0 on 13 pages; one H1 and one canonical each; JSON-LD parses; sitemap = built pages; garbage URL answers 404; WebKit (Playwright) at two iPhone sizes clean. G2 on mediawave.co.il: GPTBot and ClaudeBot get 403 from the Cloudflare zone, the search/user agents get 200 (his call, on the board). The overlap audit does not apply to sun (no data-zone marks); first screen and page end checked by eye.
- **Independent review (one agent):** 23 findings, each verified by hand; 18 fixed and re-checked in the browser (commit ad59a13): the blank page on a malformed hash, an error net (`Oops` in SunApp.tsx), ?calm=1 for CSS loops, the consent choice now stops the counts, privacy page facts (no GA, no Netlify, counts without cookies or IP; **he should read it**), the accessibility statement's motion line, cache headers, /api/event cross-site and flood guard, no /studio in sun, form status live region, panel scroll on short screens, notch margins, no re-animation of content already on screen, the corner after reload, the hidden tab out of the reader's tree, the static underline. Not fixed on purpose: the opening on every home load (D241), names with a dot in the lead form, typing during a slow chunk load; "navy theme colour" was a false positive (the build rewrites it per look).
- One test event (page_view at /qa) was sent to the night preview's /api/event while checking it.
- **14.11 morning, from his phone:** "תמרכז כל מיני דברים שיהיו סימטריים" (the footer, e853a3d: one centre axis, three even columns on desktop, the back-to-top buoy on the middle of the bottom rule), then **D267** "תחזיר את הלוגו העליון הקודם": the header shows the original Horizon logo again (sizes as before D266), the share image and public/logo.png follow it. The footer MW and its fold stay. Both are on the night branch only.
- **14.11 afternoon:** he approved merging the night into the main preview ("כן. שהכל יהיה חלק"); both branches carry the same commits. Then **D268**: "Wave" in the header and the footer's W walk through the disc's colours on one clock; the footer MW is a button that opens into the header's logo and closes back, with a letter-by-letter swap under a brief blur (`Emblem.tsx`, `emblem-open.ts` from `design/logo/mediawave-v2/letters/open-art.mjs`).
- Smoothness on the main preview (Chrome, CPU slowed 4x, phone size): service pages a steady 60 fps; the home page 98% of frames on time, one 180 ms hitch that a trace shows is a GPU raster task of the software renderer, not page code (main thread at most 22 ms). Check on a real phone.
- All addresses in the live sitemap resolve on the new site (200, or a redirect for /your-site, /styles and the old blog).
- **14.11 evening, D269:** the running text is David Libre (his pick 12 of fourteen faces rendered on the real page) and every Latin letter is Saira Semi Condensed (he kept option D's Latin). Both OFL; Artzisraeli is now the only EFT face (its licence still blocks production). Bold inside text is David Libre Bold again (the D264 move to Artzisraeli is undone). Rejected on the way: Lampner, Miriam Libre, IBM Plex Sans Hebrew. The specimen tools are in `C:/tmp/night/fonts` (specimen2.mjs, compose.mjs); note that a candidate must get its own family name, because under the same name Chrome kept the old 100-900 face for weight 400.
- **D270:** "the sites in the carousel don't scroll": the review's Save-Data / "3g" guard (ad59a13) left real Android phones on stills. Removed; a refused autoplay (iPhone Low Power Mode) now starts on the visitor's next tap. Test: `node C:/tmp/night/fonts/wheel.mjs <base> 3g|savedata|refuse`.
- **D271:** two concept sites in the wheel, Maof as "צפרות עם עומר" (crane tours) and Zimzum as "מכוורת השקד" (an apiary), fictional businesses at Nati's request, with real Pexels photographs (ledger `src/concept/media/LEDGER.md`). Dev-only route `/concept/:id` in the legacy app: run the `concept` launch config (`npm run dev -- --mode look-shot --port 5187`), then `node scripts/record-work.mjs maof zimzum`; never edit worktree files while a recording runs (Vite reloads the page and the run dies). The wheel is now 20 phones at 18 degrees.
- **D272:** all running text is David Libre Bold (one cut for every weight; Latin in text is Saira SemiBold); in-text emphasis is in Artzisraeli again.
- **D273:** the contact circle and the steps' rings follow the scroll (progress from position, eased both ends, light lerp); no threshold-triggered entrances left on the sun pages except the footer MW fold (D268). Tests: `C:/tmp/night/fonts/contact-scrub.mjs`, `rings-scrub.mjs`. Two dev servers must not share Vite's optimizer cache (vite.config `cacheDir` per mode).
- **D274 (15.11):** one face for all text: Artzisraeli (headings 10% larger via "MW Head XL", text 6% smaller and #4A5A54); David Libre removed. Nati asked to see the full preview and then decide on production. Production still needs the EFT web licence (Artzisraeli now carries every word), real-phone checks, and his go.
- **Rule learned tonight:** nothing new goes to the main preview before he has seen it and said yes (memory note preview-needs-approval).

## Production procedure (only after his tap on the board AND the EFT licence confirmed)
1. `git fetch origin`; tag the live site: `git tag prod-before-sun origin/main` and push the tag (rollback point; the instant rollback is Cloudflare dashboard > the site > Deployments > the previous production deployment > Rollback). `scripts/rollback-prod.cmd` still points at the October tag; do not use it for this release.
2. Merge the approved branch into `main` and push `main` with the `mediawave-dev` account (the push command at the top of this file).
3. Verify live by content: `mw-logo--word` and the H1 in https://mediawave.co.il/ ; then rerun the gates against production: Lighthouse mobile 3 runs on /, a service page and /privacy/ (SEO must be 100 there, pages.dev shows 66 because of its noindex header), axe, a garbage URL answers 404, robots.txt, the six AI crawler user agents, `/api/event` accepts a real event.
4. After it is live: update the "Current state" section of CLAUDE.md in the main checkout (it still describes the Horizon logo and the sea of dots), the project memory, and refresh the share card in WhatsApp/Facebook debuggers if an old preview sticks.

## Decisions of this stretch (details in DECISIONS.rtl.md)
- D254 his picks from the morning board. D255 the wheel as phones, like Noam Avikasis.
- D256 to D258 the contact circle with an envelope; the sites scroll inside the phones.
- D259, D260 real video of each site, recorded frame by frame on a virtual clock.
- D261 Horizon Eilat added; a site appears at most twice.
- D262 sky-blue circle; the mark changes colours. D263 buoys and tide rings. D264 Tirosh.

## Standing rules from Nati (also in the project memory)
- No colons in copy, no lists of three, no "X שמביא Y", no dashes. No client names, no links to client sites, no faces of the owners, no invented proof.
- The two sisters' sites (Yael, Hila) never stand side by side on the wheel. No "MediaWave" visible on the card of the old MediaWave site.
- Few agents, and only for building. Images to his phone with SendUserFile. Hebrew replies, a new line after each long sentence.

## Waiting for Nati
1. His taps on the board (merge into the main preview, step names on the service pages, AI crawlers, production).
2. The EFT web licence for Artzisraeli and Tirosh. It blocks production.
3. Cloudflare keys for lead mail (`CF_ACCOUNT_ID`, `LEAD_TOKEN`, `LEAD_TO`).
4. Which past clients to ask for a sentence, and the Google Business profile link.
5. A look on a real phone, and his verdict on the preview as a whole.
6. Board questions never answered: the sample page (keep or redirect), `?proof=demo` on production, the programme page without pictures, the speed line.

## Known issues
- Not checked on a real phone or in real Safari (a Playwright WebKit pass was done earlier).
- No real mail has been sent (no keys).
- Ben David's own site is slow on phones (68); Machtesh is a demo site shown as work; Hila's slides were not confirmed to exclude her own face.
- `DESIGN.md`, `PRODUCT.md` and CLAUDE.md "Current state" still describe the earlier looks.
- The last Lighthouse run after D264 was a single run on the local build: performance 95, accessibility 100, CLS 0. The pushed preview was not re-checked by content after D264.

## Next steps
1. Read his picks from the board (db collection `picks`) and act on them; production only with the licence confirmed.
2. On approval of the whole direction: rewrite DESIGN.md / PRODUCT.md / CLAUDE.md "Current state", run `site-gate-audit`, tag a rollback point, then production with his explicit yes.

## Important files
- `src/sun/sun.css`, `fonts.css`, `content.ts`, `Home.tsx`, `Wheel.tsx`, `Tide.tsx`, `Shell.tsx`, `pages.tsx`
- `src/data/work.json`, `services.ts`, `proof.ts`, `faqs.ts`
- `scripts/record-work.mjs`, `scripts/posters-from-video.mjs`, `scripts/prerender.mjs`, `scripts/brand-palette.mjs`
- `functions/api/lead.ts`, `stats.ts`, `event.ts`
- `design/audit/sun/qa/` (the checks: `behave.mjs`, `tap.mjs`, `qa.mjs`, `webkit-check.mjs`, README)
- `design/logo/mw-initials/` (the MW rounds and his pick), `design/logo/mediawave-v2/` (the redrawn logo)
