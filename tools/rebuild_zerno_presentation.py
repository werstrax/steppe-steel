# -*- coding: utf-8 -*-
"""
Презентация «Ангар для хранения зерна нового поколения» (clean_zerno (4).pdf, 12 слайдов):
слайды — сплошные картинки 2560×1440 с впечатанным текстом. Рендеры зданий заменяются
реальными кадрами съёмки с дрона 24.09.2026; текст, иконки и схемы остаются как есть.
Координаты — в пикселях слайда 2560×1440.
"""
import glob, os
import fitz
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
SRC_PDF = r"C:\Users\Flockyman\Downloads\clean_zerno (4).pdf"
OUT_PDF = os.path.join(HERE, "steppe-steel-zernohranilishcha.pdf")
DRONE = sorted(glob.glob(r"C:/Users/Flockyman/Desktop/stepee steel site/src/assets/img/raw/drone-2026-09-24/foto/*.JPG"))
ORANGE = (240, 122, 30)
FONT = ImageFont.truetype(r"C:\Windows\Fonts\seguisb.ttf", 30)


def photo(n, w, h, ax=0.5, ay=0.5):
    """Кадр №n съёмки, обрезанный под w×h с точкой кадрирования (ax, ay)."""
    im = Image.open(DRONE[n - 1]).convert("RGB")
    W, H = im.size
    ar = w / h
    if W / H > ar:
        nw = round(H * ar); x0 = round((W - nw) * ax); im = im.crop((x0, 0, x0 + nw, H))
    else:
        nh = round(W / ar); y0 = round((H - nh) * ay); im = im.crop((0, y0, W, y0 + nh))
    return im.resize((w, h), Image.LANCZOS)


def bg_color(slide, box):
    """Медианный цвет фона по кольцу вокруг box — для заливки места старого рендера."""
    x0, y0, x1, y1 = box
    px = []
    for x in range(max(0, x0 - 20), min(slide.width, x1 + 20), 7):
        for y in (max(0, y0 - 12), min(slide.height - 1, y1 + 12)):
            px.append(slide.getpixel((x, y)))
    px.sort(key=sum)
    return px[len(px) // 2]


def fill(slide, box, color=None, feather=14):
    color = color or bg_color(slide, box)
    m = Image.new("L", slide.size, 0)
    ImageDraw.Draw(m).rectangle(box, fill=255)
    if feather:
        m = m.filter(ImageFilter.GaussianBlur(feather))
        ImageDraw.Draw(m).rectangle((box[0] + feather, box[1] + feather, box[2] - feather, box[3] - feather), fill=255)
    slide.paste(Image.new("RGB", slide.size, color), (0, 0), m)


def panel(slide, box, n, ax=0.5, ay=0.5, radius=26, border=None, caption="Объект STEPPESTEEL · 2026"):
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    im = photo(n, w, h, ax, ay)
    # мягкая тень
    sh = Image.new("L", slide.size, 0)
    ImageDraw.Draw(sh).rounded_rectangle((x0, y0 + 10, x1, y1 + 10), radius, fill=70)
    sh = sh.filter(ImageFilter.GaussianBlur(22))
    slide.paste(Image.new("RGB", slide.size, (20, 26, 32)), (0, 0), sh)
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), radius, fill=255)
    slide.paste(im, (x0, y0), mask)
    d = ImageDraw.Draw(slide)
    if border:
        d.rounded_rectangle(box, radius, outline=border, width=5)
    if caption:
        tw = d.textlength(caption, font=FONT)
        cx, cy = x0 + 22, y1 - 22 - 48
        chip = Image.new("RGBA", (int(tw) + 36, 48), (16, 25, 31, 200))
        slide.paste(chip, (cx, cy), chip)
        d.rectangle((cx, cy, cx + 5, cy + 47), fill=ORANGE)
        d.text((cx + 20, cy + 5), caption, font=FONT, fill=(255, 255, 255))


def bleed_right(slide, x0, n, ax=0.5, ay=0.5, fade=180, caption="Объект STEPPESTEEL · 2026"):
    """Фото до правого края слайда с плавным переходом слева."""
    w, h = slide.width - x0, slide.height
    im = photo(n, w, h, ax, ay)
    mask = Image.new("L", (w, h), 255)
    md = ImageDraw.Draw(mask)
    for i in range(fade):
        md.line([(i, 0), (i, h)], fill=int(255 * (i / fade) ** 1.3))
    slide.paste(im, (x0, 0), mask)
    if caption:
        d = ImageDraw.Draw(slide)
        tw = d.textlength(caption, font=FONT)
        cx, cy = slide.width - int(tw) - 36 - 40, h - 48 - 40
        chip = Image.new("RGBA", (int(tw) + 36, 48), (16, 25, 31, 200))
        slide.paste(chip, (cx, cy), chip)
        d.rectangle((cx, cy, cx + 5, cy + 47), fill=ORANGE)
        d.text((cx + 20, cy + 5), caption, font=FONT, fill=(255, 255, 255))


def s01(s):  # титул: синий рендер справа → реальное хранилище с дрона
    # заголовок «…зерна» заканчивается на x≈1360 (y 150–370), карточки — на x≈915;
    # рендер наверху начинается правее x≈1410, внизу — от x≈900
    x0 = 900
    w, h = s.width - x0, s.height
    im = photo(36, w, h, ax=0.5, ay=0.55)
    mask = Image.new("L", (w, h), 0)
    px = mask.load()
    for y in range(h):
        t = min(1, max(0, (y - 400) / 220))            # 0 наверху, 1 ниже y=620
        start = (1400 - x0) * (1 - t) + (1000 - x0) * t  # где начинается переход
        for x in range(w):
            k = (x - start) / 170
            px[x, y] = 0 if k <= 0 else 255 if k >= 1 else int(255 * k ** 1.2)
    s.paste(im, (x0, 0), mask)
    d = ImageDraw.Draw(s)
    cap = "Объект STEPPESTEEL · 2026"
    tw = d.textlength(cap, font=FONT)
    cx, cy = s.width - int(tw) - 36 - 40, h - 48 - 40
    chip = Image.new("RGBA", (int(tw) + 36, 48), (16, 25, 31, 200))
    s.paste(chip, (cx, cy), chip)
    d.rectangle((cx, cy, cx + 5, cy + 47), fill=ORANGE)
    d.text((cx + 20, cy + 5), cap, font=FONT, fill=(255, 255, 255))


def s06(s):  # «Быстрая поставка»: рендер каркаса сверху справа → каркас на объекте
    c = bg_color(s, (1100, 0, 2560, 660))
    fill(s, (1100, 0, 2560, 662), c)
    fill(s, (1600, 0, 2560, 772), c)
    fill(s, (2440, 700, 2560, 1120), c, feather=6)
    fill(s, (1550, 640, 1610, 780), c, feather=6)
    fill(s, (1760, 730, 2095, 905), c, feather=8)
    panel(s, (1180, 50, 2500, 640), 67, ax=0.5, ay=0.55, caption="Каркас на объекте · 2026")


def s08(s):  # «Надёжность конструкции»: рендер узла → реальные фермы каркаса
    c = bg_color(s, (820, 0, 2560, 798))
    fill(s, (820, 0, 2560, 798), c)
    fill(s, (560, 380, 820, 798), c)
    panel(s, (880, 40, 2460, 770), 18, ax=0.5, ay=0.35, caption="Фермы каркаса STEPPESTEEL · 2026")


def s10(s):  # «Инвестиции, которые не теряются»: рендер узла → болтовая сборка на объекте
    c = bg_color(s, (1230, 0, 2560, 1440))
    fill(s, (1230, 0, 2560, 1440), c)
    fill(s, (1168, 990, 1230, 1440), c)
    panel(s, (1300, 60, 2500, 1380), 11, ax=0.45, ay=0.5, caption="Болтовая сборка на объекте · 2026")


def s11(s):  # «Продумано до миллиметра»: коллаж рендеров → три кадра объекта
    c = bg_color(s, (0, 520, 2560, 1440))
    fill(s, (0, 520, 2560, 1440), c)
    fill(s, (1480, 0, 2560, 520), c)
    fill(s, (780, 340, 1500, 540), c)
    panel(s, (110, 560, 1440, 1360), 36, ax=0.5, ay=0.55, border=ORANGE)
    panel(s, (1560, 90, 2460, 700), 67, ax=0.55, ay=0.5, border=ORANGE, caption="Каркас · 2026")
    panel(s, (1560, 780, 2460, 1360), 37, ax=0.5, ay=0.5, border=ORANGE, caption="Зерно под фермами · 2026")


def s12(s):  # «Почему это выгоднее»: синий рендер слева → готовое хранилище с дрона
    c = bg_color(s, (0, 250, 1470, 1400))
    fill(s, (0, 250, 1470, 1400), c)
    panel(s, (60, 300, 1400, 1340), 33, ax=0.55, ay=0.5)


EDITS = {1: s01, 6: s06, 8: s08, 10: s10, 11: s11, 12: s12}

src = fitz.open(SRC_PDF)
out = fitz.open()
for pno, page in enumerate(src, start=1):
    xref = [i[0] for i in page.get_images(full=True) if page.get_image_rects(i[0])][0]
    pix = fitz.Pixmap(src, xref)
    if pix.n > 3:
        pix = fitz.Pixmap(fitz.csRGB, pix)
    slide = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    if pno in EDITS:
        EDITS[pno](slide)
    jpg = os.path.join(HERE, f"new-s{pno:02d}.jpg")
    slide.save(jpg, quality=88, optimize=True, progressive=True)
    p = out.new_page(width=page.rect.width, height=page.rect.height)
    p.insert_image(p.rect, filename=jpg)
out.set_metadata({"title": "STEPPESTEEL — зернохранилище нового поколения", "author": "STEPPESTEEL", "subject": "Напольное зернохранилище на стальном каркасе завода"})
out.save(OUT_PDF, garbage=4, deflate=True)
print("готово:", OUT_PDF, round(os.path.getsize(OUT_PDF) / 1e6, 1), "МБ,", out.page_count, "стр.")
