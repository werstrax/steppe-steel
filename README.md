# Steppe Steel — сайт завода (v3 «Заводской стандарт»)

Сайт завода ЛСТК и металлоконструкций полного цикла (с. Троебратское,
Костанайская область, Казахстан). Статический генератор без зависимостей —
чистый Node, на выходе обычные HTML-файлы.

**Живой сайт:** https://werstrax.github.io/steppe-steel/

## Структура

```
build.mjs            сборщик: JSON-данные → HTML в dist/
src/
  data/*.json        ВЕСЬ контент сайта (правьте здесь, не в HTML)
  pages/*.mjs        шаблоны страниц
  lib/               движок: layout, компоненты, schema.org, утилиты
  assets/            css, js, шрифты (self-hosted), картинки, видео
    img/raw/         исходники картинок (в git не попадают)
tools/
  serve.mjs          локальный сервер dist/ (порт 4321, путь /steppe-steel/)
  check.mjs          валидатор: ссылки, SEO, JSON-LD, alt, доступность
  screenshot.mjs     скриншоты страниц (headless Chrome)
  audit_mobile.mjs   аудит переполнений на 375/360/320
  test_functional.mjs функциональные тесты квиза/калькулятора/профилей
  optimize_images.py raw-исходники → WebP-набор + LQIP + манифест
dist/                сборка (генерируется, в git не хранится)
docs/                концепт редизайна, исследования
```

## Команды

```
node build.mjs              # собрать сайт в dist/
node build.mjs --watch      # пересборка при изменениях
node tools/serve.mjs        # http://localhost:4321/steppe-steel/
node tools/check.mjs        # проверки (0 ошибок = можно деплоить)
python tools/optimize_images.py   # после добавления картинок в raw/
```

## Деплой

GitHub Pages отдаёт корень ветки `main`. Порядок:

1. `node build.mjs` и `node tools/check.mjs` — ошибок нет.
2. Скопировать содержимое `dist/` в корень репозитория.
3. Commit + push в `main`.

Подробности, замена контента и подключение форм/аналитики — в HANDOFF.md.
Чего не хватает от заказчика — в CONTENT-TODO.md.
