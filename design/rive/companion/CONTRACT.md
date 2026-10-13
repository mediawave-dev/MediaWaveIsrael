# Rive contract: contact companion

The agreement between `src/look/parts/companion.riv` and `src/look/parts/Companion.tsx`. Names are exact and case-sensitive, ASCII only. `rive-probe.mjs --contract` reads the json block below and reports every difference.

## Files

- Source: `design/rive/companion/build-scene.mjs` generates `cli/scene.rml` (the Rive CLI project) and the CSS rest pose `src/look/parts/companion-rest.svg` from one set of numbers. Never edit `scene.rml` by hand.
- Build: `npm run rive:companion` (generator, then `rive design/rive/companion/cli --once`, unsigned, no Luau, then copy to `src/look/parts/companion.riv`).
- Runtime file: `src/look/parts/companion.riv` (about 7 KB), imported with `?url` so Vite fingerprints it.
- Assets: none (vector only, no text, no fonts, no images).
- Runtime: `@rive-app/canvas-lite` 2.43.1 (Canvas2D, the small wasm: the file has no text, layout or scripts), wasm self-hosted (imported from the package with `?url`, fingerprinted by Vite), pinned in its own `rive` chunk.

## Structure (machine-readable, the probe checks this)

```json
{
  "file": "companion.riv",
  "maxKB": 60,
  "artboards": [
    { "name": "Companion", "stateMachines": ["Main"], "viewModel": "Companion" }
  ],
  "viewModels": [
    {
      "name": "Companion",
      "properties": [
        { "name": "status", "type": "enum", "enum": "Status", "direction": "app-to-rive", "default": "idle" },
        { "name": "progress", "type": "number", "direction": "app-to-rive", "default": 0, "range": [0, 100] },
        { "name": "keystroke", "type": "trigger", "direction": "app-to-rive" },
        { "name": "prefersReducedMotion", "type": "boolean", "direction": "app-to-rive", "default": false }
      ]
    }
  ],
  "enums": [
    { "name": "Status", "values": ["idle", "typing", "loading", "sent", "error"] }
  ],
  "events": [],
  "shots": [
    { "name": "rest", "set": {}, "advanceMs": 50 },
    { "name": "typing-30", "set": { "status": "typing", "progress": 30 }, "advanceMs": 400 },
    { "name": "typing-80", "set": { "status": "typing", "progress": 80 }, "advanceMs": 400 },
    { "name": "loading", "set": { "status": "loading", "progress": 80 }, "advanceMs": 900 },
    { "name": "sent", "set": { "status": "sent", "progress": 80 }, "advanceMs": 1700 },
    { "name": "error", "set": { "status": "error", "progress": 80 }, "advanceMs": 900 },
    { "name": "reduced-loading", "set": { "prefersReducedMotion": true, "status": "loading", "progress": 80 }, "advanceMs": 900 }
  ]
}
```

## Properties: meaning and owner

| Property | Type | Direction | Range or values | Set by | Used by | Notes |
|---|---|---|---|---|---|---|
| status | enum | app to Rive | idle, typing, loading, sent, error | the contact form (`Contact.tsx`) | Status layer, Slosh layer, Caret layer | typing = a field has focus; loading = the request is out |
| progress | number | app to Rive | 0-100 | characters typed across the three fields, 180 characters fill the page | the four lines (25 each) and the caret | the lines write from the right (RTL by design, the page is Hebrew only) |
| keystroke | trigger | app to Rive | | every input event in the form | Caret layer | the caret stays solid while typing |
| prefersReducedMotion | boolean | app to Rive | | the engine's CALM flag (OS reduced motion), at load | Slosh and Caret layers | no loops: no slosh, no blink; state changes still play (they answer the visitor) |

## States

| State | Reached when | Rest pose | Exits to | If interrupted |
|---|---|---|---|---|
| idle | default; the form has no focus | the laptop, the page at half brightness (header, caret at the first line) | any | blends 600 ms |
| typing | a field has focus | the page at full brightness, the lines as written, caret solid then 4 blinks after 0.5 s, then solid | any | blends 220 ms |
| loading | the request is out | the lines folded into the horizon inside the drawn disc; the horizon sloshes 3 degrees each way | sent, error | any frame |
| sent | the request returned | the exact Horizon mark on the screen (the level rose and filled the disc) | idle (after 4.2 s the form resets) | the mark drains as the screen dims |
| error | the request failed | the lines back (nothing lost), a red dot replaces the header mark | typing on the next keystroke | any frame |

## Signals (Rive to app)

None. The file only reacts.

## Motion spec

| Beat | Frames at 60 fps | Easing (cubic-bezier) | What moves | Amplitude |
|---|---|---|---|---|
| wake (idle to typing) | 220 ms blend | 0.4, 0, 0.2, 1 | page brightness | 0.5 to 1 |
| write | per keystroke | none (follows the text) | trim end of the active line, the caret | one word per few characters |
| fold (send) | 0-24 | 0.45, 0, 0.2, 1 | the lines collapse to the centre line | scale 1 to 0.42 x 0 |
| horizon draws | 10-32 | 0.16, 1, 0.3, 1 | the horizon, from the centre outward | full width |
| disc draws | 14-40 | 0.45, 0, 0.2, 1 | the outline | full circle |
| slosh (loading loop) | 72 each way, ping-pong | 0.45, 0, 0.55, 1 | the mark's rotation | 0.055 rad (3 degrees) |
| fill (sent) | 0-60 | 0.33, 0, 0.12, 1 | the level rises through the disc | 112 units |
| settle (sent) | 700 ms blend | 0.4, 0, 0.2, 1 | the slosh returns to level | to 0 |
| unfold (error) | 0-30 | 0.16, 1, 0.3, 1 | the lines return, the horizon retracts | back to the page |

No overshoot and no elastic anywhere (the site's rule). The only loops are the slosh (while waiting for the network) and the blink (4 cycles, then still).

## Accessibility and reduced motion

- Decorative: the canvas and the rest pose are `aria-hidden`; the form's `role="status"` and `role="alert"` messages carry the meaning.
- Keyboard: focus and typing in any field drive the same states as the pointer; the DOM focus ring stays on the fields.
- Reduced motion: REDUCE (the a11y widget's stop switch, `?reduce=1`, prerender) never loads Rive; the CSS rest pose stays. CALM (the OS flag) loads it with `prefersReducedMotion = true`: state changes play, the slosh and the blink do not.
- Long motion: the blink stops after 4 cycles (4.3 s); the slosh runs only while a request is out.

## Change log

| Date | Change | By |
|---|---|---|
| 2026-10-13 | initial contract | Claude (Nati chose a Rive character at STOP 1) |
