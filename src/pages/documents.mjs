/**
 * /dokumentaciya/ (ТЗ §15): полка оригиналов PDF, затем все семь категорий
 * из documents.json по порядку — файлы или честная заглушка. Реквизиты —
 * внутри категории «Реквизиты», «Техническая библиотека STEPPESTEEL» —
 * блок #tehbiblioteka (туда ведёт ссылка с /proektirovshchikam/).
 */

import { layout, html, raw } from '../lib/layout.mjs';
import { pageHero, ctaBand, docRow, specs } from '../lib/components.mjs';
import { documentShelf } from '../lib/experience.mjs';

export function renderDocuments(d) {
  const { site, documents } = d;
  const crumbs = [{ title: 'Главная', url: '/' }, { title: 'Документация', url: '/dokumentaciya/' }];

  const legalRows = [
    { key: 'Юрлицо', val: site.brand.legalName },
    { key: 'БИН', val: site.brand.bin },
    { key: 'Юридический адрес', val: site.brand.legalAddress },
  ];

  const categoryBody = (c) => {
    if (c.id === 'rekvizity') return raw(specs(legalRows));
    if (c.id === 'tehbiblioteka') {
      return html`
        ${c.note ? html`<p class="doc-cat__note">${c.note}</p>` : ''}
        <p class="doc-cat__note">Сортамент ПСУ и ПС доступен на сайте. Паспорт конкретного комплекта выдаётся с поставкой. Узлы, монтажные чертежи и заверенные копии документов запросите у проектного отдела.</p>
        <div class="btn-row">
          <a class="btn btn--primary" href="/profili/">Сортамент профилей</a>
          <a class="btn btn--ghost" href="/proektirovshchikam/">Проектировщикам</a>
        </div>
      `;
    }
    if (c.items?.length) return html`<div class="docs">${c.items.map((doc) => docRow(doc))}</div>`;
    return c.note ? html`<p class="doc-cat__note">${c.note}</p>` : '';
  };

  const content = html`
    ${pageHero({
      label: 'Документация',
      titleHtml: 'Документация',
      text: documents.intro,
      crumbList: crumbs,
    })}
    ${documentShelf(d, { heading: false })}
    <section class="section section--flush-top">
      <div class="container">
        <div class="doc-index">
          ${documents.categories.map((c, i) => html`
            <section class="doc-cat${c.id === 'tehbiblioteka' ? ' doc-cat--wide' : ''}" id="${c.id}" aria-labelledby="doc-cat-${c.id}">
              <p class="doc-cat__num mono">${String(i + 1).padStart(2, '0')}</p>
              <h2 class="doc-cat__title" id="doc-cat-${c.id}">${c.title}</h2>
              ${categoryBody(c)}
            </section>
          `)}
        </div>
      </div>
    </section>
    ${ctaBand(site, { title: 'Нужны документы\nдля вашего проекта?', text: 'Напишите, что требуется: исходные данные, сортамент, заверенный сертификат или карточка предприятия. Запрос передадим профильному специалисту.' })}
  `;
  return layout(site, { url: '/dokumentaciya/', title: documents.seoTitle, description: documents.seoDescription, crumbs }, content);
}
