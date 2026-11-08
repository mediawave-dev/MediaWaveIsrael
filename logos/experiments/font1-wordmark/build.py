"""Experiment: the Horizon logo with its name and tagline set in mediawave-font1.

The disc, the colours, the drop on the i, the cap height, the gap to the disc and the tagline
rules are read from logos/horizon and kept. Only the letterforms change, so the name runs wider.
Numbered weight combinations go to options/. Not used by the site.

    python logos/experiments/font1-wordmark/build.py
"""
import json
import os
import re
import sys

import pathops  # noqa: F401
from fontTools.pens.svgPathPen import SVGPathPen

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..", "..", "..")
OPTIONS_DIR = os.path.join(HERE, "options")
sys.path.insert(0, os.path.join(ROOT, "fonts", "mediawave-font1"))
import build as font  # noqa: E402
from source import kern  # noqa: E402
from source.kit import rect  # noqa: E402
from source.latin import LATIN, X  # noqa: E402

CAP, TAG_CAP, TAG_Y = 70.3, 23.45, 40
RULE, GAP, RULE_Y = 16.27, 16, 28.22
OLD_WIDTH, DROP_X, DROP_BOTTOM = 537.9, 210.3, -56
DROP_SCALE = {"Thin": 0.62, "Regular": 0.82, "Bold": 1.0}
OLD_X_HEIGHT = json.load(open(os.path.join(ROOT, "logos", "_generator", "wordmark.json"), encoding="utf-8"))["wordmark"]["xHeight"]

# the weight of Media, the weight of Wave, capitals
OPTIONS = [("Thin", "Bold", False), ("Regular", "Bold", False), ("Thin", "Regular", False),
           ("Bold", "Thin", False), ("Bold", "Regular", False), ("Regular", "Thin", False),
           ("Thin", "Bold", True), ("Bold", "Thin", True), ("Bold", "Bold", False)]
FACES = {}


def face(name):
    if name not in FACES:
        st = next(s for s in font.STYLES if s.name == name)
        glyphs, _ = font.outlines(st)
        FACES[name] = (st, glyphs, kern.pairs(glyphs, [g[0] for g in LATIN], st.H, st.floor_latin, rtl=False))
    return FACES[name]


def svg(paths):
    pen = SVGPathPen(None, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
    for p in paths:
        p.draw(pen)
    return pen.getCommands()


def typeset(glyphs, table, text, k, y=0.0, x=0.0, tracking=0.0):
    out = []
    for i, ch in enumerate(text):
        name = "space" if ch == " " else ch
        path, adv = glyphs[name]
        out.append(path.transform(k, 0, 0, -k, x, y))
        x += adv * k + tracking
        if i + 1 < len(text):
            x += table.get((ch, text[i + 1]), 0) * k
    return out, x


def media_word(name, k):
    """Media with a bare stem where the i goes, so the logo's drop can sit on it."""
    st, glyphs, table = face(name)
    paths, x = typeset(glyphs, table, "Med", k)
    x += table.get(("d", "i"), 0) * k
    lsb = next(g[4] for g in LATIN if g[0] == "i") + st.track
    w = st.dot
    stem = rect(lsb + (w - st.V) / 2, 0, lsb + (w + st.V) / 2, X).transform(k, 0, 0, -k, x, 0)
    centre = x + (lsb + w / 2) * k
    x += glyphs["i"][1] * k
    rest, x = typeset(glyphs, table, "a", k, x=x)
    return paths + [stem] + rest, x, centre


def wordmark(media_face, wave_face, caps):
    st, glyphs, table = face(media_face)
    k = CAP / st.H
    if caps:
        media, x = typeset(glyphs, table, "MEDIA", k)
        centre = None
    else:
        media, x, centre = media_word(media_face, k)
    x += table.get(("A" if caps else "a", "W"), 0) * k
    _, wave_glyphs, wave_table = face(wave_face)
    wave, width = typeset(wave_glyphs, wave_table, "WAVE" if caps else "Wave", k, x=x)
    return svg(media), svg(wave), centre, X * k, width


def tagline(width):
    st, glyphs, table = face("Regular")
    k = TAG_CAP / st.H
    text = "WEB DEVELOPMENT"
    _, natural = typeset(glyphs, table, text, k)
    tracking = (width - 2 * (RULE + GAP) - natural) / (len(text) - 1)
    return svg(typeset(glyphs, table, text, k, y=TAG_Y, x=RULE + GAP, tracking=tracking)[0])


def compose(layout, theme, media_face, wave_face, caps, target):
    media, wave, centre, x_height, width = wordmark(media_face, wave_face, caps)
    src = open(os.path.join(ROOT, "logos", "horizon", f"mediawave-{layout}-{theme}.svg"), encoding="utf-8").read()
    group = re.search(r'<g transform="translate\(([\d.]+) 0\)">(.*?)</g>', src, re.S)
    x0 = float(group.group(1))
    parts = [f'<path class="a" d="{media}"/>']
    if centre is not None:
        drop = re.search(r'<path class="b" d="(M210\.3[^"]*)"', group.group(2)).group(1)
        dy, s = OLD_X_HEIGHT - x_height, DROP_SCALE[media_face]
        place = f"translate({centre:.2f} {dy + DROP_BOTTOM:.2f}) scale({s}) translate({-DROP_X} {-DROP_BOTTOM})"
        parts.append(f'<path class="b" transform="{place}" d="{drop}"/>')
    parts.append(f'<path class="b" d="{wave}"/>')
    if layout != "compact":
        parts += [f'<path class="t" d="{tagline(width)}"/>',
                  f'<path class="l" d="M0 {RULE_Y}H{RULE}M{width - RULE:.2f} {RULE_Y}H{width:.2f}"/>']
    out = src[:group.start(2)] + "".join(parts) + src[group.end(2):]
    minx, miny, w, h = re.search(r'viewBox="([^"]+)"', out).group(1).split()
    out = out.replace(f'viewBox="{minx} {miny} {w} {h}"', f'viewBox="{minx} {miny} {x0 + width:.1f} {h}"')
    if layout == "stacked":
        head, tail = out.index("<path"), out.index('<g transform="translate(')
        out = out[:head] + f'<g transform="translate({(width - OLD_WIDTH) / 2:.2f} 0)">' + out[head:tail] + "</g>" + out[tail:]
    with open(target, "w", encoding="utf-8") as f:
        f.write(out)


def main():
    os.makedirs(OPTIONS_DIR, exist_ok=True)
    for layout in ("horizontal", "compact", "stacked"):
        for theme in ("dark", "light"):
            compose(layout, theme, "Bold", "Bold", False, os.path.join(HERE, f"mediawave-{layout}-{theme}.svg"))
    for n, (media_face, wave_face, caps) in enumerate(OPTIONS, 1):
        for layout, theme in (("horizontal", "dark"), ("horizontal", "light"), ("compact", "dark")):
            compose(layout, theme, media_face, wave_face, caps, os.path.join(OPTIONS_DIR, f"option-{n}-{layout}-{theme}.svg"))
    print(f"{len(OPTIONS)} options written")


if __name__ == "__main__":
    main()
