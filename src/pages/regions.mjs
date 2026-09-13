/**
 * Регио-страницы севера Казахстана: /kostanay/, /petropavlovsk/, /kokshetau/.
 * Страница строится вокруг локальных фактов, а не подстановки названия города.
 */

import { layout } from '../lib/layout.mjs';
import { html, raw, e } from '../lib/util.mjs';
import { pageHero, ctaBand, sectionHead, stat, solutionRow } from '../lib/components.mjs';

export function renderRegion(d, r) {
  const { site, solutions, regions } = d;
  const url = `/${r.slug}/`;
  const crumbs = [{ title: 'Главная', url: '/' }, { title: r.city, url }];
  const featured = solutions.items.slice(0, 6);
  /* WhatsApp с шаблоном под регион (разбор 11.09, п.8) — ссылка как в components.mjs. */
  const waText = r.waText || site.contacts.whatsappText;
  const waHref = `${site.contacts.whatsapp}?text=${encodeURIComponent(waText)}`;
  const content = html`
    ${raw(pageHero({
      label: `${r.region} · доставка по Казахстану`,
      titleHtml: raw(r.h1),
      crumbList: crumbs,
      text: r.lead,
      offer: regions.heroMeta,
      actions: html`
        <a class="btn btn--primary btn--lg" href="${site.cta.primary.url}">Получить расчёт</a>
        <a class="btn btn--ghost btn--lg" href="${waHref}" target="_blank" rel="noopener" data-goal="wa_click">Написать в WhatsApp</a>
      `,
    }))}

    <section class="section section--flush-top">
      <div class="container">
        <div class="hero__stats hero__stats--flat">
          ${r.facts.map((f) => stat({ val: f.val, key: f.key }))}
        </div>
      </div>
    </section>

    <section class="section section--tint">
      <div class="container">
        ${raw(sectionHead({
          label: 'Ситуация в регионе',
          title: r.localTitle,
          text: r.localText,
          action: { title: 'Посчитать окупаемость склада', url: '/agrariyam/#okupaemost' },
        }))}
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${raw(sectionHead({
          label: `Что строим в регионе — ${r.city}`,
          title: regions.commonTitle,
          text: regions.commonText,
          action: { title: 'Все решения', url: '/resheniya/' },
        }))}
        <div class="sol-list">
          ${featured.map((p) => solutionRow(p))}
        </div>
      </div>
    </section>

    <section class="section section--tint">
      <div class="container">
        ${raw(sectionHead({
          label: 'Логистика',
          title: r.logisticsTitle,
          text: r.logisticsText,
          action: { title: 'Как устроен процесс', url: '/proizvodstvo/#process' },
        }))}
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${raw(sectionHead({
          label: 'Отличие',
          title: regions.whyTitle,
          split: false,
        }))}
        <div class="grid-4">
          ${regions.why.map((w) => html`
            <div class="pick-card" data-reveal>
              <h3 class="pick-card__title">${w.title}</h3>
              <p class="pick-card__text">${w.text}</p>
            </div>
          `)}
        </div>
      </div>
    </section>

    ${raw(ctaBand(site, {
      title: raw(regions.ctaTitle),
      text: regions.ctaText,
      secondary: { title: 'Профили ПСУ и ПС', url: '/profili/' },
      waText,
    }))}
  `;

  return layout(site, {
    url,
    title: r.seoTitle,
    description: r.seoDescription,
    crumbs,
    waText,
    schema: [{
      '@type': 'Service',
      '@id': `${site.url}${url}#service`,
      name: `Металлоконструкции и зернохранилища — ${r.city}`,
      serviceType: 'Изготовление и поставка металлоконструкций',
      provider: { '@id': `${site.url}/#organization` },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: r.region,
        address: { '@type': 'PostalAddress', addressRegion: r.region, addressCountry: 'KZ' },
      },
      description: e(r.seoDescription),
    }],
  }, content);
}
