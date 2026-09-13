/**
 * /obekty/ (ТЗ §11): реализованные объекты с фильтром по категориям.
 * Только реальные объекты завода; раздел наполняется данными заказчика.
 */

import { layout, html, raw } from '../lib/layout.mjs';
import { pageHero, portfolioCard, ctaBand, iconInstagram, specs } from '../lib/components.mjs';
import { itemListNode } from '../lib/schema.mjs';
import { e } from '../lib/util.mjs';

/* --- План объекта без фото ------------------------------------------------
 * Рисуется только из данных карточки: габариты «A × B м» и отметка конька
 * «в коньке N м» из поля size. Нет чисел в данных — нет и чертежа. */

const toM = (s) => Number(String(s).replace(',', '.'));
const r1 = (n) => Math.round(n * 10) / 10;
const mm = (m) => String(Math.round(m * 1000)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const level = (m) => `+${m.toFixed(3).replace('.', ',')}`;

export function casePlan(o) {
  const size = /(\d+(?:[.,]\d+)?)\s*×\s*(\d+(?:[.,]\d+)?)\s*м/.exec(o?.size || '');
  if (!size) return '';
  const a = toM(size[1]);
  const b = toM(size[2]);
  if (!(a > 0 && b > 0)) return '';
  const L = Math.max(a, b);
  const W = Math.min(a, b);
  const ridgeMatch = /коньк\S*\s+(\d+(?:[.,]\d+)?)\s*м/i.exec(o.size);
  const ridge = ridgeMatch ? toM(ridgeMatch[1]) : null;

  const k = Math.min(266 / L, 120 / W);
  const pw = r1(L * k);
  const ph = r1(W * k);
  const x0 = 40;
  const y0 = 16;
  const x1 = r1(x0 + pw);
  const y1 = r1(y0 + ph);
  const dy = r1(y1 + 26); // размерная линия длины
  const dx = 20; // размерная линия ширины
  const h = Math.ceil(dy + 12);
  const cx = r1(x0 + pw / 2);
  const cy = r1(y0 + ph / 2);
  const tick = (x, y) => `<line x1="${r1(x - 3)}" y1="${r1(y + 3)}" x2="${r1(x + 3)}" y2="${r1(y - 3)}"/>`;
  const lenTxt = mm(L);
  const widTxt = mm(W);

  let mark = '';
  if (ridge) {
    // Ось конька идёт по всей длине здания, выноска отметки стоит на этой оси:
    // без оси стрелка висела в пустоте (разбор 13.09).
    const ax = r1(cx - 26);
    mark = `<g class="case-plan__mark">
        <line class="case-plan__ridge" x1="${x0}" y1="${cy}" x2="${x1}" y2="${cy}"/>
        <path d="M${r1(ax - 5)} ${r1(cy - 8)}H${r1(ax + 5)}L${ax} ${cy}Z"/>
        <line x1="${ax}" y1="${r1(cy - 8)}" x2="${r1(ax + 56)}" y2="${r1(cy - 8)}"/>
        <text x="${r1(ax + 3)}" y="${r1(cy - 12)}">${level(ridge)}</text>
        <text class="case-plan__note" x="${r1(ax + 9)}" y="${r1(cy + 12)}">ось конька</text>
      </g>`;
  }

  const label = `План здания ${lenTxt} × ${widTxt} мм${ridge ? `, отметка конька ${level(ridge)}` : ''}`;
  return raw(`<figure class="case-plan">
    <svg viewBox="0 0 320 ${h}" fill="none" role="img" aria-label="${e(label)}">
      <rect class="case-plan__outline" x="${x0}" y="${y0}" width="${pw}" height="${ph}"/>
      <g class="case-plan__dim">
        <line x1="${x0}" y1="${r1(y1 + 4)}" x2="${x0}" y2="${r1(dy + 5)}"/>
        <line x1="${x1}" y1="${r1(y1 + 4)}" x2="${x1}" y2="${r1(dy + 5)}"/>
        <line x1="${x0 - 5}" y1="${dy}" x2="${r1(x1 + 5)}" y2="${dy}"/>
        ${tick(x0, dy)}${tick(x1, dy)}
        <line x1="${x0 - 4}" y1="${y0}" x2="${dx - 5}" y2="${y0}"/>
        <line x1="${x0 - 4}" y1="${y1}" x2="${dx - 5}" y2="${y1}"/>
        <line x1="${dx}" y1="${y0 - 5}" x2="${dx}" y2="${r1(y1 + 5)}"/>
        ${tick(dx, y0)}${tick(dx, y1)}
      </g>
      <text class="case-plan__txt" x="${cx}" y="${r1(dy - 5)}" text-anchor="middle">${e(lenTxt)}</text>
      <text class="case-plan__txt" x="${dx - 5}" y="${cy}" text-anchor="middle" transform="rotate(-90 ${dx - 5} ${cy})">${e(widTxt)}</text>
      ${mark}
    </svg>
    <figcaption class="mono">${ridge ? 'Габариты в плане — мм, отметка конька — м' : 'Габариты в плане — мм'}</figcaption>
  </figure>`);
}

/* Состав документации из поля docs: «эскизный проект — 8 листов · РПЗ — 269 страниц · …».
 * Если хоть одна часть не разбирается — возвращаем пусто, и выводится исходная строка. */
export function caseDocs(o) {
  const parts = String(o?.docs || '').split(/\s*·\s*/).filter(Boolean);
  const items = parts.map((p) => /^(.+?)\s*—\s*(\d[\d\s]*)\s+(\S.*)$/.exec(p)).filter(Boolean);
  if (!items.length || items.length !== parts.length) return '';
  return html`<ul class="case-docs" aria-label="Документация проекта">
    ${items.map(([, name, n, unit]) => html`<li><span class="case-docs__num">${n.trim()}</span><span class="case-docs__unit mono">${unit}</span><span class="case-docs__label">${name.charAt(0).toUpperCase() + name.slice(1)}</span></li>`)}
  </ul>`;
}

/* Карточка объекта без фото: вместо плашки — план и состав документации.
 * Поля и порядок строк — как в portfolioCard (components.mjs). */
function planCard(o, plan, docs) {
  const rows = [
    o.purpose && { key: 'Назначение', val: o.purpose },
    o.region && { key: 'Регион', val: o.region },
    o.size && { key: 'Размеры', val: o.size },
    o.area && { key: 'Площадь', val: o.area },
    o.steelWeight && { key: 'Вес МК', val: o.steelWeight },
    o.frameType && { key: 'Тип конструкции', val: o.frameType },
    o.prodTerm && { key: 'Срок производства', val: o.prodTerm },
    !docs && o.docs && { key: 'Документация', val: o.docs },
  ].filter(Boolean);
  return html`
    <article class="obj-card obj-card--plan" data-category="${o.category}" data-reveal>
      <div class="obj-card__media obj-card__media--plan">${plan}${docs}</div>
      <div class="obj-card__body">
        <p class="obj-card__top mono">
          ${o.badge ? html`<span class="obj-card__badge">${o.badge}</span>` : ''}
          ${o.year ? html`<span>${o.year}</span>` : ''}
        </p>
        <h3 class="obj-card__title">${o.title}</h3>
        ${raw(specs(rows))}
        ${o.text ? html`<p class="obj-card__text">${o.text}</p>` : ''}
      </div>
    </article>
  `;
}

function objectCard(o) {
  if (o.photos?.length) return portfolioCard(o);
  const plan = casePlan(o);
  return plan ? planCard(o, plan, caseDocs(o)) : portfolioCard(o);
}

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

        <div class="obj-grid${portfolio.items.length === 1 ? ' obj-grid--single' : ''}" data-filter-list>
          ${portfolio.items.map((o) => objectCard(o))}
        </div>
        ${portfolio.items.length >= 4 ? html`<p class="filter__empty note" data-filter-empty hidden>По этому фильтру объектов пока нет.</p>` : ''}

        <div class="empty-note" data-reveal>
          <h2 class="h4">${portfolio.empty.title}</h2>
          <p>${portfolio.empty.text}</p>
          <a class="btn btn--outline" href="${site.contacts.instagram}" target="_blank" rel="noopener">
            ${iconInstagram}<span>Instagram ${site.contacts.instagramHandle}</span>
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
          ? itemListNode(site, '/obekty/', portfolio.items.map((o) => ({ url: '/obekty/', title: o.title.replace(/ /g, ' ') })), 'Объекты Steppe Steel')
          : null,
      ].filter(Boolean),
    },
    content
  );
}
