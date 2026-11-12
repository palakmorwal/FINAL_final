/* Window manager: open / focus / minimise / maximise / close / drag / resize, taskbar sync, dialogs. */
(function () {
  const FF = window.FF;
  const { $, $$, h, esc, icon } = FF;
  const screenEl = $("#screen");
  const tasksEl = $("#tasks");
  const wins = new Map(); // id -> { el, task, opts, opener }
  let z = 10;
  let cascade = 0;
  let uid = 0;

  const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])';

  function topWindow(includeDialogs = true) {
    let best = null;
    for (const w of wins.values()) {
      if (w.el.classList.contains("minimized")) continue;
      if (!includeDialogs && w.opts.dialog) continue;
      if (!best || +w.el.style.zIndex > +best.el.style.zIndex) best = w;
    }
    return best;
  }

  function syncActive(activeId) {
    for (const [id, w] of wins) {
      const on = id === activeId;
      w.el.classList.toggle("active", on);
      if (w.task) { w.task.classList.toggle("pressed", on); w.task.setAttribute("aria-pressed", on); }
    }
  }

  function focusWin(id, moveFocus) {
    const w = wins.get(id);
    if (!w) return;
    w.el.classList.remove("minimized");
    w.el.style.zIndex = (w.opts.dialog ? 5000 : 0) + ++z;
    syncActive(id);
    if (moveFocus && !w.el.contains(document.activeElement)) focusInside(w);
  }

  function focusInside(w) {
    let target = $("[autofocus]", w.el) || $(".win-body " + FOCUSABLE.split(",").join(", .win-body "), w.el) || w.el;
    // on touch, focusing a text field pops the keyboard over the window: focus the window instead
    if (FF.lastPointer !== "mouse" && target.matches("input, textarea")) target = w.el;
    try { target.focus({ preventScroll: true }); } catch (e) { target.focus(); }
  }

  function activateTop() {
    const t = topWindow();
    if (t) focusWin(t.opts.id, true); else syncActive(null);
  }

  function minimize(id) {
    const w = wins.get(id);
    if (!w) return;
    w.el.classList.add("minimized");
    w.el.classList.remove("active");
    if (w.task) { w.task.classList.remove("pressed"); w.task.setAttribute("aria-pressed", "false"); }
    const t = topWindow();
    if (t) focusWin(t.opts.id, false); else syncActive(null);
    if (w.task) w.task.focus();
  }

  function toggleMax(id) {
    const w = wins.get(id);
    if (!w || w.opts.dialog) return;
    const on = w.el.classList.toggle("maximized");
    const b = $(".tbtn.max", w.el);
    if (b) {
      b.innerHTML = `<svg class="g-max"><use href="#${on ? "g-res" : "g-max"}"/></svg>`;
      b.setAttribute("aria-label", on ? "Restore" : "Maximize");
    }
  }

  function close(id) {
    const w = wins.get(id);
    if (!w) return;
    if (w.opts.onClose) { try { w.opts.onClose(); } catch (e) { /* keep closing */ } }
    w.el.remove();
    if (w.task) w.task.remove();
    wins.delete(id);
    const opener = w.opener;
    const t = topWindow();
    if (t) focusWin(t.opts.id, false); else syncActive(null);
    if (opener && document.contains(opener) && (!t || t.el.contains(opener))) opener.focus();
    else if (t) focusInside(t);
  }

  function place(el, opts) {
    const sw = screenEl.clientWidth, sh = screenEl.clientHeight;
    const w = Math.min(opts.width || 420, sw - 8);
    const hgt = opts.height ? Math.min(opts.height, sh - 8) : null;
    el.style.width = w + "px";
    if (hgt) el.style.height = hgt + "px";
    let left, top;
    if (opts.dialog) {
      left = (sw - w) / 2;
      top = Math.max(8, sh * 0.28 - 40);
    } else {
      const step = cascade++ % 7;
      left = Math.min(96 + step * 26, Math.max(4, sw - w - 4));
      top = Math.min(16 + step * 24, Math.max(4, sh - (hgt || 200) - 4));
    }
    el.style.left = Math.max(0, Math.round(left)) + "px";
    el.style.top = Math.max(0, Math.round(top)) + "px";
  }

  function makeDraggable(w) {
    const bar = $(".titlebar", w.el);
    bar.addEventListener("pointerdown", e => {
      if (e.button !== 0 || e.target.closest(".tbtn") || w.el.classList.contains("maximized") || FF.isSmall()) return;
      e.preventDefault();
      const sx = e.clientX - w.el.offsetLeft, sy = e.clientY - w.el.offsetTop;
      bar.setPointerCapture(e.pointerId);
      const move = m => {
        const sw = screenEl.clientWidth, sh = screenEl.clientHeight;
        const x = Math.min(sw - 48, Math.max(48 - w.el.offsetWidth, m.clientX - sx));
        const y = Math.min(sh - 24, Math.max(0, m.clientY - sy));
        w.el.style.left = x + "px";
        w.el.style.top = y + "px";
      };
      const up = () => { bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", up); bar.removeEventListener("pointercancel", up); };
      bar.addEventListener("pointermove", move);
      bar.addEventListener("pointerup", up);
      bar.addEventListener("pointercancel", up);
    });
    bar.addEventListener("dblclick", e => { if (!e.target.closest(".tbtn") && !FF.isSmall()) toggleMax(w.opts.id); });

    const grip = $(".grip", w.el);
    if (!grip) return;
    grip.addEventListener("pointerdown", e => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      grip.setPointerCapture(e.pointerId);
      const sx = e.clientX, sy = e.clientY, ow = w.el.offsetWidth, oh = w.el.offsetHeight;
      const move = m => {
        w.el.style.width = Math.max(w.opts.minWidth || 220, ow + m.clientX - sx) + "px";
        w.el.style.height = Math.max(w.opts.minHeight || 140, oh + m.clientY - sy) + "px";
      };
      const up = () => { grip.removeEventListener("pointermove", move); grip.removeEventListener("pointerup", up); grip.removeEventListener("pointercancel", up); };
      grip.addEventListener("pointermove", move);
      grip.addEventListener("pointerup", up);
      grip.addEventListener("pointercancel", up);
    });
  }

  /* opts: { id, title, icon, width, height, body (html string), dialog, resizable, menu, onInit(winEl, api), onClose } */
  function open(opts) {
    if (wins.has(opts.id)) { focusWin(opts.id, true); return wins.get(opts.id); }
    const tid = "wt" + ++uid;
    const ic = opts.icon ? icon(opts.icon, "s16") : "";
    const btns = opts.dialog
      ? `<button class="tbtn gap" data-act="close" aria-label="Close"><svg class="g-x"><use href="#g-x"/></svg></button>`
      : `<button class="tbtn" data-act="min" aria-label="Minimize"><svg class="g-min"><use href="#g-min"/></svg></button><button class="tbtn max" data-act="max" aria-label="Maximize"><svg class="g-max"><use href="#g-max"/></svg></button><button class="tbtn gap" data-act="close" aria-label="Close"><svg class="g-x"><use href="#g-x"/></svg></button>`;
    const el = h(`<section class="win${opts.dialog ? " dialog" : ""}" role="dialog" aria-labelledby="${tid}" tabindex="-1" data-win="${esc(opts.id)}">
      <div class="titlebar">${ic}<span class="title" id="${tid}">${esc(opts.title)}</span><span class="tbtns">${btns}</span></div>
      <div class="win-body">${opts.body || ""}</div>
      ${opts.dialog || opts.resizable === false ? "" : '<span class="grip" aria-hidden="true"></span>'}
    </section>`);
    const w = { el, opts, opener: document.activeElement && document.activeElement !== document.body ? document.activeElement : null, task: null };
    if (!opts.dialog) {
      w.task = h(`<button class="btn task" aria-pressed="false">${ic}<span>${esc(opts.title)}</span></button>`);
      w.task.addEventListener("click", () => {
        const minimized = el.classList.contains("minimized");
        if (!minimized && el.classList.contains("active")) minimize(opts.id); else focusWin(opts.id, true);
      });
      tasksEl.append(w.task);
    }
    wins.set(opts.id, w);
    screenEl.append(el);
    place(el, opts);
    el.addEventListener("pointerdown", () => { if (!el.classList.contains("active")) focusWin(opts.id, false); });
    el.addEventListener("focusin", () => { if (!el.classList.contains("active")) focusWin(opts.id, false); });
    $(".tbtns", el).addEventListener("click", e => {
      const b = e.target.closest(".tbtn");
      if (!b) return;
      const a = b.dataset.act;
      if (a === "close") close(opts.id); else if (a === "min") minimize(opts.id); else if (a === "max") toggleMax(opts.id);
    });
    makeDraggable(w);
    focusWin(opts.id, false);
    const api = { el, body: $(".win-body", el), close: () => close(opts.id), setTitle: t => { $(".title", el).textContent = t; if (w.task) $("span", w.task).textContent = t; } };
    w.api = api;
    if (opts.onInit) opts.onInit(api);
    focusInside(w);
    return w;
  }

  /* Win95 message box. buttons: [{ label, action, cancel }] */
  function dialog({ title, message, icon: ic = "i-warn", buttons = [{ label: "OK" }] }) {
    const id = "dlg" + ++uid;
    const cancelIdx = Math.max(0, buttons.findIndex(b => b.cancel));
    open({
      id, title, dialog: true, width: 340,
      body: `<div class="dlg">${icon(ic)}<p>${message}</p></div><div class="dlg-btns">${buttons.map((b, i) => `<button class="btn${i === 0 ? " default" : ""}"${i === 0 ? " autofocus" : ""} data-i="${i}">${esc(b.label)}</button>`).join("")}</div>`,
      onInit(api) {
        api.el.dataset.cancel = cancelIdx;
        $$(".dlg-btns .btn", api.el).forEach(btn => btn.addEventListener("click", () => {
          const b = buttons[+btn.dataset.i];
          close(id);
          if (b.action) b.action();
        }));
      }
    });
  }

  /* Esc closes the window on top (dialogs choose their cancel button). */
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape" || e.defaultPrevented) return;
    if (!$("#boot").hidden) return;
    const t = topWindow();
    if (!t) return;
    e.preventDefault();
    if (t.opts.dialog) {
      const btn = $(`.dlg-btns .btn[data-i="${t.el.dataset.cancel || 0}"]`, t.el);
      if (btn) { btn.click(); return; }
    }
    close(t.opts.id);
  });

  /* keep windows reachable after the viewport shrinks (rotation, resize) */
  window.addEventListener("resize", () => {
    const sw = screenEl.clientWidth, sh = screenEl.clientHeight;
    for (const w of wins.values()) {
      if (w.el.offsetLeft > sw - 48) w.el.style.left = Math.max(0, sw - w.el.offsetWidth) + "px";
      if (w.el.offsetTop > sh - 24) w.el.style.top = Math.max(0, sh - w.el.offsetHeight) + "px";
    }
  });

  FF.wm = { open, close, closeAll: () => Array.from(wins.keys()).forEach(close), focus: id => focusWin(id, true), dialog, has: id => wins.has(id), get: id => wins.get(id) };
})();
