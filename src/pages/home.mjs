/**
 * Главная v5 «Цех в работе» (03.09.2026). Порядок блоков — по макету
 * Шамиля (30.08): первый экран → показатели → что производим → как работаем
 * → типовые → аудитории → объекты → о заводе → CTA → подвал с картой.
 * Фото — из собственных презентаций завода (images.json), цифры — только
 * проверенные (site.proof, production.stats). Слоты без кадра — честная плашка.
 */

import { layout, html, raw } from '../lib/layout.mjs';
import { sectionHead, ctaBand, photoSlot, iconArrow, iconCheck } from '../lib/components.mjs';
import { organizationNode, websiteNode, itemListNode, howToNode } from '../lib/schema.mjs';
import { hasImage, picture, cx } from '../lib/util.mjs';

export function renderHome(d) {
  const { site, solutions, production, portfolio, documents } = d;
  const p = site.proof;
  const typical = solutions.hub.typical;
  const presentation = documents.categories.find((c) => c.id === 'prezentacii')?.items[0];
  const bySlug = Object.fromEntries(solutions.items.map((s) => [s.slug, s]));
  const secByid = Object.fromEntries(production.sections.map((s) => [s.id, s]));

  /* Манифест: четыре проверяемые цифры завода — единственное «событие»
   * масштаба на странице (creative.md §5). Источники — site.proof. */
  const manifest = [
    { val: '24', unit: 'м', key: 'пролёт без внутренних колонн' },
    { val: '3,5', unit: 'мм', key: 'оцинкованная сталь профилей ПСУ и ПС' },
    { val: '43', unit: '', key: 'типоразмера в сертифицированном сортаменте' },
    { val: '30–45', unit: 'дн', key: 'от утверждения КМД до контура здания' },
  ];

  /* Модульная сетка решений: флагман 2×2 с фото, четыре с фото 1×1,
   * четыре без кадра — графитовые плитки с метаданными. */
  const tileOrder = [
    'zernohranilishcha', 'sklady', 'proizvodstvennye-zdaniya', 'angary', 'zdaniya-dlya-tekhniki',
    'ovoshchehranilishcha', 'sto-avtoparki', 'sportivnye-obekty', 'modulnye-zdaniya',
  ];
  const tiles = tileOrder.map((slug) => bySlug[slug]).filter(Boolean);

  /* Мозаика цеха: линия профилирования широким кадром, дальше — резка,
   * сварка, контроль, отгрузка. Подписи — номера переделов. */
  const mosaic = [
    { id: 'profil', mod: 'mosaic__item--wide' },
    { id: 'rezka' },
    { id: 'svarka' },
    { id: 'kontrol' },
    { id: 'otgruzka' },
  ].map((m) => ({ ...m, sec: secByid[m.id], num: production.sections.findIndex((s) => s.id === m.id) + 1 }));

  const audiences = [
    {
      url: '/proektirovshchikam/',
      title: 'Проектировщикам',
      items: ['Конструктив: расчёты, КМ и КМД силами завода', 'Нагрузки на фундамент, узлы, РПЗ', 'Сопровождение экспертизы', 'Агентское вознаграждение по договору'],
      photoSlot: 'aud-designers',
      cta: 'Подробнее',
    },
    {
      url: '/partneram/',
      title: 'Партнёрам и дилерам',
      items: ['Запросы клиентов по вашему региону', 'Партнёрские условия на металлоконструкции', 'Обучение бригад и шеф-монтаж первого объекта', 'Материалы и поддержка сделок'],
      photoSlot: 'aud-partners',
      cta: 'Получить условия',
    },
    {
      url: '/agrariyam/',
      title: 'Аграриям',
      items: ['Зернохранилища, овощехранилища, здания для техники', 'Расширение секциями под рост урожая', 'Калькулятор длины и окупаемости'],
      cta: 'Подробнее',
    },
    {
      url: '/stroitelnym-kompaniyam/',
      title: 'Строительным компаниям',
      items: ['Вы строите — завод проектирует и производит каркас', 'Прогнозируемая себестоимость и сроки', 'Техподдержка монтажной организации'],
      cta: 'Условия сотрудничества',
    },
  ];

  const obj = portfolio.items[0];

  const content = html`
    <!-- Первый экран: цех во всю ширину, заголовок-категория по ТЗ -->
    <section class="hero hero--photo">
      <div class="hero__bg" aria-hidden="true">
        ${hasImage('hero-photo')
          ? raw(picture('hero-photo', { alt: '', sizes: '100vw', priority: true }))
          : ''}
      </div>
      <div class="container hero__inner">
        <div class="hero__text">
          <p class="eyebrow mono" data-reveal>Костанайская область · весь Казахстан</p>
          <h1 class="hero__title" data-reveal>STEPPESTEEL — завод строительных металло&shy;конструкций</h1>
          <p class="hero__slogan" data-reveal>${site.brand.slogan}</p>
          <p class="hero__lead" data-reveal>
            Металлокаркасы из ЛСТК и ЛМК для зернохранилищ, складов, ангаров
            и производственных зданий. Проектный отдел, своя линия профилирования,
            комплект с маркировкой каждой детали — с одной площадки.
          </p>
          <div class="btn-row" data-reveal>
            <a class="btn btn--primary btn--lg" href="${site.cta.primary.url}">${site.cta.primary.title}</a>
            <a class="btn btn--ghost btn--lg" href="/resheniya/">Посмотреть решения</a>
          </div>
          <p class="hero__meta" data-reveal>
            <span>${site.brand.legalName}</span>
            <span>Сертифицированный сортамент</span>
            <span>Расчёт за 24 часа</span>
          </p>
        </div>
      </div>
    </section>

    <!-- Цифры-манифест -->
    <section class="manifest section--dark" aria-labelledby="manifest-title">
      <div class="container">
        <h2 class="u-visually-hidden" id="manifest-title">Завод в цифрах</h2>
        <div class="manifest__grid">
          ${manifest.map(
            (m) => html`
              <div class="manifest__item" data-reveal>
                <span class="manifest__val">${m.val}${m.unit ? html`<small>${m.unit}</small>` : ''}</span>
                <span class="manifest__key">${m.key}</span>
              </div>
            `
          )}
        </div>
      </div>
    </section>

    <!-- Что мы производим: модульная сетка девяти решений -->
    <section class="section" id="resheniya">
      <div class="container">
        ${sectionHead({
          label: 'Решения',
          title: 'Что мы производим',
          text: 'Девять типов зданий с одной производственной площадки. У каждого — своя страница: конструктив, параметры, ответы на вопросы.',
          action: { title: 'Все решения', url: '/resheniya/' },
        })}
        <div class="tiles">
          ${tiles.map((s, i) => {
            const img = s.cover || `sol-${s.slug}`;
            const photo = hasImage(img);
            return html`
              <a class="${cx('tile', s.flag && 'tile--flag', photo ? 'tile--photo' : 'tile--dark')}" href="${s.url}" data-reveal>
                ${photo
                  ? html`<span class="tile__img" aria-hidden="true">${raw(picture(img, { alt: '', sizes: s.flag ? '(min-width: 1020px) 50vw, 100vw' : '(min-width: 1020px) 25vw, 50vw' }))}</span>`
                  : ''}
                <span class="tile__num mono">${String(i + 1).padStart(2, '0')}</span>
                ${s.flag ? html`<span class="tile__flag mono">Флагман</span>` : ''}
                <span class="tile__title">${s.short || s.title}</span>
                ${s.cardMeta?.length ? html`<span class="tile__meta mono">${s.cardMeta.map((m) => html`<span>${m}</span>`)}</span>` : ''}
                <span class="tile__arrow" aria-hidden="true">${iconArrow}</span>
              </a>
            `;
          })}
        </div>
      </div>
    </section>

    <!-- Производство: тёмный контрапункт с кадрами цеха -->
    <section class="section section--dark" id="proizvodstvo">
      <div class="container">
        ${sectionHead({
          label: 'Производство',
          title: 'Завод, а не посредник',
          text: 'Линия профилирования ПСУ и ПС, участки резки и сварки, контроль на каждом переделе, комплектация и отгрузка — одна площадка в Костанайской области.',
          action: { title: 'Смотреть производство', url: '/proizvodstvo/' },
        })}
        <div class="mosaic">
          ${mosaic.map(
            (m) => html`
              <figure class="${cx('mosaic__item', m.mod)}" data-reveal>
                ${hasImage(m.sec.photoSlot)
                  ? raw(picture(m.sec.photoSlot, { alt: `${m.sec.title} — производство Steppe Steel`, sizes: m.mod ? '(min-width: 720px) 66vw, 100vw' : '(min-width: 720px) 33vw, 50vw' }))
                  : raw(photoSlot(m.sec.photoSlot, { label: m.sec.title, alt: m.sec.title }))}
                <figcaption class="mosaic__cap"><b>${String(m.num).padStart(2, '0')}</b>${m.sec.title}</figcaption>
              </figure>
            `
          )}
        </div>
      </div>
    </section>

    <!-- Как мы работаем: шесть шагов в ряд -->
    <section class="section section--tint" id="process">
      <div class="container">
        ${sectionHead({ label: 'Процесс', title: 'Как мы работаем', text: production.process.intro })}
        <ol class="flow-row">
          ${production.process.steps.map(
            (s, i) => html`
              <li class="flow-row__step" data-reveal>
                <span class="flow-row__num">${i + 1}</span>
                <span class="flow-row__title">${s.title}</span>
                <span class="flow-row__text">${s.text}</span>
                <span class="flow-row__dur mono">${s.duration}</span>
              </li>
            `
          )}
        </ol>
        <p class="note">${production.process.note}</p>
      </div>
    </section>

    <!-- Типовые решения: конфигурации с проверенными габаритами -->
    <section class="section" id="tipovye">
      <div class="container">
        ${sectionHead({
          label: typical.kicker,
          title: typical.title,
          text: typical.intro,
          action: { title: 'Получить расчёт', url: '/raschet/' },
        })}
        <div class="card-grid card-grid--4">
          ${typical.items.map(
            (t, i) => html`
              <a class="card typ-card" href="${t.url}" data-reveal>
                <span class="card__body">
                  <span class="card__meta">Типовое ${String(i + 1).padStart(2, '0')}</span>
                  <h3 class="card__title">${t.title}</h3>
                  <dl class="typ-card__params">
                    ${t.params.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}
                  </dl>
                  <span class="card__more arrow-link">Подробнее <span class="arrow">${iconArrow}</span></span>
                </span>
              </a>
            `
          )}
        </div>
      </div>
    </section>

    <!-- Аудитории: проектировщики, партнёры, аграрии, строители -->
    <section class="section section--tint" id="partnyorstvo">
      <div class="container">
        ${sectionHead({ label: 'Кому', title: 'С кем работает завод', text: 'Четыре входа — под задачу каждого. Внутри: условия, документы, что готовит завод и что остаётся за вами.' })}
        <div class="card-grid card-grid--2">
          ${audiences.map(
            (a) => html`
              <div class="card aud" data-reveal>
                <div class="aud__body">
                  <h3 class="aud__title">${a.title}</h3>
                  <ul class="aud__list">
                    ${a.items.map((it) => html`<li>${iconCheck}<span>${it}</span></li>`)}
                  </ul>
                  <a class="btn btn--primary" href="${a.url}">${a.cta}</a>
                </div>
                ${a.photoSlot
                  ? html`<div class="aud__media">${hasImage(a.photoSlot)
                      ? raw(picture(a.photoSlot, { alt: a.title, sizes: '(min-width: 900px) 25vw, 100vw' }))
                      : raw(photoSlot(a.photoSlot, { label: 'Фото в обработке', alt: a.title }))}</div>`
                  : ''}
              </div>
            `
          )}
        </div>
      </div>
    </section>

    <!-- Объекты: один реальный кейс проектного отдела, честная заметка -->
    <section class="section" id="obekty">
      <div class="container">
        ${sectionHead({
          label: 'Портфолио',
          title: 'Реализованные объекты',
          text: portfolio.intro,
          action: { title: 'Все объекты', url: '/obekty/' },
        })}
        <div class="card-grid card-grid--2">
          ${obj
            ? html`
                <a class="card obj-teaser" href="/obekty/" data-reveal>
                  <span class="card__body">
                    ${obj.badge ? html`<span class="card__badge mono">${obj.badge}</span>` : ''}
                    <h3 class="card__title">${obj.title}</h3>
                    <span class="card__text">${obj.purpose}. ${obj.frameType}.</span>
                    <dl class="typ-card__params">
                      <div><dt>Размеры</dt><dd>${obj.size}</dd></div>
                      <div><dt>Площадь</dt><dd>${obj.area}</dd></div>
                      <div><dt>Регион</dt><dd>${obj.region}, ${obj.year}</dd></div>
                    </dl>
                    <span class="card__more arrow-link">Смотреть кейс <span class="arrow">${iconArrow}</span></span>
                  </span>
                </a>
              `
            : ''}
          <div class="card card--note" data-reveal>
            <span class="card__body">
              <h3 class="card__title">${portfolio.empty.title}</h3>
              <p class="card__text">${portfolio.empty.text}</p>
              <a class="arrow-link card__more" href="${site.contacts.instagram}" target="_blank" rel="noopener">Съёмки монтажа в Instagram <span class="arrow">${iconArrow}</span></a>
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- О заводе: текст + база, оборудование и сертификат -->
    <section class="section section--tint" id="zavod">
      <div class="container about-band">
        <div class="about-band__text" data-reveal>
          <p class="eyebrow mono">О заводе</p>
          <h2 class="section-head__title">Завод полного цикла в Костанайской области</h2>
          <p class="lead">${site.brand.legalName}, Узункольский район. Линия профилирования
          ПСУ и ПС, участки резки и сварки, проектный отдел с ЛИРА-САПР
          и Tekla Structures, комплектация и отгрузка по всему Казахстану.</p>
          <p>Профили сертифицированы: 43 типоразмера в сортаменте. Каждая деталь
          промаркирована по КМД — на площадке остаётся только болтовая сборка.</p>
          <div class="btn-row">
            <a class="btn btn--primary" href="/o-zavode/">Подробнее о заводе</a>
            ${presentation ? html`<a class="btn btn--ghost" href="${presentation.file}" download data-goal="pdf_download">Скачать презентацию</a>` : ''}
          </div>
        </div>
        <div class="about-band__photos">
          ${[['prod-baza', 'Производственная база'], ['prod-oborudovanie', 'Оборудование'], ['cert-p1', 'Сертификат соответствия на профили ПСУ и ПС']].map(
            ([slot, cap], i) => html`
              <figure class="${cx('about-band__photo', slot.startsWith('cert') && 'about-band__photo--doc')}" data-reveal>
                ${hasImage(slot)
                  ? raw(picture(slot, { alt: `${cap} — Steppe Steel`, sizes: i === 0 ? '(min-width: 1020px) 58vw, 100vw' : '(min-width: 1020px) 29vw, 50vw' }))
                  : raw(photoSlot(slot, { label: cap, alt: cap }))}
              </figure>
            `
          )}
        </div>
      </div>
    </section>

    ${ctaBand(site, {
      secondary: presentation ? { title: 'Скачать презентацию', url: presentation.file } : null,
    })}
  `;

  return layout(
    site,
    {
      url: '/',
      image: hasImage('hero-photo') ? 'hero-photo' : undefined,
      title: 'Завод металлоконструкций в Казахстане — Steppe Steel',
      description:
        'STEPPESTEEL — завод строительных металлоконструкций: проектирование, производство ЛСТК и ЛМК, комплектная поставка. Зернохранилища, склады, ангары, производственные здания. Расчёт за 24 часа.',
      ogTitle: 'STEPPESTEEL — завод строительных металлоконструкций',
      schema: [
        organizationNode(site, { products: solutions.items }),
        websiteNode(site),
        itemListNode(site, '/', solutions.items, 'Решения Steppe Steel'),
        howToNode(site, '/', production.process.steps, 'Как заказать здание на заводе Steppe Steel'),
      ],
    },
    content
  );
}
