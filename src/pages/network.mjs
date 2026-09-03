/**
 * /partneram/ (ТЗ §10): региональная партнёрская сеть Steppe Steel.
 * Контент — network.json. Форма партнёрского предложения — по полям ТЗ.
 */

import { layout, html, raw } from '../lib/layout.mjs';
import { pageHero, sectionHead, stat, faq, ctaBand, docRow, iconArrow, iconWhatsApp, kzMap } from '../lib/components.mjs';
import { faqNode, serviceNode } from '../lib/schema.mjs';

export function renderNetwork(d) {
  const { site, network } = d;
  const n = network;
  const crumbList = [
    { title: 'Главная', url: '/' },
    { title: 'Партнёрам', url: '/partneram/' },
  ];

  const content = html`
    ${pageHero({
      label: n.heroLabel,
      titleHtml: n.heroTitle,
      text: n.heroText,
      crumbList,
      actions: html`
        <a class="btn btn--primary btn--lg" href="#partner-form">Получить партнёрское предложение</a>
        <a class="btn btn--ghost btn--lg" href="/proizvodstvo/">Смотреть производство</a>
      `,
    })}

    <section class="section section--flush-top">
      <div class="container">
        ${sectionHead({ label: n.flowKicker, title: n.flowTitle, text: 'Оранжевой меткой ₸ отмечены этапы, на которых партнёр зарабатывает.' })}
        <ol class="flow">
          ${n.flow.map(
            (f) => html`
              <li class="${f.side === 'factory' ? 'flow__item flow__item--factory' : 'flow__item flow__item--partner'}" data-reveal>
                <span class="flow__num mono">${f.n}</span>
                <span class="flow__side mono">${f.side === 'factory' ? 'Завод' : 'Партнёр'}${f.income ? raw(' <b class="flow__income">₸</b>') : ''}</span>
                <h3 class="flow__title">${f.title}</h3>
                <p class="flow__text">${f.text}</p>
              </li>
            `
          )}
        </ol>
      </div>
    </section>

    <section class="section section--dark">
      <div class="container">
        ${sectionHead({ label: n.moneyKicker, title: n.moneyTitle, text: n.moneyText })}
        <div class="grid-3">
          ${n.money.map(
            (m) => html`
              <div class="money-card" data-reveal>
                <span class="money-card__num mono">${m.n}</span>
                <h3 class="money-card__title">${m.title}</h3>
                <p class="money-card__text">${m.text}</p>
              </div>
            `
          )}
        </div>
        <p class="note note--dark" data-reveal>${n.moneyNote}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${sectionHead({ label: n.giveKicker, title: n.giveTitle })}
        <div class="feat-grid feat-grid--3">
          ${n.give.map(
            (g) => html`
              <div class="feat" data-reveal>
                <h3 class="feat__title">${g.title}</h3>
                <p class="feat__text">${g.text}</p>
              </div>
            `
          )}
        </div>
      </div>
    </section>

    <section class="section section--tint">
      <div class="container split split--even">
        <div class="stack" data-reveal>
          <p class="eyebrow mono">${n.whoKicker}</p>
          <h2 class="section-head__title">${n.whoTitle}</h2>
          <p>${n.whoText}</p>
          <div class="hero__stats hero__stats--flat">
            ${n.who.map((w) => stat(w))}
          </div>
        </div>
        <div class="stack" data-reveal>
          <p class="eyebrow mono">${n.flagKicker}</p>
          <h2 class="section-head__title">${n.flagTitle}</h2>
          <p>${n.flagText}</p>
          ${n.flags.map(
            (f) => html`
              <a class="flag-link" href="${f.url}">
                <span>
                  <h3 class="flag-link__title">${f.title}</h3>
                  <span class="flag-link__text">${f.text}</span>
                </span>
                <span aria-hidden="true">${iconArrow}</span>
              </a>
            `
          )}
          <p class="field__hint">${n.flagNote}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${sectionHead({ label: n.supportKicker, title: n.supportTitle, text: n.supportText })}
        <div class="hero__stats hero__stats--flat">
          ${n.support.map((s) => stat(s))}
        </div>
      </div>
    </section>

    <section class="section" id="geografiya">
      <div class="container">
        ${sectionHead({
          label: 'География',
          title: 'Представители по Казахстану',
          text: 'Завод — в Троебратском Костанайской области, зона самой быстрой доставки — Костанайская, Северо-Казахстанская и Акмолинская области. Территория партнёра закрепляется договором; подключённые регионы появятся на карте.',
        })}
        <div data-reveal>${kzMap()}</div>
      </div>
    </section>

    <section class="section section--tint">
      <div class="container">
        ${sectionHead({ label: n.startKicker, title: n.startTitle, text: n.startText })}
        <div class="grid-4">
          ${n.start.map(
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

    <section class="section" id="partner-form">
      <div class="container container--narrow">
        ${sectionHead({ label: 'Заявка', title: 'Получить партнёрское предложение', split: false,
          text: 'Заполните форму — предложим формат совместной работы и разберём первый проект. Отправка откроет WhatsApp с готовым сообщением.' })}
        <form class="form" data-partner-form novalidate>
          <div class="form__grid">
            <label class="field"><span class="field__label">Имя *</span>
              <input class="field__input" name="name" autocomplete="name" required></label>
            <label class="field"><span class="field__label">Компания *</span>
              <input class="field__input" name="company" autocomplete="organization" required></label>
            <label class="field"><span class="field__label">Город / регион *</span>
              <input class="field__input" name="region" required></label>
            <label class="field"><span class="field__label">Телефон *</span>
              <input class="field__input" name="phone" type="tel" autocomplete="tel" inputmode="tel" required></label>
            <label class="field"><span class="field__label">WhatsApp</span>
              <input class="field__input" name="whatsapp" type="tel" inputmode="tel" placeholder="если отличается от телефона"></label>
            <label class="field"><span class="field__label">E-mail</span>
              <input class="field__input" name="email" type="email" autocomplete="email"></label>
          </div>
          <label class="field"><span class="field__label">Комментарий</span>
            <textarea class="field__input" name="comment" rows="4" placeholder="Команда, объекты, что готовы вести"></textarea></label>
          <input type="text" name="website" class="u-visually-hidden" tabindex="-1" autocomplete="off" aria-hidden="true">
          <div class="btn-row">
            <button class="btn btn--primary btn--lg" type="submit">Отправить заявку</button>
            <a class="btn btn--wa btn--lg" href="${site.contacts.whatsapp}?text=${encodeURIComponent('Здравствуйте! Интересует региональное партнёрство Steppe Steel.')}" target="_blank" rel="noopener" data-goal="wa_click">
              ${iconWhatsApp}<span>Написать напрямую</span>
            </a>
          </div>
          <p class="field__hint">Отправляя форму, вы соглашаетесь с <a href="/privacy/">политикой конфиденциальности</a>.</p>
          <p class="form__status" data-form-status aria-live="polite" hidden></p>
        </form>
      </div>
    </section>

    <section class="section section--tint">
      <div class="container split split--even">
        <div class="stack" data-reveal>
          <p class="eyebrow mono">Материалы</p>
          <h2 class="section-head__title">${n.downloadsTitle}</h2>
          <div class="docs">${n.downloads.map((doc) => docRow(doc))}</div>
        </div>
        <div class="stack" data-reveal>
          <p class="eyebrow mono">Вопросы</p>
          <h2 class="section-head__title">Будущие партнёры спрашивают</h2>
          ${faq(n.faq.slice(0, 4), { idPrefix: 'faq-net' })}
        </div>
      </div>
    </section>

    ${ctaBand(site, { title: n.ctaTitle, text: n.ctaText, primary: { title: 'Получить партнёрское предложение', url: '#partner-form' } })}
  `;

  return layout(
    site,
    {
      url: '/partneram/',
      title: n.seoTitle,
      description: n.seoDescription,
      crumbs: crumbList,
      schema: [
        serviceNode(site, {
          url: '/partneram/',
          title: 'Региональная партнёрская программа Steppe Steel',
          serviceType: 'Партнёрская программа завода металлоконструкций',
          summary: n.heroText,
        }),
        faqNode(site, '/partneram/', n.faq),
      ],
    },
    content
  );
}
