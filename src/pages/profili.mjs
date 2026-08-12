/**
 * Профили Sigma / C / П — «живой лист КМД».
 * profilesBoard() переиспользуется на главной; страница /profili/ —
 * полная версия с SEO-контентом.
 */

import { layout } from '../lib/layout.mjs';
import { html, raw, e, picture } from '../lib/util.mjs';
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
          <!-- Обозначения — как в заводских таблицах А1/А2: H, B, h₁, h₂, b₁, t.
               Конкретные числа не подписываем: типоразмеров девять, они идут
               таблицей сортамента ниже. -->
          <svg viewBox="120 40 400 330" fill="none" aria-hidden="true">
            <defs>
              <marker id="dimarr" markerWidth="9" markerHeight="9" refX="4.5" refY="4.5" orient="auto">
                <path d="M1 1 L8 4.5 L1 8" fill="none" stroke="#e8781a" stroke-width="1.1"/>
              </marker>
            </defs>
            <path id="prof-contour" class="prof-contour"
                  d="${profiles.items[0].path}"
                  stroke-linecap="round" stroke-linejoin="round"/>

            <line class="prof-dim" x1="156" y1="100" x2="156" y2="340" marker-start="url(#dimarr)" marker-end="url(#dimarr)"/>
            <text x="142" y="220" class="dimtext" text-anchor="middle" transform="rotate(-90 142 220)">H</text>

            <line class="prof-dim" x1="180" y1="78" x2="300" y2="78" marker-start="url(#dimarr)" marker-end="url(#dimarr)"/>
            <text x="240" y="66" class="dimtext" text-anchor="middle">B</text>

            <polyline class="prof-dim" points="304,116 348,74 368,74"/>
            <text x="374" y="78" class="dimtext" id="prof-tlabel">t 3,5</text>

            <polyline class="prof-dim" points="306,344 340,356 358,356"/>
            <text x="364" y="360" class="dimtext">h₁</text>

            <g class="prof-dim--rib">
              <line class="prof-dim" x1="228" y1="204" x2="228" y2="236" marker-start="url(#dimarr)" marker-end="url(#dimarr)"/>
              <text x="240" y="226" class="dimtext">h₂</text>
              <polyline class="prof-dim" points="212,192 268,180 286,180"/>
              <text x="292" y="184" class="dimtext">b₁</text>
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

    <section class="section">
      <div class="container">
        ${raw(sectionHead({
          label: profiles.sortamentKicker,
          title: raw(e(profiles.sortamentTitle)),
          text: profiles.sortamentIntro,
        }))}
        ${profiles.sortament.map((t) => html`
          <div class="sortament" data-reveal>
            <p class="sortament__caption mono">${t.caption}</p>
            <div class="table-wrap">
              <table class="table table--sortament">
                <caption class="visually-hidden">${t.caption}</caption>
                <thead>
                  <tr>${t.cols.map((c, i) => html`<th scope="col" ${raw(i === 0 ? '' : 'class="table__num"')}>${raw(c)}</th>`)}</tr>
                </thead>
                <tbody>
                  ${t.rows.map((r) => html`
                    <tr>
                      <th scope="row" class="sortament__code mono">${r[0]}</th>
                      ${r.slice(1).map((v) => html`<td class="table__num">${v}</td>`)}
                    </tr>
                  `)}
                </tbody>
              </table>
            </div>
          </div>
        `)}
        <p class="sheet-note" style="margin-top:1.5rem">${e(profiles.sortamentNote)}</p>
      </div>
    </section>

    <section class="strip" aria-labelledby="strip-title">
      <div class="strip__bg">
        ${raw(picture('profile-hands', {
          alt: 'Оцинкованные профили ПСУ и ПС в руках рабочего: видны отверстия и ребро жёсткости — визуализация',
          sizes: '100vw',
          className: 'strip__img',
        }))}
      </div>
      <div class="container strip__inner">
        <p class="strip__kicker mono">Наш металл</p>
        <h2 class="strip__title" id="strip-title">Одна линия — одинаковая геометрия на всей партии</h2>
        <ul class="strip__facts mono">
          <li>Толщина стенки 1,5–3,5 мм</li>
          <li>Высота сечения 100–280 мм</li>
          <li>Отверстия — с производства, под болт</li>
        </ul>
      </div>
      <span class="strip__stamp mono" aria-hidden="true">Кадр-визуализация</span>
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
            ['9', 'Типоразмеров в сортаменте: ПСУ150–280 и ПС100–280'],
            ['1,5–3,5', 'Толщина стенки, мм — по сортаменту, под расчётную нагрузку'],
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
