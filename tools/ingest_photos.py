# -*- coding: utf-8 -*-
"""
Загрузка реальных фотографий проекта одной командой.

Берёт папку с фотографиями (jpg/png, любые имена), и делает всё сама:
  1. переименовывает в <slug>-01, <slug>-02, … (обложка — самый широкий кадр
     или файл со словом cover в имени);
  2. кладёт в src/assets/img/raw/;
  3. прогоняет оптимизацию (webp всех размеров + jpeg + lqip + манифест);
  4. печатает готовый блок gallery для src/data/projects.json.

Примеры:
  python tools/ingest_photos.py bayaan "C:/Users/Flockyman/Downloads/bayaan-photos"
  python tools/ingest_photos.py kottedzhnyy-dom D:/photos/cottage --replace

--replace  сначала удаляет старые кадры этого проекта (raw + оптимизированные).
"""
import io, json, os, re, shutil, subprocess, sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "src", "assets", "img", "raw")
OUT = os.path.join(ROOT, "src", "assets", "img")
MANIFEST = os.path.join(ROOT, "src", "data", "images.json")

MIN_SIDE = 1200  # предупреждаем, если фото мельче


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    replace = "--replace" in sys.argv
    if len(args) != 2:
        print(__doc__)
        sys.exit(1)

    slug, src_dir = args
    if not re.fullmatch(r"[a-z0-9-]+", slug):
        sys.exit("Слаг должен быть латиницей: a-z, 0-9 и дефис. Например: bayaan")
    if not os.path.isdir(src_dir):
        sys.exit("Нет папки: " + src_dir)

    files = sorted(
        f for f in os.listdir(src_dir)
        if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
    )
    if not files:
        sys.exit("В папке нет jpg/png/webp: " + src_dir)

    # --replace: убираем старые кадры проекта
    if replace:
        removed = 0
        for f in list(os.listdir(RAW)):
            if f.startswith(slug + "-"):
                os.remove(os.path.join(RAW, f)); removed += 1
        for f in list(os.listdir(OUT)):
            if f.startswith(slug + "-") and os.path.isfile(os.path.join(OUT, f)):
                os.remove(os.path.join(OUT, f)); removed += 1
        try:
            m = json.load(io.open(MANIFEST, encoding="utf-8"))
            for k in [k for k in m if k.startswith(slug + "-")]:
                del m[k]
            io.open(MANIFEST, "w", encoding="utf-8").write(json.dumps(m, ensure_ascii=False, indent=1))
        except Exception:
            pass
        print("Удалено старых файлов:", removed)

    # Определяем обложку: имя с cover / самый большой по площади горизонтальный кадр
    def score(f):
        name_bonus = 10_000_000 if "cover" in f.lower() else 0
        try:
            with Image.open(os.path.join(src_dir, f)) as im:
                w, h = im.size
            return name_bonus + (w * h if w >= h else w * h // 2)
        except Exception:
            return 0

    ordered = sorted(files, key=score, reverse=True)
    cover, rest = ordered[0], sorted(x for x in ordered[1:])

    entries = []
    small = []
    for i, f in enumerate([cover] + rest):
        name = "%s-%s" % (slug, "cover" if i == 0 else str(i).zfill(2))
        with Image.open(os.path.join(src_dir, f)) as im:
            w, h = im.size
            if max(w, h) < MIN_SIDE:
                small.append("%s (%dx%d)" % (f, w, h))
            rgb = im.convert("RGB")
            rgb.save(os.path.join(RAW, name + ".png"))
        entries.append({"img": name, "w": w, "h": h, "src": f})
        print("  %-24s <- %s  (%dx%d)" % (name, f, w, h))

    print("\nОптимизация…")
    r = subprocess.run([sys.executable, os.path.join(ROOT, "tools", "optimize_images.py")],
                       capture_output=True, text=True)
    tail = (r.stdout or "").strip().splitlines()
    print("\n".join("  " + x for x in tail[-3:]))
    if r.returncode != 0:
        print(r.stderr[-500:])
        sys.exit("Оптимизация упала — см. выше.")

    if small:
        print("\nВНИМАНИЕ — эти кадры мельче %dpx и будут мыльными на широких экранах:" % MIN_SIDE)
        for s in small:
            print("  •", s)

    # Готовый блок для projects.json
    gallery = []
    for i, e in enumerate(entries):
        item = {"img": e["img"], "alt": "ЗАПОЛНИТЕ: что на кадре — " + e["src"]}
        if e["w"] >= e["h"]:
            item["wide"] = True
        gallery.append(item)

    print("\n--- Вставьте в src/data/projects.json нужному проекту: ---\n")
    print('      "cover": "%s",' % entries[0]["img"])
    print('      "gallery": ' + json.dumps(gallery, ensure_ascii=False, indent=8)
          .replace('"wide": true\n        }', '"wide": true }'))
    print("\nПосле правки JSON: node build.mjs — и кадры на сайте.")


if __name__ == "__main__":
    main()
