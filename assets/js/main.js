/* ═══════════════════════════════════════════════════════════
   STEPPE STEEL — завод ЛСТК · «Альбом КМД»
   ═══════════════════════════════════════════════════════════ */

/* ═══ КОНФИГ — ЗАПОЛНИТЬ ПЕРЕД ПУБЛИКАЦИЕЙ ═══
   Единственное место, где меняются контакты и реквизиты.
   ВАЖНО: после замены номера также обновить fallback-href
   у ссылок .js-wa в index.html (href="https://wa.me/..."). */
const CONFIG = {
  WHATSAPP_PHONE: '77766031766',           // WhatsApp завода
  PHONE_DISPLAY: '+7 776 603 17 66',       // как показывать на сайте
  PHONE_TEL: '+77766031766',               // для ссылки tel:
  EMAIL: 'steppe.steel@gmail.com',
  BIN: 'ТОО «—» · БИН —'                    // [УТОЧНИТЬ: реквизиты юрлица]
};

const WA_MESSAGES = {
  hello: 'Здравствуйте! Пишу с сайта Steppe Steel.',
  visit: 'Здравствуйте! Хочу приехать на производство в с. Троебратское. Когда удобно?',
  engineer: 'Здравствуйте! Нужна консультация инженера по проекту здания из ЛСТК.',
  kp: 'Здравствуйте! Пришлите, пожалуйста, коммерческое предложение. Объект: '
};

const waLink = (text) =>
  'https://wa.me/' + CONFIG.WHATSAPP_PHONE + '?text=' + encodeURIComponent(text);

const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* формат чисел: 1650 → «1 650» */
const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/* открыть WhatsApp синхронно (Safari блокирует window.open из setTimeout) */
const openWa = (url) => {
  const w = window.open(url, '_blank');
  if (!w) window.location.href = url;
};

/* ───────── Применение конфига ───────── */
function applyConfig() {
  document.querySelectorAll('.js-wa').forEach((el) => {
    const key = el.dataset.wa || 'hello';
    el.href = waLink(WA_MESSAGES[key]);
    el.target = '_blank';
    el.rel = 'noopener';
  });
  document.querySelectorAll('.js-phone').forEach((el) => {
    el.href = 'tel:' + CONFIG.PHONE_TEL;
    el.textContent = CONFIG.PHONE_DISPLAY;
  });
  document.querySelectorAll('.js-email').forEach((el) => {
    el.href = 'mailto:' + CONFIG.EMAIL;
    el.textContent = CONFIG.EMAIL;
  });
  document.querySelectorAll('.js-bin').forEach((el) => {
    el.textContent = CONFIG.BIN;
  });
}

/* ───────── Анимация «рисования» линий ─────────
   Начальное состояние ставится БЕЗ transition, затем принудительный
   reflow, и только потом transition + конечное состояние — иначе
   браузер схлопывает переход в одном стилевом батче. */
function animateStrokes(elements, duration, stepDelay) {
  const items = [];
  elements.forEach((el) => {
    let len;
    try { len = el.getTotalLength(); } catch (e) { return; }
    if (!len) return;
    el.style.transition = 'none';
    el.style.strokeDasharray = String(len);
    el.style.strokeDashoffset = String(len);
    items.push(el);
  });
  if (!items.length) return;
  // Принудительный reflow фиксирует начальное состояние, поэтому переход
  // можно запускать синхронно — rAF в фоновой вкладке может не сработать.
  void items[0].getBoundingClientRect();
  items.forEach((el, i) => {
    el.style.transition = 'stroke-dashoffset ' + duration + 's ease-out ' + (i * stepDelay) + 'ms';
    el.style.strokeDashoffset = '0';
  });
}

/* ───────── SVG-изокаркас ангара (стиль КМД) ───────── */
function buildHangarDrawing() {
  const host = document.getElementById('hangar-drawing');
  if (!host) return;

  const NS = 'http://www.w3.org/2000/svg';
  const S = 11;                 // px на метр
  const W = 24, L = 30;         // показанная часть здания, м
  const H = 6, RIDGE = 9.6;     // карниз и конёк, м
  const STEP = 3;               // шаг рам, м
  const OX = 306, OY = 70;      // OY ≥ 68, иначе карниз z=0 клиппится сверху

  const P = (x, y, z) => [
    OX + (x - z) * 0.866 * S,
    OY + (x + z) * 0.5 * S - y * S
  ];
  const pts = (arr) => arr.map(([px, py]) => px.toFixed(1) + ',' + py.toFixed(1)).join(' ');

  const svg = document.createElementNS(NS, 'svg');
  // 750 по ширине — чтобы выноски справа не клиппились краем viewBox
  svg.setAttribute('viewBox', '0 0 750 440');
  svg.setAttribute('fill', 'none');

  const lines = [];
  const addPoly = (points3, cls) => {
    const el = document.createElementNS(NS, 'polyline');
    el.setAttribute('points', pts(points3.map((p) => P(p[0], p[1], p[2]))));
    el.setAttribute('class', cls || 'draw-line');
    svg.appendChild(el);
    lines.push(el);
    return el;
  };
  const addScreenPoly = (points2, cls) => {
    const el = document.createElementNS(NS, 'polyline');
    el.setAttribute('points', pts(points2));
    el.setAttribute('class', cls || 'draw-dim');
    svg.appendChild(el);
    lines.push(el);
    return el;
  };
  const addLabel = (x, y, text, anchor) => {
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', x.toFixed(1));
    t.setAttribute('y', y.toFixed(1));
    t.setAttribute('class', 'dim-label');
    if (anchor) t.setAttribute('text-anchor', anchor);
    t.textContent = text;
    svg.appendChild(t);
  };

  // основание
  addPoly([[0, 0, 0], [W, 0, 0], [W, 0, L], [0, 0, L], [0, 0, 0]]);

  // портальные рамы с шагом 3 м
  for (let z = 0; z <= L; z += STEP) {
    addPoly([[0, 0, z], [0, H, z], [W / 2, RIDGE, z], [W, H, z], [W, 0, z]]);
  }

  // прогоны по длине
  const roofY = (x) => (x <= W / 2 ? H + x * 0.3 : RIDGE - (x - W / 2) * 0.3);
  [0, 4, 8, 12, 16, 20, 24].forEach((x) => {
    addPoly([[x, roofY(x), 0], [x, roofY(x), L]]);
  });

  // связи в первом пролёте (стена x = W)
  addPoly([[W, 0, 0], [W, H, STEP]]);
  addPoly([[W, H, 0], [W, 0, STEP]]);

  // ворота в торце
  addPoly([[7, 0, 0], [7, 4.5, 0], [17, 4.5, 0], [17, 0, 0]], 'draw-line draw-dim');

  // узлы рам
  for (let z = 0; z <= L; z += STEP) {
    [[0, H, z], [W / 2, RIDGE, z], [W, H, z]].forEach(([x, y, zz]) => {
      const [sx, sy] = P(x, y, zz);
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', sx.toFixed(1));
      dot.setAttribute('cy', sy.toFixed(1));
      dot.setAttribute('r', '2');
      dot.setAttribute('class', 'draw-node');
      svg.appendChild(dot);
    });
  }

  // ── выноски ──
  // ПРОЛЁТ 24 000 — вдоль переднего ребра z=0
  const a = P(0, 0, 0), b = P(W, 0, 0);
  const off = [12, -20];
  addScreenPoly([[a[0] + off[0], a[1] + off[1]], [b[0] + off[0], b[1] + off[1]]]);
  addLabel((a[0] + b[0]) / 2 + 46, (a[1] + b[1]) / 2 - 26, 'ПРОЛЁТ 24 000', 'middle');

  // ШАГ РАМ 3 000 — между двумя рамами на ребре x=W
  const s1 = P(W, 0, 0), s2 = P(W, 0, STEP);
  const off2 = [16, 12];
  addScreenPoly([[s1[0] + off2[0], s1[1] + off2[1]], [s2[0] + off2[0], s2[1] + off2[1]]]);
  addLabel(s1[0] + 30, s1[1] + 36, 'ШАГ РАМ 3 000');

  // δ = 3,5 мм — лидер к колонне
  const c = P(W, 3, 0);
  addScreenPoly([[c[0], c[1]], [c[0] + 34, c[1] - 24], [c[0] + 44, c[1] - 24]]);
  addLabel(c[0] + 48, c[1] - 20, 'Ст. оцинк. δ=3,5 мм');

  host.prepend(svg);

  if (!prefersReducedMotion) animateStrokes(lines, 1.3, 45);
}

/* ───────── Отрисовка статичных SVG-чертежей по скроллу ───────── */
function initDrawAnimations() {
  if (prefersReducedMotion || !('IntersectionObserver' in window)) return;
  const shapes = 'path, line, polyline, rect, circle';
  const drawings = document.querySelectorAll('.bp-draw');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      animateStrokes(e.target.querySelectorAll(shapes), 1.1, 40);
    });
  }, { threshold: 0.25 });
  drawings.forEach((d) => io.observe(d));
}

/* ───────── Reveal при скролле ───────── */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => io.observe(el));

  // страховка: если observer так и не сработал (скрытая вкладка, печать,
  // нестандартный движок) — показать контент принудительно
  setTimeout(() => {
    if (!document.querySelector('.reveal.is-visible')) {
      items.forEach((el) => el.classList.add('is-visible'));
    }
  }, 3000);
}

/* ───────── Count-up цифр ───────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const render = (el, value) => {
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    el.textContent = prefix + value.toFixed(decimals).replace('.', ',') + suffix;
  };

  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    if (prefersReducedMotion) { render(el, target); return; }
    const dur = 1000;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      render(el, target * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animate(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach((el) => io.observe(el));
}

/* ───────── Мобильное меню ───────── */
function initMenu() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    })
  );
}

/* ───────── Параллакс чертежа hero за курсором ───────── */
function initHeroParallax() {
  const drawing = document.getElementById('hangar-drawing');
  const hero = document.getElementById('hero');
  if (!drawing || !hero || prefersReducedMotion) return;
  if (window.matchMedia('(pointer: coarse)').matches) return; // не на тач-экранах
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    drawing.style.transform = 'translate(' + (dx * 18).toFixed(1) + 'px,' + (dy * 14).toFixed(1) + 'px)';
  });
  hero.addEventListener('mouseleave', () => { drawing.style.transform = ''; });
}

/* ───────── «Таймкод» плеера производства (MM:SS:кадр) ───────── */
function initReelTimecode() {
  const tc = document.getElementById('reel-tc');
  if (!tc || prefersReducedMotion) return;
  let frame = 0;
  const pad = (n) => String(n).padStart(2, '0');
  setInterval(() => {
    frame = (frame + 1) % (60 * 25); // 25 кадров/с, минутный цикл
    const totalSec = Math.floor(frame / 25);
    tc.textContent = pad(Math.floor(totalSec / 60)) + ':' + pad(totalSec % 60) + ':' + pad(frame % 25);
  }, 40);
}

/* ───────── Плавающий WhatsApp после hero ───────── */
function initWaFloat() {
  const btn = document.getElementById('wa-float');
  const hero = document.getElementById('hero');
  if (!btn || !hero) return;
  if (!('IntersectionObserver' in window)) {
    btn.classList.add('is-shown');
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => btn.classList.toggle('is-shown', !e.isIntersecting));
  }, { threshold: 0.05 });
  io.observe(hero);
}

/* ───────── FAQ: табы (WAI-ARIA Tabs pattern) ───────── */
function initFaqTabs() {
  const tabs = Array.from(document.querySelectorAll('.faq__tab'));
  const panels = document.querySelectorAll('.faq__panel');
  if (!tabs.length) return;

  const activate = (tab, focus) => {
    tabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      t.setAttribute('tabindex', active ? '0' : '-1');
    });
    panels.forEach((p) => {
      const active = p.dataset.panel === tab.dataset.tab;
      p.classList.toggle('is-active', active);
      p.hidden = !active;
    });
    if (focus) tab.focus();
  };

  tabs.forEach((tab, i) => {
    tab.setAttribute('tabindex', tab.classList.contains('is-active') ? '0' : '-1');
    tab.addEventListener('click', () => activate(tab, false));
    tab.addEventListener('keydown', (e) => {
      let target = null;
      if (e.key === 'ArrowRight') target = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') target = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') target = tabs[0];
      else if (e.key === 'End') target = tabs[tabs.length - 1];
      if (target) {
        e.preventDefault();
        activate(target, true);
      }
    });
  });
}

/* ───────── Калькулятор зернохранилища ─────────
   Реальные данные Steppe Steel — вместимость на 1 м длины (т):
   пшеница 67 · горох 70 · кукуруза 62 · ячмень 56 · подсолнечник 37.
   Длина ангара = объём / вместимость на метр.
   В заявку данные попадают только после реального ввода (touched). */
const grainState = { tons: null, length: null, crop: null, touched: false };
const CROP_NAMES = { 67: 'пшеница', 70: 'горох', 62: 'кукуруза', 56: 'ячмень', 37: 'подсолнечник' };

function initGrainCalc() {
  const input = document.getElementById('grain-input');
  const crop = document.getElementById('grain-crop');
  const out = document.getElementById('grain-length');
  if (!input || !crop || !out) return;

  const compute = () => {
    const tons = parseFloat(input.value);
    const perMeter = parseFloat(crop.value) || 67;
    grainState.crop = CROP_NAMES[perMeter] || null;
    if (!tons || tons <= 0) {
      out.textContent = '— м';
      grainState.tons = null;
      grainState.length = null;
      return;
    }
    const length = Math.max(6, Math.round(tons / perMeter)); // м длины ангара
    grainState.tons = Math.round(tons);
    grainState.length = length;
    out.textContent = '≈ ' + fmt(length) + ' м';
  };
  input.addEventListener('input', () => { grainState.touched = true; compute(); });
  crop.addEventListener('change', () => { grainState.touched = true; compute(); });
  compute(); // показать расчёт для предзаполненного примера (в заявку не идёт)
}

/* ───────── Линейка профиля (живой лист КМД) ───────── */
function initProfiles() {
  const board = document.querySelector('.prof__board');
  const contour = document.getElementById('prof-contour');
  const tabs = [...document.querySelectorAll('.prof__tab')];
  const cards = [...document.querySelectorAll('.prof__card')];
  const markEl = document.getElementById('prof-mark');
  const bar = document.getElementById('prof-bar');
  const tLabel = document.getElementById('prof-tlabel');
  const tStamp = document.getElementById('prof-tstamp');
  const segBtns = [...document.querySelectorAll('.prof__seg-btn')];
  const motion = document.getElementById('prof-motion');
  if (!board || !contour || !tabs.length) return;

  const PATHS = {
    sigma: 'M300 132 L300 100 L180 100 L180 188 L212 204 L212 236 L180 252 L180 340 L300 340 L300 308',
    c: 'M300 132 L300 100 L180 100 L180 340 L300 340 L300 308',
    p: 'M300 100 L180 100 L180 340 L300 340'
  };
  const MARKS = { sigma: 'Σ', c: 'С', p: 'П' };
  const T_STROKE = { '1.5': 6, '2.0': 7.5, '2.5': 9, '3.0': 10.5, '3.5': 12 };
  const T_BAR = { '1.5': 45, '2.0': 58, '2.5': 70, '3.0': 84, '3.5': 100 };
  let curThick = '3.5';

  const draw = (animate) => {
    if (!animate || prefersReducedMotion) {
      // сплошной видимый контур, без пунктира
      contour.style.transition = 'stroke-width .45s cubic-bezier(.2,.7,.3,1)';
      contour.style.strokeDasharray = 'none';
      contour.style.strokeDashoffset = '0';
      return;
    }
    const len = contour.getTotalLength();
    contour.style.transition = 'none';
    contour.style.strokeDasharray = len;
    contour.style.strokeDashoffset = len;
    void contour.getBoundingClientRect(); // reflow
    requestAnimationFrame(() => {
      contour.style.transition = 'stroke-width .45s cubic-bezier(.2,.7,.3,1), stroke-dashoffset .9s ease';
      contour.style.strokeDashoffset = '0';
    });
    // гарантия: контур всегда окажется видимым, даже если rAF придушен (фон-вкладка)
    setTimeout(() => { contour.style.strokeDashoffset = '0'; }, 1000);
    if (motion) { try { motion.beginElement(); } catch (e) {} }
  };

  const applyThickness = (t) => {
    curThick = t;
    contour.style.strokeWidth = T_STROKE[t] + 'px';
    if (bar) bar.style.width = T_BAR[t] + '%';
    const txt = 't ' + t.replace('.', ',');
    if (tLabel) tLabel.textContent = txt;
    if (tStamp) tStamp.textContent = txt;
    segBtns.forEach((b) => b.classList.toggle('is-active', b.dataset.t === t));
  };

  const selectProfile = (key, animate) => {
    contour.setAttribute('d', PATHS[key]);
    board.setAttribute('data-prof', key);
    board.classList.remove('is-drawn');
    tabs.forEach((t) => {
      const on = t.dataset.prof === key;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
    });
    cards.forEach((c) => {
      const on = c.dataset.prof === key;
      c.classList.toggle('is-active', on);
      c.hidden = !on;
    });
    if (markEl) markEl.textContent = MARKS[key];
    draw(animate);
    // проявить выноски после отрисовки
    if (prefersReducedMotion) { board.classList.add('is-drawn'); }
    else { setTimeout(() => board.classList.add('is-drawn'), 60); }
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectProfile(tab.dataset.prof, true));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      selectProfile(next.dataset.prof, true);
    });
  });
  segBtns.forEach((b) => b.addEventListener('click', () => applyThickness(b.dataset.t)));

  applyThickness('3.5');
  selectProfile('sigma', false); // сразу виден сплошной контур

  // при первом попадании в вид — один раз проиграть отрисовку по обводке
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting) { draw(true); io.disconnect(); }
      });
    }, { threshold: 0.3 });
    io.observe(board);
  }
}

/* ───────── Форма «Расчёт за 24 часа» ───────── */
function initCalcForm() {
  const form = document.getElementById('calc-form');
  if (!form) return null;

  const steps = form.querySelectorAll('.calc__step');
  const thumb = document.getElementById('calc-thumb');
  const stepLabel = document.getElementById('calc-step-label');
  const btnBack = document.getElementById('calc-back');
  const btnNext = document.getElementById('calc-next');
  const btnSubmit = document.getElementById('calc-submit');
  const hint = document.getElementById('calc-hint');
  const errorEl = document.getElementById('calc-error');
  const sizesBlock = document.getElementById('calc-sizes');
  const phoneInput = document.getElementById('calc-phone');
  const stamp = document.getElementById('form-stamp');
  const success = document.getElementById('calc-success');
  const retryLink = document.getElementById('calc-retry');

  const LABELS = {
    1: 'ШАГ 1 ИЗ 3 · ТИП ЗДАНИЯ',
    2: 'ШАГ 2 ИЗ 3 · РАЗМЕРЫ И МЕСТО',
    3: 'ШАГ 3 ИЗ 3 · КОНТАКТЫ'
  };
  let step = 1;
  let preset = null;            // размер не предвыбираем — только явный выбор
  let cooldown = false;
  let stampTimer = null;

  const render = () => {
    steps.forEach((s) =>
      s.classList.toggle('is-active', Number(s.dataset.step) === step)
    );
    thumb.style.left = (step / 3) * 100 + '%';
    stepLabel.textContent = LABELS[step];
    btnBack.hidden = step === 1;
    btnNext.hidden = step === 3;
    btnSubmit.hidden = step !== 3;
    hint.hidden = step !== 3;
    const idx = btnNext.querySelector('.btn__index');
    if (idx) idx.textContent = (step + 1) + ' / 3';
  };

  const goToStep = (n) => {
    step = Math.min(3, Math.max(1, n));
    render();
  };

  btnNext.addEventListener('click', () => goToStep(step + 1));
  btnBack.addEventListener('click', () => goToStep(step - 1));

  // пресеты размеров
  const activatePreset = (btn) => {
    form.querySelectorAll('.calc__preset').forEach((b) =>
      b.classList.toggle('is-active', b === btn)
    );
    if ('custom' in btn.dataset) {
      preset = { custom: true };
      sizesBlock.hidden = false;
    } else {
      preset = { w: Number(btn.dataset.w), l: Number(btn.dataset.l), custom: false };
      sizesBlock.hidden = true;
    }
  };
  form.querySelectorAll('.calc__preset').forEach((btn) => {
    btn.addEventListener('click', () => activatePreset(btn));
  });

  const clearPhoneError = () => {
    errorEl.hidden = true;
    phoneInput.removeAttribute('aria-invalid');
  };

  // маска телефона: поле хранит +7 (XXX) XXX-XX-XX, ввод — 10 цифр абонента
  phoneInput.addEventListener('input', () => {
    let d = phoneInput.value.replace(/\D/g, '');
    if (!d) { phoneInput.value = ''; clearPhoneError(); return; }
    if (d[0] === '8') d = d.slice(1);              // 8 705 … → 705 …
    if (d.length >= 11 && d[0] === '7') d = d.slice(1); // 7 705 … (с кодом страны)
    d = d.slice(0, 10);
    let out = '+7';
    if (d.length) out += ' (' + d.slice(0, 3);
    if (d.length >= 4) out += ') ' + d.slice(3, 6);
    if (d.length >= 7) out += '-' + d.slice(6, 8);
    if (d.length >= 9) out += '-' + d.slice(8, 10);
    phoneInput.value = out;
    if (d.length === 10) clearPhoneError();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Enter на шагах 1–2 работает как «Далее», а не как молчаливый сабмит
    if (step !== 3) { goToStep(step + 1); return; }
    if (cooldown) return;

    const digits = phoneInput.value.replace(/\D/g, '');
    if (digits.length < 11) {
      errorEl.hidden = false;
      phoneInput.setAttribute('aria-invalid', 'true');
      phoneInput.focus();
      return;
    }
    clearPhoneError();

    const data = new FormData(form);
    const get = (name) => (data.get(name) || '').toString().trim();

    let sizeText = '';
    if (preset && preset.custom) {
      const l = get('length'), w = get('width');
      sizeText = (l && w) ? w + '×' + l + ' м' : 'свой размер (уточню с инженером)';
    } else if (preset) {
      sizeText = preset.w + '×' + preset.l + ' м';
    }

    const type = get('type');
    const rows = ['Здравствуйте! Хочу рассчитать стоимость.'];
    rows.push('Тип здания: ' + type);
    if (sizeText) rows.push('Размеры: ' + sizeText);
    if (get('location')) rows.push('Место строительства: ' + get('location'));
    if (type === 'Зернохранилище' && grainState.touched && grainState.tons && grainState.length) {
      rows.push('Зерно: ' + fmt(grainState.tons) + ' т' + (grainState.crop ? ' (' + grainState.crop + ')' : '') + ' → длина ангара ≈ ' + fmt(grainState.length) + ' м');
    }
    if (data.get('harvest')) rows.push('Срок: нужно к уборочной');
    const name = get('name');
    rows.push((name ? 'Меня зовут: ' + name + '. ' : '') + 'Телефон: ' + phoneInput.value);

    const url = waLink(rows.join('\n'));

    cooldown = true;
    setTimeout(() => { cooldown = false; }, 1500);

    // WhatsApp открывается синхронно (иначе Safari блокирует попап),
    // оттиск «В ПРОИЗВОДСТВО» и блок успеха — параллельная обратная связь
    openWa(url);
    if (success) {
      success.hidden = false;
      if (retryLink) retryLink.href = url;
      // запасной канал: email с тем же текстом заявки (на случай, если WhatsApp не открылся)
      const mailLink = document.getElementById('calc-mail');
      if (mailLink) {
        mailLink.href = 'mailto:' + CONFIG.EMAIL
          + '?subject=' + encodeURIComponent('Заявка на расчёт — ' + type)
          + '&body=' + encodeURIComponent(rows.join('\n'));
      }
    }
    if (!prefersReducedMotion && stamp) {
      if (stampTimer) clearTimeout(stampTimer);
      stamp.classList.remove('is-stamped');
      void stamp.getBoundingClientRect();
      stamp.classList.add('is-stamped');
      stampTimer = setTimeout(() => stamp.classList.remove('is-stamped'), 2000);
    }
  });

  render();
  return { goToStep, activatePreset, form };
}

/* ───────── Предвыбор типа здания из каталога/агро-блока ───────── */
function initPreselect(calc) {
  document.querySelectorAll('[data-preselect]').forEach((link) => {
    link.addEventListener('click', () => {
      const key = link.dataset.preselect;
      const radio = document.querySelector(
        '#calc-form input[name="type"][data-key="' + key + '"]'
      );
      if (radio) radio.checked = true;
      if (calc) {
        // показать пользователю выбранный тип — вернуться на шаг 1
        calc.goToStep(1);
        // для зернохранилища подставить профильный пресет 24×60
        if (key === 'grain') {
          const chip = calc.form.querySelector('.calc__preset[data-w="24"][data-l="60"]');
          if (chip) calc.activatePreset(chip);
        }
      }
    });
  });
}

/* ───────── Запуск ───────── */
document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  buildHangarDrawing();
  initDrawAnimations();
  initReveal();
  initCounters();
  initMenu();
  initWaFloat();
  initHeroParallax();
  initReelTimecode();
  initFaqTabs();
  initGrainCalc();
  initProfiles();
  const calc = initCalcForm();
  initPreselect(calc);
});
