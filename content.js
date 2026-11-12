/* =====================================================================
   FINAL_final, Issue 02 (v2, CMYK) — CONTENT FILE
   Edit this file to change what is on the computer. No other code needs
   to change.

   RULE: issue 01 is only ever shown as EXCERPTS. The whole pages are not
   in this folder. assets/excerpts/ holds square fragments of a few pages.

   FILE / FOLDER ITEMS (FINAL_final folder and Recycle Bin)
     Folder:       { name: "memes", items: [ ...more items... ] }
     Image:        { name: "giant_R.png", src: "assets/excerpts/p12.webp", note: "optional caption" }
     PDF excerpt:  { name: "FINAL.pdf", excerpts: [{ src: "...", page: 12 }, ...], totalPages: 77 }
     Text file:    { name: "brief.txt", text: "Opens in Notepad." }
     Placeholder:  { name: "cover_v1.indd", placeholder: true, note: "What this will be" }
   Anything marked placeholder: true shows a "PLACEHOLDER" preview.

   Paths are relative to index.html. Recommended image size: max 1000px on
   the long side, WebP or JPEG, under ~150 KB each.
   ===================================================================== */

/* --- helpers --- */
const pad = n => String(n).padStart(2, "0");
/* a square excerpt of an issue 01 page (from assets/excerpts/) */
const excerpt = (name, n) => ({ name, src: `assets/excerpts/p${pad(n)}.webp`, thumb: `assets/excerpts/p${pad(n)}.webp`, note: `Excerpt, FINAL_final.pdf page ${n}` });
/* a whole, uncropped issue 01 page (assets/pages/ + a small preview in assets/thumbs/) */
const page = (name, n) => ({ name, src: `assets/pages/p${pad(n)}.webp`, thumb: `assets/thumbs/p${pad(n)}.webp`, note: `FINAL_final.pdf page ${n}` });
/* an image that was embedded in issue 01 (extracted to assets/images/) */
const art = (name, file, n) => ({ name, src: `assets/images/${file}`, thumb: `assets/images/${file}`, note: `From FINAL_final.pdf page ${n}` });
/* a placeholder file */
const todo = (name, note) => ({ name, placeholder: true, note: note || "Not supplied yet." });

window.CONTENT = {

  /* ---------- Notes (README.txt in Notepad). Plain text. ---------- */
  notes:
`README.txt

ABOUT FINAL_final
FINAL_final is a periodical where graphic design meets comedy. It is light, relatable and made for graphic designers. Most design publications are built to teach you something. This one is meant to be savoured, not studied.

Issue 01 (FINAL_final.pdf) collected memes as a kind of shared testimony: about undervalued labour, about depending on a handful of software companies, and about creative work that is expected to be cheap, quick and endlessly revisable.

ABOUT THIS ISSUE
Issue 02 is this computer. Instead of reading a magazine, you poke around the machine where issue 01 was made: the drafts, the inspiration, the memes, the files that were thrown away. You only ever get excerpts. The finished thing stays in issue 01.

There is no order. Nothing is required reading. Open whatever looks interesting.

HOW TO NAVIGATE
- Double-click an icon to open it. On a phone or tablet, tap once.
- Keyboard: Tab to move, Enter to open, Esc to close the window on top.
- My Computer: tell the computer who it belongs to.
- FINAL_final: every iteration of issue 01. The files spill out across the desktop. Drag them around (they glitch). Tap or click one to open it. Use Up or × in the top-right bar to go back.
- Recycle Bin: ideas that did not make it.
- Internet Explorer: the magazine's Instagram. Follow, like, comment.
- Taskbar: switch between windows or minimise them.
- Start: shortcuts to everything, and Shut Down.

You can type in this file. Nothing you type is saved. Very on brand.`,

  /* ---------- My Computer ---------- */
  computer: {
    prompt: "This computer belongs to:",
    systemInfo: [
      "System: FINAL_final 98, Issue 02",
      "Memory: 64 MB of deadlines",
      "Free space: 0 KB (all FINAL_final_v7)"
    ]
  },

  /* ---------- FINAL_final folder ----------
     Opening it scatters these items across the desktop. */
  folder: {
    name: "FINAL_final",
    items: [
      /* --- from the "FINAL_final" folder you supplied --- */
      { name: "moodboard.png", src: "assets/folder/moodboard.webp", thumb: "assets/folder/moodboard.webp", note: "Moodboard" },
      { name: "inspo1.png", src: "assets/folder/inspo1.webp", thumb: "assets/folder/inspo1.webp", note: "Inspiration" },
      { name: "inspo2.png", src: "assets/folder/inspo2.webp", thumb: "assets/folder/inspo2.webp", note: "Inspiration" },
      { name: "inspo3.png", src: "assets/folder/inspo3.webp", thumb: "assets/folder/inspo3.webp", note: "Inspiration" },
      { name: "inspo4.png", src: "assets/folder/inspo4.webp", thumb: "assets/folder/inspo4.webp", note: "Inspiration" },
      { name: "index.png", src: "assets/folder/index.webp", thumb: "assets/folder/index.webp", note: "Index page draft" },
      { name: "FINAL_final.indd.pdf", pageSize: [1100, 712], note: "An earlier InDesign export of issue 01.",
        pages: Array.from({ length: 12 }, (_, i) => `assets/folder/indd_p${pad(i + 1)}.webp`) },
      { name: "memes", items: [
        art("meme_p09.jpg", "p09_1.webp", 9),
        art("meme_p19.jpg", "p19_1.webp", 19),
        art("meme_p21.jpg", "p21_1.webp", 21),
        art("meme_p23.jpg", "p23_1.webp", 23),
        art("meme_p25.jpg", "p25_1.webp", 25),
        art("meme_p27.jpg", "p27_1.webp", 27),
        art("meme_p29.jpg", "p29_1.webp", 29),
        art("meme_p31.jpg", "p31_1.webp", 31),
        art("meme_p33.jpg", "p33_1.webp", 33),
        art("meme_p35.jpg", "p35_1.webp", 35),
        art("meme_p37.jpg", "p37_1.webp", 37),
        art("meme_p39.jpg", "p39_1.webp", 39),
        art("meme_p41.jpg", "p41_1.webp", 41),
        art("meme_p43.jpg", "p43_1.webp", 43),
        art("meme_p45.jpg", "p45_1.webp", 45),
        art("meme_p47.jpg", "p47_1.webp", 47),
        art("meme_p49.jpg", "p49_1.webp", 49),
        art("meme_p51.jpg", "p51_1.webp", 51),
        art("meme_p55.jpg", "p55_1.webp", 55),
        art("meme_p61.jpg", "p61_1.webp", 61),
        art("meme_p63.jpg", "p63_1.webp", 63),
        art("meme_p65.jpg", "p65_1.webp", 65),
        art("meme_p67.jpg", "p67_1.webp", 67),
        art("meme_p69.jpg", "p69_1.webp", 69),
        art("meme_p71.jpg", "p71_1.webp", 71)
      ]},
      { name: "pull_quotes", items: [
        page("quote_p11.png", 11), page("quote_p24.png", 24), page("quote_p26.png", 26),
        page("quote_p28.png", 28), page("quote_p30.png", 30), page("quote_p36.png", 36),
        page("quote_p48.png", 48), page("quote_p50.png", 50), page("quote_p57.png", 57),
        page("quote_p72.png", 72), page("quote_p73.png", 73)
      ]},
      // The real issue, previewed: only a few whole pages at the real 324 × 648 pt proportions, never the full issue.
      { name: "FINAL_final_REAL_USE_THIS.pdf", totalPages: 77, fullPages: true, pageSize: [648, 1296], excerpts: [
        { src: "assets/pages/p01.webp", page: 1 },
        { src: "assets/pages/p02.webp", page: 2 },
        { src: "assets/pages/p12.webp", page: 12 },
        { src: "assets/pages/p24.webp", page: 24 },
        { src: "assets/pages/p35.webp", page: 35 }
      ]}
    ]
  },

  /* ---------- Recycle Bin ----------
     From the "recycle bin" folder you supplied. name = the original file name,
     file = the compressed copy in assets/bin/. */
  bin: {
    name: "Recycle Bin",
    items: [
      ["FINAL_final.jpg", "final_final.webp"],
      ["FINAL_final2.jpg", "final_final2.webp"],
      ["FINAL_final3.jpg", "final_final3.webp"],
      ["FINAL_final4.jpg", "final_final4.webp"],
      ["FINAL_final5.jpg", "final_final5.webp"],
      ["FINAL_final6.jpg", "final_final6.webp"],
      ["FINAL_final7.jpg", "final_final7.webp"],
      ["FINAL_final8.jpg", "final_final8.webp"],
      ["FINAL_final9.jpg", "final_final9.webp"],
      ["FINAL_final10.jpg", "final_final10.webp"],
      ["FINAL_final11.jpg", "final_final11.webp"],
      ["FINAL_final12.jpg", "final_final12.webp"],
      ["download.png", "download.webp"],
      ["download (1).png", "download_1.webp"],
      ["download (2).png", "download_2.webp"],
      ["download (3).png", "download_3.webp"],
      ["download (4).png", "download_4.webp"],
      ["genmoji.webp", "genmoji.webp"],
      ["timothee chalamet.jpeg", "timothee_chalamet.webp"],
      ["tumblr_3c645dd8a0ef3647d4e7cd76564b2136_3b2c927c_540.png", "tumblr_3c645dd8a0ef3647d4e7cd76564b2136_.webp"]
    ].map(([name, file]) => ({ name, src: `assets/bin/${file}`, thumb: `assets/bin/${file}`, note: "Discarded" }))
  },

  /* ---------- Instagram (Internet Explorer) ----------
     post fields: src, alt, caption, likes, when, comments [["user","text"]]
     Optional typographic tile instead of an image: text, bg, fg (use CMYK colours).
     Page posts use excerpts only. Captions are PLACEHOLDERS. */
  instagram: {
    username: "final_final.pdf",
    displayName: "FINAL_final",
    avatar: "assets/excerpts/p01.webp",
    bio: [
      "unfolding and satirically celebrating the shared grievances of graphic designers.",
      "Issue 01: out now. Issue 02: you are in it."
    ],
    followers: 1204,
    following: 69,
    posts: [
      { src: "assets/excerpts/p01.webp", alt: "Excerpt of the cover: a grid of file icons", caption: "Cover, excerpt.", likes: 212, when: "OCTOBER 2026", comments: [] },
      { src: "assets/excerpts/p12.webp", alt: "Excerpt of a giant magenta R", caption: "R. Page 12, excerpt.", likes: 148, when: "OCTOBER 2026", comments: [] },
      { src: "assets/images/p35_1.webp", alt: "Meme from page 35", caption: "Page 35.", likes: 391, when: "OCTOBER 2026", comments: [] },
      { src: "assets/excerpts/p24.webp", alt: "Excerpt of a pull quote in magenta and yellow", caption: "Pull quote, page 24, excerpt.", likes: 97, when: "OCTOBER 2026", comments: [] },
      { src: "assets/images/p33_1.webp", alt: "Meme from page 33", caption: "Page 33.", likes: 455, when: "OCTOBER 2026", comments: [] },
      { src: "assets/excerpts/p58.webp", alt: "Excerpt of a giant cyan and yellow B", caption: "B. Page 58, excerpt.", likes: 133, when: "OCTOBER 2026", comments: [] },
      { src: "assets/images/p55_1.webp", alt: "Poster from page 55", caption: "Page 55.", likes: 276, when: "OCTOBER 2026", comments: [] },
      { src: "assets/images/p51_1.webp", alt: "Image from page 51", caption: "Page 51.", likes: 302, when: "OCTOBER 2026", comments: [] },
      { src: "assets/excerpts/p72.webp", alt: "Excerpt of a pull quote in cyan", caption: "Pull quote, page 72, excerpt.", likes: 88, when: "OCTOBER 2026", comments: [] },
      { src: "assets/images/p65_1.webp", alt: "Meme from page 65", caption: "Page 65.", likes: 512, when: "OCTOBER 2026", comments: [] },
      { src: "assets/excerpts/p14.webp", alt: "Excerpt of a giant outlined D", caption: "D. Page 14, excerpt.", likes: 121, when: "OCTOBER 2026", comments: [] },
      { src: "assets/images/p67_1.webp", alt: "Image from page 67", caption: "Page 67.", likes: 344, when: "OCTOBER 2026", comments: [] }
    ]
  }
};
