/**
 * Аудит мобильного переполнения: все страницы на ширинах 375 / 360 / 320.
 * Ловит и горизонтальный скролл, и клип текста внутри overflow:hidden.
 *
 *   node tools/audit_mobile.mjs
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.SHOT_BASE || 'http://localhost:4321';
const PORT = Number(process.env.SHOT_PORT) || 9925;

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find(existsSync);

const PAGES = ['/', '/resheniya/', '/resheniya/zernohranilishcha/', '/resheniya/sklady/',
  '/resheniya/proizvodstvennye-zdaniya/', '/resheniya/angary/', '/resheniya/ovoshchehranilishcha/',
  '/resheniya/zdaniya-dlya-tekhniki/', '/resheniya/sto-avtoparki/', '/resheniya/sportivnye-obekty/',
  '/resheniya/modulnye-zdaniya/', '/agrariyam/', '/stroitelnym-kompaniyam/', '/proektirovshchikam/',
  '/partneram/', '/obekty/', '/proizvodstvo/', '/tekhnologii/', '/tekhnologii/lstk/', '/tekhnologii/proektirovanie/',
  '/profili/', '/dokumentaciya/', '/kostanay/', '/o-zavode/', '/blog/', '/blog/zerno-raschet/',
  '/faq/', '/kontakty/', '/raschet/', '/privacy/'];
const WIDTHS = [375, 360, 320];

let msgId = 0;
const pending = new Map();
let ws;

function send(method, params = {}, sessionId) {
  return new Promise((res, rej) => {
    const id = ++msgId;
    pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    setTimeout(() => {
      if (pending.has(id)) { pending.delete(id); rej(new Error(`CDP timeout: ${method}`)); }
    }, 30000);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const AUDIT = `(() => {
  const de = document.documentElement;
  const vw = de.clientWidth;
  const problems = [];
  if (de.scrollWidth > vw + 1) problems.push('PAGE scrollWidth ' + de.scrollWidth + ' > ' + vw);
  const fixedOk = (el) => { const cs = getComputedStyle(el); return cs.position === 'fixed'; };
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || fixedOk(el)) continue;
    if (el.classList && el.classList.contains('u-visually-hidden')) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0) continue;
    // коробка вылезает за вьюпорт и не внутри overflow-х прокрутки
    if (r.right > vw + 2 && !el.closest('.table-wrap, .marquee, .loader, .hero__media, .header, .menu, .fab, .lightbox')) {
      problems.push('BOX ' + (el.className && el.className.toString().split(' ')[0] || el.tagName) + ' right=' + Math.round(r.right));
    }
    // текст клипается внутри самого элемента (кроме сознательного ellipsis).
    // Узлы внутри svg пропускаем только здесь: подписи там рисуются по
    // координатам viewBox, scrollWidth/clientWidth для них ничего не значат.
    // Вместо этого ниже отдельная проверка — рамка подписи против рамки svg.
    if (el.children.length === 0 && el.scrollWidth > el.clientWidth + 2 && cs.textOverflow !== 'ellipsis'
        && !(el.ownerSVGElement || el.tagName === 'svg')
        && !el.closest('.table-wrap, .marquee, .visually-hidden, .hp-field')
        && !el.classList.contains('visually-hidden')) {
      problems.push('CLIP ' + (el.className && el.className.toString().split(' ')[0] || el.tagName) + ' sw=' + el.scrollWidth + ' cw=' + el.clientWidth + ' «' + (el.textContent || '').trim().slice(0, 30) + '»');
    }
  }
  // Подписи в svg (план объекта, схемы, карта): сравниваем рамку текста с
  // рамкой самого svg — так видно подпись, уехавшую за пределы чертежа.
  for (const svg of document.querySelectorAll('svg')) {
    const scs = getComputedStyle(svg);
    if (scs.display === 'none' || scs.visibility === 'hidden') continue;
    const box = svg.getBoundingClientRect();
    if (!box.width || !box.height) continue;
    for (const t of svg.querySelectorAll('text')) {
      const tr = t.getBoundingClientRect();
      if (!tr.width || !tr.height) continue;
      const out = Math.max(box.left - tr.left, tr.right - box.right, box.top - tr.top, tr.bottom - box.bottom);
      if (out > 2) {
        problems.push('SVGTEXT «' + (t.textContent || '').trim().slice(0, 24) + '» вышла за рамку svg на ' + Math.round(out) + 'px');
      }
    }
  }
  return [...new Set(problems)].slice(0, 12);
})()`;

async function main() {
  const profile = join(ROOT, 'screenshots', process.env.SHOT_TAG || '', '.chrome-audit');
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
  mkdirSync(profile, { recursive: true });

  const chrome = spawn(CHROME, [
    '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
    '--no-first-run', '--disable-gpu', '--mute-audio', '--window-size=375,900',
  ], { stdio: 'ignore' });

  let bad = 0;
  try {
    let version = null;
    for (let i = 0; i < 50 && !version; i++) {
      try { version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); }
      catch { await sleep(200); }
    }
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

    for (const w of WIDTHS) {
      await s('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: true });
      for (const p of PAGES) {
        await s('Page.navigate', { url: `${BASE}${p}` });
        await sleep(900);
        const { result } = await s('Runtime.evaluate', { expression: AUDIT, returnByValue: true });
        const problems = result.value || [];
        if (problems.length) {
          bad++;
          console.log(`✗ ${w}px ${p}`);
          for (const x of problems) console.log(`   ${x}`);
        }
      }
      console.log(`— ширина ${w}px проверена`);
    }
  } finally {
    chrome.kill();
    // Windows держит файлы профиля ещё какое-то время после kill — без паузы
    // и try чистый прогон падал на EPERM и выходил с кодом 1.
    await sleep(1000);
    try { rmSync(profile, { recursive: true, force: true }); } catch {}
  }
  console.log(bad ? `\nПроблемных страниц: ${bad}` : '\nПереполнений нет.');
  process.exit(bad ? 1 : 0);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
