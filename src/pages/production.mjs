/**
 * /proizvodstvo/ (ТЗ §12): реальный завод — переделы, контроль, комплектация,
 * процесс заказа. Слоты под реальные фото: пока кадра нет — плашка-схема.
 */

import { layout, html, raw } from '../lib/layout.mjs';
import { pageHero, sectionHead, step, stat, faq, ctaBand, photoSlot, vizTag } from '../lib/components.mjs';
import { serviceNode, faqNode, howToNode } from '../lib/schema.mjs';
import { hasImage, picture } from '../lib/util.mjs';

export function renderProduction(d) {
  const { site, production } = d;
  const crumbList = [
    { title: 'Главная', url: '/' },
    { title: 'Производство', url: '/proizvodstvo/' },
  ];

  const content = html`
    ${pageHero({
      image: 'prod-profil',
      label: production.kicker,
      titleHtml: production.title,
      text: production.lead,
      crumbList,
    })}

    <section class="section section--flush-top">
      <div class="container">
        <div class="hero__stats hero__stats--flat">${production.stats.map((s) => stat(s))}</div>
      </div>
    </section>

    <section class="section section--tint">
      <div class="container">
        ${sectionHead({
          label: 'Переделы',
          title: 'Путь металла по площадке',
          text: 'Шесть участков — одна цепочка. Реальные фото и видео с производства завод передаёт постепенно: слоты под них уже готовы.',
        })}
        <div class="prod-grid">
          ${production.sections.map(
            (s, i) => html`
              <article class="prod-card" id="${s.id}" data-reveal>
                <div class="prod-card__media">
                  ${hasImage(s.photoSlot)
                    ? raw(picture(s.photoSlot, { alt: `${s.title} — производство Steppe Steel`, sizes: '(min-width: 900px) 50vw, 100vw' }))
                    : raw(photoSlot(s.photoSlot, { label: 'Фото производства в обработке', alt: s.title }))}
                  ${s.photoViz && hasImage(s.photoSlot) ? vizTag() : ''}
                </div>
                <div class="prod-card__body">
                  <span class="prod-card__num mono">${String(i + 1).padStart(2, '0')}</span>
                  <h2 class="prod-card__title">${s.title}</h2>
                  <p class="prod-card__text">${s.text}</p>
                </div>
              </article>
            `
          )}
        </div>
      </div>
    </section>

    <section class="section" id="process">
      <div class="container">
        ${sectionHead({
          label: production.process.kicker,
          title: production.process.title,
          text: production.process.intro,
        })}
        <div class="steps">
          ${production.process.steps.map((s, i) => step(s, i))}
        </div>
        <p class="note mono" data-reveal>${production.process.note}</p>
      </div>
    </section>

    <section class="section section--tint">
      <div class="container container--narrow">
        ${sectionHead({ label: 'Вопросы', title: 'О производстве спрашивают', split: false })}
        ${faq(production.faq, { idPrefix: 'faq-prod' })}
      </div>
    </section>

    ${ctaBand(site, {
      title: 'Убедитесь сами',
      text: 'Приезжайте на производство в с. Троебратское или запросите расчёт — инженер покажет, как ваш заказ пройдёт по этой цепочке.',
    })}
  `;

  return layout(
    site,
    {
      url: '/proizvodstvo/',
      title: production.seoTitle,
      description: production.seoDescription,
      crumbs: crumbList,
      schema: [
        serviceNode(site, {
          url: '/proizvodstvo/',
          title: 'Производство металлоконструкций',
          serviceType: 'Производство металлоконструкций',
          summary: production.lead,
          includes: production.sections.map((s) => s.title),
        }),
        faqNode(site, '/proizvodstvo/', production.faq),
        howToNode(site, '/proizvodstvo/', production.process.steps, 'Как заказать здание на заводе Steppe Steel'),
      ],
    },
    content
  );
}
