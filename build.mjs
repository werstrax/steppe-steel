/**
 * Сборщик сайта Steppe Steel v4 («Белый завод»).
 *
 *   node build.mjs            собрать в dist/
 *   node build.mjs --watch    пересобирать при изменениях
 *
 * Зависимостей нет. На выходе — статика для GitHub Pages (домен steppesteel.kz,
 * basePath пустой; механизм rebase оставлен для отката на project pages).
 */

import { mkdirSync, writeFileSync, rmSync, existsSync, watch, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

import { loadJSON, setImageManifest, outPath, copyDir } from './src/lib/util.mjs';

import { renderHome } from './src/pages/home.mjs';
import { renderSolutionsIndex, renderSolution } from './src/pages/solutions.mjs';
import { renderAgro } from './src/pages/agro.mjs';
import { renderBuilders } from './src/pages/builders.mjs';
import { renderDesigners } from './src/pages/designers.mjs';
import { renderNetwork } from './src/pages/network.mjs';
import { renderPortfolio } from './src/pages/portfolio.mjs';
import { renderProduction } from './src/pages/production.mjs';
import { renderTechIndex, renderTech } from './src/pages/tech.mjs';
import { renderDocuments } from './src/pages/documents.mjs';
import { renderProfili } from './src/pages/profili.mjs';
import { renderAbout } from './src/pages/about.mjs';
import { renderRegion } from './src/pages/regions.mjs';
import { renderJournalIndex, renderArticle } from './src/pages/journal.mjs';
import { renderKontakty, renderRaschet, renderThanks, renderFaq, renderPrivacy, renderNotFound } from './src/pages/contact.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

const warnings = [];
const warn = (msg) => warnings.push(msg);

/* --- Данные -------------------------------------------------------------- */

/**
 * Языковая архитектура (ТЗ §25). Казахская версия включается созданием
 * папки src/data/kk/ с переведёнными копиями JSON (можно переводить
 * по одному файлу — остальные возьмутся из русской версии). Сборка сама
 * соберёт зеркало под /kk/ и расставит hreflang на обеих версиях.
 * Английская добавляется тем же способом: src/data/en/ + код в LANGS.
 */
const LANGS = ['kk'];

function dataPath(name, lang) {
  if (lang) {
    const override = join(SRC, 'data', lang, name);
    if (existsSync(override)) return override;
  }
  return join(SRC, 'data', name);
}

function loadData(lang) {
  const site = loadJSON(dataPath('site.json', lang));
  const images = JSON.parse(readFileSync(dataPath('images.json', lang), 'utf8'));
  delete images._readme;
  setImageManifest(images);

  const d = {
    site,
    images,
    solutions: loadJSON(dataPath('solutions.json', lang)),
    tech: loadJSON(dataPath('tech.json', lang)),
    production: loadJSON(dataPath('production.json', lang)),
    portfolio: loadJSON(dataPath('portfolio.json', lang)),
    documents: loadJSON(dataPath('documents.json', lang)),
    agrarians: loadJSON(dataPath('agrarians.json', lang)),
    builders: loadJSON(dataPath('builders.json', lang)),
    designers: loadJSON(dataPath('designers.json', lang)),
    network: loadJSON(dataPath('network.json', lang)),
    profiles: loadJSON(dataPath('profiles.json', lang)),
    faq: loadJSON(dataPath('faq.json', lang)),
    journal: loadJSON(dataPath('journal.json', lang)),
    regions: loadJSON(dataPath('regions.json', lang)),
    payback: loadJSON(dataPath('payback.json', lang)),
    team: loadJSON(dataPath('team.json', lang)),
  };

  // Версия для ?v= у CSS/JS — от содержимого файлов, а не от даты сборки.
  site.buildId = assetHash([
    join(SRC, 'assets', 'css', 'site.css'),
    join(SRC, 'assets', 'js', 'site.js'),
  ]);
  site.buildDate = new Date().toISOString().slice(0, 10);

  // Превью-сборка (SITE_URL, BASE_PATH, PREVIEW=1): для показа заказчику на
  // github.io — свой адрес, префикс подпапки, noindex и без CNAME.
  if (process.env.SITE_URL) site.url = process.env.SITE_URL;
  if (process.env.BASE_PATH !== undefined) site.basePath = process.env.BASE_PATH;
  site._preview = process.env.PREVIEW === '1';

  // Для футера и перелинковки
  site._solutions = d.solutions.items;
  // Презентация завода — кнопка в шапке и подвале (первый PDF категории «Презентации»)
  site.presentation = d.documents.categories.find((c) => c.id === 'prezentacii')?.items[0]?.file || '';

  return d;
}

function assetHash(paths) {
  const h = createHash('sha1');
  for (const p of paths) h.update(readFileSync(p));
  return h.digest('hex').slice(0, 8);
}

/* --- Проверки целостности ------------------------------------------------ */

function validate(d) {
  const slugs = new Set(d.solutions.items.map((p) => p.slug));

  for (const p of d.solutions.items) {
    for (const r of p.related || []) if (!slugs.has(r)) warn(`solutions: у «${p.title}» ссылка на несуществующее решение «${r}»`);
    if ((p.seoTitle || '').length > 65) warn(`SEO: длинный title у ${p.url} (${p.seoTitle.length})`);
    if ((p.seoDescription || '').length > 170) warn(`SEO: длинный description у ${p.url} (${p.seoDescription.length})`);
    if (!p.icon) warn(`solutions: у «${p.title}» нет иконки`);
  }

  for (const a of d.journal.items) {
    if (!d.images[a.cover]) warn(`journal: нет обложки «${a.cover}» для «${a.title}»`);
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

  add('/resheniya/', renderSolutionsIndex(d));
  for (const s of d.solutions.items) add(s.url, renderSolution(d, s));

  add('/agrariyam/', renderAgro(d));
  add('/stroitelnym-kompaniyam/', renderBuilders(d));
  add('/proektirovshchikam/', renderDesigners(d));
  add('/partneram/', renderNetwork(d));
  add('/obekty/', renderPortfolio(d));

  add('/proizvodstvo/', renderProduction(d));
  add('/tekhnologii/', renderTechIndex(d));
  for (const t of d.tech.items) add(t.url, renderTech(d, t));
  add('/profili/', renderProfili(d));
  add('/dokumentaciya/', renderDocuments(d));

  for (const r of d.regions.items) add(`/${r.slug}/`, renderRegion(d, r));
  add('/o-zavode/', renderAbout(d));

  add('/blog/', renderJournalIndex(d));
  for (const a of d.journal.items) add(a.url, renderArticle(d, a), { lastmod: a.updated || a.date });

  add('/faq/', renderFaq(d));
  add('/kontakty/', renderKontakty(d));
  add('/raschet/', renderRaschet(d));
  add('/raschet/spasibo/', renderThanks(d), { noindex: true });
  add('/privacy/', renderPrivacy(d), { noindex: true });
  add('/404.html', renderNotFound(d), { raw: true, noindex: true });

  return pages;
}

/* --- Редиректы со старых URL (v1 плоские + v3 каталожные) ------------------ */

/** Плоские файлы v1 (пишутся как <имя>.html в корень). */
const LEGACY_FLAT = {
  'katalog.html': '/resheniya/',
  'zernohranilishcha.html': '/resheniya/zernohranilishcha/',
  'angary-sklady.html': '/resheniya/angary/',
  'tseha-zavody.html': '/resheniya/proizvodstvennye-zdaniya/',
  'o-kompanii.html': '/o-zavode/',
  'kontakty.html': '/kontakty/',
  'blog.html': '/blog/',
  'blog-zerno-raschet.html': '/blog/zerno-raschet/',
  'blog-km-kmd.html': '/blog/km-kmd/',
  'blog-fundament.html': '/blog/fundament/',
  'blog-lstk-lmk.html': '/blog/lstk-lmk/',
};

/** Каталожные URL v3 (пишутся как <путь>/index.html). */
const LEGACY_DIRS = {
  '/katalog/': '/resheniya/',
  '/katalog/zernohranilishcha/': '/resheniya/zernohranilishcha/',
  '/katalog/angary-sklady/': '/resheniya/angary/',
  '/katalog/tseha-zavody/': '/resheniya/proizvodstvennye-zdaniya/',
  '/uslugi/': '/proizvodstvo/',
  '/uslugi/proektirovanie/': '/tekhnologii/proektirovanie/',
  '/uslugi/proizvodstvo/': '/proizvodstvo/',
  '/uslugi/komplektaciya-dostavka/': '/proizvodstvo/',
  '/process/': '/proizvodstvo/',
  '/partnyoram/': '/proektirovshchikam/',
  '/predstavitelyam/': '/partneram/',
  '/zayavka/': '/raschet/',
  '/zayavka/spasibo/': '/raschet/spasibo/',
};

function redirectStub(site, to) {
  const url = `${site.url}${to}`;
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>Страница переехала — ${site.brand.name}</title>
<meta http-equiv="refresh" content="0;url=${url}">
<link rel="canonical" href="${url}">
<meta name="robots" content="noindex">
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
      const changefreq = p.url === '/' || p.url === '/resheniya/' || p.url === '/obekty/' ? 'weekly' : 'monthly';
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
  if (site._preview) return `# Превью для заказчика — не индексировать\nUser-agent: *\nDisallow: /\n`;
  return `# robots.txt — ${site.brand.name}, ${site.url}

User-agent: *
Allow: /
Disallow: /raschet/spasibo/
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
  const { site, solutions, tech, journal, regions } = d;
  const a = site.contacts.address;
  return `# ${site.brand.name} — ${site.brand.descriptor}

> Завод строительных металлоконструкций в селе Троебратское Костанайской
> области, Казахстан. Полный цикл: проектирование (эскиз, расчёт, разделы
> КМ/КМД) → производство (линия профилирования, плазменная и лазерная резка,
> сварочные участки) → комплектация → отгрузка по Казахстану. Производит
> металлокаркасы из ЛСТК и ЛМК для промышленных, сельскохозяйственных,
> складских и коммерческих зданий. ${site.brand.slogan}

## Факты

- Телефон / WhatsApp: ${site.contacts.phone}
- E-mail: ${site.contacts.email}
- Адрес производства: ${a.settlement}, ${a.district}, ${a.region}, ${a.country}
- Instagram: ${site.contacts.instagramHandle}
- Решения: зернохранилища, склады, производственные здания, ангары, овощехранилища, здания для сельхозтехники, СТО и автопарки, спортивные объекты, модульные здания
- Профили собственного производства (заводские обозначения): ПСУ — профиль С-образный усиленный (сигма-образное сечение с продольным ребром) для рам и стоек; ПС — профиль С-образный для прогонов и элементов ферм. Оцинкованная сталь толщиной до 3,5 мм, высота сечения 100–280 мм
- Профили сертифицированы: сертификат соответствия РК № KZ.3510317.01.01.67913 (до 01.06.2027), 43 позиции сортамента ПСУ 150–280 и ПС 100–280
- Пролёт до 24 м без внутренних колонн; расчёт на III снеговой район (~180 кгс/м²), эксплуатация до −40 °C
- Зернохранилища: напольное хранение навалом, винтовые сваи и металлический ростверк без бетона, наклонные стены, секции до 140 м, 100 % болтовая сборка; вместимость на 1 м длины: пшеница 67 т, горох 70 т, кукуруза 62 т, ячмень 56 т, подсолнечник 37 т
- Проектный отдел: расчёты в ЛИРА-САПР, разделы КМ/КМД в Tekla Structures по нормам СП РК EN (Еврокоды), сопровождение экспертизы
- Для строительных компаний: изготовление металлокаркасов по проекту заказчика или с нуля, комплектная поставка, шеф-монтаж
- Для проектных организаций: конструктив (КМ, КМД, РПЗ, нагрузки на фундамент) силами завода, агентское вознаграждение по договору
- Региональная партнёрская сеть: запросы по закреплённой территории, обучение, шеф-монтаж первого объекта

## Решения

${solutions.items.map((p) => `- [${p.title}](${site.url}${p.url}) — ${p.summary || p.lead}`).join('\n')}

## Технологии

${tech.items.map((t) => `- [${t.title}](${site.url}${t.url}) — ${t.lead}`).join('\n')}

## Материалы

${journal.items.map((x) => `- [${x.title}](${site.url}${x.url}) — ${x.summary}`).join('\n')}

## Основные разделы

- [Главная](${site.url}/)
- [Решения](${site.url}/resheniya/)
- [Аграриям](${site.url}/agrariyam/)
- [Строительным компаниям](${site.url}/stroitelnym-kompaniyam/)
- [Проектировщикам](${site.url}/proektirovshchikam/)
- [Партнёрам](${site.url}/partneram/)
- [Реализованные объекты](${site.url}/obekty/)
- [Производство](${site.url}/proizvodstvo/)
- [Профили ПСУ и ПС](${site.url}/profili/)
- [Документация](${site.url}/dokumentaciya/)
- [О заводе](${site.url}/o-zavode/)
- [Контакты](${site.url}/kontakty/)

## Регионы работы

${regions.items.map((r) => `- [${r.city} — ${r.region}](${site.url}/${r.slug}/) — ${r.seoDescription}`).join('\n')}
`;
}

function webmanifest(site) {
  const b = site.basePath || '';
  return JSON.stringify(
    {
      name: `${site.brand.name} — ${site.brand.descriptor}`,
      short_name: site.brand.name,
      description: 'Завод строительных металлоконструкций. Костанайская область, Казахстан.',
      start_url: `${b}/`,
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#16181b',
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

/** Фавикон — знак завода: графитовый квадрат, оранжевая полоса, буква S. */
function favicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#16181b"/>
  <rect x="0" y="50" width="64" height="6" fill="#e8781a"/>
  <text x="32" y="42" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
        font-size="34" font-weight="700" fill="#f5f6f7" letter-spacing="1">S</text>
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

  const activeLangs = LANGS.filter((l) => existsSync(join(SRC, 'data', l)));
  if (activeLangs.length) {
    d.site._hreflang = { ru: d.site.url };
    for (const l of activeLangs) d.site._hreflang[l] = `${d.site.url}/${l}`;
  }

  const pages = buildPages(d);
  const base = d.site.basePath || '';

  for (const p of pages) {
    const rel = p.raw ? p.url.replace(/^\//, '') : outPath(p.url);
    const file = join(DIST, rel);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, rebase(String(p.html), base), 'utf8');
  }

  // Языковые зеркала: /kk/… с теми же слагами, hreflang и общими ассетами
  for (const l of activeLangs) {
    const dl = loadData(l);
    dl.site.lang = l;
    dl.site.locale = l === 'kk' ? 'kk_KZ' : dl.site.locale;
    dl.site.url = `${d.site.url}/${l}`;
    dl.site._hreflang = d.site._hreflang;
    for (const p of buildPages(dl)) {
      if (p.raw) continue; // 404 остаётся один, русский
      const file = join(DIST, l, outPath(p.url));
      mkdirSync(dirname(file), { recursive: true });
      let html = rebase(String(p.html), `${base}/${l}`);
      // ассеты и служебные файлы общие — префикс языка с них снимается
      html = html
        .replace(new RegExp(`"/${l}/(assets/|favicon|icon-|apple-touch-icon|site\.webmanifest|sitemap\.xml)`, 'g'), '"/$1')
        .replace(new RegExp(`url\('/${l}/assets/`, 'g'), "url('/assets/")
        .replace(new RegExp(`${d.site.url}/${l}/assets/`, 'g'), `${d.site.url}/assets/`);
      writeFileSync(file, html, 'utf8');
    }
  }

  // Заглушки со старых URL: плоские v1 и каталожные v3
  for (const [from, to] of Object.entries(LEGACY_FLAT)) {
    writeFileSync(join(DIST, from), redirectStub(d.site, to), 'utf8');
  }
  for (const [from, to] of Object.entries(LEGACY_DIRS)) {
    const file = join(DIST, outPath(from));
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, redirectStub(d.site, to), 'utf8');
  }

  // Статика. static/ уходит в корень, raw/ — исходники, не копируем.
  copyDir(join(SRC, 'assets'), join(DIST, 'assets'), (_src, name) => name === 'raw' || name === 'static');
  copyDir(join(SRC, 'assets', 'static'), DIST, (_src, name) => d.site._preview && name === 'CNAME');

  writeFileSync(join(DIST, 'sitemap.xml'), sitemap(d.site, pages), 'utf8');
  writeFileSync(join(DIST, 'robots.txt'), robots(d.site), 'utf8');
  writeFileSync(join(DIST, 'llms.txt'), llmsTxt(d), 'utf8');
  writeFileSync(join(DIST, 'site.webmanifest'), webmanifest(d.site), 'utf8');
  writeFileSync(join(DIST, 'favicon.svg'), favicon(), 'utf8');
  writeFileSync(join(DIST, '.nojekyll'), '', 'utf8');

  const ms = Date.now() - t0;
  console.log(`\n  Steppe Steel — сборка завершена за ${ms} мс`);
  console.log(`  Страниц: ${pages.length} (+${Object.keys(LEGACY_FLAT).length + Object.keys(LEGACY_DIRS).length} редиректов)   →   ${resolve(DIST)}\n`);

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
