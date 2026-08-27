/**
 * Мелкие помощники сборщика: экранирование, форматирование, картинки.
 * Зависимостей нет — только стандартный Node.
 */

import { readFileSync, readdirSync, statSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';

/* --- Данные ------------------------------------------------------------- */

export function loadJSON(path) {
  const raw = readFileSync(path, 'utf8');
  const data = JSON.parse(raw);
  return stripMeta(data);
}

/** Убирает служебные поля, начинающиеся с `_`, чтобы они не попадали в вывод. */
function stripMeta(value) {
  if (Array.isArray(value)) return value.map(stripMeta);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('_')) continue;
      out[k] = stripMeta(v);
    }
    return out;
  }
  return value;
}

/* --- Строки ------------------------------------------------------------- */

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Экранирование для вставки в HTML-текст и атрибуты. */
export const e = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** Экранирование для JSON-LD внутри <script>. */
export const jsonld = (obj) =>
  JSON.stringify(obj, null, 1).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

/**
 * Тег-шаблон: значения экранируются автоматически.
 * Массивы склеиваются, значения обёрнутые в raw() вставляются как есть.
 *
 * Важно: html`` возвращает НЕ строку, а помеченный объект. Иначе вложенные
 * шаблоны (`${items.map(x => html`<li>…</li>`)}`) экранировались бы повторно
 * и разметка утекала бы на страницу текстом. У объекта есть toString(),
 * поэтому в обычных строковых шаблонах он ведёт себя как строка.
 */
const RAW = Symbol('raw');

const wrap = (s) => {
  const str = String(s ?? '');
  return { [RAW]: str, toString: () => str, valueOf: () => str };
};

export const raw = (html) => wrap(html);

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) {
    out += render(values[i]) + strings[i + 1];
  }
  return wrap(out);
}

function render(v) {
  if (v == null || v === false) return '';
  if (Array.isArray(v)) return v.map(render).join('');
  if (typeof v === 'object' && RAW in v) return v[RAW];
  if (typeof v === 'object') return e(JSON.stringify(v));
  return e(v);
}

/** Собирает список классов, отбрасывая пустые. */
export const cx = (...list) => list.filter(Boolean).join(' ');

/** Простейший Markdown-инлайн: **жирный**, *курсив*, [текст](url), переносы. */
export function inline(text) {
  return e(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+?)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

/** Абзацы из массива строк или из текста с пустыми строками. */
export function paragraphs(input) {
  const list = Array.isArray(input) ? input : String(input ?? '').split(/\n{2,}/);
  return list.filter(Boolean).map((p) => `<p>${inline(p)}</p>`).join('\n');
}

/* --- Числа и даты ------------------------------------------------------- */

/** 1234567 -> «1 234 567» (неразрывные тонкие пробелы). */
export const num = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

/** '2026-07-29' -> '29 июля 2026' */
export function dateRu(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Склонение: plural(12, ['год','года','лет']) */
export function plural(n, forms) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}

/* --- Изображения -------------------------------------------------------- */

let IMAGES = {};
export function setImageManifest(manifest) {
  IMAGES = manifest || {};
}

/**
 * Отдаёт <picture> с webp-srcset, jpg-фолбэком, размерами и LQIP-фоном.
 *
 * @param {string} name  имя из манифеста (без расширения)
 * @param {object} opts
 *   alt       — обязательный осмысленный alt
 *   sizes     — значение атрибута sizes
 *   priority  — true для LCP-картинки (eager + fetchpriority=high, без ленивой загрузки)
 *   className — класс на <picture>
 *   ratio     — переопределение соотношения сторон (например '3/2')
 */
export function picture(name, opts = {}) {
  const meta = IMAGES[name];
  const alt = opts.alt ?? '';
  if (!meta) {
    // Картинки нет — отдаём аккуратную заглушку вместо битого <img>.
    return `<span class="media__missing" role="img" aria-label="${e(alt)}" data-missing="${e(name)}"></span>`;
  }

  const widths = meta.widths;
  const sizes = opts.sizes || '100vw';
  const webp = widths.map((w) => `/assets/img/${name}-${w}.webp ${w}w`).join(', ');
  // У вырезанных фигур фолбэк — PNG (JPEG залил бы прозрачность чёрным).
  const fallback = `/assets/img/${name}-${meta.fallback}.${meta.alpha ? 'png' : 'jpg'}`;

  const loading = opts.priority ? 'eager' : 'lazy';
  const fetchPriority = opts.priority ? ' fetchpriority="high"' : '';
  const decoding = opts.priority ? 'sync' : 'async';
  const fade = opts.priority ? '' : ' data-fade';

  // LQIP-подложка только для непрозрачных кадров — за фигурой без фона
  // размытый прямоугольник был бы виден.
  const style = meta.lqip
    ? `background-image:url('${meta.lqip}');background-size:cover;background-position:center;`
    : '';

  return [
    `<picture class="${e(opts.className || '')}" style="${style}">`,
    `<source type="image/webp" srcset="${webp}" sizes="${e(sizes)}">`,
    `<img src="${fallback}" alt="${e(alt)}" width="${meta.w}" height="${meta.h}"`,
    ` loading="${loading}" decoding="${decoding}"${fetchPriority}${fade}>`,
    `</picture>`,
  ].join('');
}

/** Абсолютный URL картинки для og:image / schema.org. */
/**
 * Растровый фолбэк-кадр (og:image, Schema.org, лайтбокс документов).
 * Оптимизатор пишет НЕ-webp только в одной ширине (meta.fallback) и только
 * в одном формате: PNG для кадров с прозрачностью, иначе JPEG. Просить другую
 * ширину бессмысленно — такого файла нет, поэтому ширина здесь игнорируется.
 */
export function imageUrl(name, base) {
  const meta = IMAGES[name];
  if (!meta) return `${base}/assets/img/og-default-1152.jpg`;
  return `${base}/assets/img/${name}-${meta.fallback}.${meta.alpha ? 'png' : 'jpg'}`;
}

export function imageWebpUrl(name, base, width = 1152) {
  const meta = IMAGES[name];
  if (!meta) return `${base}/assets/img/og-default-1152.webp`;
  const w = meta.widths.includes(width) ? width : meta.widths[meta.widths.length - 1];
  return `${base}/assets/img/${name}-${w}.webp`;
}

export const hasImage = (name) => Boolean(IMAGES[name]);

/* --- Файловая система --------------------------------------------------- */

export function copyDir(from, to, skip = () => false) {
  for (const entry of readdirSync(from)) {
    const src = join(from, entry);
    const dst = join(to, entry);
    if (skip(src, entry)) continue;
    if (statSync(src).isDirectory()) {
      mkdirSync(dst, { recursive: true });
      copyDir(src, dst, skip);
    } else {
      mkdirSync(dirname(dst), { recursive: true });
      copyFileSync(src, dst);
    }
  }
}

export const isImage = (p) => ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg'].includes(extname(p).toLowerCase());

/* --- URL ---------------------------------------------------------------- */

/** '/projects/bayaan/' -> 'projects/bayaan/index.html' */
export const outPath = (url) => {
  const clean = url.replace(/^\/+/, '').replace(/\/+$/, '');
  return clean ? `${clean}/index.html` : 'index.html';
};

export const abs = (base, url) => `${base}${url}`;
