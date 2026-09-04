/**
 * /stroitelnym-kompaniyam/ (ТЗ §8): субподряд по металлокаркасу.
 * «Вы строите — Steppe Steel проектирует и производит металлокаркас».
 */

import { layout, html } from '../lib/layout.mjs';
import { pageHero, sectionHead, step, faq, ctaBand, iconArrow } from '../lib/components.mjs';
import { serviceNode, faqNode, howToNode } from '../lib/schema.mjs';

export function renderBuilders(d) {
  const { site, builders } = d;
  const b = builders;
  const crumbList = [
    { title: 'Главная', url: '/' },
    { title: 'Строительным компаниям', url: '/stroitelnym-kompaniyam/' },
  ];

  const content = html`
    ${pageHero({
      image: 'sol-proizvodstvennye-zdaniya',
      label: 'Строительным компаниям',
      titleHtml: b.heroTitle,
      text: b.heroLead,
      crumbList,
      actions: html`
        <a class="btn btn--primary btn--lg" href="/raschet/?type=builder">Получить условия сотрудничества</a>
        <a class="btn btn--ghost btn--lg" href="/proizvodstvo/">Смотреть производство</a>
      `,
    })}

    <section class="section section--flush-top">
      <div class="container">
        ${sectionHead({
          label: 'Схема сотрудничества',
          title: 'Семь шагов от исходных данных до объекта',
          text: 'Передаёте проект или исходные данные — забираете комплект каркаса с документацией и поддержкой на монтаже.',
        })}
        <div class="steps">
          ${b.steps.map((s, i) => step({ title: s.t, text: s.d }, i))}
        </div>
      </div>
    </section>

    <section class="section section--tint">
      <div class="container">
        ${sectionHead({ label: 'Что это даёт', title: 'Выгоды генподрядчика' })}
        <div class="feat-grid">
          ${b.benefits.map(
            (f) => html`
              <div class="feat" data-reveal>
                <h3 class="feat__title">${f.t}</h3>
                <p class="feat__text">${f.d}</p>
              </div>
            `
          )}
        </div>
      </div>
    </section>

    ${b.forms?.length
      ? html`
          <section class="section">
            <div class="container">
              ${sectionHead({ label: 'Форматы', title: 'Как можно работать с заводом' })}
              <div class="grid-3">
                ${b.forms.map(
                  (f) => html`
                    <div class="sub-card" data-reveal>
                      <h3 class="sub-card__title">${f.t}</h3>
                      <p class="sub-card__text">${f.d}</p>
                    </div>
                  `
                )}
              </div>
              <p class="note" data-reveal>
                Строите системно в своём регионе? Посмотрите
                <a href="/partneram/">региональную партнёрскую программу</a> — запросы
                по закреплённой территории и поддержка завода.
              </p>
            </div>
          </section>
        `
      : ''}

    ${b.faq?.length
      ? html`
          <section class="section section--tint">
            <div class="container container--narrow">
              ${sectionHead({ label: 'Вопросы', title: 'Подрядчики спрашивают', split: false })}
              ${faq(b.faq, { idPrefix: 'faq-build' })}
            </div>
          </section>
        `
      : ''}

    ${ctaBand(site, {
      title: 'Пришлите проект на расчёт',
      text: 'Пришлите проект или исходные данные объекта — вернём расчёт каркаса, сроки производства и условия для подрядчика.',
      primary: { title: 'Стать партнёром Steppe Steel', url: '/raschet/?type=builder' },
    })}
  `;

  return layout(
    site,
    {
      url: '/stroitelnym-kompaniyam/',
      title: b.seoTitle,
      description: b.seoDescription,
      crumbs: crumbList,
      schema: [
        serviceNode(site, {
          url: '/stroitelnym-kompaniyam/',
          title: 'Изготовление металлоконструкций для строительных компаний',
          serviceType: 'Изготовление металлоконструкций на заказ',
          summary: b.heroLead,
        }),
        faqNode(site, '/stroitelnym-kompaniyam/', b.faq),
        howToNode(site, '/stroitelnym-kompaniyam/', b.steps.map((s) => ({ title: s.t, text: s.d })), 'Схема работы строительной компании с заводом Steppe Steel'),
      ],
    },
    content
  );
}
