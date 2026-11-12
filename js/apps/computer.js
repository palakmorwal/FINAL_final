/* My Computer: "This computer belongs to:" */
(function () {
  const FF = window.FF;
  const { $, esc, icon, wm } = FF;

  FF.apps = FF.apps || {};
  FF.apps.computer = () => {
    const c = window.CONTENT.computer;
    wm.open({
      id: "computer", title: "My Computer", icon: "i-pc", width: 400, height: 292, minWidth: 260,
      body: `<div class="pc">
        <form class="pc-row" novalidate>
          ${icon("i-pc")}
          <div>
            <label for="pc-name">${esc(c.prompt)}</label>
            <input id="pc-name" class="field" maxlength="28" autocomplete="name" placeholder="Type your name" enterkeyhint="done" autofocus>
            <p class="msg" role="status"></p>
            <div class="row-btns"><button type="submit" class="btn default">OK</button><button type="button" class="btn cancel">Cancel</button></div>
          </div>
        </form>
        <fieldset class="group" aria-label="System">${c.systemInfo.map(l => `<p>${esc(l)}</p>`).join("")}</fieldset>
      </div>`,
      onInit({ el, close }) {
        const input = $("#pc-name", el), msg = $(".msg", el);
        input.value = FF.owner();
        if (FF.owner()) msg.textContent = "Registered to " + FF.owner() + ".";
        $("form", el).addEventListener("submit", e => {
          e.preventDefault();
          const v = input.value.trim().replace(/\s+/g, " ");
          if (!v) { msg.textContent = "Type a name first. The computer is shy."; input.focus(); return; }
          FF.setOwner(v);
          FF.onOwnerChange && FF.onOwnerChange(v);
          msg.textContent = "Saved. Hello, " + v + ".";
        });
        $(".cancel", el).addEventListener("click", close);
      }
    });
  };
})();
