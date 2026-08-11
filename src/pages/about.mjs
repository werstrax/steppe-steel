/**
 * О заводе + процесс работы.
 */

import { layout } from '../lib/layout.mjs';
import { html, raw, e, picture } from '../lib/util.mjs';
import {
  pageHero, sectionHead, ctaBand, stat, step, vizTag, iconWhatsApp,
} from '../lib/components.mjs';
import { organizationNode, howToNode } from '../lib/schema.mjs';

export function renderAbout(d) {
  const { site, products } = d;
  const c = site.contacts;
  const waEng = `${c.whatsapp}?text=${encodeURIComponent(c.whatsappEngineer)}`;
  const crumbs = [{ title: 'Главная', url: '/' }, { title: 'О заводе', url: '/o-zavode/' }];

  const content = html`
    ${raw(pageHero({
      label: 'О заводе · Industrial Standard',
      titleHtml: 'Steppe Steel — современный завод метал&shy;локонструкций',
      crumbList: crumbs,
      text: raw('Полный цикл в одних руках: проектирование → производство → комплектация → отгрузка. Работаем с ЛСТК и чёрным металлом, комбинируем технологии под объекты любой сложности. Завод расположен в с.&nbsp;Троебратское, Костанайская область.'),
    }))}

    <section class="section--tight">
      <div class="container">
        <figure data-reveal style="margin:0">
          <div class="media media--16x9 drift">
            ${raw(picture('steppe-frame', { alt: 'Визуализация: оцинкованный каркас промышленного корпуса в степи', sizes: '100vw', priority: true }))}
            ${vizTag()}
          </div>
        </figure>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${raw(sectionHead({
          label: 'Завод в цифрах',
          title: 'Что стоит за словом «завод»',
          text: 'Не сборочная площадка и не перепродажа профиля — производство с собственным проектированием, участками резки и сварки, комплектацией и транспортом.',
        }))}
        <div class="grid grid--3">
          ${[
            ['Полный цикл', 'Эскиз, расчёт, раздел КМ, производство, комплектация и отгрузка — на одном заводе, без посредников и потери ответственности между подрядчиками.'],
            ['ЛСТК + чёрный металл', 'Комбинируем лёгкие стальные тонкостенные и чёрные металлоконструкции — берём объекты любой сложности, а не только «типовые ангары».'],
            ['до 3,5 мм', 'Толщина профилей Sigma, C и П подбирается под расчётную нагрузку — под III снеговой район севера Казахстана, ~180 кгс/м².'],
            ['пролёт 24 м', 'Свободные пролёты без промежуточных колонн — чистая рабочая площадь для техники, стеллажей и производственных линий.'],
            ['50+ лет', 'Оцинкованный профиль не требует покраски и антикоррозийного обслуживания — каркас переживает не одно поколение кровли.'],
            ['крупные проекты', 'Мощности позволяют вести несколько объектов параллельно и держать сроки — от одиночного склада до серии зданий.'],
          ].map(([v, k]) => stat({ val: v, key: k }))}
        </div>
      </div>
    </section>

    <section class="section section--sheet">
      <div class="container">
        ${raw(sectionHead({
          label: 'Производство',
          title: 'Производственные участки',
          text: 'Каждая деталь проходит цепочку: раскрой → обработка → сборка узла → контроль. Всё оборудование работает по программам из раздела КМ — без ручной разметки «на глаз».',
          action: { title: 'Услуга «Производство»', url: '/uslugi/proizvodstvo/' },
        }))}
        <ol class="num-list" data-reveal>
          <li>Плазменная резка — раскрой листа и фасонных деталей по картам раскроя, минимальный отход металла.</li>
          <li>Лазерная резка — точные детали узлов и отверстия под болтовые соединения: элементы сходятся на монтаже без подгонки.</li>
          <li>Резьбонарезные станки — резьбовые элементы и крепёж для 100 % болтовой сборки каркасов.</li>
          <li>Сварочные участки — фермы, колонны, опорные узлы из чёрного металла; сварка в кондукторах с контролем геометрии.</li>
        </ol>
        <div class="gallery gallery--flat" style="margin-top:2.5rem">
          ${[
            ['weld-brand', 'Сварочный участок', 'Сварка узла стальной фермы — визуализация'],
            ['cut-brand', 'Участок резки', 'Резка оцинкованного профиля — визуализация'],
          ].map(([img, cap, alt]) => html`
            <figure class="gallery__item" data-reveal data-lightbox style="margin:0">
              <div class="media media--3x2">
                ${raw(picture(img, { alt, sizes: '(min-width: 960px) 50vw, 100vw' }))}
                ${vizTag()}
              </div>
              <figcaption class="media-caption">${cap}</figcaption>
            </figure>
          `)}
        </div>
        <p class="sheet-note" style="margin-top:1.5rem">Фотографии участков иллюстративные. Реальные съёмки производства, отгрузок и монтажа — в Instagram <a class="link" href="${c.instagram}" target="_blank" rel="noopener">${c.instagramHandle}</a>.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${raw(sectionHead({
          label: 'Контроль качества',
          title: 'Контроль встроен в каждый передел',
          text: 'Ошибка в цехе стоит дней простоя на монтаже. Поэтому контроль встроен в каждый передел, а не вынесен «на финальную приёмку».',
        }))}
        <div class="grid grid--2">
          ${[
            ['КК.01', 'Контроль на каждом этапе — от входной проверки металла до приёмки готовых отправочных марок перед комплектацией.'],
            ['КК.02', 'Соответствие разделу КМ — размеры, сечения и маркировка элементов сверяются с проектной документацией.'],
            ['КК.03', 'Визуальный и измерительный контроль — сварные швы, геометрия ферм и колонн, соосность отверстий под болты.'],
            ['КК.04', 'Гарантия точности — конструкции собираются на болтах без подгонки и «болгарки» на площадке: каждый узел встаёт на своё место.'],
          ].map(([v, k]) => stat({ val: v, key: k }))}
        </div>
      </div>
    </section>

    <section class="section section--sheet">
      <div class="container">
        ${raw(sectionHead({
          label: 'Логистика',
          title: 'Точка на карте выбрана не случайно',
          text: 'Завод стоит в с. Троебратское на трассе Костанай — Петропавловск, рядом — железнодорожная станция Пресногорьковская. Машина с комплектом каркаса уходит с площадки сразу на магистраль — без перегрузок и «плеча» до терминала.',
          action: { title: 'Комплектация и доставка', url: '/uslugi/komplektaciya-dostavka/' },
        }))}
        <div class="grid grid--3">
          ${[
            ['трасса', 'Костанай — Петропавловск: прямой выход на магистраль в обе стороны — на север и юг Казахстана.'],
            ['ж/д', 'Станция Пресногорьковская рядом с производством — запасное плечо для тяжёлых и дальних поставок.'],
            ['зерновой пояс', 'Костанайская, Северо-Казахстанская и Акмолинская области — главные зерновые регионы страны — рядом.'],
            ['города', 'Костанай, Рудный, Лисаковск, Петропавловск, Кокшетау, Атбасар, Астана — в зоне уверенной автодоставки.'],
            ['свой транспорт', 'Собственный автопарк — не зависим от чужих графиков и не переносим отгрузку «из-за перевозчика».'],
            ['по РК', 'Доставка по всему Казахстану — география поставок под проект заказчика.'],
          ].map(([v, k]) => stat({ val: v, key: k }))}
        </div>
      </div>
    </section>

    ${raw(ctaBand(site, {
      title: 'Обсудим ваш проект',
      text: 'Пришлите параметры здания — назначение, размеры, место строительства. Инженер посчитает каркас, подготовит раздел КМ и коммерческое предложение в течение 24 часов.',
    }))}
  `;

  return layout(site, {
    url: '/o-zavode/',
    title: 'О заводе Steppe Steel — металлоконструкции полного цикла',
    description: 'Steppe Steel — завод металлоконструкций полного цикла в Костанайской области: ЛСТК и чёрный металл, проектирование, производство, доставка по Казахстану.',
    image: 'steppe-frame',
    pageType: 'AboutPage',
    crumbs,
    schema: [organizationNode(site, { products: products.items })],
  }, content);
}

export function renderProcess(d) {
  const { site, process } = d;
  const crumbs = [{ title: 'Главная', url: '/' }, { title: 'Процесс', url: '/process/' }];

  const content = html`
    ${raw(pageHero({
      label: process.kicker,
      titleHtml: 'Шесть шагов — один договор',
      crumbList: crumbs,
      text: raw(e(process.intro)),
    }))}

    <section class="section--tight section">
      <div class="container">
        <div>
          ${process.steps.map((s, i) => step(s, i))}
        </div>
        ${process.note ? html`<p class="sheet-note" style="margin-top:1.75rem">${process.note}</p>` : ''}
      </div>
    </section>

    <section class="section section--sheet">
      <div class="container">
        ${raw(sectionHead({
          label: 'После заявки',
          title: 'Что будет дальше',
          text: 'Отвечает инженер, а не колл-центр.',
        }))}
        <div class="grid grid--3">
          ${process.after.items.map((x, i) => stat({ val: `0${i + 1}`, key: x }))}
        </div>
      </div>
    </section>

    ${raw(ctaBand(site))}
  `;

  return layout(site, {
    url: '/process/',
    title: process.seoTitle,
    description: process.seoDescription,
    image: 'montage-drone',
    crumbs,
    schema: [howToNode(site, '/process/', process.steps, 'Как заказать здание на заводе Steppe Steel')],
  }, content);
}
