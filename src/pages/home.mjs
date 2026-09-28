/**
 * STEPPESTEEL — главная по структуре макета Шамиля (30.08.2026):
 * docs/client/maket-glavnoy-shamil-2026-08-31.jpeg, описание блоков —
 * docs/TZ.md → «Приложение: макет главной». Задача Рамазана 26.09.
 *
 *  1. Шапка — общая (components.mjs → header), без «Скачать презентацию».
 *  2. Первый экран: светлый фон, текст слева, кадр каркаса справа.
 *  3. Наши показатели — 4 пункта с линейными иконками (home.json → proof).
 *  4. Что мы производим — лента всех 9 типов со стрелками (data-rail, site.js).
 *  5. Типовые решения (#tipovye) — текст слева, 4 карточки с фото справа.
 *  6. Реализованные объекты — только честные карточки (≤ 3).
 *  7. Для проектировщиков / Стать дилером — чек-листы из designers/network.
 *  8. Как мы работаем — 5 шагов, сроки из production.json.
 *  9. О заводе STEPPESTEEL — текст и 4 реальных кадра.
 *     Документы и CTA-полоса, 10. подвал — общий.
 *
 * Тексты и маппинг фото — src/data/home.json. Только реальные кадры завода.
 */
import { layout, html, raw } from '../lib/layout.mjs';
import { ctaBand, iconArrow, brandTag, solutionsPhotoNote, FACTORY_SHOTS } from '../lib/components.mjs';
import { organizationNode, websiteNode, itemListNode, howToNode } from '../lib/schema.mjs';
import { documentShelf } from '../lib/experience.mjs';
import { picture, hasImage, e } from '../lib/util.mjs';
import { casePlan } from './portfolio.mjs';
import { kpiIcons, stepIcons, iconTick, iconChevronLeft, iconChevronRight, iconStepArrow } from '../lib/icons.mjs';

// Кадр первого экрана: на десктопе — правая колонка (≈54 % ширины), на планшете и телефоне — во всю ширину.
const HERO_SIZES = '(min-width: 981px) 54vw, 100vw';
// Карточка ленты (pro.css → .hm-rail): 5 колонок в контейнере 1240 → ≈235px; 4 колонки ≤1200 → ≈23vw;
// 3 колонки ≤900 → ≈30vw; телефон — 78 % от (ширина окна − 2 поля) → 258px на 375.
const RAIL_SIZES = '(min-width: 1201px) 250px, (min-width: 901px) 23vw, (min-width: 641px) 30vw, calc(78vw - 34px)';

/** Заголовок блока как в макете: слева h2, справа ссылка «Смотреть все…» и/или стрелки ленты. */
function blockHead(id, title, action, extra = '') {
  return html`<div class="hm-head">
    <h2 class="hm-h2" id="${id}">${title}</h2>
    ${action || extra
      ? html`<div class="hm-head__side">
          ${action ? html`<a class="arrow-link hm-head__link" href="${action.url}">${action.title} ${iconArrow}</a>` : ''}
          ${extra}
        </div>`
      : ''}
  </div>`;
}

export function renderHome(d) {
  const { site, solutions, production, portfolio, home } = d;
  const hero = home.hero;
  const heroPhoto = hasImage(hero.photo.img) ? hero.photo : null;
  // «металло­конструкций» переносится только по мягкому переносу
  const heroTitle = raw(e(site.brand.descriptor).replace('металлоконструкций', 'металло&shy;конструкций'));
  const slogan = site.brand.slogan.split(/\.\s*/).filter(Boolean);

  /* 3. Показатели: prefix + value + unit крупно, title — подпись */
  const proofValue = (p) =>
    html`${p.prefix ? html`<small>${p.prefix}</small> ` : ''}${p.value}${p.unit ? html` <small>${p.unit}</small>` : ''}`;

  /* 5. Типовые решения: параметры — из solutions.hub.typical, фото — из home.json */
  const typical = solutions.hub.typical;
  // «≈ 3 000 т» не рвётся ни внутри числа, ни после «≈»
  const nb = (v) => String(v).replace(/(\d) (?=\d{3}(?!\d))/g, '$1 ').replace(/≈ /g, '≈ ');
  const typicalPhoto = (t) => {
    const ph = home.typical.photos?.[t.title];
    return ph && hasImage(ph.img) ? ph : null;
  };

  /* 6. Объекты: кадры с дрона + проект завода из portfolio.json (план вместо фото) */
  const objects = home.objects.items
    .map((item) => {
      if (item.portfolio) {
        const o = portfolio.items.find((x) => x.slug === item.portfolio);
        if (!o) return null;
        const plan = casePlan(o);
        return plan ? { ...item, title: o.title, place: o.region, year: o.year, plan } : null;
      }
      return hasImage(item.img) ? item : null;
    })
    .filter(Boolean)
    .slice(0, 3);

  /* 8. Шаги: сроки собираются из production.process.steps по индексам */
  const steps = production.process.steps;
  const stepTerm = (s) =>
    s.termText ||
    (s.terms || [])
      .map((t) => {
        const dur = steps[t.step]?.duration;
        return dur ? (t.label ? `${t.label} ${dur}` : dur) : '';
      })
      .filter(Boolean)
      .join(' · ');

  // «с. Троебратское», «г. Костанай» не разрываются на строки (как в brandTag)
  const glue = (s) => String(s || '').replace(/(^|\s)(с\.|г\.) /g, '$1$2 ');

  /* 9. Кадры о заводе: подписи цеха — общие (FACTORY_SHOTS), у кадра с объекта — своя */
  const aboutPhotos = home.about.photos
    .filter((p) => hasImage(p.img))
    .map((p) => ({
      ...p,
      caption: glue(p.caption || FACTORY_SHOTS[p.img]?.caption),
      alt: p.alt || FACTORY_SHOTS[p.img]?.alt || 'Завод Steppe Steel',
    }));

  const railNav = html`<div class="hm-rail__nav">
    <button class="hm-rail__btn" type="button" data-rail-prev aria-label="Прокрутить ленту назад">${iconChevronLeft}</button>
    <button class="hm-rail__btn" type="button" data-rail-next aria-label="Прокрутить ленту вперёд">${iconChevronRight}</button>
  </div>`;

  const content = html`
    <!-- 2. Первый экран -->
    <section class="hm-hero" aria-labelledby="factory-title">
      <div class="hm-hero__main">
        <div class="container">
          <div class="hm-hero__copy">
            <p class="hm-hero__eyebrow"><span aria-hidden="true"></span>${hero.eyebrow}</p>
            <h1 class="hm-hero__title" id="factory-title"><span class="hm-hero__brand">${hero.brand}</span> ${heroTitle}</h1>
            <p class="hm-hero__sub">${slogan.map((w) => html`${w}<i>.</i> `)}</p>
            <p class="hm-hero__lead">${hero.lead}</p>
            <div class="hm-hero__actions">
              <a class="btn btn--primary" href="${site.cta.primary.url}">${site.cta.primary.title} ${iconArrow}</a>
              <a class="btn btn--ghost" href="#tipovye">Типовые решения ${iconArrow}</a>
            </div>
            <p class="hm-hero__promise">${hero.promise} <a href="${hero.promiseLink.url}">${hero.promiseLink.title}</a></p>
          </div>
        </div>
        ${heroPhoto
          ? html`<figure class="hm-hero__media">${raw(picture(heroPhoto.img, { alt: heroPhoto.alt, sizes: HERO_SIZES, priority: true }))}${heroPhoto.video ? html`<video class="hm-hero__video" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" data-hero-video><source src="${heroPhoto.video}" type="video/mp4"></video>` : ''}${raw(brandTag(heroPhoto.caption))}</figure>`
          : ''}
      </div>
      <nav class="hm-strip" aria-label="Завод-изготовитель">
        <div class="container hm-strip__grid">
          ${hero.strip.map((s) => html`<a href="${s.url}"><span class="mono">${s.num}</span>${glue(s.title)} ${iconArrow}</a>`)}
        </div>
      </nav>
    </section>

    <!-- 3. Наши показатели -->
    <section class="hm-kpi" aria-labelledby="kpi-title">
      <div class="container">
        <h2 class="u-visually-hidden" id="kpi-title">${home.proofTitle}</h2>
        <ul class="hm-kpi__list">
          ${home.proof.map((p) => html`<li class="hm-kpi__item">
            <span class="hm-kpi__icon">${kpiIcons[p.icon] || ''}</span>
            <span class="hm-kpi__body"><strong class="hm-kpi__value">${proofValue(p)}</strong><span class="hm-kpi__title">${p.title}</span></span>
          </li>`)}
        </ul>
      </div>
    </section>

    <!-- 4. Что мы производим — лента всех типов зданий -->
    <section class="hm-sec hm-produce" id="resheniya" aria-labelledby="produce-title" data-rail>
      <div class="container">
        ${blockHead('produce-title', home.produce.title, home.produce.action, railNav)}
        <ul class="hm-rail" data-rail-track tabindex="0" aria-label="${home.produce.title}: ${solutions.items.length} типов зданий, лента прокручивается вбок">
          ${solutions.items.map((s) => html`<li class="hm-rail__item">
            <a class="hm-prod" href="${s.url}">
              <span class="hm-prod__photo">${raw(picture(s.cover || 'sol-' + s.slug, { alt: s.photoAlt || s.title, sizes: RAIL_SIZES }))}</span>
              <span class="hm-prod__body">
                <h3 class="hm-prod__title">${s.short || s.title}</h3>
                <span class="hm-prod__text">${home.solutionDescriptions[s.slug] || s.summary}</span>
                <span class="hm-prod__more">Подробнее ${iconArrow}</span>
              </span>
            </a>
          </li>`)}
        </ul>
        ${solutionsPhotoNote()}
      </div>
    </section>

    <!-- 5. Типовые решения -->
    <section class="hm-sec hm-typical" id="tipovye" aria-labelledby="tipovye-title">
      <div class="container hm-typical__grid">
        <div class="hm-typical__intro">
          <h2 class="hm-h2" id="tipovye-title">${home.typical.title}</h2>
          <p>${typical.intro}</p>
          <a class="btn btn--ghost hm-btn-sm" href="${home.typical.cta.url}">${home.typical.cta.title} ${iconArrow}</a>
        </div>
        <div class="hm-typical__cards">
          <ul class="hm-typical__list">
            ${typical.items.map((t) => {
              const ph = typicalPhoto(t);
              return html`<li>
                <a class="hm-typ" href="${t.url}">
                  ${ph ? html`<span class="hm-typ__photo">${raw(picture(ph.img, { alt: ph.alt, sizes: '(min-width: 1100px) 220px, (min-width: 641px) 45vw, 40vw' }))}</span>` : ''}
                  <span class="hm-typ__body">
                    <h3 class="hm-typ__title">${t.title}</h3>
                    <dl class="hm-typ__params">${t.params.map(([k, v]) => html`<div><dt>${k}:</dt> <dd>${nb(v)}</dd></div>`)}</dl>
                    <span class="hm-typ__more">Рассчитать ${iconArrow}</span>
                  </span>
                </a>
              </li>`;
            })}
          </ul>
          <p class="hm-note">${home.typical.photoNote}</p>
        </div>
      </div>
    </section>

    <!-- 6. Реализованные объекты -->
    <section class="hm-sec hm-objects" id="obekty" aria-labelledby="objects-title">
      <div class="container">
        ${blockHead('objects-title', home.objects.title, home.objects.action)}
        <ul class="hm-objects__list">
          ${objects.map((o) => html`<li>
            <a class="hm-obj" href="${o.url}">
              <span class="${o.plan ? 'hm-obj__media hm-obj__media--plan' : 'hm-obj__media'}">${o.plan
                ? o.plan
                : raw(picture(o.img, { alt: o.alt, sizes: '(min-width: 1100px) 420px, (min-width: 641px) 45vw, 100vw' }))}</span>
              <span class="hm-obj__body">
                <span class="hm-obj__badge mono">${o.badge}</span>
                <h3 class="hm-obj__title">${o.title}</h3>
                <span class="hm-obj__meta">${[o.place, o.year].filter(Boolean).join(', ')}</span>
              </span>
            </a>
          </li>`)}
        </ul>
      </div>
    </section>

    <!-- 7. Для проектировщиков / Стать дилером -->
    <section class="hm-sec hm-partners" id="partnyorstvo" aria-label="Проектировщикам и дилерам">
      <div class="container hm-partners__grid">
        ${home.partners.map((p, i) => html`<article class="hm-partner" aria-labelledby="partner-${i}">
          <div class="hm-partner__body">
            <h2 class="hm-partner__title" id="partner-${i}">${p.title}</h2>
            <ul class="hm-check">${p.items.map((it) => html`<li>${iconTick}<span>${it}</span></li>`)}</ul>
            <a class="btn btn--ghost hm-btn-sm" href="${p.url}" aria-label="Подробнее: ${p.title}">Подробнее ${iconArrow}</a>
          </div>
          ${hasImage(p.img)
            ? html`<figure class="hm-partner__photo"${p.focus ? raw(` style="--focus:${p.focus}"`) : ''}>${raw(picture(p.img, { alt: p.alt, sizes: '(min-width: 1100px) 300px, (min-width: 641px) 40vw, 100vw' }))}</figure>`
            : ''}
        </article>`)}
      </div>
    </section>

    <!-- 8. Как мы работаем -->
    <section class="hm-sec hm-process" id="process" aria-labelledby="process-title">
      <div class="container">
        ${blockHead('process-title', home.process.title)}
        <ol class="hm-steps">
          ${home.process.steps.map((s, i, all) => {
            const term = stepTerm(s);
            return html`<li class="hm-step">
              <span class="hm-step__icon">${stepIcons[s.icon] || ''}</span>
              <div class="hm-step__body">
                <h3 class="hm-step__title"><span class="hm-step__num">${i + 1}.</span> ${s.title}</h3>
                <p class="hm-step__text">${s.text}</p>
                ${term ? html`<p class="hm-step__term mono">${term}</p>` : ''}
              </div>
              ${i < all.length - 1 ? html`<span class="hm-step__arrow" aria-hidden="true">${iconStepArrow}</span>` : ''}
            </li>`;
          })}
        </ol>
        <p class="hm-note hm-process__note">${home.process.note}</p>
      </div>
    </section>

    <!-- 9. О заводе -->
    <section class="hm-sec hm-about" id="zavod" aria-labelledby="about-title">
      <div class="container hm-about__grid">
        <div class="hm-about__copy">
          <h2 class="hm-h2" id="about-title">${home.about.title}</h2>
          <p class="hm-about__text">${home.about.text}</p>
          <ul class="hm-check hm-check--compact">${home.about.items.map((it) => html`<li>${iconTick}<span>${it}</span></li>`)}</ul>
          <div class="hm-about__actions">
            <a class="btn btn--ghost hm-btn-sm" href="/o-zavode/">Подробнее о заводе ${iconArrow}</a>
            <a class="arrow-link factory-visit" href="${site.contacts.whatsapp}?text=${encodeURIComponent(site.contacts.whatsappVisit)}" target="_blank" rel="noopener" data-goal="wa_click">Приехать на завод ${iconArrow}</a>
          </div>
        </div>
        <ul class="hm-about__photos">
          ${aboutPhotos.map((p) => html`<li>
            <figure class="hm-about__photo">
              ${raw(picture(p.img, { alt: p.alt, sizes: '(min-width: 1100px) 180px, (min-width: 641px) 22vw, 45vw' }))}
              <figcaption>${p.caption}</figcaption>
            </figure>
          </li>`)}
        </ul>
      </div>
    </section>

    ${documentShelf(d)}

    ${ctaBand(site, { title: home.cta.title, text: home.cta.text })}
  `;

  return layout(
    site,
    {
      url: '/',
      bodyClass: 'pro-home',
      noNext: true,
      // LCP — кадр первого экрана: предзагрузка той же ширины, что выберет <picture>
      preloadImage: heroPhoto ? { name: heroPhoto.img, sizes: HERO_SIZES } : undefined,
      image: 'og-default',
      imageAlt: 'STEPPESTEEL — завод строительных металлоконструкций',
      title: 'Завод металлоконструкций в Казахстане — Steppe Steel',
      description:
        'Steppe Steel — завод-изготовитель металлоконструкций: своё проектирование КМ и КМД, производство ЛСТК и ЛМК, комплектная поставка здания под объект.',
      ogTitle: 'STEPPESTEEL — завод строительных металлоконструкций',
      schema: [
        organizationNode(site, { products: solutions.items }),
        websiteNode(site),
        itemListNode(site, '/', solutions.items, 'Решения Steppe Steel'),
        howToNode(site, '/', production.process.steps, 'Как заказать здание на заводе Steppe Steel'),
      ],
    },
    content
  );
}
