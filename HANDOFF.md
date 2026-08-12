# HANDOFF — как жить с сайтом Steppe Steel v3

## Как поменять контент

Весь контент — в `src/data/*.json`. HTML руками не правится.

| Что поменять | Где |
|---|---|
| Телефон, WhatsApp, email, адрес | `site.json` → `contacts` |
| Навигация, CTA | `site.json` → `nav`, `navFooter`, `cta` |
| Продукция (зернохранилища, ангары, цеха) | `products.json` |
| Услуги завода | `services.json` |
| Профили ПСУ и ПС (тексты интерактива) | `profiles.json` |
| Шаги процесса и сроки | `process.json` |
| Вопросы-ответы | `faq.json` |
| Статьи журнала | `journal.json` |

Поля с `_` — служебные заметки, на сайт не попадают. После правки:
`node build.mjs` → проверить локально → задеплоить.

## Как добавить фото

1. Положить исходник (jpg/png, ≥1400px по ширине) в `src/assets/img/raw/`.
2. `python tools/optimize_images.py` — создаст WebP-набор и запись в манифесте.
3. Сослаться на имя файла (без расширения) в данных: `"cover": "moy-kadr"`.
4. Если это AI-визуализация — пометить `"viz": true` (честная подпись обязательна).

## Аналитика

`site.json` → `analytics.yandexMetrikaId` / `googleAnalyticsId`. Вписать ID —
код подключится сам, цель `calc_submit` уже отправляется при заявке.

## Формы

Сейчас квиз работает без бэкенда: собирает заявку и открывает WhatsApp
с готовым сообщением (+ email-фолбэк). Чтобы слать POST на свой обработчик —
`site.json` → `forms.endpoint`.

## Важно про robots.txt на GitHub Pages

Пока сайт живёт на project pages (`/steppe-steel/`), краулеры читают robots.txt
только из корня домена `werstrax.github.io` — наш файл в подпапке они не видят.
Это не страшно: служебные страницы закрыты через `noindex`, а sitemap нужно
отправить напрямую в Google Search Console и Яндекс.Вебмастер:
`https://werstrax.github.io/steppe-steel/sitemap.xml`.
После переезда на свой домен robots.txt и llms.txt окажутся в корне и заработают.

## Переезд на свой домен

1. `site.json`: `url` → `https://ваш-домен.kz`, `basePath` → `""`.
2. `tools/serve.mjs` и `tools/screenshot.mjs`: BASE → без подпапки.
3. Пересобрать, задеплоить на хостинг, добавить домен в Search Console
   и Яндекс.Вебмастер (указать регион!), отправить sitemap.xml.

## Деплой на GitHub Pages (текущий)

```bash
node build.mjs && node tools/check.mjs
# скопировать dist/* в корень репо (заменив старые файлы сборки)
git add -A && git commit -m "content: ..." && git push
```

Старые URL v1 (`zernohranilishcha.html` и т.п.) редиректят на новые —
эти файлы-заглушки генерируются сборкой автоматически, не удалять.

## Что где проверять после правок

1. `node tools/check.mjs` — 0 ошибок.
2. `node tools/audit_mobile.mjs` — «Переполнений нет».
3. `node tools/test_functional.mjs` — все проверки ok.
4. Глазами: `node tools/screenshot.mjs` → папка `screenshots/`.
