(function () {
  'use strict';
  if (window.__supportWidgetLoaded) return;
  window.__supportWidgetLoaded = true;

  // ---- Global config (optional). Attribute config overrides this. ----
  var GLOBAL = window.SUPPORT_WIDGET_CONFIG || {};

  var DEFAULTS = {
    mode: 'auto',              // 'auto' | 'inline' | 'float'
    title: 'Support',
    message: 'If this saves you time or sparks creativity, consider buying me a coffee. It helps keep this tool free and open for everyone.',
    footer: '💛 100% of donations go to supporting development',
    badge: '❤️ open source',
    chimeTag: '$johndoe',
    theme: 'dark',
    accent: '#f59e0b',
    coffee:    'https://www.buymeacoffee.com/yourname',
    cashapp:   'https://cash.app/$yourname',
    venmo:     'https://venmo.com/yourname',
    paypal:    'https://www.paypal.me/yourname',
    liberapay: 'https://liberapay.com/yourname',
    showChime: true,
    showCashApp: true,
    showVenmo: true,
    showPayPal: true,
    showLiberapay: true,
    credit: null               // e.g. { label: 'Widget by X', href: 'https://...' }
  };

  var CSS = `
    support-widget, .sw-root {
      display: block;
      background: linear-gradient(135deg, rgba(120,53,15,.25), rgba(146,64,14,.12));
      border: 1px solid rgba(180,83,9,.35);
      border-radius: 12px;
      padding: 16px;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
      box-sizing: border-box;
    }
    support-widget *, .sw-root * { box-sizing: border-box; }

    .sw-head { display:flex; align-items:center; gap:8px; color:#fcd34d; font-weight:600; font-size:12px; }
    .sw-coffee { font-size:18px; display:inline-block; animation: swSteam 2s ease-in-out infinite; }
    @keyframes swSteam {
      0%,100% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(-5deg) scale(1.1); }
    }
    @media (prefers-reduced-motion: reduce) {
      .sw-coffee { animation: none; }
    }
    .sw-badge {
      margin-left:auto; font-size:9px; font-weight:400;
      color: rgba(251,191,36,.7); background: rgba(251,191,36,.1);
      padding:2px 8px; border-radius:9999px;
    }
    .sw-desc { font-size:10px; color:#94a3b8; line-height:1.6; margin:12px 0; }
    .sw-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
    .sw-full { grid-column: 1 / -1; }

    .sw-btn {
      display:flex; align-items:center; justify-content:center;
      gap:6px; text-decoration:none; cursor:pointer;
      border-radius:8px; padding:8px 12px;
      font-size:9px; font-weight:500;
      transition: all .2s; border:none;
    }
    .sw-btn:hover { transform: scale(1.03); }
    .sw-btn:active { transform: scale(.95); }

    .sw-main {
      width:100%; padding:10px 16px; font-size:12px; font-weight:600;
      color:#fff; background: linear-gradient(135deg, #f59e0b, #d97706);
      box-shadow: 0 4px 14px rgba(245,158,11,.25);
    }
    .sw-main:hover { transform: scale(1.02); box-shadow: 0 0 30px rgba(245,158,11,.35); }
    .sw-main:active { transform: scale(.97); }

    .sw-paypal    { background:#0070ba; color:#fff; }
    .sw-paypal:hover    { background:#0085dd; box-shadow:0 0 25px rgba(0,112,186,.3); }
    .sw-liberapay { background:#f6c915; color:#1a1a1a; font-weight:700; }
    .sw-liberapay:hover { background:#ffd83a; box-shadow:0 0 25px rgba(246,201,21,.35); }
    .sw-venmo     { background:#008CFF; color:#fff; }
    .sw-venmo:hover     { background:#1a9aff; box-shadow:0 0 25px rgba(0,140,255,.3); }
    .sw-cashapp   { background:#00d632; color:#000; font-weight:700; }
    .sw-cashapp:hover   { background:#00e63a; box-shadow:0 0 25px rgba(0,214,50,.3); }
    .sw-chime     { background:#0066ff; color:#fff; }
    .sw-chime:hover     { background:#1a75ff; box-shadow:0 0 25px rgba(0,102,255,.3); }

    .sw-tag {
      display:none; margin-top:8px;
      background: rgba(30,41,59,.6); padding:8px;
      border-radius:8px; border:1px solid rgba(59,130,246,.3);
      text-align:center;
    }
    .sw-tag.show { display:block; }
    .sw-tag .lbl { font-size:9px; color:#94a3b8; }
    .sw-tag .val {
      font-size:10px; font-family: ui-monospace, monospace;
      color:#93c5fd; font-weight:600; user-select:all;
    }
    .sw-tag .hint { font-size:8px; color:#64748b; margin-left:8px; }

    .sw-foot {
      font-size:8px; color:#64748b; text-align:center;
      padding-top:8px; margin-top:12px;
      border-top:1px solid rgba(30,41,59,.6);
    }
    .sw-credit { font-size:8px; color:#475569; text-align:center; margin-top:6px; }
    .sw-credit a { color:#64748b; text-decoration:none; }
    .sw-credit a:hover { color:#94a3b8; }

    /* Floating button + popover */
    .sw-float {
      position: fixed; bottom: 20px; right: 20px;
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border: none; cursor: pointer; z-index: 2147483646;
      box-shadow: 0 6px 20px rgba(245,158,11,.4);
      font-size: 26px; line-height: 1;
      display: flex; align-items: center; justify-content: center;
      transition: transform .15s ease;
    }
    .sw-float:hover { transform: scale(1.08); }
    .sw-float:active { transform: scale(.94); }
    .sw-float.left { right: auto; left: 20px; }

    .sw-pop {
      position: fixed; bottom: 88px; right: 20px;
      width: 320px; max-width: calc(100vw - 40px);
      background: #0f172a;
      border: 1px solid rgba(180,83,9,.35);
      border-radius: 14px;
      padding: 16px;
      z-index: 2147483647;
      box-shadow: 0 16px 48px rgba(0,0,0,.6);
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      box-sizing: border-box;
      display: none;
      animation: swPop .2s ease-out;
    }
    .sw-pop.left { right: auto; left: 20px; }
    .sw-pop.open { display: block; }
    @keyframes swPop {
      0% { opacity: 0; transform: translateY(12px) scale(.97); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    .sw-toast {
      position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
      background: #1e293b; color: #fff; padding: 12px 24px;
      border-radius: 12px; font-size: 14px; z-index: 2147483647;
      box-shadow: 0 12px 40px rgba(0,0,0,.5);
      border: 1px solid #334155; font-family: system-ui, sans-serif;
      animation: swFade .25s ease-out;
    }
    @keyframes swFade {
      0% { opacity: 0; transform: translate(-50%, 20px); }
      100% { opacity: 1; transform: translate(-50%, 0); }
    }

    /* Light theme */
    .sw-light, .sw-light.sw-root {
      background: linear-gradient(135deg, #fff7ed, #ffedd5);
      border-color: rgba(180,83,9,.25);
      color: #1e293b;
    }
    .sw-light .sw-desc { color:#475569; }
    .sw-light .sw-foot { color:#64748b; border-top-color: rgba(148,163,184,.3); }
    .sw-light .sw-tag  { background:#f1f5f9; border-color: rgba(59,130,246,.25); }
    .sw-light .sw-tag .val { color:#1d4ed8; }
  `;

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  function readAttrs(el) {
    var o = {};
    var map = ['mode','title','message','footer','badge','chimeTag','theme','accent',
               'coffee','cashapp','venmo','paypal','liberapay','position'];
    map.forEach(function (k) {
      if (el.hasAttribute(k)) o[k] = el.getAttribute(k);
    });
    ['showChime','showCashApp','showVenmo','showPayPal','showLiberapay'].forEach(function (k) {
      if (el.hasAttribute(k)) {
        var v = el.getAttribute(k);
        o[k] = v !== 'false' && v !== '0';
      }
    });
    return o;
  }

  function buildCard(cfg) {
    var showChime = cfg.showChime && cfg.chimeTag;
    return '' +
      '<div class="sw-head">' +
        '<span class="sw-coffee">☕</span>' +
        '<span>' + esc(cfg.title) + '</span>' +
        '<span class="sw-badge">' + esc(cfg.badge) + '</span>' +
      '</div>' +
      '<p class="sw-desc">' + esc(cfg.message) + '</p>' +
      '<div class="sw-grid">' +
        '<a class="sw-btn sw-main sw-full" href="' + esc(cfg.coffee) + '" target="_blank" rel="noopener noreferrer">' +
          '<span>☕</span> Buy me a coffee' +
        '</a>' +
        (cfg.showCashApp   ? btn('sw-cashapp','💰','Cash App',   cfg.cashapp)   : '') +
        (cfg.showVenmo     ? btn('sw-venmo','💳','Venmo',       cfg.venmo)     : '') +
        (cfg.showPayPal    ? btn('sw-paypal','🅿️','PayPal',     cfg.paypal)    : '') +
        (cfg.showLiberapay ? btn('sw-liberapay','💛','Liberapay', cfg.liberapay) : '') +
        (showChime         ? '<a class="sw-btn sw-chime sw-chime-btn" href="#" role="button"><span>🏦</span> Chime</a>' : '') +
      '</div>' +
      (showChime
        ? '<div class="sw-tag sw-chime-tag" aria-live="polite">' +
            '<span class="lbl">Chime Tag:</span> ' +
            '<span class="val">' + esc(cfg.chimeTag) + '</span>' +
            '<span class="hint">(click to copy)</span>' +
          '</div>'
        : '') +
      '<div class="sw-foot">' + esc(cfg.footer) + '</div>' +
      (cfg.credit
        ? '<div class="sw-credit"><a href="' + esc(cfg.credit.href) + '" target="_blank" rel="noopener noreferrer">' + esc(cfg.credit.label) + '</a></div>'
        : '');
  }

  function btn(cls, icon, label, href) {
    if (!href) return '';
    return '<a class="sw-btn ' + cls + '" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' +
           '<span>' + icon + '</span> ' + label + '</a>';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function showToast(msg) {
    var old = document.querySelector('.sw-toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.className = 'sw-toast';
    t.setAttribute('role','status');
    t.setAttribute('aria-live','polite');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2500);
  }

  function copyChime(tag, scope) {
    var done = function () { showToast('📋 Chime tag copied: ' + tag); };
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = tag; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); }
      catch (e) { showToast('📋 Chime tag: ' + tag); }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(tag).then(done).catch(fallback);
    } else { fallback(); }

    var box = (scope || document).querySelector('.sw-chime-tag');
    if (box) {
      box.classList.add('show');
      clearTimeout(window.__swChimeT);
      window.__swChimeT = setTimeout(function () { box.classList.remove('show'); }, 8000);
    }
  }

  function wireChime(cfg, scope) {
    var btnEl = scope.querySelector('.sw-chime-btn');
    if (btnEl) btnEl.addEventListener('click', function (e) {
      e.preventDefault();
      copyChime(cfg.chimeTag, scope);
    });
    var valEl = scope.querySelector('.sw-chime-tag .val');
    if (valEl) valEl.addEventListener('click', function () {
      copyChime(cfg.chimeTag, scope);
    });
  }

  function applyTheme(el, cfg) {
    if (cfg.theme === 'light') el.classList.add('sw-light');
    if (cfg.accent) el.style.setProperty('--sw-accent', cfg.accent);
  }

  // ---------- Custom element ----------
  var SupportWidget = function () {};
  SupportWidget.prototype = Object.create(HTMLElement.prototype);
  SupportWidget.prototype.constructor = SupportWidget;

  SupportWidget.prototype.connectedCallback = SupportWidget.prototype.attachedCallback = function () {
    var attrs = readAttrs(this);
    var cfg = Object.assign({}, DEFAULTS, GLOBAL, attrs);
    var mode = cfg.mode;
    var root = this;

    // If used as an inline container, just render inside.
    if (mode === 'inline' || (mode === 'auto' && root.hasAttribute('inline'))) {
      root.className = 'sw-root' + (cfg.theme === 'light' ? ' sw-light' : '');
      root.innerHTML = buildCard(cfg);
      applyTheme(root, cfg);
      wireChime(cfg, root);
      return;
    }

    // Floating mode: hide the host element, spawn button + popover.
    root.style.display = 'none';
    if (mode === 'auto' || mode === 'float') mountFloating(cfg);
  };

  function mountFloating(cfg) {
    if (document.querySelector('.sw-float')) return;

    var btn = document.createElement('button');
    btn.className = 'sw-float' + (cfg.position === 'bottom-left' ? ' left' : '');
    btn.setAttribute('aria-label', cfg.title);
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '☕';

    var pop = document.createElement('div');
    pop.className = 'sw-pop' + (cfg.position === 'bottom-left' ? ' left' : '') + (cfg.theme === 'light' ? ' sw-light' : '');
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-modal', 'false');
    pop.setAttribute('aria-label', cfg.title);
    pop.innerHTML = buildCard(cfg);

    document.body.appendChild(btn);
    document.body.appendChild(pop);

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = pop.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        var first = pop.querySelector('a,button');
        if (first) first.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!pop.classList.contains('open')) return;
      if (pop.contains(e.target) || btn.contains(e.target)) return;
      pop.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && pop.classList.contains('open')) {
        pop.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });

    wireChime(cfg, pop);
  }

  // Register (both modern and legacy signatures)
  try {
    if (window.customElements && customElements.define) {
      customElements.define('support-widget', SupportWidget);
    } else {
      document.registerElement && document.registerElement('support-widget', { prototype: SupportWidget.prototype });
    }
  } catch (e) { /* already defined */ }

  // Auto-mount fallback: if someone used #support-widget or #support-float in plain HTML
  function autoMount() {
    var inline = document.getElementById('support-widget');
    if (inline && !inline.tagName.toLowerCase().startsWith('support-')) {
      var cfg = Object.assign({}, DEFAULTS, GLOBAL, { mode: 'inline' });
      inline.classList.add('sw-root');
      inline.innerHTML = buildCard(cfg);
      applyTheme(inline, cfg);
      wireChime(cfg, inline);
      return;
    }
    var floatHost = document.getElementById('support-float');
    if (floatHost) {
      var cfg2 = Object.assign({}, DEFAULTS, GLOBAL, { mode: 'float' });
      mountFloating(cfg2);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMount);
  } else { autoMount(); }
})();
