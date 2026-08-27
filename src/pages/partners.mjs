/**
 * /partnyoram/ — сотрудничество с проектными организациями.
 *
 * Фирменная фича страницы — «Чертёж → металл»: одна и та же геометрия рамы
 * отрисована дважды (линии КМ и стальные профили) и разделена шторкой.
 * Геометрия общая, поэтому половинки совпадают идеально — без ИИ-кадров.
 */

import { layout } from '../lib/layout.mjs';
import { html, raw, e, picture } from '../lib/util.mjs';
import { pageHero, ctaBand, sectionHead, faq, stat, vizTag } from '../lib/components.mjs';

/* --- Геометрия рамы -------------------------------------------------------
   Пролёт 15,0 м и высота до конька 8,5 м — габариты реального объекта из
   комплекта документации. Масштаб: 1 м = 46,67 ед., низ колонн y = 500. */

const M = 46.666;
const y = (m) => 500 - m * M;          // метры → координата
const X0 = 150, X1 = 850;              // оси А и Г (пролёт 15 м)
const Y_BOT = y(7);                    // низ фермы / верх колонны
const Y_TOP = y(7.4);                  // верхний пояс у опоры
const Y_RIDGE = y(8.5);                // конёк

/** Верхний пояс: две наклонные грани к коньку. */
const topAt = (x) => (x <= 500
  ? Y_TOP + ((x - X0) / (500 - X0)) * (Y_RIDGE - Y_TOP)
  : Y_RIDGE + ((x - 500) / (X1 - 500)) * (Y_TOP - Y_RIDGE));

/** Раскосы: симметричный зигзаг с опорой на конёк (узлы зеркальны от оси). */
const ZIG = [X0, 250, 350, 450, 500, 550, 650, 750, X1];
const braces = () => ZIG
  .map((x, i) => `${i ? 'L' : 'M'}${x} ${(i % 2 ? topAt(x) : Y_BOT).toFixed(1)}`)
  .join(' ');

const FRAME = {
  colL: `M${X0} 500 L${X0} ${Y_BOT}`,
  colR: `M${X1} 500 L${X1} ${Y_BOT}`,
  chordBottom: `M${X0} ${Y_BOT} L${X1} ${Y_BOT}`,
  chordTop: `M${X0} ${Y_TOP} L500 ${Y_RIDGE} L${X1} ${Y_TOP}`,
  post: `M500 ${Y_RIDGE} L500 ${Y_BOT}`,
  floor: `M${X0} ${y(3.2).toFixed(1)} L${X1} ${y(3.2).toFixed(1)}`,
  braces: braces(),
};

/** Один слой каркаса: чертёжный (line) или стальной (steel). */
function frameLayer(kind) {
  const cls = (base) => `rama__${kind}-${base}`;
  return html`
    <g class="rama__geom rama__geom--${kind}">
      <path class="${cls('col')}" d="${FRAME.colL}"/>
      <path class="${cls('col')}" d="${FRAME.colR}"/>
      <path class="${cls('chord')}" d="${FRAME.chordBottom}"/>
      <path class="${cls('chord')}" d="${FRAME.chordTop}"/>
      <path class="${cls('web')}" d="${FRAME.post}"/>
      <path class="${cls('floor')}" d="${FRAME.floor}"/>
      <path class="${cls('web')}" d="${FRAME.braces}"/>
      ${[200, 275, 350, 425, 500, 575, 650, 725, 800].map((px) => html`
        <rect class="${cls('purlin')}" x="${px - 5}" y="${(topAt(px) - 9).toFixed(1)}" width="10" height="7"/>
      `)}
    </g>
  `;
}

export function renderPartners(d) {
  const { site, partners } = d;
  const c = site.contacts;
  const wa = (text) => `${c.whatsapp}?text=${encodeURIComponent(text)}`;

  const content = html`
    ${raw(pageHero({
      label: partners.heroLabel,
      titleHtml: raw(partners.heroTitle),
      crumbList: [{ title: 'Главная', url: '/' }, { title: 'Проектным организациям', url: '/partnyoram/' }],
      text: partners.heroText,
    }))}

    <!-- ЛИСТ 01 · «Чертёж → металл»: шторка по общей геометрии -->
    <section class="section section--tight" id="rama">
      <div class="container">
        <div class="rama" data-reveal>
          <div class="rama__stage">
            <svg class="rama__svg" viewBox="0 0 1000 560" role="img"
                 aria-label="Поперечная рама здания: колонны и стропильная ферма, пролёт 15 метров, высота до конька 8,5 метра">
              <defs>
                <marker id="ramarr" markerWidth="9" markerHeight="9" refX="4.5" refY="4.5" orient="auto">
                  <path d="M1 1 L8 4.5 L1 8" fill="none" stroke="#e8781a" stroke-width="1.1"/>
                </marker>
                <linearGradient id="ramasteel" gradientUnits="userSpaceOnUse" x1="0" y1="90" x2="0" y2="520">
                  <stop offset="0" stop-color="#f4f6f7"/>
                  <stop offset="0.45" stop-color="#c3c9ce"/>
                  <stop offset="0.55" stop-color="#8f979e"/>
                  <stop offset="1" stop-color="#d8dde1"/>
                </linearGradient>
                <clipPath id="ramaclip"><rect id="rama-clip-rect" x="500" y="0" width="500" height="560"/></clipPath>
              </defs>

              <!-- левая половина: лист КМ -->
              <g class="rama__side rama__side--sheet">
                <rect x="0" y="0" width="1000" height="560" fill="var(--sheet)"/>
                <g class="rama__grid" aria-hidden="true">
                  ${Array.from({ length: 19 }, (_, i) => html`<line x1="${i * 55}" y1="0" x2="${i * 55}" y2="560"/>`)}
                  ${Array.from({ length: 11 }, (_, i) => html`<line x1="0" y1="${i * 55}" x2="1000" y2="${i * 55}"/>`)}
                </g>
                <line class="rama__ground" x1="60" y1="500" x2="940" y2="500"/>
                ${raw(frameLayer('line'))}
                <g class="rama__dims" aria-hidden="true">
                  <line class="rama__dim" x1="${X0}" y1="530" x2="${X1}" y2="530"
                        marker-start="url(#ramarr)" marker-end="url(#ramarr)"/>
                  <text class="rama__dimtext" x="300" y="524" text-anchor="middle">15 000</text>
                  <line class="rama__dim" x1="96" y1="500" x2="96" y2="${Y_RIDGE}"
                        marker-start="url(#ramarr)" marker-end="url(#ramarr)"/>
                  <text class="rama__dimtext" x="88" y="${(500 + Y_RIDGE) / 2}" text-anchor="middle"
                        transform="rotate(-90 88 ${((500 + Y_RIDGE) / 2).toFixed(0)})">8 500</text>
                  <polyline class="rama__dim" points="500,${Y_RIDGE - 4} 560,${Y_RIDGE - 34} 606,${Y_RIDGE - 34}"/>
                  <text class="rama__dimtext" x="612" y="${Y_RIDGE - 30}">ферма</text>
                  <polyline class="rama__dim" points="${X0 + 6},452 214,424 258,424"/>
                  <text class="rama__dimtext" x="264" y="428">колонна ПСУ</text>

                  ${[[0, '±0,000'], [3.2, '+3,200']].map(([m, label]) => html`
                    <g class="rama__mark">
                      <line class="rama__dim" x1="286" y1="${y(m).toFixed(1)}" x2="392" y2="${y(m).toFixed(1)}"/>
                      <path class="rama__mark-tri" d="M300 ${(y(m) - 9).toFixed(1)} l7 9 l-14 0 z"/>
                      <text class="rama__dimtext" x="312" y="${(y(m) - 8).toFixed(1)}">${label}</text>
                    </g>
                  `)}
                </g>
              </g>

              <!-- правая половина: тот же каркас в металле -->
              <g clip-path="url(#ramaclip)">
                <rect x="0" y="0" width="1000" height="560" fill="var(--steel)"/>
                <line class="rama__ground rama__ground--dark" x1="60" y1="500" x2="940" y2="500"/>
                ${raw(frameLayer('steel'))}
              </g>

              <line class="rama__seam" id="rama-seam" x1="500" y1="0" x2="500" y2="560"/>
            </svg>

            <label class="rama__control">
              <span class="visually-hidden">Шторка «чертёж — металл»: положение в процентах</span>
              <input type="range" id="rama-range" min="0" max="100" value="50" step="1"
                     aria-describedby="rama-hint">
            </label>
            <span class="rama__grip mono" id="rama-grip" aria-hidden="true">◀ ▶</span>
            <span class="rama__tag rama__tag--left mono" aria-hidden="true">Раздел КМ</span>
            <span class="rama__tag rama__tag--right mono" aria-hidden="true">Металл завода</span>
            <div class="prof__stamp rama__stamp" aria-hidden="true">
              <div class="prof__stamp-row">Steppe Steel · с. Троебратское</div>
              <div class="prof__stamp-row prof__stamp-row--split"><span>Рама · поперечный разрез</span><span>М 1:100</span></div>
              <div class="prof__stamp-row">Схема · не для производства</div>
            </div>
          </div>
          <p class="rama__hint sheet-note" id="rama-hint">
            Потяните шторку: слева — линии раздела КМ, справа — те же элементы в металле.
            Габариты на схеме — с реального объекта из комплекта ниже: пролёт 15,0 м, высота до конька 8,5 м.
          </p>
        </div>
      </div>
    </section>


    <!-- Реальный объект: чертёж становится каркасом -->
    <section class="strip" aria-labelledby="pstrip-title">
      <div class="strip__bg">
        ${raw(picture('ig-frame', {
          alt: 'Двухэтажный каркас из оцинкованных профилей ЛСТК на объекте — реальное фото',
          sizes: '100vw',
          className: 'strip__img',
        }))}
      </div>
      <div class="container strip__inner">
        <p class="strip__kicker mono">От разреза — к объекту</p>
        <h2 class="strip__title" id="pstrip-title">Так рама выглядит в металле</h2>
        <ul class="strip__facts mono">
          <li>Рамы и стойки — ПСУ, прогоны и элементы ферм — ПС</li>
          <li>Соединения болтовые, отверстия с производства</li>
          <li>Оцинковка без покраски и антикоррозийного обслуживания</li>
        </ul>
      </div>
      <span class="strip__stamp mono" aria-hidden="true">Фото с объекта · @lstk.factory</span>
    </section>

    <!-- ЛИСТ 02 · Что это даёт проектировщику -->
    <section class="section section--sheet">
      <div class="container">
        ${raw(sectionHead({
          sheet: '02', label: partners.valueKicker,
          title: partners.valueTitle,
          text: partners.valueText,
        }))}
        <div class="grid grid--4">
          ${partners.values.map((v) => stat({ val: v.val, key: v.key }))}
        </div>
      </div>
    </section>

    <!-- ЛИСТ 03 · Объём, который берёт завод -->
    <section class="section noise">
      <div class="container">
        ${raw(sectionHead({
          sheet: '03', label: partners.scopeKicker,
          title: partners.scopeTitle,
          text: partners.scopeText,
        }))}
        <figure class="media media--16x9 pmedia" data-reveal>
          ${raw(picture('desk-eng', {
            alt: 'Образец оцинкованного профиля с ребром жёсткости, штангенциркуль, свёрнутые чертежи и линейка на столе конструктора — визуализация',
            sizes: '(min-width: 1100px) 1100px, 100vw',
          }))}
          ${vizTag()}
          <figcaption class="media-caption mono">Конструкторский отдел завода · расчёт, КМ, КМД</figcaption>
        </figure>
        <div class="grid grid--3">
          ${partners.scope.map((s) => html`
            <div class="scope" data-reveal>
              <p class="scope__num mono">${s.num}</p>
              <h3 class="scope__title">${s.title}</h3>
              <p class="scope__text">${s.text}</p>
            </div>
          `)}
        </div>
      </div>
    </section>

    <!-- ЛИСТ 04 · Форматы: кто что делает -->
    <section class="section section--sheet" id="formaty">
      <div class="container">
        ${raw(sectionHead({
          sheet: '04', label: partners.formatsKicker,
          title: partners.formatsTitle,
          text: partners.formatsText,
        }))}
        <div class="split" data-reveal>
          <div class="split__tabs" role="tablist" aria-label="Форматы сотрудничества">
            ${partners.formats.map((f, i) => html`
              <button type="button" class="split__tab ${i === 0 ? 'is-active' : ''}" role="tab"
                      id="split-tab-${f.key}" aria-controls="split-panel-${f.key}"
                      aria-selected="${i === 0 ? 'true' : 'false'}" data-split-tab="${i}"${i > 0 ? raw(' tabindex="-1"') : ''}>
                ${f.tab}
              </button>
            `)}
          </div>
          ${partners.formats.map((f, i) => html`
            <div class="split__panel ${i === 0 ? 'is-active' : ''}" id="split-panel-${f.key}"
                 role="tabpanel" aria-labelledby="split-tab-${f.key}"${i > 0 ? raw(' hidden') : ''}>
              <h3 class="split__title">${f.title}</h3>
              <p class="split__text">${f.text}</p>
              <div class="split__cols">
                <div class="split__col split__col--you">
                  <p class="split__col-head mono">Ваша организация</p>
                  <ul class="split__list">${f.you.map((x) => html`<li>${x}</li>`)}</ul>
                </div>
                <div class="split__col split__col--us">
                  <p class="split__col-head mono">Steppe Steel</p>
                  <ul class="split__list">${f.us.map((x) => html`<li>${x}</li>`)}</ul>
                </div>
              </div>
            </div>
          `)}
        </div>
      </div>
    </section>

    <!-- Агентский бонус: оранжевая плашка -->
    <section class="duo duo--flat" aria-labelledby="bonus-title">
      <div class="duo__panel">
        <p class="duo__kicker mono">${partners.bonusKicker}</p>
        <h2 class="duo__title" id="bonus-title">${partners.bonusTitle}</h2>
        <p class="duo__text">${partners.bonusText}</p>
        <p class="duo__note mono">${partners.bonusNote}</p>
        <a class="btn btn--dark btn--lg" href="${wa('Здравствуйте! Я проектировщик. Хочу обсудить агентское сотрудничество со Steppe Steel.')}"
           target="_blank" rel="noopener">Обсудить условия</a>
      </div>
      <div class="duo__panel duo__panel--dark">
        <p class="duo__kicker mono">${partners.ethicsKicker}</p>
        <h2 class="duo__title">${partners.ethicsTitle}</h2>
        <ul class="ethics">
          ${partners.ethics.map((x) => html`
            <li class="ethics__item">
              <p class="ethics__title">${x.title}</p>
              <p class="ethics__text">${x.text}</p>
            </li>
          `)}
        </ul>
      </div>
    </section>

    <!-- ЛИСТ 05 · Комплект документации по объекту -->
    <section class="section noise" id="komplekt">
      <div class="container">
        ${raw(sectionHead({
          sheet: '05', label: partners.docsKicker,
          title: partners.docsTitle,
          text: partners.docsText,
        }))}
        <div class="grid grid--3">
          ${partners.docs.map((doc) => html`
            <div class="doc" data-reveal>
              <p class="doc__code mono">${doc.code}</p>
              <p class="doc__vol">${doc.vol}</p>
              <h3 class="doc__title">${doc.title}</h3>
              <p class="doc__text">${doc.text}</p>
            </div>
          `)}
        </div>
        <p class="sheet-note" style="margin-top:1.75rem">${e(partners.docsNote)}</p>

        <div class="dl" data-reveal>
          <p class="dl__head mono">${partners.downloadsTitle}</p>
          <div class="dl__row">
            ${partners.downloads.map((f) => html`
              <a class="dl__item" href="${f.url}" download target="_blank" rel="noopener">
                <span class="dl__icon mono" aria-hidden="true">PDF</span>
                <span class="dl__body">
                  <span class="dl__title">${f.title}</span>
                  <span class="dl__text">${f.text}</span>
                  <span class="dl__meta mono">${f.meta}</span>
                </span>
              </a>
            `)}
          </div>
        </div>
      </div>
    </section>

    <!-- ЛИСТ 06 · Нормативная база -->
    <section class="section section--sheet">
      <div class="container">
        ${raw(sectionHead({
          sheet: '06', label: partners.normsKicker,
          title: partners.normsTitle,
          text: partners.normsText,
        }))}
        <div class="norms">
          ${partners.norms.map((n) => html`
            <div class="norms__item" data-reveal>
              <p class="norms__code mono">${n.code}</p>
              <p class="norms__text">${n.text}</p>
            </div>
          `)}
        </div>
      </div>
    </section>

    <!-- ЛИСТ 07 · Сертификат -->
    <section class="section section--steel-2" id="sertifikat">
      <div class="container">
        ${raw(sectionHead({
          sheet: '07', label: partners.certKicker,
          title: partners.certTitle,
          text: partners.certText,
        }))}
        <div class="cert" data-reveal>
          <div class="cert__doc">
            <p class="cert__label mono">Сертификат соответствия</p>
            <p class="cert__num mono">${partners.cert.number}</p>
            <dl class="cert__rows">
              <div class="cert__row"><dt>Срок действия</dt><dd>${partners.cert.valid}</dd></div>
              <div class="cert__row"><dt>Орган по подтверждению</dt><dd>${partners.cert.org}</dd></div>
              <div class="cert__row"><dt>Стандарт производства</dt><dd class="mono">${partners.cert.standard}</dd></div>
              <div class="cert__row"><dt>Область действия</dt><dd>${partners.cert.items}</dd></div>
              <div class="cert__row"><dt>Изготовитель</dt><dd>${partners.cert.legal}</dd></div>
            </dl>
            <span class="cert__seal mono" aria-hidden="true">Серийное<br>производство</span>
          </div>
          <div class="cert__aside">
            <figure class="media media--3x2" data-reveal>
              ${raw(picture('profile-hands', {
                alt: 'Оцинкованные профили ПСУ и ПС: видны отверстия под болт и ребро жёсткости — визуализация',
                sizes: '(min-width: 900px) 40vw, 100vw',
              }))}
              ${vizTag()}
            </figure>
            <p class="cert__note">${partners.certNote}</p>
            <a class="btn btn--primary" href="/assets/docs/steppe-steel-sertifikat-profili.pdf"
               download target="_blank" rel="noopener">Скачать сертификат (PDF)</a>
            <a class="arrow-link" href="/profili/">Сортамент профилей</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ЛИСТ 08 · Как начать -->
    <section class="section">
      <div class="container">
        ${raw(sectionHead({
          sheet: '08', label: partners.startKicker,
          title: partners.startTitle,
          text: partners.startText,
        }))}
        <div class="grid grid--4">
          ${partners.start.map((s) => html`
            <div class="scope" data-reveal>
              <p class="scope__num mono">${s.num}</p>
              <h3 class="scope__title">${s.title}</h3>
              <p class="scope__text">${s.text}</p>
            </div>
          `)}
        </div>
        <div class="objects">
          <p class="objects__head mono">${partners.objectsKicker}</p>
          <ul class="objects__list">
            ${partners.objects.map((o) => html`<li>${o}</li>`)}
          </ul>
        </div>
      </div>
    </section>

    <!-- ЛИСТ 09 · FAQ -->
    <section class="section section--sheet">
      <div class="container">
        ${raw(sectionHead({
          sheet: '09', label: 'Вопросы партнёров',
          title: 'Что обычно спрашивают проектировщики',
          split: false,
        }))}
        ${raw(faq(partners.faq, { idPrefix: 'pfaq' }))}
      </div>
    </section>

    ${raw(ctaBand(site, {
      title: raw(partners.ctaTitle),
      text: partners.ctaText,
      primary: { title: 'Отправить объект на проработку', url: '/zayavka/' },
      secondary: { title: 'Сортамент профилей', url: '/profili/' },
    }))}
  `;

  return layout(site, {
    url: '/partnyoram/',
    title: partners.seoTitle,
    description: partners.seoDescription,
    image: 'frame-detail',
    crumbs: [{ title: 'Главная', url: '/' }, { title: 'Проектным организациям', url: '/partnyoram/' }],
    schema: [{
      '@type': 'FAQPage',
      '@id': `${site.url}/partnyoram/#faq`,
      mainEntity: partners.faq.map((qa) => ({
        '@type': 'Question',
        name: qa.q,
        acceptedAnswer: { '@type': 'Answer', text: qa.a },
      })),
    }],
  }, content);
}
