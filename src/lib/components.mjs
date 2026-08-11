/**
 * Переиспользуемые куски разметки Steppe Steel.
 * Каждая функция возвращает строку HTML (обёртку raw/html из util).
 */

import { html, raw, e, cx, picture, dateRu, num, plural } from './util.mjs';

/* --- Логотип ------------------------------------------------------------ */

/** Реальный логотип завода (JPG на чёрном фоне; на тёмной теме фон гасится
 *  mix-blend-mode: screen в CSS). Перерисовывать в SVG нельзя — решение клиента. */
export const logo = (site, { href = '/', footer = false } = {}) => html`
  <a href="${href}" class="${cx('logo', footer && 'logo--footer')}" aria-label="Steppe Steel — на главную">
    <img class="logo__img" src="${footer ? '/assets/img/ui/logo-band.jpg' : '/assets/img/ui/logo-compact.jpg'}"
         alt="Steppe Steel — Metal Structures · Industrial Systems"
         width="${footer ? 302 : 189}" height="${footer ? 117 : 60}" loading="${footer ? 'lazy' : 'eager'}" decoding="async">
  </a>
`;

/* --- Иконки ------------------------------------------------------------- */

export const iconArrow = raw(
  `<svg class="arrow" width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true"><path d="M9 1l4 4-4 4M13 5H0" stroke="currentColor" stroke-width="1.2"/></svg>`
);

export const iconArrowUpRight = raw(
  `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 11L11 3M11 3H4.5M11 3v6.5" stroke="currentColor" stroke-width="1.2"/></svg>`
);

export const iconWhatsApp = raw(
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.17 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z"/></svg>`
);

export const iconInstagram = raw(
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.98c-3.14 0-3.51.01-4.75.07-1.15.05-1.77.24-2.18.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.18-.06 1.24-.07 1.61-.07 4.75s.01 3.51.07 4.75c.05 1.15.24 1.77.4 2.18.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.18.4 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c1.15-.05 1.77-.24 2.18-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.18.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.05-1.15-.24-1.77-.4-2.18a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.18-.4-1.24-.06-1.61-.07-4.75-.07Zm0 3.37a4.49 4.49 0 1 1 0 8.98 4.49 4.49 0 0 1 0-8.98Zm0 7.4a2.91 2.91 0 1 0 0-5.82 2.91 2.91 0 0 0 0 5.82Zm5.72-7.6a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0Z"/></svg>`
);

/* --- Тег «ВИЗУАЛИЗАЦИЯ» -------------------------------------------------- */

/** Честная пометка на AI-визуализациях — часть договорённости с заводом. */
export const vizTag = (label = 'Визуализация') =>
  raw(`<span class="viz-tag">${e(label)}</span>`);

/** Позитивный бейдж для реальных кадров — чтобы их не путали с рендерами. */
export const photoTag = (label = 'Фото с объекта · @lstk.factory') =>
  raw(`<span class="viz-tag viz-tag--photo">${e(label)}</span>`);

/* --- Видео ---------------------------------------------------------------- */

/**
 * Фоновое видео с постером. ariaLabel обязателен — это содержимое, не декор.
 * data-autovideo: скрипт останавливает его при prefers-reduced-motion.
 */
export function video(src, { poster, className = '', ariaLabel, viz = true } = {}) {
  return raw(
    `<span class="${cx('media-video', className)}">` +
      `<video autoplay muted loop playsinline preload="metadata" data-autovideo` +
      (poster ? ` poster="/assets/img/${e(poster)}"` : '') +
      (ariaLabel ? ` aria-label="${e(ariaLabel)}" role="img"` : '') +
      `><source src="/assets/video/${e(src)}" type="video/mp4"></video>` +
      (viz ? `<span class="viz-tag">Визуализация</span>` : '') +
      `</span>`
  );
}

/* --- Шапка -------------------------------------------------------------- */

export function header(site, { current = '', overHero = false } = {}) {
  const nav = site.nav
    .map(
      (item) => html`
        <a class="nav__link" href="${item.url}" ${raw(
          current.startsWith(item.url) && item.url !== '/' ? 'aria-current="page"' : ''
        )}>${item.title}</a>
      `
    )
    .join('');

  return html`
    <header class="${cx('header', overHero && 'header--over')}" data-header>
      <div class="header__inner">
        ${raw(logo(site))}
        <nav class="nav" aria-label="Основная навигация">${raw(nav)}</nav>
        <div class="header__actions">
          <a class="header__phone link" href="${site.contacts.phoneHref}">${site.contacts.phone}</a>
          <a class="btn btn--primary header__cta" href="${site.cta.primary.url}">${site.cta.primary.title}</a>
          <a class="header__call" href="${site.contacts.phoneHref}" aria-label="Позвонить: ${site.contacts.phone}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
          </a>
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
  const items = [...site.nav, ...site.navFooter.filter((n) => n.menu)];
  return html`
    <div class="menu" id="menu" data-menu hidden>
      <nav aria-label="Мобильная навигация">
        <ul class="menu__list">
          ${items.map(
            (item, i) => html`
              <li class="menu__item">
                <a class="menu__link" href="${item.url}" ${raw(
                  current.startsWith(item.url) && item.url !== '/' ? 'aria-current="page"' : ''
                )}>
                  <span class="menu__num">${String(i + 1).padStart(2, '0')}</span>
                  <span>${item.title}</span>
                </a>
              </li>
            `
          )}
        </ul>
      </nav>
      <div class="menu__foot">
        <a class="btn btn--primary btn--wide" href="${site.cta.primary.url}">${site.cta.primary.title}</a>
        <div class="menu__contacts">
          <a href="${site.contacts.phoneHref}">${site.contacts.phone}</a>
          <a href="mailto:${site.contacts.email}">${site.contacts.email}</a>
          <span>${site.contacts.address.settlement}, ${site.contacts.address.region}</span>
          <span>${site.contacts.hours.text}</span>
        </div>
      </div>
    </div>
  `;
}

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
            <p class="text-small u-max-40 footer__about">
              ${site.brand.slogan}. Завод ЛСТК и металлоконструкций полного цикла —
              с. Троебратское, Костанайская область.
            </p>
            <div class="btn-row footer__social">
              <a class="btn btn--wa" href="${c.whatsapp}?text=${encodeURIComponent(c.whatsappText)}" target="_blank" rel="noopener">
                ${iconWhatsApp}<span>WhatsApp</span>
              </a>
              <a class="btn btn--outline-light" href="${c.instagram}" target="_blank" rel="noopener" aria-label="Instagram Steppe Steel">
                ${iconInstagram}
              </a>
            </div>
          </div>

          <div>
            <h2 class="footer__title">Продукция</h2>
            <ul class="footer__list">
              ${(site._products || []).map((p) => html`<li><a href="${p.url}">${p.short || p.title}</a></li>`)}
              <li><a href="/profili/">Профили Sigma / C / П</a></li>
            </ul>
          </div>

          <div>
            <h2 class="footer__title">Разделы</h2>
            <ul class="footer__list">
              ${site.nav.map((n) => html`<li><a href="${n.url}">${n.title}</a></li>`)}
              ${site.navFooter.slice(0, 4).map((n) => html`<li><a href="${n.url}">${n.title}</a></li>`)}
            </ul>
          </div>

          <div>
            <h2 class="footer__title">Контакты</h2>
            <ul class="footer__list">
              <li><a href="${c.phoneHref}" class="mono">${c.phone}</a></li>
              <li><a href="mailto:${c.email}">${c.email}</a></li>
              <li>${c.address.settlement}, ${c.address.district}</li>
              <li>${c.address.region}, ${c.address.country}</li>
              <li>${c.hours.text}</li>
              <li><a href="${c.instagram}" target="_blank" rel="noopener">Instagram ${c.instagramHandle}</a></li>
            </ul>
          </div>
        </div>

        <span class="footer__wordmark" aria-hidden="true">STEPPE</span>

        <div class="footer__bottom">
          <span>© ${year} Steppe Steel — ${site.brand.slogan}. Казахстан.</span>
          <span><a href="/privacy/">Политика конфиденциальности</a></span>
        </div>
      </div>
    </footer>
  `;
}

/* --- Плавающая кнопка WhatsApp ------------------------------------------ */

export const fab = (site) => html`
  <a class="fab" data-fab href="${site.contacts.whatsapp}?text=${encodeURIComponent(site.contacts.whatsappText)}"
     target="_blank" rel="noopener" aria-label="Написать в WhatsApp">
    ${iconWhatsApp}<span class="fab__label">Написать</span>
  </a>
`;

/* --- Заголовок секции ---------------------------------------------------- */

/**
 * label выводится в mono как штамп листа: sheet="03" даёт «ЛИСТ 03 · label».
 */
export function sectionHead({ label, sheet, title, text, action, split = true, level = 2 }) {
  const H = `h${level}`;
  const stamp = sheet ? `ЛИСТ ${sheet} · ${label || ''}` : label;
  return html`
    <div class="${cx('section-head', split && 'section-head--split')}" data-reveal>
      <div>
        ${stamp ? raw(`<p class="eyebrow mono">${e(stamp)}</p>`) : ''}
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

/* --- Карточка продукции -------------------------------------------------- */

export function productCard(p, { sizes = '(min-width: 960px) 33vw, 100vw', feature = false, priority = false } = {}) {
  const meta = [p.code, p.spanLabel, p.termLabel].filter(Boolean);
  return html`
    <a class="${cx('product-card', feature && 'product-card--feature')}" href="${p.url}"
       data-reveal data-cursor="Смотреть" data-slug="${p.slug}" data-category="${p.slug}">
      <div class="media media--3x2">
        ${raw(picture(p.cover, { alt: p.coverAlt || `${p.title} — Steppe Steel`, sizes, priority }))}
        ${p.coverViz ? vizTag() : ''}
      </div>
      <div class="product-card__body">
        <span class="product-card__code mono" aria-hidden="true">${p.code}</span>
        <div>
          <h3 class="product-card__title">${p.title}</h3>
          <p class="product-card__meta mono">${meta.slice(1).map((m) => html`<span>${m}</span>`)}</p>
        </div>
        <span class="product-card__arrow" aria-hidden="true">${iconArrow}</span>
      </div>
    </a>
  `;
}

/* --- Строка услуги ------------------------------------------------------ */

export function serviceRow(s, i) {
  return html`
    <a class="service-row" href="${s.url}" data-reveal data-service="${s.slug}">
      <span class="service-row__num mono">${String(i + 1).padStart(2, '0')}</span>
      <h3 class="service-row__title">${s.title}</h3>
      <p class="service-row__text">${s.summary}</p>
      <span class="service-row__arrow" aria-hidden="true">${iconArrow}</span>
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
        <p class="step__text">${s.text}</p>
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

/* --- Хиро внутренней страницы -------------------------------------------- */

/**
 * Крупный тёмный заголовок внутренних страниц.
 * titleHtml — готовая разметка (допустимы <span class="accent"> и &shy;).
 */
export function pageHero({ label, titleHtml, text, crumbList, count, small = false }) {
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
      </div>
    </section>
  `;
}

/* --- Бегущая строка ------------------------------------------------------ */

export function marquee(words, { accentEvery = 0 } = {}) {
  const part = words
    .map((w, i) => {
      const word = accentEvery && (i + 1) % accentEvery === 0 ? `<span class="accent">${e(w)}</span>` : e(w);
      return `<span>${word}</span><span class="marquee__dot" aria-hidden="true">●</span>`;
    })
    .join('');
  return html`
    <div class="marquee" aria-hidden="true">
      <div class="marquee__track">
        <div class="marquee__part">${raw(part)}</div>
        <div class="marquee__part">${raw(part)}</div>
      </div>
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
            <h2 class="cta-band__title">${raw(title || 'Получите расчёт<br>за 24 часа')}</h2>
            <p class="cta-band__text">
              ${text ||
              'Три коротких шага — тип здания, размеры, телефон. Инженер завода посчитает конструктив и пришлёт коммерческое предложение в WhatsApp.'}
            </p>
          </div>
          <div class="cta-band__actions" data-reveal>
            <a class="btn btn--primary btn--lg" href="${p.url}">${p.title}</a>
            <a class="btn btn--wa btn--lg" href="${site.contacts.whatsapp}?text=${encodeURIComponent(site.contacts.whatsappText)}" target="_blank" rel="noopener">
              ${iconWhatsApp}<span>Написать в WhatsApp</span>
            </a>
            ${secondary ? html`<a class="btn btn--outline-light btn--lg" href="${secondary.url}">${secondary.title}</a>` : ''}
          </div>
        </div>
      </div>
    </section>
  `;
}

/* --- Следующий продукт (пейджер с фото) ---------------------------------- */

export const nextProduct = (p, label = 'Следующий раздел каталога') => html`
  <a class="next-project" href="${p.url}" data-cursor="Смотреть">
    <div class="next-project__bg">${raw(picture(p.cover, { alt: '', sizes: '100vw' }))}${p.coverViz ? vizTag() : ''}</div>
    <div class="next-project__inner container">
      <span class="eyebrow mono next-project__label">${label}</span>
      <p class="next-project__title">${p.title}</p>
    </div>
  </a>
`;

/* --- Карточка статьи ---------------------------------------------------- */

export const articleCard = (a) => html`
  <a class="article-card" href="${a.url}" data-reveal>
    <div class="media media--3x2">
      ${raw(picture(a.cover, { alt: a.title, sizes: '(min-width: 900px) 33vw, 100vw' }))}
      ${a.coverViz ? vizTag() : ''}
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

export { num, plural, dateRu };
