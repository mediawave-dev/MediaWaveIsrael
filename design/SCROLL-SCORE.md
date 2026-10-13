# SCROLL SCORE · mediawave · v1 (three looks) · 2026-10-13

> One score per look. vp = one viewport of scrolling at 1440×900. Rows marked **step 3** are planned and get built after STOP 1 for the chosen look; the H2 order is fixed (hero, WhyUs, services, before/after, process, FAQ, contact). Rules: references/scroll-score.md. Holds are sticky stages under the header (stage top = --head), read by ScrollTrigger, never pins.

## KM · launch night (the proposed combination)

| vp | act | beat: the sentence the visitor takes away | theme | hold (vp) | move | what the visitor does | reduced last frame | mobile |
|---|---|---|---|---|---|---|---|---|
| 0–1.5 | I | "your business, launched" | stage | – | hero stage + laptop lean (scrubbed rotateX 12°→0) · video plays on the laptop | reads the H1, sees the product playing | laptop upright, poster frame, video off | keep: laptop below the button, light video encode after load+idle |
| 1.5–2.7 | I | "why us" (WhyUs) | stage | – | **step 3:** spec sheet, three specs on calm white tiles with their Lotties, masked line rise (E-01) | reads three reasons | all three visible | stack |
| 2.7–8 | II | "the lights come up: fly into each tool" (services) | **void** (T-01 flip 1) | **5.0** | flight / zoom-through (H-09, D-03) | scrolls through six tools; each face plays its Lottie | grid of six tools with captions | captions on top, art box below, 92 px kept clear for the floating buttons |
| 8–9.2 | II | "see the difference" (before/after) | **stage** (flip 2) | – | **step 3:** clip reveal of the slider (E-02), then the slider itself | drags the handle | slider at 50 % | keep, full width |
| 9.2–13 | III | "how it gets built, one step at a time" (process) | stage | **3.6** | launch hold: lid opens, laptop turns per step (D-01) | scrolls through four steps | a list of four steps with their Lotties | laptop above the text, never beside it |
| 13–15 | III | "questions, answered plainly" (FAQ) | **void** (flip 3) | – | **step 3:** calm; the accordion only (rest beat) | opens a question | all visible | keep |
| 15–16.5 | IV | "let's start" (giant word + contact) | **stage** (flip 4) | – | **step 3:** word ink-fill (E-04), Rive companion on the form (REDESIGN-PROMPT §8.6) | writes a message | form, companion at rest | companion above the form |
| 16.5–17 | IV | footer | stage | – | none (rest) | – | – | stacked columns, 96 px kept for the floating buttons |

Totals: about 17 vp desktop, 19 vp phone. Held share about 51 % of the scroll range (5.0 + 3.6 of 17), above the orchestrated band on purpose: the brief asks for bold, with two holds that never touch (before/after sits between them, 1.2 vp of free scroll). Peaks: hero at 0, flight at 2.7–8 (main, ~30–45 %), launch at 9.2–13; the closing delight is the Rive companion. Theme map: stage 0 → void 2.7 → stage 8 → void 13 → stage 15. Never the same move in neighbouring sections: lean, spec rise, flight, clip reveal, launch, accordion, ink-fill.

## K · the launch (all on the stage)

| vp | beat | hold (vp) | move | reduced last frame | mobile |
|---|---|---|---|---|---|
| 0–1.5 | hero: "your business, launched" | – | hero stage + laptop lean · video on the laptop | upright laptop, poster | laptop below the button, light video |
| 1.5–2.7 | WhyUs | – | **step 3:** spec sheet, masked line rise (E-01) | all visible | stack |
| 2.7–8.1 | services: "six small announcements" | **5.4** | launch hold (D-01): the lid opens, the laptop turns per service, the screen plays its Lottie | list of six with their art | laptop above the announcement |
| 8.1–9.3 | before/after | – | **step 3:** clip reveal (E-02) | slider at 50 % | keep |
| 9.3–11 | process | – | **step 3:** rolling step counter (H-07) with a path draw (H-12), not a second hold | four steps listed | vertical |
| 11–13 | FAQ | – | **step 3:** calm | all visible | keep |
| 13–14.5 | contact | – | **step 3:** ink-fill word, Rive companion | form at rest | companion above the form |

One hold (5.4 of about 14.5 vp, 37 %). Peaks: hero, launch (main), companion.

## M · floating objects (all in the void)

| vp | beat | hold (vp) | move | reduced last frame | mobile |
|---|---|---|---|---|---|
| 0–1 | hero: "these are the tools" | – | the video on a floating screen among six tools; they bob (CSS `translate`, paused off screen and under the OS flag) and drift by depth as the hero scrolls away (GSAP `transform`) | still objects, poster | copy first, 4 small tools around the screen below it |
| 1–2.2 | WhyUs | – | **step 3:** three objects settle into a row (scale from depth) | all visible | stack |
| 2.2–7.2 | services: "fly into each tool" | **5.0** | flight / zoom-through (H-09, D-03) | grid of tools with captions | captions on top, art box below, bottom kept clear |
| 7.2–8.4 | before/after | – | **step 3:** clip reveal (E-02) | slider at 50 % | keep |
| 8.4–10 | process | – | **step 3:** a path draw (H-12) between four small objects | listed | vertical |
| 10–12 | FAQ | – | **step 3:** calm | all visible | keep |
| 12–13.5 | contact | – | **step 3:** ink-fill word, Rive companion | form at rest | companion above |

One hold (5.0 of about 13.5 vp, 37 %).

## Signature moments
1. Hero (all looks) · the real hero video playing on the product (K, KM) or on a floating screen (M) · "your business, launched".
2. Launch hold (K services, KM process) · D-01 · "six small announcements" / "four steps".
3. Flight hold (M, KM services) · H-09 · "fly into each tool".

## Handoffs
| Seam | How A's exit meets B's entry |
|---|---|
| hero → WhyUs | K/KM: the laptop has leaned upright and leaves at the top; M: the objects have drifted down and the void continues |
| services intro → hold | the H2 and its line scroll up, the stage locks under the header with the first object already on its way (M) or the lid closed (K) |
| flight → before/after (KM) | the last tool rests in front; as the stage leaves, the section crosses mid-screen and the stage layer fades in (T-01, opacity only, 0.35 s) |
| before/after → launch (KM) | same ground (stage); the launch's laptop arrives closed |

## Engine notes
- Smooth scroll: Lenis lerp 0.1 on desktop through the engine; touch native; CALM (OS flag) drops Lenis and small travel only.
- Holds: sticky stages under --head, `data-hold` + `holdTimeline({ id })` so `?at=services:0.5` and the overlap audit land on the same positions.
- Per frame: transform + opacity written on the moving elements only (lid, laptop, each flying object). will-change only while the flight's stage is live.
- Only the Lottie on stage plays (`LottieIcon active`). The hero video plays only in view (engine.playInView).
- Media: hero-bg.mp4 2.9 MB on desktop, hero-bg-m.mp4 189 KB on phones (DECISIONS #51); posters 66 KB / 17 KB.
- Zones: data-zone="text|art|ui" on every scene element; scripts/overlap-audit.mjs must report 0.
