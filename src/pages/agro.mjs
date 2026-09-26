/**
 * /agrariyam/ (ТЗ §7): хаб для аграриев — эффективность готового объекта,
 * модульное расширение, калькулятор окупаемости «свой склад vs элеватор».
 */

import { layout, html, raw } from '../lib/layout.mjs';
import { pageHero, sectionHead, stat, faq, ctaBand, iconArrow, grainCalcBlock, modularScheme, factoryBand } from '../lib/components.mjs';
import { faqNode } from '../lib/schema.mjs';

export function renderAgro(d) {
  const { site, agrarians, payback } = d;
  const a = agrarians;
  const p = site.proof;
  const crumbList = [
    { title: 'Главная', url: '/' },
    { title: 'Аграриям', url: '/agrariyam/' },
  ];
  /* WhatsApp с шаблоном под страницу (разбор 11.09, п.8) — ссылка как в components.mjs. */
  const waText = a.waText || site.contacts.whatsappText;
  const waHref = `${site.contacts.whatsapp}?text=${encodeURIComponent(waText)}`;
  const content = html`
    ${pageHero({
      image: 'drone-grain-gable',
      imageAlt: 'Напольное зернохранилище на каркасе завода, вид с дрона',
      imageCaption: 'Объект завода, сентябрь 2026',
      label: 'Здания для хозяйств',
      titleHtml: a.heroTitle,
      text: a.heroLead,
      offer: a.heroMeta,
      crumbList,
      actions: html`
        <a class="btn btn--primary btn--lg" href="#calc">Рассчитать под мой тоннаж</a>
        <a class="btn btn--ghost btn--lg" href="${waHref}" target="_blank" rel="noopener" data-goal="wa_click">Написать в WhatsApp</a>
        <a class="arrow-link hero-doc" href="/assets/docs/steppe-steel-zernohranilishcha.pdf" download data-goal="pdf_download">Презентация зернохранилища · PDF ${iconArrow}</a>
      `,
    })}

    ${a.harvest
      ? html`
          <section class="section section--flush-top" id="sroki">
            <div class="container">
              ${sectionHead({ label: a.harvest.label, title: a.harvest.title, split: false })}
              <div class="hero__stats hero__stats--flat">
                ${a.harvest.stages.map((s) => stat(s))}
              </div>
              ${a.harvest.notes?.length
                ? html`<p class="note" data-reveal>${a.harvest.notes.map((n, i) => html`${i ? raw('<br>') : ''}${n}`)}</p>`
                : ''}
            </div>
          </section>
        `
      : ''}

    <section class="section section--flush-top">
      <div class="container container--narrow stack">
        ${(a.intro || []).map((par) => html`<p class="text-lg" data-reveal>${par}</p>`)}
      </div>
    </section>

    ${factoryBand(site)}

    <section class="section section--tint">
      <div class="container">
        ${sectionHead({
          label: 'Направления',
          title: 'Постройки хозяйства — с одного завода',
          text: 'Каждое направление — отдельная страница с конструктивом и параметрами.',
        })}
        <div class="sol-list">
          ${a.directions.map((dir, i) =>
            dir.slug
              ? html`
                  <a class="sol-row" href="/resheniya/${dir.slug}/" data-reveal>
                    <span class="sol-row__num mono">${String(i + 1).padStart(2, '0')}</span>
                    <span class="sol-row__body">
                      <h3 class="sol-row__title">${dir.title}</h3>
                      <span class="sol-row__summary">${dir.d}</span>
                    </span>
                    <span class="sol-row__arrow" aria-hidden="true">${iconArrow}</span>
                  </a>
                `
              : html`
                  <div class="sol-row sol-row--static" data-reveal>
                    <span class="sol-row__num mono">${String(i + 1).padStart(2, '0')}</span>
                    <span class="sol-row__body">
                      <h3 class="sol-row__title">${dir.title}</h3>
                      <span class="sol-row__summary">${dir.d}</span>
                    </span>
                  </div>
                `
          )}
        </div>
      </div>
    </section>

    <section class="section" id="modulnost">
      <div class="container split split--even">
        <div class="stack" data-reveal>
          <p class="eyebrow mono">Модульность</p>
          <h2 class="section-head__title">${a.modularity.title}</h2>
          ${a.modularity.text.map((par) => html`<p>${par}</p>`)}
          <div><a class="arrow-link" href="/resheniya/modulnye-zdaniya/">Модульные здания ${iconArrow}</a></div>
        </div>
        <div class="modular-wrap" data-reveal>${modularScheme()}</div>
      </div>
    </section>

    <section class="section section--dark">
      <div class="container">
        ${sectionHead({
          label: 'Контекст',
          title: 'Хранение — узкое место урожая',
          text: 'Урожай Костанайской области 2025 года — kstnews.kz, inbusiness.kz; ёмкости хранения на 18.08.2026 — Qoldau.kz и primeminister.kz.',
        })}
        <div class="hero__stats hero__stats--dark">
          <div class="stat" data-reveal><span class="stat__val">${p.kostanayHarvest}</span><span class="stat__key">зерна собрала Костанайская область в 2025 году</span></div>
          <div class="stat" data-reveal><span class="stat__val">${p.farmCapacity}</span><span class="stat__key">ёмкостей хранения — у самих хозяйств РК</span></div>
          <div class="stat" data-reveal><span class="stat__val">${p.licensedCapacity}</span><span class="stat__key">— все лицензированные элеваторы страны</span></div>
          <div class="stat" data-reveal><span class="stat__val">${p.maxLength}</span><span class="stat__key">длина зернохранилища Steppe Steel секциями</span></div>
        </div>
        <p class="note note--dark mono" data-reveal>Своё хранение у хозяйств уже больше мощностей всех элеваторов — рынок голосует за склад на своей земле.</p>
      </div>
    </section>

    ${raw(grainCalcBlock())}

    <section class="section section--tint" id="okupaemost">
      <div class="container">
        ${sectionHead({ label: payback.kicker, title: payback.title, text: payback.text })}
        <div class="payback" data-payback data-reveal>
          <div class="payback__fields">
            ${payback.fields.map(
              (f) => html`
                <label class="field">
                  <span class="field__label">${f.label} <span class="field__unit mono">${f.unit}</span></span>
                  <input class="field__input" type="number" inputmode="numeric" data-pb="${f.id}"
                         value="${f.value}" min="${f.min}" max="${f.max}" step="${f.step}">
                  <span class="field__hint">${f.hint}</span>
                </label>
              `
            )}
          </div>
          <div class="payback__result" aria-live="polite">
            <div class="payback__row">
              <span>${payback.resultLabel}</span>
              <strong class="mono" data-pb-season>—</strong>
            </div>
            <ul class="payback__breakdown mono" data-pb-breakdown></ul>
            <div class="payback__row payback__row--main" data-pb-payback-row hidden>
              <span>${payback.paybackLabel}</span>
              <strong class="mono" data-pb-payback>—</strong>
            </div>
            <a class="btn btn--primary btn--wide" data-pb-cta
               href="${site.contacts.whatsapp}?text=${encodeURIComponent(payback.waText)}"
               target="_blank" rel="noopener" data-goal="wa_click">${payback.ctaTitle}</a>
            <p class="field__hint">${payback.ctaText}</p>
          </div>
        </div>
        <p class="note mono" data-reveal>${payback.note}</p>
        <div class="grid-4" style="margin-top:var(--gap)">
          ${payback.beyond.map(
            (b) => html`
              <div class="pick-card" data-reveal>
                <h3 class="pick-card__title">${b.title}</h3>
                <p class="pick-card__text">${b.text}</p>
              </div>
            `
          )}
        </div>
      </div>
    </section>

    ${a.faq?.length
      ? html`
          <section class="section">
            <div class="container container--narrow">
              ${sectionHead({ label: 'Вопросы', title: 'Аграрии спрашивают', split: false })}
              ${faq(a.faq, { idPrefix: 'faq-agro' })}
            </div>
          </section>
        `
      : ''}

    ${ctaBand(site, {
      title: 'Посчитаем под ваше хозяйство',
      text: 'Культура, объём, площадка — инженер вернёт расчёт здания и спецификацию. Расширение секциями заложим в проект сразу.',
      waText,
      calcUrl: '/raschet/?type=zernohranilishcha',
    })}
  `;

  return layout(
    site,
    {
      url: '/agrariyam/',
      title: a.seoTitle,
      description: a.seoDescription,
      crumbs: crumbList,
      waText,
      calcType: 'zernohranilishcha',
      schema: [faqNode(site, '/agrariyam/', a.faq)],
    },
    content
  );
}
