/* File viewers: image, PDF excerpts, text, placeholder. Issue 01 is only ever shown as excerpts. */
(function () {
  const FF = window.FF;
  const { $, esc, wm } = FF;
  const key = (prefix, item) => prefix + ":" + item.name;

  function imageViewer(item) {
    wm.open({
      id: key("img", item), title: item.name + " - Imaging", icon: "i-img", width: 480, height: 520,
      body: `<div class="viewer fit"><img src="${esc(item.src)}" alt="${esc(item.alt || item.note || item.name)}" decoding="async"></div>
             <div class="statusbar"><span>${esc(item.note || item.name)}</span><span class="dim">Loading…</span></div>`,
      onInit({ el }) {
        const img = $("img", el), dim = $(".dim", el);
        const done = () => {
          dim.textContent = img.naturalWidth + " × " + img.naturalHeight;
          // landscape pictures (e.g. the moodboard) get a wider window on desktop
          if (!FF.isSmall() && img.naturalWidth > img.naturalHeight * 1.2) {
            const sw = $("#screen").clientWidth;
            el.style.width = Math.min(820, sw - 8) + "px";
            el.style.left = Math.max(0, Math.min(el.offsetLeft, sw - el.offsetWidth)) + "px";
          }
        };
        if (img.complete && img.naturalWidth) done(); else { img.addEventListener("load", done); img.addEventListener("error", () => { dim.textContent = "File not found"; }); }
        img.addEventListener("click", () => $(".viewer", el).classList.toggle("fit"));
      }
    });
  }

  /* A "PDF": either a handful of fragments of the final issue (item.excerpts),
     or every page of an earlier, non-final iteration (item.pages). */
  function excerptViewer(item) {
    const isEx = !!item.excerpts;
    const ex = isEx ? item.excerpts : item.pages.map((src, i) => ({ src, page: i + 1 }));
    const total = item.totalPages || ex.length;
    const missing = Math.max(0, total - ex.length);
    const [pw, ph] = item.pageSize || [540, 540];
    const full = !isEx || !!item.fullPages;   // whole pages (uncropped) vs square fragments
    const word = full ? "Page" : "Excerpt";
    wm.open({
      id: key("pdf", item), title: item.name + " - PDF Viewer", icon: "i-pdf", width: pw > ph ? 620 : 440, height: 600, minWidth: 260,
      body: `<div class="pdf-tools">
               <button class="btn tool prev" aria-label="Previous ${word.toLowerCase()}">&#9668;</button>
               <span class="pos" aria-live="polite">${word} 1 of ${ex.length}</span>
               <button class="btn tool next" aria-label="Next ${word.toLowerCase()}">&#9658;</button>
             </div>
             <div class="pdf-pages" tabindex="0" style="--pw:${pw > ph ? 760 : 360}px" aria-label="${esc(item.name)} ${isEx ? "excerpts" : "pages"}">
               ${ex.map((e, i) => `<figure data-i="${i}"><img src="${esc(e.src)}" alt="${isEx ? "Excerpt from page" : "Page"} ${e.page}" loading="lazy" decoding="async" width="${pw}" height="${ph}"><figcaption>${full ? "" : "excerpt · "}page ${e.page} of ${total}</figcaption></figure>`).join("")}
               ${isEx ? `<div class="pdf-end">
                 <b>End of preview.</b>
                 ${missing ? `The other ${missing} pages are not on this computer.<br>` : ""}The finished issue lives in issue 01.
               </div>` : `<div class="pdf-end"><b>End of document.</b>${esc(item.note || "")}</div>`}
             </div>
             <div class="statusbar"><span class="st">${word} 1 of ${ex.length}</span><span>${total} pages total</span></div>`,
      onInit({ el }) {
        const scroller = $(".pdf-pages", el), pos = $(".pos", el), st = $(".st", el);
        const figs = Array.from(scroller.querySelectorAll("figure"));
        let cur = 0;
        const show = i => {
          cur = i;
          const t = isEx && full ? "Page " + ex[i].page + " of " + total : word + " " + (i + 1) + " of " + ex.length;
          pos.textContent = t;
          st.textContent = isEx ? (full ? "Preview " + (i + 1) + " of " + ex.length : t + " (page " + ex[i].page + ")") : t;
        };
        // portrait pages are sized to fit the window height, so a whole page is always visible uncropped
        if (ph > pw && "ResizeObserver" in window) {
          new ResizeObserver(() => {
            const fit = Math.floor((scroller.clientHeight - 56) * pw / ph);
            scroller.style.setProperty("--pw", Math.max(160, Math.min(scroller.clientWidth - 24, fit)) + "px");
          }).observe(scroller);
        }
        const go = i => { i = Math.max(0, Math.min(figs.length - 1, i)); figs[i].scrollIntoView({ block: "start" }); show(i); };
        if ("IntersectionObserver" in window) {
          const io = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) show(+e.target.dataset.i); }, { root: scroller, rootMargin: "-45% 0px -45% 0px" });
          figs.forEach(f => io.observe(f));
        }
        $(".prev", el).onclick = () => go(cur - 1);
        $(".next", el).onclick = () => go(cur + 1);
        scroller.addEventListener("keydown", e => {
          if (e.key === "PageDown" || e.key === "ArrowRight") { e.preventDefault(); go(cur + 1); }
          if (e.key === "PageUp" || e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1); }
        });
      }
    });
  }

  function textViewer(item) {
    wm.open({
      id: key("txt", item), title: item.name + " - Notepad", icon: "i-note", width: 440, height: 380,
      body: `<textarea class="np" spellcheck="false" aria-label="${esc(item.name)}"></textarea>`,
      onInit({ el }) { $(".np", el).value = item.text; }
    });
  }

  function placeholderViewer(item) {
    wm.open({
      id: key("ph", item), title: item.name, icon: "i-file", width: 380, height: 340,
      body: `<div class="placeholder"><span class="tag">PLACEHOLDER</span><span>${esc(item.name)}</span><small>${esc(item.note || "The real file goes here.")}</small></div>
             <div class="statusbar"><span>Real asset not supplied yet</span><span>0 KB</span></div>`
    });
  }

  FF.openFile = item => {
    if (item.placeholder) return placeholderViewer(item);
    const k = FF.itemKind(item);
    if (k === "img") return imageViewer(item);
    if (k === "pdf") return excerptViewer(item);
    if (k === "txt") return textViewer(item);
    return placeholderViewer(item);
  };
})();
