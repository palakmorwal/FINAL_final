/* Desktop icons, Start menu, clock and the boot / shut down sequence. */
(function () {
  const FF = window.FF;
  const { $, $$, h, esc, icon, wm } = FF;

  const APPS = [
    { id: "computer", label: "My Computer", icon: "i-pc", open: () => FF.apps.computer() },
    { id: "bin", label: "Recycle Bin", icon: "i-bin", open: () => FF.apps.bin() },
    { id: "instagram", label: "Internet Explorer", icon: "i-ie", open: () => FF.apps.instagram() },
    { id: "folder", label: "FINAL_final", icon: "i-ff", open: () => FF.apps.folder() },
    { id: "notes", label: "Notes", icon: "i-note", open: () => FF.apps.notes() }
  ];

  /* ---------- desktop icons ---------- */
  const desk = $("#desktop");
  const selectIcon = btn => $$(".dicon", desk).forEach(b => b.classList.toggle("selected", b === btn));
  APPS.forEach(a => {
    const li = h(`<li><button class="dicon" aria-label="${esc(a.label)}">${icon(a.icon)}<span class="lbl">${esc(a.label)}</span></button></li>`);
    const btn = $("button", li);
    FF.activate(btn, a.open, () => selectIcon(btn));
    btn.addEventListener("focus", () => selectIcon(btn));
    desk.append(li);
  });
  $("#screen").addEventListener("pointerdown", e => { if (e.target === desk || e.target.id === "screen") selectIcon(null); });
  desk.addEventListener("keydown", e => {
    const items = $$(".dicon", desk);
    const i = items.indexOf(document.activeElement);
    if (i < 0) return;
    const j = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: items.length - 1 }[e.key];
    if (j == null) return;
    e.preventDefault();
    if (items[j]) items[j].focus();
  });

  /* ---------- start menu ---------- */
  const sm = $("#startmenu"), startBtn = $("#start");
  sm.innerHTML = `<div class="sm-banner" aria-hidden="true"><b>FINAL_final</b>98</div>
    <div class="sm-list">
      <p class="sm-owner" id="sm-owner"></p>
      ${APPS.map((a, i) => `<button class="sm-item" data-i="${i}">${icon(a.icon, "i32")}${esc(a.label)}</button>`).join("")}
      <hr class="etched">
      <button class="sm-item" data-i="shutdown">${icon("s-power", "i32")}Shut Down…</button>
    </div>`;
  const setMenu = open => {
    sm.hidden = !open;
    startBtn.classList.toggle("pressed", open);
    startBtn.setAttribute("aria-expanded", open);
    if (open) $(".sm-item", sm).focus();
  };
  startBtn.addEventListener("click", () => setMenu(sm.hidden));
  sm.addEventListener("click", e => {
    const b = e.target.closest(".sm-item");
    if (!b) return;
    setMenu(false);
    if (b.dataset.i === "shutdown") {
      wm.dialog({
        title: "Shut Down FINAL_final", icon: "i-warn",
        message: "Are you sure you want to shut down your computer?<br>Any unsaved FINAL_final_v8 will be lost.",
        buttons: [{ label: "Yes", action: () => boot(true) }, { label: "No", cancel: true }]
      });
    } else APPS[+b.dataset.i].open();
  });
  sm.addEventListener("keydown", e => {
    const items = $$(".sm-item", sm);
    const i = items.indexOf(document.activeElement);
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); setMenu(false); startBtn.focus(); }
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length].focus(); }
    else if (e.key === "Tab") setMenu(false);
  });
  document.addEventListener("pointerdown", e => { if (!sm.hidden && !e.target.closest("#startmenu, #start")) setMenu(false); });

  const showOwner = () => { const o = FF.owner(); $("#sm-owner").textContent = o ? o + "’s computer" : "Unregistered computer"; };
  FF.onOwnerChange = showOwner;
  showOwner();

  /* ---------- clock ---------- */
  const clock = $("#clock");
  const tick = () => {
    const d = new Date();
    clock.textContent = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    clock.dateTime = d.toISOString();
  };
  tick();
  setInterval(tick, 15000);

  /* ---------- boot / preloader ---------- */
  const bootEl = $("#boot"), bar = $("#boot-bar"), msg = $("#boot-msg"), cancel = $("#boot-cancel");
  const BLOCKS = 18;
  bar.innerHTML = "<i></i>".repeat(BLOCKS);
  const blocks = $$("i", bar);
  let timer = null, filled = 0;

  const setFill = n => {
    filled = n;
    blocks.forEach((b, i) => b.classList.toggle("on", i < n));
    bar.setAttribute("aria-valuenow", Math.round((n / BLOCKS) * 100));
  };
  const finish = () => {
    bootEl.hidden = true;
    document.body.removeAttribute("aria-busy");
    const first = $(".dicon", desk);
    if (first) first.focus();
  };
  const step = () => {
    if (filled < BLOCKS) {
      setFill(filled + 1);
      // irregular, like real 1998 progress bars: quick start, a stall around 2/3, then a rush
      const d = filled === 12 ? 520 : filled > 12 ? 70 + Math.random() * 110 : 90 + Math.random() * 190;
      timer = setTimeout(step, d);
    } else timer = setTimeout(finish, 450);
  };

  function boot(again) {
    clearTimeout(timer);
    sm.hidden = true;
    if (again) { wm.closeAll(); FF.resetBin && FF.resetBin(); FF.closeScatter && FF.closeScatter(); }
    document.body.setAttribute("aria-busy", "true");
    bootEl.hidden = false;
    msg.textContent = again ? "Restarting… just kidding. Initializing…" : "Initializing…";
    setFill(0);
    cancel.focus();
    if (FF.reducedMotion()) {
      // no animated fill: show the dialog briefly, full, then continue
      setFill(BLOCKS);
      timer = setTimeout(finish, 900);
    } else timer = setTimeout(step, 300);
  }
  cancel.addEventListener("click", () => {
    clearTimeout(timer);
    setFill(0);
    msg.textContent = "Cancel is not supported. Initializing…";
    timer = setTimeout(step, 400);
  });

  // index.html?skipboot skips the preloader (handy while editing content)
  if (/[?&]skipboot\b/.test(location.search)) finish(); else boot(false);
})();
