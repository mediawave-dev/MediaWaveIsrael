"""Build mediawave-font1 (Thin, Regular, Bold) from the drawings in source/.

    python fonts/mediawave-font1/build.py

Writes installable OTF and web WOFF2 to dist/ and copies the WOFF2 to public/fonts/.
"""
import math
import os
import shutil
import sys

import pathops
from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.ttLib import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from source import kern  # noqa: E402
from source.latin import LATIN  # noqa: E402
from source.letters import GLYPHS  # noqa: E402
from source.marks import MARKS  # noqa: E402

DIST = os.path.join(HERE, "dist")
PUBLIC = os.path.join(HERE, "..", "..", "public", "fonts")
FAMILY = "mediawave-font1"
VERSION = "1.000"
ALL = GLYPHS + MARKS + LATIN
EMPTY = ("space", "uni00A0", "uni200E", "uni200F")


class Style:
    H, ASC, DESC = 600, 860, -240
    os, k = 9, 0.60
    head, heel, over, nose, lag, foot = 210, 90, 54, 34, 12, 110
    gap, yod = 0.70, 0.50

    def __init__(self, **kw):
        self.__dict__.update(kw)


STYLES = [
    Style(name="Thin", weight=100, V=20, T=20, B=20, D=21, Rl=196, Rm=166, Rs=110, Rc=12, Rarm=92,
          cut=0.70, dot=46, track=6, scale=0.985, air=20, floor=64, floor_latin=40),
    Style(name="Regular", weight=400, V=60, T=62, B=60, D=64, Rl=190, Rm=160, Rs=104, Rc=18, Rarm=90,
          cut=0.32, dot=84, track=0, scale=1.0, air=24, floor=72, floor_latin=44),
    Style(name="Bold", weight=700, V=104, T=104, B=104, D=110, Rl=196, Rm=166, Rs=124, Rc=20, Rarm=110,
          cut=0.28, dot=124, track=0, scale=1.03, air=22, floor=66, floor_latin=40, gap=0.66),
]


def outlines(st):
    glyphs, cmap = {}, {}
    for name, cp, W, fn, lsb, rsb in ALL:
        empty = name in EMPTY
        W = st.dot if W == 0 and not empty else round(W * st.scale)
        path = None if empty else fn(st, W)
        moved = pathops.Path()
        track = 0 if name in ("uni200E", "uni200F") else st.track
        if 0x05D0 <= cp <= 0x05EA:  # wide letters have big counters and need matching air between them
            track += st.air
        if path is not None:
            moved = pathops.simplify(path.transform(1, 0, 0, 1, lsb + track, 0), fix_winding=True, clockwise=False)
        glyphs[name] = (moved, int(round(lsb + W + rsb + 2 * track)))
        cmap[cp] = name

    nd = pathops.Path()
    for x0, y0, x1, y1, rev in [(60, 0, 440, st.H, False), (110, 50, 390, st.H - 50, True)]:
        pts = [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
        if rev:
            pts.reverse()
        nd.moveTo(*pts[0])
        for p in pts[1:]:
            nd.lineTo(*p)
        nd.close()
    glyphs[".notdef"] = (nd, 500)
    return glyphs, cmap


def name_table(st, ps):
    """Regular and Bold are one style-linked family; Thin is its own, grouped by the typographic names."""
    linked = st.name in ("Regular", "Bold")
    names = {
        "familyName": FAMILY if linked else f"{FAMILY} {st.name}",
        "styleName": st.name if linked else "Regular",
        "uniqueFontIdentifier": f"MediaWave:{ps}:{VERSION}", "fullName": f"{FAMILY} {st.name}", "psName": ps,
        "version": f"Version {VERSION}", "copyright": "(c) 2026 MediaWave Israel. All rights reserved.",
        "manufacturer": "MediaWave Israel", "designer": "MediaWave Israel",
    }
    if not linked:
        names.update(typographicFamily=FAMILY, typographicSubfamily=st.name)
    return names


def build(st):
    ps = f"{FAMILY}-{st.name}"
    glyphs, cmap = outlines(st)
    order = [".notdef"] + [g[0] for g in ALL]

    charstrings, metrics = {}, {}
    for name in order:
        path, adv = glyphs[name]
        pen = T2CharStringPen(adv, None)
        path.draw(pen)
        charstrings[name] = pen.getCharString()
        b = path.bounds
        metrics[name] = (adv, int(math.floor(b[0])) if b and b != (0, 0, 0, 0) else 0)

    bold = st.name == "Bold"
    fb = FontBuilder(1000, isTTF=False)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap(cmap)
    fb.setupCFF(ps, {"FullName": f"{FAMILY} {st.name}", "FamilyName": FAMILY, "Weight": st.name}, charstrings, {})
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=940, descent=-300)
    fb.setupNameTable(name_table(st, ps))
    fb.setupOS2(sTypoAscender=940, sTypoDescender=-300, sTypoLineGap=0, usWinAscent=980,
                usWinDescent=320, achVendID="MWAV", fsType=0, usWeightClass=st.weight,
                ulUnicodeRange1=(1 << 0) | (1 << 11) | (1 << 31), ulUnicodeRange2=1 << 1,
                ulCodePageRange1=(1 << 0) | (1 << 5),
                fsSelection=(1 << 5 if bold else 1 << 6) | (1 << 7), sxHeight=st.H, sCapHeight=st.H)
    fb.font["OS/2"].version = 4
    fb.font["head"].macStyle = 1 if bold else 0
    fb.setupPost()
    hebrew = [g[0] for g in GLYPHS if 0x05D0 <= g[1] <= 0x05EA]
    latin = [g[0] for g in LATIN]
    table = kern.pairs(glyphs, hebrew, st.H, st.floor)
    latin_table = kern.pairs(glyphs, latin, st.H, st.floor_latin, rtl=False)
    addOpenTypeFeaturesFromString(fb.font, kern.feature(table, latin_table))

    os.makedirs(DIST, exist_ok=True)
    otf = os.path.join(DIST, f"{ps}.otf")
    fb.save(otf)
    web = TTFont(otf)
    web.flavor = "woff2"
    woff2 = otf.replace(".otf", ".woff2")
    web.save(woff2)
    if os.path.isdir(PUBLIC):
        shutil.copy(woff2, PUBLIC)
    print(f"{ps}: {len(order)} glyphs, {len(table) + len(latin_table)} kern pairs, {os.path.getsize(woff2)} bytes")


if __name__ == "__main__":
    for st in STYLES:
        build(st)
