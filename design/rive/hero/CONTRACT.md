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
- The build starts when the screen is at least 40 % in view; the canvas stops drawing off screen. If Rive has not loaded within 4 s, the finished frame and the film show and the build never starts late.
