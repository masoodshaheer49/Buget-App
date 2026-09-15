#!/usr/bin/env python3
"""Generate the Pockets app icons as PNGs, with no image library available.

The app's own mark: a paper docket on the warm ground, carrying a pocket
outlined in ink with a perforation across it — the same shape the header
draws. Full-bleed, which suits both iOS (which rounds it itself) and Android
maskable icons; everything sits inside the middle 80% so masking never bites.

    python3 tools/make_icons.py
"""
import os
import struct
import zlib

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, "icons")

SHELL = (228, 221, 204)     # --shell, #E4DDCC
PAPER = (250, 246, 236)     # --paper, #FAF6EC
INK = (42, 38, 34)          # --ink,   #2A2622

SS = 4                      # supersampling factor for smooth edges

# Geometry in fractions of the icon, lifted from the design's own thumbnail.
CARD = (0.250, 0.283, 0.750, 0.717)     # x0, y0, x1, y1
CARD_R = 0.025
POCK = (0.275, 0.342, 0.725, 0.600)     # the pocket outline
POCK_R = 0.083                          # bottom corners only
POCK_W = 0.025                          # stroke
PERF_Y = 0.400                          # the dashed rule
PERF_W = 0.017
PERF_ON, PERF_OFF = 0.025, 0.028


def in_rounded(px, py, box, r, bottom_only=False):
    """Inside a rectangle whose corners are rounded by r."""
    x0, y0, x1, y1 = box
    if px < x0 or px > x1 or py < y0 or py > y1:
        return False
    if r <= 0:
        return True
    corners = [(x0 + r, y1 - r), (x1 - r, y1 - r)]
    if not bottom_only:
        corners += [(x0 + r, y0 + r), (x1 - r, y0 + r)]
    for cx, cy in corners:
        # Only the quadrant outside the inner cross needs the circle test.
        if (px < cx) == (cx == x0 + r) and (py < cy) == (cy == y0 + r):
            if (px - cx) ** 2 + (py - cy) ** 2 > r * r:
                return False
    return True


def mark(px, py):
    """Ink, paper or None (the ground), at a point in 0..1 space."""
    on_card = in_rounded(px, py, CARD, CARD_R)
    if not on_card:
        return None

    # The pocket, as a stroke: inside the outline but not inside the inset.
    x0, y0, x1, y1 = POCK
    inset = (x0 + POCK_W, y0 + POCK_W, x1 - POCK_W, y1 - POCK_W)
    if in_rounded(px, py, POCK, POCK_R, bottom_only=True) \
            and not in_rounded(px, py, inset, max(0.0, POCK_R - POCK_W), bottom_only=True):
        return INK

    # The perforation, dashed the way every rule in the app is.
    if abs(py - PERF_Y) <= PERF_W / 2 and x0 <= px <= x1:
        period = PERF_ON + PERF_OFF
        if ((px - x0) % period) < PERF_ON:
            return INK

    return PAPER


def render(size):
    """Rows of (r, g, b) tuples, supersampled so the curves stay clean."""
    rows = []
    step = 1.0 / (size * SS)
    for y in range(size):
        row = []
        for x in range(size):
            r = g = b = 0
            for sy in range(SS):
                py = (y * SS + sy + 0.5) * step
                for sx in range(SS):
                    px = (x * SS + sx + 0.5) * step
                    c = mark(px, py) or SHELL
                    r += c[0]; g += c[1]; b += c[2]
            n = SS * SS
            row.append((r // n, g // n, b // n))
        rows.append(row)
    return rows


def write_png(path, rows):
    size = len(rows)
    raw = bytearray()
    for row in rows:
        raw.append(0)                      # filter type 0 (None)
        for px in row:
            raw += bytes(px)

    def chunk(tag, data):
        return (struct.pack(">I", len(data)) + tag + data
                + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF))

    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
           + chunk(b"IEND", b""))
    with open(path, "wb") as fh:
        fh.write(png)


def main():
    os.makedirs(OUT, exist_ok=True)
    for size in (180, 192, 512):
        path = os.path.join(OUT, "icon-%d.png" % size)
        write_png(path, render(size))
        print("wrote icons/icon-%d.png" % size)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
