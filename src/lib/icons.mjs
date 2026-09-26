/**
 * Линейные иконки главной (макет Шамиля 30.08: «Наши показатели», «Как мы
 * работаем», чек-листы, стрелки ленты). Один стиль на всё: сетка 32×32,
 * штрих 1.5, скруглённые концы, цвет — currentColor (графит или оранжевый
 * задаются в CSS). Декоративные: aria-hidden, смысл несёт соседний текст.
 */
import { raw } from './util.mjs';

const svg = (body, cls = 'line-icon') =>
  raw(`<svg class="${cls}" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`);

/**
 * Иконки показателей. Ключ пишется в home.json → proof[].icon.
 * design/profile/span/calendar — для подтверждённых фактов завода;
 * area/capacity/people/cert — заготовки под цифры макета (7 000 м², т/мес,
 * представители), когда завод их подтвердит.
 */
export const kpiIcons = {
  // Лист КМ/КМД: ферма на чертеже и штамп
  design: svg('<rect x="5" y="4" width="22" height="24" rx="1"/><path d="M5 23h22M19 23v5"/><path d="M9 17l7-6 7 6M9 17h14M12.5 14v3M16 11v6M19.5 14v3"/>'),
  // Два сечения С-профиля собственной линии
  profile: svg('<path d="M14 9V6H6v20h8v-3"/><path d="M26 11V8h-8v16h8v-3"/>'),
  // Рама и размерная линия пролёта
  span: svg('<path d="M4 22V12l12-6 12 6v10"/><path d="M4 22h24"/><path d="M7 26h18M7 26l2-2m-2 2l2 2m16-2l-2-2m2 2l-2 2"/>'),
  // Календарь со сроком
  calendar: svg('<rect x="5" y="7" width="22" height="20" rx="1.5"/><path d="M5 13h22M11 4v6M21 4v6"/><path d="M10 18h3M15 18h3M20 18h2M10 22h3M15 22h3"/>'),
  // Сертификат
  cert: svg('<rect x="6" y="4" width="20" height="24" rx="1.5"/><path d="M10 10h12M10 15h12M10 20h7"/><circle cx="21" cy="22" r="3"/><path d="M19.5 24.5L18 28l3-1 3 1-1.5-3.5"/>'),
  // Производственная площадь
  area: svg('<path d="M4 27V14l7 4v-4l7 4v-4l7 4V6h3v21z"/><path d="M9 27v-4h4v4M17 27v-4h4v4"/>'),
  // Мощность, т/мес
  capacity: svg('<path d="M6 27h20"/><path d="M9 27l3-12h8l3 12"/><circle cx="16" cy="10" r="3"/><path d="M13.5 21h5"/>'),
  // Представители
  people: svg('<circle cx="16" cy="11" r="5"/><path d="M6 27c1-6 5-9 10-9s9 3 10 9"/>'),
};

/** Иконки пяти шагов «Как мы работаем» — ключ в home.json → process.steps[].icon. */
export const stepIcons = {
  request: svg('<path d="M8 4h12l5 5v19H8z"/><path d="M20 4v5h5"/><path d="M12 15h9M12 19h9M12 23h5"/>'),
  design: svg('<path d="M6 27V7l20 20z"/><path d="M10.5 22.5v-6l6 6z"/><path d="M6 11h2.5M6 15h2.5M6 19h2.5M6 23h2.5"/>'),
  production: svg('<path d="M4 27V14l7 4v-4l7 4v-4l7 4V6h3v21z"/><path d="M9 27v-4h4v4M17 27v-4h4v4"/>'),
  kit: svg('<path d="M5 11l11-5 11 5-11 5z"/><path d="M5 11v11l11 5 11-5V11"/><path d="M16 16v11"/><path d="M10.5 8.5l11 5"/>'),
  shipping: svg('<path d="M3 8h16v14H3z"/><path d="M19 13h6l4 5v4H19"/><circle cx="9" cy="24" r="2.5"/><circle cx="23" cy="24" r="2.5"/>'),
};

/** Галочка чек-листа. */
export const iconTick = svg('<path d="M6 16.5l6 6L26 9"/>', 'line-icon line-icon--tick');

/** Стрелки ленты и стрелка между шагами. */
export const iconChevronLeft = svg('<path d="M20 6L10 16l10 10"/>', 'line-icon line-icon--chevron');
export const iconChevronRight = svg('<path d="M12 6l10 10-10 10"/>', 'line-icon line-icon--chevron');
export const iconStepArrow = svg('<path d="M3 16h26M22 9l7 7-7 7"/>', 'line-icon line-icon--step-arrow');
