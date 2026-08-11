/**
 * Профили Sigma / C / П — «живой лист КМД».
 * profilesBoard() переиспользуется на главной; страница /profili/ —
 * полная версия с SEO-контентом.
 */

import { layout } from '../lib/layout.mjs';
import { html, raw, e } from '../lib/util.mjs';
import { pageHero, ctaBand, sectionHead, serviceRow, stat } from '../lib/components.mjs';
import { profilesListNode } from '../lib/schema.mjs';

/** Интерактивная доска: табы + SVG-сечение + карточки + ползунок толщины. */
export function profilesBoard(profiles) {
  const t = profiles.thickness;
  return html`
    <div class="prof">
      <div>
        <div class="prof__tabs" role="tablist" aria-label="Выбор профиля">
          ${profiles.items.map((p, i) => html`
            <button class="prof__tab ${i === 0 ? 'is-active' : ''}" role="tab"
                    aria-selected="${i === 0 ? 'true' : 'false'}" data-prof="${p.key}"
                    id="prof-tab-${p.key}" aria-controls="prof-panel-${p.key}">
              ${p.mark} ${p.tab}
            </button>
          `)}
        </div>
        <div class="prof__board" data-prof="sigma" data-reveal>
          <svg viewBox="0 0 560 440" fill="none" aria-hidden="true">
            <defs>
              <marker id="dimarr" markerWidth="9" markerHeight="9" refX="4.5" refY="4.5" orient="auto">
                <path d="M1 1 L8 4.5 L1 8" fill="none" stroke="#e8781a" stroke-width="1.1"/>
              </marker>
            </defs>
            <path id="prof-contour" class="prof-contour"
                  d="M300 132 L300 100 L180 100 L180 188 L212 204 L212 236 L180 252 L180 340 L300 340 L300 308"
                  stroke-linecap="round" stroke-linejoin="round"/>
            <line class="prof-dim" x1="142" y1="100" x2="142" y2="340" marker-start="url(#dimarr)" marker-end="url(#dimarr)"/>
            <text x="120" y="226" class="dimtext" text-anchor="middle" transform="rotate(-90 120 226)">H</text>
            <line class="prof-dim" x1="180" y1="66" x2="300" y2="66" marker-start="url(#dimarr)" marker-end="url(#dimarr)"/>
            <text x="240" y="54" class="dimtext" text-anchor="middle">B</text>
            <polyline class="prof-dim" points="304,116 348,72 366,72"/>
            <text x="372" y="76" class="dimtext" id="prof-tlabel">t 3,5</text>
            <g class="prof-dim--rib">
              <polyline class="prof-dim" points="216,220 268,220 282,206"/>
              <text x="288" y="202" class="dimtext">ребро</text>
            </g>
          </svg>
          <div class="prof__stamp" aria-hidden="true">
            <div class="prof__stamp-row">${e(profiles.stampLines[0])}</div>
            <div class="prof__stamp-row">${e(profiles.stampLines[1])}</div>
            <div class="prof__stamp-row prof__stamp-row--split">
              <span>МАРКА: <b id="prof-mark">Σ</b></span><span id="prof-tstamp">t 3,5</span>
            </div>
            <div class="prof__stamp-row">${e(profiles.stampLines[2])}</div>
          </div>
        </div>
      </div>
      <div>
        ${raw(profilesCards(profiles))}
        <div class="prof__thickness">
          <p class="field__label" style="margin:0">Толщина стенки, мм</p>
          <div class="prof__seg" role="group" aria-label="Толщина стенки">
            ${t.values.map((v) => html`
              <button type="button" class="prof__seg-btn ${v === t.default ? 'is-active' : ''}" data-t="${v}"
                      aria-pressed="${v === t.default ? 'true' : 'false'}">
                ${v.replace('.', ',')}
              </button>
            `)}
          </div>
          <div class="prof__bar-track" aria-hidden="true"><div class="prof__bar" id="prof-bar"></div></div>
          <p class="agro-calc__note" style="color:var(--ink-muted)">${e(profiles.disclaimer)}</p>
        </div>
      </div>
    </div>
  `;
}

export function profilesCards(profiles) {
  return html`
    ${profiles.items.map((p, i) => html`
      <div class="prof__card ${i === 0 ? 'is-active' : ''}" data-prof="${p.key}" role="tabpanel"
           id="prof-panel-${p.key}" aria-labelledby="prof-tab-${p.key}"
        <h3>${p.name}</h3>
        <p>${p.purpose}</p>
        <div class="specs">
          <div class="specs__row"><span class="specs__key">Где работает</span><span>${p.where}</span></div>
          <div class="specs__row"><span class="specs__key">Ключевая роль</span><span>${p.role}</span></div>
        </div>
      </div>
    `)}
  `;
}

export function renderProfili(d) {
  const { site, profiles, products } = d;

  const content = html`
    ${raw(pageHero({
      label: 'Собственная линия профилирования',
      titleHtml: 'Профили Sigma&nbsp;/ C&nbsp;/ П',
      crumbList: [{ title: 'Главная', url: '/' }, { title: 'Профили', url: '/profili/' }],
      text: raw(e(profiles.intro)),
    }))}

    <section class="section section--sheet section--tight">
      <div class="container">
        ${raw(profilesBoard(profiles))}
        <p class="sheet-note" style="margin-top:1.75rem">${e(profiles.footline)}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${raw(sectionHead({
          label: 'Что это даёт зданию',
          title: 'Один профиль — по назначению, а не «с запасом»',
          text: 'Сечения подбираются расчётом под нагрузку каждого элемента. Так каркас становится легче, фундамент — дешевле, а цена комплекта — честной.',
        }))}
        <div class="grid grid--4">
          ${[
            ['Sigma', 'Профиль повышенной жёсткости — там, где элемент работает на изгиб'],
            ['C', 'Несущий профиль — стойки, прогоны и основные элементы каркаса'],
            ['П', 'Направляющие и усиления — там, где несущая способность не нужна'],
            ['3,5 мм', 'Максимальная толщина — применяется под расчётную нагрузку, а не везде подряд'],
          ].map(([v, k]) => stat({ val: v, key: k }))}
        </div>
      </div>
    </section>

    <section class="section section--steel-2">
      <div class="container">
        ${raw(sectionHead({
          label: 'Куда идут профили',
          title: 'Из этих профилей собраны все наши здания',
          action: { title: 'Каталог зданий', url: '/katalog/' },
        }))}
        <div>
          ${products.items.map((p, i) => serviceRow({ url: p.url, slug: p.slug, title: p.title, summary: p.summary }, i))}
        </div>
      </div>
    </section>

    ${raw(ctaBand(site, {
      title: 'Подобрать профиль<br>под ваш проект',
      text: 'Опишите здание и нагрузки — инженер подберёт сечения и толщину, посчитает металлоёмкость и пришлёт КП за 24 часа.',
    }))}
  `;

  return layout(site, {
    url: '/profili/',
    title: profiles.seoTitle,
    description: profiles.seoDescription,
    image: 'frame-detail',
    crumbs: [{ title: 'Главная', url: '/' }, { title: 'Профили', url: '/profili/' }],
    schema: [profilesListNode(site, profiles)],
  }, content);
}
