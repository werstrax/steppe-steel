/**
 * Скриншоты страниц через headless Chrome + CDP. Без зависимостей:
 * WebSocket встроен в Node 21+.
 *
 *   node tools/screenshot.mjs                      # набор ключевых страниц
 *   node tools/screenshot.mjs / /projects/bayaan/  # конкретные страницы
 *   node tools/screenshot.mjs --mobile             # ширина 390
 *   node tools/screenshot.mjs --viewport           # только первый экран
 *
 * PNG кладутся в screenshots/ в корне проекта (папка в .gitignore).
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'screenshots');
const BASE = process.env.SHOT_BASE || 'http://localhost:4321';
const PORT = 9924;

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find(existsSync);

if (!CHROME) {
  console.error('Chrome не найден');
  process.exit(1);
}

const mobile = process.argv.includes('--mobile');
const viewportOnly = process.argv.includes('--viewport');
const width = mobile ? 390 : 1440;
const height = 900;
const suffix = mobile ? '-mobile' : '';

const pageArgs = process.argv.slice(2).filter((a) => a.startsWith('/'));
const pages = pageArgs.length
  ? pageArgs
  : ['/', '/resheniya/', '/resheniya/zernohranilishcha/', '/resheniya/sklady/', '/resheniya/angary/', '/agrariyam/', '/stroitelnym-kompaniyam/', '/proektirovshchikam/', '/partneram/', '/obekty/', '/proizvodstvo/', '/tekhnologii/', '/tekhnologii/lstk/', '/profili/', '/dokumentaciya/', '/o-zavode/', '/blog/', '/blog/zerno-raschet/', '/raschet/', '/kontakty/', '/faq/', '/kostanay/'];

/* --- CDP-клиент ---------------------------------------------------------- */

let msgId = 0;
const pending = new Map();
let ws;

function send(method, params = {}, sessionId) {
  return new Promise((res, rej) => {
    const id = ++msgId;
    pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    // Страховка от зависшего Chrome (например, залоченный профиль после сна)
    setTimeout(() => {
      if (pending.has(id)) {
        pending.delete(id);
        rej(new Error(`CDP timeout: ${method}`));
      }
    }, 30000);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  mkdirSync(OUT, { recursive: true });
  const profile = join(OUT, '.chrome-profile');

  const chrome = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--no-first-run', '--disable-gpu', '--hide-scrollbars', '--mute-audio',
    `--window-size=${width},${height}`,
  ], { stdio: 'ignore' });

  try {
    // ждём отладочный порт
    let version = null;
    for (let i = 0; i < 50 && !version; i++) {
      try {
        version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
      } catch { await sleep(200); }
    }
    if (!version) throw new Error('Chrome не поднял отладочный порт');

    ws = new WebSocket(version.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) {
        const { res, rej } = pending.get(m.id);
        pending.delete(m.id);
        m.error ? rej(new Error(m.error.message)) : res(m.result);
      }
    };

    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    const s = (method, params) => send(method, params, sessionId);

    await s('Page.enable');
    // Размер окна задан через --window-size. Emulation.setDeviceMetricsOverride
    // здесь не используем: в связке с captureBeyondViewport он подвешивает Chrome.

    for (const p of pages) {
      const name = (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-')) + suffix;
      await s('Page.navigate', { url: `${BASE}${p}` });
      await sleep(1000);

      // Прокручиваем страницу до низа шагами: lazy-картинки загружаются
      // естественным путём, reveal-блоки раскрываются сами.
      await s('Runtime.evaluate', {
        expression: `new Promise((done) => {
          document.documentElement.style.scrollBehavior = 'auto';
          const step = () => {
            const bottom = window.scrollY + innerHeight >= document.body.scrollHeight - 8;
            if (bottom) { window.scrollTo(0, 0); setTimeout(done, 900); return; }
            window.scrollBy(0, innerHeight * 0.9);
            setTimeout(step, 180);
          };
          step();
        })`,
        awaitPromise: true,
        timeout: 25000,
      });
      await sleep(1200);

      // Страницы выше ~16400px Chrome отрастеризовать одним куском не может
      // (лимит текстуры) — снимаем послайсово, кадр на каждый экран.
      const { result: hRes } = await s('Runtime.evaluate', {
        expression: 'document.body.scrollHeight',
        returnByValue: true,
      });
      const total = hRes.value;
      const slices = viewportOnly ? 1 : Math.ceil(total / height);

      for (let i = 0; i < slices; i++) {
        await s('Runtime.evaluate', { expression: `window.scrollTo(0, ${i * height})` });
        await sleep(i === 0 ? 400 : 250);
        const shot = await s('Page.captureScreenshot', { format: 'png' });
        const file = slices === 1 ? `${name}.png` : `${name}-${String(i + 1).padStart(2, '0')}.png`;
        writeFileSync(join(OUT, file), Buffer.from(shot.data, 'base64'));
      }
      console.log('ok ', name, `(${slices} кадр., ${total}px)`);
    }
  } finally {
    chrome.kill();
    await sleep(300);
    try { rmSync(join(OUT, '.chrome-profile'), { recursive: true, force: true }); } catch {}
  }
  console.log('\n→', OUT);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e.message); process.exit(1); });
