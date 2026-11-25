(function () {
  const scriptEl = document.currentScript;
  if (!scriptEl) return;

  const METHODS = [
    {
      id: "cashapp",
      name: "Cash App",
      symbol: "$",
      color: "#00d632",
      display: "$john0ogletree",
      copyValue: "$john0ogletree",
      url: "https://cash.app/$john0ogletree"
    },
    {
      id: "paypal",
      name: "PayPal",
      symbol: "P",
      color: "#0079c1",
      display: "@john0ogletree",
      copyValue: "john0ogletree",
      url: "https://paypal.me/john0ogletree"
    },
    {
      id: "venmo",
      name: "Venmo",
      symbol: "V",
      color: "#008cff",
      display: "@john0ogletree",
      copyValue: "john0ogletree",
      url: "https://venmo.com/u/john0ogletree"
    },
    {
      id: "chime",
      name: "Chime",
      symbol: "C",
      color: "#22c55e",
      display: "$john0ogletree",
      copyValue: "$john0ogletree",
      url: null
    },
    {
      id: "btc",
      name: "Bitcoin (BTC)",
      symbol: "₿",
      color: "#f7931a",
      display: "bc1qaxhgg96jfvw3fe0n4qt0uzyxj87p45sa2q9whw",
      copyValue: "bc1qaxhgg96jfvw3fe0n4qt0uzyxj87p45sa2q9whw",
      url: "bitcoin:bc1qaxhgg96jfvw3fe0n4qt0uzyxj87p45sa2q9whw"
    }
  ];

  const onlyAttr = scriptEl.getAttribute("data-only");
  const filterList = onlyAttr
    ? onlyAttr.toLowerCase().split(",").map((s) => s.trim()).filter(Boolean)
    : null;
  const filtered = filterList
    ? METHODS.filter((m) => filterList.includes(m.id))
    : METHODS;
  const items = filtered.length > 0 ? filtered : METHODS;

  const customTriggerSelector = scriptEl.getAttribute("data-trigger");
  const hideFab = scriptEl.getAttribute("data-fab") === "false";
  const autoOpen = scriptEl.getAttribute("data-open") === "true";
  const fabLabel = scriptEl.getAttribute("data-label") || "Support";
  const position = (scriptEl.getAttribute("data-position") || "bottom-right").toLowerCase();

  const POSITIONS = {
    "bottom-right": "bottom:clamp(12px,2vw,28px);right:clamp(12px,2vw,28px);",
    "bottom-left": "bottom:clamp(12px,2vw,28px);left:clamp(12px,2vw,28px);",
    "top-right": "top:clamp(12px,2vw,28px);right:clamp(12px,2vw,28px);",
    "top-left": "top:clamp(12px,2vw,28px);left:clamp(12px,2vw,28px);"
  };
  const fabPosCss = POSITIONS[position] || POSITIONS["bottom-right"];

  const style = document.createElement("style");
  style.textContent = `
    #jao-support-fab {
      position: fixed;
      ${fabPosCss}
      z-index: 2147483645;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #12161f;
      color: #f3f5f8;
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 999px;
      padding: clamp(9px, 1.2vw, 13px) clamp(14px, 1.8vw, 20px);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif;
      font-size: clamp(0.85rem, 1.3vw, 1rem);
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.5);
      transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
    }
    #jao-support-fab:hover {
      background: #191f2c;
      border-color: rgba(255, 255, 255, 0.32);
      transform: translateY(-2px);
    }
    #jao-support-fab-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #00d632;
      flex-shrink: 0;
    }
    #jao-support-backdrop {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      background: rgba(5, 7, 11, 0.78);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: clamp(10px, 3vw, 28px);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif;
      box-sizing: border-box;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    #jao-support-backdrop.jao-open {
      display: flex;
      opacity: 1;
    }
    #jao-support-modal {
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      overflow-y: auto;
      background: #0f131b;
      color: #f3f5f8;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: clamp(12px, 1.8vw, 18px);
      padding: clamp(16px, 3vw, 26px);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.75);
      box-sizing: border-box;
      transform: translateY(8px) scale(0.98);
      transition: transform 0.2s ease;
    }
    #jao-support-backdrop.jao-open #jao-support-modal {
      transform: translateY(0) scale(1);
    }
    .jao-modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: clamp(14px, 2.5vw, 20px);
    }
    .jao-modal-title {
      margin: 0;
      font-size: clamp(1.15rem, 2.6vw, 1.5rem);
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .jao-modal-sub {
      margin: 4px 0 0;
      font-size: clamp(0.8rem, 1.6vw, 0.92rem);
      color: #9aa3b2;
    }
    .jao-modal-close {
      appearance: none;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #f3f5f8;
      width: 34px;
      height: 34px;
      border-radius: 10px;
      font-size: 1.2rem;
      line-height: 1;
      cursor: pointer;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s ease;
    }
    .jao-modal-close:hover {
      background: rgba(255, 255, 255, 0.14);
    }
    .jao-modal-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .jao-modal-item {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: clamp(10px, 2vw, 14px);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .jao-item-left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      flex: 1 1 200px;
    }
    .jao-item-badge {
      width: 34px;
      height: 34px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1rem;
      background: rgba(255, 255, 255, 0.07);
      flex-shrink: 0;
    }
    .jao-item-meta {
      min-width: 0;
    }
    .jao-item-name {
      font-size: 0.95rem;
      font-weight: 600;
    }
    .jao-item-handle {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.82rem;
      color: #9aa3b2;
      word-break: break-all;
      margin-top: 2px;
    }
    .jao-item-actions {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
    }
    .jao-btn {
      appearance: none;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: rgba(255, 255, 255, 0.06);
      color: #f3f5f8;
      font-family: inherit;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 7px 11px;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.15s ease, border-color 0.15s ease;
    }
    .jao-btn:hover {
      background: rgba(255, 255, 255, 0.14);
      border-color: rgba(255, 255, 255, 0.28);
    }
    .jao-btn.jao-copied {
      background: rgba(34, 197, 94, 0.2);
      border-color: #22c55e;
      color: #86efac;
    }
    @media (max-width: 360px) {
      .jao-item-actions {
        width: 100%;
      }
      .jao-btn {
        flex: 1;
        text-align: center;
      }
    }
  `;

  async function copyText(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = "Copied";
      btn.classList.add("jao-copied");
      setTimeout(() => {
        btn.textContent = orig;
        btn.classList.remove("jao-copied");
      }, 1500);
    }
  }

  function buildModal() {
    const backdrop = document.createElement("div");
    backdrop.id = "jao-support-backdrop";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-labelledby", "jao-support-modal-title");

    const modal = document.createElement("div");
    modal.id = "jao-support-modal";

    const header = document.createElement("div");
    header.className = "jao-modal-header";

    const titleWrap = document.createElement("div");
    const title = document.createElement("h2");
    title.className = "jao-modal-title";
    title.id = "jao-support-modal-title";
    title.textContent = "Support & Tips";

    const sub = document.createElement("p");
    sub.className = "jao-modal-sub";
    sub.textContent = "Direct support with zero platform cuts.";

    titleWrap.appendChild(title);
    titleWrap.appendChild(sub);

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "jao-modal-close";
    closeBtn.setAttribute("aria-label", "Close support modal");
    closeBtn.textContent = "×";

    header.appendChild(titleWrap);
    header.appendChild(closeBtn);

    const list = document.createElement("div");
    list.className = "jao-modal-list";

    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "jao-modal-item";

      const left = document.createElement("div");
      left.className = "jao-item-left";

      const badge = document.createElement("div");
      badge.className = "jao-item-badge";
      badge.style.color = item.color;
      badge.textContent = item.symbol;

      const meta = document.createElement("div");
      meta.className = "jao-item-meta";

      const name = document.createElement("div");
      name.className = "jao-item-name";
      name.textContent = item.name;

      const handle = document.createElement("div");
      handle.className = "jao-item-handle";
      handle.textContent = item.display;

      meta.appendChild(name);
      meta.appendChild(handle);
      left.appendChild(badge);
      left.appendChild(meta);

      const actions = document.createElement("div");
      actions.className = "jao-item-actions";

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "jao-btn";
      copyBtn.textContent = "Copy";
      copyBtn.addEventListener("click", () => copyText(item.copyValue, copyBtn));
      actions.appendChild(copyBtn);

      if (item.url) {
        const link = document.createElement("a");
        link.className = "jao-btn";
        link.href = item.url;
        if (!item.url.startsWith("bitcoin:")) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        link.textContent = "Open";
        actions.appendChild(link);
      }

      row.appendChild(left);
      row.appendChild(actions);
      list.appendChild(row);
    });

    modal.appendChild(header);
    modal.appendChild(list);
    backdrop.appendChild(modal);

    function openModal() {
      backdrop.classList.add("jao-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function closeModal() {
      backdrop.classList.remove("jao-open");
      document.body.style.overflow = "";
    }

    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && backdrop.classList.contains("jao-open")) {
        closeModal();
      }
    });

    // Expose programmatic controls
    window.JAOSupportModal = { open: openModal, close: closeModal };

    return { backdrop, openModal, closeModal };
  }

  function mount() {
    document.head.appendChild(style);
    const { backdrop, openModal } = buildModal();
    document.body.appendChild(backdrop);

    if (!hideFab) {
      const fab = document.createElement("button");
      fab.id = "jao-support-fab";
      fab.type = "button";

      const dot = document.createElement("span");
      dot.id = "jao-support-fab-dot";

      const text = document.createElement("span");
      text.textContent = fabLabel;

      fab.appendChild(dot);
      fab.appendChild(text);
      fab.addEventListener("click", openModal);
      document.body.appendChild(fab);
    }

    if (customTriggerSelector) {
      document.querySelectorAll(customTriggerSelector).forEach((el) => {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          openModal();
        });
      });
    }

    if (autoOpen) {
      openModal();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
