/**
 * Кейс завода на видео (13.09.2026, по просьбе заказчика): четырёхминутный обзор
 * напольного зернохранилища, снятый представителем завода на площадке. Слева
 * текст и главы с перемоткой, справа вертикальный ролик в рамке телефона; звук
 * включается по клику. Файл: src/assets/video/grain-walkthrough.mp4
 * (tools/video_grain.sh), постер — video-grain-poster в images.json, расшифровка —
 * docs/video-grain-walkthrough-2026-09-13.md.
 *
 * ВАЖНО (правка 13.09 по итогам ревью): в тексте блока только факты из реестра
 * docs/research/v4/01-fakty.md. Габариты объекта, объём хранения и глубину свай
 * из ролика здесь не печатаем — расшифровка помечает их как неподтверждённые
 * («Новое — на сайт только после подтверждения заводом»), а 8000 т на 140 м
 * спорит с собственной цифрой сайта 67 т на 1 м. Вернуть цифры можно только
 * после письменного ответа завода и вместе с согласованием типовой карточки
 * «Зернохранилище 140 м». Должность говорящего в ролике не подтверждена —
 * «представитель завода», не инженер. Регион и год объекта не названы.
 */
import { html, raw, e, hasImage, imageWebpUrl } from './util.mjs';
import { iconArrow } from './components.mjs';

export const GRAIN_VIDEO = {
  src: '/assets/video/grain-walkthrough.mp4',
  poster: 'video-grain-poster',
  duration: 240,
  eyebrow: '03 / Объект на видео',
  // Размер здания звучит в самом ролике (0:00) и описывает то, что человек видит на экране;
  // объём хранения и глубина свай — не печатаем, пока завод не подтвердит (см. docs)
  title: 'Напольное зернохранилище 140 × 20 м — обзор с площадки',
  lead: 'Четыре минуты на объекте, снято на телефон. Представитель завода показывает, из чего собрано напольное зернохранилище: винтовые сваи без бетона, наклонные стены с подкосом внутри, болтовая сборка без сварки — и объясняет, как конструкция принимает боковое давление зерна.',
  facts: [
    ['67 т', 'пшеницы на 1 погонный метр'],
    ['Без бетона', 'фундамент на винтовых сваях'],
    ['Без сварки', '100 % болтовая сборка на площадке'],
    ['Наклонные стены', 'принимают боковое давление зерна'],
  ],
  chapters: [
    { t: 0, title: 'Обзор объекта' },
    { t: 16, title: 'Фундамент: винтовые сваи и ростверк' },
    { t: 45, title: 'Подкосная стена: почему подкос внутри' },
    { t: 96, title: 'Колонны, прогоны, фермы' },
    { t: 155, title: 'Болтовая сборка, без сварки' },
    { t: 177, title: 'Обшивка профлистом' },
  ],
  action: { title: 'Решение для зерна', url: '/resheniya/zernohranilishcha/' },
};

const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/**
 * Секция «Объект завода на видео».
 * opts: label — подпись над заголовком; id — якорь; tint — фон секции;
 * action — ссылка под главами (null — без ссылки; по умолчанию — из GRAIN_VIDEO).
 */
export function objectVideo(opts = {}) {
  const v = GRAIN_VIDEO;
  // Постер — webp 576 px: ролик показывается в кадре шириной до 380 px
  const poster = hasImage(v.poster) ? imageWebpUrl(v.poster, '', 576) : '';
  const action = opts.action === null ? null : opts.action || v.action;
  return html`
    <section class="section${opts.tint ? ' section--tint' : ''} object-video" id="${opts.id || 'video'}" aria-labelledby="object-video-title">
      <div class="container object-video__grid">
        <div class="object-video__head">
          <p class="eyebrow">${opts.label || v.eyebrow}</p>
          <h2 id="object-video-title" class="section-head__title">${v.title}</h2>
          <p class="lead">${v.lead}</p>
          <dl class="object-video__facts">
            ${v.facts.map(([val, cap]) => html`<div><dt>${val}</dt><dd>${cap}</dd></div>`)}
          </dl>
        </div>
        <figure class="object-video__player" data-video-player>
          <div class="object-video__screen">
            <video class="object-video__video" preload="none" playsinline controls controlslist="nodownload noplaybackrate"
              ${raw(poster ? `poster="${e(poster)}"` : '')} width="720" height="1280" aria-label="${v.title}">
              <source src="${v.src}" type="video/mp4">
            </video>
            <button class="object-video__play" type="button" data-video-play aria-label="Смотреть видео, ${mmss(v.duration)}">
              <span class="object-video__play-icon" aria-hidden="true"></span>
              <span class="object-video__play-text">Смотреть<small>${mmss(v.duration)} · со звуком</small></span>
            </button>
          </div>
          <figcaption class="object-video__cap">Видео с площадки · съёмка завода, без постановки</figcaption>
        </figure>
        <div class="object-video__chapters-wrap">
          <p class="object-video__chapters-title mono">Главы</p>
          <ol class="object-video__chapters" aria-label="Главы видео">
            ${v.chapters.map((c) => html`<li><button type="button" class="object-video__chapter" data-video-seek="${c.t}">
              <span class="mono">${mmss(c.t)}</span><span>${c.title}</span>${iconArrow}
            </button></li>`)}
          </ol>
          ${action ? html`<a class="arrow-link" href="${action.url}">${action.title} ${iconArrow}</a>` : ''}
        </div>
      </div>
    </section>
  `;
}
