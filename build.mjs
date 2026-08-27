/**
 * Сборщик сайта Steppe Steel v3 («Заводской стандарт»).
 *
 *   node build.mjs            собрать в dist/
 *   node build.mjs --watch    пересобирать при изменениях
 *
 * Зависимостей нет. На выходе — статика, готовая для GitHub Pages
 * (project pages: сайт живёт в подпапке /steppe-steel/, поэтому все
 * корневые пути после рендера переписываются с префиксом BASE).
 */

import { mkdirSync, writeFileSync, rmSync, existsSync, watch, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

import { loadJSON, setImageManifest, outPath, copyDir, plural } from './src/lib/util.mjs';

import { renderHome } from './src/pages/home.mjs';
import { renderPartners } from './src/pages/partners.mjs';
import { renderDealers } from './src/pages/dealers.mjs';
import { renderRegion } from './src/pages/regions.mjs';
import { renderKatalogIndex, renderProduct } from './src/pages/katalog.mjs';
import { renderUslugiIndex, renderService } from './src/pages/uslugi.mjs';
import { renderProfili } from './src/pages/profili.mjs';
import { renderAbout, renderProcess } from './src/pages/about.mjs';
import { renderJournalIndex, renderArticle } from './src/pages/journal.mjs';
import { renderKontakty, renderZayavka, renderThanks, renderFaq, renderPrivacy, renderNotFound } from './src/pages/contact.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

const warnings = [];
const warn = (msg) => warnings.push(msg);

/* --- Данные -------------------------------------------------------------- */

function loadData() {
  const site = loadJSON(join(SRC, 'data', 'site.json'));
  const images = JSON.parse(readFileSync(join(SRC, 'data', 'images.json'), 'utf8'));
  delete images._readme;
  setImageManifest(images);

  const products = loadJSON(join(SRC, 'data', 'products.json'));
  const services = loadJSON(join(SRC, 'data', 'services.json'));
  const profiles = loadJSON(join(SRC, 'data', 'profiles.json'));
  const process = loadJSON(join(SRC, 'data', 'process.json'));
  const faq = loadJSON(join(SRC, 'data', 'faq.json'));
  const journal = loadJSON(join(SRC, 'data', 'journal.json'));
  const cycle = loadJSON(join(SRC, 'data', 'cycle.json'));
  const partners = loadJSON(join(SRC, 'data', 'partners.json'));
  const dealers = loadJSON(join(SRC, 'data', 'dealers.json'));
  const payback = loadJSON(join(SRC, 'data', 'payback.json'));
  const regions = loadJSON(join(SRC, 'data', 'regions.json'));
  const material = loadJSON(join(SRC, 'data', 'material.json'));

  // Версия для ?v= у CSS/JS — от содержимого файлов, а не от даты сборки.
  site.buildId = assetHash([
    join(SRC, 'assets', 'css', 'site.css'),
    join(SRC, 'assets', 'js', 'site.js'),
  ]);
  site.buildDate = new Date().toISOString().slice(0, 10);

  // Для футера и перелинковки
  site._products = products.items;
  site._services = services.items;

  return { site, images, products, services, profiles, process, faq, journal, cycle, material, partners, dealers, payback, regions };
}

function assetHash(paths) {
  const h = createHash('sha1');
  for (const p of paths) h.update(readFileSync(p));
  return h.digest('hex').slice(0, 8);
}

/* --- Проверки целостности ------------------------------------------------ */

function validate(d) {
  const pslugs = new Set(d.products.items.map((p) => p.slug));
  const sslugs = new Set(d.services.items.map((s) => s.slug));

  for (const p of d.products.items) {
    if (!d.images[p.cover]) warn(`products: нет обложки «${p.cover}» для «${p.title}»`);
    for (const g of p.gallery || []) if (!g.video && !d.images[g.img]) warn(`products: нет картинки «${g.img}» в галерее «${p.title}»`);
    for (const r of p.related || []) if (!pslugs.has(r)) warn(`products: у «${p.title}» ссылка на несуществующий продукт «${r}»`);
    if ((p.seoTitle || '').length > 65) warn(`SEO: длинный title у /katalog/${p.slug}/ (${p.seoTitle.length})`);
    if ((p.seoDescription || '').length > 170) warn(`SEO: длинный description у /katalog/${p.slug}/ (${p.seoDescription.length})`);
  }

  for (const s of d.services.items) {
    if (!d.images[s.image]) warn(`services: нет картинки «${s.image}» для «${s.title}»`);
    for (const r of s.related || []) if (!sslugs.has(r)) warn(`services: у «${s.title}» ссылка на несуществующую услугу «${r}»`);
  }

  for (const a of d.journal.items) {
    if (!d.images[a.cover]) warn(`journal: нет обложки «${a.cover}» для «${a.title}»`);
    for (const rel of a.products || []) if (!pslugs.has(rel)) warn(`journal: у «${a.title}» ссылка на несуществующий продукт «${rel}»`);
  }

  if (!d.site.contacts.geo?.verified) warn('site: координаты завода не подтверждены — geo не выводится в Schema.org');
  if (!d.site.forms.endpoint) warn('site: forms.endpoint пуст — формы работают через WhatsApp-фолбэк (это ок)');
  if (!d.site.analytics.yandexMetrikaId && !d.site.analytics.googleAnalyticsId) warn('site: счётчики аналитики не подключены');
}

/* --- Страницы ------------------------------------------------------------ */

function buildPages(d) {
  const pages = [];
  const add = (url, html, opts = {}) => pages.push({ url, html, ...opts });

  add('/', renderHome(d));

  add('/katalog/', renderKatalogIndex(d));
  for (const p of d.products.items) add(p.url, renderProduct(d, p));

  add('/uslugi/', renderUslugiIndex(d));
  for (const s of d.services.items) add(s.url, renderService(d, s));

  add('/profili/', renderProfili(d));
  add('/process/', renderProcess(d));
  add('/partnyoram/', renderPartners(d));
  add('/predstavitelyam/', renderDealers(d));
  for (const r of d.regions.items) add(`/${r.slug}/`, renderRegion(d, r));
  add('/o-zavode/', renderAbout(d));

  add('/blog/', renderJournalIndex(d));
  for (const a of d.journal.items) add(a.url, renderArticle(d, a), { lastmod: a.updated || a.date });

  add('/faq/', renderFaq(d));
  add('/kontakty/', renderKontakty(d));
  add('/zayavka/', renderZayavka(d));
  add('/zayavka/spasibo/', renderThanks(d), { noindex: true });
  add('/privacy/', renderPrivacy(d), { noindex: true });
  add('/404.html', renderNotFound(d), { raw: true, noindex: true });

  return pages;
}

/* --- Переезд со старых плоских URL (v1) ---------------------------------- */

const LEGACY = {
  'katalog.html': '/katalog/',
  'zernohranilishcha.html': '/katalog/zernohranilishcha/',
  'angary-sklady.html': '/katalog/angary-sklady/',
  'tseha-zavody.html': '/katalog/tseha-zavody/',
  'o-kompanii.html': '/o-zavode/',
  'kontakty.html': '/kontakty/',
  'blog.html': '/blog/',
  'blog-zerno-raschet.html': '/blog/zerno-raschet/',
  'blog-km-kmd.html': '/blog/km-kmd/',
  'blog-fundament.html': '/blog/fundament/',
  'blog-lstk-lmk.html': '/blog/lstk-lmk/',
};

function redirectStub(site, to) {
  const url = `${site.url}${to}`;
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>Страница переехала — Steppe Steel</title>
<meta http-equiv="refresh" content="0;url=${url}">
<link rel="canonical" href="${url}">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family:system-ui;padding:2rem">
<p>Страница переехала: <a href="${url}">${url}</a></p>
</body>
</html>
`;
}

/* --- Префикс подпапки (GitHub project pages) ------------------------------ */

/**
 * Переписывает корневые пути в готовом HTML: href="/x" → href="/steppe-steel/x".
 * Абсолютные URL (https://…), протокол-относительные (//…) и data: не трогает.
 */
function rebase(html, base) {
  if (!base) return html;
  return html
    .replace(/(href|src|poster|action|data-src)="\/(?!\/)/g, `$1="${base}/`)
    .replace(/srcset="([^"]+)"/g, (m, v) => `srcset="${v.replace(/(^|,\s*)\/(?!\/)/g, `$1${base}/`)}"`)
    .replace(/url\('\/(?!\/)/g, `url('${base}/`);
}

/* --- Служебные файлы ----------------------------------------------------- */

function sitemap(site, pages) {
  const rows = pages
    .filter((p) => !p.noindex && !p.raw)
    .map((p) => {
      const priority = p.url === '/' ? '1.0' : p.url.split('/').filter(Boolean).length === 1 ? '0.8' : '0.6';
      const changefreq = p.url === '/' || p.url === '/katalog/' ? 'weekly' : 'monthly';
      return `  <url>
    <loc>${site.url}${p.url}</loc>
    <lastmod>${p.lastmod || site.buildDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows}
</urlset>
`;
}

function robots(site) {
  return `# robots.txt — ${site.brand.name}, ${site.url}

User-agent: *
Allow: /
Disallow: /zayavka/spasibo/
Disallow: /privacy/

# AI-поисковики и ассистенты: доступ открыт сознательно — мы хотим,
# чтобы завод цитировался в ответах. Убирайте блоки, если политика изменится.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: YandexAdditional
Allow: /

Sitemap: ${site.url}/sitemap.xml
`;
}

/**
 * llms.txt — выжимка о заводе для языковых моделей.
 */
function llmsTxt(d) {
  const { site, products, services, journal, regions } = d;
  const a = site.contacts.address;
  return `# ${site.brand.name} — ${site.brand.descriptor}

> Завод лёгких стальных тонкостенных конструкций (ЛСТК) и металлоконструкций
> полного цикла в селе Троебратское Костанайской области, Казахстан.
> Проектирование (эскиз, расчёт, раздел КМ) → производство (линия профилирования,
> плазменная и лазерная резка, сварочные участки) → комплектация → отгрузка
> собственным автотранспортом по Казахстану. Комбинирует ЛСТК и чёрный металл
> (фермы, колонны, опорные узлы) для промышленных зданий: зернохранилища,
> склады, ангары, цеха. Слоган: ${site.brand.slogan}.

## Факты

- Телефон / WhatsApp: ${site.contacts.phone}
- E-mail: ${site.contacts.email}
- Адрес производства: ${a.street ? a.street + ', ' : ''}${a.settlement}, ${a.district}, ${a.region}, ${a.country}
- Instagram: ${site.contacts.instagramHandle}
- Продукция: зернохранилища напольного хранения, ангары и склады, цеха и заводские здания, спортивные залы
- Профили собственного производства (заводские обозначения): ПСУ — профиль С-образный усиленный, сигма-образное сечение с продольным ребром, для рам и стоек; ПС — профиль С-образный, для прогонов и элементов ферм. Оцинкованная сталь толщиной до 3,5 мм, высота сечения 150–280 мм. П-профиль (направляющий) завод не производит
- Вместимость зернохранилища на 1 м длины: пшеница 67 т, горох 70 т, кукуруза 62 т, ячмень 56 т, подсолнечник 37 т
- Конструктив зернохранилищ: винтовые сваи и металлический ростверк без бетона, наклонные стены с подкосной системой, секции до 140 м, 100 % болтовая сборка
- Расчётные условия: снеговые и ветровые нагрузки по СП РК, эксплуатация при морозах до −40 °C
- Профили сертифицированы: сертификат соответствия РК № KZ.3510317.01.01.67913 (до 01.06.2027) на холодногнутые профили из оцинкованной стали, 43 позиции сортамента ПСУ 150–280 и ПС 100–280
- Конструкторский отдел завода выполняет расчёты в ЛИРА-САПР и разделы КМ/КМД (Tekla Structures) по нормам СП РК EN (Еврокоды), сопровождает экспертизу
- Партнёрская программа для проектных организаций: завод берёт конструктивную часть, заказчик и авторство проекта остаются за проектировщиком, предусмотрено агентское вознаграждение по договору
- Партнёрская сеть для строительных компаний: региональный представитель получает запросы и клиентскую базу по закреплённой территории, партнёрские условия на металлоконструкции, обучение бригад и шеф-монтаж; доход партнёра складывается из поставки комплекта, монтажа и сопутствующих работ
- Флагманские направления: навесы для сельхозтехники и модульные зернохранилища

## Продукция

${products.items.map((p) => `- [${p.title}](${site.url}${p.url}) — ${p.summary}`).join('\n')}

## Услуги завода

${services.items.map((s) => `- [${s.title}](${site.url}${s.url}) — ${s.summary}`).join('\n')}

## Материалы

${journal.items.map((x) => `- [${x.title}](${site.url}${x.url}) — ${x.summary}`).join('\n')}

## Основные разделы

- [Главная](${site.url}/)
- [Каталог](${site.url}/katalog/)
- [Профили ПСУ и ПС](${site.url}/profili/)
- [Услуги](${site.url}/uslugi/)
- [Процесс работы](${site.url}/process/)
- [Проектным организациям](${site.url}/partnyoram/)
- [Строительным компаниям](${site.url}/predstavitelyam/)

## Регионы работы

${regions.items.map((r) => `- [${r.city} — ${r.region}](${site.url}/${r.slug}/) — ${r.seoDescription}`).join('\n')}
- [О заводе](${site.url}/o-zavode/)
- [Вопросы и ответы](${site.url}/faq/)
- [Контакты](${site.url}/kontakty/)
`;
}

function webmanifest(site) {
  const b = site.basePath || '';
  return JSON.stringify(
    {
      name: `${site.brand.name} — ${site.brand.descriptor}`,
      short_name: site.brand.name,
      description: `Завод ЛСТК и металлоконструкций полного цикла. Костанайская область, Казахстан.`,
      start_url: `${b}/`,
      display: 'standalone',
      background_color: '#0b0c0e',
      theme_color: '#0b0c0e',
      lang: 'ru',
      icons: [
        { src: `${b}/favicon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        { src: `${b}/apple-touch-icon.png`, sizes: '180x180', type: 'image/png' },
        { src: `${b}/icon-192.png`, sizes: '192x192', type: 'image/png' },
        { src: `${b}/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    },
    null,
    2
  );
}

/** Фавикон — знак завода: тёмный квадрат, оранжевая полоса, буква S. */
function favicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#0b0c0e"/>
  <rect x="0" y="50" width="64" height="6" fill="#e8781a"/>
  <text x="32" y="42" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
        font-size="34" font-weight="700" fill="#f2f1ec" letter-spacing="1">S</text>
</svg>
`;
}

/* --- Сборка -------------------------------------------------------------- */

function build() {
  const t0 = Date.now();
  warnings.length = 0;

  const d = loadData();
  validate(d);

  if (existsSync(DIST)) rmSync(DIST, { recursive: true, force: true });
  mkdirSync(DIST, { recursive: true });

  const pages = buildPages(d);
  const base = d.site.basePath || '';

  for (const p of pages) {
    const rel = p.raw ? p.url.replace(/^\//, '') : outPath(p.url);
    const file = join(DIST, rel);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, rebase(String(p.html), base), 'utf8');
  }

  // Заглушки со старых плоских URL v1
  for (const [from, to] of Object.entries(LEGACY)) {
    writeFileSync(join(DIST, from), redirectStub(d.site, to), 'utf8');
  }

  // Статика. static/ уходит в корень, raw/ — исходники, не копируем.
  copyDir(join(SRC, 'assets'), join(DIST, 'assets'), (_src, name) => name === 'raw' || name === 'static');
  copyDir(join(SRC, 'assets', 'static'), DIST);

  writeFileSync(join(DIST, 'sitemap.xml'), sitemap(d.site, pages), 'utf8');
  writeFileSync(join(DIST, 'robots.txt'), robots(d.site), 'utf8');
  writeFileSync(join(DIST, 'llms.txt'), llmsTxt(d), 'utf8');
  writeFileSync(join(DIST, 'site.webmanifest'), webmanifest(d.site), 'utf8');
  writeFileSync(join(DIST, 'favicon.svg'), favicon(), 'utf8');
  writeFileSync(join(DIST, '.nojekyll'), '', 'utf8');

  const ms = Date.now() - t0;
  console.log(`\n  STEPPE STEEL — сборка завершена за ${ms} мс`);
  console.log(`  Страниц: ${pages.length} (+${Object.keys(LEGACY).length} редиректов)   →   ${resolve(DIST)}\n`);

  if (warnings.length) {
    console.log(`  Предупреждения (${warnings.length}):`);
    for (const w of warnings) console.log(`   • ${w}`);
    console.log('');
  }
}

/* --- Запуск -------------------------------------------------------------- */

build();

if (process.argv.includes('--watch')) {
  console.log('  Слежу за изменениями в src/ … (Ctrl+C — выход)\n');
  let timer = null;
  watch(SRC, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        build();
      } catch (err) {
        console.error('  Ошибка сборки:', err.message);
      }
    }, 120);
  });
}
