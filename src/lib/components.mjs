/**
 * Переиспользуемые куски разметки Steppe Steel (v4 «Белый завод»).
 * Каждая функция возвращает строку HTML (обёртку raw/html из util).
 */

import { html, raw, e, cx, picture, dateRu, num, plural } from './util.mjs';

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

/* --- Бейджи медиа --------------------------------------------------------- */

/** Честная пометка на визуализациях — политика фактов сайта. */
export const vizTag = (label = 'Визуализация') =>
  raw(`<span class="viz-tag">${e(label)}</span>`);

export const photoTag = (label = 'Фото с объекта') =>
  raw(`<span class="viz-tag viz-tag--photo">${e(label)}</span>`);

/** Слот под реальное фото: пока кадра нет в манифесте — нейтральная плашка. */
export function photoSlot(name, { alt = '', label = 'Фото готовится', sizes = '(min-width: 900px) 50vw, 100vw', className = '' } = {}) {
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

export const mobileBar = (site) => html`
  <div class="mbar" data-mbar>
    <a class="mbar__btn" href="${site.contacts.phoneHref}" data-goal="tel_click">
      ${iconPhone}<span>Позвонить</span>
    </a>
    <a class="mbar__btn mbar__btn--wa" href="${site.contacts.whatsapp}?text=${encodeURIComponent(site.contacts.whatsappText)}"
       target="_blank" rel="noopener" data-goal="wa_click">
      ${iconWhatsApp}<span>WhatsApp</span>
    </a>
    <a class="mbar__btn mbar__btn--cta" href="${site.cta.primary.url}">
      <span>Получить расчёт</span>
    </a>
  </div>
`;

/* --- Подвал ------------------------------------------------------------- */

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
            <h2 class="footer__title">Решения</h2>
            <ul class="footer__list">
              ${(site._solutions || []).map((p) => html`<li><a href="${p.url}">${p.short || p.title}</a></li>`)}
            </ul>
          </div>

          <div>
            <h2 class="footer__title">Разделы</h2>
            <ul class="footer__list">
              ${site.nav.filter((n) => !n.children).map((n) => html`<li><a href="${n.url}">${n.title}</a></li>`)}
              ${site.navFooter.slice(0, 6).map((n) => html`<li><a href="${n.url}">${n.title}</a></li>`)}
            </ul>
            ${site.regionsNav ? html`
              <h2 class="footer__title footer__title--sub">Регионы</h2>
              <ul class="footer__list footer__list--row">
                ${site.regionsNav.map((n) => html`<li><a href="${n.url}">${n.title}</a></li>`)}
              </ul>
            ` : ''}
          </div>

          <div>
            <h2 class="footer__title">Контакты</h2>
            <ul class="footer__list">
              <li><a href="${c.phoneHref}" class="mono" data-goal="tel_click">${c.phone}</a></li>
              <li><a href="mailto:${c.email}">${c.email}</a></li>
              <li>${c.address.settlement}, ${c.address.district}</li>
              <li>${c.address.region}, ${c.address.country}</li>
              <li>${c.hours.text}</li>
              <li><a href="${c.instagram}" target="_blank" rel="noopener">Instagram ${c.instagramHandle}</a></li>
            </ul>
          </div>
        </div>

        <span class="footer__wordmark" aria-hidden="true">STEPPESTEEL</span>

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

export function pageHero({ label, titleHtml, text, crumbList, small = false, actions, count }) {
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

/* --- Строка реестра решений ------------------------------------------------ */

/**
 * Решения подаются реестром (согласовано 30.08.2026 по гейту референсов):
 * номер · название · моно-метаданные · стрелка, без пиктограмм.
 * Флагман помечается строкой-фонарём и акцентной кромкой.
 */
export function solutionRow(s, { num, summary = false, level = 3 } = {}) {
  const H = `h${level}`;
  return html`
    <a class="${cx('sol-row', s.flag && 'sol-row--flag')}" href="${s.url}" data-reveal>
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
        : raw(photoSlot(a.slug, { label: 'Фото готовится', alt: '' }))}
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
          : raw(photoSlot('', { label: 'Фото объекта готовится', alt: o.title }))}
      </div>
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
