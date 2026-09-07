#!/usr/bin/env python3
"""Build the Artifact-hosted copy of the app from index.html.

Claude Artifacts wrap the file you publish in their own
`<!doctype html><head>…</head><body>` skeleton, so the published page must
contain body content only. Rather than maintain a second copy of a 2000-line
app, this derives it from index.html:

  * keep everything from the BUILD:ARTIFACT-START marker onwards
  * drop the `</head>` / `<body>` seam and the closing `</body></html>`
  * drop the service-worker registration (there is no sw.js to register)
  * put a `<title>` at the top, which is what names the artifact

Everything else - the styles, the theme resolver, the app - is shared, so the
two builds cannot drift apart.

    python3 tools/build_artifact.py
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, os.pardir))
SRC = os.path.join(ROOT, "index.html")
DST = os.path.join(ROOT, "artifact", "pockets.html")

TITLE = "Pockets"
START = "<!-- BUILD:ARTIFACT-START"


def build(src_text):
    start = src_text.find(START)
    if start < 0:
        raise SystemExit("index.html is missing the %s marker" % START)
    # Skip past the marker comment itself.
    start = src_text.index("-->", start) + len("-->")

    end = src_text.rfind("</body>")
    if end < 0:
        raise SystemExit("index.html is missing </body>")
    body = src_text[start:end]

    # The head/body seam sits in the middle of the region we copied.
    seam = re.search(r"\n</head>\s*\n<body>\n", body)
    if not seam:
        raise SystemExit("could not find the </head><body> seam")
    body = body[: seam.start()] + "\n" + body[seam.end():]

    # The service worker only exists in the standalone build.
    body = re.sub(
        r"\n?/\* BUILD:SW-START.*?BUILD:SW-END \*/\n",
        "\n",
        body,
        flags=re.S,
    )

    if "BUILD:SW" in body or "</head>" in body or "<body>" in body:
        raise SystemExit("build left document-level markup behind")

    return "<title>%s</title>\n%s" % (TITLE, body.strip("\n")) + "\n"


def main():
    with open(SRC, encoding="utf-8") as fh:
        out = build(fh.read())
    os.makedirs(os.path.dirname(DST), exist_ok=True)
    with open(DST, "w", encoding="utf-8") as fh:
        fh.write(out)
    print("wrote %s (%d bytes)" % (os.path.relpath(DST, ROOT), len(out.encode("utf-8"))))
    return 0


if __name__ == "__main__":
    sys.exit(main())
