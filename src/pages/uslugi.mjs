/**
 * Услуги завода: хаб + страница на каждую услугу (SEO-страницы полного цикла).
 */

import { layout } from '../lib/layout.mjs';
import { html, raw, e, picture } from '../lib/util.mjs';
import {
  pageHero, sectionHead, serviceRow, ctaBand, stat, faq, articleCard,
  vizTag, video, iconArrow,
} from '../lib/components.mjs';
import { serviceNode, faqNode, itemListNode } from '../lib/schema.mjs';

const crumbsBase = [{ title: 'Главная', url: '/' }, { title: 'Услуги', url: '/uslugi/' }];

export function renderUslugiIndex(d) {
  const { site, services, process } = d;
  const hub = services.hub;

  const content = html`
    ${raw(pageHero({
      label: hub.kicker,
      titleHtml: 'Услуги завода',
      crumbList: crumbsBase,
      text: raw(e(hub.intro)),
    }))}

    <section class="section section--tight">
      <div class="container">
        <div>
          ${services.items.map((s, i) => serviceRow(s, i))}
        </div>
      </div>
    </section>

    <section class="section section--sheet">
      <div class="container">
        ${raw(sectionHead({
          label: 'Четыре этапа — одна ответственность',
          title: 'Полный цикл в одних руках',
          text: 'Заказчик общается с одним подрядчиком. Проектировщик, цех и логистика работают по одному разделу КМ — стыков «между исполнителями» нет.',
          action: { title: 'Процесс по шагам', url: '/process/' },
        }))}
        <div class="grid grid--4">
          ${[
            ['01', 'Проектирование', 'Эскиз, статический расчёт, раздел КМ, оптимизация металлоёмкости — убираем лишние килограммы стали до запуска в цех.'],
            ['02', 'Производство', 'Резка, обработка, сварка узлов; оцинкованные профили ЛСТК и элементы из чёрного металла — по одному комплекту чертежей.'],
            ['03', 'Комплектация', 'Маркировка каждого элемента, крепёж, схемы сборки: на площадку приходит комплект здания, а не россыпь металла.'],
            ['04', 'Отгрузка', 'Собственный автотранспорт, доставка по всему Казахстану; отгружаем в согласованные сроки, комплектно.'],
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

    <!-- Проектным организациям: отдельный сценарий работы -->
    <section class="section section--sheet section--tight">
      <div class="container">
        <div class="lead-band">
          <div>
            <p class="eyebrow mono">Проектным организациям</p>
            <h2 class="lead-band__title">Считаете объект под ЛСТК?</h2>
            <p class="lead-band__text">Завод берёт конструктивную часть на себя: расчёт, разделы КМ и КМД, сопровождение экспертизы. Заказчик и авторство проекта остаются вашими, по объектам с договором на поставку предусмотрено агентское вознаграждение.</p>
          </div>
          <a class="btn btn--dark btn--lg" href="/partnyoram/">Условия сотрудничества</a>
        </div>
      </div>
    </section>

    ${raw(ctaBand(site))}
  `;

  return layout(site, {
    url: '/uslugi/',
    title: hub.seoTitle,
    description: hub.seoDescription,
    image: 'prod-line',
    pageType: 'CollectionPage',
    crumbs: crumbsBase,
    schema: [itemListNode(site, '/uslugi/', services.items, 'Услуги завода Steppe Steel')],
  }, content);
}

export function renderService(d, s) {
  const { site, services, journal } = d;
  const c = site.contacts;
  const waEng = `${c.whatsapp}?text=${encodeURIComponent(c.whatsappEngineer)}`;
  const crumbs = [...crumbsBase, { title: s.title, url: s.url }];

  const idx = services.items.findIndex((x) => x.slug === s.slug);
  const prev = services.items[(idx - 1 + services.items.length) % services.items.length];
  const nextS = services.items[(idx + 1) % services.items.length];

  const articles = (s.articles || [])
    .map((slug) => journal.items.find((x) => x.slug === slug))
    .filter(Boolean);

  const content = html`
    ${raw(pageHero({
      label: `Услуга ${String(idx + 1).padStart(2, '0')} · Полный цикл`,
      titleHtml: e(s.title),
      crumbList: crumbs,
      text: raw(e(s.heroText)),
    }))}

    <section class="section--tight">
      <div class="container">
        <figure data-reveal style="margin:0">
          <div class="media media--16x9 drift">
            ${s.video
              ? raw(video(s.video.src, { poster: `${s.video.poster}-1152.jpg`, ariaLabel: s.video.aria }))
              : html`${raw(picture(s.image, { alt: s.imageAlt, sizes: '100vw', priority: true }))}${s.imageViz ? vizTag() : ''}`}
          </div>
        </figure>
      </div>
    </section>

    <section class="section section--sheet">
      <div class="container">
        ${raw(sectionHead({
          label: 'Состав услуги',
          title: s.includesTitle || `Что входит`,
        }))}
        <ol class="num-list" data-reveal>
          ${s.includes.map((x) => html`<li>${x}</li>`)}
        </ol>
        ${s.includesNote ? html`<p class="lead u-max-62" data-reveal style="margin-top:1.75rem">${s.includesNote}</p>` : ''}
      </div>
    </section>

    ${s.why?.length ? html`
      <section class="section">
        <div class="container">
          ${raw(sectionHead({
            label: s.whyTitle || 'Почему это важно',
            title: s.whyTitle || 'Почему это важно',
            text: s.whyIntro,
          }))}
          <div class="grid grid--2">
            ${s.why.map((w) => stat({ val: w.val, key: w.key }))}
          </div>
        </div>
      </section>
    ` : ''}

    ${s.gallery?.length ? html`
      <section class="section section--steel-2">
        <div class="container">
          ${raw(sectionHead({ label: 'Участки', title: 'Как это выглядит' }))}
          <div class="gallery gallery--flat">
            ${s.gallery.map((g) => html`
              <figure class="gallery__item" data-reveal data-lightbox style="margin:0">
                <div class="media media--3x2">
                  ${raw(picture(g.img, { alt: g.alt, sizes: '(min-width: 960px) 33vw, 100vw' }))}
                  ${g.viz ? vizTag() : ''}
                </div>
                <figcaption class="media-caption">${g.caption}</figcaption>
              </figure>
            `)}
          </div>
          ${s.galleryNote ? html`<p class="sheet-note" style="margin-top:1.5rem">${s.galleryNote}</p>` : ''}
        </div>
      </section>
    ` : ''}

    ${s.faq?.length ? html`
      <section class="section">
        <div class="container">
          ${raw(sectionHead({
            label: 'Вопросы и ответы',
            title: 'Частые вопросы',
            action: { title: 'Все вопросы', url: '/faq/' },
          }))}
          ${raw(faq(s.faq, { idPrefix: `faq-${s.slug}` }))}
        </div>
      </section>
    ` : ''}

    ${articles.length ? html`
      <section class="section section--steel-2">
        <div class="container">
          ${raw(sectionHead({
            label: 'Разбор в журнале',
            title: 'Читайте по теме',
            action: { title: 'Весь журнал', url: '/blog/' },
          }))}
          <div class="grid ${articles.length >= 3 ? 'grid--3' : 'grid--2'}">
            ${articles.map((a) => articleCard(a))}
          </div>
        </div>
      </section>
    ` : ''}

    <nav class="section--tight pager" aria-label="Другие услуги">
      <div class="container pager__inner">
        <a class="pager__link" href="${prev.url}" data-reveal>
          <span class="mono text-muted">← Предыдущая</span>
          <span class="pager__title">${prev.title}</span>
        </a>
        <a class="pager__link pager__link--next" href="${nextS.url}" data-reveal>
          <span class="mono text-muted">Следующая →</span>
          <span class="pager__title">${nextS.title}</span>
        </a>
      </div>
    </nav>

    ${raw(ctaBand(site, {
      title: 'Обсудить ваш объект',
      text: 'Пришлите параметры здания — назначение, размеры, место строительства. Инженер посчитает каркас и подготовит КП в течение 24 часов. Бесплатно и без обязательств.',
    }))}
  `;

  return layout(site, {
    url: s.url,
    title: s.seoTitle,
    description: s.seoDescription,
    image: s.image,
    crumbs,
    schema: [serviceNode(site, s), faqNode(site, s.url, s.faq || [])].filter(Boolean),
  }, content);
}
