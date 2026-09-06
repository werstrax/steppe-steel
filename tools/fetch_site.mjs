/**
 * Скачивает статический сайт целиком по sitemap.xml + все ассеты, на которые
 * ссылаются страницы (css, js, картинки, документы). Нужен, чтобы забрать
 * версию, собранную в чужой песочнице (ChatGPT, 04.09.2026), и сравнить
 * с нашей сборкой.
 *
 *   node tools/fetch_site.mjs https://host.example/ ./папка
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const [,, base, outDir = './fetched'] = process.argv;
if (!base) { console.error('usage: node tools/fetch_site.mjs <url> [outDir]'); process.exit(1); }
const origin = new URL(base).origin;

const seen = new Set();
const queue = [];
const stats = { pages: 0, assets: 0, failed: [] };

function localPath(u) {
  const url = new URL(u, origin);
  let p = decodeURIComponent(url.pathname);
  if (p.endsWith('/')) p += 'index.html';
  return join(outDir, p);
}

async function fetchBin(u) {
  const r = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0 (fetch_site)' } });
  if (!r.ok) throw new Error(`${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

function enqueue(u) {
  try {
    const url = new URL(u, origin);
    if (url.origin !== origin) return;
    url.hash = ''; url.search = '';
    const key = url.href;
    if (seen.has(key)) return;
    seen.add(key);
    queue.push(key);
  } catch { /* невалидный href — пропускаем */ }
}

function extractLinks(html) {
  const out = [];
  const re = /(?:href|src|srcset|content)=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(html))) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u && !u.startsWith('data:') && !u.startsWith('mailto:') && !u.startsWith('tel:') && !u.startsWith('javascript:')) out.push(u);
    }
  }
  const cssRe = /url\(["']?([^"')]+)["']?\)/g;
  while ((m = cssRe.exec(html))) if (!m[1].startsWith('data:')) out.push(m[1]);
  return out;
}

// стартуем с sitemap + корня
const sitemap = await (await fetch(new URL('/sitemap.xml', origin))).text();
for (const m of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) enqueue(m[1]);
enqueue('/');
enqueue('/404.html');
enqueue('/robots.txt');
enqueue('/llms.txt');

while (queue.length) {
  const u = queue.shift();
  const path = localPath(u);
  try {
    const buf = await fetchBin(u);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, buf);
    const isText = /\.(html?|css|js|xml|txt|svg|webmanifest|json)$/i.test(path) || path.endsWith('index.html');
    if (isText) {
      const text = buf.toString('utf8');
      for (const l of extractLinks(text)) enqueue(l);
      if (path.endsWith('.html')) stats.pages++; else stats.assets++;
    } else stats.assets++;
  } catch (e) {
    stats.failed.push(`${u} (${e.message})`);
  }
}

console.log(`Страниц: ${stats.pages}, ассетов: ${stats.assets}, не скачалось: ${stats.failed.length}`);
for (const f of stats.failed.slice(0, 20)) console.log('  ✗', f);
console.log('→', outDir);
