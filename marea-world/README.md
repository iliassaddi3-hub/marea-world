# MAREA WORLD — YVZID

A cinematic album site in three chapters: **I · Before Marea** (5 tracks, incl. the MERRA FL3AM player with synced lyrics), **II · Marea** (the 14-track album), **III · The people behind MAREA**.
Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.

## Run it locally

From this folder:

```
python3 -m http.server 8000
```

Open http://localhost:8000. On Windows, use `py -m http.server 8000`.

Use a local server rather than double-clicking `index.html`: YouTube refuses to play embedded videos on pages opened as files.

## Structure

```
index.html            page structure
css/style.css         design, layout, animations
js/data.js            ALL editable content: tracks, lyrics, credits, settings
js/app.js             interactions: sea, intro, player, lyrics, sheets, navigation
assets/images/        images
yvzid.html            redirect, so old links to yvzid.html still work
_backup/              your original file and the previous single-file version (not used by the site)
```

## Editing content: js/data.js only

- **Before Marea (5 tracks):** each has `youtube` (full URL, used exactly as written). Clicking a card opens a panel with the embedded video and a "Watch on YouTube" link. Add `artwork`, `releaseDate`, `duration`, `description`, `producedBy`, `writtenBy`, `listen` when you have them. Clicking a card that has `lyrics` loads that track straight into the player section (video, cover and synced lyrics); **Track details** there opens its info panel. Cards without lyrics open their video panel. Lyrics are `["mm:ss.mmm", "mm:ss.mmm", "line"]` (start, end, text); a line goes dark at its end time. MERRA FL3AM (`lead: true`) is the track the player opens with; its lyrics use `[seconds, "line"]` (start only).
- **MAREA album (14 slots):** each slot shows as TRACK 01 … TRACK 14 until you fill it. Add `title`, `youtube`, `artwork`, `subtitle`, `duration`. A slot with a `youtube` link gets a play button and its own video panel automatically. `mood` only changes the look of the sea.
- **Credits:** add people inside `people: []` of their role; a template is in the file's comments. Only `name` is required.
- **Settings:** `releaseDate` (countdown), `notifyEndpoint` (email form), `showPlaceholders`.

While `showPlaceholders` is `true`, every missing field shows a dashed “Add …” marker. **Set it to `false` before publishing**: missing fields and empty credit roles are then hidden; empty album slots still show as TRACK 01 … TRACK 14.

## Asset renames (contents unchanged)

| Was | Now |
|---|---|
| `WhatsApp Image 2026-05-15 at 18.28.10.jpeg` | `assets/images/marea-cover.jpg` (+ `marea-cover-600.webp`, a lighter copy for the sleeve) |
| `channels4_profile (1).jpg` | `assets/images/yvzid-portrait.jpg` (+ `yvzid-portrait.webp`, 53% smaller) |
| `https___images_genius_com_…_640x640x1.jpg` | `assets/images/still-mirrorball.jpg` |
| `marea-emblem.webp` | `assets/images/marea-emblem.webp` |

## If lyrics or covers don't show

- **Start the site with the local server** (`python3 -m http.server 8000`, then http://localhost:8000). Opened by double-click, YouTube won't play, so lyrics can't sync. The page shows a warning when this happens.
- **Replace all of `index.html`, `css/style.css`, `js/app.js`, `js/data.js` together.** An old `app.js` with a new `data.js` shows timestamps instead of lyrics.
- **Covers:** the path in `js/data.js` must match the file in `assets/images/` exactly (capitals, spaces, `.jpg`/`.png`). The site also tries common slips (`.jpeg`, `.png`, a hidden doubled `.jpg.jpg`). Press F12 → Console: it tells you which cover is missing, or the real path it found so you can correct `data.js`.
- After changing files, reload with **Ctrl+Shift+R** (Mac: **Cmd+Shift+R**).
