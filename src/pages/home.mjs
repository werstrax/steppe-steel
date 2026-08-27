/**
 * Главная: кино-hero с видео, маркиза, «почему мы», каталог, живой лист
 * профилей, производство, сравнение, зерно-блок с калькулятором, процесс,
 * логистика, галерея, FAQ-выжимка.
 */

import { layout } from '../lib/layout.mjs';
import { html, raw, e, picture } from '../lib/util.mjs';
import {
  sectionHead, productCard, marquee, ctaBand, stat, faq, step, video,
  iconWhatsApp, iconArrow, vizTag, photoTag, grainSheet,
} from '../lib/components.mjs';
import { organizationNode, websiteNode } from '../lib/schema.mjs';
import { profilesBoard, profilesCards } from './profili.mjs';

export function renderHome(d) {
  const { site, products, services, profiles, process, faq: faqData, journal, cycle, material, payback } = d;
  const c = site.contacts;
  const waEng = `${c.whatsapp}?text=${encodeURIComponent(c.whatsappEngineer)}`;
  const waKp = `${c.whatsapp}?text=${encodeURIComponent(c.whatsappKp)}`;

  const faqTop = faqData.groups.flatMap((g) => g.items).slice(0, 4);

  const content = html`
    <!-- ЛИСТ 00 · HERO -->
    <section class="hero noise" id="hero">
      <div class="hero__media" aria-hidden="true">
        <video autoplay muted loop playsinline preload="metadata" data-autovideo poster="/assets/img/hero-poster-1152.jpg">
          <source src="/assets/video/hero-steppe.mp4" type="video/mp4">
        </video>
        <span class="hero__viz mono">Визуализация</span>
      </div>
      <div class="hero__scrim" aria-hidden="true"></div>
      <div class="container hero__inner">
        <p class="hero__kicker mono">Завод металлоконструкций полного цикла · Доставка по всему Казахстану</p>
        <h1 class="hero__title">Ангары, склады<br>и зернохранилища <span class="accent">под ключ</span></h1>
        <p class="hero__sub lead u-max-62">
          Проектируем, производим и монтируем металлокаркас: ЛСТК и чёрный металл.
          Расчёт под снеговые нагрузки вашего района, доставку организуем — один договор от чертежа до готового контура.
        </p>
        <div class="btn-row hero__actions">
          <a class="btn btn--primary btn--lg" href="/zayavka/">Рассчитать стоимость <span class="btn__index mono">24 ч</span></a>
          <a class="btn btn--ghost btn--lg" href="/katalog/">Каталог продукции</a>
        </div>
        <div class="hero__meta" data-reveal>
          <div class="hero__meta-item">
            <span class="hero__meta-val">3,5 мм</span>
            <span class="hero__meta-key">сталь · ПСУ / ПС</span>
          </div>
          <div class="hero__meta-item">
            <span class="hero__meta-val">30–45</span>
            <span class="hero__meta-key">дней — контур после КМД</span>
          </div>
          <div class="hero__meta-item">
            <span class="hero__meta-val">24 м</span>
            <span class="hero__meta-key">пролёт без колонн</span>
          </div>
          <div class="hero__meta-item">
            <span class="hero__meta-val">50+ лет</span>
            <span class="hero__meta-key">оцинковка без покраски</span>
          </div>
        </div>
        <p class="hero__coords mono" aria-hidden="true">с. Троебратское · трасса Костанай — Петропавловск · ст. Пресногорьковская</p>
      </div>
    </section>

    ${raw(marquee(['Ангары', 'Склады и цеха', 'ЛСТК', 'Чёрный металл', 'Фермы и колонны', 'Зернохранилища', 'Плазменная резка', 'Раздел КМ', 'Полный цикл'], { accentEvery: 3 }))}

    <!-- ЛИСТ 01 · ПОЧЕМУ -->
    <section class="section section--sheet" id="why">
      <div class="container">
        ${raw(sectionHead({
          sheet: '01', label: 'Почему Steppe Steel',
          title: 'Шесть причин строить у нас',
        }))}
        <div class="grid grid--3 why-grid">
          ${[
            ['01', 'Завод полного цикла', 'Проектирование, производство, комплектация и монтаж — внутри одного завода. Один договор, одна ответственность, без посредников.'],
            ['02', 'ЛСТК + чёрный металл', 'Комбинируем лёгкие профили и тяжёлый металл — фермы, колонны, опорные узлы. Реализуем объекты любой сложности и промышленного масштаба.'],
            ['03', 'Инженерия под север', 'Расчёт под III снеговой район, ветер и морозы до −40 °C. Раздел КМ на каждый объект — а не типовой проект из другого климата.'],
            ['04', 'Заводская точность', 'Плазменная и лазерная резка, одинаковая геометрия на всей партии. Детали собираются как конструктор — без подгонки на площадке.'],
            ['05', 'Свои сроки', 'Расчёт и КП за 24 часа, монтаж собственной бригадой. Конструкции в наличии — быстрый старт и сдача к сроку.'],
            ['06', 'Гарантия завода', 'Гарантия на металлокаркас от производителя и срок службы оцинкованной стали 50+ лет без обслуживания.'],
          ].map(([n, t, x]) => html`
            <div class="why-card" data-reveal>
              <span class="why-card__num mono">${n}</span>
              <h3 class="why-card__title">${t}</h3>
              <p class="why-card__text">${x}</p>
            </div>
          `)}
        </div>
      </div>
    </section>

    <!-- ЛИСТ 02 · КАТАЛОГ -->
    <section class="section" id="catalog">
      <div class="container">
        ${raw(sectionHead({
          sheet: '02', label: 'Что мы строим',
          title: 'Промышленные здания под ваш профиль работы',
          text: 'Типовые и индивидуальные проекты. Любой размер — под ваш участок, ваш объём и ваши нагрузки.',
          action: { title: 'Весь каталог', url: '/katalog/' },
        }))}
        <div class="grid grid--3">
          ${products.items.map((p) => productCard(p))}
        </div>
        <div class="catalog-custom" data-reveal>
          <div>
            <span class="product-card__code mono">ИП</span>
            <h3 style="display:inline;margin-left:0.8rem">Индивидуальный проект</h3>
          </div>
          <p class="text-muted" style="margin:0">Многопролётный комплекс, очередь строительства или нестандарт? Спроектируем под ваше ТЗ и площадку.</p>
          <a class="btn btn--ghost" href="${waEng}" target="_blank" rel="noopener">Консультация инженера</a>
        </div>
      </div>
    </section>

    <!-- ЛИСТ 03 · ПРОФИЛИ: живой лист КМД -->
    <section class="section section--sheet" id="profiles">
      <div class="container">
        ${raw(sectionHead({
          sheet: '03', label: 'Линейка профиля',
          title: 'Профиль крупным планом',
          text: 'Не «поколение» — а чертёж. Переключайте ПСУ и ПС — сечение отрисуется прямо на листе, с толщиной стенки как в разделе КМ.',
          action: { title: 'Подробнее о профилях', url: '/profili/' },
        }))}
        ${raw(profilesBoard(profiles))}
        <p class="sheet-note" style="margin-top:1.5rem">${e(profiles.footline)}</p>
      </div>
    </section>

    <!-- ЛИСТ 03-Д · АТЛАС СТАЛИ: макро-деталировка материала -->
    <section class="section noise" id="material">
      <div class="container">
        ${raw(sectionHead({
          sheet: '03-Д', label: 'Деталировка',
          title: material.title,
          text: material.subtitle,
          action: material.action,
        }))}
        <div class="atlas" data-reveal>
          <div class="atlas__viewer">
            ${material.samples.map((s, i) => html`
              <div class="atlas__slide ${i === 0 ? 'is-active' : ''}" id="atlas-panel-${i}"
                   role="tabpanel" aria-labelledby="atlas-tab-${i}"${i > 0 ? raw(' aria-hidden="true"') : ''}>
                ${raw(picture(s.img, { alt: s.alt, sizes: '(min-width: 720px) 66vw, 100vw', className: 'atlas__img' }))}
                <div class="atlas__callouts" aria-hidden="true">
                  ${s.callouts.map((c2) => html`<span class="atlas__callout mono">${c2}</span>`)}
                </div>
                <div class="prof__stamp atlas__stamp" aria-hidden="true">
                  <div class="prof__stamp-row">Steppe Steel · с. Троебратское</div>
                  <div class="prof__stamp-row prof__stamp-row--split"><span>${s.marka}</span><span>М 5:1</span></div>
                </div>
              </div>
            `)}
            <span class="atlas__ruler mono" aria-hidden="true">0 <span class="atlas__ruler-bar"></span> 10 мм</span>
            ${vizTag()}
          </div>
          <div class="atlas__tabs" role="tablist" aria-label="Образцы стали">
            ${material.samples.map((s, i) => html`
              <button type="button" class="atlas__tab ${i === 0 ? 'is-active' : ''}" id="atlas-tab-${i}"
                      role="tab" aria-selected="${i === 0 ? 'true' : 'false'}" aria-controls="atlas-panel-${i}"
                      data-atlas-tab="${i}"${i > 0 ? raw(' tabindex="-1"') : ''}>
                <span class="atlas__tab-num mono">Образец ${s.num}</span>
                <span class="atlas__tab-title">${s.title}</span>
              </button>
            `)}
          </div>
        </div>
      </div>
    </section>

    <!-- Диптих: фигура без фона на графите + оранжевая плашка -->
    <section class="duo" aria-labelledby="duo-title">
      <div class="duo__panel" data-reveal>
        <p class="duo__kicker mono">Один завод — одна ответственность</p>
        <h2 class="duo__title" id="duo-title">Контролируем каждый этап производства</h2>
        <ul class="duo__list">
          <li>Считаем каркас и выпускаем раздел КМ</li>
          <li>Катаем профиль на собственной линии</li>
          <li>Режем, сверлим и маркируем детали на заводе</li>
          <li>Комплектуем, грузим и отправляем на площадку</li>
        </ul>
        <a class="btn btn--dark btn--lg" href="/uslugi/">Как устроен завод</a>
      </div>
      <div class="duo__figure">
        ${raw(picture('worker-carry', {
          alt: 'Рабочий несёт пакет оцинкованных профилей ПС на плече — визуализация',
          sizes: '(min-width: 900px) 45vw, 100vw',
          className: 'duo__img',
        }))}
        <span class="duo__stamp mono" aria-hidden="true">Кадр-визуализация</span>
      </div>
    </section>

    <!-- ЛИСТ 04 · ПРОИЗВОДСТВО -->
    <section class="section noise" id="factory">
      <div class="container">
        ${raw(sectionHead({
          sheet: '04', label: 'Производство',
          title: 'Производственный комплекс полного цикла',
          text: 'Проектирование → производство → комплектация → отгрузка — всё внутри одного завода. Каждая деталь — по разделу КМ, с контролем на каждом этапе.',
          action: { title: 'Об услугах завода', url: '/uslugi/' },
        }))}
        <div class="factory">
          <figure class="factory__main" data-reveal style="margin:0">
            <div class="media media--16x9">
              ${raw(video('line.mp4', { poster: 'prod-line-1152.jpg', ariaLabel: 'Линия профилирования: выпуск оцинкованных C-профилей — видеовизуализация' }))}
            </div>
            <figcaption class="media-caption">Линия профилирования · оцинкованный профиль</figcaption>
          </figure>
          <div class="factory__side">
            <figure data-reveal style="margin:0">
              <div class="media media--3x2">
                ${raw(picture('plasma-brand', { alt: 'Стол плазменной резки стального листа — визуализация', sizes: '(min-width: 960px) 30vw, 100vw' }))}
                ${vizTag()}
              </div>
              <figcaption class="media-caption">Плазменная / лазерная резка</figcaption>
            </figure>
            <figure data-reveal style="margin:0">
              <div class="media media--3x2">
                ${raw(picture('weld-brand', { alt: 'Сварка узла стальной фермы — визуализация', sizes: '(min-width: 960px) 30vw, 100vw' }))}
                ${vizTag()}
              </div>
              <figcaption class="media-caption">Сварочные участки</figcaption>
            </figure>
          </div>
        </div>
        <div class="grid grid--3 factory__lists">
          ${[
            ['Линейка профилей', ['ПСУ — С-образный усиленный, повышенная жёсткость', 'ПС — С-образный несущий', 'Высота сечения 150–280 мм', 'Толщина — под расчётную нагрузку']],
            ['Оборудование', ['Плазменная резка', 'Лазерная резка', 'Резьбонарезные станки', 'Сварочные участки']],
            ['Чёрный металл', ['Производство ферм и колонн', 'Изготовление опорных узлов', 'Болтовые соединения', 'Полный комплект деталей']],
          ].map(([t, items]) => html`
            <div data-reveal>
              <h3 class="factory__list-title mono">${t}</h3>
              <ul class="factory__list">${items.map((x) => html`<li>${x}</li>`)}</ul>
            </div>
          `)}
        </div>
        <p class="sheet-note">Изображения — фирменные визуализации. Реальные снимки цеха и объектов — в Instagram <a class="link" href="${c.instagram}" target="_blank" rel="noopener">${c.instagramHandle}</a> и по запросу.</p>
      </div>
    </section>

    <!-- ЛИСТ 04-М · ХРОНИКА ОБЪЕКТА: скролл-таймлапс стройки -->
    <section class="cycle" id="cycle" aria-label="${cycle.title} — ${cycle.stages.length} стадий">
      <div class="cycle__stage">
        <div class="cycle__frames">
          ${cycle.stages.map((s, i) => html`
            <div class="cycle__frame ${i === 0 ? 'is-active' : ''}" data-cycle-frame>
              ${raw(picture(s.img, { alt: s.alt, sizes: '100vw', className: 'cycle__pic' }))}
            </div>
          `)}
        </div>
        <div class="cycle__scrim" aria-hidden="true"></div>
        ${vizTag()}
        <div class="cycle__hud">
          <p class="cycle__kicker mono">${cycle.label}</p>
          <p class="cycle__count mono" aria-hidden="true"><span id="cycle-num">01</span> / 0${cycle.stages.length}</p>
          <h2 class="cycle__title" id="cycle-label" aria-live="polite">${cycle.stages[0].label}</h2>
          <p class="cycle__sub">${cycle.subtitle} <a class="link" href="${cycle.processLink.url}">${cycle.processLink.title}</a></p>
        </div>
        <div class="cycle__rail" role="group" aria-label="Стадии монтажа">
          <span class="cycle__rail-bar" aria-hidden="true"><span class="cycle__rail-fill" id="cycle-fill"></span></span>
          ${cycle.stages.map((s, i) => html`
            <button type="button" class="cycle__dot ${i === 0 ? 'is-active' : ''}" data-cycle-dot="${i}"
                    aria-label="Стадия ${i + 1}: ${s.label}" aria-pressed="${i === 0 ? 'true' : 'false'}"></button>
          `)}
        </div>
      </div>
    </section>

    <!-- ЛИСТ 05 · СРАВНЕНИЕ -->
    <section class="section section--sheet" id="compare">
      <div class="container">
        ${raw(sectionHead({
          sheet: '05', label: 'Спецификация отличий',
          title: 'Почему завод, а не гаражная гибка',
        }))}
        <div class="table-wrap" data-reveal>
          <table class="table">
            <thead>
              <tr><th>Параметр</th><th class="table__hl">Завод Steppe Steel</th><th>Кустарное производство</th></tr>
            </thead>
            <tbody>
              ${[
                ['Толщина стали', 'до 3,5 мм, оцинковка', '1–2 мм, часто чёрный металл с грунтовкой'],
                ['Геометрия профиля', 'одна линия профилирования — одинаковая на всей партии', 'ручная гибка, «как получилось»'],
                ['Отверстия', 'выполнены на производстве — каркас собирается как конструктор', '«болгаркой по месту»'],
                ['Документация', 'полный комплект КМ/КМД для экспертизы и субсидий', 'чертёж на коленке'],
                ['Расчёт нагрузок', 'III снеговой район, ветер, −40 °C по СП РК', 'типовой проект «из другого климата»'],
                ['Гарантия', 'в договоре, от юрлица', 'устная'],
              ].map(([a, b, cc]) => html`<tr><td>${a}</td><td class="table__hl">${b}</td><td>${cc}</td></tr>`)}
            </tbody>
          </table>
        </div>
        <p class="lead u-max-62" data-reveal style="margin-top:1.75rem">Каждый профиль — по разделу КМ, с контролем геометрии на каждом этапе. Разницу видно в документации и на монтаже.</p>
      </div>
    </section>

    <!-- ЛИСТ 06 · ЗЕРНОХРАНИЛИЩА + КАЛЬКУЛЯТОР -->
    <section class="section noise" id="agro">
      <div class="container">
        ${raw(sectionHead({
          sheet: '06', label: 'Зернохранилища',
          title: 'Ангар для хранения зерна нового поколения',
          text: 'Больше половины ёмкостей хранения зерна в стране — 17,4 из 30,6 млн тонн — уже принадлежат самим хозяйствам, а не элеваторам: на все 189 лицензированных ХПП приходится 13,2 млн тонн. Свой склад давно норма. Зернохранилище Steppe Steel — на винтовых сваях без бетона, с наклонными стенами под боковое давление зерна.',
          action: { title: 'Всё о зернохранилищах', url: '/katalog/zernohranilishcha/' },
        }))}
        <div class="agro">
          <div class="agro-calc" data-reveal>
            <p class="eyebrow mono" style="margin:0">Калькулятор зернохранилища</p>
            <div class="field">
              <label class="field__label" for="grain-crop">Культура</label>
              <select id="grain-crop">
                <option value="67" selected>Пшеница — 67 т/м</option>
                <option value="70">Горох — 70 т/м</option>
                <option value="62">Кукуруза — 62 т/м</option>
                <option value="56">Ячмень — 56 т/м</option>
                <option value="37">Подсолнечник — 37 т/м</option>
              </select>
            </div>
            <div class="field">
              <label class="field__label" for="grain-input">Объём хранения, тонн</label>
              <input type="number" id="grain-input" inputmode="numeric" min="100" max="60000" step="100" value="3000">
            </div>
            <div aria-live="polite">
              <span class="field__label">Длина ангара</span>
              <span class="agro-calc__result" id="grain-length">≈ 45 м</span>
            </div>
            <p class="agro-calc__note">по вместимости на 1 м длины · наращивается секциями до 140 м; точный расчёт сделает инженер</p>
            <a href="/zayavka/?type=grain" class="btn btn--ghost" id="grain-cta">Получить расчёт под мой объём</a>
          </div>
          ${raw(grainSheet(site))}
        </div>
        <div class="grid grid--3 agro__stats">
          ${[
            ['без бетона', 'Винтовые сваи и металлический ростверк — никаких мокрых процессов'],
            ['до 140 м', 'Длина наращивается секциями под ваш объём урожая'],
            ['боковое давление', 'Наклонные стены и подкосная система — спроектированы под нагрузку зерна'],
            ['30+ лет', 'Даже в агрессивной среде зерна — без усталостных трещин (обычная эксплуатация — 50+)'],
            ['разборная', '100 % болтовые соединения — ликвидный актив, можно демонтировать и перевезти'],
            ['10 дней', 'Быстрая поставка — конструкции в наличии, быстрый старт проекта'],
          ].map(([v, k]) => stat({ val: v, key: k }))}
        </div>
      </div>
    </section>

    <!-- ЛИСТ 06-Б · Окупаемость: свой склад против элеватора -->
    <section class="section section--sheet" id="okupaemost">
      <div class="container">
        ${raw(sectionHead({
          sheet: '06-Б', label: payback.kicker,
          title: payback.title,
          text: payback.text,
        }))}

        <div class="pay" data-reveal>
          <form class="pay__form" id="pay-form" novalidate>
            ${payback.fields.map((f) => html`
              <div class="pay__field">
                <label class="field__label" for="pay-${f.id}">${f.label}<span class="pay__unit mono">${f.unit}</span></label>
                <input type="number" id="pay-${f.id}" data-pay="${f.id}" inputmode="numeric"
                       min="${f.min}" max="${f.max}" step="${f.step}" value="${f.value}">
                <p class="pay__hint">${f.hint}</p>
              </div>
            `)}
          </form>

          <div class="pay__out">
            <div class="pay__total" aria-live="polite">
              <p class="pay__total-label mono">${payback.resultLabel}</p>
              <p class="pay__total-val" id="pay-total">—</p>
              <p class="pay__total-sub" id="pay-payback">${payback.paybackLabel}: укажите стоимость склада</p>
            </div>

            <ul class="pay__rows">
              ${payback.breakdown.map((b) => html`
                <li class="pay__row">
                  <span class="pay__row-title">${b.title}</span>
                  <span class="pay__row-val mono" id="pay-row-${b.id}">0 ₸</span>
                  <span class="pay__bar" aria-hidden="true"><span class="pay__bar-fill" id="pay-bar-${b.id}"></span></span>
                </li>
              `)}
            </ul>

            <a class="btn btn--primary btn--lg" id="pay-cta" href="${c.whatsapp}?text=${encodeURIComponent(payback.waText)}"
               target="_blank" rel="noopener">${payback.ctaTitle}</a>
            <p class="pay__cta-text">${payback.ctaText}</p>
          </div>
        </div>

        <p class="sheet-note" style="margin-top:1.75rem">${e(payback.note)}</p>

        <div class="beyond">
          <p class="beyond__head mono">${payback.beyondTitle}</p>
          <div class="grid grid--4">
            ${payback.beyond.map((b) => html`
              <div class="beyond__item" data-reveal>
                <h3 class="beyond__title">${b.title}</h3>
                <p class="beyond__text">${b.text}</p>
              </div>
            `)}
          </div>
        </div>
      </div>
    </section>

    <!-- ЛИСТ 07 · ПРОЦЕСС -->
    <section class="section section--sheet" id="process">
      <div class="container">
        ${raw(sectionHead({
          sheet: '07', label: 'От заявки до объекта',
          title: 'Шесть шагов — один договор',
          text: process.intro,
          action: { title: 'Процесс подробно', url: '/process/' },
        }))}
        <div>
          ${process.steps.map((s, i) => step(s, i))}
        </div>
        ${process.note ? html`<p class="sheet-note" style="margin-top:1.75rem">${process.note}</p>` : ''}
      </div>
    </section>

    <!-- ЛИСТ 08 · ЛОГИСТИКА -->
    <section class="section" id="logistics">
      <div class="container">
        ${raw(sectionHead({
          sheet: '08', label: 'География и логистика',
          title: 'Завод в центре зерновых регионов Казахстана',
          text: 'Отгружаем автотранспортом и по железной дороге — станция Пресногорьковская находится прямо в селе Троебратское. Пока конкуренты везут каркас из Алматы за 2 000 км — мы уже в вашем регионе.',
        }))}
        <div class="grid grid--3">
          ${[
            ['авто + ж/д', 'Два канала отгрузки прямо с площадки завода'],
            ['зерновой пояс', 'Костанайская, СКО и Акмолинская области — рядом'],
            ['по РК', 'Доставка комплекта по всему Казахстану'],
          ].map(([v, k]) => stat({ val: v, key: k }))}
        </div>
      </div>
    </section>

    <!-- ЛИСТ 09 · ГАЛЕРЕЯ -->
    <section class="section section--steel-2" id="projects">
      <div class="container">
        ${raw(sectionHead({
          sheet: '09', label: 'Наши каркасы и проекты',
          title: 'Наши каркасы — вживую и в проекте',
          text: 'Реальные фото монтажа Steppe Steel и 3D-визуализации зернохранилищ. Больше объектов и процессов — в Instagram.',
        }))}
        <div class="gallery">
          ${[
            ['ig-frame', 'Наш каркас · оцинкованная ЛСТК', 'Оцинкованный каркас ЛСТК Steppe Steel — двухэтажное здание на монтаже', false],
            ['montage-drone', 'Монтаж каркаса', 'Визуализация: монтаж оцинкованного каркаса ангара в степи, вид с дрона', true],
            ['winter-brand', 'Монтаж зимой', 'Визуализация: зимний монтаж оцинкованного каркаса, ферма на стропах', true],
            ['grain-ext', 'Зернохранилище', 'Визуализация: зернохранилище Steppe Steel с наклонными стенами у пшеничного поля', true],
            ['grain-karkas', 'Каркас на винтовых сваях', 'Визуализация: оцинкованный каркас зернохранилища на винтовых сваях у земли', true],
          ].map(([img, cap, alt, viz], i) => html`
            <figure class="gallery__item" data-reveal data-lightbox style="margin:0">
              <div class="media ${i === 0 ? 'media--16x9 gallery__item--wide' : 'media--3x2'}">
                ${raw(picture(img, { alt, sizes: i === 0 ? '(min-width: 960px) 66vw, 100vw' : '(min-width: 960px) 33vw, 100vw' }))}
                ${viz ? vizTag() : photoTag()}
              </div>
              <figcaption class="media-caption">${cap}</figcaption>
            </figure>
          `)}
        </div>
        <p class="sheet-note" style="margin-top:1.5rem">Фото — реальные объекты Steppe Steel (Instagram <a class="link" href="${c.instagram}" target="_blank" rel="noopener">${c.instagramHandle}</a>); остальные кадры — проектные визуализации.</p>
        <div class="btn-row" style="margin-top:2rem" data-reveal>
          <a class="btn btn--ghost" href="${waKp}" target="_blank" rel="noopener">Получить КП с примерами</a>
          <a class="btn btn--outline-light" href="${c.instagram}" target="_blank" rel="noopener">Instagram ${c.instagramHandle}</a>
        </div>
      </div>
    </section>

    <!-- ЛИСТ 10 · FAQ-выжимка -->
    <section class="section" id="faq">
      <div class="container">
        ${raw(sectionHead({
          sheet: '10', label: 'Вопросы и ответы',
          title: 'Вопросы, которые задают перед строительством',
          action: { title: 'Все 11 вопросов', url: '/faq/' },
        }))}
        ${raw(faq(faqTop, { idPrefix: 'faq-home' }))}
      </div>
    </section>

    ${raw(ctaBand(site, {
      title: 'Контур здания — за 30–45 дней<br>после утверждения КМД',
      text: 'Конструкции в наличии, монтаж — собственной бригадой. Чем раньше заключён договор, тем раньше урожай ляжет в ваш собственный склад, а не в чужой элеватор.',
    }))}
  `;

  return layout(site, {
    url: '/',
    title: 'Steppe Steel — завод металлоконструкций и ЛСТК в Казахстане',
    description: 'Steppe Steel (Костанайская обл.) — завод металлоконструкций полного цикла: ЛСТК и чёрный металл. Ангары, склады, цеха, зернохранилища под ключ. Расчёт за 24 ч.',
    ogTitle: 'Ангары и зернохранилища из ЛСТК под ключ в Казахстане — Steppe Steel',
    image: 'og-default',
    preloadImage: '/assets/img/hero-poster-1152.jpg',
    overHero: true,
    // FAQPage-разметки здесь сознательно нет: те же вопросы размечены
    // на /faq/ и тематических страницах — дубли конкурируют за один сниппет.
    schema: [
      organizationNode(site, { products: products.items }),
      websiteNode(site),
    ],
  }, content);
}
