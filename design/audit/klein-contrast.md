# Contrast: the Klein palette (DECISIONS #58)

WCAG 2.2 contrast ratios, computed from the tokens in src/look/looks.css (relative luminance, sRGB). Text needs 4.5:1, UI parts and graphics 3:1; decorative surfaces have no requirement.

| Surface | Pair | Foreground | Background | Ratio | Needs | Result |
|---|---|---|---|---|---|---|
| stage | ink (text) | `#FFFFFF` | `#00113D` | 18.3:1 | 4.5:1 | pass |
| stage | ink-2 (secondary text) | `#A3AFD6` | `#00113D` | 8.4:1 | 4.5:1 | pass |
| stage | error text dot / error ring | `#FF6961` | `#00113D` | 6.5:1 | 3.0:1 | pass |
| stage | button label on button | `#002FA7` | `#FFFFFF` | 10.7:1 | 4.5:1 | pass |
| stage | button label on the lens disc (hover / press) | `#002FA7` | `#D5DEFF` | 8.0:1 | 4.5:1 | pass |
| stage | button against the ground | `#FFFFFF` | `#00113D` | 18.3:1 | 3.0:1 | pass |
| stage | focus ring against the ground | `#FFFFFF` | `#00113D` | 18.3:1 | 3.0:1 | pass |
| stage | logo upper half / Media | `#FFFFFF` | `#00113D` | 18.3:1 | 3.0:1 | pass |
| stage | logo lower half / Wave | `#6E8CFF` | `#00113D` | 6.0:1 | 3.0:1 | pass |
| stage | logo tagline | `#8E9CC8` | `#00113D` | 6.7:1 | 3.0:1 | pass |
| stage | form field text on the field | `#FFFFFF` | `#1f2e54` | 13.3:1 | 4.5:1 | pass |
| stage | form field against the ground | `#1f2e54` | `#00113D` | 1.4:1 | - | pass |
| void | ink (text) | `#0E1016` | `#FAFAF7` | 18.2:1 | 4.5:1 | pass |
| void | ink-2 (secondary text) | `#4E5468` | `#FAFAF7` | 7.2:1 | 4.5:1 | pass |
| void | error text dot / error ring | `#B3261E` | `#FAFAF7` | 6.3:1 | 3.0:1 | pass |
| void | button label on button | `#FFFFFF` | `#002FA7` | 10.7:1 | 4.5:1 | pass |
| void | button label on the lens disc (hover / press) | `#FFFFFF` | `#2457E6` | 5.9:1 | 4.5:1 | pass |
| void | button against the ground | `#002FA7` | `#FAFAF7` | 10.2:1 | 3.0:1 | pass |
| void | focus ring against the ground | `#002FA7` | `#FAFAF7` | 10.2:1 | 3.0:1 | pass |
| void | logo upper half / Media | `#0E1016` | `#FAFAF7` | 18.2:1 | 3.0:1 | pass |
| void | logo lower half / Wave | `#002FA7` | `#FAFAF7` | 10.2:1 | 3.0:1 | pass |
| void | logo tagline | `#4E5468` | `#FAFAF7` | 7.2:1 | 3.0:1 | pass |
| void | floating object body against the ground | `#002FA7` | `#FAFAF7` | 10.2:1 | 3.0:1 | pass |
| void | form field text on the field | `#0E1016` | `#dededc` | 14.1:1 | 4.5:1 | pass |
| inner pages | links / accents on paper | `#002FA7` | `#FAFAF7` | 10.2:1 | 4.5:1 | pass |
| inner pages | body text on paper | `#2A2D38` | `#FAFAF7` | 13.1:1 | 4.5:1 | pass |
| inner pages | muted text on the darker paper | `#4E5468` | `#F0F0EB` | 6.6:1 | 4.5:1 | pass |
| inner pages | white on accent fill | `#FFFFFF` | `#002FA7` | 10.7:1 | 4.5:1 | pass |
| inner pages | white on accent fill (hover) | `#FFFFFF` | `#00248A` | 13.0:1 | 4.5:1 | pass |

Fails: 0. Fields: the field fill is the ground mixed 12 % toward the ink (`#1f2e54` on the stage, `#dededc` in the void); each field also has a 1 px line and a visible label, so the fill is not what identifies it.
