#!/usr/bin/env python3
"""Generate the Pockets app icons as PNGs, with no image library available.

Draws a full-bleed indigo->blue gradient square with an open donut ring
(a white arc plus a mint arc) - a budget split, readable at 32px.
Full-bleed square works for both iOS (which rounds it itself) and Android
maskable icons.
"""
import math
import os
import struct
import zlib

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, "icons")

GRAD_A = (99, 91, 255)      # #635bff
GRAD_B = (47, 107, 255)     # #2f6bff
WHITE = (255, 255, 255)
MINT = (123, 243, 196)      # #7bf3c4

SS = 4                      # supersampling factor for smooth edges


def lerp(a, b, t):
    return a + (b - a) * t


def ring_color(px, py, size):
    """Colour of the foreground at a point, or None if outside the ring."""
    cx = cy = size / 2.0
    r_out = size * 0.315
    r_in = size * 0.195
    dx, dy = px - cx, py - cy
    dist = math.hypot(dx, dy)
    if dist > r_out or dist < r_in:
        return None
    ang = math.degrees(math.atan2(dx, -dy)) % 360.0
    if ang <= 250.0:
        return WHITE
    if 262.0 <= ang <= 352.0:
        return MINT
    return None


def render(size):
    """Return rows of (r,g,b) tuples."""
    rows = []
    inv = 1.0 / (SS * SS)
    for y in range(size):
        row = []
        for x in range(size):
            # Background gradient along the top-left -> bottom-right diagonal.
            t = (x + y) / (2.0 * (size - 1))
            bg = (lerp(GRAD_A[0], GRAD_B[0], t),
                  lerp(GRAD_A[1], GRAD_B[1], t),
                  lerp(GRAD_A[2], GRAD_B[2], t))
            # Supersample the foreground so the arcs get antialiased edges.
            acc_r = acc_g = acc_b = 0.0
            for sy in range(SS):
                py = y + (sy + 0.5) / SS
                for sx in range(SS):
                    px = x + (sx + 0.5) / SS
                    fg = ring_color(px, py, size)
                    if fg is None:
                        acc_r += bg[0]; acc_g += bg[1]; acc_b += bg[2]
                    else:
                        acc_r += fg[0]; acc_g += fg[1]; acc_b += fg[2]
            row.append((int(acc_r * inv + 0.5),
                        int(acc_g * inv + 0.5),
                        int(acc_b * inv + 0.5)))
        rows.append(row)
    return rows


def chunk(tag, data):
    return (struct.pack(">I", len(data)) + tag + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF))


def write_png(path, rows):
    size = len(rows)
    raw = bytearray()
    for row in rows:
        raw.append(0)                      # filter type 0 (None)
        for r, g, b in row:
            raw += bytes((r, g, b))
    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
           + chunk(b"IEND", b""))
    with open(path, "wb") as fh:
        fh.write(png)
    return len(png)


def main():
    os.makedirs(OUT, exist_ok=True)
    for size in (180, 192, 512):
        path = os.path.join(OUT, "icon-%d.png" % size)
        n = write_png(path, render(size))
        print("wrote %s (%d bytes)" % (os.path.normpath(path), n))


if __name__ == "__main__":
    main()
