# Portfolio Website

Modularised version of the three standalone HTML experiences (`portfolio.html`, `delaunay-research-final-with-pdf.html`, `rain-prediction-demo.html`). All shared styles and behaviours now live in a central `assets` directory so each page only contains semantic markup.

## Structure

- `assets/css/base.css` – global reset, color variables, shared cursor styling.
- `assets/css/portfolio.css` – layout and effects for the main portfolio page.
- `assets/css/delaunay.css` – research page styling, including glassmorphism panels.
- `assets/css/rain.css` – ML demo styling and background effects.
- `assets/js/base.js` – shared cursor behaviour.
- `assets/js/portfolio.js` – Three.js hero scene, scroll animations, modal logic.
- `assets/js/delaunay.js` – Three.js starfield plus interactive D3 triangulation controls.
- `assets/js/rain.js` – Animated rain scene and iframe loading fallbacks.

## Usage

Open any of the HTML files directly in a browser. All assets are referenced with relative paths, so no build step is required.

- `portfolio.html` – landing page with project cards linking to the detail pages.
- `delaunay-research-final-with-pdf.html` – interactive Delaunay study with PDF embed.
- `rain-prediction-demo.html` – machine learning pipeline demo view.

## Extending

- Add new shared styles to `assets/css/base.css` or create a dedicated page stylesheet under `assets/css`.
- Shared behaviours belong in `assets/js/base.js`; keep page-specific logic isolated in matching page scripts.
- Avoid inline event handlers—use `data-` attributes and bind listeners in the relevant script.
