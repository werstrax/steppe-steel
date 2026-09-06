import {layout,html} from '../lib/layout.mjs';
import {pageHero,ctaBand} from '../lib/components.mjs';
import {documentShelf} from '../lib/experience.mjs';

export function renderDocuments(d){
const {site,documents}=d;
const crumbs=[{title:'Главная',url:'/'},{title:'Документы',url:'/dokumentaciya/'}];
const content=html`
 ${pageHero({label:'Документы завода',titleHtml:'Презентации.\nСертификаты.\nТехническая информация.',text:'Оригинальные PDF завода Steppe Steel: познакомьтесь с производством, изучите партнёрскую программу и проверьте сертификат на профили ПСУ и ПС.',crumbList:crumbs})}
 ${documentShelf(d,{heading:false})}
 <section class="section"><div class="container">
 <div class="doc-library__request">
  <div><h2>Реквизиты предприятия</h2><div class="specs">
   <div class="specs__row"><span class="specs__key">Юрлицо</span><span class="specs__val">${site.brand.legalName}</span></div>
   <div class="specs__row"><span class="specs__key">БИН</span><span class="specs__val">${site.brand.bin}</span></div>
   <div class="specs__row"><span class="specs__key">Юридический адрес</span><span class="specs__val">${site.brand.legalAddress}</span></div>
  </div></div>
  <div><h2>Материалы для проектирования</h2><p>Сортамент ПСУ и ПС доступен на сайте. Паспорт конкретного комплекта выдаётся с поставкой. Узлы, монтажные чертежи и заверенные копии документов запросите у проектного отдела.</p>
   <div class="btn-row"><a class="btn btn--primary" href="/profili/">Сортамент профилей</a><a class="btn btn--ghost" href="/proektirovshchikam/">Проектировщикам</a></div>
  </div>
 </div></div></section>
 ${ctaBand(site,{title:'Нужны документы\nдля вашего проекта?',text:'Напишите, что требуется: исходные данные, сортамент, заверенный сертификат или карточка предприятия. Запрос передадим профильному специалисту.'})}
`;
return layout(site,{url:'/dokumentaciya/',title:documents.seoTitle,description:documents.seoDescription,crumbs},content);
}
