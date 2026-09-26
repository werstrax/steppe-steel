# -*- coding: utf-8 -*-
"""
OG-картинка сайта (1200×630) из реального кадра цеха — без нейросетей.

Фон — цех завода (raw/prod-baza.png), слева графитовый градиент, поверх —
составной знак STEPPE / STEEL / INDUSTRIAL STANDARD с оранжевой линией
и формула ТЗ §5. Фон именно цех, а не объект с дрона: адрес завода в подписи
не должен читаться как регион объекта съёмки.

  python tools/make_og.py                 # пишет src/assets/img/raw/og-default.png
  python tools/optimize_images.py og-default   # ТОЛЬКО с именем, без --force

Перед оптимизатором удалить старые src/assets/img/og-default-*.{webp,jpg},
иначе он пропустит слот как уже готовый.
"""
import math
import os
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "src", "assets", "img", "raw")
SRC = os.path.join(RAW, "prod-baza.png")
OUT = os.path.join(RAW, "og-default.png")

W, H = 1200, 630
X = 72
GRAPHITE = (16, 25, 31)        # #10191f
ORANGE = (244, 123, 54)        # #f47b36
WHITE = (255, 255, 255)
MUTED = (165, 173, 179)        # #a5adb3
SOFT = (214, 220, 224)         # #d6dce0

BAHN = "C:/Windows/Fonts/bahnschrift.ttf"
ARIAL_B = "C:/Windows/Fonts/arialbd.ttf"
ARIAL = "C:/Windows/Fonts/arial.ttf"


def font(size, weight="Bold"):
    """Bahnschrift нужной начертанки; запасной — Arial (Bold для Bold/SemiBold)."""
    if os.path.exists(BAHN):
        f = ImageFont.truetype(BAHN, size)
        try:
            f.set_variation_by_name(weight)
            return f
        except Exception:
            pass
    return ImageFont.truetype(ARIAL_B if weight in ("Bold", "SemiBold") else ARIAL, size)


def cover(im, w, h, ax=0.6, ay=0.5):
    """Кроп «cover» с якорем ax/ay (доли свободного поля)."""
    k = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    left = round((im.width - w) * ax)
    top = round((im.height - h) * ay)
    return im.crop((left, top, left + w, top + h))


def tracked(draw, xy, text, f, fill, tracking):
    """Текст вразрядку: tracking — в долях кегля. Возвращает ширину без хвоста."""
    x, y = xy
    size = f.size
    for i, ch in enumerate(text):
        draw.text((x, y), ch, font=f, fill=fill)
        x += draw.textlength(ch, font=f)
        if i < len(text) - 1:
            x += size * tracking
    return x - xy[0]


def main():
    if not os.path.exists(SRC):
        sys.exit("Нет исходника: " + SRC)

    bg = cover(Image.open(SRC).convert("RGB"), W, H, 0.6, 0.5)

    # Графитовый градиент слева: сплошной 0–460 px, к 860 px — прозрачный.
    shade = Image.new("RGBA", (W, H), GRAPHITE + (0,))
    px = shade.load()
    for x in range(W):
        if x <= 460:
            a = 255
        elif x >= 860:
            a = 0
        else:
            # косинусный спад: без видимой кромки на 460 px
            t = (x - 460) / 400
            a = round(255 * (0.5 + 0.5 * math.cos(math.pi * t)))
        for y in range(H):
            px[x, y] = GRAPHITE + (a,)
    img = Image.alpha_composite(bg.convert("RGBA"), shade)
    d = ImageDraw.Draw(img)

    # Знак: STEPPE вразрядку над STEEL, оранжевая линия во всю ширину STEEL.
    f_steel = font(96, "Bold")
    f_steppe = font(30, "Bold")
    steel_w = d.textlength("STEEL", font=f_steel)
    steel_box = d.textbbox((0, 0), "STEEL", font=f_steel)

    y_steppe = 64
    # STEPPE центрируется над STEEL, как на знаке заказчика
    steppe_w = sum(d.textlength(c, font=f_steppe) for c in "STEPPE") + 5 * 30 * 0.5
    tracked(d, (X + (steel_w - steppe_w) / 2, y_steppe), "STEPPE", f_steppe, WHITE, 0.5)

    y_steel = y_steppe + 30
    d.text((X - steel_box[0], y_steel), "STEEL", font=f_steel, fill=WHITE)
    steel_bottom = y_steel + steel_box[3]
    y_line = steel_bottom + 12
    d.rectangle((X, y_line, X + steel_w, y_line + 7), fill=ORANGE)

    f_tag = font(15, "SemiBold")
    tag = "INDUSTRIAL STANDARD"
    tag_w = sum(d.textlength(c, font=f_tag) for c in tag) + (len(tag) - 1) * 15 * 0.2
    tracked(d, (X + (steel_w - tag_w) / 2, y_line + 20), tag, f_tag, MUTED, 0.2)

    # Формула ТЗ §5: заголовок, подзаголовок, адрес завода.
    f_h = font(42, "SemiBold")
    y = 350
    for line in ("Завод строительных", "металлоконструкций"):
        d.text((X, y), line, font=f_h, fill=WHITE)
        y += round(42 * 1.1)

    f_sub = font(21, "Regular")
    d.text((X, 470), "Проектирование. Производство. Комплектная поставка.", font=f_sub, fill=SOFT)

    f_addr = font(16, "Regular")
    d.rectangle((X, 548, X + 28, 550), fill=ORANGE)
    d.text((X, 562), "с. Троебратское, Узункольский район, Костанайская область · steppesteel.kz",
           font=f_addr, fill=MUTED)

    img.convert("RGB").save(OUT, "PNG", optimize=True)
    print("ok", OUT, img.size)


if __name__ == "__main__":
    main()
