/**
 * Журнал: индекс + статьи с TOC-scrollspy, тёмными секциями и перелинковкой.
 */

import { layout } from '../lib/layout.mjs';
import { html, raw, e, picture, inline, dateRu } from '../lib/util.mjs';
import {
  pageHero, sectionHead, ctaBand, stat, articleCard, vizTag, iconArrow,
} from '../lib/components.mjs';
import { articleNode, itemListNode } from '../lib/schema.mjs';

const crumbsBase = [{ title: 'Главная', url: '/' }, { title: 'Журнал', url: '/blog/' }];

export function renderJournalIndex(d) {
  const { site, journal } = d;
  const c = site.contacts;
  const waEng = `${c.whatsapp}?text=${encodeURIComponent(c.whatsappEngineer)}`;

  const content = html`
    ${raw(pageHero({
      label: journal.kicker,
      titleHtml: 'Журнал Steppe Steel',
      crumbList: crumbsBase,
      count: String(journal.items.length).padStart(2, '0'),
      text: raw(e(journal.intro)),
    }))}

    <section class="section section--tight">
      <div class="container">
        <div class="grid grid--2">
          ${journal.items.map((a) => articleCard(a))}
        </div>
      </div>
    </section>

    <section class="section section--sheet">
      <div class="container">
        ${raw(sectionHead({
          label: 'Вопрос инженеру',
          title: 'Не нашли ответа — спросите инженера',
          text: 'Темы статей рождаются из вопросов заказчиков. Напишите, что вы считаете и строите, — инженер завода ответит по делу и подготовит предварительный расчёт за 24 часа.',
        }))}
        <div class="btn-row" data-reveal>
          <a class="btn btn--primary" href="/raschet/">Рассчитать стоимость</a>
          <a class="btn btn--ghost" href="${waEng}" target="_blank" rel="noopener">Задать вопрос в WhatsApp</a>
        </div>
      </div>
    </section>
  `;

  return layout(site, {
    url: '/blog/',
    title: journal.seoTitle,
    description: journal.seoDescription,
    image: 'og-default',
    pageType: 'CollectionPage',
    crumbs: crumbsBase,
    schema: [itemListNode(site, '/blog/', journal.items, 'Журнал Steppe Steel')],
  }, content);
}

/* --- Статья ---------------------------------------------------------------- */

function articleSection(s) {
  const inner = html`
    <div class="container">
      <div class="article-block">
        ${s.kicker ? html`<p class="eyebrow mono">${s.kicker}</p>` : ''}
        <h2 id="${s.id}">${s.title}</h2>
        ${(s.paragraphs || []).map((p) => raw(`<p class="article-p">${inline(p)}</p>`))}
        ${s.list?.length
          ? raw(`<${s.ordered ? 'ol' : 'ul'} class="num-list">${s.list.map((x) => `<li>${inline(x)}</li>`).join('')}</${s.ordered ? 'ol' : 'ul'}>`)
          : ''}
        ${s.stats?.length ? html`
          <div class="grid grid--3 article-stats">
            ${s.stats.map((x) => stat(x))}
          </div>
        ` : ''}
        ${s.table ? html`
          <div class="table-wrap" data-reveal>
            <table class="table">
              <thead>
                <tr>${s.table.head.map((h, i) => html`<th class="${i === s.table.highlight ? 'table__hl' : ''}">${h}</th>`)}</tr>
              </thead>
              <tbody>
                ${s.table.rows.map((row) => html`
                  <tr>${row.map((cell, i) => html`<td class="${i === s.table.highlight ? 'table__hl' : ''}">${cell}</td>`)}</tr>
                `)}
              </tbody>
            </table>
          </div>
        ` : ''}
        ${s.media?.length ? html`
          <div class="gallery gallery--flat article-media">
            ${s.media.map((m) => html`
              <figure class="gallery__item" data-lightbox style="margin:0">
                <div class="media media--3x2">
                  ${raw(picture(m.img, { alt: m.alt, sizes: '(min-width: 900px) 40vw, 100vw' }))}
                  ${m.viz ? vizTag() : ''}
                </div>
                <figcaption class="media-caption">${m.caption}</figcaption>
              </figure>
            `)}
          </div>
        ` : ''}
        ${s.note ? html`<p class="sheet-note" style="margin-top:1.75rem">${s.note}</p>` : ''}
      </div>
    </div>
  `;
  return s.dark
    ? html`<section class="article-section article-section--dark section--steel-2">${inner}</section>`
    : html`<section class="article-section">${inner}</section>`;
}

export function renderArticle(d, a) {
  const { site, journal, solutions } = d;
  const c = site.contacts;
  const waEng = `${c.whatsapp}?text=${encodeURIComponent(c.whatsappEngineer)}`;
  const crumbs = [...crumbsBase, { title: a.title, url: a.url }];

  const idx = journal.items.findIndex((x) => x.slug === a.slug);
  const next = journal.items[(idx + 1) % journal.items.length];

  const SLUG_MAP = { 'angary-sklady': 'angary', 'tseha-zavody': 'proizvodstvennye-zdaniya' };
  const relatedProducts = (a.products || [])
    .map((slug) => solutions.items.find((x) => x.slug === (SLUG_MAP[slug] || slug)))
    .filter(Boolean);

  const content = html`
    <article data-article>
      ${raw(pageHero({
        label: `Журнал · Статья ${a.index} · ${dateRu(a.date)} · ${a.readingTime} мин`,
        titleHtml: e(a.title),
        crumbList: crumbs,
        text: raw(e(a.lead)),
        small: true,
      }))}

      <div class="container">
        <div class="article-layout">
          <nav class="toc" data-toc aria-label="Содержание статьи">
            <p class="toc__title">Содержание</p>
            <ul class="toc__list">
              ${a.sections.map((s) => html`
                <li><a class="toc__link" href="#${s.id}">${s.title}</a></li>
              `)}
            </ul>
          </nav>
          <div class="article-body">
            ${a.sections.map((s) => articleSection(s))}
          </div>
        </div>
      </div>
    </article>

    ${relatedProducts.length ? html`
      <section class="section section--sheet">
        <div class="container">
          ${raw(sectionHead({
            label: 'Вам может пригодиться',
            title: 'Продукция по теме статьи',
            action: { title: 'Все решения', url: '/resheniya/' },
          }))}
          <div class="grid grid--2">
            ${relatedProducts.map((p) => html`
              <a class="pager__link" href="${p.url}" data-reveal>
                <span class="mono text-muted">Решение</span>
                <span class="pager__title">${p.title}</span>
                <span class="text-muted text-small">${p.summary}</span>
              </a>
            `)}
          </div>
        </div>
      </section>
    ` : ''}

    ${raw(ctaBand(site, { title: raw(e(a.ctaTitle)), text: a.ctaText }))}

    ${next ? html`
      <a class="next-project" href="${next.url}" data-cursor="Читать">
        ${next.cover ? html`<div class="next-project__bg">${raw(picture(next.cover, { alt: '', sizes: '100vw' }))}${next.coverViz ? vizTag() : ''}</div>` : ''}
        <div class="next-project__inner container">
          <span class="eyebrow mono next-project__label">Следующая статья · ${next.index}</span>
          <p class="next-project__title">${next.title}</p>
        </div>
      </a>
    ` : ''}
  `;

  return layout(site, {
    url: a.url,
    title: a.seoTitle,
    description: a.seoDescription,
    image: a.cover || undefined,
    ogType: 'article',
    pageType: 'ItemPage',
    datePublished: a.date,
    dateModified: a.updated || a.date,
    crumbs,
    next: { title: 'Все статьи журнала', url: '/blog/' },
    schema: [articleNode(site, a)],
  }, content);
}
