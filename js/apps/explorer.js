/* Explorer window (FINAL_final folder and Recycle Bin), modelled on the Win95 "C:\" window. */
(function () {
  const FF = window.FF;
  const { $, $$, esc, icon, wm } = FF;

  const kindLabel = it => {
    if (it.placeholder) return "Placeholder";
    const k = FF.itemKind(it);
    return k === "folder" ? "File Folder" : k === "pdf" ? (it.excerpts ? "PDF, " + FF.plural(it.excerpts.length, "excerpt") : "PDF, " + FF.plural(it.pages.length, "page")) : k === "img" ? "Image" : k === "txt" ? "Text Document" : "File";
  };

  function explorer({ id, title, winIcon, root, bin }) {
    wm.open({
      id, title, icon: winIcon, width: 560, height: 420, minWidth: 260, minHeight: 200,
      body: `<div class="menubar" aria-hidden="true"><button tabindex="-1"><u>F</u>ile</button><button tabindex="-1"><u>E</u>dit</button><button tabindex="-1"><u>V</u>iew</button><button tabindex="-1"><u>H</u>elp</button></div>
        <div class="ex-tools">
          <div class="combo">${icon("s-drive", "s16")}<input class="addr" readonly aria-label="Address"><button class="btn drop" aria-label="Go up one level"><svg><use href="#g-down"/></svg></button></div>
          <button class="btn tool up" aria-label="Up one level" title="Up One Level">${icon("s-up", "s16")}</button>
          ${bin ? '<button class="btn slim empty">Empty Recycle Bin</button>' : ""}
        </div>
        <div class="ex-list" role="list" aria-label="${esc(title)} contents"></div>
        <div class="statusbar"><span class="st-l"></span><span class="st-r"></span></div>`,
      onInit({ el, setTitle }) {
        const path = [root];
        const list = $(".ex-list", el), addr = $(".addr", el), stL = $(".st-l", el), stR = $(".st-r", el);
        let sel = -1;

        const status = () => {
          const cur = path[path.length - 1];
          const items = cur.items;
          const ph = items.filter(i => i.placeholder).length;
          if (sel >= 0 && items[sel]) {
            stL.textContent = items[sel].name + (items[sel].note && !items[sel].placeholder ? " — " + items[sel].note : "");
            stR.textContent = kindLabel(items[sel]);
          } else {
            stL.textContent = items.length
              ? FF.plural(items.length, "object") + (ph ? ` (${ph} placeholder${ph === 1 ? "" : "s"})` : "")
              : bin ? "Recycle Bin is empty. Nothing is ever truly deleted." : "This folder is empty.";
            stR.textContent = bin ? "Recycle Bin" : "FINAL_final";
          }
        };

        const select = i => {
          sel = i;
          $$(".ex-item", list).forEach((b, j) => b.classList.toggle("selected", j === i));
          status();
        };

        const render = (focusFirst) => {
          const cur = path[path.length - 1];
          sel = -1;
          addr.value = "C:\\" + path.map(p => p.name).join("\\");
          setTitle(path.length > 1 ? cur.name : title);
          $(".up", el).disabled = path.length < 2;
          $(".drop", el).disabled = path.length < 2;
          list.innerHTML = cur.items.length
            ? cur.items.map((it, i) => `<div role="listitem"><button class="ex-item" data-i="${i}" aria-label="${esc(it.name)}, ${esc(kindLabel(it))}">${FF.itemIcon(it)}<span class="lbl">${esc(it.name)}</span></button></div>`).join("")
            : `<p class="ex-empty">${bin ? "Empty. They deserved better." : "This folder is empty."}</p>`;
          // listitem wrappers should not break the grid
          $$('[role="listitem"]', list).forEach(d => (d.style.display = "contents"));
          $$(".ex-item", list).forEach(b => {
            const i = +b.dataset.i;
            FF.activate(b, () => openAt(i), () => select(i));
            b.addEventListener("focus", () => select(i));
          });
          list.scrollTop = 0;
          status();
          if (focusFirst) { const f = $(".ex-item", list); if (f) f.focus(); }
        };

        const openAt = i => {
          const it = path[path.length - 1].items[i];
          if (!it) return;
          if (it.items) { path.push(it); render(true); } else FF.openFile(it);
        };
        const up = () => { if (path.length > 1) { path.pop(); render(true); } };

        $(".up", el).addEventListener("click", up);
        $(".drop", el).addEventListener("click", up);
        list.addEventListener("pointerdown", e => { if (!e.target.closest(".ex-item")) select(-1); });

        // arrow keys move through the icon grid, Backspace goes up
        list.addEventListener("keydown", e => {
          const items = $$(".ex-item", list);
          const i = items.indexOf(document.activeElement);
          if (e.key === "Backspace") { e.preventDefault(); up(); return; }
          if (i < 0 || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) return;
          e.preventDefault();
          const cols = Math.max(1, items.filter(b => b.offsetTop === items[0].offsetTop).length);
          let j = i;
          if (e.key === "ArrowLeft") j = i - 1;
          if (e.key === "ArrowRight") j = i + 1;
          if (e.key === "ArrowUp") j = i - cols;
          if (e.key === "ArrowDown") j = i + cols;
          if (e.key === "Home") j = 0;
          if (e.key === "End") j = items.length - 1;
          if (items[j]) items[j].focus();
        });

        if (bin) {
          $(".empty", el).addEventListener("click", () => {
            if (!root.items.length) {
              wm.dialog({ title: "Recycle Bin", icon: "i-info", message: "The Recycle Bin is already empty. You really let go." });
              return;
            }
            wm.dialog({
              title: "Confirm File Delete", icon: "i-warn",
              message: `Are you sure you want to delete all ${FF.plural(root.items.length, "item")} in the Recycle Bin? They deserved better.`,
              buttons: [{ label: "Yes", action: () => { root.items = []; path.length = 1; render(false); } }, { label: "No", cancel: true }]
            });
          });
        }
        render(false);
      }
    });
  }

  /* deep copy so "Empty Recycle Bin" never touches CONTENT itself */
  const clone = o => JSON.parse(JSON.stringify(o));
  let binState = null;

  FF.apps = FF.apps || {};
  FF.apps.folder = () => explorer({ id: "folder", title: window.CONTENT.folder.name, winIcon: "i-ff", root: window.CONTENT.folder });
  FF.apps.bin = () => {
    if (!binState) binState = clone(window.CONTENT.bin);
    explorer({ id: "bin", title: "Recycle Bin", winIcon: "i-bin", root: binState, bin: true });
  };
  FF.resetBin = () => { binState = null; };
})();
