(function () {
  'use strict';
  if (window.__supportWidgetLoaded) return;
  window.__supportWidgetLoaded = true;

  var CONFIG = Object.assign({
    mode: 'auto',
    title: 'Support',
    message: 'If this saves you time or sparks creativity, consider buying me a coffee. It helps keep this tool free and open for everyone.',
    footer: '💛 100% of donations go to supporting development',
    badge: '❤️ open source',
    chimeTag: '$johndoe',
    links: {
      coffee:    'https://www.buymeacoffee.com/yourname',
      cashapp:   'https://cash.app/$yourname',
      venmo:     'https://venmo.com/yourname',
      paypal:    'https://www.paypal.me/yourname',
      liberapay: 'https://liberapay.com/yourname'
    }
  }, window.SUPPORT_WIDGET_CONFIG || {});

  var CHIME_TAG = CONFIG.chimeTag;

  var css = `
    #support-widget {
      background: linear-gradient(135deg, rgba(120,53,15,.25), rgba(146,64,14,.12));
      border: 1px solid rgba(180,83,9,.35);
      border-radius: 12px;
      padding: 16px;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      box-sizing: border-box;
    }
    #support-widget * { box-sizing: border-box; }

    #support-widget .sw-head,
    .sw-pop .sw-head {
      display: flex; align-items: center; gap: 8px;
      color: #fcd34d; font-weight: 600; font-size: 12px;
    }
    .sw-coffee {
      font-size: 18px; display: inline-block;
      animation: swSteam 2s ease-in-out infinite;
    }
    @keyframes swSteam {
      0%,100% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(-5deg) scale(1.1); }
    }
    #support-widget .sw-badge,
    .sw-pop .sw-badge {
      margin-left: auto; font-size: 9px; font-weight: 400;
      color: rgba(251,191,36,.7); background: rgba(251,191,36,.1);
      padding: 2px 8px; border-radius: 9999px;
    }

    #support-widget .sw-desc,
    .sw-pop .sw-desc {
      font-size: 10px; color: #94a3b8; line-height: 1.6;
      margin: 12px 0;
    }

    #support-widget .sw-grid,
    .sw-pop .sw-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
    }
    #support-widget .sw-full,
    .sw-pop .sw-full { grid-column: 1 / -1; }

    #support-widget a.sw-btn,
    .sw-pop a.sw-btn {
      display: flex; align-items: center; justify-content: center;
      gap: 6px; text-decoration: none; cursor: pointer;
      border-radius: 8px; padding: 8px 12px;
      font-size: 9px; font-weight: 500;
      transition: all .2s; border: none;
    }
    #support-widget a.sw-btn:hover,
    .sw-pop a.sw-btn:hover { transform: scale(1.03); }
    #support-widget a.sw-btn:active,
    .sw-pop a.sw-btn:active { transform: scale(.95); }

    #support-widget a.sw-main,
    .sw-pop a.sw-main {
      width: 100%; padding: 10px 16px; font-size: 12px; font-weight: 600;
      color: #fff; background: linear-gradient(135deg, #f59e0b, #d97706);
      box-shadow: 0 4px 14px rgba(245,158,11,.25);
    }
    #support-widget a.sw-main:hover,
    .sw-pop a.sw-main:hover {
      transform: scale(1.02);
      box-shadow: 0 0 30px rgba(245,158,11,.35);
    }
    #support-widget a.sw-main:active,
    .sw-pop a.sw-main:active { transform: scale(.97); }

    #support-widget a.sw-paypal,    .sw-pop a.sw-paypal    { background:#0070ba; color:#fff; }
    #support-widget a.sw-paypal:hover,    .sw-pop a.sw-paypal:hover    { background:#0085dd; box-shadow:0 0 25px rgba(0,112,186,.3); }
    #support-widget a.sw-liberapay, .sw-pop a.sw-liberapay { background:#f6c915; color:#1a1a1a; font-weight:700; }
    #support-widget a.sw-liberapay:hover, .sw-pop a.sw-liberapay:hover { background:#ffd83a; box-shadow:0 0 25px rgba(246,201,21,.35); }
    #support-widget a.sw-venmo,     .sw-pop a.sw-venmo     { background:#008CFF; color:#fff; }
    #support-widget a.sw-venmo:hover,     .sw-pop a.sw-venmo:hover     { background:#1a9aff; box-shadow:0 0 25px rgba(0,140,255,.3); }
    #support-widget a.sw-cashapp,   .sw-pop a.sw-cashapp   { background:#00d632; color:#000; font-weight:700; }
    #support-widget a.sw-cashapp:hover,   .sw-pop a.sw-cashapp:hover   { background:#00e63a; box-shadow:0 0 25px rgba(0,214,50,.3); }
    #support-widget a.sw-chime,     .sw-pop a.sw-chime     { background:#0066ff; color:#fff; }
    #support-widget a.sw-chime:hover,     .sw-pop a.sw-chime:hover     { background:#1a75ff; box-shadow:0 0 25px rgba(0,102,255,.3); }

    #support-widget .sw-tag,
    .sw-pop .sw-tag {
      display: none; margin-top: 8px;
      background: rgba(30,41,59,.6); padding: 8px;
      border-radius: 8px; border: 1px solid rgba(59,130,246,.3);
      text-align: center;
    }
    #support-widget .sw-tag.show,
    .sw-pop .sw-tag.show { display: block; }
    .sw-tag .lbl { font-size: 9px; color: #94a3b8; }
    .sw-tag .val {
      font-size: 10px; font-family: ui-monospace, monospace;
      color: #93c5fd; font-weight: 600; user-select: all;
    }
    .sw-tag .hint { font-size: 8px; color: #64748b; margin-left: 8px; }

    #support-widget .sw-foot,
    .sw-pop .sw-foot {
      font-size: 8px; color: #64748b; text-align: center;
      padding-top: 8px; margin-top: 12px;
      border-top: 1px solid rgba(30,41,59,.6);
    }

    #support-float-btn {
      position: fixed; bottom: 20px; right: 20px;
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border: none; cursor: pointer; z-index: 2147483646;
      box-shadow: 0 6px 20px rgba(245,158,11,.4);
      font-size: 26px; line-height: 1;
      display: flex; align-items: center; justify-content: center;
      transition: transform .15s ease;
    }
    #support-float-btn:hover { transform: scale(1.08); }
    #support-float-btn:active { transform: scale(.94); }

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
    .sw-pop * { box-sizing: border-box; }
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
  `;
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function cardHTML() {
    var L = CONFIG.links;
    return `
      <div class="sw-head">
        <span class="sw-coffee">☕</span>
        <span>${CONFIG.title}</span>
        <span class="sw-badge">${CONFIG.badge}</span>
      </div>
      <p class="sw-desc">${CONFIG.message}</p>
      <div class="sw-grid">
        <a class="sw-btn sw-main sw-full" href="${L.coffee}" target="_blank" rel="noopener noreferrer">
          <span>☕</span> Buy me a coffee
        </a>
        <a class="sw-btn sw-cashapp" href="${L.cashapp}" target="_blank" rel="noopener noreferrer">
          <span>💰</span> Cash App
        </a>
        <a class="sw-btn sw-venmo" href="${L.venmo}" target="_blank" rel="noopener noreferrer">
          <span>💳</span> Venmo
        </a>
        <a class="sw-btn sw-paypal" href="${L.paypal}" target="_blank" rel="noopener noreferrer">
          <span>🅿️</span> PayPal
        </a>
        <a class="sw-btn sw-liberapay" href="${L.liberapay}" target="_blank" rel="noopener noreferrer">
          <span>💛</span> Liberapay
        </a>
        <a class="sw-btn sw-chime sw-chime-btn" href="#">
          <span>🏦</span> Chime
        </a>
      </div>
      <div class="sw-tag sw-chime-tag">
        <span class="lbl">Chime Tag:</span>
        <span class="val">${CHIME_TAG}</span>
        <span class="hint">(click to copy)</span>
      </div>
      <div class="sw-foot">${CONFIG.footer}</div>
    `;
  }

  function showToast(msg) {
    var old = document.querySelector('.sw-toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.className = 'sw-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2500);
  }

  function copyChime(scope) {
    var done = function () { showToast('📋 Chime tag copied: ' + CHIME_TAG); };
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = CHIME_TAG; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); }
      catch (e) { showToast('📋 Chime tag: ' + CHIME_TAG); }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(CHIME_TAG).then(done).catch(fallback);
    } else { fallback(); }

    var box = (scope || document).querySelector('.sw-chime-tag');
    if (box) {
      box.classList.add('show');
      clearTimeout(window.__swChimeT);
      window.__swChimeT = setTimeout(function () { box.classList.remove('show'); }, 8000);
    }
  }

  function wireChime(scope) {
    var btn = (scope || document).querySelector('.sw-chime-btn');
    if (btn) btn.addEventListener('click', function (e) {
      e.preventDefault();
      copyChime(scope);
    });
  }

  function mountInline(root) {
    root.innerHTML = cardHTML();
    wireChime(root);
  }

  function mountFloating() {
    var btn = document.createElement('button');
    btn.id = 'support-float-btn';
    btn.setAttribute('aria-label', CONFIG.title);
    btn.innerHTML = '☕';

    var pop = document.createElement('div');
    pop.className = 'sw-pop';
    pop.innerHTML = cardHTML();

    document.body.appendChild(btn);
    document.body.appendChild(pop);

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      pop.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (!pop.classList.contains('open')) return;
      if (pop.contains(e.target) || btn.contains(e.target)) return;
      pop.classList.remove('open');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') pop.classList.remove('open');
    });

    wireChime(pop);
  }

  function mount() {
    var root = document.getElementById('support-widget');
    var mode = CONFIG.mode;
    if (mode === 'float' || (mode === 'auto' && !root)) mountFloating();
    else if (root) mountInline(root);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else { mount(); }
})();
