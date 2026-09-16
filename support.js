(function () {
  'use strict';
  if (window.__supportWidgetLoaded) return;
  window.__supportWidgetLoaded = true;

  var GLOBAL = window.SUPPORT_WIDGET_CONFIG || {};

  // ---------- i18n ----------
  var I18N = {
    en: { title:'Support', message:'If this saves you time or sparks creativity, consider buying me a coffee. It helps keep this tool free and open for everyone.', footer:'💛 100% of donations go to supporting development', badge:'❤️ open source', coffee:'Buy me a coffee', cashapp:'Cash App', venmo:'Venmo', paypal:'PayPal', liberapay:'Liberapay', kofi:'Ko-fi', patreon:'Patreon', github:'GitHub Sponsors', stripe:'Stripe', bitcoin:'Bitcoin', lightning:'Lightning', chime:'Chime', chimeLbl:'Chime Tag:', clickCopy:'(click to copy)', copied:'📋 Copied: ', dismiss:'Hide', close:'Close' },
    es: { title:'Apoyar', message:'Si esto te ahorra tiempo o inspira creatividad, considera invitarme un café. Ayuda a mantener esta herramienta gratuita y abierta para todos.', footer:'💛 El 100% de las donaciones apoya el desarrollo', badge:'❤️ código abierto', coffee:'Invítame un café', cashapp:'Cash App', venmo:'Venmo', paypal:'PayPal', liberapay:'Liberapay', kofi:'Ko-fi', patreon:'Patreon', github:'GitHub Sponsors', stripe:'Stripe', bitcoin:'Bitcoin', lightning:'Lightning', chime:'Chime', chimeLbl:'Etiqueta Chime:', clickCopy:'(clic para copiar)', copied:'📋 Copiado: ', dismiss:'Ocultar', close:'Cerrar' },
    fr: { title:'Soutenir', message:'Si cela vous fait gagner du temps ou inspire votre créativité, offrez-moi un café. Cela aide à garder cet outil gratuit et ouvert à tous.', footer:'💛 100% des dons soutiennent le développement', badge:'❤️ open source', coffee:'Offrez-moi un café', cashapp:'Cash App', venmo:'Venmo', paypal:'PayPal', liberapay:'Liberapay', kofi:'Ko-fi', patreon:'Patreon', github:'GitHub Sponsors', stripe:'Stripe', bitcoin:'Bitcoin', lightning:'Lightning', chime:'Chime', chimeLbl:'Tag Chime :', clickCopy:'(cliquez pour copier)', copied:'📋 Copié : ', dismiss:'Masquer', close:'Fermer' },
    de: { title:'Unterstützen', message:'Wenn dir das Zeit spart oder Kreativität weckt, spendiere mir einen Kaffee. Es hilft, dieses Tool kostenlos und offen zu halten.', footer:'💛 100% der Spenden unterstützen die Entwicklung', badge:'❤️ Open Source', coffee:'Kaffee spendieren', cashapp:'Cash App', venmo:'Venmo', paypal:'PayPal', liberapay:'Liberapay', kofi:'Ko-fi', patreon:'Patreon', github:'GitHub Sponsors', stripe:'Stripe', bitcoin:'Bitcoin', lightning:'Lightning', chime:'Chime', chimeLbl:'Chime-Tag:', clickCopy:'(zum Kopieren klicken)', copied:'📋 Kopiert: ', dismiss:'Ausblenden', close:'Schließen' },
    pt: { title:'Apoiar', message:'Se isto economiza seu tempo ou inspira criatividade, considere me pagar um café. Ajuda a manter esta ferramenta gratuita e aberta para todos.', footer:'💛 100% das doações apoiam o desenvolvimento', badge:'❤️ código aberto', coffee:'Pague-me um café', cashapp:'Cash App', venmo:'Venmo', paypal:'PayPal', liberapay:'Liberapay', kofi:'Ko-fi', patreon:'Patreon', github:'GitHub Sponsors', stripe:'Stripe', bitcoin:'Bitcoin', lightning:'Lightning', chime:'Chime', chimeLbl:'Tag Chime:', clickCopy:'(clique para copiar)', copied:'📋 Copiado: ', dismiss:'Ocultar', close:'Fechar' }
  };

  function pickLang(tag) {
    if (!tag) return 'en';
    var base = String(tag).toLowerCase().split('-')[0];
    return I18N[base] ? base : 'en';
  }

  // ---------- Defaults ----------
  var DEFAULTS = {
    mode: 'auto',
    lang: null,             // null = auto-detect from <html lang> or navigator.language
    theme: 'auto',          // 'dark' | 'light' | 'auto'
    position: 'bottom-right',
    accent: null,           // e.g. '#6366f1'

    methods: ['coffee','cashapp','venmo','paypal','liberapay','chime'],

    coffee:    'https://www.buymeacoffee.com/yourname',
    cashapp:   'https://cash.app/$yourname',
    venmo:     'https://venmo.com/yourname',
    paypal:    'https://www.paypal.me/yourname',
    liberapay: 'https://liberapay.com/yourname',
    kofi:      'https://ko-fi.com/yourname',
    patreon:   'https://patreon.com/yourname',
    github:    'https://github.com/sponsors/yourname',
    stripe:    'https://buy.stripe.com/yourname',
    bitcoin:   'bitcoin:bc1qexampleaddress',
    lightning: 'lightning:example@lnurl',

    chimeTag: '$johndoe',

    // Behavior
    delay: 0,               // ms before showing (float only)
    scrollTrigger: 0,       // 0..100 percent scrolled (float only)
    hideOnMobile: false,
    dismissible: false,
    showOnce: 0,            // 0 = never remember; >0 = hide for N days after dismiss
    excludePaths: [],       // e.g. ['/checkout','/admin']

    // Optional
    credit: null,           // { label, href }
    footer: null,           // overrides i18n footer
    message: null,          // overrides i18n message
    title: null,            // overrides i18n title
    badge: null             // overrides i18n badge
  };

  // ---------- Styles ----------
  var CSS = `
    support-widget, .sw-root {
      display:block;
      background: linear-gradient(135deg, rgba(120,53,15,.25), rgba(146,64,14,.12));
      border: 1px solid rgba(180,83,9,.35);
      border-radius: 12px; padding: 16px;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color:#e2e8f0; box-sizing:border-box;
    }
    support-widget *, .sw-root * { box-sizing:border-box; }

    .sw-head { display:flex; align-items:center; gap:8px; color:#fcd34d; font-weight:600; font-size:12px; }
    .sw-coffee { font-size:18px; display:inline-block; animation: swSteam 2s ease-in-out infinite; }
    @keyframes swSteam {
      0%,100% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(-5deg) scale(1.1); }
    }
    @media (prefers-reduced-motion: reduce) { .sw-coffee { animation:none; } }

    .sw-badge {
      margin-left:auto; font-size:9px; font-weight:400;
      color: rgba(251,191,36,.7); background: rgba(251,191,36,.1);
      padding:2px 8px; border-radius:9999px;
    }
    .sw-desc { font-size:10px; color:#94a3b8; line-height:1.6; margin:12px 0; }
    .sw-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
    .sw-full { grid-column:1 / -1; }

    .sw-btn {
      display:flex; align-items:center; justify-content:center;
      gap:6px; text-decoration:none; cursor:pointer;
      border-radius:8px; padding:8px 12px;
      font-size:9px; font-weight:500;
      transition: all .2s; border:none;
      color:#fff; background: #1e293b;
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
    .sw-kofi      { background:#ff5e5b; color:#fff; }
    .sw-kofi:hover      { background:#ff7573; box-shadow:0 0 25px rgba(255,94,91,.35); }
    .sw-patreon   { background:#f96854; color:#fff; }
    .sw-patreon:hover   { background:#ff7a67; box-shadow:0 0 25px rgba(249,104,84,.35); }
    .sw-github    { background:#24292e; color:#fff; }
    .sw-github:hover    { background:#30363d; box-shadow:0 0 25px rgba(36,41,46,.4); }
    .sw-stripe    { background:#635bff; color:#fff; }
    .sw-stripe:hover    { background:#7a73ff; box-shadow:0 0 25px rgba(99,91,255,.35); }
    .sw-bitcoin   { background:#f7931a; color:#1a1a1a; font-weight:700; }
    .sw-bitcoin:hover   { background:#ffa733; box-shadow:0 0 25px rgba(247,147,26,.35); }
    .sw-lightning { background:#792dea; color:#fff; }
    .sw-lightning:hover { background:#8b46f0; box-shadow:0 0 25px rgba(121,45,234,.35); }

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
      color:#93c5fd; font-weight:600; user-select:all; cursor:pointer;
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

    .sw-dismiss {
      background:transparent; border:none; cursor:pointer;
      color:#64748b; font-size:10px; padding:4px 6px;
      text-decoration:underline; text-underline-offset:2px;
    }
    .sw-dismiss:hover { color:#94a3b8; }
    .sw-dismiss-wrap { text-align:center; margin-top:8px; }

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
    .sw-float.hidden { display:none; }

    .sw-pop {
      position: fixed; bottom: 88px; right: 20px;
      width: 320px; max-width: calc(100vw - 40px);
      background: #0f172a;
      border: 1px solid rgba(180,83,9,.35);
      border-radius: 14px; padding: 16px;
      z-index: 2147483647;
      box-shadow: 0 16px 48px rgba(0,0,0,.6);
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      box-sizing: border-box; display: none;
      animation: swPop .2s ease-out;
    }
    .sw-pop.left { right: auto; left: 20px; }
    .sw-pop.open { display: block; }
    .sw-pop.hidden { display:none !important; }
    @keyframes swPop {
      0% { opacity:0; transform: translateY(12px) scale(.97); }
      100% { opacity:1; transform: translateY(0) scale(1); }
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
      0% { opacity:0; transform: translate(-50%, 20px); }
      100% { opacity:1; transform: translate(-50%, 0); }
    }

    .sw-light, .sw-light.sw-root {
      background: linear-gradient(135deg, #fff7ed, #ffedd5);
      border-color: rgba(180,83,9,.25);
      color: #1e293b;
    }
    .sw-light .sw-desc { color:#475569; }
    .sw-light .sw-foot { color:#64748b; border-top-color: rgba(148,163,184,.3); }
    .sw-light .sw-tag  { background:#f1f5f9; border-color: rgba(59,130,246,.25); }
    .sw-light .sw-tag .val { color:#1d4ed8; }
    .sw-light .sw-dismiss { color:#64748b; }
    .sw-light .sw-dismiss:hover { color:#334155; }

    @media (max-width: 640px) {
      .sw-hide-mobile .sw-float,
      .sw-hide-mobile .sw-pop { display: none !important; }
    }
  `;

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  // ---------- Utilities ----------
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function pathExcluded(list) {
    var p = location.pathname || '';
    for (var i = 0; i < list.length; i++) {
      var pat = list[i];
      if (!pat) continue;
      if (pat.charAt(0) === '*' && p.indexOf(pat.slice(1)) !== -1) return true;
      if (pat.charAt(pat.length - 1) === '*' && p.indexOf(pat.slice(0, -1)) === 0) return true;
      if (p === pat) return true;
      if (pat.slice(-1) === '/' && p.indexOf(pat) === 0) return true;
    }
    return false;
  }

  function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
  }

  var LS_DISMISS_KEY = 'sw_dismissed_until';

  function isDismissed(showOnce) {
    if (!showOnce) return false;
    try {
      var v = localStorage.getItem(LS_DISMISS_KEY);
      if (!v) return false;
      return parseInt(v, 10) > Date.now();
    } catch (e) { return false; }
  }

  function setDismissed(showOnce) {
    if (!showOnce) return;
    try {
      localStorage.setItem(LS_DISMISS_KEY, String(Date.now() + showOnce * 86400000));
    } catch (e) {}
  }

  // ---------- Rendering ----------
  function methodBtn(cls, icon, label, href) {
    if (!href) return '';
    return '<a class="sw-btn ' + cls + '" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' +
           '<span>' + icon + '</span> ' + label + '</a>';
  }

  function buildCard(cfg, t) {
    var m = cfg.methods || [];
    var has = function (x) { return m.indexOf(x) !== -1; };

    var html = '' +
      '<div class="sw-head">' +
        '<span class="sw-coffee">☕</span>' +
        '<span>' + esc(cfg.title || t.title) + '</span>' +
        '<span class="sw-badge">' + esc(cfg.badge || t.badge) + '</span>' +
      '</div>' +
      '<p class="sw-desc">' + esc(cfg.message || t.message) + '</p>' +
      '<div class="sw-grid">' +
        (has('coffee') ? '<a class="sw-btn sw-main sw-full" href="' + esc(cfg.coffee) + '" target="_blank" rel="noopener noreferrer"><span>☕</span> ' + t.coffee + '</a>' : '');

    if (has('cashapp'))   html += methodBtn('sw-cashapp',  '💰', t.cashapp,   cfg.cashapp);
    if (has('venmo'))     html += methodBtn('sw-venmo',    '💳', t.venmo,     cfg.venmo);
    if (has('paypal'))    html += methodBtn('sw-paypal',   '🅿️', t.paypal,    cfg.paypal);
    if (has('liberapay')) html += methodBtn('sw-liberapay','💛', t.liberapay, cfg.liberapay);
    if (has('kofi'))      html += methodBtn('sw-kofi',     '☕', t.kofi,      cfg.kofi);
    if (has('patreon'))   html += methodBtn('sw-patreon',  '🎗️', t.patreon,   cfg.patreon);
    if (has('github'))    html += methodBtn('sw-github',   '🐙', t.github,    cfg.github);
    if (has('stripe'))    html += methodBtn('sw-stripe',   '💳', t.stripe,    cfg.stripe);
    if (has('bitcoin'))   html += methodBtn('sw-bitcoin',  '₿',  t.bitcoin,   cfg.bitcoin);
    if (has('lightning')) html += methodBtn('sw-lightning','⚡', t.lightning, cfg.lightning);

    if (has('chime') && cfg.chimeTag) {
      html += '<a class="sw-btn sw-chime sw-chime-btn" href="#" role="button"><span>🏦</span> ' + t.chime + '</a>';
    }

    html += '</div>';

    if (has('chime') && cfg.chimeTag) {
      html += '<div class="sw-tag sw-chime-tag" aria-live="polite">' +
                '<span class="lbl">' + esc(t.chimeLbl) + '</span> ' +
                '<span class="val" title="' + esc(t.clickCopy) + '">' + esc(cfg.chimeTag) + '</span>' +
                '<span class="hint">' + esc(t.clickCopy) + '</span>' +
              '</div>';
    }

    html += '<div class="sw-foot">' + esc(cfg.footer || t.footer) + '</div>';

    if (cfg.credit) {
      html += '<div class="sw-credit"><a href="' + esc(cfg.credit.href) + '" target="_blank" rel="noopener noreferrer">' + esc(cfg.credit.label) + '</a></div>';
    }

    return html;
  }

  function showToast(msg) {
    var old = document.querySelector('.sw-toast');
    if (old) old.remove();
    var el = document.createElement('div');
    el.className = 'sw-toast';
    el.setAttribute('role','status');
    el.setAttribute('aria-live','polite');
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2500);
  }

  function emit(name, detail) {
    try {
      var ev = new CustomEvent(name, { detail: detail || {}, bubbles: true });
      document.dispatchEvent(ev);
    } catch (e) {}
  }

  function copyText(text, scope, label) {
    var done = function () { showToast('📋 ' + (label || '') + text); emit('sw:copy', { text: text }); };
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); }
      catch (e) { showToast('📋 ' + text); }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(fallback);
    } else { fallback(); }

    if (scope) {
      var box = scope.querySelector('.sw-chime-tag');
      if (box) {
        box.classList.add('show');
        clearTimeout(window.__swChimeT);
        window.__swChimeT = setTimeout(function () { box.classList.remove('show'); }, 8000);
      }
    }
  }

  function wireCard(cfg, scope) {
    var btnEl = scope.querySelector('.sw-chime-btn');
    if (btnEl) btnEl.addEventListener('click', function (e) {
      e.preventDefault();
      copyText(cfg.chimeTag, scope, 'Chime tag: ');
    });
    var valEl = scope.querySelector('.sw-chime-tag .val');
    if (valEl) valEl.addEventListener('click', function () {
      copyText(cfg.chimeTag, scope, 'Chime tag: ');
    });
  }

  function applyTheme(el, cfg) {
    // Resolve 'auto'
    var want = cfg.theme;
    if (want === 'auto') {
      want = (window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
    }
    if (want === 'light') el.classList.add('sw-light');
    if (cfg.accent) {
      el.style.setProperty('--sw-accent', cfg.accent);
    }
  }

  function readAttrs(el) {
    var o = {};
    ['mode','lang','title','message','footer','badge','chimeTag','theme','position','accent',
     'coffee','cashapp','venmo','paypal','liberapay','kofi','patreon','github','stripe',
     'bitcoin','lightning','credit'].forEach(function (k) {
      if (el.hasAttribute(k)) o[k] = el.getAttribute(k);
    });

    if (el.hasAttribute('methods')) {
      o.methods = el.getAttribute('methods').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    }
    if (el.hasAttribute('delay'))         o.delay = parseInt(el.getAttribute('delay'), 10) || 0;
    if (el.hasAttribute('scroll-trigger'))o.scrollTrigger = parseInt(el.getAttribute('scroll-trigger'), 10) || 0;
    if (el.hasAttribute('show-once'))     o.showOnce = parseInt(el.getAttribute('show-once'), 10) || 0;
    if (el.hasAttribute('dismissible'))   o.dismissible = el.getAttribute('dismissible') !== 'false';
    if (el.hasAttribute('hide-on-mobile'))o.hideOnMobile = el.getAttribute('hide-on-mobile') !== 'false';
    if (el.hasAttribute('exclude-paths')) o.excludePaths = el.getAttribute('exclude-paths').split(',').map(function (s) { return s.trim(); }).filter(Boolean);

    return o;
  }

  function resolveConfig(attrs) {
    var cfg = Object.assign({}, DEFAULTS, GLOBAL, attrs);
    // Resolve language
    var lang = cfg.lang || (document.documentElement.getAttribute('lang')) || (navigator.language || 'en');
    cfg._lang = pickLang(lang);
    cfg._t = I18N[cfg._lang];
    return cfg;
  }

  // ---------- Mounting ----------
  function renderInline(host, cfg) {
    host.classList.add('sw-root');
    applyTheme(host, cfg);
    host.innerHTML = buildCard(cfg, cfg._t);
    wireCard(cfg, host);
    emit('sw:open', { mode: 'inline' });
  }

  function mountFloating(cfg) {
    if (document.querySelector('.sw-float')) return;

    if (cfg.hideOnMobile) document.body.classList.add('sw-hide-mobile');
    if (cfg.excludePaths && cfg.excludePaths.length && pathExcluded(cfg.excludePaths)) return;
    if (cfg.dismissible && isDismissed(cfg.showOnce)) return;

    var isLeft = cfg.position === 'bottom-left';

    var btn = document.createElement('button');
    btn.className = 'sw-float' + (isLeft ? ' left' : '');
    btn.setAttribute('aria-label', cfg.title || cfg._t.title);
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '☕';

    var pop = document.createElement('div');
    pop.className = 'sw-pop' + (isLeft ? ' left' : '');
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-modal', 'false');
    pop.setAttribute('aria-label', cfg.title || cfg._t.title);
    pop.innerHTML = buildCard(cfg, cfg._t);
    applyTheme(pop, cfg);

    // Dismiss button
    if (cfg.dismissible) {
      var dWrap = document.createElement('div');
      dWrap.className = 'sw-dismiss-wrap';
      var dBtn = document.createElement('button');
      dBtn.type = 'button';
      dBtn.className = 'sw-dismiss';
      dBtn.textContent = cfg._t.dismiss;
      dBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (cfg.showOnce) setDismissed(cfg.showOnce);
        pop.classList.add('hidden');
        btn.classList.add('hidden');
        emit('sw:close', { reason: 'dismissed' });
      });
      dWrap.appendChild(dBtn);
      pop.appendChild(dWrap);
    }

    document.body.appendChild(btn);
    document.body.appendChild(pop);

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = pop.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      emit(open ? 'sw:open' : 'sw:close', { mode: 'float' });
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
      emit('sw:close', { mode: 'float', reason: 'outside' });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && pop.classList.contains('open')) {
        pop.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
        emit('sw:close', { mode: 'float', reason: 'escape' });
      }
    });

    wireCard(cfg, pop);

    // Deferred show
    var reveal = function () {
      btn.classList.remove('hidden');
    };
    if (cfg.delay > 0) {
      btn.classList.add('hidden');
      setTimeout(reveal, cfg.delay);
    }
    if (cfg.scrollTrigger > 0) {
      btn.classList.add('hidden');
      var onScroll = function () {
        var h = document.documentElement;
        var max = (h.scrollHeight - h.clientHeight) || 1;
        var pct = (h.scrollTop || document.body.scrollTop) / max * 100;
        if (pct >= cfg.scrollTrigger) {
          reveal();
          window.removeEventListener('scroll', onScroll);
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    return { btn: btn, pop: pop };
  }

  // ---------- Custom element ----------
  function defineElement() {
    if (!window.customElements || !customElements.define) return;
    if (customElements.get && customElements.get('support-widget')) return;

    function SupportWidget() {
      return Reflect.construct(HTMLElement, [], SupportWidget);
    }
    SupportWidget.prototype = Object.create(HTMLElement.prototype);
    SupportWidget.prototype.constructor = SupportWidget;
    Object.setPrototypeOf(SupportWidget, HTMLElement);

    SupportWidget.prototype.connectedCallback = function () {
      var attrs = readAttrs(this);
      var cfg = resolveConfig(attrs);

      if (cfg.mode === 'float') {
        this.style.display = 'none';
        mountFloating(cfg);
      } else if (cfg.mode === 'inline' || this.hasAttribute('inline')) {
        renderInline(this, cfg);
      } else {
        this.style.display = 'none';
        mountFloating(cfg);
      }
    };

    try { customElements.define('support-widget', SupportWidget); } catch (e) {}
  }

  // ---------- Imperative API ----------
  var API = {
    open: function () {
      var pop = document.querySelector('.sw-pop');
      var btn = document.querySelector('.sw-float');
      if (pop) { pop.classList.add('open'); if (btn) btn.setAttribute('aria-expanded','true'); emit('sw:open', { mode:'float', api:true }); }
    },
    close: function () {
      var pop = document.querySelector('.sw-pop');
      var btn = document.querySelector('.sw-float');
      if (pop) { pop.classList.remove('open'); if (btn) btn.setAttribute('aria-expanded','false'); emit('sw:close', { mode:'float', api:true }); }
    },
    toggle: function () {
      var pop = document.querySelector('.sw-pop');
      if (pop && pop.classList.contains('open')) API.close(); else API.open();
    },
    configure: function (partial) {
      Object.assign(GLOBAL, partial);
    }
  };
  window.SupportWidget = API;

  // ---------- Auto-mount fallback (plain containers) ----------
  function autoMount() {
    var inline = document.getElementById('support-widget');
    if (inline && inline.tagName.toLowerCase() !== 'support-widget') {
      var cfg = resolveConfig(Object.assign({ mode: 'inline' }, GLOBAL));
      renderInline(inline, cfg);
    }
    var floatHost = document.getElementById('support-float');
    if (floatHost) {
      var cfg2 = resolveConfig(Object.assign({ mode: 'float' }, GLOBAL));
      mountFloating(cfg2);
    }
  }

  defineElement();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMount);
  } else { autoMount(); }
})();
