/**
 * Каталог: хаб + страницы продукции (зернохранилища, ангары-склады, цеха).
 */

import { layout } from '../lib/layout.mjs';
import { html, raw, e, picture } from '../lib/util.mjs';
import {
  pageHero, sectionHead, productCard, ctaBand, stat, faq, specs,
  nextProduct, articleCard, vizTag, photoTag, video, iconArrow,
} from '../lib/components.mjs';
import { productNode, faqNode, itemListNode } from '../lib/schema.mjs';

const crumbsBase = [{ title: 'Главная', url: '/' }, { title: 'Каталог', url: '/katalog/' }];

/* --- Хаб каталога --------------------------------------------------------- */

export function renderKatalogIndex(d) {
  const { site, products } = d;
  const hub = products.hub;
  const c = site.contacts;
  const waEng = `${c.whatsapp}?text=${encodeURIComponent(c.whatsappEngineer)}`;

  const content = html`
    ${raw(pageHero({
      label: hub.kicker,
      titleHtml: 'Каталог зданий Steppe&nbsp;Steel',
      crumbList: crumbsBase,
      text: raw(e(hub.intro)),
    }))}

    <section class="section section--tight">
      <div class="container">
        <p class="mono text-muted" data-seen hidden style="margin-bottom:1.5rem"></p>
        <div class="grid grid--3" data-products>
          ${products.items.map((p) => productCard(p))}
        </div>
        <div class="catalog-custom" data-reveal>
          <div>
            <span class="product-card__code mono">ИП</span>
            <h3 style="display:inline;margin-left:0.8rem">Индивидуальный проект</h3>
          </div>
          <p class="text-muted" style="margin:0">Нестандартная геометрия, многопролётный комплекс, очередь строительства. Спроектируем под ваше ТЗ и площадку — от эскиза до раздела КМ.</p>
          <a class="btn btn--ghost" href="${waEng}" target="_blank" rel="noopener">Консультация инженера</a>
        </div>
      </div>
    </section>

    <section class="section section--sheet">
      <div class="container">
        ${raw(sectionHead({
          label: hub.choose.kicker,
          title: hub.choose.title,
          text: hub.choose.intro,
        }))}
        <div class="grid grid--4">
          ${hub.choose.items.map((it, i) => html`
            <div class="why-card" data-reveal>
              <span class="why-card__num mono">0${i + 1}</span>
              <h3 class="why-card__title">${it.title}</h3>
              <p class="why-card__text">${it.text}</p>
            </div>
          `)}
        </div>
        <p class="lead u-max-62" data-reveal style="margin-top:2rem">${hub.choose.note}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="grid grid--4">
          ${hub.stats.map((s) => stat(s))}
        </div>
      </div>
    </section>

    <section class="section section--sheet">
      <div class="container">
        ${raw(sectionHead({
          label: hub.frameTypes.kicker,
          title: hub.frameTypes.title,
          text: hub.frameTypes.intro,
        }))}
        <div class="table-wrap" data-reveal>
          <table class="table">
            <thead>
              <tr>${hub.frameTypes.head.map((h, i) => html`<th class="${i === hub.frameTypes.highlight ? 'table__hl' : ''}">${h}</th>`)}</tr>
            </thead>
            <tbody>
              ${hub.frameTypes.rows.map((row) => html`
                <tr>${row.map((cell, i) => html`<td class="${i === hub.frameTypes.highlight ? 'table__hl' : ''}">${cell}</td>`)}</tr>
              `)}
            </tbody>
          </table>
        </div>
        <p class="lead u-max-62" data-reveal style="margin-top:1.75rem">${hub.frameTypes.note}</p>
        <div class="btn-row" style="margin-top:1.5rem" data-reveal>
          <a class="btn btn--ghost" href="${waEng}" target="_blank" rel="noopener">Спросить инженера</a>
        </div>
      </div>
    </section>

    ${raw(ctaBand(site, {
      title: 'Начните с расчёта',
      text: 'Укажите тип здания, размеры и населённый пункт — за 24 часа пришлём предварительный расчёт стоимости каркаса под ваш снеговой район.',
    }))}
  `;

  return layout(site, {
    url: '/katalog/',
    title: hub.seoTitle,
    description: hub.seoDescription,
    image: 'steppe-frame',
    pageType: 'CollectionPage',
    crumbs: crumbsBase,
    schema: [itemListNode(site, '/katalog/', products.items, 'Каталог зданий Steppe Steel')],
  }, content);
}

/* --- Страница продукта ----------------------------------------------------- */

export function renderProduct(d, p) {
  const { site, products, journal } = d;
  const c = site.contacts;
  const waEng = `${c.whatsapp}?text=${encodeURIComponent(c.whatsappEngineer)}`;
  const crumbs = [...crumbsBase, { title: p.title, url: p.url }];

  const related = (p.related || [])
    .map((slug) => products.items.find((x) => x.slug === slug))
    .filter(Boolean);
  const next = related[0];
  const articles = (p.articles || [])
    .map((slug) => journal.items.find((x) => x.slug === slug))
    .filter(Boolean);

  const content = html`
    ${p.heroVideo
      ? html`
        <section class="hero hero--page noise">
          <div class="hero__media" aria-hidden="true">
            <video autoplay muted loop playsinline preload="metadata" data-autovideo poster="/assets/img/${p.heroVideo.poster}-1152.jpg">
              <source src="/assets/video/${p.heroVideo.src}" type="video/mp4">
            </video>
            <span class="hero__viz mono">Визуализация</span>
          </div>
          <div class="hero__scrim" aria-hidden="true"></div>
          <div class="container hero__inner">
            <p class="hero__kicker mono">${p.kicker}</p>
            <h1 class="hero__title">${raw(e(p.h1))}</h1>
            <p class="hero__sub lead u-max-62">${p.heroText}</p>
            <div class="btn-row hero__actions">
              <a class="btn btn--primary btn--lg" href="/zayavka/${p.preselect ? `?type=${p.preselect}` : ''}">Рассчитать стоимость</a>
              <a class="btn btn--ghost btn--lg" href="${waEng}" target="_blank" rel="noopener">Вопрос инженеру</a>
            </div>
          </div>
        </section>
      `
      : html`
        ${raw(pageHero({
          label: p.kicker,
          titleHtml: e(p.h1),
          crumbList: crumbs,
          text: raw(e(p.heroText)),
        }))}
        <section class="section--tight">
          <div class="container">
            <figure data-reveal style="margin:0">
              <div class="media media--16x9 drift">
                ${raw(picture(p.cover, { alt: p.coverAlt, sizes: '100vw', priority: true }))}
                ${p.coverViz ? vizTag() : ''}
              </div>
            </figure>
            <div class="btn-row" style="margin-top:1.5rem" data-reveal>
              <a class="btn btn--primary" href="/zayavka/${p.preselect ? `?type=${p.preselect}` : ''}">Рассчитать стоимость</a>
              <a class="btn btn--ghost" href="${waEng}" target="_blank" rel="noopener">Вопрос инженеру</a>
            </div>
          </div>
        </section>
      `}

    <!-- Конструктив / особенности -->
    <section class="section section--sheet">
      <div class="container">
        ${raw(sectionHead({
          label: p.featuresKicker,
          title: p.featuresTitle,
          text: p.featuresIntro,
        }))}
        <div class="grid grid--3">
          ${p.features.map((f) => stat({ val: f.val, key: f.key }))}
        </div>
      </div>
    </section>

    ${p.subtypes ? html`
      <section class="section">
        <div class="container">
          ${raw(sectionHead({
            label: p.subtypesKicker,
            title: p.subtypesTitle,
            text: p.subtypesIntro,
          }))}
          <div class="grid grid--3">
            ${p.subtypes.map((st) => html`
              <div class="why-card why-card--dark" id="${st.anchor}" data-reveal>
                <span class="product-card__code mono">${st.code}</span>
                <h3 class="why-card__title" style="margin-top:0.9rem">${st.title}</h3>
                <p class="why-card__text">${st.text}</p>
                <p class="mono text-muted" style="font-size:0.66rem;margin:0.75rem 0 0">${st.meta}</p>
              </div>
            `)}
          </div>
        </div>
      </section>
    ` : ''}

    ${p.capacity ? html`
      <section class="section section--sheet">
        <div class="container">
          ${raw(sectionHead({
            label: p.capacity.kicker,
            title: p.capacity.title,
            text: p.capacity.intro,
            action: { title: 'Калькулятор на главной', url: '/#agro' },
          }))}
          <div class="table-wrap" data-reveal>
            <table class="table table--capacity">
              <thead>
                <tr>${p.capacity.head.map((h, i) => html`<th class="${i === 1 ? 'table__hl' : ''}">${h}</th>`)}</tr>
              </thead>
              <tbody>
                ${p.capacity.rows.map((row) => html`
                  <tr>${row.map((cell, i) => html`<td class="${i === 1 ? 'table__hl' : ''}">${cell}</td>`)}</tr>
                `)}
              </tbody>
            </table>
          </div>
          <p class="sheet-note" style="margin-top:1.5rem">${p.capacity.note}</p>
        </div>
      </section>
    ` : ''}

    ${p.economy ? html`
      <section class="section">
        <div class="container">
          ${raw(sectionHead({
            label: p.economy.kicker,
            title: p.economy.title,
            text: p.economy.intro,
          }))}
          <ol class="num-list" data-reveal>
            ${p.economy.items.map((x) => html`<li>${x}</li>`)}
          </ol>
        </div>
      </section>
    ` : ''}

    ${p.steps ? html`
      <section class="section section--steel-2">
        <div class="container">
          ${raw(sectionHead({
            label: p.steps.kicker,
            title: p.steps.title,
            text: p.steps.intro,
          }))}
          <div class="grid grid--2">
            ${p.steps.items.map((s) => stat({ val: s.val, key: s.key }))}
          </div>
        </div>
      </section>
    ` : ''}

    ${p.gallery?.length ? html`
      <section class="section ${p.capacity ? 'section--steel-2' : ''}">
        <div class="container">
          ${raw(sectionHead({
            label: p.galleryKicker || 'Галерея',
            title: p.galleryTitle || `${p.title} — в кадрах`,
          }))}
          <div class="gallery gallery--flat">
            ${p.gallery.map((g) => html`
              <figure class="gallery__item" data-reveal data-lightbox style="margin:0">
                <div class="media media--3x2">
                  ${raw(picture(g.img, { alt: g.alt, sizes: '(min-width: 960px) 33vw, 100vw' }))}
                  ${g.viz ? vizTag() : g.photo ? photoTag() : ''}
                </div>
                <figcaption class="media-caption">${g.caption}</figcaption>
              </figure>
            `)}
          </div>
          ${p.galleryNote ? html`<p class="sheet-note" style="margin-top:1.5rem">${p.galleryNote}</p>` : ''}
        </div>
      </section>
    ` : ''}

    ${p.faq?.length ? html`
      <section class="section">
        <div class="container">
          ${raw(sectionHead({
            label: 'Вопросы и ответы',
            title: `Частые вопросы`,
            action: { title: 'Все вопросы', url: '/faq/' },
          }))}
          ${raw(faq(p.faq, { idPrefix: `faq-${p.slug}` }))}
        </div>
      </section>
    ` : ''}

    <section class="section section--sheet section--tight">
      <div class="container">
        <p class="lead u-max-70" data-reveal style="margin:0">
          Полный цикл на одном заводе: проектирование ведут инженеры —
          <a class="link" href="/uslugi/proektirovanie/">раздел КМ и КМД</a>,
          конструкции выпускает <a class="link" href="/uslugi/proizvodstvo/">собственная линия</a>,
          комплект едет к вам <a class="link" href="/uslugi/komplektaciya-dostavka/">нашим транспортом</a>.
        </p>
      </div>
    </section>

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

    ${raw(ctaBand(site, {
      title: `Рассчитаем<br>за 24 часа`,
      text: `Пришлите размеры или просто задачу — инженер подготовит предварительный расчёт и спецификацию за 24 часа. Считает завод, а не отдел продаж: цифры совпадут со сметой.`,
    }))}

    ${next ? nextProduct(next) : ''}
  `;

  return layout(site, {
    url: p.url,
    title: p.seoTitle,
    description: p.seoDescription,
    image: p.cover,
    imageAlt: p.coverAlt,
    pageType: 'ItemPage',
    crumbs,
    schema: [productNode(site, p), faqNode(site, p.url, p.faq || [])].filter(Boolean),
  }, content);
}
