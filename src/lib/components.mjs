/**
 * Переиспользуемые куски разметки Steppe Steel (v4 «Белый завод»).
 * Каждая функция возвращает строку HTML (обёртку raw/html из util).
 */

import { html, raw, e, cx, picture, hasImage, dateRu, num, plural } from './util.mjs';

/* --- Логотип ------------------------------------------------------------ */

/**
 * Текстовый знак Steppe Steel: написание бренда — из ТЗ от 30.08.2026.
 * Файл нового логотипа заказчик не передал — как передаст, заменить
 * разметку на <img> (см. CONTENT-TODO).
 */
// Вордмарк повторяет фирменный знак (файл от заказчика, 30.08.2026):
// STEPPE вразрядку над крупным STEEL, оранжевая линия, INDUSTRIAL STANDARD.
// Оба слова одним цветом — в знаке они белые, оранжевая только линия.
export const logo = (site, { href = '/', footer = false } = {}) => html`
  <a href="${href}" class="${cx('logo', footer && 'logo--footer')}" aria-label="STEPPESTEEL — на главную">
    <span class="logo__steppe">STEPPE</span>
    <span class="logo__steel">STEEL</span>
    <span class="logo__tag">Industrial Standard</span>
  </a>
`;

/* --- Иконки ------------------------------------------------------------- */

export const iconArrow = raw(
  `<svg class="arrow" width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true"><path d="M9 1l4 4-4 4M13 5H0" stroke="currentColor" stroke-width="1.2"/></svg>`
);

export const iconDownload = raw(
  `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1v8m0 0L4 6m3 3l3-3M1.5 12.5h11" stroke="currentColor" stroke-width="1.2"/></svg>`
);

export const iconPhone = raw(
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`
);

export const iconWhatsApp = raw(
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.17 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z"/></svg>`
);

export const iconInstagram = raw(
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.98c-3.14 0-3.51.01-4.75.07-1.15.05-1.77.24-2.18.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.18-.06 1.24-.07 1.61-.07 4.75s.01 3.51.07 4.75c.05 1.15.24 1.77.4 2.18.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.18.4 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c1.15-.05 1.77-.24 2.18-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.18.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.05-1.15-.24-1.77-.4-2.18a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.18-.4-1.24-.06-1.61-.07-4.75-.07Zm0 3.37a4.49 4.49 0 1 1 0 8.98 4.49 4.49 0 0 1 0-8.98Zm0 7.4a2.91 2.91 0 1 0 0-5.82 2.91 2.91 0 0 0 0 5.82Zm5.72-7.6a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0Z"/></svg>`
);

/* --- Чертёж рамы на hero -------------------------------------------------- */

/**
 * Технический эскиз поперечной рамы (колонны + стропильная ферма) с размерной
 * линией пролёта. Настоящая инженерная графика, не декорация: пролёт до 24 м —
 * проверенный факт из ПЗ. Рисуется в line-art, оживает лёгким прочерчиванием.
 */
export function heroFrame() {
  const dim = (x1, x2, y, label) =>
    `<g class="hf-dim"><line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" marker-start="url(#hf-arr)" marker-end="url(#hf-arr)"/><text x="${(x1 + x2) / 2}" y="${y - 7}" text-anchor="middle">${label}</text></g>`;
  // геометрия: земля y=300, колонны x=60/420, карниз y=150, конёк y=100
  const web = [];
  for (let i = 0; i < 6; i++) {
    const x1 = 60 + i * 60, x2 = x1 + 30, x3 = x1 + 60;
    const yTop = (x) => (x <= 240 ? 150 - (x - 60) * 50 / 180 : 100 + (x - 240) * 50 / 180);
    web.push(`<line x1="${x1}" y1="170" x2="${x2}" y2="${yTop(x2)}"/>`);
    web.push(`<line x1="${x2}" y1="${yTop(x2)}" x2="${x3}" y2="170"/>`);
    web.push(`<line x1="${x2}" y1="${yTop(x2)}" x2="${x2}" y2="170"/>`);
  }
  return raw(`
  <svg class="hero-frame" viewBox="0 0 480 330" fill="none" role="img"
       aria-label="Чертёж поперечной рамы здания: колонны, стропильная ферма, пролёт до 24 метров без внутренних колонн">
    <defs>
      <marker id="hf-arr" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
        <path d="M1.5 1.5 L8.5 5 L1.5 8.5" fill="none" stroke="var(--accent)" stroke-width="1.1"/>
      </marker>
    </defs>
    <g class="hf-grid">${Array.from({ length: 10 }, (_, i) => `<line x1="${30 + i * 47}" y1="20" x2="${30 + i * 47}" y2="310"/>`).join('')}
    ${Array.from({ length: 7 }, (_, i) => `<line x1="20" y1="${40 + i * 45}" x2="460" y2="${40 + i * 45}"/>`).join('')}</g>
    <g class="hf-ground"><line x1="30" y1="300" x2="450" y2="300"/>
      ${Array.from({ length: 21 }, (_, i) => `<line x1="${36 + i * 20}" y1="300" x2="${28 + i * 20}" y2="308"/>`).join('')}</g>
    <g class="hf-main">
      <line x1="60" y1="300" x2="60" y2="150"/><line x1="66" y1="300" x2="66" y2="152"/>
      <line x1="420" y1="300" x2="420" y2="150"/><line x1="414" y1="300" x2="414" y2="152"/>
      <line x1="60" y1="150" x2="240" y2="100"/><line x1="240" y1="100" x2="420" y2="150"/>
      <line x1="60" y1="170" x2="240" y2="120"/><line x1="240" y1="120" x2="420" y2="170"/>
      <line x1="60" y1="170" x2="240" y2="170"/><line x1="240" y1="170" x2="420" y2="170"/>
    </g>
    <g class="hf-web">${web.join('')}</g>
    <g class="hf-base">
      <rect x="48" y="298" width="36" height="5"/><rect x="396" y="298" width="36" height="5"/>
    </g>
    ${dim(60, 420, 62, 'ПРОЛЁТ ДО 24 000')}
    <g class="hf-mark"><circle cx="240" cy="100" r="3.2"/><text x="252" y="92">конёк</text></g>
    <text class="hf-note" x="30" y="326">РАМА ПОПЕРЕЧНАЯ · ЛСТК + ЛМК · БОЛТОВАЯ СБОРКА</text>
  </svg>`);
}

/* --- Иконка-галочка для чек-листов ------------------------------------------ */

export const iconCheck = raw(
  `<svg class="check" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.3"/><path d="M5.5 9.2l2.3 2.3 4.7-4.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
);

/* --- Иконки показателей (тонкая линия, как чертёж в hero) -------------------- */

const ICON = (body) =>
  raw(`<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`);

export const statIcons = {
  span: ICON('<path d="M4 22V12l12-6 12 6v10"/><path d="M4 22h24"/><path d="M7 26h18M7 26l2-2m-2 2l2 2m16-2l-2-2m2 2l-2 2"/>'),
  steel: ICON('<path d="M5 9h22v5H5zM5 14v9h22v-9"/><path d="M10 14v9m6-9v9m6-9v9"/>'),
  cert: ICON('<rect x="6" y="4" width="20" height="24" rx="1.5"/><path d="M10 10h12M10 15h12M10 20h7"/><circle cx="21" cy="22" r="3"/><path d="M19.5 24.5L18 28l3-1 3 1-1.5-3.5"/>'),
  clock: ICON('<circle cx="16" cy="17" r="10"/><path d="M16 11v6l4 3"/><path d="M12 4h8"/>'),
};

/* --- Бейджи медиа --------------------------------------------------------- */

/** Честная пометка на визуализациях — политика фактов сайта. */
export const vizTag = (label = 'Визуализация') =>
  raw(`<span class="viz-tag">${e(label)}</span>`);

export const photoTag = (label = 'Фото с объекта') =>
  raw(`<span class="viz-tag viz-tag--photo">${e(label)}</span>`);

/** Слот под реальное фото: пока кадра нет в манифесте — нейтральная плашка. */
export function photoSlot(name, { alt = '', label = 'Фото в обработке', sizes = '(min-width: 900px) 50vw, 100vw', className = '' } = {}) {
  // Слот оформлен как лист чертежа: миллиметровка, уголки кадра и штамп
  // с именем файла — клиент сразу видит, какой снимок куда ляжет.
  return raw(
    `<span class="${cx('photo-slot', className)}" role="img" aria-label="${e(alt || label)}">` +
      `<span class="photo-slot__center"><span class="photo-slot__label mono">${e(label)}</span></span>` +
      `<span class="photo-slot__stamp mono" aria-hidden="true">лист · фото<b>${e(name)}.jpg</b></span>` +
      `</span>`
  );
}

/* --- Шапка -------------------------------------------------------------- */

export function header(site, { current = '' } = {}) {
  const c = site.contacts;
  const isCurrent = (url) => current === url || (url !== '/' && current.startsWith(url));

  const navItems = site.nav
    .map((item) => {
      if (item.children?.length) {
        const open = item.children.some((ch) => isCurrent(ch.url));
        return html`
          <div class="${cx('nav__item', 'nav__item--sub')}" data-sub>
            ${item.url
              ? html`<a class="nav__link" href="${item.url}" ${raw(open ? 'aria-current="page"' : '')}>${item.title}</a>`
              : html`<span class="${cx('nav__link', 'nav__link--label', open && 'is-open-section')}">${item.title}</span>`}
            <button class="nav__toggle" type="button" aria-expanded="false" aria-label="Открыть раздел «${item.title}»">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.4"/></svg>
            </button>
            <div class="nav__sub">
              ${item.children.map((ch) => html`<a class="nav__sublink" href="${ch.url}" ${raw(isCurrent(ch.url) ? 'aria-current="page"' : '')}>${ch.title}</a>`)}
            </div>
          </div>
        `;
      }
      return html`
        <div class="nav__item">
          <a class="nav__link" href="${item.url}" ${raw(isCurrent(item.url) ? 'aria-current="page"' : '')}>
            ${item.title}
          </a>
        </div>
      `;
    })
    .join('');

  return html`
    <div class="topbar">
      <div class="container topbar__inner">
        <span class="topbar__note mono">Завод строительных металлоконструкций · с. Троебратское, Костанайская область</span>
        <span class="topbar__links">
          <a class="topbar__link" href="mailto:${c.email}">${c.email}</a>
          <a class="topbar__link topbar__link--wa" href="${c.whatsapp}?text=${encodeURIComponent(c.whatsappText)}" target="_blank" rel="noopener" data-goal="wa_click">WhatsApp</a>
          <a class="topbar__link mono" href="${c.phoneHref}" data-goal="tel_click">${c.phone}</a>
        </span>
      </div>
    </div>
    <header class="header" data-header>
      <div class="container header__inner">
        ${raw(logo(site))}
        <nav class="nav" aria-label="Основная навигация">${raw(navItems)}</nav>
        <div class="header__actions">
          ${site.presentation ? html`<a class="btn btn--ghost header__pres" href="${site.presentation}" target="_blank" rel="noopener">${site.presentationLabel || 'Скачать презентацию'}</a>` : ''}
          <a class="btn btn--primary header__cta" href="${site.cta.primary.url}">${site.cta.primary.title}</a>
          <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Меню">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
    ${raw(mobileMenu(site, current))}
  `;
}

function mobileMenu(site, current) {
  const c = site.contacts;
  const flat = [];
  for (const item of site.nav) {
    // Пункт-категория без своей страницы (например «Кому») в плоском
    // мобильном списке не нужен — там показываются только его дети.
    if (item.url) flat.push(item);
    for (const ch of item.children || []) if (ch.url !== item.url) flat.push({ ...ch, sub: item.url ? true : false });
  }
  return html`
    <div class="menu" id="menu" data-menu hidden>
      <nav aria-label="Мобильная навигация">
        <ul class="menu__list">
          ${flat.map(
            (item) => html`
              <li class="${cx('menu__item', item.sub && 'menu__item--sub')}">
                <a class="menu__link" href="${item.url}" ${raw(
                  current === item.url ? 'aria-current="page"' : ''
                )}>${item.title}</a>
              </li>
            `
          )}
        </ul>
      </nav>
      <div class="menu__foot">
        <a class="btn btn--primary btn--wide" href="${site.cta.primary.url}">${site.cta.primary.title}</a>
        <div class="menu__contacts">
          <a href="${c.phoneHref}" data-goal="tel_click">${c.phone}</a>
          <a href="mailto:${c.email}">${c.email}</a>
          <span>${c.address.settlement}, ${c.address.region}</span>
          <span>${c.hours.text}</span>
        </div>
      </div>
    </div>
  `;
}

/* --- Мобильная панель действий (ТЗ §18) ----------------------------------- */

export const mobileBar = (site, current = '') => html`
  <div class="mbar" data-mbar>
    <a class="mbar__btn" href="${site.contacts.phoneHref}" data-goal="tel_click">
      ${iconPhone}<span>Позвонить</span>
    </a>
    <a class="mbar__btn mbar__btn--wa" href="${site.contacts.whatsapp}?text=${encodeURIComponent(site.contacts.whatsappText)}"
       target="_blank" rel="noopener" data-goal="wa_click">
      ${iconWhatsApp}<span>WhatsApp</span>
    </a>
    <a class="mbar__btn mbar__btn--cta" href="${current === '/raschet/' ? '#calc-form' : site.cta.primary.url}">
      <span>${current === '/raschet/' ? 'К форме заявки' : 'Получить расчёт'}</span>
    </a>
  </div>
`;

/* --- Подвал (по макету заказчика: контакты · представители · презентация) --- */

export function footer(site) {
  const year = new Date().getFullYear();
  const c = site.contacts;

  return html`
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div>
            ${raw(logo(site, { footer: true }))}
            <p class="footer__about">
              Завод строительных металлоконструкций. Проектирование, производство
              ЛСТК и ЛМК, комплектная поставка — с. Троебратское, Костанайская область.
            </p>
            <ul class="footer__list footer__list--nav">
              ${site.nav.filter((n) => !n.children).map((n) => html`<li><a href="${n.url}">${n.title}</a></li>`)}
              ${site.navFooter.slice(0, 6).map((n) => html`<li><a href="${n.url}">${n.title}</a></li>`)}
            </ul>
          </div>

          <div>
            <h2 class="footer__title">Контакты</h2>
            <ul class="footer__contacts">
              <li>${iconPhone}<a href="${c.phoneHref}" class="mono" data-goal="tel_click">${c.phone}</a></li>
              <li><span class="footer__at" aria-hidden="true">@</span><a href="mailto:${c.email}">${c.email}</a></li>
              <li><span class="footer__pin" aria-hidden="true">●</span><span>${c.address.country}, ${c.address.region},<br>${c.address.district}, ${c.address.settlement}</span></li>
              <li><span class="footer__pin" aria-hidden="true">○</span><span>${c.hours.text}</span></li>
            </ul>
            <div class="btn-row footer__social">
              <a class="btn btn--wa" href="${c.whatsapp}?text=${encodeURIComponent(c.whatsappText)}" target="_blank" rel="noopener" data-goal="wa_click">
                ${iconWhatsApp}<span>WhatsApp</span>
              </a>
              <a class="btn btn--outline-light" href="${c.instagram}" target="_blank" rel="noopener" aria-label="Instagram STEPPESTEEL">
                ${iconInstagram}
              </a>
            </div>
          </div>

          <div>
            <h2 class="footer__title">Представители по Казахстану</h2>
            <p class="footer__text">Сеть формируется — на карте завод и регионы с отдельными страницами; подключённые партнёры появятся метками.</p>
            ${kzMap({ compact: true })}
            <ul class="footer__list footer__list--row">
              ${(site.regionsNav || []).map((n) => html`<li><a href="${n.url}">${n.title}</a></li>`)}
            </ul>
            <a class="arrow-link footer__link" href="/partneram/">Стать партнёром ${iconArrow}</a>
          </div>

          <div>
            <h2 class="footer__title">Скачать презентацию</h2>
            <p class="footer__text">Производство, линейка профилей, направления работы завода — в одном PDF.</p>
            ${site.presentation
              ? html`<a class="btn btn--primary" href="${site.presentation}" target="_blank" rel="noopener">${iconDownload}<span>Скачать PDF</span></a>`
              : ''}
            <ul class="footer__list" style="margin-top:1rem">
              <li><a href="/dokumentaciya/">Вся документация</a></li>
              <li><a href="/raschet/">Получить расчёт</a></li>
            </ul>
          </div>
        </div>

        <div class="footer__bottom">
          <span>© ${year} STEPPESTEEL. Казахстан.</span>
          <span><a href="/privacy/">Политика конфиденциальности</a></span>
        </div>
      </div>
    </footer>
  `;
}

/* --- Заголовок секции ---------------------------------------------------- */

export function sectionHead({ label, title, text, action, split = true, level = 2 }) {
  const H = `h${level}`;
  return html`
    <div class="${cx('section-head', split && 'section-head--split')}" data-reveal>
      <div>
        ${label ? raw(`<p class="eyebrow mono">${e(label)}</p>`) : ''}
        ${title ? raw(`<${H} class="section-head__title">${title}</${H}>`) : ''}
      </div>
      ${text || action
        ? html`
            <div class="stack stack--sm">
              ${text ? raw(`<p class="lead u-max-52" style="margin:0">${text}</p>`) : ''}
              ${action
                ? html`<div><a class="arrow-link" href="${action.url}">${action.title} ${iconArrow}</a></div>`
                : ''}
            </div>
          `
        : ''}
    </div>
  `;
}

/* --- Хлебные крошки ----------------------------------------------------- */

export function crumbs(list) {
  if (!list || list.length < 2) return '';
  return html`
    <nav class="crumbs mono" aria-label="Навигационная цепочка">
      ${list.map((c, i) =>
        i === list.length - 1
          ? html`<span aria-current="page">${c.title}</span>`
          : html`<a href="${c.url}">${c.title}</a><span class="crumbs__sep">/</span>`
      )}
    </nav>
  `;
}

/* --- Хиро внутренней страницы -------------------------------------------- */

export function pageHero({ label, titleHtml, text, crumbList, small = false, actions, count, image }) {
  /* Фото-режим: слева заголовок и лид, справа кадр из манифеста с оранжевой
   * кромкой. Без кадра — обычный типографический хиро. */
  if (image && hasImage(image)) {
    return html`
      <section class="page-hero page-hero--photo">
        <div class="container">
          <div class="page-hero__grid">
            <div class="page-hero__body">
              ${crumbList ? raw(crumbs(crumbList)) : ''}
              ${label ? html`<p class="eyebrow mono page-hero__label">${label}</p>` : ''}
              <h1 class="${cx('page-hero__title', small && 'page-hero__title--sm')}">${raw(titleHtml)}</h1>
              ${text ? html`<p class="page-hero__aside" style="margin-top:1.25rem">${raw(text)}</p>` : ''}
              ${actions ? html`<div class="btn-row page-hero__actions">${raw(actions)}</div>` : ''}
            </div>
            <div class="page-hero__media" data-reveal>
              ${raw(picture(image, { alt: '', sizes: '(min-width: 1020px) 50vw, 100vw', priority: true }))}
            </div>
          </div>
        </div>
      </section>
    `;
  }
  return html`
    <section class="page-hero">
      <div class="container">
        ${crumbList ? raw(crumbs(crumbList)) : ''}
        <div class="page-hero__row">
          <div style="min-width:0">
            ${label ? html`<p class="eyebrow mono page-hero__label">${label}</p>` : ''}
            <h1 class="${cx('page-hero__title', small && 'page-hero__title--sm')}">${raw(titleHtml)}</h1>
          </div>
          ${count
            ? html`<span class="page-hero__count mono" aria-hidden="true">${count}</span>`
            : text
              ? html`<p class="page-hero__aside">${raw(text)}</p>`
              : ''}
        </div>
        ${count && text ? html`<p class="page-hero__aside" style="margin-top:1.5rem">${raw(text)}</p>` : ''}
        ${actions
          ? html`<div class="btn-row page-hero__actions">${raw(actions)}</div>`
          : ''}
      </div>
    </section>
  `;
}

/* --- Карта Казахстана (дизайн-элемент по макету заказчика) ---------------- */

/**
 * Контур страны — из открытого GeoJSON (johan/world.geo.json), спроецирован
 * в SVG-координаты. Метки: завод (Троебратское), регио-страницы, крупные
 * города для ориентации. Представители появятся здесь по мере подключения
 * регионов — данные в site.json → regionsNav.
 */
const KZ_PATH = "M357.4 288.1 L349.3 292.0 L330.6 306.8 L324.4 321.9 L319.1 322.1 L315.2 312.0 L297.2 311.3 L294.3 294.0 L287.4 293.8 L288.4 272.6 L271.5 257.1 L247.1 258.7 L230.5 261.8 L217.0 242.7 L205.4 234.7 L183.4 219.5 L180.7 217.7 L144.2 230.2 L144.8 308.4 L137.5 309.4 L127.6 292.8 L118.0 286.8 L101.9 291.3 L95.6 298.3 L94.8 293.1 L98.3 284.3 L95.6 276.9 L79.2 269.7 L72.8 250.7 L64.9 245.3 L64.5 238.4 L78.3 240.4 L78.8 224.9 L90.9 221.5 L103.2 224.6 L105.8 204.0 L103.3 190.9 L89.1 191.9 L77.0 186.7 L60.6 196.0 L47.4 200.5 L40.2 197.0 L41.6 186.1 L32.6 172.0 L22.0 172.6 L10.0 158.2 L18.2 142.1 L14.0 137.8 L25.4 114.5 L39.9 126.8 L41.7 111.3 L71.0 88.3 L93.1 87.7 L124.4 102.4 L141.2 111.0 L156.3 102.0 L178.7 101.6 L196.9 112.6 L201.0 106.3 L220.9 107.2 L224.5 97.2 L201.5 82.6 L215.1 72.3 L212.4 66.5 L226.1 61.0 L215.8 46.5 L222.3 39.2 L275.4 31.9 L282.3 26.6 L317.8 18.8 L330.6 10.0 L356.1 14.6 L360.5 36.5 L375.3 31.4 L393.5 38.6 L392.4 50.2 L406.0 49.0 L441.5 29.0 L436.3 35.6 L454.4 52.0 L486.1 105.8 L493.7 94.7 L513.2 106.9 L533.6 101.5 L541.4 105.3 L548.3 117.5 L558.2 121.7 L564.2 130.7 L582.5 127.8 L590.0 140.8 L579.2 154.9 L567.4 156.9 L566.7 178.1 L558.9 187.7 L530.7 180.7 L520.5 218.7 L513.2 223.4 L485.1 231.9 L497.9 268.7 L488.2 274.2 L489.3 286.3 L480.6 283.2 L473.4 275.6 L452.4 273.4 L428.9 272.8 L423.7 275.1 L403.5 266.2 L395.5 270.6 L393.3 283.1 L369.9 275.8 L360.6 278.8 L357.4 288.1 Z";
const KZ_PINS = [[271.4, 41.5, "Троебратское · завод", "kz-map__pin--plant"], [253.4, 56.1, "Костанай", "kz-map__pin--page"], [331.7, 20.9, "Петропавловск", "kz-map__pin--page"], [335.1, 54.6, "Кокшетау", "kz-map__pin--page"]];
const KZ_DOTS = [[364.1, 99.3, "Астана", "kz-map__dot"], [387.7, 128.4, "Караганда", "kz-map__dot"], [442.4, 75.4, "Павлодар", "kz-map__dot"], [161.8, 118.2, "Актобе", "kz-map__dot"], [87.3, 185.6, "Атырау", "kz-map__dot"], [441.6, 267.4, "Алматы", "kz-map__dot"], [338.1, 286.9, "Шымкент", "kz-map__dot"]];

export function kzMap({ compact = false } = {}) {
  const pinsSvg = KZ_PINS.map(([x, y, label, cls]) => `
    <g class="kz-map__pin ${cls}">
      <circle cx="${x}" cy="${y}" r="${cls.includes('plant') ? 7 : 5}"/>
      <circle class="kz-map__pulse" cx="${x}" cy="${y}" r="${cls.includes('plant') ? 14 : 10}"/>
      <text x="${x + 10}" y="${y + 4}">${e(label)}</text>
    </g>`).join('');
  const dotsSvg = KZ_DOTS.map(([x, y, label]) => `
    <g class="kz-map__dot"><circle cx="${x}" cy="${y}" r="3"/><text x="${x + 7}" y="${y + 4}">${e(label)}</text></g>`).join('');
  return raw(`
  <figure class="${cx('kz-map', compact && 'kz-map--compact')}">
    <svg viewBox="0 0 600 340" role="img" aria-label="Карта Казахстана: завод в Троебратском Костанайской области, доставка по всей стране">
      <path class="kz-map__land" d="${KZ_PATH}"/>
      ${dotsSvg}
      ${pinsSvg}
    </svg>
    <figcaption class="kz-map__legend mono">
      <span><i class="kz-map__key kz-map__key--plant"></i>завод</span>
      <span><i class="kz-map__key kz-map__key--page"></i>регионы с отдельной страницей</span>
      <span><i class="kz-map__key kz-map__key--dot"></i>доставка по всему Казахстану</span>
    </figcaption>
  </figure>`);
}

/* --- Карточка решения с фото (макет заказчика 30.08.2026) -------------------- */

/**
 * Фото-карточка: кадр (или слот «Фото готовится»), название, описание,
 * «Подробнее». Реальный кадр подхватится по имени `sol-<slug>` в манифесте.
 */
export function solutionCard(s, { level = 3 } = {}) {
  const H = `h${level}`;
  const img = s.cover || `sol-${s.slug}`;
  return html`
    <a class="${cx('card sol-card', s.flag && 'sol-card--flag')}" href="${s.url}" data-reveal>
      <span class="card__media">
        ${hasImage(img)
          ? raw(picture(img, { alt: `${s.title} — Steppe Steel`, sizes: '(min-width: 900px) 33vw, 100vw' }))
          : raw(photoSlot(img, { label: 'Фото в обработке', alt: s.title }))}
        ${hasImage(img) && s.coverViz ? vizTag() : ''}
        ${s.flag ? html`<span class="card__flag mono">${s.flag}</span>` : ''}
      </span>
      <span class="card__body">
        <${raw(H)} class="card__title">${s.short || s.title}</${raw(H)}>
        <span class="card__text">${s.summary}</span>
        <span class="card__more">Подробнее ${iconArrow}</span>
      </span>
    </a>
  `;
}

/* --- Строка реестра решений ------------------------------------------------ */

/**
 * Решения подаются реестром (согласовано 30.08.2026 по гейту референсов):
 * номер · название · моно-метаданные · стрелка, без пиктограмм.
 * Флагман помечается строкой-фонарём и акцентной кромкой.
 */
export function solutionRow(s, { num, summary = false, level = 3 } = {}) {
  const H = `h${level}`;
  return html`
    <a class="${cx('sol-row', s.flag && 'sol-row--flag', !num && 'sol-row--nonum')}" href="${s.url}" data-reveal>
      ${num ? html`<span class="sol-row__num mono">${String(num).padStart(2, '0')}</span>` : ''}
      <span class="sol-row__body">
        ${s.flag ? html`<span class="sol-row__flag mono">${s.flag}</span>` : ''}
        <${raw(H)} class="sol-row__title">${s.short || s.title}</${raw(H)}>
        ${summary && s.summary ? html`<span class="sol-row__summary">${s.summary}</span>` : ''}
      </span>
      ${s.cardMeta?.length ? html`<span class="sol-row__meta mono">${s.cardMeta.map((m) => html`<span>${m}</span>`)}</span>` : ''}
      <span class="sol-row__arrow" aria-hidden="true">${iconArrow}</span>
    </a>
  `;
}

/* --- Шаг процесса ------------------------------------------------------- */

export function step(s, i) {
  return html`
    <div class="step" data-reveal>
      <span class="step__num mono">${String(i + 1).padStart(2, '0')}</span>
      <div>
        <h3 class="step__title">${s.title}</h3>
        ${s.duration ? html`<p class="step__duration mono">${s.duration}</p>` : ''}
      </div>
      <div>
        <p class="step__text">${s.text || s.d}</p>
        ${s.items?.length
          ? html`<ul class="step__list">${s.items.map((it) => html`<li>${it}</li>`)}</ul>`
          : ''}
      </div>
    </div>
  `;
}

/* --- Цифра -------------------------------------------------------------- */

export const stat = (s) => html`
  <div class="stat" data-reveal>
    <span class="stat__val">${s.val}</span>
    <span class="stat__key">${s.key}</span>
    ${s.note ? html`<span class="stat__note mono">${s.note}</span>` : ''}
  </div>
`;

/* --- FAQ ---------------------------------------------------------------- */

export function faq(items, { idPrefix = 'faq' } = {}) {
  return html`
    <div class="faq">
      ${items.map(
        (qa, i) => html`
          <div class="faq__item" data-reveal>
            <h3 style="margin:0">
              <button class="faq__q" type="button" aria-expanded="false" aria-controls="${idPrefix}-${i}">
                <span>${qa.q}</span>
                <span class="faq__icon" aria-hidden="true"></span>
              </button>
            </h3>
            <div class="faq__a" id="${idPrefix}-${i}">
              <div>${raw((Array.isArray(qa.a) ? qa.a : [qa.a]).map((p) => `<p>${e(p)}</p>`).join(''))}</div>
            </div>
          </div>
        `
      )}
    </div>
  `;
}

/* --- CTA-полоса --------------------------------------------------------- */

export function ctaBand(site, { title, text, primary, secondary } = {}) {
  const p = primary || site.cta.primary;
  return html`
    <section class="cta-band">
      <div class="container">
        <div class="cta-band__inner">
          <div data-reveal>
            <h2 class="cta-band__title">${raw(title || 'Получите расчёт<br>вашего здания')}</h2>
            <p class="cta-band__text">
              ${text ||
              'Назначение, размеры, регион — инженер завода посчитает конструктив и пришлёт коммерческое предложение. Есть готовый проект — приложите его к заявке.'}
            </p>
          </div>
          <div class="cta-band__actions" data-reveal>
            <a class="btn btn--primary btn--lg" href="${p.url}">${p.title}</a>
            <a class="btn btn--wa btn--lg" href="${site.contacts.whatsapp}?text=${encodeURIComponent(site.contacts.whatsappText)}" target="_blank" rel="noopener" data-goal="wa_click">
              ${iconWhatsApp}<span>Написать в WhatsApp</span>
            </a>
            ${secondary ? html`<a class="btn btn--outline-light btn--lg" href="${secondary.url}">${secondary.title}</a>` : ''}
          </div>
        </div>
      </div>
    </section>
  `;
}

/* --- Карточка статьи ---------------------------------------------------- */

export const articleCard = (a) => html`
  <a class="article-card" href="${a.url}" data-reveal>
    <div class="media media--3x2">
      ${a.cover
        ? html`${raw(picture(a.cover, { alt: '', sizes: '(min-width: 900px) 33vw, 100vw' }))}${a.coverViz ? vizTag() : ''}`
        : raw(photoSlot(a.slug, { label: 'Фото в обработке', alt: '' }))}
    </div>
    <div class="stack stack--sm">
      <p class="article-card__meta mono"><span>${dateRu(a.date)}</span><span>${a.readingTime} мин</span></p>
      <h3 class="article-card__title">${a.title}</h3>
      <p class="article-card__text">${a.summary}</p>
    </div>
  </a>
`;

/* --- Характеристики ----------------------------------------------------- */

export const specs = (rows) => html`
  <div class="specs">
    ${rows
      .filter((r) => r.val)
      .map(
        (r) => html`
          <div class="specs__row">
            <span class="specs__key">${r.key}</span>
            <span class="specs__val">${r.val}</span>
          </div>
        `
      )}
  </div>
`;

/* --- Строка документа ---------------------------------------------------- */

export const docRow = (d) => html`
  <a class="doc-row" href="${d.file || d.url}" target="_blank" rel="noopener" data-reveal>
    <span class="doc-row__icon" aria-hidden="true">${iconDownload}</span>
    <span class="doc-row__body">
      <span class="doc-row__title">${d.title}</span>
      ${d.text ? html`<span class="doc-row__text">${d.text}</span>` : ''}
    </span>
    <span class="doc-row__meta mono">${d.size || d.meta}</span>
  </a>
`;

/* --- Карточка объекта портфолио ------------------------------------------- */

export function portfolioCard(o) {
  const rows = [
    o.purpose && { key: 'Назначение', val: o.purpose },
    o.region && { key: 'Регион', val: o.region },
    o.size && { key: 'Размеры', val: o.size },
    o.area && { key: 'Площадь', val: o.area },
    o.steelWeight && { key: 'Вес МК', val: o.steelWeight },
    o.frameType && { key: 'Тип конструкции', val: o.frameType },
    o.prodTerm && { key: 'Срок производства', val: o.prodTerm },
    o.docs && { key: 'Документация', val: o.docs },
  ].filter(Boolean);
  return html`
    <article class="obj-card" data-category="${o.category}" data-reveal>
      <div class="obj-card__media">
        ${o.photos?.length
          ? raw(picture(o.photos[0].img, { alt: o.photos[0].alt || o.title, sizes: '(min-width: 900px) 50vw, 100vw' }))
          : raw(photoSlot(`obj-${o.slug}`, { label: 'Фото объекта в обработке', alt: o.title }))}
      </div>
      <div class="obj-card__body">
        <p class="obj-card__top mono">
          ${o.badge ? html`<span class="obj-card__badge">${o.badge}</span>` : ''}
          ${o.year ? html`<span>${o.year}</span>` : ''}
        </p>
        <h3 class="obj-card__title">${o.title}</h3>
        ${raw(specs(rows))}
        ${o.text ? html`<p class="obj-card__text">${o.text}</p>` : ''}
        ${(o.photos || []).length > 1 || (o.montage || []).length
          ? html`<div class="obj-card__gallery" data-lightbox>
              ${(o.photos || []).slice(1).map((ph) => html`<figure class="obj-card__thumb">${raw(picture(ph.img, { alt: ph.alt || o.title, sizes: '160px' }))}</figure>`)}
              ${(o.montage || []).map((ph) => html`<figure class="obj-card__thumb obj-card__thumb--montage">${raw(picture(ph.img, { alt: ph.alt || `${o.title} — монтаж`, sizes: '160px' }))}<figcaption class="mono">монтаж</figcaption></figure>`)}
            </div>`
          : ''}
      </div>
    </article>
  `;
}

/* Схема модульного расширения: секции + пунктирная следующая. Настоящий
 * конструктивный принцип (длина до 140 м секциями) — не декорация. */
export function modularScheme() {
  const section = (x, dashed = false) => `
    <g class="${dashed ? 'ms-next' : 'ms-sec'}">
      <path d="M${x} 84V44l28-18 28 18v40Z"/>
      <line x1="${x}" y1="44" x2="${x + 56}" y2="44"/>
    </g>`;
  return raw(`
  <svg class="modular-scheme" viewBox="0 0 320 100" fill="none" role="img"
       aria-label="Схема модульного расширения: здание наращивается одинаковыми секциями в длину">
    ${section(10)}${section(66)}${section(122)}${section(178, true)}
    <g class="ms-arrow"><line x1="250" y1="60" x2="300" y2="60" marker-end="url(#ms-arr)"/></g>
    <defs><marker id="ms-arr" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
      <path d="M1.5 1.5 L8.5 5 L1.5 8.5" fill="none" stroke="var(--accent)" stroke-width="1.2"/>
    </marker></defs>
    <text class="ms-label" x="10" y="98">СЕКЦИИ ПО СУЩЕСТВУЮЩЕМУ ПРОЕКТУ · ДЛИНА ДО 140 М</text>
  </svg>`);
}

/* --- Калькулятор длины зернохранилища ------------------------------------- */

/** Вместимость на 1 м длины — проверенные цифры из ПЗ (по культурам). */
export function grainCalcBlock() {
  return `
  <section class="section" id="calc">
    <div class="container container--narrow">
      <div class="calc" data-grain-calc data-reveal>
        <p class="eyebrow mono">Калькулятор</p>
        <h2 class="section-head__title">Сколько метров под ваш объём</h2>
        <p class="calc__intro">Выберите культуру и объём — посчитаем ориентировочную длину зернохранилища по вместимости на 1 м.</p>
        <div class="calc__row">
          <label class="field">
            <span class="field__label">Культура</span>
            <select class="field__input" data-gc-crop>
              <option value="70">Горох · 70 т/м</option>
              <option value="67" selected>Пшеница · 67 т/м</option>
              <option value="62">Кукуруза · 62 т/м</option>
              <option value="56">Ячмень · 56 т/м</option>
              <option value="37">Подсолнечник · 37 т/м</option>
            </select>
          </label>
          <label class="field">
            <span class="field__label">Объём хранения, тонн</span>
            <input class="field__input" type="number" inputmode="numeric" min="100" max="20000" step="100" value="3000" data-gc-tons>
          </label>
        </div>
        <p class="calc__result" aria-live="polite">Ориентировочная длина: <strong data-gc-out>≈ 45 м</strong></p>
        <p class="note mono">Расчёт по вместимости на 1 м длины при хранении навалом. Точную длину и сечение под культуру и площадку определит инженер.</p>
        <a class="btn btn--primary" data-gc-link href="/raschet/?type=grain&amp;tons=3000">Получить расчёт под этот объём</a>
      </div>
    </div>
  </section>`;
}

export { num, plural, dateRu };


/* --- Лента сортамента: сечения ПСУ и ПС ------------------------------------ */

/**
 * Настоящая инженерная графика, а не декор: контуры из profiles.json (пути
 * завода), высоты — из сертифицированного сортамента. Масштаб по H, поэтому
 * ряд читается как линейка: от ПС100 до ПСУ280.
 */
export function sortamentStrip(profiles, { max = 9 } = {}) {
  const byCode = Object.fromEntries(profiles.items.map((i) => [i.code, i]));
  const list = [];
  for (const table of Object.values(profiles.sortament)) {
    const item = byCode[table.code];
    if (!item) continue;
    for (const row of table.rows) list.push({ name: row[0], h: Number(row[1]), path: item.path, code: table.code });
  }
  list.sort((a, b) => a.h - b.h);
  const picked = list.slice(0, max);
  const maxH = Math.max(...picked.map((p) => p.h));

  const cell = (p) => {
    const k = p.h / maxH;
    return `<figure class="sortament__item" style="--k:${k.toFixed(3)}">
      <svg class="sortament__sec" viewBox="170 90 140 260" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><path d="${p.path}"/></svg>
      <figcaption class="sortament__cap mono"><b>${e(p.name)}</b><span>H ${p.h}</span></figcaption>
    </figure>`;
  };

  return html`
    <div class="sortament" role="img" aria-label="Сортамент профилей: ${picked.map((p) => p.name).join(', ')} — высота сечения от ${picked[0].h} до ${maxH} мм">
      <div class="sortament__row">${raw(picked.map(cell).join(''))}</div>
      <p class="sortament__note mono">Сечения профилей собственной линии · сертификат РК · 43 типоразмера · толщина 1,5–3,5 мм</p>
    </div>
  `;
}

/* --- Схема типового решения (лист КМ вместо пустой карточки) --------------- */

/**
 * Поперечная рама с размерной линией пролёта или разрез зернохранилища —
 * рисуется по подтверждённым габаритам из solutions.json → hub.typical.
 */
export function typicalScheme({ span, length, kind = 'frame', label = '' }) {
  const dim = (x1, x2, y, text) =>
    `<g class="ts-dim"><line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/><line x1="${x1}" y1="${y - 4}" x2="${x1}" y2="${y + 4}"/><line x1="${x2}" y1="${y - 4}" x2="${x2}" y2="${y + 4}"/><text x="${(x1 + x2) / 2}" y="${y - 6}" text-anchor="middle">${e(text)}</text></g>`;
  const body = kind === 'grain'
    ? `<path class="ts-main" d="M30 118 L60 74 L150 60 L240 74 L270 118"/>
       <path class="ts-main" d="M30 118 L30 130 M270 118 L270 130 M60 74 L60 118 M240 74 L240 118"/>
       <path class="ts-fill" d="M52 118 L86 84 L214 84 L248 118 Z"/>
       <g class="ts-web"><line x1="60" y1="74" x2="150" y2="118"/><line x1="240" y1="74" x2="150" y2="118"/><line x1="150" y1="60" x2="150" y2="118"/></g>`
    : `<path class="ts-main" d="M40 120 L40 78 L150 52 L260 78 L260 120"/>
       <g class="ts-web">${Array.from({ length: 6 }, (_, i) => { const x = 40 + i * 44; const y = x <= 150 ? 78 - (x - 40) * 26 / 110 : 52 + (x - 150) * 26 / 110; return `<line x1="${x}" y1="${y}" x2="${x}" y2="96"/>`; }).join('')}
         <line x1="40" y1="96" x2="260" y2="96"/></g>`;
  return raw(`
  <svg class="ts" viewBox="0 0 300 150" fill="none" role="img" aria-label="Схема: ${e(label)}">
    <g class="ts-grid">${Array.from({ length: 12 }, (_, i) => `<line x1="${12 + i * 25}" y1="16" x2="${12 + i * 25}" y2="134"/>`).join('')}${Array.from({ length: 5 }, (_, i) => `<line x1="12" y1="${22 + i * 28}" x2="288" y2="${22 + i * 28}"/>`).join('')}</g>
    <line class="ts-ground" x1="20" y1="120" x2="280" y2="120"/>
    ${body}
    ${span ? dim(40, 260, 140, span) : ''}
    ${length ? `<text class="ts-note" x="20" y="30">${e(length)}</text>` : ''}
  </svg>`);
}
