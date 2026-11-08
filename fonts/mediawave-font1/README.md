# mediawave-font1

MediaWave's own wide display face: Hebrew, Latin, digits and punctuation, in Thin (100), Regular (400) and Bold (700). 119 glyphs per weight, about 6 KB as WOFF2. Drawn from scratch as outlines in code. Its look is a genre, not a copy: no outlines were taken from any commercial font.

## Files

| Path | What it is |
|---|---|
| `dist/*.otf` | Installable fonts for Windows, Mac, Figma |
| `dist/*.woff2` | Web fonts; `build.py` also copies them to `public/fonts/` |
| `source/letters.py` | Hebrew, digits, basic punctuation |
| `source/latin.py` | A-Z and a-z |
| `source/marks.py` | Other punctuation, the sheqel sign |
| `source/kern.py` | Pair kerning, both directions |
| `source/kit.py` | The outline construction helpers |
| `specimen.html`, `proof.html` | Review pages; `proof.html` shows every letter large |

## Build

```bash
python fonts/mediawave-font1/build.py
```

Needs `fonttools`, `skia-pathops` and `brotli`. To check the Hebrew anatomy and start a new font from this one, use the global `hebrew-font-studio` skill.

## Use

For headings and large text. No hinting, so it is not meant for body text at small sizes. Thin needs a calm background and at least about 40 px.
