# -*- coding: utf-8 -*-
"""
Пакет иллюстративных кадров для главной v4.1 (макет заказчика, 30.08.2026).

Генерирует через tools/kie.py (nano-banana на kie.ai): типы зданий в фирменном
стиле (графитовые панели + оранжевая полоса, оцинкованный каркас, степь),
зернохранилища — только по референсу дизайна заказчика, партнёрские сцены
без лиц. Кадры зданий помечаются на сайте «Визуализация» (coverViz).

  python tools/gen_v41.py            # недостающие
  python tools/gen_v41.py --force    # всё заново
  python tools/gen_v41.py --only sol-  # по подстроке имени

Результат — src/assets/img/raw/<name>.jpg, затем python tools/optimize_images.py.
"""
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kie  # noqa: E402

RAW = kie.RAW

# Референсы фирменного стиля из истории репозитория (публичные raw-URL)
GH = "https://raw.githubusercontent.com/werstrax/steppe-steel/05ac235/assets/img/"
REF_GRAIN = GH + "grain-ext-1152.jpg"      # дизайн зернохранилища заказчика
REF_HANGAR = GH + "hangar-brand-1152.jpg"  # графитовые панели + оранжевая полоса
REF_FRAME = GH + "steppe-frame-1152.jpg"   # оцинкованный каркас в степи
REF_CANOPY = GH + "canopy-brand-1152.jpg"  # навес для техники

STYLE = (
    "Photorealistic architectural photography, full-frame camera, 35mm lens, "
    "late afternoon golden light over flat Kazakh steppe, clear sky, "
    "bright silver galvanized steel, matte graphite-black sandwich panels with one orange accent stripe, "
    "clean composition, sharp detail, no people, no faces, no text, no lettering, no signage, "
    "no logos, no watermarks, no brand names."
)

KEEP = "Keep the exact building design, materials and colours from the reference image. "

IMAGES = [
    # --- Первый экран ---------------------------------------------------------
    ("hero-photo", "16:9", "2K", [REF_FRAME],
     KEEP + "Wide low-angle view of a large galvanized steel building frame under construction: "
     "lattice trusses and columns, bolted connections visible, stacked profiles on the ground, "
     "vast steppe horizon, dramatic late light. " + STYLE),

    # --- Что мы производим: 9 типов зданий ------------------------------------
    ("sol-zernohranilishcha", "4:3", "1K", [REF_GRAIN],
     KEEP + "Three-quarter drone view of the same low wide grain storage building: blue cladding tent "
     "over the open galvanized lower frame on short piles, golden wheat field around, harvest season. " + STYLE),
    ("sol-sklady", "4:3", "1K", [REF_HANGAR],
     KEEP + "Long logistics warehouse with several loading gates on the long side, paved yard, "
     "graphite panels with orange stripe, steppe behind. " + STYLE),
    ("sol-proizvodstvennye-zdaniya", "4:3", "1K", [REF_HANGAR],
     KEEP + "Large industrial production hall with a taller central bay, high windows band, "
     "attached office block, graphite panels with orange stripe, gravel yard. " + STYLE),
    ("sol-angary", "4:3", "1K", [REF_HANGAR],
     KEEP + "Universal hangar with one wide sliding gate on the gable end, seen from the front corner, "
     "graphite panels with orange stripe, steppe road. " + STYLE),
    ("sol-ovoshchehranilishcha", "4:3", "1K", [REF_HANGAR],
     KEEP + "Insulated vegetable storage building with ventilation louvers along the wall and a loading dock, "
     "wooden crates stacked outside, autumn field. " + STYLE),
    ("sol-zdaniya-dlya-tekhniki", "4:3", "1K", [REF_CANOPY],
     KEEP + "Open steel canopy for farm machinery: combine harvesters and tractors parked under the roof, "
     "galvanized columns, no side walls, steppe. " + STYLE),
    ("sol-sto-avtoparki", "4:3", "1K", [REF_HANGAR],
     KEEP + "Truck service station building with three roller shutter gates, concrete apron, "
     "two unbranded trucks parked, graphite panels with orange stripe. " + STYLE),
    ("sol-sportivnye-obekty", "4:3", "1K", None,
     "Interior of a sports hall with a wide-span galvanized steel truss roof, no internal columns, "
     "wooden floor with court lines, high windows, daylight. Photorealistic architectural photography, "
     "no people, no text, no logos, no watermarks."),
    ("sol-modulnye-zdaniya", "4:3", "1K", [REF_GRAIN],
     KEEP + "Drone view of the same grain storage building being extended: finished sections with blue cladding "
     "on the left, a new galvanized frame section being added on the right, modular expansion. " + STYLE),

    # --- Типовые решения ------------------------------------------------------
    ("typ-angar-18x36", "4:3", "1K", [REF_HANGAR],
     KEEP + "Compact hangar, roughly twice as long as wide, single gate, front three-quarter view. " + STYLE),
    ("typ-angar-24x60", "4:3", "1K", [REF_HANGAR],
     KEEP + "Long wide hangar, gate on the gable end, side view showing its length, gravel yard. " + STYLE),
    ("typ-zerno-45", "4:3", "1K", [REF_GRAIN],
     KEEP + "Short version of the same grain storage building, about forty metres long, "
     "three-quarter view from the ground, wheat field. " + STYLE),
    ("typ-zerno-140", "4:3", "1K", [REF_GRAIN],
     KEEP + "Very long version of the same grain storage building stretching far into the distance, "
     "drone view along its length, harvest trucks unloading at one end. " + STYLE),

    # --- Партнёрские сцены (иллюстративные, без лиц) --------------------------
    ("aud-designers", "3:2", "1K", None,
     "Structural engineer's desk from above: printed steel structure drawings with abstract technical linework, "
     "a laptop showing an abstract grey 3D model of a steel building frame, a scale ruler, "
     "a white hard hat at the edge, hands only, no faces. Soft daylight, editorial photography, "
     "no readable text, no logos, no watermarks."),
    ("aud-partners", "3:2", "1K", None,
     "Close-up of a firm handshake between two people in work jackets in front of a blurred galvanized "
     "steel building frame on a construction site, golden hour, hard hats, no faces visible, "
     "editorial photography, no text, no logos, no watermarks."),
]


def main():
    force = "--force" in sys.argv
    only = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else None
    os.makedirs(RAW, exist_ok=True)

    todo = []
    for name, ar, res, refs, prompt in IMAGES:
        if only and only not in name:
            continue
        if not force and os.path.exists(os.path.join(RAW, name + ".jpg")):
            print("skip (есть):", name)
            continue
        todo.append((name, ar, res, refs, prompt))
    if not todo:
        print("Нечего генерировать.")
        return

    print("К генерации: %d кадров" % len(todo))
    t0 = time.time()
    fails = []

    def run(job):
        name, ar, res, refs, prompt = job
        for attempt in range(3):
            try:
                paths = kie.gen_image(prompt, name, refs=refs, ar=ar, res=res)
                # kie кладёт name.jpg (или name-1.jpg при нескольких) — нормализуем
                for p in paths:
                    if not p.endswith(name + ".jpg"):
                        os.replace(p, os.path.join(RAW, name + ".jpg"))
                return name, None
            except Exception as err:  # noqa: BLE001
                if attempt == 2:
                    return name, str(err)
                time.sleep(8 * (attempt + 1))
        return name, "unknown"

    with ThreadPoolExecutor(max_workers=4) as ex:
        for fut in as_completed([ex.submit(run, j) for j in todo]):
            name, err = fut.result()
            if err:
                fails.append((name, err))
                print("FAIL", name, err[:200])
            else:
                print("OK  ", name)

    print("\nГотово: %d ок, %d ошибок, %d сек" % (len(todo) - len(fails), len(fails), time.time() - t0))
    for n, e in fails:
        print(" -", n, e[:300])


if __name__ == "__main__":
    main()
