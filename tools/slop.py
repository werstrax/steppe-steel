# -*- coding: utf-8 -*-
"""
Детектор словесного слопа по чеклисту pro-site/references/anti-slop.md.
Прогоняет строки данных по списку русских маркеров генератора.

    python tools/slop.py src/data          # весь контент
    python tools/slop.py src/data/faq.json # один файл

Выход: файл → путь до поля → маркер → цитата. Код возврата 1, если найдено.
Служебные поля (с префиксом _) пропускаются — там заметки для разработчика.
"""
import io
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

MARKERS = [
    (r"[Мм]ы\s+не\s+просто", "«Мы не просто X — мы Y» — конструкция №1 у генераторов"),
    (r"[Ээ]то\s+не\s+просто", "«Это не просто…» — то же самое"),
    (r"[Вв]\s+современном\s+мире", "«В современном мире…» — разгон вместо мысли"),
    (r"[Оо]ткройте\s+для\s+себя", "калька с английского маркетинга"),
    (r"[Пп]огрузитесь\s+в", "калька с английского маркетинга"),
    (r"надёжн\w+\s+партнёр", "«надёжный партнёр» — пустая, подходит любому"),
    (r"[Ии]нновационн\w+\s+решени", "«инновационные решения» — ничего не значит"),
    (r"[Мм]ы\s+стремимся", "намерение вместо факта"),
    (r"[Мм]ы\s+верим", "намерение вместо факта"),
    (r"[Ии]деальн\w+\s+баланс", "оценка вместо описания"),
    (r"гармони\w+\s", "оценка вместо описания"),
    (r"[Кк]аждая\s+деталь\s+продумана", "не проверяется"),
    (r"быстро,\s*качественно\s+и\s+надёжно", "тройка — ритм генератора"),
    (r"[Хх]отите\s+\w+\s*\?", "риторический вопрос в начале блока"),
    (r"команда\s+профессионалов", "штамп"),
    (r"индивидуальн\w+\s+подход(?!\w)", "штамп (не путать с «стоимость рассчитывается индивидуально» — это формулировка ТЗ)"),
    (r"под\s+ключ\s+любой\s+сложности", "штамп"),
    (r"широк\w+\s+спектр", "штамп"),
    (r"высочайш\w+\s+качеств", "штамп"),
    (r"безупречн\w+", "оценка вместо описания"),
]


def walk(value, path, hits, fname):
    if isinstance(value, dict):
        for k, v in value.items():
            if isinstance(k, str) and k.startswith("_"):
                continue
            walk(v, f"{path}.{k}" if path else k, hits, fname)
    elif isinstance(value, list):
        for i, v in enumerate(value):
            walk(v, f"{path}[{i}]", hits, fname)
    elif isinstance(value, str):
        for rx, why in MARKERS:
            m = re.search(rx, value)
            if m:
                start = max(0, m.start() - 40)
                quote = value[start:m.end() + 40].replace("\n", " ")
                hits.append((fname, path, why, f"…{quote}…"))


def main():
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("src/data")
    files = sorted(target.glob("**/*.json")) if target.is_dir() else [target]
    hits = []
    for f in files:
        try:
            data = json.load(io.open(f, encoding="utf-8"))
        except Exception as err:  # noqa: BLE001 — битый JSON важнее слопа
            print(f"!! {f}: не читается ({err})")
            continue
        walk(data, "", hits, str(f))

    if not hits:
        print(f"Слоп-маркеров не найдено. Файлов проверено: {len(files)}.")
        return 0

    for fname, path, why, quote in hits:
        print(f"✗ {fname} → {path}\n  {why}\n  {quote}\n")
    print(f"Итого маркеров: {len(hits)}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
