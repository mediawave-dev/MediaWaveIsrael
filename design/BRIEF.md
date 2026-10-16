# BRIEF · mediawave · v2 (site-director redesign) · 2026-10-15

> The single source of truth for the home-page redesign. Evidence: design/DIAGNOSIS.rtl.md (the live site, measured) and design/world-dossier.rtl.md (Nati's answers, 2026-10-15). The previous concept (KM "launch night") lives in git history; design/CONCEPT.md is rewritten after the concept round.

## Why this site exists
- Client: MediaWave (Nati Levy), Israel: builds websites in code for small businesses, edits video, converts old tapes to files.
- Who it is for: Hebrew-speaking small-business owners, on their phone, comparing agencies; skeptical, afraid of paying and getting "a template".
- What the site must make visitors do: send a WhatsApp message (prefilled) or leave a phone number.
- What it must make them feel: "he will show me my site on my phone before anything goes live, and it will not look like everyone else's".
- Why distinctiveness matters here: the site IS the portfolio; Nati asked for "the level of Heron AI" and judges every detail.

## The one true claim
The client sees their own site being built, on their own phone, through a link Nati sends at each stage; it goes live only when it is fast on a phone. Evidence: Nati's answers (the document he gives the client is "a link to the site under construction"; the good-hands moment is "when he sees the site on his phone"); the live site's own measured mobile Lighthouse 96 (2026-10-13).

## World dossier (condensed)
- The business actually: builds a business a site in code and sends a link to the client's phone so he watches it being built, until it goes live; also edits video and converts old tapes to files.
- W03 the link to the site under construction: a fixed address line at the head of each chapter shows that chapter's path, like the link that was sent (document, content)
- W04 the client's phone: the persistent object; a real client site passes through its states inside it along the scroll (tool, shape)
- W02 device mode in the browser's developer tools (390 x 844): labels show real dimensions in the instrument face; width is the grid's unit (instrument, type)
- W05/W06 the Lighthouse speed score, 0-100, and its colour bands (red 0-49, orange 50-89, green 90-100): the real measured number is the proof of the "measure" chapter; green means "passed / live" and is the only place the accent appears (instrument, colour)
- W07 the video editing timeline with a playhead: a thin track along the page marks where the visitor is in the story (tool, motion)
- W08 timecode HH:MM:SS:FF: chapters are marked by timecode instead of 01/02/03 (marking, type)
- W09 the cut: transitions between chapters are hard cuts on a frame, never crossfades (jargon, motion)
- W12 going live / deploy: the object's last state, a green dot and the real address replacing the staging one (moment, motion)
- W14 a VHS cassette with a handwritten label: the image of the tape chapter [to confirm: real photo with consent, or licensed free media] (material, content)
- W17 a screenshot with the client's circled correction: the "fix" chapter turns a circled mark into the corrected version (document, interaction)
- W19 "mobile first": the grid starts from the 390 column and widens; on desktop the phone stays centred (jargon, grid)
- W20 the moment the client sees the site on his phone: the page's main peak (moment, motion)
- W21 the fear "it will look like a template": proof is two real, different client sites in the same phone [to confirm: which client sites may be shown] (moment, content)
- Banned name puns: wave, sea, water, radio or sound waves (Media**Wave**); both sea and wave rounds were already rejected (#62)

## Real materials
| Material | Exists? | Source / owner | Notes |
|---|---|---|---|
| Photos of the place / work / people | No | | free, licence-checked media of the trade's objects (media-sourcing.md); never shown as Nati's own |
| Video | Yes | public/videos/lens.mp4 (Pexels 5585952), hero-bg.mp4, whyus-bg.mp4, memory-video.mp4 | the hero film is sacred as material; memory-video shows family photos: consent needed before public use |
| Owner willing to be photographed | Unknown | | [to confirm] |
| Customer proof | Partial | yaelevy screenshot (src/assets), Ben-David Judaica (live client site on the editor platform) | [to confirm: which may be shown]; testimonials list is empty, none invented |
| Existing brand | Yes | Horizon logo + ident (sacred); 13 service Lotties (sacred, framing free) | Klein palette and EFT Betaamango / IBM Plex released |

## Direction
- Intensity: orchestrated · target length about 12 vp desktop · signature moments 3 (each extra needs its own decision row; the logo ident counts)
- Character (max 2): "precise without being cold"; "alive without being busy"
- Avoid (anti-references): the current site's 4 full-screen dark/light flips (at most ONE theme change on the whole page, and only if it means something); text under floating chrome (cookie card, chat, WhatsApp, a11y tab); a popup in the middle of the story; the three-card "why us" grid; services as six parallel items; laptop-on-desk stock; waves and water
- Brand constraints: Horizon logo and its ident; the 13 Lotties (must all appear, framing free); the hero film as material; one H1; anchors #services #process #faq #contact; WhatsApp, tel and form conversion paths with their track() calls; the 13 FAQ entries; approved copy lines
- Pinned by the brief: persistent object W04 the client's phone holding a client's site under construction (link sent > first version > circled fixes > live, green dot; literal because every MediaWave client really receives a staging link, opens it on his phone, sends back circled screenshots, and gets the live address at the end, in that order); hero interaction source W02 device mode, the visitor does what Nati does: narrows the page from desktop width to a phone and watches it reflow
- Concept: (filled after the concept round; details in CONCEPT.md)
- Languages / direction: he rtl

## Build
- Stack: unchanged (decision D1): React 18.3 + Vite 6 + TypeScript + Tailwind v4 + prerender, Cloudflare Pages; motion on the existing pattern-breaker engine (GSAP 3.15 + ScrollTrigger + Lenis 1.3.26 on gsap.ticker); Rive canvas-lite where a piece needs state
- Pages: home first; inner pages next round on the same system
- Content source: the live site's approved copy; new lines marked [קופי: נתי]
- Integrations: WhatsApp prefilled, tel, form (WhatsApp fallback), lead popup on intent (lead-intent.js, done on this branch)

## Success criteria (verification checks these)
- Motion: held scenes ≤ 2, none touching, distinct moves ≥ 5, no dead zone ≥ 3 vp, fade share ≤ 0.5; theme changes ≤ 1
- Readability: no text under floating chrome at 320/390/768/1024/1440 (overlap-audit 0); body text ≥ 16 px on phones; AA contrast at rest AND mid-transition
- Performance: mobile Lighthouse ≥ 95 with motion on; LCP ≤ 2.0 s lab; CLS during scroll ≤ 0.05; INP ≤ 200 ms
- Accessibility: WCAG 2.2 AA; strict reduced motion on the OS setting is MediaWave's CALM exception (two tiers, DECISIONS #47) unless Nati changes it; content readable without JS
- Slop-scan index ≤ 20; beat Heron's Developer scores (markup 6.6, accessibility 6.8)

## Upgrade plan
- Verdict: rebuild in place (home page) (DIAGNOSIS §4)
- Sacred: see Brand constraints
- Proof confirmed by the owner: none yet

## Inferred (from evidence, not asked; only sources actually read)
- Lighthouse score bands red 0-49, orange 50-89, green 90-100: developer.chrome.com/docs/lighthouse/performance/performance-scoring
- 4 theme flips, the 142 px flip, popup coverage, chrome over headings: design/DIAGNOSIS.rtl.md

## Assumed (recommended option taken without an answer)
- Intensity orchestrated: the site is the portfolio piece
- Reduced motion keeps MediaWave's CALM tier (the strict rule is for client sites)
