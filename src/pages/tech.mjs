/**
 * /tekhnologii/ (ТЗ §13): хаб технологий + страницы /tekhnologii/<slug>/.
 * Контент — tech.json; архитектура позволяет добавлять схемы и фото позже.
 */

import { layout, html, raw } from '../lib/layout.mjs';
import { pageHero, sectionHead, specs, ctaBand, iconArrow, heroFrame, photoSlot } from '../lib/components.mjs';
import { hasImage, picture } from '../lib/util.mjs';
import { serviceNode, itemListNode } from '../lib/schema.mjs';

export function renderTechIndex(d) {
  const { site, tech } = d;
  const crumbList = [
    { title: 'Главная', url: '/' },
    { title: 'Технологии', url: '/tekhnologii/' },
  ];

  const content = html`
    ${pageHero({
      label: tech.hub.kicker,
      titleHtml: tech.hub.title,
      text: tech.hub.intro,
      crumbList,
    })}

    <section class="section section--flush-top">
      <div class="container">
        <figure class="tech-blueprint" data-reveal>
          ${raw(heroFrame())}
          <figcaption class="tech-blueprint__cap mono">
            Поперечная рама ЛСТК + ЛМК: пролёт до 24 м без внутренних колонн, сборка на болтах
          </figcaption>
        </figure>
        <div class="tech-grid">
          ${tech.items.map(
            (t, i) => html`
              <a class="tech-card" href="${t.url}" data-reveal>
                <span class="tech-card__num mono">${String(i + 1).padStart(2, '0')}</span>
                <h2 class="tech-card__title">${t.title}</h2>
                <p class="tech-card__text">${t.lead}</p>
                <span class="tech-card__arrow" aria-hidden="true">${iconArrow}</span>
              </a>
            `
          )}
        </div>
      </div>
    </section>

    ${ctaBand(site)}
  `;

  return layout(
    site,
    {
      url: '/tekhnologii/',
      title: tech.hub.seoTitle,
      description: tech.hub.seoDescription,
      crumbs: crumbList,
      pageType: 'CollectionPage',
      schema: [itemListNode(site, '/tekhnologii/', tech.items, 'Технологии Steppe Steel')],
    },
    content
  );
}

export function renderTech(d, t) {
  const { site, tech } = d;
  const crumbList = [
    { title: 'Главная', url: '/' },
    { title: 'Технологии', url: '/tekhnologii/' },
    { title: t.title, url: t.url },
  ];
  const others = tech.items.filter((x) => x.slug !== t.slug).slice(0, 3);

  const content = html`
    ${pageHero({
      label: 'Технологии Steppe Steel',
      titleHtml: t.title,
      text: t.lead,
      crumbList,
      small: true,
    })}

    <section class="section section--flush-top">
      <div class="container split">
        <div class="stack stack--lg">
          ${(t.sections || []).map(
            (sec) => html`
              <div data-reveal>
                <h2 class="h3">${sec.h}</h2>
                ${sec.body.map((par) => html`<p>${par}</p>`)}
              </div>
            `
          )}
          ${(t.media || []).length
            ? html`<div class="tech-media" data-lightbox>
                ${t.media.map((m) => html`<figure class="tech-media__item" data-reveal>
                  ${hasImage(m.slot) ? raw(picture(m.slot, { alt: m.caption || t.title, sizes: '(min-width: 900px) 50vw, 100vw' })) : raw(photoSlot(m.slot, { label: m.caption || 'Схема готовится', alt: m.caption || t.title }))}
                  ${m.caption ? html`<figcaption class="media-caption">${m.caption}</figcaption>` : ''}
                </figure>`)}
              </div>`
            : ''}
          ${t.slug === 'lstk'
            ? html`<p data-reveal><a class="arrow-link" href="/profili/">Сортамент профилей ПСУ и ПС ${iconArrow}</a></p>`
            : ''}
        </div>
        <aside class="side" data-reveal>
          <h2 class="side__title mono">Кратко</h2>
          ${specs(t.facts || [])}
          <a class="btn btn--primary btn--wide" href="/raschet/">Получить расчёт</a>
        </aside>
      </div>
    </section>

    ${others.length
      ? html`
          <section class="section section--tint">
            <div class="container">
              ${sectionHead({ label: 'Технологии', title: 'Смотрите также' })}
              <div class="tech-list">
                ${others.map(
                  (o) => html`
                    <a class="tech-row" href="${o.url}" data-reveal>
                      <span class="tech-row__title">${o.title}</span>
                      <span class="tech-row__text">${o.lead}</span>
                      <span class="tech-row__arrow" aria-hidden="true">${iconArrow}</span>
                    </a>
                  `
                )}
              </div>
            </div>
          </section>
        `
      : ''}

    ${ctaBand(site)}
  `;

  return layout(
    site,
    {
      url: t.url,
      title: t.seoTitle,
      description: t.seoDescription,
      crumbs: crumbList,
      schema: [
        serviceNode(site, {
          url: t.url,
          title: t.title,
          serviceType: t.title,
          summary: t.lead,
        }),
      ],
    },
    content
  );
}
