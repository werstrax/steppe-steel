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
              ${p.tab}
            </button>
          `)}
        </div>
        <div class="prof__board" data-prof="sigma" data-reveal>
          <!-- Кадр подогнан под геометрию сечения: выноски B/H убраны (типоразмеры
               разные, конструктор просил их не показывать), поэтому лист обрезан
               плотнее — иначе сечение висело бы в левом углу. -->
          <svg viewBox="150 56 360 300" fill="none" aria-hidden="true">
            <path id="prof-contour" class="prof-contour"
                  d="${profiles.items[0].path}"
                  stroke-linecap="round" stroke-linejoin="round"/>
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
              <span>МАРКА: <b id="prof-mark">${e(profiles.items[0].code)}</b></span><span id="prof-tstamp">t 3,5</span>
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
           id="prof-panel-${p.key}" aria-labelledby="prof-tab-${p.key}">
        <h3>${p.name}</h3>
        <p>${p.purpose}</p>
        <div class="specs">
          <div class="specs__row"><span class="specs__key">Где работает</span><span>${p.where}</span></div>
          <div class="specs__row"><span class="specs__key">Ключевая роль</span><span>${p.role}</span></div>
          ${p.heights ? html`<div class="specs__row"><span class="specs__key">Высота сечения</span><span>${p.heights}</span></div>` : ''}
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
      titleHtml: 'Профили ПСУ&nbsp;и ПС',
      crumbList: [{ title: 'Главная', url: '/' }, { title: 'Профили', url: '/profili/' }],
      text: raw(e(profiles.intro)),
    }))}

    <section class="section section--sheet section--tight">
      <div class="container">
        ${raw(profilesBoard(profiles))}
        <p class="sheet-note" style="margin-top:1.75rem">${e(profiles.footline)}</p>
      </div>
    </section>

    <section class="section section--sheet">
      <div class="container">
        ${raw(sectionHead({
          label: 'Обозначения завода',
          title: raw(e(profiles.glossaryTitle)),
          text: profiles.glossaryIntro,
        }))}
        <div class="grid grid--2">
          ${profiles.glossary.map((g) => html`
            <div class="term" data-reveal>
              <p class="term__code mono">${g.code}</p>
              <h3 class="term__full">${g.full}</h3>
              <p class="term__text">${g.text}</p>
            </div>
          `)}
        </div>
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
            ['ПСУ', 'С-образный усиленный — там, где элемент работает на изгиб: рамы, стойки, колонны'],
            ['ПС', 'С-образный несущий — прогоны кровли и стен, пояса и элементы ферм'],
            ['150–280', 'Высота сечения, мм — типоразмер подбирается расчётом под нагрузку'],
            ['3,5 мм', 'Максимальная толщина стенки — применяется под расчёт, а не везде подряд'],
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
