/**
 * Простой статический сервер для локального просмотра dist/.
 *   node tools/serve.mjs [порт]
 * Понимает «чистые» URL: /projects/ → dist/projects/index.html.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.argv[2]) || 4321;
// Сайт живёт в подпапке (GitHub project pages) — локально имитируем тот же префикс.
const BASE = '/steppe-steel';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const candidates = [join(ROOT, clean)];
  if (!extname(clean)) candidates.push(join(ROOT, clean, 'index.html'));
  for (const c of candidates) {
    try {
      const s = await stat(c);
      if (s.isFile()) return c;
    } catch {}
  }
  return null;
}

createServer(async (req, res) => {
  let url = req.url;
  if (url === '/' || url === '') {
    res.writeHead(302, { Location: BASE + '/' });
    res.end();
    return;
  }
  if (url.startsWith(BASE + '/') || url === BASE) url = url.slice(BASE.length) || '/';
  const file = (await resolveFile(url)) || join(ROOT, '404.html');
  try {
    const body = await readFile(file);
    const type = TYPES[extname(file).toLowerCase()] || 'application/octet-stream';
    res.writeHead(file.endsWith('404.html') ? 404 : 200, {
      'Content-Type': type,
      'Cache-Control': 'no-cache',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404');
  }
}).listen(PORT, () => {
  console.log(`  STEPPE STEEL → http://localhost:${PORT}${BASE}/`);
});
