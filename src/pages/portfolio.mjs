/**
 * /obekty/ (ТЗ §11): реализованные объекты с фильтром по категориям.
 * Только реальные объекты завода; раздел наполняется данными заказчика.
 */

import { layout, html } from '../lib/layout.mjs';
import { pageHero, portfolioCard, ctaBand, iconWhatsApp } from '../lib/components.mjs';
import { itemListNode } from '../lib/schema.mjs';

export function renderPortfolio(d) {
  const { site, portfolio } = d;
  const crumbList = [
    { title: 'Главная', url: '/' },
    { title: 'Портфолио', url: '/obekty/' },
  ];
  const counts = {};
  for (const o of portfolio.items) counts[o.category] = (counts[o.category] || 0) + 1;

  const content = html`
    ${pageHero({
      label: portfolio.kicker,
      titleHtml: portfolio.title,
      text: portfolio.intro,
      crumbList,
    })}

    <section class="section section--flush-top">
      <div class="container">
        ${portfolio.items.length >= 4 ? html`
        <div class="filter mono" data-filter role="group" aria-label="Фильтр объектов по назначению">
          ${portfolio.filters.map(
            (f) => html`
              <button class="filter__btn" type="button" data-filter-btn="${f.id}"
                ${f.id === 'all' ? 'aria-pressed="true"' : 'aria-pressed="false"'}>
                ${f.title}${f.id !== 'all' && counts[f.id] ? html` <span class="filter__count">${counts[f.id]}</span>` : ''}
              </button>
            `
          )}
        </div>
        ` : ''}

        <div class="obj-grid" data-filter-list>
          ${portfolio.items.map((o) => portfolioCard(o))}
        </div>
        ${portfolio.items.length >= 4 ? html`<p class="filter__empty note" data-filter-empty hidden>По этому фильтру объектов пока нет.</p>` : ''}

        <div class="empty-note" data-reveal>
          <h2 class="h4">${portfolio.empty.title}</h2>
          <p>${portfolio.empty.text}</p>
          <a class="btn btn--wa" href="${site.contacts.instagram}" target="_blank" rel="noopener">
            ${iconWhatsApp}<span>Instagram ${site.contacts.instagramHandle}</span>
          </a>
        </div>
      </div>
    </section>

    ${ctaBand(site, {
      title: 'Ваш объект — следующий',
      text: 'Пришлите назначение и размеры здания — инженер завода вернёт расчёт каркаса и комплектации.',
    })}
  `;

  return layout(
    site,
    {
      url: '/obekty/',
      title: portfolio.seoTitle,
      description: portfolio.seoDescription,
      crumbs: crumbList,
      pageType: 'CollectionPage',
      schema: [
        portfolio.items.length
          ? itemListNode(site, '/obekty/', portfolio.items.map((o) => ({ url: '/obekty/', title: o.title })), 'Объекты Steppe Steel')
          : null,
      ].filter(Boolean),
    },
    content
  );
}
