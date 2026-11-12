/* Internet Explorer: a reimagined Instagram profile in Win95 chrome (after refs/4-instagram-window.png). */
(function () {
  const FF = window.FF;
  const { $, esc, icon, wm } = FF;

  /* session state survives closing and reopening the window */
  let state = null;
  const init = () => {
    const ig = window.CONTENT.instagram;
    state = {
      following: false,
      tab: "grid",       // grid | list | pin | tag
      view: "profile",   // profile | post
      post: -1,
      posts: ig.posts.map(p => ({ liked: false, comments: (p.comments || []).slice() }))
    };
  };

  const fmt = n => n >= 10000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : n.toLocaleString("en-US");
  const disk2 = () => wm.dialog({ title: "Instagram.exe", icon: "i-err", message: "This feature requires Disk 2.<br>Please insert Disk 2 and try again." });

  function media(p, i, big) {
    if (p.src) return `<img src="${esc(p.src)}" alt="${esc(p.alt || "Post " + (i + 1))}" ${big ? "" : 'loading="lazy"'} decoding="async">`;
    return `<span class="txt" style="background:${esc(p.bg || "var(--yellow)")};color:${esc(p.fg || "var(--magenta)")}">${esc(p.text || "")}</span>`;
  }

  function postCard(ig, p, i, s, full) {
    const likes = (p.likes || 0) + (s.liked ? 1 : 0);
    const comments = full ? s.comments : s.comments.slice(-2);
    return `<article class="ig-post" data-i="${i}" aria-label="Post ${i + 1} of ${ig.posts.length}">
      <div class="ig-post-top"><span class="mini"><img src="${esc(ig.avatar)}" alt=""></span>${esc(ig.username)}</div>
      <div class="ig-media" data-like="${i}">${media(p, i, full)}<svg class="pop" aria-hidden="true"><use href="#n-heart"/></svg></div>
      <div class="ig-actions">
        <button class="btn slim like${s.liked ? " on pressed" : ""}" data-like-btn="${i}" aria-pressed="${s.liked}">${icon("n-heart", "s16")}${s.liked ? "Liked" : "Like"}</button>
        ${full ? "" : `<button class="btn slim" data-open="${i}">Comment</button>`}
        <span><b>${fmt(likes)}</b> ${likes === 1 ? "like" : "likes"}</span>
      </div>
      <div class="ig-cap selectable">
        <p><b>${esc(ig.username)}</b> <span class="comic">${esc(p.caption || "")}</span></p>
        ${comments.map(c => `<p><b>${esc(c[0])}</b> ${esc(c[1])}</p>`).join("")}
        ${!full && s.comments.length > 2 ? `<p><button class="btn slim" data-open="${i}">View all ${s.comments.length} comments</button></p>` : ""}
        ${p.when ? `<p class="when">${esc(p.when)}</p>` : ""}
      </div>
      ${full ? `<form class="ig-comment" novalidate><input class="field" maxlength="220" placeholder="Add a comment as ${esc(FF.owner() || "guest")}…" aria-label="Add a comment" enterkeyhint="send"><button class="btn slim" type="submit">Post</button></form>` : ""}
    </article>`;
  }

  function render(el) {
    const ig = window.CONTENT.instagram;
    const sc = $(".ig-scroll", el);
    const nav = (n, ic, label) => `<button class="btn${(n === "profile" && state.view === "profile" && state.tab !== "list") || (n === "home" && state.view === "profile" && state.tab === "list") ? " pressed" : ""}" data-nav="${n}" aria-label="${label}">${icon(ic, "")}</button>`;
    $(".ig-nav", el).innerHTML = nav("home", "n-home", "Home feed") + nav("search", "n-search", "Search") + nav("camera", "n-cam", "Camera") + nav("activity", "n-heart", "Activity") + nav("profile", "n-user", "Profile");

    const head = $(".ig-fixed", el);
    head.hidden = state.view === "post";
    if (state.view === "post") {
      const i = state.post;
      head.innerHTML = "";
      sc.innerHTML =`<div class="ig-back"><button class="btn slim" data-back>&#9668; Back</button><b>Post ${i + 1} of ${ig.posts.length}</b></div>` + postCard(ig, ig.posts[i], i, state.posts[i], true);
      return;
    }

    const tab = (t, ic, label) => `<button class="btn${state.tab === t ? " pressed" : ""}" data-tab="${t}" aria-label="${label}" aria-pressed="${state.tab === t}">${icon(ic, "")}</button>`;
    let content;
    if (state.tab === "grid") {
      content = `<div class="ig-grid">${ig.posts.map((p, i) => `<button class="ig-tile" data-open="${i}" aria-label="Open post ${i + 1}: ${esc(p.alt || p.caption || "")}">${media(p, i)}</button>`).join("")}</div>`;
    } else if (state.tab === "list") {
      content = ig.posts.map((p, i) => postCard(ig, p, i, state.posts[i], false)).join("");
    } else if (state.tab === "pin") {
      content = `<div class="ig-empty"><b>No locations</b>Every post was made at the same desk, at 3 a.m.</div>`;
    } else {
      content = `<div class="ig-empty"><b>Photos of you</b>When people tag you, they'll show up here. Nobody has tagged ${esc(FF.owner() || "you")}. Yet.</div>`;
    }
    const followers = ig.followers + (state.following ? 1 : 0);
    head.innerHTML = `
      <h2 class="ig-user">${esc(ig.username)}</h2>
      <hr class="etched">
      <div class="ig-head">
        <span class="ig-avatar"><img src="${esc(ig.avatar)}" alt="${esc(ig.displayName)} profile picture"></span>
        <div class="ig-side">
          <div class="ig-stats">
            <span><b>${ig.posts.length}</b>posts</span>
            <span><b>${fmt(followers)}</b>followers</span>
            <span><b>${fmt(ig.following)}</b>following</span>
          </div>
          <div class="ig-follow">
            <button class="btn${state.following ? " pressed" : ""}" data-follow aria-pressed="${state.following}">${state.following ? "Following" : "+ Follow"}</button>
            <button class="btn drop" data-more aria-label="More options"><svg><use href="#g-down"/></svg></button>
          </div>
        </div>
      </div>
      <div class="ig-bio selectable"><b>${esc(ig.displayName)}</b>${ig.bio.map(l => `<p class="comic">${esc(l)}</p>`).join("")}</div>
      <hr class="etched">
      <div class="ig-tabs" role="toolbar" aria-label="Profile views">${tab("grid", "t-grid", "Grid")}${tab("list", "t-list", "List")}${tab("pin", "t-pin", "Places")}${tab("tag", "t-tag", "Tagged")}</div>`;
    sc.innerHTML = content;
  }

  function like(el, i, fromMedia) {
    const s = state.posts[i];
    if (fromMedia && s.liked) { pop(el, i); return; } // double-tap only ever likes
    s.liked = !s.liked;
    const top = $(".ig-scroll", el).scrollTop;
    render(el);
    $(".ig-scroll", el).scrollTop = top;
    if (s.liked) pop(el, i);
    const b = $(`[data-like-btn="${i}"]`, el);
    if (b && !fromMedia) b.focus({ preventScroll: true });
  }
  function pop(el, i) {
    if (FF.reducedMotion()) return;
    const m = $(`.ig-media[data-like="${i}"] .pop`, el);
    if (!m) return;
    m.classList.remove("show");
    void m.offsetWidth;
    m.classList.add("show");
  }

  FF.apps = FF.apps || {};
  FF.apps.instagram = () => {
    if (!state) init();
    wm.open({
      id: "instagram", title: "Instagram.exe - Internet Explorer", icon: "i-ie", width: 400, height: 640, minWidth: 280, minHeight: 300,
      body: `<div class="ig">
        <div class="menubar" aria-hidden="true"><button tabindex="-1"><u>F</u>ile</button><button tabindex="-1"><u>E</u>dit</button><button tabindex="-1"><u>V</u>iew</button><button tabindex="-1"><u>O</u>ptions</button><button tabindex="-1"><u>H</u>elp</button></div>
        <div class="ig-fixed"></div>
        <div class="ig-scroll" tabindex="-1"></div>
        <div class="ig-nav" role="toolbar" aria-label="Instagram"></div>
      </div>`,
      onInit({ el }) {
        render(el);
        let lastTap = 0;
        el.addEventListener("click", e => {
          const t = e.target.closest("button, .ig-media");
          if (!t) return;
          const sc = $(".ig-scroll", el);
          if (t.dataset.open != null) { state.view = "post"; state.post = +t.dataset.open; render(el); sc.scrollTop = 0; $("[data-back]", el).focus(); }
          else if (t.dataset.back != null) { state.view = "profile"; render(el); const tile = $(`[data-open="${state.post}"]`, el); if (tile) { tile.scrollIntoView({ block: "nearest" }); tile.focus(); } }
          else if (t.dataset.tab) { state.tab = t.dataset.tab; render(el); $(`[data-tab="${state.tab}"]`, el).focus(); }
          else if (t.dataset.follow != null) { state.following = !state.following; render(el); $("[data-follow]", el).focus(); }
          else if (t.dataset.more != null) disk2();
          else if (t.dataset.likeBtn != null) like(el, +t.dataset.likeBtn, false);
          else if (t.dataset.nav) {
            const n = t.dataset.nav;
            if (n === "home" || n === "profile") { state.view = "profile"; state.tab = n === "home" ? "list" : "grid"; render(el); sc.scrollTop = 0; $(`[data-nav="${n}"]`, el).focus(); }
            else disk2();
          } else if (t.classList.contains("ig-media")) {
            // double-click / double-tap the picture to like it
            const now = Date.now();
            if (now - lastTap < 350) { like(el, +t.dataset.like, true); lastTap = 0; } else lastTap = now;
          }
        });
        el.addEventListener("submit", e => {
          e.preventDefault();
          const input = $(".ig-comment input", el);
          const v = input && input.value.trim();
          if (!v) return;
          state.posts[state.post].comments.push([FF.owner() || "guest", v]);
          render(el);
          const sc = $(".ig-scroll", el);
          sc.scrollTop = sc.scrollHeight;
          $(".ig-comment input", el).focus();
        });
      }
    });
  };
})();
