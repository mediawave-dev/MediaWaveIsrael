"""mediawave-font1: the Latin letters, built like the Hebrew and the digits.

Capitals share the Hebrew body height (s.H), so a mixed line sits on one roofline.
Bars that end on the right take the mirror of the Hebrew tip.
"""
from types import SimpleNamespace

from .kit import frame, minus, poly, rect, slab, union, x_at
from .letters import _arm, _land, tip

X, ASC, DESC = 450, 680, -170  # x-height, lowercase ascender and descender
R_WAIST, R_LOW = 132, 130


def tip_r(s, x1, y_top, th):
    """The mirror of tip: a bar ending on the right leans forward at its top."""
    run = th * s.cut
    return poly([(x1, y_top), (x1 - run, y_top - th), (x1 - run, y_top - th - 1),
                 (x1 + 4, y_top - th - 1), (x1 + 4, y_top + 1), (x1, y_top + 1)])


def _flip(path, W):
    return path.transform(-1, 0, 0, 1, W, 0)


def _inside(path, W):
    return minus(path, rect(-2000, -2000, 0, 2000), rect(W, -2000, W + 2000, 2000))


def _o(s, W, h, r):
    return frame(s, 0, -s.os, W, h + s.os, top=s.T, right=s.V, bottom=s.B, left=s.V, tl=r, tr=r, br=r, bl=r)


def _c(s, W, h, r):
    body = frame(s, 0, -s.os, W, h + s.os, top=s.T, left=s.V, bottom=s.B, tl=r, bl=r)
    return minus(body, tip_r(s, W, h + s.os, s.T), tip_r(s, W, s.B - s.os, s.B))


def _s(s, W, h, r, waist):
    T, B, V = s.T, s.B, s.V
    ym, m = 0.52 * h, T * 0.96
    y0, y1 = ym - m / 2 - 2, ym + m / 2 + 2
    up = frame(s, 0, ym - m / 2, W, h + s.os, top=T, left=V, bottom=m, tl=r, bl=waist)
    down = frame(s, 0, -s.os, W, ym + m / 2, top=m, right=V, bottom=B, tr=waist, br=r)
    shape = union(minus(up, rect(W - waist, y0, W + 2, y1)), minus(down, rect(-2, y0, waist, y1)))
    return minus(shape, tip_r(s, W, h + s.os, T), tip(s, 0, B - s.os, B))


def _v(s, W, h):
    cx = W / 2
    xr = _land(W, cx, 0, h, s.D)
    return union(slab(cx, 0, xr, h, s.D), slab(cx, 0, W - xr, h, s.D))


def _w(s, W, h):
    xr = _land(W, 0.73 * W, 0, h, s.D)
    return union(slab(W - xr, h, 0.27 * W, 0, s.D), slab(0.5 * W, h, 0.27 * W, 0, s.D),
                 slab(0.5 * W, h, 0.73 * W, 0, s.D), slab(xr, h, 0.73 * W, 0, s.D))


def _x(s, W, h):
    q = s.D * 0.8
    return _inside(union(slab(q, h, W - q, 0, s.D), slab(W - q, h, q, 0, s.D)), W)


def _z(s, W, h):
    T, B = s.T, s.B
    q = s.D * 0.8
    diag = _inside(slab(W - q, h - T / 2, q, B / 2, s.D), W)
    return minus(union(rect(0, h - T, W, h), rect(0, 0, W, B), diag), tip(s, 0, h, T), tip_r(s, W, B, B))


def _k(s, W, h, top):
    y0 = 0.44 * h
    V, D = s.V, s.D
    arms = union(slab(V, y0, _land(W, V, y0, h, D), h, D), slab(V, y0, _land(W, V, y0, 0, D), 0, D))
    return union(rect(0, 0, V, top), minus(arms, rect(-2000, -2000, V / 2, 2000)))


def _bowl_right(s, W, h, r):
    return frame(s, 0, -s.os, W, h + s.os, top=s.T, right=s.V, bottom=s.B, tr=r, br=r)


def _arch(s, x0, W, r):
    return frame(s, x0, 0, W, X + s.os, top=s.T, right=s.V, tr=r)


# capitals
def cap_a(s, W):
    H, D = s.H, s.D
    cx, yb = W / 2, 0.24 * H
    xr = _land(W, cx, H, 0, D)
    bar = rect(x_at(cx, H, W - xr, 0, yb), yb, x_at(cx, H, xr, 0, yb), yb + s.T * 0.92)
    return union(slab(cx, H, xr, 0, D), slab(cx, H, W - xr, 0, D), bar)


def cap_b(s, W):
    H, T, V = s.H, s.T, s.V
    ym, m = 0.53 * H, T * 0.96
    top = frame(s, 0, ym - m / 2, W - 24, H, top=T, right=V, bottom=m, tr=R_WAIST, br=R_WAIST)
    low = frame(s, 0, 0, W, ym + m / 2, top=m, right=V, bottom=s.B, tr=R_WAIST, br=s.Rm)
    return union(rect(0, 0, V, H), top, low)


def cap_c(s, W):
    return _c(s, W, s.H, s.Rl)


def cap_d(s, W):
    return union(rect(0, 0, s.V, s.H), frame(s, 0, 0, W, s.H, top=s.T, right=s.V, bottom=s.B, tr=s.Rl, br=s.Rl))


def cap_e(s, W):
    H, T, B, V = s.H, s.T, s.B, s.V
    ym, m = 0.52 * H, T * 0.96
    xm = 0.86 * W
    bars = union(rect(0, H - T, W, H), rect(0, ym - m / 2, xm, ym + m / 2), rect(0, 0, W, B), rect(0, 0, V, H))
    return minus(bars, tip_r(s, W, H, T), tip_r(s, xm, ym + m / 2, m), tip_r(s, W, B, B))


def cap_f(s, W):
    H, T, V = s.H, s.T, s.V
    ym, m = 0.50 * H, T * 0.96
    xm = 0.84 * W
    bars = union(rect(0, H - T, W, H), rect(0, ym - m / 2, xm, ym + m / 2), rect(0, 0, V, H))
    return minus(bars, tip_r(s, W, H, T), tip_r(s, xm, ym + m / 2, m))


def cap_g(s, W):
    H, T, B, V, r = s.H, s.T, s.B, s.V, s.Rl
    ym = 0.50 * H
    body = minus(frame(s, 0, -s.os, W, H + s.os, top=T, left=V, bottom=B, tl=r, bl=r),
                 rect(0.5 * W, -s.os - 2, W + 2, B + 2 - s.os), tip_r(s, W, H + s.os, T))
    low = frame(s, 0.4 * W, -s.os, W, ym, right=V, bottom=B, br=r)
    return union(body, low, rect(0.54 * W, ym - T, W, ym))


def cap_h(s, W):
    ym, m = 0.52 * s.H, s.T * 0.96
    return union(rect(0, 0, s.V, s.H), rect(W - s.V, 0, W, s.H), rect(0, ym - m / 2, W, ym + m / 2))


def cap_i(s, W):
    return rect((W - s.V) / 2, 0, (W + s.V) / 2, s.H)


def cap_j(s, W):
    return minus(frame(s, 0, -s.os, W, s.H, right=s.V, bottom=s.B, br=s.Rl), tip(s, 0, s.B - s.os, s.B))


def cap_k(s, W):
    return _k(s, W, s.H, s.H)


def cap_l(s, W):
    return minus(union(rect(0, 0, s.V, s.H), rect(0, 0, W, s.B)), tip_r(s, W, s.B, s.B))


def cap_m(s, W):
    H, V, D = s.H, s.V, s.D
    q = D * 0.62
    cx = W / 2
    return union(rect(0, 0, V, H), rect(W - V, 0, W, H), _inside(union(slab(q, H, cx, 0, D), slab(W - q, H, cx, 0, D)), W))


def cap_n(s, W):
    H, V, D = s.H, s.V, s.D
    q = D * 0.62
    return union(rect(0, 0, V, H), rect(W - V, 0, W, H), _inside(slab(q, H, W - q, 0, D), W))


def cap_o(s, W):
    return _o(s, W, s.H, s.Rl)


def _p_bowl(s, W):
    H, T = s.H, s.T
    y0 = 0.40 * H
    return y0, frame(s, 0, y0, W, H, top=T, right=s.V, bottom=T * 0.96, tr=R_WAIST + 20, br=R_WAIST + 20)


def cap_p(s, W):
    return union(rect(0, 0, s.V, s.H), _p_bowl(s, W)[1])


def cap_q(s, W):
    H, D = s.H, s.D
    xa, ya = 0.64 * W, 0.26 * H
    xb = _land(W + 16, xa, ya, -96, D)
    return union(_o(s, W, H, s.Rl), slab(xa, ya, xb, -96, D))


def cap_r(s, W):
    y0, bowl = _p_bowl(s, W)
    xa = 0.46 * W
    return union(rect(0, 0, s.V, s.H), bowl, slab(xa, y0 + s.T / 2, _land(W, xa, y0 + s.T / 2, 0, s.D), 0, s.D))


def cap_s(s, W):
    return _s(s, W, s.H, s.Rm, R_WAIST)


def cap_t(s, W):
    H, T, V = s.H, s.T, s.V
    return minus(union(rect(0, H - T, W, H), rect((W - V) / 2, 0, (W + V) / 2, H)), tip(s, 0, H, T), tip_r(s, W, H, T))


def cap_u(s, W):
    return frame(s, 0, -s.os, W, s.H, left=s.V, right=s.V, bottom=s.B, bl=s.Rl, br=s.Rl)


def cap_v(s, W):
    return _v(s, W, s.H)


def cap_w(s, W):
    return _w(s, W, s.H)


def cap_x(s, W):
    return _x(s, W, s.H)


def cap_y(s, W):
    H, V, D = s.H, s.V, s.D
    cx, y0 = W / 2, 0.42 * H
    xr = _land(W, cx, y0, H, D)
    low = y0 - 200
    right = minus(slab(x_at(cx, y0, xr, H, low), low, xr, H, D), rect(-2000, -2000, cx - V / 2, 2000))
    left = minus(slab(W - x_at(cx, y0, xr, H, low), low, W - xr, H, D), rect(cx + V / 2, -2000, 2000, 2000))
    return union(right, left, rect(cx - V / 2, 0, cx + V / 2, y0))


def cap_z(s, W):
    return _z(s, W, s.H)


# lowercase
def low_a(s, W):
    T, V = s.T, s.V
    yb, m = 0.56 * X, T * 0.92
    arch = frame(s, 0, 0, W, X + s.os, top=T, right=V, tr=R_LOW)
    bowl = frame(s, 0, 0, W - V + 2, yb + m / 2, top=m, left=V, bottom=s.B, tl=R_LOW * 0.7, bl=R_LOW * 0.7)
    return minus(union(arch, bowl), tip(s, 0, X + s.os, T))


def low_b(s, W):
    return union(rect(0, 0, s.V, ASC), _bowl_right(s, W, X, R_LOW))


def low_c(s, W):
    return _c(s, W, X, R_LOW)


def low_d(s, W):
    return _flip(low_b(s, W), W)


def low_e(s, W):
    T, B, V = s.T, s.B, s.V
    ym, m = 0.50 * X, T * 0.92
    up = frame(s, 0, ym - m / 2, W, X + s.os, top=T, right=V, left=V, bottom=m, tl=R_LOW, tr=R_LOW)
    low = frame(s, 0, -s.os, W, ym + m / 2, left=V, bottom=B, bl=R_LOW)
    return minus(union(up, low), tip_r(s, W, B - s.os, B))


def low_f(s, W):
    T, xs = s.T, 0.28 * W
    hook = frame(s, xs, 0, W, ASC, top=T, left=s.V, tl=R_LOW * 0.8)
    return minus(union(hook, rect(0, X - T, 0.88 * W, X)), tip_r(s, W, ASC, T), tip(s, 0, X, T))


def low_g(s, W):
    T, B, V = s.T, s.B, s.V
    bowl = frame(s, 0, -s.os, W, X + s.os, top=T, left=V, bottom=B, tl=R_LOW, bl=R_LOW)
    tail = frame(s, 0, DESC, W, X + s.os, right=V, bottom=B, br=R_LOW)
    return minus(union(bowl, tail), tip(s, 0, DESC + B, B))


def low_h(s, W):
    return union(rect(0, 0, s.V, ASC), _arch(s, 0, W, R_LOW))


def _dot(s, x):
    d = s.dot
    return rect(x - d / 2, X + 100, x + d / 2, X + 100 + d)


def low_i(s, W):
    return union(rect((W - s.V) / 2, 0, (W + s.V) / 2, X), _dot(s, W / 2))


def low_j(s, W):
    V = s.V
    return union(minus(frame(s, 0, DESC, W, X, right=V, bottom=s.B, br=R_LOW * 0.8), tip(s, 0, DESC + s.B, s.B)), _dot(s, W - V / 2))


def low_k(s, W):
    return _k(s, W, X, ASC)


def low_l(s, W):
    return rect((W - s.V) / 2, 0, (W + s.V) / 2, ASC)


def low_m(s, W):
    V, r = s.V, min(R_LOW, 110)
    return union(rect(0, 0, V, X), _arch(s, 0, W / 2 + V / 2, r), _arch(s, W / 2 - V / 2, W, r))


def low_n(s, W):
    return union(rect(0, 0, s.V, X), _arch(s, 0, W, R_LOW))


def low_o(s, W):
    return _o(s, W, X, R_LOW)


def low_p(s, W):
    return union(rect(0, DESC, s.V, X), _bowl_right(s, W, X, R_LOW))


def low_q(s, W):
    return _flip(low_p(s, W), W)


def low_r(s, W):
    arm = frame(s, 0, 0.60 * X, W, X + s.os, top=s.T, right=s.V, tr=R_LOW * 0.8)
    return union(rect(0, 0, s.V, X), arm)


def low_s(s, W):
    return _s(s, W, X, R_LOW, 92)


def low_t(s, W):
    T, B, xs = s.T, s.B, 0.26 * W
    stem = frame(s, xs, -s.os, W, X + 150, left=s.V, bottom=B, bl=R_LOW * 0.8)
    return minus(union(stem, rect(0, X - T, 0.9 * W, X)), tip_r(s, W, B - s.os, B), tip(s, 0, X, T))


def low_u(s, W):
    return union(frame(s, 0, -s.os, W, X, left=s.V, bottom=s.B, bl=R_LOW), rect(W - s.V, 0, W, X))


def low_v(s, W):
    return _v(s, W, X)


def low_w(s, W):
    return _w(s, W, X)


def low_x(s, W):
    return _x(s, W, X)


def low_y(s, W):
    """Drawn as the mirror image: one long stroke, and an arm joining it low."""
    D = s.D
    xa, xb = D * 0.75, 0.70 * W
    arm = _arm(SimpleNamespace(H=X, D=D), W, xa, X, xb, DESC, 0.02 * X)
    return _flip(union(slab(xa, X, xb, DESC, D), arm), W)


def low_z(s, W):
    return _z(s, W, X)


# name, codepoint, width, fn, lsb, rsb
_CAPS = [("A", 720, cap_a, 16, 16), ("B", 610, cap_b, 56, 36), ("C", 650, cap_c, 40, 30), ("D", 650, cap_d, 56, 38),
         ("E", 540, cap_e, 56, 28), ("F", 520, cap_f, 56, 24), ("G", 660, cap_g, 40, 44), ("H", 640, cap_h, 56, 56),
         ("I", 0, cap_i, 56, 56), ("J", 470, cap_j, 22, 56), ("K", 630, cap_k, 56, 12), ("L", 510, cap_l, 56, 20),
         ("M", 780, cap_m, 56, 56), ("N", 650, cap_n, 56, 56), ("O", 700, cap_o, 40, 40), ("P", 590, cap_p, 56, 30),
         ("Q", 700, cap_q, 40, 40), ("R", 620, cap_r, 56, 20), ("S", 600, cap_s, 30, 34), ("T", 600, cap_t, 18, 18),
         ("U", 640, cap_u, 52, 52), ("V", 700, cap_v, 14, 14), ("W", 980, cap_w, 14, 14), ("X", 680, cap_x, 14, 14),
         ("Y", 660, cap_y, 12, 12), ("Z", 600, cap_z, 26, 26)]
_LOWS = [("a", 520, low_a, 32, 52), ("b", 570, low_b, 52, 36), ("c", 510, low_c, 36, 22), ("d", 570, low_d, 36, 52),
         ("e", 540, low_e, 36, 30), ("f", 320, low_f, 16, 10), ("g", 570, low_g, 36, 52), ("h", 540, low_h, 52, 52),
         ("i", 0, low_i, 50, 50), ("j", 180, low_j, 4, 50), ("k", 520, low_k, 52, 10), ("l", 0, low_l, 50, 50),
         ("m", 860, low_m, 52, 52), ("n", 540, low_n, 52, 52), ("o", 570, low_o, 36, 36), ("p", 570, low_p, 52, 36),
         ("q", 570, low_q, 36, 52), ("r", 340, low_r, 52, 16), ("s", 500, low_s, 26, 28), ("t", 360, low_t, 14, 20),
         ("u", 540, low_u, 52, 52), ("v", 560, low_v, 10, 10), ("w", 840, low_w, 10, 10), ("x", 540, low_x, 10, 10),
         ("y", 560, low_y, 10, 10), ("z", 490, low_z, 22, 22)]
LATIN = [(n, ord(n), w, f, l, r) for n, w, f, l, r in _CAPS + _LOWS]
