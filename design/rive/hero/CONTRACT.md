# Rive contract: hero build

The agreement between `src/look/parts/hero.riv` and `src/look/parts/HeroBuild.tsx` (DECISIONS #60).

## Files

- Source: `design/rive/hero/build-hero.mjs` generates `cli/scene.rml`, the finished frame `src/look/parts/hero-built.svg` and the slot geometry `src/look/parts/hero-slot.json` from one set of numbers. Never edit `scene.rml` by hand.
- Build: `npm run rive:hero` (generator, `rive --once` unsigned, no Luau, copy to `src/look/parts/hero.riv`, about 10 KB).
- Runtime: `@rive-app/canvas-lite` 2.43.1, shared with the contact companion (one chunk, one wasm).

## Structure (machine-readable)

```json
{
  "file": "hero.riv",
  "maxKB": 60,
  "artboards": [
    { "name": "Hero", "stateMachines": ["Main"], "viewModel": "Hero" }
  ],
  "viewModels": [
    {
      "name": "Hero",
      "properties": [
        { "name": "prefersReducedMotion", "type": "boolean", "direction": "app-to-rive", "default": false }
      ]
    }
  ],
  "enums": [],
  "events": ["reveal"],
  "shots": [
    { "name": "start", "set": {}, "advanceMs": 300 },
    { "name": "wireframe", "set": {}, "advanceMs": 1200 },
    { "name": "painted", "set": {}, "advanceMs": 2200 },
    { "name": "end", "set": {}, "advanceMs": 5000 },
    { "name": "reduced", "set": { "prefersReducedMotion": true }, "advanceMs": 300 }
  ]
}
```

## Behaviour

| Moment | Frames (60 fps) | What happens |
|---|---|---|
| window | 0-26 | the browser window rises into place |
| wireframe | 22-66 | the page's blocks arrive from the right (a Hebrew page), outlines on dark |
| paint | 84-118 | paper, ink, Klein blue, the Horizon mark |
| click | 128-198 | the cursor comes in and presses the site's button |
| reveal | 190 | the `reveal` event: the page fades the film into the slot (DOM video over `hero-slot.json`) |
| message | 214-238 | a toast arrives at the page's top corner |
| rest | 264 | the finished frame, identical to `hero-built.svg` |

- `prefersReducedMotion = true` goes straight to the rest pose. The page itself never starts the build under reduced motion, under `?reduce=1`, on a repeat visit in the same session (`sessionStorage mw-hero-build`), or in the prerender: index.html decides before the first paint (`html.hero-build`).
- Decorative: the canvas and the finished frame are `aria-hidden`; the H1, line and buttons above the screen carry the meaning. No text inside the canvas (bars only).
- The build starts when the screen is at least 60 % in view (desktop: at the first scroll; phones: at once); the canvas stops drawing off screen. If Rive has not loaded within 4 s, the finished frame and the film show and the build never starts late.

## Shot palette and scrub mode (2026-10-15, SPEC S4 and section 3)

- Build: `node design/rive/hero/build-hero.mjs --riv --palette shot` writes `src/look/parts/hero-shot.riv` (about 10 KB) and `src/look/parts/hero-built-shot.svg` from the same numbers (same `hero-slot.json`), through its own CLI project `design/rive/hero/cli-shot/`, so KM's `cli/scene.rml`, `hero.riv` and `hero-built.svg` are never touched (a plain run still reproduces them byte for byte).
- Palette (D81, D86): the screen is transparent (the laptop's paper screen and its opening mark show until the window rises), chrome ink, the page from the table #ECEEF1 to paper, wireframe ink at 20% outlined in ink-2, painted blocks ink, secondary bars ink at 35%, hairlines ink at 14%, the button and the toast's bubble ink, the film slot and the card icons table grey (the poster still sits on the slot), the cursor ink with a paper edge, the mark #1B1D21 / #00248A.
- Option A shipped: the runtime scrubs the existing named linear timeline `Build` (264 frames at 60 fps) with `rive.scrub('Build', p * 264 / 60)`, instantiated with `animations: 'Build'`, `autoplay: false` (no state machine, no view model needed in scrub mode). Each scrub draws one frame; nothing runs a render loop. The `reveal` event and the `Main` machine stay as they are for K and KM.
- HeroBuild `mode="scrub"` (shot): progress comes from the page (`setProgress`), the still of the lens film shows in the slot from frame 189 (the click), the Rive file loads after load + idle within 150% of the viewport, claims the one Rive slot while in view. Until Rive is live (or if it fails) the page shows its opening frame below p 0.92 and the finished frame plus the still from there.
