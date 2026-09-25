# Дизайн-проход 13.09.2026 — «дорого, не бедно»: проверенный план

Дата: 13.09.2026. Запрос Рамазана: «слишком минималистично получилось». План судьи (креативный директор) прошёл через скептика и анти-слоп-ревью: каждый пункт сверен с ограничениями задачи, детекторами `anti-slop.md` (пять слоёв + «фирменный слоп»), кодом `src/**`, скриншотами `screenshots/*.png` и данными `src/data/*.json`. Ниже — только то, что прошло; что не прошло — в §9 с причинами. Исполнитель работает по этому файлу, не по черновику судьи.

---

## 0. Концепция одной строкой

```
Стальной каркас от завода → «серьёзное производство, которое можно проверить»
  → образ: ИНДУСТРИАЛЬНЫЙ ОТЧЁТ О ЗАВОДЕ — развороты край в край, одна гигантская
  проверяемая цифра на разворот, графитовые полосы как вкладки номера,
  моно-колонтитулы в углу кадра.
Приёмы (3 из восьми, creative.md): контраст масштабов (цифры цоколя 2,5× крупнее h2),
  асимметричный разлом (одно полноширинное медиа на страницу), сквозной мотив.
Сквозной мотив: ОРАНЖЕВАЯ ЗАСЕЧКА 3 px — над цифрой цоколя (28×3), на цепочке
  сроков (3×14), на конце линейки вместимости, перед моно-подписью кадра, кромка
  видео. Наследует «оранжевую линию» v5, но становится размерной — инженерной.
  Один код: класс .tick (§4, п.14), а не пять разных ::before.
Подпись сайта: графитовый ЦОКОЛЬ ЦИФР под первым экраном четырёх ключевых страниц.
Движение: ровно три события — строки H1 из маски, счётчик цоколя, масштаб
  1,03→1 у полноширинных фото. Всё остальное статично, включая ховеры карточек.
Чем отличаемся от starbuilding.kz: у них иконки и схемы вместо завода; у нас —
  цех край в край, девять реальных сечений и цифры с сертификатом.
```

Это не новая концепция, а исполнение той, что записана 03.09 в `docs/research/05-referensy.md`: там же зафиксированы «цифры-манифест в 2,5 раза крупнее заголовков» и ровно эти три приёма моушена. Сайт от концепции отстал — движок подставил свои дефолты (fade-up на всём, цифры одного кегля с h2, всё в контейнере). План возвращает сайт к согласованной концепции, а не спорит с заказчиком.

---

## 1. Диагноз: почему «минималистично» читается как «бедно»

Проверено по коду и кадрам, а не по ощущению.

1. **Страница приезжает полупрозрачной.** `data-reveal` стоит на 756 узлах в `dist/` (главная — 8, /resheniya/ — 20, зерно — 38, /proizvodstvo/ — 29, /o-zavode/ — 27). Каждая секция при появлении 600 мс едет из `opacity:0` (`site.css:992`). На кадрах `home-02`, `home-12`, `proizvodstvo-02`, `resheniya-zernohranilishcha-05` заголовки и таблицы стоят серыми — это и есть ощущение «не догрузилось / пусто». Детектор моушена anti-slop: «все блоки появляются одинаково: fade-up, 0.5s, один easing» — совпадение.
2. **Цифры не событие.** `.pro-proof__value` — `clamp(35px,3.5vw,50px)` (`pro.css:146`), `.section-head__title` — `clamp(29px,3.4vw,48px)` (`pro.css:14`). Отношение 1,04. layout.md §2: разница в 1,3 раза не читается, в 2–3 — читается. Концепция 03.09 требовала 2,5×.
3. **Всё в одной колонке 1320 px.** Кроме первого экрана ни одного полноширинного медиа: «О заводе» (`home.mjs:138`) — фото 5:4 внутри `.container`, видео — «в рамке телефона» на сером. Разлома сетки (layout.md §4) нет — страница читается как лента.
4. **Ритм ровный.** `--sec: clamp(60px,6vw,92px)` (`pro.css:2`) у всех секций; `.section-head` везде `margin-bottom:40px`. Детектор: «одинаковые отступы между всеми секциями — ритма нет».
5. **Одинаковые сетки 4-в-ряд.** Цифры 4, типовые 4, аудитории 4 карточки одной высоты (`pro.css:86–105`). На /proizvodstvo/ — 8 рамочных карточек, на /o-zavode/ — 6 «статов» + 4 `pick-card`. Детектор: «всё в карточках».
6. **Серые коробки на самом важном.** `.side` (параметры решения), `.calc` (калькулятор), `.pick-card`, `.prod-card` — рамка + серый фон (`site.css:789, 944, 631, 698`). Именно они выглядят «из генератора».
7. **Инженерная графика с данными написана, но не подключена.** `sortamentStrip()` (`components.mjs:749`) и `typicalScheme()` (`:783`) живут только в варианте Б (`home-tz.mjs`); их CSS — только в `theme-tz.css`. В варианте А из шести графиков работают три: план кейса, схема модульности, карта.

Вывод: «минималистично» — не про количество элементов, а про отсутствие событий, масштаба и разлома. Лечится подачей существующих фактов, а не новыми картинками.

---

## 2. Три направления — оценка

Оценка судьи по четырём критериям (1–5) с поправками скептика.

| Критерий | Editorial «журнал о заводе» | Material «собран как каркас» | Catalog «каталог производителя» |
|---|---|---|---|
| Характер и «дорого» | **5** — одно событие на экран, тональный ритм, цоколь цифр как подпись | 4 — сильная система (швы, марка, токены), характер на деталях, не на событиях | 3 — самый узнаваемый паттерн: плитки с текстом на фото, мегаменю, «следующий проект» |
| Аудитория (агрохолдинги, строители, проектировщики) | 4 — цифры и цех продают «завод, не перекупщик» | 4 — цепочка сроков и сортамент — прямой ответ закупщику и проектировщику | **5** — все типы и их главная цифра на одном экране |
| Выполнимость за 1–2 дня | **4** — ~10 ч, почти всё проверено по коду | 3 — ~14 ч | 3 — ~22 ч; мегаменю и реестр документов не влияют на первое впечатление |
| Устойчивость к слопу | **4** — три движения вместо fade-up, реестры вместо карточек. *Скептик: 4 только после снятия вордмарка в подвале (§9) — это приём из шаблона движка* | 4 — плоская марка, швы, ноль теней; риск — 4 тёмных блока подряд | 3 — текст поверх светлых ИИ-рендеров, вордмарк, мегаменю |
| **Итого** | **17** | 15 | 14 |

Фактические ошибки в направлениях, подтверждённые кодом (исполнителям — не повторять):

- **Editorial.** «Фото первым на мобильном hero решений» — неверно: `site.css:1027–1034` на ≤1020 px намеренно ставит текст и кнопки над фото (ТЗ §18). Арифметика нарезки «25 с при 900 kbps ≤ 1,2 МБ» не сходится (≈2,8 МБ). `.pro-about` лежит внутри `.container` (`home.mjs:138`) — разворот требует перестроить секцию, не перекрасить.
- **Material.** «140 × 20 м / 8000 т» — сняты 13.09 (`video.mjs:9–16`). Белый моно-текст на `#f47b36` — контраст ≈2,6:1, для 10 px недопустимо; текст марки графитовый (`--on-accent`). `[data-video-loop] video` (`site.js:708`) поймает и основной ролик, если атрибут повесить на `.object-video__screen`. «Два графита» подтверждены (`pro.css:2` перекрывает `:root` из `site.css`) — сведение оттенков вне плана.
- **Catalog.** «Что держит 8000 тонн зерна» — запрещённая цифра. Плитки с текстом поверх восьми рендеров — контраст на `photo-vehicle-shelter`/`photo-sports-hall` и усиление роли генераций до согласования «Визуализации». Верно: `.manifest`, `.tiles`, `.footer__wordmark` написаны и не подключены; `.next-project` — подключён (`journal.mjs:180`), переиспользуем.

**Вердикт судьи подтверждён:** побеждает Editorial с прививками — из Material цепочка сроков, сортамент в тёмном развороте, токены «шов/марка/засечка», реестр аудиторий; из Catalog моно-строка спецификации под карточками, паспорт решения со схемой, полоса «Следующее решение», плитки типов в форме.

Тональный ритм главной после правок: hero + цоколь (графит) → решения (белый) → объект (белый) → **видео (графит)** → типовые (белый) → порядок (белый, см. п.9) → сотрудничество (белый) → проект (серый: в нём SVG-план) → **О заводе (графит + сортамент)** → документы (серый: превью PDF) → CTA (оранжевый) → подвал. Два графитовых контрапункта между hero и CTA — норма layout.md §3; серый остаётся только у секций с объектом.

---

## 3. Дорожки, файлы, общие правила

| Дорожка | Файлы (целиком) | Часы |
|---|---|---|
| **A «Главная»** | `src/pages/home.mjs`, `src/lib/experience.mjs`, `src/lib/video.mjs`, `src/assets/css/pro.css`, `src/assets/css/experience.css`, `src/data/home.json` | ≈ 9 |
| **B «Система»** | `src/lib/components.mjs`, `src/lib/layout.mjs`, `src/assets/css/site.css`, `src/assets/js/site.js` | ≈ 8 |
| **C «Внутренние»** | `src/pages/{solutions,production,about,portfolio,contact,documents,agro,tech,designers,builders,regions,journal,profili,network}.mjs`, все `src/data/*.json` кроме `home.json`, **новый** `src/assets/css/pages.css` | ≈ 13 первой очереди + 5 второй |
| **D «Медиа»** | **новый** `src/lib/graphics.mjs`, `src/assets/video/grain-loop.mp4` (через `tools/video_grain.sh`, вторая очередь), правки в `tools/` при нужде; в конце дня — `tools/screenshot.mjs` и проверка | ≈ 3 |

C — критический путь: пункты 16–18 идут второй очередью и не блокируют показ.

**Порядок слияния:** B (система) → D (медиа) → A и C параллельно.

**Правило тёмных блоков (обязательное, экономит половину CSS судьи).** Каждый новый графитовый блок несёт класс `section--dark` (`site.css:154`): он переопределяет `--paper/--ink/--muted/--line/--accent-deep` и `color-scheme`, поэтому `.eyebrow`, `.arrow-link`, `.btn--ghost`, `.lead`, `.kz-map`, `.object-video__*` перекрашиваются токенами. Без него `.eyebrow` останется `--accent-deep` (#ad4309) на #10191f — контраст ≈2,9:1, нечитаемо. Действующие значения `--gray-*` — из `pro.css:2` (#10191f и т. д.), они совпадают с hero. Дорожка B добавляет в `site.css` только новые имена (`--seam`, `--sec-tight`, `.tick`, `.mark`, `.plinth*`, `.ts-*`, `.sortament*`), pro.css их не трогает. `theme-tz.css` не редактируется никем.

**Правило графики.** `100vw` для полноширинных блоков запрещён (скроллбар Windows); только сетка с именованными линиями `[full-start] … [content-start] … [content-end] … [full-end]` (layout.md §4). Все новые SVG — с данными из JSON; `.ts-grid` (миллиметровка) выключена.

---

## 4. Изменения первой очереди (14), по силе влияния на первое впечатление

### 1. Графитовый цоколь цифр под первым экраном главной

- **Дорожки:** B (компонент `plinth()`, CSS, счётчик), A (замена `.pro-proof` в `home.mjs:46–53`, правки `pro.css:50–57,146–148`).
- **Что видит:** после аэросъёмки без зазора — сплошной графит: сверху три ссылки-этапа 01–03 (полоса `.factory-hero__bottom` становится непрозрачной), под ними четыре цифры 56–120 px белым (до 24 м · 100 % · 50+ лет · КМ / КМД) с оранжевой засечкой сверху, подпись 16 px, текст 14 px серым. При первом появлении на 60 % вьюпорта целые числа отсчитываются 0,9 с; «КМ» и нецелые — статичны.
- **Как (B, `components.mjs`, после `stat`):**
  ```js
  export function plinth(items, { size = 'lg', label = '' } = {}) {
    const isInt = (v) => /^\d+\+?$/.test(String(v));
    return html`<section class="${cx('plinth', `plinth--${size}`, 'section--dark')}" aria-label="${label}">
      <div class="container plinth__grid">${items.map((p) => html`<div class="plinth__item tick">
        <span class="plinth__val">${p.prefix ? html`<small>${p.prefix}</small>` : ''}${isInt(p.value)
          ? html`<span data-count="${String(p.value).replace('+', '')}" data-suffix="${String(p.value).endsWith('+') ? '+' : ''}" style="--ch:${String(p.value).length}ch">${p.value}</span>`
          : p.value}${p.unit ? html`<small>${p.unit}</small>` : ''}</span>
        ${p.title ? html`<h2 class="plinth__title">${p.title}</h2>` : ''}${p.text ? html`<p class="plinth__text">${p.text}</p>` : ''}
      </div>`)}</div></section>`;
  }
  ```
  **CSS (B, `site.css`, новый блок после §09):**
  ```css
  :root{--seam:#ffffff1f;--sec-tight:clamp(36px,4vw,56px)}
  .plinth{padding:clamp(40px,5vw,72px) 0 clamp(44px,5.5vw,80px)}
  .plinth__grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}
  .plinth__item{padding:0 32px;border-left:1px solid var(--seam)}
  .plinth__item:first-child{padding-left:0;border-left:0}
  .plinth__item.tick::before{margin-bottom:26px}
  .plinth__val{display:flex;align-items:baseline;gap:.12em;font:500 clamp(56px,8.4vw,120px)/.9 var(--f-d);letter-spacing:-.06em;color:var(--gray-0);font-variant-numeric:tabular-nums;margin:0 0 22px}
  .plinth__val small{font:500 12px/1 var(--f-m);letter-spacing:.1em;text-transform:uppercase;color:var(--muted);align-self:flex-end;margin-bottom:.45em}
  .plinth__val [data-count]{display:inline-block;min-width:var(--ch,2ch);text-align:right}
  .plinth__title{font:500 16px/1.4 var(--f-d);color:var(--gray-0);margin:0 0 6px}
  .plinth__text{font-size:14px;line-height:1.6;color:var(--muted);margin:0}
  .plinth--sm{padding:28px 0 32px}
  .plinth--sm .plinth__grid{grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}
  .plinth--sm .plinth__val{font-size:clamp(40px,4.6vw,64px);margin-bottom:10px}
  .plinth--sm .plinth__item.tick::before{margin-bottom:16px}
  .plinth--sm .plinth__title{font-size:14px;font-weight:400;color:var(--gray-300)}
  @media(max-width:900px){.plinth__grid{grid-template-columns:1fr 1fr;gap:28px 0}.plinth__item{padding:0 0 0 16px}.plinth__item:nth-child(odd){padding-left:0;border-left:0}.plinth__val{font-size:clamp(48px,14vw,64px)}}
  @media(max-width:400px){.plinth__val{font-size:44px}}
  ```
  **Счётчик (B, `site.js`, новый IIFE после `reveal`):**
  ```js
  (function counters(){
    var els=$$('[data-count]'); if(!els.length) return;
    if(reduced||!('IntersectionObserver' in window)) return;   // в HTML уже итоговое значение
    function run(el){var to=parseInt(el.getAttribute('data-count'),10),suf=el.getAttribute('data-suffix')||'',fin=el.textContent,t0=performance.now(),D=900;
      (function f(t){var p=Math.min(1,(t-t0)/D),k=1-Math.pow(1-p,3);el.textContent=Math.round(to*k)+suf;if(p<1)requestAnimationFrame(f);else el.textContent=fin;})(t0);}
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){io.unobserve(x.target);run(x.target);}});},{threshold:.6});
    els.forEach(function(el){io.observe(el);});
  })();
  ```
  **A:** `home.mjs:46–53` → `${plinth(home.proof,{size:'lg',label:'Возможности завода'})}` (импорт из components). В `pro.css` удалить `.pro-proof*` (строки 50–57, 131–133 фрагменты, 146–148, 135 print), добавить `.factory-hero__bottom{background:#10191f;border-top:1px solid var(--seam)}` вместо `#10191f25` (строка 37). Значения `home.json → proof` не меняются.
- **Мобильный 375:** 2×2, цифры 48–64 px; «КМ» + «/ КМД» в колонке ≈165 px помещаются (проверить 360). Полоса 01–03 складывается в одну строку как сейчас (`pro.css:44`). `min-width` в `ch` — CLS 0. Счётчик выключен при reduced-motion; без JS стоят итоговые числа.
- **Почему продаёт:** первое, что видит закупщик после кадра, — четыре проверяемых инженерных числа размером с заголовок газеты; это ответ «завод, а не перекупщик» без единого слова.
- **Эффорт:** B — 2 ч, A — 40 мин. **Скептик:** прошёл. `.section--dark` обязателен (см. §3).

### 2. Снять fade-up везде; оставить три движения

- **Дорожки:** B (`components.mjs`, `site.css:989–1002`, `site.js:88–105`), A (H1-маска `home.mjs:28` + `pro.css`), C (снять `data-reveal` в `pages/*` по ходу).
- **Что видит:** секции видны сразу и целиком. При загрузке главной три строки H1 выезжают из-под маски с шагом 90 мс. Цифры цоколя отсчитываются. Полноширинные фото (разворот «О заводе», разворот резки на /proizvodstvo/) при появлении садятся с 1,03 к 1. Ховер-зум на карточках снят — движение только там, где иерархия.
- **Как (B):** в `components.mjs` убрать `data-reveal` у `sectionHead` (:338), `pageHero` media (:392), `solutionCard` (:472), `solutionRow` (:499), `step` (:516), `stat` (:535), `faq__item` (:549), обеих обёрток `ctaBand` (:578, :585), `articleCard` (:601), `docRow` (:635), `portfolioCard` (:659), `grainCalcBlock` (:711). `site.css` §16 заменить целиком:
  ```css
  @media (prefers-reduced-motion: no-preference){
    html.js [data-photo-reveal] img{transform:scale(1.03);transition:transform var(--dur-3) var(--ease-out)}
    html.js [data-photo-reveal].is-in img{transform:none}
  }
  ```
  `site.js reveal()`: `var els=$$('[data-photo-reveal]')` (без `.hero-frame` — `heroFrame()` нигде не вызывается), threshold `.3`, `rootMargin:'0px'`, once. Оставшиеся в разметке `data-reveal` безвредны — C вычищает по ходу. Ховеры: удалить `pro.css:63` (`.pro-solution:hover … scale(1.025)`), `experience.css:16`, `site.css:582` и `:604`; стрелка `.arrow-link .arrow{translateX(4px)}` остаётся единственной реакцией на ховер. `img[data-fade]` (проявление после загрузки) — не анимация появления, остаётся.
  **Как (A):** `home.mjs:28` →
  `<h1 id="factory-title"><span class="l"><span>От проекта —</span></span><span class="l"><span>до стального</span></span><span class="l"><span class="accent">каркаса.</span></span></h1>` (без `<br>`). `pro.css:26` `.factory-hero h1>span{color:#f47b36}` → `.factory-hero h1 .accent{color:#f47b36}` (иначе все три строки станут оранжевыми) и добавить:
  ```css
  .factory-hero h1 .l{display:block;overflow:hidden;padding-bottom:.18em;margin-bottom:-.18em}
  .factory-hero h1 .l>span{display:block}
  @media(prefers-reduced-motion:no-preference){
    .factory-hero h1 .l>span{animation:h1-in .7s var(--ease-out) both}
    .factory-hero h1 .l:nth-child(2)>span{animation-delay:.09s}
    .factory-hero h1 .l:nth-child(3)>span{animation-delay:.18s}
    @keyframes h1-in{from{transform:translateY(110%)}}
  }
  ```
  Запас маски `.18em`, а не `.08em` судьи: у Golos descent 0,24 em, при line-height .99 полуинтерлиньяж −0,09 em, хвосты «д», «р» выходят на 0,15 em ниже строки — при .08em «до стального» и «проекта» подрезаются. Только transform внутри маски — высота hero не меняется, CLS 0, LCP-фото не затрагивается. `data-photo-reveal` ставит A на `.pro-spread__photo` (п.3), C — на `.prod-spread` (п.6). На LCP-картинки hero не вешать.
- **Мобильный:** те же три строки блочными span; 44 px на 375 → «до стального» ≈ 290 px входит в 331 px контейнера. Секции появляются мгновенно — страница ощущается быстрее.
- **Почему:** самый дешёвый пункт с самым большим эффектом: страница перестаёт «догружаться» при каждом скролле.
- **Эффорт:** B — 1 ч, A — 40 мин, C — 30 мин. **Скептик:** прошёл; это чистое удаление плюс возврат к трём приёмам, записанным 03.09.

### 3. Главная, «О заводе» — разворот край в край + сортамент

- **Дорожка:** A (`home.mjs:138–147`, `pro.css:113–119`, `experience.css:66–68, 106–108`). `sortamentStrip(d.profiles)` из `components.mjs:749` уже есть, `d.profiles` грузится (`build.mjs:81`), в нём 9 сечений ПС100…ПСУ280.
- **Что видит:** цех prod-baza во всю ширину окна высотой 70vh (мин. 520 px), затемнение слева и снизу; поверх — eyebrow «О заводе», h2 белым 36–68 px, лид, список с галочками, кнопки «О компании» / «Приехать на завод» / «Презентация PDF»; в правом нижнем углу моно-подпись «ПРОИЗВОДСТВЕННЫЙ КОРПУС · С. ТРОЕБРАТСКОЕ». Под кадром графит продолжается полосой: девять реальных сечений ПСУ/ПС по росту высоты, серым штрихом, последнее оранжевым, подписи «H 150…», строка «Сечения профилей собственной линии · сертификат РК · 43 типоразмера · толщина 1,5–3,5 мм» и ссылка «Сортамент и сечения → /profili/».
- **Как (A, `home.mjs`):** секция без `.container`:
  ```html
  <section class="pro-spread section--dark" id="zavod" aria-labelledby="zavod-title">
    <figure class="pro-spread__photo" data-photo-reveal style="--crop:${CROPS['prod-baza'].spread};--crop-m:${CROPS['prod-baza'].spreadMobile}">${raw(picture('prod-baza',{alt:'Производственный корпус Steppe Steel: линия профилирования и рулоны оцинкованной стали',sizes:'100vw'}))}</figure>
    <div class="pro-spread__body"><p class="eyebrow mono">О заводе</p><h2 id="zavod-title">${home.about.title}</h2><p class="lead">${home.about.text}</p>
      <ul class="pro-about__list">${home.about.items.map(t=>html`<li>${iconCheck}<span>${t}</span></li>`)}</ul>
      <div class="btn-row">…три ссылки как сейчас (home.mjs:142–145)…</div></div>
    <p class="pro-spread__cap mono tick tick--v">Производственный корпус · с. Троебратское</p>
    <div class="pro-spread__band"><div class="container">${sortamentStrip(d.profiles)}<a class="arrow-link" href="/profili/">Сортамент и сечения ${iconArrow}</a></div></div>
  </section>
  ```
  ```css
  .pro-spread{position:relative;isolation:isolate;display:grid;
    grid-template-columns:[full-start] minmax(var(--gutter),1fr) [content-start] min(100% - 2*var(--gutter),var(--container)) [content-end] minmax(var(--gutter),1fr) [full-end];
    grid-template-rows:minmax(clamp(520px,70vh,760px),auto) auto}
  .pro-spread__photo{grid-column:full;grid-row:1;position:relative;overflow:hidden;margin:0}
  .pro-spread__photo picture,.pro-spread__photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:var(--crop,60% 50%);aspect-ratio:auto}
  .pro-spread__photo::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(16,25,31,.9) 0,rgba(16,25,31,.55) 45%,rgba(16,25,31,.12) 100%),linear-gradient(0deg,rgba(16,25,31,.85),transparent 55%)}
  .pro-spread__body{grid-column:content;grid-row:1;align-self:end;position:relative;z-index:1;max-width:640px;padding:clamp(48px,6vw,96px) 0 clamp(40px,5vw,72px)}
  .pro-spread h2{color:var(--gray-0);font:500 clamp(36px,4.6vw,68px)/1.05 var(--f-d);letter-spacing:-.05em;white-space:pre-line;margin:0 0 .4em}
  .pro-spread .lead{font-size:17px;line-height:1.7;margin:0 0 24px}
  .pro-spread .pro-about__list{margin:0 0 32px} .pro-spread .btn-row{align-items:center;column-gap:24px} .pro-spread .arrow-link{font-size:14px}
  .pro-spread__cap{grid-column:content;grid-row:1;align-self:end;justify-self:end;position:relative;z-index:1;margin:0 0 24px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--gray-300)}
  .pro-spread__band{grid-column:full;grid-row:2;border-top:1px solid var(--seam);padding:40px 0 56px}
  /* сортамент — порт theme-tz.css:158–166,195–202 в тёмном исполнении */
  .sortament{display:grid;gap:12px}.sortament__row{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:10px;align-items:end;padding-bottom:12px;border-bottom:1px solid var(--seam)}
  .sortament__item{margin:0;display:grid;justify-items:center;gap:6px}
  .sortament__sec{width:100%;height:calc(40px + var(--k)*80px);color:var(--gray-300)}
  .sortament__sec path{fill:none;stroke:currentColor;stroke-width:8;vector-effect:non-scaling-stroke}
  .sortament__item:last-child .sortament__sec{color:var(--accent)}
  .sortament__cap{display:grid;justify-items:center;gap:2px;font-size:10px;letter-spacing:.04em;color:var(--muted);text-align:center}.sortament__cap b{color:var(--gray-0);font-weight:500}
  .sortament__note{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
  @media(max-width:900px){.pro-spread{grid-template-rows:auto auto auto}.pro-spread__photo{position:relative;aspect-ratio:4/3}.pro-spread__photo picture,.pro-spread__photo img{position:static;height:auto;aspect-ratio:4/3;object-position:var(--crop-m,55% 50%)}.pro-spread__photo::after{background:none}.pro-spread__body{grid-row:2;padding:28px 0 8px;max-width:none}.pro-spread__cap{grid-row:1;justify-self:start;margin:0 0 12px;text-shadow:0 1px 8px rgba(16,25,31,.9)}.pro-spread__band{grid-row:3;padding:28px 0 40px}}
  @media(max-width:640px){.sortament__row{grid-template-columns:repeat(5,minmax(0,1fr))}.sortament__item:nth-child(n+6){display:none}.sortament__sec{height:calc(32px + var(--k)*56px)}}
  @media(max-width:400px){.sortament__row{grid-template-columns:repeat(4,minmax(0,1fr))}.sortament__item:nth-child(n+5){display:none}}
  ```
  Удалить `.pro-about*` из `pro.css:113–119` и `experience.css:66–68` (кроме `.pro-about__list*`, они переиспользуются). `CROPS` — из `graphics.mjs` (дорожка D). prod-baza-1526.webp = 97 КБ, lazy, не LCP; на 1920 кадр 1526 px растянется на 25 % — лёгкая мягкость, для документального кадра допустимо.
- **Мобильный:** фото блоком 4:3 без наложения текста; подпись на фото снизу слева с тенью; текст под фото на графите; кнопки в столбик (`.btn-row` ≤720 уже столбик); сортамент 5 (≤640) и 4 (≤400) сечения.
- **Почему:** это единственный разлом сетки на главной (layout.md §4 — один раз и крупно) и единственная секция, где «завод» показан физически край в край; сортамент под ним — факт, которого нет ни у одного конкурента в КЗ.
- **Эффорт:** 2 ч. **Скептик:** прошёл с оговоркой: prod-baza стоит ещё в hero /proizvodstvo/ и /o-zavode/ — три показа одного кадра по сайту, как и сегодня (не регресс). Если D успевает — на /o-zavode/ hero заменить на prod-svarka (983 px, в колонку 720 px входит).

### 4. Видео-секция графитовая (нарезка-луп — вторая очередь)

- **Дорожки:** A (`video.mjs`, `experience.css:137–168`, `home.mjs:85`), D (луп, вторая очередь). C подключает на /resheniya/zernohranilishcha/ через опцию `dark:true`.
- **Что видит:** секция становится графитовой; вместо «рамки телефона» — вертикальный кадр 9:16 с оранжевой 3 px кромкой слева, постер и кнопка «Смотреть» (4:00 · со звуком). Главы 17 px белым с моно-таймкодами оранжевым, четыре факта (67 т · Без бетона · Без сварки · Наклонные стены — как в `video.mjs`) 26–34 px белым. Когда будет готов луп (§5, п.16-D) — в кадре беззвучно идёт 12–15 с каркаса, пока не нажата «Смотреть».
- **Как (A, `video.mjs`):** `objectVideo({dark:true, loop:false})` → `<section class="section${opts.dark?' section--dark object-video--dark':opts.tint?' section--tint':''} object-video">`. Eyebrow `'03 / Объект на видео'` → `'Объект на видео'`. `home.mjs:85` → `objectVideo({id:'video',dark:true})`. Для лупа (когда `opts.loop && файл есть`) — обёртка вставляется **после** основного `<video>` и **перед** кнопкой `data-video-play`:
  ```html
  <div class="object-video__loopwrap" data-video-loop aria-hidden="true">
    <video class="object-video__loop" muted loop playsinline preload="metadata" width="480" height="854" poster="${poster}"><source src="/assets/video/grain-loop.mp4" type="video/mp4"></video>
  </div>
  ```
  Порядок в DOM принципиален: `site.js:668` берёт `box.querySelector('video')` — первый `<video>` в фигуре; если луп стоит до основного ролика, «Смотреть» и главы будут управлять лупом. Дорожка B дополнительно меняет `site.js:668` на `box.querySelector('.object-video__video')`. Абсолютно позиционированная обёртка рисуется поверх статичного `<video>` с постером, кнопка (позже в DOM, тоже absolute) — поверх обёртки. При запуске основного ролика `box` получает `.is-playing` (`site.js:692`) → `.object-video__player.is-playing .object-video__loopwrap{display:none}`; observer лупа (`site.js:708–717`) ставит паузу, потому что элемент вышел из вьюпорта.
  ```css
  .object-video--dark .object-video__screen{border:0;box-shadow:none;border-left:3px solid var(--accent);background:var(--gray-900)}
  .object-video--dark .object-video__chapter .mono{color:var(--accent)}
  .object-video__player{max-width:420px} .object-video__play-icon{box-shadow:none}
  .object-video__chapter{font-size:17px;min-height:54px}
  .object-video__facts dt{font-weight:500;font-size:clamp(26px,2.4vw,34px)}
  .object-video__loopwrap{position:absolute;inset:0} .object-video__loop{width:100%;height:100%;object-fit:cover}
  .object-video__player.is-playing .object-video__loopwrap{display:none}
  ```
  Остальные цвета (`.section-head__title`, `dt`, `dd`, `.lead`, `.object-video__cap`, границы глав) перекрашивает `.section--dark` через токены `--ink/--muted/--line` — руками не переопределять.
- **Мобильный:** кадр до 340 px (`experience.css:167`), главы под кадром, факты 2×2 по 26 px. Липкая панель белая на графите — у неё свой фон `--gray-0`, не сливается.
- **Почему:** второй графитовый контрапункт главной; видео с площадки — самый сильный довод «свой объект», и на графите оно читается как кино, а не как виджет.
- **Эффорт:** A — 1 ч (без лупа). **Скептик:** прошёл. Луп (D 1,5 ч + A 30 мин) отправлен во вторую очередь: он четвёртое непрерывное движение и 1,2 МБ трафика; секция продаёт и без него.

### 5. Страницы решений: фото до края окна, моно-подпись, цоколь цифр

- **Дорожки:** B (`pageHero` — новый параметр `variant:'photo'` → класс `page-hero--bleed`; `site.css` после :528), C (`solutions.mjs:129–144`, `solutions.json` → новое поле `proof`).
- **Что видит:** на 1440 кадр решения уходит в правый край окна и вырастает до 420–600 px высоты; по нижней кромке лёгкий градиент и моно-подпись 11 px капсом в углу (только существующий `coverCaption`, никаких новых заявлений о принадлежности объекта). Сразу под hero — графитовый цоколь `plinth--sm` из 2–3 проверенных цифр: зерно «67 т · до 140 м · 10 дней», ангары «до 24 м · 100 % · 18×36 / 24×60», склады «до 24 м · 100 % · 50+ лет». У решений без `proof` цоколь не выводится — никаких нулей.
- **Как (B, `components.mjs:374`):** `pageHero({…, variant})`; при `variant==='photo'` к `<section>` добавляется `page-hero--bleed`. Режим **опциональный**: без `variant` остаётся сегодняшний сплит — иначе `/proektirovshchikam/` (hero `tech-hub`, `designers.mjs:21`, contain на серой подложке) получил бы градиент и растяжку рендера. `site.css`:
  ```css
  .page-hero--bleed>.container{width:auto;max-width:none;margin:0}
  .page-hero--bleed .page-hero__grid{grid-template-columns:[full-start] minmax(var(--gutter),1fr) [content-start] minmax(0,calc(var(--container)/2)) [mid] minmax(0,calc(var(--container)/2)) [content-end] minmax(var(--gutter),1fr) [full-end]}
  .page-hero--bleed .page-hero__body{grid-column:content-start/mid;padding-right:var(--space-xl)}
  .page-hero--bleed .page-hero__media{grid-column:mid/full-end;min-height:clamp(420px,42vw,600px)}
  .page-hero--bleed .page-hero__media::after{content:"";position:absolute;left:0;right:0;bottom:0;height:30%;background:linear-gradient(0deg,rgba(16,25,31,.7),transparent);pointer-events:none}
  .page-hero--bleed .page-hero__media .solution-image-note{background:none;padding:0;left:16px;bottom:14px;font:400 11px/1.4 var(--f-m);letter-spacing:.08em;text-transform:uppercase;text-shadow:0 1px 8px rgba(16,25,31,.8);z-index:2}
  @media(max-width:1020px){.page-hero--bleed .page-hero__grid{grid-template-columns:[full-start] var(--gutter) [content-start] minmax(0,1fr) [content-end] var(--gutter) [full-end]}.page-hero--bleed .page-hero__body{grid-column:content;padding-right:0}.page-hero--bleed .page-hero__media{grid-column:full;min-height:0;aspect-ratio:4/3}}
  ```
  Тройной селектор перебивает `.solution-image-note` из `experience.css:74` (грузится после site.css). Оранжевая 4 px кромка `.page-hero__media::before` остаётся (это та же засечка).
  **Как (C):** `solutions.mjs:129` → `pageHero({variant:'photo', …как сейчас})`; `about.mjs:17` — тоже `variant:'photo'`. В `solutions.json` у zernohranilishcha/angary/sklady поле `proof`, значения только из `specs`/`site.proof`:
  `zernohranilishcha: [{value:'67',unit:'т',title:'пшеницы на 1 м длины'},{prefix:'до',value:'140',unit:'м',title:'длина секциями'},{value:'10',unit:'дней',title:'комплект типового'}]`;
  `angary: [{prefix:'до',value:'24',unit:'м',title:'пролёт без колонн'},{value:'100',unit:'%',title:'болтовая сборка'},{value:'18×36 / 24×60',title:'типовые размеры'}]`;
  `sklady: [{prefix:'до',value:'24',unit:'м',title:'пролёт без колонн'},{value:'100',unit:'%',title:'болтовая сборка'},{value:'50+',unit:'лет',title:'срок службы каркаса'}]`.
  В `solutions.mjs` после `pageHero(...)`: `${s.proof?.length ? plinth(s.proof,{size:'sm',label:'Ключевые цифры'}) : ''}`; у первой секции убрать `section--flush-top`, если цоколь выведен.
- **Мобильный 375:** порядок по ТЗ §18 — крошки, H1, лид, оффер, две кнопки, **потом** фото 4:3 край в край, подпись в углу, затем цоколь 2+1 по 48 px. Ничего не наезжает на липкую панель.
- **Почему:** посадочные под рекламу; фото до края + три цифры дают «спецификацию решения» в первом экране — так делает ruukki, и так закупщик отличает завод от прайс-агрегатора.
- **Эффорт:** B — 1,5 ч, C — 1 ч. **Скептик:** прошёл. «100 %» у ангаров берётся из `home.json → proof` (общий факт ЛСТК), не из `specs` ангаров — допустимо, факт сайта.

### 6. /proizvodstvo/: фото до края, цоколь, переделы разворотами, кадр резки во всю ширину

- **Дорожки:** C (`production.mjs`, `production.json`, `pages.css`), B (`variant:'photo'` из п.5), D (`CROPS['prod-rezka'].spread`).
- **Что видит:** первый экран — сплит на белом, но prod-baza уходит в правый край и растёт до 600 px (п.5); под ним цоколь `plinth--sm` в одну строку: 43 · до 3,5 мм · 100 % · 30–45 (из `production.stats`). «Путь металла» — восемь разворотов вместо восьми рамочных карточек: фото 7/12, текст 5/12, стороны чередуются, номер передела 44–72 px обычным начертанием, название 22–30 px с линейкой сверху; между 04 и 05 — кадр prod-rezka (2003 px) во всю ширину 21:9 с моно-подписью «04 · РЕЗКА ПО КАРТАМ РАСКРОЯ». Рамок и заливок нет.
- **Как (C, `production.mjs`):** `pageHero({variant:'photo', image:'prod-baza', imageCaption:'Производственный корпус · с. Троебратское', …})`. Секцию `hero__stats--flat` (:28–32) заменить на `plinth(production.stats.map(s=>({value:s.val.replace(/^до /,'').replace(/ мм$| %$/,''),unit:(s.val.match(/ (мм|%)$/)||[])[1]||'',prefix:/^до /.test(s.val)?'до':'',title:s.key})),{size:'sm',label:'Производство в цифрах'})` — «30–45» и «3,5» нецелые, статичны; 43 и 100 отсчитываются. Секция переделов:
  ```html
  <section class="section prod-flow-wrap">   <!-- без section--tint, белая -->
    ${sectionHead(…как сейчас…)}
    <ol class="prod-flow">${first4.map(row)}</ol>
    <figure class="prod-spread" data-photo-reveal style="--crop:${CROPS['prod-rezka'].spread}">${raw(picture('prod-rezka',{alt:'Плазменная резка по картам раскроя — производство Steppe Steel',sizes:'100vw'}))}<figcaption class="mono tick tick--v">04 · Резка по картам раскроя</figcaption></figure>
    <ol class="prod-flow" start="5">${last4.map(row)}</ol>
  </section>
  ```
  `row = (s,i) => html\`<li class="prod-flow__row${i%2?' prod-flow__row--rev':''}${hasImage(s.photoSlot)?'':' prod-flow__row--text'}" id="${s.id}">${hasImage(s.photoSlot)?html\`<figure class="prod-flow__media">${raw(picture(s.photoSlot,{alt:\`${s.title} — производство Steppe Steel\`,sizes:'(min-width:860px) 58vw, 100vw'}))}</figure>\`:''}<div class="prod-flow__body"><span class="prod-flow__num">${nn(i)}</span><h2>${s.title}</h2><p>${s.text}</p></div></li>\``. В `production.json`: `rezka.photoSlot` → `""` (коллаж prod-plazma уходит, п.15 разбора 11.09; кадр резки — разворот) и `otgruzka.photoSlot` → `""` (сейчас там prod-baza — тот же кадр, что в hero страницы; дубль на одной странице недопустим). `pages.css`:
  ```css
  .prod-flow-wrap{display:grid;grid-template-columns:[full-start] minmax(var(--gutter),1fr) [content-start] min(100% - 2*var(--gutter),var(--container)) [content-end] minmax(var(--gutter),1fr) [full-end]}
  .prod-flow-wrap>*{grid-column:content} .prod-flow-wrap>.prod-spread{grid-column:full}
  .prod-flow{display:grid;gap:clamp(48px,6vw,96px) 0;margin:0}
  .prod-flow__row{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--space-l);align-items:center}
  .prod-flow__media{grid-column:1/8;aspect-ratio:4/3;overflow:hidden;margin:0} .prod-flow__media img,.prod-flow__media picture{width:100%;height:100%;object-fit:cover}
  .prod-flow__body{grid-column:8/13} .prod-flow__row--rev .prod-flow__media{grid-column:6/13;order:2} .prod-flow__row--rev .prod-flow__body{grid-column:1/5}
  .prod-flow__row--text .prod-flow__body{grid-column:1/8}
  .prod-flow__num{font:400 clamp(44px,5vw,72px)/1 var(--f-d);letter-spacing:-.05em;color:var(--ink)}
  .prod-flow__body h2{font-size:clamp(22px,2.2vw,30px);font-weight:500;margin:12px 0 10px;padding-top:12px;border-top:1px solid var(--ink)}
  .prod-flow__body p{font-size:16px;color:var(--ink-2);max-width:44ch;margin:0}
  .prod-spread{margin:clamp(48px,6vw,96px) 0;position:relative;overflow:hidden}.prod-spread picture,.prod-spread img{width:100%;aspect-ratio:21/9;object-fit:cover;object-position:var(--crop,50% 45%)}
  .prod-spread figcaption{position:absolute;right:var(--gutter);bottom:16px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#fff;text-shadow:0 1px 8px rgba(16,25,31,.9)}
  @media(max-width:860px){.prod-flow__row{grid-template-columns:1fr;gap:14px}.prod-flow__media,.prod-flow__row--rev .prod-flow__media{grid-column:1;order:0;aspect-ratio:16/10}.prod-flow__body,.prod-flow__row--rev .prod-flow__body,.prod-flow__row--text .prod-flow__body{grid-column:1}.prod-flow__num{font-size:40px}.prod-spread picture,.prod-spread img{aspect-ratio:4/3}.prod-spread figcaption{position:static;display:block;padding:8px var(--gutter) 0;color:var(--muted);text-shadow:none}}
  ```
  4:3 у рядов, а не 3:2 судьи: prod-komplekt (1254×1206), prod-profil (1009×1012), prod-otgruzka (868×1008) — квадратные и портретные, в 3:2 от них остаётся полоса.
- **Мобильный:** текст hero над фото 4:3 (п.5), цоколь 2×2 по 48 px, переделы столбиком: фото 16:10, номер 40 px, текст; кадр резки 4:3 с подписью под ним.
- **Почему:** ТЗ §12 — «посетитель должен убедиться, что перед ним реальное предприятие»; развороты без рамок и один кадр во всю ширину — документальная подача borga.se.
- **Эффорт:** C — 3 ч, B — 0 (режим из п.5), D — 15 мин (кроп). **Скептик:** тёмный полноэкранный hero `variant:'cover'` судьи **вычеркнут из первой очереди** (§9): 30.08 записано «полноэкранный тёмный хиро не делаем», отменено 03.09 только для главной; второй тёмный фото-hero делает все ключевые страницы «на одно лицо» (фирменный слоп). ТЗ §3 «большие фотографии реального производства» закрывает кадр prod-rezka 21:9. Если Рамазан сам попросит — cover-вариант за 1 ч по коду судьи, отдельным согласованием.

### 7. Главная, типовые здания → реестр «листов КМ» со схемами

- **Дорожки:** A (`home.mjs:87–101`, `pro.css:86–94,155–157`, `experience.css:98–104`), B (порт `.ts-*` из `theme-tz.css:178–186` в `site.css`; `typicalScheme` в `components.mjs:783`).
- **Что видит:** четыре серые плитки → четыре строки на линейках: слева схема поперечной рамы с размерной линией «ПРОЛЁТ 18 000» и подписью «L = 36 м» (у зернохранилищ — разрез с наклонными стенами и «L = 45 м / 140 м»), затем название 24–32 px, параметры моно-строками, справа «Рассчитать этот вариант →» и тихая «Параметры здания». Миллиметровка `.ts-grid` выключена — только линии с данными.
- **Как (A):** габариты берутся из `title` (в `solutions.json` ничего не добавляем — файл дорожки C):
  ```js
  const scheme = (t) => { const m = t.title.match(/(\d+)\s*×\s*(\d+)/), g = t.title.match(/(\d+)\s*м$/);
    return m ? { kind:'frame', span:`ПРОЛЁТ ${m[1]} 000`, length:`L = ${m[2]} м` } : { kind:'grain', length:`L = ${g[1]} м` }; };
  ```
  ```html
  <ol class="pro-sheets">${items.map((t,i)=>html`<li class="pro-sheet">
    <div class="pro-sheet__scheme">${typicalScheme({...scheme(t),label:t.title})}</div>
    <div><span class="pro-sheet__num mono">${nn(i)}</span><h3>${t.title}</h3></div>
    <dl class="pro-sheet__params mono">${t.params.map(([k,v])=>html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>
    <div class="pro-sheet__links"><a class="arrow-link pro-typical__cta" href="${t.url}">Рассчитать этот вариант ${iconArrow}</a>${t.pageUrl?html`<a class="pro-typical__page" href="${t.pageUrl}">Параметры здания</a>`:''}</div>
  </li>`)}</ol>
  ```
  ```css
  .pro-sheets{border-top:1px solid var(--ink);margin:0}
  .pro-sheet{position:relative;display:grid;grid-template-columns:260px minmax(0,1.1fr) minmax(0,1fr) auto;gap:32px;align-items:center;padding:26px 0;border-bottom:1px solid var(--line);transition:background .2s}
  .pro-sheet:hover{background:var(--paper-2)} .pro-sheet .ts{width:260px;height:auto;display:block}
  .pro-sheet__num{display:block;font-size:11px;color:var(--muted);margin-bottom:8px}
  .pro-sheet h3{font:500 clamp(24px,2.2vw,32px)/1.15 var(--f-d);letter-spacing:-.04em;margin:0}
  .pro-sheet__params{display:grid;gap:6px;font-size:13px;margin:0}.pro-sheet__params>div{display:flex;gap:8px}.pro-sheet__params dt{color:var(--muted)}.pro-sheet__params dt::after{content:" —"}.pro-sheet__params dd{margin:0}
  .pro-sheet__links{display:grid;justify-items:end;gap:2px}
  @media(max-width:900px){.pro-sheet{grid-template-columns:1fr;gap:14px}.pro-sheet .ts{width:100%;max-width:340px}.pro-sheet__links{justify-items:start}}
  ```
  **B (`site.css`, порт):** `.ts{display:block}.ts-grid{display:none}.ts-ground{stroke:var(--gray-300);stroke-width:1.2}.ts-main{stroke:var(--ink);stroke-width:1.6;fill:none}.ts-web line{stroke:var(--gray-300);stroke-width:1}.ts-fill{fill:var(--orange-100);stroke:none}.ts-dim line{stroke:var(--accent);stroke-width:1.1}.ts-dim text{font:12.5px var(--f-m);fill:var(--orange-700);letter-spacing:.06em}.ts-note{font:12.5px var(--f-m);fill:var(--muted);letter-spacing:.08em}`. Кегль 12,5 px в viewBox 300 при ширине 260 px даёт ≈11 px на экране; 10 px судьи давали 8 px — нечитаемо (typography.md §3). Удалить `.pro-typical*`, `.pro-typicals` из `pro.css` (кроме `.pro-typical__cta::after` и `.pro-typical__page` в `experience.css:98–104` — они переиспользуются).
- **Мобильный:** строка в столбик: схема 100 % (335×167, подписи ≈14 px), название 24 px, параметры, ссылка ≥44 px; вся строка кликабельна через `.pro-typical__cta::after`.
- **Почему:** muellerinc: выбранная типовая конфигурация показана схемой с размерами и одним кликом становится заявкой (`/raschet/?type&w&l` уже работает, разбор 11.09 п.11). Это графика с данными, не «чертёж ради чертежа»: пролёт и длина — из подтверждённых типовых, миллиметровки нет.
- **Эффорт:** A — 1,5 ч, B — 20 мин. **Скептик:** прошёл, с планом Б: если Рамазан скажет «опять чертежи», колонка схемы снимается одним правилом (`grid-template-columns:minmax(0,1.1fr) minmax(0,1fr) auto`) — реестр остаётся.

### 8. Главная, «Порядок работы» → размерная цепочка сроков

- **Дорожка:** A (`home.mjs:103–114`, `pro.css:95–99`, `experience.css:94–96`, `home.json → process`).
- **Что видит:** над шестью шагами сплошная графитовая линия 2 px с шестью оранжевыми засечками; под каждой — срок крупно 22–28 px (24/7 · 24 часа · 7–10 дней · 15–20 дней · 2–5 дней · 10–15 дней), номер мелко, заголовок 17 px, текст 14 px. Декоративные оранжевые «04 05 06» по 40 px уходят. Цепочка заканчивается графитовой плашкой: **30–45 дней** «до контура здания после утверждения КМД» + строка про типовое зернохранилище за 10 дней. Секция белая (серый — только у секций с объектом, п.14).
- **Как (A):** `home.json`: `process.terms[0]` → `"24/7"`, `descriptions[0]` → «Отвечаем в WhatsApp круглосуточно; обсуждаем назначение, регион и размеры.»; новое `process.sum:{value:"30–45",unit:"дней",text:"до контура здания после утверждения КМД"}`; `note` → «Типовое зернохранилище — конструкции в наличии, комплект за 10 дней.» (все сроки — `production.json:64–95`, факты не меняются).
  ```html
  <ol class="pro-chain">${steps.map((s,i)=>html`<li><span class="tick tick--v pro-chain__tick" aria-hidden="true"></span><span class="pro-chain__term">${home.process.terms?.[i]||s.duration}</span><span class="pro-chain__num mono">${nn(i)}</span><h3>${s.title}</h3><p>${home.process.descriptions[i]}</p></li>`)}</ol>
  <p class="pro-chain__sum"><b>${home.process.sum.value} <small>${home.process.sum.unit}</small></b><span>${home.process.sum.text}</span><span>${home.process.note}</span></p>
  ```
  ```css
  .pro-chain{position:relative;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:0 24px;padding-top:34px;margin:0}
  .pro-chain::before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:var(--ink)}
  .pro-chain li{position:relative} .pro-chain__tick{position:absolute;left:0;top:-40px}
  .pro-chain__term{display:block;font:500 clamp(22px,2vw,28px)/1 var(--f-d);letter-spacing:-.04em;font-variant-numeric:tabular-nums;white-space:nowrap;margin-bottom:12px}
  .pro-chain__num{display:block;font-size:11px;color:var(--muted);margin-bottom:8px}
  .pro-chain h3{font-size:17px;font-weight:500;margin:0 0 8px} .pro-chain p{font-size:14px;color:var(--muted);margin:0}
  .pro-chain__sum{margin-top:40px;background:var(--gray-950);color:#fff;padding:22px 28px;border-left:3px solid var(--accent);display:grid;grid-template-columns:auto 1fr;gap:4px 24px;align-items:baseline}
  .pro-chain__sum b{font:500 clamp(32px,3.4vw,48px)/1 var(--f-d);letter-spacing:-.05em;grid-row:span 2;white-space:nowrap}
  .pro-chain__sum b small{font:500 12px var(--f-m);letter-spacing:.1em;text-transform:uppercase;color:var(--gray-400)} .pro-chain__sum span{font-size:14px;color:var(--gray-300)}
  @media(max-width:900px){.pro-chain{grid-template-columns:1fr;gap:26px;padding:0 0 0 28px}.pro-chain::before{top:0;bottom:0;left:0;right:auto;width:2px;height:auto}.pro-chain__tick{left:-28px;top:6px}.pro-chain__tick::before{width:14px;height:3px}.pro-chain__term{font-size:24px}.pro-chain__sum{grid-template-columns:1fr;padding:20px}.pro-chain__sum b{grid-row:auto;font-size:32px}}
  ```
  Удалить `.pro-process*` (`pro.css:95–99`) и `.pro-process__term` (`experience.css:95–96`); `#process` без `section--tint`.
- **Мобильный:** вертикальная линия слева, засечки горизонтальные, сроки 24 px, плашка-сумма в одну колонку.
- **Почему:** главный вопрос закупщика «сколько ждать» (панель 11.09 п.6) получает ответ крупнее любого декора; засечки — тот же мотив, что над цифрами цоколя.
- **Эффорт:** 1,5 ч. **Скептик:** прошёл.

### 9. Главная: спецификация под карточками, номера долой, аудитории реестром, ритм, серая коробка → линия

- **Дорожка:** A (`home.mjs`, `pro.css`, `experience.css:76–84`).
- **Что видит:** под названием каждого типа здания — моно-строка капсом из `cardMeta` («ПРОЛЁТ ДО 24 М · ХОЛОДНЫЙ ИЛИ ТЁПЛЫЙ КОНТУР»), на телефоне — вместо скрытого описания. Eyebrow секций без «0N /» — нумерация остаётся только у шагов, переделов и в полосе 01–03, где она значит порядок. «Сотрудничество» — четыре строки реестра со стрелкой вместо четырёх одинаковых карточек. Плашка «Не знаете, какой каркас выбрать?» — строка с линейкой сверху, а не серая коробка. Отступы разные: плотно у связанных блоков, шире перед новой темой.
- **Как (A):** в обоих циклах `home.mjs:64,74` после `<h3>…</h3><span class="pro-solution__arrow">…</span>`: `${s.cardMeta?.length ? html\`<span class="pro-solution__spec mono">${s.cardMeta.join(' · ')}</span>\` : ''}`; `pro.css`: `.pro-solution__spec{grid-column:1/-1;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--orange-700);margin:-4px 0 6px}`; `experience.css` ≤640: `.pro-solutions--all .pro-solution__spec{font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`. Метки: `'Решения'`, `'Объект завода'` (`experience.mjs:27`), `'Типовые здания'`, `'Порядок работы'`, `'Сотрудничество'`, `${obj.badge}`, `'О заводе'`. Аудитории: убрать `.pro-audience__num`; `.pro-audiences{grid-template-columns:1fr;gap:0;border-top:1px solid var(--ink)}.pro-audience{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,3fr) auto;gap:24px;align-items:center;padding:20px 0;border:0;border-bottom:1px solid var(--line);background:none}.pro-audience h3{font-size:20px;margin:0}.pro-audience p{margin:0;font-size:14px}.pro-audience .arrow-link{margin:0;white-space:nowrap}`. `.pro-help{background:none;padding:22px 0 0;border-top:1px solid var(--ink)}`. Ритм: `.pro-home .section-head{margin-bottom:32px}`, `#resheniya{padding-top:clamp(64px,7vw,96px)}`, `#engineering{padding-block:clamp(80px,8vw,120px) clamp(64px,7vw,96px)}`, `.object-video{padding-block:clamp(48px,5vw,72px)}`, `#tipovye{padding-top:clamp(64px,7vw,96px)}`, `#process{padding-block:clamp(56px,6vw,80px)}`, `#partnyorstvo{padding-block:clamp(40px,4vw,56px)}`, `#obekty{padding-block:clamp(64px,7vw,96px)}`, `.document-shelf{padding-block:clamp(64px,7vw,96px)}`.
- **Мобильный:** строка спецификации 10 px в одну строку с обрезкой; реестр аудиторий в одну колонку (заголовок, текст, ссылка ≥44 px) — экономит ≈600 px против четырёх карточек.
- **Почему:** llentab — назначение здания строкой под карточкой; anti-slop — иерархия размерами и ритмом, а не рамками. Снятие «0N /» в дизайн-проходе уместно (скептик 11.09 отклонял его только как «вкусовщину» в баг-фикс-пакете).
- **Эффорт:** 1,5 ч. **Скептик:** прошёл. Блок `.engineering-deliverables` (три колонки 01 РАСЧЁТ / 02 КМ / 03 КМД) не трогать: это последовательность стадий, а не «три преимущества с иконками» — детектор не срабатывает.

### 10. Страницы решений: «Паспорт решения» вместо серой коробки

- **Дорожка:** C (`solutions.mjs:169–173`, `pages.css`; `typicalScheme` и `specs` — из `components.mjs`, только импорт).
- **Что видит:** aside становится белым листом с графитовой линейкой сверху: моно-заголовок «ПАСПОРТ РЕШЕНИЯ · ЗЕРНОХРАНИЛИЩА», схема рамы/разреза с размерной линией (только там, где число подтверждено: «ДО 24 000» у решений с «24 м» в `specs`; у зерна — разрез с «ДЛИНА ДО 140 М»), ниже те же характеристики, но значения с цифрами набраны JetBrains Mono, первые три строки крупнее, кнопка «Получить расчёт».
- **Как (C):**
  ```js
  const hasSpan = (s.specs||[]).some(r=>/24\s*м/.test(r.val)); const isGrain = s.slug==='zernohranilishcha';
  const schemeSvg = isGrain ? typicalScheme({kind:'grain',length:'ДЛИНА ДО 140 М',label:s.title}) : hasSpan ? typicalScheme({kind:'frame',span:'ПРОЛЁТ ДО 24 000',label:s.title}) : '';
  ```
  `<aside class="side side--passport"><p class="side__title mono">Паспорт решения · ${s.short}</p>${schemeSvg}${specs((s.specs||[]).map(r=>({...r,val:/\d/.test(r.val)?html\`<span class="mono">${r.val}</span>\`:r.val})))}<a class="btn btn--primary btn--wide" href="${calcUrl}">${ctaTitle}</a></aside>` — `html\`\`` возвращает помеченный объект, `specs()` вставит его без повторного экранирования (`util.mjs:46–74`, проверено).
  ```css
  .side--passport{background:var(--paper);border:0;border-top:2px solid var(--ink);border-radius:0;padding:var(--space-s) 0 0}
  .side--passport .ts{width:100%;height:auto;margin:var(--space-xs) 0 var(--space-s);background:var(--paper-2)}
  .side--passport .specs__row:nth-child(-n+3) .specs__val{font-size:1.05rem;font-weight:600}
  ```
- **Мобильный:** aside не липкий (≤1020 уже `position:static`), схема 335 px, строки характеристик в столбик (≤720 уже), кнопка во всю ширину.
- **Почему:** «паспорт» — язык проектировщика и закупщика; серая рамка была самым узнаваемым «генераторным» элементом на девяти посадочных.
- **Эффорт:** 1,5 ч. **Скептик:** прошёл; у всех восьми нефлагманских решений в `specs` есть «до 24 м» — схема появится на всех девяти страницах, каждая с подтверждённым числом.

### 11. /resheniya/zernohranilishcha/: шкала вместимости + гигантский результат калькулятора

- **Дорожки:** D (`capScale()` в `graphics.mjs`), C (`solutions.mjs:199–252`, `pages.css`), B (`grainCalcBlock({bare:true})` + 8 строк JS-подсветки).
- **Что видит:** три секции (#vmestimost, #calc, «Экономика») — один разворот 5/7: слева пять культур горизонтальными линейками, длина пропорциональна т/м (70…37), на конце оранжевая засечка и моно-значение «67 т · ≈ 45 м», выбранная в калькуляторе культура подсвечена; справа калькулятор без серой коробки, результат «≈ 45 м» 56–104 px — единственная гигантская цифра страницы; под ним четыре пункта экономики нумерованным списком и ссылка «Посчитать окупаемость →».
- **Как (D, `graphics.mjs`):**
  ```js
  import { html } from './util.mjs';
  export function capScale(rows, { example = '3 000 т' } = {}) {  // rows: solutions.json → capacity.rows
    const num = (s) => parseFloat(String(s).replace(',', '.').replace(/[^\d.]/g, ''));
    const max = Math.max(...rows.map((r) => num(r[1])));
    return html`<ol class="cap-scale" style="--max:${max}" aria-label="Вместимость на 1 м длины по культурам">${rows.map((r) => html`<li style="--v:${num(r[1])}" data-crop="${num(r[1])}" aria-label="${r[0]}: ${r[1]} на 1 м, на ${example} ${r[2]}"><span class="cap-scale__name">${r[0]}</span><span class="cap-scale__bar" aria-hidden="true"></span><span class="cap-scale__val mono">${r[1]} · <span data-cap-len>${r[2]}</span></span></li>`)}</ol>`;
  }
  export const CROPS = { 'prod-baza': { spread: '60% 50%', spreadMobile: '55% 50%' }, 'prod-rezka': { spread: '50% 45%' } }; // D подбирает по глазам на 1440/1280/375
  ```
  **B (`components.mjs:707`):** `grainCalcBlock({bare=false}={})` — при `bare` вернуть только `<div class="calc" data-grain-calc>…</div>` без `<section>/<container>`. **B (`site.js`, внутри `update()` калькулятора, строки 263–276 — вставить сразу после `var t = …` и ДО `if (!t) {…return;}`, иначе при пустом поле подсветка не сбросится):**
  ```js
  $$('[data-crop]').forEach(function(li){var k=parseFloat(li.getAttribute('data-crop'));li.classList.toggle('is-active',String(k)===String(parseFloat(crop.value)));var o=$('[data-cap-len]',li);if(o&&k>0&&t>0)o.textContent='≈ '+Math.ceil(t/k)+' м';});
  ```
  **C (`solutions.mjs`):**
  ```html
  <section class="section" id="vmestimost"><div class="container">${sectionHead({label:s.capacity.kicker,title:s.capacity.title,text:s.capacity.intro})}
    <div class="cap-spread">${capScale(s.capacity.rows)}<div id="calc">${raw(grainCalcBlock({bare:true}))}${s.economy?html`<ol class="num-list cap-spread__economy">${s.economy.items.map((it,i)=>html`<li><span class="mono">${nn(i)}</span>${it}</li>`)}</ol><a class="arrow-link" href="/agrariyam/#okupaemost">Посчитать окупаемость: свой склад против элеватора ${iconArrow}</a>`:''}</div></div>
    <p class="note mono">${s.capacity.note}</p></div></section>
  ```
  Старые секции `#calc` (:235) и «Экономика» (:237–252) удалить; якорь `id="calc"` сохранён (на него ведёт `agro.mjs:30` — там свой калькулятор, но ссылки извне на `/resheniya/zernohranilishcha/#calc` возможны). `pages.css`:
  ```css
  .cap-spread{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:var(--space-xl);align-items:start}
  .cap-scale{margin:0;border-top:1px solid var(--ink)} .cap-scale li{display:grid;grid-template-columns:120px 1fr auto;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid var(--line)}
  .cap-scale__bar{position:relative;height:2px;background:var(--line-2)} .cap-scale__bar::before{content:"";position:absolute;left:0;top:0;height:2px;width:calc(var(--v)/var(--max)*100%);background:var(--ink)}
  .cap-scale__bar::after{content:"";position:absolute;left:calc(var(--v)/var(--max)*100%);top:-6px;width:3px;height:14px;margin-left:-1px;background:var(--accent)}
  .cap-scale li.is-active .cap-scale__bar::before{background:var(--accent)} .cap-scale li.is-active .cap-scale__name{font-weight:600} .cap-scale__val{font-size:13px;white-space:nowrap}
  .cap-spread .calc{padding:0;border:0;background:none;gap:var(--space-s)} .cap-spread .calc .section-head__title{font-size:var(--step-2)}
  .cap-spread .calc__result{margin-top:20px;font-size:14px;color:var(--muted)} .cap-spread .calc__result strong{display:block;margin-top:6px;font:500 clamp(56px,7vw,104px)/1 var(--f-d);letter-spacing:-.05em;color:var(--ink)}
  .cap-spread__economy{margin-top:var(--space-l);padding-top:var(--space-m);border-top:1px solid var(--line)}
  @media(max-width:860px){.cap-spread{grid-template-columns:1fr}.cap-scale li{grid-template-columns:1fr auto}.cap-scale__name{grid-column:1/-1;margin-bottom:-6px}.cap-spread .calc__result strong{font-size:56px}}
  ```
- **Мобильный:** шкала — имя над линейкой; калькулятор ниже, результат 56 px, кнопка 100 %; список экономики в одну колонку.
- **Почему:** контраст масштабов на флагманской посадочной: одна цифра, которую фермер получил сам, — крупнее всего на странице; таблица становится графикой с данными.
- **Эффорт:** D — 40 мин, B — 30 мин, C — 2,5 ч. **Скептик:** прошёл; функциональность калькулятора (передача тонн в заявку через `data-gc-link`) не трогается, только обёртка.

### 12. /o-zavode/: один голос цифр, списки вместо карточек, графитовая география

- **Дорожка:** C (`about.mjs`, `pages.css`; `plinth`, `kzMap` — импорт).
- **Что видит:** после hero (фото до края, п.5) — цоколь `plinth--sm` из четырёх числовых фактов (до 3,5 мм · до 24 м · 50+ лет · 43 типоразмера) весом 500, как на главной; два словесных («Полный цикл», «ЛСТК + ЛМК») — подзаголовками 28 px в split-блоке «Инженерия — своя / Свои переделы» (слова, набранные как цифры весом 800 на `o-zavode-02`, уходят). Четыре рамочные карточки контроля → нумерованный список 01–04 в две колонки. «Что производит завод» → компактный реестр с моно-индексом в три колонки. «География» — графитовый разворот: слева карта Казахстана крупно (до 880 px; `.section--dark` перекрашивает `kzMap` через токены), справа «232 км» числом 40–64 px с подписью «от завода до Костаная по трассе» (`regions.json:15`, проверено) и три факта «трасса / ж/д / зерновой пояс» моно-ярлыком + заголовком 28 px + текстом.
- **Как (C):** `about.mjs:26–44` → `${plinth([{prefix:'до',value:'3,5',unit:'мм',title:'толщина профилей ПСУ и ПС'},{prefix:'до',value:'24',unit:'м',title:'пролёт без колонн'},{value:'50+',unit:'лет',title:'срок службы оцинкованного каркаса'},{value:'43',title:'типоразмера в сертификате РК'}],{size:'sm',label:'Завод в цифрах'})}`; тексты «Полный цикл» и «ЛСТК + ЛМК» переносятся в split как `<h3 class="about-word">Полный цикл</h3><p>…</p>`. Контроль: `<ol class="num-list num-list--2">${items.map(([t,x],i)=>html\`<li><span class="mono">${nn(i)}</span><div><h3>${t}</h3><p>${x}</p></div></li>\`)}</ol>`. Направления: `<ol class="reg">${solutions.items.map((s,i)=>html\`<li><span class="mono">${nn(i)}</span><a href="${s.url}">${s.short||s.title}</a>${iconArrow}</li>\`)}</ol>`. География: `<section class="section section--dark geo"><div class="container geo__grid">${kzMap()}<div class="geo__facts"><p class="geo__km">232 км<small>от завода до Костаная по трассе</small></p>${facts.map(([m,h,p])=>html\`<div class="geo__item"><span class="mono">${m}</span><h3>${h}</h3><p>${p}</p></div>\`)}</div></div></section>` (тексты фактов — как сейчас в `about.mjs:133–137`).
  ```css
  .about-word{font:500 28px/1.15 var(--f-d);letter-spacing:-.03em;margin:0 0 8px}
  .num-list--2{grid-template-columns:1fr 1fr;column-gap:48px;row-gap:28px}.num-list--2 li{grid-template-columns:56px 1fr;align-items:start;padding-top:16px;border-top:1px solid var(--line)}.num-list--2 li>.mono{font:400 28px/1 var(--f-d);letter-spacing:-.04em;color:var(--ink)}.num-list--2 h3{font-size:20px;margin:0 0 6px}.num-list--2 p{margin:0;font-size:15px;color:var(--ink-2)}
  .reg{columns:3;column-gap:40px;border-top:1px solid var(--ink)}.reg li{break-inside:avoid;display:grid;grid-template-columns:32px 1fr 20px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)}.reg .mono{color:var(--orange-700);font-size:12px}.reg a{font-size:16px}
  .geo__grid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:var(--space-xl);align-items:center}.geo .kz-map svg{max-width:880px}
  .geo__facts{display:grid;gap:28px}.geo__km{font:500 clamp(40px,4.5vw,64px)/1 var(--f-d);letter-spacing:-.05em;color:var(--gray-0);margin:0}.geo__km small{display:block;margin-top:8px;font:11px var(--f-m);letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
  .geo__item{border-top:1px solid var(--seam);padding-top:16px}.geo__item .mono{color:var(--accent);font-size:11px;letter-spacing:.1em;text-transform:uppercase}.geo__item h3{font-size:28px;font-weight:500;color:var(--gray-0);margin:6px 0}.geo__item p{color:var(--muted);font-size:15px;margin:0}
  .about-band__photo{border-radius:0}
  @media(max-width:860px){.num-list--2{grid-template-columns:1fr}.reg{columns:1}.geo__grid{grid-template-columns:1fr}.geo__km{font-size:48px}}
  ```
- **Мобильный:** цоколь 2×2; split в столбик, подзаголовки 24 px; списки в одну колонку; карта 100 % (подписи городов кроме завода скрыты правилом ≤720), число 48 px и факты столбиком.
- **Почему:** ТЗ §14 — «конкретные факты», не раздел «слишком большой»; одна система цифр с главной вместо второго набора весом 800.
- **Эффорт:** 2 ч. **Скептик:** прошёл. Пульс точки завода **вычеркнут** — четвёртое движение (§9).

### 13. Страницы решений: полоса «Следующее решение» с фото

- **Дорожка:** C (`solutions.mjs:299–310`, `pages.css`; `.next-project` в `site.css:982–987` уже есть и уже используется в `journal.mjs:180`).
- **Что видит:** вместо серого реестра из трёх строк — графитовая полоса во всю ширину с фото следующего типа здания на 45 % яркости, «СЛЕДУЮЩЕЕ РЕШЕНИЕ · 02 / 09», название 28–40 px, моно-характеристики, оранжевая стрелка; смежные решения — одной строкой ссылок над полосой.
- **Как (C):** в начале `renderSolution`: `const nn = (i) => String(i + 1).padStart(2, '0'); const idx = solutions.items.findIndex((x) => x.slug === s.slug), N = solutions.items.length, next = solutions.items[(idx + 1) % N];`. Разметка вместо :299–310:
  `<section class="section section--tight"><div class="container"><p class="related-line">Смотрят вместе: ${related.map(r=>html\`<a href="${r.url}">${r.short}</a>\`)}</p></div></section><a class="next-project" href="${next.url}"><span class="next-project__bg">${raw(picture(next.cover||\`sol-${next.slug}\`,{alt:'',sizes:'100vw'}))}</span><span class="container next-project__inner"><span class="next-project__label mono">Следующее решение · ${nn((idx+1)%N)} / ${String(N).padStart(2,'0')}</span><span class="next-project__title">${next.short}</span><span class="next-project__meta mono">${(next.cardMeta||[]).join(' · ')}</span><span class="next-project__arrow" aria-hidden="true">→</span></span></a>`. У всех девяти решений обложка есть (`cover` = photo-* 1024–1536 px или `sol-*`), проверено по `images.json`. `pages.css`: `.next-project__meta{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--gray-300)}.next-project__arrow{font-size:2rem;color:var(--accent);margin-top:.5rem}.next-project__title{font-weight:500;letter-spacing:-.03em}.next-project:hover .next-project__bg{opacity:.6}.next-project{border-bottom:1px solid var(--seam)}.related-line{display:flex;flex-wrap:wrap;gap:.4rem 1.2rem;font-size:.9rem;color:var(--muted);margin:0}.related-line a{color:var(--ink);border-bottom:1px solid var(--line-2)}`. Полоса стоит перед `ctaBand`; тёмная полоса + тёмная CTA подряд разделяются швом `--seam`.
- **Мобильный:** min-height 200 px, заголовок `--step-2`, характеристики в одну строку с обрезкой; вся полоса — тап-цель.
- **Почему:** удержание — с любой посадочной есть очевидный следующий шаг (wow-layer «слой удержания»); характеристики моно-строкой вместо пустого «Подробнее».
- **Эффорт:** 1 ч. **Скептик:** прошёл; рендер под 45 % графита не подписан как объект, генерация не выдаётся за построенное.

### 14. Система: засечка одним кодом, три плотности, марка, тонировка по правилу, строка маршрута в подвале

- **Дорожки:** B (`site.css`, `layout.mjs:104`, `components.mjs footer()`), C (применение в `solutions.mjs`, `about.mjs`, `production.mjs`, `documents.mjs`), A (`.document-preview__tag` → марка).
- **Что видит:** одна и та же оранжевая засечка — над цифрами цоколя, на цепочке сроков, на конце линейки вместимости, перед подписями кадров, кромкой у видео. Служебные списки («Разобрано в статьях», «Смотрят вместе», FAQ-обвязки) плотнее — 36–56 px вместо 92; заголовок секции ближе к своему содержимому, чем к предыдущей; серый фон только у секций с объектом (фото, график, форма, превью PDF), чисто текстовые — белые. Одна плоская «марка» (оранжевый прямоугольник, графитовый моно-текст 10 px) вместо трёх разных плашек: «ОРИГИНАЛ / PDF» на полке документов, «01 · Что считаем» в форме. В подвале под картой — моно-строка «ТРАССА КОСТАНАЙ — ПЕТРОПАВЛОВСК · Ж/Д СТ. ПРЕСНОГОРЬКОВСКАЯ» (`site.contacts.address.note`, есть).
- **Как (B, `site.css`):**
  ```css
  /* Сквозной мотив — оранжевая засечка. Один код на все места, менять здесь. */
  .tick::before{content:"";display:block;width:28px;height:3px;background:var(--accent);flex:none}
  .tick--v::before{width:3px;height:14px}
  .tick.mono{display:inline-flex;align-items:center;gap:8px}   /* подписи кадров: засечка перед текстом */
  .section--tight{padding-block:var(--sec-tight)}               /* переопределяет :263 */
  .section-head{margin-bottom:var(--space-l)}                   /* было xl */
  .mark{display:inline-block;font:500 10px/1 var(--f-m);letter-spacing:.1em;text-transform:uppercase;color:var(--on-accent);background:var(--accent);padding:6px 8px;border-radius:0;white-space:nowrap}
  .footer__route{margin:var(--space-xs) 0 0;font-size:.66rem;letter-spacing:.1em;text-transform:uppercase;color:var(--gray-400)}
  ```
  Текст марки графитовый: белый на #f47b36 даёт 2,6:1. `layout.mjs:104` после experience.css: `<link rel="stylesheet" href="/assets/css/pages.css?v=${site.buildId}">` — pages.css побеждает все три файла по порядку каскада. `components.mjs:304` после `${kzMap({compact:true})}` → `<p class="footer__route mono">${c.address.note}</p>`. **C:** `articles` (:288), `related` (:301) → `section section--tight` без `section--tint`; `documents.mjs`/`solutions.mjs`/`production.mjs` — тонировка только там, где внутри фото/график/форма/превью. **A:** `experience.css:19` `.document-preview__tag` → стили `.mark` (или заменить класс в `experience.mjs:14`).
- **Мобильный:** `--sec-tight` 36 px через clamp; тач-цели строк реестра ≥44 px за счёт padding + line-height.
- **Почему:** мотив, повторённый одним кодом, читается как подпись, а не как пять случайных оранжевых чёрточек (creative.md приём 8); плотности дают ритм (layout.md §3).
- **Эффорт:** B — 50 мин, C — 1 ч, A — 15 мин. **Скептик:** прошёл. Добавлено ревьюером: унификация засечки (у судьи токен `--tick` был объявлен, но не определён и не использован).

---

## 5. Вторая очередь (после показа первой; не блокирует)

### 16. /obekty/: лист спецификации во всю ширину; видео — после ответа Шамиля

- **Дорожка:** C (`portfolio.mjs:96–125,140–175`, `pages.css`).
- **Что видит:** единственный кейс разворачивается листом: слева план 46 000 × 15 000 и три цифры 8 / 269 / 521, справа штамп-строка «ПРОЕКТ ЗАВОДА · Г. КОСТАНАЙ · 2026 · РАМНО-СВЯЗЕВЫЙ КАРКАС ЛСТК» (все поля есть в `portfolio.json`), заголовок 32–48 px, характеристики, текст, кнопки «Рассчитать похожее здание» (`/raschet/?type=sklady&w=15&l=46`) и «Приехать на завод». Пунктирная плашка Instagram — тихая строка с линейкой сверху.
- **Как (C):** `planCard` → `<article class="obj-sheet">…</article>`; `.obj-sheet{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:var(--space-xl);border-top:2px solid var(--ink);padding-top:var(--space-l)}.obj-sheet .case-plan svg{max-width:none}.obj-sheet__top{display:flex;flex-wrap:wrap;gap:.4rem 1.2rem;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin:0 0 var(--space-s)}.obj-sheet__title{font:500 var(--step-4)/1.1 var(--f-d);letter-spacing:-.03em;margin:0 0 var(--space-s)}.empty-note{border:0;border-top:1px solid var(--line);border-radius:0;padding:var(--space-m) 0}`; ≤860 — одна колонка.
- **Видео на /obekty/** (`objectVideo({label:'Объект завода · видео',id:'video',dark:true,action:{title:'Решение для зерна',url:'/resheniya/zernohranilishcha/'}})`) — только после письменного ответа Шамиля, чей объект: правило `portfolio.json` «только реальные объекты завода» и решение скептика 11.09 п.10 (карточку зернохранилища в портфолио до ответа не публиковать). На странице зернохранилищ видео остаётся как есть.
- **Эффорт:** 1,5 ч. **Скептик:** лист — прошёл; видео — условно.

### 16-D. Беззвучная нарезка каркаса для видео-секции

- **Дорожка:** D (`src/assets/video/grain-loop.mp4`), A (`objectVideo({loop:true})`, разметка из п.4).
- **Как:** источник — `src/assets/video/grain-walkthrough.mp4` (уже 720×1280, тот же таймлайн 0–240 с). В `tools/video_grain.sh`: `SEGS=("3:3" "60:3" "172:3" "185:3" "237:2.5")` (≈14,5 с), блок `UP` → `scale=480:854` без `hwupload/libplacebo` и без `-init_hw_device vulkan` (уменьшаем, не апскейлим), склейка: `-crf 30 -maxrate 600k -bufsize 1200k`. Цель ≤1,2 МБ; проверить `ffprobe` и первый/последний кадр (xfade без чёрных провалов). `ffmpeg 8.1.2` на машине есть. Если >1,2 МБ — сократить до 10 с, а не поднимать crf выше 32. Постер — существующий `video-grain-poster`.
- **Мобильный:** `muted+playsinline` играют на iOS/Android; в режиме энергосбережения остаётся постер — штатно.
- **Эффорт:** D — 1,5 ч, A — 30 мин.

### 17. /raschet/: форма как «лист заявки»

- **Дорожки:** C (`contact.mjs:111–170`, `pages.css`), B (`site.js:403–451, 517–553`).
- **Что видит:** вместо селекта «— выберите —» девять плиток типов зданий (3 в ряд, выбранная — 2 px графитовая рамка и оранжевый квадрат в углу) + «Другое»; ширина/длина/высота в ряд с единицей «м» внутри поля; под ними живая моно-строка «Ш 18 × Д 36 × В 6 м · 648 м²» (только арифметика, без цен — ТЗ §19); филдсеты — листы с 2 px графитовой кромкой сверху и маркой «01 · Что считаем» вместо серой рамки.
- **Как (C):** `<fieldset class="tiles-r" role="radiogroup" aria-label="Назначение здания">${solutions.items.map(s=>html\`<label class="tile-r"><input type="radio" name="purpose" value="${s.slug}" required><span class="tile-r__name">${s.short||s.title}</span><span class="tile-r__meta mono">${s.cardMeta?.[0]||''}</span></label>\`)}<label class="tile-r"><input type="radio" name="purpose" value="other"><span class="tile-r__name">Другое</span></label></fieldset>` (класс `tiles-r`, не `tiles` — `.tiles` в `site.css:594` занят модульной сеткой); поля размеров — `class="field field--unit" data-unit="м"`; после ряда `<p class="form__sum mono" data-dim-sum aria-live="polite" hidden></p>`. CSS: `.tiles-r{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;border:0;padding:0;margin:0 0 var(--space-m)}.tile-r{position:relative;display:grid;gap:4px;min-height:64px;padding:12px 14px;background:var(--gray-50);border:1px solid var(--gray-300);cursor:pointer}.tile-r input{position:absolute;inset:0;opacity:0;margin:0}.tile-r:has(input:checked){border:2px solid var(--ink);padding:11px 13px}.tile-r:has(input:checked)::after{content:"";position:absolute;right:10px;top:10px;width:10px;height:10px;background:var(--accent)}.tile-r:has(input:focus-visible){outline:2px solid var(--accent);outline-offset:2px}.tile-r input:checked+.tile-r__name{font-weight:700}.tile-r__name{font-weight:500;font-size:15px}.tile-r__meta{font-size:11px;color:var(--muted)}.field--unit{position:relative}.field--unit .field__input{padding-right:2.4em}.field--unit::after{content:attr(data-unit);position:absolute;right:14px;bottom:17px;font:12px var(--f-m);color:var(--muted)}.form__fieldset{border:0;border-top:2px solid var(--ink);background:var(--gray-50);padding:22px 24px 26px}.form__legend{padding:0}@media(max-width:720px){.tiles-r{grid-template-columns:1fr 1fr}}`. Легенду визуально — `.mark`, текст legend оставить для a11y.
  **B (`site.js`) — четыре правки, без них форма ломается:**
  1. `:421` `hasOption` → `var hasOption=function(v){return !!form.querySelector('input[name="purpose"][value="'+v+'"]');};` (у RadioNodeList нет `querySelectorAll`, старый код бросит исключение внутри try и предзаполнение молча отвалится). `sel.value = slug` для RadioNodeList отмечает нужную кнопку — оставить.
  2. `:447` `kind` → `var chk=form.querySelector('input[name="purpose"]:checked');var kind=chk&&chk.value!=='other'?chk.closest('label').querySelector('.tile-r__name').textContent:'';`
  3. `:522–523` `purposeText` → тот же приём через `:checked`; `purposeSel.value` в `goal()` у RadioNodeList работает.
  4. `validateRequired` (`:351`): для radio `.value` всегда непустой — добавить `var grp=form.querySelector('input[type=radio][required]');if(grp&&!form.querySelector('input[name="'+grp.name+'"]:checked')){grp.closest('fieldset').setAttribute('aria-invalid','true');grp.closest('fieldset').scrollIntoView({block:'center'});return false;}`.
  Сводка: на `input` по width/len/height — если w и l: `sum.hidden=false; sum.textContent='Ш '+w+' × Д '+l+(h?' × В '+h:'')+' м · '+(w*l).toLocaleString('ru-RU')+' м²'`.
- **Мобильный:** плитки 2 в ряд, высота ≥64 px, десять плиток ≈380 px; три поля размеров в ряд по ≈100 px с `inputmode=decimal`; сводка на две строки.
- **Эффорт:** C — 2 ч, B — 1 ч. **Скептик:** прошёл после правок JS. Проверить отправку на `/raschet/?type=angary&w=18&l=36`, `?type=grain&tons=3000`, `?type=project`, `?type=builder`.

### 18. Хаб /resheniya/: спецификация под карточками, список вместо `pick-card` (добавлено ревьюером)

- **Дорожка:** C (`solutions.mjs:32–57`, `components.mjs solutionCard` через B — одна строка).
- **Что видит:** девять карточек каталога получают ту же моно-строку `cardMeta`, что на главной (п.9) — одинаковые сущности выглядят одинаково; четыре `pick-card` «как выбрать» → `num-list--2` из п.12; таблица типов каркаса остаётся.
- **Как:** B — в `solutionCard` после `card__text`: `${s.cardMeta?.length ? html\`<span class="card__meta">${s.cardMeta.join(' · ')}</span>\` : ''}` (`.card__meta` уже есть, `site.css:587`). C — `hub.choose.items` → `<ol class="num-list num-list--2">` как в п.12.
- **Эффорт:** 40 мин. Хаб — одна из шести проверяемых страниц, в плане судьи он не был затронут ничем, кроме снятия fade.

---

## 6. Интерфейсы между дорожками

Договорённости фиксируются до начала работы; каждая дорожка кодит против них, не дожидаясь соседа.

**B → A, C (компоненты и классы, `components.mjs`/`site.css`):**
- `plinth(items, {size:'lg'|'sm', label})`; item = `{prefix?, value, unit?, title?, text?}`; целые (`/^\d+\+?$/`) получают `data-count`. Секция несёт `section--dark` сама. Классы: `.plinth`, `.plinth--lg|--sm`, `.plinth__grid/__item/__val/__title/__text`.
- `pageHero({…, variant:'photo'})` → добавляет `page-hero--bleed` (фото до правого края). Без `variant` — сегодняшний сплит. `variant:'cover'` не делается без отдельного «да» Рамазана.
- `typicalScheme()` — как есть; `.ts-*` в `site.css`, `.ts-grid` скрыта, текст 12,5 px.
- `grainCalcBlock({bare:true})` — калькулятор без обёртки секции.
- `.tick`, `.tick--v`, `.mark`, `.section--tight`, токены `--seam`, `--sec-tight`.
- Тёмные блоки: всегда `section--dark` + свой класс; цвета внутри — токенами, не hex.
- Моушен: `data-photo-reveal` на `<figure>`/обёртке с `<img>` — единственный анимируемый атрибут; `[data-count]` — счётчик; H1-маска — чистый CSS дорожки A. `data-reveal` больше ничего не делает. Ховер-зумов нет.
- JS-хуки: `[data-count]` + `data-suffix`; `[data-crop]` + `[data-cap-len]` в шкале вместимости; `[data-dim-sum]` и `input[name=purpose]` (radio) в форме; `box.querySelector('.object-video__video')` в плеере.
- `<link>` на `/assets/css/pages.css` после experience.css.

**A → C (`video.mjs`):** `objectVideo({dark:true, loop:true|false, label, id, action})`; луп-обёртка стоит после основного `<video>`; C вызывает с `dark:true` на зерне (и на /obekty/ — после ответа Шамиля).

**D → A, C (`graphics.mjs`):** `capScale(rows, {example})` → `<ol class="cap-scale">` (CSS — у C в pages.css); `export const CROPS = {'prod-baza':{spread,spreadMobile},'prod-rezka':{spread}}` — A и C ставят через `style="--crop:…"`. Файл `grain-loop.mp4` ≤1,2 МБ — вторая очередь; пока его нет, A держит `loop:false`.

**C → B (данные):** `solutions.json → items[].proof[]` в формате items `plinth`; `production.json → sections[rezka].photoSlot = ""`, `sections[otgruzka].photoSlot = ""`.

---

## 7. Не трогать

- Первый экран главной: аэросъёмка, H1 «От проекта — до стального каркаса» с одним оранжевым словом, кнопка «Получить расчёт», обещание «24 часа», полоса 01–03. Меняется только подача: маска строк H1, непрозрачный графит под полосой.
- Палитра белый / графит / один оранжевый; Golos Text + JetBrains Mono; радиусы 0–2 px; тени — только бумажная под сертификатом. Значения `--gray-*`/`--orange-*` в `pro.css:2` не сводятся (вне плана).
- Блок «Каркас и обшивка — на реальном объекте», его подписи 01/02 и три стадии «Расчёт / КМ / КМД» под ним.
- Полка «За словами — документы»: превью оригиналов PDF, размер, сертификат KZ.3510317.01.01.67913. Меняется только плашка → `.mark`.
- Паспорт кейса с SVG-планом 46 000 × 15 000 и 8 / 269 / 521 — эталон «графики с данными».
- Липкая мобильная панель; поля формы 52 px / 16 px; блоки «От чего зависит стоимость» и «Что будет дальше».
- Функциональность обоих калькуляторов — только подача результата.
- Все тексты и цифры: ни одного нового факта. Запрещённые: 8000 т, 140 × 20 м, регион и год видео-объекта, «Объект завода» на реальных фото до ответа Шамиля, «Визуализация» до «да» Рамазана, километраж до Петропавловска/Кокшетау, «зимний монтаж до −40 °C».
- `theme-tz.css`, вариант Б, `home-tz.mjs`.
- Декоративные чертежи без данных (миллиметровка, рамки А-Б-В, штампы листов) — не возвращать; `.ts-grid` выключена.
- Мегаменю, маркиза, магнитные кнопки, кастомный курсор, зерно на тёмном, Ken Burns на hero, видео-фон в первом экране, `100vw` для полноширинных блоков, вордмарк в подвале.
- Порядок мобильного hero посадочных: текст и кнопки над фото (`site.css:1027–1034`, ТЗ §18).

---

## 8. Референсы — что именно берём

- **https://www.llentab.com/** — цифра-доказательство сразу под первым экраном и видео производства как самостоятельная тёмная секция: п.1 (цоколь цифр) и п.4 (видео на графите).
- **https://www.ruukki.com/** — одна графитовая система с одним акцентом, фото объекта до края окна с моно-подписью в углу и полосой фактов под кадром: п.3 (разворот «О заводе»), п.5 (hero решений и /o-zavode/), п.6 (hero /proizvodstvo/).
- **https://www.borga.se/** — документальная подача цеха без постановки, чередование крупного кадра и короткого текста без рамок, одна метрика на кейс: п.6 (развороты переделов, кадр резки 21:9), п.7 (реестр типовых как спецификация).
- **https://www.muellerinc.com/** — выбранная типовая конфигурация показана схемой с размерами и одним кликом становится заявкой: п.7 (`typicalScheme` на строках, ссылки `/raschet/?type&w&l` уже работают), п.17 (плитки типов и живая сводка размеров).
- **https://www.astron.biz/** — подпись объекта строгим моно-форматом в углу кадра и «Заказать расчёт» каждые 2–3 секции: формат подписей в п.3/5/6 (`.tick.mono`) и правило одного CTA на экран внутри новых тёмных секций.

---

## 9. Вычеркнуто и исправлено (с причинами)

**Вычеркнуто:**

1. **П.15 судьи — вордмарк STEPPE STEEL во всю ширину подвала.** Это приём 6 из `wow-layer.md` («Гигантский вордмарк в футере»), а класс `.footer__wordmark` уже лежит в движке (`site.css:408`) — то есть ровно «сайт из генератора», против чего платит заказчик, и учебный случай «фирменного слопа» из `anti-slop.md` (одно решение переезжает из проекта в проект). Строка маршрута под картой из того же пункта — оставлена (п.14): это данные, а не приём.
2. **П.6 судьи — тёмный полноэкранный hero `variant:'cover'` на /proizvodstvo/.** Противоречит записанному решению 30.08 («полноэкранный тёмный хиро НЕ делаем»), которое 03.09 отменено только для главной. Второй такой экран делает главную и «Производство» неразличимыми по превью (art-direction.md, техника 3). Заменён планом Б судьи: фото до края (п.5) + цоколь + развороты + prod-rezka 21:9 во всю ширину — ТЗ §3 закрыт. Cover — только по отдельной просьбе Рамазана, код судьи сохранён в истории.
3. **Пульс точки завода на карте /o-zavode/** — четвёртое движение при правиле «ровно три».
4. **Луп-нарезка как часть первой очереди** — перенесена во вторую (16-D): непрерывное движение сверх трёх событий, +1,2 МБ, отдельный пайплайн; дорожки A и C не ждут D.
5. **Видео на /obekty/ до ответа Шамиля** — правило портфолио «только реальные объекты завода» и решение скептика 11.09 п.10.

**Исправлено в пунктах (ошибки плана судьи, найденные по коду):**

- «113 `data-reveal` (точно)» — неверно: 8 на главной, 756 в `dist/`; на кадрах серые заголовки подтверждены, но частично это артефакт `tools/screenshot.mjs` (кадр через 250 мс после скролла при переходе 600 мс). Диагноз не меняется — у живого пользователя при быстром скролле картина та же.
- П.4: луп-обёртка «до основного `<video>`» сломала бы плеер — `site.js:668` берёт первый `<video>` в фигуре. Порядок изменён + селектор `.object-video__video`.
- П.2: маска H1 `padding-bottom:.08em` подрезает хвосты «д» и «р» (descent Golos 0,24 em при line-height .99) → `.18em`. `pro.css:26` `h1>span{color}` перекрасил бы все строки → `.accent`.
- П.1/3/4/12: ручные `color:#fff` на тёмных блоках заменены правилом `section--dark` — иначе `.eyebrow` (#ad4309 на #10191f, ≈2,9:1) и `.arrow-link` остаются нечитаемыми.
- П.5: bleed-режим сделан опциональным (`variant:'photo'`), иначе `/proektirovshchikam/` с рендером `tech-hub` (contain на серой подложке) получил бы градиент и растяжку.
- П.6: дубль prod-baza на одной странице (hero + передел 08) → `otgruzka.photoSlot=""`; ряды 4:3 вместо 3:2 под квадратные и портретные кадры цеха.
- П.7: кегль подписей схем 10 px в viewBox 300 при 240 px = 8 px на экране → 12,5 px и колонка 260 px.
- П.11: JS-подсветка ставится до раннего `return` в `update()`, иначе при пустом поле не сбрасывается.
- П.13: `nn` не определён в `solutions.mjs`; модуль по `items.length`; `.next-project` уже используется в журнале (не «не подключён»).
- П.17: `hasOption` через `$$('option', sel)` и `sel.options[selectedIndex]` падают на RadioNodeList; `validateRequired` пропускает неотмеченные radio; класс `.tiles` занят. Все четыре правки расписаны.
- П.14: токен `--tick` был объявлен и нигде не определён → класс `.tick` одним кодом.
- «Полоса 01–03» и «`.eyebrow` внутри цоколя останутся тёмными» — внутри цоколя eyebrow нет; предупреждение относится к `.pro-spread` и решено `section--dark`.

**Добавлено ревьюером (3):** унификация засечки `.tick` (п.14), серая коробка `.pro-help` → линия и снятие ховер-зумов (п.9/п.2), хаб /resheniya/ (п.18).

---

## 10. Приёмка перед показом

D прогоняет `MSYS_NO_PATHCONV=1 node tools/screenshot.mjs / /resheniya/ /resheniya/zernohranilishcha/ /proizvodstvo/ /o-zavode/ /raschet/` и то же с `--mobile`, затем:

- [ ] `grep -o "data-reveal" -r dist --include=*.html | wc -l` → 0; на первом кадре каждой страницы ни одного серого (полупрозрачного) заголовка.
- [ ] Цифры цоколя на скриншотах стоят на итоговых значениях (счётчик успел или отключён).
- [ ] Горизонтального скролла нет ни на 1440, ни на 375 (`document.documentElement.scrollWidth === innerWidth`).
- [ ] Прищур (art-direction.md): на главной первым читается H1, вторым — цифры цоколя, третьим — цех край в край; на зерне — «≈ 45 м».
- [ ] Ч/б: иерархия держится без оранжевого.
- [ ] Не больше трёх кеглей на экран + моно-метадата.
- [ ] Тач-цели ≥44 px: строки реестров, ссылки «Рассчитать этот вариант», плитки формы.
- [ ] Lighthouse mobile на главной: LCP не хуже текущего (тот же LCP-кадр), CLS 0.
- [ ] `python tools/slop.py src/data` — словесных маркеров не прибавилось (новые тексты: только `home.json → process`).
- [ ] `grep -rn "8000\|140 × 20\|Визуализация" dist` — пусто.
