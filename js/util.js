/* Shared helpers. Everything lives on window.FF. */
(function () {
  const FF = (window.FF = window.FF || {});

  FF.$ = (s, r = document) => r.querySelector(s);
  FF.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* HTML string -> element */
  FF.h = html => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };

  FF.esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => "&#" + c.charCodeAt(0) + ";");

  FF.icon = (id, cls = "i32") => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#${id}"/></svg>`;

  /* localStorage, always wrapped: private mode, blocked storage or quota can all throw */
  FF.store = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage unavailable: ignore */ } }
  };

  /* The owner's name lives in memory only: every refresh or new visit asks again.
     Also forget any name an older version of the site saved in this browser. */
  let ownerName = "";
  FF.owner = () => ownerName;
  FF.setOwner = v => { ownerName = v; };
  try { window.localStorage.removeItem("ff.owner"); } catch (e) { /* storage unavailable: nothing to forget */ }

  FF.reducedMotion = () => {
    try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; }
  };

  FF.isSmall = () => window.innerWidth <= 640;

  /* Last pointer type, so a single tap opens things on touch while mouse needs a double-click */
  FF.lastPointer = "mouse";
  window.addEventListener("pointerdown", e => { FF.lastPointer = e.pointerType || "mouse"; }, true);

  /* Win95 activation: select on press, open on double-click (mouse) / single tap (touch, pen) / Enter */
  FF.activate = (el, onOpen, onSelect) => {
    el.addEventListener("pointerdown", () => onSelect && onSelect());
    el.addEventListener("dblclick", e => { if (FF.lastPointer === "mouse") onOpen(e); });
    el.addEventListener("click", e => {
      // e.detail === 0 means keyboard (Enter / Space) activation
      if (e.detail === 0 || FF.lastPointer !== "mouse") { onSelect && onSelect(); onOpen(e); }
    });
  };

  FF.ext = name => (name.match(/\.([a-z0-9]+)$/i) || [, ""])[1].toLowerCase();

  /* Icon markup for a file-system item */
  const BANDS = { indd: ["#ec008c", "Id"], psd: ["#00aeef", "Ps"], ai: ["#fff200", "Ai"], doc: ["#000000", "W"], docx: ["#000000", "W"] };
  FF.itemKind = it => it.items ? "folder" : (it.excerpts || it.pages) ? "pdf" : it.text != null ? "txt" : it.src ? "img" : "file";
  FF.itemIcon = it => {
    const k = FF.itemKind(it);
    if (k === "folder") return FF.icon("i-folder");
    if (k === "pdf") return FF.icon("i-pdf");
    if (k === "txt") return FF.icon("i-txt");
    if (k === "img") return it.thumb ? `<img class="thumb" src="${FF.esc(it.thumb)}" alt="" loading="lazy" decoding="async">` : FF.icon("i-img");
    const e = FF.ext(it.name);
    if (e === "pdf") return FF.icon("i-pdf");
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(e)) return FF.icon("i-img");
    if (e === "txt") return FF.icon("i-txt");
    const b = BANDS[e];
    if (b) return `<svg class="i32" aria-hidden="true" style="--band:${b[0]}"><use href="#i-file"/><text x="16.5" y="21" text-anchor="middle"${b[0] === "#fff200" ? ' style="fill:#000"' : ""}>${b[1]}</text></svg>`;
    return FF.icon("i-file");
  };

  FF.plural = (n, w) => n + " " + w + (n === 1 ? "" : "s");
})();
