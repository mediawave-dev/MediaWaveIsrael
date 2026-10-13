# Brief: the MediaWave opener (hero), round 2 (2026-10-13)

## Why this round exists

The live hero (a website that builds itself on a stage screen, then the film starts in its slot; DECISIONS #60) was rejected by Moriah, Nati's partner, in her words: "לא אהבתי את זה. ההתחלה צריכה להיות הכי מפוצצת, שיחשוב על משהו חדשני מגניב להתחלה שימשוך את הלקוח לגלול באתר". It read as a wireframe demo, not a show. Nati: "תעצב עם rive משהו שיהיה מדהים... תצא מהקופסה. תתנהג כמו מעצב על! זה הפתיח של האתר וכל אחד צריך להתרשם ממש ולרצות רק להמשיך לגלול וליצור קשר". The buttons may also become something different and unique.

The job of the opener: in the first 3 seconds, make a small-business owner think "whoever made this is extraordinary, I want this for my business", then pull them into scrolling, then toward contact.

## The business (the material comes from here)

MediaWave: Nati, one developer, builds websites and landing pages for Hebrew-speaking small businesses in Israel, edits video, converts old tapes, and turns family photos into memory videos. The client talks directly to the developer, no middlemen. The hero copy (fixed, it is the H1 and the LCP element, real HTML, never hidden, never faded in):

- H1 (two lines): "העסק שלכם" / "המומחיות שלנו"
- Line: "בונים לכם אתר שמביא פניות. מדברים ישירות עם המפתח, בלי מתווכים."
- Primary button: "בואו נדבר על הפרויקט שלכם" (goes to #contact); secondary link: "לשירותים שלנו" (#services)

## Fixed assets and system

- **The hero film is sacred but its framing is free**: `G:/Web-Dev/MediaWaveIsrael/public/videos/hero-bg.mp4` (1920x1028, top-down desk: two laptops, hands typing, an espresso, a phone; about 30 s loop), phone encode `hero-bg-m.mp4` (189 KB), posters `public/images/hero-poster.webp` / `hero-poster-m.webp`. Nati: keep the film "in one constellation or another", placed intelligently. It must never sit inside a drawn laptop again (laptops inside a laptop is illogical).
- **Palette "Klein"** (CSS tokens in `src/look/looks.css`): stage (dark) `#00113D`, paper `#FAFAF7`, International Klein Blue `#002FA7`, on the stage: ink `#FFFFFF`, secondary `#A3AFD6`, logo lower half `#6E8CFF`, tagline `#8E9CC8`; in paper: ink `#0E1016`, secondary `#4E5468`. No purple. One colour (Klein) used for action and brand.
- **Fonts** (self-hosted in `G:/Web-Dev/MediaWaveIsrael/public/fonts/`): headings EFT Betaamango (`EFT_Betaamango.woff2`, Hebrew) with Outfit 500 for Latin/digits (`Outfit-Latin-500.woff2`); text IBM Plex Sans Hebrew (`IBMPlexSansHebrew-Hebrew-400.woff2`, `-600`, Latin files beside them).
- **Logo "Horizon"**: a disc split by a wave into two tones (upper `#FFFFFF` / lower `#6E8CFF` on dark), path data in `src/components/ui/logo-paths.ts` (variant "mark": two paths in a 0..100 box) and `logos/horizon/*.svg`. Its meaning: a horizon, a liquid level in a disc; two halves meeting = "your business / our expertise". The logo already has an ident (drop falls in, disc parts and closes, horizon sloshes, a droplet leaps onto the i) in the header (once per visit) and the footer (scrubbed): do not repeat that ident as the opener.
- **The page after the hero** (keynote "launch night"): a Klein-night stage and a paper void alternate; Why us (three screens switching on), Services (a held scene flying into six floating Klein objects with white faces showing the Lotties), Process (a held scene: a laptop opens and turns per step), FAQ, a giant word "מתחילים?", Contact (a Rive laptop companion that writes your message), footer.

## Hard rules (Nati's, non-negotiable)

1. Logic before wow: every metaphor must make literal sense. No recursive imagery.
2. Centered, symmetric composition (he reviews on his phone first).
3. The H1 stays real HTML, the LCP, visible at first paint. Nothing hides it. Meaning lives outside the canvas: no text inside Rive.
4. No generic copy, no invented proof (no fake numbers, clients, testimonials, lead counters).
5. Hebrew: no letter-spacing, no italics, direction-bearing motion enters from the right (RTL), splits by words or lines.
6. Buttons: no line under or inside a label at rest; hovers stay inside their element (no magnetic pull toward the pointer, nothing drifting toward neighbours); hover-only underlines on links are fine.
7. Only "-" as a dash in any text.
8. Reduced motion: the OS flag (CALM) keeps scroll-driven motion but drops autonomous loops; the a11y stop switch (REDUCE) shows final frames. Nati's own Windows reports reduced motion (he previews with `?motion=full`).

## Reflexes to avoid (they read as AI slop)

Blob mascot with eyes; eyes following the cursor; confetti; spinner rings; elastic overshoot everywhere; neon glow, glass, blur; purple-blue gradients; particles for decoration; gradient mesh blobs; text drawn in the canvas; a preloader counter; character-split headline reveals on every heading; marquee; magnetic buttons; custom cursor followers; "the website builds itself" (rejected); a laptop playing the video (rejected).

## Technical envelope

- **Rive via the CLI** (`C:/Users/User/.rive/bin/rive.exe`, RML authoring, unsigned, **no Luau scripts**), runtime `@rive-app/canvas-lite` 2.43.1 (Canvas2D: no text, no layout engine, no feathered fills; vector shapes, gradients, clipping, trim paths, dash paths, bones and constraints, state machines, data binding: view model numbers/booleans/enums/triggers written by the page, blend states driven by numbers, pointer listeners, nested artboards, events back to the page). Pointer position and scroll progress can reach the file as view model numbers written by JS every frame. Rive cannot render or mask a DOM video; the page can layer a DOM `<video>` above or below the canvas and position it exactly (as the current hero does), and CSS can mask/clip/transform the video.
- **Performance:** the H1 paints first; Rive (about 0.9 MB wasm, ~365 KB gzip, already shipped for the contact companion) loads after first paint; phones are mid-range Android at 4x slower CPU; only transform/opacity per frame on DOM; the hero must not tank scrolling. Real-browser phone LCP today 2.3 s.
- **Scroll:** GSAP ScrollTrigger + Lenis (desktop); holds are CSS sticky stages read by ScrollTrigger, never pins.
- **Where files go:** `G:/Web-Dev/MediaWaveIsrael/design/rive/opener/` (concepts, sketches, contract).

## The second ask: buttons

Nati wants the buttons "different and unique" too. Current family (KM): the lens, a solid rounded button (white with Klein text on the stage, Klein with white text on paper) where a lighter disc follows the pointer inside the button and fills it on press; seven states (idle, hover, pressed, focus, loading, sent, error). Rive in buttons is welcome where it earns its bytes; the label stays HTML; touch gets the press response; keyboard focus drives the same states; no line under labels; no magnetic pull.
