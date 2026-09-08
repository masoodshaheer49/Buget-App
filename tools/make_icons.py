#!/usr/bin/env python3
"""Generate the Pockets app icons as PNGs, with no image library available.

A full-bleed ink square carrying four paper columns on a baseline - the same
mark the Stats screen draws, legible down to 32px. Full-bleed suits both iOS
(which rounds it itself) and Android maskable icons.
"""
import math
import os
import struct
import zlib

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, "icons")

INK = (12, 14, 15)          # the app's ground, #0C0E0F
PAPER = (240, 242, 241)     # the app's ink-on-dark, #F0F2F1

SS = 4                      # supersampling factor for smooth edges

# Four columns and a baseline: the same mark the Stats screen draws.
BARS = (0.34, 0.58, 0.44, 0.86)


def mark(px, py, size):
    """Paper where the mark is drawn, else None."""
    # Keep the drawing inside the inner 80% so the icon survives masking.
    pad = size * 0.24
    w = size - pad * 2
    base = size - pad                      # baseline y
    rule_h = max(1.0, size * 0.028)

    if base <= py <= base + rule_h and pad <= px <= pad + w:
        return PAPER                       # the baseline

    gap = w * 0.10
    bar_w = (w - gap * (len(BARS) - 1)) / len(BARS)
    for i, h in enumerate(BARS):
        x0 = pad + i * (bar_w + gap)
        if x0 <= px <= x0 + bar_w and base - w * h * 0.86 <= py <= base:
            return PAPER
    return None


def render(size):
    """Return rows of (r,g,b) tuples."""
    rows = []
    inv = 1.0 / (SS * SS)
    for y in range(size):
        row = []
        for x in range(size):
            bg = INK
            # Supersample the foreground so the edges are clean.
            acc_r = acc_g = acc_b = 0.0
            for sy in range(SS):
                py = y + (sy + 0.5) / SS
                for sx in range(SS):
                    px = x + (sx + 0.5) / SS
                    fg = mark(px, py, size)
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
