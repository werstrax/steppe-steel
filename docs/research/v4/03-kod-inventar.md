# Инвентаризация движка Steppe Steel v3 («Заводской стандарт»)

## 1. ДВИЖОК — `build.mjs`

**Пайплайн** (`C:\Users\Flockyman\Desktop\stepee steel site\build.mjs`, zero-dependency Node, `node build.mjs [--watch]`):

1. **Данные**: `loadData()` читает 13 JSON из `src/data/` (`site, images, products, services, profiles, process, faq, journal, cycle, partners, dealers, payback, regions, material`). `util.loadJSON` рекурсивно выбрасывает поля с префиксом `_`. `images.json` — манифест картинок, регистрируется через `setImageManifest()`. В `site` дописываются `buildId` (sha1 от содержимого `site.css`+`site.js`, идёт в `?v=` у ассетов), `buildDate`, `_products`/`_services` (для футера).
2. **Валидация** `validate()`: битые обложки/галереи/related-слаги, длина seoTitle > 65 / seoDescription > 170, отсутствие geo/forms.endpoint/аналитики — только предупреждения в консоль.
3. **Страницы** `buildPages()` — фиксированный список маршрутов: `/`, `/katalog/` + страница на каждый `products.items[].url`, `/uslugi/` + по `services.items[]`, `/profili/`, `/process/`, `/partnyoram/`, `/predstavitelyam/`, `/{region.slug}/` (kostanay, petropavlovsk, kokshetau), `/o-zavode/`, `/blog/` + статьи, `/faq/`, `/kontakty/`, `/zayavka/`, `/zayavka/spasibo/` (noindex), `/privacy/` (noindex), `/404.html` (raw). URL → `dist/<url>/index.html` через `util.outPath`.
4. **Редиректы v1**: словарь `LEGACY` (строки 143–155) — 11 плоских файлов (`katalog.html`, `blog-km-kmd.html` …) пишутся в корень `dist/` как HTML-заглушки `redirectStub()` с `meta refresh 0` + `rel=canonical` на `${site.url}${to}`.
5. **Rebase подпапки**: `rebase(html, base)` регэкспами переписывает `href|src|poster|action|data-src="/…"`, `srcset` и `url('/…'` на `${basePath}/…`. Сейчас `site.json: basePath = ""` (свой домен steppesteel.kz), т.е. фактически no-op; механизм остаётся для отката на `werstrax.github.io/steppe-steel`.
6. **Статика**: `copyDir(src/assets → dist/assets)` с пропуском `raw/` и `static/`; содержимое `src/assets/static/` (включая CNAME) копируется в корень `dist/`.
7. **Служебные файлы**: `sitemap.xml` (priority по глубине URL, changefreq weekly для `/` и `/katalog/`), `robots.txt` (Disallow `/zayavka/spasibo/`, `/privacy/`; явные Allow для GPTBot/ClaudeBot/PerplexityBot и др.), `llms.txt` (большая текстовая выжимка о заводе с зашитыми в build.mjs фактами), `site.webmanifest` (name/description/цвета `#0b0c0e` зашиты), `favicon.svg` (генерится функцией `favicon()`: тёмный квадрат + оранжевая полоса + буква **S**), `.nojekyll`.

**Head/schema** — `src/lib/layout.mjs`:
- Инлайн-скрипт в `<head>`: класс `.js` + аварийный таймер `window.__steppeJsReady`/`__steppeT` (3 с), флаг интро-шторки в `sessionStorage('steppe-intro')`.
- Мета: title/description/canonical, robots (`max-image-preview` и пр.), `theme-color #0b0c0e`, OG/Twitter (og:image 1152×768 через `imageUrl()`, фолбэк `og-default`), `geo.region KZ-KUS`.
- Шрифты: `<link rel=preload>` на `/assets/fonts/unbounded-cyrillic.woff2` и `inter-cyrillic.woff2`; сами `@font-face` — в CSS (self-hosted woff2: Unbounded, Inter, JetBrains Mono, по 3 юникод-диапазона).
- JSON-LD `@graph` на каждой странице: `webPageNode` + `breadcrumbNode` + `page.schema[]`; затем дедуп по `@id` — если полного узла Organization/WebSite нет, добавляются компактные `organizationRefNode`/`websiteRefNode` (Google не ходит по `@id` между URL). Полные узлы (`organizationNode` с OfferCatalog, areaServed, alternateName «Степпе Стил») — на `/`, `/o-zavode/`, `/kontakty/`. Остальные типы в `src/lib/schema.mjs`: `productNode` (Service, не Product — сознательно), `profilesListNode` (ItemList of Product), `serviceNode`, `articleNode`, `faqNode`, `itemListNode`, `howToNode`.
- Тело: прелоадер-шторка с надписью **STEPPE STEEL / industrial standard** (зашита в layout.mjs, строки 110–112), skip-link, header, `<main>`, полоса «Дальше» по зашитой карте `NEXT` (строки 10–20), footer, WhatsApp-fab, `site.js?v=buildId` defer. Счётчики Метрики/GA подключаются только при заполненных ID в `site.json`.

## 2. КОМПОНЕНТЫ — экспорты `src/lib/components.mjs`

| Экспорт | Что делает | Вердикт |
|---|---|---|
| `logo` | Реальный JPG-логотип клиента (compact в шапке / band в подвале), фон гасится `mix-blend-mode: screen`; «перерисовывать нельзя — решение клиента» | **БРЕНД-ЗАВЯЗАН** — при STEPSTEEL меняются файлы `assets/img/ui/logo-*.jpg`, alt и aria |
| `iconArrow`, `iconArrowUpRight`, `iconWhatsApp`, `iconInstagram` | Инлайн-SVG иконки | НЕЙТРАЛЬНЫЙ |
| `vizTag` / `photoTag` | Честные бейджи «Визуализация» / «Фото с объекта · @lstk.factory» на кадрах — часть договорённости с заводом | НЕЙТРАЛЬНЫЙ (политика фактов, но дефолт photoTag содержит хэндл Instagram) |
| `video` | Фоновое mp4-видео с постером, `data-autovideo`, опц. viz-бейдж | НЕЙТРАЛЬНЫЙ |
| `header` (+внутр. `mobileMenu`) | Шапка: nav из `site.json`, телефон, CTA, бургер; мобильное меню с нумерацией `01…` | НЕЙТРАЛЬНЫЙ (нумерация пунктов — лёгкий V3-декор) |
| `footer` | 4-колоночный подвал; **зашит текст** «Завод ЛСТК… с. Троебратское», гигантский ворд-марк `STEPPE`, © Steppe Steel | НЕЙТРАЛЬНЫЙ каркас, но ворд-марк и тексты — V3/бренд |
| `fab` | Плавающая кнопка WhatsApp | НЕЙТРАЛЬНЫЙ |
| `sectionHead` | Заголовок секции; параметр `sheet` печатает штамп «ЛИСТ 03 · label» в mono | НЕЙТРАЛЬНЫЙ без `sheet`; сам механизм «листов» — **V3-СПЕЦИФИЧНЫЙ** |
| `crumbs` | Хлебные крошки (mono) | НЕЙТРАЛЬНЫЙ |
| `productCard` | Карточка продукции: фото, mono-код, `data-cursor="Смотреть"`, `data-slug` для «просмотрено» | НЕЙТРАЛЬНЫЙ |
| `serviceRow` | Строка услуги с номером `01` | НЕЙТРАЛЬНЫЙ |
| `step` | Шаг процесса (номер, срок, список) | НЕЙТРАЛЬНЫЙ |
| `stat` | «Цифра» — val/key/note | НЕЙТРАЛЬНЫЙ |
| `faq` | Аккордеон (кнопки aria-expanded, без JS раскрыт) | НЕЙТРАЛЬНЫЙ |
| `audienceSwitch` | Две вкладки-ссылки `/partnyoram/` ↔ `/predstavitelyam/` (URL зашиты в константе `AUDIENCES`) | НЕЙТРАЛЬНЫЙ |
| `pageHero` | Крупный хиро внутренних страниц (label/count/aside) | НЕЙТРАЛЬНЫЙ |
| `marquee` | Бегущая строка с контурными словами и оранжевыми акцентами | **V3-СПЕЦИФИЧНЫЙ** (кино-декор) |
| `ctaBand` | Оранжевая CTA-полоса: заявка + WhatsApp | НЕЙТРАЛЬНЫЙ (тексты по умолчанию зашиты) |
| `nextProduct` | Пейджер «следующий раздел» с фоновым фото | НЕЙТРАЛЬНЫЙ |
| `articleCard` | Карточка статьи (дата, мин чтения) | НЕЙТРАЛЬНЫЙ |
| `specs` | Таблица характеристик key/val | НЕЙТРАЛЬНЫЙ |
| `grainSheet` (+`GS`, `gsScale`, `gsDynamic`) | «Эскизный лист 06-А»: SVG-фасад зернохранилища с рамкой листа, штампом («Steppe Steel · с. Троебратское», код `СС-06А-…`, масштаб М 1:250…1:1000), кнопками «Отправить инженеру»/печать. **Геометрия продублирована в site.js (grainSheet) — менять синхронно** | **V3-СПЕЦИФИЧНЫЙ** (чертёж, штамп, лист) |
| реэкспорт `num, plural, dateRu` | утилиты из util.mjs | НЕЙТРАЛЬНЫЙ |

## 3. JS-МОДУЛИ — `src/assets/js/site.js` (1490 строк, один внешний IIFE, внутри 29 именованных IIFE)

| IIFE (строка) | Что делает | Для строгого корпоративного |
|---|---|---|
| `header` (28) | фон шапки при скролле, скрытие при прокрутке вниз | ОСТАВИТЬ |
| `menu` (58) | мобильное меню, бургер, lock scroll | ОСТАВИТЬ |
| `reveal` (102) | появление `[data-reveal]` по IntersectionObserver | ОСТАВИТЬ (можно упростить) |
| `images` (131) | fade-in картинок `data-fade` | ОСТАВИТЬ |
| `videos` (141) | пауза autoplay-видео при reduced-motion + кнопка пауза/пуск (WCAG 2.2.2) | ОСТАВИТЬ (если останутся видео) |
| `marqueePause` (171) | пауза бегущей строки по тапу | ВЫКИНУТЬ (вместе с marquee) |
| `tableHints` (179) | бейдж «таблица листается» | ОСТАВИТЬ |
| `accordion` (194) | FAQ-аккордеон | ОСТАВИТЬ |
| `fab` (207) | показ/скрытие WhatsApp-кнопки | ОСТАВИТЬ |
| `lightbox` (224) | лайтбокс галерей `[data-lightbox]` | ОСТАВИТЬ |
| `cursor` (336) | кастомный курсор с подписью `data-cursor` | ВЫКИНУТЬ |
| `readProgress` (378) | полоса прогресса чтения статьи | ПО ЖЕЛАНИЮ (нейтрален) |
| `scrollspy` (402) | подсветка TOC статьи | ОСТАВИТЬ |
| `seenProducts` (429) | localStorage `steppe-seen`: «Просмотрено» в каталоге; **регэксп зашит на `/katalog/…/`** | ПО ЖЕЛАНИЮ; при смене URL-структуры сломается |
| `intro` (478) | прелоадер-шторка (1 раз за сессию, `sessionStorage steppe-intro`) | ВЫКИНУТЬ |
| `splitLines` (500) | разъезжающиеся строки заголовков | ВЫКИНУТЬ |
| `countUp` (557) | цифры считают себя сами | ВЫКИНУТЬ (или оставить как единственную анимацию) |
| `magnetic` (599) | магнитные кнопки | ВЫКИНУТЬ |
| `grainCalc` (630) | калькулятор зернохранилища (т → длина, `grainState` общий с квизом) | **ОСТАВИТЬ** (бизнес-функция) |
| `grainSheet` (672) | живой чертёж 06-А: перерисовка SVG, печать, WhatsApp-отправка; копия геометрии из components.mjs | ВЫКИНУТЬ/переделать (чертёжная эстетика) |
| `cycleStory` (820) | скролл-таймлапс стройки (ЛИСТ 04-М) | ВЫКИНУТЬ |
| `atlasTabs` (898) | табы «атласа стали» (ЛИСТ 03-Д) | ВЫКИНУТЬ (привязан к секции) |
| `ramaWipe` (936) | шторка «чертёж → металл» на /partnyoram/ | ВЫКИНУТЬ |
| `splitTabs` (1004) | табы форматов сотрудничества | ОСТАВИТЬ (обычные табы) |
| `laneKeys` (1040) | подсветка «полосы ответственности» на /predstavitelyam/ | ЗАВИСИТ от судьбы секции |
| `payback` (1075) | калькулятор окупаемости склада против элеватора | **ОСТАВИТЬ** (бизнес-функция) |
| `profiles` (1166) | живой лист КМД: переключение ПСУ/ПС, перерисовка сечения, толщина | ПЕРЕДЕЛАТЬ: логика табов нейтральна, чертёж — V3 |
| `calcForm` (1271) | квиз «Расчёт за 24 часа»: 3 шага, маска телефона, honeypot, сборка сообщения → WhatsApp + mailto/копирование, предвыбор из `?type=grain&tons=&len=`, цели ym/gtag, штамп «В ПРОИЗВОДСТВО» | **ОСТАВИТЬ** (главная конверсия); штамп-анимация — V3-декор |

Внешний IIFE также держит общие хелперы: `$`, `$$`, `fmt`, `openWa`, `reduced`, `grainState`, `CROP_NAMES`.

## 4. CSS — `src/assets/css/site.css` (4409 строк, 15 разделов, оглавление в шапке файла)

Идея файла (строки 1–18): **тёмная сталь (базовая тема) ↔ светлые «листы КМД» (`.section--sheet`)**, один оранжевый акцент, шрифты Unbounded/Inter/JetBrains Mono.

**Переиспользуемо при переходе на белый корпоратив:**
- 01 Шрифты (24–100) — self-hosted `@font-face` механика (сами гарнитуры, вероятно, сменятся; cyrillic-ext обязателен для казахских букв).
- 02 Токены (102–162) — **архитектура** токенов (типо-шкала clamp, ритм `--sec/--gap`, `--container`, easing) переиспользуема; **значения** — тёмная палитра `--steel*`, «бумага» `--sheet*`, `--noise` — переписать.
- 03 Сброс и база (164) — да (кроме `background: var(--steel)` у body).
- 04 Типографика (270) — да.
- 05 Сетка и секции (378) — сетка да; `.section--sheet` (миллиметровка, кромки листа, 393) — переписать.
- 06 Кнопки (465) — да (варианты `--outline-light`, `--wa` под тёмный фон — пересмотреть).
- 07 Шапка и меню (552), 08 Подвал (735), 09 Медиа (821, включая кнопку паузы видео и viz-tag) — каркас да, цвета переписать; хак логотипа `mix-blend: screen` (583) работает только на тёмном.
- 10 Компоненты (916) — большинство (крошки, карточки, таблицы, FAQ, CTA-полоса, пейджеры, лайтбокс, TOC) переиспользуемо; чертёжные куски (`prof__stamp`, sheet-note-«штампы», диптих 1154) — V3.
- 11 Формы и квиз (1930) — да; штамп «В ПРОИЗВОДСТВО» (2165) и «рулетка» — V3-декор.
- 14 Утилиты, печать, доступность (2620 + print-блок в конце) — да; печать листа 06-А (`gs-printing`) — V3.

**Переписать/выкинуть:**
- 12 Интерактив профилей — живой лист КМД (2241).
- 13 Вау-слой (2388): прелоадер-шторка, reveal, split-lines, маркиза, кастомный курсор, CSS-параллакс, view-transition кросс-фейд.
- 15 Страничные секции (2627): кино-hero 100svh с видео, «why-карточки», зерно-блок, эскизный лист 06-А (2860), хроника-скраб 460vh (3172), атлас стали (3330), рама-шторка партнёров (3480), полоса ответственности (3877), окупаемость (3709), сертификат/«листы на столе» (4149/4206) — почти всё дизайн-специфично, хотя разметка секций (grid, dl, downloads) частично переносима.

## 5. РИСКИ при ребрендинге Steppe Steel → STEPSTEEL и смене структуры URL

**Домен и пути:**
- `src/data/site.json`: `url: "https://steppesteel.kz"`, `basePath: ""`; CNAME лежит в `src/assets/static/` и копируется в корень — при смене домена менять оба + DNS (примечание `_urlNote` описывает откат на `werstrax.github.io/steppe-steel`).
- `build.mjs LEGACY` (143–155) — редиректы v1 указывают на новые URL относительно `site.url`; при смене структуры URL (`/katalog/`, `/blog/`…) все цели словаря протухнут, плюс понадобится **второй слой редиректов** со всех нынешних 25+ URL.
- Маршруты зашиты в коде, а не в данных: `buildPages()` (build.mjs 109–139), карта `NEXT` (layout.mjs 10–20), `AUDIENCES` (components.mjs 350–353), `crumbsBase` в каждом pages/*.mjs, ссылки в текстах страниц (`/zayavka/`, `/uslugi/proektirovanie/`, `/#agro`, `/#okupaemost` и т.д.), `robots()` Disallow-пути, sitemap-приоритеты по глубине URL, llms.txt-разделы.
- `site.js seenProducts` (436): регэксп `/\/katalog\/([a-z0-9-]+)\/$/` — сломается при переименовании раздела; `calcForm` парсит `/zayavka/?type=…`.
- `rebase()` (build.mjs 181–187) переписывает только перечисленные атрибуты — новый атрибут с корневым путём молча не префикснется при возврате на подпапку.

**Бренд зашит строками (не в site.json):**
- layout.mjs: прелоадер `STEPPE STEEL` / `industrial standard` (110–112), глобалы `__steppeJsReady`/`__steppeT`, ключ `sessionStorage 'steppe-intro'`.
- components.mjs: alt/aria логотипа «Steppe Steel — Metal Structures…», текст футера «Завод ЛСТК… с. Троебратское», ворд-марк `STEPPE` (194), © `Steppe Steel` (197), штампы «Steppe Steel · с. Троебратское» в grainSheet (620) и код листа `СС-06А-…` (565).
- build.mjs: заголовок редирект-заглушки «— Steppe Steel» (163), консольный баннер, весь текст `llmsTxt()` (описание завода, факты, слоган), `webmanifest()` description, `favicon()` — буква **S** и цвета `#0b0c0e`/`#e8781a` (при белом корпоративе фавикон и `theme-color #0b0c0e` в layout.mjs:71 тоже менять).
- site.js: ключ `localStorage 'steppe-seen'`, дефолт `data-site="Steppe Steel"` в квизе (1277), WhatsApp-текст листа 06-А «с сайта Steppe Steel» (771).
- schema.mjs: `alternateName: ['STEPPE STEEL', 'Степпе Стил', 'ЛСТК завод Steppe Steel', '@lstk.factory']`, описания организации.
- pages/*: `seoTitle/description` со «Steppe Steel» и в JSON-данных, и в зашитых строках (home, about, contact, 404); PDF `assets/docs/steppe-steel-sertifikat-profili.pdf` (partners.mjs 377) — имя файла брендировано; тексты WhatsApp-сообщений в site.json.
- Логотип — растровые JPG клиента (`assets/img/ui/logo-compact.jpg`, `logo-band.jpg`), завязаны на чёрный фон через `mix-blend-mode: screen` — на белом сайте текущий приём не работает, нужны новые файлы.

**Прочее жёсткое:**
- Дублированная геометрия зернохранилища: `components.mjs GS` (499–512) ↔ `site.js grainSheet` — менять синхронно (задокументировано в обоих местах).
- Кэш-версия ассетов считается только от `site.css`+`site.js` (build.mjs 59–62) — изменения шрифтов/картинок версию не двигают.
- `imageUrl()` фолбэкается на `og-default-1152.jpg` — имя-манифест `og-default` обязано существовать.
- FAQPage-дедупликация (contact.mjs 292–296) построена на точном совпадении текста вопросов между faq.json и products/services — при редактуре текстов легко получить дубли разметки.