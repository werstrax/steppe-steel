/**
 * Контакты, квиз-заявка, спасибо, FAQ, privacy, 404.
 */

import { layout } from '../lib/layout.mjs';
import { html, raw, e, picture } from '../lib/util.mjs';
import {
  pageHero, sectionHead, ctaBand, stat, faq, video, iconWhatsApp, iconInstagram,
} from '../lib/components.mjs';
import { faqNode, organizationNode } from '../lib/schema.mjs';

/* --- Контакты --------------------------------------------------------------- */

export function renderKontakty(d) {
  const { site } = d;
  const c = site.contacts;
  const wa = `${c.whatsapp}?text=${encodeURIComponent(c.whatsappText)}`;
  const waEng = `${c.whatsapp}?text=${encodeURIComponent(c.whatsappEngineer)}`;
  const crumbs = [{ title: 'Главная', url: '/' }, { title: 'Контакты', url: '/kontakty/' }];

  const content = html`
    ${raw(pageHero({
      label: 'Контакты',
      titleHtml: 'Контакты Steppe&nbsp;Steel',
      crumbList: crumbs,
      text: raw('Завод металлоконструкций полного цикла в селе Троебратское Костанайской области. Самый быстрый способ — написать в WhatsApp: отвечает инженер, а не колл-центр. Звонить не обязательно.'),
    }))}

    <section class="section section--tight">
      <div class="container">
        <div class="grid grid--3">
          ${[
            ['WhatsApp · 24/7', raw(`<a class="link" href="${wa}" target="_blank" rel="noopener">Написать в WhatsApp</a> — основной канал. Пишите в любое время, отвечаем круглосуточно; обычно в течение часа.`)],
            ['Телефон', raw(`<a class="link mono" href="${c.phoneHref}">${c.phone}</a> — если удобнее голосом. На том же номере — WhatsApp.`)],
            ['Email', raw(`<a class="link" href="mailto:${c.email}">${c.email}</a> — для технических заданий, эскизов и чертежей.`)],
            ['Instagram', raw(`<a class="link" href="${c.instagram}" target="_blank" rel="noopener">${c.instagramHandle}</a> — производство и монтаж, свежие объекты.`)],
            ['Ответ 24/7', 'Отвечаем в WhatsApp круглосуточно, без выходных. Расчёт и КП инженер готовит в течение 24 часов.'],
            ['Адрес', `${c.address.country}, ${c.address.region}, ${c.address.district}, ${c.address.settlement}`],
          ].map(([v, k]) => stat({ val: v, key: k }))}
        </div>
        <p class="lead u-max-70" data-reveal style="margin-top:2.5rem">
          Завод стоит на трассе Костанай — Петропавловск, в селе работает ж/д станция
          Пресногорьковская. Отгружаем конструкции автотранспортом
          и вагонами по всему Казахстану.
        </p>
      </div>
    </section>

    <section class="section section--sheet">
      <div class="container">
        ${raw(sectionHead({
          label: 'Как добраться',
          title: 'Где находится завод',
          text: 'Троебратское находится на трассе Костанай — Петропавловск, в центре зернового пояса севера Казахстана — отсюда удобно отгружать конструкции по всей стране.',
        }))}
        <div class="grid grid--4">
          ${[
            ['~245 км', 'от Костаная по трассе на Петропавловск, до села Троебратское'],
            [raw('Узун&shy;кольский р-н'), 'север Костанайской области, на границе с Северо-Казахстанской'],
            ['ж/д', 'станция Пресногорьковская находится в самом селе'],
            ['по РК', 'отгрузка авто и вагонами по всему Казахстану, в согласованные сроки'],
          ].map(([v, k]) => stat({ val: v, key: k }))}
        </div>
        <div class="btn-row" style="margin-top:2rem" data-reveal>
          <a class="btn btn--ghost" target="_blank" rel="noopener"
             href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('село Троебратское, Узункольский район, Костанайская область')}">Открыть на карте</a>
          <a class="btn btn--ghost" target="_blank" rel="noopener"
             href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('село Троебратское, Узункольский район, Костанайская область')}">Маршрут до завода</a>
        </div>
      </div>
    </section>

    <section class="section section--steel-2">
      <div class="container">
        <div class="contact-media" data-reveal>
          <figure style="margin:0">
            <div class="media media--16x9">
              ${raw(video('hangar.mp4', { poster: 'hangar-brand-1152.jpg', ariaLabel: 'Видеовизуализация: ангар из чёрных сэндвич-панелей с оранжевой полосой в степи' }))}
            </div>
            <figcaption class="media-caption">Промышленное здание в степи · визуализация</figcaption>
          </figure>
        </div>
        <p class="sheet-note" style="margin-top:1.75rem">
          Реквизиты и карточку предприятия для договора вышлем по запросу — в WhatsApp
          или на email. По вопросам проекта и сроков отвечает инженер.
        </p>
        <div class="btn-row" style="margin-top:1.75rem" data-reveal>
          <a class="btn btn--wa" href="${waEng}" target="_blank" rel="noopener">${iconWhatsApp}<span>Написать инженеру</span></a>
          <a class="btn btn--outline-light" href="${c.instagram}" target="_blank" rel="noopener" aria-label="Instagram Steppe Steel">${iconInstagram}</a>
        </div>
      </div>
    </section>

    ${raw(ctaBand(site, {
      title: 'Посчитаем ваш объект<br>за 24 часа',
      text: 'Пришлите размеры и назначение здания — инженер подготовит расчёт стоимости и коммерческое предложение в течение 24 часов. Бесплатно и без обязательств.',
    }))}
  `;

  return layout(site, {
    url: '/kontakty/',
    title: 'Контакты Steppe Steel — завод, Костанайская область',
    description: 'Телефон и WhatsApp +7 776 603 17 66, email steppe.steel@gmail.com. Завод металлоконструкций Steppe Steel — Костанайская обл., с. Троебратское. WhatsApp — 24/7.',
    image: 'hangar-brand',
    pageType: 'ContactPage',
    crumbs,
    schema: [organizationNode(site, { products: d.products.items })],
  }, content);
}

/* --- Квиз-заявка ------------------------------------------------------------- */

export function renderZayavka(d) {
  const { site, process } = d;
  const c = site.contacts;
  const crumbs = [{ title: 'Главная', url: '/' }, { title: 'Заявка', url: '/zayavka/' }];

  const TYPES = [
    ['Зернохранилище', 'grain', true],
    ['Склад', 'warehouse', false],
    ['Ангар для техники', 'machinery', false],
    ['Цех / завод', 'workshop', false],
    ['Спортивный зал', 'sport', false],
    ['Индивидуальный проект', 'custom', false],
  ];

  const content = html`
    ${raw(pageHero({
      label: 'Расчёт за 24 часа',
      titleHtml: 'Рассчитаем ваш объект за&nbsp;24&nbsp;часа',
      crumbList: crumbs,
      text: raw('Три шага — и инженер завода пришлёт предварительный расчёт и КП. Бесплатно, без обязательств.'),
    }))}

    <section class="section--tight section">
      <div class="container">
        <div class="calc">
          <form class="calc__form" id="calc-form" novalidate data-reveal
                data-wa="${c.whatsapp}" data-email="${c.email}" data-site="Steppe Steel">
            <div class="form-stamp mono" id="form-stamp" aria-hidden="true">В&nbsp;ПРОИЗВОДСТВО</div>
            <div class="ruler" aria-hidden="true"><div class="ruler__thumb" id="calc-thumb"></div></div>
            <p class="calc__step-label mono" id="calc-step-label" aria-live="polite">ШАГ 1 ИЗ 3 · ТИП ЗДАНИЯ</p>

            <fieldset class="calc__step is-active" data-step="1" style="border:0;padding:0;margin:0">
              <legend class="visually-hidden">Тип здания</legend>
              <div class="calc__types">
                ${TYPES.map(([label, key, checked]) => html`
                  <label class="calc__type">
                    <input type="radio" name="type" value="${label}" data-key="${key}" ${raw(checked ? 'checked' : '')}>
                    <span>${label}</span>
                  </label>
                `)}
              </div>
            </fieldset>

            <fieldset class="calc__step" data-step="2" style="border:0;padding:0;margin:0">
              <legend class="visually-hidden">Размеры и место</legend>
              <div class="stack stack--sm">
                <p class="field__label" style="margin:0">Размеры, м</p>
                <div class="calc__presets">
                  <button type="button" class="calc__preset" data-w="18" data-l="36" aria-pressed="false">18×36</button>
                  <button type="button" class="calc__preset" data-w="24" data-l="60" aria-pressed="false">24×60</button>
                  <button type="button" class="calc__preset" data-w="24" data-l="90" aria-pressed="false">24×90</button>
                  <button type="button" class="calc__preset" data-custom aria-pressed="false">свой размер</button>
                </div>
                <p class="mono text-muted" id="calc-grain-note" hidden style="margin:0"></p>
                <div class="calc__sizes" id="calc-sizes" hidden>
                  <div class="field">
                    <label class="field__label" for="calc-length">Длина, м</label>
                    <input type="number" id="calc-length" name="length" min="6" max="300" inputmode="numeric">
                  </div>
                  <div class="field">
                    <label class="field__label" for="calc-width">Ширина, м</label>
                    <input type="number" id="calc-width" name="width" min="6" max="60" inputmode="numeric">
                  </div>
                </div>
                <div class="field">
                  <label class="field__label" for="calc-location">Населённый пункт / область</label>
                  <input type="text" id="calc-location" name="location" placeholder="Напр. Узункольский район, Костанайская обл." autocomplete="address-level2">
                </div>
                <label class="calc__check">
                  <input type="checkbox" name="harvest" value="1">
                  <span>Нужно к уборочной</span>
                </label>
              </div>
            </fieldset>

            <fieldset class="calc__step" data-step="3" style="border:0;padding:0;margin:0">
              <legend class="visually-hidden">Контакты</legend>
              <div class="stack stack--sm">
                <div class="field">
                  <label class="field__label" for="calc-name">Имя</label>
                  <input type="text" id="calc-name" name="name" placeholder="Как к вам обращаться" autocomplete="name">
                </div>
                <div class="field">
                  <label class="field__label" for="calc-phone">Телефон *</label>
                  <input type="tel" name="phone" autocomplete="tel" required placeholder="+7 (___) ___-__-__" id="calc-phone" aria-describedby="calc-error">
                  <p class="calc__error mono" id="calc-error" role="alert" hidden>Укажите телефон — инженеру нужно, куда прислать расчёт</p>
                </div>
                <p class="hp-field" aria-hidden="true">
                  <label>Не заполняйте это поле <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
                </p>
              </div>
            </fieldset>

            <div class="calc__nav">
              <button type="button" class="btn btn--ghost" id="calc-back" hidden>Назад</button>
              <button type="button" class="btn btn--primary" id="calc-next">Далее <span class="btn__index mono">2 / 3</span></button>
              <button type="submit" class="btn btn--primary btn--lg" id="calc-submit" hidden>Отправить инженеру в&nbsp;WhatsApp</button>
            </div>
            <p class="calc__hint" id="calc-hint" hidden>Откроется WhatsApp с готовым сообщением — просто нажмите «Отправить».</p>

            <div class="calc__success" id="calc-success" hidden aria-live="polite">
              <h3>WhatsApp открыт — нажмите «Отправить»</h3>
              <p>Сообщение с вашими параметрами уже готово — отправьте его в WhatsApp.
                Не открылся? <a id="calc-retry" href="${c.whatsapp}" target="_blank" rel="noopener">Откройте по прямой ссылке</a>
                или позвоните: <a href="${c.phoneHref}" class="mono">${c.phone}</a></p>
              <pre class="calc__message mono" id="calc-message"></pre>
              <div class="btn-row">
                <button type="button" class="btn btn--ghost" id="calc-copy">Скопировать текст</button>
                <a class="btn btn--ghost" id="calc-mail" href="mailto:${c.email}">Отправить на email</a>
              </div>
            </div>

            <noscript>
              <p class="sheet-note" style="margin-top:1.5rem">
                Без JavaScript квиз не работает — напишите нам напрямую:
                <a class="link" href="${c.whatsapp}?text=${encodeURIComponent(c.whatsappEngineer)}">WhatsApp</a> ·
                <a class="link" href="mailto:${c.email}">${c.email}</a> ·
                <a class="link mono" href="${c.phoneHref}">${c.phone}</a>
              </p>
            </noscript>
          </form>

          <aside class="calc__aside" data-reveal>
            <p class="calc__aside-title">Что будет дальше</p>
            ${process.after.items.map((x, i) => html`
              <div class="calc__aside-item"><span class="mono">0${i + 1}</span><span>${x}</span></div>
            `)}
            <p class="text-small text-muted" style="margin:0">Отвечает инженер, а не колл-центр. Не пользуетесь WhatsApp? Позвоните: <a class="link mono" href="${c.phoneHref}">${c.phone}</a></p>
          </aside>
        </div>
      </div>
    </section>
  `;

  return layout(site, {
    url: '/zayavka/',
    title: 'Рассчитать стоимость здания за 24 часа — Steppe Steel',
    description: 'Три шага: тип здания, размеры, телефон. Инженер завода Steppe Steel посчитает конструктив и пришлёт коммерческое предложение в WhatsApp за 24 часа.',
    image: 'og-default',
    crumbs,
  }, content);
}

/* --- Спасибо ------------------------------------------------------------------ */

export function renderThanks(d) {
  const { site } = d;
  const content = html`
    ${raw(pageHero({
      label: 'Заявка отправлена',
      titleHtml: 'Спасибо! Заявка у&nbsp;инженера',
      text: raw('В течение 24 часов подготовим предварительный расчёт и пришлём коммерческое предложение. Если вопрос срочный — напишите в WhatsApp напрямую.'),
    }))}
    <section class="section--tight section">
      <div class="container">
        <div class="btn-row">
          <a class="btn btn--primary" href="/katalog/">Смотреть каталог</a>
          <a class="btn btn--ghost" href="/blog/">Читать журнал</a>
        </div>
      </div>
    </section>
  `;

  return layout(site, {
    url: '/zayavka/spasibo/',
    title: 'Заявка отправлена — Steppe Steel',
    description: 'Заявка передана инженеру завода Steppe Steel. В течение 24 часов подготовим предварительный расчёт и коммерческое предложение.',
    noindex: true,
  }, content);
}

/* --- FAQ ---------------------------------------------------------------------- */

export function renderFaq(d) {
  const { site, faq: faqData, products, services } = d;
  const crumbs = [{ title: 'Главная', url: '/' }, { title: 'Вопросы и ответы', url: '/faq/' }];
  const all = faqData.groups.flatMap((g) => g.items);

  // FAQPage-разметка: одинаковый вопрос должен быть размечен только на одном
  // URL — вопросы, размеченные на страницах продукции/услуг, здесь пропускаем.
  const taken = new Set(
    [...products.items, ...services.items].flatMap((x) => (x.faq || []).map((qa) => qa.q))
  );
  const markupOnly = all.filter((qa) => !taken.has(qa.q));

  const content = html`
    ${raw(pageHero({
      label: faqData.kicker,
      titleHtml: 'Вопросы и ответы',
      crumbList: crumbs,
      count: String(all.length),
      text: raw('Отвечают инженеры завода. Не нашли свой вопрос — напишите в WhatsApp: консультация бесплатна.'),
    }))}

    ${faqData.groups.map((g, gi) => html`
      <section class="section section--tight ${gi % 2 ? 'section--steel-2' : ''}">
        <div class="container">
          ${raw(sectionHead({ label: `Группа 0${gi + 1}`, title: g.title }))}
          ${raw(faq(g.items, { idPrefix: `faq-g${gi}` }))}
        </div>
      </section>
    `)}

    ${raw(ctaBand(site))}
  `;

  return layout(site, {
    url: '/faq/',
    title: faqData.seoTitle,
    description: faqData.seoDescription,
    pageType: 'FAQPage',
    crumbs,
    schema: [faqNode(site, '/faq/', markupOnly)],
  }, content);
}

/* --- Privacy ------------------------------------------------------------------- */

export function renderPrivacy(d) {
  const { site } = d;
  const content = html`
    ${raw(pageHero({
      label: 'Документ',
      titleHtml: 'Политика конфиденциальности',
      small: true,
    }))}
    <section class="section--tight section">
      <div class="container">
        <div class="article-block stack" style="max-width:70ch">
          <p>Сайт Steppe Steel не собирает персональные данные автоматически и не использует
          формы, отправляющие данные на сервер сайта.</p>
          <p>Кнопки и форма заявки формируют сообщение и открывают ваш собственный WhatsApp
          или почтовый клиент — данные (имя, телефон, параметры объекта) передаются заводу
          только в момент, когда вы сами нажимаете «Отправить» в своём приложении.</p>
          <p>Переданные контакты используются исключительно для подготовки расчёта
          и связи по вашей заявке и не передаются третьим лицам.</p>
          <p>Вопросы по обработке данных: <a class="link" href="mailto:${site.contacts.email}">${site.contacts.email}</a>.</p>
        </div>
      </div>
    </section>
  `;

  return layout(site, {
    url: '/privacy/',
    title: 'Политика конфиденциальности — Steppe Steel',
    description: 'Как сайт Steppe Steel обращается с данными: формы работают через ваш WhatsApp или email, данные передаются только по вашему действию и не уходят третьим лицам.',
    noindex: true,
  }, content);
}

/* --- 404 ------------------------------------------------------------------------ */

export function renderNotFound(d) {
  const { site } = d;
  const content = html`
    ${raw(pageHero({
      label: 'Ошибка 404',
      titleHtml: 'Лист не найден',
      text: raw('Такой страницы в альбоме нет — возможно, она переехала при обновлении сайта. Начните с главной или каталога.'),
    }))}
    <section class="section--tight section">
      <div class="container">
        <div class="btn-row">
          <a class="btn btn--primary" href="/">На главную</a>
          <a class="btn btn--ghost" href="/katalog/">Каталог</a>
          <a class="btn btn--ghost" href="/kontakty/">Контакты</a>
        </div>
      </div>
    </section>
  `;

  return layout(site, {
    url: '/404.html',
    title: 'Страница не найдена — Steppe Steel',
    description: 'Страница не найдена. Перейдите на главную страницу завода металлоконструкций Steppe Steel, в каталог зданий или напишите инженеру в WhatsApp.',
    noindex: true,
  }, content);
}
