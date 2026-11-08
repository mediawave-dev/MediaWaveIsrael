"""mediawave-font1: the punctuation and signs beyond the letters file."""
from .kit import frame, minus, rect, slab, union
from .letters import comma, geresh, gershayim, hyphen, space


def colon(s, W):
    return union(rect(0, 0, W, s.dot), rect(0, 0.62 * s.H, W, 0.62 * s.H + s.dot))


def semicolon(s, W):
    return union(comma(s, W), rect(0, 0.62 * s.H, W, 0.62 * s.H + s.dot))


def paren_left(s, W):
    return frame(s, 0, -140, W, s.H + 100, top=s.T, left=s.V, bottom=s.B, tl=s.Rs, bl=s.Rs)


def paren_right(s, W):
    return paren_left(s, W).transform(-1, 0, 0, 1, W, 0)


def _tick(s, x):
    return rect(x, 0.64 * s.H, x + s.V, s.H)


def quote_single(s, W):
    return _tick(s, (W - s.V) / 2)


def quote_double(s, W):
    return union(_tick(s, 0), _tick(s, W - s.V))


def quote_right(s, W):
    return geresh(s, W)


def quote_left(s, W):
    return geresh(s, W).transform(-1, 0, 0, 1, W, 0)


def quote_dbl_right(s, W):
    return gershayim(s, W)


def quote_dbl_left(s, W):
    return gershayim(s, W).transform(-1, 0, 0, 1, W, 0)


def slash(s, W):
    return slab(W, s.H + 60, 0, -100, s.V)


def percent(s, W):
    H, t = s.H, s.V * 0.78
    r = min(s.Rs, 60)
    box = frame(s, 0, 0.60 * H, 0.34 * W, H, top=t, right=t, bottom=t, left=t, tl=r, tr=r, br=r, bl=r)
    return union(box, box.transform(-1, 0, 0, -1, W, H), slab(0.80 * W, H, 0.20 * W, 0, s.V))


def plus(s, W):
    y = 0.40 * s.H
    return union(rect(0, y - s.T / 2, W, y + s.T / 2), rect((W - s.V) / 2, y - W / 2, (W + s.V) / 2, y + W / 2))


def ellipsis(s, W):
    d = s.dot
    return union(rect(0, 0, d, d), rect((W - d) / 2, 0, (W + d) / 2, d), rect(W - d, 0, W, d))


def sheqel(s, W):
    """Two interlocking hooks: each stands on one side and hangs into the other."""
    H, xr = s.H, 0.72 * W
    hook = minus(frame(s, 0, 0, xr, H, top=s.T, left=s.V, right=s.V, tl=s.Rs, tr=s.Rs),
                 rect(xr - s.V - 2, -2, xr + 2, 0.34 * H))
    return union(hook, hook.transform(-1, 0, 0, -1, W, H))


# name, codepoint, width, fn, lsb, rsb
MARKS = [
    ("colon", 0x3A, 0, colon, 56, 56),
    ("semicolon", 0x3B, 0, semicolon, 56, 56),
    ("parenleft", 0x28, 200, paren_left, 50, 30),
    ("parenright", 0x29, 200, paren_right, 30, 50),
    ("quotesingle", 0x27, 90, quote_single, 36, 36),
    ("quotedbl", 0x22, 220, quote_double, 36, 36),
    ("quoteleft", 0x2018, 130, quote_left, 40, 40),
    ("quoteright", 0x2019, 130, quote_right, 40, 40),
    ("quotedblleft", 0x201C, 280, quote_dbl_left, 40, 40),
    ("quotedblright", 0x201D, 280, quote_dbl_right, 40, 40),
    ("slash", 0x2F, 320, slash, 30, 30),
    ("percent", 0x25, 760, percent, 44, 44),
    ("plus", 0x2B, 460, plus, 50, 50),
    ("endash", 0x2013, 500, hyphen, 44, 44),
    ("emdash", 0x2014, 800, hyphen, 44, 44),
    ("ellipsis", 0x2026, 440, ellipsis, 56, 56),
    ("sheqel", 0x20AA, 720, sheqel, 44, 44),
    ("uni200E", 0x200E, 0, space, 0, 0),
    ("uni200F", 0x200F, 0, space, 0, 0),
]
