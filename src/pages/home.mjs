/**
 * STEPPESTEEL — customer-facing factory site.
 * Content is sourced from data JSON; photography from the supplied image manifest.
 */
import { layout, html, raw } from '../lib/layout.mjs';
import { sectionHead, ctaBand, iconArrow, iconCheck } from '../lib/components.mjs';
import { organizationNode, websiteNode, itemListNode, howToNode } from '../lib/schema.mjs';
import {documentShelf,engineeringExperience} from '../lib/experience.mjs';
import { hasImage, picture } from '../lib/util.mjs';

export function renderHome(d) {
  const { site, solutions, production, portfolio, documents, home } = d;
  const bySlug = Object.fromEntries(solutions.items.map(s => [s.slug, s]));
  const featured = home.featured.map(slug => bySlug[slug]).filter(Boolean);
  const other = solutions.items.filter(s => !home.featured.includes(s.slug));
  const obj = portfolio.items[0];
  const presentation = documents.categories.find(c => c.id === 'prezentacii')?.items[0];
  const content = html`
    <section class="factory-hero" aria-labelledby="factory-title">
      <div class="factory-hero__image" aria-hidden="true">${raw(picture('photo-warehouse-exterior',{alt:'',sizes:'100vw',priority:true}))}</div>
      <div class="container factory-hero__inner">
        <div class="factory-hero__copy">
          <p class="factory-hero__eyebrow"><span></span>ЗАВОД МЕТАЛЛОКОНСТРУКЦИЙ / КАЗАХСТАН</p>
          <h1 id="factory-title">От проекта —<br>до стального<br><span>каркаса.</span></h1>
          <p class="factory-hero__lead">Зернохранилища, склады, ангары и производственные здания. Проектируем, производим и поставляем по всему Казахстану.</p>
          <div class="factory-hero__actions">
            <a class="btn btn--primary" href="/raschet/">Обсудить проект ${iconArrow}</a>
            <a class="factory-hero__link" href="#engineering">Посмотреть конструкцию <span>↗</span></a>
          </div>
          <a class="factory-hero__documents" href="#documents">Презентации и сертификат ${iconArrow}</a>
        </div>
        <div class="factory-hero__location"><span class="factory-hero__location-mark">↗</span><div>ЗЕРНОХРАНИЛИЩА<small>Стальной каркас<br>и профилированная обшивка</small></div></div>
      </div>
      <div class="factory-hero__bottom"><div class="container">
        <a href="/proektirovshchikam/"><span>01</span>Проектирование КМ / КМД ${iconArrow}</a>
        <a href="/proizvodstvo/"><span>02</span>Заводское производство ${iconArrow}</a>
        <a href="/proizvodstvo/#otgruzka"><span>03</span>Комплектная поставка ${iconArrow}</a>
      </div></div>
    </section>

    <section class="pro-proof" aria-label="Возможности завода">
      <div class="container pro-proof__grid">
        ${home.proof.map(p => html`<div class="pro-proof__item">
          <div class="pro-proof__value">${p.prefix ? html`<small>${p.prefix}</small>` : ''}${p.value}<small>${p.unit}</small></div>
          <h2>${p.title}</h2><p>${p.text}</p>
        </div>`)}
      </div>
    </section>

    <section class="section" id="resheniya">
      <div class="container">
        ${sectionHead({label:'01 / Решения',title:home.solutions.title,text:home.solutions.text,action:{title:'Все решения',url:'/resheniya/'}})}
        <div class="pro-solutions">
          ${featured.map((s,i) => html`<a class="pro-solution" href="${s.url}">
            <div class="pro-solution__photo">
              ${raw(picture(s.cover || 'sol-'+s.slug,{alt:s.photoAlt || s.title,sizes:i===0?'(min-width: 1100px) 45vw, 100vw':'(min-width: 1100px) 28vw, (min-width: 640px) 50vw, 100vw'}))}
              <span class="pro-solution__index">0${i+1} / STEPPESTEEL</span>
              ${s.coverCaption ? html`<span class="solution-image-note">${s.coverCaption}</span>` : ''}
            </div>
            <div class="pro-solution__body"><h3>${s.short || s.title}</h3><span class="pro-solution__arrow">${iconArrow}</span>
              <p>${home.solutionDescriptions[s.slug]}</p>
            </div>
          </a>`)}
        </div>
        <div class="pro-other">
          ${other.map((s,i) => html`<a href="${s.url}"><span class="mono">0${i+4}</span><strong>${s.short || s.title}</strong>${iconArrow}</a>`)}
        </div>
        <div class="pro-help"><p>${home.solutions.help}</p><a class="arrow-link" href="/raschet/">Обсудить задачу ${iconArrow}</a></div>
      </div>
    </section>

    ${engineeringExperience(d)}


    <section class="section" id="tipovye">
      <div class="container">
        ${sectionHead({label:'03 / Типовые здания',title:home.typical.title,text:home.typical.text})}
        <div class="pro-typicals">
          ${solutions.hub.typical.items.map((t,i)=>html`<a class="pro-typical" href="${t.url}">
            <span class="pro-typical__label mono">ТИПОВОЕ РЕШЕНИЕ / 0${i+1}</span><h3>${t.title}</h3>
            <dl>${t.params.map(([k,v])=>html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>
            <span class="arrow-link">Параметры здания ${iconArrow}</span>
          </a>`)}
        </div>
      </div>
    </section>

    <section class="section section--tint" id="process">
      <div class="container">
        ${sectionHead({label:'04 / Порядок работы',title:home.process.title,text:home.process.text})}
        <ol class="pro-process">
          ${production.process.steps.map((s,i)=>html`<li><span class="pro-process__num">0${i+1}</span><h3>${s.title}</h3><p>${home.process.descriptions[i]}</p></li>`)}
        </ol>
        <p class="pro-process__note">${home.process.note}</p>
      </div>
    </section>

    <section class="section" id="partnyorstvo">
      <div class="container">
        ${sectionHead({label:'05 / Сотрудничество',title:home.audiencesTitle,text:home.audiencesText})}
        <div class="pro-audiences">
          ${home.audiences.map((a,i)=>html`<a class="pro-audience" href="${a.url}">
            <span class="pro-audience__num mono">0${i+1}</span><h3>${a.title}</h3><p>${a.text}</p>
            <span class="arrow-link">${a.cta} ${iconArrow}</span>
          </a>`)}
        </div>
      </div>
    </section>

    ${obj ? html`<section class="section section--tint" id="obekty"><div class="container pro-case">
      <div><p class="eyebrow">06 / ${obj.badge}</p><h2>${obj.title}</h2><p class="pro-case__location">${obj.region} / ${obj.year}</p>
        <p>${obj.text}</p><a class="btn btn--ghost" href="/obekty/">Подробнее о проекте ${iconArrow}</a></div>
      <div class="pro-case__passport"><p class="mono">ПАРАМЕТРЫ ПРОЕКТА</p>
        <div class="pro-case__area">${obj.area}</div>
        <dl><div><dt>Назначение</dt><dd>${obj.purpose}</dd></div><div><dt>Размеры</dt><dd>${obj.size}</dd></div><div><dt>Конструктив</dt><dd>${obj.frameType}</dd></div></dl>
        <span class="pro-case__docs">${obj.docs}</span>
      </div>
    </div></section>` : ''}

    <section class="section" id="zavod"><div class="container pro-about">
      <figure class="pro-about__photo">${raw(picture('photo-production-hall',{alt:'Пример производственного цеха на стальном каркасе — сгенерированная иллюстрация',sizes:'(min-width:900px) 50vw, 100vw'}))}<figcaption>Пример производственного здания · сгенерированный кадр</figcaption></figure>
      <div><p class="eyebrow">07 / О заводе</p><h2>${home.about.title}</h2><p class="lead">${home.about.text}</p>
        <ul class="pro-about__list">${home.about.items.map(t=>html`<li>${iconCheck}<span>${t}</span></li>`)}</ul>
        <div class="btn-row"><a class="btn btn--ghost" href="/o-zavode/">О компании ${iconArrow}</a>
          ${presentation ? html`<a class="arrow-link" href="${presentation.file}" download data-goal="pdf_download">Презентация PDF ${iconArrow}</a>` : ''}
        </div>
      </div>
    </div></section>

    ${documentShelf(d)}

    ${ctaBand(site,{title:home.cta.title,text:home.cta.text})}
  `;
  return layout(site,{
    url:'/',bodyClass:'pro-home',noNext:true,
    image:hasImage('hero-photo')?'hero-photo':undefined,
    title:'Завод металлоконструкций в Казахстане — Steppe Steel',
    description:'STEPPESTEEL — завод строительных металлоконструкций: проектирование, производство ЛСТК и ЛМК, комплектная поставка. Зернохранилища, склады, ангары и производственные здания.',
    ogTitle:'STEPPESTEEL — завод строительных металлоконструкций',
    schema:[organizationNode(site,{products:solutions.items}),websiteNode(site),itemListNode(site,'/',solutions.items,'Решения Steppe Steel'),howToNode(site,'/',production.process.steps,'Как заказать здание на заводе Steppe Steel')]
  },content);
}
