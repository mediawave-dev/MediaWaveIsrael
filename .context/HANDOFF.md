# HANDOFF: the statement site (look `sun`), state on 14.11.2026 after D269

Older handoffs, including the round-by-round notes D237 to D253, are in `.context/handoff-archive/HANDOFF-until-D253.md`.
Every ruling is in `DECISIONS.rtl.md` (D237 to D269). The next decision number is **D270**.

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
