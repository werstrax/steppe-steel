import {html,raw,picture} from './util.mjs';
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
 ${sectionHead({label:'02 / Объект завода',title:'Каркас и обшивка —\nна реальном объекте.',text:'Один и тот же принцип для склада, цеха, ангара или хранилища: стойки и фермы из профилей ПСУ и ПС, болтовая сборка по КМД, профилированная обшивка. На фото — построенное зернохранилище завода: каркас до закрытия контура и готовое здание изнутри.',action:{title:'Все типы зданий',url:'/resheniya/'}})}
 <div class="construction-photos">
  <figure class="construction-photos__interior">
   <a href="/assets/img/photo-warehouse-interior-1024.webp" target="_blank" rel="noopener" aria-label="Открыть фотографию интерьера зернохранилища">
    ${raw(picture('photo-warehouse-interior',{alt:'Интерьер зернохранилища: стальные фермы, профнастил и наклонные нижние стены',sizes:'(min-width: 900px) 60vw, 100vw'}))}
   </a>
   <figcaption><span>01 / ГОТОВОЕ ЗДАНИЕ ИЗНУТРИ</span>Фермы пролётом без колонн и ограждающие конструкции — объект завода в Костанайской области</figcaption>
  </figure>
  <figure class="construction-photos__frame">
   <a href="/assets/img/photo-warehouse-frame-577.webp" target="_blank" rel="noopener" aria-label="Открыть фотографию металлического каркаса">
    ${raw(picture('photo-warehouse-frame',{alt:'Металлический каркас зернохранилища до завершения обшивки',sizes:'(min-width: 900px) 35vw, (min-width: 540px) 65vw, 100vw'}))}
   </a>
   <figcaption><span>02 / НЕСУЩИЙ КАРКАС</span>Стойки, фермы и связи до закрытия контура — так собирается любое здание завода</figcaption>
  </figure>
 </div>
 <div class="engineering-deliverables">
   <div><span>01 / РАСЧЁТ</span><h3>Под вашу площадку</h3><p>Назначение здания, снеговые и ветровые нагрузки, пролёты и расположение оборудования.</p></div>
   <div><span>02 / КМ</span><h3>Конструкции металлические</h3><p>Конструктивная схема, сечения элементов, узлы и данные для смежных разделов проекта.</p></div>
   <div><span>03 / КМД</span><h3>Детали для производства</h3><p>Чертежи изготовления, маркировка элементов и документация для сборки каркаса.</p></div>
 </div>
 </div>
</section>`;
}
