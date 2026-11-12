/* Notes: README.txt in Notepad (editable, not saved). */
(function () {
  const FF = window.FF;
  const { $, wm } = FF;

  FF.apps = FF.apps || {};
  FF.apps.notes = () => {
    wm.open({
      id: "notes", title: "README.txt - Notepad", icon: "i-note", width: 500, height: 480, minWidth: 240,
      body: `<div class="menubar" aria-hidden="true"><button tabindex="-1"><u>F</u>ile</button><button tabindex="-1"><u>E</u>dit</button><button tabindex="-1"><u>S</u>earch</button><button tabindex="-1"><u>H</u>elp</button></div>
             <textarea class="np" spellcheck="false" aria-label="README.txt"></textarea>`,
      onInit({ el }) {
        const t = $(".np", el);
        t.value = window.CONTENT.notes;
        t.setSelectionRange(0, 0);
      }
    });
  };
})();
