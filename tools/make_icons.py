# -*- coding: utf-8 -*-
"""
Иконки сайта: apple-touch-icon.png и og-логотип.

Знак повторяет логотип BÜRO: графитовый квадрат, тонкая светлая рамка,
строчная «b» геометрическим гротеском. Century Gothic (GOTHIC.TTF) — самый
близкий к оригиналу шрифт из тех, что есть в Windows.

  python tools/make_icons.py
"""
import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "assets", "static")

INK = (23, 24, 26)
PAPER = (241, 239, 236)

FONTS = [
    r"C:\Windows\Fonts\GOTHIC.TTF",      # Century Gothic — геометрический, как в логотипе
    r"C:\Windows\Fonts\segoeuil.ttf",
    r"C:\Windows\Fonts\arial.ttf",
]


def font(size):
    for path in FONTS:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def mark(size, scale_text=0.62, frame=True):
    im = Image.new("RGB", (size, size), INK)
    d = ImageDraw.Draw(im)
    if frame:
        inset = max(2, round(size * 0.07))
        w = max(1, round(size / 64))
        d.rectangle([inset, inset, size - inset - 1, size - inset - 1], outline=PAPER, width=w)
    f = font(round(size * scale_text))
    box = d.textbbox((0, 0), "b", font=f)
    x = (size - (box[2] - box[0])) / 2 - box[0]
    y = (size - (box[3] - box[1])) / 2 - box[1]
    d.text((x, y), "b", font=f, fill=PAPER)
    return im


def wordmark(w=1200, h=630):
    """Картинка для Open Graph, если понадобится отдельная от фото."""
    im = Image.new("RGB", (w, h), INK)
    d = ImageDraw.Draw(im)
    inset = 40
    d.rectangle([inset, inset, w - inset - 1, h - inset - 1], outline=PAPER, width=2)

    f1 = font(150)
    t1 = "büro"
    b1 = d.textbbox((0, 0), t1, font=f1)
    d.text(((w - (b1[2] - b1[0])) / 2 - b1[0], h / 2 - 120), t1, font=f1, fill=PAPER)

    f2 = font(30)
    t2 = "a r c h i t e c t u r e   &   d e s i g n"
    b2 = d.textbbox((0, 0), t2, font=f2)
    d.text(((w - (b2[2] - b2[0])) / 2 - b2[0], h / 2 + 60), t2, font=f2, fill=(157, 154, 148))
    return im


def main():
    os.makedirs(OUT, exist_ok=True)
    mark(180).save(os.path.join(OUT, "apple-touch-icon.png"), optimize=True)
    mark(512).save(os.path.join(OUT, "icon-512.png"), optimize=True)
    mark(192).save(os.path.join(OUT, "icon-192.png"), optimize=True)
    wordmark().save(os.path.join(OUT, "og-logo.jpg"), quality=88, optimize=True)
    print("Иконки записаны в", OUT)
    for name in sorted(os.listdir(OUT)):
        print(" -", name, os.path.getsize(os.path.join(OUT, name)) // 1024, "KB")


if __name__ == "__main__":
    main()
