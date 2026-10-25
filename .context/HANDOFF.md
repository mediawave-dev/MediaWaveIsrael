# HANDOFF: blog for search, stored measurement, a form that emails (D218, 25.10.2026)

## Goal
Nati (25.10, autonomous): "continue what the prompt for the next session says" (`.context/BLOG-SEO-PROMPT.rtl.md`), with
one change of his own: the blog lives in the menu only, not visible on the home page, because it is there for search.
No production approval was given: everything is on branch `feature/blog-seo-20261025` and its Cloudflare preview.

## Where
Worktree `G:\Web-Dev\MediaWaveIsrael\.claude\worktrees\keys-form-20261021`, branch `feature/blog-seo-20261025`,
cut from origin/main 3b50c0b (D217, live). Preview: https://feature-blog-seo-20261025.mediawaveisrael.pages.dev
(previews send x-robots-tag: noindex, so Lighthouse SEO reads 66 there; locally 100).

## Completed (D218 in DECISIONS.rtl.md has the full record)
- Part A of the prompt: Analytics Engine storage in /api/event (binding EVENTS), page_view per route, a `src` tag from a
  post into /your-site/, the s60 name step, /api/stats private dashboard (Basic auth, STATS_KEY). /api/lead: Cloudflare
  Email Sending REST to a verified destination (free on any plan with Email Routing only); the form asks GET /api/lead on
  first focus and stays on WhatsApp until LEAD_TOKEN exists; on failure the WhatsApp link carries the visitor's words.
  Privacy line under the form. /styles in the sitemap. The studio's Details link 48px.
- Part B: the blog engine (src/blog, Markdown in src/content/blog, no HTML path, safe hrefs, `:::price` block shown only
  when pricing.ts is approved), /blog and /blog/:slug prerendered, sitemap, real /feed.xml, JSON-LD, an OG card per post
  (`node scripts/generate-og-image.mjs --blog`), old-slug 301s in public/_redirects. Menu-only entry ("בלוג", last).
- Keywords from Google Hebrew autocomplete (design/seo/keywords.rtl.md, raw G:/tmp/blog/kw/suggest.json): 13 posts
  planned, 3 written as the representative set for approval (price, restaurant, tapes).
- docs/SETUP-MEASUREMENT-AND-FORM.rtl.md: Nati's exact Cloudflare steps (Email Routing + verified address, two tokens,
  variables, the EVENTS binding, redeploy, checks).
- Independent review: no blocker; 5 should-fix + 4 minor, all fixed except the two that need Nati (below).

## Measured (build 3, local 4192, and the CF preview)
- all-pages 8/8 clean at 390 and 1440; axe 0 with every FAQ open; small text 0; overflow 0.
- Lighthouse mobile median of 3 on /blog/, the price post, the restaurant post: perf 99, a11y 100, seo 100, LCP 1.81 s,
  CLS 0. BP 96 locally only because serve-br has no /api/event (404 in the console); BP 100 on the preview.
- Overlap: 0 on the blog content and on / (320-1440). Remaining 4-8 at the END of every inner page (also /privacy and
  service pages in production today): the cookie banner covers the footer's legal links until a choice. Pre-existing.
- Preview: lead ready:false, POST 503 not_configured, event 204 / foreign origin 403, old slugs 301 to the right page,
  feed application/xml, unknown post 404, home has 0 links to /blog. Function unit run: G:/tmp/blog/fn/test.mjs.

## Waiting for Nati (do not act unasked)
1. Copy approval of the 3 posts and the index lines (all new text is [קופי: נתי]); then the next posts in the plan.
2. Production: tag prod-before-d218 on origin/main, then push HEAD to main, verify by content.
3. Cloudflare settings per docs/SETUP-MEASUREMENT-AND-FORM.rtl.md (only he can sign in).
4. Search Console: verify the property and submit https://mediawave.co.il/sitemap.xml (his Google sign-in).
5. Should service pages link to their posts? (helps search; not done because he said "menu only").
6. Privacy policy text still describes Google Analytics cookies; it should mention first-party counting and mail via
   Cloudflare. Legal text, his call.
7. Facts for the next posts (keywords file, last section): tape turnaround, how tapes reach us, formats beyond VHS/MiniDV.
8. Author: "MediaWave" until he picks a person and a photo. Moria asked to remove the blog on 6.10: decide together.
9. Older open items: prices (pricing.ts approved:false), the secondary link in the home opening (D217), the cookie
   banner over the footer on inner pages.

## Next steps
- On approval: write posts 4-13 (design/seo/keywords.rtl.md), each with its OG card; when an old slug returns as a post,
  delete its two lines in public/_redirects. Rebuild, gates (all-pages, overlap with --path, axe-blog), push the branch.
- Part C of the prompt not started: WebKit pass of /your-site/ (Playwright webkit-2203, not port 4190), the s60 WhatsApp
  message carrying a link to what the visitor saw.

## Important files
- src/blog/{markdown.ts, posts.ts, text.ts, Prose.tsx, BlogIndex.tsx, BlogPost.tsx, blog.css}; src/content/blog/*.md
- functions/api/{event.ts, lead.ts, stats.ts}; src/utils/{analytics.ts, lead.ts}; src/look/sections/Contact.tsx
- scripts/{blog-posts.mjs (frontmatter + validation), generate-seo.mjs, prerender.mjs, generate-og-image.mjs, overlap-audit.mjs}
- design/seo/keywords.rtl.md, docs/SETUP-MEASUREMENT-AND-FORM.rtl.md, DECISIONS.rtl.md (D218)
- Tools: G:/tmp/blog/tools/{shoot.mjs, axe-blog.mjs, contact.mjs}, G:/tmp/blog/gates2/run.sh, deliverables in G:/tmp/blog/deliver

---

# HANDOFF: "האתר שלכם ב-60 שניות" (/your-site/, D217, 23.10.2026)

## Goal
Nati (23.10, autonomous, away until 24.10 evening): build the brief in `.context/SITE-IN-60-PROMPT.rtl.md` at SOTD level with
site-director, take inspiration from an SOTD site, and "after verifying everything is perfect, push to production". His chat
message overrides the brief's "preview only"; the brief's price rule still holds (no unapproved number goes public).

## Where
Worktree `G:\Web-Dev\MediaWaveIsrael\.claude\worktrees\keys-form-20261021`, branch `feature/site-in-60-20261024`, cut from
origin/main 8210797. `feature/journey-20261023` (D216, e7250b6) is untouched and not merged.

## Completed
- /your-site/: trade (8 cards, dot glyphs) -> name (+ optional line) -> the wall of five live worlds -> the chosen world
  fills the screen, "what to build" sheet -> one WhatsApp message. Step kept in history (phone back = one question back),
  Back in the bar, WhatsApp and accessibility in the bar on every step, a tape timecode of the visitor's own time.
- The studio's preview mode (/styles/?preview=1, src/studio/preview.ts): the opening only, the visitor's name as the
  wordmark and the big line, a line per trade, no music/guide/invitations; postMessage with a hello handshake and a name
  echo (the frame goes on air only with the right name painted).
- Entry points: the home's style studio chapter (line + key), the world map, the menu and the footer. Not in the home's
  opening (one action there; for Nati to approve).
- Fixed on the way: the page turn's cream cover stayed 2.5 s on pages with their own shell (/styles/, /your-site/);
  menu hrefs on inner pages ("//styles/"); the cookie note no longer covers the flow (it shows after the send).

## Measured (final build)
- all-pages: 13 routes clean at 390 and 1440 (axe 0, overflow 0, text <12px 0, targets <44 0, errors 0), with /your-site/.
- axe on every step of the flow (not only the first screen): 0; the whole flow works by keyboard alone.
- overlap audit 0 at 320/390/768/1024/1440 on / and /your-site/.
- Lighthouse mobile /your-site/ (median of 3): perf 99, a11y 100, bp 100, seo 100; LCP 1.66 s, TBT 28 ms, CLS 0.
- One world cold on a 4x-slow phone: 0.9-1.5 MB, live in 4.5-4.8 s (why the frame starts loading at the name question).
  The wall usually opens on a live world (~0.9 s after typing in the runs).
- Chunk: YourSitePage 22 KB JS + 16 KB CSS; nothing new on the home page except a line and a key.

## The independent review (before release)
- One code-review agent on the whole change: 1 blocker + 9 findings, all fixed (D217). The blocker: public/_headers had
  X-Frame-Options: DENY, which also refuses same-origin frames: in production the frame would never load. Local serving
  ignores _headers, so only a Cloudflare deploy shows it. Now SAMEORIGIN + frame-ancestors 'self'.
- Then on the Cloudflare preview (real headers): all five worlds on air with the name, 0 errors, a world on air
  0.7-1.2 s after the wall turns, the race test (flick + immediate choice) agrees, film 30 s.
- Pre-existing, not from this change: /styles/ at 1440 has one Details link 42 px tall (the same in production today).

## Waiting for Nati
1. Prices: `src/data/pricing.ts` has placeholders [מחיר: נתי] (landing 2,500-4,500, site 6,000-12,000) and
   `approved: false`. Public visitors see no number, only the Terms' honest lines. See them with `?draft=1`. To go live:
   set the numbers, `approved: true`, build, push.
2. Copy [קופי: נתי]: the eight trades' lines (src/data/site-in-60.ts), the steps (src/site60/Steps.tsx), the message
   (src/site60/message.ts), the home's invitation (SeaStyles).
3. A secondary link in the home's opening: left out on purpose (D217); say if you want it.

## Next steps
- Nati's verdict on his phone. Rollback: `prod-before-d217` (tag = origin/main before this release), or the CF dashboard.
- Possible next: real per-trade sample images inside the worlds; a "send me the link" share of the visitor's preview.

## Important files
- src/site60/YourSitePage.tsx (the flow, history, take-over slot, timecode), Wall.tsx (the arc, finger, slot), Air.tsx
  (the one frame, handshake), Steps.tsx (questions, Key), glyphs.ts, message.ts, s60.css.
- src/studio/preview.ts + StylesPage.tsx (preview shell) + the five worlds (useHero) + studio.css (preview block).
- src/data/site-in-60.ts (trades, copy, cleanText), src/data/pricing.ts (placeholders, approved flag).
- Tools in G:/tmp/s60/tools (flow.mjs: drives the flow with a GPU and a finger; axe-flow.mjs;
  rec60.mjs: the film; measure-worlds.mjs). Shots and film: G:/tmp/s60/ (final-390, film-390.mp4).

---

# HANDOFF: the quality round, what SOTD sites do and ours lacked (23.10.2026, D211-D213)

## Where
- Worktree `G:Web-DevMediaWaveIsrael.claudeworktreeskeys-form-20261021`, branch `quality/wow-20261023`, cut from
  `origin/fix/home-feedback-20261023` (= origin/main 9cf2966 + the two home-feedback commits of 23.10). The old
  `sea/keys-form-20261021` branch (D185, never released, superseded by D208) is untouched.
- Nati's request: "תחקור היטב ותהיה מעשי, איך אתרים כמו שמופיעים ב-SOTD נראים באיכות כל כך גבוהה... תממש שדרוג איכותי".
  Then: "יש לך חופש פעולה מלא... תזדרז". No research round: the live site was filmed (G:/tmp/wow/live-1440, live-390)
  and compared with the SOTD anatomy already in design/research/02-awwwards.md.

## Completed
- D211 `src/look/sea/sea-craft.css` (imported by SeaHome after sea-site.css): hairlines draw in from the start side
  (scroll-driven `animation-timeline: view()`, compositor only; plain line where unsupported), labels roll on hover
  (`.sea-roll` in Header nav and the footer's quick links: real text + an aria-hidden copy), thin cream scrollbar,
  kerning on the display face. Gated by html.sea-reveal.
- D212 SeaHome `Included` under the process steps: six facts from the Terms (2, 3.2, 3.4, 4.2, 7.1, 8.1), [קופי: נתי].
- D213 the desktop scale (>= 1100px only): ledes 20px, list titles to 42px, why in three columns across the width,
  FAQ questions 24px, included in two columns. The phone is unchanged.
- D214 the service pages in the home's language (sea-craft.css part 6, ShotService.tsx passes mono kickers): no
  slabs, [ INCLUDED ] [ PRICE ] [ PROCESS ] [ FAQ ], heads at the start, rows on hairlines, the FAQ with ( 01 ).
- Checks: tsc clean. Full build 1 (D211-D213): overlap 0 at 320/390/768/1024/1440 (G:/tmp/wow/qa/overlap),
  all-pages 12 routes clean at 390 and 1440 (axe 0, overflow 0, small 0, targets 0, errors 0). Full build 2 (+ the
  menu roll, the hairline range): overlap 0 (G:/tmp/wow/qa2/overlap). GPU checks: the roll moves (-33px mid
  transition), the hairline is at 31% when the row is at 85% of the screen. Films: G:/tmp/wow/loc2-1440 (home),
  svc3-1440 and svc3-390 (the service page after D214), sheets sheet-*.jpg. NOT yet: Lighthouse, the live release.

## Next steps
1. Done: the final full build (HEAD 0217224, with D214) passed its gates: overlap 0 at 320/390/768/1024/1440
   (G:/tmp/wow/qa3/overlap), all-pages 12 routes clean at 390 and 1440 (G:/tmp/wow/qa3-pages-*.log). Lighthouse not run.
2. Preview (pushed 23.10, verified: the home has the included block, the service page its four kickers, the CSS the
   new rules): https://quality-wow-20261023.mediawaveisrael.pages.dev/ . The branch is on origin; main is untouched.
   The round's lessons went into site-director 1.3.0: references/sotd-finish.md (the gap audit, F1-F6, measured
   traps) and scripts/scroll-sheet.mjs (GPU film + contact sheet per route). Not committed in ~/.claude.
3. Nati's verdict on his phone, then release: tag `prod-before-d211` = origin/main at release time, push the
   branch, then HEAD:main with the mediawave-dev helper (origin/fix/home-feedback-20261023 is inside this branch;
   check whether that branch was released first, and merge if main moved).
4. Candidates for the next wave (not built): a price-drivers picker without numbers that prefills WhatsApp with the
   choice; the service pages at the desktop scale; a face and a name for the developer (needs Nati's photo).

## Tools
- `G:/tmp/wow/film.mjs <url> <outDir> <WxH>`: viewport frames every 0.85 screen with the GPU on (system Chrome,
  profile G:/tmp/pw-gl-profile). Run it with cwd = a worktree whose puppeteer resolves (elegant-20261019).
  This worktree's puppeteer has no Chrome 145 download: `npx puppeteer browsers install chrome` if needed.
- Parallel Bash calls here share one shell: never rely on `cd`, use absolute paths.

---
# HANDOFF: smooth scrolling on the site and in the worlds, a bug sweep (22.10.2026, D210)

- Measure: G:/tmp/perf/scroll-jank.mjs <url> <tag> <cpu> (INV=1 for invalidations), where.mjs (long frames by
  chapter; NOPLAY=1 stubs video play), callers.mjs (who calls a hot function), before.mjs (what dirtied style before
  a forced recalc), anims.mjs (running CSS animations), net.mjs (failed requests per route), flows.mjs (menu, chat,
  form, studio, links). A test build: vite build --outDir G:/tmp/postsend/dist-ep, served on localhost:4196.
- Rules learned: no endless main-thread CSS animation (letter-spacing, color, svg transforms) while scrolling; no
  layout read inside rAF (utils/scroll-cache.ts); counters via utils/set-text.ts; no mix-blend-mode on full-screen or
  moving video layers; start videos when the reader rests, not while passing; many moving sprites = one canvas.
- Files: utils/scroll-cache.ts (+ markScrolling in main.tsx), utils/set-text.ts, look/sea/{sea.css, SeaHome,
  SeaServices, field.ts, SeaTrail, sea-site.css}, ChatWidget (.mw-ai wrapper), motion/motion-engine.js (Lenis FINE
  only), studio/buzz/swarm.ts (canvas), studio/clay/room.ts, studio/flight/scene.ts, studio/blueprint/{Blueprint,
  Route, blueprint.css}, studio/portal.css.
Rollback: prod-before-d210.

---

# HANDOFF: the little world after a send, "the orbit" (22.10.2026, D209)

- src/studio/SentGuide.tsx + sent-guide.css: lazy, mounted by look/sections/Contact.tsx (SHOT only, once a visit)
  after a successful send ('now') or after the WhatsApp hand-off ('late': waits for the tab to come back).
  Portaled to body (a transformed ancestor broke position:fixed inside the section). Phases wait -> set -> in -> out
  ('set' paints at rest so the CSS entrances run). Frame loop writes transforms only; geometry measured once
  (and on resize) from the bubble's layout box. html.sg-on hides .gd/.gd-trail/.snd; html.sg-open locks scroll;
  html.sg-seen ends the main-site guide's visits (GuidePlan.until).
- src/studio/travel.ts: the wave + route change, shared by SiteGuide's map and SentGuide.
- SeaSteps: after 'sent' it resets without taking the focus.
- Tests: G:/tmp/postsend/run*.mjs (send the form and film), axe.mjs (axe inside the open scene: 0).
  Note: something old listens on 127.0.0.1:4196; serve.mjs on 4196 answers at localhost.
Rollback: prod-before-d209.

---

# HANDOFF: the contact form as an RPG window, Flight's clipped headings (22.10.2026, D205-D206)

- D206: src/look/sea/RpgWindow.tsx (useRpgWindow on the form + RpgChrome: frame, tab, cursor, block caret,
  "more" prompt), wired in look/sections/Contact.tsx (SHOT only: data-ok rows, data-ready, email as
  type=text + inputMode=email); CSS = the D206 block in sea-site.css; sounds select()/ok() in sea/sound.ts;
  public/fonts/PressStart2P-Latin.woff2. The mirror is position:fixed (an absolute one widened the RTL page).
- D205: flight.css: .fl-h2 is fit-content; the gradient text sits on the element holding the words.
  G:/tmp/perf/clip/clip.mjs + layer.mjs audit every background-clip:text element (overflow, layered child).
Rollback: prod-before-d206. D206 was replaced by D208 (SeaSteps, one question at a time; RpgWindow and the pixel font removed). D207: the rewind ring. Rollback for D207-D208: prod-before-d208.

---

# HANDOFF: the AI chat window in the site's material (22.10.2026, D204)

- src/look/sea/SeaChat.tsx + sea-chat.css: the shot look's chat panel (ChatWidget renders it when LOOK ===
  'shot'; it keeps state, focus trap, Escape, the visual-viewport height). Messages on Isle islands (bot dark,
  visitor cream), dotted input (focus = cream bigger dots), send = an island that fills when canSend.
- src/components/ui/chat-text.tsx: stripMarkdown + linkifyContent (shared by both panels).
- shot-base.css legacy chat rules now end in :not(.sc). html.chat-open hides .gd/.gd-trail/.snd; SoundInvite
  treats chat-open as busy and ignores taps while it is open.
- Isle: radius, ink=false; the ground's core is one rect (bands 0-3 as dots); the ink copy keeps all 5 bands.
Rollback: prod-before-d204 (when shipped).

---

# HANDOFF: the floating buttons on an island of halftone dots, the email row fits (22.10.2026, D203)

- src/look/parts/Isle.tsx: an SVG under a floating button (absolute, --out px beyond it): a 4px grid of round
  dots (zero-length path segments, round caps), one path per size band (5), solid in the capsule's core and
  shrinking toward the rim; a cream copy (.isle__ink) whose dots grow with the registered --grow (core first).
  Used by the header .sea-card, the dock's WhatsApp and AI, and the music invite (.snd). Redraws on resize only.
- sea-site.css D203 block replaces D202's dark square plate (in-page keys unchanged). The email row:
  a[href^="mailto:"] is an inline-size container; its b sizes clamp(13px, (100cqi - 108px) / 13.6, 34px).
- SeaRewind.tsx: the end meta row is a data-dock-hide zone (its INSTAGRAM link was under the dock).
Rollback: prod-before-d203 (when shipped).

---

# HANDOFF: the buttons in brackets, "Bracket" (22.10.2026, D202)

Nati picked option 2 of six (mockup G:/tmp/perf/btns, shots G:/tmp/perf/br) with the dotted WhatsApp mark.
- src/look/parts/Brackets.tsx: two mono spans (.btn-br--o "[", .btn-br--c "]") at the button's inline edges; RTL
  mirrors the glyphs. Used by KeyButton (inside .key__cap), the header .sea-card, the dock's WhatsApp and AI.
- src/look/parts/haptics.ts: the 7 ms Android tap for any button carrying .btn-br or .dot-ring (was in DotRing).
- sea-site.css (the D202 block, replaces D200's glass): keys have no capsule; hover / focus / press springs the
  brackets out 6px and fills a cream plate between them in steps(9) from --kx. Floating buttons: a dark square
  plate (0.88) with a cream hairline; the cream ::before fills in steps on hover / press.
- DotRing stays only for the steps' circles (kit.tsx). The music invite (.snd) uses the dark square plate.
Rollback: prod-before-d202.

---

# HANDOFF: the bubble no longer writes the words (21.10.2026, D201)

Nati: the words drawn in the bubble's dots were not as good as he thought. Reverted D171 (field.words from
SeaHome), D175 (SeaPeek, the phone copy over the form) and D177 (the lead's second line). The bubble keeps its
three waiting dots, which hop while typing (field.typed). field.ts still has the words path (unused, cheap).
Rollback: prod-before-d201.

---

# HANDOFF: glass buttons, even dot rings, the music invitation in the site's material, legibility (21.10.2026, D200) - LIVE (9a15c83)

Rollback tags: prod-before-d200 (= origin/main before this release), prod-before-d199, prod-before-d198.

## Completed
- src/look/parts/DotRing.tsx (+ dot-ring.css): equal dots along each button's own capsule (SVG path, pathLength =
  an even dot count), redrawn on resize; walks on hover, swells and runs on press; a 7 ms haptic on Android;
  the sheen follows the mouse (--gx). Used by KeyButton, the header card, the dock's two buttons, the steps.
- sea-site.css: smoked glass for every ringed button (blur, saturate, brightness 0.74 backdrop, tint 0.66,
  top sheen, rim hairline, shadow, a glint every 7.5 s, a sinking press with a spring release).
- SoundInvite.tsx (+ .snd in portal.css): glass + dot ring + halftone-dot equaliser + "[ Tap for sound ]" that
  decodes out of dots; shows only at a reading pause, never over words (bottom, under the header, or not at
  all), leaves when the reader scrolls on, 40 s apart, 3 a visit; the guide skips a visit while it shows.
- Legibility (scripts/qa/audit-read.mjs now takes PRE / SCOPE / ONCE / NOSND): the map's words have their own
  colours (the global h2 #2a2a2a made "לאיזה עולם עוברים?" dark on the home); Flight mists behind the services
  heading and "Watch"; the hero lead #c4bdaf; the skip link ink on cream; the studio bar fits in every world.
- Regression found and fixed: a position rule had pulled the header card out of its corner.

## Known issues
- Audit leftovers that are transitions, not states: Blueprint "[04]" half off the row's edge, a line at the very
  bottom edge crossing Blueprint's frame, Flight's night heading while it fades in.

---

# HANDOFF: smooth scrolling, the way home, Blueprint notes, music (21.10.2026, D199) - LIVE (1330b6b)

Rollback tags: prod-before-d199 (= origin/main before this release), prod-before-d198, prod-before-d194.

## Goal
Nati (21.10): scrolling "stuck, not smooth"; no way back to the main site from the worlds; Blueprint's notes cover
each other; Blueprint's music not beautiful; music not intuitive, should change between worlds like Spotify.

## Completed
- Scrolling (measured with real touch swipes, G:/tmp/perf/scroll-jank.mjs + stalls.mjs + prof.mjs):
  - no layout reads inside frames: SeaWay (chapter tops cached, ResizeObserver on body), SeaIsland, wave/clock.ts,
    sea/sound.ts follow(), studio/sideways.ts (top/vw cached), blueprint/Route.tsx (path sampled once), Buzz, Clay.
  - Buzz writes its three vars on the elements that use them, only on change; the bee wings beat from the swarm
    loop (two strokes, staggered), no CSS animations; paused / invisible swarms keep no layers.
  - sea-site.css: the island's fold rule names the bar's children (":not(.mw-head__logo)" restyled the page).
  - sea/sound.ts bakes its buffers at idle (timer slices); arm() starts only on a real tap (pointerup/touchend
    without movement, mouse pointerdown, key) and stays armed until the context runs (phones were left silent).
  - Live vs build at 2x CPU: Buzz frames >50ms 144 -> 2 (p95 66.9 -> 16.9 ms); home >33ms 117 -> 47.
- Way home: "( Home )" in the studio bar and "חזרה לאתר הראשי" in the map; goHome() covers with the wave in the
  sea's colours, navigates without a reload, reveals.
- Blueprint notes: one open at a time (tap), the drag selection replaces.
- Music: music/engine.ts crossfade (dim at the wave's start; 3.2 s equal-power fall with a closing filter, 2.8 s
  rise from a muffled start; per-track reverb send); new Blueprint track (felt piano, voices.piano, 92 BPM, a
  32-bar song); SoundInvite.tsx (studio worlds except Clay, and the home via SiteGuide): "Tap anywhere for
  music"; one AudioContext shared both ways (lendContext / adoptContext) so the music carries between the site
  and the worlds.
- QA clean (32 pages, overlap 0, GL x3, back). Lighthouse local: home 79, Buzz 94, Blueprint 96.

## Known issues
- The first tap that wakes audio still costs the AudioContext's creation (~80 ms on this desktop, once).
- Buzz at 4x CPU (a weak phone) is ~30 fps; 60 at 2x.

---

# HANDOFF: performance round (21.10.2026, D198) - LIVE: main = a011768

Rollback tag: prod-before-d198 (b166d2f). Live Lighthouse mobile (median of 3): home 87, Flight 94, Buzz 96,
Blueprint 96, Clay 95 (were 47, 42, 41, 87, 53). Live functional check (G:/tmp/perf/func.mjs) clean.

## Goal
Nati: "תעשה עכשיו בדיקות performance ותתקן".

## Completed (Lighthouse mobile, median of 3; live baseline -> local gzip build)
home 47 -> 80-84, Flight 42 -> 96, Buzz 41 -> 94, Blueprint 87 -> 96, Clay 53 -> 95. Home CLS 0.036 -> 0.001.
- scripts/prerender.mjs: the entry loads after load AND first-contentful-paint (was load + 150ms; Lighthouse's first
  paint was held to 2.3s and LCP chained the JS). Inner pages no longer carry two loaders and double font preloads.
- src/look/sea/WaDots.tsx + sea-site.css: the WhatsApp ripple is one shared 7s pass on marks in view (378 endless
  dot animations restyled every frame).
- src/styles/index.css: `[class~="bg-orange"] *` -> `.bg-orange *` (every class change restyled whole subtrees).
- Flight/Clay: renderer.compileAsync before the first frame (ready promise, live after it). curtain.ts:
  prepareCurtain() compiles at idle (StylesPage) or when the home map opens (SiteGuide).
- Guide.tsx: the loop sleeps while away, its CSS animations stop, the trail writes only coordinates (20 fps hovering),
  the trail clears on every "away".
- sea.css: the hero clock keeps its final width while it decodes from dots.
- QA (qa-all.sh) clean: 32 pages, overlap 0, GL in 3 browsers, back test; functional check G:/tmp/perf/func.mjs.

## Known issues / next
- Home TBT (300-700ms, noisy) is mostly the React remount (createRoot over the prerendered DOM) and the scroll
  scenes' setup; hydration is a separate, bigger change.
- The pre-JS parse/style/layout of the 200KB home HTML (3 passes) remains; content-visibility would break the
  pinned scenes' measurements.
- Tools: G:/tmp/perf/load-trace.mjs (+2 with invalidation reasons), prof.mjs (per-function profile), fp.mjs, cls.mjs.

---

# HANDOFF: readability, בוקר, sideways services (21.10.2026, D194-D197) - LIVE: main = D197 (see git log)

Rollback tags: prod-before-d197 (4fa6e8b), prod-before-d194 (c1159c5), prod-before-d192 (9fded74), prod-before-d178 (e34beec).
Verified live on mediawave.co.il: sideways rows in Buzz, Blueprint and Clay; no inspiration captions; the
clay world is called "בוקר"; films in G:/tmp/studio/live-sw-*.mp4.

## Goal
Nati (21.10): "איך אנחנו" was hard to read; deeper readability checks in every world; a new name for חימר;
remove the inspiration captions; remove the cassette's smile; services that travel sideways on scroll.

## Completed
- D194: `.st :is(h1..h4) { color: inherit }` (the site's global h2 colour made Flight's night headings dark);
  "חימר" -> "בוקר" (registry, styles-meta, lead line, map, title); credits removed from the foot, the map,
  the home cards and the travel title (they show the world's feel instead); the cassette's smile and blush
  meshes are gone (preview re-recorded); Clay's camera holds each pose through the first 30% of its chapter.
- D195: src/studio/sideways.ts (`useSideways`): a sticky stage, vertical scroll moves the track (RTL: to the
  right); Buzz = cards on an arc that play the middle video, Blueprint = a scan with an X readout, a playhead
  and a ruler, Clay = devices turning in depth with the big letter sliding. Flight keeps its tall words.
  Keyboard focus scrolls to the card; under the still tier the rows simply wrap.
- D196: scripts/qa/audit-read.mjs (text made transparent, contrast measured on the real pixels, WebGL
  included). Fixes: Flight mists behind word blocks + one glass card per step + the foot above the canvas;
  Blueprint red #C42A00 and lede grey #6B6B66. 0 firm fails in all four worlds at 390 and 1440.
- D197: the guide treats every span with text of its own as busy (not decorative wrappers like the sea's
  hero spot), skips a visit when no spot is free, and never visits a pinned sideways row (it flies off when
  one takes the screen). It sat on Blueprint's "[ SCAN · 06 ]" label in the live film.

## Key decisions
- Flight has no sideways row: its tall words are the world's signature (as in the source).
- The audit ignores closed <details> and aria-hidden text; lines still fading (opacity < .95) are reported
  apart as "moving".

## Known issues
- Lighthouse /styles on this machine is noisy (runs 89, 80, 41; median 80). Home median 71.
- Live chunk hashes differ from the local build (Cloudflare builds its own); check content, not hashes.
- On a cold GPU cache Clay's room shader blocks the main thread for seconds; the guide can stay frozen on a
  card for that moment (no frames are drawn). Test: G:/tmp/studio/guide-sw.mjs, home: home-guide.mjs.

## Next steps
1. Nati's verdict on the sideways rows, the readability, the name "בוקר".

## Important files
- src/studio/sideways.ts: the sideways hook every world uses.
- src/studio/Guide.tsx: the guide's flight, perch (busyBoxes) and plans.
- scripts/qa/audit-read.mjs: the legibility audit (`node scripts/qa/audit-read.mjs <url> 390x844 out.json`).
- G:/tmp/studio/qa-all.sh: build + every QA gate.

---

# HANDOFF: the home page invites into the worlds + legibility (21.10.2026, D192-D193) - LIVE: main = c1159c5

Rollback tags: prod-before-d192 (9fded74), prod-before-d191fix (d2c57c7), prod-before-d178 (e34beec). Verified live: home guide -> map -> wave -> world.

## Completed
- D192: src/studio/SiteGuide.tsx (lazy, mounted by Layout on the home page after the opening + load + idle):
  the little world in Horizon blue says "Explore 4 other worlds" (3 a visit, 40 s apart, once more at the
  letter); its map (WorldMap with current=null) opens a world through the wave and an SPA route change;
  StylesPage reads window.__studioArrival and opens the wave with the world's name. Guide.tsx takes a
  GuidePlan; the landing spot is chosen by measuring the boxes of buttons and text. portal.css holds the
  wave, the title, the guide and the map styles for both pages.
- D193: Flight's day words have a sky halo (drop-shadow on containers); Buzz's headline settles at 0.32 fuzz;
  no Hebrew in mono faces; the lead line isolates the English credit (bdi), no nested brackets.
- Earlier today, live: D178-D191 (main 9fded74 before this round; tags prod-before-d178, prod-before-d191fix).

## Next steps
1. Nati's verdict on the home invitation, the wave, the music, the journeys.
2. Possible: a "tour" mode that walks the four worlds; per-world music refinements; Flight's feathers (texture, bloom).

---

# HANDOFF: the style studio to production (21.10.2026, D185-D191) - branch feature/style-studio

## Goal
Nati: "let's see it in production"; then: an unforgettable switch between styles, no floating picker (a
character that drops by and offers another world), music for every world, scrolling that feels like a
journey. He picked: "work autonomously, you choose the styles and the names".

## Completed
- D185 home invitation: SeaStyles.tsx ("STYLE STUDIO" chapter after process: four live portrait previews
  from public/media/styles/*.mp4, recorded by G:/tmp/studio/rec.mjs); styles-meta.ts is the light list.
- D186 names kept (מעוף, זמזום, שרטוט, חימר); Clay's display face = Karantina 700.
- D188 the wave (src/studio/curtain.ts): a shader flood in the new world's colours with a squares spray,
  the name written in, a second wave that breaks open; other worlds preload at idle.
- D189 no floating picker: Guide.tsx (a little world with a ring and a comet trail, comes by after chapters,
  30 s cool-down, 5 a visit) opens WorldMap.tsx (dialog, four previews, "I want this world"); the bar has
  "( Worlds · 04 )"; the credit is in the foot.
- D190 music (src/studio/music/: voices, tracks, engine; sound.ts the shared switch; SoundButton.tsx in the
  bar, docks while playing); previews rendered offline by G:/tmp/studio/render-music.mjs.
- D191 journeys: blueprint/Route.tsx; Buzz escort swarm with scroll wind; Clay fixed room + arched windows
  and a camera path by chapter (renders only while seen).
- /styles CLS: the prerender keeps StylesPage and Flight CSS blocking and preloads Bellefair.

## Known issues
- Music is synthesized; Nati has 20 s previews (G:/tmp/studio/music-*.mp3) and may want changes.
- Vite dev can serve a stale module after big refactors: restart the dev server (seen once).

## Next steps
1. Release (tag, branch, main) after QA and Lighthouse; verify live.
2. Nati's verdict on the wave, the little world, the music, the journeys.

---

# HANDOFF: the style studio (21.10.2026, D178-D184) - branch feature/style-studio, NOT live

## Goal
A new page /styles/: the site's content in four styles, each a close re-reading of an award winner Nati
picked (The Power of Storytelling, Buzz, Heron AI, Léo Parpeix), with a live switch; the chosen style rides
into the WhatsApp message and the form. The main site stays the sea of dots (only a menu/credits link).

## Completed (branch feature/style-studio from redesign/elegant-20261019 8ccfc59; no push)
- Harvest: design/styles/{storytelling,buzz,heron,leo}/harvest.rtl.md (DNA, moments, numbers from code);
  raw material G:/tmp/harvest/ (films, bundles read as text, sheets).
- Shell: src/studio/ (StylesPage, Picker, registry, content, lead, LeadForm, motion, studio.css); route in
  App.tsx outside Layout; prerender adds /styles; navigation.ts adds the link.
- Styles: flight/ (three.js glass bird on the Horizon wave, keyed scroll timeline, sky phases),
  buzz/ (winged chat-bubble swarm with Buzz's flight model, fuzz headline), blueprint/ (technical drawing
  with drag-to-reveal checks, ink transition, plan that builds), clay/ (three.js clay room, cassette with
  reel eyes, Léo's pill, Web Audio tape sound).
- Small labels in English (Nati, 21.10); memory saved (english-micro-labels).
- QA on the build: 4 styles at 390/1440 clean (axe 0, overflow 0, small 0, targets 0); 12 site routes clean;
  overlap 0; WebGL in 3 engines; back from cache ok. Lighthouse not re-measured.
- Report for Nati: .context/STYLE-STUDIO-MORNING.rtl.md; comparisons G:/tmp/studio/sbs/*.png; films
  G:/tmp/studio/out/*-390.mp4; font samples design/styles/fonts/*-abc.png.

## Key decisions
- Opening state = Flight directly (strongest signature; the picker invites switching). Style in the URL (?s=).
- Night/dawn text in Flight sits on dark glass panels (legible over the blade; AA however the canvas sky is read).
- Heron red #FA3600 for lines; #D42E00 for text and filled cards (AA).
- Clay display = Noto Sans Hebrew variable 700 at 75% width (EFT Betaamango is static, no width axis).

## Known issues
- Flight's opening is cleaner and sparser than Storytelling's feather macro; no music yet.
- Clay's room is lit live, not baked (toy-like next to Léo's); PCFSoft shadows removed in three r186 (PCF used).
- Font picks pending (D183); Lighthouse for / and /styles/ not measured.

## Next steps
1. Nati's picks (style, translation, fonts). 2. Flight round 2 (textured feathers, bloom, music).
3. Lighthouse; real phone check. 4. Release only on approval (tag, branch, main).

## Important files
- src/studio/StylesPage.tsx (shell, live switch), src/studio/registry.ts (styles), src/studio/*/ (each style)
- G:/tmp/studio/{shots,poses,film}.mjs (GPU stills, pinned Flight poses ?fl=p, films with --pick switches), sbs.sh

---

# HANDOFF: calm text, the peek, quiet tiles, the contact line (20.10.2026, D174-D177) - live

## Completed (live: main = e34beec, rollback tag prod-before-d174 = 5a6c19d; verified on the live site at 390)
- D174: the shader's text mask has a wide calm margin (`calm` in main): the sea of dots fades out under
  every text block, the ripple and the dots' relief stay off the words, the pictures' relief and swell
  scale with `soft` (`flq`), chapter effects drop to 5% under text, the trail to 30%.
- D175: SeaPeek.tsx (phones and tablets): while a field of the form has focus, a 2D-canvas copy of the
  sign rides at the top of the visual viewport; the header steps aside (html.sea-peeking); the field keeps
  clear (scroll-margin-top). Pitfall met: the html class must not equal the component's class.
- D177: the contact lead's second line (shot look): "המילים שלכם ייכתבו בבועה, נקודה אחרי נקודה.", shown only with html.sea-gl.
- D176: SeaImage look="quiet" for the services rows (K.w + 8 in the shader): the picture dim and grey at
  rest, colour in one fade when on; the services backdrop at 0.18.
- Checks: overlap 0 (320-1440); all-pages 390 and 1440 clean; WebGL in three engines (~5.5 s each);
  back from cache ok; GPU shots G:/tmp/d168/cp2 (peek, calm), ch390 (whole home at 390), svc (tiles).

## Next steps
1. Nati's verdict; the effects skill if he is happy; the shader performance round (card task_0d4cbc6d).

---

# HANDOFF: trail, relief, the letter, the work, more video, two tracks (20.10.2026, D168-D173) - live

## Goal
Nati's round of requests (one session, many messages): a thinner trail (and one under the finger); the AI
spark that never showed; two lines out; the work chapter without our own site and without the cream boxes;
the 3D feel under the pointer far more pronounced, after immersive-g.com; what the visitor types engraved in
the bubble, written by its own dots; more video with nothing repeating; "how we work" in two tracks; then
production.

## Completed (live: main = 5a6c19d, rollback tag prod-before-d168 = 0a459d4)
- D168 trail: a thin ribbon along the path's segments (field.ts flowUpload oldest first, stroke breaks as
  energy + 2; shader flowAt `trail`), ~58 px with a mouse, ~37 px with a finger (TRAIL_W); finger default
  `finger=squares`. AI spark: DotGlyph arrives at once inside fixed chrome; parts.tsx sweeps what is on screen
  after the scroll settles and at a page's end. Copy: the film hint and "המפתח קורא בעצמו" out.
- D169 work: one row, four photos from our film come to life in turn (SeaWork.tsx, sea.css `.sea-life`,
  clips public/media/work-life-*; encoder G:/tmp/mw-media/enc-memory-clips.sh). Old stills removed.
- D170 relief (shader flowAt + reliefLit + lightOf, field uniforms uRelR/uRelS/uHover/uRel): media and dots
  raised by their own light; lab gate `relief=on|off`. Harvest notes: G:/tmp/immersive-src/notes.md.
- D171 the letter (words.ts paints the canvas; field.ts words/drawWords on TEXTURE5; shader sign block in
  main): a fixed grid of 2.25 CSS px dots, the bubble's waiting dots, words lit in the dots, burn-in.
  SeaHome passes the form's values on input.
- D172 video: the showreel's own pool (SeaHome REEL; public/media/reel/*; G:/tmp/mw-media/enc-d172.sh),
  svc-websites-2, svc-seo-2, svc-chat-2, svc-memories-3 (media.ts); the stage row tile is the service's
  second clip. Ledger updated (design/media-ledger.rtl.md).
- D173 process: the track line, the second lede and VIDEO_STEPS (SeaHome Process); the playhead follows a
  window of four steps and cuts on all eight (field.ts readChapters).
- Also: imgLayer's loop only finds the picture (the work is done once): the shader's compile time back to
  production's; wake() waits for the linked program (no "no valid shader program" warnings).
- Checks on the final build: overlap 0 (320-1440); all-pages 12 routes at 390 and 1440 clean (axe 0,
  overflow 0, small 0, targets 0, errors 0); WebGL in Chromium, Firefox and WebKit; back from cache ok;
  GPU shots: G:/tmp/d168/ (ab3 relief A/B, w4 the letter, proc2 process, r6 the finger); live shots
  G:/tmp/d168/live/ (new reel takes load, the work row, both tracks, the letter, the dock spark).
- Lighthouse mobile (local, median of 3): 49 (LCP 4.10 s, TBT 1.59 s, CLS 0.001); was 57 at D165. The
  bigger shader: see Known issues.

## Known issues
- First-visit WebGL start on this laptop (Intel Iris Xe, D3D11, no shader cache): the program takes
  ~8-10 s to compile (production was the same: 7.7-9.7 s measured in fresh profiles). Until then the hero
  shows no reel. Later visits use Chrome's shader cache. The top item for the performance round
  (split the program per region, or a light first program).
- The finger's trail is thin and short by request; under text it thins further.
- The relief is strong on structured pictures and gentle on smooth skies; tune depth (field.ts uRel.x,
  0.07 of the height) or the light gains (shader reliefLit) if Nati wants more or less.
- A long message on a phone is cut after about four lines (the letters' floor: four dots to a capital).

## Next steps
1. Nati's verdict on his phone: the trail, the relief, the letter, the work row, the new reel, the two tracks.
2. If he is happy with the precision: build an effects skill (his words: "סקיל אפקטים, שאוכל תמיד להשתמש בו
   בכל אתר"), from site-director's media-material.md, fidelity.md and this round's mechanisms.
3. Performance round (shader compile time first; Lighthouse mobile ~57).

---

# HANDOFF: D167 live (21.10.2026): main = 0a459d4, rollback tag prod-before-d167 = efb3c5e

- The legal links on one line ([ a · b · c ]), the V drawn dot by dot (way-icons pix V13/V11: header mark, menu, ticks), the finger streak (SeaTrail smoothPath + glow sprite). Verified live.

---

# HANDOFF: calmer (21.10.2026, D166) - live

## Completed (main = efb3c5e, rollback tag prod-before-d166 = 376e466)
- Phones: the finger draws the hairline (SeaTrail, lab gate `finger`, default `line`); the water drop and ripples only with `finger=drop`.
- Calmer: sea-of-dots amplitude about a third lower; the film material band narrower (style 1 in `veilLayer`); services backdrop 0.32; render lines 0.62; tracking 0.45.
- Projects (work strip): `SeaImage look="print"` = a cyanotype that develops from the bottom (shader `imgLayer`, `isPrint`, side + 4 in `IMK.w`).
- Checks: overlap 0; all-pages 390/1440 clean; WebGL in three engines; live verified.

## Next steps
1. Nati's verdict on his phone.
2. Performance round (card task_c78309fc).

---

# HANDOFF: every chapter its own effect (21.10.2026 morning, D165) - live

## Completed (main = 376e466, rollback tag prod-before-d165 = 58c0168)
- Chapter effects in the shader (`chapterFx` in `src/look/sea/shader.ts`, measured by `readChapters()` in `field.ts`, uniforms `uCh[4]`, `uChK`): why = render lines while scrolling; process = editor's playhead with ticks and a cut at each step; FAQ = tape tracking bands; letter = the bubble gathers from its own dots (`uCh[3].w`).
- The sea of dots (D131) is back as the ground of why and process (`sea` in main; the pointer and finger ripple it via `uPtrE * max(uRipAll, dg)`).
- The letter (`.sea-contact` in `sea-site.css`) on the dark ground: big rows with dot drawings, fields framed in dots, labels in brackets (alt text "" for screen readers). Lab gate `ground` default is now `deep` (no cream band).
- Footer contact rows: keys only (no drawings).
- Checks: overlap 0; all-pages 12 routes at 320/390/1440 clean; WebGL in three engines; back from cache ok; Lighthouse home 57 (LCP 4.10 s, TBT 965 ms).
- Previews: `design/compare/d165/`.

## Next steps
1. Nati's verdict on the effects on his phone; tune strengths in `chapterFx` if any feels too quiet or too loud.
2. Performance round (card task_c78309fc).

---

# HANDOFF: night round (20-21.10.2026): back fix, sample link, end credits, finger ripples, exact laptop (D163-D164)

## Completed
- D163 live earlier (f915497): the promise in an 11.5 s loop, drawings centred on a dot column and lines a dot thick, a water drop under the finger.
- D164 (this round):
  - Back from the browser's cache no longer leaves the page cream: `SeaTurn.tsx` `pageshow` (persisted) reveals or clears the canvas cover (`field.turnUp/turnClear/turnColour`). Test: `G:/tmp/lama-tools/back-test.mjs`.
  - "דוגמה אמיתית מיום הולדת 60" links to `/portfolio/memory-videos/` with `( לצפייה + )` (`ShotService.tsx`, `.sp-fact-link`).
  - Footer for the shot look = end credits in the sea's language (`Footer.tsx` LOOK === 'shot' branch, `.sea-foot*` in `sea-site.css`); dot icons (DotGlyph wa/phone/mail/insta) on the contact rows; two-line contact rows; other looks unchanged.
  - Phone finger: no squares trail on touch (fine pointers only); the drop has a hairline rim and ripples spread from the path (`uRip[6]`, field.ts `ripPush`).
  - Laptop: screen content drawn with per-axis dot sizes (`gCV`, `rimBox`), card outlines meet; the lid taper under three dots a side is drawn straight.
- site-director: page-transitions.md QA row and media-material.md pitfall for the cache case; media-material §6-§7 updated.

## Next steps
1. Nati's verdict in the morning (phone): back navigation, footer, ripples, laptop.
2. Performance round (card task_c78309fc); Lighthouse this round (mobile, median of 3, local build): home 55 (LCP 4.08 s, TBT 1035 ms, CLS 0.036), /services/memory-videos/ 87; unchanged from before.

---

# HANDOFF: precision round (20.10.2026, night): the promise in a loop, exact drawings, the finger (D163)

## Completed
- The promise ("בצורה הכי מקצועית שקיימת בשוק."): an 11.5 s CSS loop, words 0.5 s apart, enter 1.3 s, hold about 4 s, leave in order into a blur, glint every cycle (`src/look/sea/sea.css` `sea-word`, `sea-glint`).
- Drawings (`src/look/sea/shader.ts`): `slot()` snaps each drawing's centre to a dot column and sets `gCU` (one dot in the drawing's units); `rim()` and `bar()` are at least a dot thick; the laptop lid frame too; fill-only ordered light (no per-dot random size); the memory print is square to the grid; ground footage dims within about 1.9 radii of a drawing (`softV`).
- Finger (field.ts `press`, shader `uPress`): a water-drop dome under the finger (up to 1.28x, radius 64 CSS px), lit above and shaded below, a thin ring of squares; follows with ease, in fast, out slow; the trail of squares now follows the finger too (`SQUARES()` no longer needs a fine pointer).
- site-director: media-material.md §6-§7 and fidelity.md §7 carry the precision rules.

## Next steps
1. Nati's verdict on his phone (the finger, the drawings, the loop's pace).
2. Performance round (separate session, card task_c78309fc).

---

# HANDOFF: the squares round (20.10.2026): Lama Lama's material read from its shaders (D161-D162)

## Goal
Nati: the promise under the H1 a word at a time (D161); then "the small dots are not good... these and
those, not all the same"; "some small dots appear only at a video's edge, as if part of the video
changes at the edge, do it in many shapes and elements"; "the big dots: every shape clear, the dots
varying in size"; "notice small details I did not"; deploy (performance later).

## Completed (live: main = 5af130f, rollback tag prod-before-squares = a07cf41)
- D161 (63fa5f5): `sub` + `sub2` quiet lines, `pro` revealed word by word (SeaHome `Promise`, sea.css `sea-word`).
- D162 (a83d35a): read lamalama.com's public shaders (scratch `G:/tmp/lama-src/`: shaders.txt,
  shaders2.txt, GPU frames in shots/ and gf/) and rebuilt the material in `src/look/sea/shader.ts`: one
  grid of 2 CSS px squares, 4x4 per cell, our order (the first seven draw the Horizon glyph); the hero's
  lower third breaks into holes that keep the take's colour; each live picture breaks on its own side
  (id % 4); veil styles 0 holes, 1 material, 2 rows, 3 backdrop; reel changes through the squares; a
  trail of squares (fine pointers; lab `trail=squares`, the hairline is `trail=line`); the big drawn dots
  vary in size; softer text dimming. Code-level notes: `design/harvest/lamalama-deep.rtl.md` §13.
- Merged Moria's a07cf41 (Search Console file) before the push.
- Checks: build ok; overlap 0 (320-1440); all-pages 12 routes x 390/1440 clean; WebGL starts in
  Chromium, Firefox and WebKit; GPU shots of dev, build and live.
- site-director skill updated (backup `G:/tmp/skill-backup/site-director-20261020`): new
  `references/fidelity.md`, `references/media-material.md`, `assets/motion/squares.glsl`,
  `scripts/gpu-frames.mjs`; `harvest/lamalama.md` corrected; details-layer, human-eye, media-sourcing,
  SKILL.md (router, frontmatter now 1391/1536), GUIDE.rtl.md, evals (4). Auditor: 0 errors.

## Known issues
- Lighthouse not re-measured (mobile median was 55 before D160-D162); Nati deferred perf; card task_c78309fc.
- `/googlec374d3e971c6eda7.html` answers 308 to the extensionless path (Pages pretty URLs); if Search
  Console refuses the file, verify by DNS TXT or serve the file without the redirect.
- On dark takes the hero's square band is subtle on phones (the band sits under the CTA's dimming).

## Next steps
1. Nati's verdict on the squares (phone first); tune the band (field.ts `reel.edge` 0.3, width 0.26) or
   the glyph order (shader `rankAt`) if asked.
2. Performance round (separate session).

---

# HANDOFF: the colour round (20.10.2026): free media, Lama Lama followed closely (D154-D160)

## Goal
Nati: bring licence-checked free images and video into mediawave.co.il so the colour reads as rich as
lamalama.com, and close the remaining gaps; mid-session: "follow their site precisely: a showreel of many
videos one after another, fast, the scenery always changing; a trail of small dots after the mouse; not
everything with dots; smooth everywhere; transitions that never repeat"; then push to production.

## Completed (branch `redesign/elegant-20261019`)
- Media: 12 Pexels clips (Nati picked from a drawn board, one question): ledger `design/media-ledger.rtl.md`,
  dossier W25-W30, catalogue `src/look/sea/media.ts`, files in `public/media/` (loops, posters, tiles) and
  `public/media/reel/` (the showreel's 11 takes, wide + tall). Raw files and encoders: `G:/tmp/mw-media/`
  (`enc.sh`, `enc-veil.sh`, `reel-clips.sh`). The candidate board: `design/media/` (git-ignored).
- The hero is a showreel engine in the field (field.ts `setReel`, shader `reelLayer`): random take, start
  point, hold (1.1-2.4 s) and one of eight transitions, never one of the last three; slow push-in;
  develops from the material at load; its bottom breaks into dots and climbs on scroll; soft dimming
  around the words. Loads after load+idle (the H1 stays the LCP).
- Trail: `SeaTrail.tsx` (small soft dots after the mouse). The quiet grain is off (plain ground).
- Pictures in colour: service rows' tiles (`SeaDevelop.tsx`), service pages' clips (`SeaClips.tsx`, the
  main clip as a full-width ground with dotted edges), the film chapter's ground (`SeaGround.tsx`).
- Gaps as lab gates (`?lab=1`): work rows (`SeaWork.tsx`, real work only), type (tag beside headings,
  indented lede), menu as a card under the pill, corner stack (`SeaStack.tsx`, default off), the meta bar
  back at the end. Not built: Lama's full-screen opener (would risk the H1 as LCP).
- Then (D158, D159): every dissolve is a fine noisy dither (Bayer + slow grain, ~2 px) through a warm grey
  "material", no coarse dots; each ground its own edge style; eight smooth reel transitions; live pictures
  (`SeaImage.tsx`, an 8-cell atlas in the field: material at rest, colour when on, from where the pointer
  came in); the services stage's backdrop is the active (or hovered) service's footage in grain; under
  the pointer a thin refraction with a faint colour fringe; the trail is a hairline ribbon with a soft
  head and dust (`SeaTrail.tsx`).
- D160: full motion on every visit (the OS flag no longer calms the site; the widget's "ללא אנימציות" and
  ?reduce=1 stop it; ?calm=1 calms it); autoplay retried on the first touch; the hero's tag moved to the
  end bar and the delivery time left the opening line.
- Decisions D154-D160 in DECISIONS.rtl.md.

## Lab gates (defaults = recommendations; Nati picks on the live page with ?lab=1)
hero reel|sea|disc · grain off|on · trail dots|ripple · media colour|develop · bleed veil|slot ·
sun time|touch|off (disc only) · rows tile|none · work rows|off · type lama|now · menu card|sheet ·
stack on|off (default off) · bar ends|start.

## Known issues
- Lighthouse mobile (local, brotli server) fell to about 55 (LCP 4.1s, TBT ~1s) with the reel, the
  bigger shader and full motion for headless browsers too. Nati: deploy now, fix performance later.

## Waiting for Nati
- His verdict on the live site; lab picks; new copy marked [קופי: נתי] (D155: "מהעבודה.", the lede, the
  rows' tags and actions, island lines, the stack's lines; D154: the tag "להמחשה").
- After the picks: delete the losing options' code and media (hero-sea, hero-veil, film-tapes ...).

## Rollback
`git push origin prod-before-media:main --force-with-lease` (tag = cce9659), or the Cloudflare Pages
dashboard (the previous production deployment).

## Important files
- `src/look/sea/field.ts` (films, grounds, the reel engine), `shader.ts` (filmLayer, veilLayer, reelLayer)
- `src/look/sea/SeaHome.tsx` (useReel, REEL list), `SeaGround.tsx`, `SeaDevelop.tsx`, `SeaClips.tsx`,
  `SeaTrail.tsx`, `SeaWork.tsx`, `SeaStack.tsx`, `lab.ts`, `SeaLab.tsx`
- QA tools: `G:/tmp/lama-tools/` (seq.mjs, probe.mjs, trail-shot.mjs, menu-shot.mjs, shoot.mjs, serve-br.mjs)

---

# HANDOFF: the Lama Lama round (20.10.2026): deep harvest, lab, dots everywhere: LIVE (main cce9659)

## Goal
Nati: break lamalama.com down to the smallest detail and build its mechanisms into mediawave.co.il in
our own material, as intuitive and beautiful as theirs; mid-session: no header that follows the scroll
(the visitor chooses), the Google mark and an AI sign in dots, dots everywhere it fits.

## Completed (branch `redesign/elegant-20261019`, on top of 47aa022 = production)
- Harvest: `design/harvest/lamalama-deep.rtl.md` (facts, mechanism table with timings and easings, colour
  map, image treatments, small elements, mobile, principles, translations). Films and frame sheets
  outside the repo: `G:/Projects/moment-library/films/lamalama/` and `films/lamalama-interact/`;
  5 new entries in `G:/Projects/moment-library/INDEX.md`. Their code (text only): `G:/tmp/harvest/lamalama/`.
- Lab, each gate a switch (`?lab=1` shows the panel; `src/look/sea/lab.ts` holds the defaults):
  head (SeaIsland: the header folds into an island, speaks a line per chapter, opens on tap, pin),
  film (SeaFilm + field: the desk film in dots, develops under the pointer or on a tap),
  ground (field: services under the horizon in deep blue, the letter on paper, dotted edges),
  turn (SeaTurn + field: dots swell from the click, timecode, reveal from the centre; index.html
  starts a turned-to page covered).
- Dots everywhere: decode.ts (labels, clock, cursor label), the Google mark in the results object and
  island, the AI spark (chat object, dock launcher "AI", island, menu), DotGlyph (ticks, plus, contact
  icons, menu objects), step rings, the 404 horizon.
- Decisions D144-D152 in DECISIONS.rtl.md.

## Waiting for Nati
- The four gates (head, film, ground, turn): defaults are the recommendations (island, touch, both, cream).
- New copy marked [קופי: נתי] (chapter lines in SeaWay.tsx, the film chapter, the AI launcher label).
- D150: Google's brand rules forbid altering its mark; Nati asked for it; alternative = same shape in our blue.

## Next steps
- QA results below; films side by side with theirs; then Nati approves and it deploys (mediawave-dev
  helper, tag a rollback point first).

## Important files
- `src/look/sea/SeaIsland.tsx`, `SeaWay.tsx`, `way-icons.ts`: the header island and its icons
- `src/look/sea/SeaFilm.tsx`, `SeaTurn.tsx`, `SeaLab.tsx`, `lab.ts`, `decode.ts`, `DotGlyph.tsx`
- `src/look/sea/field.ts` (film texture, grounds, turn) and `shader.ts` (gmark, spark, ground, turn)
- Test scripts (scratchpad of this session): `lab-check.mjs`, `turn-film.mjs`, `shoot.mjs`, `film-scroller.mjs`

---

# HANDOFF (19.10.2026, late night): live = main after the D139-D143 round

The next session starts from `.context/NEXT-SESSION-PROMPT-LAMALAMA.rtl.md` (a deep teardown of lamalama.com,
mechanisms only, rebuilt in our material). Since the first sea release: shapes live in layout slots and
never sit under text (D139), keys are symmetric dotted capsules (D140), the H1 is "העסק שלכם, המומחיות שלנו"
(D141), the music is an original lo-fi track the dots pulse to (D142, D143). Rollback: tag prod-before-dots.

---

# HANDOFF: the sea of dots, built and shipped (19.10.2026, night): LIVE on mediawave.co.il (main ee37a37)

## Goal
Move the whole site to the approved "sea of dots" direction (D131) at SOTD level, home first then the
inner pages, and ship it (Nati: "continue autonomously to full implementation and deploy").

## Completed (branch `redesign/elegant-20261019`, commit ee37a37 on top of origin/main 3ba6632)
- `src/look/sea/`: the WebGL dot field (field.ts + shader.ts, one fixed canvas in Layout), the home
  (SeaHome), the opening (SeaIntro: timecode, dots converge on the field's grid into the disc, H1 rises),
  the laptop chapter (its screen: code, site, scroll, tap, lead; D133), the six services in one held
  stage with an object each (gears.ts), each service page opening on its object (SeaShape), the rewind,
  the cursor label, the live clock, the keys in the sea's material with the WhatsApp surprise (D134,
  D136), the WhatsApp mark in dots (WaDots, D138), the soundscape (sound.ts, on by default, armed until
  the first gesture, D137). Site-wide dark layer: `sea-site.css`; home: `sea.css`.
- Gates on the final build (served with brotli like Cloudflare): overlap 0 on the home at 320/390/768/
  1024/1440 and on every inner page at 390/1440; axe 0, no sideways scroll, no errors on all 12 routes at
  390 and 1440; cross-browser (Playwright 1.55: Chromium desktop and Android, Firefox, WebKit desktop and
  iPhone): WebGL runs, opening ends, stages hold, services counter turns, key surprise, rewind, sound
  (WebKit's Windows build has no WebAudio; real Safari does). Lighthouse mobile local: see Known issues.

## Key decisions (DECISIONS.rtl.md D133-D138)
- The laptop no longer plays the hero film: Nati asked for something smarter; the screen now tells the
  H1's promise. The hero video is not loaded on the home (it stays in the code and the other looks).
- One trail: the field's ripple; T3 is the review option `?trail=t3` (D135, for Nati to pick).
- The shader compiles off the main thread (KHR_parallel_shader_compile): it was a 720ms long task on
  Lighthouse's software GPU.
- The hero's parts only move during the opening (no fade from 0), so the largest text at first paint is
  the LCP at first paint.

## Known issues
- Lighthouse's simulated LCP stays around 3.6-3.8s: the largest first-paint text is the hero's line,
  whose digits need Noto's Latin subset (now preloaded too). A real browser at 4x CPU / slow 4G measures
  LCP = FCP (1.3-1.8s, scripts/qa/rum.mjs).
- New copy is marked [קופי: נתי] in the decisions and the code (hero tag, laptop chapter line, cursor
  labels, the sound label).

## Next steps
- Nati reviews the live site and the films; picks the trail (ripple or `?trail=t3`).
- Inner pages: the cards could take more of the Lama Lama structure; the 404 could get the disc.

## Important files
- `src/look/sea/field.ts` the engine (tiers, markers, scenes, gears in, DPR cap, pause when hidden)
- `src/look/sea/shader.ts` every shape; `gears.ts` how one scroll number winds each object
- `src/look/sea/sea-site.css` the whole site's dark layer, the keys, the pill, the card, the inner pages
- `index.html` the pre-paint classes: sea-held, sea-reveal, sea-opening(-calm)
- Rollback: `git push origin prod-before-dots:main --force-with-lease` (tag = 3ba6632) or the Cloudflare
  Pages dashboard (the previous production deployment).

---

# HANDOFF: the "sea of dots" direction (19.10.2026, evening)

The next session starts from `.context/NEXT-SESSION-PROMPT.rtl.md` (paste it into a fresh session).

## Where it stands
- Branch `redesign/elegant-20261019` (worktree `.claude/worktrees/elegant-20261019`), commits on top of origin/main 3ba6632. NOT pushed, NOT deployed; production is still "shot".
- The cream "wave" home (src/look/wave) is built and passes every gate (overlap 0, axe 0), but Nati rejected its look as immature and weak (thin line art). It stays in the branch as the motion code to reuse.
- Approved direction (D131): `design/eye/premium/sea-of-dots.html` (source: template.html beside it): dark ground, WebGL halftone dot field, Horizon disc of dots, per-chapter dot shapes, Lama Lama structure, bold type.
- D132: no "Nati" in site copy (Contact lead now "המפתח קורא ועונה בעצמו").

## Next
Rebuild the home (then inner pages) in the approved direction with every picked detail, run the gates, film phone and desktop, deploy after Nati approves the film. Details and pitfalls: the prompt file.

---

# HANDOFF — MediaWave Israel

> **לסשן הבא:** `.context/NEXT-SESSION-PROMPT.md` מכיל את כל הקונטקסט של סשן העיצוב מחדש (13/10/2026). המשימה הראשונה: Claude Design ו-`/design-sync`.

## 🏁 סשן 16-18/10/2026: סבב SOTD אוטונומי (מחקר, תוכן, דפים פנימיים, פסים, דיפלוי)

- **מטרה:** הבקשה של נתי: מחקר עומק על איך אתר שמוכר שירות כזה צריך להיראות ולהישמע, עדכון התוכן והעיצוב בכל הדפים ברמת Site of the Day, מובייל קודם, 60fps, ועלייה לפרודקשן עם דרך חזרה בצעד אחד. הבריף: `.context/SOTD-SESSION-PROMPT.md`. הדוח לנתי: `.context/SOTD-REPORT.rtl.md`.
- **ענף:** `sotd/20261017` ב-worktree `G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/sotd-20261017-dbce51`.
- **הושלם:**
  - מחקר: `design/research/01-04` + `SYNTHESIS.md`. תוכן: קופי חדש בכל האתר, יומן ב-`design/copy/CHANGELOG.rtl.md`.
  - דפים פנימיים ב-shot (D90), מעבר "הדף שלוחצים עליו הופך לדף הבא" (D91, D103, `vt.ts`).
  - פלטה שחור, לבן ושמנת בארבעה פסים (D109, D110, בקשת נתי). DESIGN.md מעודכן.
  - שלושה סבבי ביקורת: מבקר M1, critique סבב 2, חבר שופטים (6.5), ביקורת סבב 2 בעיניים חדשות (6.9): `design/audit/SOTD-REVIEW.md`. כל הממצאים מתועדים ב-D111 עד D115.
  - ניווט בין דפים לפרקי דף הבית נוחת על הפרק (D115, `scripts/qa/cross-page.mjs`).
  - תמונת שיתוף חדשה בפסים (`scripts/generate-og-image.mjs`), כתובות עם לוכסן (D113).
- **החלטות:** D90 עד D115 ב-`DECISIONS.rtl.md`, כולן מסומנות לאישור נתי.
- **פתוח לנתי:** תמונה שלו, אתרי לקוח, מחירי "החל מ", דמי ביטול בתקנון 9.1, הצהרת הנגישות (תאריך, תקן, שם רכז נגישות), השם "נתי" במכתב, זמן עבודה לווידאו, האם 24 שעות זו התחייבות.
- **פתוח בבנייה:** ביצועים במובייל בדף הבית (Style & Layout כבד, כנראה ממדידות GSAP), מיני האתר בטלפון עדיין פסים וקוביות ולא הטקסט האמיתי, אנימציית Lottie שמתחילה מפריים ריק (N8), קישורי הפתיחה ב-320 בלי חצים (N6).
- **קבצים:** `src/look/shot/pages/*` (הדפים הפנימיים), `src/look/shot/vt.ts`, `src/motion/ScrollEngineProvider.tsx` (נחיתה על #hash), `scripts/rollback-sotd.cmd`, `scripts/qa/all-pages.mjs`, `scripts/qa/cross-page.mjs`, `scripts/qa/lh-all.sh`, `design/audit/sotd/` (חפיפות ומדידות), `design/audit/SOTD-REVIEW.md`.
- **18.10 בבוקר:** התיקונים של נתי מהאתר החי (D116: בלי א' בזכוכית המגדלת, "עסקים" במקום "עסקים קטנים", אייקונים בכרטיס יצירת הקשר), תיקון ללשונית ישנה אחרי עלייה, וצבעי לוגו חדשים: Cyanotype (D117, נבחר מבין ארבעה כיוונים; ההשוואה ב-`design/audit/logo-palettes.png`). main = 023b34d. מקור הצבעים: `scripts/brand-palette.mjs`, ואחריו `npm run build` מעתיק את האייקונים.
- **באוויר מ-18.10.2026 07:42** (בבקשת נתי, אחרי ששמע מה לא עבר): main = 2dc9b5c, Cloudflare 5168afee. לחזרה: Cloudflare dashboard > mediawaveisrael > Deployments > 70fdf629 > Rollback; או `scripts\rollback-sotd.cmd` (התג prod-before-sotd = c718588 נדחף לפני העלייה); החזרת האתר החדש: `git push origin sotd-live:main --force-with-lease`. PageSpeed חי: דף הבית 79 במובייל ו-100 במחשב, דף נחיתה 95 במובייל. שלושה שערים לא עברו לפני העלייה: Lighthouse מקומי 65, impeccable 13/20, critique 29/40. - **הבא:** החלטה של נתי על העלייה; סבב ביצועים במובייל לדף הבית (ScrollTrigger ו-Style & Layout); P2 מהביקורת (N6, N8, N9).

---

## 🚀 סשן 16/10/2026 (אחר הצהריים): בדיקת impeccable, תיקונים, תפריט מלא, עלייה לפרודקשן

- **מטרה:** בדיקת איכות במובייל עם impeccable, תיקון כל מה שעלה, ואז העלאת shot לפרודקשן עם חזרה מהירה.
- **הושלם:**
  - **דוח impeccable:** `design/audit/impeccable/AUDIT.rtl.md` (14/20 לפני התיקונים). P0: החלון "השאירו פרטים" נפתח בתוך הדף; תוקן. P1: מדידת הפס התחתון החזירה 0, חפצי הפתיחה נראו כמשולשים שחורים, המשיכה לאחור נפתחה על מסך ריק; תוקנו.
  - **התפריט (D89):** חמישה פרקים בסדר הדף, נקודה ליד הפרק שבו נמצאים, וואטסאפ בתחתית. בדסקטופ ארבעה בשורה העליונה.
  - **טקסט:** טווחי מספרים בלי מקף ("2 עד 3 שבועות"), בנוסף לסבב המקפים הקודם.
  - **DESIGN.md** מתאר עכשיו את shot.
  - **אימות על בילד הפרודקשן:** חפיפות 0 בחמשת הרוחבים, axe 0, אין גלילה לצדדים, הדף מוצג בלי JS, tsc 0.
  - **commits (7 מעל הפרודקשן):** הפופאפ לפי כוונה (6bc7ac2, מ 15/10), המקש, Rive, shot, התפריט, הטקסט, החזרה המהירה; ועוד commit של מסמכים.
- **חזרה מהירה לאתר הקודם (KM, 412b810):**
  1. הכי מהיר, בלי בנייה: Cloudflare dashboard > Workers & Pages > mediawave > Deployments > הדיפלוי של 412b810 > Rollback to this deployment.
  2. דרך git: `scripts\rollback-shot.cmd` (מעביר את main לתג `prod-before-shot` ושומר את מה שעלה בתג `shot-live`).
  3. להחזיר את shot אחרי חזרה: `git push origin shot-live:main --force-with-lease`.
- **פתוח לנתי:** D88 (העדשה בלי פתיחה בטעינה), D89 (הנקודה והוואטסאפ בתפריט), 13 ההחלטות ב SPEC §5, הקופי מממצא 10 של המבקר, תשובות ממורכזות בשאלות הנפוצות, טקסט קטן בפתיחה בדסקטופ (ממצא 11), PageSpeed על האתר החי.
- **קבצים:** `design/audit/impeccable/` (הדוח והמדידות), `design/audit/shot-overlap-3/`, `design/audit/shot-gates-final/`, `G:/tmp/mobile-audit.mjs` (סקריפט הבדיקה במובייל).
- **באוויר:** הענף main בשרת GitHub הוא 1e7d492, והאתר mediawave.co.il מציג את shot. התג `prod-before-shot` (412b810) נדחף לפני העלייה. בדשבורד של Cloudflare הדיפלוי הקודם הוא 0a22fa1b, לחזרה מיידית.
- **תיקון אחרון:** ריבוע סביב כפתור הסגירה (X) בחלון הקופץ בטלפון (נתי). הפוקוס הראשון עובר עכשיו לכותרת החלון (1e7d492).
- **לקח:** טקסט עם backticks לא עובר בתוך מחרוזת של bash במירכאות כפולות (bash מריץ אותו). כותבים קבצים דרך קובץ סקריפט או Write.

---

## 🎬 סשן 16/10/2026: "שוט אחד" בנוי במלואו, סבב בדיקות ותיקונים

- **מטרה:** דף הבית החדש בעיצוב shot ("שוט אחד", D83): תנועת מצלמה אחת מעל השולחן של נתי, מובייל קודם (D84), הדברים הקודמים חוזרים כחפצים על השולחן.
- **הושלם:**
  - **מבנה:** עיצוב shot כ-look רביעי (בנוסף ל-K/M/KM, שנשארים לבנייה: `build:km`). ברירת המחדל של הענף היא shot.
  - **שישה פרקים:** פותחים (צלילה + עדשה), מכירים, בוחרים (הכלים), בונים (המחשב בונה, קו דיו, הצעדים), מתחילים (פנקס, "מתחילים?", כרטיס ומכתב עם המחשב של Rive), מקבלים (התרחקות לטלפון), ופוטר.
  - **כפתורים "המקש"** (D87), **לוגו בקליין עמוק** (D86), **פס עגינה אחד** במקום הכפתורים הצפים.
  - **בדיקות:** חפיפות 0 בכל הרוחבים (320 עד 1440), axe 0, אין גלילה לצדדים, התוכן גלוי בלי JS, LCP הוא ה-H1, CLS 0.0007.
  - **ביצועים מול KM באותה מכונה:** Lighthouse 67 מול 73, במדידה אמיתית LCP של 2.34 מול 2.19 שנ'. הפירוט ב-`design/LEDGER.md`.
- **החלטות בסבב:** D86 לוגו בקליין עמוק; D87 "המקש"; D88 העדשה נטענת רק בתזוזה הראשונה, בלי פתיחה בטעינה (ממתין לאישור נתי).
- **ידוע:** Lighthouse במכונה הזו רועש מאוד (כשהחלונית מנגנת וידאו). המספר האמיתי ייקבע רק ב-PageSpeed Insights על פריסת preview.
- **שאלות לנתי:** 13 החלטות עם ברירות מחדל ב-`design/shot/SPEC.md` §5 (ובעברית בסוף `design/shot/storyboard.rtl.md`), ועוד D88.
- **הבא:**
  1. מבקר עם הקשר נקי (רץ), ותיקון הממצאים שלו.
  2. אישור של נתי ל-preview deploy, ואז PageSpeed אמיתי.
  3. commit של כל העבודה בענף (באישור).
  4. שאר הדפים (שירות, נגישות, משפטי) תחת shot.
- **קבצים:**
  - `src/look/shot/*` (הדף כולו), `src/look/buttons/KeyButton.tsx` + `key-button.css`.
  - `design/shot/{storyboard.rtl.md,SPEC.md,inventory.json,BUILD-NOTES.md}`, `design/ideas/{directions-v2,logo-v2}.html`, `design/ideas/buttons/*.html`.
  - שרת: `npm run dev -- --port 5180` (launch.json "redesign"). בנייה: `npm run build:shot`. אם 4173 תפוס: `PRERENDER_PORT=4190 node scripts/prerender.mjs --dist dist-shot`.

---

## 🎬 סשן 15/10/2026: עיצוב מחדש דרך site-director, כיוון "שוט אחד"

- **מטרה:** עיצוב מחדש מלא של דף הבית דרך הסקיל site-director, ברמת Heron AI. קדושים: לוגו Horizon והאידנט, 13 הלוטים, סרטון ההירו. נתי לבד מאשר שערים.
- **הושלם:** אבחון (`design/DIAGNOSIS.rtl.md`), תיק עולם 24 פריטים, החלטות D65-D85 ב-DECISIONS.rtl.md, פופאפ לפי כוונה (commit 6bc7ac2, `src/utils/lead-intent.js`).
- **החלטות:** D81 הפלטה נעולה (#ECEEF1 / #FFFFFF / #1B1D21, Noto Sans Hebrew), כי נתי אהב אותה; D82 רעיונות "מקישור לאוויר" נפסלו (צמצום ל-390, מחוון, טלפון, טיימקוד); D83 כיוון "שוט אחד"; D84 מובייל קודם מעל הכל; D85 הקונדיטוריה נעצרה.
- **בעבודה:** `/proto-c` (dev בלבד, `src/proto/ProtoC.tsx` + `protoc.css`): צלילה להירו, "איך אנחנו עובדים" על גיליונות שנוחתים, התרחקות לטלפון. מחכה לתגובה של נתי.
- **ידוע:** אין עדיין סטוריבורד ל"שוט אחד" (storyboard.rtl.md ו-CONCEPT.md עוד של הסבב הראשון); קופי חדש מסומן טיוטה; `/proto` הישן נשאר להשוואה.
- **הבא:** תגובת נתי ל-/proto-c, אז סטוריבורד חדש (פרקים, אובייקט, פעימות) והרצת check-artifacts, אז בנייה במקום. commit של design/ ו-src/proto רק באישור. שום push.
- **קבצים:** `design/ideas/directions-v2.html` (ארבעת הכיוונים החיים), `design/shots/proto-c-v1/` ו-`proto-c-calm/` (צילומים), `design/LEDGER.md` (ממצאי המבקר), `design/baseline/` (לפני), דוח הסקילים: `C:/Users/User/.claude/skills-reports/site-director-2026-10-15.rtl.md`. שרת: `npm run dev -- --port 5180` (launch.json "redesign").

---

## 🔭 סשן 13/10/2026 (לילה): הפתיח "העדשה", כפתורי "צמצם", סרטון חדש

- **הים (#62) נפסל** (נתי ומוריה: "הרעיון של גל ממש לא יפה בעינינו"). במקומו (#64): עדשת מצלמה מתחת לכותרת, צמצם של 9 להבים בכחול קליין שנפתח בביקור ראשון; עכבר פותח עוד, לחיצה עושה קליק, גלילה פותחת עד הסוף ומקרבת. `design/rive/lens/` (CONTRACT, `npm run rive:lens`), `src/look/parts/Lens.tsx`, `lens-geometry.js`, `src/look/scenes/HeroLens.tsx`.
- **הסרטון בעדשה:** Pexels 5585952 (גולשת בחנות אונליין על לפטופ, שולחן עגול), בחירת נתי מתוך 4. לולאה הלוך-חזור 7.6 שניות, `public/videos/lens.mp4` + `lens-m.mp4`, פוסטרים `public/images/lens-poster.webp` + `lens-m-poster.webp`. המקור ב-`G:/tmp/mw-media/src`. מראות K ו-M עדיין עם סרטון השולחן (`DESK_FILM`).
- **כפתורים:** "צמצם" (`IrisButton`), עותק הטקסט בתוך הפתח כך שאף אות לא נעלמת.
- **נשאר מהסבב הקודם:** כפתור הנגישות בכותרת בטלפון (#63), הפופאפ לא קופץ בקפיצה לעוגן.
- **חזרה מהירה:** `prod-sea` = הים (43fec68), `prod-before-sea` = האתר שנבנה (5ff210f). `gh auth switch -u mediawave-dev` ואז `git push origin <tag>:main --force-with-lease`, או Rollback בדשבורד של Cloudflare Pages.

---

## 🌊 סשן 13/10/2026 (ערב): הפתיח החדש "הים", כפתורי "גאות", נגישות בכותרת

- **הפתיח (#62):** מוריה לא אהבה את "האתר שנבנה" ורצתה פתיח מפוצץ. עכשיו: הסרטון הוא המים, קו האופק של הלוגו הוא פני המים. בביקור ראשון קו אור משרטט את האופק מימין, גל נכנס מימין וממלא את החלק התחתון בסרטון, מתנפץ בקיר השמאלי ונרגע. אחר כך המבקר משחק במים (עכבר מעל, חוצה, לחיצה, נגיעה בטלפון, גלילה). בגלילה המים מציפים את ההירו. Rive מצייר, הפיזיקה בדף (data binding, 35 נקודות). הקבצים: `design/rive/opener/` (BRIEF, CONTRACT, `build-sea.mjs`, `npm run rive:sea`), `src/look/parts/Sea.tsx`, `sea-physics.ts`, `src/look/scenes/HeroSea.tsx`. ה-HeroStage הקודם (#60) נשאר למראה K.
- **כפתורים (#62):** "גאות": מים בצבע הטקסט עולים מאחורי הטקסט עם הגל של הלוגו וממלאים את הכפתור; הטקסט תמיד מעל ומשנה צבע (נתי ביקש: לא להסתיר את הטקסט). `src/look/buttons/TideButton.tsx`.
- **נגישות (#63):** בטלפון האייקון בכותרת ליד התפריט; הלשונית בצד רק בדסקטופ. הפופאפ של הלידים לא קופץ בקפיצה לעוגן.
- **אימות:** חפיפות 0 (320 עד 1440), axe 0, עוגנים, overflow 0, no-JS, טפסים. LCP בטלפון מואט 2.43 שניות (חציון 3, ברגע הציור הראשון; אלמנט ה-LCP הוא הפוסטר של הסרטון, שמצטייר עם הפריים הראשון). צילומים: `design/rive/opener/shots/`.
- **נתי:** אם לא יהיה מרוצה בפרודקשן, מחפשים רעיון אחר שלא קשור דווקא לגל.
- **חזרה מהירה לפתיח הקודם (אתר שנבנה, 5ff210f):** התג `prod-before-sea`. `gh auth switch -u mediawave-dev` ואז `git push origin prod-before-sea:main --force-with-lease`, או Rollback בדשבורד של Cloudflare Pages לדיפלוי של 5ff210f.

---

## 🎨 סשן 13/10/2026 (סיום): קליין, פונטים, ליטושים, אימות ודיפלוי

- **פלטת קליין (#58):** בחירה 13 מלוח הצבעים (נתי ומוריה). במה `#00113D`, נייר `#FAFAF7`, כחול קליין `#002FA7`. קבצי הלוגו נצבעו מחדש בלי לגעת בגיאומטריה (`scripts/brand-palette.mjs`), אייקונים ותמונת שיתוף מחדש מהווקטור (`?v=5`), וגם מלווה ה-Rive. לוח הצבעים: https://claude.ai/artifact/S2mDmb29A4Lkqe4tznfCb3
- **פונטים (#59):** EFT Betaamango לכותרות (הפונט של האתר החי), IBM Plex Sans Hebrew לטקסט ולכפתורים. הגרש (׳) לקוח מ-Plex כי ב-Betaamango החינמי אין אותו.
- **הוסרו:** סקשן לפני/אחרי (#57), "שישה כלים מרחפים...", "מהרעיון ועד ההשקה...". תוקן הזנב של בועת הצ'אט.
- **נגישות:** קישורים פנימיים מעבירים פוקוס לסקשן; הפופאפ לא נפתח בזמן הקלדה או ניווט במקלדת; שם הכפתור של וואטסאפ כולל את הטקסט שלו.
- **אימות:** חפיפות 0 בכל הרוחבים; Lighthouse מובייל 96 (LCP 2.39s, TBT 50ms, CLS 0.006) מול האתר החי 89; דסקטופ 100/100/100/100; axe 0; ניגודיות 0 כשלים (`design/audit/klein-contrast.md`); slop של האתר הבנוי 25.
- **ידוע:** גלילה במובייל בהאטה פי 4 עדיין עם יותר משימות ארוכות מהאתר הישן (בעיקר בניית הלוטים בשתי ההחזקות). Lighthouse (טעינה) טוב יותר מהישן.
- **מסך פתיחה חדש (#60):** אתר נבנה מול העיניים על מסך הבמה (Rive), והסרטון מתחיל בתוך האתר. `design/rive/hero/`.
- **מרכוז (#61):** כל הטקסטים והאלמנטים ממורכזים, גם ההחזקות בדסקטופ; הלוטים ממלאים את המסגרת בדיוק (לא נחתכים). בפרודקשן ב-5ff210f.
- **טעינה:** רק ה-CSS הראשי חוסם את הציור הראשון (prerender), ה-LCP הוא הכותרת.
- **חזרה מהירה:** `scripts\rollback-prod.cmd` או Rollback בדשבורד של Cloudflare Pages (התג `prod-before-looks` = 58cf21f).

---

## 🎨 סשן 13/10/2026 (המשך): STOP 1 הוכרע, שלב 3 ומלווה ה-Rive

- **STOP 1 (#54, #55):** נתי בחר KM ("ליל השקה"), דמות Rive לטופס צור קשר, ואישר את הקופי המסומן כמו שהוא. `npm run build` רגיל = KM.
- **שלב 3 נבנה:** WhyUs, לפני/אחרי, שלבי העבודה, FAQ (13 השאלות ב-`src/data/faqs.ts`), המילה הענקית, צור קשר, הפופאפ (LeadModal), באנר העוגיות, כפתור הצ'אט ופאנל הנגישות, 404 והעמודים הפנימיים, הכל על הטוקנים של המראה.
- **מלווה ה-Rive (#56):** המחשב הנייד מההירו יושב על הטופס. הוא כותב את ההודעה על המסך בזמן ההקלדה, מקפל אותה לקו האופק בזמן השליחה, וממלא את העיגול לסמל כשהיא נשלחה. בשגיאה השורות חוזרות ונקודה אדומה מופיעה. הקוד: `src/look/parts/Companion.tsx`; הקובץ נוצר מ-`design/rive/companion/build-scene.mjs` (`npm run rive:companion`); החוזה: `design/rive/companion/CONTRACT.md`.
- **נבדק חי:** דסקטופ, טלפון, הפחתת תנועה, הצלחה וכישלון (הבקשה יורטה, שום ליד לא נשלח).
- **הבא:** שלב 4 (אימות מלא: gates, slop-scan, preserve diff, ניגודיות ונגישות, Lighthouse מול ../mw-baseline, חפיפות, חלקות גלילה במובייל מול הפרודקשן, impeccable, סוכן ביקורת אחד), אחר כך STOP 2 ודיפלוי דרך mediawave-dev.
- **שים לב:** כונן C: התמלא (0 בתים). נמחקו 43 פרופילים זמניים של puppeteer מ-Temp. בבדיקות עם puppeteer להגדיר `TEMP=G:	mp	emp`.

---

## 🎨 סשן 13/10/2026: שלושה מראות (K / M / KM) מקוד אחד, עד STOP 1

- **שער 1 הוכרע:** נתי בחר בשני עולמות מהלוח: K (ההשקה) ו-M (עצמים מרחפים). נבנו כשלושה מראות מתחלפים מאותו קוד (DECISIONS #50): K לבד, M לבד, ו-KM (הדף עובר בין הבמה השחורה לחלל הלבנדר).
- **איך מחליפים מראה:** `npm run build:k` / `build:m` / `build:km` (תיקיות dist-k / dist-m / dist-km; `npm run build` רגיל = KM ל-dist). ב-dev: `http://localhost:5173/?look=k|m|km`. אם 4173 תפוס: `PRERENDER_PORT=4174 npm run build:k`.
- **מה נבנה (שלבים 1-2 בבריף):** טוקנים ופונטים (Assistant + Alef, self-hosted, fallback מדוד), הדר ופוטר לכל מראה, משפחות כפתורים עם 7 מצבים (`/states?look=` ב-dev), הירו לכל מראה, ההחזקות: "ההשקה" (מחשב נייד שנפתח ומסתובב, K שירותים, KM איך עובדים) ו"הטיסה" (טסים לתוך כלים מרחפים, M ו-KM שירותים), החלפת במה/חלל ב-KM.
- **בקשת נתי באמצע (#51):** סרטון ההירו מתנגן גם בטלפון, מקידוד קל (189KB) אחרי טעינה ו-idle.
- **שאר הסקשנים (WhyUs, לפני/אחרי, FAQ, צור קשר, עמודים פנימיים):** עדיין בעיצוב הישן, עטופים ב-`.legacy`. שלב 3 אחרי הבחירה.
- **כלי חדש:** `scripts/overlap-audit.mjs` (שום טקסט לא דורך על אובייקט, טקסט או כפתור צף).
- **לוגו חדש Horizon (#52)** והנפשה שלו (#53): טיפה נופלת לעיגול, האופק נשפך ומתייצב, השם עולה, וטיפה קופצת ונוחתת על ה-i. בהדר פעם אחת בביקור, בפוטר לוגו ענק שהגלילה מריצה.
- **מוזג main של הפרודקשן (58cf21f, ‏60521ce):** הבלוג הוסר, תיקוני נגישות ו-iOS.
- **חזרה מהירה לאתר הקודם:** `scripts/rollback-prod.cmd` (או Rollback בדשבורד של Cloudflare Pages). התג `prod-before-looks` = ‏58cf21f.
- **ממתין:** STOP 1, נתי בוחר K / M / KM ומה לשנות. נתי כבר אישר דיפלוי דרך mediawave-dev כשהכל מוכן.

---

## 🎨 סשן 12/10/2026 (המשך): לוח סגנון בשלושה כיוונים, ממתין לשער 1

- **בוצע:** המעבדה הישנה נמחקה; W0 נכנס ל-commit ‏46da290; לוח סגנון ב-`/board` (רק ב-dev, לא נבנה לפרודקשן) ב-commit ‏544fef5.
  - A חדר העריכה: Noto Sans Hebrew צר במיוחד, גרפיט + אדום של נורת REC, הסרטון במוניטור, סרגל זמן, החזקת שירותים שסורקת 6 קליפים.
  - B פוסטר עברי: Karantina, זעפרן/מג'נטה/ירוק, הדפס דואוטון של הסרטון, שדה צבע שמודבק על כל המסך בכל מערכה.
  - C גלריה: Bona Nova, קיר לבן + אדום סלון, הסרטון ממוסגר עם שלט מוזיאון, הליכה לאורך קיר אדום עם 6 הלוטים.
  - בכל כיוון: כפתור עם 7 מצבים לחיצים, וכל הלוטים האמיתיים. הפונטים ברישיון OFL.
- **ממתין:** נתי ומוריה בוחרים כיוון ביחד. קודם צריך לדחוף את הבראנץ' כדי שמוריה תריץ אצלה: נתי מריץ `gh auth switch -u mediawave-dev`, ואז `git push -u origin design/pattern-break-20261012`.
- **אחרי הבחירה:** שלב 2 בבריף (סעיף 8): טוקנים ופונטים, הירו, משפחת כפתורי Rive, החזקת השירותים, שאר הסקשנים, טופס, פוטר ועמודים פנימיים.
- **קופי לאישור נתי** (מסומן `[קופי: נתי]` בקוד): משפט המשנה בהירו, שש שורות השירותים, "נשלח. נחזור אליכם היום".
- Bona Nova 400 נשמר בזיכרון כפונט מועדף של נתי.
- **13/10 המשך:** ל-B נוספו 4 פלטות שקטות (`/board/b?palette=faded|paper|green|ink`, ‏9ecdec4). נוסף `references/idea-bank.md` לסקיל pattern-breaker (20 רעיונות לעמוד שלם), ושלושה מהם נבנו על B ב-`/board/i1` (האתר נבנה מול העיניים), `/board/i2` (השם שלכם בכותרת), `/board/i3` (מכתב ותשובה), ‏5ca4a56. הבראנץ' ב-GitHub עדיין ב-3b664fa: כדי שמוריה תראה את החדש צריך לדחוף שוב (חשבון mediawave-dev).
- **13/10, סבב שני:** נוסף לסקיל `references/direction-bank.md`: 20 עולמות עיצוב מאתרים אמיתיים (בעיקר אתרי החודש והשנה של Awwwards 2024 עד 2026). עשרה מהם נבנו על האתר: `/board/d` עד `/board/m` (מקלט, יום ולילה, שרטוט מפורק, כוכב קטן, קומיקס, אלבום, רחוב, השקה, בית בובות, עצמים מרחפים), כל אחד עם פלטה, פונט, גלילה וכפתור משלו (‏0472929, c4b6b9c). מנוע כפתורים ומעבדה משותפים ב-shared.tsx ו-lab.css.
- **לבירור לפני שימוש ציבורי:** כיוון I (אלבום) משתמש בתמונות המשפחה מתוך memory-video.mp4, וצריך את הסכמת המשפחה.
- **ממתין:** נתי ומוריה בוחרים. הבראנץ' ב-GitHub עוד לא כולל את הסבב הזה (צריך דחיפה דרך mediawave-dev).
- **build:** אם פורט 4173 תפוס (שרת של פרויקט אחר), להריץ `PRERENDER_PORT=4174 npm run build` (f0e7e84).

---

## 🎨 סשן 12/10/2026: שדרוג pattern-breaker + rive-studio → עובר לסשן חדש עם בריף מלא

**להמשך: בסשן חדש להדביק "קרא את .context/REDESIGN-PROMPT.md ובצע אותו".** הקובץ מכיל את כל ההקשר.

- נתי דחה את סבב המעבדה (3 דמואים ב-/lab): כולם נשארו בתכלת ובגל של ים. הוא רוצה **שינוי משמעותי**, ולכן הפלטה ומוטיב הים **שוחררו**. נשארו קדושים רק סרטון הפתיחה ו-13 הלוטים.
- נתי לא אהב קו מתחת לטקסט של כפתור. הוא ביקש עבודה **תכל'ס**: בלי צי סוכנים ובלי סבבי מחקר.
- **branch:** `design/pattern-break-20261012`, עם שינויי W0 שעוד לא נכנסו ל-commit:
  - מנוע גלילה ב-src/motion, עם מדיניות CALM (#47)
  - המרקי הוסר (#48)
  - תיקון הלוטי הכבד (#49)
  - prerender מסמן `__PRERENDER__`
- **המעבדה (src/lab, routes /lab):** נדחתה. למחוק אותה לפני build: ל-Lab C יש 2 שגיאות TS.
- **Rive CLI 1.5.1** מותקן. worktree של baseline נמצא ב-`../mw-baseline`. מדידות הבסיס ב-design/upgrade/baseline (slop 96).

---

## 🧩 סשן בניית הסקיל pattern-breaker (04–05/10/2026) — אפס שינויי קוד באתר MediaWave

**המטרה:** מגה-סקיל ששובר תבניתיות של פרונט-אנד שנבנה ב-AI, מזוקק מהמשאבים בפוסט שנתי שיתף
ומחקר עומק של liavmatzri.co.il. שני מצבים: אתר מאפס (יסודות נכונים בלי סשני תיקונים) ושדרוג אתר קיים.
מכוון ל-2026 ול-Opus 5.5.

**איפה הכל:** `C:\Users\User\.claude\skills\pattern-breaker\` (SKILL.md, 18 קבצי references,
engine + attribute-layer + moves-gallery, 9 סקריפטים, תבניות, GUIDE.rtl.md). המחקר הגולמי
(9 דוחות, ~6,000 שורות) ב-scratchpad של הסשן: `research/*.md`.

**הושלם:**
- [x] מחקר האתר המופתי (מראה מלאה, סרטוני גלילה דסקטופ/מובייל, פירוק הקוד של הכוריאוגרפיה)
- [x] 3 סבבי מחקר רשת (UI-skills, משאבי הפוסט, Opus 5.5, יסודות, שדרוג, Motion APIs, טקסונומיית סלופ)
- [x] SKILL.md + references (כולל foundations.md ו-motion-engine.md), שאלוני AskUserQuestion בעברית
- [x] כלים מאומתים: scroll-film, motion-audit, slop-scan (~120 כללים, 577 בדיקות עוברות), preserve, font-fallback, serve, lint-ask
- [x] באגים אמיתיים שנמצאו ותוקנו במנוע: SplitText שובר שורות בעברית (RTL → שורה אחת), דליפת split אסינכרוני, reveal מאוחר מדי

**נסגר (12/10/2026):** ריצות ההערכה נקטעו (מגבלת סשן + ניתוק רשת), אבל התמלילים שלהן נכרו: 6 סוקרים + 6 מאמתים
מצאו 77 ממצאים מאומתים ותוקנו (מעבדת קונספט שנתקעה על תקרת 128K, סדר שלבי השדרוג, קיזוז עוגנים, באגים במנוע ובכלים).
נוספו `scripts/selftest.mjs` (19/19 עוברים עם `--browser`) ו-`scripts/gates.mjs`. motion-audit על הגלריה: 17/17 בדסקטופ ובמובייל.
**לנתי:** להעתיק `assets/agents/pb-reflex-probe.md` ל-`~/.claude/agents/` (אופציונלי). לאשר את חלוקת העבודה מול mediawave-landing-page.
**אחרי כל שינוי בסקיל:** `node C:\Users\User\.claude\skills\pattern-breaker\scripts\selftest.mjs --browser` מתיקייה עם puppeteer.

**ממצאים על אתר MediaWave עצמו (לא תוקנו, לשיקול נתי):**
- slop-scan על `src/`: 96 ("AI-default template") — 40 fade-up, 26 transition-all, 19 hover-lift,
  ז'רגון בקופי (SEO, אופטימיזציה, ממירים), "גישה אישית" ו"ליווי צמוד" ב-Hero, Outfit כפונט.
- מדידה קודמת (G2): p95 פריים 50ms, long tasks במובייל 4,034ms, 7–10 אלמנטים זזים גם ב-reduced motion (חשיפת WCAG 2.2.2), ה-FAQ כולו fade.
- עותק impeccable המקומי ישן (v3.9.1 מול v4.5.0 upstream).

**צעדים הבאים:** לסיים את ה-eval → לשפר את הסקיל לפי הממצאים → סבב שני אם צריך.

---

## 🚀 דיפלוי שני (06/09/2026, ~08:40) — main = 6a0aabf · יציבות גלילה

נתי דיווח מהטלפון על "תבניות שקופצות בגלילה, נראה לא יציב" וביקש תיקון ודחיפה.

**האבחון (מדוד, לא הערכה):** כל אנימציית כניסה נורתה ברגע שקצה הבלוק נגע בתחתית
המסך, כך שאנימציה של 0.6 שניות עדיין רצה בזמן שהמשתמש גלל מעליה. מדידה בטלפון
(`scratchpad/measure-scrolljank2.mjs`, שני דגימות במרווח 170ms שסופרות רק אלמנט
שבאמת מתייצב): **18 מתוך 21 צעדי גלילה תפסו בלוק באמצע כניסה, 42 בלוקים בסך הכל.**

**מה תוקן (קומיט 6a0aabf):**
- `inViewOnce` ב-`src/config/motion.ts` = טריגר אחד לכל האתר, נורה 600px מראש.
  החליף 31 טריגרים כתובים ביד, שלושה מהם עם margin **שלילי** שאיחר עוד יותר.
- כניסות קצרות יותר (`DURATION.reveal` 0.35s) ומרחק קטן יותר (32→18px, כרטיסים
  40→14px, scale 0.92→0.96); ה-stagger מוגבל ל-0.2s.
- `HowWeWork` עקף את המערכת לגמרי: 40px + scale על springs עם מפל של 0.65s,
  ומספר צעד שהסתובב פנימה מ-scale 0.5 / ‎-10deg. עכשיו אותה עקומה ואותו תזמון.
- מכשירי מגע: אותן תכונות מונפשות אבל עם מגניטודה 0 (מעבר חוצה בלבד, בלי תנועה).
  **לא** החלפת אובייקט — שאילתת ה-pointer מתהפכת אחרי mount, וההחלפה השאירה
  כרטיסים תקועים ב-`translateX(18px)` עם opacity 1 (נתפס במדידה).
- `LottieIcon`: טעינה 800px מראש במקום 200px, ושלד בלי הפעימה התכלת.

**אחרי: 0 מתוך 21 צעדים בטלפון (1 מתוך 14 ב-1440).** שער: 13 עוברים, אותם 2
אדומים ידועים. אומתו גם /services/*, /portfolio/*, /blog/:slug ו-404 (תוכן מוסתר,
גלישה, שגיאות קונסול = 0).

**Rollback לדיפלוי הזה בלבד:** `git revert 6a0aabf` ואז דחיפה ל-main.
**Rollback מלא ללילה כולו:** `git push origin 299cb88:main --force-with-lease`.

---

## 🚀 נדחף לפרודקשן (06/09/2026, ~07:35) — main = c013d93

בקשת נתי: "דחוף לפרודקשן". בוצע `git push origin HEAD:main` (fast-forward מ-299cb88), דרך החשבון
`mediawave-dev` שהיה כבר הפעיל, עם `git -c credential.helper= -c credential.helper='!gh auth git-credential'`.

**מה עלה בפועל: 38 קומיטים**, לא רק 13:
- **24 קומיטים מריצת `upgrade/fable-20260712` (יולי)** — SEO (canonical/OG dedup, 404 אמיתי, breadcrumbs, FAQ ב-HTML),
  נגישות, אנליטיקס first-party, פרפורמנס (paint-first mount, Outfit self-hosted, lottie chunk, CLS).
  העבודה הזו הייתה מגודרת וירוקה מיולי אבל **לא מוזגה** אז, בהמתנה להחלטת נתי (audit/BLOCKED.md §5.4).
  היא ישבה בבסיס של בראנץ' הלילה, ולכן עלתה יחד איתו. זה גם מה שנבדק ונמדד כל הלילה.
- **13 קומיטים מריצת הלילה** (4 משימות השער + 6 באגים מדודים + 3 סבבי פרימיום).
- **1 קומיט תיעוד** (דוח הבוקר + handoff).

**Rollback לפרודקשן** (חוזר למצב שלפני הדחיפה):
```
git push origin 299cb88:main --force-with-lease
```
או Rollback מדשבורד Cloudflare Pages. אימות דיפלוי: `.design-loop/night-20260906/deploy-poll.log`
(סמן: המחרוזת `spotlight-card` מופיעה ב-HTML המ-prerendered רק בבילד החדש).

---

## עדכון אחרון (06/09/2026) — ריצה לילית design-gate (Fable), branch: fix/design-gate-20260906
**13 קומיטים מקומיים (83c9323..b61cf50), לא נדחף.** נתי אישר את 10 הראשונים ב-04:00 וביקש חוות דעת + שדרוג פרימיום; קומיטים 08123cf + 42bb70b + b61cf50 = סבב פרימיום (השלישי = תיקוני הביקורת: overflow-clip לציר ה-view(), סמן, הרמה ב-CSS) (סימן גל תחת כותרות, זרקור בכרטיסים `.spotlight-card` + `src/utils/spotlight.ts`, רדיוס/קצב אחידים, סמן מכונת כתיבה, בלי ping, וידאו WhyUs 20%). חוות הדעת המלאה בתוספת (2) של דוח הבוקר. ~~**10 קומיטים מקומיים (83c9323..b6956c4), לא נדחף. דוח בוקר מלא: `.context/OVERNIGHT_RESULT_2026-09-06.md`. ראיות: `.design-loop/night-20260906/` (gitignored).**
- 4 משימות הפרומפט: EASE_SOURCE/LEGACY_NAME/CONSOLE_ERROR ירוקים; SKY_INK: מילת ההירו תוקנה (הצהרת משטח כהה על #hero), קישורי ההדר = false positive של הדיטקטור (ניגודיות אמיתית 6.4–9:1) — נשאר אדום בכוונה; AXE_CONTRAST = flake של באנר העוגיות באמצע fade (במנוחה 0).
- מעבר לפרומפט (בהיתר נתי): טאב הנגישות חסם את מרכז הבורגר במובייל (P0, עבר ל-top:120px); באנר העוגיות כיסה את שדה הצ'אט (דיאלוגים ל-z-[60], backdrop תפריט z-[55]); 404 פינוי מההדר/FABs; noscript חושף את ה-prerender; טאגליין הפוטר לפי החלטה #31 (שינוי הקופי היחיד); `--ease-tide` טוקן.
- **פתוח לנתי:** ז׳רגון טכני בעמודי /services/*; לוטי LeadModal עם "CONTACT Us"; פופאפ 35 שניות; וואטסאפ ירוק = גוון שני; אזהרת framer PopChild ref (dev בלבד, upgrade patch); שער: SKY_INK ancestor-walk, AXE timing, TOKEN_DRIFT allowlist, verify.mjs בלי scroll-prime.
- **סקריפטים חד-פעמיים** בסקראצ׳פד של הסשן (לא בריפו): shoot-revealed.mjs (צילומים אחרי גלילה), shoot-states.mjs, pixel-diff.mjs, crop.mjs, probe-*.mjs, measure-backdrop.mjs.
- דחיפה: `gh auth switch -u mediawave-dev` → `git push -u origin fix/design-gate-20260906` → PR/מיזוג ל-main. חזרה לאחור: `git revert` לקומיט בודד (כל קומיט עצמאי) או `git branch -f fix/design-gate-20260906 83c9323` אחרי checkout לבראנץ' אחר.

---

## עדכון אחרון (16/07/2026) — ריצת שערים אוטונומית (Fable), branch: upgrade/fable-20260712
ריצה מלאה לפי בריף "MediaWave Site Upgrade": baseline מדוד → תיקונים → שערים על preview.
- **Baseline מלא של הפרודקשן** ב-audit/BASELINE.md (+ audit/raw/, לא ב-git). ממצאי ענק:
  Cloudflare חוסם את כל סורקי ה-AI ב-403 ברמת ה-zone (PROPOSALS #1 — רק נתי יכול לפתוח);
  canonicals כפולים שהצביעו לדף הבית מכל עמוד פנימי; תשובות FAQ לא היו ב-HTML;
  CLS 0.50 בבלוג (fallback 50vh); TBT 25-54s ב-video-editing (לוטי 356 paths);
  אפס מעקב המרות.
- **16 קומיטים** על הבראנץ': SEO (canonical/OG dedup, 404 אמיתי, breadcrumbs), G1 (תשובות FAQ ב-DOM),
  נגישות (קו תחתי לקישור בבאנר, heading-order, פוקוס בווידג'טים, aria-invalid בטפסים,
  sr-only לטייפרייטר, וידאו נעצר מהווידג'ט), אנליטיקס first-party (track() → /api/event, 28 נקודות),
  ופרפורמנס: mount אחרי load+150ms (paint-first), Outfit self-hosted (בלי גוגל פונטס!),
  font-display:optional, skip לאנימציות כניסה בעמודים prerendered, fallback 120vh,
  ווידג'טים אחרי idle, lottie-web מוצמד ל-chunk (היה נמשך לתוך StudioPage 5MB!), canvas renderer ללוטי הכבד.
- **מקומי (שרת gzip)**: הבית 69→88, video-editing 41→76 (TBT 6160→290ms), בלוג 46→82 (CLS 0.007);
  a11y/BP/SEO = 100/100/100. smoke 12/12. צילומי לפני/אחרי זהים (חוץ מהקו-תחתי המכוון).
- **סקיל חדש**: C:/Users/User/.claude/skills/site-gate-audit — צ'קליסט 10 השערים לכל אתר לקוח.
- **סיום הריצה (17/07)**: כל השערים ירוקים חוץ מ-perf/LCP (ראו audit/BLOCKED.md). לא מוזג לפי סעיף 5.4 — ההחלטה אצל נתי: PR מוכן בקליק, PROPOSALS #10 = תפריט ההחלטות לנקודות ה-perf האחרונות.
- /studio תוקן סופית (asset אמיתי, אומת 200 ב-preview v3); 21 קומיטים בבראנץ, נדחף.
- **Rollback לפרודקשן אם צריך**: git push origin 299cb88:main --force-with-lease
  (או Rollback בדשבורד CF Pages). production tip לפני הריצה: 299cb88.

---



## Goal
מימוש DESIGN-UPGRADE "מעבדת הגלים" — ריצה אוטונומית מלאה (03-04/07/2026), branch: `design/wave-lab` (מעל feature/production-polish).

## עדכון אחרון (10/07/2026) — סבב "ליגת על" אוטונומי, branch: `design/premium-league`
בראנצ' חדש מעל design/wave-lab. **לא נדחף / לא מוזג — ממתין להחלטת נתי על דיפלוי.**
- **חוויית מאמר פרימיום** (BlogPost): פס התקדמות קריאה scroll-linked (ReadingProgress.tsx, גרדיאנט sky→teal, נטען מימין ב-RTL, z-60 מעל ההדר), זמן קריאה בעברית תקינה (utils/blog.ts: formatReadingTime — "דקת קריאה"/"X דקות קריאה"), "כדאי לקרוא גם" (2 מאמרים לפי חפיפת תגיות, getRelatedPosts), שורת שיתוף (ShareRow.tsx: וואטסאפ / העתקת קישור עם אישור אינליין / Web Share API), wordCount+timeRequired ב-BlogPosting schema. זמן קריאה גם בכרטיסי /blog.
- **ליטושי CSS רוחביים**: ::selection חזק יותר (0.35, בלי דריסת צבע — עובד גם על משטחים כהים), scrollbar-color ממותג (#BAE6FD, מתכהה ב-high-contrast וב-prefers-contrast), caret-color ב-inputs, רקע html גרדיאנט כהה (overscroll מציג נייבי/שחור במקום הבזק לבן), text-wrap:pretty בפרוזה.
- **פוטר**: קישורים מהירים עברו מ-#ABABAB אפור-שטוח + JS hovers ל-.footer-link (frost-mist) — תיקון הפרת The-Mist-Rule; border-top/מפרידים ל-rgba frost.
- **נגישות מודאלים**: תפריט מובייל + LeadModal — Escape סוגר, role=dialog+aria-modal, מלכודת Tab, פוקוס נכנס וחוזר (דפוס זהה ל-ChatWidget הקיים).
- **404**: מספר בקו-מתאר sky (זהות ה-outline של האתר), קופי גלי ("הדף הזה נסחף עם הגל"), קישורים מהירים, תוקן em-dash בכותרת SEO.
- **SEO**: og:image:alt + twitter:image:alt ב-SEO.tsx.
- **חתימת קונסול** בפרודקשן בלבד (main.tsx, console.info ממותג + קישור וואטסאפ) — חריגה מודעת מכלל "no console.log".
- **כלי חדש**: scripts/screenshot-audit.mjs (צילומי דסקטופ+מובייל של עמודי מפתח; פלט ל-screenshots-audit/ — ב-gitignore).
- **שערים**: tsc נקי, eslint נקי על כל הקבצים שהשתנו, build+prerender מלא, design-verify, צילומי לפני/אחרי.
- **לא נגעתי**: שינויי .gsd/* בעץ העבודה (קדם-קיימים, לא שלי), קבצי junk לא-מנוהלים בשורש.

## עדכון אחרון (06/07/2026) — impeccable + שילוב תוכן + דיפלוי חי
- **דומיין פרודקשן: mediawave.co.il** (חי). ‏mediawaveisrael.com היה שגוי בכל ה-SEO — תוקן (canonical/OG/JSON-LD/sitemap/feed/og-image). פתוח: www.* מחזיר 522 (לחבר ב-CF Pages), Google Search Console.
- **דיפלוי:** push ל-main דרך חשבון `mediawave-dev` בלבד (החשבון של נתי מקבל 403). ‏CF Pages בונה מ-git תוך ~3-4 דק'. אין wrangler מקומי מחובר.
- **impeccable יושם במלואו** (החלטות 37-46 ב-DECISIONS): eyebrow הוסר, MagneticButton נמחק, glow חם→תכלת, focus-ring דו-מצבי, מספרי-צעדים stroke, כרטיסים בלי זכוכית, כל לולאות framer מגודרות, ‎~200 שורות CSS מת נמחקו. דוח: `IMPECCABLE-AUDIT.rtl.md`.
- **תוכן ממוריה שולב** (bundle) בעיצוב wave-lab: 9 מאמרי בלוג (היו 2), 6 שירותים (נוספו עריכת וידאו + סרטוני זיכרונות), עמודי `/services/:slug` + `/portfolio/memory-videos` עם וידאו לקוח אמיתי (9.7MB). גריד הבית 4→6 כרטיסים לבנים. **21 עמודי prerender**.
- **סרטוני זיכרונות:** אייקון SVG סטטי (`/animations/photo edit.svg`) + כפתור CTA בולט "ראו דוגמה לפרויקט" (sky-ink, אייקון play) בכרטיס — השירות היחיד עם דוגמת עבודה אמיתית.
- **שערים אחרי כל שינוי:** axe 0 הפרות (הורחב ל-11 עמודים), mobile-smooth 10/10 (סקריפט חדש `.gsd/temp/verify-mobile-smooth.mjs`), design-verify PASS (סורק כל מסלול לפני צילום), tsc/build 21 עמודים.
- **הגדלת אנימציות (06/07):** כל ה-Lottie/SVG הוגדלו משמעותית לפי בקשת נתי — כרטיסי שירותים 128→180 (chatbots 200 לפיצוי ריפוד פנימי), הירו של עמוד שירות +40 (200-240), WhyUs 112→160, HowWeWork 160→210, Contact 120→180 (0.78 במובייל), LeadModal 100→150, ChatWidget 48→56/44→52. אומת: אפס גלישה בכל רוחב, אפס חריגת-כרטיס, ביקורת ויזואלית יריבותית (6 סוכנים) ממוצע 84/100. חי בפרודקשן.
- **פתוח:** portfolioLink רק ל-memory-videos; שאר השירותים בלי דוגמאות (חסר תוכן). Lighthouse לא נמדד מחדש בסבב זה (מכונה עמוסה — למדוד בבוקר). לוגו ירוק חדש ב-Downloads — לא שולב (המתנה להחלטה).

## Completed (branch: design/wave-lab, ~15 קומיטים)
- [x] **Phase 1** — טוקנים (`--font-spec`, `--text-giant`, `--ease-brand`) + `src/config/motion.ts`; GrainOverlay גלובלי (`public/images/grain.png` 6KB); WaveDivider (3 וריאנטים א-סימטריים, flip/drift/bg, מושהה מחוץ למסך) פרוס בין כל הסקשנים; Marquee טכנולוגיות CSS-בלבד; צללי hover ל-pseudo+opacity
- [x] **Phase 2** — StaggeredWords (פיצול מילים בלבד!) + גל draw-on מתחת ל"המומחיות שלנו"; LoadTimeBadge (LCP אמיתי של המבקר + "בדקו בעצמכם"); ProofBand כהה עם קאונט-אפ (מספרים מדודים בלבד: 97/100, 1.0s, 0.53MB + סלוטים data-pending); מספור מפרט 01· + מילת מפתח צבועה בכל כותרת
- [x] **Phase 3** — BeforeAfterSlider (אפס תלויות, clip-path+CSS var, תמונות דמו עם תווית "הדגמה"); Services hover wipe; HowWeWork קו גלי אחד נמשך; MagneticButton על 3 CTA; מילת הענק "מתחילים?"
- [x] **Phase 4 חלקי** — View Transitions לבלוג (220ms, feature-detected). סמן מותאם/פליגראונד/Lenis — לא (מתועד ב-DECISIONS)
- [x] **תיקון יסוד: קסקדת CSS** — כללי base לא-ממושכבים דרסו את כל ה-utilities של Tailwind v4. הועברו ל-`@layer base`; סקיילינג נגישות עבר לשורש. בעקבות זה: גדלי הירו/כותרות אמיתיים לראשונה
- [x] תיקוני אודיט: אימייל נחתך ב-320, ניווט נשבר ב-768, bidi אינסטגרם, אימייל פוטר, ניגודיות קופירייט, גוון WhyUs חם→קר

## Key Decisions
ראה `DECISIONS.rtl.md` (18 החלטות מתועדות). עיקריות: מונו מערכתי במקום קניית פונט; sky-600 למילות מפתח על רקע בהיר (WCAG); מספרים מדודים בלבד ב-ProofBand; סמן מותאם הושמט.

## Quality Gates (כולם ירוקים בסוף כל Phase)
- tsc + eslint נקיים (3 אזהרות ישנות בקבצי sanity — לא קשורות)
- build מלא + prerender 7 עמודים
- Lighthouse: דסקטופ 97 (שער ≥95), מובייל 71-73 (שער ≥70; baseline היה 69)
- צילומי 320/390/768/1440 + blog/accessibility/404: אפס שגיאות קונסול/רשת/גלילה אופקית
- רגרסיית אנימציות (typewriter, וידאו, Lotties, אקורדיון, תפריט, מרקי, קאונט-אפ, סליידר, גל כותרת) + reduced-motion סטטי וקריא

## Known Issues / Next Steps
1. **ProofBand** — לעדכן ציונים אם ה-final run שונה; להזין מספרי לקוחות אמיתיים ל-data-pending
2. **רישיון EFT Betaamango/OffSet** — עדיין פתוח (לא הוחלף פונט בריצה זו)
3. **טבלת קופי לאישור נתי** — בדוח הסיום; כל מחרוזת חדשה מסומנת `[קופי: נתי]` בקוד
4. ליטושים שנצפו ולא טופלו (מתועדים): ריווח מובייל HowWeWork→FAQ, רשימת קשר דלילה במובייל, ווידג'ט צף מכסה כותרת ב-320, `<a>` מקונן ב-Header/Logo (קדם-קיים), אזהרת fetchPriority (React 18)
5. git push — הכל מקומי בלבד (לפי ההוראה)

## סבב משוב נתי (04/07/2026) — הושלם
- [x] גלים חיים: WaveDivider = 2-3 שכבות גל תקופתיות בלולאת transform חלקה (בלי תפרים), בכל הגבולות; מושהה מחוץ למסך; סטטי ב-reduced-motion
- [x] מרקי טכנולוגיות זורם מימין לשמאל; קו הכותרת בהירו מתנדנד עדין אחרי הציור
- [x] ריווח הירו מההדר (md:pt-44); הוסר הקו התכלת בראש הפוטר
- [x] מילת הענק מתמלאת בגלילה במובייל (pointer:coarse + in-view)
- [x] כל המקפים הארוכים הוסרו מטקסטים מוצגים (23 החלפות)
- [x] אתר הדמו הישן: "עסק לפיתוח אתרים!" בסגנון 2003 (פלאש, ספר אורחים, אקספלורר)
- [x] Lighthouse אחרי הסבב: דסקטופ 97, מובייל 75 (הכי טוב עד כה)

## סבב משוב נתי 2 (04/07/2026) — הושלם
- [x] מדיניות מושן אמביינטית: useAmbientMotion (ווידג'ט = כיבוי מוחלט; דגל מערכת = האטה בלבד לגלים/מרקי, ומכבה רק וידאו/כניסות/מגנטי). לוטי, מכונת כתיבה, אורבים, לופים = תמיד חיים
- [x] הוסרו מהאתר: LoadTimeBadge + פס הסטטיסטיקות של ProofBand (הקבצים נמחקו; בהיסטוריית git)
- [x] הסליידר נשמר בסקשן חדש BeforeAfterShowcase.tsx ("לפני ואחרי", נייבי, id=before-after)
- [x] מרקי הואץ ל-22s; הצהרת הנגישות עודכנה לנוסח מדויק
- [x] אומת: תחת reduce הגלים/מרקי/מכונת-כתיבה זזים; עם הווידג'ט הכל קופא; אפס שגיאות בכל הרוחבים

## סבב משוב נתי 3 (04/07/2026) — הושלם
- [x] תוקן טקסט מפוקסל: הגריין הגלובלי עם mix-blend-mode ביטל ClearType בכל הדף. הוחלף באריח רעש אלפא (grain-alpha.png) בקומפוזיציה רגילה, סקופ לפוטר ולסקשן לפני/אחרי בלבד, מאחורי התוכן. GrainOverlay + grain.png נמחקו

## סבב משוב נתי 4 (05/07/2026) — הושלם (החלטות 26-31)
רקע: "חוסר ההלימה בצבעים" + "קו מתחת לכל מילה" התבררו כמצב ניגודיות-גבוהה שנשאר דלוק בווידג'ט מביקור קודם (localStorage). הצ'אט בוט תקין — אזעקת שווא.
- [x] הגדרות נגישות לא נשמרות יותר: כל טעינה = טקסט רגיל + ניגודיות כבויה + אנימציות. המפתח הישן נמחק בכניסה (useAccessibility.ts)
- [x] ניגודיות גבוהה: פלטה במשפחת התכלת (#0369A1/#0284C7/#075985 במקום רויאל #0055AA), בלי קו תחתון גורף, header-cta לבן; prefers-contrast תוקן ל-more
- [x] ווידג'ט: הכפתור הנבחר קריא — צ'יפ כהה/לבן דרך `.text-size-btn[aria-pressed="true"]` (un-layered; utilities מפסידים שם). כלל data-active המת נמחק
- [x] "בואו נדבר": MagneticButton הוסר; hover חדש = גאות תכלת דו-שכבתית מוכלת (pseudo, transform בלבד, 600ms cubic-out, 130%/88%→-12%). אפס הזזה אופקית — מאומת
- [x] קווים תחתונים סטטיים → hover בלבד (HowWeWork + Contact/LeadModal); הקישור ב-HowWeWork יושר ל-#0284C7. חריגים: prose בבלוג, URLs בצ'אט
- [x] טאגליין: "עיצוב ופיתוח אתרים מקצועיים לעסקים" (הירו, meta, JSON-LD x2, App.tsx, CONTENT.md)
- [x] אימות: `.gsd/temp/verify-a11y-round.mjs` — ‏11/11 (כולל: אפס drift ב-CTA, איפוס מלא אחרי reload, אפס קווים תחתונים בפוטר ב-HC, אפס שגיאות קונסול). צילומים: `g:\tmp\mediawave-audit\wave-lab\a11y-round\`

## סבב משוב נתי 5 (05/07/2026) — הושלם (החלטות 32-36)
- [x] תמונת ה"אחרי" בסליידר רונדרה מחדש מהבילד העדכני (טאגליין קצר). `scripts/generate-demo-images.mjs`
- [x] **ניגודיות כלל-אתרית: טוקן `--color-sky-ink`/`-strong`.** השורש לכל תלונות "לא קריא" היה כלל בסיס גלובלי `a{color:#7DD3FC}` + עשרות text-orange = תכלת פסטל (1.6:1) על בהיר. הוחלף בכחול-שמיים עמוק (#0369A1, 5.9:1) בכל הטקסטים על משטח בהיר: בלוג, משפטיים, נגישות, 404, עוגיות, המלצות, צ'אט, תפריט מובייל, HowWeWork
- [x] **הכפתור "רגיל" בווידג'ט קריא** — צ'יפ כהה + טקסט לבן; מתגי off ל-gray-400
- [x] HC: קישורי הניווט בהדר נאלצים ללבן (הדר תמיד כהה); כל bg-orange CTA מקבל טקסט לבן
- [x] **אכיפה חדשה: `.gsd/temp/contrast-audit.mjs` (axe-core) = 0 הפרות** על 7 עמודים + מצבי ווידג'ט/HC/צ'אט/תפריט. הרץ בכל סבב עתידי כשער
- [x] אימות: axe 0/0, verify-a11y-round 11/11, tsc+eslint נקיים, build+prerender 7 עמודים. צילומי הווידג'ט: `widget-default-regil.png`

## Important Files
- `src/config/motion.ts` — easing חתימה אחד (EASE_BRAND); `src/hooks/useReducedMotion.ts` — גם useAmbientMotion
- `src/components/ui/` — WaveDivider, Marquee, StaggeredWords, BeforeAfterSlider, MagneticButton, GiantWord (נמחקו: LoadTimeBadge, GrainOverlay)
- `src/components/sections/BeforeAfterShowcase.tsx` — הסקשן הכהה עם הסליידר (החליף את ProofBand שנמחק)
- `scripts/design-verify.mjs` — שער ויזואלי רב-פעמי; `scripts/generate-demo-images.mjs` — נכסי הסליידר
- צילומים ודוחות: `g:\tmp\mediawave-audit\wave-lab\{before,phase1,phase2,phase3,final,motion,ambient}\`

## סשן impeccable (05/07/2026) — התקנה + init + ביקורת (אפס שינויי קוד)
- [x] **impeccable v3.9.1 הותקן גלובלית**: `C:\Users\User\.claude\skills\impeccable\` דרך `npx impeccable@latest skills install -y --providers=claude --scope=global --no-hooks`. עדכון עתידי: אותה פקודה בדיוק (מרעננת אם יש גרסה חדשה). בלי hooks בכוונה — אפשר להדליק פר-פרויקט עם `/impeccable hooks on`
- [x] **`/impeccable init` הורץ**: נוצרו `PRODUCT.md` + `DESIGN.md` (מקודדים את 9 החוקים הנעולים + Legacy-Name Rule) + `.impeccable/design.json` + `.impeccable/live/config.json`; מצביע Design Context נוסף ל-CLAUDE.md; ראיון המשתמש דולג בהיתר (כל תשובה נגזרה מתיעוד הריפו) — נתי מוזמן לערוך
- [x] **ביקורת מלאה — `IMPECCABLE-AUDIT.rtl.md`**: ‏audit ‏16/20, ‏critique ‏30/40, ‏AI-slop: עובר. ‏P1: ‏eyebrow עברי עם tracking + ‎#38BDF8 על בהיר (Services.tsx:92), ‏MagneticButton שנשאר בהירו+Contact, ‏glow חום ישן ב-Button.tsx:129. דיטקטור: 39 ממצאים (`g:\tmp\impeccable-detect.json`); צילומים: `g:\tmp\mediawave-audit\wave-lab\impeccable-audit\`
- [x] ~~ממתין להחלטת נתי~~ — נתי אישר הכל ("מאשר הכל, צא לדרך")

## סשן יישום לילי (06/07/2026) — כל ממצאי impeccable יושמו, אפס דיפלוי (חסום)
**11 קומיטים מקומיים על design/wave-lab, מוכנים לדחיפה. ‏origin לא עודכן.**

### ⚠️ דיפלוי — חסום על הרשאות, פקודות לבוקר
ה-push נכשל: מנהל ה-credentials של Windows מגיש טוקן ישן של `levy-n` (403); לחשבון gh הפעיל `NatiLevyy` אין הרשאה; החלפה אוטומטית ל-`mediawave-dev` נחסמה ע"י מסווג ההרשאות של Claude (נכון). **להריץ ידנית:**
```
gh auth switch -u mediawave-dev
git push -u origin design/wave-lab
git push origin design/wave-lab:main      # fast-forward נקי (אומת) → CF Pages production
gh auth switch -u NatiLevyy
```

### מה יושם (החלטות 37-46 ב-DECISIONS.rtl.md)
- P1: ‏eyebrow הוסר; MagneticButton נמחק מהאתר; glow חום ← תכלת
- P2: מערכת focus-ring דו-מצבית; מספרי-צעדים stroke + כרטיסים לבנים (בלי זכוכית); italic הוסר מציטוטי sanity; פלטת Testimonials ← תכלת; hover-ים דוהים ← sky-ink; **כל** לולאות framer מגודרות useAmbientMotion (מתג הווידג'ט עוצר גם JS — מאומת בסקריפט חדש `verify-widget-framer.mjs`)
- P3: ‏~200 שורות CSS מת נמחקו + פונטים רפאים; פוטר frost-mist (`.footer-link`); טלפונים מונו-ספק; קו-ניווט scaleX; `text-wrap: balance` (h2/h3 בלבד!); tap-highlight שקוף; `<a>` מקונן תוקן (Logo=div)

### שערים (הכל ירוק)
- tsc ✔ · eslint: רק 3 אזהרות sanity ישנות ✔ · build+prerender 7 עמודים ✔
- axe contrast: **0 הפרות** ×4 ריצות (+תוקן flake בשער: המתנת settle לפאנל הווידג'ט)
- verify-a11y-round: **11/11** ✔ · widget-framer: PASS (ברק קופא) ✔
- צילומי 320/390/768/1440 כל המסלולים: אפס שגיאות/overflow ×3 ריצות ✔ (`g:\tmp\mediawave-audit\wave-lab\impeccable-final2\`)
- **Lighthouse — הערה חשובה**: הלילה המכונה עמוסה; ‏A/B מול baseline ב-worktree: דסקטופ 93-94 מול 93 baseline (פריטי; ה-97 המתועד = סביבה נקייה), מובייל 61 מול 62 baseline (פריטי; מתועד 72-75). רגרסיית balance-על-h1 שהתגלתה (‏-2) תוקנה ע"י צמצום ל-h2/h3. **מומלץ למדוד שוב בבוקר על מכונה שקטה לפני merge**
- לא-משוחזר: חפיפת ווידג'ט-כותרת ב-320 (נבדק ויזואלית — אין)

### נשאר פתוח
1. הדחיפה + אימות דיפלוי CF Pages (פקודות למעלה)
2. רישיון EFT + החלפת Outfit (reflex-list) — לשיקול עתידי
3. איורי הכרטיסים בצבעים זרים (אדום/סגול) — recolor אופציונלי
4. תיקיות פונטים היסטוריות ב-src/fonts (noa-shalev, yarden, american-captain, Sn_armilado) — ארכיון, לא נגעתי
