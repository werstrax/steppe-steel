/**
 * Главная страница v4 — по ТЗ §5: первый экран «ЗАВОД СТРОИТЕЛЬНЫХ
 * МЕТАЛЛОКОНСТРУКЦИЙ», решения, производство, схема работы, аудитории.
 */

import { layout, html, raw } from '../lib/layout.mjs';
import {
  sectionHead, solutionRow, stat, step, ctaBand, articleCard,
  photoSlot, iconArrow, iconWhatsApp, docRow,
} from '../lib/components.mjs';
import { organizationNode, websiteNode, itemListNode, faqNode, howToNode } from '../lib/schema.mjs';

export function renderHome(d) {
  const { site, solutions, production, journal, documents } = d;
  const p = site.proof;

  const heroStats = [
    { val: p.span, key: 'пролёт без внутренних колонн' },
    { val: p.steelMax, key: 'оцинкованная сталь профилей ПСУ и ПС' },
    { val: p.snowRegion, key: `снеговая нагрузка ${p.snowLoad} в расчёте` },
    { val: p.frost, key: 'монтаж и эксплуатация — круглый год' },
  ];

  const audiences = [
    {
      url: '/agrariyam/',
      title: 'Я — аграрий',
      text: 'Зернохранилища, овощехранилища, здания для техники — всё хозяйство с одного завода.',
    },
    {
      url: '/stroitelnym-kompaniyam/',
      title: 'Я — строительная компания',
      text: 'Вы строите — Steppe Steel проектирует и производит металлокаркас под ваш объект.',
    },
    {
      url: '/proektirovshchikam/',
      title: 'Я — проектировщик',
      text: 'Конструктив, КМ и КМД, расчёты и сопровождение экспертизы — силами завода.',
    },
    {
      url: '/partneram/',
      title: 'Я — будущий партнёр',
      text: 'Региональное представительство: запросы по вашей территории и поддержка завода.',
    },
  ];

  const techList = [
    { url: '/tekhnologii/lstk/', title: 'ЛСТК', text: 'лёгкие стальные тонкостенные конструкции' },
    { url: '/tekhnologii/lmk/', title: 'ЛМК', text: 'фермы и колонны для больших пролётов' },
    { url: '/tekhnologii/boltovye-soedineniya/', title: 'Болтовые соединения', text: 'сборка без сварки на площадке' },
    { url: '/tekhnologii/zavodskaya-gotovnost/', title: 'Заводская готовность', text: 'комплект с маркировкой по КМД' },
    { url: '/tekhnologii/modulnost/', title: 'Модульность', text: 'здание расширяется секциями' },
    { url: '/tekhnologii/antikorroziynaya-zashchita/', title: 'Антикоррозионная защита', text: 'оцинковка со сроком службы 50+ лет' },
    { url: '/tekhnologii/proektirovanie/', title: 'Проектирование', text: 'ЛИРА-САПР, КМ и КМД в Tekla' },
  ];

  const certDoc = documents.categories.find((c) => c.id === 'sertifikaty')?.items[0];

  const content = html`
    <!-- Первый экран: формула из ТЗ дословно -->
    <section class="hero">
      <div class="container hero__grid">
        <div class="hero__text">
          <p class="eyebrow mono" data-reveal>STEPPESTEEL · Костанайская область · Казахстан</p>
          <h1 class="hero__title" data-reveal>Завод строительных металло&shy;конструкций</h1>
          <p class="hero__slogan mono" data-reveal>Проектирование. Производство. Комплектная поставка.</p>
          <p class="hero__lead" data-reveal>
            Производство металлокаркасов из ЛСТК и ЛМК для промышленных,
            сельскохозяйственных, складских и коммерческих зданий.
            Контур здания&nbsp;— за&nbsp;<span class="nowrap">30–45&nbsp;дней</span>
            после утверждения проекта.
          </p>
          <div class="btn-row" data-reveal>
            <a class="btn btn--primary btn--lg" href="${site.cta.primary.url}">${site.cta.primary.title}</a>
            <a class="btn btn--ghost btn--lg" href="${site.cta.secondary.url}">${site.cta.secondary.title}</a>
          </div>
        </div>
        <div class="hero__media hero__media--slot" data-reveal>
          ${raw(photoSlot('hero-photo', {
            label: 'Фото с производства готовится',
            alt: 'Место под фотографию производства Steppe Steel',
            className: 'photo-slot--hero',
          }))}
        </div>
      </div>
      <div class="container">
        <div class="hero__stats">${heroStats.map((s) => stat(s))}</div>
      </div>
    </section>

    <!-- Решения: 9 направлений из ТЗ §6 -->
    <section class="section" id="resheniya">
      <div class="container">
        ${sectionHead({
          label: 'Наши решения',
          title: 'Здания под вашу задачу',
          text: 'Девять типов зданий с одной производственной площадки. Каждое решение — отдельная страница с конструктивом и параметрами.',
          action: { title: 'Все решения', url: '/resheniya/' },
        })}
        <div class="sol-list">
          ${solutions.items.map((s, i) => solutionRow(s, { num: i + 1 }))}
        </div>
      </div>
    </section>

    <!-- Производство: тёмная полоса «завод, а не посредник» -->
    <section class="section section--dark" id="zavod">
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

    <!-- Схема работы -->
    <section class="section">
      <div class="container">
        ${sectionHead({
          label: 'Как идёт заказ',
          title: production.process.title,
          text: production.process.intro,
        })}
        <div class="steps">
          ${production.process.steps.map((s, i) => step(s, i))}
        </div>
        <p class="note mono" data-reveal>${production.process.note}</p>
      </div>
    </section>

    <!-- Аудитории -->
    <section class="section section--tint">
      <div class="container">
        ${sectionHead({
          label: 'С кем работаем',
          title: 'Четыре формата сотрудничества',
          text: 'Заказчику, подрядчику, проектировщику и региональному партнёру завод отвечает по-разному — выберите свой вход.',
        })}
        <div class="aud-grid">
          ${audiences.map(
            (a) => html`
              <a class="aud-card" href="${a.url}" data-reveal>
                <h3 class="aud-card__title">${a.title}</h3>
                <p class="aud-card__text">${a.text}</p>
                <span class="arrow-link">Подробнее ${iconArrow}</span>
              </a>
            `
          )}
        </div>
      </div>
    </section>

    <!-- Флагман: зернохранилища -->
    <section class="section" id="agro">
      <div class="container">
        <div class="flag-band" data-reveal>
          <div>
            <p class="eyebrow mono">Флагманское направление</p>
            <h2 class="flag-band__title">Модульные зернохранилища</h2>
            <p class="flag-band__text">
              Напольное хранение навалом: свайный фундамент без бетона, наклонные
              стены, длина секциями до ${site.proof.maxLength.replace('до ', '')}.
              Комплект конструкций — за ${site.proof.supplyDays}.
            </p>
            <div class="btn-row">
              <a class="btn btn--primary" href="/resheniya/zernohranilishcha/">Смотреть решение</a>
              <a class="btn btn--ghost" href="/agrariyam/">Всё для аграриев</a>
            </div>
          </div>
          <div class="flag-band__table">
            <table class="table table--compact">
              <caption class="u-visually-hidden">Вместимость зернохранилища на 1 метр длины по культурам</caption>
              <thead><tr><th scope="col">Культура</th><th scope="col">На 1 м длины</th></tr></thead>
              <tbody>
                <tr><td>Горох</td><td class="mono">70 т</td></tr>
                <tr><td>Пшеница</td><td class="mono">67 т</td></tr>
                <tr><td>Кукуруза</td><td class="mono">62 т</td></tr>
                <tr><td>Ячмень</td><td class="mono">56 т</td></tr>
                <tr><td>Подсолнечник</td><td class="mono">37 т</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- Технологии: второй тёмный контрапункт страницы -->
    <section class="section section--dark">
      <div class="container">
        ${sectionHead({
          label: 'Технологии',
          title: 'Из чего складывается качество каркаса',
          action: { title: 'Раздел «Технологии»', url: '/tekhnologii/' },
        })}
        <div class="tech-list">
          ${techList.map(
            (t) => html`
              <a class="tech-row" href="${t.url}" data-reveal>
                <span class="tech-row__title">${t.title}</span>
                <span class="tech-row__text">${t.text}</span>
                <span class="tech-row__arrow" aria-hidden="true">${iconArrow}</span>
              </a>
            `
          )}
        </div>
      </div>
    </section>

    <!-- Документы -->
    <section class="section">
      <div class="container">
        ${sectionHead({
          label: 'Документы',
          title: 'Профиль сертифицирован',
          text: 'Сертификат соответствия государственной системы технического регулирования РК на холодногнутые профили из оцинкованной стали — 43 позиции сортамента.',
          action: { title: 'Вся документация', url: '/dokumentaciya/' },
        })}
        ${certDoc ? html`<div class="docs">${docRow(certDoc)}</div>` : ''}
      </div>
    </section>

    <!-- Журнал -->
    <section class="section section--tint">
      <div class="container">
        ${sectionHead({
          label: 'Журнал',
          title: 'Инженерные материалы',
          action: { title: 'Все статьи', url: '/blog/' },
        })}
        <div class="grid-3">
          ${journal.items.slice(0, 3).map((a) => articleCard(a))}
        </div>
      </div>
    </section>

    ${ctaBand(site)}
  `;

  return layout(
    site,
    {
      url: '/',
      title: 'Завод металлоконструкций в Казахстане — Steppe Steel',
      description:
        'Завод строительных металлоконструкций Steppe Steel: проектирование, производство ЛСТК и ЛМК, комплектная поставка по Казахстану. Расчёт за 24 часа.',
      ogTitle: 'Steppe Steel — завод строительных металлоконструкций',
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
