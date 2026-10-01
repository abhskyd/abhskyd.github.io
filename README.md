# Abhishek — 3D Portfolio

A single-page immersive 3D portfolio built with **HTML/CSS/JS + Three.js + GSAP**.
Deep navy background, cyan & purple accents, floating wireframe geometry, an orbiting
skill visualization, and a scroll-driven camera.

## ✨ Features

- **Interactive 3D hero** — floating geometric shapes that parallax to your mouse
- **Scroll-driven camera** — smooth keyframe camera path between the 5 sections
- **Skills orbit** — glowing core with two tilted rings of labeled skill sprites,
  fading in only around the Skills section
- **3D project cards** — CSS 3D tilt on hover, detail modal on click
- **Particle background** — additive-blended cyan/purple/pink field
- **Loading screen** — animated progress bar
- **Accessible** — keyboard navigation, focus styles, ESC-closable modal,
  `prefers-reduced-motion` fallback, no-WebGL fallback (CSS gradient only)
- **Responsive** — desktop, tablet, mobile (fewer particles + capped pixel ratio on mobile)

## 🚀 Setup & run

No build step needed. Because the page uses ES modules, serve it over HTTP:

```bash
cd abhishek-3d-portfolio
python3 -m http.server 8341
# open http://localhost:8341
```

or `npx serve .` — any static server works. Opening `index.html` directly via
`file://` also works in most modern browsers, but a local server is recommended.

## 🎨 Customizing

| What | Where |
|---|---|
| Colors & fonts | `:root` variables at the top of `style.css` |
| Skills list (page + 3D orbit) | `CONFIG.skills` in `main.js` |
| 3D scene colors | `CONFIG.colors` in `main.js` |
| Text content (bio, headings) | `index.html` |
| Project cards & modal details | `PROJECTS` array in `main.js` + cards in `index.html` |
| Camera path per section | `camKeys` array in `main.js` |
| Particle count / polygon detail | `buildParticles()` / `buildHeroGroup()` in `main.js` |

### Swapping shapes for real 3D models

The hero shapes are low-poly Three.js primitives. To use a GLTF model instead:

```js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const loader = new GLTFLoader();
loader.load("models/laptop.glb", (gltf) => {
  gltf.scene.position.set(-4.8, 0.5, -2);
  heroGroup.add(gltf.scene);
});
```

(Add the `three/addons/` mapping to the import map in `index.html`, and bump the
loading progress from the loader's `onProgress` callback.)

## 🆓 Free 3D assets

- [Sketchfab](https://sketchfab.com) — filter by "Downloadable" + CC license
- [Poly Pizza](https://poly.pizza) — free low-poly models, perfect for this aesthetic
- [Spline](https://spline.design) — design 3D scenes visually, export to the web
- [Kenney.nl](https://kenney.nl) — CC0 game assets and low-poly kits

## 🌐 Deploy to GitHub Pages

```bash
cd abhishek-3d-portfolio
git init && git add -A && git commit -m "3D portfolio"
gh repo create portfolio --public --source=. --push
gh api -X POST repos/abhskyd/portfolio/pages -f source='{"branch":{"name":"main","path":"/"}}'
# live at https://abhskyd.github.io/portfolio/
```

(Or create a repo named `abhskyd.github.io` to serve it at the root URL.)
