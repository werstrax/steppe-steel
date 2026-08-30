/**
 * /profili/: сортамент профилей ПСУ и ПС — заводские таблицы геометрии,
 * глоссарий обозначений, сертификат. Строгая подача без интерактива v3.
 */

import { layout } from '../lib/layout.mjs';
import { html, raw, e } from '../lib/util.mjs';
import { pageHero, ctaBand, sectionHead, iconArrow } from '../lib/components.mjs';
import { profilesListNode } from '../lib/schema.mjs';

/** Статичное сечение профиля из заводского SVG-контура. */
function sectionSvg(item) {
  return raw(`
  <svg class="prof-section" viewBox="140 60 200 320" fill="none" role="img"
       aria-label="Сечение профиля ${e(item.code)}: ${e(item.name)}">
    <path d="${e(item.path)}" stroke="currentColor" stroke-width="10" stroke-linejoin="round"/>
  </svg>`);
}

export function renderProfili(d) {
  const { site, profiles } = d;
  const crumbList = [
    { title: 'Главная', url: '/' },
    { title: 'Профили ПСУ и ПС', url: '/profili/' },
  ];

  const content = html`
    ${pageHero({
      label: profiles.kicker,
      titleHtml: 'Профили ПСУ и ПС',
      text: profiles.intro,
      crumbList,
    })}

    <section class="section section--flush-top">
      <div class="container">
        ${sectionHead({ label: 'Обозначения', title: profiles.glossaryTitle, text: profiles.glossaryIntro })}
        <div class="grid-2">
          ${profiles.items.map((item, i) => {
            const g = profiles.glossary[i];
            return html`
              <div class="prof-card" data-reveal>
                <div class="prof-card__draw">${sectionSvg(item)}</div>
                <div class="prof-card__body">
                  <h3 class="prof-card__title"><span class="mono">${item.code}</span> — ${g.full}</h3>
                  <p class="prof-card__text">${g.text}</p>
                  <p class="prof-card__meta mono">Высоты: ${item.heights}</p>
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    </section>

    <section class="section section--tint">
      <div class="container">
        ${sectionHead({ label: profiles.sortamentKicker, title: profiles.sortamentTitle, text: profiles.sortamentIntro })}
        <div class="grid-2 grid-2--top">
          ${profiles.sortament.map(
            (t) => html`
              <div class="table-wrap" data-reveal tabindex="0" role="region" aria-label="${t.caption}">
                <table class="table table--compact">
                  <caption class="table__caption">${t.caption}</caption>
                  <thead><tr>${t.cols.map((c) => html`<th scope="col">${c}</th>`)}</tr></thead>
                  <tbody>
                    ${t.rows.map(
                      (row) => html`<tr>${row.map((cell, i) => (i === 0 ? html`<th scope="row" class="mono">${cell}</th>` : html`<td class="mono">${cell}</td>`))}</tr>`
                    )}
                  </tbody>
                </table>
              </div>
            `
          )}
        </div>
        <p class="note mono" data-reveal>${profiles.sortamentNote}</p>
      </div>
    </section>

    <section class="section">
      <div class="container split split--even">
        <div class="stack" data-reveal>
          <p class="eyebrow mono">Производство</p>
          <h2 class="section-head__title">Одна линия — одна геометрия</h2>
          <p>${profiles.footline}.</p>
          <p class="note mono">${profiles.disclaimer}</p>
        </div>
        <div class="stack" data-reveal>
          <p class="eyebrow mono">Документы</p>
          <h2 class="section-head__title">Профиль сертифицирован</h2>
          <p>Сертификат соответствия РК № KZ.3510317.01.01.67913 — 43 позиции сортамента ПСУ и ПС. Сканы всех листов и скачивание — на странице для проектировщиков.</p>
          <p><a class="arrow-link" href="/proektirovshchikam/#sertifikat">Смотреть сертификат ${iconArrow}</a></p>
        </div>
      </div>
    </section>

    ${ctaBand(site, {
      title: 'Нужен сортамент в рабочем виде?',
      text: 'Вышлем таблицы геометрических характеристик и проконсультируем по подбору сечений под ваш проект.',
    })}
  `;

  return layout(
    site,
    {
      url: '/profili/',
      title: profiles.seoTitle,
      description: profiles.seoDescription,
      crumbs: crumbList,
      schema: [profilesListNode(site, profiles)],
    },
    content
  );
}
