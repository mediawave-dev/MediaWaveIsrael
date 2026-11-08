"""mediawave-font1: a wide, low-contrast Hebrew display face drawn with the kit.

Every function takes the style s and the outer width W and returns a path.
Two families of shoulder: round (bet, kaf, resh, mem, samekh) and square
with a barely softened corner (he, het, tav, qof). The one signature is the
tip: every bar that ends on the left is cut on the same slant.
"""
import pathops

from .kit import frame, minus, poly, rect, slab, union, x_at


def tip(s, x0, y_top, th):
    """The piece to remove so a bar ending at x0 leans forward at its top."""
    run = th * s.cut
    return poly([(x0, y_top), (x0 + run, y_top - th), (x0 + run, y_top - th - 1),
                 (x0 - 4, y_top - th - 1), (x0 - 4, y_top + 1), (x0, y_top + 1)])


def sweep(p0, p1, p2, p3, w0, w1):
    """A cubic centre line stroked from width w0 to w1, outlined by offset handles."""
    def unit(a, b):
        dx, dy = b[0] - a[0], b[1] - a[1]
        d = (dx * dx + dy * dy) ** 0.5
        return dx / d, dy / d

    ux0, uy0 = unit(p0, p1)
    ux1, uy1 = unit(p2, p3)
    h0, h1 = w0 / 2, w1 / 2
    left = [(p0[0] - uy0 * h0, p0[1] + ux0 * h0), (p1[0] - uy0 * h0, p1[1] + ux0 * h0),
            (p2[0] - uy1 * h1, p2[1] + ux1 * h1), (p3[0] - uy1 * h1, p3[1] + ux1 * h1)]
    right = [(p0[0] + uy0 * h0, p0[1] - ux0 * h0), (p1[0] + uy0 * h0, p1[1] - ux0 * h0),
             (p2[0] + uy1 * h1, p2[1] - ux1 * h1), (p3[0] + uy1 * h1, p3[1] - ux1 * h1)]
    p = pathops.Path()
    p.moveTo(*left[0])
    p.cubicTo(*left[1], *left[2], *left[3])
    p.lineTo(*right[3])
    p.cubicTo(*right[2], *right[1], *right[0])
    p.close()
    return p


def _on_base(path, W):
    """Trim a stroke to the baseline and to the right edge of the letter."""
    return minus(path, rect(-600, -900, W + 600, 0), rect(W, -900, W + 600, 2000))


def _hang(s, x_join, y_bar, x_right, top):
    """An arm that hangs from the top and bends into a diagonal (alef, tsadi)."""
    return frame(s, x_join, y_bar, x_right, top, right=s.V, bottom=s.T * 0.92, br=s.Rarm)


def _land(W, xa, ya, y, w):
    """The centre x at height y of a stroke from (xa, ya) whose flat end has
    its right corner exactly on W."""
    x = W
    for _ in range(6):
        x = W - w / 2 * ((x - xa) ** 2 + (y - ya) ** 2) ** 0.5 / abs(y - ya)
    return x


def _arm(s, W, xa, ya, xb, yb, y_join):
    """A straight arm falling from the top right into a main stroke (tsadi).
    Its top right corner sits on W; it runs past the join and is trimmed on
    the stroke's centre line."""
    x_join = x_at(xa, ya, xb, yb, y_join)
    x_top = _land(W, x_join, y_join, s.H, s.D)
    x_end, y_end = x_top + (x_join - x_top) * 1.5, s.H + (y_join - s.H) * 1.5
    y1, y2 = s.H + 50, y_end - 100
    behind = poly([(x_at(xa, ya, xb, yb, y1), y1), (x_at(xa, ya, xb, yb, y2), y2), (-2000, y2), (-2000, y1)])
    return minus(slab(x_top, s.H, x_end, y_end, s.D), behind)


def _hook(s, xh, W):
    """The inner drop of pe: the roof turns down inside the counter."""
    return frame(s, xh, 0.50 * s.H, xh + 0.30 * W, s.H, top=s.T, left=s.V, tl=s.Rs)


def alef(s, W):
    H = s.H
    xa, xb = 0.15 * W, 0.85 * W
    main = slab(xa, H, xb, 0, s.D)
    yb = 0.33 * H
    arm = _hang(s, x_at(xa, H, xb, 0, yb + s.T * 0.46), yb, W, H)
    return union(main, arm, arm.transform(-1, 0, 0, -1, W, H))


def bet(s, W):
    H, V, T, B = s.H, s.V, s.T, s.B
    xs = W - s.heel
    body = frame(s, 0, 0, xs, H, top=T, right=V, bottom=B, tr=s.Rl)
    shape = minus(union(body, rect(xs - V, 0, W, B)), rect(-2, H - T - 2, s.lag, H + 2))
    return minus(shape, tip(s, s.lag, H, T), tip(s, 0, B, B))


def gimel(s, W):
    H, V, T = s.H, s.V, s.T
    x0 = W - s.head
    head = frame(s, x0, 0, W, H, top=T, right=V, tr=s.Rs)
    foot = sweep((W - V / 2, 0.62 * H), (W - V / 2, 0.38 * H), (0.46 * W, 0.20 * H), (0.08 * W, -0.10 * H), V, s.D)
    return minus(union(head, _on_base(foot, W)), tip(s, x0, H, T))


def dalet(s, W):
    H, V, T = s.H, s.V, s.T
    xs = W - s.over - V
    return minus(union(rect(0, H - T, W, H), rect(xs, 0, xs + V, H)), tip(s, 0, H, T))


def he(s, W):
    H, V, T = s.H, s.V, s.T
    top = frame(s, 0, 0, W, H, top=T, right=V, tr=s.Rl)
    x = T * s.cut  # the roof's tip is cut on a slant: the leg lines up with the end of its underside
    return minus(union(top, rect(x, 0, x + V, 0.60 * H)), tip(s, 0, H, T))


def vav(s, W):
    return minus(frame(s, 0, 0, W, s.H, top=s.T, right=s.V, tr=s.Rs), tip(s, 0, s.H, s.T))


def zayin(s, W):
    H, V, T = s.H, s.V, s.T
    xs = 0.60 * W - V / 2
    return minus(union(rect(0, H - T, W, H), rect(xs, 0, xs + V, H)), tip(s, 0, H, T))


def het(s, W):
    return frame(s, 0, 0, W, s.H, top=s.T, right=s.V, left=s.V, tr=s.Rc, tl=s.Rc)


def tet(s, W):
    H, V, T, B = s.H, s.V, s.T, s.B
    bowl = frame(s, 0, -s.os, W, H, left=V, right=V, bottom=B, bl=s.Rl, br=s.Rl)
    bowl = minus(bowl, rect(W - V - 2, 0.70 * H, W + 2, H + 2))
    xh = 0.44 * W
    r = (W - xh) / 2
    return union(bowl, frame(s, xh, 0.50 * H, W, H, top=T, left=V, right=V, tl=r, tr=r))


def yod(s, W):
    return minus(frame(s, 0, s.yod * s.H, W, s.H, top=s.T, right=s.V, tr=s.Rs), tip(s, 0, s.H, s.T))


def final_kaf(s, W):
    return minus(frame(s, 0, s.DESC, W, s.H, top=s.T, right=s.V, tr=s.Rl), tip(s, 0, s.H, s.T))


def kaf(s, W):
    H, T, B = s.H, s.T, s.B
    body = frame(s, 0, 0, W, H, top=T, right=s.V, bottom=B, tr=s.Rl, br=s.Rl)
    return minus(body, tip(s, 0, H, T), tip(s, 0, B, B))


def lamed(s, W):
    H, V, T = s.H, s.V, s.T
    knee = 0.50 * H
    asc = poly([(0, H - T), (V, H - T), (V, s.ASC - V * s.cut), (0, s.ASC)])
    body = frame(s, 0, knee, W, H, top=T, right=V, tr=s.Rm)
    tail = sweep((W - V / 2, knee + 20), (W - V / 2, 0.24 * H), (0.64 * W, 0.10 * H), (0.38 * W, -0.14 * H), V, s.D)
    return union(asc, body, _on_base(tail, W))


def final_mem(s, W):
    return frame(s, 0, 0, W, s.H, top=s.T, right=s.V, bottom=s.B, left=s.V, tl=s.Rc, tr=s.Rc, br=s.Rc, bl=s.Rc)


def mem(s, W):
    H, V, T, B = s.H, s.V, s.T, s.B
    xo = 0.40 * W
    body = minus(frame(s, 0, 0, W, H, top=T, right=V, bottom=B, tr=s.Rl, br=s.Rl), rect(-2, -2, xo, B + 2))
    leg = slab(0.20 * W, H - T / 2, 0.10 * W, 0, s.D)
    return minus(union(body, leg), tip(s, 0, H, T), tip(s, xo, B, B))


def final_nun(s, W):
    return minus(frame(s, 0, s.DESC, W, s.H, top=s.T, right=s.V, tr=s.Rs), tip(s, 0, s.H, s.T))


def nun(s, W):
    H, T, B = s.H, s.T, s.B
    x0 = W - s.head
    body = frame(s, x0, 0, W, H, top=T, right=s.V, bottom=B, tr=s.Rs, br=s.Rs)
    return minus(union(body, rect(0, 0, x0 + 80, B)), tip(s, x0, H, T), tip(s, 0, B, B))


def samekh(s, W):
    H, V, T, B = s.H, s.V, s.T, s.B
    xn = s.nose
    body = frame(s, xn, -s.os, W, H, top=T, right=V, bottom=B, left=V, tr=s.Rl, br=s.Rl, bl=s.Rl)
    return minus(union(body, rect(0, H - T, xn + V, H)), tip(s, 0, H, T))


def ayin(s, W):
    H, V, B = s.H, s.V, s.B
    x0 = 0.05 * W
    right = frame(s, x0, -s.os, W, H, right=V, bottom=B, br=s.Rl)
    arm = slab(0.13 * W, H, 0.62 * W, B / 2, s.D)
    return minus(union(right, arm), tip(s, x0, B - s.os, B))


def final_pe(s, W):
    H, T = s.H, s.T
    xh = 0.05 * W
    body = minus(frame(s, xh, s.DESC, W, H, top=T, right=s.V, tr=s.Rl), rect(xh - 2, H - T - 2, xh + s.Rs, H + 2))
    return union(body, _hook(s, xh, W))


def pe(s, W):
    H, T, B = s.H, s.T, s.B
    xh = 0.09 * W
    body = frame(s, 0, 0, W, H, top=T, right=s.V, bottom=B, tr=s.Rl, br=s.Rl)
    body = minus(body, rect(-2, H - T - 2, xh + s.Rs, H + 2))
    return minus(union(body, _hook(s, xh, W)), tip(s, 0, B, B))


def final_tsadi(s, W):
    H = s.H
    xa = 0.14 * W
    xb = _land(W, xa, H, s.DESC, s.D)
    return union(slab(xa, H, xb, s.DESC, s.D), _arm(s, W, xa, H, xb, s.DESC, 0.50 * H))


def tsadi(s, W):
    H, B = s.H, s.B
    xa = 0.16 * W
    xc = _land(W, xa, H, B, s.D)
    xb = x_at(xa, H, xc, B, 0)
    main = minus(slab(xa, H, xb, 0, s.D), rect(W, -10, W + 500, H))
    return minus(union(rect(0, 0, W, B), main, _arm(s, W, xa, H, xb, 0, 0.50 * H)), tip(s, 0, B, B))


def qof(s, W):
    H, V, T, B = s.H, s.V, s.T, s.B
    xl, xo = 0.15 * W, 0.60 * W
    body = frame(s, 0, 0, W, H, top=T, right=V, bottom=B, tr=s.Rm, br=s.Rm)
    body = minus(body, rect(-2, -2, xo, B + 2), tip(s, xo, B, B))
    return minus(union(body, rect(xl, -170, xl + V, s.gap * H)), tip(s, 0, H, T))


def resh(s, W):
    return minus(frame(s, 0, 0, W, s.H, top=s.T, right=s.V, tr=s.Rl), tip(s, 0, s.H, s.T))


def shin(s, W):
    H, V, B = s.H, s.V, s.B
    bowl = frame(s, 0, -s.os, W, H, left=V, right=V, bottom=B, bl=s.Rl, br=s.Rl)
    riser = frame(s, V / 2, 0.40 * H, (W + V) / 2, H, right=V, bottom=s.T * 0.92, br=s.Rs)
    return union(bowl, riser)


def tav(s, W):
    H, V, T, B = s.H, s.V, s.T, s.B
    xl = s.foot
    body = frame(s, xl, 0, W, H, top=T, right=V, left=V, tr=s.Rc, tl=s.Rc)
    return minus(union(body, rect(0, 0, xl + V, B)), tip(s, 0, B, B))


_RD = 132  # shoulder radius of the two-storey digits


def _waist(s):
    return 0.52 * s.H, s.T * 0.96


def zero(s, W):
    return frame(s, 0, -s.os, W, s.H + s.os, top=s.T, right=s.V, bottom=s.B, left=s.V,
                 tl=s.Rl, tr=s.Rl, br=s.Rl, bl=s.Rl)


def one(s, W):
    H, V = s.H, s.V
    flag = minus(slab(W - V / 2, H, 0.08 * W, 0.66 * H, s.D), rect(W, -10, W + 400, H + 10))
    return union(rect(W - V, 0, W, H), flag)


def two(s, W):
    H, T = s.H, s.T
    ym, m = _waist(s)
    band = (ym - m / 2 - 2, ym + m / 2 + 2)
    up = frame(s, 0, ym - m / 2, W, H, top=T, right=s.V, bottom=m, tr=s.Rm, br=_RD)
    down = frame(s, 0, 0, W, ym + m / 2, top=m, left=s.V, bottom=s.B, tl=_RD)
    return minus(union(minus(up, rect(-2, band[0], _RD, band[1])), minus(down, rect(W - _RD, band[0], W + 2, band[1]))),
                 tip(s, 0, H, T))


def three(s, W):
    H, T, B = s.H, s.T, s.B
    ym, m = _waist(s)
    up = frame(s, 0, ym - m / 2, W, H, top=T, right=s.V, bottom=m, tr=s.Rm, br=_RD)
    down = frame(s, 0, 0, W, ym + m / 2, top=m, right=s.V, bottom=B, tr=_RD, br=s.Rm)
    waist = rect(-2, ym - m / 2 - 2, 0.30 * W, ym + m / 2 + 2)
    return minus(union(up, down), waist, tip(s, 0, H, T), tip(s, 0, B, B))


def four(s, W):
    H, V, T = s.H, s.V, s.T
    xs, yb = 0.84 * W - V, 0.24 * H
    diag = minus(slab(xs + V / 2, H, 0.08 * W, yb + T / 2, s.D), rect(xs + V, -10, W + 400, H + 10),
                 rect(-400, -10, 0, H + 10))
    return union(rect(0, yb, W, yb + T), rect(xs, 0, xs + V, H), diag)


def five(s, W):
    H, V, T, B = s.H, s.V, s.T, s.B
    ym, m = 0.56 * H, s.T * 0.96
    xl = 0.06 * W
    down = frame(s, 0, 0, W, ym + m / 2, top=m, right=V, bottom=B, tr=_RD, br=s.Rm)
    down = minus(down, rect(-2, ym - m / 2 - 2, xl, ym + m / 2 + 2))
    return minus(union(rect(xl, H - T, 0.94 * W, H), rect(xl, ym - m / 2, xl + V, H), down), tip(s, 0, B, B))


def six(s, W):
    H, V, T = s.H, s.V, s.T
    ym, m = 0.58 * H, T * 0.96
    bowl = frame(s, 0, -s.os, W, ym + m / 2, top=m, right=V, bottom=s.B, left=V, tl=_RD, tr=_RD, br=s.Rm, bl=s.Rm)
    return union(bowl, frame(s, 0, ym - 40, 0.92 * W, H, top=T, left=V, tl=s.Rm))


def seven(s, W):
    H, T = s.H, s.T
    diag = minus(slab(0.90 * W, H - T / 2, 0.28 * W, 0, s.D), rect(W, -10, W + 400, H + 10))
    return minus(union(rect(0, H - T, W, H), diag), tip(s, 0, H, T))


def eight(s, W):
    H, V, T, B = s.H, s.V, s.T, s.B
    ym, m = 0.53 * H, T * 0.96
    x = 0.05 * W
    up = frame(s, x, ym - m / 2, W - x, H, top=T, right=V, bottom=m, left=V, tl=_RD, tr=_RD, br=_RD, bl=_RD)
    down = frame(s, 0, -s.os, W, ym + m / 2, top=m, right=V, bottom=B, left=V, tl=_RD, tr=_RD, br=s.Rm, bl=s.Rm)
    return union(up, down)


def nine(s, W):
    return six(s, W).transform(-1, 0, 0, -1, W, s.H)


def period(s, W):
    return rect(0, 0, W, s.dot)


def comma(s, W):
    return union(rect(0, 0, W, s.dot), slab(W - s.V / 2, s.dot / 2, W * 0.1, -150, s.V))


def question(s, W):
    H, V = s.H, s.V
    c = W / 2 - V / 2
    top = frame(s, 0, 0.46 * H, W, H, top=s.T, right=V, bottom=s.B, tr=s.Rs, br=s.Rs)
    top = minus(top, rect(-2, 0.46 * H - 2, c, 0.46 * H + s.B + 2))
    return minus(union(top, rect(c, 0.28 * H, c + V, 0.46 * H + 2), rect(W / 2 - s.dot / 2, 0, W / 2 + s.dot / 2, s.dot)),
                 tip(s, 0, H, s.T))


def exclam(s, W):
    return union(rect(W / 2 - s.V / 2, 0.28 * s.H, W / 2 + s.V / 2, s.H), rect(0, 0, W, s.dot))


def hyphen(s, W):
    return rect(0, 0.40 * s.H - s.T / 2, W, 0.40 * s.H + s.T / 2)


def maqaf(s, W):
    return rect(0, s.H - s.T, W, s.H)


def geresh(s, W):
    return slab(W, s.H, 0, 0.62 * s.H, s.V)


def gershayim(s, W):
    w = 0.40 * W
    return union(slab(w, s.H, 0, 0.62 * s.H, s.V), slab(W, s.H, W - w, 0.62 * s.H, s.V))


def space(s, W):
    return None


# name, codepoint, width, fn, lsb, rsb
GLYPHS = [
    ("alef", 0x05D0, 690, alef, 22, 22),
    ("bet", 0x05D1, 706, bet, 24, 28),
    ("gimel", 0x05D2, 410, gimel, 16, 44),
    ("dalet", 0x05D3, 620, dalet, 24, 26),
    ("he", 0x05D4, 650, he, 44, 48),
    ("vav", 0x05D5, 222, vav, 24, 48),
    ("zayin", 0x05D6, 320, zayin, 26, 30),
    ("het", 0x05D7, 650, het, 50, 50),
    ("tet", 0x05D8, 650, tet, 46, 40),
    ("yod", 0x05D9, 212, yod, 24, 48),
    ("finalkaf", 0x05DA, 600, final_kaf, 24, 40),
    ("kaf", 0x05DB, 610, kaf, 24, 36),
    ("lamed", 0x05DC, 600, lamed, 36, 40),
    ("finalmem", 0x05DD, 640, final_mem, 50, 50),
    ("mem", 0x05DE, 690, mem, 24, 36),
    ("finalnun", 0x05DF, 222, final_nun, 24, 48),
    ("nun", 0x05E0, 400, nun, 20, 42),
    ("samekh", 0x05E1, 660, samekh, 22, 36),
    ("ayin", 0x05E2, 640, ayin, 18, 42),
    ("finalpe", 0x05E3, 620, final_pe, 38, 40),
    ("pe", 0x05E4, 640, pe, 24, 36),
    ("finaltsadi", 0x05E5, 500, final_tsadi, 24, 30),
    ("tsadi", 0x05E6, 540, tsadi, 20, 30),
    ("qof", 0x05E7, 650, qof, 24, 42),
    ("resh", 0x05E8, 590, resh, 24, 38),
    ("shin", 0x05E9, 740, shin, 46, 40),
    ("tav", 0x05EA, 752, tav, 24, 50),
    ("zero", 0x30, 590, zero, 44, 44),
    ("one", 0x31, 270, one, 40, 54),
    ("two", 0x32, 540, two, 36, 40),
    ("three", 0x33, 540, three, 30, 44),
    ("four", 0x34, 590, four, 30, 34),
    ("five", 0x35, 540, five, 30, 44),
    ("six", 0x36, 560, six, 44, 40),
    ("seven", 0x37, 530, seven, 30, 36),
    ("eight", 0x38, 570, eight, 42, 42),
    ("nine", 0x39, 560, nine, 40, 44),
    ("space", 0x20, 0, space, 150, 150),
    ("uni00A0", 0xA0, 0, space, 150, 150),
    ("period", 0x2E, 0, period, 56, 56),
    ("comma", 0x2C, 0, comma, 56, 56),
    ("question", 0x3F, 380, question, 40, 40),
    ("exclam", 0x21, 0, exclam, 56, 56),
    ("hyphen", 0x2D, 300, hyphen, 44, 44),
    ("maqaf", 0x05BE, 300, maqaf, 36, 36),
    ("geresh", 0x05F3, 130, geresh, 40, 40),
    ("gershayim", 0x05F4, 280, gershayim, 40, 40),
]
