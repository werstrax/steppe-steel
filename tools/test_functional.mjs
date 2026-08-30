/**
 * Функциональные тесты интерактивов v4 через headless Chrome + CDP.
 * Проверяет: консоль всех страниц, форму расчёта (предвыбор, обязательные
 * поля, honeypot, WhatsApp-сообщение), калькулятор зерна, окупаемость,
 * фильтр портфолио, аккордеон, дропдаун меню, табы, партнёрскую форму.
 *
 *   node tools/test_functional.mjs
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.SHOT_BASE || 'http://localhost:4321';
const PORT = 9926;

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find(existsSync);

const ALL_PAGES = ['/', '/resheniya/', '/resheniya/zernohranilishcha/', '/resheniya/sklady/',
  '/resheniya/proizvodstvennye-zdaniya/', '/resheniya/angary/', '/resheniya/ovoshchehranilishcha/',
  '/resheniya/zdaniya-dlya-tekhniki/', '/resheniya/sto-avtoparki/', '/resheniya/sportivnye-obekty/',
  '/resheniya/modulnye-zdaniya/', '/agrariyam/', '/stroitelnym-kompaniyam/', '/proektirovshchikam/',
  '/partneram/', '/obekty/', '/proizvodstvo/', '/tekhnologii/', '/tekhnologii/lstk/', '/tekhnologii/lmk/',
  '/tekhnologii/boltovye-soedineniya/', '/tekhnologii/zavodskaya-gotovnost/', '/tekhnologii/modulnost/',
  '/tekhnologii/antikorroziynaya-zashchita/', '/tekhnologii/proektirovanie/', '/profili/', '/dokumentaciya/',
  '/kostanay/', '/petropavlovsk/', '/kokshetau/', '/o-zavode/', '/blog/', '/blog/zerno-raschet/',
  '/blog/km-kmd/', '/blog/fundament/', '/blog/lstk-lmk/', '/faq/', '/kontakty/', '/raschet/',
  '/raschet/spasibo/', '/privacy/', '/404.html'];

let msgId = 0;
const pending = new Map();
let ws;
const consoleErrors = [];

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

const results = [];
const ok = (name) => { results.push(['ok', name]); console.log('ok  ' + name); };
const fail = (name, why) => { results.push(['FAIL', name]); console.log('✗   ' + name + ' — ' + why); };

async function main() {
  const profile = join(ROOT, 'screenshots', '.chrome-test');
  rmSync(profile, { recursive: true, force: true });
  mkdirSync(profile, { recursive: true });

  const chrome = spawn(CHROME, [
    '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
    '--no-first-run', '--disable-gpu', '--mute-audio', '--window-size=1440,900',
  ], { stdio: 'ignore' });

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
        return;
      }
      if (m.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text || 'exception');
      }
      if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') {
        consoleErrors.push(m.params.entry.text + ' ' + (m.params.entry.url || ''));
      }
    };

    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    const s = (method, params) => send(method, params, sessionId);
    await s('Page.enable');
    await s('Runtime.enable');
    await s('Log.enable');

    const goto = async (p) => { await s('Page.navigate', { url: `${BASE}${p}` }); await sleep(1100); };
    const evalJs = async (expression) => {
      const { result, exceptionDetails } = await s('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (exceptionDetails) throw new Error(exceptionDetails.exception?.description || 'eval error');
      return result.value;
    };

    /* --- 1. Консоль и JS-ошибки на всех страницах --- */
    for (const p of ALL_PAGES) {
      consoleErrors.length = 0;
      await goto(p);
      const own404 = p.endsWith('404.html');
      const errs = consoleErrors.filter(
        (e) => !/favicon/.test(e) && !(own404 && /status of 404/.test(e) && e.includes('404.html'))
      );
      if (errs.length) fail(`консоль ${p}`, errs[0].slice(0, 140));
      else ok(`консоль ${p}`);
    }

    /* --- 2. Форма расчёта: предвыбор, обязательные поля, WhatsApp --- */
    await goto('/raschet/?type=grain&tons=4000');
    const form1 = await evalJs(`(() => {
      const f = document.querySelector('[data-calc-form]');
      const out = {};
      out.preselect = f.elements.purpose.value;
      out.tonsInComment = /4000/.test(f.elements.comment.value);
      // отправка без обязательных полей — должна пометить invalid и не открыть WhatsApp
      window.__waUrl = null;
      window.open = (u) => { window.__waUrl = u; return {}; };
      f.querySelector('button[type="submit"]').click();
      out.blocked = !window.__waUrl && f.elements.purpose.getAttribute('aria-invalid') !== 'true';
      out.nameInvalid = f.elements.name.getAttribute('aria-invalid') === 'true'
        || f.elements.purpose.getAttribute('aria-invalid') === 'true';
      // заполняем и отправляем
      f.elements.name.value = 'Тест';
      f.elements.phone.value = '+7 700 000 00 00';
      f.elements.region.value = 'Костанайская область';
      f.elements.width.value = '24'; f.elements.len.value = '60'; f.elements.height.value = '6';
      f.querySelector('button[type="submit"]').click();
      out.waUrl = window.__waUrl || '';
      out.statusShown = !document.querySelector('[data-form-status]').hidden;
      return out;
    })()`);
    const waMsg = decodeURIComponent(form1.waUrl || '');
    (form1.preselect === 'zernohranilishcha' && form1.tonsInComment && form1.nameInvalid
      && /wa\.me\/77766031766/.test(form1.waUrl) && /Зернохранилища/.test(waMsg)
      && /24 × 60 × 6/.test(waMsg) && /4000/.test(waMsg) && form1.statusShown)
      ? ok('форма расчёта: предвыбор + валидация + WhatsApp-сообщение')
      : fail('форма расчёта', JSON.stringify(form1).slice(0, 220));

    /* --- 2а. Honeypot: заполненное скрытое поле глушит отправку --- */
    await goto('/raschet/');
    const honey = await evalJs(`(() => {
      const f = document.querySelector('[data-calc-form]');
      window.__waUrl = null;
      window.open = (u) => { window.__waUrl = u; return {}; };
      f.elements.website.value = 'spam';
      f.elements.name.value = 'Бот'; f.elements.phone.value = '1'; f.elements.purpose.value = 'angary';
      f.querySelector('button[type="submit"]').click();
      return { wa: window.__waUrl };
    })()`);
    honey.wa === null ? ok('honeypot формы расчёта') : fail('honeypot', 'заявка ушла');

    /* --- 3. Калькулятор длины зернохранилища --- */
    await goto('/resheniya/zernohranilishcha/');
    const calc = await evalJs(`(() => {
      const root = document.querySelector('[data-grain-calc]');
      if (!root) return { missing: true };
      const tons = root.querySelector('[data-gc-tons]');
      tons.value = '6700';
      tons.dispatchEvent(new Event('input', { bubbles: true }));
      const out = root.querySelector('[data-gc-out]').textContent;
      const link = root.querySelector('[data-gc-link]').getAttribute('href');
      return { out, link };
    })()`);
    (calc.out && /100/.test(calc.out) && /tons=6700/.test(calc.link || ''))
      ? ok(`калькулятор зерна (6700 т → ${calc.out})`)
      : fail('калькулятор зерна', JSON.stringify(calc));

    /* --- 4. Окупаемость на /agrariyam/ --- */
    await goto('/agrariyam/');
    const pay = await evalJs(`(() => {
      const root = document.querySelector('[data-payback]');
      if (!root) return { missing: true };
      const set = (id, v) => {
        const el = root.querySelector('[data-pb="' + id + '"]');
        el.value = String(v);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      set('tons', 3000); set('rate', 350); set('months', 6); set('intake', 0); set('delta', 0);
      set('price', 18900000);
      const season = root.querySelector('[data-pb-season]').textContent;
      const rowHidden = root.querySelector('[data-pb-payback-row]').hidden;
      const payback = root.querySelector('[data-pb-payback]').textContent;
      return { season, rowHidden, payback };
    })()`);
    (/6[\s ]300[\s ]000/.test(pay.season || '') && !pay.rowHidden && /3/.test(pay.payback || ''))
      ? ok(`окупаемость (сезон ${pay.season}, ${pay.payback})`)
      : fail('окупаемость', JSON.stringify(pay));

    /* --- 5. Портфолио: фильтр показывается только при 4+ объектах (правки №1) --- */
    await goto('/obekty/');
    const filt = await evalJs(`(() => {
      const cards = [...document.querySelectorAll('.obj-card')].filter((c) => !c.classList.contains('is-hidden')).length;
      const filter = document.querySelector('[data-filter]');
      const out = { cards, filterShown: Boolean(filter) };
      if (filter && cards >= 4) {
        document.querySelector('[data-filter-btn="prom"]').click();
        out.afterClick = [...document.querySelectorAll('.obj-card')].filter((c) => !c.classList.contains('is-hidden')).length;
      }
      return out;
    })()`);
    (filt.cards >= 1 && filt.filterShown === (filt.cards >= 4))
      ? ok(`портфолио (${filt.cards} объект., фильтр ${filt.filterShown ? 'показан' : 'скрыт до 4+'})`)
      : fail('портфолио', JSON.stringify(filt));

    /* --- 6. Аккордеон FAQ --- */
    await goto('/faq/');
    const acc = await evalJs(`(() => {
      const btn = document.querySelector('.faq__q');
      const before = btn.getAttribute('aria-expanded');
      btn.click();
      const after = btn.getAttribute('aria-expanded');
      btn.click();
      const back = btn.getAttribute('aria-expanded');
      return { before, after, back };
    })()`);
    (acc.before === 'false' && acc.after === 'true' && acc.back === 'false')
      ? ok('аккордеон FAQ')
      : fail('аккордеон FAQ', JSON.stringify(acc));

    /* --- 7. Дропдаун «О заводе» --- */
    await goto('/');
    const drop = await evalJs(`(() => {
      const item = document.querySelector('[data-sub]');
      const toggle = item.querySelector('.nav__toggle');
      toggle.click();
      const opened = item.classList.contains('is-open') && toggle.getAttribute('aria-expanded') === 'true';
      document.body.click();
      const closed = !item.classList.contains('is-open');
      return { opened, closed, links: item.querySelectorAll('.nav__sublink').length };
    })()`);
    (drop.opened && drop.closed && drop.links >= 6)
      ? ok(`дропдаун меню (${drop.links} ссылок)`)
      : fail('дропдаун меню', JSON.stringify(drop));

    /* --- 8. Табы форматов на /proektirovshchikam/ --- */
    await goto('/proektirovshchikam/');
    const tabs = await evalJs(`(() => {
      const btns = [...document.querySelectorAll('[data-tabs] [role="tab"]')];
      const panels = [...document.querySelectorAll('[data-tabs] [role="tabpanel"]')];
      btns[2].click();
      return {
        count: btns.length,
        selected: btns[2].getAttribute('aria-selected') === 'true',
        visible: panels.filter((p) => !p.hidden).length === 1 && !panels[2].hidden,
      };
    })()`);
    (tabs.count === 5 && tabs.selected && tabs.visible)
      ? ok('табы форматов сотрудничества')
      : fail('табы', JSON.stringify(tabs));

    /* --- 9. Партнёрская форма --- */
    await goto('/partneram/');
    const pf = await evalJs(`(() => {
      const f = document.querySelector('[data-partner-form]');
      window.__waUrl = null;
      window.open = (u) => { window.__waUrl = u; return {}; };
      f.elements.name.value = 'Тест';
      f.elements.company.value = 'ТОО Тест';
      f.elements.region.value = 'Костанай';
      f.elements.phone.value = '+7 700 000 00 00';
      f.querySelector('button[type="submit"]').click();
      return { wa: window.__waUrl || '' };
    })()`);
    (/wa\.me\/77766031766/.test(pf.wa) && /партн/i.test(decodeURIComponent(pf.wa)))
      ? ok('партнёрская форма → WhatsApp')
      : fail('партнёрская форма', (pf.wa || 'null').slice(0, 120));

    /* --- 10. Мобильное меню --- */
    await goto('/');
    await s('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await sleep(400);
    const mob = await evalJs(`(() => {
      const burger = document.querySelector('.burger');
      const menu = document.querySelector('[data-menu]');
      const visible = getComputedStyle(burger).display !== 'none';
      burger.click();
      const mbar = getComputedStyle(document.querySelector('[data-mbar]')).display !== 'none';
      return new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(() => {
        res({ visible, opened: menu.classList.contains('is-open'), mbar });
      })));
    })()`);
    (mob.visible && mob.opened && mob.mbar)
      ? ok('мобильное меню + панель действий')
      : fail('мобильное меню', JSON.stringify(mob));
  } finally {
    chrome.kill();
    await sleep(300);
    rmSync(profile, { recursive: true, force: true });
  }

  const fails = results.filter(([r]) => r === 'FAIL').length;
  console.log(`\nИтого: ${results.length} проверок, провалов: ${fails}`);
  process.exit(fails ? 1 : 0);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
