# The checks used on the statement site (sun)

Scripts from the sessions of 12.11.2026 (D237 to D252). Each takes the site's base URL; images go to a `qa/` folder under the folder you run it from, so create one first.

- `behave.mjs <base>`: phone and desktop behaviour, accessibility panel, menu, form, axe on three routes, targets under 44 px, sideways scroll.
- `check242.mjs` (built site on :5189): the wheel's cards, headings, the form on three routes, short screens, largest text.
- `tap.mjs` (built site on :5189): the wheel under a finger (tap holds, drag turns, the page scrolls over it).
- `corner.mjs <base> [width]`, `corner2.mjs <base>`: the pinned corner at scroll positions, the menu, the contact circle; narrow phones.
- `qa.mjs <url> <name> [width] [sliceHeight]`: full-page slices.
- `fallback.mjs` (dev server on :5188): the measured width of each web face against Arial, for the fallback `size-adjust`.

Servers: launch configs `sun` (dev, :5188) and `sun-dist` (`vite preview`, :5189) in the main checkout's `.claude/launch.json`. `/api/event` answers 404 on both, which is expected.
