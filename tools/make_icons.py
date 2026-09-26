# -*- coding: utf-8 -*-
"""
Иконки сайта STEPPESTEEL: apple-touch-icon.png (180), icon-192.png, icon-512.png.

Знак — тот же, что в шапке, подвале и OG (tools/make_og.py): на графите
#10191f STEPPE вразрядку над крупным STEEL, под STEEL оранжевая линия
#f47b36 во всю ширину слова. Слоган INDUSTRIAL STANDARD на иконке не
пишется — в 180 px он нечитаем. Содержимое укладывается в центральные ~64 %
квадрата: icon-512 объявлена maskable (Android режет её кругом).

Фавикон — отдельный векторный src/assets/static/favicon.svg (знак «S» из
прямоугольников и та же оранжевая линия), его этот скрипт не трогает.

  python tools/make_icons.py
"""
import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "assets", "static")

GRAPHITE = (16, 25, 31)        # #10191f
ORANGE = (244, 123, 54)        # #f47b36
WHITE = (255, 255, 255)

BAHN = "C:/Windows/Fonts/bahnschrift.ttf"
ARIAL_B = "C:/Windows/Fonts/arialbd.ttf"


def font(size):
    """Bahnschrift Bold, как в OG-картинке; запасной — Arial Bold."""
    if os.path.exists(BAHN):
        f = ImageFont.truetype(BAHN, size)
        try:
            f.set_variation_by_name("Bold")
            return f
        except Exception:
            pass
    return ImageFont.truetype(ARIAL_B, size)


def tracked_width(draw, text, f, tracking):
    return sum(draw.textlength(c, font=f) for c in text) + (len(text) - 1) * f.size * tracking


def tracked(draw, xy, text, f, fill, tracking):
    x, y = xy
    for i, ch in enumerate(text):
        draw.text((x, y), ch, font=f, fill=fill)
        x += draw.textlength(ch, font=f)
        if i < len(text) - 1:
            x += f.size * tracking


def mark(size, safe=0.64):
    """Составной знак по центру квадрата; ширина STEEL = safe × size."""
    k = 4  # рисуем в 4× и уменьшаем — ровные края букв
    S = size * k
    im = Image.new("RGB", (S, S), GRAPHITE)
    d = ImageDraw.Draw(im)

    target = S * safe
    # кегль STEEL подбирается под нужную ширину
    fs = int(S * 0.3)
    f_steel = font(fs)
    while d.textlength("STEEL", font=f_steel) > target and fs > 8:
        fs -= 2
        f_steel = font(fs)
    steel_w = d.textlength("STEEL", font=f_steel)
    sb = d.textbbox((0, 0), "STEEL", font=f_steel)
    steel_h = sb[3] - sb[1]

    # STEPPE вразрядку — той же ширины, что STEEL
    tr = 0.5
    fp = max(8, int(fs * 0.3))
    f_steppe = font(fp)
    while tracked_width(d, "STEPPE", f_steppe, tr) > steel_w and fp > 6:
        fp -= 1
        f_steppe = font(fp)
    steppe_w = tracked_width(d, "STEPPE", f_steppe, tr)
    pb = d.textbbox((0, 0), "STEPPE", font=f_steppe)
    steppe_h = pb[3] - pb[1]

    gap1 = fs * 0.16          # STEPPE → STEEL
    gap2 = fs * 0.16          # STEEL → линия
    line_h = max(k * 2, fs * 0.075)
    total = steppe_h + gap1 + steel_h + gap2 + line_h

    x0 = (S - steel_w) / 2
    y = (S - total) / 2
    tracked(d, ((S - steppe_w) / 2 - pb[0], y - pb[1]), "STEPPE", f_steppe, WHITE, tr)
    y += steppe_h + gap1
    d.text((x0 - sb[0], y - sb[1]), "STEEL", font=f_steel, fill=WHITE)
    y += steel_h + gap2
    d.rectangle((x0, y, x0 + steel_w, y + line_h), fill=ORANGE)

    return im.resize((size, size), Image.LANCZOS)


def main():
    os.makedirs(OUT, exist_ok=True)
    mark(180, safe=0.70).save(os.path.join(OUT, "apple-touch-icon.png"), optimize=True)
    mark(192, safe=0.66).save(os.path.join(OUT, "icon-192.png"), optimize=True)
    mark(512, safe=0.60).save(os.path.join(OUT, "icon-512.png"), optimize=True)
    print("Иконки записаны в", OUT)
    for name in ("apple-touch-icon.png", "icon-192.png", "icon-512.png"):
        print(" -", name, os.path.getsize(os.path.join(OUT, name)) // 1024, "KB")


if __name__ == "__main__":
    main()
