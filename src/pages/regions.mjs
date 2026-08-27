/**
 * Регио-страницы севера Казахстана: /kostanay/, /petropavlovsk/, /kokshetau/.
 *
 * Приём подсмотрен у конкурента (регио-лендинги), но содержание другое:
 * у него в регионе представительство, у нас — сам завод. Поэтому вся страница
 * строится вокруг локальных фактов, а не вокруг подстановки названия города.
 */

import { layout } from '../lib/layout.mjs';
import { html, raw, e } from '../lib/util.mjs';
import { pageHero, ctaBand, sectionHead, stat, productCard } from '../lib/components.mjs';

export function renderRegion(d, r) {
  const { site, products, regions } = d;
  const url = `/${r.slug}/`;
  const crumbs = [{ title: 'Главная', url: '/' }, { title: r.city, url }];

  const content = html`
    ${raw(pageHero({
      label: `${r.region} · доставка по Казахстану`,
      titleHtml: raw(r.h1),
      crumbList: crumbs,
      text: r.lead,
    }))}

    <!-- ЛИСТ 01 · Локальные цифры -->
    <section class="section section--sheet section--tight">
      <div class="container">
        <div class="grid grid--4">
          ${r.facts.map((f) => stat({ val: f.val, key: f.key }))}
        </div>
      </div>
    </section>

    <!-- ЛИСТ 02 · Почему это важно здесь -->
    <section class="section">
      <div class="container">
        ${raw(sectionHead({
          sheet: '02', label: 'Ситуация в регионе',
          title: r.localTitle,
          text: r.localText,
          action: { title: 'Посчитать окупаемость склада', url: '/#okupaemost' },
        }))}
      </div>
    </section>

    <!-- ЛИСТ 03 · Каталог -->
    <section class="section section--sheet">
      <div class="container">
        ${raw(sectionHead({
          sheet: '03', label: `Что строим в регионе — ${r.city}`,
          title: regions.commonTitle,
          text: regions.commonText,
          action: { title: 'Весь каталог', url: '/katalog/' },
        }))}
        <div class="grid grid--3">
          ${products.items.map((p) => productCard(p))}
        </div>
      </div>
    </section>

    <!-- ЛИСТ 04 · Логистика -->
    <section class="section noise">
      <div class="container">
        ${raw(sectionHead({
          sheet: '04', label: 'Логистика',
          title: r.logisticsTitle,
          text: r.logisticsText,
          action: { title: 'Как устроен процесс', url: '/process/' },
        }))}
      </div>
    </section>

    <!-- ЛИСТ 05 · Завод в регионе -->
    <section class="section section--sheet">
      <div class="container">
        ${raw(sectionHead({
          sheet: '05', label: 'Отличие',
          title: regions.whyTitle,
          split: false,
        }))}
        <div class="grid grid--4">
          ${regions.why.map((w) => html`
            <div class="scope" data-reveal>
              <h3 class="scope__title">${w.title}</h3>
              <p class="scope__text">${w.text}</p>
            </div>
          `)}
        </div>
      </div>
    </section>

    ${raw(ctaBand(site, {
      title: raw(regions.ctaTitle),
      text: regions.ctaText,
      secondary: { title: 'Профили ПСУ и ПС', url: '/profili/' },
    }))}
  `;

  return layout(site, {
    url,
    title: r.seoTitle,
    description: r.seoDescription,
    image: 'grain-ext',
    crumbs,
    schema: [{
      '@type': 'Service',
      '@id': `${site.url}${url}#service`,
      name: `Металлоконструкции и зернохранилища — ${r.city}`,
      serviceType: 'Изготовление и монтаж металлоконструкций',
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
