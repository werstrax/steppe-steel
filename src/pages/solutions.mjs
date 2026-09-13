/**
 * Решения (ТЗ §6): хаб /resheniya/ и страницы типов зданий /resheniya/<slug>/.
 */

import { layout, html, raw, e } from '../lib/layout.mjs';
import {
  pageHero, sectionHead, specs, faq, ctaBand, photoSlot,
  solutionRow, solutionCard, iconArrow, iconWhatsApp, grainCalcBlock, modularScheme,
} from '../lib/components.mjs';
import { productNode, faqNode, itemListNode } from '../lib/schema.mjs';
import { hasImage, picture } from '../lib/util.mjs';
import { objectVideo } from '../lib/video.mjs';

/* --- Хаб ------------------------------------------------------------------ */

export function renderSolutionsIndex(d) {
  const { site, solutions } = d;
  const hub = solutions.hub;
  const crumbList = [
    { title: 'Главная', url: '/' },
    { title: 'Решения', url: '/resheniya/' },
  ];

  const content = html`
    ${pageHero({
      label: hub.kicker,
      titleHtml: hub.title,
      text: hub.intro,
      crumbList,
    })}

    <section class="section section--flush-top">
      <div class="container">
        <div class="card-grid card-grid--3">
          ${solutions.items.map((s) => solutionCard(s, { level: 2 }))}
        </div>
        <p class="note" data-reveal>${hub.note}</p>
      </div>
    </section>

    <section class="section section--tint">
      <div class="container">
        ${sectionHead({ label: hub.choose.kicker, title: hub.choose.title, text: hub.choose.intro })}
        <div class="grid-4">
          ${hub.choose.items.map(
            (it, i) => html`
              <div class="pick-card" data-reveal>
                <span class="pick-card__num mono">${String(i + 1).padStart(2, '0')}</span>
                <h3 class="pick-card__title">${it.title}</h3>
                <p class="pick-card__text">${it.text}</p>
              </div>
            `
          )}
        </div>
        <p class="note mono" data-reveal>${hub.choose.note}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${sectionHead({ label: hub.frameTypes.kicker, title: hub.frameTypes.title, text: hub.frameTypes.intro })}
        <div class="table-wrap" data-reveal tabindex="0" role="region" aria-label="${hub.frameTypes.title}">
          <table class="table">
            <thead>
              <tr>${hub.frameTypes.head.map((h, i) => html`<th scope="col" class="${i === hub.frameTypes.highlight ? 'is-hl' : ''}">${h}</th>`)}</tr>
            </thead>
            <tbody>
              ${hub.frameTypes.rows.map(
                (row) => html`
                  <tr>
                    ${row.map((cell, i) =>
                      i === 0
                        ? html`<th scope="row">${cell}</th>`
                        : html`<td class="${i === hub.frameTypes.highlight ? 'is-hl' : ''}">${cell}</td>`
                    )}
                  </tr>
                `
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    ${ctaBand(site)}
  `;

  return layout(
    site,
    {
      url: '/resheniya/',
      title: hub.seoTitle,
      description: hub.seoDescription,
      crumbs: crumbList,
      pageType: 'CollectionPage',
      schema: [itemListNode(site, '/resheniya/', solutions.items, 'Решения Steppe Steel')],
    },
    content
  );
}

/* --- Страница решения ----------------------------------------------------- */

export function renderSolution(d, s) {
  const { site, solutions } = d;
  const crumbList = [
    { title: 'Главная', url: '/' },
    { title: 'Решения', url: '/resheniya/' },
    { title: s.short || s.title, url: s.url },
  ];
  const related = (s.related || [])
    .map((slug) => solutions.items.find((x) => x.slug === slug))
    .filter(Boolean);
  const articles = (s.articles || [])
    .map((slug) => d.journal.items.find((a) => a.slug === slug))
    .filter(Boolean);

  // Один адрес расчёта для всех кнопок страницы: форма откроется с этим типом
  const calcType = s.preselect || s.slug;
  const calcUrl = `/raschet/?type=${encodeURIComponent(calcType)}`;
  const ctaTitle = s.ctaTitle || 'Получить расчёт';
  const waText = s.waText || site.contacts.whatsappText;
  const waUrl = `${site.contacts.whatsapp}?text=${encodeURIComponent(waText)}`;
  // Мягкий перенос в длинном слове H1 — только в разметке заголовка, не в title/JSON-LD
  const titleHtml = e(s.title).replace(/металлоконструкц/g, 'металло&shy;конструкц');
  const offer = s.heroOffer || 'Расчёт и КП за 24 часа · WhatsApp · завод в Костанайской области';

  const content = html`
    ${pageHero({
      label: s.flag || 'Решение STEPPESTEEL',
      titleHtml,
      text: s.lead,
      offer,
      actions: html`
        <a class="btn btn--primary btn--lg" href="${calcUrl}">${ctaTitle}</a>
        <a class="btn btn--wa btn--lg" href="${waUrl}" target="_blank" rel="noopener" data-goal="wa_click">
          ${iconWhatsApp}<span>Написать в WhatsApp</span>
        </a>
      `,
      crumbList,
      image: s.cover || `sol-${s.slug}`,
      imageAlt: s.photoAlt || s.title,
      imageCaption: s.coverCaption,
    })}

    <section class="section section--flush-top">
      <div class="container split">
        <div class="stack">
          ${(s.intro || []).map((par) => html`<p class="text-lg" data-reveal>${par}</p>`)}
          ${(s.figures || []).length
            ? html`<div class="tech-media" data-lightbox>
                ${s.figures.map((m) => html`<figure class="tech-media__item" data-reveal>
                  ${hasImage(m.slot) ? raw(picture(m.slot, { alt: m.caption, sizes: '(min-width: 900px) 40vw, 100vw' })) : raw(photoSlot(m.slot, { label: m.caption, alt: m.caption }))}
                  <figcaption class="media-caption">${m.caption}</figcaption>
                </figure>`)}
              </div>`
            : ''}
          ${s.audience?.length
            ? html`
                <div data-reveal>
                  <h2 class="h4">Для чего используют</h2>
                  <ul class="check-list">
                    ${s.audience.map((a) => html`<li>${a}</li>`)}
                  </ul>
                </div>
              `
            : ''}
        </div>
        <aside class="side" data-reveal>
          <h2 class="side__title mono">Параметры</h2>
          ${specs(s.specs || [])}
          <a class="btn btn--primary btn--wide" href="${calcUrl}">Получить расчёт</a>
        </aside>
      </div>
    </section>

    ${s.slug === 'zernohranilishcha' ? objectVideo({ label: 'Объект завода · видео', id: 'video', tint: true, action: null }) : ''}

    ${s.features?.length
      ? html`
          <section class="section section--tint">
            <div class="container">
              ${sectionHead({ label: 'Конструктив', title: 'Из чего складывается решение' })}
              <div class="feat-grid">
                ${s.features.map(
                  (f) => html`
                    <div class="feat" data-reveal>
                      <h3 class="feat__title">${f.t}</h3>
                      <p class="feat__text">${f.d}</p>
                    </div>
                  `
                )}
              </div>
            </div>
          </section>
        `
      : ''}

    ${s.capacity
      ? html`
          <section class="section" id="vmestimost">
            <div class="container">
              ${sectionHead({ label: s.capacity.kicker, title: s.capacity.title, text: s.capacity.intro })}
              <div class="table-wrap" data-reveal tabindex="0" role="region" aria-label="${s.capacity.title}">
                <table class="table">
                  <thead><tr>${s.capacity.head.map((h) => html`<th scope="col">${h}</th>`)}</tr></thead>
                  <tbody>
                    ${s.capacity.rows.map(
                      (row) => html`<tr>${row.map((cell, i) => (i === 0 ? html`<th scope="row">${cell}</th>` : html`<td class="mono">${cell}</td>`))}</tr>`
                    )}
                  </tbody>
                </table>
              </div>
              <p class="note mono" data-reveal>${s.capacity.note}</p>
            </div>
          </section>
        `
      : ''}

    ${s.slug === 'zernohranilishcha' || s.slug === 'modulnye-zdaniya'
      ? html`
          <section class="section" id="modulnost">
            <div class="container split split--even">
              <div class="stack" data-reveal>
                <p class="eyebrow mono">Модульность</p>
                <h2 class="section-head__title">Здание растёт секциями</h2>
                <p>Длина наращивается по существующему проекту: разбирается торцевая стена, добавляется секция каркаса, торец переносится. Без демонтажа и остановки хранения — до 140 м.</p>
              </div>
              <div class="modular-wrap" data-reveal>${modularScheme()}</div>
            </div>
          </section>
        `
      : ''}

    ${s.calc && s.slug === 'zernohranilishcha' ? raw(grainCalcBlock()) : ''}

    ${s.economy
      ? html`
          <section class="section section--tint">
            <div class="container">
              ${sectionHead({
                label: s.economy.kicker,
                title: s.economy.title,
                action: s.slug === 'zernohranilishcha' ? { title: 'Посчитать окупаемость: свой склад против элеватора', url: '/agrariyam/#okupaemost' } : undefined,
              })}
              <ul class="num-list" data-reveal>
                ${s.economy.items.map((it, i) => html`<li><span class="mono">${String(i + 1).padStart(2, '0')}</span>${it}</li>`)}
              </ul>
            </div>
          </section>
        `
      : ''}

    ${s.subtypes?.length
      ? html`
          <section class="section">
            <div class="container">
              ${sectionHead({ label: 'Конфигурации', title: 'От чего оттолкнуться в расчёте' })}
              <div class="grid-3">
                ${s.subtypes.map(
                  (t) => html`
                    <div class="sub-card" data-reveal>
                      <h3 class="sub-card__title">${t.title}</h3>
                      <p class="sub-card__text">${t.text}</p>
                      <p class="sub-card__meta mono">${t.meta}</p>
                    </div>
                  `
                )}
              </div>
            </div>
          </section>
        `
      : ''}

    ${s.faq?.length
      ? html`
          <section class="section section--tint">
            <div class="container container--narrow">
              ${sectionHead({ label: 'Вопросы', title: 'Что спрашивают об этом решении', split: false })}
              ${faq(s.faq, { idPrefix: `faq-${s.slug}` })}
            </div>
          </section>
        `
      : ''}

    ${articles.length
      ? html`
          <section class="section">
            <div class="container">
              ${sectionHead({ label: 'Журнал', title: 'Разобрано в статьях' })}
              <ul class="link-list" data-reveal>
                ${articles.map((a) => html`<li><a class="arrow-link" href="${a.url}">${a.title} ${iconArrow}</a></li>`)}
              </ul>
            </div>
          </section>
        `
      : ''}

    ${related.length
      ? html`
          <section class="section section--tint">
            <div class="container">
              ${sectionHead({ label: 'Смежные решения', title: 'Смотрят вместе с этим' })}
              <div class="sol-list">
                ${related.map((r) => solutionRow(r))}
              </div>
            </div>
          </section>
        `
      : ''}

    ${ctaBand(site, {
      // Заголовок — готовое поле ctaTitle, без склейки через toLowerCase
      title: e(ctaTitle),
      text: 'Назначение, размеры, регион строительства — инженер завода вернёт расчёт с конструктивом и спецификацией.',
      calcUrl,
      waText,
    })}
  `;

  return layout(
    site,
    {
      url: s.url,
      title: s.seoTitle,
      description: s.seoDescription,
      crumbs: crumbList,
      waText,
      calcType,
      image: hasImage(s.cover || `sol-${s.slug}`) ? (s.cover || `sol-${s.slug}`) : undefined,
      schema: [productNode(site, s), faqNode(site, s.url, s.faq)],
    },
    content
  );
}
