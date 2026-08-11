/**
 * Проверка собранного сайта: битые ссылки, отсутствующие файлы, SEO-минимум,
 * корректность JSON-LD, базовая доступность.
 *
 *   node tools/check.mjs
 *
 * Ничего не чинит — только сообщает. Запускать после каждой сборки.
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

if (!existsSync(DIST)) {
  console.error('Нет папки dist/. Сначала: node build.mjs');
  process.exit(1);
}

const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const rel = (f) => '/' + f.slice(DIST.length + 1).replace(/\\/g, '/');

const exists = new Set(files.map(rel));

// Сайт живёт в подпапке project pages — в HTML пути с префиксом.
const BASE = (() => {
  try {
    return JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'site.json'), 'utf8')).basePath || '';
  } catch {
    return '';
  }
})();

const unbase = (p) => (BASE && (p === BASE || p.startsWith(BASE + '/')) ? p.slice(BASE.length) || '/' : p);

function hasTarget(href) {
  let clean = unbase(href.split('#')[0].split('?')[0]);
  if (!clean || clean === '/') return exists.has('/index.html');
  if (exists.has(clean)) return true;
  if (exists.has(clean.replace(/\/$/, '') + '/index.html')) return true;
  return false;
}

let totalLinks = 0;
let totalImgs = 0;

for (const file of htmlFiles) {
  const url = rel(file);
  const html = readFileSync(file, 'utf8');

  // Редирект-заглушки со старых URL: проверяем только целевую ссылку.
  if (/http-equiv="refresh"/.test(html)) {
    const target = (html.match(/url=([^">]+)"/) || [])[1] || '';
    const path = target.replace(/^https?:\/\/[^/]+/, '');
    if (!hasTarget(path)) err(`${url}: редирект на несуществующую страницу ${target}`);
    continue;
  }

  /* --- SEO-минимум --- */
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  const h1 = html.match(/<h1[\s>]/g) || [];

  if (!title) err(`${url}: нет <title>`);
  else if (title.length > 65) warn(`${url}: title ${title.length} симв. (желательно ≤ 65)`);
  if (!desc) err(`${url}: нет meta description`);
  else if (desc.length < 100 || desc.length > 175) warn(`${url}: description ${desc.length} симв. (желательно 120–165)`);
  if (!canonical) err(`${url}: нет canonical`);
  if (h1.length === 0) err(`${url}: нет <h1>`);
  if (h1.length > 1) err(`${url}: ${h1.length} тегов <h1>`);
  if (!/<html lang="ru">/.test(html)) err(`${url}: нет lang на <html>`);

  /* --- JSON-LD --- */
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  if (!ld.length) warn(`${url}: нет JSON-LD`);
  for (const block of ld) {
    const body = block.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '');
    try {
      const parsed = JSON.parse(body.replace(/\\u003c/g, '<').replace(/\\u003e/g, '>').replace(/\\u0026/g, '&'));
      if (!parsed['@context']) err(`${url}: JSON-LD без @context`);
      const nodes = parsed['@graph'] || [parsed];
      for (const n of nodes) if (!n['@type']) err(`${url}: узел JSON-LD без @type`);
    } catch (e) {
      err(`${url}: JSON-LD не парсится — ${e.message}`);
    }
  }

  /* --- Ссылки --- */
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) continue;
    totalLinks++;
    if (!hasTarget(href)) err(`${url}: битая ссылка → ${href}`);
  }

  /* --- Картинки --- */
  for (const m of html.matchAll(/<img\b([^>]*)>/g)) {
    const tag = m[1];
    totalImgs++;
    if (!/\salt="/.test(tag)) err(`${url}: <img> без alt`);
    else if (/\salt=""/.test(tag) && !/aria-hidden/.test(tag)) {
      // пустой alt допустим для декоративных — не ругаемся
    }
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) warn(`${url}: <img> без width/height (риск CLS)`);
    const src = (tag.match(/src="([^"]+)"/) || [])[1];
    if (src && src.startsWith('/') && !exists.has(unbase(src))) err(`${url}: нет файла картинки ${src}`);
  }

  /* --- srcset --- */
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u.startsWith('/') && !exists.has(unbase(u))) err(`${url}: нет файла в srcset ${u}`);
    }
  }

  /* --- Доступность (базовое) --- */
  if (!/class="skip-link"/.test(html)) warn(`${url}: нет skip-link`);
  for (const m of html.matchAll(/<button\b([^>]*)>([\s\S]{0,200}?)<\/button>/g)) {
    const attrs = m[1];
    const inner = m[2].replace(/<[^>]+>/g, '').trim();
    if (!inner && !/aria-label=/.test(attrs)) err(`${url}: <button> без текста и aria-label`);
  }
  for (const m of html.matchAll(/<iframe\b([^>]*)>/g)) {
    if (!/title=/.test(m[1])) err(`${url}: <iframe> без title`);
  }
}

/* --- Служебные файлы --- */
for (const f of ['/sitemap.xml', '/robots.txt', '/llms.txt', '/favicon.svg', '/site.webmanifest', '/404.html']) {
  if (!exists.has(f)) err(`нет файла ${f}`);
}

const sitemapXml = existsSync(join(DIST, 'sitemap.xml')) ? readFileSync(join(DIST, 'sitemap.xml'), 'utf8') : '';
const locs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs) {
  const path = loc.replace(/^https?:\/\/[^/]+/, '');
  if (!hasTarget(path)) err(`sitemap: ссылка на несуществующую страницу ${path}`);
}

/* --- Вес страниц --- */
const heavy = htmlFiles
  .map((f) => ({ url: rel(f), kb: Math.round(statSync(f).size / 1024) }))
  .filter((x) => x.kb > 120);
for (const h of heavy) warn(`${h.url}: HTML ${h.kb} КБ — многовато`);

/* --- Итог --- */
const totalKb = Math.round(files.reduce((a, f) => a + statSync(f).size, 0) / 1024);
console.log('');
console.log(`  Страниц: ${htmlFiles.length}   Ссылок проверено: ${totalLinks}   Картинок: ${totalImgs}`);
console.log(`  URL в sitemap: ${locs.length}   Вес dist/: ${(totalKb / 1024).toFixed(1)} МБ`);
console.log('');

if (errors.length) {
  console.log(`  ОШИБКИ (${errors.length}):`);
  for (const e of errors.slice(0, 60)) console.log(`   ✗ ${e}`);
  if (errors.length > 60) console.log(`   … и ещё ${errors.length - 60}`);
  console.log('');
}
if (warns.length) {
  const uniq = [...new Set(warns)];
  console.log(`  Предупреждения (${uniq.length}):`);
  for (const w of uniq.slice(0, 40)) console.log(`   • ${w}`);
  if (uniq.length > 40) console.log(`   … и ещё ${uniq.length - 40}`);
  console.log('');
}
if (!errors.length) console.log('  Ошибок нет.\n');

process.exit(errors.length ? 1 : 0);
