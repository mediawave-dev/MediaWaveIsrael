import os
os.chdir(r'G:/Web-Dev/MediaWaveIsrael')

def lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

def lum(h):
    h = h.lstrip('#')
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)

def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)

def mix(a, b, t):
    a = a.lstrip('#'); b = b.lstrip('#')
    ca = [int(a[i:i + 2], 16) for i in (0, 2, 4)]; cb = [int(b[i:i + 2], 16) for i in (0, 2, 4)]
    return '#' + ''.join(f'{round(x * (1 - t) + y * t):02x}' for x, y in zip(ca, cb))

STAGE, VOID = '#00113D', '#FAFAF7'
field_stage = mix(STAGE, '#FFFFFF', 0.12)
field_void = mix(VOID, '#0E1016', 0.12)
rows = [
 # (where, fg, bg, kind) kind: text (4.5), large (3), ui (3), deco
 ('stage', 'ink (text)', '#FFFFFF', STAGE, 'text'),
 ('stage', 'ink-2 (secondary text)', '#A3AFD6', STAGE, 'text'),
 ('stage', 'error text dot / error ring', '#FF6961', STAGE, 'ui'),
 ('stage', 'button label on button', '#002FA7', '#FFFFFF', 'text'),
 ('stage', 'button label on the lens disc (hover / press)', '#002FA7', '#D5DEFF', 'text'),
 ('stage', 'button against the ground', '#FFFFFF', STAGE, 'ui'),
 ('stage', 'focus ring against the ground', '#FFFFFF', STAGE, 'ui'),
 ('stage', 'logo upper half / Media', '#FFFFFF', STAGE, 'ui'),
 ('stage', 'logo lower half / Wave', '#6E8CFF', STAGE, 'ui'),
 ('stage', 'logo tagline', '#8E9CC8', STAGE, 'ui'),
 ('stage', 'form field text on the field', '#FFFFFF', field_stage, 'text'),
 ('stage', 'form field against the ground', field_stage, STAGE, 'deco'),
 ('void', 'ink (text)', '#0E1016', VOID, 'text'),
 ('void', 'ink-2 (secondary text)', '#4E5468', VOID, 'text'),
 ('void', 'error text dot / error ring', '#B3261E', VOID, 'ui'),
 ('void', 'button label on button', '#FFFFFF', '#002FA7', 'text'),
 ('void', 'button label on the lens disc (hover / press)', '#FFFFFF', '#2457E6', 'text'),
 ('void', 'button against the ground', '#002FA7', VOID, 'ui'),
 ('void', 'focus ring against the ground', '#002FA7', VOID, 'ui'),
 ('void', 'logo upper half / Media', '#0E1016', VOID, 'ui'),
 ('void', 'logo lower half / Wave', '#002FA7', VOID, 'ui'),
 ('void', 'logo tagline', '#4E5468', VOID, 'ui'),
 ('void', 'floating object body against the ground', '#002FA7', VOID, 'ui'),
 ('void', 'form field text on the field', '#0E1016', field_void, 'text'),
 ('inner pages', 'links / accents on paper', '#002FA7', '#FAFAF7', 'text'),
 ('inner pages', 'body text on paper', '#2A2D38', '#FAFAF7', 'text'),
 ('inner pages', 'muted text on the darker paper', '#4E5468', '#F0F0EB', 'text'),
 ('inner pages', 'white on accent fill', '#FFFFFF', '#002FA7', 'text'),
 ('inner pages', 'white on accent fill (hover)', '#FFFFFF', '#00248A', 'text'),
]
need = {'text': 4.5, 'ui': 3.0, 'deco': 0}
out = ['# Contrast: the Klein palette (DECISIONS #58)', '',
       'WCAG 2.2 contrast ratios, computed from the tokens in src/look/looks.css (relative luminance, sRGB). Text needs 4.5:1, UI parts and graphics 3:1; decorative surfaces have no requirement.', '',
       '| Surface | Pair | Foreground | Background | Ratio | Needs | Result |', '|---|---|---|---|---|---|---|']
fails = 0
for where, name, fg, bg, kind in rows:
    r = ratio(fg, bg)
    ok = r >= need[kind]
    fails += not ok
    out.append(f'| {where} | {name} | `{fg}` | `{bg}` | {r:.1f}:1 | {need[kind] or "-"}{":1" if need[kind] else ""} | {"pass" if ok else "FAIL"} |')
out += ['', f'Fails: {fails}. Fields: the field fill is the ground mixed 12 % toward the ink (`{field_stage}` on the stage, `{field_void}` in the void); each field also has a 1 px line and a visible label, so the fill is not what identifies it.', '']
open('design/audit/klein-contrast.md', 'w', encoding='utf-8').write('\n'.join(out))
print('\n'.join(out[6:]))
print('fails', fails)
