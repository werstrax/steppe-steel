/**
 * /proektirovshchikam/ (ТЗ §9): сотрудничество с проектными организациями.
 * Контент — designers.json (сверен с документами завода).
 */

import { layout, html, raw } from '../lib/layout.mjs';
import { pageHero, sectionHead, stat, faq, ctaBand, specs, iconArrow, docRow } from '../lib/components.mjs';
import { faqNode, serviceNode } from '../lib/schema.mjs';
import { picture } from '../lib/util.mjs';

export function renderDesigners(d) {
  const { site, designers } = d;
  const p = designers;
  const crumbList = [
    { title: 'Главная', url: '/' },
    { title: 'Проектировщикам', url: '/proektirovshchikam/' },
  ];

  const content = html`
    ${pageHero({
      label: p.heroLabel,
      titleHtml: p.heroTitle,
      text: p.heroText,
      crumbList,
    })}

    <section class="section section--flush-top">
      <div class="container">
        ${sectionHead({ label: p.valueKicker, title: p.valueTitle, text: p.valueText })}
        <div class="hero__stats hero__stats--flat">
          ${p.values.map((v) => stat(v))}
        </div>
      </div>
    </section>

    <section class="section section--tint">
      <div class="container">
        ${sectionHead({ label: p.scopeKicker, title: p.scopeTitle, text: p.scopeText })}
        <div class="scope-grid">
          ${p.scope.map(
            (s) => html`
              <div class="scope-card" data-reveal>
                <span class="scope-card__num mono">${s.num}</span>
                <h3 class="scope-card__title">${s.title}</h3>
                <p class="scope-card__text">${s.text}</p>
              </div>
            `
          )}
        </div>
      </div>
    </section>

    <section class="section" id="formaty">
      <div class="container">
        ${sectionHead({ label: p.formatsKicker, title: p.formatsTitle, text: p.formatsText })}
        <div class="tabs" data-tabs>
          <div class="tabs__list mono" role="tablist" aria-label="Форматы сотрудничества">
            ${p.formats.map(
              (f, i) => html`
                <button class="tabs__btn" role="tab" id="tab-${f.key}" aria-controls="panel-${f.key}"
                  aria-selected="${i === 0 ? 'true' : 'false'}" ${raw(i === 0 ? '' : 'tabindex="-1"')}>${f.tab}</button>
              `
            )}
          </div>
          ${p.formats.map(
            (f, i) => html`
              <div class="tabs__panel" role="tabpanel" id="panel-${f.key}" aria-labelledby="tab-${f.key}" ${raw(i === 0 ? '' : 'hidden')}>
                <h3 class="tabs__title">${f.title}</h3>
                <p>${f.text}</p>
                <div class="tabs__cols">
                  <div>
                    <h4 class="tabs__col-title mono">Вы</h4>
                    <ul class="check-list">${f.you.map((x) => html`<li>${x}</li>`)}</ul>
                  </div>
                  <div>
                    <h4 class="tabs__col-title mono">Завод</h4>
                    <ul class="check-list">${f.us.map((x) => html`<li>${x}</li>`)}</ul>
                  </div>
                </div>
              </div>
            `
          )}
        </div>
      </div>
    </section>

    <section class="section section--dark">
      <div class="container split split--even">
        <div class="stack" data-reveal>
          <p class="eyebrow mono">${p.bonusKicker}</p>
          <h2 class="section-head__title">${p.bonusTitle}</h2>
          <p>${p.bonusText}</p>
          <p class="note note--dark mono">${p.bonusNote}</p>
        </div>
        <div class="stack" data-reveal>
          <p class="eyebrow mono">${p.ethicsKicker}</p>
          <h2 class="section-head__title">${p.ethicsTitle}</h2>
          ${p.ethics.map(
            (x) => html`
              <div class="ethic">
                <h3 class="ethic__title">${x.title}</h3>
                <p class="ethic__text">${x.text}</p>
              </div>
            `
          )}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${sectionHead({ label: p.docsKicker, title: p.docsTitle, text: p.docsText })}
        <div class="grid-3">
          ${p.docs.map(
            (doc) => html`
              <div class="vol-card" data-reveal>
                <span class="vol-card__code mono">${doc.code}</span>
                <span class="vol-card__vol">${doc.vol}</span>
                <h3 class="vol-card__title">${doc.title}</h3>
                <p class="vol-card__text">${doc.text}</p>
              </div>
            `
          )}
        </div>
        <p class="note" data-reveal>${p.docsNote}</p>
      </div>
    </section>

    <section class="section section--tint">
      <div class="container">
        ${sectionHead({ label: p.normsKicker, title: p.normsTitle, text: p.normsText })}
        <div class="norm-grid">
          ${p.norms.map(
            (n) => html`
              <div class="norm" data-reveal>
                <span class="norm__code mono">${n.code}</span>
                <span class="norm__text">${n.text}</span>
              </div>
            `
          )}
        </div>
      </div>
    </section>

    <section class="section" id="sertifikat">
      <div class="container split">
        <div class="stack" data-reveal>
          <p class="eyebrow mono">${p.certKicker}</p>
          <h2 class="section-head__title">${p.certTitle}</h2>
          <p>${p.certText}</p>
          ${specs([
            { key: 'Номер', val: p.cert.number },
            { key: 'Действие', val: p.cert.valid },
            { key: 'Выдан', val: p.cert.org },
            { key: 'Стандарт', val: p.cert.standard },
            { key: 'Сортамент', val: p.cert.items },
            { key: 'Держатель', val: p.cert.legal },
          ])}
          <p class="note mono">${p.certNote}</p>
        </div>
        <div data-reveal>
          <p class="mono side__title">${p.cert.pagesTitle}</p>
          <div class="cert-grid" data-lightbox>
            ${p.cert.pages.map(
              (pg) => html`
                <figure class="cert-page">
                  ${raw(picture(pg.img, { alt: pg.alt, sizes: '(min-width: 720px) 180px, 45vw' }))}
                  <figcaption class="mono">${pg.label} · ${pg.cap}</figcaption>
                </figure>
              `
            )}
          </div>
          <p class="field__hint">${p.cert.pagesNote}</p>
        </div>
      </div>
    </section>

    <section class="section section--tint">
      <div class="container">
        ${sectionHead({ label: p.startKicker, title: p.startTitle, text: p.startText })}
        <div class="grid-4">
          ${p.start.map(
            (s) => html`
              <div class="pick-card" data-reveal>
                <span class="pick-card__num mono">${s.num}</span>
                <h3 class="pick-card__title">${s.title}</h3>
                <p class="pick-card__text">${s.text}</p>
              </div>
            `
          )}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container split split--even">
        <div class="stack" data-reveal>
          <p class="eyebrow mono">${p.objectsKicker}</p>
          <h2 class="section-head__title">${p.objectsTitle}</h2>
          <ul class="check-list">
            ${p.objects.map((o) => html`<li>${o}</li>`)}
          </ul>
          <p><a class="arrow-link" href="/dokumentaciya/#tehbiblioteka">Техническая библиотека Steppe Steel ${iconArrow}</a></p>
        </div>
        <div class="stack" data-reveal>
          <p class="eyebrow mono">Материалы</p>
          <h2 class="section-head__title">${p.downloadsTitle}</h2>
          <div class="docs">
            ${p.downloads.map((doc) => docRow(doc))}
          </div>
        </div>
      </div>
    </section>

    <section class="section section--tint">
      <div class="container container--narrow">
        ${sectionHead({ label: 'Вопросы', title: 'Проектировщики спрашивают', split: false })}
        ${faq(p.faq, { idPrefix: 'faq-des' })}
      </div>
    </section>

    ${ctaBand(site, {
      title: p.ctaTitle,
      text: p.ctaText,
      primary: { title: 'Прислать объект на проработку', url: '/raschet/?type=project' },
    })}
  `;

  return layout(
    site,
    {
      url: '/proektirovshchikam/',
      title: p.seoTitle,
      description: p.seoDescription,
      crumbs: crumbList,
      schema: [
        serviceNode(site, {
          url: '/proektirovshchikam/',
          title: 'Конструктив для проектных организаций',
          serviceType: 'Разработка КМ и КМД',
          summary: p.heroText,
        }),
        faqNode(site, '/proektirovshchikam/', p.faq),
      ],
    },
    content
  );
}
