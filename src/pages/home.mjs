import { layout, html, raw } from '../lib/layout.mjs';
import { picture } from '../lib/util.mjs';
import { iconArrow } from '../lib/components.mjs';
import { organizationNode, websiteNode, itemListNode } from '../lib/schema.mjs';
import { casePlan } from './portfolio.mjs';

export function renderHome(d) {
 const {site,home,solutions,portfolio,documents}=d;
 const selected=['zernohranilishcha','sklady','angary','proizvodstvennye-zdaniya'].map(slug=>solutions.items.find(s=>s.slug===slug)).filter(Boolean);
 const project=portfolio.items[0];
 const docs=documents.categories.flatMap(c=>c.items);
 const image=(name,alt,sizes='50vw',priority=false)=>raw(picture(name,{alt,sizes,priority}));
 const content=html`
 <section class="ed-hero" aria-labelledby="ed-title">
  <div class="ed-hero__photo">${image('drone-hero','Напольное зернохранилище на стальном каркасе завода с синей кровлей, вид с дрона','100vw',true)}</div>
  <div class="ed-hero__shade"></div>
  <div class="container ed-hero__inner">
   <div class="ed-hero__meta"><span><i></i> STEPPE STEEL / КАЗАХСТАН</span><span>ПРОЕКТИРУЕМ. ПРОИЗВОДИМ. ПОСТАВЛЯЕМ.</span></div>
   <h1 id="ed-title">Сила стали.<br>Точность<br><span>инженерии.</span></h1>
   <div class="ed-hero__bottom"><p>Завод строительных металлоконструкций.<br>От первого чертежа до готового каркаса —<br>для бизнеса по всему Казахстану.</p><a class="ed-button" href="/raschet/">Получить расчёт <span>↗</span></a></div>
   <div class="ed-hero__foot"><span>ЛСТК / ЛМК / КОМПЛЕКТНЫЕ ЗДАНИЯ</span><a href="#solutions">Откройте возможности <span>↓</span></a></div>
  </div>
  <span class="ed-hero__vertical" aria-hidden="true">INDUSTRIAL STANDARD — STEPPE STEEL</span>
 </section>
 <section class="ed-intro container" aria-labelledby="intro-title">
  <p class="ed-label">01 / ОСНОВА ВАШЕГО ПРОЕКТА</p>
  <div class="ed-intro__body"><h2 id="intro-title">Вы строите бизнес.<br><span>Мы создаём его основу.</span></h2><p>Склад, новый цех или зернохранилище — у каждого здания своя задача. Мы соединяем инженерный расчёт, собственное производство и комплектную поставку в один процесс.</p><a class="ed-textlink" href="/o-zavode/">Познакомиться с заводом ${iconArrow}</a></div>
 </section>
 <section class="ed-stats container" aria-label="Возможности конструкций">${home.proof.map(p=>html`<div><strong>${p.prefix?html`<small>${p.prefix} </small>`:''}${p.value}<small> ${p.unit}</small></strong><h3>${p.title}</h3><p>${p.text}</p></div>`)}</section>
 <section class="ed-section ed-solutions" id="solutions"><div class="container">
  <div class="ed-sectionhead"><div><p class="ed-label">02 / РЕШЕНИЯ</p><h2>Ваши задачи.<br>Наши конструкции.</h2></div><div><p>Подберём здание под технологию,<br>площадку и планы вашего бизнеса.</p><a class="ed-textlink" href="/resheniya/">Все 9 направлений ${iconArrow}</a></div></div>
  <div class="ed-solutiongrid">${selected.map((s,i)=>html`<a class="ed-solution" href="${s.url}"><div class="ed-solution__image">${image(s.cover||'sol-'+s.slug,s.photoAlt||s.title,'(min-width: 760px) 48vw, 100vw')}<span class="ed-solution__number">0${i+1}</span>${s.coverCaption?html`<span class="ed-image-note">${s.coverCaption}</span>`:''}</div><div class="ed-solution__title"><h3>${s.short||s.title}</h3><span>↗</span></div><p>${home.solutionDescriptions[s.slug]}</p></a>`)}</div>
 </div></section>
 <section class="ed-engineering ed-section" id="engineering"><div class="container">
  <div class="ed-sectionhead"><div><p class="ed-label">03 / ИНЖЕНЕРИЯ В ДЕТАЛЯХ</p><h2>Продумано<br>до каждого соединения.</h2></div><p>Посмотрите, как устроен каркас.<br>Поверните модель и добавьте обшивку,<br>чтобы увидеть здание целиком.</p></div>
  <div class="ed-model" data-structure>
   <div class="ed-model__stage"><div class="ed-model__top"><span>SS / КОНСТРУКТИВНАЯ СХЕМА</span><span class="ed-model__live">3D</span></div><canvas id="structure-canvas" tabindex="0" role="img" aria-label="Вращаемая трёхмерная схема ангара. Используйте стрелки влево и вправо для поворота.">Схема стального ангара: колонны, фермы, прогоны и связи. Размер 18 × 36 м.</canvas><div class="ed-model__hint">↔ Потяните для вращения <span>или используйте стрелки ← →</span></div><noscript><p>Интерактивная модель доступна с JavaScript. <a href="/tekhnologii/">Посмотреть технологии</a></p></noscript></div>
   <div class="ed-model__panel"><p class="ed-label">ТИПОВОЙ АНГАР</p><h3>Пространство<br>без лишних опор.</h3><p>Свободный пролёт и модульная конструкция. Размеры и сечения рассчитываем под ваш объект.</p><div class="ed-model__sizes" aria-label="Размер ангара"><button type="button" data-size="18,36" aria-pressed="true">18 × 36 м</button><button type="button" data-size="24,60" aria-pressed="false">24 × 60 м</button></div><dl><div><dt>Площадь в плане</dt><dd data-model-area aria-live="polite">648 м²</dd></div><div><dt>Соединения</dt><dd>Болтовые</dd></div><div><dt>Документация</dt><dd>КМ / КМД</dd></div></dl><label class="ed-switch"><input type="checkbox" data-model-cladding><span></span>Показать обшивку</label><div class="ed-model__rotate"><button type="button" data-rotate="-1" aria-label="Повернуть модель влево">←</button><button type="button" data-reset>Исходный ракурс</button><button type="button" data-rotate="1" aria-label="Повернуть модель вправо">→</button></div><a class="ed-button" data-model-link href="/raschet/?type=angary&w=18&l=36">Рассчитать этот ангар <span>↗</span></a><small class="ed-model__note">Иллюстративная схема. Не заменяет расчёт и рабочую документацию.</small></div>
  </div>
 </div></section>
 <section class="ed-section ed-factory" id="zavod"><div class="container">
  <div class="ed-sectionhead"><div><p class="ed-label">04 / СОБСТВЕННОЕ ПРОИЗВОДСТВО</p><h2>От рулона стали —<br>до комплекта здания.</h2></div><a class="ed-textlink" href="/proizvodstvo/">Внутри производства ${iconArrow}</a></div>
  <div class="ed-factory__grid"><figure>${image('prod-baza','Производственный корпус и линия профилирования Steppe Steel','(min-width: 900px) 58vw, 100vw')}<figcaption><span>STEPPE STEEL</span>Троебратское / Костанайская область</figcaption></figure><div class="ed-stages">${home.factory.stages.map((s,i)=>html`<article><span>0${i+1}</span><div><h3>${s.title}</h3><p>${s.text}</p></div></article>`)}<a class="ed-textlink" href="/proizvodstvo/#otgruzka">Как устроена поставка ${iconArrow}</a></div></div>
 </div></section>
 ${project?html`<section class="ed-project ed-section"><div class="container"><div class="ed-sectionhead"><div><p class="ed-label">05 / ПРОЕКТ ЗАВОДА</p><h2>Инженерия,<br>которая становится зданием.</h2></div><a class="ed-textlink" href="/obekty/">Подробнее о проекте ${iconArrow}</a></div><div class="ed-project__grid"><div class="ed-project__drawing">${casePlan(project)}<span>КОНСТРУКТИВНАЯ СХЕМА / КОСТАНАЙ</span></div><div><p class="ed-label">${project.region} / ${project.year}</p><h3>${project.title}</h3><p>Рамно-связевый каркас ЛСТК. Расчётная модель, эскизный проект и документация для изготовления и монтажа.</p><strong>690 <small>м² в плане</small></strong><p class="ed-project__docs">${project.docs}</p></div></div></div></section>`:''}
 <section class="ed-section ed-partners"><div class="container"><div class="ed-sectionhead"><div><p class="ed-label">06 / СОТРУДНИЧЕСТВО</p><h2>Один завод.<br>Разные точки роста.</h2></div><p>Подключаемся на том этапе,<br>на котором нужна наша экспертиза.</p></div><div class="ed-partnerlist">${home.audiences.map((a,i)=>html`<a href="${a.url}"><span>0${i+1}</span><h3>${a.title}</h3><p>${a.text}</p><b>↗</b></a>`)}</div></div></section>
 <section class="ed-documents container" id="documents"><div><p class="ed-label">ДОКУМЕНТЫ ЗАВОДА</p><h2>Открыто.<br>По существу.</h2></div><div>${docs.map(doc=>html`<a href="${doc.file}" target="_blank" rel="noopener"><div><span>PDF</span><h3>${doc.title}</h3><small>${doc.size}</small></div><b>↓</b></a>`)}</div></section>
 <section class="ed-contact"><div class="container"><p class="ed-label">НАЧНЁМ С ВАШЕЙ ЗАДАЧИ</p><div class="ed-contact__row"><h2>Большие планы<br>нуждаются<br>в прочной основе.</h2><a class="ed-contact__circle" href="/raschet/" aria-label="Обсудить проект с инженером">↗</a></div><div class="ed-contact__foot"><p>Расскажите о будущем здании.<br>Инженер подготовит предварительный расчёт.</p><a href="${site.contacts.phoneHref}">${site.contacts.phone}</a><a class="ed-textlink" href="${site.contacts.whatsapp}?text=${encodeURIComponent(site.contacts.whatsappEngineer)}" target="_blank" rel="noopener">Написать в WhatsApp ${iconArrow}</a></div></div></section>
 `;
 return layout(site,{url:'/',bodyClass:'editorial-home',noNext:true,preloadImage:{name:'drone-hero',sizes:'100vw'},image:'drone-hero',title:'Завод металлоконструкций в Казахстане — Steppe Steel',description:'Steppe Steel — проектирование, производство ЛСТК и ЛМК, комплектная поставка зданий по Казахстану. Склады, ангары, зернохранилища и производственные здания.',schema:[organizationNode(site,{products:solutions.items}),websiteNode(site),itemListNode(site,'/',solutions.items,'Решения Steppe Steel')]},content);
}
