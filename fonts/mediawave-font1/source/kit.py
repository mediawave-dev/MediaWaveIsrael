"""Outline construction kit: letters are drawn as outer shapes minus inner shapes.

A frame is a rounded rectangle minus an inset rounded rectangle. Because the
inner corner radii are the outer radii minus each side's own thickness, a
corner turns smoothly from the thick horizontal into the thin vertical (the
stress of the Hebrew square letter), instead of a translated arc.
"""
import pathops

OPEN = 600


def _r(r):
    return (float(r[0]), float(r[1])) if isinstance(r, tuple) else (float(r), float(r))


def rrect(x0, y0, x1, y1, tl=0, tr=0, br=0, bl=0, k=0.6):
    """Rounded rectangle; each corner a radius or (rx, ry); k is the handle
    factor (0.5523 is a circle, larger is squarer)."""
    tl, tr, br, bl = _r(tl), _r(tr), _r(br), _r(bl)
    p = pathops.Path()
    p.moveTo(x0 + tl[0], y1)
    p.lineTo(x1 - tr[0], y1)
    if tr[0] > 0:
        p.cubicTo(x1 - tr[0] + k * tr[0], y1, x1, y1 - tr[1] + k * tr[1], x1, y1 - tr[1])
    p.lineTo(x1, y0 + br[1])
    if br[0] > 0:
        p.cubicTo(x1, y0 + br[1] - k * br[1], x1 - br[0] + k * br[0], y0, x1 - br[0], y0)
    p.lineTo(x0 + bl[0], y0)
    if bl[0] > 0:
        p.cubicTo(x0 + bl[0] - k * bl[0], y0, x0, y0 + bl[1] - k * bl[1], x0, y0 + bl[1])
    p.lineTo(x0, y1 - tl[1])
    if tl[0] > 0:
        p.cubicTo(x0, y1 - tl[1] + k * tl[1], x0 + tl[0] - k * tl[0], y1, x0 + tl[0], y1)
    p.close()
    return p


def rect(x0, y0, x1, y1):
    return rrect(min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1))


def poly(pts):
    p = pathops.Path()
    p.moveTo(*pts[0])
    for pt in pts[1:]:
        p.lineTo(*pt)
    p.close()
    return p


def union(*paths):
    acc = pathops.Path()
    for p in paths:
        acc = pathops.op(acc, p, pathops.PathOp.UNION)
    return acc


def minus(a, *bs):
    for b in bs:
        a = pathops.op(a, b, pathops.PathOp.DIFFERENCE)
    return a


def _inner(r, dx, dy):
    rx, ry = _r(r)
    if rx <= 0 or dx is None or dy is None:
        return 0
    a, b = rx - dx, ry - dy
    if a <= 1:
        return 0
    # keep the counter corner from going flat: never less than half as tall as wide
    return (a, max(b, 0.5 * a))


def frame(s, x0, y0, x1, y1, top=None, right=None, bottom=None, left=None,
          tl=0, tr=0, br=0, bl=0):
    """Outer rounded box minus the counter. A side given a thickness is
    closed; a side left None is open (the counter cuts through it)."""
    outer = rrect(x0, y0, x1, y1, tl, tr, br, bl, s.k)
    ix0 = x0 + left if left is not None else x0 - OPEN
    ix1 = x1 - right if right is not None else x1 + OPEN
    iy0 = y0 + bottom if bottom is not None else y0 - OPEN
    iy1 = y1 - top if top is not None else y1 + OPEN
    inner = rrect(ix0, iy0, ix1, iy1,
                  _inner(tl, left, top), _inner(tr, right, top),
                  _inner(br, right, bottom), _inner(bl, left, bottom), s.k)
    return minus(outer, inner)


def slab(xa, ya, xb, yb, w):
    """A straight stroke between two heights with horizontal end cuts.
    (xa, ya) and (xb, yb) are centre points; w is the perpendicular width."""
    dx, dy = xb - xa, yb - ya
    length = (dx * dx + dy * dy) ** 0.5
    half = w / 2 * length / abs(dy)  # horizontal half-width that gives w across
    return poly([(xa - half, ya), (xa + half, ya), (xb + half, yb), (xb - half, yb)])


def x_at(xa, ya, xb, yb, y):
    return xa + (xb - xa) * (y - ya) / (yb - ya)


def fillet(x, y, r, qx, qy, k=0.5523):
    """A concave bracket in the inside corner at (x, y), reaching r along +qx
    and +qy (each +1 or -1). Softens a thin stem meeting a thick bar."""
    ax, ay = x + qx * r, y          # along the bar
    bx, by = x, y + qy * r          # along the stem
    p = pathops.Path()
    p.moveTo(x, y)
    p.lineTo(ax, ay)
    p.cubicTo(ax - qx * k * r, ay, bx, by - qy * k * r, bx, by)
    p.close()
    return p


def flag(s, x0, y_top):
    """The signature cut: the underside of a top bar's left tip rises in one
    soft curve to a fine point, like the first touch of a broad pen.
    Returns the piece to remove."""
    yb = y_top - s.T
    fl, fd = s.flag_l, s.flag_d
    p = pathops.Path()
    p.moveTo(x0 - 2, yb - 2)
    p.lineTo(x0 + fl + 2, yb - 2)
    p.lineTo(x0 + fl, yb)
    p.cubicTo(x0 + 0.55 * fl, yb, x0 + 0.22 * fl, yb + 0.30 * fd, x0, yb + fd)
    p.lineTo(x0 - 2, yb + fd)
    p.close()
    return p
