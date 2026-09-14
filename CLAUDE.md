# Ether Gazette

Static weekly newsletter, deployed to GitHub Pages from `main` via `.github/workflows/deploy-pages.yml` (triggers on push to `main`).

## Weekly publishing sessions

The scheduled weekly-publish session is restricted to pushing only to its own `claude/*` branch, never directly to `main`, so it opens a pull request instead. `.github/workflows/auto-merge-gazette.yml` merges that PR automatically as long as it only touches the known content files (`issue-YYYY-MM-DD.html`, `index.html`, `issues.json`, `search-index.json`). This is expected behavior, not an error — no manual merge should be needed. A PR that touches anything else (`style.css`, `app.js`, `favicon.svg`, workflow files) is intentionally left for manual review.
