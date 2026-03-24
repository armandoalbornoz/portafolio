# Portfolio Website

Multi-page Vite portfolio site with three root HTML entry points and shared CSS/JS in `assets/`.

## Structure

- `index.html` - main landing page / portfolio entry.
- `delaunay-research-final-with-pdf.html` - interactive research page.
- `rain-prediction-demo.html` - machine learning demo page.
- `assets/css/base.css` – global reset, color variables, shared cursor styling.
- `assets/css/portfolio.css` – layout and effects for the main portfolio page.
- `assets/css/delaunay.css` – research page styling, including glassmorphism panels.
- `assets/css/rain.css` – ML demo styling and background effects.
- `assets/js/base.js` – shared cursor behaviour.
- `assets/js/portfolio.js` – Three.js hero scene, scroll animations, modal logic.
- `assets/js/delaunay.js` – Three.js starfield plus interactive D3 triangulation controls.
- `assets/js/rain.js` – Animated rain scene and iframe loading fallbacks.
- `docs/` - source PDFs used by the HTML pages when opened directly.
- `public/docs/` - deploy copies synced from `docs/` before dev/build.

## Usage

Install dependencies, then use Vite for local development and production builds.

```bash
npm install
npm run dev
```

Additional scripts:

- `npm run build` - syncs `docs/` into `public/docs/` and builds `dist/`.
- `npm run preview` - serves the production build locally.
- `npm run lint` - runs ESLint on the shared JavaScript assets.

## Editing Content

- Update portfolio copy, links, project text, and page text in `assets/content/site-content.json`.
- Replace files like the resume or PDFs in `docs/`.
- Run `npm run dev` for local preview or `npm run build` to regenerate the production output.

This setup is private and repo-controlled: there is no public admin panel or in-browser editor.

## Extending

- Add new shared styles to `assets/css/base.css` or create a dedicated page stylesheet under `assets/css`.
- Shared behaviours belong in `assets/js/base.js`; keep page-specific logic isolated in matching page scripts.
- Avoid inline event handlers—use `data-` attributes and bind listeners in the relevant script.
