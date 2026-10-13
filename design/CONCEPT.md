# CONCEPT · three looks from one codebase · 2026-10-13

> Gate 1 (Nati, 2026-10-13): two board worlds, **K** (the keynote launch, direction-bank D-01) and **M** (flight through floating objects, D-03). Built as three switchable looks: K alone, M alone and **KM** (the two combined), so the whole site can be judged in each. Mechanism: DECISIONS #50. The contract below is what tokens, the score and copy answer to.

## The idea

MediaWave makes ordinary things for small businesses (a site, a landing page, a video) and treats each one as a product launch.

- **K · the launch:** "Introducing: your website." The site is presented like a flagship product on a keynote stage.
- **M · floating objects:** the tools of the trade (a laptop, a phone, a loupe, a chat bubble, a cassette, a photo frame) hang in a quiet void, and the camera flies into each one; inside each is a service.
- **KM · launch night:** the evening alternates between the dark stage (the announcement) and the lit void (the product up close).

Lane: artifact (the real tools and the real hero video), with a borrowed tradition for K (the product keynote).
Transformation, first viewport to last: a black stage with one lit product, then (KM) the lights come up on the tools, then back on stage to show how it gets built.
Boldness budget: the two held scenes. Everything around them stays calm.

## Visual system

| Token | K | M | KM | Reason |
|---|---|---|---|---|
| --ground | #000000 | #E6E1F2 | stage #000 / void #E6E1F2 | K: near-black because it is a keynote stage (the reflex "near-black" is the concept, not a default: the product is the only lit thing). M: a flat lavender void, no gradient wallpaper, only shadows under the objects. |
| --ink | #F5F5F7 (19.2:1) | #221E2E (12.6:1) | follows the ground | |
| --ink-2 | #A1A1A6 (8.2:1) | #4D4760 (6.3:1) | follows the ground | secondary copy, nav |
| accent | none | none | none | the product is the colour: the laptop screen, the hero video, the 13 Lotties on white faces |
| objects | aluminium laptop | charcoal #2B2833 bodies, white faces | both | the Lotties keep their mixed colours on calm white surfaces (REDESIGN-PROMPT §2) |
| Display | Assistant 200 | Alef 700 | Assistant 200 | K: a keynote's thin type, large (slop-ok default-font-he-2: Assistant is a reflex face as a body voice; here it is the keynote's thin display). M: Alef, clean letters for objects in a void. |
| Text | Assistant 400 | Alef 400 | Alef 400 | |
| UI | Assistant 600 | Alef 700 | Alef 700 | |
| Grid | 12 columns, gutter 24, side clamp(16px, 4vw, 64px) | same | same | holds split the grid into a text zone and an art zone |
| Header | 64 / 56 px, black | 70 / 60 px, lavender | 64 / 56 px, follows the theme | stage tops sit under it |

Fonts are self-hosted (@fontsource, OFL), Hebrew and Latin subsets only, with metric-matched fallbacks measured by font-fallback.mjs ("no rewrap" at 340 and 680 px). Assistant 200 Hebrew is 4 KB and ships inside the CSS; Alef 700 Hebrew is preloaded in M.

## Buttons (one family per look)

- **K · the product button:** a white slab that tips toward the pointer like a product on a turntable (one transform) and presses in (`scale`). Touch: the press only.
- **M · the lens:** a small disc follows the pointer inside the button and inverts what it passes over (`mix-blend-mode: difference`, only on that disc); a press grows it until it fills the button.
- **KM · the lens with a light tilt** (±3°): one family across the page, calm.
- Seven states in each: idle, hover, pressed, focus, loading (K: three dots breathe; lens: the disc scans the label), sent (✓ + "נשלח. נחזור אליכם היום" [קופי: נתי]), error (a red ring and a short shake). No line inside or under any label.

## Motif and motion grammar

- K verbs: open, turn, announce. The lid opens on its hinge; the laptop turns a little per announcement; a thin headline names it.
- M verbs: hang, approach, pass through. Objects bob slowly at rest; in the flight they come from the distance, rest in front of you, then grow to their zone's edge while fading as you pass through.
- Scroll model: Lenis on desktop through the engine, native touch scroll, sticky stages read by ScrollTrigger (no pins), CALM policy for the OS reduced-motion flag, REDUCE for the widget's stop.
- Per frame: transform and opacity only, written directly on the moving elements.

## Signature moments

| # | Where | Sentence | What the visitor sees | Why only MediaWave | Cost class | Touch version |
|---|---|---|---|---|---|---|
| 1 | K, KM hero | "your business, launched" | the H1 on a stage, under it a laptop playing the real hero video; it leans toward you as you scroll | the video is theirs (the desk, the laptops, the coffee) | compositor | same, the laptop below the button, the light video encode |
| 1 | M hero | "these are the tools" | the hero video on a floating screen among six floating tools | the tools are the services | compositor | 4 small tools around the screen |
| 2 | K services · KM process | "six small announcements" | the lid opens, the laptop turns per announcement, its screen plays the item's Lottie | the Lotties are the client's own | compositor | the laptop above the text |
| 3 | M, KM services | "fly into each tool" | the camera flies through the void into each object; its face plays the service's Lottie | each object is a service's tool | compositor | captions on top, objects below, clear of the floating buttons |

## Reflex check

| Reflex | Present? | Reason or change |
|---|---|---|
| 3 · near-black + acid signal | near-black, no signal | the stage is the concept; there is no acid accent at all |
| 9 · centred hero | K yes | a stage has a centre; M puts the copy at the start side instead |
| 15 · Assistant as the brand voice | K, KM display | used thin (200) as keynote display, waived in fonts.css |
| 4 · purple gradients | no | lavender is a flat void, never a gradient |
| 10 · fade-up everywhere | no | the holds are scrubbed; routine reveals stay the engine's early, short ones |
| 11 · scroll kit | no | no preloader counter, no split headings, no marquee, no magnetic buttons |

## Amendments
- 2026-10-13 · the hero video plays on phones too (light encode, after load and idle, never with Data Saver) · Nati, DECISIONS #51
