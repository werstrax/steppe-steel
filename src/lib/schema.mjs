/**
 * Микроразметка Schema.org (JSON-LD) для завода металлоконструкций.
 *
 * Один связный граф на сайт (@graph) с постоянными @id: организация,
 * сайт, продукция (Product), услуги (Service), статьи, FAQ, крошки.
 * Так классический поиск и AI-поиск (AI Overviews, Perplexity, ChatGPT
 * Search, Яндекс Нейро) видят одну однозначную сущность.
 */

import { imageUrl } from './util.mjs';

export const ids = (base) => ({
  org: `${base}/#organization`,
  site: `${base}/#website`,
});

/* --- Базовые узлы ------------------------------------------------------- */

export function organizationNode(site, opts = {}) {
  const id = ids(site.url);
  const c = site.contacts;
  const a = c.address;

  const sameAs = [c.instagram].filter(Boolean);

  const node = {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': id.org,
    name: site.brand.name,
    alternateName: [site.brand.nameLatin, 'Степпе Стил', 'ЛСТК завод Steppe Steel', c.instagramHandle],
    url: `${site.url}/`,
    description: opts.description ||
      'Завод лёгких стальных тонкостенных конструкций (ЛСТК) и металлоконструкций полного цикла: проектирование, производство, комплектация, отгрузка. Зернохранилища, ангары, склады, цеха. Костанайская область, Казахстан.',
    slogan: site.brand.slogan,
    logo: {
      '@type': 'ImageObject',
      '@id': `${site.url}/#logo`,
      url: `${site.url}/assets/img/ui/logo-band.jpg`,
      contentUrl: `${site.url}/assets/img/ui/logo-band.jpg`,
      caption: 'Steppe Steel — Metal Structures · Industrial Systems',
    },
    image: imageUrl('og-default', site.url),
    telephone: c.phoneRaw,
    email: c.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: a.settlement,
      addressRegion: a.region,
      addressCountry: a.countryCode,
    },
    areaServed: [
      { '@type': 'Country', name: 'Казахстан' },
      { '@type': 'State', name: 'Костанайская область' },
      { '@type': 'State', name: 'Северо-Казахстанская область' },
      { '@type': 'State', name: 'Акмолинская область' },
    ],
    knowsAbout: [
      'ЛСТК', 'лёгкие стальные тонкостенные конструкции', 'металлоконструкции',
      'зернохранилища', 'ангары', 'склады', 'производственные цеха',
      'раздел КМ', 'плазменная резка', 'лазерная резка',
    ],
    knowsLanguage: ['ru', 'kk'],
    currenciesAccepted: site.currency,
    sameAs,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: c.phoneRaw,
        email: c.email,
        areaServed: 'KZ',
        availableLanguage: ['Russian', 'Kazakh'],
      },
    ],
  };

  if (c.hours?.allDay) {
    node.openingHoursSpecification = [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    }];
  }

  if (c.geo && c.geo.verified) {
    node.geo = { '@type': 'GeoCoordinates', latitude: c.geo.lat, longitude: c.geo.lon };
  }

  if (opts.products && opts.products.length) {
    node.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Продукция завода',
      itemListElement: opts.products.map((p) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', '@id': `${site.url}${p.url}#product`, name: p.title },
      })),
    };
  }

  return node;
}

export function websiteNode(site) {
  const id = ids(site.url);
  return {
    '@type': 'WebSite',
    '@id': id.site,
    url: `${site.url}/`,
    name: `${site.brand.name} — ${site.brand.descriptor}`,
    inLanguage: 'ru-KZ',
    publisher: { '@id': id.org },
  };
}

export function webPageNode(site, page) {
  const id = ids(site.url);
  return {
    '@type': page.pageType || 'WebPage',
    '@id': `${site.url}${page.url}#webpage`,
    url: `${site.url}${page.url}`,
    name: page.title,
    description: page.description,
    isPartOf: { '@id': id.site },
    about: { '@id': id.org },
    inLanguage: 'ru-KZ',
    ...(page.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: imageUrl(page.image, site.url) } } : {}),
    ...(page.datePublished ? { datePublished: page.datePublished } : {}),
    ...(page.dateModified ? { dateModified: page.dateModified } : {}),
  };
}

export function breadcrumbNode(site, crumbs) {
  if (!crumbs || crumbs.length < 2) return null;
  return {
    '@type': 'BreadcrumbList',
    '@id': `${site.url}${crumbs[crumbs.length - 1].url}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.title,
      item: `${site.url}${c.url}`,
    })),
  };
}

/* --- Продукция, услуги, статьи, FAQ -------------------------------------- */

/** Компактные узлы-«визитки» для каждой страницы: Google читает JSON-LD
 *  постранично и не ходит по @id между URL — без них Article остаётся
 *  без publisher, а Service без provider. */
export function organizationRefNode(site) {
  const id = ids(site.url);
  const c = site.contacts;
  return {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': id.org,
    name: site.brand.name,
    url: `${site.url}/`,
    logo: `${site.url}/assets/img/ui/logo-band.jpg`,
    telephone: c.phoneRaw,
    email: c.email,
  };
}

export function websiteRefNode(site) {
  const id = ids(site.url);
  return {
    '@type': 'WebSite',
    '@id': id.site,
    url: `${site.url}/`,
    name: `${site.brand.name} — ${site.brand.descriptor}`,
    publisher: { '@id': id.org },
  };
}

/** Здания продаются под ключ — это Service, а не SKU: у Product без
 *  offers/review Search Console рапортует ошибку и рич-сниппет не даёт. */
export function productNode(site, p) {
  const id = ids(site.url);
  return {
    '@type': 'Service',
    '@id': `${site.url}${p.url}#product`,
    name: p.title,
    serviceType: `${p.title} под ключ`,
    description: p.summary,
    url: `${site.url}${p.url}`,
    category: 'Металлоконструкции / ЛСТК',
    provider: { '@id': id.org },
    areaServed: [{ '@type': 'Country', name: 'Казахстан' }],
    image: imageUrl(p.cover, site.url),
    ...(p.keywords?.length ? { keywords: p.keywords.join(', ') } : {}),
    ...(p.specsSchema?.length
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `Характеристики: ${p.title}`,
            itemListElement: p.specsSchema.map((s) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: `${s.key}: ${s.val}` },
            })),
          },
        }
      : {}),
  };
}

/** Линейка профилей Sigma/C/П как товарная группа (страница /profili/). */
export function profilesListNode(site, profiles) {
  const id = ids(site.url);
  return {
    '@type': 'ItemList',
    '@id': `${site.url}/profili/#profiles`,
    name: 'Оцинкованные профили Steppe Steel',
    numberOfItems: profiles.items.length,
    itemListElement: profiles.items.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        description: p.purpose,
        brand: { '@type': 'Brand', name: site.brand.name },
        manufacturer: { '@id': id.org },
        material: 'оцинкованная сталь',
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Толщина стенки', value: 'до 3,5 мм' },
          { '@type': 'PropertyValue', name: 'Применение', value: p.where },
        ],
      },
    })),
  };
}

export function serviceNode(site, service) {
  const id = ids(site.url);
  return {
    '@type': 'Service',
    '@id': `${site.url}${service.url}#service`,
    name: service.title,
    serviceType: service.serviceType || service.title,
    description: service.summary,
    provider: { '@id': id.org },
    areaServed: [{ '@type': 'Country', name: 'Казахстан' }],
    url: `${site.url}${service.url}`,
    ...(service.image ? { image: imageUrl(service.image, site.url) } : {}),
    ...(service.includes?.length
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `Состав услуги: ${service.title}`,
            itemListElement: service.includes.map((x) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: typeof x === 'string' ? x : x.title },
            })),
          },
        }
      : {}),
  };
}

export function articleNode(site, article) {
  const id = ids(site.url);
  return {
    '@type': 'Article',
    '@id': `${site.url}${article.url}#article`,
    headline: article.title,
    description: article.summary,
    url: `${site.url}${article.url}`,
    datePublished: article.date,
    dateModified: article.updated || article.date,
    author: { '@id': id.org },
    publisher: { '@id': id.org },
    inLanguage: 'ru-KZ',
    ...(article.cover ? { image: imageUrl(article.cover, site.url) } : {}),
    ...(article.keywords ? { keywords: article.keywords.join(', ') } : {}),
    mainEntityOfPage: { '@id': `${site.url}${article.url}#webpage` },
  };
}

export function faqNode(site, url, items) {
  if (!items || !items.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': `${site.url}${url}#faq`,
    mainEntity: items.map((qa) => ({
      '@type': 'Question',
      name: qa.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: Array.isArray(qa.a) ? qa.a.join(' ') : qa.a,
      },
    })),
  };
}

export function itemListNode(site, url, items, name) {
  return {
    '@type': 'ItemList',
    '@id': `${site.url}${url}#list`,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${site.url}${it.url}`,
      name: it.title,
    })),
  };
}

/** Процесс работы — HowTo для сниппетов «как заказать». */
export function howToNode(site, url, steps, name) {
  return {
    '@type': 'HowTo',
    '@id': `${site.url}${url}#howto`,
    name,
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.text,
    })),
  };
}
