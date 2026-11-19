# Armando Albornoz — portfolio

The current website source lives at `~/portafolio_website` in WSL.
It uses an interactive Three.js terminal and five project pages. Each visit waits
for the visitor to press power or a key. The original synthesized soundtrack starts
after power-on; mute is remembered. All runtime libraries, fonts, models and reports
are served locally, with their required licenses.

## Develop and build

Run `npm run dev` and open http://localhost:5173/.
Run `npm run check` to check source syntax and publishing assets.
Run `npm run build` to create `dist/`, then `npm run preview` to inspect the build.
Stop the development server before using the preview server on the same port.
Node.js 20+ and Python 3 are sufficient; no package installation is required.

`site-files.json` lists the files included in the build. Add any new runtime assets
to that list. Local design notes, development previews and unused original assets
stay out of `dist/`. Edit the root JavaScript/CSS/HTML files and `assets/` here;
the Windows workspace is the previous working copy.

## Deployment

The origin remote is https://github.com/armandoalbornoz/portafolio.git.
The existing GitHub Pages workflow deploys `dist/` when changes reach `main`.
It reads the site's public URL from GitHub Pages to populate sharing metadata.
For a manual build, optionally set `SITE_URL=https://your-domain.example/ npm run build`.
Project routes use URL fragments and work under a GitHub Pages subdirectory.

The migrated version is on the local `terminal-portfolio` branch (or a timestamped
variant if that name already existed). No changes were pushed during migration.
The old website files and original commit/branch details were preserved outside
the repository under `~/portfolio-backups/`. Git history and the origin remote remain intact.

Before announcing the deployed site, check power-on, sound/mute, a project, a report
and Contact on a physical phone. No site is public merely because it was built locally.

The Overcooked page now contains verified final evaluation results and per-seed training plots, derived from the saved experiment CSVs. `overcooked-data.js` stores only chart data; it contains no course source code. The kitchen entrance is an illustration rather than recorded gameplay.
