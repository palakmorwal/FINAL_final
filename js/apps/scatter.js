/* FINAL_final folder, the "(2)" way: no window. The folder's contents spill out across the
   desktop as rotated icons that pop in one by one, glitch (CMYK ghosts) when they appear
   and while you drag them. Tap / click without dragging opens. A bar top-right has Up, the
   path and ×. Folders re-scatter their own contents. */
(function () {
  const FF = window.FF;
  const { $, h, esc } = FF;

  const screenEl = $("#screen");
  const layer = h(`<div id="scatter" aria-label="FINAL_final folder" role="group" hidden></div>`);
  const bar = h(`<div id="scatter-bar" hidden>
      <button class="btn slim" id="sc-up">&#9668; Up</button>
      <span id="sc-path" class="field" aria-live="polite"></span>
      <button class="btn slim" id="sc-x" aria-label="Close FINAL_final">&times;</button>
    </div>`);
  screenEl.append(layer, bar);

  const INKS = ["f-c", "f-m", "f-y", "f-k"];
  const W = 100, H = 108;           // icon cell size
  let path = [], timers = [], ink = 0, topZ = 1;

  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

  function ghost(el, rot) {
    if (FF.reducedMotion()) return;
    const g = h(`<div class="sc-ghost" aria-hidden="true">${el.querySelector(".sc-ic").innerHTML}</div>`);
    g.style.left = el.offsetLeft + (Math.random() * 18 - 9) + "px";
    g.style.top = el.offsetTop + (Math.random() * 18 - 9) + "px";
    g.style.setProperty("--r", rot + "deg");
    g.style.setProperty("--ink", `url(#${INKS[ink++ % 4]})`);
    layer.insertBefore(g, layer.firstChild);
    g.addEventListener("animationend", () => g.remove());
  }

  function scatter(items) {
    clearTimers();
    layer.innerHTML = "";
    const lw = layer.clientWidth, lh = layer.clientHeight;
    const x0 = Math.min(100, lw * 0.25);                // keep the desktop icon column visible
    const aw = lw - x0, ah = lh - 48;
    const cols = Math.max(1, Math.floor(aw / W));
    const rows = Math.max(1, Math.ceil(items.length / cols));
    const cw = aw / cols, ch = Math.min(H * 1.3, ah / rows);
    const cells = items.map((_, i) => i).sort(() => Math.random() - 0.5);
    const rm = FF.reducedMotion();

    if (!items.length) {
      layer.append(h(`<p class="sc-empty">This folder is empty.</p>`));
      return;
    }

    items.forEach((it, i) => {
      const rot = (Math.random() - 0.5) * 40;
      const el = h(`<div class="sc-item" role="button" tabindex="0" aria-label="Open ${esc(it.name)}"><span class="sc-ic">${FF.itemIcon(it)}</span><span class="lbl">${esc(it.name)}</span></div>`);
      const c = cells[i];
      const x = Math.min(lw - W, x0 + (c % cols) * cw + Math.random() * Math.max(0, cw - W));
      const y = Math.min(lh - H, 48 + Math.floor(c / cols) * ch + Math.random() * Math.max(0, ch - H));
      el.style.left = Math.max(0, x) + "px";
      el.style.top = Math.max(0, y) + "px";
      el.style.setProperty("--r", rot + "deg");
      el.style.zIndex = i + 1;
      layer.append(el);
      timers.push(setTimeout(() => { el.classList.add("v"); ghost(el, rot); ghost(el, rot); }, rm ? 0 : i * 70 + 60));

      // drag, or tap to open
      let down = false, moved = false, sx, sy, ox, oy, lx, ly;
      el.addEventListener("pointerdown", e => {
        if (!el.classList.contains("v") || e.button > 0) return;
        down = true; moved = false;
        sx = lx = e.clientX; sy = ly = e.clientY;
        ox = e.clientX - el.offsetLeft; oy = e.clientY - el.offsetTop;
        el.style.zIndex = ++topZ + 100;
        el.classList.add("drag");
        el.setPointerCapture(e.pointerId);
      });
      el.addEventListener("pointermove", e => {
        if (!down) return;
        if (Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 6) moved = true;
        if (!moved) return;
        el.style.left = Math.max(0, Math.min(layer.clientWidth - W, e.clientX - ox)) + "px";
        el.style.top = Math.max(0, Math.min(layer.clientHeight - H, e.clientY - oy)) + "px";
        if (Math.hypot(e.clientX - lx, e.clientY - ly) > 16) { lx = e.clientX; ly = e.clientY; ghost(el, rot); }
      });
      el.addEventListener("pointerup", () => { if (!down) return; down = false; el.classList.remove("drag"); if (!moved) open(it); });
      el.addEventListener("pointercancel", () => { down = false; el.classList.remove("drag"); });
      el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(it); } });
    });
  }

  function render(focus) {
    const cur = path[path.length - 1];
    $("#sc-path").textContent = "C:\\" + path.map(p => p.name).join("\\");
    $("#sc-up").innerHTML = path.length > 1 ? "&#9668; Up" : "&#9668; Desktop";
    scatter(cur.items);
    if (focus) {
      const t = setTimeout(() => { const f = layer.querySelector(".sc-item"); if (f) f.focus({ preventScroll: true }); }, FF.reducedMotion() ? 0 : 120);
      timers.push(t);
    }
  }

  function open(it) {
    if (it.items) { path.push(it); render(true); } else FF.openFile(it);
  }

  function show() {
    path = [window.CONTENT.folder];
    layer.hidden = false;
    bar.hidden = false;
    render(true);
  }
  function close() {
    if (layer.hidden) return;
    clearTimers();
    layer.innerHTML = "";
    layer.hidden = true;
    bar.hidden = true;
    path = [];
    const icon = document.querySelector('.dicon[aria-label="FINAL_final"]');
    if (icon) icon.focus();
  }

  $("#sc-up").addEventListener("click", () => { if (path.length > 1) { path.pop(); render(true); } else close(); });
  $("#sc-x").addEventListener("click", close);

  // Esc closes the scatter only when no window is open on top of it
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape" || layer.hidden || e.defaultPrevented) return;
    if (document.querySelector("#screen > .win:not(.minimized)")) return;
    e.preventDefault();
    close();
  });

  // keep icons on screen when the viewport shrinks
  window.addEventListener("resize", () => {
    if (layer.hidden) return;
    for (const el of layer.querySelectorAll(".sc-item")) {
      el.style.left = Math.min(el.offsetLeft, Math.max(0, layer.clientWidth - W)) + "px";
      el.style.top = Math.min(el.offsetTop, Math.max(0, layer.clientHeight - H)) + "px";
    }
  });

  FF.apps = FF.apps || {};
  FF.apps.folder = () => { if (layer.hidden) show(); else render(true); };
  FF.closeScatter = close;
})();
