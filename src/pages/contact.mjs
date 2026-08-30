/**
 * Контакты (§16), форма «Получить расчёт» (§17), спасибо, FAQ, privacy, 404.
 */

import { layout } from '../lib/layout.mjs';
import { html, raw, e } from '../lib/util.mjs';
import {
  pageHero, sectionHead, ctaBand, faq, iconWhatsApp, iconInstagram, iconPhone, specs,
} from '../lib/components.mjs';
import { faqNode, organizationNode } from '../lib/schema.mjs';

/* --- Контакты ------------------------------------------------------------- */

export function renderKontakty(d) {
  const { site } = d;
  const c = site.contacts;
  const crumbs = [{ title: 'Главная', url: '/' }, { title: 'Контакты', url: '/kontakty/' }];

  const content = html`
    ${raw(pageHero({
      label: 'Контакты',
      titleHtml: 'Контакты завода Steppe Steel',
      crumbList: crumbs,
      text: raw('Быстрее всего — WhatsApp: отвечает инженер, круглосуточно. Расчёт по заявке готовим в течение 24 часов.'),
    }))}

    <section class="section section--flush-top">
      <div class="container split split--even">
        <div class="stack" data-reveal>
          <h2 class="h3">Связаться</h2>
          <div class="contact-rows">
            <a class="contact-row" href="${c.phoneHref}" data-goal="tel_click">
              <span class="contact-row__icon">${iconPhone}</span>
              <span><span class="contact-row__label mono">Телефон</span><span class="contact-row__val">${c.phone}</span></span>
            </a>
            <a class="contact-row" href="${c.whatsapp}?text=${encodeURIComponent(c.whatsappText)}" target="_blank" rel="noopener" data-goal="wa_click">
              <span class="contact-row__icon">${iconWhatsApp}</span>
              <span><span class="contact-row__label mono">WhatsApp</span><span class="contact-row__val">${c.phone} · 24/7</span></span>
            </a>
            <a class="contact-row" href="mailto:${c.email}">
              <span class="contact-row__icon" aria-hidden="true">@</span>
              <span><span class="contact-row__label mono">E-mail</span><span class="contact-row__val">${c.email}</span></span>
            </a>
            <a class="contact-row" href="${c.instagram}" target="_blank" rel="noopener">
              <span class="contact-row__icon">${iconInstagram}</span>
              <span><span class="contact-row__label mono">Instagram</span><span class="contact-row__val">${c.instagramHandle}</span></span>
            </a>
          </div>
          <h2 class="h3" style="margin-top:1rem">Отделы</h2>
          <div class="contact-rows">
            ${site.contacts.departments.map(
              (dep) => html`
                <a class="contact-row" href="${c.whatsapp}?text=${encodeURIComponent(c[dep.channel] || c.whatsappText)}" target="_blank" rel="noopener" data-goal="wa_click">
                  <span class="contact-row__icon">${iconWhatsApp}</span>
                  <span><span class="contact-row__label mono">${dep.title}</span><span class="contact-row__val">${dep.text}</span></span>
                </a>
              `
            )}
          </div>
        </div>
        <div class="stack" data-reveal>
          <h2 class="h3">Производство</h2>
          ${specs([
            { key: 'Адрес', val: `${c.address.settlement}, ${c.address.district}` },
            { key: 'Область', val: `${c.address.region}, ${c.address.country}` },
            { key: 'Юрлицо', val: `${site.brand.legalName} · БИН ${site.brand.bin}` },
            { key: 'Дорога', val: 'трасса Костанай — Петропавловск' },
            { key: 'Ж/д', val: 'станция Пресногорьковская' },
            { key: 'Режим', val: c.hours.text },
          ])}
          <p class="note">Хотите приехать на производство — напишите в WhatsApp
          (<a href="${c.whatsapp}?text=${encodeURIComponent(c.whatsappVisit)}" target="_blank" rel="noopener" data-goal="wa_click">согласуем день визита</a>).
          Дорога из Костаная — около 230 км по трассе на Петропавловск.</p>
        </div>
      </div>
    </section>

    ${raw(ctaBand(site))}
  `;

  return layout(site, {
    url: '/kontakty/',
    title: 'Контакты завода металлоконструкций Steppe Steel',
    description: 'Телефон, WhatsApp и почта завода Steppe Steel. Производство: с. Троебратское, Костанайская область, трасса Костанай — Петропавловск. Работаем по всему Казахстану.',
    pageType: 'ContactPage',
    crumbs,
    schema: [organizationNode(site)],
  }, content);
}

/* --- Получить расчёт (ТЗ §17) --------------------------------------------- */

export function renderRaschet(d) {
  const { site, solutions } = d;
  const c = site.contacts;
  const crumbs = [{ title: 'Главная', url: '/' }, { title: 'Получить расчёт', url: '/raschet/' }];

  const content = html`
    ${raw(pageHero({
      label: 'Заявка',
      titleHtml: 'Получить расчёт',
      crumbList: crumbs,
      text: raw('Заполните параметры объекта — инженер завода подготовит предварительный расчёт и коммерческое предложение в течение 24 часов. Стоимость рассчитывается индивидуально по параметрам и проекту объекта.'),
    }))}

    <section class="section section--flush-top">
      <div class="container container--narrow">
        <form class="form" data-calc-form data-endpoint="${e(site.forms.endpoint || '')}" novalidate>
          <fieldset class="form__fieldset">
            <legend class="form__legend mono">01 · Что считаем</legend>
            <div class="seg" role="radiogroup" aria-label="Тип заявки">
              <label class="seg__item"><input type="radio" name="mode" value="scratch" checked>
                <span>Нужен расчёт с нуля</span></label>
              <label class="seg__item"><input type="radio" name="mode" value="project">
                <span>Есть готовый проект</span></label>
            </div>
            <div class="form__grid">
              <label class="field"><span class="field__label">Назначение здания *</span>
                <select class="field__input" name="purpose" required>
                  <option value="">— выберите —</option>
                  ${solutions.items.map((s) => html`<option value="${s.slug}">${s.short || s.title}</option>`)}
                  <option value="other">Другое</option>
                </select></label>
              <label class="field"><span class="field__label">Регион строительства</span>
                <input class="field__input" name="region" placeholder="область / район"></label>
            </div>
            <div class="form__grid form__grid--3">
              <label class="field"><span class="field__label">Ширина, м</span>
                <input class="field__input" name="width" type="number" inputmode="decimal" min="3" max="100" step="0.5"></label>
              <label class="field"><span class="field__label">Длина, м</span>
                <input class="field__input" name="len" type="number" inputmode="decimal" min="3" max="200" step="0.5"></label>
              <label class="field"><span class="field__label">Высота, м</span>
                <input class="field__input" name="height" type="number" inputmode="decimal" min="2" max="30" step="0.1"></label>
            </div>
            <label class="field"><span class="field__label">Комментарий</span>
              <textarea class="field__input" name="comment" rows="4" placeholder="Задача, объём хранения, кран-балка, сроки — всё, что важно"></textarea></label>
            <div class="field" data-file-field>
              <span class="field__label">Прикрепить проект</span>
              <label class="file">
                <input type="file" name="project" accept=".pdf,.dwg,.dxf,.xls,.xlsx,.doc,.docx,.zip" data-file-input>
                <span class="file__btn btn btn--ghost">Выбрать файл</span>
                <span class="file__name mono" data-file-name>PDF · DWG · DXF · XLS · DOC · ZIP</span>
              </label>
              <span class="field__hint" data-file-hint>${site.forms.endpoint
                ? 'Файл уйдёт вместе с заявкой. До 25 МБ.'
                : raw('Приём файлов прямо с сайта ещё подключается. Пока пришлите проект на <a href="mailto:' + site.contacts.email + '">' + site.contacts.email + '</a> или прикрепите его в чате WhatsApp после отправки заявки.')}</span>
            </div>
          </fieldset>

          <fieldset class="form__fieldset">
            <legend class="form__legend mono">02 · Как с вами связаться</legend>
            <div class="form__grid">
              <label class="field"><span class="field__label">Имя *</span>
                <input class="field__input" name="name" autocomplete="name" required></label>
              <label class="field"><span class="field__label">Компания / хозяйство</span>
                <input class="field__input" name="company" autocomplete="organization"></label>
              <label class="field"><span class="field__label">Телефон *</span>
                <input class="field__input" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="+7 ___ ___ __ __" required></label>
              <label class="field"><span class="field__label">WhatsApp</span>
                <input class="field__input" name="whatsapp" type="tel" inputmode="tel" placeholder="если отличается от телефона"></label>
              <label class="field"><span class="field__label">E-mail</span>
                <input class="field__input" name="email" type="email" autocomplete="email"></label>
            </div>
          </fieldset>

          <input type="text" name="website" class="u-visually-hidden" tabindex="-1" autocomplete="off" aria-hidden="true">

          <div class="btn-row">
            <button class="btn btn--primary btn--lg" type="submit">Отправить заявку</button>
            <a class="btn btn--wa btn--lg" href="${c.whatsapp}?text=${encodeURIComponent(c.whatsappText)}" target="_blank" rel="noopener" data-goal="wa_click">
              ${iconWhatsApp}<span>Спросить в WhatsApp</span>
            </a>
          </div>
          <p class="field__hint">Отправляя форму, вы соглашаетесь с <a href="/privacy/">политикой конфиденциальности</a>.
          Заявка уходит через ваш WhatsApp или почтовый клиент — данные передаются заводу только вашим действием.</p>
          <p class="form__status" data-form-status aria-live="polite" hidden></p>
        </form>

        <div class="after" data-reveal>
          <h2 class="h4">От чего зависит стоимость</h2>
          <p>Стоимость рассчитывается индивидуально по параметрам и проекту объекта. На цену влияют:</p>
          <ul class="check-list">
            <li>назначение здания — зерно, техника, производство или склад требуют разного конструктива</li>
            <li>размеры — пролёт, длина и высота определяют сечения профилей</li>
            <li>регион строительства — снеговые и ветровые нагрузки района входят в расчёт</li>
            <li>нагрузки — кран-балки, стеллажи, давление зерна на стены</li>
            <li>металлоёмкость — считается по разделу КМ, а не «по среднему»</li>
            <li>комплектация — холодный или тёплый контур, ворота, доборные элементы</li>
          </ul>
        </div>

        <div class="after" data-reveal>
          <h2 class="h4">Что будет дальше</h2>
          <ol class="num-list">
            <li>Инженер перезвонит и уточнит детали</li>
            <li>За 24 часа подготовим расчёт и спецификацию</li>
            <li>Пришлём КП с ценой и сроком</li>
          </ol>
        </div>
      </div>
    </section>
  `;

  return layout(site, {
    url: '/raschet/',
    title: 'Получить расчёт здания из металлоконструкций',
    description: 'Пришлите назначение и размеры здания — инженер завода Steppe Steel вернёт расчёт каркаса и комплектации за 24 часа. Можно приложить готовый проект (PDF, DWG, ZIP).',
    crumbs,
  }, content);
}

/* --- Спасибо --------------------------------------------------------------- */

export function renderThanks(d) {
  const { site } = d;
  const content = html`
    ${raw(pageHero({
      label: 'Заявка отправлена',
      titleHtml: 'Спасибо! Заявка у&nbsp;инженера',
      text: raw('В течение 24 часов подготовим предварительный расчёт и пришлём коммерческое предложение. Если вопрос срочный — напишите в WhatsApp напрямую.'),
    }))}
    <section class="section section--flush-top">
      <div class="container">
        <div class="btn-row">
          <a class="btn btn--primary" href="/resheniya/">Смотреть решения</a>
          <a class="btn btn--ghost" href="/proizvodstvo/">Производство</a>
        </div>
      </div>
    </section>
  `;

  return layout(site, {
    url: '/raschet/spasibo/',
    title: 'Заявка отправлена — Steppe Steel',
    description: 'Заявка передана инженеру завода Steppe Steel. В течение 24 часов подготовим предварительный расчёт и коммерческое предложение.',
    noindex: true,
  }, content);
}

/* --- FAQ -------------------------------------------------------------------- */

export function renderFaq(d) {
  const { site, faq: faqData, solutions } = d;
  const crumbs = [{ title: 'Главная', url: '/' }, { title: 'Вопросы и ответы', url: '/faq/' }];
  const all = faqData.groups.flatMap((g) => g.items);

  // FAQPage-разметка: одинаковый вопрос размечается только на одном URL —
  // вопросы, размеченные на страницах решений, здесь пропускаем.
  const taken = new Set(solutions.items.flatMap((x) => (x.faq || []).map((qa) => qa.q)));
  const markupOnly = all.filter((qa) => !taken.has(qa.q));

  const content = html`
    ${raw(pageHero({
      label: faqData.kicker,
      titleHtml: 'Вопросы и ответы',
      crumbList: crumbs,
      text: raw('Отвечают инженеры завода. Не нашли свой вопрос — напишите в WhatsApp: консультация бесплатна.'),
    }))}

    ${faqData.groups.map((g, gi) => html`
      <section class="section ${gi % 2 ? 'section--tint' : 'section--flush-top'}">
        <div class="container container--narrow">
          ${raw(sectionHead({ label: `Группа 0${gi + 1}`, title: g.title, split: false }))}
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

/* --- Privacy ----------------------------------------------------------------- */

export function renderPrivacy(d) {
  const { site } = d;
  const content = html`
    ${raw(pageHero({
      label: 'Документ',
      titleHtml: 'Политика конфиденциальности',
      small: true,
    }))}
    <section class="section section--flush-top">
      <div class="container">
        <div class="stack" style="max-width:70ch">
          <p>Сайт Steppe Steel не собирает персональные данные автоматически и не использует
          формы, отправляющие данные на сервер сайта.</p>
          <p>Кнопки и формы заявок формируют сообщение и открывают ваш собственный WhatsApp
          или почтовый клиент — данные (имя, телефон, параметры объекта) передаются заводу
          только в момент, когда вы сами нажимаете «Отправить» в своём приложении.</p>
          <p>Переданные контакты используются исключительно для подготовки расчёта
          и связи по вашей заявке и не передаются третьим лицам.</p>
          <p>Вопросы по обработке данных: <a href="mailto:${site.contacts.email}">${site.contacts.email}</a>.</p>
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

/* --- 404 ---------------------------------------------------------------------- */

export function renderNotFound(d) {
  const { site } = d;
  const content = html`
    ${raw(pageHero({
      label: 'Ошибка 404',
      titleHtml: 'Страница не найдена',
      text: raw('Возможно, страница переехала при обновлении сайта. Начните с главной или раздела решений.'),
    }))}
    <section class="section section--flush-top">
      <div class="container">
        <div class="btn-row">
          <a class="btn btn--primary" href="/">На главную</a>
          <a class="btn btn--ghost" href="/resheniya/">Решения</a>
          <a class="btn btn--ghost" href="/kontakty/">Контакты</a>
        </div>
      </div>
    </section>
  `;

  return layout(site, {
    url: '/404.html',
    title: 'Страница не найдена — Steppe Steel',
    description: 'Страница не найдена. Перейдите на главную страницу завода металлоконструкций Steppe Steel, в раздел решений или напишите инженеру в WhatsApp.',
    noindex: true,
  }, content);
}
