# abhskyd.github.io

Personal portfolio of [Abhishek](https://abhskyd.github.io) — software developer.
Single-page site built with HTML, CSS, JavaScript, and Three.js.

## Stack

- Three.js — 3D background scene, loaded from CDN (no build step)
- GSAP — intro animations
- Vanilla CSS/JS — layout, reveals, modal, tilt cards

## Run

```bash
python3 -m http.server 8341
# open http://localhost:8341
```

Any static server works. There is no build step.

## Structure

```
index.html   markup for the five sections
style.css    theme, layout, animations
main.js      Three.js scene, camera path, loader, project modal
```

## Customize

- Colors and fonts — `:root` variables in `style.css`
- Skills and scene colors — `CONFIG` in `main.js`
- Content and projects — `index.html`, `PROJECTS` in `main.js`
- Camera path per section — `camKeys` in `main.js`

## Deploy

Pushes to `main` deploy automatically via GitHub Pages.
