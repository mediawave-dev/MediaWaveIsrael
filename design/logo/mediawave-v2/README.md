# MediaWave logo, second drawing (D265, 13.11.2026)

The Horizon logo (the disc, the name MediaWave, the drop on the i, the line "Web Development") redrawn in the style of
the MW logo Nati picked that day (`../mw-initials/picked/source.svg`): heavy capitals leaning forward, one soft diagonal
light across each half of the name.

## What is what
- **M and W**: his, point for point, from the picked file. Never redraw them.
- **edia, ave**: Urbanist Black Italic (Google Fonts, SIL Open Font License 1.1), scaled to the same cap height (150 units),
  leaned to the same angle (36 across 150 up, 13.5 degrees), with a 2.6 unit outline in the same paint so the lowercase
  carries the weight of the capitals. Seven faces were tried beside his M and W (`specimen.mjs`); Urbanist keeps the
  skeleton of the letters of the first logo (the round one-storey a).
- **The drop**: the drop of the first logo, in place of the dot of the i, leaned with the letters.
- **The disc**: unchanged.
- **The tagline**: WEB DEVELOPMENT in mediawave-font1 Bold, outlined (`tag.json`), with a rule on each side.

## Files
- `svg/mediawave-compact-*.svg` (disc and name) and `svg/mediawave-horizontal-*.svg` (with the tagline), each in
  light, dark, black and white. They pass the svg-logo-designer check (title, description, prefixed ids).
- `logo2.mjs` builds the drawing; `node logo2.mjs <path>/src/sun/brand-art.ts` writes the path data of the site.
  It needs `fonts/Urbanist-900i.ttf` beside it (not kept in the repo): fetch it with the svg-logo-designer skill,
  `node <skill>/scripts/fetch-font.mjs "Urbanist" 900 --italic --out-dir ./fonts`. It reads the opentype cache of that skill.
- `word.mjs` sets the name; `board.mjs` renders the boards sent to Nati and writes `svg/`; `shots.mjs` photographs the
  logo on a running site (top, folded corner, footer at 320, 390 and 1440).
- `logo-board-a.jpg`, `logo-board-b.jpg`: what Nati was sent.

## On the site
`src/sun/Brand.tsx` draws it inline from `src/sun/brand-art.ts`. Colours come from `--logo-a0` to `--logo-a` (Media),
`--logo-b0` to `--logo-b` (Wave) and `--logo-tag` in `src/sun/sun.css`. The pinned corner shows the whole logo at the
top of a page and folds to the disc alone on scroll.

## Not done yet
- The kit in `logos/horizon` is still the first drawing, and its README still forbids gradients.
- Favicons and app icons are the disc and did not change. The share image was not regenerated.
- No proximity check against existing marks.
