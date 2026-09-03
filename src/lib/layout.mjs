/**
 * Оболочка страницы: <head>, шапка, подвал, микроразметка, счётчики.
 * v4 «Белый завод»: светлая тема, двухъярусная шапка, мобильная панель действий.
 */

import { html, raw, e, jsonld, imageUrl } from './util.mjs';
import { header, footer, mobileBar } from './components.mjs';
import { webPageNode, breadcrumbNode, organizationRefNode, websiteRefNode, ids } from './schema.mjs';

/* Сквозной маршрут: с каждой узловой страницы есть очевидный следующий шаг. */
const NEXT = {
  '/': { title: 'Решения', url: '/resheniya/' },
  '/resheniya/': { title: 'Производство', url: '/proizvodstvo/' },
  '/proizvodstvo/': { title: 'Технологии', url: '/tekhnologii/' },
  '/tekhnologii/': { title: 'Реализованные объекты', url: '/obekty/' },
  '/obekty/': { title: 'О заводе', url: '/o-zavode/' },
  '/o-zavode/': { title: 'Документация', url: '/dokumentaciya/' },
  '/dokumentaciya/': { title: 'Контакты', url: '/kontakty/' },
  '/agrariyam/': { title: 'Зернохранилища', url: '/resheniya/zernohranilishcha/' },
  '/blog/': { title: 'Вопросы и ответы', url: '/faq/' },
  '/faq/': { title: 'Получить расчёт', url: '/raschet/' },
  '/kontakty/': { title: 'Получить расчёт', url: '/raschet/' },
};

function nextBand(next) {
  return `
<a class="next-page" href="${next.url}" aria-label="Следующий раздел: ${e(next.title)}">
  <div class="container">
    <div class="next-page__inner">
      <span class="next-page__label mono">Дальше</span>
      <span class="next-page__title">${e(next.title)}</span>
      <span class="next-page__arrow" aria-hidden="true">&#8594;</span>
    </div>
  </div>
</a>`;
}

/**
 * @param {object} site   данные из site.json
 * @param {object} page   url, title, description, image, crumbs, schema,
 *                        pageType, noindex, bodyClass, next
 * @param {string} content  разметка внутри <main>
 */
export function layout(site, page, content) {
  const url = `${site.url}${page.url}`;
  const ogImage = imageUrl(page.image || 'og-default', site.url);

  const graph = [
    webPageNode(site, page),
    breadcrumbNode(site, page.crumbs),
    ...(page.schema || []),
  ].filter(Boolean);

  // Организация и сайт — на каждой странице (Google не ходит по @id между
  // URL). Дедуп по @id: на /, /kontakty/, /o-zavode/ уже стоит полный узел.
  const id = ids(site.url);
  const has = (nodeId) => graph.some((n) => n['@id'] === nodeId);
  if (!has(id.org)) graph.push(organizationRefNode(site));
  if (!has(id.site)) graph.push(websiteRefNode(site));

  const metrika = site.analytics?.yandexMetrikaId;
  const ga = site.analytics?.googleAnalyticsId;

  return `<!doctype html>
<html lang="${e(site.lang || 'ru')}">
<head>
<meta charset="utf-8">
<script>document.documentElement.classList.add('js');var __ssT=setTimeout(function(){document.documentElement.classList.remove('js')},3000);window.__ssJsReady=function(){clearTimeout(__ssT)};</script>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${e(page.title)}</title>
<meta name="description" content="${e(page.description)}">
<link rel="canonical" href="${e(url)}">
${site._hreflang ? Object.entries(site._hreflang).map(([l, b]) => `<link rel="alternate" hreflang="${l}" href="${e(b + page.url)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${e(site._hreflang.ru + page.url)}">` : ''}
${page.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">'}
<meta name="theme-color" content="#ffffff">
${site.analytics?.googleSiteVerification ? `<meta name="google-site-verification" content="${e(site.analytics.googleSiteVerification)}">` : ''}
<meta name="format-detection" content="telephone=no">

<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:site_name" content="${e(site.brand.name)} — ${e(site.brand.descriptor)}">
<meta property="og:locale" content="${e(site.locale)}">
<meta property="og:title" content="${e(page.ogTitle || page.title)}">
<meta property="og:description" content="${e(page.description)}">
<meta property="og:url" content="${e(url)}">
<meta property="og:image" content="${e(ogImage)}">
<meta property="og:image:width" content="1152">
<meta property="og:image:height" content="768">
<meta property="og:image:alt" content="${e(page.imageAlt || page.title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${e(page.ogTitle || page.title)}">
<meta name="twitter:description" content="${e(page.description)}">
<meta name="twitter:image" content="${e(ogImage)}">

<meta name="geo.region" content="KZ-KUS">
<meta name="geo.placename" content="${e(site.contacts.address.settlement)}">

${page.preloadImage ? `<link rel="preload" as="image" href="${e(page.preloadImage)}" fetchpriority="high">` : ''}
<link rel="preload" href="/assets/fonts/golos-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css?v=${site.buildId}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">

<script type="application/ld+json">${jsonld({ '@context': 'https://schema.org', '@graph': graph })}</script>
<noscript><style>.menu[hidden]{display:flex}.menu{position:static;opacity:1;visibility:visible;padding-top:1.5rem}.burger{display:none}.nav__sub{position:static;opacity:1;visibility:visible;transform:none;box-shadow:none}</style></noscript>
${metrika ? metrikaSnippet(metrika) : ''}${ga ? gaSnippet(ga) : ''}
</head>
<body class="${e(page.bodyClass || '')}">
<a class="skip-link" href="#main">Перейти к содержимому</a>
${header(site, { current: page.url })}
<main id="main">
${content}
</main>
${page.next ? nextBand(page.next) : NEXT[page.url] ? nextBand(NEXT[page.url]) : ''}
${footer(site)}
${mobileBar(site, page.url)}
<script src="/assets/js/site.js?v=${site.buildId}" defer></script>
</body>
</html>
`;
}

/* --- Счётчики (подключаются только если задан ID) ------------------------ */

function metrikaSnippet(id) {
  return `
<script>
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${Number(id)},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
window.__ymId=${Number(id)};
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/${Number(id)}" style="position:absolute;left:-9999px" alt=""></div></noscript>`;
}

function gaSnippet(id) {
  return `
<script async src="https://www.googletagmanager.com/gtag/js?id=${e(id)}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${e(id)}');</script>`;
}

export { html, raw, e };
