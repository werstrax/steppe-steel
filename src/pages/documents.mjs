/**
 * /dokumentaciya/ (ТЗ §15): категории документов, PDF на скачивание.
 * Новые файлы добавляются в src/assets/docs/ + запись в documents.json.
 */

import { layout, html } from '../lib/layout.mjs';
import { pageHero, sectionHead, docRow, ctaBand } from '../lib/components.mjs';

export function renderDocuments(d) {
  const { site, documents } = d;
  const crumbList = [
    { title: 'Главная', url: '/' },
    { title: 'Документация', url: '/dokumentaciya/' },
  ];

  const content = html`
    ${pageHero({
      label: documents.kicker,
      titleHtml: documents.title,
      text: documents.intro,
      crumbList,
    })}

    <section class="section section--flush-top">
      <div class="container container--narrow">
        ${documents.categories.map(
          (cat) => html`
            <div class="doc-cat" id="${cat.id}">
              <h2 class="doc-cat__title">${cat.title}</h2>
              ${cat.items.length
                ? html`<div class="docs">${cat.items.map((doc) => docRow(doc))}</div>`
                : ''}
              ${cat.note ? html`<p class="note" data-reveal>${cat.note}</p>` : ''}
            </div>
          `
        )}
      </div>
    </section>

    ${ctaBand(site, {
      title: 'Нужен документ, которого здесь нет?',
      text: 'Реквизиты, заверенные копии, сортамент в рабочем виде — вышлем по запросу в WhatsApp или на почту.',
    })}
  `;

  return layout(
    site,
    {
      url: '/dokumentaciya/',
      title: documents.seoTitle,
      description: documents.seoDescription,
      crumbs: crumbList,
    },
    content
  );
}
