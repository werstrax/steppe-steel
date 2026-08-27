/* ============================================================================
   STEPPE STEEL — клиентский скрипт.
   Без зависимостей. Всё работает и без него: меню откроется по якорю,
   аккордеоны раскрыты для поисковиков, квиз шлёт заявку в WhatsApp.
   ========================================================================= */

(function () {
  'use strict';

  // скрипт загрузился — отменяем аварийный таймер из <head>, который
  // снимает класс .js (иначе при сбое сети контент остался бы спрятанным)
  if (window.__steppeJsReady) window.__steppeJsReady();

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var fmt = function (n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };

  /* открыть WhatsApp синхронно (Safari блокирует window.open из setTimeout) */
  var openWa = function (url) {
    var w = window.open(url, '_blank');
    if (!w) window.location.href = url;
  };

  /* --- Шапка: фон при скролле, скрытие при прокрутке вниз ---------------- */

  (function header() {
    var el = $('[data-header]');
    if (!el) return;

    var last = window.scrollY;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      el.classList.toggle('is-stuck', y > 24);

      var menuOpen = document.body.classList.contains('is-locked');
      var goingDown = y > last && y > 400;
      el.classList.toggle('is-hidden', goingDown && !menuOpen);

      last = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  })();

  /* --- Мобильное меню ---------------------------------------------------- */

  (function menu() {
    var btn = $('.burger');
    var panel = $('[data-menu]');
    if (!btn || !panel) return;

    panel.hidden = false;
    var open = false;

    function set(state) {
      open = state;
      btn.setAttribute('aria-expanded', String(state));
      panel.classList.toggle('is-open', state);
      document.body.classList.toggle('is-locked', state);
      if (state) {
        var first = panel.querySelector('a, button');
        if (first) first.focus({ preventScroll: true });
      }
    }

    btn.addEventListener('click', function () { set(!open); });

    panel.addEventListener('click', function (ev) {
      if (ev.target.closest('a')) set(false);
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && open) { set(false); btn.focus(); }
    });

    panel.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Tab' || !open) return;
      var items = $$('a, button, input, select, textarea', panel).filter(function (n) {
        return n.offsetParent !== null;
      });
      if (!items.length) return;
      var first = items[0];
      var last2 = items[items.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last2.focus(); }
      else if (!ev.shiftKey && document.activeElement === last2) { ev.preventDefault(); first.focus(); }
    });
  })();

  /* --- Появление блоков при скролле -------------------------------------- */

  (function reveal() {
    var items = $$('[data-reveal]');
    if (!items.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    items.forEach(function (n) { io.observe(n); });

    // страховка: observer молчит (скрытая вкладка, печать) — показать всё
    setTimeout(function () {
      if (!document.querySelector('[data-reveal].is-in')) {
        items.forEach(function (n) { n.classList.add('is-in'); });
      }
    }, 3000);
  })();

  /* --- Плавное проявление картинок --------------------------------------- */

  (function images() {
    $$('img[data-fade]').forEach(function (img) {
      if (img.complete && img.naturalWidth) { img.classList.add('is-loaded'); return; }
      img.addEventListener('load', function () { img.classList.add('is-loaded'); }, { once: true });
      img.addEventListener('error', function () { img.classList.add('is-loaded'); }, { once: true });
    });
  })();

  /* --- Видео: пауза при reduced-motion + видимая кнопка пауза/пуск ------- */

  (function videos() {
    $$('video[data-autovideo]').forEach(function (v) {
      if (reduced) {
        v.removeAttribute('autoplay');
        try { v.pause(); } catch (e) {}
      }
      // WCAG 2.2.2: у зацикленного авто-видео должна быть пауза
      var host = v.closest('.media-video') || v.parentElement;
      if (!host) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'video-toggle';
      var setState = function (playing) {
        btn.setAttribute('aria-pressed', String(!playing));
        btn.setAttribute('aria-label', playing ? 'Остановить видео' : 'Запустить видео');
        btn.innerHTML = playing
          ? '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><rect x="2" y="1" width="3.5" height="12"/><rect x="8.5" y="1" width="3.5" height="12"/></svg>'
          : '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M3 1l10 6-10 6z"/></svg>';
      };
      setState(!reduced);
      btn.addEventListener('click', function () {
        if (v.paused) { v.play(); setState(true); }
        else { v.pause(); setState(false); }
      });
      host.appendChild(btn);
    });
  })();

  /* --- Маркиза: пауза по тапу/клику (для тач-экранов) --------------------- */

  (function marqueePause() {
    $$('.marquee').forEach(function (m) {
      m.addEventListener('click', function () { m.classList.toggle('is-paused'); });
    });
  })();

  /* --- Таблицы: подсказка «листается», пока правый край не доскроллен ----- */

  (function tableHints() {
    $$('.table-wrap').forEach(function (wrap) {
      var update = function () {
        var more = wrap.scrollWidth > wrap.clientWidth + 2 &&
          wrap.scrollLeft + wrap.clientWidth < wrap.scrollWidth - 8;
        wrap.classList.toggle('has-more', more);
      };
      wrap.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update, { passive: true });
      update();
    });
  })();

  /* --- Аккордеон FAQ ------------------------------------------------------ */

  (function accordion() {
    $$('.faq__q').forEach(function (btn) {
      var item = btn.closest('.faq__item');
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        if (item) item.classList.toggle('is-open', !expanded);
      });
    });
  })();

  /* --- Плавающая кнопка WhatsApp ------------------------------------------ */

  (function fab() {
    var el = $('[data-fab]');
    if (!el) return;

    function update() {
      var scrolled = window.scrollY > window.innerHeight * 0.5;
      var atBottom = window.innerHeight + window.scrollY > document.body.offsetHeight - 320;
      el.classList.toggle('is-visible', scrolled && !atBottom);
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  })();

  /* --- Лайтбокс ------------------------------------------------------------ */

  (function lightbox() {
    var triggers = $$('[data-lightbox]');
    if (!triggers.length) return;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Просмотр изображения');
    box.innerHTML =
      '<img class="lightbox__img" alt="">' +
      '<button class="lightbox__btn lightbox__close" type="button" aria-label="Закрыть">' +
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="1.4"/></svg></button>' +
      '<button class="lightbox__btn lightbox__prev" type="button" aria-label="Предыдущее">' +
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 2L4 8l6 6" stroke="currentColor" stroke-width="1.4"/></svg></button>' +
      '<button class="lightbox__btn lightbox__next" type="button" aria-label="Следующее">' +
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 2l6 6-6 6" stroke="currentColor" stroke-width="1.4"/></svg></button>' +
      '<span class="lightbox__count" data-lb-count></span>';
    document.body.appendChild(box);

    var img = $('.lightbox__img', box);
    var count = $('[data-lb-count]', box);
    var cur = 0;
    var lastFocus = null;

    // клавиатурный доступ к триггерам-фигурам
    triggers.forEach(function (t, i) {
      t.setAttribute('tabindex', '0');
      t.setAttribute('role', 'button');
      if (!t.getAttribute('aria-label')) {
        var im = t.querySelector('img');
        t.setAttribute('aria-label', 'Открыть изображение: ' + (im ? im.alt : ''));
      }
      t.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          open(i);
        }
      });
    });

    // ловушка фокуса внутри открытого диалога
    box.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Tab') return;
      var items = $$('.lightbox__btn', box);
      var first = items[0];
      var last = items[items.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    });

    function srcOf(t) {
      // data-full — когда в лайтбоксе нужен крупный файл, а не тот размер,
      // который браузер выбрал под маленькое превью (листы документов)
      var full = t.getAttribute('data-full');
      if (full) return full;
      var m = t.querySelector('img');
      return m ? (m.currentSrc || m.src) : '';
    }
    function altOf(t) {
      var m = t.querySelector('img');
      return m ? m.alt : '';
    }

    function open(i) {
      cur = i;
      img.src = srcOf(triggers[cur]);
      img.alt = altOf(triggers[cur]);
      count.textContent = (cur + 1) + ' / ' + triggers.length;
      box.classList.add('is-open');
      document.body.classList.add('is-locked');
      lastFocus = document.activeElement;
      $('.lightbox__close', box).focus();
    }
    function close() {
      box.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      if (lastFocus) lastFocus.focus();
    }
    function step(d) { open((cur + d + triggers.length) % triggers.length); }

    triggers.forEach(function (t, i) {
      t.addEventListener('click', function (ev) {
        ev.preventDefault();
        open(i);
      });
    });

    $('.lightbox__close', box).addEventListener('click', close);
    $('.lightbox__prev', box).addEventListener('click', function () { step(-1); });
    $('.lightbox__next', box).addEventListener('click', function () { step(1); });
    box.addEventListener('click', function (ev) { if (ev.target === box || ev.target === img) close(); });

    document.addEventListener('keydown', function (ev) {
      if (!box.classList.contains('is-open')) return;
      if (ev.key === 'Escape') close();
      if (ev.key === 'ArrowLeft') step(-1);
      if (ev.key === 'ArrowRight') step(1);
    });

    var x0 = null;
    box.addEventListener('touchstart', function (ev) { x0 = ev.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (ev) {
      if (x0 === null) return;
      var dx = ev.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 48) step(dx > 0 ? -1 : 1);
      x0 = null;
    }, { passive: true });
  })();

  /* --- Кастомный курсор ---------------------------------------------------- */

  (function cursor() {
    if (reduced) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    var el = document.createElement('div');
    el.className = 'cursor';
    el.innerHTML = '<span class="cursor__label"></span>';
    document.body.appendChild(el);
    document.documentElement.classList.add('has-cursor');

    var label = el.firstChild;
    var x = -100, y = -100, tx = x, ty = y;

    document.addEventListener('mousemove', function (ev) {
      tx = ev.clientX; ty = ev.clientY;
      el.classList.add('is-on');
    }, { passive: true });

    document.addEventListener('mouseleave', function () { el.classList.remove('is-on'); });
    document.addEventListener('mousedown', function () { el.classList.add('is-press'); });
    document.addEventListener('mouseup', function () { el.classList.remove('is-press'); });

    document.addEventListener('mouseover', function (ev) {
      var zone = ev.target.closest('[data-cursor]');
      if (zone) {
        label.textContent = zone.getAttribute('data-cursor') || 'Смотреть';
        el.classList.add('is-view');
      } else {
        el.classList.remove('is-view');
      }
    }, { passive: true });

    (function loop() {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
  })();

  /* --- Прогресс чтения статьи ---------------------------------------------- */

  (function readProgress() {
    var article = $('article[data-article]');
    if (!article) return;

    var wrap = document.createElement('div');
    wrap.className = 'read-progress';
    wrap.innerHTML = '<div class="read-progress__bar"></div>';
    document.body.appendChild(wrap);
    var bar = wrap.firstChild;

    function update() {
      var rect = article.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var passed = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      bar.style.width = (passed / Math.max(total, 1)) * 100 + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  })();

  /* --- Оглавление статьи: подсветка текущего раздела ----------------------- */

  (function scrollspy() {
    var toc = $('[data-toc]');
    if (!toc || !('IntersectionObserver' in window)) return;

    var links = $$('.toc__link', toc);
    var heads = links
      .map(function (l) { return document.getElementById(l.getAttribute('href').slice(1)); })
      .filter(Boolean);
    if (!heads.length) return;

    function activate(id) {
      links.forEach(function (l) {
        l.classList.toggle('is-active', l.getAttribute('href') === '#' + id);
      });
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) activate(en.target.id);
      });
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
    heads.forEach(function (h) { io.observe(h); });
    activate(heads[0].id);
  })();

  /* --- Просмотренные разделы каталога -------------------------------------- */

  (function seenProducts() {
    var KEY = 'steppe-seen';
    var read = function () {
      try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
    };

    // На странице продукта — запоминаем визит
    var m = location.pathname.match(/\/katalog\/([a-z0-9-]+)\/$/);
    if (m) {
      var seen = read();
      if (seen.indexOf(m[1]) === -1) {
        seen.push(m[1]);
        try { localStorage.setItem(KEY, JSON.stringify(seen.slice(-50))); } catch (e) {}
      }
      return;
    }

    // В каталоге — отмечаем просмотренное
    var grid = $('[data-products]');
    if (!grid) return;
    var cards = $$('[data-slug]', grid);
    if (!cards.length) return;

    var list = read();
    var count = 0;
    cards.forEach(function (card) {
      if (list.indexOf(card.getAttribute('data-slug')) === -1) return;
      count++;
      var meta = card.querySelector('.product-card__meta');
      if (meta && !meta.querySelector('.product-card__seen')) {
        var tag = document.createElement('span');
        tag.className = 'product-card__seen';
        tag.textContent = '● Просмотрено';
        meta.appendChild(tag);
      }
    });

    var note = $('[data-seen]');
    if (note && count > 0 && count < cards.length) {
      note.textContent = 'Вы посмотрели ' + count + ' из ' + cards.length + ' разделов — осталось ещё ' + (cards.length - count);
      note.hidden = false;
    } else if (note && count === cards.length && count > 0) {
      note.textContent = 'Вы посмотрели все разделы каталога — обсудим ваш объект?';
      note.hidden = false;
    }
  })();

  /* --- Прелоадер-шторка ----------------------------------------------------- */

  (function intro() {
    var root = document.documentElement;
    var loader = $('[data-loader]');
    if (!loader || !root.classList.contains('intro')) {
      requestAnimationFrame(function () { root.classList.add('lines-in'); });
      return;
    }

    try { sessionStorage.setItem('steppe-intro', '1'); } catch (e) {}

    setTimeout(function () {
      loader.classList.add('is-done');
      root.classList.add('lines-in');
      setTimeout(function () {
        root.classList.remove('intro');
        loader.remove();
      }, 950);
    }, 1350);
  })();

  /* --- Разъезжающиеся строки крупных заголовков ----------------------------- */

  (function splitLines() {
    if (reduced) { document.documentElement.classList.add('lines-in'); return; }

    $$('.hero__title, .page-hero__title').forEach(function (el) {
      try {
        var units = [];
        Array.prototype.slice.call(el.childNodes).forEach(function (node) {
          if (node.nodeType === 3) {
            node.textContent.split(/(\s+)/).forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) { units.push(document.createTextNode(' ')); return; }
              var w = document.createElement('span');
              w.style.display = 'inline-block';
              w.textContent = part;
              units.push(w);
            });
          } else if (node.nodeType === 1 && node.tagName !== 'BR') {
            node.style.display = 'inline-block';
            units.push(node);
          }
        });
        el.textContent = '';
        units.forEach(function (u) { el.appendChild(u); });

        var lines = [];
        var lastTop = null;
        units.forEach(function (u) {
          if (u.nodeType === 3) return;
          var top = u.offsetTop;
          if (lastTop === null || Math.abs(top - lastTop) > 4) { lines.push([]); lastTop = top; }
          lines[lines.length - 1].push(u);
        });
        if (!lines.length) return;

        el.textContent = '';
        lines.forEach(function (words, i) {
          var mask = document.createElement('span');
          mask.className = 'line-mask';
          var inner = document.createElement('span');
          inner.className = 'line-in';
          inner.style.setProperty('--line-i', String(i));
          words.forEach(function (w, j) {
            if (j) inner.appendChild(document.createTextNode(' '));
            w.style.display = '';
            inner.appendChild(w);
          });
          mask.appendChild(inner);
          el.appendChild(mask);
        });
      } catch (e) {
        /* при любой ошибке заголовок остаётся обычным текстом */
      }
    });
  })();

  /* --- Цифры, которые считают себя сами ------------------------------------- */

  (function countUp() {
    var els = $$('.stat__val, .hero__meta-val');
    if (!els.length || reduced || !('IntersectionObserver' in window)) return;

    function animate(el) {
      var text = el.textContent.trim();
      var m = text.replace(/[   ]/g, ' ').match(/^([\d\s]+)(,\d)?\s*(\+)?$/);
      if (!m) return;
      var target = parseInt(m[1].replace(/\s+/g, ''), 10);
      var decimal = m[2] ? parseInt(m[2].slice(1), 10) : null;
      var suffix = m[3] || '';
      if (isNaN(target)) return;

      var t0 = null;
      var DUR = 1200;
      function frame(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / DUR, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        var val = Math.round(target * ease);
        var str = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        if (decimal !== null) str += ',' + Math.round(decimal * ease);
        el.textContent = str + suffix;
        if (p < 1) requestAnimationFrame(frame);
        else el.textContent = text;
      }
      requestAnimationFrame(frame);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        animate(en.target);
      });
    }, { threshold: 0.6 });

    els.forEach(function (el) { io.observe(el); });
  })();

  /* --- Магнитные кнопки ------------------------------------------------------ */

  (function magnetic() {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return;

    $$('.btn').forEach(function (el) {
      var strength = 7;
      el.addEventListener('mousemove', function (ev) {
        var r = el.getBoundingClientRect();
        var dx = (ev.clientX - r.left - r.width / 2) / (r.width / 2);
        var dy = (ev.clientY - r.top - r.height / 2) / (r.height / 2);
        el.style.transform = 'translate(' + dx * strength + 'px,' + dy * strength + 'px)';
        el.style.transition = 'transform .12s ease-out';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .45s cubic-bezier(0.22, 1, 0.36, 1)';
        el.style.transform = '';
      });
    });
  })();

  /* ==========================================================================
     Фирменные интерактивы Steppe Steel (перенос из v1)
     ======================================================================== */

  /* --- Калькулятор зернохранилища -------------------------------------------
     Реальные данные завода — вместимость на 1 м длины (т):
     пшеница 67 · горох 70 · кукуруза 62 · ячмень 56 · подсолнечник 37.
     В заявку данные попадают только после реального ввода (touched). */

  var grainState = { tons: null, length: null, crop: null, touched: false };
  var CROP_NAMES = { 67: 'пшеница', 70: 'горох', 62: 'кукуруза', 56: 'ячмень', 37: 'подсолнечник' };

  (function grainCalc() {
    var input = $('#grain-input');
    var crop = $('#grain-crop');
    var out = $('#grain-length');
    if (!input || !crop || !out) return;

    var compute = function () {
      var tons = parseFloat(input.value);
      var perMeter = parseFloat(crop.value) || 67;
      grainState.crop = CROP_NAMES[perMeter] || null;
      if (!tons || tons <= 0) {
        out.textContent = '— м';
        grainState.tons = null;
        grainState.length = null;
        return;
      }
      var length = Math.max(6, Math.round(tons / perMeter));
      grainState.tons = Math.round(tons);
      grainState.length = length;
      out.textContent = '≈ ' + fmt(length) + ' м';
    };
    // расчёт уезжает вместе с клиентом на /zayavka/ через query-параметры;
    // путь берём из готового href — сайт живёт в подпапке GitHub Pages
    var cta = $('#grain-cta');
    var ctaPath = cta ? cta.getAttribute('href').split('?')[0] : '';
    var syncCta = function () {
      if (!cta || !grainState.touched || !grainState.tons) return;
      cta.href = ctaPath + '?type=grain&tons=' + grainState.tons +
        '&crop=' + encodeURIComponent(grainState.crop || '') +
        '&len=' + grainState.length;
    };

    input.addEventListener('input', function () { grainState.touched = true; compute(); syncCta(); });
    crop.addEventListener('change', function () { grainState.touched = true; compute(); syncCta(); });
    compute(); // пример для предзаполненного значения (в заявку не идёт)
  })();

  /* --- Эскизный лист 06-А: живой чертёж зернохранилища ----------------------
     Фасад на листе тянется за калькулятором, штамп заполняется данными
     посетителя. Геометрия — КОПИЯ функции gsDynamic из src/lib/components.mjs
     (там рисуется статичный дефолт для no-JS) — менять синхронно. */

  (function grainSheet() {
    var sheet = $('#grain-sheet');
    var input = $('#grain-input');
    var crop = $('#grain-crop');
    if (!sheet || !input || !crop) return;

    var GS = {
      x0: 50, drawW: 620, ground: 330,
      lvl: { grill: 0.6, hem: 1.8, eave: 5.6, ridge: 8 },
      scales: [
        { ppm: 16, label: 'М 1:250' },
        { ppm: 8, label: 'М 1:500' },
        { ppm: 16 / 3, label: 'М 1:750' },
        { ppm: 4, label: 'М 1:1000' },
      ],
    };
    var nnum = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };

    var els = {
      svg: $('#gs-svg'), dyn: $('#gs-dyn'), clad: $('#gs-clad'), eave: $('#gs-eave'),
      grill: $('#gs-grill'), endL: $('#gs-end-l'), endR: $('#gs-end-r'),
      crop: $('#gs-crop'), tons: $('#gs-tons'), len: $('#gs-len'), scale: $('#gs-scale'),
      send: $('#gs-send'), print: $('#gs-print'), code: $('#gs-code'),
    };

    var redraw = function () {
      var tons = parseFloat(input.value);
      var perMeter = parseFloat(crop.value) || 67;
      if (!tons || tons <= 0) return; // пустой ввод — оставляем последний эскиз
      var total = Math.max(6, Math.round(tons / perMeter));
      var corp = Math.ceil(total / 140);
      var each = Math.max(6, Math.ceil(total / corp));

      var s = GS.scales[GS.scales.length - 1];
      for (var i = 0; i < GS.scales.length; i++) {
        if (each * GS.scales[i].ppm <= GS.drawW) { s = GS.scales[i]; break; }
      }
      var ppm = s.ppm;
      var W = each * ppm;
      var g = GS.ground;
      var yG = g - GS.lvl.grill * ppm;
      var yH = g - GS.lvl.hem * ppm;
      var yE = g - GS.lvl.eave * ppm;
      var yR = g - GS.lvl.ridge * ppm;

      // сплошные элементы тянутся CSS-переходом (геометрия как CSS-свойства)
      var st = function (el, props) { for (var k in props) el.style[k] = props[k] + 'px'; };
      st(els.clad, { x: GS.x0, y: yR, width: W, height: yH - yR });
      st(els.eave, { x: GS.x0, y: yE, width: W, height: 1.2 });
      st(els.grill, { x: GS.x0, y: yG, width: W, height: 2 });
      st(els.endL, { x: GS.x0 - 1, y: yR, width: 2, height: yG - yR });
      st(els.endR, { x: GS.x0 + W - 1, y: yR, width: 2, height: yG - yR });

      // стойки, подкосы, сваи и размерная линия — перерисовка целиком
      var bays = Math.max(1, Math.round(each / 6));
      var step = W / bays;
      var p = '';
      for (var b = 0; b <= bays; b++) {
        var x = +(GS.x0 + b * step).toFixed(1);
        p += '<line class="gs-post" x1="' + x + '" y1="' + yH + '" x2="' + x + '" y2="' + yG + '"/>';
        if (ppm >= 8 && b < bays)
          p += '<line class="gs-brace" x1="' + x + '" y1="' + yG + '" x2="' + (+(x + step).toFixed(1)) + '" y2="' + yH + '"/>';
        if (ppm >= 8 && b > 0 && b < bays)
          p += '<line class="gs-seam" x1="' + x + '" y1="' + (+(yR + 2).toFixed(1)) + '" x2="' + x + '" y2="' + (+(yH - 2).toFixed(1)) + '"/>';
        p += '<line class="gs-pile" x1="' + x + '" y1="' + yG + '" x2="' + x + '" y2="' + g + '"/>';
      }
      var dy = yR - 24;
      var xr = +(GS.x0 + W).toFixed(1);
      p += '<line class="gs-dim" x1="' + GS.x0 + '" y1="' + dy + '" x2="' + xr + '" y2="' + dy + '" marker-start="url(#gs-arr)" marker-end="url(#gs-arr)"/>';
      p += '<line class="gs-dim" x1="' + GS.x0 + '" y1="' + (dy - 8) + '" x2="' + GS.x0 + '" y2="' + (yR - 6) + '"/>';
      p += '<line class="gs-dim" x1="' + xr + '" y1="' + (dy - 8) + '" x2="' + xr + '" y2="' + (yR - 6) + '"/>';
      var dimText = '≈ ' + nnum(each * 1000) + (corp > 1 ? ' · КОРПУСОВ: ' + corp : '');
      p += '<text class="gs-dimtext" x="' + (+(GS.x0 + W / 2).toFixed(1)) + '" y="' + (dy - 8) + '" text-anchor="middle">' + dimText + '</text>';
      els.dyn.innerHTML = p;
      els.dyn.classList.remove('gs-fresh');
      void els.dyn.getBoundingClientRect();
      els.dyn.classList.add('gs-fresh');

      // врезка «Внешний вид»: бакет по длине корпуса
      var stack = $('.gs-view__stack', sheet);
      if (stack) {
        var bucket = each <= 45 ? 0 : each <= 80 ? 1 : each <= 115 ? 2 : 3;
        var pics = stack.querySelectorAll('picture');
        for (var pi = 0; pi < pics.length; pi++)
          pics[pi].classList.toggle('is-active', pi === bucket);
      }

      // штамп и подписи
      var cropName = CROP_NAMES[perMeter] || 'культура';
      var lenText = (corp > 1 ? corp + ' × ' : '') + '≈ ' + fmt(each) + ' м';
      els.crop.textContent = cropName;
      els.tons.textContent = fmt(tons) + ' т';
      els.len.textContent = lenText;
      els.scale.textContent = s.label;
      els.svg.setAttribute('aria-label',
        'Эскиз фасада зернохранилища: ' + (corp > 1 ? corp + ' корпуса по ' : '') + fmt(each) + ' м');

      // WhatsApp-ссылка с параметрами листа
      if (els.send) {
        var msg = 'Здравствуйте! Эскизный лист 06-А с сайта Steppe Steel: ' + cropName + ', ' +
          fmt(tons) + ' т → ' + (corp > 1 ? corp + ' корпуса × ' : 'длина ') + '≈ ' + fmt(each) +
          ' м. ' + (els.code ? 'Шифр ' + els.code.textContent + '. ' : '') + 'Прошу расчёт инженера.';
        els.send.href = els.send.href.split('?')[0] + '?text=' + encodeURIComponent(msg);
      }
    };

    // дата и шифр листа — по часам посетителя (SSR печёт дату сборки)
    var now = new Date();
    var d2 = function (n) { return (n < 10 ? '0' : '') + n; };
    var dateEl = $('#gs-date');
    if (dateEl) dateEl.textContent = d2(now.getDate()) + '.' + d2(now.getMonth() + 1) + '.' + now.getFullYear();
    if (els.code) els.code.textContent = 'СС-06А-' + d2(now.getDate()) + d2(now.getMonth() + 1) + String(now.getFullYear()).slice(2);

    var t = null;
    var onChange = function () { clearTimeout(t); t = setTimeout(redraw, 150); };
    input.addEventListener('input', onChange);
    crop.addEventListener('change', onChange);

    // прочерчивание рамки при входе во вьюпорт (с фолбэком)
    if ('IntersectionObserver' in window && !reduced) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { sheet.classList.add('is-drawn'); io.disconnect(); }
        });
      }, { threshold: 0.2 });
      io.observe(sheet);
      setTimeout(function () { sheet.classList.add('is-drawn'); }, 4000);
    } else {
      sheet.classList.add('is-drawn');
    }

    // печать листа: только доска, чёрным по белому
    if (els.print && typeof window.print === 'function') {
      els.print.hidden = false;
      els.print.addEventListener('click', function () {
        document.documentElement.classList.add('gs-printing');
        var done = function () { document.documentElement.classList.remove('gs-printing'); };
        if ('onafterprint' in window) window.addEventListener('afterprint', done, { once: true });
        else setTimeout(done, 1000);
        window.print();
      });
    }
  })();

  /* --- Хроника объекта (ЛИСТ 04-М): скролл-таймлапс стройки ------------------
     Нативный sticky + rAF-гейт; скролл меняет только opacity кадров.
     Кроссфейд на последних 35% сегмента маскирует дрейф ИИ-деталей. */

  (function cycleStory() {
    var sec = $('#cycle');
    if (!sec) return;
    var frames = $$('[data-cycle-frame]', sec);
    var dots = $$('[data-cycle-dot]', sec);
    var num = $('#cycle-num');
    var label = $('#cycle-label');
    var fill = $('#cycle-fill');
    var N = frames.length;
    if (N < 2) return;
    var labels = dots.map(function (d) {
      return d.getAttribute('aria-label').replace(/^[^:]*:\s*/, '');
    });
    var current = 0;

    var setStage = function (i) {
      if (i === current) return;
      current = i;
      dots.forEach(function (d, k) {
        d.classList.toggle('is-active', k === i);
        d.setAttribute('aria-pressed', k === i ? 'true' : 'false');
      });
      if (num) num.textContent = '0' + (i + 1);
      if (label) label.textContent = labels[i] || '';
    };

    var show = function (i) {
      frames.forEach(function (f, k) { f.style.opacity = k === i ? 1 : 0; });
      setStage(i);
      if (fill) fill.style.height = (i / (N - 1)) * 100 + '%';
    };

    if (reduced) {
      // без анимаций: кнопки-стадии работают степпером
      dots.forEach(function (d, k) {
        d.addEventListener('click', function () { show(k); });
      });
      return;
    }

    var ticking = false;
    var update = function () {
      ticking = false;
      var rect = sec.getBoundingClientRect();
      var span = rect.height - window.innerHeight;
      if (span <= 0) return;
      var progress = Math.min(1, Math.max(0, -rect.top / span));
      var pos = progress * (N - 1);
      var i = Math.min(N - 2, Math.floor(pos));
      var t = pos - i;
      for (var k = 0; k < N; k++) {
        var o = 0;
        if (k === i) o = 1;
        else if (k === i + 1) o = t > 0.65 ? (t - 0.65) / 0.35 : 0;
        frames[k].style.opacity = o;
      }
      setStage(t > 0.825 ? i + 1 : i);
      if (fill) fill.style.height = progress * 100 + '%';
    };
    var onScroll = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    // клик по риске — плавный проброс к нужной стадии
    dots.forEach(function (d, k) {
      d.addEventListener('click', function () {
        var top = sec.getBoundingClientRect().top + window.pageYOffset;
        var span = sec.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + (k / (N - 1)) * span + 1, behavior: 'smooth' });
      });
    });
  })();

  /* --- Атлас стали (ЛИСТ 03-Д): табы образцов -------------------------------- */

  (function atlasTabs() {
    var tabs = $$('[data-atlas-tab]');
    if (!tabs.length) return;
    var panels = tabs.map(function (t) {
      return document.getElementById(t.getAttribute('aria-controls'));
    });
    var activate = function (i, focus) {
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p, k) {
        if (!p) return;
        p.classList.toggle('is-active', k === i);
        if (k === i) p.removeAttribute('aria-hidden');
        else p.setAttribute('aria-hidden', 'true');
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { activate(i); });
      t.addEventListener('keydown', function (ev) {
        var j = null;
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') j = (i + 1) % tabs.length;
        else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
        else if (ev.key === 'Home') j = 0;
        else if (ev.key === 'End') j = tabs.length - 1;
        if (j !== null) { ev.preventDefault(); activate(j, true); }
      });
    });
  })();

  /* --- Шторка «чертёж → металл» (партнёрская страница) ----------------------
     Ползунок двигает clipPath правой половины: обе половины — одна геометрия,
     поэтому стык всегда идеальный. Клавиатура работает штатно: это input. */

  (function ramaWipe() {
    var range = $('#rama-range');
    var clip = $('#rama-clip-rect');
    var seam = $('#rama-seam');
    var grip = $('#rama-grip');
    var stage = range && range.closest('.rama__stage');
    if (!range || !clip || !stage) return;

    var W = 1000;
    var apply = function (pct) {
      var x = (pct / 100) * W;
      clip.setAttribute('x', x);
      clip.setAttribute('width', W - x);
      if (seam) { seam.setAttribute('x1', x); seam.setAttribute('x2', x); }
      if (grip) grip.style.left = pct + '%';
    };

    range.addEventListener('input', function () { apply(+range.value); });

    // перетаскивание и тап по сцене: ползунок растянут на всю сцену,
    // поэтому достаточно пересчитать позицию курсора в проценты
    var setFromEvent = function (clientX) {
      var r = stage.getBoundingClientRect();
      var pct = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
      range.value = Math.round(pct);
      apply(pct);
    };
    var dragging = false;
    stage.addEventListener('pointerdown', function (ev) {
      dragging = true;
      stage.setPointerCapture && stage.setPointerCapture(ev.pointerId);
      setFromEvent(ev.clientX);
    });
    stage.addEventListener('pointermove', function (ev) { if (dragging) setFromEvent(ev.clientX); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (t) {
      stage.addEventListener(t, function () { dragging = false; });
    });

    apply(+range.value);

    // первый показ: короткий проезд шторки, чтобы приём был очевиден
    if (!reduced && 'IntersectionObserver' in window) {
      var shown = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting || shown) return;
          shown = true;
          io.disconnect();
          var t0 = null;
          var from = 88, to = 50, DUR = 1100;
          var frame = function (t) {
            if (!t0) t0 = t;
            var p = Math.min((t - t0) / DUR, 1);
            var ease = 1 - Math.pow(1 - p, 3);
            var v = from + (to - from) * ease;
            range.value = Math.round(v);
            apply(v);
            if (p < 1) requestAnimationFrame(frame);
          };
          requestAnimationFrame(frame);
        });
      }, { threshold: 0.35 });
      io.observe(stage);
    }
  })();

  /* --- Форматы сотрудничества: табы «кто что делает» ------------------------ */

  (function splitTabs() {
    var tabs = $$('[data-split-tab]');
    if (!tabs.length) return;
    var panels = tabs.map(function (t) {
      return document.getElementById(t.getAttribute('aria-controls'));
    });
    var activate = function (i, focus) {
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p, k) {
        if (!p) return;
        p.classList.toggle('is-active', k === i);
        if (k === i) p.removeAttribute('hidden');
        else p.setAttribute('hidden', '');
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { activate(i); });
      t.addEventListener('keydown', function (ev) {
        var j = null;
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') j = (i + 1) % tabs.length;
        else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
        else if (ev.key === 'Home') j = 0;
        else if (ev.key === 'End') j = tabs.length - 1;
        if (j !== null) { ev.preventDefault(); activate(j, true); }
      });
    });
  })();

  /* --- Полоса ответственности: подсветка зоны завода или партнёра ---------- */

  (function laneKeys() {
    var keys = $$('[data-lane-key]');
    if (!keys.length) return;
    var lane = keys[0].closest('.lane');
    keys.forEach(function (b) {
      b.addEventListener('click', function () {
        var mode = b.getAttribute('data-lane-key');
        keys.forEach(function (k) {
          var on = k === b;
          k.classList.toggle('is-active', on);
          k.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        lane.classList.toggle('is-factory', mode === 'factory');
        lane.classList.toggle('is-partner', mode === 'partner');
      });
    });

    var view = $('.lane__viewport', lane);
    var scroll = $('.lane__scroll', lane);
    if (!view || !scroll) return;
    var sync = function () {
      var more = scroll.scrollWidth > scroll.clientWidth + 2 &&
        scroll.scrollLeft + scroll.clientWidth < scroll.scrollWidth - 8;
      view.classList.toggle('has-more', more);
    };
    scroll.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  })();

  /* --- Окупаемость: свой склад против элеватора ----------------------------
     Все деньги считаются по цифрам, которые вводит сам фермер: тарифы у каждого
     ХПП свои, поэтому «средних по рынку» здесь нет. Расчёт за сезон:
     хранение + разовые услуги приёмки + недополученное на осенней цене. */

  (function payback() {
    var form = $('#pay-form');
    var out = $('#pay-total');
    if (!form || !out) return;

    var get = function (id) {
      var el = $('[data-pay="' + id + '"]', form);
      var v = el ? parseFloat(el.value) : 0;
      return isNaN(v) || v < 0 ? 0 : v;
    };
    var money = function (n) { return fmt(n) + ' ₸'; };

    var cta = $('#pay-cta');
    var ctaBase = cta ? cta.getAttribute('href').split('?')[0] : '';
    var ctaText = cta ? decodeURIComponent((cta.getAttribute('href').split('text=')[1] || '')) : '';

    var plural = function (n, one, few, many) {
      var m10 = n % 10, m100 = n % 100;
      if (m10 === 1 && m100 !== 11) return one;
      if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
      return many;
    };

    var compute = function () {
      var tons = get('tons');
      var storage = tons * get('rate') * get('months');
      var intake = tons * get('intake');
      var delta = tons * get('delta');
      var total = storage + intake + delta;

      out.textContent = total > 0 ? money(total) : '—';

      var parts = { storage: storage, intake: intake, delta: delta };
      var max = Math.max(storage, intake, delta, 1);
      Object.keys(parts).forEach(function (k) {
        var row = $('#pay-row-' + k);
        var bar = $('#pay-bar-' + k);
        if (row) row.textContent = money(parts[k]);
        if (bar) bar.style.width = (parts[k] / max) * 100 + '%';
      });

      // окупаемость: во сколько сезонов склад вернёт то, что уходит элеватору
      var price = get('price');
      var pb = $('#pay-payback');
      if (pb) {
        if (price > 0 && total > 0) {
          var years = price / total;
          var shown = years < 10 ? Math.round(years * 10) / 10 : Math.round(years);
          // у дробных в русском всегда родительный падеж: «1,3 сезона», не «1,3 сезон»
          var word = shown % 1 ? 'сезона' : plural(shown, 'сезон', 'сезона', 'сезонов');
          pb.textContent = 'Окупаемость своего склада: ' + String(shown).replace('.', ',') + ' ' + word;
          pb.classList.add('is-strong');
        } else if (price > 0) {
          pb.textContent = 'Заполните тарифы элеватора — посчитаем окупаемость';
          pb.classList.remove('is-strong');
        } else {
          pb.textContent = 'Укажите стоимость склада — посчитаем окупаемость';
          pb.classList.remove('is-strong');
        }
      }

      // цифры уезжают в WhatsApp: менеджер видит, с чем пришёл клиент
      if (cta && total > 0) {
        var rows = [ctaText,
          'Объём: ' + fmt(tons) + ' т',
          'Сезон на элеваторе: ' + money(total),
        ];
        if (price > 0) rows.push('Смета склада: ' + money(price) +
          ' → окупаемость ' + (Math.round((price / total) * 10) / 10).toString().replace('.', ',') + ' сезона');
        rows.push('Прошу смету под мой объём.');
        cta.href = ctaBase + '?text=' + encodeURIComponent(rows.join('\n'));
      }
    };

    form.addEventListener('input', compute);
    // тоннаж из калькулятора длины выше по странице — чтобы не вводить дважды
    var tonsField = $('[data-pay="tons"]', form);
    var grainInput = $('#grain-input');
    if (tonsField && grainInput) {
      grainInput.addEventListener('input', function () {
        if (tonsField.dataset.touched) return;
        var v = parseFloat(grainInput.value);
        if (v > 0) { tonsField.value = Math.round(v); compute(); }
      });
      tonsField.addEventListener('input', function () { tonsField.dataset.touched = '1'; });
    }
    compute();
  })();

  /* --- Живой лист КМД: профили ПСУ / ПС ------------------------------------- */

  (function profiles() {
    var board = $('.prof__board');
    var contour = $('#prof-contour');
    var tabs = $$('.prof__tab');
    var cards = $$('.prof__card');
    var markEl = $('#prof-mark');
    var bar = $('#prof-bar');
    var tLabel = $('#prof-tlabel');
    var tStamp = $('#prof-tstamp');
    var segBtns = $$('.prof__seg-btn');
    if (!board || !contour || !tabs.length) return;

    // Контуры сечений и заводские обозначения. П-профиль не катаем и он не
    // сертифицирован (конструктор, 12.08.2026) — на сайте его нет.
    var PATHS = {
      sigma: 'M300 132 L300 100 L180 100 L180 188 L212 204 L212 236 L180 252 L180 340 L300 340 L300 308',
      c: 'M300 132 L300 100 L180 100 L180 340 L300 340 L300 308'
    };
    var MARKS = { sigma: 'ПСУ', c: 'ПС' };
    var T_STROKE = { '1.5': 6, '2.0': 7.5, '2.5': 9, '3.0': 10.5, '3.5': 12 };
    var T_BAR = { '1.5': 45, '2.0': 58, '2.5': 70, '3.0': 84, '3.5': 100 };

    var draw = function (animate) {
      if (!animate || reduced) {
        contour.style.transition = 'stroke-width .45s cubic-bezier(.2,.7,.3,1)';
        contour.style.strokeDasharray = 'none';
        contour.style.strokeDashoffset = '0';
        return;
      }
      var len = contour.getTotalLength();
      contour.style.transition = 'none';
      contour.style.strokeDasharray = len;
      contour.style.strokeDashoffset = len;
      void contour.getBoundingClientRect();
      requestAnimationFrame(function () {
        contour.style.transition = 'stroke-width .45s cubic-bezier(.2,.7,.3,1), stroke-dashoffset .9s ease';
        contour.style.strokeDashoffset = '0';
      });
      // страховка: контур станет видимым, даже если rAF придушен (фон-вкладка)
      setTimeout(function () { contour.style.strokeDashoffset = '0'; }, 1000);
    };

    var applyThickness = function (t) {
      contour.style.strokeWidth = T_STROKE[t] + 'px';
      if (bar) bar.style.width = T_BAR[t] + '%';
      var txt = 't ' + t.replace('.', ',');
      if (tLabel) tLabel.textContent = txt;
      if (tStamp) tStamp.textContent = txt;
      segBtns.forEach(function (b) {
        var on = b.getAttribute('data-t') === t;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
    };

    var selectProfile = function (key, animate) {
      contour.setAttribute('d', PATHS[key]);
      board.setAttribute('data-prof', key);
      board.classList.remove('is-drawn');
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-prof') === key;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      cards.forEach(function (c) {
        var on = c.getAttribute('data-prof') === key;
        c.classList.toggle('is-active', on);
        c.hidden = !on;
      });
      if (markEl) markEl.textContent = MARKS[key];
      draw(animate);
      if (reduced) { board.classList.add('is-drawn'); }
      else { setTimeout(function () { board.classList.add('is-drawn'); }, 60); }
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectProfile(tab.getAttribute('data-prof'), true); });
      tab.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        var dir = e.key === 'ArrowRight' ? 1 : -1;
        var next = tabs[(i + dir + tabs.length) % tabs.length];
        next.focus();
        selectProfile(next.getAttribute('data-prof'), true);
      });
    });
    segBtns.forEach(function (b) {
      b.addEventListener('click', function () { applyThickness(b.getAttribute('data-t')); });
    });

    applyThickness('3.5');
    selectProfile('sigma', false);

    if (!reduced && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (e.isIntersecting) { draw(true); io.disconnect(); }
        });
      }, { threshold: 0.3 });
      io.observe(board);
    }
  })();

  /* --- Квиз «Расчёт за 24 часа» ---------------------------------------------- */

  (function calcForm() {
    var form = $('#calc-form');
    if (!form) return;

    var wa = form.getAttribute('data-wa');
    var email = form.getAttribute('data-email');
    var siteName = form.getAttribute('data-site') || 'Steppe Steel';

    var steps = $$('.calc__step', form);
    var thumb = $('#calc-thumb');
    var stepLabel = $('#calc-step-label');
    var btnBack = $('#calc-back');
    var btnNext = $('#calc-next');
    var btnSubmit = $('#calc-submit');
    var hint = $('#calc-hint');
    var errorEl = $('#calc-error');
    var sizesBlock = $('#calc-sizes');
    var phoneInput = $('#calc-phone');
    var stamp = $('#form-stamp');
    var success = $('#calc-success');
    var retryLink = $('#calc-retry');

    var LABELS = {
      1: 'ШАГ 1 ИЗ 3 · ТИП ЗДАНИЯ',
      2: 'ШАГ 2 ИЗ 3 · РАЗМЕРЫ И МЕСТО',
      3: 'ШАГ 3 ИЗ 3 · КОНТАКТЫ'
    };
    var step = 1;
    var preset = null;
    var cooldown = false;
    var stampTimer = null;

    var render = function () {
      steps.forEach(function (s) {
        s.classList.toggle('is-active', Number(s.getAttribute('data-step')) === step);
      });
      if (thumb) thumb.style.left = (step / 3) * 100 + '%';
      if (stepLabel) stepLabel.textContent = LABELS[step];
      btnBack.hidden = step === 1;
      btnNext.hidden = step === 3;
      btnSubmit.hidden = step !== 3;
      if (hint) hint.hidden = step !== 3;
      var idx = btnNext.querySelector('.btn__index');
      if (idx) idx.textContent = (step + 1) + ' / 3';
    };

    var goToStep = function (n) {
      step = Math.min(3, Math.max(1, n));
      render();
    };

    btnNext.addEventListener('click', function () { goToStep(step + 1); });
    btnBack.addEventListener('click', function () { goToStep(step - 1); });

    var activatePreset = function (btn) {
      $$('.calc__preset', form).forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      if (btn.hasAttribute('data-custom')) {
        preset = { custom: true };
        sizesBlock.hidden = false;
      } else {
        preset = { w: Number(btn.getAttribute('data-w')), l: Number(btn.getAttribute('data-l')), custom: false };
        sizesBlock.hidden = true;
      }
    };
    $$('.calc__preset', form).forEach(function (btn) {
      btn.addEventListener('click', function () { activatePreset(btn); });
    });

    var clearPhoneError = function () {
      errorEl.hidden = true;
      phoneInput.removeAttribute('aria-invalid');
    };

    // маска: +7 (XXX) XXX-XX-XX; «8…» и «7…» нормализуются
    phoneInput.addEventListener('input', function () {
      var d = phoneInput.value.replace(/\D/g, '');
      if (!d) { phoneInput.value = ''; clearPhoneError(); return; }
      if (d[0] === '8') d = d.slice(1);
      if (d.length >= 11 && d[0] === '7') d = d.slice(1);
      d = d.slice(0, 10);
      var out = '+7';
      if (d.length) out += ' (' + d.slice(0, 3);
      if (d.length >= 4) out += ') ' + d.slice(3, 6);
      if (d.length >= 7) out += '-' + d.slice(6, 8);
      if (d.length >= 9) out += '-' + d.slice(8, 10);
      phoneInput.value = out;
      if (d.length === 10) clearPhoneError();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Enter на шагах 1–2 работает как «Далее»
      if (step !== 3) { goToStep(step + 1); return; }
      if (cooldown) return;

      var data = new FormData(form);
      // Honeypot: боты заполняют скрытое поле
      if ((data.get('website') || '').toString().trim()) return;

      var digits = phoneInput.value.replace(/\D/g, '');
      if (digits.length < 11) {
        errorEl.hidden = false;
        phoneInput.setAttribute('aria-invalid', 'true');
        phoneInput.focus();
        return;
      }
      clearPhoneError();

      var get = function (name) { return (data.get(name) || '').toString().trim(); };

      var sizeText = '';
      if (preset && preset.custom) {
        var l = get('length'), w = get('width');
        sizeText = (l && w) ? w + '×' + l + ' м' : 'свой размер (уточню с инженером)';
      } else if (preset) {
        sizeText = preset.w + '×' + preset.l + ' м';
      }

      var type = get('type');
      var rows = ['Здравствуйте! Хочу рассчитать стоимость.'];
      rows.push('Тип здания: ' + type);
      if (sizeText) rows.push('Размеры: ' + sizeText);
      if (get('location')) rows.push('Место строительства: ' + get('location'));
      if (type === 'Зернохранилище' && grainState.touched && grainState.tons && grainState.length) {
        rows.push('Зерно: ' + fmt(grainState.tons) + ' т' + (grainState.crop ? ' (' + grainState.crop + ')' : '') + ' → длина ангара ≈ ' + fmt(grainState.length) + ' м');
      }
      if (data.get('harvest')) rows.push('Срок: нужно к уборочной');
      var name = get('name');
      rows.push((name ? 'Меня зовут: ' + name + '. ' : '') + 'Телефон: ' + phoneInput.value);

      var url = wa + '?text=' + encodeURIComponent(rows.join('\n'));

      cooldown = true;
      setTimeout(function () { cooldown = false; }, 1500);

      openWa(url);
      if (success) {
        success.hidden = false;
        if (retryLink) retryLink.href = url;
        var mailLink = $('#calc-mail');
        if (mailLink && email) {
          mailLink.href = 'mailto:' + email
            + '?subject=' + encodeURIComponent('Заявка на расчёт — ' + type)
            + '&body=' + encodeURIComponent(rows.join('\n'));
        }
        // текст заявки виден и копируется — на случай, если WhatsApp не открылся
        var msgEl = $('#calc-message');
        if (msgEl) msgEl.textContent = rows.join('\n');
        var copyBtn = $('#calc-copy');
        if (copyBtn && !copyBtn.dataset.bound) {
          copyBtn.dataset.bound = '1';
          copyBtn.addEventListener('click', function () {
            var text = msgEl ? msgEl.textContent : '';
            var done = function () {
              copyBtn.textContent = 'Скопировано ✓';
              setTimeout(function () { copyBtn.textContent = 'Скопировать текст'; }, 2000);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(text).then(done, function () {});
            } else if (msgEl) {
              var range = document.createRange();
              range.selectNodeContents(msgEl);
              var sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
              try { document.execCommand('copy'); done(); } catch (e) {}
            }
          });
        }
      }
      if (!reduced && stamp) {
        if (stampTimer) clearTimeout(stampTimer);
        stamp.classList.remove('is-stamped');
        void stamp.getBoundingClientRect();
        stamp.classList.add('is-stamped');
        stampTimer = setTimeout(function () { stamp.classList.remove('is-stamped'); }, 2000);
      }

      if (window.ym) try { window.ym(window.__ymId, 'reachGoal', 'calc_submit'); } catch (err) {}
      if (window.gtag) try { window.gtag('event', 'generate_lead'); } catch (err) {}
    });

    // Предвыбор типа из ссылки /zayavka/?type=grain(&tons=&crop=&len=)
    var params = new URLSearchParams(location.search);
    var wanted = params.get('type');
    if (wanted) {
      var radio = form.querySelector('input[name="type"][data-key="' + wanted + '"]');
      if (radio) radio.checked = true;
      if (wanted === 'grain') {
        // расчёт из калькулятора главной доезжает до заявки
        var tons = parseInt(params.get('tons') || '', 10);
        var len = parseInt(params.get('len') || '', 10);
        var crop = params.get('crop') || '';
        if (tons && len) {
          grainState.tons = tons;
          grainState.length = len;
          grainState.crop = crop || null;
          grainState.touched = true;
          var note = $('#calc-grain-note');
          if (note) {
            note.hidden = false;
            note.textContent = 'Ваш объём: ' + fmt(tons) + ' т' + (crop ? ' (' + crop + ')' : '') +
              ' → длина ангара ≈ ' + fmt(len) + ' м';
          }
        }
        // пресет по рассчитанной длине: до 75 м — 24×60, дальше — 24×90
        var chip = len > 75
          ? form.querySelector('.calc__preset[data-w="24"][data-l="90"]')
          : form.querySelector('.calc__preset[data-w="24"][data-l="60"]');
        if (chip) activatePreset(chip);
      }
    }

    render();
  })();
})();
