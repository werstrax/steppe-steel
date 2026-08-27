/**
 * Функциональные тесты интерактивов через headless Chrome + CDP.
 * Проверяет: консоль всех страниц, квиз-заявку (шаги, маска, honeypot,
 * успех), калькулятор зерна, переключатель профилей, аккордеон, меню.
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

const ALL_PAGES = ['/', '/katalog/', '/katalog/zernohranilishcha/', '/katalog/angary-sklady/', '/katalog/tseha-zavody/',
  '/profili/', '/uslugi/', '/uslugi/proektirovanie/', '/uslugi/proizvodstvo/', '/uslugi/komplektaciya-dostavka/',
  '/process/', '/o-zavode/', '/blog/', '/blog/zerno-raschet/', '/blog/km-kmd/', '/blog/fundament/', '/blog/lstk-lmk/',
  '/faq/', '/kontakty/', '/zayavka/', '/zayavka/spasibo/', '/privacy/', '/404.html'];

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
        // сетевые 404 и js-ошибки
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
      // Страница 404 обязана отдаваться со статусом 404 — её собственный
      // «Failed to load resource: 404» это норма, а не ошибка сайта.
      const own404 = p.endsWith('404.html');
      const errs = consoleErrors.filter(
        (e) => !/favicon/.test(e) && !(own404 && /status of 404/.test(e) && e.includes('404.html'))
      );
      if (errs.length) fail(`консоль ${p}`, errs[0].slice(0, 140));
      else ok(`консоль ${p}`);
    }

    /* --- 2. Квиз-заявка --- */
    await goto('/zayavka/?type=grain');
    const quiz = await evalJs(`(() => {
      const out = {};
      out.grainChecked = document.querySelector('input[data-key="grain"]').checked;
      out.presetActive = document.querySelector('.calc__preset[data-w="24"][data-l="60"]').classList.contains('is-active');
      out.submitHidden = document.getElementById('calc-submit').hidden;
      // шаг 2
      document.getElementById('calc-next').click();
      out.step2 = document.querySelector('.calc__step[data-step="2"]').classList.contains('is-active');
      // свой размер раскрывает поля
      document.querySelector('.calc__preset[data-custom]').click();
      out.sizesShown = !document.getElementById('calc-sizes').hidden;
      document.getElementById('calc-length').value = '48';
      document.getElementById('calc-width').value = '24';
      document.getElementById('calc-location').value = 'Костанай';
      // шаг 3
      document.getElementById('calc-next').click();
      out.step3 = document.querySelector('.calc__step[data-step="3"]').classList.contains('is-active');
      out.nextHidden = document.getElementById('calc-next').hidden;
      out.submitShown = !document.getElementById('calc-submit').hidden;
      // маска телефона: 8 705 → +7 (705)
      const ph = document.getElementById('calc-phone');
      const set = (v) => { ph.value = v; ph.dispatchEvent(new Event('input', { bubbles: true })); };
      set('87051234567');
      out.mask = ph.value;
      // сабмит без открытия WhatsApp
      window.open = (u) => { out.waUrl = u; return { closed: false }; };
      document.getElementById('calc-name').value = 'Тест';
      document.getElementById('calc-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      out.successShown = !document.getElementById('calc-success').hidden;
      out.mailHref = (document.getElementById('calc-mail') || {}).href || '';
      return out;
    })()`);

    quiz.grainChecked ? ok('квиз: предвыбор grain из URL') : fail('квиз: предвыбор grain', JSON.stringify(quiz));
    quiz.presetActive ? ok('квиз: пресет 24×60 для зерна') : fail('квиз: пресет 24×60', '');
    (quiz.step2 && quiz.step3 && quiz.nextHidden && quiz.submitShown) ? ok('квиз: навигация по шагам') : fail('квиз: шаги', JSON.stringify(quiz));
    quiz.sizesShown ? ok('квиз: «свой размер» раскрывает поля') : fail('квиз: свой размер', '');
    quiz.mask === '+7 (705) 123-45-67' ? ok('квиз: маска телефона') : fail('квиз: маска', quiz.mask);
    (quiz.waUrl || '').includes('wa.me/77766031766') ? ok('квиз: WhatsApp-ссылка с заявкой') : fail('квиз: WA', quiz.waUrl);
    decodeURIComponent(quiz.waUrl || '').includes('24×48 м') ? ok('квиз: размеры в тексте заявки') : fail('квиз: размеры в заявке', decodeURIComponent(quiz.waUrl || '').slice(0, 200));
    quiz.successShown ? ok('квиз: блок успеха показан') : fail('квиз: успех', '');
    (quiz.mailHref || '').startsWith('mailto:steppe.steel@gmail.com') ? ok('квиз: email-фолбэк') : fail('квиз: email-фолбэк', quiz.mailHref);

    /* --- 2б. Квиз: валидация пустого телефона --- */
    await goto('/zayavka/');
    const quiz2 = await evalJs(`(() => {
      const out = {};
      window.open = () => ({});
      document.getElementById('calc-next').click();
      document.getElementById('calc-next').click();
      document.getElementById('calc-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      out.errShown = !document.getElementById('calc-error').hidden;
      out.successHidden = document.getElementById('calc-success').hidden;
      // honeypot: заполняем и валидный телефон — отправки быть не должно
      const ph = document.getElementById('calc-phone');
      ph.value = '87051234567'; ph.dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('input[name="website"]').value = 'spam';
      let opened = false;
      window.open = () => { opened = true; return {}; };
      document.getElementById('calc-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      out.honeypotBlocked = !opened;
      return out;
    })()`);
    (quiz2.errShown && quiz2.successHidden) ? ok('квиз: валидация телефона') : fail('квиз: валидация', JSON.stringify(quiz2));
    quiz2.honeypotBlocked ? ok('квиз: honeypot режет ботов') : fail('квиз: honeypot', '');

    /* --- 3. Калькулятор зерна (главная) --- */
    await goto('/');
    const grain = await evalJs(`(() => {
      const out = {};
      const input = document.getElementById('grain-input');
      const crop = document.getElementById('grain-crop');
      out.initial = document.getElementById('grain-length').textContent;
      input.value = '5000'; input.dispatchEvent(new Event('input', { bubbles: true }));
      out.wheat5000 = document.getElementById('grain-length').textContent;
      crop.value = '37'; crop.dispatchEvent(new Event('change', { bubbles: true }));
      out.sunflower5000 = document.getElementById('grain-length').textContent;
      return out;
    })()`);
    grain.initial.includes('45') ? ok('калькулятор: пример 3000 т пшеницы → 45 м') : fail('калькулятор: старт', grain.initial);
    grain.wheat5000.includes('75') ? ok('калькулятор: 5000 т пшеницы → 75 м') : fail('калькулятор: 5000 пшеница', grain.wheat5000);
    grain.sunflower5000.includes('135') ? ok('калькулятор: 5000 т подсолнечника → 135 м') : fail('калькулятор: подсолнечник', grain.sunflower5000);

    /* --- 4. Профили ПСУ / ПС --- */
    const prof = await evalJs(`(() => {
      const out = {};
      const contour = document.getElementById('prof-contour');
      out.initialD = contour.getAttribute('d').includes('212');
      document.querySelector('.prof__tab[data-prof="c"]').click();
      out.cSelected = document.querySelector('.prof__board').getAttribute('data-prof') === 'c';
      out.cD = !contour.getAttribute('d').includes('212');
      out.cCardShown = !document.querySelector('.prof__card[data-prof="c"]').hidden;
      out.cardTitle = (document.querySelector('.prof__card[data-prof="c"] h3') || {}).textContent || '';
      out.tabs = [...document.querySelectorAll('.prof__tab')].map((t) => t.dataset.prof).join(',');
      out.mark = document.getElementById('prof-mark').textContent;
      document.querySelector('.prof__seg-btn[data-t="1.5"]').click();
      out.strokeThin = contour.style.strokeWidth === '6px';
      out.bar = document.getElementById('prof-bar').style.width;
      out.stamp = document.getElementById('prof-tstamp').textContent;
      return out;
    })()`);
    (prof.initialD && prof.cSelected && prof.cD && prof.cCardShown && prof.mark === 'ПС') ? ok('профили: переключение ПСУ → ПС') : fail('профили: переключение', JSON.stringify(prof));
    (prof.tabs === 'sigma,c') ? ok('профили: только ПСУ и ПС (П убран)') : fail('профили: состав табов', prof.tabs);
    prof.cardTitle.includes('ПС —') ? ok('профили: заголовок карточки в <h3>') : fail('профили: h3 в карточке', prof.cardTitle);
    (prof.strokeThin && prof.bar === '45%' && prof.stamp.includes('1,5')) ? ok('профили: ползунок толщины 1,5 мм') : fail('профили: толщина', JSON.stringify(prof));

    /* --- 5. Аккордеон FAQ --- */
    const acc = await evalJs(`(() => {
      const btn = document.querySelector('.faq__q');
      const item = btn.closest('.faq__item');
      btn.click();
      const opened = item.classList.contains('is-open') && btn.getAttribute('aria-expanded') === 'true';
      btn.click();
      const closed = !item.classList.contains('is-open');
      return { opened, closed };
    })()`);
    (acc.opened && acc.closed) ? ok('аккордеон FAQ открывается и закрывается') : fail('аккордеон', JSON.stringify(acc));

    /* --- 6. Мобильное меню --- */
    await s('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
    await goto('/');
    const menu = await evalJs(`(() => {
      const btn = document.querySelector('.burger');
      const panel = document.querySelector('[data-menu]');
      btn.click();
      const opened = panel.classList.contains('is-open') && document.body.classList.contains('is-locked');
      const links = panel.querySelectorAll('a').length;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      const closed = !panel.classList.contains('is-open');
      return { opened, links, closed };
    })()`);
    (menu.opened && menu.closed && menu.links > 8) ? ok(`мобильное меню (${menu.links} ссылок)`) : fail('мобильное меню', JSON.stringify(menu));

    /* --- 7. Лайтбокс --- */
    const lb = await evalJs(`(() => {
      const t = document.querySelector('[data-lightbox]');
      if (!t) return { skip: true };
      t.click();
      const box = document.querySelector('.lightbox');
      const opened = box && box.classList.contains('is-open') && !!box.querySelector('img').src;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      const closed = !box.classList.contains('is-open');
      return { opened, closed };
    })()`);
    (lb.opened && lb.closed) ? ok('лайтбокс галереи') : fail('лайтбокс', JSON.stringify(lb));

    /* --- 8. Партнёрская: шторка «чертёж → металл» и листы сертификата --- */
    await goto('/partnyoram/');

    const rama = await evalJs(`(() => {
      const r = document.querySelector('#rama-range');
      const clip = document.querySelector('#rama-clip-rect');
      if (!r || !clip) return { skip: true };
      r.value = 20; r.dispatchEvent(new Event('input', { bubbles: true }));
      const at20 = clip.getAttribute('x');
      r.value = 80; r.dispatchEvent(new Event('input', { bubbles: true }));
      return { at20: +at20, at80: +clip.getAttribute('x') };
    })()`);
    (rama.at20 === 200 && rama.at80 === 800)
      ? ok('шторка «чертёж → металл»')
      : fail('шторка рамы', JSON.stringify(rama));

    const tabs = await evalJs(`(() => {
      const t = document.querySelectorAll('[data-split-tab]');
      if (!t.length) return { skip: true };
      t[2].click();
      const panel = document.getElementById(t[2].getAttribute('aria-controls'));
      return { всего: t.length, выбран: t[2].getAttribute('aria-selected'), виден: !panel.hasAttribute('hidden') };
    })()`);
    (tabs.всего === 5 && tabs.выбран === 'true' && tabs.виден)
      ? ok(`форматы сотрудничества (${tabs.всего} вкладки)`)
      : fail('форматы сотрудничества', JSON.stringify(tabs));

    // листы документа открываются в лайтбоксе крупным файлом, который реально существует
    const sheets = await evalJs(`(() => {
      const items = [...document.querySelectorAll('.sheets__item')];
      if (!items.length) return { skip: true };
      items[1].click();
      const box = document.querySelector('.lightbox');
      const src = box.querySelector('img').getAttribute('src');
      const full = items[1].getAttribute('data-full');
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      return { листов: items.length, src, совпал: src === full };
    })()`);
    let sheetOk = sheets.листов === 4 && sheets.совпал;
    if (sheetOk) {
      // файл должен отдаваться, а не 404 — иначе в лайтбоксе будет «битая» картинка
      const res = await fetch(`${BASE}${sheets.src}`);
      sheetOk = res.ok;
      if (!res.ok) sheets.http = res.status;
    }
    sheetOk ? ok(`листы сертификата (${sheets.листов} шт.)`) : fail('листы сертификата', JSON.stringify(sheets));

    // переключатель аудиторий ведёт на смежную страницу
    const aud = await evalJs(`(() => {
      const items = [...document.querySelectorAll('.aud__item')];
      const active = items.filter(i => i.classList.contains('is-active'));
      const link = items.find(i => i.tagName === 'A');
      return { всего: items.length, активных: active.length, ссылка: link && link.getAttribute('href') };
    })()`);
    (aud.всего === 2 && aud.активных === 1 && /predstavitelyam/.test(aud.ссылка || ''))
      ? ok('переключатель аудиторий')
      : fail('переключатель аудиторий', JSON.stringify(aud));

    /* --- 9. Строительным компаниям: полоса ответственности --- */
    await goto('/predstavitelyam/');

    const lane = await evalJs(`(() => {
      const lane = document.querySelector('.lane');
      if (!lane) return { skip: true };
      const steps = lane.querySelectorAll('.lane__step').length;
      const income = lane.querySelectorAll('.lane__coin').length;
      const partnerBtn = lane.querySelector('[data-lane-key="partner"]');
      partnerBtn.click();
      const filtered = lane.classList.contains('is-partner') && partnerBtn.getAttribute('aria-pressed') === 'true';
      lane.querySelector('[data-lane-key="all"]').click();
      const reset = !lane.classList.contains('is-partner') && !lane.classList.contains('is-factory');
      // лента обязана прокручиваться внутри себя, а не растягивать страницу
      const sc = lane.querySelector('.lane__scroll');
      const contained = sc.scrollWidth > sc.clientWidth
        && document.documentElement.scrollWidth <= window.innerWidth + 1;
      return { steps, income, filtered, reset, contained };
    })()`);
    (lane.steps === 12 && lane.income === 4 && lane.filtered && lane.reset && lane.contained)
      ? ok(`полоса ответственности (${lane.steps} этапов, ${lane.income} с доходом)`)
      : fail('полоса ответственности', JSON.stringify(lane));
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
