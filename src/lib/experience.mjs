import {html,raw} from './util.mjs';
import {iconArrow,iconDownload,sectionHead} from './components.mjs';

export function documentShelf(d,{heading=true}={}) {
 const categories=d.documents.categories.filter(c=>c.items.length);
 const docs=categories.flatMap(c=>c.items.map(doc=>({...doc,kind:c.id})));
 return html`<section class="section document-shelf" id="documents">
  <div class="container">
   ${heading?sectionHead({label:'Документы завода',title:'За словами —\nдокументы.',text:'Презентации производства и партнёрской программы. Сертификат соответствия на выпускаемые профили — с оригиналом для проверки.',action:{title:'Вся документация',url:'/dokumentaciya/'}}):''}
   <div class="document-shelf__grid">
    ${docs.map(doc=>html`<article class="document-preview ${doc.kind==='sertifikaty'?'document-preview--certificate':''}">
      <a class="document-preview__image" href="${doc.file}" target="_blank" rel="noopener" aria-label="Открыть PDF: ${doc.title}">
        <img src="/assets/img/documents/${doc.file.split('/').pop().replace('.pdf','.webp')}" alt="Первая страница: ${doc.title}" width="1000" height="${doc.kind==='sertifikaty'?1415:563}" loading="lazy">
        <span class="document-preview__tag">ОРИГИНАЛ / PDF</span>
      </a>
      <div class="document-preview__body"><p class="document-preview__meta">${doc.size}</p><h3>${doc.title}</h3><p>${doc.text}</p>
        <div class="document-preview__links"><a href="${doc.file}" target="_blank" rel="noopener">Открыть документ ${iconArrow}</a><a href="${doc.file}" download data-goal="pdf_download" aria-label="Скачать PDF: ${doc.title}">${iconDownload}</a></div>
      </div>
    </article>`)}
   </div>
  </div>
 </section>`;
}
export function engineeringExperience(d){
return html`<section class="section engineering-experience" id="engineering">
 <div class="container">
 ${sectionHead({label:'02 / Инженерный подход',title:'Посмотрите,\nкак устроен каркас.',text:'За каждым зданием — расчёт нагрузок и комплект рабочих чертежей. 3D-схема показывает основные элементы: рамы, прогоны, связи и обшивку.',action:{title:'Проектный отдел и документация',url:'/proektirovshchikam/'}})}
 <div class="frame-experience" data-frame-viewer>
   <div class="frame-experience__toolbar" data-frame-controls>
     <span class="frame-experience__label">3D / КАРКАС ЗДАНИЯ</span>
     <label>Пример здания <select data-frame-size disabled><option value="18x36">18 × 36 м</option><option value="24x60">24 × 60 м</option></select></label>
     <button type="button" data-frame-skin aria-pressed="false" disabled>Показать обшивку</button>
   </div>
   <div class="frame-experience__viewport" data-frame-viewport>
     <img class="frame-experience__fallback" src="/assets/img/concept-frame-1152.webp" width="1448" height="1086" alt="Архитектурная концепция металлического каркаса; иллюстрация, не рабочий проект" loading="lazy">
     <div class="frame-experience__dimensions"><strong data-frame-dimensions>18 × 36 м</strong><span data-frame-area>648 м²</span></div>
     <span class="frame-experience__legend"><i></i>Связи жёсткости</span>
   </div>
   <div class="frame-experience__bottom" data-frame-controls>
     <p data-frame-status role="status">Загружаем 3D-схему. Доступна также иллюстрация каркаса.</p>
     <div><button type="button" data-frame-left aria-label="Повернуть каркас влево" disabled>←</button><button type="button" data-frame-right aria-label="Повернуть каркас вправо" disabled>→</button><button type="button" data-frame-reset disabled>Исходный вид</button></div>
   </div>
 </div>
 <p class="engineering-experience__note">Принципиальная схема. Сечения, высота, шаг рам и узлы показаны условно. Конструктив конкретного здания определяется расчётом и рабочим проектом.</p>
 <div class="engineering-deliverables">
   <div><span>01 / РАСЧЁТ</span><h3>Под вашу площадку</h3><p>Назначение здания, снеговые и ветровые нагрузки, пролёты и расположение оборудования.</p></div>
   <div><span>02 / КМ</span><h3>Конструкции металлические</h3><p>Принятая конструктивная схема, сечения элементов, узлы и данные для смежных разделов проекта.</p></div>
   <div><span>03 / КМД</span><h3>Детали для производства</h3><p>Чертежи изготовления, маркировка элементов и документация, по которой собирают каркас.</p></div>
 </div>
 </div>
</section>`;
}
