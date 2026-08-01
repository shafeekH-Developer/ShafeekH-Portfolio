# Portfolio Update Tasks

## 1. Fix Black Project Demo Canvas
- [x] Rewrite `js/project-effects.js` to use `ctx.filter` + compositing (no `getImageData`)
  - [x] Original, Mosaic, Watercolor, Charcoal, Pencil, Oil, BG Removal, Anime effects
  - [x] Add graceful error fallback if image fails to load

## 2. Remove Profile Photo Section
- [x] Delete `.hero-image-col` block from `index.html`
- [x] Remove profile photo CSS rules from `css/style.css`
- [x] Make hero text full-width and centered

## 3. Verify Changes
- [x] Confirm project demo uses safe canvas filters (renders even via file://)
- [x] Confirm profile photo section removed from HTML & CSS

