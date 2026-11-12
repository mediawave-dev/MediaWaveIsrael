# The checks used on the statement site (sun)

Scripts from the sessions of 12.11.2026 (D237 to D252). Each takes the site's base URL; images go to a `qa/` folder under the folder you run it from, so create one first.

- `behave.mjs <base>`: phone and desktop behaviour, accessibility panel, menu, form, axe on three routes, targets under 44 px, sideways scroll.
- `check242.mjs` (built site on :5189): the wheel's cards, headings, the form on three routes, short screens, largest text.
- `tap.mjs` (built site on :5189): the wheel under a finger (tap holds, drag turns, the page scrolls over it).
- `corner.mjs <base> [width]`, `corner2.mjs <base>`: the pinned corner at scroll positions, the menu, the contact circle; narrow phones.
- `qa.mjs <url> <name> [width] [sliceHeight]`: full-page slices.
- `fallback.mjs` (dev server on :5188): the measured width of each web face against Arial, for the fallback `size-adjust`.

Servers: launch configs `sun` (dev, :5188) and `sun-dist` (`vite preview`, :5189) in the main checkout's `.claude/launch.json`. `/api/event` answers 404 on both, which is expected.

## Safari's engine (added 13.11.2026)

`webkit-check.mjs <base> [route ...]` runs the site in WebKit through Playwright at two iPhone sizes: errors, sideways scroll, fonts, the pinned corner's fold, the menu, the contact circle, the form, the wheel's drift. Playwright and its WebKit build are not in this repo's dependencies. Install them once in a folder of their own and run the script from there:

```
mkdir C:\tmp\night\webkit && cd C:\tmp\night\webkit && npm init -y && npm install playwright@1 && npx playwright install webkit
```

In Git Bash a route argument that starts with a slash is rewritten to a Windows path; run it from PowerShell, or give no routes and take the default four.
