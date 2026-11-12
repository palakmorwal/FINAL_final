# FINAL_final, Issue 02 (web edition)

A non-linear reading experience: a 1998 desktop where you browse how issue 01 of FINAL_final was made. Plain HTML, CSS and JavaScript. There is no build step and no libraries, and the site makes no requests to other servers.

- **Palette:** strict CMYK. Cyan `#00aeef`, magenta `#ec008c`, yellow `#fff200`, black `#000` and paper white.
- **FINAL_final folder:** the files spill across the desktop as rotated, draggable icons that glitch. Click or tap one to open it. The bar in the top-right has Up (or Desktop), the path and ×.
- **Issue 01 pages:** only a selection is included: 5 preview pages in `FINAL_final_REAL_USE_THIS.pdf` and 11 pull-quote pages. The full issue is not on this site.

## Open it
- Open `index.html`. Add `?skipboot` to skip the preloader.
- Hosting: any static host works, including GitHub Pages (Settings → Pages → Deploy from a branch → main → / (root)). The total size is about 3.4 MB.

## Change the content
Everything editable is in `content.js`: Notes, My Computer, the FINAL_final folder, the Recycle Bin and Instagram. Read the comments at the top of that file.

## Files
```
index.html            page + CMYK pixel-icon sprite
styles.css            CMYK Win95 chrome
content.js            all editable content
js/util.js, wm.js     helpers, window manager
js/desktop.js         desktop icons, Start menu, clock, preloader
js/apps/*.js          scatter (FINAL_final), explorer (Recycle Bin), viewers, computer, notepad, instagram
assets/folder/        moodboard, inspiration, index draft, InDesign export pages
assets/bin/           Recycle Bin images
assets/pages/         preview pages and pull-quote pages of issue 01
assets/thumbs/        small previews of the pull-quote pages
assets/excerpts/      square crops used in the Instagram grid
assets/images/        memes extracted from issue 01
assets/fonts/         Comic Neue (SIL OFL), the fallback for devices without Comic Sans
```
