# abhskyd.github.io

Personal portfolio of [Abhishek](https://abhskyd.github.io) — software developer.
Terminal-themed single-page site built with Next.js.

## Stack

- Next.js (App Router, static export)
- React
- Vanilla CSS — terminal theme, no UI libraries

## Run

```bash
npm install
npm run dev      # dev server at http://localhost:3000
npm run build    # static export into out/
```

## Structure

```
app/
  layout.js                 root layout, font, metadata
  page.js                   the five sections + project data
  globals.css               terminal theme
  icon.svg                  favicon (>_ glyph)
components/
  HeroTerminal.js           typing animation in the hero
  InteractiveTerminal.js    visitor-playable shell
  ScrollReveal.js           scroll reveal observer
deploy.yml                  GitHub Pages workflow (copied to .github/workflows/)
```

## Customize

- Colors — `:root` variables in `app/globals.css`
- Content — `app/page.js`
- Hero commands — `SEQUENCE` in `components/HeroTerminal.js`
- Interactive shell commands — `COMMANDS` in `components/InteractiveTerminal.js`

## Deploy

Pushes to `main` build and deploy automatically via GitHub Pages
(`.github/workflows/deploy.yml`). Deployed with `output: "export"` — no server needed.
