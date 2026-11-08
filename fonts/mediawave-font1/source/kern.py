"""Pair kerning for mediawave-font1: evens out the air between Hebrew letters.

Hebrew reads right to left, so in a pair (first, second) the second letter
sits to the left of the first. The air is measured band by band up the body,
counting only DEPTH units past the closest point, because white deep inside a
letter is not seen as space between letters. Open pairs close part of the way
toward the rhythm of the straight pairs, never nearer than the style's floor.
"""

STEP_X, STEP_Y = 4, 20
DEPTH = 120
RHYTHM = 0.15  # the percentile of air every pair moves toward: about a straight pair
DAMP = 0.20
TIGHTEST, LOOSEST = -30, 16
TIGHTEST_LATIN, MIN_LATIN = -90, 16  # diagonals like AV need more, and small moves are not worth the bytes
FINALS = {"finalkaf", "finalmem", "finalnun", "finalpe", "finaltsadi"}


def _profile(path, adv):
    bands = {}
    for y in range(-240, 880, STEP_Y):
        xs = [x for x in range(-20, adv + 20, STEP_X) if path.contains((x + 0.5, y + 0.5))]
        if xs:
            bands[y] = (min(xs), max(xs))
    return bands


def pairs(glyphs, names, height, floor, rtl=True):
    """glyphs maps a name to (path, advance); returns {(first, second): units}."""
    tightest, step = (TIGHTEST, 8) if rtl else (TIGHTEST_LATIN, MIN_LATIN)
    prof = {n: _profile(*glyphs[n]) for n in names}
    air, least = {}, {}
    for a in names:
        if rtl and a in FINALS:
            continue
        for b in names:
            near, far, adv = (a, b, glyphs[b][1]) if rtl else (b, a, glyphs[a][1])
            gap = {y: prof[near][y][0] + adv - prof[far][y][1] for y in prof[near] if y in prof[far]}
            if not gap:
                continue
            closest = min(gap.values())
            cap = closest + DEPTH
            body = [min(gap.get(y, cap), cap) for y in range(0, height, STEP_Y)]
            air[a, b] = sum(body) / len(body)
            least[a, b] = closest

    target = sorted(air.values())[int(len(air) * RHYTHM)]
    out = {}
    for pair, value in air.items():
        k = max(tightest, min(LOOSEST, (target - value) * DAMP))
        k = 2 * round(max(k, floor - least[pair]) / 2)
        if abs(k) >= step:
            out[pair] = k
    return out


def feature(hebrew, latin):
    """The kern feature; a right-to-left pair moves both placement and advance."""
    rows = [f"  pos {a} {b} <{k} 0 {k} 0>;" for (a, b), k in sorted(hebrew.items())]
    rows += [f"  pos {a} {b} {k};" for (a, b), k in sorted(latin.items())]
    body = "\n".join(rows)
    return ("languagesystem DFLT dflt;\nlanguagesystem hebr dflt;\nlanguagesystem latn dflt;\n\n"
            f"feature kern {{\n{body}\n}} kern;\n")
