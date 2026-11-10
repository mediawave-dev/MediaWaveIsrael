# Where words can stand on a cut: the part of the frame the pen, its shadow or the ink ever cover, over the whole film.
#   python design/film/ink/calm.py G:/tmp/ink/frames-p [min-map.png]
# Prints DARK for scripts/qa/ink-sign.mjs: 50 rows down the film, each the span of its width (in fractions) that
# gets dark at some moment, null where the row stays paper throughout. The hero's CSS (--calm, --edge in
# src/look/sea/sea-sign.css) is read off the same table. Needs Pillow and numpy. Render again, measure again.
import glob
import json
import sys

import numpy as np
from PIL import Image

frames = sorted(glob.glob(sys.argv[1] + '/f*.png'))
if not frames:
    raise SystemExit(f'No frames (f*.png) in {sys.argv[1]}')
low = None  # the darkest each part of the frame gets, on a fifth of the size
for path in frames[::3]:
    im = Image.open(path).convert('L')
    a = np.asarray(im.resize((im.width // 5, im.height // 5), Image.BOX), dtype=np.uint8)
    low = a if low is None else np.minimum(low, a)
if len(sys.argv) > 2:
    Image.fromarray(low).save(sys.argv[2])

PAPER = 200  # the sheet never falls under this by itself (its darkest corner is about 215)
dark = low <= PAPER
h, w = dark.shape
rows = []
for k in range(50):
    y0 = k * h // 50
    xs = np.where(dark[y0:max((k + 1) * h // 50, y0 + 1)].any(0))[0]
    rows.append(None if len(xs) == 0 else [round(float(xs.min()) / w, 3), round(float(xs.max() + 1) / w, 3)])
while rows and rows[-1] is None:
    rows.pop()
print(json.dumps(rows))
print(f'paper from {len(rows) * 2}% of the height down', file=sys.stderr)
