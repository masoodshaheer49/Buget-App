#!/usr/bin/env python3
"""Inline the app's typefaces into index.html as base64 woff2.

The app has to work with no signal, and a <link> to fonts.googleapis.com does
not. So the latin subsets are fetched once and embedded between the FONTS
markers in index.html, which keeps the standalone build, the GitHub Pages
build and the Artifact build looking identical whether or not there is a
network.

    python3 tools/embed_fonts.py

Re-run only when the type choices change; the result is committed.
"""
import base64
import os
import re
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, os.pardir))
INDEX = os.path.join(ROOT, "index.html")

# Archivo: a 19th-century American grotesque, carrying the language.
# IBM Plex Mono: the ledger voice — every figure, label and date aligns.
CSS_URL = ("https://fonts.googleapis.com/css2"
           "?family=Archivo:wght@400..700"
           "&family=IBM+Plex+Mono:wght@400;500"
           "&display=swap")

# A modern UA is what makes Google serve woff2 rather than ttf.
UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

KEEP_SUBSETS = {"latin", "latin-ext"}

START = "/* FONTS:START */"
END = "/* FONTS:END */"


def fetch(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    return data if binary else data.decode("utf-8")


def main():
    css = fetch(CSS_URL)

    # Google emits "/* subset */\n@font-face { ... }" blocks in order.
    blocks = re.findall(r"/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{.*?\})", css, re.S)
    if not blocks:
        raise SystemExit("could not parse the Google Fonts CSS")

    out = [START,
           "/* Archivo + IBM Plex Mono, latin subsets, embedded so the app keeps",
           "   its typography with no network. Regenerate: tools/embed_fonts.py */"]
    kept = 0
    total = 0
    for subset, block in blocks:
        if subset not in KEEP_SUBSETS:
            continue
        m = re.search(r"url\((https://[^)]+\.woff2)\)", block)
        if not m:
            continue
        raw = fetch(m.group(1), binary=True)
        total += len(raw)
        b64 = base64.b64encode(raw).decode("ascii")
        block = block.replace(
            m.group(0), "url(data:font/woff2;base64,%s)" % b64)
        # Drop the comment-only noise and keep the declaration compact.
        out.append(re.sub(r"\s*\n\s*", " ", block).strip())
        kept += 1
    out.append(END)

    with open(INDEX, encoding="utf-8") as fh:
        html = fh.read()
    if START not in html or END not in html:
        raise SystemExit("index.html is missing the FONTS markers")

    new = html[:html.index(START)] + "\n".join(out) + html[html.index(END) + len(END):]
    with open(INDEX, "w", encoding="utf-8") as fh:
        fh.write(new)

    print("embedded %d font files (%.0f KB raw) into index.html" % (kept, total / 1024.0))
    return 0


if __name__ == "__main__":
    sys.exit(main())
