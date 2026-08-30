# -*- coding: utf-8 -*-
"""
Оптимизация изображений сайта BURO.

Берёт исходники из src/assets/img/raw/*.png и делает из каждого:
  • WebP в нескольких ширинах (для srcset)
  • JPEG-фолбэк (для старых браузеров и Open Graph)
  • крошечный размытый плейсхолдер (LQIP) в base64
  • запись в манифест src/data/images.json — размеры, соотношение, LQIP

Требуется только Pillow (уже установлен).

  python tools/optimize_images.py           # обработать новые
  python tools/optimize_images.py --force   # пересобрать всё
"""
import base64, io, json, os, sys

from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "src", "assets", "img", "raw")
OUT = os.path.join(ROOT, "src", "assets", "img")
MANIFEST = os.path.join(ROOT, "src", "data", "images.json")

WIDTHS = [1536, 1152, 864, 576, 384]
WEBP_Q = 76
JPEG_Q = 80
LQIP_W = 20


def lqip(im):
    small = im.convert("RGB").resize((LQIP_W, max(1, round(LQIP_W * im.height / im.width))), Image.LANCZOS)
    small = small.filter(ImageFilter.GaussianBlur(0.6))
    buf = io.BytesIO()
    small.save(buf, "WEBP", quality=42, method=6)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


def main():
    force = "--force" in sys.argv
    os.makedirs(OUT, exist_ok=True)

    manifest = {}
    if os.path.exists(MANIFEST) and not force:
        try:
            manifest = json.load(open(MANIFEST, encoding="utf-8"))
        except Exception:
            manifest = {}
    manifest.pop("_readme", None)

    EXT = (".png", ".jpg", ".jpeg", ".webp")
    sources = {}
    for f in sorted(os.listdir(RAW)):
        base, ext = os.path.splitext(f)
        if ext.lower() in EXT:
            sources.setdefault(base, f)
    names = sorted(sources)
    # Позиционные аргументы = обработать только эти имена (без расширения):
    #   python tools/optimize_images.py montage-drone prod-line
    pick = [a for a in sys.argv[1:] if not a.startswith("--")]
    if pick:
        missing = [n for n in pick if n not in sources]
        if missing:
            print("Нет в raw/:", ", ".join(missing))
            return
        names = [n for n in names if n in pick]
    if not names:
        print("Нет исходников в", RAW)
        return

    total_in = total_out = 0
    for name in names:
        src = os.path.join(RAW, sources[name])
        if name in manifest and not force and os.path.exists(os.path.join(OUT, f"{name}-{WIDTHS[-1]}.webp")):
            print("skip", name)
            continue

        raw_im = Image.open(src)
        # Вырезанные объекты (фигуры без фона) должны сохранить прозрачность:
        # для них фолбэк — PNG, а не JPEG, иначе альфа зальётся чёрным.
        has_alpha = raw_im.mode in ("RGBA", "LA") or "transparency" in raw_im.info
        im = raw_im.convert("RGBA") if has_alpha else raw_im.convert("RGB")
        w, h = im.size
        total_in += os.path.getsize(src)

        widths = [x for x in WIDTHS if x <= w] or [w]
        if w not in widths:
            widths = [w] + widths

        srcset = []
        for tw in widths:
            th = round(h * tw / w)
            resized = im.resize((tw, th), Image.LANCZOS)
            wp = os.path.join(OUT, f"{name}-{tw}.webp")
            resized.save(wp, "WEBP", quality=WEBP_Q, method=6)
            total_out += os.path.getsize(wp)
            srcset.append(tw)

        # Фолбэк на средней ширине: PNG для прозрачных, иначе JPEG
        fw = 1152 if 1152 in widths else widths[0]
        fh = round(h * fw / w)
        if has_alpha:
            fb = os.path.join(OUT, f"{name}-{fw}.png")
            im.resize((fw, fh), Image.LANCZOS).save(fb, "PNG", optimize=True)
        else:
            fb = os.path.join(OUT, f"{name}-{fw}.jpg")
            im.resize((fw, fh), Image.LANCZOS).save(fb, "JPEG", quality=JPEG_Q, optimize=True, progressive=True)
        total_out += os.path.getsize(fb)

        manifest[name] = {
            "w": w,
            "h": h,
            "ratio": round(w / h, 4),
            "widths": sorted(srcset),
            "fallback": fw,
            # У вырезанных фигур LQIP-подложки нет: размытый прямоугольник
            # проступил бы за прозрачными краями.
            "lqip": "" if has_alpha else lqip(im),
            **({"alpha": True} if has_alpha else {}),
        }
        print("ok  %-18s %dx%d  -> %s" % (name, w, h, ", ".join(str(x) for x in sorted(srcset))))

    manifest = {"_readme": "Генерируется автоматически: python tools/optimize_images.py. Руками не править.",
                **{k: v for k, v in sorted(manifest.items())}}
    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)

    print("\nГотово. Исходники %.1f МБ -> выдача %.1f МБ" % (total_in / 1e6, total_out / 1e6))
    print("Манифест:", MANIFEST)


if __name__ == "__main__":
    main()
