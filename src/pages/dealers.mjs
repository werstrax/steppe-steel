/**
 * /predstavitelyam/ — партнёрская сеть для строительных компаний.
 *
 * Фирменная фича страницы — «полоса ответственности»: путь объекта одной
 * лентой, где этапы стоят на дорожке завода или партнёра, а значок ₸
 * отмечает участки, на которых партнёр зарабатывает.
 */

import { layout } from '../lib/layout.mjs';
import { html, raw, e, picture } from '../lib/util.mjs';
import { pageHero, ctaBand, sectionHead, faq, stat, vizTag, audienceSwitch } from '../lib/components.mjs';

export function renderDealers(d) {
  const { site, dealers } = d;

  const content = html`
    ${raw(pageHero({
      label: dealers.heroLabel,
      titleHtml: raw(dealers.heroTitle),
      crumbList: [{ title: 'Главная', url: '/' }, { title: 'Строительным компаниям', url: '/predstavitelyam/' }],
      text: dealers.heroText,
    }))}

    ${raw(audienceSwitch('/predstavitelyam/'))}

    <!-- ЛИСТ 01 · Полоса ответственности -->
    <section class="section section--tight" id="raboty">
      <div class="container">
        ${raw(sectionHead({
          sheet: '01', label: dealers.flowKicker,
          title: dealers.flowTitle,
          text: dealers.flowText,
        }))}

        <div class="lane" data-reveal>
          <div class="lane__legend" role="group" aria-label="Подсветка зоны ответственности">
            <button type="button" class="lane__key is-active" data-lane-key="all" aria-pressed="true">Все этапы</button>
            <button type="button" class="lane__key lane__key--factory" data-lane-key="factory" aria-pressed="false">Steppe Steel</button>
            <button type="button" class="lane__key lane__key--partner" data-lane-key="partner" aria-pressed="false">Партнёр</button>
          </div>

          <div class="lane__viewport">
            <div class="lane__scroll">
            <ol class="lane__track">
              ${dealers.flow.map((s) => html`
                <li class="lane__cell lane__cell--${s.side}">
                  <div class="lane__step" tabindex="0">
                    <p class="lane__num mono">${s.n}${s.income ? raw(' <span class="lane__coin" title="Этап дохода партнёра">₸</span>') : ''}</p>
                    <h3 class="lane__title">${s.title}</h3>
                    <p class="lane__text">${s.text}</p>
                  </div>
                </li>
              `)}
            </ol>
              <div class="lane__axis" aria-hidden="true">
                <span class="lane__axis-label mono lane__axis-label--top">Завод</span>
                <span class="lane__axis-label mono lane__axis-label--bot">Партнёр</span>
              </div>
            </div>
          </div>
          <p class="lane__hint sheet-note">${e(dealers.flowHint)}</p>
        </div>
      </div>
    </section>

    <!-- ЛИСТ 02 · Экономика партнёра -->
    <section class="section section--sheet" id="ekonomika">
      <div class="container">
        ${raw(sectionHead({
          sheet: '02', label: dealers.moneyKicker,
          title: dealers.moneyTitle,
          text: dealers.moneyText,
        }))}
        <div class="grid grid--3">
          ${dealers.money.map((m) => html`
            <div class="money" data-reveal>
              <p class="money__num mono">${m.n}</p>
              <h3 class="money__title">${m.title}</h3>
              <p class="money__text">${m.text}</p>
            </div>
          `)}
        </div>
        <p class="sheet-note" style="margin-top:1.75rem">${e(dealers.moneyNote)}</p>
      </div>
    </section>

    <!-- ЛИСТ 03 · Флагманы -->
    <section class="section noise" id="flagmany">
      <div class="container">
        ${raw(sectionHead({
          sheet: '03', label: dealers.flagKicker,
          title: dealers.flagTitle,
          text: dealers.flagText,
        }))}
        <div class="grid grid--2">
          ${dealers.flags.map((f) => html`
            <a class="flag" href="${f.url}" data-reveal>
              <span class="flag__media">
                ${raw(picture(f.img, { alt: f.alt, sizes: '(min-width: 900px) 50vw, 100vw' }))}
                ${vizTag()}
              </span>
              <span class="flag__body">
                <span class="flag__title">${f.title}</span>
                <span class="flag__text">${f.text}</span>
              </span>
            </a>
          `)}
        </div>
        <p class="sheet-note" style="margin-top:1.75rem">${e(dealers.flagNote)}</p>
      </div>
    </section>

    <!-- ЛИСТ 04 · Что даёт завод -->
    <section class="section section--sheet">
      <div class="container">
        ${raw(sectionHead({
          sheet: '04', label: dealers.giveKicker,
          title: dealers.giveTitle,
          split: false,
        }))}
        <div class="grid grid--3">
          ${dealers.give.map((g) => html`
            <div class="scope" data-reveal>
              <h3 class="scope__title">${g.title}</h3>
              <p class="scope__text">${g.text}</p>
            </div>
          `)}
        </div>
      </div>
    </section>

    <!-- Кого ищем: оранжевая плашка + требования -->
    <section class="duo duo--flat" aria-labelledby="who-title">
      <div class="duo__panel">
        <p class="duo__kicker mono">${dealers.whoKicker}</p>
        <h2 class="duo__title" id="who-title">${dealers.whoTitle}</h2>
        <p class="duo__text">${dealers.whoText}</p>
        <a class="btn btn--dark btn--lg" href="#start">С чего начинаем</a>
      </div>
      <div class="duo__panel duo__panel--dark">
        <div class="grid grid--2">
          ${dealers.who.map((w) => stat({ val: w.val, key: w.key }))}
        </div>
      </div>
    </section>

    <!-- ЛИСТ 05 · Обучение и сопровождение -->
    <section class="section">
      <div class="container">
        ${raw(sectionHead({
          sheet: '05', label: dealers.supportKicker,
          title: dealers.supportTitle,
          text: dealers.supportText,
        }))}
        <div class="grid grid--4">
          ${dealers.support.map((s) => stat({ val: s.val, key: s.key }))}
        </div>
      </div>
    </section>

    <!-- ЛИСТ 06 · Как начать + материалы -->
    <section class="section section--sheet" id="start">
      <div class="container">
        ${raw(sectionHead({
          sheet: '06', label: dealers.startKicker,
          title: dealers.startTitle,
          text: dealers.startText,
        }))}
        <div class="grid grid--4">
          ${dealers.start.map((s) => html`
            <div class="scope" data-reveal>
              <p class="scope__num mono">${s.num}</p>
              <h3 class="scope__title">${s.title}</h3>
              <p class="scope__text">${s.text}</p>
            </div>
          `)}
        </div>

        <div class="dl dl--sheet" data-reveal>
          <p class="dl__head mono">${dealers.downloadsTitle}</p>
          <div class="dl__row">
            ${dealers.downloads.map((f) => html`
              <a class="dl__item" href="${f.url}" download target="_blank" rel="noopener">
                <span class="dl__icon mono" aria-hidden="true">PDF</span>
                <span class="dl__body">
                  <span class="dl__title">${f.title}</span>
                  <span class="dl__text">${f.text}</span>
                  <span class="dl__meta mono">${f.meta}</span>
                </span>
              </a>
            `)}
          </div>
        </div>
      </div>
    </section>

    <!-- ЛИСТ 07 · FAQ -->
    <section class="section">
      <div class="container">
        ${raw(sectionHead({
          sheet: '07', label: 'Вопросы партнёров',
          title: 'Что спрашивают строительные компании',
          split: false,
        }))}
        ${raw(faq(dealers.faq, { idPrefix: 'dfaq' }))}
      </div>
    </section>

    ${raw(ctaBand(site, {
      title: raw(dealers.ctaTitle),
      text: dealers.ctaText,
      primary: { title: 'Написать о своём регионе', url: '/zayavka/' },
      secondary: { title: 'Проектным организациям', url: '/partnyoram/' },
    }))}
  `;

  return layout(site, {
    url: '/predstavitelyam/',
    title: dealers.seoTitle,
    description: dealers.seoDescription,
    image: 'canopy-brand',
    crumbs: [{ title: 'Главная', url: '/' }, { title: 'Строительным компаниям', url: '/predstavitelyam/' }],
    schema: [{
      '@type': 'FAQPage',
      '@id': `${site.url}/predstavitelyam/#faq`,
      mainEntity: dealers.faq.map((qa) => ({
        '@type': 'Question',
        name: qa.q,
        acceptedAnswer: { '@type': 'Answer', text: qa.a },
      })),
    }],
  }, content);
}
