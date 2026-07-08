#!/usr/bin/env python3
"""Genera le immagini raster (og-image + icone) dagli asset del portfolio.
Serve un PNG perché i social/iOS non renderizzano SVG per og:image / apple-touch.
Uso: python3 scripts/gen-images.py   (richiede Pillow)
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "assets")

MONO_CANDIDATES = [
    "/System/Library/Fonts/Menlo.ttc",
    "/System/Library/Fonts/SFNSMono.ttf",
    "/System/Library/Fonts/Monaco.dfont",
    "/Library/Fonts/Andale Mono.ttf",
    "/System/Library/Fonts/Supplemental/Andale Mono.ttf",
    "/System/Library/Fonts/Supplemental/Courier New Bold.ttf",
]


def font(size):
    for p in MONO_CANDIDATES:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    try:
        return ImageFont.load_default(size=size)
    except Exception:
        return ImageFont.load_default()


BG = (10, 14, 10)
WIN = (0, 0, 0)
BORDER = (51, 255, 51)
TITLEBAR = (14, 26, 14)
GREEN = (51, 255, 51)
BRIGHT = (234, 255, 240)
SOFT = (188, 210, 188)
CYAN = (86, 211, 236)
TITLE = (143, 223, 143)


def make_og():
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([90, 88, 1110, 542], radius=18, fill=WIN, outline=BORDER, width=2)
    d.rectangle([92, 118, 1108, 144], fill=WIN)
    d.rounded_rectangle([90, 88, 1110, 144], radius=18, outline=None, fill=None)
    d.rectangle([92, 90, 1108, 143], fill=TITLEBAR)
    for i, col in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        d.ellipse([120 + i * 30 - 9, 107, 120 + i * 30 + 9, 125], fill=col)
    tb = font(20)
    tt = "alessio@portfolio — zsh"
    w = d.textlength(tt, font=tb)
    d.text(((W - w) / 2, 106), tt, font=tb, fill=TITLE)
    d.text((132, 210), "welcome@portfolio:~$ whoami", font=font(26), fill=GREEN)
    d.text((132, 262), "Alessio Iodice", font=font(56), fill=BRIGHT)
    d.text((132, 338), "QA Automation Engineer · Mobile Developer", font=font(28), fill=SOFT)
    d.text((132, 388), "Madrid, Spain · Apple Developer Academy Alumni", font=font(22), fill=CYAN)
    d.text((132, 456), "welcome@portfolio:~$ _", font=font(24), fill=GREEN)
    out = os.path.join(ASSETS, "og-image.png")
    img.save(out)
    print("wrote", out, img.size)


def make_icon(size, path):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    r = int(size * 0.19)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=BG)
    f = font(int(size * 0.42))
    d.text((size * 0.17, size * 0.24), ">_", font=f, fill=GREEN)
    img.save(path)
    print("wrote", path, img.size)


if __name__ == "__main__":
    make_og()
    make_icon(180, os.path.join(ASSETS, "apple-touch-icon.png"))
    make_icon(512, os.path.join(ASSETS, "icon-512.png"))
