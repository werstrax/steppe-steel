/**
 * Главная v4.1 — по макету Шамиля (30.08.2026): лендинг с фото-карточками,
 * показателями в кружках, типовыми решениями, объектами, шагами в ряд.
 * Фото — слотами (заказчик передаст), цифры — только проверенные.
 */

import { layout, html, raw } from '../lib/layout.mjs';
import {
  sectionHead, stat, ctaBand, solutionCard, photoSlot, vizTag,
  iconArrow, iconCheck, statIcons, iconDownload,
} from '../lib/components.mjs';
import { organizationNode, websiteNode, itemListNode, howToNode } from '../lib/schema.mjs';
import { hasImage, picture } from '../lib/util.mjs';

export function renderHome(d) {
  const { site, solutions, production, portfolio, documents } = d;
  const p = site.proof;
  const typical = solutions.hub.typical;
  const presentation = documents.categories.find((c) => c.id === 'prezentacii')?.items[0];

  /* Показатели: только проверенные цифры. Мощности завода (м², т/мес,
   * представители) — ждут подтверждения Шамиля, см. CONTENT-TODO. */
  const stats = [
    { icon: 'span', val: p.span, key: 'пролёт без внутренних колонн' },
    { icon: 'steel', val: `до ${p.steelMax}`, key: 'оцинкованная сталь профилей ПСУ и ПС' },
    { icon: 'cert', val: '43', key: 'типоразмера в сертифицированном сортаменте' },
    { icon: 'clock', val: `${p.termDays} дней`, key: 'от утверждения проекта до контура здания' },
  ];

  const audiences = [
    {
      url: '/proektirovshchikam/',
      title: 'Для проектировщиков',
      items: ['Конструктив: расчёты, КМ и КМД силами завода', 'Нагрузки на фундамент, узлы, РПЗ', 'Сопровождение экспертизы', 'Агентское вознаграждение по договору'],
      photoSlot: 'aud-designers',
      cta: 'Подробнее',
    },
    {
      url: '/partneram/',
      title: 'Стать партнёром Steppe Steel',
      items: ['Запросы клиентов по вашему региону', 'Партнёрские условия на металлоконструкции', 'Обучение бригад и шеф-монтаж первого объекта', 'Маркетинговые материалы и поддержка сделок'],
      photoSlot: 'aud-partners',
      cta: 'Получить условия',
    },
    {
      url: '/agrariyam/',
      title: 'Для аграрных предприятий',
      items: ['Зернохранилища, овощехранилища, здания для техники', 'Расширение секциями под рост урожая', 'Калькулятор длины и окупаемости'],
      cta: 'Подробнее',
    },
    {
      url: '/stroitelnym-kompaniyam/',
      title: 'Для строительных компаний',
      items: ['Вы строите — завод проектирует и производит каркас', 'Прогнозируемая себестоимость и сроки', 'Техподдержка монтажной организации'],
      cta: 'Условия сотрудничества',
    },
  ];

  const aboutPhotos = production.sections.slice(0, 4);

  const content = html`
    <!-- Первый экран: заголовок-категория по ТЗ и макету, фото справа (слот) -->
    <section class="hero">
      <div class="container hero__grid">
        <div class="hero__text">
          <h1 class="hero__title" data-reveal>STEPPESTEEL — завод строительных металло&shy;конструкций</h1>
          <p class="hero__slogan" data-reveal>Проектирование. Производство. Комплектная поставка.</p>
          <p class="hero__lead" data-reveal>
            Производство металлокаркасов из ЛСТК и ЛМК для промышленных,
            сельскохозяйственных, складских и коммерческих зданий —
            по всей территории Казахстана.
          </p>
          <div class="btn-row" data-reveal>
            <a class="btn btn--primary btn--lg" href="${site.cta.primary.url}">${site.cta.primary.title}</a>
            <a class="btn btn--ghost btn--lg" href="/resheniya/">Посмотреть решения</a>
          </div>
        </div>
        <div class="hero__media hero__media--photo" data-reveal>
          ${hasImage('hero-photo')
            ? raw(picture('hero-photo', { alt: 'Производство Steppe Steel: металлокаркас здания', sizes: '(min-width: 900px) 50vw, 100vw', priority: true, className: 'hero__photo' }))
            : raw(photoSlot('hero-photo', { label: 'Фото в обработке', alt: 'Фото производства готовится', className: 'photo-slot--hero' }))}
        </div>
      </div>
    </section>

    <!-- Показатели -->
    <section class="section section--tight">
      <div class="container">
        <h2 class="u-visually-hidden">Наши показатели</h2>
        <div class="kpi">
          ${stats.map(
            (s) => html`
              <div class="kpi__item" data-reveal>
                <span class="kpi__icon" aria-hidden="true">${statIcons[s.icon]}</span>
                <span class="kpi__body">
                  <span class="kpi__val">${s.val}</span>
                  <span class="kpi__key">${s.key}</span>
                </span>
              </div>
            `
          )}
        </div>
      </div>
    </section>

    <!-- Что мы производим -->
    <section class="section section--tint" id="resheniya">
      <div class="container">
        ${sectionHead({
          label: 'Наши решения',
          title: 'Что мы производим',
          text: 'Девять типов зданий с одной производственной площадки. Каждое — отдельная страница с конструктивом, параметрами и ответами на вопросы.',
          action: { title: 'Все решения', url: '/resheniya/' },
        })}
        <div class="card-grid card-grid--3">
          ${solutions.items.map((s) => solutionCard(s))}
        </div>
      </div>
    </section>

    <!-- Типовые решения -->
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
            (t) => html`
              <a class="card typ-card" href="${t.url}" data-reveal>
                <span class="card__media">
                  ${hasImage(t.photoSlot)
                    ? raw(picture(t.photoSlot, { alt: t.title, sizes: '(min-width: 900px) 25vw, 100vw' }))
                    : raw(photoSlot(t.photoSlot, { label: 'Фото в обработке', alt: t.title }))}
                  ${hasImage(t.photoSlot) ? vizTag() : ''}
                </span>
                <span class="card__body">
                  <h3 class="card__title">${t.title}</h3>
                  <dl class="typ-card__params">
                    ${t.params.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}
                  </dl>
                </span>
              </a>
            `
          )}
        </div>
      </div>
    </section>

    <!-- Реализованные объекты -->
    <section class="section section--tint" id="obekty">
      <div class="container">
        ${sectionHead({
          label: 'Портфолио',
          title: 'Реализованные объекты',
          text: portfolio.intro,
          action: { title: 'Смотреть все объекты', url: '/obekty/' },
        })}
        <div class="card-grid card-grid--3">
          ${portfolio.items.slice(0, 3).map(
            (o) => html`
              <a class="card obj-teaser" href="/obekty/" data-reveal>
                <span class="card__media">
                  ${o.photos?.length
                    ? raw(picture(o.photos[0].img, { alt: o.photos[0].alt || o.title, sizes: '(min-width: 900px) 33vw, 100vw' }))
                    : raw(photoSlot(`obj-${o.slug}`, { label: 'Фото объекта в обработке', alt: o.title }))}
                </span>
                <span class="card__body">
                  ${o.badge ? html`<span class="card__badge mono">${o.badge}</span>` : ''}
                  <h3 class="card__title">${o.title}</h3>
                  <span class="card__meta">${o.region}${o.year ? html`, ${o.year}` : ''} · ${o.size}</span>
                </span>
              </a>
            `
          )}
          ${portfolio.items.length < 3
            ? html`
                <div class="card card--note" data-reveal>
                  <span class="card__body">
                    <h3 class="card__title">${portfolio.empty.title}</h3>
                    <p class="card__text">${portfolio.empty.text}</p>
                  </span>
                </div>
              `
            : ''}
        </div>
      </div>
    </section>

    <!-- Аудитории: проектировщики, партнёры, аграрии, строители -->
    <section class="section" id="partnyorstvo">
      <div class="container">
        <div class="card-grid card-grid--2">
          ${audiences.map(
            (a) => html`
              <div class="card aud" data-reveal>
                <div class="aud__body">
                  <h2 class="aud__title">${a.title}</h2>
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

    <!-- Как мы работаем -->
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
      </div>
    </section>

    <!-- О заводе кратко + фото производства -->
    <section class="section" id="zavod">
      <div class="container about-band">
        <div class="about-band__text" data-reveal>
          <p class="eyebrow mono">О заводе</p>
          <h2 class="section-head__title">О заводе Steppe Steel</h2>
          <p>Завод строительных металлоконструкций полного цикла в Костанайской
          области: собственная линия профилирования ПСУ и ПС, участки резки
          и сварки, проектный отдел с ЛИРА-САПР и Tekla, комплектация и отгрузка
          по всему Казахстану.</p>
          <p>Контроль качества на всех переделах, сертифицированный сортамент —
          43 типоразмера профиля.</p>
          <div class="btn-row">
            <a class="btn btn--primary" href="/o-zavode/">Подробнее о заводе</a>
            <a class="btn btn--ghost" href="/proizvodstvo/">Производство</a>
          </div>
        </div>
        <div class="about-band__photos">
          ${aboutPhotos.map(
            (s) => html`
              <div class="about-band__photo" data-reveal>
                ${hasImage(s.photoSlot)
                  ? raw(picture(s.photoSlot, { alt: `${s.title} — производство Steppe Steel`, sizes: '(min-width: 900px) 25vw, 50vw' }))
                  : raw(photoSlot(s.photoSlot, { label: s.title, alt: s.title }))}
              </div>
            `
          )}
        </div>
      </div>
    </section>

    <!-- Производство: тёмная полоса «завод, а не посредник» -->
    <section class="section section--dark">
      <div class="container">
        ${sectionHead({
          label: 'Производство',
          title: 'Завод, а не посредник',
          text: 'Собственная линия профилирования, участки резки и сварки, комплектация и отгрузка — одна площадка в Костанайской области.',
          action: { title: 'Смотреть производство', url: '/proizvodstvo/' },
        })}
        <div class="prod-band">
          <ul class="prod-band__list">
            ${production.sections.map(
              (s, i) => html`
                <li data-reveal>
                  <a class="prod-band__item" href="/proizvodstvo/#${s.id}">
                    <span class="prod-band__num mono">${String(i + 1).padStart(2, '0')}</span>
                    <span class="prod-band__title">${s.title}</span>
                    <span class="prod-band__arrow" aria-hidden="true">${iconArrow}</span>
                  </a>
                </li>
              `
            )}
          </ul>
          <div class="prod-band__stats">
            ${production.stats.map((s) => stat(s))}
          </div>
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
