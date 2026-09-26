/**
 * STEPPESTEEL — customer-facing factory site.
 * Content is sourced from data JSON; photography from the supplied image manifest.
 */
import { layout, html, raw } from '../lib/layout.mjs';
import { sectionHead, ctaBand, iconArrow, brandTag, factoryShot, solutionsPhotoNote } from '../lib/components.mjs';
import { organizationNode, websiteNode, itemListNode, howToNode } from '../lib/schema.mjs';
import {documentShelf,engineeringExperience} from '../lib/experience.mjs';
import { picture } from '../lib/util.mjs';
import { casePlan, caseDocs } from './portfolio.mjs';

export function renderHome(d) {
  const { site, solutions, production, portfolio, documents, home } = d;
  const bySlug = Object.fromEntries(solutions.items.map(s => [s.slug, s]));
  const featured = home.featured.map(slug => bySlug[slug]).filter(Boolean);
  const other = solutions.items.filter(s => !home.featured.includes(s.slug));
  // Кейс проекта (без фото) — по slug: построенный объект inner ставит первым в portfolio.items (I-08)
  const obj = portfolio.items.find(o => o.slug === 'ofisno-skladskoe-kostanay') ?? portfolio.items.find(o => !o.photos?.length);
  const cert = d.designers.cert;
  const objPlan = obj ? casePlan(obj) : '';
  const objDocs = obj ? caseDocs(obj) : '';
  const presentation = documents.categories.find(c => c.id === 'prezentacii')?.items[0];
  const content = html`
    <section class="factory-hero" aria-labelledby="factory-title">
      <div class="factory-hero__image">${raw(picture('drone-frame-front',{alt:'Стальной каркас на объекте завода Steppe Steel: фермы, стойки и наклонные стены, вид с дрона',sizes:'100vw',priority:true}))}${raw(brandTag('Каркас завода на объекте, 2026'))}</div>
      <div class="container factory-hero__inner">
        <div class="factory-hero__copy">
          <p class="factory-hero__eyebrow"><span></span>STEPPESTEEL · ЗАВОД-ИЗГОТОВИТЕЛЬ · КАЗАХСТАН</p>
          <h1 id="factory-title">Завод строительных металло&shy;конструкций</h1>
          <p class="factory-hero__sub">Проектирование<i>.</i> Производство<i>.</i> Комплектная поставка<i>.</i></p>
          <p class="factory-hero__lead">${site.brand.tagline}.</p>
          <div class="factory-hero__actions">
            <a class="btn btn--primary" href="${site.cta.primary.url}">${site.cta.primary.title} ${iconArrow}</a>
            <a class="btn btn--outline-light" href="${site.cta.secondary.url}">${site.cta.secondary.title} ${iconArrow}</a>
          </div>
          <p class="factory-hero__promise">Предварительный расчёт и спецификация — за&nbsp;24&nbsp;часа, без предоплаты. Отвечает инженер. <a href="/raschet/?type=project">Есть готовый проект — отправьте на&nbsp;расчёт&nbsp;→</a></p>
        </div>
        <a class="factory-hero__location" href="/obekty/"><span class="factory-hero__location-mark">↗</span><div>STEPPESTEEL · НА СНИМКЕ<small>Каркас завода на объекте, 2026</small></div></a>
      </div>
      <div class="factory-hero__bottom"><div class="container">
        <a href="/proektirovshchikam/"><span>01</span>Проектный отдел: КМ и КМД ${iconArrow}</a>
        <a href="/proizvodstvo/"><span>02</span>Производство в&nbsp;с.&nbsp;Троебратское ${iconArrow}</a>
        <a href="/dokumentaciya/"><span>03</span>Сертификат соответствия РК ${iconArrow}</a>
      </div></div>
    </section>

    <section class="pro-proof" aria-label="Показатели завода">
      <div class="container pro-proof__wrap">
        ${/* Цех — на втором экране: показатели завода рядом с реальным кадром производства */ ''}
        ${raw(factoryShot('prod-baza',{cls:'pro-proof__photo',sizes:'(min-width: 1100px) 40vw, 100vw'}))}
        <div class="pro-proof__grid">
          ${home.proof.map(p => html`<div class="pro-proof__item">
            <div class="pro-proof__value">${p.prefix ? html`<small>${p.prefix}</small>` : ''}${p.value}<small>${p.unit}</small></div>
            <h2>${p.title}</h2><p>${p.text}</p>
          </div>`)}
        </div>
      </div>
    </section>

    <section class="section" id="resheniya">
      <div class="container">
        ${sectionHead({label:'01 / Наши решения',title:home.solutions.title,text:home.solutions.text,action:{title:'Все решения',url:'/resheniya/'}})}
        <div class="pro-solutions">
          ${featured.map((s,i) => html`<a class="pro-solution" href="${s.url}">
            <div class="pro-solution__photo">
              ${raw(picture(s.cover || 'sol-'+s.slug,{alt:s.photoAlt || s.title,sizes:i===0?'(min-width: 1100px) 45vw, 100vw':'(min-width: 1100px) 28vw, (min-width: 640px) 50vw, 100vw'}))}
            </div>
            <div class="pro-solution__body"><h3>${s.short || s.title}</h3><span class="pro-solution__arrow">${iconArrow}</span>
              <p>${home.solutionDescriptions[s.slug]}</p>
            </div>
          </a>`)}
        </div>
        <div class="pro-solutions pro-solutions--all" aria-label="Ещё шесть типов зданий">
          ${other.map((s,i) => html`<a class="pro-solution" href="${s.url}">
            <div class="pro-solution__photo">
              ${raw(picture(s.cover || 'sol-'+s.slug,{alt:s.photoAlt || s.title,sizes:'(min-width: 1100px) 30vw, 50vw'}))}
            </div>
            <div class="pro-solution__body"><h3>${s.short || s.title}</h3><span class="pro-solution__arrow">${iconArrow}</span>
              <p>${home.solutionDescriptions[s.slug] || s.summary}</p>
            </div>
          </a>`)}
        </div>
        ${solutionsPhotoNote()}
        <div class="pro-help"><p>${home.solutions.help}</p><a class="arrow-link" href="/raschet/">Получить расчёт ${iconArrow}</a></div>
      </div>
    </section>

    <section class="section" id="tipovye">
      <div class="container">
        ${sectionHead({label:'02 / Типовые решения',title:home.typical.title,text:home.typical.text})}
        <div class="pro-typicals">
          ${solutions.hub.typical.items.map((t,i)=>html`<div class="pro-typical">
            <span class="pro-typical__label mono">ТИПОВОЕ РЕШЕНИЕ / 0${i+1}</span><h3>${t.title}</h3>
            <dl>${t.params.map(([k,v])=>html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>
            <div class="pro-typical__links">
              <a class="arrow-link pro-typical__cta" href="${t.url}">Рассчитать этот вариант ${iconArrow}</a>
              ${t.pageUrl ? html`<a class="pro-typical__page" href="${t.pageUrl}">Параметры здания</a>` : ''}
            </div>
          </div>`)}
        </div>
      </div>
    </section>

    ${engineeringExperience(d)}

    ${obj ? html`<section class="section section--tint" id="proekt"><div class="container pro-case">
      <div><p class="eyebrow">${obj.badge || 'Проект завода'}</p><h2>${obj.title}</h2><p class="pro-case__location">${obj.region} / ${obj.year}</p>
        <p>${obj.text}</p><a class="btn btn--ghost" href="/obekty/">Подробнее о проекте ${iconArrow}</a></div>
      <div class="pro-case__passport"><p class="mono">ПАРАМЕТРЫ ПРОЕКТА</p>
        ${objPlan || html`<div class="pro-case__area">${obj.area}</div>`}
        <dl><div><dt>Назначение</dt><dd>${obj.purpose}</dd></div><div><dt>Размеры</dt><dd>${obj.size}</dd></div>${objPlan && obj.area ? html`<div><dt>Площадь</dt><dd>${obj.area}</dd></div>` : ''}<div><dt>Конструктив</dt><dd>${obj.frameType}</dd></div></dl>
        ${objDocs || html`<span class="pro-case__docs">${obj.docs}</span>`}
      </div>
    </div></section>` : ''}

    <section class="section" id="partnyorstvo">
      <div class="container">
        ${sectionHead({label:'04 / Сотрудничество',title:home.audiencesTitle,text:home.audiencesText})}
        <div class="pro-audiences">
          ${home.audiences.map((a,i)=>html`<a class="pro-audience" href="${a.url}">
            <span class="pro-audience__num mono">0${i+1}</span><h3>${a.title}</h3><p>${a.text}</p>
            <span class="arrow-link">${a.cta} ${iconArrow}</span>
          </a>`)}
        </div>
      </div>
    </section>

    <section class="section section--tint" id="process">
      <div class="container">
        ${sectionHead({label:'05 / Как мы работаем',title:home.process.title,text:home.process.text})}
        <ol class="pro-process">
          ${production.process.steps.map((s,i)=>{
            const term = home.process.terms?.[i] || s.duration;
            return html`<li><span class="pro-process__num">0${i+1}</span>${term ? html`<span class="pro-process__term mono">${term}</span>` : ''}<h3>${s.title}</h3><p>${home.process.descriptions[i]}</p></li>`;
          })}
        </ol>
        <p class="pro-process__note">${home.process.note}</p>
      </div>
    </section>

    <section class="section" id="zavod"><div class="container pro-about">
      ${/* Цех и сварочный участок; корпус prod-baza — уже во втором экране у показателей */ ''}
      <div class="pro-about__photos">${raw(factoryShot('prod-komplekt',{cls:'pro-about__main',sizes:'(min-width:900px) 46vw, 100vw'}))}${raw(factoryShot('prod-svarka',{cls:'pro-about__side',sizes:'(min-width:900px) 46vw, 100vw'}))}</div>
      <div><p class="eyebrow">06 / О заводе</p><h2>${home.about.title}</h2><p class="lead">${home.about.text}</p>
        <dl class="factory-pass">
          <div><dt>Площадка</dt><dd>${site.contacts.address.settlement}, ${site.contacts.address.district}, ${site.contacts.address.region}</dd></div>
          <div><dt>Логистика</dt><dd>${site.contacts.address.note}</dd></div>
          <div><dt>Профили</dt><dd>ПСУ 150–280 и ПС 100–280 · оцинкованная сталь 1,5–3,5&nbsp;мм · 43&nbsp;позиции сортамента</dd></div>
          <div><dt>Проектирование</dt><dd>КМ и КМД силами завода · ЛИРА-САПР, Tekla Structures</dd></div>
          <div><dt>Сертификат</dt><dd class="mono">№ ${cert.number}, до 01.06.2027</dd></div>
          <div><dt>Юрлицо</dt><dd>${site.brand.legalName} · БИН ${site.brand.bin}</dd></div>
        </dl>
        <div class="btn-row"><a class="btn btn--ghost" href="/o-zavode/">О компании ${iconArrow}</a>
          <a class="arrow-link factory-visit" href="${site.contacts.whatsapp}?text=${encodeURIComponent(site.contacts.whatsappVisit)}" target="_blank" rel="noopener" data-goal="wa_click">Приехать на завод ${iconArrow}</a>
          ${presentation ? html`<a class="arrow-link" href="${presentation.file}" download data-goal="pdf_download">Презентация PDF ${iconArrow}</a>` : ''}
        </div>
      </div>
    </div></section>

    ${documentShelf(d)}

    ${ctaBand(site,{title:home.cta.title,text:home.cta.text})}
  `;
  return layout(site,{
    url:'/',bodyClass:'pro-home',noNext:true,
    // LCP — фото первого экрана: предзагрузка той же ширины, что выберет <picture>
    preloadImage:{name:'drone-frame-front',sizes:'100vw'},
    image:'og-default',
    imageAlt:'STEPPESTEEL — завод строительных металлоконструкций',
    title:'Завод металлоконструкций в Казахстане — Steppe Steel',
    description:'Steppe Steel — завод-изготовитель металлоконструкций: своё проектирование КМ и КМД, производство ЛСТК и ЛМК, комплектная поставка здания под объект.',
    ogTitle:'STEPPESTEEL — завод строительных металлоконструкций',
    schema:[organizationNode(site,{products:solutions.items}),websiteNode(site),itemListNode(site,'/',solutions.items,'Решения Steppe Steel'),howToNode(site,'/',production.process.steps,'Как заказать здание на заводе Steppe Steel')]
  },content);
}
