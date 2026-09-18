(function () {
  'use strict';
  if (window.__jaoSupportLoaded) return;
  window.__jaoSupportLoaded = true;

  var CHIME_TAG = '$john0ogletree';

  var css = `
    #jao-support {
      background: linear-gradient(135deg, rgba(120,53,15,.25), rgba(146,64,14,.12));
      border: 1px solid rgba(180,83,9,.35);
      border-radius: 12px;
      padding: 16px;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      box-sizing: border-box;
    }
    #jao-support * { box-sizing: border-box; }

    #jao-support .jao-head,
    .jao-pop .jao-head {
      display: flex; align-items: center; gap: 8px;
      color: #fcd34d; font-weight: 600; font-size: 12px;
    }
    .jao-coffee {
      font-size: 18px; display: inline-block;
      animation: jaoSteam 2s ease-in-out infinite;
    }
    @keyframes jaoSteam {
      0%,100% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(-5deg) scale(1.1); }
    }
    #jao-support .jao-badge,
    .jao-pop .jao-badge {
      margin-left: auto; font-size: 9px; font-weight: 400;
      color: rgba(251,191,36,.7); background: rgba(251,191,36,.1);
      padding: 2px 8px; border-radius: 9999px;
    }

    #jao-support .jao-desc,
    .jao-pop .jao-desc {
      font-size: 10px; color: #94a3b8; line-height: 1.6;
      margin: 12px 0;
    }

    #jao-support .jao-grid,
    .jao-pop .jao-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
    }
    #jao-support .jao-full,
    .jao-pop .jao-full { grid-column: 1 / -1; }

    #jao-support a.jao-btn,
    .jao-pop a.jao-btn {
      display: flex; align-items: center; justify-content: center;
      gap: 6px; text-decoration: none; cursor: pointer;
      border-radius: 8px; padding: 8px 12px;
      font-size: 9px; font-weight: 500;
      transition: all .2s; border: none;
    }
    #jao-support a.jao-btn:hover,
    .jao-pop a.jao-btn:hover { transform: scale(1.03); }
    #jao-support a.jao-btn:active,
    .jao-pop a.jao-btn:active { transform: scale(.95); }

    #jao-support a.jao-main,
    .jao-pop a.jao-main {
      width: 100%; padding: 10px 16px; font-size: 12px; font-weight: 600;
      color: #fff; background: linear-gradient(135deg, #f59e0b, #d97706);
      box-shadow: 0 4px 14px rgba(245,158,11,.25);
    }
    #jao-support a.jao-main:hover,
    .jao-pop a.jao-main:hover {
      transform: scale(1.02);
      box-shadow: 0 0 30px rgba(245,158,11,.35);
    }
    #jao-support a.jao-main:active,
    .jao-pop a.jao-main:active { transform: scale(.97); }

    #jao-support a.jao-kofi,      .jao-pop a.jao-kofi      { background:#ff5e5b; color:#fff; }
    #jao-support a.jao-kofi:hover,      .jao-pop a.jao-kofi:hover      { background:#ff7471; box-shadow:0 0 25px rgba(255,94,91,.35); }
    #jao-support a.jao-paypal,    .jao-pop a.jao-paypal    { background:#0070ba; color:#fff; }
    #jao-support a.jao-paypal:hover,    .jao-pop a.jao-paypal:hover    { background:#0085dd; box-shadow:0 0 25px rgba(0,112,186,.3); }
    #jao-support a.jao-liberapay, .jao-pop a.jao-liberapay { background:#f6c915; color:#1a1a1a; font-weight:700; }
    #jao-support a.jao-liberapay:hover, .jao-pop a.jao-liberapay:hover { background:#ffd83a; box-shadow:0 0 25px rgba(246,201,21,.35); }
    #jao-support a.jao-venmo,     .jao-pop a.jao-venmo     { background:#008CFF; color:#fff; }
    #jao-support a.jao-venmo:hover,     .jao-pop a.jao-venmo:hover     { background:#1a9aff; box-shadow:0 0 25px rgba(0,140,255,.3); }
    #jao-support a.jao-cashapp,   .jao-pop a.jao-cashapp   { background:#00d632; color:#000; font-weight:700; }
    #jao-support a.jao-cashapp:hover,   .jao-pop a.jao-cashapp:hover   { background:#00e63a; box-shadow:0 0 25px rgba(0,214,50,.3); }
    #jao-support a.jao-chime,     .jao-pop a.jao-chime     { background:#0066ff; color:#fff; }
    #jao-support a.jao-chime:hover,     .jao-pop a.jao-chime:hover     { background:#1a75ff; box-shadow:0 0 25px rgba(0,102,255,.3); }

    #jao-support .jao-tag,
    .jao-pop .jao-tag {
      display: none; margin-top: 8px;
      background: rgba(30,41,59,.6); padding: 8px;
      border-radius: 8px; border: 1px solid rgba(59,130,246,.3);
      text-align: center;
    }
    #jao-support .jao-tag.show,
    .jao-pop .jao-tag.show { display: block; }
    .jao-tag .lbl { font-size: 9px; color: #94a3b8; }
    .jao-tag .val {
      font-size: 10px; font-family: ui-monospace, monospace;
      color: #93c5fd; font-weight: 600; user-select: all;
    }
    .jao-tag .hint { font-size: 8px; color: #64748b; margin-left: 8px; }

    #jao-support .jao-foot,
    .jao-pop .jao-foot {
      font-size: 8px; color: #64748b; text-align: center;
      padding-top: 8px; margin-top: 12px;
      border-top: 1px solid rgba(30,41,59,.6);
    }

    /* --- Floating button + popover (Option B) --- */
    #jao-float-btn {
      position: fixed; bottom: 20px; right: 20px;
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border: none; cursor: pointer; z-index: 2147483646;
      box-shadow: 0 6px 20px rgba(245,158,11,.4);
      font-size: 26px; line-height: 1;
      display: flex; align-items: center; justify-content: center;
      transition: transform .15s ease;
    }
    #jao-float-btn:hover { transform: scale(1.08); }
    #jao-float-btn:active { transform: scale(.94); }

    .jao-pop {
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
      animation: jaoPop .2s ease-out;
    }
    .jao-pop * { box-sizing: border-box; }
    .jao-pop.open { display: block; }
    @keyframes jaoPop {
      0% { opacity: 0; transform: translateY(12px) scale(.97); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    .jao-toast {
      position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
      background: #1e293b; color: #fff; padding: 12px 24px;
      border-radius: 12px; font-size: 14px; z-index: 2147483647;
      box-shadow: 0 12px 40px rgba(0,0,0,.5);
      border: 1px solid #334155; font-family: system-ui, sans-serif;
      animation: jaoFade .25s ease-out;
    }
    @keyframes jaoFade {
      0% { opacity: 0; transform: translate(-50%, 20px); }
      100% { opacity: 1; transform: translate(-50%, 0); }
    }
  `;
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // --- The donate card body (shared by inline + popover) ---
  function cardHTML() {
    return `
      <div class="jao-head">
        <span class="jao-coffee">☕</span>
        <span>Support</span>
        <span class="jao-badge">❤️ open source</span>
      </div>
      <p class="jao-desc">
        If this saves you time or sparks creativity, consider buying me a coffee. It helps keep this tool free and open for everyone.
      </p>
      <div class="jao-grid">
        <a class="jao-btn jao-main jao-full" href="https://www.buymeacoffee.com/john0ogletree" target="_blank" rel="noopener noreferrer">
          <span>☕</span> Buy me a coffee
        </a>
        <a class="jao-btn jao-kofi" href="https://ko-fi.com/john0ogletree" target="_blank" rel="noopener noreferrer">
          <span>🎁</span> Ko-fi
        </a>
        <a class="jao-btn jao-cashapp" href="https://cash.app/$john0ogletree" target="_blank" rel="noopener noreferrer">
          <span>💰</span> Cash App
        </a>
        <a class="jao-btn jao-venmo" href="https://venmo.com/john0ogletree" target="_blank" rel="noopener noreferrer">
          <span>💳</span> Venmo
        </a>
        <a class="jao-btn jao-paypal" href="https://www.paypal.me/john0ogletree" target="_blank" rel="noopener noreferrer">
          <span>🅿️</span> PayPal
        </a>
        <a class="jao-btn jao-liberapay" href="https://liberapay.com/john0ogletree" target="_blank" rel="noopener noreferrer">
          <span>💛</span> Liberapay
        </a>
        <a class="jao-btn jao-chime jao-chime-btn" href="#">
          <span>🏦</span> Chime
        </a>
      </div>
      <div class="jao-tag jao-chime-tag">
        <span class="lbl">Chime Tag:</span>
        <span class="val">${CHIME_TAG}</span>
        <span class="hint">(click to copy)</span>
      </div>
      <div class="jao-foot">💛 100% of donations go to supporting development</div>
    `;
  }

  function showToast(msg) {
    var old = document.querySelector('.jao-toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.className = 'jao-toast';
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

    var box = (scope || document).querySelector('.jao-chime-tag');
    if (box) {
      box.classList.add('show');
      clearTimeout(window.__jaoChimeT);
      window.__jaoChimeT = setTimeout(function () { box.classList.remove('show'); }, 8000);
    }
  }

  function wireChime(scope) {
    var btn = (scope || document).querySelector('.jao-chime-btn');
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
    btn.id = 'jao-float-btn';
    btn.setAttribute('aria-label', 'Support');
    btn.innerHTML = '☕';

    var pop = document.createElement('div');
    pop.className = 'jao-pop';
    pop.innerHTML = cardHTML();

    document.body.appendChild(btn);
    document.body.appendChild(pop);

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      pop.classList.toggle('open');
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!pop.classList.contains('open')) return;
      if (pop.contains(e.target) || btn.contains(e.target)) return;
      pop.classList.remove('open');
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') pop.classList.remove('open');
    });

    wireChime(pop);
  }

  function mount() {
    var root = document.getElementById('jao-support');
    if (root) {
      mountInline(root);
    } else {
      mountFloating();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else { mount(); }
})();
