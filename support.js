/*
 * support.js — self-mounting Support overlay for jao.life pages.
 *
 * USAGE
 * ─────
 *   <script src="https://support.jao.life/support.js"
 *           integrity="sha384-…"
 *           crossorigin="anonymous"
 *           defer></script>
 *
 * That's the whole integration. The script mounts itself. There
 * is no element to place, no configuration, no callback.
 *
 * WHAT IT RENDERS
 * ───────────────
 * A full-width bar pinned to the bottom of the viewport. Clicking
 * the bar opens a modal containing six payment links and a
 * Bitcoin block. The modal closes via its close button, the
 * Escape key, or clicking the backdrop.
 *
 * PUBLIC API
 * ──────────
 *   window.jaoSupport.open()   — open the modal programmatically
 *   window.jaoSupport.close()  — close the modal
 *   window.jaoSupport.ready    — true once mounted
 *
 * THEMING
 * ───────
 * If the host page defines these CSS custom properties on :root,
 * the component will use them:
 *
 *   --phosphor          primary text
 *   --phosphor-dim      secondary text
 *   --phosphor-faint    tertiary text / borders
 *   --phosphor-bright   headings
 *   --bg-deep           page background
 *
 * If any are missing, sensible defaults matching the jao.life
 * palette are used.
 *
 * SAFETY
 * ──────
 * - Mounts at most once, guarded by a module-level flag.
 * - Waits for DOMContentLoaded if the document is still loading.
 * - Refuses to mount if a modal element with the same marker
 *   already exists in the DOM (e.g. from a stale cached script).
 * - All content is built with createElement / textContent.
 *   No innerHTML on user-controlled data, though there is none.
 * - No network requests. No cookies. No storage.
 *
 * DEPENDENCIES
 * ────────────
 * None.
 */

(function () {
  'use strict';

  /* ── guards ────────────────────────────────────────────────── */

  if (window.jaoSupport && window.jaoSupport.ready) {
    /* already mounted by a previous script execution */
    return;
  }

  /* ── data ──────────────────────────────────────────────────── */

  var SUPPORT_LINKS = [
    { label: 'Ko-fi',           url: 'https://ko-fi.com/john0ogletree' },
    { label: 'Buy Me a Coffee', url: 'https://buymeacoffee.com/john0ogletree' },
    { label: 'Patreon',         url: 'https://patreon.com/john0ogletree' },
    { label: 'GitHub Sponsors', url: 'https://github.com/sponsors/john0ogletree' },
    { label: 'PayPal',          url: 'https://paypal.me/john0ogletree' },
    { label: 'Liberapay',       url: 'https://liberapay.com/john0ogletree' }
  ];

  var BITCOIN_ADDRESS = 'bc1qhweshz5mp27zuml49nkz52q4v68usmz3afmgq5';
  var BITCOIN_SHORT   = 'bc1qhwes\u20263afmgq5';
  var BITCOIN_URI     = 'bitcoin:' + BITCOIN_ADDRESS;

  var ROOT_ID = 'jao-support-root';

  /* ── styles ────────────────────────────────────────────────── */

  var CSS = [
    ':host {',
    '  --_phosphor:        var(--phosphor,        #ffd89a);',
    '  --_phosphor-dim:    var(--phosphor-dim,    #d4a05a);',
    '  --_phosphor-faint:  var(--phosphor-faint,  #a07a3a);',
    '  --_phosphor-bright: var(--phosphor-bright, #ffecc4);',
    '  --_bg-deep:         var(--bg-deep,         #050300);',
    '  font-family: ui-monospace, "SFMono-Regular", "Cascadia Code",',
    '               "Source Code Pro", Menlo, Consolas, "Liberation Mono",',
    '               "Courier New", monospace;',
    '  font-size: 16px;',
    '  line-height: 1.55;',
    '  letter-spacing: 0.02em;',
    '  color: var(--_phosphor);',
    '}',
    '',
    '*, *::before, *::after { box-sizing: border-box; }',
    '',
    '/* the bar */',
    '.bar {',
    '  position: fixed;',
    '  left: 0;',
    '  right: 0;',
    '  bottom: 0;',
    '  z-index: 2147483000;',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  gap: 12px;',
    '  width: 100%;',
    '  padding: 12px 20px;',
    '  background: linear-gradient(180deg, #3a3226 0%, #2a2518 45%, #1c1810 55%, #241e14 100%);',
    '  border: none;',
    '  border-top: 1px solid var(--_phosphor-faint);',
    '  color: var(--_phosphor-bright);',
    '  font-family: inherit;',
    '  font-size: 0.82rem;',
    '  font-weight: 700;',
    '  letter-spacing: 0.18em;',
    '  text-transform: uppercase;',
    '  cursor: pointer;',
    '  box-shadow:',
    '    0 -2px 8px rgba(0,0,0,0.5),',
    '    inset 0 1px 0 rgba(255,232,180,0.22);',
    '  opacity: 0;',
    '  transform: translateY(100%);',
    '  animation: bar-in 500ms 300ms cubic-bezier(0.2, 0.9, 0.3, 1) forwards;',
    '  transition: filter 120ms ease;',
    '}',
    '',
    '@keyframes bar-in {',
    '  to { opacity: 1; transform: translateY(0); }',
    '}',
    '',
    '.bar:hover  { filter: brightness(1.2); }',
    '.bar:active { filter: brightness(0.92); }',
    '',
    '.bar:focus-visible {',
    '  outline: none;',
    '  box-shadow:',
    '    0 -2px 8px rgba(0,0,0,0.5),',
    '    inset 0 1px 0 rgba(255,232,180,0.22),',
    '    inset 0 0 0 2px var(--_phosphor);',
    '}',
    '',
    '.bar-chevron {',
    '  display: inline-block;',
    '  font-size: 0.7em;',
    '  opacity: 0.75;',
    '  transition: transform 240ms ease;',
    '}',
    '',
    '.bar[aria-expanded="true"] .bar-chevron {',
    '  transform: rotate(180deg);',
    '}',
    '',
    '/* backdrop + modal */',
    '.backdrop {',
    '  position: fixed;',
    '  inset: 0;',
    '  z-index: 2147483001;',
    '  background: rgba(5, 3, 0, 0.75);',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  padding: 24px;',
    '  opacity: 0;',
    '  visibility: hidden;',
    '  transition: opacity 220ms ease, visibility 0s 220ms;',
    '}',
    '',
    '.backdrop.open {',
    '  opacity: 1;',
    '  visibility: visible;',
    '  transition: opacity 220ms ease, visibility 0s;',
    '}',
    '',
    '.modal {',
    '  width: 100%;',
    '  max-width: 560px;',
    '  max-height: calc(100vh - 48px);',
    '  overflow-y: auto;',
    '  padding: 20px 20px 18px;',
    '  background: var(--_bg-deep);',
    '  border: 1px solid var(--_phosphor-faint);',
    '  border-radius: 6px;',
    '  box-shadow:',
    '    0 24px 60px rgba(0,0,0,0.7),',
    '    inset 0 1px 0 rgba(255,232,180,0.10);',
    '  transform: translateY(12px) scale(0.98);',
    '  transition: transform 240ms cubic-bezier(0.2, 0.9, 0.3, 1);',
    '}',
    '',
    '.backdrop.open .modal {',
    '  transform: translateY(0) scale(1);',
    '}',
    '',
    '.modal-head {',
    '  display: flex;',
    '  align-items: center;',
    '  gap: 0.85rem;',
    '  padding: 6px 12px;',
    '  margin: 0 0 14px;',
    '  background: linear-gradient(180deg, #3a3226 0%, #2a2518 45%, #1c1810 55%, #241e14 100%);',
    '  border: 1px solid var(--_phosphor-faint);',
    '  border-radius: 4px;',
    '  box-shadow:',
    '    inset 0 1px 0 rgba(255,232,180,0.22),',
    '    inset 0 -1px 0 rgba(0,0,0,0.5);',
    '}',
    '',
    '.modal-title {',
    '  font-size: 0.8rem;',
    '  font-weight: 700;',
    '  letter-spacing: 0.2em;',
    '  text-transform: uppercase;',
    '  color: var(--_phosphor-bright);',
    '  white-space: nowrap;',
    '}',
    '',
    '.modal-rule {',
    '  flex: 1;',
    '  height: 1px;',
    '  background: linear-gradient(to right, var(--_phosphor-faint), transparent);',
    '}',
    '',
    '.modal-close {',
    '  background: none;',
    '  border: none;',
    '  padding: 2px 6px;',
    '  color: var(--_phosphor);',
    '  font-family: inherit;',
    '  font-size: 1rem;',
    '  font-weight: 700;',
    '  cursor: pointer;',
    '  line-height: 1;',
    '  border-radius: 3px;',
    '}',
    '',
    '.modal-close:hover { color: var(--_phosphor-bright); }',
    '',
    '.modal-close:focus-visible {',
    '  outline: none;',
    '  box-shadow: 0 0 0 2px var(--_phosphor);',
    '}',
    '',
    '/* link list */',
    '.list {',
    '  list-style: none;',
    '  margin: 0;',
    '  padding: 0;',
    '  display: flex;',
    '  flex-direction: column;',
    '  gap: 1px;',
    '}',
    '',
    '.li {',
    '  display: grid;',
    '  grid-template-columns: 3.2ch 1fr auto;',
    '  align-items: baseline;',
    '  gap: 0.75rem;',
    '  padding: 7px 10px;',
    '  text-decoration: none;',
    '  color: var(--_phosphor);',
    '  font-size: 0.9rem;',
    '  line-height: 1.45;',
    '  letter-spacing: 0.01em;',
    '  border-radius: 3px;',
    '  border: 1px solid transparent;',
    '  background: transparent;',
    '  width: 100%;',
    '  text-align: left;',
    '  font-family: inherit;',
    '  cursor: pointer;',
    '  transition: background 120ms ease, color 120ms ease;',
    '  word-break: break-word;',
    '}',
    '',
    '.li:hover,',
    '.li:focus-visible {',
    '  background: rgba(255,216,154,0.08);',
    '  border-color: var(--_phosphor-faint);',
    '  outline: none;',
    '  color: var(--_phosphor-bright);',
    '}',
    '',
    '.li:focus-visible { box-shadow: 0 0 0 2px var(--_phosphor); }',
    '',
    '.ln {',
    '  color: var(--_phosphor-faint);',
    '  font-size: 0.78rem;',
    '  text-align: right;',
    '  user-select: none;',
    '  font-variant-numeric: tabular-nums;',
    '}',
    '',
    '.li:hover .ln,',
    '.li:focus-visible .ln { color: var(--_phosphor-dim); }',
    '',
    '.content { min-width: 0; }',
    '',
    '.label {',
    '  display: block;',
    '  color: var(--_phosphor);',
    '  letter-spacing: 0.02em;',
    '  line-height: 1.3;',
    '}',
    '',
    '.li:hover .label,',
    '.li:focus-visible .label { color: var(--_phosphor-bright); }',
    '',
    '.url {',
    '  display: block;',
    '  font-size: 0.72rem;',
    '  color: var(--_phosphor-faint);',
    '  margin-top: 1px;',
    '  white-space: nowrap;',
    '  overflow: hidden;',
    '  text-overflow: ellipsis;',
    '}',
    '',
    '.li:hover .url,',
    '.li:focus-visible .url { color: var(--_phosphor-dim); }',
    '',
    '.status {',
    '  color: var(--_phosphor-faint);',
    '  font-size: 0.7rem;',
    '  user-select: none;',
    '  flex-shrink: 0;',
    '  transition: color 120ms ease, transform 120ms ease;',
    '}',
    '',
    '.li:hover .status,',
    '.li:focus-visible .status {',
    '  color: var(--_phosphor);',
    '  transform: translateX(2px);',
    '}',
    '',
    '/* bitcoin */',
    '.btc {',
    '  display: none;',
    '  margin: 6px 0 0 3.2ch;',
    '  padding: 16px 16px 14px;',
    '  background: linear-gradient(180deg, rgba(255,216,154,0.06) 0%, rgba(255,216,154,0.015) 100%);',
    '  border: 1px solid var(--_phosphor-faint);',
    '  border-radius: 4px;',
    '  box-shadow: inset 0 1px 0 rgba(255,232,180,0.14);',
    '  flex-direction: column;',
    '  gap: 12px;',
    '}',
    '',
    '.btc.open { display: flex; }',
    '',
    '.btc-addr-row {',
    '  display: flex;',
    '  align-items: baseline;',
    '  gap: 10px;',
    '  flex-wrap: wrap;',
    '  font-size: 0.84rem;',
    '}',
    '',
    '.btc-addr-label {',
    '  color: var(--_phosphor-faint);',
    '  flex-shrink: 0;',
    '  text-transform: uppercase;',
    '  font-size: 0.7rem;',
    '  letter-spacing: 0.1em;',
    '}',
    '',
    '.btc-addr {',
    '  color: var(--_phosphor-bright);',
    '  font-family: inherit;',
    '  user-select: none;',
    '  -webkit-user-select: none;',
    '  word-break: break-all;',
    '  flex: 1;',
    '  min-width: 0;',
    '  letter-spacing: 0.02em;',
    '}',
    '',
    '.btc-reveal {',
    '  background: none;',
    '  border: none;',
    '  padding: 0;',
    '  color: var(--_phosphor);',
    '  font-family: inherit;',
    '  font-size: 0.78rem;',
    '  cursor: pointer;',
    '  text-decoration: underline;',
    '  text-underline-offset: 3px;',
    '  flex-shrink: 0;',
    '  letter-spacing: 0.06em;',
    '  text-transform: lowercase;',
    '}',
    '',
    '.btc-reveal:hover { color: var(--_phosphor-bright); }',
    '',
    '.btc-reveal:focus-visible {',
    '  outline: none;',
    '  box-shadow: 0 0 0 2px var(--_phosphor);',
    '  border-radius: 2px;',
    '}',
    '',
    '.btc-copy {',
    '  display: inline-flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  padding: 9px 18px;',
    '  background: linear-gradient(180deg, #3a3226 0%, #2a2518 45%, #1c1810 55%, #241e14 100%);',
    '  border: 1px solid var(--_phosphor-dim);',
    '  border-radius: 20px;',
    '  color: var(--_phosphor-bright);',
    '  font-family: inherit;',
    '  font-size: 0.82rem;',
    '  font-weight: 700;',
    '  letter-spacing: 0.1em;',
    '  text-transform: uppercase;',
    '  cursor: pointer;',
    '  box-shadow:',
    '    inset 0 1px 0 rgba(255,232,180,0.3),',
    '    inset 0 -1px 0 rgba(0,0,0,0.6);',
    '  transition: filter 120ms ease;',
    '  align-self: flex-start;',
    '}',
    '',
    '.btc-copy:hover  { filter: brightness(1.25); }',
    '.btc-copy:active { filter: brightness(0.9); }',
    '',
    '.btc-copy:focus-visible {',
    '  outline: none;',
    '  box-shadow: 0 0 0 2px var(--_phosphor);',
    '}',
    '',
    '.btc-copy.copied {',
    '  border-color: var(--_phosphor-bright);',
    '  color: #fff;',
    '}',
    '',
    '.btc-uri {',
    '  display: inline-block;',
    '  color: var(--_phosphor);',
    '  font-size: 0.82rem;',
    '  text-decoration: none;',
    '  align-self: flex-start;',
    '  border-bottom: 1px dashed var(--_phosphor-faint);',
    '  padding-bottom: 1px;',
    '}',
    '',
    '.btc-uri:hover {',
    '  color: var(--_phosphor-bright);',
    '  border-bottom-color: var(--_phosphor);',
    '}',
    '',
    '.btc-uri:focus-visible {',
    '  outline: none;',
    '  box-shadow: 0 0 0 2px var(--_phosphor);',
    '  border-radius: 2px;',
    '}',
    '',
    '.btc-warn {',
    '  display: flex;',
    '  gap: 10px;',
    '  padding: 10px 12px;',
    '  border: 1px solid var(--_phosphor-faint);',
    '  border-left: 3px solid var(--_phosphor);',
    '  background: rgba(255,216,154,0.05);',
    '  border-radius: 0 3px 3px 0;',
    '  font-size: 0.78rem;',
    '  line-height: 1.65;',
    '  color: var(--_phosphor-dim);',
    '}',
    '',
    '.btc-warn::before {',
    '  content: "!";',
    '  color: var(--_phosphor-bright);',
    '  flex-shrink: 0;',
    '  font-weight: 700;',
    '}',
    '',
    '.btc-warn strong { color: var(--_phosphor); font-weight: 700; }',
    '',
    '.btc-warn code {',
    '  font-family: inherit;',
    '  font-size: 0.76rem;',
    '  padding: 1px 5px;',
    '  background: rgba(255,216,154,0.1);',
    '  border: 1px solid var(--_phosphor-faint);',
    '  border-radius: 2px;',
    '  color: var(--_phosphor-bright);',
    '}',
    '',
    '/* mobile — modal goes full-screen */',
    '@media (max-width: 620px) {',
    '  .backdrop { padding: 0; }',
    '',
    '  .modal {',
    '    max-width: none;',
    '    max-height: none;',
    '    width: 100%;',
    '    height: 100%;',
    '    border-radius: 0;',
    '    border: none;',
    '    padding: 18px 16px 20px;',
    '    transform: translateY(20px);',
    '  }',
    '',
    '  .backdrop.open .modal { transform: translateY(0); }',
    '',
    '  .list {',
    '    display: grid;',
    '    grid-template-columns: 1fr 1fr;',
    '    gap: 4px;',
    '  }',
    '',
    '  .list > li { display: block; min-width: 0; }',
    '',
    '  .li {',
    '    display: flex;',
    '    flex-direction: column;',
    '    justify-content: flex-start;',
    '    align-items: flex-start;',
    '    gap: 1px;',
    '    min-height: 52px;',
    '    padding: 7px 9px;',
    '    border: 1px solid var(--_phosphor-faint);',
    '    background: rgba(255,216,154,0.03);',
    '    text-align: left;',
    '    overflow: hidden;',
    '    position: relative;',
    '  }',
    '',
    '  .li:hover,',
    '  .li:focus-visible { background: rgba(255,216,154,0.10); }',
    '',
    '  .ln {',
    '    font-size: 0.6rem;',
    '    text-align: left;',
    '    align-self: flex-start;',
    '    margin-bottom: 2px;',
    '  }',
    '',
    '  .content { align-self: stretch; }',
    '  .label { font-size: 0.84rem; line-height: 1.2; word-break: break-word; }',
    '  .url { display: none; }',
    '',
    '  .status {',
    '    position: absolute;',
    '    bottom: 6px;',
    '    right: 8px;',
    '    font-size: 0.58rem;',
    '    color: var(--_phosphor-dim);',
    '  }',
    '',
    '  .list > li.btc-cell { grid-column: 1 / -1; }',
    '',
    '  .li.btc-trigger {',
    '    min-height: 52px;',
    '    flex-direction: row;',
    '    align-items: center;',
    '    justify-content: space-between;',
    '    padding: 10px 12px;',
    '    gap: 12px;',
    '  }',
    '',
    '  .li.btc-trigger .ln { margin-bottom: 0; align-self: center; }',
    '  .li.btc-trigger .content { flex: 1; }',
    '  .li.btc-trigger .status { position: static; font-size: 0.75rem; }',
    '',
    '  .li.btc-trigger .url {',
    '    display: block;',
    '    font-size: 0.68rem;',
    '    white-space: normal;',
    '    overflow: visible;',
    '    text-overflow: clip;',
    '    word-break: break-all;',
    '  }',
    '',
    '  .btc { margin-left: 0; margin-top: 6px; padding: 12px; }',
    '  .btc-copy { width: 100%; align-self: stretch; }',
    '  .btc-uri  { align-self: stretch; text-align: center; }',
    '}',
    '',
    '@media (prefers-reduced-motion: reduce) {',
    '  .bar {',
    '    animation: none !important;',
    '    opacity: 1 !important;',
    '    transform: none !important;',
    '  }',
    '  .backdrop, .modal, .bar-chevron, .status {',
    '    transition: none !important;',
    '  }',
    '}'
  ].join('\n');

  /* ── helpers ───────────────────────────────────────────────── */

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        if (k === 'class')       node.className = attrs[k];
        else if (k === 'text')   node.textContent = attrs[k];
        else if (k === 'html')   node.innerHTML = attrs[k];
        else                     node.setAttribute(k, attrs[k]);
      }
    }
    if (children) {
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (typeof c === 'string') node.appendChild(document.createTextNode(c));
        else if (c) node.appendChild(c);
      }
    }
    return node;
  }

  function svgStyle(css) {
    var s = document.createElement('style');
    s.textContent = css;
    return s;
  }

  /* ── build ─────────────────────────────────────────────────── */

  function build() {
    /* host element wrapping the shadow root */
    var host = document.createElement('div');
    host.id = ROOT_ID;
    host.setAttribute('data-jao-support', 'mounted');
    /* the host itself must not occupy layout space */
    host.style.cssText =
      'all: initial; position: fixed; inset: 0; pointer-events: none;' +
      'z-index: 2147482999; contain: strict;';

    var shadow = host.attachShadow({ mode: 'open' });
    shadow.appendChild(svgStyle(CSS));

    /* ── the bar ──────────────────────────────────────────── */
    var bar = el('button', {
      'class': 'bar',
      'type': 'button',
      'aria-haspopup': 'dialog',
      'aria-expanded': 'false'
    }, [
      el('span', { 'class': 'bar-label', 'text': 'SUPPORT THIS PROJECT' }),
      el('span', { 'class': 'bar-chevron', 'aria-hidden': 'true', 'text': '\u25B2' })
    ]);

    /* ── the modal ────────────────────────────────────────── */
    var list = el('ul', { 'class': 'list', 'role': 'list' });

    SUPPORT_LINKS.forEach(function (link, i) {
      var n = (i + 1) * 10;
      var li = el('li', null, [
        el('a', {
          'class': 'li',
          'href': link.url,
          'target': '_blank',
          'rel': 'noopener noreferrer'
        }, [
          el('span', { 'class': 'ln', 'text': String(n) }),
          el('span', { 'class': 'content' }, [
            el('span', { 'class': 'label', 'text': link.label }),
            el('span', {
              'class': 'url',
              'text': link.url.replace(/^https?:\/\//, '')
            })
          ]),
          el('span', { 'class': 'status', 'aria-hidden': 'true', 'text': '\u25B8' })
        ])
      ]);
      list.appendChild(li);
    });

    /* bitcoin cell */
    var btcLi = el('li', { 'class': 'btc-cell' }, [
      el('button', {
        'class': 'li btc-trigger',
        'type': 'button',
        'aria-expanded': 'false'
      }, [
        el('span', { 'class': 'ln', 'text': '70' }),
        el('span', { 'class': 'content' }, [
          el('span', { 'class': 'label', 'text': 'BITCOIN' }),
          el('span', { 'class': 'url', 'text': BITCOIN_SHORT })
        ]),
        el('span', { 'class': 'status', 'aria-hidden': 'true', 'text': '\u25BE' })
      ]),
      el('div', { 'class': 'btc' }, [
        el('div', { 'class': 'btc-addr-row' }, [
          el('span', { 'class': 'btc-addr-label', 'text': 'ADDR' }),
          el('span', { 'class': 'btc-addr', 'text': BITCOIN_SHORT }),
          el('button', {
            'class': 'btc-reveal',
            'type': 'button',
            'aria-expanded': 'false'
          }, [
            el('span', { 'class': 'reveal-label', 'text': 'show full' })
          ])
        ]),
        el('button', {
          'class': 'btc-copy',
          'type': 'button',
          'aria-label': 'Copy full Bitcoin address to clipboard',
          'text': 'COPY ADDRESS'
        }),
        el('a', {
          'class': 'btc-uri',
          'href': BITCOIN_URI,
          'rel': 'noopener noreferrer',
          'text': '> open in wallet (bitcoin: URI)'
        }),
        el('div', { 'class': 'btc-warn' }, [
          el('span', {
            'html':
              'Bitcoin transfers are <strong>irreversible</strong>. ' +
              'After copying, verify the full address in your wallet before ' +
              'sending \u2014 check that it starts with <code>bc1qhwes</code> ' +
              'and ends with <code>3afmgq5</code>, or use ' +
              '<strong>show full</strong> above to read it in full. ' +
              'The <code>bitcoin:</code> link only works if your browser or OS ' +
              'has a wallet registered for that scheme; if nothing happens, ' +
              'use the copy button.'
          })
        ])
      ])
    ]);
    list.appendChild(btcLi);

    var closeBtn = el('button', {
      'class': 'modal-close',
      'type': 'button',
      'aria-label': 'Close',
      'text': '\u00D7'
    });

    var modal = el('div', { 'class': 'modal' }, [
      el('div', { 'class': 'modal-head' }, [
        el('span', { 'class': 'modal-title', 'text': 'SUPPORT' }),
        el('span', { 'class': 'modal-rule', 'aria-hidden': 'true' }),
        closeBtn
      ]),
      list
    ]);

    var backdrop = el('div', {
      'class': 'backdrop',
      'role': 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Support this project'
    }, [modal]);

    shadow.appendChild(bar);
    shadow.appendChild(backdrop);

    return {
      host: host,
      shadow: shadow,
      bar: bar,
      backdrop: backdrop,
      closeBtn: closeBtn,
      btcLi: btcLi
    };
  }

  /* ── mount ─────────────────────────────────────────────────── */

  function mount() {
    /* refuse to double-mount */
    if (document.getElementById(ROOT_ID)) return;

    var refs = build();
    document.body.appendChild(refs.host);

    var bar       = refs.bar;
    var backdrop  = refs.backdrop;
    var closeBtn  = refs.closeBtn;

    /* bitcoin refs */
    var trigger     = refs.shadow.querySelector('.btc-trigger');
    var btcPanel    = refs.shadow.querySelector('.btc');
    var btcChevron  = refs.shadow.querySelector('.btc-trigger .status');
    var revealBtn   = refs.shadow.querySelector('.btc-reveal');
    var revealLabel = refs.shadow.querySelector('.reveal-label');
    var addrEl      = refs.shadow.querySelector('.btc-addr');
    var copyBtn     = refs.shadow.querySelector('.btc-copy');

    var lastFocused = null;
    var isOpen = false;

    function openModal() {
      if (isOpen) return;
      isOpen = true;
      lastFocused = document.activeElement;
      backdrop.classList.add('open');
      bar.setAttribute('aria-expanded', 'true');
      document.documentElement.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeModal() {
      if (!isOpen) return;
      isOpen = false;
      backdrop.classList.remove('open');
      bar.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
      if (lastFocused && typeof lastFocused.focus === 'function') {
        try { lastFocused.focus(); } catch (e) {}
      }
    }

    /* bar click toggles the modal */
    bar.addEventListener('click', function () {
      if (isOpen) closeModal();
      else openModal();
    });

    /* close button */
    closeBtn.addEventListener('click', closeModal);

    /* backdrop click closes, but only when the click is on the backdrop
       itself, not on something inside the modal */
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeModal();
    });

    /* Escape closes */
    document.addEventListener('keydown', function (e) {
      if (isOpen && (e.key === 'Escape' || e.key === 'Esc')) {
        e.preventDefault();
        closeModal();
      }
    });

    /* simple focus trap: keep Tab inside the modal while it's open */
    backdrop.addEventListener('keydown', function (e) {
      if (!isOpen || e.key !== 'Tab') return;
      var focusable = backdrop.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    /* bitcoin panel toggle */
    trigger.addEventListener('click', function () {
      var open = btcPanel.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      btcChevron.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
    });

    /* reveal / hide the full bitcoin address */
    revealBtn.addEventListener('click', function () {
      var shown = revealBtn.getAttribute('aria-expanded') === 'true';
      if (shown) {
        addrEl.textContent = BITCOIN_SHORT;
        revealBtn.setAttribute('aria-expanded', 'false');
        revealLabel.textContent = 'show full';
      } else {
        addrEl.textContent = BITCOIN_ADDRESS;
        revealBtn.setAttribute('aria-expanded', 'true');
        revealLabel.textContent = 'hide';
      }
    });

    /* copy the bitcoin address */
    copyBtn.addEventListener('click', function () {
      var original = copyBtn.textContent;

      function ok() {
        copyBtn.classList.add('copied');
        copyBtn.textContent = 'COPIED \u2014 VERIFY IN WALLET';
        setTimeout(function () {
          copyBtn.classList.remove('copied');
          copyBtn.textContent = original;
        }, 2600);
      }

      function fail() {
        copyBtn.textContent = 'COPY FAILED';
        setTimeout(function () { copyBtn.textContent = original; }, 2600);
      }

      function legacyCopy() {
        try {
          var ta = document.createElement('textarea');
          ta.value = BITCOIN_ADDRESS;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          var r = document.execCommand('copy');
          document.body.removeChild(ta);
          return r;
        } catch (e) { return false; }
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(BITCOIN_ADDRESS).then(ok, function () {
          if (legacyCopy()) ok(); else fail();
        });
      } else {
        if (legacyCopy()) ok(); else fail();
      }
    });

    /* ── public API ────────────────────────────────────────── */

    window.jaoSupport = {
      ready: true,
      open: openModal,
      close: closeModal,
      host: refs.host
    };
  }

  /* ── boot ──────────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
