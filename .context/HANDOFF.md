# HANDOFF: the statement site (look `sun`), state on 13.11.2026 after D264

Older handoffs, including the round-by-round notes D237 to D253, are in `.context/handoff-archive/HANDOFF-until-D253.md`.
Every ruling is in `DECISIONS.rtl.md` (D237 to D264). The next decision number is **D265**.

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

## In progress: the initials MW in the logo
Nati (13.11): add the two initials MW, shown together with the logo; premium, high-tech, real quality; no agent fleets; invest only in the direction he picks.
- **Round 1 was rejected**: "כל מה שהצעת נראה מאוד גנרי. 2 היחידי שקצת הביא משהו מקורי. שום דבר פה לא משדר לי הייטק". It was the wordmark's own letters, coloured or cut (`design/logo/mw-initials/mw-1.jpg` to `mw-5.jpg`). He then asked for web research first.
- **Research**: `design/logo/mw-initials/RESEARCH.rtl.md` (LogoLounge 2026 and tech-logo reviews). The rule taken from it: a mark constructed from a few exact modules, with motion and depth in the still image, that survives one colour and 16 px. Never typed letters.
- **Round 2, sent to him as four phone images** (`design/logo/mw-initials/round2/`: `mw2-marks.mjs` holds the geometry, `mw2-board.mjs` renders the board, `mw2-1.jpg` to `mw2-4.jpg`). Fourteen sketches were drawn and judged as renders; seven held:
  1 fold (a folded strip, the grown-up form of round 1's number 2); 2 blades (triangle, slash, triangle); 3 channels (the zigzag as three parallel lines, solid below 40 px); 4 pulse (a square-cornered stroke, m above the horizon and w below); 5 sample (a smooth m and a w built of pixels); 6 roll (one ribbon rolling through mw); 7 lock (m and w as two interlocking combs).
- My recommendation to him: 1, with 4 and 5 next. Told him honestly: 2 is the boldest but its W is the least readable; 7 can read as columns.
- The board shows each mark beside the name without the present disc, as the new symbol. Whether the disc stays next to it is his call after the pick.
- **Waiting for his pick. Nothing of this is on the site.** After the pick, with the `svg-logo-designer` skill (refresh mode) for that one direction only: optical fixes, the small-size master, a reversed version, a proximity check against Miro and Webflow, then `logo-paths.ts`, `scripts/brand-palette.mjs`, `logos/horizon`, the favicon and app icons, the pinned corner in `Shell.tsx`, and a moving state for the mark.

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
1. Which MW proposal of round 2 to develop (or a third round).
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
1. Apply his MW pick as described above, record it as D265, show it on the preview.
2. On approval of the whole direction: rewrite DESIGN.md / PRODUCT.md / CLAUDE.md "Current state", run `site-gate-audit`, tag a rollback point, then production with his explicit yes.

## Important files
- `src/sun/sun.css`, `fonts.css`, `content.ts`, `Home.tsx`, `Wheel.tsx`, `Tide.tsx`, `Shell.tsx`, `pages.tsx`
- `src/data/work.json`, `services.ts`, `proof.ts`, `faqs.ts`
- `scripts/record-work.mjs`, `scripts/posters-from-video.mjs`, `scripts/prerender.mjs`, `scripts/brand-palette.mjs`
- `functions/api/lead.ts`, `stats.ts`, `event.ts`
- `design/audit/sun/qa/` (the checks: `behave.mjs`, `tap.mjs`, `qa.mjs`, `webkit-check.mjs`, README)
- `design/logo/mw-initials/` (round 1, the research, and `round2/`)
