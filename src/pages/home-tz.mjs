/**
 * Главная — вариант Б «строго по ТЗ и макету» (VARIANT=tz, 04.09.2026).
 * Десять блоков макета Шамиля (docs/TZ.md, приложение) в том же порядке,
 * первый экран дословно по ТЗ §5, стиль по §3: белый фон, графит, один акцент.
 * Данные и фото общие с вариантом А; цифры — только проверенные.
 */

import { layout, html, raw } from '../lib/layout.mjs';
import { sectionHead, ctaBand, photoSlot, iconArrow, iconCheck, statIcons, vizTag, sortamentStrip, typicalScheme } from '../lib/components.mjs';
import { organizationNode, websiteNode, itemListNode, howToNode } from '../lib/schema.mjs';
import { hasImage, picture, cx } from '../lib/util.mjs';

/* Иконки шагов — тонкая линия 32×32, как у показателей (statIcons). */
const ICON = (body) =>
  raw(`<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`);
const stepIcons = {
  request: ICON('<rect x="7" y="4" width="18" height="24" rx="1.5"/><path d="M11 11h10M11 16h10M11 21h6"/>'),
  design: ICON('<path d="M5 25L25 5"/><path d="M9 21l2 2M12 18l2 2M15 15l2 2M18 12l2 2M21 9l2 2"/><path d="M4 28l4-1-3-3z"/>'),
  factory: ICON('<path d="M4 27V13l8 5v-5l8 5v-5l8 5v9z"/><path d="M8 27v-5h4v5M16 27v-5h4v5"/><path d="M6 13V6h4v7"/>'),
  kit: ICON('<path d="M5 11l11-5 11 5-11 5z"/><path d="M5 11v11l11 5 11-5V11"/><path d="M16 16v11"/>'),
  ship: ICON('<path d="M3 21V9h16v12"/><path d="M19 13h6l4 4v4h-10"/><circle cx="8" cy="24" r="2.5"/><circle cx="24" cy="24" r="2.5"/><path d="M3 21h2M11 24h10"/>'),
};
const bolt = ICON('<circle cx="16" cy="16" r="10"/><path d="M16 6v20M6 16h20"/><circle cx="16" cy="16" r="3"/>');

export function renderHomeTz(d) {
  const { site, solutions, production, portfolio, documents, designers, profiles } = d;
  const typical = solutions.hub.typical;
  const presentation = documents.categories.find((c) => c.id === 'prezentacii')?.items[0];
  const cert = designers.cert;

  /* Блок 3 макета — показатели с иконками. Цифры макета (7 000 м², 700 т/мес,
   * 10 представителей) не подтверждены — стоят проверенные (site.proof,
   * production.stats), набор согласован Рамазаном 04.09. */
  const kpi = [
    { icon: statIcons.clock, val: '30–45 дней', key: 'от утверждённых чертежей до закрытых стен и кровли' },
    { icon: statIcons.span, val: 'до 24 м', key: 'пролёт без внутренних колонн' },
    { icon: statIcons.steel, val: '50+ лет', key: 'оцинкованный каркас без покраски' },
    { icon: bolt, val: '100 %', key: 'болтовая сборка — сварки на площадке нет' },
  ];

  /* Блок 8 — пять шагов макета; сроки — из production.process.steps. */
  const st = production.process.steps;
  const steps = [
    { icon: stepIcons.request, title: 'Заявка и расчёт', text: 'Форма или WhatsApp — отвечает инженер. Предварительная смета за 24 часа.', dur: st[1]?.duration },
    { icon: stepIcons.design, title: 'Проектирование', text: 'Договор, раздел КМ под экспертизу, КМД для производства и монтажа.', dur: st[2]?.duration },
    { icon: stepIcons.factory, title: 'Производство', text: 'Профилирование, резка, сварка узлов, маркировка каждой детали.', dur: st[3]?.duration },
    { icon: stepIcons.kit, title: 'Комплектация', text: 'Рамы, прогоны, связи, крепёж по спецификации, КМД и паспорта — одним комплектом.', dur: '' },
    { icon: stepIcons.ship, title: 'Отгрузка и монтаж', text: 'Автотранспорт или ж/д по Казахстану, монтаж по КМД — бригада завода или шеф-монтаж.', dur: st[4] && st[5] ? `${st[4].duration} + ${st[5].duration}` : '' },
  ];

  const aud = [
    {
      url: '/proektirovshchikam/',
      title: 'Для проектировщиков',
      items: ['Конструктив: расчёты, КМ и КМД силами завода', 'Нагрузки на фундамент, узлы, РПЗ', 'Сопровождение экспертизы', 'Агентское вознаграждение по договору'],
      photoSlot: 'aud-designers',
      cta: 'Условия для проектировщиков',
    },
    {
      url: '/partneram/',
      title: 'Стать дилером STEPPESTEEL',
      items: ['Запросы клиентов по вашему региону', 'Партнёрские условия на металлоконструкции', 'Обучение бригад и шеф-монтаж первого объекта', 'Материалы и поддержка сделок'],
      photoSlot: 'aud-partners',
      cta: 'Получить условия партнёра',
    },
  ];

  const aboutPhotos = ['prod-baza', 'prod-oborudovanie', 'prod-profil', 'prod-svarka']
    .map((slot) => ({ slot, sec: production.sections.find((s) => s.photoSlot === slot) }));

  /* Схемы типовых: габариты только из подтверждённых (solutions.hub.typical). */
  const SCHEMES = [
    { span: '18 000', length: 'ДЛИНА 36 000', kind: 'frame', label: 'Ангар 18 × 36 м' },
    { span: '24 000', length: 'ДЛИНА 60 000', kind: 'frame', label: 'Ангар 24 × 60 м' },
    { span: '', length: 'ДЛИНА 45 000 · ≈ 3 000 Т', kind: 'grain', label: 'Зернохранилище 45 м' },
    { span: '', length: 'ДЛИНА 140 000 · ≈ 9 300 Т', kind: 'grain', label: 'Зернохранилище 140 м' },
  ];

  const obj = portfolio.items[0];
  const heroImg = hasImage('sol-angary') ? 'sol-angary' : hasImage('hero-photo') ? 'hero-photo' : null;

  /* Пиктограмма типа здания — линейный разрез, а не «фото в обработке».
   * ТЗ §3: чертёж и схема допустимы, стоковые картинки — нет. */
  const PICT = {
    sklady: '<path d="M8 40h64M12 40V22l28-12 28 12v18"/><path d="M22 40V28h16v12M46 40V28h14v12"/>',
    ovoshchehranilishcha: '<path d="M8 42h64M14 42V24l26-12 26 12v18"/><path d="M14 30h52"/><path d="M24 42v-8h12v8M46 42v-8h12v8"/>',
    'sto-avtoparki': '<path d="M6 42h68M10 42V26h40v16"/><path d="M50 30h12l10 10v2"/><circle cx="22" cy="44" r="4"/><circle cx="58" cy="44" r="4"/><path d="M16 26l6-8h22l6 8"/>',
    'sportivnye-obekty': '<path d="M6 44h68M10 44V28C10 18 24 12 40 12s30 6 30 16v16"/><path d="M40 20v24M28 26v18M52 26v18"/>',
    'modulnye-zdaniya': '<path d="M6 44h68"/><path d="M10 44V26l14-8 14 8v18"/><path d="M38 44V30l14-8 14 8v14"/><path d="M24 44V34h6v10"/>',
  };
  const pict = (slug) => PICT[slug] ? raw(`<svg class="tzcard__pict" viewBox="0 0 80 52" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PICT[slug]}</svg>`) : '';
  /* Карточка решения по макету: фото + название + «Подробнее».
   * Без кадра — светлый лист с пиктограммой разреза и параметрами. */
  const solutionTile = (s, i) => {
    const img = s.cover || `sol-${s.slug}`;
    const photo = hasImage(img);
    return html`
      <a class="${cx('card tzcard', s.flag && 'tzcard--flag')}" href="${s.url}" data-reveal>
        <span class="card__media">
          ${photo
            ? raw(picture(img, { alt: `${s.short || s.title} — Steppe Steel`, sizes: '(min-width: 1020px) 33vw, (min-width: 640px) 50vw, 100vw' }))
            : html`<span class="tzcard__spec"><span class="tzcard__spec-num mono">${String(i + 1).padStart(2, '0')}</span>${pict(s.slug)}<span class="tzcard__spec-list mono">${(s.cardMeta || []).map((m) => html`<span>${m}</span>`)}</span></span>`}
          ${photo && s.coverViz ? vizTag() : ''}
          ${s.flag ? html`<span class="card__flag mono">${s.flag}</span>` : ''}
        </span>
        <span class="card__body">
          <h3 class="card__title">${s.short || s.title}</h3>
          <span class="card__text">${s.summary}</span>
          <span class="btn btn--ghost tzcard__btn">Подробнее ${iconArrow}</span>
        </span>
      </a>
    `;
  };

  const content = html`
    <!-- 2. Первый экран — дословно по ТЗ §5, фото каркаса справа -->
    <section class="tzhero">
      <div class="container tzhero__grid">
        <div class="tzhero__text">
          <p class="tzhero__brand mono" data-reveal>STEPPESTEEL · Костанайская область · весь Казахстан</p>
          <h1 class="tzhero__title" data-reveal>Завод строительных металло&shy;конструкций</h1>
          <p class="tzhero__slogan" data-reveal>${site.brand.slogan}</p>
          <p class="tzhero__lead" data-reveal>${site.brand.tagline}.</p>
          <div class="btn-row" data-reveal>
            <a class="btn btn--primary btn--lg" href="${site.cta.primary.url}">${site.cta.primary.title}</a>
            <a class="btn btn--ghost btn--lg" href="/resheniya/">Посмотреть решения</a>
          </div>
          <ul class="tzhero__facts mono" data-reveal>
            <li>Сертификат РК № ${cert.number}</li>
            <li>Собственное проектирование: КМ и КМД</li>
            <li>Расчёт за 24 часа</li>
          </ul>
        </div>
        <figure class="tzhero__media" data-reveal>
          ${heroImg
            ? raw(picture(heroImg, { alt: 'Металлокаркас ангара производства Steppe Steel', sizes: '(min-width: 1020px) 45vw, 100vw', priority: true }))
            : raw(photoSlot('hero-photo', { label: 'Фото каркаса готовится', alt: 'Фото каркаса готовится' }))}
          <figcaption class="tzhero__cap mono">Металлокаркас ангара · профили ПСУ и ПС собственной линии</figcaption>
        </figure>
      </div>
    </section>

    <!-- 3. Наши показатели -->
    <section class="section section--tight tzkpi" aria-labelledby="kpi-title">
      <div class="container">
        <p class="eyebrow mono tzkpi__label" id="kpi-title">Наши показатели</p>
        <div class="kpi">
          ${kpi.map(
            (s) => html`
              <div class="kpi__item" data-reveal>
                <span class="kpi__icon" aria-hidden="true">${s.icon}</span>
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

    <!-- Сортамент: чертёжная лента сечений собственной линии (ТЗ §3) -->
    <section class="section section--tight tzsort">
      <div class="container">
        <div class="tzsort__head">
          <p class="eyebrow mono">Собственный профиль</p>
          <p class="tzsort__text">Каркас собирается из профилей ПСУ и ПС нашей линии профилирования,
          а не из покупного проката. Геометрия одинаковая на всей партии, сортамент сертифицирован.</p>
          <a class="arrow-link" href="/profili/">Таблицы сортамента ${iconArrow}</a>
        </div>
        ${sortamentStrip(profiles)}
      </div>
    </section>

    <!-- 4. Что мы производим -->
    <section class="section section--tint" id="resheniya">
      <div class="container">
        ${sectionHead({
          label: 'Наши решения',
          title: 'Что мы производим',
          text: 'Девять типов зданий с одной производственной площадки: каркас, комплект, документация. У каждого решения — своя страница с конструктивом и параметрами.',
          action: { title: 'Все решения', url: '/resheniya/' },
        })}
        <div class="card-grid card-grid--3">
          ${solutions.items.map((s, i) => solutionTile(s, i))}
        </div>
      </div>
    </section>

    <!-- 5. Типовые решения -->
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
                <span class="typ-card__scheme">${typicalScheme(SCHEMES[i] || SCHEMES[0])}</span>
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

    <!-- 6. Реализованные объекты -->
    <section class="section section--tint" id="obekty">
      <div class="container">
        ${sectionHead({
          label: 'Портфолио',
          title: 'Реализованные объекты',
          text: portfolio.intro,
          action: { title: 'Все объекты', url: '/obekty/' },
        })}
        <div class="card-grid card-grid--3">
          ${obj
            ? html`
                <a class="card obj-teaser" href="/obekty/" data-reveal>
                  <span class="card__media">
                    <span class="tzcard__spec"><span class="tzcard__spec-num mono">КМД</span><span class="tzcard__spec-list mono"><span>${obj.size}</span><span>${obj.area}</span><span>${obj.frameType}</span></span><span class="tzcard__spec-note mono">Фотофиксация объекта ведётся</span></span>
                  </span>
                  <span class="card__body">
                    ${obj.badge ? html`<span class="card__badge mono">${obj.badge}</span>` : ''}
                    <h3 class="card__title">${obj.title}</h3>
                    <span class="card__meta">${obj.region}${obj.year ? html`, ${obj.year}` : ''}</span>
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

    <!-- 7. Две карточки с чек-листами -->
    <section class="section" id="partnyorstvo">
      <div class="container">
        <div class="card-grid card-grid--2">
          ${aud.map(
            (a) => html`
              <div class="card aud" data-reveal>
                <div class="aud__body">
                  <h2 class="aud__title">${a.title}</h2>
                  <ul class="aud__list">
                    ${a.items.map((it) => html`<li>${iconCheck}<span>${it}</span></li>`)}
                  </ul>
                  <a class="btn btn--primary" href="${a.url}">${a.cta}</a>
                </div>
                <div class="aud__media">${hasImage(a.photoSlot)
                  ? raw(picture(a.photoSlot, { alt: a.title, sizes: '(min-width: 900px) 25vw, 100vw' }))
                  : raw(photoSlot(a.photoSlot, { label: 'Фото в обработке', alt: a.title }))}</div>
              </div>
            `
          )}
        </div>
      </div>
    </section>

    <!-- 8. Как мы работаем — пять шагов с иконками -->
    <section class="section section--tint" id="process">
      <div class="container">
        ${sectionHead({ label: 'Процесс', title: 'Как мы работаем', text: production.process.intro })}
        <ol class="tzsteps">
          ${steps.map(
            (s, i) => html`
              <li class="tzsteps__item" data-reveal>
                <span class="tzsteps__icon" aria-hidden="true">${s.icon}</span>
                <span class="tzsteps__num mono">0${i + 1}</span>
                <span class="tzsteps__title">${s.title}</span>
                <span class="tzsteps__text">${s.text}</span>
                ${s.dur ? html`<span class="tzsteps__dur mono">${s.dur}</span>` : ''}
              </li>
            `
          )}
        </ol>
        <p class="note">${production.process.note}</p>
      </div>
    </section>

    <!-- 9. О заводе кратко: текст + 4 фото производства -->
    <section class="section" id="zavod">
      <div class="container about-band about-band--tz">
        <div class="about-band__text" data-reveal>
          <p class="eyebrow mono">О заводе</p>
          <h2 class="section-head__title">О заводе STEPPESTEEL</h2>
          <p class="lead">Завод полного цикла в Костанайской области: собственная линия
          профилирования ПСУ и ПС, участки резки и сварки, проектный отдел
          с ЛИРА-САПР и Tekla Structures, комплектация и отгрузка по всему Казахстану.</p>
          <dl class="tzpass">
            <div><dt>Площадка</dt><dd>${site.contacts.address.settlement}, ${site.contacts.address.district}, ${site.contacts.address.region}</dd></div>
            <div><dt>Логистика</dt><dd>трасса Костанай — Петропавловск · ж/д станция Пресногорьковская</dd></div>
            <div><dt>Профили</dt><dd>ПСУ 150–280 и ПС 100–280 · сталь 1,5–3,5 мм, оцинкованная</dd></div>
            <div><dt>Проектирование</dt><dd>КМ и КМД силами завода · ЛИРА-САПР, Tekla Structures</dd></div>
            <div><dt>Сертификат</dt><dd class="mono">${cert.number}</dd></div>
            <div><dt>Юрлицо</dt><dd>${site.brand.legalName} · БИН ${site.brand.bin}</dd></div>
          </dl>
          <div class="btn-row">
            <a class="btn btn--primary" href="/o-zavode/">Подробнее о заводе</a>
            <a class="btn btn--ghost" href="/proizvodstvo/">Производство</a>
          </div>
        </div>
        <div class="about-band__photos">
          ${aboutPhotos.map(
            ({ slot, sec }) => html`
              <figure class="about-band__photo" data-reveal>
                ${hasImage(slot)
                  ? raw(picture(slot, { alt: `${sec?.title || 'Производство'} — Steppe Steel`, sizes: '(min-width: 1020px) 29vw, 50vw' }))
                  : raw(photoSlot(slot, { label: sec?.title || 'Фото производства', alt: sec?.title || '' }))}
                <figcaption class="about-band__cap mono">${sec?.title || ''}</figcaption>
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
      noNext: true,
      image: heroImg || undefined,
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
