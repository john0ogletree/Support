(function () {
  const scriptEl = document.currentScript;
  if (!scriptEl) return;

  const METHODS = [
    {
      id: "cashapp",
      name: "Cash App",
      symbol: "$",
      color: "#00d632",
      value: "$john0ogletree",
      compact: false
    },
    {
      id: "paypal",
      name: "PayPal",
      symbol: "P",
      color: "#0079c1",
      value: "@john0ogletree",
      compact: false
    },
    {
      id: "venmo",
      name: "Venmo",
      symbol: "V",
      color: "#008cff",
      value: "@john0ogletree",
      compact: false
    },
    {
      id: "chime",
      name: "Chime",
      symbol: "C",
      color: "#22c55e",
      value: "$john0ogletree",
      compact: false
    },
    {
      id: "btc",
      name: "Bitcoin",
      symbol: "₿",
      color: "#f7931a",
      value: "bc1qaxhgg96jfvw3fe0n4qt0uzyxj87p45sa2q9whw",
      compact: true
    }
  ];

  const intervalMs = Math.max(
    2000,
    parseInt(scriptEl.getAttribute("data-interval") || "6000", 10) || 6000
  );
  const position = (scriptEl.getAttribute("data-position") || "bottom-left").toLowerCase();
  const onlyAttr = scriptEl.getAttribute("data-only");
  const filterList = onlyAttr
    ? onlyAttr.toLowerCase().split(",").map((s) => s.trim()).filter(Boolean)
    : null;

  const list = filterList
    ? METHODS.filter((m) => filterList.includes(m.id))
    : METHODS;
  const items = list.length > 0 ? list : METHODS;

  const POSITIONS = {
    "bottom-left": "bottom:clamp(12px,2vw,32px);left:clamp(12px,2vw,32px);top:auto;right:auto;",
    "bottom-right": "bottom:clamp(12px,2vw,32px);right:clamp(12px,2vw,32px);top:auto;left:auto;",
    "top-left": "top:clamp(12px,2vw,32px);left:clamp(12px,2vw,32px);bottom:auto;right:auto;",
    "top-right": "top:clamp(12px,2vw,32px);right:clamp(12px,2vw,32px);bottom:auto;left:auto;"
  };
  const posCss = POSITIONS[position] || POSITIONS["bottom-left"];

  const style = document.createElement("style");
  style.textContent = `
    #jao-support-overlay {
      position: fixed;
      ${posCss}
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: clamp(10px, 1.4vw, 18px);
      background: rgba(11, 13, 18, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-left: 5px solid var(--jao-accent, #00d632);
      border-radius: clamp(10px, 1.2vw, 16px);
      padding: clamp(10px, 1.3vw, 16px) clamp(14px, 2vw, 24px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55);
      max-width: min(92vw, 680px);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif;
      color: #f3f5f8;
      pointer-events: none;
      box-sizing: border-box;
      transition: border-left-color 0.4s ease, opacity 0.35s ease, transform 0.35s ease;
    }
    #jao-support-overlay.jao-switching {
      opacity: 0;
      transform: translateY(6px);
    }
    #jao-support-icon {
      width: clamp(32px, 3.2vw, 46px);
      height: clamp(32px, 3.2vw, 46px);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: clamp(1rem, 1.7vw, 1.35rem);
      background: rgba(255, 255, 255, 0.08);
      color: var(--jao-accent, #00d632);
      flex-shrink: 0;
    }
    #jao-support-body {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    #jao-support-label {
      font-size: clamp(0.7rem, 1vw, 0.9rem);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #9aa3b2;
      font-weight: 700;
    }
    #jao-support-value {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: clamp(0.92rem, 1.7vw, 1.5rem);
      font-weight: 700;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #jao-support-value.jao-btc {
      font-size: clamp(0.72rem, 1.2vw, 1.05rem);
    }
  `;

  const host = document.createElement("div");
  host.id = "jao-support-overlay";
  host.setAttribute("role", "region");
  host.setAttribute("aria-live", "polite");

  const icon = document.createElement("div");
  icon.id = "jao-support-icon";

  const body = document.createElement("div");
  body.id = "jao-support-body";

  const label = document.createElement("span");
  label.id = "jao-support-label";

  const value = document.createElement("span");
  value.id = "jao-support-value";

  body.appendChild(label);
  body.appendChild(value);
  host.appendChild(icon);
  host.appendChild(body);

  function mount() {
    document.head.appendChild(style);
    document.body.appendChild(host);

    let idx = 0;
    function render(item) {
      host.style.setProperty("--jao-accent", item.color);
      icon.textContent = item.symbol;
      label.textContent = "Support via " + item.name;
      value.textContent = item.value;
      value.classList.toggle("jao-btc", Boolean(item.compact));
    }

    render(items[0]);

    if (items.length > 1) {
      setInterval(() => {
        host.classList.add("jao-switching");
        setTimeout(() => {
          idx = (idx + 1) % items.length;
          render(items[idx]);
          host.classList.remove("jao-switching");
        }, 350);
      }, intervalMs);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
